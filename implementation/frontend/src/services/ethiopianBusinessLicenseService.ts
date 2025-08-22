// Ethiopian Business License and Permit Tracking Service
// Comprehensive tracking system for Ethiopian business licenses and permits

export interface BusinessLicense {
  id: string;
  licenseNumber: string;
  licenseType: LicenseType;
  businessName: string;
  businessTIN: string;
  issuingAuthority: IssuingAuthority;
  issueDate: Date;
  expiryDate: Date;
  status: LicenseStatus;
  renewalHistory: RenewalRecord[];
  requiredDocuments: RequiredDocument[];
  fees: LicenseFees;
  conditions: string[];
  businessActivity: string[];
  location: BusinessLocation;
  notifications: LicenseNotification[];
}

export interface LicenseType {
  code: string;
  name: string;
  category: 'trade' | 'manufacturing' | 'service' | 'import_export' | 'construction' | 'tourism' | 'transport' | 'health' | 'education' | 'mining';
  description: string;
  validityPeriod: number; // months
  renewalNotice: number; // days before expiry
  requiredCapital: number;
  specificRequirements: string[];
}

export interface IssuingAuthority {
  code: string;
  name: string;
  level: 'federal' | 'regional' | 'city' | 'woreda' | 'sector_specific';
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    website?: string;
  };
  serviceHours: string;
  onlineServices: boolean;
}

export type LicenseStatus = 'active' | 'expired' | 'suspended' | 'cancelled' | 'pending_renewal' | 'pending_application';

export interface RenewalRecord {
  renewalDate: Date;
  previousExpiryDate: Date;
  newExpiryDate: Date;
  feesPaid: number;
  renewalOfficer: string;
  notes?: string;
}

export interface RequiredDocument {
  documentType: string;
  description: string;
  mandatory: boolean;
  format: 'original' | 'certified_copy' | 'notarized' | 'digital';
  validityPeriod?: number; // months
  issuingAuthority?: string;
  status: 'submitted' | 'verified' | 'rejected' | 'pending';
  submissionDate?: Date;
  verificationDate?: Date;
  rejectionReason?: string;
}

export interface LicenseFees {
  applicationFee: number;
  licenseFee: number;
  renewalFee: number;
  lateFee: number;
  inspectionFee?: number;
  additionalFees: { [key: string]: number };
  totalPaid: number;
  paymentHistory: PaymentRecord[];
}

export interface PaymentRecord {
  date: Date;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'online' | 'mobile_money';
  receiptNumber: string;
  purpose: string;
}

export interface BusinessLocation {
  region: string;
  zone?: string;
  woreda: string;
  kebele: string;
  houseNumber?: string;
  specificLocation: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  zoning: 'commercial' | 'industrial' | 'mixed' | 'residential' | 'special_zone';
}

export interface LicenseNotification {
  id: string;
  type: 'renewal_reminder' | 'expiry_warning' | 'status_change' | 'document_request' | 'inspection_notice';
  title: string;
  message: string;
  date: Date;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  actionRequired: boolean;
  dueDate?: Date;
}

export interface LicenseApplication {
  id: string;
  applicantName: string;
  applicantTIN: string;
  licenseType: string;
  applicationDate: Date;
  status: 'submitted' | 'under_review' | 'document_request' | 'inspection_scheduled' | 'approved' | 'rejected';
  reviewStages: ApplicationStage[];
  estimatedCompletionDate: Date;
  actualCompletionDate?: Date;
  rejectionReasons?: string[];
  appeals?: AppealRecord[];
}

export interface ApplicationStage {
  stageNumber: number;
  stageName: string;
  description: string;
  assignedOfficer: string;
  startDate: Date;
  estimatedDuration: number; // days
  completionDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  requiredActions: string[];
  notes?: string;
}

export interface AppealRecord {
  appealDate: Date;
  reason: string;
  appealOfficer: string;
  decision: 'upheld' | 'overturned' | 'modified' | 'pending';
  decisionDate?: Date;
  remarks?: string;
}

