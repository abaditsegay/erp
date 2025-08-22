// Ethiopian Business Rules Engine
// Comprehensive business logic and rules for Ethiopian business context

export type EthiopianBusinessDays = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export enum EthiopianPaymentTerms {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',           // ገንዘብ በማድረስ ጊዜ
  ADVANCE_PAYMENT = 'ADVANCE_PAYMENT',             // ቅድመ ክፍያ
  CREDIT_15_DAYS = 'CREDIT_15_DAYS',               // 15 ቀን ብድር
  CREDIT_30_DAYS = 'CREDIT_30_DAYS',               // 30 ቀን ብድር
  CREDIT_45_DAYS = 'CREDIT_45_DAYS',               // 45 ቀን ብድር
  CREDIT_60_DAYS = 'CREDIT_60_DAYS',               // 60 ቀን ብድር
  CREDIT_90_DAYS = 'CREDIT_90_DAYS',               // 90 ቀን ብድር
  LETTER_OF_CREDIT = 'LETTER_OF_CREDIT',           // የብድር ደብዳቤ
  BANK_GUARANTEE = 'BANK_GUARANTEE',               // የባንክ ዋስትና
  INSTALLMENT_PAYMENT = 'INSTALLMENT_PAYMENT',     // በተከፋፈለ ክፍያ
  GOVERNMENT_NET_30 = 'GOVERNMENT_NET_30',         // የመንግስት 30 ቀን
  NGO_NET_45 = 'NGO_NET_45',                      // የመንግስታዊ ያልሆኑ ድርጅቶች 45 ቀን
  COOPERATIVE_NET_60 = 'COOPERATIVE_NET_60'        // የህብረት ስራ ማህበር 60 ቀን
}

export enum EthiopianBusinessEntityType {
  PRIVATE_LIMITED_COMPANY = 'PRIVATE_LIMITED_COMPANY',     // ፒ.ኤል.ሲ
  SHARE_COMPANY = 'SHARE_COMPANY',                         // አክሲዮን ማህበር
  SOLE_PROPRIETORSHIP = 'SOLE_PROPRIETORSHIP',             // የግል ባለቤትነት
  PARTNERSHIP = 'PARTNERSHIP',                             // ሽርክና
  COOPERATIVE = 'COOPERATIVE',                             // ህብረት ስራ ማህበር
  NGO = 'NGO',                                             // መንግስታዊ ያልሆነ ድርጅት
  GOVERNMENT_ENTITY = 'GOVERNMENT_ENTITY',                 // መንግስታዊ ድርጅት
  INTERNATIONAL_ORGANIZATION = 'INTERNATIONAL_ORGANIZATION', // አለማቀፍ ድርጅት
  MICROFINANCE = 'MICROFINANCE',                           // ማይክሮ ፋይናንስ
  BANK = 'BANK',                                           // ባንክ
  INSURANCE = 'INSURANCE'                                  // ኢንሹራንስ
}

export interface EthiopianWorkingHours {
  startTime: string;        // 08:30 (Ethiopian time)
  endTime: string;          // 17:30 (Ethiopian time)
  lunchBreakStart: string;  // 12:00
  lunchBreakEnd: string;    // 13:00
  workingDays: EthiopianBusinessDays[];
  ramadanHours?: {          // Special hours during Ramadan
    startTime: string;
    endTime: string;
  };
  fastingDayHours?: {       // Special hours during Orthodox fasting
    startTime: string;
    endTime: string;
  };
}

export interface EthiopianBusinessProtocols {
  meetingEtiquette: {
    greetingStyle: 'formal' | 'traditional' | 'mixed';
    languagePreference: 'amharic' | 'english' | 'both';
    punctuality: 'strict' | 'flexible' | 'cultural';
    dresscode: 'formal' | 'business_casual' | 'traditional';
  };
  negotiationStyle: {
    approach: 'direct' | 'relationship_based' | 'hierarchical';
    decisionMaking: 'individual' | 'consensus' | 'elder_approval';
    timeOrientation: 'monochronic' | 'polychronic';
  };
  documentationRequirements: {
    language: 'amharic' | 'english' | 'bilingual';
    signatureRequirements: string[];
    witnessRequirements: number;
    notarization: boolean;
  };
}

