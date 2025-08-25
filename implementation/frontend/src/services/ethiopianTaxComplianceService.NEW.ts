/**
 * Ethiopian Tax and Legal Compliance Service - Enterprise Implementation
 * Complete compliance framework for Ethiopian Revenue and Customs Authority (ERCA)
 * Supports VAT, withholding tax, excise tax, customs duty, and business license management
 */

import { EthiopianBusinessEntityType } from './ethiopianBusinessRulesEngine';

export interface TINValidationResult {
  isValid: boolean;
  format: 'individual' | 'business' | 'invalid';
  errors: string[];
  checkDigit?: number;
  region?: string;
}

export interface VATRegistrationInfo {
  tinNumber: string;
  businessName: string;
  registrationDate: Date;
  vatRate: number;
  exemptions: string[];
  status: 'active' | 'suspended' | 'cancelled';
  renewalDate: Date;
  businessCategory: string;
}

export interface WithholdingTaxRules {
  serviceType: string;
  rate: number;
  threshold: number;
  applicableEntityTypes: EthiopianBusinessEntityType[];
  exemptions: string[];
  reportingRequirement: 'monthly' | 'quarterly' | 'annually';
}

export interface ExciseTaxRules {
  productCategory: string;
  rate: number;
  calculationMethod: 'ad_valorem' | 'specific';
  minimumPrice?: number;
  exemptions: string[];
  specialConditions?: string[];
}

export interface CustomsDutyCalculation {
  hsCode: string;
  description: string;
  dutyRate: number;
  exemptionRate?: number;
  surcharge?: number;
  withholdingRate?: number;
  exciseRate?: number;
  vatRate: number;
  totalDutyPayable: number;
}

export interface BusinessLicenseTracking {
  licenseType: string;
  licenseNumber: string;
  issuingAuthority: string;
  issueDate: Date;
  expiryDate: Date;
  renewalPeriod: number; // months
  status: 'active' | 'expired' | 'suspended' | 'cancelled';
  requirements: string[];
  fees: number;
  currency: 'ETB' | 'USD';
}

export interface TaxReport {
  reportType: 'vat' | 'withholding' | 'income' | 'excise' | 'customs';
  period: {
    startDate: Date;
    endDate: Date;
    fiscalYear: string;
  };
  taxpayerInfo: {
    tin: string;
    businessName: string;
    address: string;
  };
  transactions: TaxTransaction[];
  summary: {
    totalTaxable: number;
    totalTax: number;
    totalPaid: number;
    balance: number;
  };
  submissionDeadline: Date;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

export interface TaxTransaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  taxType: string;
  taxRate: number;
  taxAmount: number;
  currency: 'ETB' | 'USD';
  documentNumber: string;
  supplierTin?: string;
  customerTin?: string;
}

export interface ERCAIntegrationConfig {
  apiEndpoint: string;
  apiKey: string;
  environment: 'sandbox' | 'production';
  timeout: number;
  retryAttempts: number;
}

export interface ComplianceAlert {
  id: string;
  type: 'deadline' | 'threshold' | 'violation' | 'renewal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  dueDate: Date;
  actions: string[];
  resolved: boolean;
}

class EthiopianTaxComplianceService {
  private readonly VAT_RATE = 0.15; // 15% standard VAT rate
  private readonly VAT_THRESHOLD = 500000; // ETB 500K VAT registration threshold

  // Withholding tax rates by service type
  private readonly WITHHOLDING_RATES = new Map([
    ['professional_services', 0.02], // 2%
    ['consulting', 0.03], // 3%
    ['construction', 0.02], // 2%
    ['transportation', 0.01], // 1%
    ['rent', 0.05], // 5%
    ['interest', 0.05], // 5%
    ['dividend', 0.10], // 10%
    ['royalty', 0.05], // 5%
    ['commission', 0.03], // 3%
    ['management_fee', 0.03], // 3%
    ['technical_service', 0.02], // 2%
    ['equipment_rental', 0.02], // 2%
    ['software_license', 0.05], // 5%
    ['advertising', 0.02], // 2%
    ['security_service', 0.02], // 2%
    ['cleaning_service', 0.02], // 2%
    ['catering', 0.02], // 2%
    ['printing', 0.02], // 2%
    ['maintenance', 0.02], // 2%
    ['training', 0.02] // 2%
  ]);