class EthiopianBusinessLicenseService {
  private readonly LICENSE_TYPES = new Map<string, LicenseType>([
    ['trade_general', {
      code: 'TRD-001',
      name: 'General Trading License',
      category: 'trade',
      description: 'License for general wholesale and retail trading activities',
      validityPeriod: 12,
      renewalNotice: 30,
      requiredCapital: 50000,
      specificRequirements: ['Valid business plan', 'Store premises', 'Inventory list']
    }],
    ['manufacturing_general', {
      code: 'MFG-001',
      name: 'General Manufacturing License',
      category: 'manufacturing',
      description: 'License for general manufacturing and production activities',
      validityPeriod: 24,
      renewalNotice: 60,
      requiredCapital: 500000,
      specificRequirements: ['Environmental impact assessment', 'Factory premises', 'Equipment list', 'Quality control plan']
    }],
    ['import_export', {
      code: 'IMP-001',
      name: 'Import/Export License',
      category: 'import_export',
      description: 'License for importing and exporting goods',
      validityPeriod: 12,
      renewalNotice: 45,
      requiredCapital: 200000,
      specificRequirements: ['Bank guarantee', 'Warehouse facility', 'Customs clearance capability']
    }],
    ['service_provider', {
      code: 'SRV-001',
      name: 'Service Provider License',
      category: 'service',
      description: 'License for service-based businesses',
      validityPeriod: 12,
      renewalNotice: 30,
      requiredCapital: 25000,
      specificRequirements: ['Service description', 'Professional qualifications', 'Office premises']
    }],
    ['construction', {
      code: 'CNS-001',
      name: 'Construction License',
      category: 'construction',
      description: 'License for construction and building activities',
      validityPeriod: 24,
      renewalNotice: 60,
      requiredCapital: 1000000,
      specificRequirements: ['Professional engineers', 'Equipment inventory', 'Safety plan', 'Insurance coverage']
    }],
    ['tourism', {
      code: 'TRM-001',
      name: 'Tourism Service License',
      category: 'tourism',
      description: 'License for tourism-related services',
      validityPeriod: 12,
      renewalNotice: 45,
      requiredCapital: 100000,
      specificRequirements: ['Tourism ministry approval', 'Qualified guides', 'Safety protocols']
    }]
  ]);

  private readonly ISSUING_AUTHORITIES = new Map<string, IssuingAuthority>([
    ['moti', {
      code: 'MOTI',
      name: 'Ministry of Trade and Industry',
      level: 'federal',
      contactInfo: {
        address: 'Addis Ababa, Ethiopia',
        phone: '+251-11-XXX-XXXX',
        email: 'info@moti.gov.et',
        website: 'www.moti.gov.et'
      },
      serviceHours: 'Monday-Friday 8:30-17:30',
      onlineServices: true
    }],
    ['icc', {
      code: 'ICC',
      name: 'Investment Commission',
      level: 'federal',
      contactInfo: {
        address: 'Addis Ababa, Ethiopia',
        phone: '+251-11-XXX-XXXX',
        email: 'info@investethiopia.gov.et',
        website: 'www.investethiopia.gov.et'
      },
      serviceHours: 'Monday-Friday 8:30-17:30',
      onlineServices: true
    }],
    ['city_admin', {
      code: 'CTY',
      name: 'City Administration',
      level: 'city',
      contactInfo: {
        address: 'Local City Administration Office',
        phone: '+251-11-XXX-XXXX',
        email: 'info@city.gov.et'
      },
      serviceHours: 'Monday-Friday 8:30-17:00',
      onlineServices: false
    }],
    ['woreda_admin', {
      code: 'WRD',
      name: 'Woreda Administration',
      level: 'woreda',
      contactInfo: {
        address: 'Local Woreda Office',
        phone: '+251-XX-XXX-XXXX',
        email: 'info@woreda.gov.et'
      },
      serviceHours: 'Monday-Friday 8:30-17:00',
      onlineServices: false
    }]
  ]);