export interface CulturalGuidelines {
  religiousConsiderations: {
    orthodoxFasting: boolean;
    islamicObservances: boolean;
    protestantConsiderations: boolean;
    traditionalBeliefs: boolean;
  };
  socialCustoms: {
    respectForElders: boolean;
    communityOrientation: boolean;
    hospitalityExpectations: boolean;
    giftGivingProtocols: string[];
  };
  communicationStyle: {
    indirectness: 'low' | 'medium' | 'high';
    contextSensitivity: 'low' | 'medium' | 'high';
    nonverbalImportance: 'low' | 'medium' | 'high';
  };
}

export interface RegionalTaxRates {
  standardVAT: number;      // 15% standard
  exportVAT: number;        // 0% for exports
  withholding: {
    services: number;       // 2% for professional services
    goods: number;          // 2% for goods
    rent: number;           // 5% for rent
    consultancy: number;    // 5% for consultancy
    construction: number;   // 2% for construction
  };
  turnoverTax: number;      // For small businesses
  exciseTax: {
    luxury: number;         // 30% on luxury items
    tobacco: number;        // 100% on tobacco
    alcohol: number;        // 50% on alcohol
    vehicles: number;       // 10-30% on vehicles
  };
  customsDuty: {
    rawMaterials: number;   // 0-5%
    machinery: number;      // 0-10%
    finishedGoods: number;  // 10-35%
    luxury: number;         // 35-50%
  };
}

export interface BusinessLicenseInfo {
  type: string;
  authority: string;
  validityPeriod: number;   // in months
  renewalNoticePeriod: number; // days before expiry
  requiredDocuments: string[];
  fees: {
    application: number;
    renewal: number;
    late: number;
  };
}

export interface RegionalBusinessRules {
  region: string;
  taxRates: RegionalTaxRates;
  businessLicenseRequirements: BusinessLicenseInfo[];
  workingHours: EthiopianWorkingHours;
  culturalGuidelines: CulturalGuidelines;
  paymentTermsPreferences: EthiopianPaymentTerms[];
  languageRequirements: {
    official: 'amharic' | 'english' | 'both';
    local: string[];
    documentLanguage: 'amharic' | 'english' | 'bilingual';
  };
  bankingRegulations: {
    foreignExchangeControls: boolean;
    localBankingRequirement: boolean;
    reportingThresholds: {
      largeTransactions: number;
      foreignCurrency: number;
      cashTransactions: number;
    };
  };
}

class EthiopianBusinessRulesEngine {
  private regionalRules: Map<string, RegionalBusinessRules> = new Map();

  constructor() {
    this.initializeRegionalRules();
  }

  /**
   * Initialize regional business rules for Ethiopian regions
   */
  private initializeRegionalRules(): void {
    // Addis Ababa - Commercial hub with strict regulations
    this.regionalRules.set('Addis Ababa', {
      region: 'Addis Ababa',
      taxRates: this.getStandardTaxRates(),
      businessLicenseRequirements: this.getAddisAbabaLicenseRequirements(),
      workingHours: this.getStandardWorkingHours(),
      culturalGuidelines: this.getUrbanCulturalGuidelines(),
      paymentTermsPreferences: [
        EthiopianPaymentTerms.CREDIT_30_DAYS,
        EthiopianPaymentTerms.BANK_GUARANTEE,
        EthiopianPaymentTerms.LETTER_OF_CREDIT
      ],
      languageRequirements: {
        official: 'both',
        local: ['Amharic', 'Oromo'],
        documentLanguage: 'bilingual'
      },
      bankingRegulations: {
        foreignExchangeControls: true,
        localBankingRequirement: true,
        reportingThresholds: {
          largeTransactions: 100000, // ETB
          foreignCurrency: 10000,    // USD
          cashTransactions: 50000    // ETB
        }
      }
    });

    // Oromia - Largest region with agricultural focus
    this.regionalRules.set('Oromia', {
      region: 'Oromia',
      taxRates: this.getRegionalTaxRates('agricultural'),
      businessLicenseRequirements: this.getAgriculturalLicenseRequirements(),
      workingHours: this.getAgriculturalWorkingHours(),
      culturalGuidelines: this.getRuralCulturalGuidelines(),
      paymentTermsPreferences: [
        EthiopianPaymentTerms.CASH_ON_DELIVERY,
        EthiopianPaymentTerms.CREDIT_45_DAYS,
        EthiopianPaymentTerms.COOPERATIVE_NET_60
      ],
      languageRequirements: {
        official: 'both',
        local: ['Oromo', 'Amharic'],
        documentLanguage: 'bilingual'
      },
      bankingRegulations: {
        foreignExchangeControls: true,
        localBankingRequirement: false,
        reportingThresholds: {
          largeTransactions: 75000,
          foreignCurrency: 5000,
          cashTransactions: 30000
        }
      }
    });

    // Add more regional rules...
    this.addMoreRegionalRules();
  }

