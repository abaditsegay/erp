/**
 * Ethiopian Customs Commission (ECC) API Integration
 * Handles import/export declarations, customs clearance, and trade facilitation
 */

export interface ECCImportDeclarationRequest {
  declarantDetails: {
    name: string;
    vatNumber: string;
    customsCode: string;
    licenseNumber: string;
    address: string;
    phoneNumber: string;
    email: string;
  };
  importerDetails: {
    name: string;
    vatNumber: string;
    businessLicenseNumber: string;
    importPermitNumber?: string;
    address: string;
  };
  supplierDetails: {
    name: string;
    address: string;
    country: string;
    phoneNumber?: string;
    email?: string;
  };
  shipmentDetails: {
    portOfEntry: string;
    transportMode: 'SEA' | 'AIR' | 'LAND';
    vesselName?: string;
    voyageNumber?: string;
    billOfLadingNumber: string;
    awbNumber?: string;
    containerNumbers: string[];
    packageCount: number;
    grossWeight: number;
    netWeight: number;
    manifestNumber: string;
  };
  goodsDetails: ECCGoodsItem[];
  valuation: {
    totalValue: number;
    currency: string;
    incoterms: string;
    freightCharges: number;
    insuranceCharges: number;
    exchangeRate: number;
  };
  attachments: ECCDocument[];
}

export interface ECCGoodsItem {
  itemNumber: number;
  hsCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitValue: number;
  totalValue: number;
  countryOfOrigin: string;
  brandName?: string;
  model?: string;
  serialNumber?: string;
  tareWeight: number;
  netWeight: number;
  packaging: string;
  markAndNumbers: string;
  preferentialTariff?: {
    applicable: boolean;
    certificateNumber?: string;
    scheme?: string;
  };
}

export interface ECCDocument {
  documentType: string;
  documentNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate?: string;
  filePath: string;
}

export interface ECCImportDeclarationResponse {
  declarationNumber: string;
  declarationDate: string;
  status: 'SUBMITTED' | 'UNDER_EXAMINATION' | 'ASSESSED' | 'PAYMENT_PENDING' | 'CLEARED' | 'REJECTED' | 'HELD';
  referenceNumber: string;
  examinerCode?: string;
  assessmentDetails: {
    customsDuty: number;
    exciseTax: number;
    vat: number;
    surtax: number;
    serviceCharge: number;
    totalTaxes: number;
    totalPayable: number;
  };
  clearanceDetails?: {
    clearanceDate: string;
    clearanceTime: string;
    gatePassNumber: string;
    exitPort: string;
  };
  remarks?: string;
  nextAction?: string;
}

export interface ECCExportDeclarationRequest {
  declarantDetails: {
    name: string;
    vatNumber: string;
    customsCode: string;
    licenseNumber: string;
    address: string;
    phoneNumber: string;
    email: string;
  };
  exporterDetails: {
    name: string;
    vatNumber: string;
    businessLicenseNumber: string;
    exportPermitNumber?: string;
    address: string;
  };
  consigneeDetails: {
    name: string;
    address: string;
    country: string;
    phoneNumber?: string;
    email?: string;
  };
  shipmentDetails: {
    portOfExit: string;
    transportMode: 'SEA' | 'AIR' | 'LAND';
    vesselName?: string;
    voyageNumber?: string;
    awbNumber?: string;
    containerNumbers: string[];
    packageCount: number;
    grossWeight: number;
    netWeight: number;
  };
  goodsDetails: ECCExportGoodsItem[];
  valuation: {
    totalValue: number;
    currency: string;
    incoterms: string;
    exchangeRate: number;
  };
  attachments: ECCDocument[];
}

export interface ECCExportGoodsItem {
  itemNumber: number;
  hsCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitValue: number;
  totalValue: number;
  originCriteria?: string;
  brandName?: string;
  grade?: string;
  tareWeight: number;
  netWeight: number;
  packaging: string;
  markAndNumbers: string;
}

export interface ECCExportDeclarationResponse {
  declarationNumber: string;
  declarationDate: string;
  status: 'SUBMITTED' | 'UNDER_EXAMINATION' | 'ASSESSED' | 'CLEARED' | 'REJECTED' | 'HELD';
  referenceNumber: string;
  examinerCode?: string;
  clearanceDetails?: {
    clearanceDate: string;
    clearanceTime: string;
    exitPermitNumber: string;
    exitPort: string;
  };
  exportEarnings?: {
    expectedAmount: number;
    currency: string;
    surrenderRequirement: number;
  };
  remarks?: string;
  nextAction?: string;
}

