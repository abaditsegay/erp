// Ethiopian Regulatory Reporting Service
// Automated reporting system for various Ethiopian regulatory authorities

import { TaxReport } from './ethiopianTaxComplianceService';
import { NBEReport } from './ethiopianBankingComplianceService';
import { BusinessLicense } from './ethiopianBusinessLicenseService';

export interface RegulatoryReport {
  id: string;
  reportType: ReportType;
  authority: RegulatoryAuthority;
  reportingPeriod: ReportingPeriod;
  businessInfo: BusinessInfo;
  reportData: any;
  status: ReportStatus;
  submissionDate?: Date;
  approvalDate?: Date;
  deadlines: ReportDeadlines;
  validationResults: ValidationResult[];
  attachments: ReportAttachment[];
  communicationLog: CommunicationRecord[];
}

export interface ReportType {
  code: string;
  name: string;
  description: string;
  category: 'tax' | 'banking' | 'licensing' | 'environmental' | 'labor' | 'customs' | 'sectoral';
  frequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'ad_hoc';
  mandatoryFor: string[]; // Business types that must submit this report
  template: ReportTemplate;
  validationRules: ValidationRule[];
}

export interface RegulatoryAuthority {
  code: string;
  name: string;
  nameAmharic: string;
  type: 'federal' | 'regional' | 'local' | 'autonomous';
  jurisdiction: string[];
  contactInfo: {
    headquarters: string;
    phone: string;
    email: string;
    website: string;
    onlinePortal?: string;
  };
  serviceHours: string;
  reportingMethods: ('online' | 'email' | 'physical' | 'postal')[];
}

export interface ReportingPeriod {
  startDate: Date;
  endDate: Date;
  fiscalYear: number;
  period: string; // e.g., "Q1 2024", "January 2024"
  ethiopianCalendar: {
    startDateEthiopian: string;
    endDateEthiopian: string;
    ethiopianYear: number;
  };
}

export interface BusinessInfo {
  name: string;
  tin: string;
  licenseNumber: string;
  businessType: string;
  sector: string;
  registrationDate: Date;
  contactPerson: string;
  address: {
    region: string;
    woreda: string;
    kebele: string;
    specificLocation: string;
  };
}

export type ReportStatus = 'draft' | 'ready_for_submission' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'amendment_required' | 'overdue';

export interface ReportDeadlines {
  submissionDeadline: Date;
  earlySubmissionDate?: Date;
  lateSubmissionPenalty: number;
  gracePeriod: number; // days
  extensionAvailable: boolean;
  extensionProcedure?: string;
}

export interface ValidationResult {
  ruleId: string;
  ruleName: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  field?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  autoFixable: boolean;
}

export interface ReportAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  description: string;
  mandatory: boolean;
  uploadDate: Date;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface CommunicationRecord {
  id: string;
  date: Date;
  type: 'submission' | 'query' | 'response' | 'clarification' | 'approval' | 'rejection';
  direction: 'outbound' | 'inbound';
  subject: string;
  content: string;
  sender: string;
  recipient: string;
  attachments?: string[];
  responseRequired: boolean;
  responseDeadline?: Date;
}

export interface ReportTemplate {
  sections: ReportSection[];
  calculationFields: CalculationField[];
  crossValidations: CrossValidation[];
  dataFormat: 'json' | 'xml' | 'excel' | 'pdf' | 'custom';
}

export interface ReportSection {
  id: string;
  title: string;
  description: string;
  order: number;
  mandatory: boolean;
  fields: ReportField[];
  subsections?: ReportSection[];
}

export interface ReportField {
  id: string;
  name: string;
  label: string;
  labelAmharic?: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'currency' | 'percentage';
  mandatory: boolean;
  defaultValue?: any;
  validationRules: FieldValidationRule[];
  helpText?: string;
  options?: { value: string; label: string; labelAmharic?: string }[];
}

export interface FieldValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  customValidator?: (value: any) => boolean;
}

