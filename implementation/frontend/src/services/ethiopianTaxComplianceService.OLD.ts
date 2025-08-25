// Ethiopian Tax and Legal Compliance Service
// Comprehensive compliance framework for Ethiopian tax and legal requirements

import { EthiopianBusinessEntityType } from './ethiopianBusinessRulesEngine';

export interface TINValidationResult {
  isValid: boolean;
  format: 'individual' | 'business' | 'vat' | 'unknown';
  region?: string;
  errors: string[];
}

export interface VATRegistrationInfo {
  tinNumber: string;
  vatNumber: string;
  businessName: string;
  registrationDate: Date;
  status: 'active' | 'suspended' | 'cancelled';
  vatCategory: 'standard' | 'zero_rated' | 'exempt';
  turnoverThreshold: number;
}

export interface WithholdingTaxRules {
  serviceType: string;
  rate: number;
  minimumThreshold: number;
  exemptions: string[];
  requiredDocuments: string[];
}

export interface ExciseTaxRules {
  productCategory: string;
  rate: number;
  calculationMethod: 'ad_valorem' | 'specific' | 'compound';
  minimumPrice?: number;
  exemptions: string[];
}

export interface CustomsDutyCalculation {
  hsCode: string;
  productDescription: string;
  originCountry: string;
  dutyRate: number;
  additionalTaxes: {
    vat: number;
    excise: number;
    surtax: number;
  };
  totalDutyAmount: number;
  exemptions: string[];
}

export interface BusinessLicenseTracking {
  licenseType: string;
  licenseNumber: string;
  issuingAuthority: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'suspended' | 'renewed';
  renewalReminders: Date[];
  requiredDocuments: string[];
  fees: {
    original: number;
    renewal: number;
    late: number;
  };
}

export interface TaxReport {
  reportType: 'vat' | 'withholding' | 'income' | 'turnover' | 'customs';
  period: {
    startDate: Date;
    endDate: Date;
  };
  totalTaxableAmount: number;
  totalTaxAmount: number;
  paidAmount: number;
  balanceDue: number;
  filingDeadline: Date;
  status: 'draft' | 'filed' | 'overdue' | 'paid';
  transactions: TaxTransaction[];
}

export interface TaxTransaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  taxType: string;
  taxRate: number;
  taxAmount: number;
  supplierTIN?: string;
  customerTIN?: string;
  invoiceNumber?: string;
}

class EthiopianTaxComplianceService {
  private readonly TIN_PATTERNS = {
    individual: /^\d{10}$/, // 10 digits for individuals
    business: /^\d{10}$/, // 10 digits for businesses
    vat: /^ET\d{9}V$/  // ET + 9 digits + V for VAT registered
  };

  private readonly WITHHOLDING_RATES = new Map<string, WithholdingTaxRules>([
    ['professional_services', {
      serviceType: 'Professional Services',
      rate: 0.02,
      minimumThreshold: 1000,
      exemptions: ['government_entities', 'diplomatic_missions'],
      requiredDocuments: ['service_invoice', 'withholding_certificate']
    }],
    ['consultancy', {
      serviceType: 'Consultancy Services',
      rate: 0.05,
      minimumThreshold: 2000,
      exemptions: ['registered_consultants'],
      requiredDocuments: ['consultancy_agreement', 'performance_certificate']
    }],
    ['rent', {
      serviceType: 'Rent Payments',
      rate: 0.05,
      minimumThreshold: 500,
      exemptions: ['diplomatic_properties'],
      requiredDocuments: ['rental_agreement', 'receipt']
    }],
    ['construction', {
      serviceType: 'Construction Services',
      rate: 0.02,
      minimumThreshold: 5000,
      exemptions: ['government_projects'],
      requiredDocuments: ['construction_contract', 'completion_certificate']
    }],
    ['goods_supply', {
      serviceType: 'Goods Supply',
      rate: 0.02,
      minimumThreshold: 3000,
      exemptions: ['agricultural_products', 'pharmaceutical_supplies'],
      requiredDocuments: ['supply_invoice', 'delivery_note']
    }]
  ]);

