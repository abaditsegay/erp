/**
 * Ethiopian Investment Commission (EIC) API Integration
 * Handles investment permits, business licenses, and investment incentives
 */

export interface EICInvestmentPermitRequest {
  applicantDetails: {
    investorName: string;
    investorType: 'DOMESTIC' | 'FOREIGN' | 'JOINT_VENTURE';
    nationality: string;
    passportNumber?: string;
    businessLicenseNumber?: string;
    contactDetails: {
      address: string;
      phone: string;
      email: string;
      region: string;
      city: string;
    };
  };
  projectDetails: {
    projectName: string;
    projectType: string;
    sector: string;
    subSector: string;
    location: {
      region: string;
      zone: string;
      woreda: string;
      kebele: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    investmentCapital: {
      totalCapital: number;
      foreignCurrency: number;
      domesticCapital: number;
      currency: string;
    };
    employmentPlan: {
      directEmployment: number;
      indirectEmployment: number;
      skillLevels: {
        management: number;
        professional: number;
        skilled: number;
        unskilled: number;
      };
    };
    implementationSchedule: {
      startDate: string;
      completionDate: string;
      phases: EICProjectPhase[];
    };
  };
  requestedIncentives: string[];
  environmentalImpact: {
    hasEnvironmentalImpact: boolean;
    eiaRequired: boolean;
    eiaReferenceNumber?: string;
  };
}

export interface EICProjectPhase {
  phaseNumber: number;
  description: string;
  startDate: string;
  endDate: string;
  investmentAmount: number;
  milestones: string[];
}

export interface EICInvestmentPermitResponse {
  permitNumber: string;
  applicationNumber: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CONDITIONAL_APPROVAL';
  submissionDate: string;
  reviewDate?: string;
  approvalDate?: string;
  expiryDate?: string;
  approvedCapital: number;
  approvedIncentives: EICIncentive[];
  conditions: string[];
  reviewComments?: string[];
  nextSteps?: string[];
}

export interface EICIncentive {
  incentiveType: string;
  description: string;
  validityPeriod: string;
  monetaryValue?: number;
  conditions: string[];
}

export interface EICBusinessLicenseRequest {
  businessDetails: {
    businessName: string;
    businessType: string;
    legalForm: 'SOLE_PROPRIETORSHIP' | 'PRIVATE_LIMITED_COMPANY' | 'SHARE_COMPANY' | 'PARTNERSHIP' | 'COOPERATIVE';
    sector: string;
    subSector: string;
    businessActivities: string[];
  };
  ownershipDetails: {
    owners: EICOwner[];
    foreignOwnership: number; // Percentage
    domesticOwnership: number; // Percentage
  };
  capitalDetails: {
    authorizedCapital: number;
    paidUpCapital: number;
    currency: string;
  };
  locationDetails: {
    businessAddress: string;
    region: string;
    city: string;
    subcity: string;
    wereda: string;
    kebele: string;
    houseNumber: string;
    postalCode?: string;
  };
}

export interface EICOwner {
  name: string;
  nationality: string;
  ownershipPercentage: number;
  idType: 'PASSPORT' | 'NATIONAL_ID' | 'BUSINESS_LICENSE';
  idNumber: string;
  address: string;
  phoneNumber: string;
  email: string;
}

export interface EICBusinessLicenseResponse {
  licenseNumber: string;
  businessName: string;
  registrationNumber: string;
  tinNumber: string;
  vatNumber?: string;
  issuanceDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';
  businessType: string;
  legalForm: string;
  authorizedActivities: string[];
  licenseConditions: string[];
}

export interface EICInvestmentIncentiveRequest {
  permitNumber: string;
  incentiveType: 'TAX_EXEMPTION' | 'DUTY_FREE_IMPORT' | 'EXPORT_ALLOWANCE' | 'LAND_LEASE' | 'UTILITY_TARIFF';
  justification: string;
  supportingDocuments: string[];
  requestedDuration: number; // months
}

export interface EICInvestmentMonitoringReport {
  permitNumber: string;
  reportingPeriod: string;
  implementationProgress: {
    capitalUtilized: number;
    percentageComplete: number;
    employmentCreated: number;
    currentPhase: number;
    milestonesAchieved: string[];
    challengesFaced: string[];
  };
  financialPerformance: {
    revenue: number;
    exports: number;
    imports: number;
    taxesPaid: number;
    currency: string;
  };
  complianceStatus: {
    environmentalCompliance: boolean;
    laborCompliance: boolean;
    taxCompliance: boolean;
    investmentConditions: boolean;
    remarks?: string;
  };
}

class EICService {
  private baseUrl = 'https://api.investethiopia.gov.et/v1'; // Simulated endpoint
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string, data?: any): Promise<T> {
    try {
      // Simulate API call for development
      console.log(`EIC API Call: ${endpoint}`, data);
      
      // In production, this would be:
      // const response = await fetch(`${this.baseUrl}${endpoint}`, {
      //   method: data ? 'POST' : 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-API-Key': this.apiKey,
      //     'Accept': 'application/json'
      //   },
      //   body: data ? JSON.stringify(data) : undefined
      // });
      
      // For now, return mock responses
      return this.getMockResponse(endpoint, data) as T;
    } catch (error) {
      console.error('EIC API Error:', error);
      throw new Error('Failed to communicate with EIC API');
    }
  }

