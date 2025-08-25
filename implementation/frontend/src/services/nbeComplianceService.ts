/**
 * National Bank of Ethiopia (NBE) Banking Compliance Service
 * Complete banking and foreign exchange compliance framework
 * Supports forex controls, AML/CFT, payment system compliance, and NBE reporting
 */

export interface ForexPermitInfo {
  permitNumber: string;
  permitType: 'import' | 'export' | 'service' | 'investment' | 'travel';
  validFrom: Date;
  validUntil: Date;
  authorizedAmount: number;
  currency: string;
  purpose: string;
  status: 'active' | 'expired' | 'suspended' | 'utilized';
  utilizationAmount: number;
  remainingAmount: number;
  conditions: string[];
}

export interface ExchangeRateInfo {
  currency: string;
  buyingRate: number;
  sellingRate: number;
  averageRate: number;
  rateDate: Date;
  source: 'nbe_official' | 'commercial_bank' | 'parallel_market';
  isOfficial: boolean;
  spread: number;
}

export interface AMLScreeningResult {
  entityId: string;
  entityName: string;
  entityType: 'individual' | 'business' | 'government';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  screeningDate: Date;
  watchlistMatches: WatchlistMatch[];
  sanctionsStatus: 'clear' | 'potential_match' | 'confirmed_match';
  pepStatus: boolean; // Politically Exposed Person
  adverseMediaHits: number;
  recommendations: string[];
  requiresManualReview: boolean;
}

export interface WatchlistMatch {
  listName: string;
  matchScore: number;
  entityName: string;
  aliases: string[];
  riskCategory: string;
  lastUpdated: Date;
}

export interface SuspiciousTransactionReport {
  reportId: string;
  reportDate: Date;
  transactionDate: Date;
  amount: number;
  currency: string;
  suspiciousActivities: string[];
  involvedParties: {
    sender: PartyInfo;
    receiver: PartyInfo;
  };
  description: string;
  followUpRequired: boolean;
  status: 'draft' | 'submitted' | 'under_review' | 'closed';
  reportedBy: string;
}

export interface PartyInfo {
  name: string;
  tin?: string;
  passportNumber?: string;
  address: string;
  phone?: string;
  relationship: 'customer' | 'beneficiary' | 'third_party';
  riskProfile: 'low' | 'medium' | 'high';
}

export interface PaymentValidationResult {
  isValid: boolean;
  validationErrors: string[];
  forexCompliance: boolean;
  amlCompliance: boolean;
  sanctionsCheck: boolean;
  requiredDocuments: string[];
  estimatedProcessingTime: number; // in business days
  additionalRequirements: string[];
}

export interface NBEReportingRequirement {
  reportType: 'large_transaction' | 'foreign_exchange' | 'cash_transaction' | 'suspicious_activity';
  threshold: number;
  currency: string;
  reportingDeadline: number; // days after transaction
  requiredFields: string[];
  recipientAuthority: string;
  penaltyForNonCompliance: string;
}

export interface CurrencyDeclaration {
  declarationId: string;
  declarationType: 'import' | 'export';
  amount: number;
  currency: string;
  purpose: string;
  declarationDate: Date;
  validityPeriod: number; // days
  supportingDocuments: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvalNumber?: string;
}

export interface BankingComplianceAlert {
  id: string;
  type: 'forex_violation' | 'aml_alert' | 'reporting_deadline' | 'license_renewal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  triggeredBy: string;
  triggerDate: Date;
  dueDate?: Date;
  requiredActions: string[];
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
}

class NBEBankingComplianceService {
  // NBE exchange rate API endpoint (mock for demo)
  private readonly NBE_API_ENDPOINT = 'https://api.nbe.gov.et/v1';
  
  // AML/CFT thresholds
  private readonly LARGE_TRANSACTION_THRESHOLD = 200000; // ETB 200K
  private readonly CASH_TRANSACTION_THRESHOLD = 15000; // ETB 15K
  private readonly FOREIGN_CURRENCY_THRESHOLD = 10000; // USD 10K equivalent