export interface CalculationField {
  fieldId: string;
  formula: string;
  dependencies: string[];
  description: string;
}

export interface CrossValidation {
  id: string;
  description: string;
  fields: string[];
  rule: string; // e.g., "field1 + field2 = field3"
  errorMessage: string;
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  type: 'business_logic' | 'data_consistency' | 'regulatory_compliance' | 'mathematical';
  severity: 'error' | 'warning' | 'info';
  fields: string[];
  expression: string;
  errorMessage: string;
  warningMessage?: string;
}

class EthiopianRegulatoryReportingService {
  private readonly REGULATORY_AUTHORITIES = new Map<string, RegulatoryAuthority>([
    ['erca', {
      code: 'ERCA',
      name: 'Ethiopian Revenue and Customs Authority',
      nameAmharic: 'የኢትዮጵያ ገቢዎችና ጉምሩክ ባለስልጣን',
      type: 'federal',
      jurisdiction: ['tax', 'customs', 'excise'],
      contactInfo: {
        headquarters: 'Addis Ababa, Ethiopia',
        phone: '+251-11-667-9999',
        email: 'info@erca.gov.et',
        website: 'www.erca.gov.et',
        onlinePortal: 'portal.erca.gov.et'
      },
      serviceHours: 'Monday-Friday 8:30-17:30',
      reportingMethods: ['online', 'physical']
    }],
    ['nbe', {
      code: 'NBE',
      name: 'National Bank of Ethiopia',
      nameAmharic: 'የኢትዮጵያ ብሔራዊ ባንክ',
      type: 'federal',
      jurisdiction: ['banking', 'monetary_policy', 'foreign_exchange'],
      contactInfo: {
        headquarters: 'Addis Ababa, Ethiopia',
        phone: '+251-11-517-430',
        email: 'info@nbe.gov.et',
        website: 'www.nbe.gov.et',
        onlinePortal: 'eportal.nbe.gov.et'
      },
      serviceHours: 'Monday-Friday 8:30-17:30',
      reportingMethods: ['online', 'email']
    }],
    ['moti', {
      code: 'MOTI',
      name: 'Ministry of Trade and Industry',
      nameAmharic: 'የንግድና ኢንዱስትሪ ሚኒስቴር',
      type: 'federal',
      jurisdiction: ['trade_licensing', 'industrial_development', 'investment'],
      contactInfo: {
        headquarters: 'Addis Ababa, Ethiopia',
        phone: '+251-11-551-7080',
        email: 'info@moti.gov.et',
        website: 'www.moti.gov.et'
      },
      serviceHours: 'Monday-Friday 8:30-17:30',
      reportingMethods: ['online', 'physical', 'email']
    }],
    ['molsa', {
      code: 'MOLSA',
      name: 'Ministry of Labour and Social Affairs',
      nameAmharic: 'የሰራተኛና ማህበራዊ ጉዳይ ሚኒስቴር',
      type: 'federal',
      jurisdiction: ['labor_relations', 'social_security', 'employment'],
      contactInfo: {
        headquarters: 'Addis Ababa, Ethiopia',
        phone: '+251-11-655-1769',
        email: 'info@molsa.gov.et',
        website: 'www.molsa.gov.et'
      },
      serviceHours: 'Monday-Friday 8:30-17:30',
      reportingMethods: ['physical', 'email']
    }],
    ['efccc', {
      code: 'EFCCC',
      name: 'Environment, Forest and Climate Change Commission',
      nameAmharic: 'የአካባቢ፣ ደን እና የአየር ንብረት ለውጥ ኮሚሽን',
      type: 'federal',
      jurisdiction: ['environmental_protection', 'forest_management', 'climate_change'],
      contactInfo: {
        headquarters: 'Addis Ababa, Ethiopia',
        phone: '+251-11-646-0494',
        email: 'info@efccc.gov.et',
        website: 'www.efccc.gov.et'
      },
      serviceHours: 'Monday-Friday 8:30-17:30',
      reportingMethods: ['physical', 'email']
    }]
  ]);

