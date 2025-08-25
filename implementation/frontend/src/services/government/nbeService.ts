/**
 * National Bank of Ethiopia (NBE) API Integration
 * Handles exchange rates, forex permits, and banking compliance
 */

export interface NBEExchangeRateResponse {
  baseCurrency: string;
  targetCurrency: string;
  buyingRate: number;
  sellingRate: number;
  middleRate: number;
  effectiveDate: string;
  lastUpdated: string;
}

export interface NBEForexPermitRequest {
  applicantDetails: {
    businessName: string;
    vatNumber: string;
    businessLicense: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
  };
  transactionDetails: {
    amount: number;
    currency: string;
    purpose: 'IMPORT' | 'EXPORT' | 'SERVICE' | 'REMITTANCE' | 'INVESTMENT';
    description: string;
    beneficiaryDetails: {
      name: string;
      bankName: string;
      accountNumber: string;
      swiftCode: string;
      country: string;
    };
  };
  supportingDocuments: string[]; // Document reference numbers
}

export interface NBEForexPermitResponse {
  permitNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  approvalDate?: string;
  expiryDate?: string;
  approvedAmount: number;
  approvedCurrency: string;
  conditions: string[];
  remarks?: string;
}

export interface NBEComplianceCheckRequest {
  businessVATNumber: string;
  transactionType: 'FOREX_TRANSACTION' | 'LARGE_CASH_TRANSACTION' | 'INTERNATIONAL_TRANSFER';
  amount: number;
  currency: string;
  counterparty: {
    name: string;
    type: 'INDIVIDUAL' | 'BUSINESS' | 'GOVERNMENT';
    identifier: string; // VAT number, passport, etc.
    country?: string;
  };
}

export interface NBEComplianceCheckResponse {
  isCompliant: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  requiredDocuments: string[];
  additionalVerification: boolean;
  sanctionsCheck: {
    passed: boolean;
    details?: string;
  };
  amlCheck: {
    passed: boolean;
    details?: string;
  };
  remarks?: string[];
}

export interface NBEBankingLicenseValidation {
  bankCode: string;
  bankName: string;
  licenseNumber: string;
  isActive: boolean;
  licenseType: 'COMMERCIAL' | 'DEVELOPMENT' | 'MICROFINANCE' | 'SPECIALIZED';
  establishedDate: string;
  authorizedCapital: number;
  paidUpCapital: number;
  branches: number;
}