  // Forex permit types and limits
  private readonly FOREX_LIMITS = new Map([
    ['travel_individual', { limit: 5000, currency: 'USD', validity: 90 }],
    ['travel_business', { limit: 25000, currency: 'USD', validity: 180 }],
    ['import_goods', { limit: 100000, currency: 'USD', validity: 365 }],
    ['export_proceeds', { limit: 50000, currency: 'USD', validity: 180 }],
    ['service_payment', { limit: 15000, currency: 'USD', validity: 90 }],
    ['medical_treatment', { limit: 100000, currency: 'USD', validity: 365 }],
    ['education', { limit: 50000, currency: 'USD', validity: 365 }]
  ]);

  /**
   * Get current NBE official exchange rates
   */
  async getCurrentExchangeRates(): Promise<ExchangeRateInfo[]> {
    try {
      // In production, this would call the actual NBE API
      // For demo, returning mock data with realistic rates
      const mockRates: ExchangeRateInfo[] = [
        {
          currency: 'USD',
          buyingRate: 55.50,
          sellingRate: 56.25,
          averageRate: 55.875,
          rateDate: new Date(),
          source: 'nbe_official',
          isOfficial: true,
          spread: 0.75
        },
        {
          currency: 'EUR',
          buyingRate: 59.80,
          sellingRate: 60.60,
          averageRate: 60.20,
          rateDate: new Date(),
          source: 'nbe_official',
          isOfficial: true,
          spread: 0.80
        },
        {
          currency: 'GBP',
          buyingRate: 68.90,
          sellingRate: 69.80,
          averageRate: 69.35,
          rateDate: new Date(),
          source: 'nbe_official',
          isOfficial: true,
          spread: 0.90
        }
      ];

      return mockRates;
    } catch (error) {
      console.error('Failed to fetch NBE exchange rates:', error);
      throw new Error('Unable to retrieve current exchange rates');
    }
  }