  // Excise tax rates by product category
  private readonly EXCISE_RATES = new Map<string, ExciseTaxRules>([
    ['vehicles', {
      productCategory: 'Motor Vehicles',
      rate: 0.30,
      calculationMethod: 'ad_valorem' as const,
      minimumPrice: 2000000, // ETB 2M threshold
      exemptions: ['diplomatic_vehicles', 'ambulances']
    }],
    ['tobacco', {
      productCategory: 'Tobacco Products',
      rate: 1.00,
      calculationMethod: 'ad_valorem' as const,
      exemptions: ['export_tobacco']
    }],
    ['alcohol', {
      productCategory: 'Alcoholic Beverages',
      rate: 0.50,
      calculationMethod: 'ad_valorem' as const,
      exemptions: ['export_alcohol', 'industrial_alcohol']
    }],
    ['petroleum', {
      productCategory: 'Petroleum Products',
      rate: 0.25,
      calculationMethod: 'specific' as const,
      exemptions: ['aviation_fuel', 'diplomatic_fuel']
    }]
  ]);

  /**
   * Validate Ethiopian TIN (Tax Identification Number)
   */
  validateTIN(tin: string): TINValidationResult {
    const cleanTin = tin.replace(/[-\s]/g, '');
    
    // Basic format validation
    if (!/^\d{10}$/.test(cleanTin)) {
      return {
        isValid: false,
        format: 'invalid',
        errors: ['TIN must be exactly 10 digits']
      };
    }

    // Check digit validation (simplified algorithm)
    const digits = cleanTin.split('').map(Number);
    const checkDigit = this.calculateTINCheckDigit(digits.slice(0, 9));
    
    if (checkDigit !== digits[9]) {
      return {
        isValid: false,
        format: 'invalid',
        errors: ['Invalid check digit']
      };
    }

    // Determine format based on first digits
    const firstTwoDigits = parseInt(cleanTin.substring(0, 2));
    let format: 'individual' | 'business' | 'invalid';
    
    if (firstTwoDigits >= 10 && firstTwoDigits <= 19) {
      format = 'individual';
    } else if (firstTwoDigits >= 20 && firstTwoDigits <= 99) {
      format = 'business';
    } else {
      format = 'invalid';
    }

    return {
      isValid: true,
      format,
      errors: [],
      checkDigit,
      region: this.getTINRegion(firstTwoDigits)
    };
  }

  /**
   * Calculate TIN check digit
   */
  private calculateTINCheckDigit(digits: number[]): number {
    const weights = [9, 8, 7, 6, 5, 4, 3, 2, 1];
    const sum = digits.reduce((acc, digit, index) => acc + digit * weights[index], 0);
    return sum % 11 === 0 ? 0 : 11 - (sum % 11);
  }

  /**
   * Get region from TIN prefix
   */
  private getTINRegion(prefix: number): string {
    const regionMap: Record<number, string> = {
      10: 'Addis Ababa',
      11: 'Dire Dawa',
      20: 'Tigray',
      21: 'Afar',
      22: 'Amhara',
      23: 'Oromia',
      24: 'Somali',
      25: 'Benishangul-Gumuz',
      26: 'SNNPR',
      27: 'Gambela',
      28: 'Harari',
      29: 'Sidama'
    };
    
    const regionPrefix = Math.floor(prefix / 10) * 10;
    return regionMap[regionPrefix] || 'Unknown Region';
  }

