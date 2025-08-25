/**
 * Federal Transport Authority (FTA) API Integration
 * Handles transport permits, vehicle registration, driver licensing, and logistics compliance
 */

export interface FTAVehicleRegistrationRequest {
  ownerDetails: {
    name: string;
    nationalId: string;
    businessLicenseNumber?: string;
    address: string;
    phoneNumber: string;
    email: string;
  };
  vehicleDetails: {
    chassisNumber: string;
    engineNumber: string;
    make: string;
    model: string;
    year: number;
    color: string;
    vehicleType: 'PRIVATE' | 'COMMERCIAL' | 'FREIGHT' | 'PASSENGER' | 'TAXI' | 'BUS';
    fuelType: 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
    engineCapacity: number;
    seatingCapacity: number;
    loadCapacity?: number;
    importDocuments?: {
      declarationNumber: string;
      clearanceDate: string;
      dutyPaidCertificate: string;
    };
  };
  insuranceDetails: {
    insuranceCompany: string;
    policyNumber: string;
    coverageType: 'THIRD_PARTY' | 'COMPREHENSIVE';
    coverageAmount: number;
    expiryDate: string;
  };
  attachments: FTADocument[];
}

export interface FTAVehicleRegistrationResponse {
  registrationNumber: string;
  plateNumber: string;
  registrationDate: string;
  expiryDate: string;
  status: 'REGISTERED' | 'PENDING' | 'REJECTED';
  certificateNumber: string;
  roadWorthinessCertificate: string;
  annualFee: number;
  nextInspectionDue: string;
}

export interface FTATransportPermitRequest {
  operatorDetails: {
    companyName: string;
    businessLicenseNumber: string;
    vatNumber: string;
    address: string;
    phoneNumber: string;
    email: string;
    contactPerson: string;
  };
  permitType: 'FREIGHT' | 'PASSENGER' | 'TOURIST' | 'SPECIAL_CARGO' | 'DANGEROUS_GOODS';
  routeDetails: {
    origin: string;
    destination: string;
    route: string[];
    operatingRegions: string[];
    serviceType: 'REGULAR' | 'CHARTER' | 'OCCASIONAL';
  };
  vehicleFleet: FTAFleetVehicle[];
  serviceDetails: {
    operatingHours: string;
    frequency?: string;
    capacity: number;
    serviceStandards: string;
  };
  safetyCompliance: {
    safetyOfficer: string;
    safetyPolicyDocument: string;
    driverTrainingProgram: boolean;
    maintenanceSchedule: string;
    insuranceCoverage: number;
  };
  attachments: FTADocument[];
}

export interface FTAFleetVehicle {
  vehicleId: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  roadWorthinessCertificate: string;
  insurancePolicy: string;
  lastInspectionDate: string;
}

export interface FTATransportPermitResponse {
  permitNumber: string;
  permitType: string;
  issueDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'EXPIRED' | 'REVOKED';
  operatingConditions: string[];
  authorizedRoutes: string[];
  vehicleCount: number;
  annualFee: number;
  renewalDate: string;
}

export interface FTADriverLicenseRequest {
  personalDetails: {
    firstName: string;
    lastName: string;
    nationalId: string;
    dateOfBirth: string;
    nationality: string;
    address: string;
    phoneNumber: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phoneNumber: string;
    };
  };
  licenseCategory: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  applicationDetails: {
    licenseType: 'NEW' | 'RENEWAL' | 'UPGRADE' | 'REPLACEMENT';
    previousLicenseNumber?: string;
    expiryDate?: string;
    reasonForReplacement?: string;
  };
  medicalCertificate: {
    certificateNumber: string;
    issuingDoctor: string;
    healthFacility: string;
    issueDate: string;
    expiryDate: string;
    restrictions?: string[];
  };
  drivingTestResults?: {
    theoryTestScore: number;
    practicalTestScore: number;
    testDate: string;
    examinerName: string;
    testCenter: string;
  };
  attachments: FTADocument[];
}

export interface FTADriverLicenseResponse {
  licenseNumber: string;
  category: string;
  issueDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'PENDING';
  endorsements: string[];
  restrictions: string[];
  penaltyPoints: number;
  renewalEligible: boolean;
}

export interface FTADocument {
  documentType: string;
  documentNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate?: string;
  filePath: string;
}