  /**
   * Get standard Ethiopian tax rates
   */
  private getStandardTaxRates(): RegionalTaxRates {
    return {
      standardVAT: 0.15,
      exportVAT: 0.00,
      withholding: {
        services: 0.02,
        goods: 0.02,
        rent: 0.05,
        consultancy: 0.05,
        construction: 0.02
      },
      turnoverTax: 0.02,
      exciseTax: {
        luxury: 0.30,
        tobacco: 1.00,
        alcohol: 0.50,
        vehicles: 0.20
      },
      customsDuty: {
        rawMaterials: 0.025,
        machinery: 0.05,
        finishedGoods: 0.20,
        luxury: 0.40
      }
    };
  }

  /**
   * Get regional tax rates based on economic focus
   */
  private getRegionalTaxRates(economicFocus: string): RegionalTaxRates {
    const standardRates = this.getStandardTaxRates();
    
    switch (economicFocus) {
      case 'agricultural':
        // Reduced rates for agricultural regions
        return {
          ...standardRates,
          turnoverTax: 0.01, // Reduced for small farmers
          customsDuty: {
            ...standardRates.customsDuty,
            rawMaterials: 0.00, // No duty on agricultural inputs
            machinery: 0.025   // Reduced on agricultural machinery
          }
        };
      case 'industrial':
        // Incentives for industrial development
        return {
          ...standardRates,
          customsDuty: {
            ...standardRates.customsDuty,
            machinery: 0.00,   // No duty on industrial machinery
            rawMaterials: 0.00 // No duty on industrial raw materials
          }
        };
      default:
        return standardRates;
    }
  }

  /**
   * Get standard Ethiopian working hours
   */
  private getStandardWorkingHours(): EthiopianWorkingHours {
    return {
      startTime: '08:30',
      endTime: '17:30',
      lunchBreakStart: '12:00',
      lunchBreakEnd: '13:00',
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      ramadanHours: {
        startTime: '08:30',
        endTime: '16:30'
      },
      fastingDayHours: {
        startTime: '09:00',
        endTime: '17:00'
      }
    };
  }

  /**
   * Get agricultural working hours (flexible for seasonal work)
   */
  private getAgriculturalWorkingHours(): EthiopianWorkingHours {
    return {
      startTime: '07:00',
      endTime: '16:00',
      lunchBreakStart: '11:30',
      lunchBreakEnd: '12:30',
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      ramadanHours: {
        startTime: '07:00',
        endTime: '15:00'
      },
      fastingDayHours: {
        startTime: '08:00',
        endTime: '16:00'
      }
    };
  }

  /**
   * Get urban cultural guidelines
   */
  private getUrbanCulturalGuidelines(): CulturalGuidelines {
    return {
      religiousConsiderations: {
        orthodoxFasting: true,
        islamicObservances: true,
        protestantConsiderations: true,
        traditionalBeliefs: false
      },
      socialCustoms: {
        respectForElders: true,
        communityOrientation: false,
        hospitalityExpectations: true,
        giftGivingProtocols: ['business_gifts_appropriate', 'avoid_leather_during_fasting']
      },
      communicationStyle: {
        indirectness: 'medium',
        contextSensitivity: 'high',
        nonverbalImportance: 'medium'
      }
    };
  }