  private readonly EXCISE_RATES = new Map<string, ExciseTaxRules>([
    ['luxury_vehicles', {
      productCategory: 'Luxury Vehicles',
      rate: 0.30,
      calculationMethod: 'ad_valorem',
      minimumPrice: 2000000, // ETB 2M threshold
      exemptions: ['diplomatic_vehicles', 'ambulances']
    }],
    ['tobacco', {
      productCategory: 'Tobacco Products',
      rate: 1.00,
      calculationMethod: 'ad_valorem',
      exemptions: ['export_tobacco']
    }],
    ['alcohol', {
      productCategory: 'Alcoholic Beverages',
      rate: 0.50,
      calculationMethod: 'ad_valorem',
      exemptions: ['export_alcohol', 'industrial_alcohol']
    }],
    ['petroleum', {
      productCategory: 'Petroleum Products',
      rate: 0.25,
      calculationMethod: 'specific',
      exemptions: ['aviation_fuel', 'diplomatic_fuel']
    }]
  ]);

  /**
   * Validate Ethiopian TIN (Tax Identification Number)
   */
  validateTIN(tin: string): TINValidationResult {
    const cleanTIN = tin.replace(/[\s-]/g, '').toUpperCase();
    const result: TINValidationResult = {
      isValid: false,
      format: 'unknown',
      errors: []
    };

    if (!cleanTIN) {
      result.errors.push('TIN is required');
      return result;
    }

    // Check VAT TIN format
    if (this.TIN_PATTERNS.vat.test(cleanTIN)) {
      result.format = 'vat';
      result.isValid = true;
      return result;
    }

    // Check individual/business TIN format
    if (this.TIN_PATTERNS.individual.test(cleanTIN)) {
      result.format = cleanTIN.startsWith('0') ? 'individual' : 'business';
      result.isValid = true;
      
      // Extract region code from first two digits
      const regionCode = cleanTIN.substring(0, 2);
      result.region = this.getRegionFromCode(regionCode);
      
      return result;
    }

    result.errors.push('Invalid TIN format');
    return result;
  }

  /**
   * Get region from TIN code
   */
  private getRegionFromCode(code: string): string {
    const regionMap: Record<string, string> = {
      '01': 'Addis Ababa',
      '02': 'Oromia',
      '03': 'Amhara',
      '04': 'Tigray',
      '05': 'SNNP',
      '06': 'Somali',
      '07': 'Afar',
      '08': 'Benishangul-Gumuz',
      '09': 'Gambela',
      '10': 'Harari',
      '11': 'Dire Dawa',
      '12': 'Sidama'
    };
    return regionMap[code] || 'Unknown';
  }

  /**
   * Calculate VAT amount
   */
  calculateVAT(amount: number, rate = 0.15, isInclusive = false): { vat: number; netAmount: number; totalAmount: number } {
    if (isInclusive) {
      // VAT is included in the amount
      const netAmount = amount / (1 + rate);
      const vat = amount - netAmount;
      return { vat, netAmount, totalAmount: amount };
    } else {
      // VAT is added to the amount
      const vat = amount * rate;
      const totalAmount = amount + vat;
      return { vat, netAmount: amount, totalAmount };
    }
  }

  /**
   * Calculate withholding tax
   */
  calculateWithholdingTax(serviceType: string, amount: number): { tax: number; rate: number; isExempt: boolean; requiredDocs: string[] } {
    const rules = this.WITHHOLDING_RATES.get(serviceType);
    
    if (!rules) {
      return { tax: 0, rate: 0, isExempt: true, requiredDocs: [] };
    }

    if (amount < rules.minimumThreshold) {
      return { tax: 0, rate: rules.rate, isExempt: true, requiredDocs: rules.requiredDocuments };
    }

    const tax = amount * rules.rate;
    return { tax, rate: rules.rate, isExempt: false, requiredDocs: rules.requiredDocuments };
  }

