/**
 * Ethiopian Government API Services Integration
 * Centralized access to all Ethiopian government system integrations
 */

// Import services
import { ercaService } from './ercaService';
import { nbeService } from './nbeService';
import { eicService } from './eicService';
import { eccService } from './eccService';
import { ftaService } from './ftaService';

// Core Government Services
export { ercaService, default as ERCAService } from './ercaService';
export { nbeService, default as NBEService } from './nbeService';
export { eicService, default as EICService } from './eicService';
export { eccService, default as ECCService } from './eccService';
export { ftaService, default as FTAService } from './ftaService';

// Type exports for ERCA (Ethiopian Revenue and Customs Authority)
export type {
  ERCAVATValidationRequest,
  ERCAVATValidationResponse,
  ERCATaxDeclarationRequest,
  ERCATaxDeclarationResponse,
  ERCACustomsDeclarationRequest,
  ERCACustomsDeclarationResponse
} from './ercaService';

// Type exports for NBE (National Bank of Ethiopia)
export type {
  NBEExchangeRateResponse,
  NBEForexPermitRequest,
  NBEForexPermitResponse,
  NBEComplianceCheckRequest,
  NBEComplianceCheckResponse
} from './nbeService';

// Type exports for EIC (Ethiopian Investment Commission)
export type {
  EICInvestmentPermitRequest,
  EICInvestmentPermitResponse,
  EICBusinessLicenseRequest,
  EICBusinessLicenseResponse
} from './eicService';

// Type exports for ECC (Ethiopian Customs Commission)
export type {
  ECCImportDeclarationRequest,
  ECCImportDeclarationResponse,
  ECCExportDeclarationRequest,
  ECCExportDeclarationResponse,
  ECCTrackingResponse,
  ECCTariffInquiry,
  ECCGoodsItem,
  ECCExportGoodsItem,
  ECCDocument
} from './eccService';

// Type exports for FTA (Federal Transport Authority)
export type {
  FTAVehicleRegistrationRequest,
  FTAVehicleRegistrationResponse,
  FTATransportPermitRequest,
  FTATransportPermitResponse,
  FTADriverLicenseRequest,
  FTADriverLicenseResponse,
  FTACargoPermitRequest,
  FTACargoPermitResponse,
  FTAVehicleInspectionRequest,
  FTAVehicleInspectionResponse,
  FTADocument,
  FTAFleetVehicle
} from './ftaService';

/**
 * Government Services Integration Manager
 * Provides unified access to all Ethiopian government services
 */
export class GovernmentServicesManager {
  /**
   * Get comprehensive business registration information
   */
  static async getBusinessRegistrationInfo(businessName: string) {
    try {
      const [ercaInfo, eicInfo] = await Promise.all([
        ercaService.validateVATNumber({
          vatNumber: 'ET' + businessName.replace(/\s+/g, '').slice(0, 10),
          businessName,
          businessType: 'PRIVATE_LIMITED_COMPANY'
        }),
        eicService.getInvestmentPermitStatus(businessName)
      ]);

      return {
        taxInfo: ercaInfo,
        licenseInfo: eicInfo,
        registrationComplete: ercaInfo.isValid && eicInfo.status === 'APPROVED'
      };
    } catch (error) {
      console.error('Error fetching business registration info:', error);
      throw error;
    }
  }

