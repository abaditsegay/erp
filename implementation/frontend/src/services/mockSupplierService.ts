/**
 * Mock Supplier Service for Ethiopian ERP System
 * Provides mock data and services for supplier management
 */

export interface SupplierAddress {
  street: string;
  city: string;
  region: string;
  country: string;
  postalCode?: string;
  poBox?: string;
}

export interface SupplierContact {
  name: string;
  position: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface Supplier {
  id: number;
  code: string;
  name: string;
  type: 'manufacturer' | 'distributor' | 'wholesaler' | 'retailer' | 'service_provider';
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  taxId?: string;
  businessLicense?: string;
  address: SupplierAddress;
  contacts: SupplierContact[];
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    branch: string;
  };
  active: boolean;
  rating: number; // 1-5 stars
  paymentTerms: string;
  leadTimeDays: number;
  minimumOrderAmount: number;
  currency: 'ETB' | 'USD' | 'EUR';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Ethiopian specific fields
  ercaRegistration?: string;
  isImporter: boolean;
  isExporter: boolean;
  specializations: string[];
}

// Ethiopian regions and cities
const ETHIOPIAN_REGIONS = [
  'Addis Ababa',
  'Afar',
  'Amhara', 
  'Benishangul-Gumuz',
  'Dire Dawa',
  'Gambela',
  'Harari',
  'Oromia',
  'Sidama',
  'SNNPR',
  'Somali',
  'Tigray',
];

const ETHIOPIAN_CITIES = {
  'Addis Ababa': ['Addis Ababa'],
  'Afar': ['Semera', 'Assab', 'Awash'],
  'Amhara': ['Bahir Dar', 'Gondar', 'Dessie', 'Debre Markos'],
  'Benishangul-Gumuz': ['Assosa', 'Metekel'],
  'Dire Dawa': ['Dire Dawa'],
  'Gambela': ['Gambela'],
  'Harari': ['Harar'],
  'Oromia': ['Adama', 'Jimma', 'Nekemte', 'Bishoftu', 'Shashamane'],
  'Sidama': ['Hawassa', 'Yirgalem'],
  'SNNPR': ['Wolayta Sodo', 'Arba Minch', 'Hosaena'],
  'Somali': ['Jijiga', 'Kebri Dehar'],
  'Tigray': ['Mekelle', 'Axum', 'Shire'],
};

// Business categories common in Ethiopia
const BUSINESS_CATEGORIES = [
  'Agriculture & Farming',
  'Coffee & Spices',
  'Textiles & Clothing',
  'Construction Materials',
  'Electronics & Technology',
  'Automotive & Transport',
  'Food & Beverages',
  'Pharmaceuticals & Medical',
  'Mining & Minerals',
  'Manufacturing',
  'Import & Export',
  'Logistics & Shipping',
  'Energy & Utilities',
  'Banking & Finance',
  'Telecommunications',
  'Hospitality & Tourism',
  'Education & Training',
  'Professional Services',
];