  /**
   * Calculate excise tax
   */
  calculateExciseTax(productCategory: string, amount: number, quantity?: number): { tax: number; rate: number; isExempt: boolean } {
    const rules = this.EXCISE_RATES.get(productCategory);
    
    if (!rules) {
      return { tax: 0, rate: 0, isExempt: true };
    }

    // Check minimum price threshold
    if (rules.minimumPrice && amount < rules.minimumPrice) {
      return { tax: 0, rate: rules.rate, isExempt: true };
    }

    let tax = 0;
    switch (rules.calculationMethod) {
      case 'ad_valorem':
        tax = amount * rules.rate;
        break;
      case 'specific':
        tax = (quantity || 1) * rules.rate;
        break;
      case 'compound':
        // Implementation for compound method
        tax = amount * rules.rate;
        break;
    }

    return { tax, rate: rules.rate, isExempt: false };
  }

  /**
   * Calculate customs duty
   */
  calculateCustomsDuty(hsCode: string, value: number, originCountry: string): CustomsDutyCalculation {
    // Simplified duty calculation - in real implementation, this would use tariff schedule
    const basicDutyRate = this.getBasicDutyRate(hsCode, originCountry);
    const basicDuty = value * basicDutyRate;
    
    // Calculate additional taxes on duty-paid value
    const dutyPaidValue = value + basicDuty;
    const vat = dutyPaidValue * 0.15; // 15% VAT
    const excise = this.getExciseForHS(hsCode) * dutyPaidValue;
    const surtax = 0; // Additional surtax if applicable

    return {
      hsCode,
      productDescription: this.getProductDescription(hsCode),
      originCountry,
      dutyRate: basicDutyRate,
      additionalTaxes: {
        vat,
        excise,
        surtax
      },
      totalDutyAmount: basicDuty + vat + excise + surtax,
      exemptions: this.getCustomsExemptions(hsCode, originCountry)
    };
  }

  /**
   * Get basic duty rate for HS code
   */
  private getBasicDutyRate(hsCode: string, originCountry: string): number {
    // Simplified rate structure
    const category = hsCode.substring(0, 2);
    
    // Check for preferential rates (COMESA, ACP, etc.)
    if (this.isPreferentialOrigin(originCountry)) {
      return 0; // Duty-free for preferential origins
    }

    // Basic MFN rates by category
    const rates: Record<string, number> = {
      '01': 0.00, // Live animals
      '02': 0.05, // Meat products
      '84': 0.10, // Machinery
      '85': 0.15, // Electrical equipment
      '87': 0.25, // Vehicles
      '94': 0.35  // Furniture
    };

    return rates[category] || 0.20; // Default 20%
  }

  /**
   * Check if country has preferential access
   */
  private isPreferentialOrigin(country: string): boolean {
    const preferentialCountries = [
      'Kenya', 'Uganda', 'Sudan', 'Egypt', 'Djibouti',
      'Rwanda', 'Burundi', 'Madagascar', 'Mauritius'
    ];
    return preferentialCountries.includes(country);
  }

  /**
   * Get excise rate for HS code
   */
  private getExciseForHS(hsCode: string): number {
    const category = hsCode.substring(0, 2);
    const exciseMap: Record<string, number> = {
      '22': 0.50, // Alcoholic beverages
      '24': 1.00, // Tobacco
      '87': 0.30  // Vehicles (if luxury)
    };
    return exciseMap[category] || 0;
  }

  /**
   * Get product description for HS code
   */
  private getProductDescription(hsCode: string): string {
    // Simplified mapping
    const descriptions: Record<string, string> = {
      '8703': 'Passenger motor cars',
      '8471': 'Computers and data processing machines',
      '2208': 'Spirits and liqueurs',
      '2402': 'Cigarettes'
    };
    return descriptions[hsCode.substring(0, 4)] || 'Unspecified goods';
  }

  /**
   * Get customs exemptions
   */
  private getCustomsExemptions(hsCode: string, originCountry: string): string[] {
    const exemptions: string[] = [];
    
    if (this.isPreferentialOrigin(originCountry)) {
      exemptions.push('COMESA preferential treatment');
    }
    
    // Add other exemptions based on HS code
    if (hsCode.startsWith('30')) {
      exemptions.push('Essential medicines exemption');
    }
    
    return exemptions;
  }

