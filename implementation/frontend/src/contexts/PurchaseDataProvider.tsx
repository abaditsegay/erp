import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { purchaseDataService } from '../services/purchaseDataService';
import type {
  Supplier,
  PurchaseOrder,
  PurchaseRequisition,
  GoodsReceivedVoucher,
  PurchaseDashboardData
} from '../services/purchaseDataService';

interface PurchaseDataContextType {
  // Data state
  dashboard: PurchaseDashboardData | null;
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  requisitions: PurchaseRequisition[];
  grvs: GoodsReceivedVoucher[];
  
  // Loading states
  loading: {
    dashboard: boolean;
    suppliers: boolean;
    purchaseOrders: boolean;
    requisitions: boolean;
    grvs: boolean;
  };
  
  // Error states
  error: {
    dashboard: string | null;
    suppliers: string | null;
    purchaseOrders: string | null;
    requisitions: string | null;
    grvs: string | null;
  };
  
  // Pagination
  pagination: {
    suppliers: { page: number; total: number; limit: number };
    purchaseOrders: { page: number; total: number; limit: number };
    requisitions: { page: number; total: number; limit: number };
    grvs: { page: number; total: number; limit: number };
  };
  
  // Methods
  refreshDashboard: () => Promise<void>;
  loadSuppliers: (params?: any) => Promise<void>;
  loadPurchaseOrders: (params?: any) => Promise<void>;
  loadRequisitions: (params?: any) => Promise<void>;
  loadGRVs: (params?: any) => Promise<void>;
  
  // CRUD operations
  createSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Supplier>;
  updateSupplier: (id: number, supplier: Partial<Supplier>) => Promise<Supplier>;
  deleteSupplier: (id: number) => Promise<void>;
  
  createPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PurchaseOrder>;
  updatePurchaseOrder: (id: number, order: Partial<PurchaseOrder>) => Promise<PurchaseOrder>;
  approvePurchaseOrder: (id: number, comments?: string) => Promise<PurchaseOrder>;
  rejectPurchaseOrder: (id: number, comments: string) => Promise<PurchaseOrder>;
  