  private readonly REPORT_TYPES = new Map<string, ReportType>([
    ['vat_monthly', {
      code: 'VAT-M',
      name: 'Monthly VAT Return',
      description: 'Monthly Value Added Tax return filing',
      category: 'tax',
      frequency: 'monthly',
      mandatoryFor: ['vat_registered_businesses'],
      template: this.getVATReturnTemplate(),
      validationRules: this.getVATValidationRules()
    }],
    ['withholding_monthly', {
      code: 'WHT-M',
      name: 'Monthly Withholding Tax Return',
      description: 'Monthly withholding tax return for tax agents',
      category: 'tax',
      frequency: 'monthly',
      mandatoryFor: ['withholding_agents'],
      template: this.getWithholdingReturnTemplate(),
      validationRules: this.getWithholdingValidationRules()
    }],
    ['income_annual', {
      code: 'INC-A',
      name: 'Annual Income Tax Return',
      description: 'Annual business income tax return',
      category: 'tax',
      frequency: 'annual',
      mandatoryFor: ['all_businesses'],
      template: this.getIncomeReturnTemplate(),
      validationRules: this.getIncomeValidationRules()
    }],
    ['bank_monthly', {
      code: 'BNK-M',
      name: 'Monthly Bank Prudential Return',
      description: 'Monthly prudential return for banks',
      category: 'banking',
      frequency: 'monthly',
      mandatoryFor: ['banks', 'microfinance_institutions'],
      template: this.getBankReturnTemplate(),
      validationRules: this.getBankValidationRules()
    }],
    ['labor_quarterly', {
      code: 'LAB-Q',
      name: 'Quarterly Labor Report',
      description: 'Quarterly employment and labor statistics report',
      category: 'labor',
      frequency: 'quarterly',
      mandatoryFor: ['employers_with_10_plus_employees'],
      template: this.getLaborReportTemplate(),
      validationRules: this.getLaborValidationRules()
    }],
    ['environmental_annual', {
      code: 'ENV-A',
      name: 'Annual Environmental Compliance Report',
      description: 'Annual environmental impact and compliance report',
      category: 'environmental',
      frequency: 'annual',
      mandatoryFor: ['manufacturing_businesses', 'industrial_operations'],
      template: this.getEnvironmentalReportTemplate(),
      validationRules: this.getEnvironmentalValidationRules()
    }]
  ]);

  /**
   * Create new regulatory report
   */
  createReport(reportTypeCode: string, businessInfo: BusinessInfo, reportingPeriod: ReportingPeriod): RegulatoryReport {
    const reportType = this.REPORT_TYPES.get(reportTypeCode);
    if (!reportType) {
      throw new Error(`Unknown report type: ${reportTypeCode}`);
    }

    const authority = this.getAuthorityForReportType(reportType);
    const deadlines = this.calculateDeadlines(reportingPeriod, reportType);

    return {
      id: this.generateReportId(reportTypeCode),
      reportType,
      authority,
      reportingPeriod,
      businessInfo,
      reportData: this.initializeReportData(reportType),
      status: 'draft',
      deadlines,
      validationResults: [],
      attachments: [],
      communicationLog: []
    };
  }