  /**
   * Generate VAT report
   */
  generateVATReport(period: { startDate: Date; endDate: Date }, transactions: TaxTransaction[]): TaxReport {
    const vatTransactions = transactions.filter(t => t.taxType === 'VAT');
    const totalTaxableAmount = vatTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalTaxAmount = vatTransactions.reduce((sum, t) => sum + t.taxAmount, 0);

    return {
      reportType: 'vat',
      period,
      totalTaxableAmount,
      totalTaxAmount,
      paidAmount: 0, // To be updated when payments are made
      balanceDue: totalTaxAmount,
      filingDeadline: this.calculateFilingDeadline(period.endDate, 'vat'),
      status: 'draft',
      transactions: vatTransactions
    };
  }

  /**
   * Generate withholding tax report
   */
  generateWithholdingReport(period: { startDate: Date; endDate: Date }, transactions: TaxTransaction[]): TaxReport {
    const withholdingTransactions = transactions.filter(t => t.taxType === 'withholding');
    const totalTaxableAmount = withholdingTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalTaxAmount = withholdingTransactions.reduce((sum, t) => sum + t.taxAmount, 0);

    return {
      reportType: 'withholding',
      period,
      totalTaxableAmount,
      totalTaxAmount,
      paidAmount: 0,
      balanceDue: totalTaxAmount,
      filingDeadline: this.calculateFilingDeadline(period.endDate, 'withholding'),
      status: 'draft',
      transactions: withholdingTransactions
    };
  }

  /**
   * Calculate tax filing deadline
   */
  private calculateFilingDeadline(periodEnd: Date, taxType: string): Date {
    const deadline = new Date(periodEnd);
    
    switch (taxType) {
      case 'vat':
        deadline.setDate(deadline.getDate() + 20); // 20 days after period end
        break;
      case 'withholding':
        deadline.setDate(deadline.getDate() + 15); // 15 days after period end
        break;
      case 'income':
        deadline.setMonth(deadline.getMonth() + 4); // 4 months after year end
        break;
      default:
        deadline.setDate(deadline.getDate() + 30);
    }
    
    return deadline;
  }

  /**
   * Check compliance status
   */
  checkComplianceStatus(business: any): { isCompliant: boolean; issues: string[]; recommendations: string[] } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check TIN validity
    const tinValidation = this.validateTIN(business.tin);
    if (!tinValidation.isValid) {
      issues.push('Invalid TIN format');
      recommendations.push('Register for valid TIN with Ethiopian Revenue and Customs Authority');
    }

    // Check VAT registration
    if (business.annualTurnover > 500000 && !business.vatRegistered) {
      issues.push('VAT registration required for turnover above ETB 500,000');
      recommendations.push('Register for VAT with ERCA');
    }

    // Check business license expiry
    if (business.licenseExpiryDate && business.licenseExpiryDate < new Date()) {
      issues.push('Business license has expired');
      recommendations.push('Renew business license immediately');
    }

    return {
      isCompliant: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Get tax calendar for Ethiopian fiscal year
   */
  getTaxCalendar(year: number): Array<{ date: Date; description: string; type: string }> {
    const calendar: Array<{ date: Date; description: string; type: string }> = [];
    
    // VAT filing deadlines (monthly)
    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 20);
      calendar.push({
        date,
        description: `VAT return filing deadline for ${date.toLocaleDateString('en-US', { month: 'long' })}`,
        type: 'vat_filing'
      });
    }

    // Withholding tax deadlines (monthly)
    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 15);
      calendar.push({
        date,
        description: `Withholding tax return deadline for ${date.toLocaleDateString('en-US', { month: 'long' })}`,
        type: 'withholding_filing'
      });
    }

    // Annual income tax deadline
    calendar.push({
      date: new Date(year + 1, 3, 30), // April 30
      description: 'Annual income tax return deadline',
      type: 'income_tax_filing'
    });

    return calendar.sort((a, b) => a.date.getTime() - b.date.getTime());
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

export const calculateEthiopianCustomsDuty = (hsCode: string, value: number, originCountry: string) => {
  return ethiopianTaxComplianceService.calculateCustomsDuty(hsCode, value, originCountry);
};
