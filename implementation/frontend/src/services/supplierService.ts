/**
 * Real Supplier Service for Ethiopian ERP System
 * Connects to the backend API for supplier management
 */

// Simple Supplier interface that matches the backend entity
export interface Supplier {
  id?: number;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  createdDate?: string;
  updatedDate?: string;
}

// Pagination interface for API responses
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

// Pagination parameters for API requests
export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

// Backend API configuration
const API_BASE_URL = 'http://localhost:8081/api';
const SUPPLIERS_ENDPOINT = `${API_BASE_URL}/suppliers`;

// Mock data for seeding if database is empty
const mockSuppliers: Omit<Supplier, 'id' | 'createdDate' | 'updatedDate'>[] = [
  {
    code: 'SUP001',
    name: 'ABC Electronics',
    contactPerson: 'John Smith',
    email: 'john@abcelectronics.com',
    phone: '+251-11-123-4567',
    address: '123 Main St, Addis Ababa',
    active: true
  },
  {
    code: 'SUP002',
    name: 'Ethiopian Coffee Co.',
    contactPerson: 'Maria Tadesse',
    email: 'maria@ethcoffee.com',
    phone: '+251-11-234-5678',
    address: '456 Coffee Ave, Jimma',
    active: true
  },
  {
    code: 'SUP003',
    name: 'Highland Textiles',
    contactPerson: 'David Alemayehu',
    email: 'david@highland.com',
    phone: '+251-11-345-6789',
    address: '789 Textile Rd, Hawassa',
    active: true
  },
  {
    code: 'SUP004',
    name: 'Addis Medical Supplies',
    contactPerson: 'Dr. Sarah Bekele',
    email: 'sarah@addismedical.com',
    phone: '+251-11-456-7890',
    address: '321 Health St, Addis Ababa',
    active: false
  },
  {
    code: 'SUP005',
    name: 'Blue Nile Construction',
    contactPerson: 'Ahmed Hassan',
    email: 'ahmed@bluenile.com',
    phone: '+251-11-567-8901',
    address: '654 Construction Blvd, Bahir Dar',
    active: true
  }
];

// API helper function
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

class SupplierService {
  private isSeeded = false;

  // Seed database with mock data if empty
  private async seedDatabaseIfEmpty(): Promise<void> {
    if (this.isSeeded) return;

    try {
      const stats = await this.getSupplierStats();
      if (stats.totalCount === 0) {
        console.log('Database is empty, seeding with mock suppliers...');
        
        for (const mockSupplier of mockSuppliers) {
          try {
            await this.createSupplier(mockSupplier);
            console.log(`Seeded supplier: ${mockSupplier.name}`);
          } catch (error) {
            console.warn('Failed to seed supplier:', mockSupplier.code, error);
          }
        }
        
        console.log('Database seeded successfully');
      } else {
        console.log(`Database already has ${stats.totalCount} suppliers`);
      }
      this.isSeeded = true;
    } catch (error) {
      console.error('Failed to check/seed database:', error);
      this.isSeeded = true; // Don't keep retrying
    }
  }

  // Get all active suppliers with pagination
  async getAllSuppliers(paginationParams?: PaginationParams): Promise<Supplier[]> {
    console.log('SupplierService: getAllSuppliers called with pagination:', paginationParams);
    
    try {
      // First check if we can reach the API
      console.log('SupplierService: Testing API connection...');
      const healthCheck = await fetch(`${API_BASE_URL.replace('/api', '')}/actuator/health`);
      if (!healthCheck.ok) {
        throw new Error('Backend not available');
      }
      console.log('SupplierService: Backend is healthy');

      // Try to get suppliers
      console.log('SupplierService: Fetching suppliers from API...');
      const response = await apiRequest<Supplier[]>(`${SUPPLIERS_ENDPOINT}/active`);
      console.log('SupplierService: Fetched suppliers from API:', response.length, 'suppliers');
      console.log('SupplierService: Supplier data:', response);
      
      if (!Array.isArray(response)) {
        console.error('SupplierService: API response is not an array:', response);
        return [];
      }
      
      return response;
    } catch (error) {
      console.error('SupplierService: Failed to fetch suppliers:', error);
      
      // Try to seed the database if it's empty
      try {
        console.log('SupplierService: Attempting to seed database...');
        await this.seedDatabaseIfEmpty();
        
        // Try again after seeding
        console.log('SupplierService: Retrying after seeding...');
        const response = await apiRequest<Supplier[]>(`${SUPPLIERS_ENDPOINT}/active`);
        console.log('SupplierService: Retry successful, got:', response.length, 'suppliers');
        return Array.isArray(response) ? response : [];
      } catch (seedError) {
        console.error('SupplierService: Even seeding failed:', seedError);
        return [];
      }
    }
  }