// Mock supplier data
const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    code: 'SUP-001',
    name: 'Awash Trading PLC',
    type: 'distributor',
    category: 'Import & Export',
    contactPerson: 'Tekle Haile',
    email: 'info@awashtrading.com',
    phone: '+251-11-123-4567',
    website: 'www.awashtrading.com',
    taxId: 'TIN-0001234567',
    businessLicense: 'BL-2024-001',
    address: {
      street: 'Bole Road, Next to Edna Mall',
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      country: 'Ethiopia',
      postalCode: '1000',
      poBox: 'P.O. Box 12345',
    },
    contacts: [
      {
        name: 'Tekle Haile',
        position: 'General Manager',
        phone: '+251-11-123-4567',
        email: 'tekle@awashtrading.com',
        isPrimary: true,
      },
      {
        name: 'Sara Tadesse',
        position: 'Sales Manager',
        phone: '+251-11-123-4568',
        email: 'sara@awashtrading.com',
        isPrimary: false,
      },
    ],
    bankDetails: {
      bankName: 'Commercial Bank of Ethiopia',
      accountNumber: '1000123456789',
      branch: 'Bole Branch',
    },
    active: true,
    rating: 4.5,
    paymentTerms: 'Net 30',
    leadTimeDays: 15,
    minimumOrderAmount: 5000,
    currency: 'ETB',
    notes: 'Reliable supplier for electronics and office equipment',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-08-20T10:30:00Z',
    ercaRegistration: 'ERCA-2024-001',
    isImporter: true,
    isExporter: false,
    specializations: ['Electronics', 'Office Equipment', 'Computer Hardware'],
  },
  {
    id: 2,
    code: 'SUP-002',
    name: 'Ethiopian Coffee Export Enterprise',
    type: 'manufacturer',
    category: 'Coffee & Spices',
    contactPerson: 'Meron Assefa',
    email: 'info@coffeexport.et',
    phone: '+251-11-234-5678',
    website: 'www.ethiopiancoffee.com',
    taxId: 'TIN-0002345678',
    businessLicense: 'BL-2024-002',
    address: {
      street: 'Mexico Square, Coffee Building',
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      country: 'Ethiopia',
      postalCode: '1001',
      poBox: 'P.O. Box 23456',
    },
    contacts: [
      {
        name: 'Meron Assefa',
        position: 'Export Manager',
        phone: '+251-11-234-5678',
        email: 'meron@coffeexport.et',
        isPrimary: true,
      },
    ],
    bankDetails: {
      bankName: 'Development Bank of Ethiopia',
      accountNumber: '2000234567890',
      branch: 'Mexico Branch',
    },
    active: true,
    rating: 5.0,
    paymentTerms: 'Net 15',
    leadTimeDays: 7,
    minimumOrderAmount: 10000,
    currency: 'USD',
    notes: 'Premium coffee supplier with international certifications',
    createdAt: '2024-02-10T09:15:00Z',
    updatedAt: '2024-08-22T14:20:00Z',
    ercaRegistration: 'ERCA-2024-002',
    isImporter: false,
    isExporter: true,
    specializations: ['Arabica Coffee', 'Organic Coffee', 'Specialty Coffee'],
  },
  {
    id: 3,
    code: 'SUP-003',
    name: 'Habesha Textiles Manufacturing',
    type: 'manufacturer',
    category: 'Textiles & Clothing',
    contactPerson: 'Dawit Bekele',
    email: 'contact@habeshtext.com',
    phone: '+251-11-345-6789',
    website: 'www.habeshtext.com',
    taxId: 'TIN-0003456789',
    businessLicense: 'BL-2024-003',
    address: {
      street: 'Industrial Zone, Akaki Kaliti',
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      country: 'Ethiopia',
      postalCode: '1002',
      poBox: 'P.O. Box 34567',
    },
    contacts: [
      {
        name: 'Dawit Bekele',
        position: 'Production Manager',
        phone: '+251-11-345-6789',
        email: 'dawit@habeshtext.com',
        isPrimary: true,
      },
    ],
    active: true,
    rating: 4.2,
    paymentTerms: 'Net 45',
    leadTimeDays: 21,
    minimumOrderAmount: 15000,
    currency: 'ETB',
    notes: 'Local textile manufacturer specializing in traditional and modern clothing',
    createdAt: '2024-03-05T11:30:00Z',
    updatedAt: '2024-08-18T16:45:00Z',
    ercaRegistration: 'ERCA-2024-003',
    isImporter: true,
    isExporter: false,
    specializations: ['Traditional Clothing', 'Cotton Textiles', 'Embroidery'],
  },
  {
    id: 4,
    code: 'SUP-004',
    name: 'Blue Nile Construction Materials',
    type: 'wholesaler',
    category: 'Construction Materials',
    contactPerson: 'Kidist Mulugeta',
    email: 'info@bluenilecon.com',
    phone: '+251-11-456-7890',
    website: 'www.bluenilecon.com',
    taxId: 'TIN-0004567890',
    businessLicense: 'BL-2024-004',
    address: {
      street: 'Ring Road, Near Stadium',
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      country: 'Ethiopia',
      postalCode: '1003',
      poBox: 'P.O. Box 45678',
    },
    contacts: [
      {
        name: 'Kidist Mulugeta',
        position: 'Sales Director',
        phone: '+251-11-456-7890',
        email: 'kidist@bluenilecon.com',
        isPrimary: true,
      },
    ],
    active: true,
    rating: 4.0,
    paymentTerms: 'Net 60',
    leadTimeDays: 10,
    minimumOrderAmount: 25000,
    currency: 'ETB',
    notes: 'Comprehensive construction materials supplier',
    createdAt: '2024-04-12T13:00:00Z',
    updatedAt: '2024-08-15T09:30:00Z',
    ercaRegistration: 'ERCA-2024-004',
    isImporter: true,
    isExporter: false,
    specializations: ['Cement', 'Steel', 'Building Materials'],
  },
  {
    id: 5,
    code: 'SUP-005',
    name: 'Shewa Distribution Services',
    type: 'distributor',
    category: 'Logistics & Shipping',
    contactPerson: 'Abebe Tesfaye',
    email: 'operations@shewadist.com',
    phone: '+251-11-567-8901',
    website: 'www.shewadist.com',
    taxId: 'TIN-0005678901',
    businessLicense: 'BL-2024-005',
    address: {
      street: 'Lebu Area, Industrial District',
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      country: 'Ethiopia',
      postalCode: '1004',
      poBox: 'P.O. Box 56789',
    },
    contacts: [
      {
        name: 'Abebe Tesfaye',
        position: 'Operations Manager',
        phone: '+251-11-567-8901',
        email: 'abebe@shewadist.com',
        isPrimary: true,
      },
    ],
    active: true,
    rating: 4.3,
    paymentTerms: 'Net 30',
    leadTimeDays: 5,
    minimumOrderAmount: 3000,
    currency: 'ETB',
    notes: 'Fast and reliable distribution services across Ethiopia',
    createdAt: '2024-05-20T15:45:00Z',
    updatedAt: '2024-08-20T12:15:00Z',
    ercaRegistration: 'ERCA-2024-005',
    isImporter: false,
    isExporter: false,
    specializations: ['Warehousing', 'Transportation', 'Last Mile Delivery'],
  },
];