export interface FTACargoPermitRequest {
  shipperDetails: {
    companyName: string;
    businessLicenseNumber: string;
    address: string;
    phoneNumber: string;
    email: string;
  };
  cargoDetails: {
    cargoType: 'GENERAL' | 'HAZARDOUS' | 'OVERSIZED' | 'LIVESTOCK' | 'FOOD_PRODUCTS';
    description: string;
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    value: number;
    packagingType: string;
    specialHandlingRequirements?: string[];
  };
  transportDetails: {
    origin: string;
    destination: string;
    route: string;
    estimatedDuration: string;
    transportMode: 'ROAD' | 'RAIL' | 'AIR' | 'MULTIMODAL';
  };
  vehicleDetails: {
    vehicleType: string;
    registrationNumber: string;
    driverLicenseNumber: string;
    driverName: string;
    carrierCompany: string;
    insuranceCoverage: number;
  };
  safetyMeasures: {
    securitySeals?: string[];
    gpsTracking: boolean;
    escorts?: string[];
    specialEquipment?: string[];
  };
}

export interface FTACargoPermitResponse {
  permitNumber: string;
  permitType: string;
  issueDate: string;
  validityPeriod: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  conditions: string[];
  inspectionPoints: string[];
  routeRestrictions?: string[];
  contactOfficer: {
    name: string;
    phoneNumber: string;
    station: string;
  };
}

export interface FTAVehicleInspectionRequest {
  vehicleDetails: {
    registrationNumber: string;
    ownerName: string;
    vehicleType: string;
    make: string;
    model: string;
    year: number;
  };
  inspectionType: 'ANNUAL' | 'ROADWORTHINESS' | 'SPECIAL' | 'ACCIDENT_DAMAGE';
  inspectionCenter: string;
  requestedDate: string;
  previousInspectionReport?: string;
}

export interface FTAVehicleInspectionResponse {
  inspectionNumber: string;
  scheduledDate: string;
  scheduledTime: string;
  inspectionCenter: string;
  inspectorName: string;
  estimatedDuration: string;
  requiredDocuments: string[];
  inspectionFee: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  results?: {
    overall: 'PASS' | 'FAIL' | 'CONDITIONAL';
    defects: string[];
    recommendations: string[];
    nextInspectionDue: string;
    certificateNumber?: string;
  };
}