export interface ECCTrackingResponse {
  declarationNumber: string;
  currentStatus: string;
  statusHistory: ECCStatusHistory[];
  location: string;
  lastUpdate: string;
  estimatedClearanceTime?: string;
}

export interface ECCStatusHistory {
  status: string;
  timestamp: string;
  location: string;
  officer: string;
  remarks?: string;
}

export interface ECCTariffInquiry {
  hsCode: string;
  description: string;
  customsDutyRate: number;
  exciseTaxRate: number;
  vatRate: number;
  surtaxRate: number;
  serviceChargeRate: number;
  unitOfMeasure: string;
  restrictions?: string[];
  prohibitions?: string[];
  requiredDocuments: string[];
  preferentialRates?: {
    scheme: string;
    rate: number;
    conditions: string[];
  }[];
}

class ECCService {
  private baseUrl = 'https://api.customs.gov.et/v1'; // Simulated endpoint
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string, data?: any): Promise<T> {
    try {
      // Simulate API call for development
      console.log(`ECC API Call: ${endpoint}`, data);
      
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
      console.error('ECC API Error:', error);
      throw new Error('Failed to communicate with ECC API');
    }
  }

  private getMockResponse(endpoint: string, data?: any): any {
    if (endpoint.includes('/import/declare')) {
      const totalValue = data?.valuation?.totalValue || 100000;
      return {
        declarationNumber: `IMP-${Date.now()}`,
        declarationDate: new Date().toISOString(),
        status: 'SUBMITTED',
        referenceNumber: `REF-${Date.now()}`,
        assessmentDetails: {
          customsDuty: totalValue * 0.15,
          exciseTax: totalValue * 0.05,
          vat: totalValue * 0.15,
          surtax: totalValue * 0.10,
          serviceCharge: totalValue * 0.02,
          totalTaxes: totalValue * 0.47,
          totalPayable: totalValue * 0.47
        },
        remarks: 'Declaration submitted successfully for examination',
        nextAction: 'Wait for customs examination'
      };
    }

    if (endpoint.includes('/export/declare')) {
      return {
        declarationNumber: `EXP-${Date.now()}`,
        declarationDate: new Date().toISOString(),
        status: 'SUBMITTED',
        referenceNumber: `EXPREF-${Date.now()}`,
        exportEarnings: {
          expectedAmount: data?.valuation?.totalValue || 0,
          currency: data?.valuation?.currency || 'USD',
          surrenderRequirement: (data?.valuation?.totalValue || 0) * 0.5
        },
        remarks: 'Export declaration submitted for processing',
        nextAction: 'Arrange inspection if required'
      };
    }

    if (endpoint.includes('/track/')) {
      const declarationNumber = endpoint.split('/').pop();
      return {
        declarationNumber,
        currentStatus: 'UNDER_EXAMINATION',
        statusHistory: [
          {
            status: 'SUBMITTED',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            location: 'Customs House',
            officer: 'System',
            remarks: 'Declaration received'
          },
          {
            status: 'UNDER_EXAMINATION',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            location: 'Examination Unit',
            officer: 'Ahmed Hassan',
            remarks: 'Document verification in progress'
          }
        ],
        location: 'Bole International Airport',
        lastUpdate: new Date().toISOString(),
        estimatedClearanceTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
      };
    }

    if (endpoint.includes('/tariff/')) {
      const hsCode = endpoint.split('/').pop();
      return {
        hsCode,
        description: 'Coffee, not roasted, not decaffeinated',
        customsDutyRate: 0, // Coffee is often duty-free
        exciseTaxRate: 0,
        vatRate: 15,
        surtaxRate: 10,
        serviceChargeRate: 2,
        unitOfMeasure: 'KG',
        restrictions: ['Export permit required'],
        prohibitions: [],
        requiredDocuments: [
          'Export permit',
          'Phytosanitary certificate',
          'Certificate of origin',
          'Quality certificate'
        ],
        preferentialRates: [
          {
            scheme: 'AGOA',
            rate: 0,
            conditions: ['Origin rules compliance', 'Direct shipping']
          }
        ]
      };
    }

    if (endpoint.includes('/ports')) {
      return [
        {
          portCode: 'ETADD',
          portName: 'Addis Ababa Bole International Airport',
          portType: 'AIR',
          location: 'Addis Ababa',
          operatingHours: '24/7',
          services: ['Passenger', 'Cargo', 'Customs Clearance']
        },
        {
          portCode: 'DJJIB',
          portName: 'Djibouti Port',
          portType: 'SEA',
          location: 'Djibouti',
          operatingHours: '24/7',
          services: ['Container', 'Break Bulk', 'Customs Clearance']
        },
        {
          portCode: 'ETMOJ',
          portName: 'Modjo Dry Port',
          portType: 'DRY',
          location: 'Oromia',
          operatingHours: '06:00-22:00',
          services: ['Container', 'Customs Clearance', 'Storage']
        }
      ];
    }

    return {};
  }

  /**
   * Submit import declaration
   */
  async submitImportDeclaration(request: ECCImportDeclarationRequest): Promise<ECCImportDeclarationResponse> {
    return this.makeRequest<ECCImportDeclarationResponse>('/import/declare', request);
  }

  /**
   * Submit export declaration
   */
  async submitExportDeclaration(request: ECCExportDeclarationRequest): Promise<ECCExportDeclarationResponse> {
    return this.makeRequest<ECCExportDeclarationResponse>('/export/declare', request);
  }

  /**
   * Track declaration status
   */
  async trackDeclaration(declarationNumber: string): Promise<ECCTrackingResponse> {
    return this.makeRequest<ECCTrackingResponse>(`/track/${declarationNumber}`);
  }

  /**
   * Get tariff information for HS code
   */
  async getTariffInfo(hsCode: string): Promise<ECCTariffInquiry> {
    return this.makeRequest<ECCTariffInquiry>(`/tariff/${hsCode}`);
  }

  /**
   * Get available ports and their details
   */
  async getAvailablePorts(): Promise<any[]> {
    return this.makeRequest('/ports');
  }

  /**
   * Calculate customs duties and taxes
   */
  async calculateDutiesAndTaxes(request: {
    hsCode: string;
    value: number;
    currency: string;
    countryOfOrigin: string;
    quantity: number;
    unit: string;
  }): Promise<{
    customsDuty: number;
    exciseTax: number;
    vat: number;
    surtax: number;
    serviceCharge: number;
    totalTaxes: number;
    exchangeRate: number;
    valueInETB: number;
  }> {
    const tariffInfo = await this.getTariffInfo(request.hsCode);
    const exchangeRate = 54.50; // This would come from NBE in real implementation
    const valueInETB = request.value * exchangeRate;

    const customsDuty = valueInETB * (tariffInfo.customsDutyRate / 100);
    const exciseTax = valueInETB * (tariffInfo.exciseTaxRate / 100);
    const vatBase = valueInETB + customsDuty + exciseTax;
    const vat = vatBase * (tariffInfo.vatRate / 100);
    const surtax = valueInETB * (tariffInfo.surtaxRate / 100);
    const serviceCharge = valueInETB * (tariffInfo.serviceChargeRate / 100);

    return {
      customsDuty,
      exciseTax,
      vat,
      surtax,
      serviceCharge,
      totalTaxes: customsDuty + exciseTax + vat + surtax + serviceCharge,
      exchangeRate,
      valueInETB
    };
  }

  /**
   * Search HS codes by description
   */
  async searchHSCodes(description: string): Promise<{
    hsCode: string;
    description: string;
    level: number;
  }[]> {
    // Mock search results
    return [
      {
        hsCode: '0901.11',
        description: 'Coffee, not roasted, not decaffeinated',
        level: 6
      },
      {
        hsCode: '0901.12',
        description: 'Coffee, not roasted, decaffeinated',
        level: 6
      },
      {
        hsCode: '0901.21',
        description: 'Coffee, roasted, not decaffeinated',
        level: 6
      }
    ];
  }

  /**
   * Get declaration history for a declarant
   */
  async getDeclarationHistory(declarantCode: string, fromDate: string, toDate: string): Promise<any[]> {
    return this.makeRequest(`/declarations/history/${declarantCode}?from=${fromDate}&to=${toDate}`);
  }
}

export const eccService = new ECCService(process.env.REACT_APP_ECC_API_KEY || 'demo-key');
export default ECCService;
