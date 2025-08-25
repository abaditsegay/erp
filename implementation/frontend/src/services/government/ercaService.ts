/**
 * Ethiopian Revenue and Customs Authority (ERCA) API Integration
 * Handles tax compliance, VAT validation, and customs declarations
 */

export interface ERCAVATValidationRequest {
  vatNumber: string;
  businessName: string;
  businessType: string;
}

export interface ERCAVATValidationResponse {
  isValid: boolean;
  businessName: string;
  registrationDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  taxPayerType: string;
  businessType: string;
  address: {
    region: string;
    city: string;
    subcity: string;
    wereda: string;
    kebele: string;
  };
}

export interface ERCATaxDeclarationRequest {
  vatNumber: string;
  declarationPeriod: string; // YYYY-MM format
  grossSales: number;
  exemptSales: number;
  taxableSupplies: number;
  inputVAT: number;
  outputVAT: number;
  netVATPayable: number;
  transactionDetails: ERCATransactionDetail[];
}

export interface ERCATransactionDetail {
  transactionId: string;
  date: string;
  customerVATNumber?: string;
  supplierVATNumber?: string;
  amount: number;
  vatAmount: number;
  transactionType: 'SALE' | 'PURCHASE' | 'IMPORT' | 'EXPORT';
  description: string;
  documentNumber: string;
}

export interface ERCATaxDeclarationResponse {
  declarationId: string;
  status: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'PENDING_REVIEW';
  submissionDate: string;
  assessmentAmount: number;
  dueDate: string;
  penaltyAmount?: number;
  errors?: string[];
}

export interface ERCACustomsDeclarationRequest {
  importerVATNumber: string;
  exporterDetails: {
    name: string;
    country: string;
    address: string;
  };
  shipmentDetails: {
    portOfEntry: string;
    transportMode: 'SEA' | 'AIR' | 'LAND';
    billOfLadingNumber: string;
    containerNumbers: string[];
  };
  goodsDetails: ERCAGoodsDetail[];
  totalValue: {
    amount: number;
    currency: string;
  };
  exchangeRate: number;
}

export interface ERCAGoodsDetail {
  hsCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitValue: number;
  totalValue: number;
  countryOfOrigin: string;
  customsDutyRate: number;
  exciseTaxRate: number;
  vatRate: number;
}

export interface ERCACustomsDeclarationResponse {
  declarationNumber: string;
  status: 'SUBMITTED' | 'UNDER_EXAMINATION' | 'ASSESSED' | 'CLEARED' | 'REJECTED';
  submissionDate: string;
  assessmentDetails: {
    customsDuty: number;
    exciseTax: number;
    vat: number;
    surtax: number;
    totalTaxes: number;
  };
  clearanceDate?: string;
  remarks?: string;
}

class ERCAService {
  private baseUrl = 'https://api.erca.gov.et/v1'; // Simulated endpoint
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string, data?: any): Promise<T> {
    try {
      // Simulate API call for development
      console.log(`ERCA API Call: ${endpoint}`, data);
      
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
      console.error('ERCA API Error:', error);
      throw new Error('Failed to communicate with ERCA API');
    }
  }

  private getMockResponse(endpoint: string, data?: any): any {
    if (endpoint.includes('/vat/validate')) {
      return {
        isValid: true,
        businessName: data?.businessName || 'Ethiopian Coffee Exporters Ltd',
        registrationDate: '2020-01-15',
        status: 'ACTIVE',
        taxPayerType: 'Category A',
        businessType: data?.businessType || 'Manufacturing',
        address: {
          region: 'Addis Ababa',
          city: 'Addis Ababa',
          subcity: 'Bole',
          wereda: '03',
          kebele: '05'
        }
      };
    }

    if (endpoint.includes('/tax/declare')) {
      return {
        declarationId: `ERCA-${Date.now()}`,
        status: 'SUBMITTED',
        submissionDate: new Date().toISOString(),
        assessmentAmount: data?.netVATPayable || 0,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        penaltyAmount: 0,
        errors: []
      };
    }

    if (endpoint.includes('/customs/declare')) {
      return {
        declarationNumber: `CD-${Date.now()}`,
        status: 'SUBMITTED',
        submissionDate: new Date().toISOString(),
        assessmentDetails: {
          customsDuty: data?.totalValue?.amount * 0.15 || 0,
          exciseTax: data?.totalValue?.amount * 0.05 || 0,
          vat: data?.totalValue?.amount * 0.15 || 0,
          surtax: data?.totalValue?.amount * 0.10 || 0,
          totalTaxes: data?.totalValue?.amount * 0.45 || 0
        },
        remarks: 'Declaration submitted successfully'
      };
    }

    return {};
  }

  /**
   * Validate VAT number with ERCA
   */
  async validateVATNumber(request: ERCAVATValidationRequest): Promise<ERCAVATValidationResponse> {
    return this.makeRequest<ERCAVATValidationResponse>('/vat/validate', request);
  }

  /**
   * Submit tax declaration to ERCA
   */
  async submitTaxDeclaration(request: ERCATaxDeclarationRequest): Promise<ERCATaxDeclarationResponse> {
    return this.makeRequest<ERCATaxDeclarationResponse>('/tax/declare', request);
  }

  /**
   * Submit customs declaration to ERCA
   */
  async submitCustomsDeclaration(request: ERCACustomsDeclarationRequest): Promise<ERCACustomsDeclarationResponse> {
    return this.makeRequest<ERCACustomsDeclarationResponse>('/customs/declare', request);
  }

  /**
   * Get tax payment status
   */
  async getTaxPaymentStatus(vatNumber: string, period: string): Promise<any> {
    return this.makeRequest(`/tax/payment-status/${vatNumber}/${period}`);
  }

  /**
   * Get customs clearance status
   */
  async getCustomsClearanceStatus(declarationNumber: string): Promise<any> {
    return this.makeRequest(`/customs/status/${declarationNumber}`);
  }
}

export const ercaService = new ERCAService(process.env.REACT_APP_ERCA_API_KEY || 'demo-key');
export default ERCAService;
