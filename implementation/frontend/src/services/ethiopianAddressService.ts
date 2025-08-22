// Ethiopian Address and Contact Management System
// Comprehensive address formatting and validation for Ethiopian business context

export type EthiopianRegion = 
  | 'Addis Ababa'
  | 'Afar'
  | 'Amhara'
  | 'Benishangul-Gumuz'
  | 'Dire Dawa'
  | 'Gambela'
  | 'Harari'
  | 'Oromia'
  | 'Sidama'
  | 'SNNP'
  | 'Somali'
  | 'Tigray';

export type AddressType = 'business' | 'residential' | 'government' | 'industrial' | 'commercial';

export interface EthiopianAddress {
  id?: string;
  type: AddressType;
  // Ethiopian specific address components
  kebele: string;           // Kebele (neighborhood administrative unit)
  woreda: string;           // Woreda (district)
  zone?: string;            // Zone (for regional states)
  region: EthiopianRegion;  // Regional state
  city: string;             // City/Town
  subcity?: string;         // Sub-city (mainly for Addis Ababa)
  
  // Standard address components
  streetAddress: string;    // Street name and number
  buildingName?: string;    // Building or complex name
  floor?: string;           // Floor number
  officeNumber?: string;    // Office/apartment number
  poBox?: string;           // P.O. Box number
  
  // Coordinates (optional)
  latitude?: number;
  longitude?: number;
  
  // Metadata
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EthiopianPhoneNumber {
  countryCode: string;      // +251 for Ethiopia
  operatorCode: string;     // 09, 07, etc.
  number: string;           // Remaining digits
  type: 'mobile' | 'landline' | 'fax';
  isPrimary: boolean;
  isVerified: boolean;
}

export interface EthiopianContact {
  id?: string;
  title?: string;           // Mr., Mrs., Dr., Ato, Weizero, etc.
  firstName: string;
  middleName?: string;      // Father's name (Ethiopian naming convention)
  lastName: string;         // Grandfather's name
  displayName: string;      // Full formatted name
  
  // Contact information
  email?: string;
  phoneNumbers: EthiopianPhoneNumber[];
  addresses: EthiopianAddress[];
  
  // Ethiopian specific
  organization?: string;
  position?: string;
  department?: string;
  