  /**
   * Get current exchange rates and banking compliance status
   */
  static async getBankingAndForexInfo() {
    try {
      const [exchangeRates, complianceCheck] = await Promise.all([
        nbeService.getExchangeRate('USD'),
        // Mock compliance check - NBE service doesn't have this method
        Promise.resolve({ status: 'COMPLIANT', notes: 'Mock compliance check' })
      ]);

      return {
        exchangeRates,
        complianceCheck,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching banking and forex info:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive import/export requirements
   */
  static async getTradeRequirements(hsCode: string) {
    try {
      const [tariffInfo, customsDeclaration] = await Promise.all([
        eccService.getTariffInfo(hsCode),
        ercaService.getCustomsClearanceStatus('DEMO123')
      ]);

      return {
        tariffInfo,
        customsDeclaration,
        totalDutyRate: tariffInfo.customsDutyRate + tariffInfo.vatRate + tariffInfo.surtaxRate
      };
    } catch (error) {
      console.error('Error fetching trade requirements:', error);
      throw error;
    }
  }

  /**
   * Get transport and logistics compliance requirements
   */
  static async getTransportCompliance(vehicleType: string, cargoType: string) {
    try {
      const [transportRoutes, permitRequirements] = await Promise.all([
        ftaService.getTransportRoutes(),
        ftaService.calculateTransportFees({
          permitType: cargoType,
          vehicleCount: 1,
          route: 'Addis Ababa - Dire Dawa',
          duration: 8
        })
      ]);

      return {
        availableRoutes: transportRoutes,
        feeStructure: permitRequirements,
        compliance: {
          vehicleRegistrationRequired: true,
          driverLicenseRequired: true,
          cargoPermitRequired: cargoType !== 'GENERAL',
          insuranceRequired: true
        }
      };
    } catch (error) {
      console.error('Error fetching transport compliance:', error);
      throw error;
    }
  }

  /**
   * Calculate total cost of business compliance
   */
  static async calculateBusinessComplianceCost(businessData: {
    investmentAmount: number;
    businessType: string;
    hasImportExport: boolean;
    hasTransport: boolean;
    numberOfEmployees: number;
  }) {
    try {
      const costs = {
        businessLicense: 5000, // EIC business license
        vatRegistration: 0,    // ERCA VAT registration (free)
        investmentPermit: businessData.investmentAmount * 0.001, // 0.1% of investment
        transportPermit: businessData.hasTransport ? 15000 : 0,
        importExportLicense: businessData.hasImportExport ? 10000 : 0,
        annualRenewal: 2500
      };

      const totalCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);

      return {
        breakdown: costs,
        totalCost,
        currency: 'ETB',
        validityPeriod: '1 year',
        renewalRequired: true
      };
    } catch (error) {
      console.error('Error calculating compliance cost:', error);
      throw error;
    }
  }

  /**
   * Get investment opportunities and incentives
   */
  static async getInvestmentOpportunities(sector: string, region: string) {
    try {
      const [opportunities, incentives] = await Promise.all([
        eicService.searchInvestmentOpportunities({ sector, region }),
        // Mock incentive information - EIC service doesn't have this method
        Promise.resolve([{ type: 'TAX_EXEMPTION', duration: '5 years', description: 'Income tax exemption' }])
      ]);

      return {
        opportunities,
        incentives,
        totalOpportunities: opportunities.length,
        averageIncentiveValue: incentives.reduce((sum: number, inc: any) => sum + (inc.value || 0), 0) / incentives.length
      };
    } catch (error) {
      console.error('Error fetching investment opportunities:', error);
      throw error;
    }
  }

  /**
   * Validate business compliance across all government services
   */
  static async validateBusinessCompliance(businessId: string) {
    try {
      const validationResults = await Promise.allSettled([
        ercaService.validateVATNumber({
          vatNumber: 'ET' + businessId.replace(/\s+/g, '').slice(0, 10),
          businessName: businessId,
          businessType: 'PRIVATE_LIMITED_COMPANY'
        }),
        eicService.getInvestmentPermitStatus(businessId),
        // Mock compliance check - NBE service doesn't have this method
        Promise.resolve({ status: 'COMPLIANT', notes: 'Mock compliance check' })
      ]);

      const compliance = {
        tax: validationResults[0].status === 'fulfilled' && 
             (validationResults[0] as any).value?.valid,
        business: validationResults[1].status === 'fulfilled' && 
                 (validationResults[1] as any).value?.status === 'ACTIVE',
        banking: validationResults[2].status === 'fulfilled' && 
                (validationResults[2] as any).value?.compliant,
        overall: false
      };

      compliance.overall = compliance.tax && compliance.business && compliance.banking;

      return {
        compliance,
        details: validationResults,
        lastChecked: new Date().toISOString(),
        recommendations: this.getComplianceRecommendations(compliance)
      };
    } catch (error) {
      console.error('Error validating business compliance:', error);
      throw error;
    }
  }

  /**
   * Get compliance recommendations based on validation results
   */
  private static getComplianceRecommendations(compliance: any): string[] {
    const recommendations: string[] = [];

    if (!compliance.tax) {
      recommendations.push('Update VAT registration with ERCA');
      recommendations.push('Ensure all tax declarations are current');
    }

    if (!compliance.business) {
      recommendations.push('Renew business license with EIC');
      recommendations.push('Update business registration information');
    }

    if (!compliance.banking) {
      recommendations.push('Complete forex compliance requirements with NBE');
      recommendations.push('Update banking documentation');
    }

    if (compliance.overall) {
      recommendations.push('All compliance requirements are met');
      recommendations.push('Schedule regular compliance reviews');
    }

    return recommendations;
  }
}

export default GovernmentServicesManager;
