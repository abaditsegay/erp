/**
 * API Service for making authenticated HTTP requests
 * Handles authentication headers, error responses, and token management
 */

const API_BASE_URL = 'http://localhost:8081/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (response.ok) {
          return {
            success: true,
            data,
          };
        } else {
          return {
            success: false,
            error: data.message || data.error || 'An error occurred',
          };
        }
      } else {
        const text = await response.text();
        
        if (response.ok) {
          return {
            success: true,
            data: text as T,
          };
        } else {
          return {
            success: false,
            error: text || 'An error occurred',
          };
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  async get<T>(endpoint: string, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(includeAuth),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  async post<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(includeAuth),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  async put<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(includeAuth),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(includeAuth),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  // Specific authentication methods
  async login(username: string, password: string): Promise<ApiResponse<any>> {
    return this.post('/auth/login', { username, password }, false);
  }

  async logout(): Promise<ApiResponse<any>> {
    return this.post('/auth/logout', null, true);
  }

  async getProfile(userId: number): Promise<ApiResponse<any>> {
    return this.get(`/auth/profile?userId=${userId}`, true);
  }

  // Supplier management
  async getSuppliers(): Promise<ApiResponse<any[]>> {
    return this.get('/suppliers');
  }

  async createSupplier(supplier: any): Promise<ApiResponse<any>> {
    return this.post('/suppliers', supplier);
  }

  async updateSupplier(id: number, supplier: any): Promise<ApiResponse<any>> {
    return this.put(`/suppliers/${id}`, supplier);
  }

  async deleteSupplier(id: number): Promise<ApiResponse<any>> {
    return this.delete(`/suppliers/${id}`);
  }

  // Item management
  async getItems(): Promise<ApiResponse<any[]>> {
    return this.get('/items');
  }

  async createItem(item: any): Promise<ApiResponse<any>> {
    return this.post('/items', item);
  }

  async updateItem(id: number, item: any): Promise<ApiResponse<any>> {
    return this.put(`/items/${id}`, item);
  }

  async deleteItem(id: number): Promise<ApiResponse<any>> {
    return this.delete(`/items/${id}`);
  }
}

export const apiService = new ApiService();
export default apiService;