class FTAService {
  private baseUrl = 'https://api.fta.gov.et/v1'; // Simulated endpoint
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string, data?: any): Promise<T> {
    try {
      // Simulate API call for development
      console.log(`FTA API Call: ${endpoint}`, data);
      
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
      console.error('FTA API Error:', error);
      throw new Error('Failed to communicate with FTA API');
    }
  }

  private getMockResponse(endpoint: string, data?: any): any {
    if (endpoint.includes('/vehicle/register')) {
      return {
        registrationNumber: `VR-${Date.now()}`,
        plateNumber: `AA-${Math.floor(Math.random() * 90000) + 10000}`,
        registrationDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'REGISTERED',
        certificateNumber: `CERT-${Date.now()}`,
        roadWorthinessCertificate: `RW-${Date.now()}`,
        annualFee: 2500,
        nextInspectionDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      };
    }

    if (endpoint.includes('/transport/permit')) {
      return {
        permitNumber: `TP-${Date.now()}`,
        permitType: data?.permitType || 'FREIGHT',
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
        operatingConditions: [
          'Must maintain insurance coverage',
          'Regular vehicle maintenance required',
          'Driver must have valid license',
          'Comply with weight limits'
        ],
        authorizedRoutes: data?.routeDetails?.route || ['Addis Ababa - Dire Dawa'],
        vehicleCount: data?.vehicleFleet?.length || 1,
        annualFee: 15000,
        renewalDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString()
      };
    }

    if (endpoint.includes('/driver/license')) {
      return {
        licenseNumber: `DL-${Date.now()}`,
        category: data?.licenseCategory || 'B',
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
        endorsements: [],
        restrictions: [],
        penaltyPoints: 0,
        renewalEligible: true
      };
    }

    if (endpoint.includes('/cargo/permit')) {
      return {
        permitNumber: `CP-${Date.now()}`,
        permitType: data?.cargoDetails?.cargoType || 'GENERAL',
        issueDate: new Date().toISOString(),
        validityPeriod: '30 days',
        status: 'APPROVED',
        conditions: [
          'Follow designated route',
          'Notify authorities at checkpoints',
          'Maintain cargo security',
          'Carry all required documents'
        ],
        inspectionPoints: [
          'Addis Ababa Checkpoint',
          'Adama Checkpoint',
          'Dire Dawa Checkpoint'
        ],
        contactOfficer: {
          name: 'Ato Teshome Bekele',
          phoneNumber: '+251-911-234567',
          station: 'Addis Ababa Transport Authority'
        }
      };
    }

    if (endpoint.includes('/vehicle/inspection')) {
      return {
        inspectionNumber: `INS-${Date.now()}`,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        scheduledTime: '10:00',
        inspectionCenter: 'Addis Ababa Vehicle Inspection Center',
        inspectorName: 'Ato Mulugeta Tadesse',
        estimatedDuration: '2 hours',
        requiredDocuments: [
          'Vehicle registration certificate',
          'Insurance policy',
          'Previous inspection report (if any)',
          'Owner identification'
        ],
        inspectionFee: 500,
        status: 'SCHEDULED'
      };
    }

    if (endpoint.includes('/routes')) {
      return [
        {
          routeId: 'R001',
          name: 'Addis Ababa - Dire Dawa',
          distance: 515,
          estimatedDuration: '8 hours',
          roadCondition: 'GOOD',
          checkpoints: ['Adama', 'Awash', 'Chiro'],
          restrictions: ['Weight limit: 40 tons', 'No night driving for hazardous cargo']
        },
        {
          routeId: 'R002',
          name: 'Addis Ababa - Mekelle',
          distance: 780,
          estimatedDuration: '12 hours',
          roadCondition: 'FAIR',
          checkpoints: ['Dessie', 'Kombolcha', 'Alamata'],
          restrictions: ['Escort required for oversized cargo']
        }
      ];
    }

    return {};
  }

  /**
   * Register a new vehicle
   */
  async registerVehicle(request: FTAVehicleRegistrationRequest): Promise<FTAVehicleRegistrationResponse> {
    return this.makeRequest<FTAVehicleRegistrationResponse>('/vehicle/register', request);
  }

  /**
   * Apply for transport permit
   */
  async applyTransportPermit(request: FTATransportPermitRequest): Promise<FTATransportPermitResponse> {
    return this.makeRequest<FTATransportPermitResponse>('/transport/permit', request);
  }

  /**
   * Apply for driver license
   */
  async applyDriverLicense(request: FTADriverLicenseRequest): Promise<FTADriverLicenseResponse> {
    return this.makeRequest<FTADriverLicenseResponse>('/driver/license', request);
  }

  /**
   * Apply for cargo transport permit
   */
  async applyCargoPermit(request: FTACargoPermitRequest): Promise<FTACargoPermitResponse> {
    return this.makeRequest<FTACargoPermitResponse>('/cargo/permit', request);
  }

  /**
   * Schedule vehicle inspection
   */
  async scheduleInspection(request: FTAVehicleInspectionRequest): Promise<FTAVehicleInspectionResponse> {
    return this.makeRequest<FTAVehicleInspectionResponse>('/vehicle/inspection', request);
  }

  /**
   * Get available transport routes
   */
  async getTransportRoutes(): Promise<any[]> {
    return this.makeRequest('/routes');
  }

  /**
   * Get vehicle information by registration number
   */
  async getVehicleInfo(registrationNumber: string): Promise<any> {
    return this.makeRequest(`/vehicle/${registrationNumber}`);
  }

  /**
   * Get driver license information
   */
  async getDriverLicenseInfo(licenseNumber: string): Promise<any> {
    return this.makeRequest(`/driver/${licenseNumber}`);
  }

  /**
   * Check permit status
   */
  async checkPermitStatus(permitNumber: string): Promise<any> {
    return this.makeRequest(`/permit/status/${permitNumber}`);
  }

  /**
   * Get inspection centers
   */
  async getInspectionCenters(region?: string): Promise<any[]> {
    const endpoint = region ? `/inspection/centers?region=${region}` : '/inspection/centers';
    return this.makeRequest(endpoint);
  }

  /**
   * Calculate transport fees
   */
  async calculateTransportFees(request: {
    permitType: string;
    vehicleCount: number;
    route: string;
    duration: number;
  }): Promise<{
    baseFee: number;
    vehicleFee: number;
    routeFee: number;
    serviceFee: number;
    totalFee: number;
  }> {
    const baseFee = 5000;
    const vehicleFee = request.vehicleCount * 2000;
    const routeFee = 1000;
    const serviceFee = 500;

    return {
      baseFee,
      vehicleFee,
      routeFee,
      serviceFee,
      totalFee: baseFee + vehicleFee + routeFee + serviceFee
    };
  }

  /**
   * Get traffic violation history
   */
  async getViolationHistory(identifier: string, type: 'VEHICLE' | 'DRIVER'): Promise<any[]> {
    return this.makeRequest(`/violations/${type.toLowerCase()}/${identifier}`);
  }
}

export const ftaService = new FTAService(process.env.REACT_APP_FTA_API_KEY || 'demo-key');
export default FTAService;
