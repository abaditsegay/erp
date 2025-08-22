// Ethiopian Banking and Financial Compliance Service
// National Bank of Ethiopia (NBE) compliance framework

export interface BankingRegulation {
  id: string;
  title: string;
  category: 'foreign_exchange' | 'lending' | 'deposit' | 'capital' | 'reporting';
  effectiveDate: Date;
  description: string;
  requirements: string[];
  penalties: string[];
  complianceChecks: ComplianceCheck[];
}

export interface ComplianceCheck {
  id: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  automated: boolean;
  requiredDocuments: string[];
  threshold?: number;
}

export interface ForeignExchangeTransaction {
  id: string;
  date: Date;
  type: 'import' | 'export' | 'service' | 'transfer';
  amount: number;
  currency: string;
  exchangeRate: number;
  etbAmount: number;
  purpose: string;
  beneficiary: string;
  bank: string;
  permitNumber?: string;
  declarationNumber?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  documents: FXDocument[];
}

export interface FXDocument {
  type: string;
  number: string;
  issueDate: Date;
  expiryDate?: Date;
  issuingAuthority: string;
  status: 'valid' | 'expired' | 'cancelled';
}

export interface CreditReport {
  borrowerId: string;
  borrowerName: string;
  tin: string;
  loanAmount: number;
  purpose: string;
  collateral: CollateralInfo[];
  creditRating: 'A' | 'B' | 'C' | 'D' | 'E';
  riskCategory: 'low' | 'medium' | 'high';
  reportingDate: Date;
  bankCode: string;
}

export interface CollateralInfo {
  type: 'real_estate' | 'vehicle' | 'machinery' | 'inventory' | 'cash' | 'guarantee';
  description: string;
  value: number;
  location?: string;
  registrationNumber?: string;
  evaluationDate: Date;
  evaluator: string;
}

export interface NBEReport {
  reportType: string;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  submissionDeadline: Date;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  data: any;
  validationErrors: string[];
}

export interface AntiMoneyLaunderingCheck {
  transactionId: string;
  customerType: 'individual' | 'business' | 'government';
  riskLevel: 'low' | 'medium' | 'high';
  flags: AMLFlag[];
  verificationStatus: 'pending' | 'verified' | 'suspicious' | 'reported';
  reportedToFIC: boolean;
  reportDate?: Date;
}

export interface AMLFlag {
  type: 'amount_threshold' | 'pattern_suspicious' | 'customer_risk' | 'geographical_risk';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoDetected: boolean;
}

class EthiopianBankingComplianceService {
  private readonly NBE_REGULATIONS = new Map<string, BankingRegulation>([
    ['forex_allocation', {
      id: 'FXD/01/2023',
      title: 'Foreign Exchange Allocation and Utilization',
      category: 'foreign_exchange',
      effectiveDate: new Date('2023-01-01'),
      description: 'Regulations governing foreign exchange allocation for imports and services',
      requirements: [
        'Valid import permit from relevant authority',
        'Pro-forma invoice or service agreement',
        'Foreign exchange application form',
        'Bank guarantee if required'
      ],
      penalties: [
        'Suspension of foreign exchange allocation',
        'Penalty of 25% of unutilized amount',
        'Blacklisting from future allocations'
      ],
      complianceChecks: [{
        id: 'fx_utilization_check',
        description: 'Monitor foreign exchange utilization within specified timeframes',
        frequency: 'monthly',
        automated: true,
        requiredDocuments: ['utilization_reports', 'bank_statements'],
        threshold: 90 // 90% utilization required
      }]
    }],
    ['credit_reporting', {
      id: 'BSD/02/2023',
      title: 'Credit Information Reporting',
      category: 'reporting',
      effectiveDate: new Date('2023-01-01'),
      description: 'Requirements for reporting credit information to NBE',
      requirements: [
        'Monthly credit portfolio reports',
        'Non-performing loan classification',
        'Provisioning calculation',
        'Large borrower exposure reports'
      ],
      penalties: [
        'Administrative sanctions',
        'Increased supervision',
        'Restriction on new lending'
      ],
      complianceChecks: [{
        id: 'credit_classification',
        description: 'Proper classification of loans according to NBE standards',
        frequency: 'monthly',
        automated: false,
        requiredDocuments: ['loan_portfolio', 'payment_history', 'collateral_valuation']
      }]
    }],
    ['aml_cft', {
      id: 'AML/03/2023',
      title: 'Anti-Money Laundering and Combating Financing of Terrorism',
      category: 'reporting',
      effectiveDate: new Date('2023-01-01'),
      description: 'AML/CFT compliance requirements for financial institutions',
      requirements: [
        'Customer due diligence procedures',
        'Suspicious transaction reporting',
        'Record keeping requirements',
        'Staff training programs'
      ],
      penalties: [
        'Administrative fines up to ETB 5 million',
        'License suspension or revocation',
        'Criminal prosecution'
      ],
      complianceChecks: [{
        id: 'suspicious_transaction_monitoring',
        description: 'Monitor and report suspicious transactions to FIC',
        frequency: 'daily',
        automated: true,
        requiredDocuments: ['transaction_records', 'customer_profiles'],
        threshold: 200000 // ETB 200,000 threshold for reporting
      }]
    }]
  ]);