  /**
   * Get rural cultural guidelines
   */
  private getRuralCulturalGuidelines(): CulturalGuidelines {
    return {
      religiousConsiderations: {
        orthodoxFasting: true,
        islamicObservances: true,
        protestantConsiderations: true,
        traditionalBeliefs: true
      },
      socialCustoms: {
        respectForElders: true,
        communityOrientation: true,
        hospitalityExpectations: true,
        giftGivingProtocols: ['community_gifts_expected', 'respect_traditional_customs']
      },
      communicationStyle: {
        indirectness: 'high',
        contextSensitivity: 'high',
        nonverbalImportance: 'high'
      }
    };
  }

  /**
   * Get Addis Ababa license requirements
   */
  private getAddisAbabaLicenseRequirements(): BusinessLicenseInfo[] {
    return [
      {
        type: 'Business License',
        authority: 'Addis Ababa City Administration',
        validityPeriod: 12,
        renewalNoticePeriod: 30,
        requiredDocuments: ['TIN Certificate', 'VAT Registration', 'Trade Name Registration'],
        fees: { application: 500, renewal: 300, late: 100 }
      },
      {
        type: 'Environmental Permit',
        authority: 'Environmental Protection Authority',
        validityPeriod: 24,
        renewalNoticePeriod: 60,
        requiredDocuments: ['Environmental Impact Assessment', 'Waste Management Plan'],
        fees: { application: 1000, renewal: 500, late: 200 }
      }
    ];
  }

  /**
   * Get agricultural license requirements
   */
  private getAgriculturalLicenseRequirements(): BusinessLicenseInfo[] {
    return [
      {
        type: 'Agricultural Business License',
        authority: 'Ministry of Agriculture',
        validityPeriod: 12,
        renewalNoticePeriod: 30,
        requiredDocuments: ['Cooperative Registration', 'Land Use Certificate'],
        fees: { application: 200, renewal: 100, late: 50 }
      }
    ];
  }

  /**
   * Add more regional rules
   */
  private addMoreRegionalRules(): void {
    // Simplified implementation for other regions
    const otherRegions = ['Amhara', 'Tigray', 'SNNP', 'Somali', 'Afar', 'Benishangul-Gumuz', 'Gambela', 'Harari', 'Dire Dawa', 'Sidama'];
    
    otherRegions.forEach(region => {
      this.regionalRules.set(region, {
        region,
        taxRates: this.getStandardTaxRates(),
        businessLicenseRequirements: this.getStandardLicenseRequirements(),
        workingHours: this.getStandardWorkingHours(),
        culturalGuidelines: this.getRuralCulturalGuidelines(),
        paymentTermsPreferences: [
          EthiopianPaymentTerms.CASH_ON_DELIVERY,
          EthiopianPaymentTerms.CREDIT_30_DAYS
        ],
        languageRequirements: {
          official: 'both',
          local: ['Amharic'],
          documentLanguage: 'bilingual'
        },
        bankingRegulations: {
          foreignExchangeControls: true,
          localBankingRequirement: false,
          reportingThresholds: {
            largeTransactions: 50000,
            foreignCurrency: 5000,
            cashTransactions: 25000
          }
        }
      });
    });
  }

  /**
   * Get standard license requirements
   */
  private getStandardLicenseRequirements(): BusinessLicenseInfo[] {
    return [
      {
        type: 'Business License',
        authority: 'Regional Trade and Industry Bureau',
        validityPeriod: 12,
        renewalNoticePeriod: 30,
        requiredDocuments: ['TIN Certificate', 'Trade Registration'],
        fees: { application: 300, renewal: 200, late: 75 }
      }
    ];
  }

  /**
   * Get business rules for a specific region
   */
  getRegionalRules(region: string): RegionalBusinessRules | null {
    return this.regionalRules.get(region) || null;
  }

  /**
   * Calculate applicable tax rate based on transaction details
   */
  calculateTaxRate(region: string, transactionType: string, entityType: EthiopianBusinessEntityType): number {
    const rules = this.getRegionalRules(region);
    if (!rules) return 0.15; // Default VAT rate

    switch (transactionType) {
      case 'services':
        return rules.taxRates.withholding.services;
      case 'goods':
        return rules.taxRates.withholding.goods;
      case 'rent':
        return rules.taxRates.withholding.rent;
      case 'consultancy':
        return rules.taxRates.withholding.consultancy;
      case 'construction':
        return rules.taxRates.withholding.construction;
      default:
        return rules.taxRates.standardVAT;
    }
  }