  private getMockResponse(endpoint: string, data?: any): any {
    if (endpoint.includes('/investment/permit')) {
      return {
        permitNumber: `EIC-IP-${Date.now()}`,
        applicationNumber: `APP-${Date.now()}`,
        status: 'SUBMITTED',
        submissionDate: new Date().toISOString(),
        approvedCapital: data?.projectDetails?.investmentCapital?.totalCapital || 0,
        approvedIncentives: [
          {
            incentiveType: 'Income Tax Exemption',
            description: '2-5 years income tax exemption',
            validityPeriod: '5 years',
            conditions: ['Maintain employment levels', 'Meet export targets']
          }
        ],
        conditions: [
          'Commence operations within 2 years',
          'Submit quarterly progress reports',
          'Maintain minimum employment levels'
        ],
        nextSteps: [
          'Obtain environmental clearance',
          'Apply for construction permit',
          'Register with tax authority'
        ]
      };
    }

    if (endpoint.includes('/business/license')) {
      return {
        licenseNumber: `BL-${Date.now()}`,
        businessName: data?.businessDetails?.businessName || 'Ethiopian Coffee Exporters Ltd',
        registrationNumber: `REG-${Date.now()}`,
        tinNumber: `TIN-${Date.now()}`,
        vatNumber: `VAT-${Date.now()}`,
        issuanceDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
        businessType: data?.businessDetails?.businessType || 'Manufacturing',
        legalForm: data?.businessDetails?.legalForm || 'PRIVATE_LIMITED_COMPANY',
        authorizedActivities: data?.businessDetails?.businessActivities || ['Coffee Processing', 'Export Trading'],
        licenseConditions: [
          'Comply with labor laws',
          'Maintain proper accounting records',
          'Pay taxes on time'
        ]
      };
    }

    if (endpoint.includes('/incentives/available')) {
      return [
        {
          incentiveType: 'Income Tax Exemption',
          description: 'Exemption from income tax for new investments',
          eligibilityCriteria: ['Minimum investment of 200,000 USD', 'Create at least 20 jobs'],
          duration: '2-8 years depending on sector and location',
          sectors: ['Manufacturing', 'Agro-processing', 'ICT', 'Tourism']
        },
        {
          incentiveType: 'Duty-Free Import',
          description: 'Exemption from customs duty for capital goods',
          eligibilityCriteria: ['Investment permit holder', 'Capital goods for the project'],
          duration: 'During implementation period',
          sectors: ['All sectors']
        },
        {
          incentiveType: 'Land Lease',
          description: 'Preferential land lease rates',
          eligibilityCriteria: ['Priority sector investment', 'Job creation commitment'],
          duration: 'Up to 99 years renewable',
          sectors: ['Manufacturing', 'Agriculture', 'Tourism']
        }
      ];
    }

    return {};
  }

  /**
   * Apply for investment permit
   */
  async applyForInvestmentPermit(request: EICInvestmentPermitRequest): Promise<EICInvestmentPermitResponse> {
    return this.makeRequest<EICInvestmentPermitResponse>('/investment/permit', request);
  }

  /**
   * Check investment permit status
   */
  async getInvestmentPermitStatus(permitNumber: string): Promise<EICInvestmentPermitResponse> {
    return this.makeRequest<EICInvestmentPermitResponse>(`/investment/permit/${permitNumber}`);
  }

  /**
   * Apply for business license
   */
  async applyForBusinessLicense(request: EICBusinessLicenseRequest): Promise<EICBusinessLicenseResponse> {
    return this.makeRequest<EICBusinessLicenseResponse>('/business/license', request);
  }

  /**
   * Validate business license
   */
  async validateBusinessLicense(licenseNumber: string): Promise<EICBusinessLicenseResponse> {
    return this.makeRequest<EICBusinessLicenseResponse>(`/business/license/${licenseNumber}`);
  }

  /**
   * Get available investment incentives
   */
  async getAvailableIncentives(sector?: string): Promise<EICIncentive[]> {
    const endpoint = sector ? `/incentives/available?sector=${sector}` : '/incentives/available';
    return this.makeRequest<EICIncentive[]>(endpoint);
  }

  /**
   * Apply for investment incentive
   */
  async applyForIncentive(request: EICInvestmentIncentiveRequest): Promise<any> {
    return this.makeRequest('/incentives/apply', request);
  }

  /**
   * Submit investment monitoring report
   */
  async submitMonitoringReport(report: EICInvestmentMonitoringReport): Promise<any> {
    return this.makeRequest('/investment/monitoring', report);
  }

  /**
   * Get investment statistics by sector
   */
  async getInvestmentStatistics(year?: number): Promise<any> {
    const endpoint = year ? `/statistics/investment?year=${year}` : '/statistics/investment';
    return this.makeRequest(endpoint);
  }

  /**
   * Search investment opportunities
   */
  async searchInvestmentOpportunities(criteria: {
    sector?: string;
    region?: string;
    minInvestment?: number;
    maxInvestment?: number;
  }): Promise<any[]> {
    return this.makeRequest('/opportunities/search', criteria);
  }
}

export const eicService = new EICService(process.env.REACT_APP_EIC_API_KEY || 'demo-key');
export default EICService;