  /**
   * Calculate VAT amount
   */
  calculateVAT(amount: number, rate = this.VAT_RATE, isInclusive = false): {
    baseAmount: number;
    vat: number;
    totalAmount: number;
    rate: number;
  } {
    if (isInclusive) {
      // VAT is included in the amount
      const baseAmount = amount / (1 + rate);
      const vat = amount - baseAmount;
      return {
        baseAmount: Math.round(baseAmount * 100) / 100,
        vat: Math.round(vat * 100) / 100,
        totalAmount: amount,
        rate
      };
    } else {
      // VAT to be added to the amount
      const vat = amount * rate;
      const totalAmount = amount + vat;
      return {
        baseAmount: amount,
        vat: Math.round(vat * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        rate
      };
    }
  }

  /**
   * Calculate withholding tax
   */
  calculateWithholdingTax(serviceType: string, amount: number): {
    serviceType: string;
    baseAmount: number;
    rate: number;
    tax: number;
    netAmount: number;
    threshold?: number;
  } {
    const rate = this.WITHHOLDING_RATES.get(serviceType) || 0.02; // Default 2%
    const tax = amount * rate;
    const netAmount = amount - tax;

    return {
      serviceType,
      baseAmount: amount,
      rate,
      tax: Math.round(tax * 100) / 100,
      netAmount: Math.round(netAmount * 100) / 100
    };
  }

  /**
   * Calculate excise tax
   */
  calculateExciseTax(productCategory: string, amount: number, quantity = 1): {
    productCategory: string;
    exciseInfo: ExciseTaxRules;
    baseAmount: number;
    exciseTax: number;
    totalAmount: number;
  } {
    const exciseInfo = this.EXCISE_RATES.get(productCategory);
    
    if (!exciseInfo) {
      return {
        productCategory,
        exciseInfo: {
          productCategory: 'Not Applicable',
          rate: 0,
          calculationMethod: 'ad_valorem',
          exemptions: []
        },
        baseAmount: amount,
        exciseTax: 0,
        totalAmount: amount
      };
    }

    let exciseTax = 0;
    
    if (exciseInfo.calculationMethod === 'ad_valorem') {
      exciseTax = amount * exciseInfo.rate;
    } else if (exciseInfo.calculationMethod === 'specific') {
      // Specific rate calculation (per unit)
      exciseTax = quantity * exciseInfo.rate;
    }

    return {
      productCategory,
      exciseInfo,
      baseAmount: amount,
      exciseTax: Math.round(exciseTax * 100) / 100,
      totalAmount: Math.round((amount + exciseTax) * 100) / 100
    };
  }

  /**
   * Calculate customs duty
   */
  calculateCustomsDuty(hsCode: string, cifValue: number, quantity = 1): CustomsDutyCalculation {
    // Simplified customs duty calculation
    // In real implementation, this would connect to ERCA customs database
    
    const dutyRate = this.getCustomsDutyRate(hsCode);
    const duty = cifValue * dutyRate;
    
    // Calculate other charges
    const surcharge = cifValue * 0.10; // 10% surcharge
    const withholdingTax = cifValue * 0.03; // 3% withholding on imports
    const exciseTax = this.getExciseTaxForImport(hsCode, cifValue);
    
    // VAT calculated on CIF + Duty + Excise
    const vatBase = cifValue + duty + exciseTax;
    const vat = vatBase * this.VAT_RATE;
    
    const totalDuty = duty + surcharge + withholdingTax + exciseTax + vat;

    return {
      hsCode,
      description: this.getHSCodeDescription(hsCode),
      dutyRate,
      surcharge: Math.round(surcharge * 100) / 100,
      withholdingRate: 0.03,
      exciseRate: exciseTax / cifValue,
      vatRate: this.VAT_RATE,
      totalDutyPayable: Math.round(totalDuty * 100) / 100
    };
  }

  /**
   * Get customs duty rate for HS code
   */
  private getCustomsDutyRate(hsCode: string): number {
    // Simplified duty rate lookup
    const dutyRates: Record<string, number> = {
      '8703': 0.30, // Motor cars
      '2710': 0.05, // Petroleum oils
      '6203': 0.35, // Men's suits
      '8471': 0.00, // Computers (duty-free)
      '3004': 0.00, // Medicines (duty-free)
      '1001': 0.00, // Wheat (duty-free)
    };
    
    const categoryCode = hsCode.substring(0, 4);
    return dutyRates[categoryCode] || 0.15; // Default 15%
  }

  /**
   * Get excise tax for imported goods
   */
  private getExciseTaxForImport(hsCode: string, value: number): number {
    const categoryCode = hsCode.substring(0, 4);
    
    const exciseItems: Record<string, number> = {
      '8703': 0.30, // Motor vehicles
      '2402': 0.50, // Cigarettes
      '2208': 0.40, // Spirits
    };
    
    const rate = exciseItems[categoryCode] || 0;
    return value * rate;
  }

  /**
   * Get HS code description
   */
  private getHSCodeDescription(hsCode: string): string {
    const descriptions: Record<string, string> = {
      '8703': 'Motor cars and other motor vehicles',
      '2710': 'Petroleum oils and oils obtained from bituminous minerals',
      '6203': 'Men\'s or boys\' suits, ensembles, jackets, blazers, trousers',
      '8471': 'Automatic data processing machines and units thereof',
      '3004': 'Medicaments consisting of mixed or unmixed products',
      '1001': 'Wheat and meslin'
    };
    
    const categoryCode = hsCode.substring(0, 4);
    return descriptions[categoryCode] || 'Commodity not specified';
  }

  /**
   * Generate VAT return report
   */
  generateVATReport(transactions: TaxTransaction[], period: { startDate: Date; endDate: Date }): TaxReport {
    const vatTransactions = transactions.filter(t => t.taxType === 'VAT');
    
    const summary = {
      totalTaxable: vatTransactions.reduce((sum, t) => sum + t.amount, 0),
      totalTax: vatTransactions.reduce((sum, t) => sum + t.taxAmount, 0),
      totalPaid: 0, // Would come from payment records
      balance: 0
    };
    
    summary.balance = summary.totalTax - summary.totalPaid;

    return {
      reportType: 'vat',
      period: {
        startDate: period.startDate,
        endDate: period.endDate,
        fiscalYear: this.getFiscalYear(period.startDate)
      },
      taxpayerInfo: {
        tin: '1234567890', // Would come from user profile
        businessName: 'Sample Business',
        address: 'Addis Ababa, Ethiopia'
      },
      transactions: vatTransactions,
      summary,
      submissionDeadline: this.calculateSubmissionDeadline(period.endDate, 'vat'),
      status: 'draft'
    };
  }

  /**
   * Get fiscal year for a date
   */
  private getFiscalYear(date: Date): string {
    // Ethiopian fiscal year starts July 8 (Hamle 1)
    const year = date.getFullYear();
    const fiscalYearStart = new Date(year, 6, 8); // July 8
    
    if (date >= fiscalYearStart) {
      return `${year}/${year + 1}`;
    } else {
      return `${year - 1}/${year}`;
    }
  }

  /**
   * Calculate tax submission deadline
   */
  private calculateSubmissionDeadline(periodEnd: Date, taxType: string): Date {
    const deadlines: Record<string, number> = {
      'vat': 20, // 20th of following month
      'withholding': 15, // 15th of following month
      'income': 120, // 4 months after year end
      'excise': 20 // 20th of following month
    };
    
    const daysAfter = deadlines[taxType] || 30;
    const deadline = new Date(periodEnd);
    deadline.setDate(deadline.getDate() + daysAfter);
    
    return deadline;
  }

  /**
   * Check compliance status
   */
  checkCompliance(businessInfo: any): ComplianceAlert[] {
    const alerts: ComplianceAlert[] = [];
    
    // Check VAT registration requirement
    if (businessInfo.annualTurnover > this.VAT_THRESHOLD && !businessInfo.vatRegistered) {
      alerts.push({
        id: 'vat-registration-required',
        type: 'violation',
        severity: 'high',
        title: 'VAT Registration Required',
        description: `Annual turnover exceeds ETB ${this.VAT_THRESHOLD.toLocaleString()}. VAT registration is mandatory.`,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        actions: ['Register for VAT', 'File VAT returns'],
        resolved: false
      });
    }

    // Check license expiry
    if (businessInfo.licenseExpiryDate && businessInfo.licenseExpiryDate < new Date()) {
      alerts.push({
        id: 'license-expired',
        type: 'renewal',
        severity: 'critical',
        title: 'Business License Expired',
        description: 'Business license has expired and requires immediate renewal.',
        dueDate: businessInfo.licenseExpiryDate,
        actions: ['Renew license', 'Pay renewal fees'],
        resolved: false
      });
    }

    return alerts;
  }

  /**
   * Validate business for ERCA compliance
   */
  async validateERCACompliance(businessData: any): Promise<{
    isCompliant: boolean;
    violations: string[];
    recommendations: string[];
    score: number;
  }> {
    const violations: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check TIN validity
    const tinValidation = this.validateTIN(businessData.tin);
    if (!tinValidation.isValid) {
      violations.push('Invalid TIN format');
      score -= 20;
    }

    // Check VAT registration
    if (businessData.annualTurnover > this.VAT_THRESHOLD && !businessData.vatRegistered) {
      violations.push('VAT registration required for businesses with turnover > ETB 500,000');
      score -= 25;
    }

    // Check withholding tax compliance
    if (businessData.hasEmployees && !businessData.withholdingTaxSetup) {
      violations.push('Withholding tax system not properly configured');
      score -= 15;
      recommendations.push('Set up withholding tax calculations for employee payments');
    }

    // Check record keeping
    if (!businessData.properRecordKeeping) {
      violations.push('Inadequate record keeping system');
      score -= 20;
      recommendations.push('Implement proper bookkeeping and record management');
    }

    return {
      isCompliant: violations.length === 0,
      violations,
      recommendations,
      score: Math.max(0, score)
    };
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(businessData: any): {
    summary: string;
    vatCompliance: boolean;
    withholdingCompliance: boolean;
    licenseStatus: string;
    recommendations: string[];
    nextActions: Array<{ action: string; deadline: Date; priority: 'high' | 'medium' | 'low' }>;
  } {
    const recommendations: string[] = [];
    const nextActions: Array<{ action: string; deadline: Date; priority: 'high' | 'medium' | 'low' }> = [];

    // VAT compliance check
    const vatCompliance = businessData.annualTurnover <= this.VAT_THRESHOLD || businessData.vatRegistered;
    if (!vatCompliance) {
      recommendations.push('Register for VAT immediately');
      nextActions.push({
        action: 'Complete VAT registration',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        priority: 'high'
      });
    }

    // Withholding tax compliance
    const withholdingCompliance = !businessData.hasVendorPayments || businessData.withholdingTaxSetup;
    if (!withholdingCompliance) {
      recommendations.push('Configure withholding tax calculations');
      nextActions.push({
        action: 'Set up withholding tax system',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        priority: 'medium'
      });
    }

    // License status
    let licenseStatus = 'Valid';
    if (businessData.licenseExpiryDate < new Date()) {
      licenseStatus = 'Expired';
      nextActions.push({
        action: 'Renew business license',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'high'
      });
    } else if (businessData.licenseExpiryDate < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)) {
      licenseStatus = 'Expiring Soon';
      nextActions.push({
        action: 'Prepare license renewal documents',
        deadline: businessData.licenseExpiryDate,
        priority: 'medium'
      });
    }

    const summary = `Compliance Status: ${vatCompliance && withholdingCompliance && licenseStatus === 'Valid' ? 'Fully Compliant' : 'Action Required'}`;

    return {
      summary,
      vatCompliance,
      withholdingCompliance,
      licenseStatus,
      recommendations,
      nextActions
    };
  }
}

// Export singleton instance
export const ethiopianTaxComplianceService = new EthiopianTaxComplianceService();

// Export utility functions
export const validateEthiopianTIN = (tin: string): TINValidationResult => {
  return ethiopianTaxComplianceService.validateTIN(tin);
};

export const calculateEthiopianVAT = (amount: number, rate = 0.15, isInclusive = false) => {
  return ethiopianTaxComplianceService.calculateVAT(amount, rate, isInclusive);
};

export const calculateEthiopianWithholding = (serviceType: string, amount: number) => {
  return ethiopianTaxComplianceService.calculateWithholdingTax(serviceType, amount);
};

export const calculateEthiopianExcise = (productCategory: string, amount: number, quantity = 1) => {
  return ethiopianTaxComplianceService.calculateExciseTax(productCategory, amount, quantity);
};

export const calculateEthiopianCustoms = (hsCode: string, cifValue: number, quantity = 1) => {
  return ethiopianTaxComplianceService.calculateCustomsDuty(hsCode, cifValue, quantity);
};

export default ethiopianTaxComplianceService;