  // Metadata
  language: 'en' | 'am' | 'both';
  preferredContactMethod: 'phone' | 'email' | 'sms';
  businessHours?: {
    start: string;
    end: string;
    timezone: string;
  };
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Ethiopian Regional Information Types
interface RegionInfoBase {
  name: string;
  amharicName: string;
  type: string;
  capital: string;
  phonePrefix: string;
  timezone: string;
}

interface RegionWithZones extends RegionInfoBase {
  zones: string[];
}

interface RegionWithSubcities extends RegionInfoBase {
  subcities: string[];
}

interface RegionBasic extends RegionInfoBase {}

type RegionInfo = RegionWithZones | RegionWithSubcities | RegionBasic;

// Ethiopian Regional Information
export const ETHIOPIAN_REGIONS_INFO: Record<EthiopianRegion, RegionInfo> = {
  'Addis Ababa': {
    name: 'Addis Ababa',
    amharicName: 'አዲስ አበባ',
    type: 'city_state',
    capital: 'Addis Ababa',
    subcities: [
      'Arada', 'Addis Ketema', 'Akaky Kaliti', 'Bole', 'Gullele',
      'Kirkos', 'Kolfe Keranio', 'Lideta', 'Nifas Silk-Lafto', 'Yeka'
    ],
    phonePrefix: '011',
    timezone: 'EAT'
  },
  'Afar': {
    name: 'Afar',
    amharicName: 'አፋር',
    type: 'regional_state',
    capital: 'Semera',
    zones: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5'],
    phonePrefix: '033',
    timezone: 'EAT'
  },
  'Amhara': {
    name: 'Amhara',
    amharicName: 'አማራ',
    type: 'regional_state',
    capital: 'Bahir Dar',
    zones: [
      'North Gondar', 'South Gondar', 'West Gojam', 'East Gojam',
      'Awi', 'North Wollo', 'South Wollo', 'North Shewa',
      'Oromia Special Zone', 'Waghemra', 'Central Gondar'
    ],
    phonePrefix: '058',
    timezone: 'EAT'
  },
  'Benishangul-Gumuz': {
    name: 'Benishangul-Gumuz',
    amharicName: 'ቤንሻንጉል ጉሙዝ',
    type: 'regional_state',
    capital: 'Assosa',
    zones: ['Assosa', 'Kamashi', 'Metekel'],
    phonePrefix: '057',
    timezone: 'EAT'
  },
  'Dire Dawa': {
    name: 'Dire Dawa',
    amharicName: 'ድሬዳዋ',
    type: 'city_state',
    capital: 'Dire Dawa',
    phonePrefix: '025',
    timezone: 'EAT'
  },
  'Gambela': {
    name: 'Gambela',
    amharicName: 'ጋምቤላ',
    type: 'regional_state',
    capital: 'Gambela',
    zones: ['Anuak', 'Nuer', 'Majang'],
    phonePrefix: '047',
    timezone: 'EAT'
  },
  'Harari': {
    name: 'Harari',
    amharicName: 'ሐረሪ',
    type: 'regional_state',
    capital: 'Harar',
    phonePrefix: '025',
    timezone: 'EAT'
  },
  'Oromia': {
    name: 'Oromia',
    amharicName: 'ኦሮሚያ',
    type: 'regional_state',
    capital: 'Adama',
    zones: [
      'Arsi', 'Bale', 'Borena', 'East Hararghe', 'East Shewa',
      'East Wellega', 'Guji', 'Horo Gudru Wellega', 'Illubabor',
      'Jimma', 'Kellem Wellega', 'North Shewa', 'South West Shewa',
      'West Arsi', 'West Hararghe', 'West Shewa', 'West Wellega'
    ],
    phonePrefix: '022',
    timezone: 'EAT'
  },
  'Sidama': {
    name: 'Sidama',
    amharicName: 'ሲዳማ',
    type: 'regional_state',
    capital: 'Hawassa',
    phonePrefix: '046',
    timezone: 'EAT'
  },
  'SNNP': {
    name: 'Southern Nations, Nationalities, and Peoples',
    amharicName: 'የደቡብ ብሔር ብሔረሰቦች',
    type: 'regional_state',
    capital: 'Hawassa',
    zones: [
      'Bench Maji', 'Dawro', 'Gamo Gofa', 'Gedeo', 'Hadiya',
      'Kafa', 'Kembata Tembaro', 'Sheka', 'Silte', 'Wolaita'
    ],
    phonePrefix: '046',
    timezone: 'EAT'
  },
  'Somali': {
    name: 'Somali',
    amharicName: 'ሶማሊ',
    type: 'regional_state',
    capital: 'Jijiga',
    zones: [
      'Shinile', 'Jijiga', 'Degehabur', 'Warder', 'Korahe',
      'Gode', 'Afder', 'Liben', 'Doolo'
    ],
    phonePrefix: '025',
    timezone: 'EAT'
  },
  'Tigray': {
    name: 'Tigray',
    amharicName: 'ትግራይ',
    type: 'regional_state',
    capital: 'Mekelle',
    zones: [
      'Central Tigray', 'Eastern Tigray', 'Northwestern Tigray',
      'Southern Tigray', 'Western Tigray', 'Mekelle Special Zone'
    ],
    phonePrefix: '034',
    timezone: 'EAT'
  }
};

// Ethiopian Phone Number Operators
export const ETHIOPIAN_PHONE_OPERATORS = {
  'ethio_telecom_mobile': {
    name: 'Ethio Telecom Mobile',
    codes: ['091', '092', '093', '094'],
    type: 'mobile'
  },
  'safaricom_mobile': {
    name: 'Safaricom Ethiopia',
    codes: ['070'],
    type: 'mobile'
  },
  'ethio_telecom_landline': {
    name: 'Ethio Telecom Landline',
    codes: ['011', '022', '025', '033', '034', '046', '047', '057', '058'],
    type: 'landline'
  }
};

class EthiopianAddressService {
  /**
   * Format Ethiopian address for display
   */
  formatAddress(address: EthiopianAddress, useAmharic = false): string {
    const parts: string[] = [];
    
    // Building and street information
    if (address.buildingName) {
      parts.push(address.buildingName);
    }
    if (address.streetAddress) {
      parts.push(address.streetAddress);
    }
    if (address.floor) {
      parts.push(`Floor ${address.floor}`);
    }
    if (address.officeNumber) {
      parts.push(`Office ${address.officeNumber}`);
    }
    
    // Ethiopian administrative divisions
    if (address.kebele) {
      parts.push(`Kebele ${address.kebele}`);
    }
    if (address.subcity) {
      parts.push(address.subcity);
    }
    if (address.city) {
      parts.push(address.city);
    }
    if (address.woreda) {
      parts.push(`${address.woreda} Woreda`);
    }
    if (address.zone) {
      parts.push(`${address.zone} Zone`);
    }
    
    // Region
    const regionInfo = ETHIOPIAN_REGIONS_INFO[address.region];
    if (regionInfo) {
      parts.push(useAmharic ? regionInfo.amharicName : regionInfo.name);
    }
    
    // P.O. Box
    if (address.poBox) {
      parts.push(`P.O. Box ${address.poBox}`);
    }
    
    // Country
    parts.push(useAmharic ? 'ኢትዮጵያ' : 'Ethiopia');
    
    return parts.join(', ');
  }