class NBEService {
  private baseUrl = 'https://api.nbe.gov.et/v1'; // Simulated endpoint
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string, data?: any): Promise<T> {
    try {
      // Simulate API call for development
      console.log(`NBE API Call: ${endpoint}`, data);
      
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
      console.error('NBE API Error:', error);
      throw new Error('Failed to communicate with NBE API');
    }
  }

  private getMockResponse(endpoint: string, data?: any): any {
    if (endpoint.includes('/exchange-rates')) {
      const currency = endpoint.split('/').pop() || 'USD';
      return {
        baseCurrency: 'ETB',
        targetCurrency: currency,
        buyingRate: currency === 'USD' ? 54.25 : currency === 'EUR' ? 58.30 : 45.20,
        sellingRate: currency === 'USD' ? 54.75 : currency === 'EUR' ? 58.80 : 45.70,
        middleRate: currency === 'USD' ? 54.50 : currency === 'EUR' ? 58.55 : 45.45,
        effectiveDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString()
      };
    }

    if (endpoint.includes('/forex/permit')) {
      return {
        permitNumber: `FP-${Date.now()}`,
        status: 'PENDING',
        approvedAmount: data?.transactionDetails?.amount || 0,
        approvedCurrency: data?.transactionDetails?.currency || 'USD',
        conditions: [
          'Transaction must be completed within 90 days',
          'Supporting documents must be submitted',
          'Compliance with forex regulations required'
        ],
        remarks: 'Application submitted for review'
      };
    }

    if (endpoint.includes('/compliance/check')) {
      return {
        isCompliant: true,
        riskLevel: 'LOW',
        requiredDocuments: [
          'Commercial Invoice',
          'Bill of Lading',
          'Import Permit',
          'Tax Clearance Certificate'
        ],
        additionalVerification: false,
        sanctionsCheck: {
          passed: true
        },
        amlCheck: {
          passed: true
        },
        remarks: ['Transaction appears legitimate', 'No red flags detected']
      };
    }

    if (endpoint.includes('/banks/validate')) {
      const bankCode = endpoint.split('/').pop();
      return {
        bankCode: bankCode,
        bankName: 'Commercial Bank of Ethiopia',
        licenseNumber: 'NBE-001',
        isActive: true,
        licenseType: 'COMMERCIAL',
        establishedDate: '1963-01-01',
        authorizedCapital: 5000000000,
        paidUpCapital: 3500000000,
        branches: 1800
      };
    }

    if (endpoint.includes('/exchange-rates/historical')) {
      // Return historical rates for the last 30 days
      const rates = [];
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        rates.push({
          date: date.toISOString().split('T')[0],
          USD: 54.50 + (Math.random() - 0.5) * 2,
          EUR: 58.55 + (Math.random() - 0.5) * 2,
          GBP: 45.45 + (Math.random() - 0.5) * 2
        });
      }
      return rates;
    }

    return {};
  }

  /**
   * Get current exchange rates for a specific currency
   */
  async getExchangeRate(currency: string): Promise<NBEExchangeRateResponse> {
    return this.makeRequest<NBEExchangeRateResponse>(`/exchange-rates/${currency}`);
  }

  /**
   * Get exchange rates for all major currencies
   */
  async getAllExchangeRates(): Promise<NBEExchangeRateResponse[]> {
    const currencies = ['USD', 'EUR', 'GBP', 'CNY', 'JPY'];
    const rates = await Promise.all(
      currencies.map(currency => this.getExchangeRate(currency))
    );
    return rates;
  }

  /**
   * Get historical exchange rates
   */
  async getHistoricalExchangeRates(currency: string, days: number = 30): Promise<any[]> {
    return this.makeRequest(`/exchange-rates/historical/${currency}?days=${days}`);
  }

  /**
   * Apply for forex permit
   */
  async applyForForexPermit(request: NBEForexPermitRequest): Promise<NBEForexPermitResponse> {
    return this.makeRequest<NBEForexPermitResponse>('/forex/permit', request);
  }

  /**
   * Check forex permit status
   */
  async getForexPermitStatus(permitNumber: string): Promise<NBEForexPermitResponse> {
    return this.makeRequest<NBEForexPermitResponse>(`/forex/permit/${permitNumber}`);
  }

  /**
   * Perform compliance check for transactions
   */
  async performComplianceCheck(request: NBEComplianceCheckRequest): Promise<NBEComplianceCheckResponse> {
    return this.makeRequest<NBEComplianceCheckResponse>('/compliance/check', request);
  }

  /**
   * Validate banking license
   */
  async validateBankingLicense(bankCode: string): Promise<NBEBankingLicenseValidation> {
    return this.makeRequest<NBEBankingLicenseValidation>(`/banks/validate/${bankCode}`);
  }

  /**
   * Convert amount using current exchange rate
   */
  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<{
    originalAmount: number;
    convertedAmount: number;
    fromCurrency: string;
    toCurrency: string;
    exchangeRate: number;
    timestamp: string;
  }> {
    let rate = 1;
    
    if (fromCurrency === 'ETB' && toCurrency !== 'ETB') {
      const exchangeRate = await this.getExchangeRate(toCurrency);
      rate = 1 / exchangeRate.middleRate;
    } else if (fromCurrency !== 'ETB' && toCurrency === 'ETB') {
      const exchangeRate = await this.getExchangeRate(fromCurrency);
      rate = exchangeRate.middleRate;
    } else if (fromCurrency !== 'ETB' && toCurrency !== 'ETB') {
      const fromRate = await this.getExchangeRate(fromCurrency);
      const toRate = await this.getExchangeRate(toCurrency);
      rate = fromRate.middleRate / toRate.middleRate;
    }

    return {
      originalAmount: amount,
      convertedAmount: amount * rate,
      fromCurrency,
      toCurrency,
      exchangeRate: rate,
      timestamp: new Date().toISOString()
    };
  }
}

export const nbeService = new NBEService(process.env.REACT_APP_NBE_API_KEY || 'demo-key');
export default NBEService;