// Mock service functions
class MockSupplierService {
  private suppliers: Supplier[] = [];
  private nextId = 6;
  private readonly STORAGE_KEY = 'erp_suppliers';

  constructor() {
    this.loadFromStorage();
  }

  // Load suppliers from localStorage or use default data
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.suppliers = data.suppliers || [...MOCK_SUPPLIERS];
        this.nextId = data.nextId || 6;
        console.log('MockSupplierService: Loaded from localStorage:', this.suppliers.length, 'suppliers');
      } else {
        this.suppliers = [...MOCK_SUPPLIERS];
        this.saveToStorage();
        console.log('MockSupplierService: Initialized with default data:', this.suppliers.length, 'suppliers');
      }
    } catch (error) {
      console.error('MockSupplierService: Error loading from storage, using defaults:', error);
      this.suppliers = [...MOCK_SUPPLIERS];
      this.saveToStorage();
    }
  }

  // Save suppliers to localStorage
  private saveToStorage(): void {
    try {
      const data = {
        suppliers: this.suppliers,
        nextId: this.nextId
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      console.log('MockSupplierService: Saved to localStorage');
    } catch (error) {
      console.error('MockSupplierService: Error saving to storage:', error);
    }
  }

  // Simulate API delay
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    await this.delay();
    console.log('MockSupplierService: getAllSuppliers called, returning', this.suppliers.length, 'suppliers');
    console.log('MockSupplierService: Current suppliers:', this.suppliers.map(s => s.name));
    return [...this.suppliers];
  }

  async getSupplierById(id: number): Promise<Supplier | null> {
    await this.delay();
    return this.suppliers.find(s => s.id === id) || null;
  }

  async createSupplier(supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> {
    await this.delay();
    
    console.log('MockSupplierService: Creating supplier with data:', supplierData);
    
    const newSupplier: Supplier = {
      ...supplierData,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.suppliers.push(newSupplier);
    this.saveToStorage(); // Persist to localStorage
    console.log('MockSupplierService: Supplier created and saved. Total suppliers now:', this.suppliers.length);
    console.log('MockSupplierService: New supplier:', newSupplier);
    
    return newSupplier;
  }

  async updateSupplier(id: number, supplierData: Partial<Supplier>): Promise<Supplier> {
    await this.delay();
    
    const index = this.suppliers.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Supplier not found');
    }
    
    this.suppliers[index] = {
      ...this.suppliers[index],
      ...supplierData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };
    
    this.saveToStorage(); // Persist to localStorage
    return this.suppliers[index];
  }

  async deleteSupplier(id: number): Promise<void> {
    await this.delay();
    
    const index = this.suppliers.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Supplier not found');
    }
    
    this.suppliers.splice(index, 1);
    this.saveToStorage(); // Persist to localStorage
  }

  async toggleSupplierStatus(id: number): Promise<Supplier> {
    await this.delay();
    
    const supplier = this.suppliers.find(s => s.id === id);
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    
    supplier.active = !supplier.active;
    supplier.updatedAt = new Date().toISOString();
    this.saveToStorage(); // Persist to localStorage
    
    return supplier;
  }

  // Search and filter functions
  async searchSuppliers(query: string): Promise<Supplier[]> {
    await this.delay(200);
    
    const lowercaseQuery = query.toLowerCase();
    return this.suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(lowercaseQuery) ||
      supplier.code.toLowerCase().includes(lowercaseQuery) ||
      supplier.category.toLowerCase().includes(lowercaseQuery) ||
      supplier.contactPerson.toLowerCase().includes(lowercaseQuery) ||
      supplier.email.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getSuppliersByCategory(category: string): Promise<Supplier[]> {
    await this.delay();
    return this.suppliers.filter(s => s.category === category);
  }

  async getSuppliersByRegion(region: string): Promise<Supplier[]> {
    await this.delay();
    return this.suppliers.filter(s => s.address.region === region);
  }

  // Generate supplier code
  generateSupplierCode(): string {
    const nextCode = `SUP-${String(this.nextId).padStart(3, '0')}`;
    return nextCode;
  }

  // Debug method to reset to default data
  resetToDefaults(): void {
    this.suppliers = [...MOCK_SUPPLIERS];
    this.nextId = 6;
    this.saveToStorage();
    console.log('MockSupplierService: Reset to default data');
  }

  // Debug method to clear all data
  clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.suppliers = [];
    this.nextId = 1;
    console.log('MockSupplierService: Cleared all data');
  }
}

// Export constants and service
export {
  ETHIOPIAN_REGIONS,
  ETHIOPIAN_CITIES,
  BUSINESS_CATEGORIES,
  MOCK_SUPPLIERS,
};

export const mockSupplierService = new MockSupplierService();