  /**
   * Create new business license
   */
  createLicense(licenseData: Partial<BusinessLicense>): BusinessLicense {
    const licenseType = this.LICENSE_TYPES.get(licenseData.licenseType?.code || '');
    if (!licenseType) {
      throw new Error('Invalid license type');
    }

    const issueDate = new Date();
    const expiryDate = new Date(issueDate);
    expiryDate.setMonth(expiryDate.getMonth() + licenseType.validityPeriod);

    const license: BusinessLicense = {
      id: this.generateLicenseId(),
      licenseNumber: this.generateLicenseNumber(licenseType.code),
      licenseType,
      businessName: licenseData.businessName || '',
      businessTIN: licenseData.businessTIN || '',
      issuingAuthority: licenseData.issuingAuthority || this.getDefaultAuthority(licenseType.category),
      issueDate,
      expiryDate,
      status: 'active',
      renewalHistory: [],
      requiredDocuments: this.getRequiredDocuments(licenseType),
      fees: this.calculateFees(licenseType),
      conditions: licenseData.conditions || [],
      businessActivity: licenseData.businessActivity || [],
      location: licenseData.location || this.getDefaultLocation(),
      notifications: []
    };

    // Create initial renewal reminder
    this.scheduleRenewalReminder(license);

    return license;
  }

  /**
   * Generate unique license ID
   */
  private generateLicenseId(): string {
    return `LIC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate license number
   */
  private generateLicenseNumber(licenseTypeCode: string): string {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${licenseTypeCode}-${year}-${sequence}`;
  }

  /**
   * Get default issuing authority for license category
   */
  private getDefaultAuthority(category: string): IssuingAuthority {
    switch (category) {
      case 'trade':
      case 'manufacturing':
      case 'import_export':
        return this.ISSUING_AUTHORITIES.get('moti')!;
      case 'service':
        return this.ISSUING_AUTHORITIES.get('city_admin')!;
      default:
        return this.ISSUING_AUTHORITIES.get('woreda_admin')!;
    }
  }

  /**
   * Get required documents for license type
   */
  private getRequiredDocuments(licenseType: LicenseType): RequiredDocument[] {
    const commonDocs: RequiredDocument[] = [
      {
        documentType: 'business_registration',
        description: 'Business Registration Certificate',
        mandatory: true,
        format: 'certified_copy',
        validityPeriod: 60,
        issuingAuthority: 'Ministry of Trade and Industry',
        status: 'pending'
      },
      {
        documentType: 'tin_certificate',
        description: 'Tax Identification Number Certificate',
        mandatory: true,
        format: 'certified_copy',
        validityPeriod: 12,
        issuingAuthority: 'Ethiopian Revenue and Customs Authority',
        status: 'pending'
      },
      {
        documentType: 'memorandum',
        description: 'Memorandum and Articles of Association',
        mandatory: true,
        format: 'notarized',
        status: 'pending'
      }
    ];

    // Add specific documents based on license type
    const specificDocs: RequiredDocument[] = [];
    
    switch (licenseType.category) {
      case 'manufacturing':
        specificDocs.push({
          documentType: 'environmental_permit',
          description: 'Environmental Impact Assessment Permit',
          mandatory: true,
          format: 'original',
          validityPeriod: 24,
          issuingAuthority: 'Environmental Protection Authority',
          status: 'pending'
        });
        break;
      
      case 'import_export':
        specificDocs.push({
          documentType: 'bank_guarantee',
          description: 'Bank Guarantee Letter',
          mandatory: true,
          format: 'original',
          validityPeriod: 12,
          issuingAuthority: 'Commercial Bank',
          status: 'pending'
        });
        break;
      
      case 'construction':
        specificDocs.push({
          documentType: 'engineer_certificate',
          description: 'Professional Engineer Certificate',
          mandatory: true,
          format: 'certified_copy',
          validityPeriod: 36,
          issuingAuthority: 'Ethiopian Engineers Association',
          status: 'pending'
        });
        break;
    }

    return [...commonDocs, ...specificDocs];
  }

  /**
   * Calculate license fees
   */
  private calculateFees(licenseType: LicenseType): LicenseFees {
    const baseFee = licenseType.requiredCapital * 0.001; // 0.1% of required capital
    
    return {
      applicationFee: 500,
      licenseFee: baseFee,
      renewalFee: baseFee * 0.8,
      lateFee: baseFee * 0.25,
      inspectionFee: licenseType.category === 'manufacturing' ? 1000 : undefined,
      additionalFees: {},
      totalPaid: 0,
      paymentHistory: []
    };
  }

  /**
   * Get default location
   */
  private getDefaultLocation(): BusinessLocation {
    return {
      region: '',
      woreda: '',
      kebele: '',
      specificLocation: '',
      zoning: 'commercial'
    };
  }