  // Get paginated suppliers (for future backend pagination support)
  async getPaginatedSuppliers(paginationParams: PaginationParams): Promise<PaginatedResponse<Supplier>> {
    console.log('SupplierService: getPaginatedSuppliers called with:', paginationParams);
    
    try {
      // For now, we'll simulate pagination on the frontend since backend doesn't support it yet
      const allSuppliers = await this.getAllSuppliers();
      
      const { page, size, sort, direction } = paginationParams;
      const startIndex = page * size;
      const endIndex = startIndex + size;
      
      // Sort suppliers if requested
      let sortedSuppliers = [...allSuppliers];
      if (sort) {
        sortedSuppliers.sort((a, b) => {
          const aValue = (a as any)[sort] || '';
          const bValue = (b as any)[sort] || '';
          
          let comparison = 0;
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue);
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue;
          } else {
            comparison = String(aValue).localeCompare(String(bValue));
          }
          
          return direction === 'desc' ? -comparison : comparison;
        });
      }
      
      const paginatedSuppliers = sortedSuppliers.slice(startIndex, endIndex);
      
      const response: PaginatedResponse<Supplier> = {
        content: paginatedSuppliers,
        totalElements: allSuppliers.length,
        totalPages: Math.ceil(allSuppliers.length / size),
        size: size,
        number: page,
        first: page === 0,
        last: endIndex >= allSuppliers.length,
        numberOfElements: paginatedSuppliers.length
      };
      
      console.log('SupplierService: Paginated response:', response);
      return response;
    } catch (error) {
      console.error('SupplierService: Failed to get paginated suppliers:', error);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: paginationParams.size,
        number: paginationParams.page,
        first: true,
        last: true,
        numberOfElements: 0
      };
    }
  }

  // Get supplier by ID
  async getSupplierById(id: number): Promise<Supplier | null> {
    try {
      return await apiRequest<Supplier>(`${SUPPLIERS_ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Failed to get supplier:', error);
      return null;
    }
  }

  // Create new supplier
  async createSupplier(supplierData: Omit<Supplier, 'id' | 'createdDate' | 'updatedDate'>): Promise<Supplier> {
    console.log('Creating supplier via API:', supplierData);
    const result = await apiRequest<Supplier>(SUPPLIERS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
    console.log('Supplier created successfully:', result);
    return result;
  }

  // Update supplier
  async updateSupplier(id: number, supplierData: Partial<Supplier>): Promise<Supplier> {
    return await apiRequest<Supplier>(`${SUPPLIERS_ENDPOINT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplierData),
    });
  }

  // Delete supplier (soft delete)
  async deleteSupplier(id: number): Promise<void> {
    await apiRequest<void>(`${SUPPLIERS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  }

  // Search suppliers by name
  async searchSuppliers(name: string): Promise<Supplier[]> {
    try {
      const response = await apiRequest<Supplier[]>(`${SUPPLIERS_ENDPOINT}/search?name=${encodeURIComponent(name)}`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Failed to search suppliers:', error);
      return [];
    }
  }

  // Check if supplier code exists
  async checkCodeExists(code: string): Promise<boolean> {
    try {
      return await apiRequest<boolean>(`${SUPPLIERS_ENDPOINT}/exists/code/${encodeURIComponent(code)}`);
    } catch (error) {
      console.error('Failed to check code exists:', error);
      return false;
    }
  }

  // Check if supplier email exists
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      return await apiRequest<boolean>(`${SUPPLIERS_ENDPOINT}/exists/email/${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Failed to check email exists:', error);
      return false;
    }
  }

  // Get supplier statistics
  async getSupplierStats(): Promise<{ totalCount: number; activeCount: number; inactiveCount: number }> {
    try {
      return await apiRequest<{ totalCount: number; activeCount: number; inactiveCount: number }>(`${SUPPLIERS_ENDPOINT}/stats`);
    } catch (error) {
      console.error('Failed to get supplier stats:', error);
      return { totalCount: 0, activeCount: 0, inactiveCount: 0 };
    }
  }

  // Activate supplier
  async activateSupplier(id: number): Promise<Supplier> {
    return await apiRequest<Supplier>(`${SUPPLIERS_ENDPOINT}/${id}/activate`, {
      method: 'PUT',
    });
  }

  // Deactivate supplier
  async deactivateSupplier(id: number): Promise<Supplier> {
    return await apiRequest<Supplier>(`${SUPPLIERS_ENDPOINT}/${id}/deactivate`, {
      method: 'PUT',
    });
  }
}

export const supplierService = new SupplierService();