  private readonly CURRENCY_CODES = [
    'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'SAR', 'AED', 'KES', 'UGX'
  ];

  private readonly AML_THRESHOLDS = {
    cash_transaction: 200000, // ETB 200,000
    daily_cumulative: 500000, // ETB 500,000
    monthly_cumulative: 2000000, // ETB 2,000,000
    international_transfer: 50000 // ETB 50,000
  };

  /**
   * Validate foreign exchange transaction
   */
  validateFXTransaction(transaction: Partial<ForeignExchangeTransaction>): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!transaction.amount || transaction.amount <= 0) {
      errors.push('Transaction amount must be greater than zero');
    }

    if (!transaction.currency || !this.CURRENCY_CODES.includes(transaction.currency)) {
      errors.push('Valid currency code is required');
    }

    if (!transaction.purpose) {
      errors.push('Transaction purpose is required');
    }

    if (!transaction.beneficiary) {
      errors.push('Beneficiary information is required');
    }

    // Amount thresholds
    if (transaction.amount && transaction.amount > 100000) {
      warnings.push('Large transaction amount requires additional documentation');
    }

    // Purpose validation
    if (transaction.purpose && !this.isValidFXPurpose(transaction.purpose)) {
      errors.push('Invalid transaction purpose');
    }

    // Document requirements
    if (transaction.type === 'import' && transaction.amount && transaction.amount > 50000) {
      if (!transaction.permitNumber) {
        errors.push('Import permit number required for transactions above $50,000');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check if FX purpose is valid
   */
  private isValidFXPurpose(purpose: string): boolean {
    const validPurposes = [
      'import_goods', 'import_services', 'export_proceeds',
      'education', 'medical', 'business_travel', 'maintenance',
      'dividend_payment', 'loan_repayment', 'investment'
    ];
    return validPurposes.includes(purpose);
  }

  /**
   * Calculate exchange rate compliance
   */
  calculateExchangeRateCompliance(officialRate: number, transactionRate: number): { compliant: boolean; variance: number; allowedVariance: number } {
    const allowedVariance = 0.025; // 2.5% variance allowed
    const variance = Math.abs(transactionRate - officialRate) / officialRate;
    
    return {
      compliant: variance <= allowedVariance,
      variance,
      allowedVariance
    };
  }

  /**
   * Perform AML screening
   */
  performAMLScreening(transaction: any, customer: any): AntiMoneyLaunderingCheck {
    const flags: AMLFlag[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Amount threshold checks
    if (transaction.amount > this.AML_THRESHOLDS.cash_transaction) {
      flags.push({
        type: 'amount_threshold',
        description: `Transaction amount (${transaction.amount}) exceeds cash reporting threshold`,
        severity: 'medium',
        autoDetected: true
      });
      riskLevel = 'medium';
    }

    // Customer risk assessment
    if (customer.riskRating === 'high') {
      flags.push({
        type: 'customer_risk',
        description: 'Customer is classified as high risk',
        severity: 'high',
        autoDetected: true
      });
      riskLevel = 'high';
    }

    // Geographical risk
    if (this.isHighRiskCountry(transaction.originCountry || transaction.destinationCountry)) {
      flags.push({
        type: 'geographical_risk',
        description: 'Transaction involves high-risk jurisdiction',
        severity: 'high',
        autoDetected: true
      });
      riskLevel = 'high';
    }

    // Pattern analysis
    if (this.detectSuspiciousPattern(transaction, customer)) {
      flags.push({
        type: 'pattern_suspicious',
        description: 'Suspicious transaction pattern detected',
        severity: 'critical',
        autoDetected: true
      });
      riskLevel = 'high';
    }

    return {
      transactionId: transaction.id,
      customerType: customer.type,
      riskLevel,
      flags,
      verificationStatus: riskLevel === 'high' ? 'suspicious' : 'verified',
      reportedToFIC: riskLevel === 'high',
      reportDate: riskLevel === 'high' ? new Date() : undefined
    };
  }

  /**
   * Check if country is high risk
   */
  private isHighRiskCountry(country: string): boolean {
    // Simplified implementation - in reality, this would use FATF lists
    const highRiskCountries = [
      'North Korea', 'Iran', 'Myanmar', 'Afghanistan'
    ];
    return highRiskCountries.includes(country);
  }

  /**
   * Detect suspicious transaction patterns
   */
  private detectSuspiciousPattern(transaction: any, customer: any): boolean {
    // Simplified pattern detection
    // In reality, this would use ML algorithms and historical data
    
    // Check for structuring (amounts just below reporting thresholds)
    if (transaction.amount > this.AML_THRESHOLDS.cash_transaction * 0.9 && 
        transaction.amount < this.AML_THRESHOLDS.cash_transaction) {
      return true;
    }

    // Check for unusual transaction times
    const hour = new Date(transaction.timestamp).getHours();
    if (hour < 6 || hour > 22) {
      return true;
    }

    return false;
  }

  /**
   * Generate credit risk report
   */
  generateCreditRiskReport(loans: any[]): CreditReport[] {
    return loans.map(loan => ({
      borrowerId: loan.borrowerId,
      borrowerName: loan.borrowerName,
      tin: loan.tin,
      loanAmount: loan.amount,
      purpose: loan.purpose,
      collateral: loan.collateral || [],
      creditRating: this.calculateCreditRating(loan),
      riskCategory: this.determineRiskCategory(loan),
      reportingDate: new Date(),
      bankCode: loan.bankCode || 'UNK'
    }));
  }

  /**
   * Calculate credit rating
   */
  private calculateCreditRating(loan: any): 'A' | 'B' | 'C' | 'D' | 'E' {
    // Simplified rating calculation
    const score = this.calculateCreditScore(loan);
    
    if (score >= 850) return 'A';
    if (score >= 700) return 'B';
    if (score >= 600) return 'C';
    if (score >= 500) return 'D';
    return 'E';
  }

  /**
   * Calculate credit score
   */
  private calculateCreditScore(loan: any): number {
    let score = 500; // Base score

    // Payment history (35% weight)
    if (loan.paymentHistory) {
      const onTimeRatio = loan.paymentHistory.onTimePayments / loan.paymentHistory.totalPayments;
      score += onTimeRatio * 350;
    }

    // Debt-to-income ratio (30% weight)
    if (loan.debtToIncomeRatio) {
      score += (1 - Math.min(loan.debtToIncomeRatio, 1)) * 300;
    }

    // Collateral coverage (20% weight)
    if (loan.collateralValue && loan.amount) {
      const coverage = loan.collateralValue / loan.amount;
      score += Math.min(coverage, 2) * 100;
    }

    // Business experience (15% weight)
    if (loan.businessExperience) {
      score += Math.min(loan.businessExperience / 10, 1) * 150;
    }

    return Math.min(Math.max(score, 300), 900);
  }

  /**
   * Determine risk category
   */
  private determineRiskCategory(loan: any): 'low' | 'medium' | 'high' {
    const rating = this.calculateCreditRating(loan);
    
    if (['A', 'B'].includes(rating)) return 'low';
    if (rating === 'C') return 'medium';
    return 'high';
  }

  /**
   * Generate NBE compliance report
   */
  generateNBEReport(reportType: string, period: { startDate: Date; endDate: Date }, data: any): NBEReport {
    const validationErrors = this.validateReportData(reportType, data);
    
    return {
      reportType,
      reportingPeriod: period,
      submissionDeadline: this.calculateSubmissionDeadline(period.endDate, reportType),
      status: validationErrors.length > 0 ? 'draft' : 'submitted',
      data,
      validationErrors
    };
  }

  /**
   * Validate report data
   */
  private validateReportData(reportType: string, data: any): string[] {
    const errors: string[] = [];

    switch (reportType) {
      case 'monthly_return':
        if (!data.assets || data.assets <= 0) {
          errors.push('Total assets must be provided and greater than zero');
        }
        if (!data.liabilities || data.liabilities < 0) {
          errors.push('Total liabilities must be provided and non-negative');
        }
        break;
      
      case 'foreign_exchange':
        if (!data.transactions || !Array.isArray(data.transactions)) {
          errors.push('Foreign exchange transactions array is required');
        }
        break;
      
      case 'credit_portfolio':
        if (!data.loans || !Array.isArray(data.loans)) {
          errors.push('Loan portfolio data is required');
        }
        break;
    }

    return errors;
  }

  /**
   * Calculate submission deadline
   */
  private calculateSubmissionDeadline(periodEnd: Date, reportType: string): Date {
    const deadline = new Date(periodEnd);
    
    switch (reportType) {
      case 'monthly_return':
        deadline.setDate(deadline.getDate() + 15); // 15 days after month end
        break;
      case 'quarterly_return':
        deadline.setDate(deadline.getDate() + 30); // 30 days after quarter end
        break;
      case 'annual_return':
        deadline.setDate(deadline.getDate() + 90); // 90 days after year end
        break;
      default:
        deadline.setDate(deadline.getDate() + 20);
    }
    
    return deadline;
  }

  /**
   * Check regulatory compliance status
   */
  checkRegulatoryCompliance(institution: any): { compliant: boolean; violations: string[]; recommendations: string[] } {
    const violations: string[] = [];
    const recommendations: string[] = [];

    // Capital adequacy check
    if (institution.capitalAdequacyRatio < 0.08) {
      violations.push('Capital adequacy ratio below minimum 8%');
      recommendations.push('Increase capital base or reduce risk-weighted assets');
    }

    // Liquidity ratio check
    if (institution.liquidityRatio < 0.15) {
      violations.push('Liquidity ratio below minimum 15%');
      recommendations.push('Improve liquidity management and maintain adequate liquid assets');
    }

    // Large exposure limits
    if (institution.largestExposure > institution.capital * 0.25) {
      violations.push('Single borrower exposure exceeds 25% of capital');
      recommendations.push('Diversify loan portfolio and reduce concentration risk');
    }

    // Foreign exchange position
    if (institution.netForeignExposure > institution.capital * 0.20) {
      violations.push('Net foreign exchange position exceeds 20% of capital');
      recommendations.push('Hedge foreign exchange exposure or reduce foreign currency operations');
    }

    return {
      compliant: violations.length === 0,
      violations,
      recommendations
    };
  }

  /**
   * Get NBE regulatory calendar
   */
  getRegulatoryCalendar(year: number): Array<{ date: Date; description: string; type: string; mandatory: boolean }> {
    const calendar: Array<{ date: Date; description: string; type: string; mandatory: boolean }> = [];

    // Monthly returns (15th of each month)
    for (let month = 0; month < 12; month++) {
      calendar.push({
        date: new Date(year, month + 1, 15),
        description: `Monthly Prudential Return submission deadline`,
        type: 'monthly_return',
        mandatory: true
      });
    }

    // Quarterly reports
    for (let quarter = 0; quarter < 4; quarter++) {
      const month = quarter * 3 + 3;
      calendar.push({
        date: new Date(year, month, 30),
        description: `Q${quarter + 1} Financial Statement submission`,
        type: 'quarterly_return',
        mandatory: true
      });
    }

    // Annual reports
    calendar.push({
      date: new Date(year + 1, 2, 31), // March 31
      description: 'Annual Audited Financial Statements',
      type: 'annual_return',
      mandatory: true
    });

    // AML reporting (ongoing)
    calendar.push({
      date: new Date(year, 0, 1),
      description: 'Suspicious Transaction Reporting (ongoing)',
      type: 'aml_reporting',
      mandatory: true
    });

    return calendar.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}

// Export singleton instance
export const ethiopianBankingComplianceService = new EthiopianBankingComplianceService();

// Export utility functions
export const validateForeignExchange = (transaction: Partial<ForeignExchangeTransaction>) => {
  return ethiopianBankingComplianceService.validateFXTransaction(transaction);
};

export const performAMLCheck = (transaction: any, customer: any): AntiMoneyLaunderingCheck => {
  return ethiopianBankingComplianceService.performAMLScreening(transaction, customer);
};

export const checkBankingCompliance = (institution: any) => {
  return ethiopianBankingComplianceService.checkRegulatoryCompliance(institution);
};