  /**
   * Schedule renewal reminder
   */
  private scheduleRenewalReminder(license: BusinessLicense): void {
    const reminderDate = new Date(license.expiryDate);
    reminderDate.setDate(reminderDate.getDate() - license.licenseType.renewalNotice);

    const notification: LicenseNotification = {
      id: this.generateNotificationId(),
      type: 'renewal_reminder',
      title: 'License Renewal Reminder',
      message: `Your ${license.licenseType.name} is due for renewal on ${license.expiryDate.toLocaleDateString()}`,
      date: reminderDate,
      urgency: 'medium',
      read: false,
      actionRequired: true,
      dueDate: license.expiryDate
    };

    license.notifications.push(notification);
  }

  /**
   * Generate notification ID
   */
  private generateNotificationId(): string {
    return `NOT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }

  /**
   * Renew license
   */
  renewLicense(licenseId: string, renewalData: Partial<RenewalRecord>): BusinessLicense | null {
    // In a real implementation, this would fetch from database
    const license = this.getLicenseById(licenseId);
    if (!license) {
      return null;
    }

    const previousExpiryDate = new Date(license.expiryDate);
    const newExpiryDate = new Date(previousExpiryDate);
    newExpiryDate.setMonth(newExpiryDate.getMonth() + license.licenseType.validityPeriod);

    const renewal: RenewalRecord = {
      renewalDate: new Date(),
      previousExpiryDate,
      newExpiryDate,
      feesPaid: renewalData.feesPaid || license.fees.renewalFee,
      renewalOfficer: renewalData.renewalOfficer || 'System',
      notes: renewalData.notes
    };

    license.renewalHistory.push(renewal);
    license.expiryDate = newExpiryDate;
    license.status = 'active';

    // Update payment history
    license.fees.paymentHistory.push({
      date: new Date(),
      amount: renewal.feesPaid,
      paymentMethod: 'bank_transfer',
      receiptNumber: this.generateReceiptNumber(),
      purpose: 'License Renewal'
    });

    license.fees.totalPaid += renewal.feesPaid;

    // Schedule next renewal reminder
    this.scheduleRenewalReminder(license);

    return license;
  }

  /**
   * Generate receipt number
   */
  private generateReceiptNumber(): string {
    return `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }

  /**
   * Get license by ID (mock implementation)
   */
  private getLicenseById(licenseId: string): BusinessLicense | null {
    // Mock implementation - in reality, this would query database
    return null;
  }

