/**
 * Purchase Data Service
 * Replaces mock data with actual database API calls
 * Handles all purchase-related data operations
 */

import { apiService, ApiResponse } from './apiService';

// Types for Purchase entities
export interface Supplier {
  id: number;
  name: string;
  registrationNumber: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  supplierType: 'LOCAL' | 'INTERNATIONAL' | 'GOVERNMENT';
  paymentTerms: string;
  creditLimit: number;
  taxId: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  performance: {
    rating: number;
    onTimeDelivery: number;
    qualityScore: number;
    totalOrders: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierId: number;
  supplier: Supplier;
  orderDate: string;
  expectedDeliveryDate: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'RECEIVED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  totalAmount: number;
  currency: string;
  exchangeRate: number;
  paymentTerms: string;
  deliveryAddress: string;
  notes: string;
  items: PurchaseOrderItem[];
  approvalHistory: ApprovalHistory[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: number;
  itemCode: string;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
  specifications: string;
  receivedQuantity: number;
  status: 'PENDING' | 'PARTIALLY_RECEIVED' | 'FULLY_RECEIVED';
}

export interface PurchaseRequisition {
  id: number;
  requisitionNumber: string;
  requestingDepartment: string;
  requestedBy: string;
  requestDate: string;
  requiredDate: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CONVERTED_TO_PO';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  justification: string;
  estimatedBudget: number;
  currency: string;
  items: RequisitionItem[];
  approvalHistory: ApprovalHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface RequisitionItem {
  id: number;
  itemCode: string;
  itemName: string;
  description: string;
  quantity: number;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  unit: string;
  specifications: string;
  suggestedSupplier: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface GoodsReceivedVoucher {
  id: number;
  grvNumber: string;
  purchaseOrderId: number;
  purchaseOrder: PurchaseOrder;
  supplierId: number;
  supplier: Supplier;
  receivedDate: string;
  deliveryNote: string;
  vehicleNumber: string;
  driverName: string;
  receivedBy: string;
  status: 'PENDING_INSPECTION' | 'INSPECTED' | 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';
  items: GRVItem[];
  inspectionNotes: string;
  inspectionBy: string;
  inspectionDate: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GRVItem {
  id: number;
  itemCode: string;
  itemName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  approvedQuantity: number;
  rejectedQuantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';
  notes: string;
}

export interface ApprovalHistory {
  id: number;
  approvedBy: string;
  approvalDate: string;
  action: 'APPROVED' | 'REJECTED' | 'REQUESTED_CHANGES';
  comments: string;
  level: number;
}

export interface PurchaseDashboardData {
  totalPurchaseOrders: number;
  pendingApprovals: number;
  totalValue: number;
  activeSuppliers: number;
  recentOrders: PurchaseOrder[];
  topSuppliers: Supplier[];
  monthlySpending: { month: string; amount: number }[];
  statusDistribution: { status: string; count: number }[];
}

class PurchaseDataService {
  /**
   * Helper method to extract data from API response
   */
  private extractData<T>(response: ApiResponse<T>): T {
    if (response.success && response.data !== undefined) {
      return response.data;
    }
    throw new Error(response.error || 'API request failed');
  }

  /**
   * Supplier Management
   */
  async getSuppliers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
  }): Promise<{ suppliers: Supplier[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);

    const response = await apiService.get<{ suppliers: Supplier[]; total: number }>(`/purchase/suppliers?${queryParams.toString()}`);
    return this.extractData(response);
  }

  async getSupplier(id: number): Promise<Supplier> {
    const response = await apiService.get<Supplier>(`/purchase/suppliers/${id}`);
    return this.extractData(response);
  }

  async createSupplier(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> {
    const response = await apiService.post<Supplier>('/purchase/suppliers', supplier);
    return this.extractData(response);
  }

  async updateSupplier(id: number, supplier: Partial<Supplier>): Promise<Supplier> {
    const response = await apiService.put<Supplier>(`/purchase/suppliers/${id}`, supplier);
    return this.extractData(response);
  }

  async deleteSupplier(id: number): Promise<void> {
    const response = await apiService.delete<void>(`/purchase/suppliers/${id}`);
    this.extractData(response);
  }

  /**
   * Purchase Order Management
   */
  async getPurchaseOrders(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    supplierId?: number;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{ orders: PurchaseOrder[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.supplierId) queryParams.append('supplierId', params.supplierId.toString());
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo);

    const response = await apiService.get<{ orders: PurchaseOrder[]; total: number }>(`/purchase/orders?${queryParams.toString()}`);
    return this.extractData(response);
  }

  async getPurchaseOrder(id: number): Promise<PurchaseOrder> {
    const response = await apiService.get<PurchaseOrder>(`/purchase/orders/${id}`);
    return this.extractData(response);
  }

  async createPurchaseOrder(order: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<PurchaseOrder> {
    const response = await apiService.post<PurchaseOrder>('/purchase/orders', order);
    return this.extractData(response);
  }

  async updatePurchaseOrder(id: number, order: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const response = await apiService.put<PurchaseOrder>(`/purchase/orders/${id}`, order);
    return this.extractData(response);
  }

  async approvePurchaseOrder(id: number, comments?: string): Promise<PurchaseOrder> {
    const response = await apiService.post<PurchaseOrder>(`/purchase/orders/${id}/approve`, { comments });
    return this.extractData(response);
  }

  async rejectPurchaseOrder(id: number, comments: string): Promise<PurchaseOrder> {
    const response = await apiService.post<PurchaseOrder>(`/purchase/orders/${id}/reject`, { comments });
    return this.extractData(response);
  }

  /**
   * Purchase Requisition Management
   */
  async getRequisitions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    department?: string;
    requestedBy?: string;
  }): Promise<{ requisitions: PurchaseRequisition[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.requestedBy) queryParams.append('requestedBy', params.requestedBy);

    const response = await apiService.get<{ requisitions: PurchaseRequisition[]; total: number }>(`/purchase/requisitions?${queryParams.toString()}`);
    return this.extractData(response);
  }

  async getRequisition(id: number): Promise<PurchaseRequisition> {
    const response = await apiService.get<PurchaseRequisition>(`/purchase/requisitions/${id}`);
    return this.extractData(response);
  }

  async createRequisition(requisition: Omit<PurchaseRequisition, 'id' | 'createdAt' | 'updatedAt'>): Promise<PurchaseRequisition> {
    const response = await apiService.post<PurchaseRequisition>('/purchase/requisitions', requisition);
    return this.extractData(response);
  }

  async updateRequisition(id: number, requisition: Partial<PurchaseRequisition>): Promise<PurchaseRequisition> {
    const response = await apiService.put<PurchaseRequisition>(`/purchase/requisitions/${id}`, requisition);
    return this.extractData(response);
  }

  async approveRequisition(id: number, comments?: string): Promise<PurchaseRequisition> {
    const response = await apiService.post<PurchaseRequisition>(`/purchase/requisitions/${id}/approve`, { comments });
    return this.extractData(response);
  }

  async rejectRequisition(id: number, comments: string): Promise<PurchaseRequisition> {
    const response = await apiService.post<PurchaseRequisition>(`/purchase/requisitions/${id}/reject`, { comments });
    return this.extractData(response);
  }

  async convertRequisitionToPO(id: number, supplierId: number): Promise<PurchaseOrder> {
    const response = await apiService.post<PurchaseOrder>(`/purchase/requisitions/${id}/convert-to-po`, { supplierId });
    return this.extractData(response);
  }

  /**
   * Goods Received Voucher Management
   */
  async getGRVs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    supplierId?: number;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{ grvs: GoodsReceivedVoucher[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.supplierId) queryParams.append('supplierId', params.supplierId.toString());
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo);

    const response = await apiService.get<{ grvs: GoodsReceivedVoucher[]; total: number }>(`/purchase/grv?${queryParams.toString()}`);
    return this.extractData(response);
  }

  async getGRV(id: number): Promise<GoodsReceivedVoucher> {
    const response = await apiService.get<GoodsReceivedVoucher>(`/purchase/grv/${id}`);
    return this.extractData(response);
  }

  async createGRV(grv: Omit<GoodsReceivedVoucher, 'id' | 'createdAt' | 'updatedAt'>): Promise<GoodsReceivedVoucher> {
    const response = await apiService.post<GoodsReceivedVoucher>('/purchase/grv', grv);
    return this.extractData(response);
  }

  async updateGRV(id: number, grv: Partial<GoodsReceivedVoucher>): Promise<GoodsReceivedVoucher> {
    const response = await apiService.put<GoodsReceivedVoucher>(`/purchase/grv/${id}`, grv);
    return this.extractData(response);
  }

  async approveGRV(id: number, comments?: string): Promise<GoodsReceivedVoucher> {
    const response = await apiService.post<GoodsReceivedVoucher>(`/purchase/grv/${id}/approve`, { comments });
    return this.extractData(response);
  }

  async rejectGRV(id: number, comments: string): Promise<GoodsReceivedVoucher> {
    const response = await apiService.post<GoodsReceivedVoucher>(`/purchase/grv/${id}/reject`, { comments });
    return this.extractData(response);
  }

  /**
   * Dashboard and Analytics
   */
  async getDashboardData(): Promise<PurchaseDashboardData> {
    const response = await apiService.get<PurchaseDashboardData>('/purchase/dashboard');
    return this.extractData(response);
  }

  async getSupplierPerformance(supplierId: number): Promise<any> {
    const response = await apiService.get<any>(`/purchase/suppliers/${supplierId}/performance`);
    return this.extractData(response);
  }

  async getPurchaseAnalytics(params?: {
    dateFrom?: string;
    dateTo?: string;
    groupBy?: 'month' | 'quarter' | 'year';
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params?.groupBy) queryParams.append('groupBy', params.groupBy);

    const response = await apiService.get<any>(`/purchase/analytics?${queryParams.toString()}`);
    return this.extractData(response);
  }

  /**
   * Utility Methods
   */
  async searchItems(query: string): Promise<any[]> {
    const response = await apiService.get<any[]>(`/inventory/items/search?q=${encodeURIComponent(query)}`);
    return this.extractData(response);
  }

  async getCurrencyRates(): Promise<{ [key: string]: number }> {
    const response = await apiService.get<{ [key: string]: number }>('/finance/currency-rates');
    return this.extractData(response);
  }

  async getDepartments(): Promise<string[]> {
    const response = await apiService.get<string[]>('/admin/departments');
    return this.extractData(response);
  }

  async getApprovalWorkflow(type: 'requisition' | 'purchase_order' | 'grv'): Promise<any> {
    const response = await apiService.get<any>(`/admin/approval-workflow/${type}`);
    return this.extractData(response);
  }
}

// Export singleton instance
export const purchaseDataService = new PurchaseDataService();
export default purchaseDataService;