  /**
   * Validate Ethiopian address
   */
  validateAddress(address: Partial<EthiopianAddress>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Required fields
    if (!address.kebele?.trim()) {
      errors.push('Kebele is required');
    }
    if (!address.woreda?.trim()) {
      errors.push('Woreda is required');
    }
    if (!address.region) {
      errors.push('Region is required');
    }
    if (!address.city?.trim()) {
      errors.push('City is required');
    }
    if (!address.streetAddress?.trim()) {
      errors.push('Street address is required');
    }
    
    // Validate region
    if (address.region && !ETHIOPIAN_REGIONS_INFO[address.region]) {
      errors.push('Invalid region');
    }
    
    // Validate subcity for Addis Ababa
    if (address.region === 'Addis Ababa' && address.subcity) {
      const regionInfo = ETHIOPIAN_REGIONS_INFO['Addis Ababa'];
      if ('subcities' in regionInfo && !regionInfo.subcities.includes(address.subcity)) {
        errors.push('Invalid subcity for Addis Ababa');
      }
    }
    
    // Validate zone for regional states
    if (address.region && address.zone) {
      const regionInfo = ETHIOPIAN_REGIONS_INFO[address.region];
      if ('zones' in regionInfo && !regionInfo.zones.includes(address.zone)) {
        errors.push(`Invalid zone for ${address.region} region`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get zones for a region
   */
  getZonesForRegion(region: EthiopianRegion): string[] {
    const regionInfo = ETHIOPIAN_REGIONS_INFO[region];
    return ('zones' in regionInfo) ? regionInfo.zones : [];
  }

  /**
   * Get subcities for Addis Ababa
   */
  getSubcitiesForAddisAbaba(): string[] {
    const regionInfo = ETHIOPIAN_REGIONS_INFO['Addis Ababa'];
    return ('subcities' in regionInfo) ? regionInfo.subcities : [];
  }

  /**
   * Format P.O. Box number
   */
  formatPOBox(poBox: string): string {
    // Remove any existing "P.O. Box" prefix and format consistently
    const cleanBox = poBox.replace(/^(P\.O\.\s*Box\s*|PO\s*Box\s*|Box\s*)/i, '').trim();
    return `P.O. Box ${cleanBox}`;
  }

  /**
   * Generate address suggestions based on input
   */
  getAddressSuggestions(region: EthiopianRegion, city?: string): Partial<EthiopianAddress>[] {
    const regionInfo = ETHIOPIAN_REGIONS_INFO[region];
    const suggestions: Partial<EthiopianAddress>[] = [];
    
    if (regionInfo) {
      // Add capital city suggestion
      suggestions.push({
        region,
        city: regionInfo.capital,
        woreda: `${regionInfo.capital} Woreda`
      });
      
      // Add zone-based suggestions
      if ('zones' in regionInfo) {
        regionInfo.zones.slice(0, 3).forEach((zone: string) => {
          suggestions.push({
            region,
            zone,
            city: city || regionInfo.capital,
            woreda: `${zone} Woreda`
          });
        });
      }
      
      // Add subcity suggestions for Addis Ababa
      if (region === 'Addis Ababa' && 'subcities' in regionInfo) {
        regionInfo.subcities.slice(0, 3).forEach((subcity: string) => {
          suggestions.push({
            region,
            city: 'Addis Ababa',
            subcity,
            woreda: `${subcity} Woreda`
          });
        });
      }
    }
    
    return suggestions;
  }
}

class EthiopianPhoneService {
  /**
   * Format Ethiopian phone number
   */
  formatPhoneNumber(phoneNumber: EthiopianPhoneNumber): string {
    const { countryCode, operatorCode, number } = phoneNumber;
    return `${countryCode}-${operatorCode}-${number}`;
  }

  /**
   * Parse phone number string
   */
  parsePhoneNumber(phoneString: string): Partial<EthiopianPhoneNumber> | null {
    // Remove all non-digit characters except +
    const cleaned = phoneString.replace(/[^\d+]/g, '');
    
    // Ethiopian phone number patterns
    const patterns = [
      /^\+251(\d{2})(\d{7})$/, // +251XXXXXXXXX
      /^251(\d{2})(\d{7})$/,   // 251XXXXXXXXX
      /^0(\d{2})(\d{7})$/,     // 0XXXXXXXXX
      /^(\d{2})(\d{7})$/       // XXXXXXXXX
    ];
    
    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        const operatorCode = match[1];
        const number = match[2];
        
        return {
          countryCode: '+251',
          operatorCode,
          number,
          type: this.getPhoneType(operatorCode),
          isPrimary: false,
          isVerified: false
        };
      }
    }
    
    return null;
  }

  /**
   * Validate Ethiopian phone number
   */
  validatePhoneNumber(phoneNumber: Partial<EthiopianPhoneNumber>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!phoneNumber.countryCode || phoneNumber.countryCode !== '+251') {
      errors.push('Invalid country code. Must be +251 for Ethiopia');
    }
    
    if (!phoneNumber.operatorCode) {
      errors.push('Operator code is required');
    } else if (!this.isValidOperatorCode(phoneNumber.operatorCode)) {
      errors.push('Invalid operator code for Ethiopia');
    }
    
    if (!phoneNumber.number) {
      errors.push('Phone number is required');
    } else if (!/^\d{7}$/.test(phoneNumber.number)) {
      errors.push('Phone number must be 7 digits');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get phone type based on operator code
   */
  private getPhoneType(operatorCode: string): 'mobile' | 'landline' | 'fax' {
    // Mobile numbers start with 09 or 07
    if (['091', '092', '093', '094', '070'].includes(operatorCode)) {
      return 'mobile';
    }
    // Landline numbers
    if (['011', '022', '025', '033', '034', '046', '047', '057', '058'].includes(operatorCode)) {
      return 'landline';
    }
    return 'landline'; // Default
  }

  /**
   * Check if operator code is valid
   */
  private isValidOperatorCode(operatorCode: string): boolean {
    const allCodes = Object.values(ETHIOPIAN_PHONE_OPERATORS)
      .flatMap(operator => operator.codes);
    return allCodes.includes(operatorCode);
  }

  /**
   * Get operator name from code
   */
  getOperatorName(operatorCode: string): string {
    for (const operator of Object.values(ETHIOPIAN_PHONE_OPERATORS)) {
      if (operator.codes.includes(operatorCode)) {
        return operator.name;
      }
    }
    return 'Unknown Operator';
  }
}

class EthiopianContactService {
  /**
   * Format Ethiopian full name
   */
  formatFullName(contact: Partial<EthiopianContact>): string {
    const parts: string[] = [];
    
    if (contact.title) {
      parts.push(contact.title);
    }
    if (contact.firstName) {
      parts.push(contact.firstName);
    }
    if (contact.middleName) {
      parts.push(contact.middleName);
    }
    if (contact.lastName) {
      parts.push(contact.lastName);
    }
    
    return parts.join(' ');
  }

  /**
   * Generate display name based on Ethiopian naming conventions
   */
  generateDisplayName(contact: Partial<EthiopianContact>): string {
    // Ethiopian naming: FirstName + Father'sName + Grandfather'sName
    const parts: string[] = [];
    
    if (contact.firstName) {
      parts.push(contact.firstName);
    }
    if (contact.middleName) {
      parts.push(contact.middleName); // Father's name
    }
    
    return parts.join(' ');
  }

  /**
   * Validate Ethiopian contact
   */
  validateContact(contact: Partial<EthiopianContact>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Required fields
    if (!contact.firstName?.trim()) {
      errors.push('First name is required');
    }
    if (!contact.lastName?.trim()) {
      errors.push('Last name is required');
    }
    
    // Email validation
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      errors.push('Invalid email format');
    }
    
    // Phone number validation
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      const phoneService = new EthiopianPhoneService();
      contact.phoneNumbers.forEach((phone, index) => {
        const validation = phoneService.validatePhoneNumber(phone);
        if (!validation.isValid) {
          errors.push(`Phone ${index + 1}: ${validation.errors.join(', ')}`);
        }
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export service instances
export const ethiopianAddressService = new EthiopianAddressService();
export const ethiopianPhoneService = new EthiopianPhoneService();
export const ethiopianContactService = new EthiopianContactService();

// Export utility functions
export const formatEthiopianAddress = (address: EthiopianAddress, useAmharic = false): string => {
  return ethiopianAddressService.formatAddress(address, useAmharic);
};

export const formatEthiopianPhone = (phone: EthiopianPhoneNumber): string => {
  return ethiopianPhoneService.formatPhoneNumber(phone);
};

export const parseEthiopianPhone = (phoneString: string): Partial<EthiopianPhoneNumber> | null => {
  return ethiopianPhoneService.parsePhoneNumber(phoneString);
};

export const getRegionInfo = (region: EthiopianRegion) => {
  return ETHIOPIAN_REGIONS_INFO[region];
};