  /**
   * Check license expiry status
   */
  checkExpiryStatus(license: BusinessLicense): { status: string; daysToExpiry: number; urgency: string } {
    const today = new Date();
    const daysToExpiry = Math.ceil((license.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let status: string;
    let urgency: string;

    if (daysToExpiry < 0) {
      status = 'expired';
      urgency = 'critical';
    } else if (daysToExpiry <= 7) {
      status = 'critical_renewal';
      urgency = 'critical';
    } else if (daysToExpiry <= 30) {
      status = 'renewal_due';
      urgency = 'high';
    } else if (daysToExpiry <= 60) {
      status = 'renewal_notice';
      urgency = 'medium';
    } else {
      status = 'active';
      urgency = 'low';
    }

    return { status, daysToExpiry, urgency };
  }

  /**
   * Get renewal requirements
   */
  getRenewalRequirements(license: BusinessLicense): { documents: RequiredDocument[]; fees: number; additionalRequirements: string[] } {
    const documents: RequiredDocument[] = [
      {
        documentType: 'renewal_application',
        description: 'License Renewal Application Form',
        mandatory: true,
        format: 'original',
        status: 'pending'
      },
      {
        documentType: 'current_license',
        description: 'Current License Certificate',
        mandatory: true,
        format: 'original',
        status: 'pending'
      },
      {
        documentType: 'tax_clearance',
        description: 'Tax Clearance Certificate',
        mandatory: true,
        format: 'certified_copy',
        validityPeriod: 6,
        issuingAuthority: 'Ethiopian Revenue and Customs Authority',
        status: 'pending'
      }
    ];

    const additionalRequirements: string[] = [];

    // Add category-specific requirements
    switch (license.licenseType.category) {
      case 'manufacturing':
        documents.push({
          documentType: 'environmental_compliance',
          description: 'Environmental Compliance Certificate',
          mandatory: true,
          format: 'certified_copy',
          validityPeriod: 12,
          issuingAuthority: 'Environmental Protection Authority',
          status: 'pending'
        });
        additionalRequirements.push('Site inspection may be required');
        break;
      
      case 'import_export':
        documents.push({
          documentType: 'customs_compliance',
          description: 'Customs Compliance Certificate',
          mandatory: true,
          format: 'certified_copy',
          validityPeriod: 6,
          issuingAuthority: 'Ethiopian Revenue and Customs Authority',
          status: 'pending'
        });
        break;
    }

    return {
      documents,
      fees: license.fees.renewalFee,
      additionalRequirements
    };
  }

  /**
   * Generate license tracking report
   */
  generateTrackingReport(licenses: BusinessLicense[]): {
    summary: { total: number; active: number; expiringSoon: number; expired: number };
    expiringLicenses: BusinessLicense[];
    expiredLicenses: BusinessLicense[];
    renewalSchedule: Array<{ license: BusinessLicense; renewalDate: Date; urgency: string }>;
  } {
    const active = licenses.filter(l => l.status === 'active').length;
    const expiringSoon = licenses.filter(l => {
      const daysToExpiry = Math.ceil((l.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysToExpiry <= 30 && daysToExpiry > 0;
    });
    const expired = licenses.filter(l => l.expiryDate < new Date());

    const renewalSchedule = licenses
      .filter(l => l.status === 'active')
      .map(license => {
        const expiryStatus = this.checkExpiryStatus(license);
        return {
          license,
          renewalDate: license.expiryDate,
          urgency: expiryStatus.urgency
        };
      })
      .sort((a, b) => a.renewalDate.getTime() - b.renewalDate.getTime());

    return {
      summary: {
        total: licenses.length,
        active,
        expiringSoon: expiringSoon.length,
        expired: expired.length
      },
      expiringLicenses: expiringSoon,
      expiredLicenses: expired,
      renewalSchedule
    };
  }

  /**
   * Get available license types
   */
  getAvailableLicenseTypes(): LicenseType[] {
    return Array.from(this.LICENSE_TYPES.values());
  }

  /**
   * Get available issuing authorities
   */
  getAvailableAuthorities(): IssuingAuthority[] {
    return Array.from(this.ISSUING_AUTHORITIES.values());
  }

  /**
   * Validate license application
   */
  validateLicenseApplication(application: Partial<BusinessLicense>): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (!application.businessName) {
      errors.push('Business name is required');
    }

    if (!application.businessTIN) {
      errors.push('Business TIN is required');
    }

    if (!application.licenseType) {
      errors.push('License type is required');
    }

    if (!application.location?.region) {
      errors.push('Business location region is required');
    }

    if (!application.location?.woreda) {
      errors.push('Business location woreda is required');
    }

    // Business name validation
    if (application.businessName && application.businessName.length < 3) {
      errors.push('Business name must be at least 3 characters long');
    }

    // TIN validation
    if (application.businessTIN && !/^\d{10}$/.test(application.businessTIN)) {
      errors.push('TIN must be 10 digits');
    }

    // Capital requirement check
    if (application.licenseType && application.licenseType.requiredCapital > 0) {
      warnings.push(`Minimum capital requirement: ETB ${application.licenseType.requiredCapital.toLocaleString()}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Export singleton instance
export const ethiopianBusinessLicenseService = new EthiopianBusinessLicenseService();

// Export utility functions
export const createBusinessLicense = (licenseData: Partial<BusinessLicense>): BusinessLicense => {
  return ethiopianBusinessLicenseService.createLicense(licenseData);
};

export const renewBusinessLicense = (licenseId: string, renewalData: Partial<RenewalRecord>): BusinessLicense | null => {
  return ethiopianBusinessLicenseService.renewLicense(licenseId, renewalData);
};

export const checkLicenseExpiry = (license: BusinessLicense) => {
  return ethiopianBusinessLicenseService.checkExpiryStatus(license);
};

export const validateLicenseApplication = (application: Partial<BusinessLicense>) => {
  return ethiopianBusinessLicenseService.validateLicenseApplication(application);
};