  createRequisition: (requisition: Omit<PurchaseRequisition, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PurchaseRequisition>;
  updateRequisition: (id: number, requisition: Partial<PurchaseRequisition>) => Promise<PurchaseRequisition>;
  approveRequisition: (id: number, comments?: string) => Promise<PurchaseRequisition>;
  rejectRequisition: (id: number, comments: string) => Promise<PurchaseRequisition>;
  convertRequisitionToPO: (id: number, supplierId: number) => Promise<PurchaseOrder>;
  
  createGRV: (grv: Omit<GoodsReceivedVoucher, 'id' | 'createdAt' | 'updatedAt'>) => Promise<GoodsReceivedVoucher>;
  updateGRV: (id: number, grv: Partial<GoodsReceivedVoucher>) => Promise<GoodsReceivedVoucher>;
  approveGRV: (id: number, comments?: string) => Promise<GoodsReceivedVoucher>;
  rejectGRV: (id: number, comments: string) => Promise<GoodsReceivedVoucher>;
  
  // Utility methods
  searchItems: (query: string) => Promise<any[]>;
  getCurrencyRates: () => Promise<{ [key: string]: number }>;
}

const PurchaseDataContext = createContext<PurchaseDataContextType | undefined>(undefined);

export const usePurchaseData = () => {
  const context = useContext(PurchaseDataContext);
  if (!context) {
    throw new Error('usePurchaseData must be used within a PurchaseDataProvider');
  }
  return context;
};

interface PurchaseDataProviderProps {
  children: ReactNode;
}

export const PurchaseDataProvider: React.FC<PurchaseDataProviderProps> = ({ children }) => {
  // Data state
  const [dashboard, setDashboard] = useState<PurchaseDashboardData | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>([]);
  const [grvs, setGrvs] = useState<GoodsReceivedVoucher[]>([]);

  // Loading states
  const [loading, setLoading] = useState({
    dashboard: false,
    suppliers: false,
    purchaseOrders: false,
    requisitions: false,
    grvs: false,
  });

  // Error states
  const [error, setError] = useState({
    dashboard: null as string | null,
    suppliers: null as string | null,
    purchaseOrders: null as string | null,
    requisitions: null as string | null,
    grvs: null as string | null,
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    suppliers: { page: 1, total: 0, limit: 10 },
    purchaseOrders: { page: 1, total: 0, limit: 10 },
    requisitions: { page: 1, total: 0, limit: 10 },
    grvs: { page: 1, total: 0, limit: 10 },
  });

  // Helper function to handle API errors
  const handleError = useCallback((section: keyof typeof error, err: any) => {
    const errorMessage = err.message || 'An unexpected error occurred';
    setError(prev => ({ ...prev, [section]: errorMessage }));
    console.error(`Error in ${section}:`, err);
  }, []);

  // Helper function to set loading state
  const setLoadingState = useCallback((section: keyof typeof loading, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [section]: isLoading }));
    if (isLoading) {
      setError(prev => ({ ...prev, [section]: null }));
    }
  }, []);

  // Dashboard methods
  const refreshDashboard = useCallback(async () => {
    setLoadingState('dashboard', true);
    try {
      const dashboardData = await purchaseDataService.getDashboardData();
      setDashboard(dashboardData);
    } catch (err) {
      handleError('dashboard', err);
    } finally {
      setLoadingState('dashboard', false);
    }
  }, [setLoadingState, handleError]);

  // Supplier methods
  const loadSuppliers = useCallback(async (params?: any) => {
    setLoadingState('suppliers', true);
    try {
      const response = await purchaseDataService.getSuppliers(params);
      setSuppliers(response.suppliers);
      setPagination(prev => ({
        ...prev,
        suppliers: {
          ...prev.suppliers,
          total: response.total,
          page: params?.page || 1,
        },
      }));
    } catch (err) {
      handleError('suppliers', err);
    } finally {
      setLoadingState('suppliers', false);
    }
  }, [setLoadingState, handleError]);

  const createSupplier = useCallback(async (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSupplier = await purchaseDataService.createSupplier(supplier);
    setSuppliers(prev => [newSupplier, ...prev]);
    return newSupplier;
  }, []);

  const updateSupplier = useCallback(async (id: number, supplier: Partial<Supplier>) => {
    const updatedSupplier = await purchaseDataService.updateSupplier(id, supplier);
    setSuppliers(prev => prev.map(s => s.id === id ? updatedSupplier : s));
    return updatedSupplier;
  }, []);

  const deleteSupplier = useCallback(async (id: number) => {
    await purchaseDataService.deleteSupplier(id);
    setSuppliers(prev => prev.filter(s => s.id !== id));
  }, []);

  // Purchase Order methods
  const loadPurchaseOrders = useCallback(async (params?: any) => {
    setLoadingState('purchaseOrders', true);
    try {
      const response = await purchaseDataService.getPurchaseOrders(params);
      setPurchaseOrders(response.orders);
      setPagination(prev => ({
        ...prev,
        purchaseOrders: {
          ...prev.purchaseOrders,
          total: response.total,
          page: params?.page || 1,
        },
      }));
    } catch (err) {
      handleError('purchaseOrders', err);
    } finally {
      setLoadingState('purchaseOrders', false);
    }
  }, [setLoadingState, handleError]);

  const createPurchaseOrder = useCallback(async (order: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder = await purchaseDataService.createPurchaseOrder(order);
    setPurchaseOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updatePurchaseOrder = useCallback(async (id: number, order: Partial<PurchaseOrder>) => {
    const updatedOrder = await purchaseDataService.updatePurchaseOrder(id, order);
    setPurchaseOrders(prev => prev.map(po => po.id === id ? updatedOrder : po));
    return updatedOrder;
  }, []);

  const approvePurchaseOrder = useCallback(async (id: number, comments?: string) => {
    const approvedOrder = await purchaseDataService.approvePurchaseOrder(id, comments);
    setPurchaseOrders(prev => prev.map(po => po.id === id ? approvedOrder : po));
    return approvedOrder;
  }, []);

  const rejectPurchaseOrder = useCallback(async (id: number, comments: string) => {
    const rejectedOrder = await purchaseDataService.rejectPurchaseOrder(id, comments);
    setPurchaseOrders(prev => prev.map(po => po.id === id ? rejectedOrder : po));
    return rejectedOrder;
  }, []);

  // Requisition methods
  const loadRequisitions = useCallback(async (params?: any) => {
    setLoadingState('requisitions', true);
    try {
      const response = await purchaseDataService.getRequisitions(params);
      setRequisitions(response.requisitions);
      setPagination(prev => ({
        ...prev,
        requisitions: {
          ...prev.requisitions,
          total: response.total,
          page: params?.page || 1,
        },
      }));
    } catch (err) {
      handleError('requisitions', err);
    } finally {
      setLoadingState('requisitions', false);
    }
  }, [setLoadingState, handleError]);

  const createRequisition = useCallback(async (requisition: Omit<PurchaseRequisition, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequisition = await purchaseDataService.createRequisition(requisition);
    setRequisitions(prev => [newRequisition, ...prev]);
    return newRequisition;
  }, []);

  const updateRequisition = useCallback(async (id: number, requisition: Partial<PurchaseRequisition>) => {
    const updatedRequisition = await purchaseDataService.updateRequisition(id, requisition);
    setRequisitions(prev => prev.map(req => req.id === id ? updatedRequisition : req));
    return updatedRequisition;
  }, []);

  const approveRequisition = useCallback(async (id: number, comments?: string) => {
    const approvedRequisition = await purchaseDataService.approveRequisition(id, comments);
    setRequisitions(prev => prev.map(req => req.id === id ? approvedRequisition : req));
    return approvedRequisition;
  }, []);

  const rejectRequisition = useCallback(async (id: number, comments: string) => {
    const rejectedRequisition = await purchaseDataService.rejectRequisition(id, comments);
    setRequisitions(prev => prev.map(req => req.id === id ? rejectedRequisition : req));
    return rejectedRequisition;
  }, []);

  const convertRequisitionToPO = useCallback(async (id: number, supplierId: number) => {
    const newPurchaseOrder = await purchaseDataService.convertRequisitionToPO(id, supplierId);
    setPurchaseOrders(prev => [newPurchaseOrder, ...prev]);
    // Update requisition status
    setRequisitions(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'CONVERTED_TO_PO' as any } : req
    ));
    return newPurchaseOrder;
  }, []);

  // GRV methods
  const loadGRVs = useCallback(async (params?: any) => {
    setLoadingState('grvs', true);
    try {
      const response = await purchaseDataService.getGRVs(params);
      setGrvs(response.grvs);
      setPagination(prev => ({
        ...prev,
        grvs: {
          ...prev.grvs,
          total: response.total,
          page: params?.page || 1,
        },
      }));
    } catch (err) {
      handleError('grvs', err);
    } finally {
      setLoadingState('grvs', false);
    }
  }, [setLoadingState, handleError]);

  const createGRV = useCallback(async (grv: Omit<GoodsReceivedVoucher, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGRV = await purchaseDataService.createGRV(grv);
    setGrvs(prev => [newGRV, ...prev]);
    return newGRV;
  }, []);

  const updateGRV = useCallback(async (id: number, grv: Partial<GoodsReceivedVoucher>) => {
    const updatedGRV = await purchaseDataService.updateGRV(id, grv);
    setGrvs(prev => prev.map(g => g.id === id ? updatedGRV : g));
    return updatedGRV;
  }, []);

  const approveGRV = useCallback(async (id: number, comments?: string) => {
    const approvedGRV = await purchaseDataService.approveGRV(id, comments);
    setGrvs(prev => prev.map(g => g.id === id ? approvedGRV : g));
    return approvedGRV;
  }, []);

  const rejectGRV = useCallback(async (id: number, comments: string) => {
    const rejectedGRV = await purchaseDataService.rejectGRV(id, comments);
    setGrvs(prev => prev.map(g => g.id === id ? rejectedGRV : g));
    return rejectedGRV;
  }, []);

  // Utility methods
  const searchItems = useCallback(async (query: string) => {
    return await purchaseDataService.searchItems(query);
  }, []);

  const getCurrencyRates = useCallback(async () => {
    return await purchaseDataService.getCurrencyRates();
  }, []);

  // Load initial data on mount
  useEffect(() => {
    refreshDashboard();
    loadSuppliers();
    loadPurchaseOrders();
    loadRequisitions();
    loadGRVs();
  }, [refreshDashboard, loadSuppliers, loadPurchaseOrders, loadRequisitions, loadGRVs]);

  const contextValue: PurchaseDataContextType = {
    // Data state
    dashboard,
    suppliers,
    purchaseOrders,
    requisitions,
    grvs,
    
    // Loading states
    loading,
    
    // Error states
    error,
    
    // Pagination
    pagination,
    
    // Methods
    refreshDashboard,
    loadSuppliers,
    loadPurchaseOrders,
    loadRequisitions,
    loadGRVs,
    
    // CRUD operations
    createSupplier,
    updateSupplier,
    deleteSupplier,
    
    createPurchaseOrder,
    updatePurchaseOrder,
    approvePurchaseOrder,
    rejectPurchaseOrder,
    
    createRequisition,
    updateRequisition,
    approveRequisition,
    rejectRequisition,
    convertRequisitionToPO,
    
    createGRV,
    updateGRV,
    approveGRV,
    rejectGRV,
    
    // Utility methods
    searchItems,
    getCurrencyRates,
  };

  return (
    <PurchaseDataContext.Provider value={contextValue}>
      {children}
    </PurchaseDataContext.Provider>
  );
};

// Legacy compatibility - export with old name for backward compatibility
export const MockPurchaseDataProvider = PurchaseDataProvider;
export const useMockPurchaseData = usePurchaseData;

export default PurchaseDataProvider;