  /**
   * Generate unique report ID
   */
  private generateReportId(reportTypeCode: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6);
    return `${reportTypeCode}-${timestamp}-${random}`;
  }

  /**
   * Get authority for report type
   */
  private getAuthorityForReportType(reportType: ReportType): RegulatoryAuthority {
    switch (reportType.category) {
      case 'tax':
      case 'customs':
        return this.REGULATORY_AUTHORITIES.get('erca')!;
      case 'banking':
        return this.REGULATORY_AUTHORITIES.get('nbe')!;
      case 'licensing':
        return this.REGULATORY_AUTHORITIES.get('moti')!;
      case 'labor':
        return this.REGULATORY_AUTHORITIES.get('molsa')!;
      case 'environmental':
        return this.REGULATORY_AUTHORITIES.get('efccc')!;
      default:
        return this.REGULATORY_AUTHORITIES.get('moti')!;
    }
  }

  /**
   * Calculate report deadlines
   */
  private calculateDeadlines(period: ReportingPeriod, reportType: ReportType): ReportDeadlines {
    const submissionDeadline = new Date(period.endDate);
    
    switch (reportType.frequency) {
      case 'monthly':
        submissionDeadline.setDate(submissionDeadline.getDate() + 20);
        break;
      case 'quarterly':
        submissionDeadline.setDate(submissionDeadline.getDate() + 30);
        break;
      case 'annual':
        submissionDeadline.setMonth(submissionDeadline.getMonth() + 4);
        break;
      default:
        submissionDeadline.setDate(submissionDeadline.getDate() + 30);
    }

    const earlySubmissionDate = new Date(submissionDeadline);
    earlySubmissionDate.setDate(earlySubmissionDate.getDate() - 7);

    return {
      submissionDeadline,
      earlySubmissionDate,
      lateSubmissionPenalty: this.calculateLatePenalty(reportType),
      gracePeriod: 5,
      extensionAvailable: true,
      extensionProcedure: 'Submit formal request with justification 7 days before deadline'
    };
  }

  /**
   * Calculate late submission penalty
   */
  private calculateLatePenalty(reportType: ReportType): number {
    switch (reportType.category) {
      case 'tax':
        return 1000; // ETB 1,000 per day
      case 'banking':
        return 2000; // ETB 2,000 per day
      default:
        return 500; // ETB 500 per day
    }
  }

  /**
   * Initialize report data structure
   */
  private initializeReportData(reportType: ReportType): any {
    const data: any = {};
    
    reportType.template.sections.forEach(section => {
      data[section.id] = {};
      section.fields.forEach(field => {
        data[section.id][field.id] = field.defaultValue || null;
      });
    });

    return data;
  }

  /**
   * Validate report
   */
  validateReport(report: RegulatoryReport): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Field-level validation
    report.reportType.template.sections.forEach(section => {
      section.fields.forEach(field => {
        const value = report.reportData[section.id]?.[field.id];
        const fieldResults = this.validateField(field, value);
        results.push(...fieldResults);
      });
    });

    // Business rule validation
    report.reportType.validationRules.forEach(rule => {
      const ruleResult = this.validateBusinessRule(rule, report.reportData);
      if (ruleResult) {
        results.push(ruleResult);
      }
    });

    // Cross-validation
    report.reportType.template.crossValidations.forEach(crossVal => {
      const crossResult = this.validateCrossValidation(crossVal, report.reportData);
      if (crossResult) {
        results.push(crossResult);
      }
    });

    return results;
  }

  /**
   * Validate individual field
   */
  private validateField(field: ReportField, value: any): ValidationResult[] {
    const results: ValidationResult[] = [];

    field.validationRules.forEach(rule => {
      let passed = true;
      let message = '';

      switch (rule.type) {
        case 'required':
          passed = value !== null && value !== undefined && value !== '';
          message = passed ? 'Field is required' : rule.message;
          break;
        case 'min':
          passed = !value || (typeof value === 'number' && value >= rule.value);
          message = passed ? `Value must be at least ${rule.value}` : rule.message;
          break;
        case 'max':
          passed = !value || (typeof value === 'number' && value <= rule.value);
          message = passed ? `Value must not exceed ${rule.value}` : rule.message;
          break;
        case 'pattern':
          passed = !value || new RegExp(rule.value).test(value.toString());
          message = passed ? 'Invalid format' : rule.message;
          break;
        case 'custom':
          passed = !value || !rule.customValidator || rule.customValidator(value);
          message = passed ? 'Custom validation failed' : rule.message;
          break;
      }

      results.push({
        ruleId: `${field.id}_${rule.type}`,
        ruleName: `${field.label} - ${rule.type}`,
        status: passed ? 'passed' : 'failed',
        message,
        field: field.id,
        severity: field.mandatory ? 'error' : 'warning',
        autoFixable: false
      });
    });

    return results;
  }

  /**
   * Validate business rule
   */
  private validateBusinessRule(rule: ValidationRule, reportData: any): ValidationResult | null {
    // Simplified implementation - would need more sophisticated expression evaluation
    try {
      // This would typically use a proper expression evaluator
      const passed = this.evaluateExpression(rule.expression, reportData);
      
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        status: passed ? 'passed' : 'failed',
        message: passed ? rule.warningMessage || 'Rule passed' : rule.errorMessage,
        severity: rule.severity,
        autoFixable: false
      };
    } catch (error) {
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        status: 'failed',
        message: 'Error evaluating rule',
        severity: 'error',
        autoFixable: false
      };
    }
  }

  /**
   * Evaluate expression (simplified)
   */
  private evaluateExpression(expression: string, data: any): boolean {
    // Simplified implementation - in reality would use a proper expression parser
    return true;
  }

  /**
   * Validate cross-validation rule
   */
  private validateCrossValidation(crossVal: CrossValidation, reportData: any): ValidationResult | null {
    // Simplified implementation
    return null;
  }

  /**
   * Submit report
   */
  submitReport(reportId: string): { success: boolean; submissionId?: string; errors?: string[] } {
    // In a real implementation, this would:
    // 1. Validate the report
    // 2. Generate submission file
    // 3. Submit to authority's system
    // 4. Update report status
    
    const submissionId = `SUB-${Date.now()}`;
    
    return {
      success: true,
      submissionId
    };
  }

  /**
   * Generate report submission file
   */
  generateSubmissionFile(report: RegulatoryReport, format: 'xml' | 'json' | 'excel' | 'pdf' = 'xml'): { content: string; fileName: string } {
    switch (format) {
      case 'xml':
        return {
          content: this.generateXMLContent(report),
          fileName: `${report.reportType.code}_${report.businessInfo.tin}_${report.reportingPeriod.period}.xml`
        };
      case 'json':
        return {
          content: JSON.stringify(report.reportData, null, 2),
          fileName: `${report.reportType.code}_${report.businessInfo.tin}_${report.reportingPeriod.period}.json`
        };
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Generate XML content
   */
  private generateXMLContent(report: RegulatoryReport): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<RegulatoryReport>
  <Header>
    <ReportType>${report.reportType.code}</ReportType>
    <BusinessTIN>${report.businessInfo.tin}</BusinessTIN>
    <ReportingPeriod>
      <StartDate>${report.reportingPeriod.startDate.toISOString()}</StartDate>
      <EndDate>${report.reportingPeriod.endDate.toISOString()}</EndDate>
    </ReportingPeriod>
    <SubmissionDate>${new Date().toISOString()}</SubmissionDate>
  </Header>
  <Data>
    ${this.generateXMLDataSection(report.reportData)}
  </Data>
</RegulatoryReport>`;
  }

  /**
   * Generate XML data section
   */
  private generateXMLDataSection(data: any): string {
    let xml = '';
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null) {
        xml += `<${key}>${this.generateXMLDataSection(value)}</${key}>`;
      } else {
        xml += `<${key}>${value || ''}</${key}>`;
      }
    }
    return xml;
  }

  /**
   * Get reporting calendar
   */
  getReportingCalendar(year: number, businessType: string): Array<{ date: Date; reportType: string; authority: string; mandatory: boolean }> {
    const calendar: Array<{ date: Date; reportType: string; authority: string; mandatory: boolean }> = [];

    this.REPORT_TYPES.forEach((reportType, code) => {
      if (!reportType.mandatoryFor.includes(businessType) && !reportType.mandatoryFor.includes('all_businesses')) {
        return;
      }

      const authority = this.getAuthorityForReportType(reportType);

      switch (reportType.frequency) {
        case 'monthly':
          for (let month = 0; month < 12; month++) {
            const date = new Date(year, month + 1, 20); // 20th of following month
            calendar.push({
              date,
              reportType: reportType.name,
              authority: authority.name,
              mandatory: true
            });
          }
          break;
        
        case 'quarterly':
          for (let quarter = 0; quarter < 4; quarter++) {
            const month = quarter * 3 + 3;
            const date = new Date(year, month, 30); // 30 days after quarter end
            calendar.push({
              date,
              reportType: reportType.name,
              authority: authority.name,
              mandatory: true
            });
          }
          break;
        
        case 'annual':
          const date = new Date(year + 1, 3, 30); // April 30 following year
          calendar.push({
            date,
            reportType: reportType.name,
            authority: authority.name,
            mandatory: true
          });
          break;
      }
    });

    return calendar.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // Template and validation rule methods (simplified)
  private getVATReturnTemplate(): ReportTemplate {
    return {
      sections: [
        {
          id: 'sales',
          title: 'Sales Information',
          description: 'Details of taxable sales during the period',
          order: 1,
          mandatory: true,
          fields: [
            {
              id: 'total_sales',
              name: 'totalSales',
              label: 'Total Sales Amount',
              type: 'currency',
              mandatory: true,
              validationRules: [
                { type: 'required', message: 'Total sales amount is required' },
                { type: 'min', value: 0, message: 'Sales amount cannot be negative' }
              ]
            }
          ]
        }
      ],
      calculationFields: [],
      crossValidations: [],
      dataFormat: 'xml'
    };
  }

  private getVATValidationRules(): ValidationRule[] {
    return [
      {
        id: 'vat_calculation',
        name: 'VAT Calculation Check',
        description: 'Verify VAT calculation is correct',
        type: 'mathematical',
        severity: 'error',
        fields: ['total_sales', 'vat_amount'],
        expression: 'vat_amount = total_sales * 0.15',
        errorMessage: 'VAT amount does not match calculated value'
      }
    ];
  }

  private getWithholdingReturnTemplate(): ReportTemplate { return { sections: [], calculationFields: [], crossValidations: [], dataFormat: 'xml' }; }
  private getWithholdingValidationRules(): ValidationRule[] { return []; }
  private getIncomeReturnTemplate(): ReportTemplate { return { sections: [], calculationFields: [], crossValidations: [], dataFormat: 'xml' }; }
  private getIncomeValidationRules(): ValidationRule[] { return []; }
  private getBankReturnTemplate(): ReportTemplate { return { sections: [], calculationFields: [], crossValidations: [], dataFormat: 'xml' }; }
  private getBankValidationRules(): ValidationRule[] { return []; }
  private getLaborReportTemplate(): ReportTemplate { return { sections: [], calculationFields: [], crossValidations: [], dataFormat: 'xml' }; }
  private getLaborValidationRules(): ValidationRule[] { return []; }
  private getEnvironmentalReportTemplate(): ReportTemplate { return { sections: [], calculationFields: [], crossValidations: [], dataFormat: 'xml' }; }
  private getEnvironmentalValidationRules(): ValidationRule[] { return []; }
}

// Export singleton instance
export const ethiopianRegulatoryReportingService = new EthiopianRegulatoryReportingService();

// Export utility functions
export const createRegulatoryReport = (reportTypeCode: string, businessInfo: BusinessInfo, reportingPeriod: ReportingPeriod): RegulatoryReport => {
  return ethiopianRegulatoryReportingService.createReport(reportTypeCode, businessInfo, reportingPeriod);
};

export const validateRegulatoryReport = (report: RegulatoryReport): ValidationResult[] => {
  return ethiopianRegulatoryReportingService.validateReport(report);
};

export const submitRegulatoryReport = (reportId: string) => {
  return ethiopianRegulatoryReportingService.submitReport(reportId);
};

export const getReportingCalendar = (year: number, businessType: string) => {
  return ethiopianRegulatoryReportingService.getReportingCalendar(year, businessType);
};