  /**
   * Convert currency using NBE official rates
   */
  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<{
    originalAmount: number;
    originalCurrency: string;
    convertedAmount: number;
    convertedCurrency: string;
    exchangeRate: number;
    rateDate: Date;
    isOfficialRate: boolean;
  }> {
    if (fromCurrency === toCurrency) {
      return {
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedAmount: amount,
        convertedCurrency: toCurrency,
        exchangeRate: 1.0,
        rateDate: new Date(),
        isOfficialRate: true
      };
    }

    const rates = await this.getCurrentExchangeRates();
    
    // Convert to ETB first if needed
    let etbAmount = amount;
    let rate = 1.0;

    if (fromCurrency !== 'ETB') {
      const fromRate = rates.find(r => r.currency === fromCurrency);
      if (!fromRate) {
        throw new Error(`Exchange rate not found for ${fromCurrency}`);
      }
      etbAmount = amount * fromRate.buyingRate;
      rate = fromRate.buyingRate;
    }

    // Convert from ETB to target currency
    if (toCurrency !== 'ETB') {
      const toRate = rates.find(r => r.currency === toCurrency);
      if (!toRate) {
        throw new Error(`Exchange rate not found for ${toCurrency}`);
      }
      const convertedAmount = etbAmount / toRate.sellingRate;
      const finalRate = fromCurrency === 'ETB' ? toRate.sellingRate : rate / toRate.sellingRate;
      
      return {
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedAmount: Math.round(convertedAmount * 100) / 100,
        convertedCurrency: toCurrency,
        exchangeRate: finalRate,
        rateDate: new Date(),
        isOfficialRate: true
      };
    }

    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      convertedAmount: Math.round(etbAmount * 100) / 100,
      convertedCurrency: 'ETB',
      exchangeRate: rate,
      rateDate: new Date(),
      isOfficialRate: true
    };
  }

  /**
   * Screen entity against AML/CFT watchlists
   */
  async screenEntityAML(entityName: string, entityType: 'individual' | 'business'): Promise<AMLScreeningResult> {
    // Mock AML screening - in production would connect to actual watchlist databases
    const suspiciousKeywords = ['terror', 'fraud', 'money laundering', 'sanctions', 'criminal'];
    const riskKeywords = ['cash', 'multiple', 'shell', 'offshore'];
    
    const nameWords = entityName.toLowerCase().split(' ');
    const suspiciousMatches = nameWords.filter(word => 
      suspiciousKeywords.some(keyword => word.includes(keyword))
    );
    const riskMatches = nameWords.filter(word =>
      riskKeywords.some(keyword => word.includes(keyword))
    );

    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    const watchlistMatches: WatchlistMatch[] = [];
    let sanctionsStatus: 'clear' | 'potential_match' | 'confirmed_match' = 'clear';
    let pepStatus = false;
    let adverseMediaHits = 0;

    if (suspiciousMatches.length > 0) {
      riskLevel = 'critical';
      sanctionsStatus = 'potential_match';
      watchlistMatches.push({
        listName: 'OFAC Sanctions List',
        matchScore: 0.85,
        entityName: entityName,
        aliases: [],
        riskCategory: 'Sanctions',
        lastUpdated: new Date()
      });
    } else if (riskMatches.length > 1) {
      riskLevel = 'high';
      adverseMediaHits = Math.floor(Math.random() * 5) + 3;
    } else if (riskMatches.length > 0) {
      riskLevel = 'medium';
      adverseMediaHits = Math.floor(Math.random() * 3) + 1;
    }

    // Check for PEP status (simplified)
    const pepKeywords = ['minister', 'director', 'president', 'chairman', 'ceo'];
    pepStatus = nameWords.some(word => pepKeywords.includes(word));
    if (pepStatus && riskLevel === 'low') {
      riskLevel = 'medium';
    }

    const recommendations: string[] = [];
    let requiresManualReview = false;

    if (riskLevel === 'critical') {
      recommendations.push('Reject transaction immediately');
      recommendations.push('File suspicious activity report');
      requiresManualReview = true;
    } else if (riskLevel === 'high') {
      recommendations.push('Enhanced due diligence required');
      recommendations.push('Senior management approval needed');
      requiresManualReview = true;
    } else if (riskLevel === 'medium') {
      recommendations.push('Additional documentation required');
      recommendations.push('Customer due diligence review');
    }

    return {
      entityId: `aml_${Date.now()}`,
      entityName,
      entityType,
      riskLevel,
      screeningDate: new Date(),
      watchlistMatches,
      sanctionsStatus,
      pepStatus,
      adverseMediaHits,
      recommendations,
      requiresManualReview
    };
  }

  /**
   * Validate payment against NBE regulations
   */
  async validatePayment(
    amount: number,
    currency: string,
    paymentType: 'import' | 'export' | 'service' | 'investment',
    senderInfo: PartyInfo,
    receiverInfo: PartyInfo
  ): Promise<PaymentValidationResult> {
    const validationErrors: string[] = [];
    let forexCompliance = true;
    let amlCompliance = true;
    let sanctionsCheck = true;

    // Convert to USD equivalent for threshold checks
    const usdEquivalent = currency === 'USD' ? amount : 
      currency === 'ETB' ? amount / 55.875 : amount; // Simplified conversion

    // Check forex limits
    if (usdEquivalent > this.FOREIGN_CURRENCY_THRESHOLD) {
      const permitInfo = await this.checkForexPermit(amount, currency, paymentType);
      if (!permitInfo) {
        forexCompliance = false;
        validationErrors.push('Forex permit required for amounts over USD 10,000');
      }
    }

    // AML screening
    const senderScreening = await this.screenEntityAML(senderInfo.name, 'individual');
    const receiverScreening = await this.screenEntityAML(receiverInfo.name, 'individual');

    if (senderScreening.riskLevel === 'critical' || receiverScreening.riskLevel === 'critical') {
      amlCompliance = false;
      sanctionsCheck = false;
      validationErrors.push('Transaction blocked due to AML/sanctions concerns');
    }

    // Large transaction reporting requirement
    const etbEquivalent = currency === 'ETB' ? amount : amount * 55.875;
    if (etbEquivalent > this.LARGE_TRANSACTION_THRESHOLD) {
      validationErrors.push('Large transaction reporting required to NBE');
    }

    // Required documents
    const requiredDocuments: string[] = ['Valid ID'];
    if (!forexCompliance) {
      requiredDocuments.push('Forex permit', 'Commercial invoice', 'Import/export license');
    }
    if (usdEquivalent > 5000) {
      requiredDocuments.push('Source of funds declaration');
    }

    // Additional requirements
    const additionalRequirements: string[] = [];
    if (senderScreening.requiresManualReview || receiverScreening.requiresManualReview) {
      additionalRequirements.push('Manual AML review required');
    }
    if (paymentType === 'investment') {
      additionalRequirements.push('Investment permit verification');
    }

    // Processing time estimation
    let estimatedProcessingTime = 1; // business days
    if (!forexCompliance) estimatedProcessingTime += 3;
    if (additionalRequirements.length > 0) estimatedProcessingTime += 2;

    return {
      isValid: validationErrors.length === 0,
      validationErrors,
      forexCompliance,
      amlCompliance,
      sanctionsCheck,
      requiredDocuments,
      estimatedProcessingTime,
      additionalRequirements
    };
  }

  /**
   * Check if valid forex permit exists
   */
  private async checkForexPermit(amount: number, currency: string, purpose: string): Promise<ForexPermitInfo | null> {
    // Mock forex permit check - in production would connect to NBE permit database
    // For demo, assume no permit exists for large amounts
    if (amount > 50000) {
      return null;
    }

    // Mock valid permit for smaller amounts
    return {
      permitNumber: `FX${Date.now()}`,
      permitType: purpose as 'import' | 'export' | 'service',
      validFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      validUntil: new Date(Date.now() + 330 * 24 * 60 * 60 * 1000),
      authorizedAmount: amount * 2, // Allow some buffer
      currency,
      purpose,
      status: 'active',
      utilizationAmount: 0,
      remainingAmount: amount * 2,
      conditions: ['Valid commercial invoice required', 'Report utilization within 30 days']
    };
  }

  /**
   * Generate suspicious transaction report
   */
  generateSuspiciousTransactionReport(
    transactionAmount: number,
    currency: string,
    senderInfo: PartyInfo,
    receiverInfo: PartyInfo,
    suspiciousActivities: string[],
    description: string
  ): SuspiciousTransactionReport {
    return {
      reportId: `STR${Date.now()}`,
      reportDate: new Date(),
      transactionDate: new Date(),
      amount: transactionAmount,
      currency,
      suspiciousActivities,
      involvedParties: {
        sender: senderInfo,
        receiver: receiverInfo
      },
      description,
      followUpRequired: suspiciousActivities.length > 1,
      status: 'draft',
      reportedBy: 'System Generated'
    };
  }

  /**
   * Check compliance alerts
   */
  checkBankingCompliance(businessInfo: any): BankingComplianceAlert[] {
    const alerts: BankingComplianceAlert[] = [];

    // Check for high-risk transactions
    if (businessInfo.foreignTransactionVolume > 100000) {
      alerts.push({
        id: 'high-forex-volume',
        type: 'forex_violation',
        severity: 'medium',
        title: 'High Foreign Exchange Volume',
        description: 'Monthly foreign exchange transactions exceed monitoring threshold',
        triggeredBy: 'Automated Monitoring',
        triggerDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        requiredActions: ['Submit forex utilization report', 'Provide supporting documentation'],
        status: 'open'
      });
    }

    // Check for missing AML documentation
    if (!businessInfo.amlPolicyUpdated) {
      alerts.push({
        id: 'aml-policy-outdated',
        type: 'aml_alert',
        severity: 'high',
        title: 'AML Policy Update Required',
        description: 'Anti-money laundering policy requires annual update',
        triggeredBy: 'Compliance Calendar',
        triggerDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        requiredActions: ['Update AML policy', 'Conduct staff training', 'File compliance certificate'],
        status: 'open'
      });
    }

    return alerts;
  }

  /**
   * Generate NBE compliance report
   */
  generateNBEComplianceReport(businessData: any): {
    summary: string;
    forexCompliance: boolean;
    amlCompliance: boolean;
    reportingCompliance: boolean;
    riskRating: 'low' | 'medium' | 'high';
    recommendations: string[];
    nextAuditDate: Date;
  } {
    const recommendations: string[] = [];
    
    // Forex compliance assessment
    const forexCompliance = businessData.hasValidForexPermits && 
      businessData.foreignTransactionVolume <= businessData.forexLimit;
    
    if (!forexCompliance) {
      recommendations.push('Obtain necessary forex permits');
      recommendations.push('Monitor foreign exchange transaction limits');
    }

    // AML compliance assessment
    const amlCompliance = businessData.amlPolicyUpdated && 
      businessData.customerDueDiligenceComplete && 
      businessData.suspiciousTransactionReporting;

    if (!amlCompliance) {
      recommendations.push('Update AML/CFT policies and procedures');
      recommendations.push('Complete customer due diligence reviews');
    }

    // Reporting compliance
    const reportingCompliance = businessData.largeTransactionReporting && 
      businessData.cashTransactionReporting;

    if (!reportingCompliance) {
      recommendations.push('Implement automated reporting for large transactions');
    }

    // Risk rating calculation
    let riskRating: 'low' | 'medium' | 'high' = 'low';
    if (!forexCompliance || !amlCompliance) {
      riskRating = 'high';
    } else if (!reportingCompliance) {
      riskRating = 'medium';
    }

    const summary = `NBE Compliance Status: ${forexCompliance && amlCompliance && reportingCompliance ? 'Compliant' : 'Non-Compliant'}`;
    
    // Next audit date (typically annual)
    const nextAuditDate = new Date();
    nextAuditDate.setFullYear(nextAuditDate.getFullYear() + 1);

    return {
      summary,
      forexCompliance,
      amlCompliance,
      reportingCompliance,
      riskRating,
      recommendations,
      nextAuditDate
    };
  }

  /**
   * Get reporting requirements for transaction
   */
  getReportingRequirements(amount: number, currency: string, transactionType: string): NBEReportingRequirement[] {
    const requirements: NBEReportingRequirement[] = [];
    
    const etbEquivalent = currency === 'ETB' ? amount : amount * 55.875;

    // Large transaction reporting
    if (etbEquivalent >= this.LARGE_TRANSACTION_THRESHOLD) {
      requirements.push({
        reportType: 'large_transaction',
        threshold: this.LARGE_TRANSACTION_THRESHOLD,
        currency: 'ETB',
        reportingDeadline: 15,
        requiredFields: ['transaction_id', 'amount', 'parties', 'purpose'],
        recipientAuthority: 'National Bank of Ethiopia',
        penaltyForNonCompliance: 'Fine up to ETB 100,000'
      });
    }

    // Cash transaction reporting
    if (etbEquivalent >= this.CASH_TRANSACTION_THRESHOLD && transactionType === 'cash') {
      requirements.push({
        reportType: 'cash_transaction',
        threshold: this.CASH_TRANSACTION_THRESHOLD,
        currency: 'ETB',
        reportingDeadline: 3,
        requiredFields: ['transaction_date', 'amount', 'customer_id', 'source_of_cash'],
        recipientAuthority: 'Financial Intelligence Center',
        penaltyForNonCompliance: 'Fine up to ETB 50,000'
      });
    }

    // Foreign exchange reporting
    if (currency !== 'ETB' && amount >= 1000) {
      requirements.push({
        reportType: 'foreign_exchange',
        threshold: 1000,
        currency: currency,
        reportingDeadline: 30,
        requiredFields: ['forex_permit', 'exchange_rate_used', 'purpose', 'supporting_documents'],
        recipientAuthority: 'National Bank of Ethiopia - Forex Department',
        penaltyForNonCompliance: 'Forex permit suspension'
      });
    }

    return requirements;
  }
}

// Export singleton instance
export const nbeComplianceService = new NBEBankingComplianceService();

// Export utility functions
export const getCurrentETBRates = async (): Promise<ExchangeRateInfo[]> => {
  return nbeComplianceService.getCurrentExchangeRates();
};

export const convertToETB = async (amount: number, fromCurrency: string) => {
  return nbeComplianceService.convertCurrency(amount, fromCurrency, 'ETB');
};

export const convertFromETB = async (amount: number, toCurrency: string) => {
  return nbeComplianceService.convertCurrency(amount, 'ETB', toCurrency);
};

export const screenForAML = async (entityName: string, entityType: 'individual' | 'business') => {
  return nbeComplianceService.screenEntityAML(entityName, entityType);
};

export const validateNBEPayment = async (
  amount: number,
  currency: string,
  paymentType: 'import' | 'export' | 'service' | 'investment',
  senderInfo: PartyInfo,
  receiverInfo: PartyInfo
) => {
  return nbeComplianceService.validatePayment(amount, currency, paymentType, senderInfo, receiverInfo);
};

export default nbeComplianceService;