  /**
   * Get recommended payment terms for entity type and region
   */
  getRecommendedPaymentTerms(region: string, entityType: EthiopianBusinessEntityType): EthiopianPaymentTerms[] {
    const rules = this.getRegionalRules(region);
    if (!rules) return [EthiopianPaymentTerms.CREDIT_30_DAYS];

    switch (entityType) {
      case EthiopianBusinessEntityType.GOVERNMENT_ENTITY:
        return [EthiopianPaymentTerms.GOVERNMENT_NET_30, EthiopianPaymentTerms.BANK_GUARANTEE];
      case EthiopianBusinessEntityType.NGO:
        return [EthiopianPaymentTerms.NGO_NET_45, EthiopianPaymentTerms.LETTER_OF_CREDIT];
      case EthiopianBusinessEntityType.COOPERATIVE:
        return [EthiopianPaymentTerms.COOPERATIVE_NET_60, EthiopianPaymentTerms.CASH_ON_DELIVERY];
      default:
        return rules.paymentTermsPreferences;
    }
  }

  /**
   * Check if transaction requires special reporting
   */
  requiresSpecialReporting(region: string, amount: number, currency: 'ETB' | 'USD'): boolean {
    const rules = this.getRegionalRules(region);
    if (!rules) return false;

    const thresholds = rules.bankingRegulations.reportingThresholds;
    
    if (currency === 'ETB') {
      return amount >= thresholds.largeTransactions;
    } else {
      return amount >= thresholds.foreignCurrency;
    }
  }

  /**
   * Get working hours for region and date
   */
  getWorkingHours(region: string, date: Date): EthiopianWorkingHours {
    const rules = this.getRegionalRules(region);
    if (!rules) return this.getStandardWorkingHours();

    // TODO: Add logic to check for Ramadan or fasting periods
    // For now, return standard hours
    return rules.workingHours;
  }

  /**
   * Validate business transaction against regional rules
   */
  validateTransaction(region: string, transaction: any): { isValid: boolean; warnings: string[]; errors: string[] } {
    const warnings: string[] = [];
    const errors: string[] = [];
    const rules = this.getRegionalRules(region);

    if (!rules) {
      errors.push(`No business rules defined for region: ${region}`);
      return { isValid: false, warnings, errors };
    }

    // Check reporting thresholds
    if (this.requiresSpecialReporting(region, transaction.amount, transaction.currency)) {
      warnings.push('Transaction exceeds reporting threshold - special documentation required');
    }

    // Check working hours
    const transactionDate = new Date(transaction.date);
    const workingHours = this.getWorkingHours(region, transactionDate);
    const isWorkingDay = workingHours.workingDays.includes(
      transactionDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as EthiopianBusinessDays
    );

    if (!isWorkingDay) {
      warnings.push('Transaction scheduled for non-working day');
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors
    };
  }

  /**
   * Get all available regions
   */
  getAvailableRegions(): string[] {
    return Array.from(this.regionalRules.keys());
  }
}

// Export singleton instance
export const ethiopianBusinessRulesEngine = new EthiopianBusinessRulesEngine();

// Export utility functions
export const getRegionalBusinessRules = (region: string): RegionalBusinessRules | null => {
  return ethiopianBusinessRulesEngine.getRegionalRules(region);
};

export const calculateEthiopianTax = (region: string, transactionType: string, entityType: EthiopianBusinessEntityType): number => {
  return ethiopianBusinessRulesEngine.calculateTaxRate(region, transactionType, entityType);
};

export const getPaymentTermsRecommendations = (region: string, entityType: EthiopianBusinessEntityType): EthiopianPaymentTerms[] => {
  return ethiopianBusinessRulesEngine.getRecommendedPaymentTerms(region, entityType);
};

export const validateEthiopianTransaction = (region: string, transaction: any) => {
  return ethiopianBusinessRulesEngine.validateTransaction(region, transaction);
};
