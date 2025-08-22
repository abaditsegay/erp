import axios from 'axios';
import {
  PurchaseDashboard,
  PurchaseOrder,
  EthiopianSupplier,
  PurchaseRequisition,
  GoodsReceived,
  PaymentVoucher,
  SupplierPerformance,
  CreatePurchaseOrderForm,
  CreateSupplierForm,
  CreateRequisitionForm,
  PaginatedResponse,
  EthiopianRegion,
  PurchaseOrderStatus,
  SupplierType,
  PaymentTerms,
  OrderType,
  PriorityLevel,
  RequisitionStatus,
  PaymentStatus
} from '../types/purchase';

const API_BASE_URL = '/api/purchase';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const purchaseService = {
  // Dashboard
  getDashboard: async (): Promise<PurchaseDashboard> => {
    const response = await api.get<PurchaseDashboard>('/dashboard');
    return response.data;
  },

  // Purchase Orders
  getAllPurchaseOrders: async (page = 0, size = 10): Promise<PaginatedResponse<PurchaseOrder>> => {
    const response = await api.get<PaginatedResponse<PurchaseOrder>>(`/orders?page=${page}&size=${size}`);
    return response.data;
  },

  getPurchaseOrderById: async (id: number): Promise<PurchaseOrder> => {
    const response = await api.get<PurchaseOrder>(`/orders/${id}`);
    return response.data;
  },

  getPurchaseOrdersByStatus: async (status: PurchaseOrderStatus): Promise<PurchaseOrder[]> => {
    const response = await api.get<PurchaseOrder[]>(`/orders/status/${status}`);
    return response.data;
  },

  getPurchaseOrdersBySupplier: async (supplierId: number): Promise<PurchaseOrder[]> => {
    const response = await api.get<PurchaseOrder[]>(`/orders/supplier/${supplierId}`);
    return response.data;
  },

  createPurchaseOrder: async (orderData: CreatePurchaseOrderForm): Promise<PurchaseOrder> => {
    const response = await api.post<PurchaseOrder>('/orders', orderData);
    return response.data;
  },

  updatePurchaseOrder: async (id: number, orderData: Partial<CreatePurchaseOrderForm>): Promise<PurchaseOrder> => {
    const response = await api.put<PurchaseOrder>(`/orders/${id}`, orderData);
    return response.data;
  },

  approvePurchaseOrder: async (id: number, comments?: string): Promise<PurchaseOrder> => {
    const response = await api.post<PurchaseOrder>(`/orders/${id}/approve`, { comments });
    return response.data;
  },

  rejectPurchaseOrder: async (id: number, reason: string): Promise<PurchaseOrder> => {
    const response = await api.post<PurchaseOrder>(`/orders/${id}/reject`, { reason });
    return response.data;
  },

  sendPurchaseOrderToSupplier: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/orders/${id}/send`);
    return response.data;
  },

  cancelPurchaseOrder: async (id: number, reason: string): Promise<PurchaseOrder> => {
    const response = await api.post<PurchaseOrder>(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  // Suppliers
  getAllSuppliers: async (page = 0, size = 10): Promise<PaginatedResponse<EthiopianSupplier>> => {
    const response = await api.get<PaginatedResponse<EthiopianSupplier>>(`/suppliers?page=${page}&size=${size}`);
    return response.data;
  },

  getSupplierById: async (id: number): Promise<EthiopianSupplier> => {
    const response = await api.get<EthiopianSupplier>(`/suppliers/${id}`);
    return response.data;
  },

  getSuppliersByRegion: async (region: EthiopianRegion): Promise<EthiopianSupplier[]> => {
    const response = await api.get<EthiopianSupplier[]>(`/suppliers/region/${region}`);
    return response.data;
  },

  getSuppliersByType: async (type: SupplierType): Promise<EthiopianSupplier[]> => {
    const response = await api.get<EthiopianSupplier[]>(`/suppliers/type/${type}`);
    return response.data;
  },

  createSupplier: async (supplierData: CreateSupplierForm): Promise<EthiopianSupplier> => {
    const response = await api.post<EthiopianSupplier>('/suppliers', supplierData);
    return response.data;
  },

  updateSupplier: async (id: number, supplierData: Partial<CreateSupplierForm>): Promise<EthiopianSupplier> => {
    const response = await api.put<EthiopianSupplier>(`/suppliers/${id}`, supplierData);
    return response.data;
  },

  deactivateSupplier: async (id: number): Promise<void> => {
    await api.post(`/suppliers/${id}/deactivate`);
  },

  activateSupplier: async (id: number): Promise<void> => {
    await api.post(`/suppliers/${id}/activate`);
  },

  getSupplierPerformance: async (id: number): Promise<SupplierPerformance> => {
    const response = await api.get<SupplierPerformance>(`/suppliers/${id}/performance`);
    return response.data;
  },

  // Purchase Requisitions
  getAllRequisitions: async (page = 0, size = 10): Promise<PaginatedResponse<PurchaseRequisition>> => {
    const response = await api.get<PaginatedResponse<PurchaseRequisition>>(`/requisitions?page=${page}&size=${size}`);
    return response.data;
  },

  getRequisitionById: async (id: number): Promise<PurchaseRequisition> => {
    const response = await api.get<PurchaseRequisition>(`/requisitions/${id}`);
    return response.data;
  },

  getRequisitionsByStatus: async (status: RequisitionStatus): Promise<PurchaseRequisition[]> => {
    const response = await api.get<PurchaseRequisition[]>(`/requisitions/status/${status}`);
    return response.data;
  },

  createRequisition: async (requisitionData: CreateRequisitionForm): Promise<PurchaseRequisition> => {
    const response = await api.post<PurchaseRequisition>('/requisitions', requisitionData);
    return response.data;
  },

  updateRequisition: async (id: number, requisitionData: Partial<CreateRequisitionForm>): Promise<PurchaseRequisition> => {
    const response = await api.put<PurchaseRequisition>(`/requisitions/${id}`, requisitionData);
    return response.data;
  },

  approveRequisition: async (id: number, comments?: string): Promise<PurchaseRequisition> => {
    const response = await api.post<PurchaseRequisition>(`/requisitions/${id}/approve`, { comments });
    return response.data;
  },

  rejectRequisition: async (id: number, reason: string): Promise<PurchaseRequisition> => {
    const response = await api.post<PurchaseRequisition>(`/requisitions/${id}/reject`, { reason });
    return response.data;
  },

  convertRequisitionToPO: async (id: number, supplierId: number): Promise<PurchaseOrder> => {
    const response = await api.post<PurchaseOrder>(`/requisitions/${id}/convert-to-po`, { supplierId });
    return response.data;
  },

  // Goods Received Notes (GRN)
  getAllGoodsReceived: async (page = 0, size = 10): Promise<PaginatedResponse<GoodsReceived>> => {
    const response = await api.get<PaginatedResponse<GoodsReceived>>(`/goods-received?page=${page}&size=${size}`);
    return response.data;
  },

  getGoodsReceivedById: async (id: number): Promise<GoodsReceived> => {
    const response = await api.get<GoodsReceived>(`/goods-received/${id}`);
    return response.data;
  },

  createGoodsReceived: async (grnData: any): Promise<GoodsReceived> => {
    const response = await api.post<GoodsReceived>('/goods-received', grnData);
    return response.data;
  },

  updateGoodsReceived: async (id: number, grnData: any): Promise<GoodsReceived> => {
    const response = await api.put<GoodsReceived>(`/goods-received/${id}`, grnData);
    return response.data;
  },

  // Additional GRV methods for Ethiopian ERP
  searchPurchaseOrders: async (query: string): Promise<PurchaseOrder[]> => {
    const response = await api.get<PurchaseOrder[]>(`/orders/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getPendingPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
    const response = await api.get<PurchaseOrder[]>('/orders/pending-receipt');
    return response.data;
  },

  // Payment Vouchers
  getAllPaymentVouchers: async (page = 0, size = 10): Promise<PaginatedResponse<PaymentVoucher>> => {
    const response = await api.get<PaginatedResponse<PaymentVoucher>>(`/payment-vouchers?page=${page}&size=${size}`);
    return response.data;
  },

  getPaymentVoucherById: async (id: number): Promise<PaymentVoucher> => {
    const response = await api.get<PaymentVoucher>(`/payment-vouchers/${id}`);
    return response.data;
  },

  getOverduePayments: async (): Promise<PaymentVoucher[]> => {
    const response = await api.get<PaymentVoucher[]>('/payment-vouchers/overdue');
    return response.data;
  },

  createPaymentVoucher: async (voucherData: any): Promise<PaymentVoucher> => {
    const response = await api.post<PaymentVoucher>('/payment-vouchers', voucherData);
    return response.data;
  },

  approvePayment: async (id: number, comments?: string): Promise<PaymentVoucher> => {
    const response = await api.post<PaymentVoucher>(`/payment-vouchers/${id}/approve`, { comments });
    return response.data;
  },

  processPayment: async (id: number, paymentData: any): Promise<PaymentVoucher> => {
    const response = await api.post<PaymentVoucher>(`/payment-vouchers/${id}/process`, paymentData);
    return response.data;
  },

  // Currency Conversion (Ethiopian Birr)
  convertUsdToEtb: async (usdAmount: number): Promise<{ etbAmount: number; exchangeRate: number; timestamp: string }> => {
    const response = await api.get(`/currency/usd-to-etb?usdAmount=${usdAmount}`);
    return response.data;
  },

  getCurrentExchangeRate: async (): Promise<{ usdToEtb: number; timestamp: string }> => {
    const response = await api.get('/currency/current-rate');
    return response.data;
  },

  // Reports and Analytics
  getSupplierPerformanceReport: async (startDate: string, endDate: string): Promise<SupplierPerformance[]> => {
    const response = await api.get<SupplierPerformance[]>(`/reports/supplier-performance?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  getPurchaseSpendingAnalysis: async (year: number): Promise<any> => {
    const response = await api.get(`/reports/spending-analysis?year=${year}`);
    return response.data;
  },

  getRegionalPurchaseReport: async (region: EthiopianRegion): Promise<any> => {
    const response = await api.get(`/reports/regional-purchase?region=${region}`);
    return response.data;
  },

  // Approval Workflow
  getPendingApprovals: async (approverRole: string): Promise<any[]> => {
    const response = await api.get(`/approvals/pending?role=${approverRole}`);
    return response.data;
  },

  getApprovalHistory: async (entityType: string, entityId: number): Promise<any[]> => {
    const response = await api.get(`/approvals/history?type=${entityType}&id=${entityId}`);
    return response.data;
  },

  // Health Check
  healthCheck: async (): Promise<{ status: string; service: string; timestamp: string; version: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Helper functions for Ethiopian business operations
export const ethiopianPurchaseHelpers = {
  // Format Ethiopian Birr currency
  formatEtb: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2,
    }).format(amount);
  },

  // Format USD currency
  formatUsd: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  },

  // Get supplier type display name
  getSupplierTypeDisplay: (type: SupplierType): string => {
    const typeMap: Record<SupplierType, string> = {
      [SupplierType.LOCAL]: 'Local Supplier',
      [SupplierType.INTERNATIONAL]: 'International Supplier',
      [SupplierType.GOVERNMENT]: 'Government Entity',
      [SupplierType.NGO]: 'NGO/Non-Profit',
      [SupplierType.COOPERATIVE]: 'Cooperative',
    };
    return typeMap[type] || type;
  },

  // Get payment terms display
  getPaymentTermsDisplay: (terms: PaymentTerms): string => {
    const termsMap: Record<PaymentTerms, string> = {
      [PaymentTerms.CASH_ON_DELIVERY]: 'Cash on Delivery',
      [PaymentTerms.NET_15]: 'Net 15 Days',
      [PaymentTerms.NET_30]: 'Net 30 Days',
      [PaymentTerms.NET_45]: 'Net 45 Days',
      [PaymentTerms.NET_60]: 'Net 60 Days',
      [PaymentTerms.NET_90]: 'Net 90 Days',
      [PaymentTerms.ADVANCE_PAYMENT]: 'Advance Payment',
      [PaymentTerms.LETTER_OF_CREDIT]: 'Letter of Credit',
      [PaymentTerms.CONSIGNMENT]: 'Consignment',
    };
    return termsMap[terms] || terms;
  },

  // Get order type display
  getOrderTypeDisplay: (type: OrderType): string => {
    const typeMap: Record<OrderType, string> = {
      [OrderType.STANDARD]: 'Standard Order',
      [OrderType.BLANKET]: 'Blanket Order',
      [OrderType.CONTRACT]: 'Contract Order',
      [OrderType.EMERGENCY]: 'Emergency Order',
      [OrderType.IMPORT]: 'Import Order',
      [OrderType.LOCAL]: 'Local Order',
    };
    return typeMap[type] || type;
  },

  // Get priority level color
  getPriorityColor: (priority: PriorityLevel): 'default' | 'primary' | 'secondary' | 'warning' | 'error' | 'info' | 'success' => {
    const colorMap: Record<PriorityLevel, 'default' | 'primary' | 'secondary' | 'warning' | 'error' | 'info' | 'success'> = {
      [PriorityLevel.LOW]: 'default',
      [PriorityLevel.MEDIUM]: 'info',
      [PriorityLevel.HIGH]: 'warning',
      [PriorityLevel.URGENT]: 'error',
      [PriorityLevel.CRITICAL]: 'error',
    };
    return colorMap[priority] || 'default';
  },

  // Get status color
  getStatusColor: (status: PurchaseOrderStatus): 'default' | 'primary' | 'secondary' | 'warning' | 'error' | 'info' | 'success' => {
    const colorMap: Record<PurchaseOrderStatus, 'default' | 'primary' | 'secondary' | 'warning' | 'error' | 'info' | 'success'> = {
      [PurchaseOrderStatus.DRAFT]: 'default',
      [PurchaseOrderStatus.PENDING_APPROVAL]: 'warning',
      [PurchaseOrderStatus.APPROVED]: 'success',
      [PurchaseOrderStatus.SENT_TO_SUPPLIER]: 'info',
      [PurchaseOrderStatus.ACKNOWLEDGED]: 'info',
      [PurchaseOrderStatus.PARTIALLY_RECEIVED]: 'warning',
      [PurchaseOrderStatus.FULLY_RECEIVED]: 'success',
      [PurchaseOrderStatus.INVOICED]: 'primary',
      [PurchaseOrderStatus.PAID]: 'success',
      [PurchaseOrderStatus.CANCELLED]: 'error',
      [PurchaseOrderStatus.CLOSED]: 'default',
    };
    return colorMap[status] || 'default';
  },

  // Calculate total with Ethiopian VAT
  calculateTotalWithVAT: (subtotal: number, vatRate = 0.15): { subtotal: number; vat: number; total: number } => {
    const vat = subtotal * vatRate;
    const total = subtotal + vat;
    return { subtotal, vat, total };
  },

  // Calculate withholding tax (common in Ethiopia)
  calculateWithholdingTax: (amount: number, rate = 0.02): number => {
    return amount * rate;
  },

  // Format Ethiopian address
  formatEthiopianAddress: (address: any): string => {
    const parts = [
      address.street,
      address.city,
      address.region,
      address.country || 'Ethiopia'
    ].filter(Boolean);
    
    if (address.poBox) {
      parts.push(`P.O. Box ${address.poBox}`);
    }
    
    return parts.join(', ');
  },

  // Generate purchase order number
  generatePONumber: (prefix = 'PO', date = new Date()): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}-${year}${month}${day}-${timestamp}`;
  },

  // Validate Ethiopian tax number format
  validateEthiopianTaxNumber: (taxNumber: string): boolean => {
    // Ethiopian TIN format: 10 digits
    const pattern = /^\d{10}$/;
    return pattern.test(taxNumber);
  },

  // Get Ethiopian business days (excluding weekends and holidays)
  addBusinessDays: (startDate: Date, businessDays: number): Date => {
    const result = new Date(startDate);
    let addedDays = 0;
    
    while (addedDays < businessDays) {
      result.setDate(result.getDate() + 1);
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (result.getDay() !== 0 && result.getDay() !== 6) {
        addedDays++;
      }
    }
    
    return result;
  },

  // Calculate payment due date based on terms
  calculateDueDate: (orderDate: string, paymentTerms: PaymentTerms): string => {
    const baseDate = new Date(orderDate);
    let daysToAdd = 0;
    
    switch (paymentTerms) {
      case PaymentTerms.CASH_ON_DELIVERY:
        daysToAdd = 0;
        break;
      case PaymentTerms.NET_15:
        daysToAdd = 15;
        break;
      case PaymentTerms.NET_30:
        daysToAdd = 30;
        break;
      case PaymentTerms.NET_45:
        daysToAdd = 45;
        break;
      case PaymentTerms.NET_60:
        daysToAdd = 60;
        break;
      case PaymentTerms.NET_90:
        daysToAdd = 90;
        break;
      default:
        daysToAdd = 30; // Default to 30 days
    }
    
    const dueDate = daysToAdd > 0 
      ? ethiopianPurchaseHelpers.addBusinessDays(baseDate, daysToAdd)
      : baseDate;
    
    return dueDate.toISOString().split('T')[0];
  },
};

export default purchaseService;
