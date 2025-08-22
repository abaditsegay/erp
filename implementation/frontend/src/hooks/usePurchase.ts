import { useQuery, useMutation, useQueryClient } from 'react-query';
import { purchaseService } from '../services/purchaseService';
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
  PurchaseOrderStatus,
  SupplierType,
  EthiopianRegion,
  RequisitionStatus
} from '../types/purchase';

// Query Keys for React Query
export const PURCHASE_QUERY_KEYS = {
  dashboard: 'purchase-dashboard',
  purchaseOrders: 'purchase-orders',
  purchaseOrder: (id: number) => ['purchase-order', id],
  purchaseOrdersByStatus: (status: PurchaseOrderStatus) => ['purchase-orders', 'status', status],
  purchaseOrdersBySupplier: (supplierId: number) => ['purchase-orders', 'supplier', supplierId],
  suppliers: 'suppliers',
  supplier: (id: number) => ['supplier', id],
  suppliersByRegion: (region: EthiopianRegion) => ['suppliers', 'region', region],
  suppliersByType: (type: SupplierType) => ['suppliers', 'type', type],
  supplierPerformance: (id: number) => ['supplier', id, 'performance'],
  requisitions: 'requisitions',
  requisition: (id: number) => ['requisition', id],
  requisitionsByStatus: (status: RequisitionStatus) => ['requisitions', 'status', status],
  goodsReceived: 'goods-received',
  goodsReceivedItem: (id: number) => ['goods-received', id],
  paymentVouchers: 'payment-vouchers',
  paymentVoucher: (id: number) => ['payment-voucher', id],
  overduePayments: 'overdue-payments',
  exchangeRate: 'exchange-rate',
  currencyConversion: (amount: number) => ['currency-conversion', amount],
  pendingApprovals: (role: string) => ['pending-approvals', role],
  healthCheck: 'purchase-health',
} as const;

// Dashboard Hook
export const usePurchaseDashboard = () => {
  return useQuery<PurchaseDashboard, Error>(
    PURCHASE_QUERY_KEYS.dashboard,
    purchaseService.getDashboard,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    }
  );
};

// Purchase Order Hooks
export const usePurchaseOrders = (page = 0, size = 10) => {
  return useQuery(
    [PURCHASE_QUERY_KEYS.purchaseOrders, page, size],
    () => purchaseService.getAllPurchaseOrders(page, size),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const usePurchaseOrder = (id: number) => {
  return useQuery<PurchaseOrder, Error>(
    PURCHASE_QUERY_KEYS.purchaseOrder(id),
    () => purchaseService.getPurchaseOrderById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const usePurchaseOrdersByStatus = (status: PurchaseOrderStatus) => {
  return useQuery<PurchaseOrder[], Error>(
    PURCHASE_QUERY_KEYS.purchaseOrdersByStatus(status),
    () => purchaseService.getPurchaseOrdersByStatus(status),
    {
      enabled: !!status,
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const usePurchaseOrdersBySupplier = (supplierId: number) => {
  return useQuery<PurchaseOrder[], Error>(
    PURCHASE_QUERY_KEYS.purchaseOrdersBySupplier(supplierId),
    () => purchaseService.getPurchaseOrdersBySupplier(supplierId),
    {
      enabled: !!supplierId,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseOrder, Error, CreatePurchaseOrderForm>(
    purchaseService.createPurchaseOrder,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.purchaseOrders);
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.dashboard);
      },
    }
  );
};

export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseOrder, Error, { id: number; data: Partial<CreatePurchaseOrderForm> }>(
    ({ id, data }) => purchaseService.updatePurchaseOrder(id, data),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.purchaseOrder(variables.id));
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.purchaseOrders);
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.dashboard);
      },
    }
  );
};

export const useApprovePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseOrder, Error, { id: number; comments?: string }>(
    ({ id, comments }) => purchaseService.approvePurchaseOrder(id, comments),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.purchaseOrder(variables.id));
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.purchaseOrders);
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.dashboard);
      },
    }
  );
};

export const useRejectPurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseOrder, Error, { id: number; reason: string }>(
    ({ id, reason }) => purchaseService.rejectPurchaseOrder(id, reason),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.purchaseOrder(variables.id));
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.purchaseOrders);
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.dashboard);
      },
    }
  );
};

export const useSendPurchaseOrderToSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, number>(
    purchaseService.sendPurchaseOrderToSupplier,
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.purchaseOrder(id));
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.purchaseOrders);
      },
    }
  );
};

export const useCancelPurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseOrder, Error, { id: number; reason: string }>(
    ({ id, reason }) => purchaseService.cancelPurchaseOrder(id, reason),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.purchaseOrder(variables.id));
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.purchaseOrders);
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.dashboard);
      },
    }
  );
};

// Supplier Hooks
export const useSuppliers = (page = 0, size = 10) => {
  return useQuery(
    [PURCHASE_QUERY_KEYS.suppliers, page, size],
    () => purchaseService.getAllSuppliers(page, size),
    {
      keepPreviousData: true,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

export const useSupplier = (id: number) => {
  return useQuery<EthiopianSupplier, Error>(
    PURCHASE_QUERY_KEYS.supplier(id),
    () => purchaseService.getSupplierById(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
    }
  );
};

export const useSuppliersByRegion = (region: EthiopianRegion) => {
  return useQuery<EthiopianSupplier[], Error>(
    PURCHASE_QUERY_KEYS.suppliersByRegion(region),
    () => purchaseService.getSuppliersByRegion(region),
    {
      enabled: !!region,
      staleTime: 10 * 60 * 1000,
    }
  );
};

export const useSuppliersByType = (type: SupplierType) => {
  return useQuery<EthiopianSupplier[], Error>(
    PURCHASE_QUERY_KEYS.suppliersByType(type),
    () => purchaseService.getSuppliersByType(type),
    {
      enabled: !!type,
      staleTime: 10 * 60 * 1000,
    }
  );
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation<EthiopianSupplier, Error, CreateSupplierForm>(
    purchaseService.createSupplier,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.suppliers);
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.dashboard);
      },
    }
  );
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation<EthiopianSupplier, Error, { id: number; data: Partial<CreateSupplierForm> }>(
    ({ id, data }) => purchaseService.updateSupplier(id, data),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.supplier(variables.id));
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.suppliers);
      },
    }
  );
};

export const useDeactivateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>(
    purchaseService.deactivateSupplier,
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.supplier(id));
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.suppliers);
      },
    }
  );
};

export const useActivateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>(
    purchaseService.activateSupplier,
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.supplier(id));
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.suppliers);
      },
    }
  );
};

export const useSupplierPerformance = (id: number) => {
  return useQuery<SupplierPerformance, Error>(
    PURCHASE_QUERY_KEYS.supplierPerformance(id),
    () => purchaseService.getSupplierPerformance(id),
    {
      enabled: !!id,
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );
};

// Requisition Hooks
export const useRequisitions = (page = 0, size = 10) => {
  return useQuery(
    [PURCHASE_QUERY_KEYS.requisitions, page, size],
    () => purchaseService.getAllRequisitions(page, size),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useRequisition = (id: number) => {
  return useQuery<PurchaseRequisition, Error>(
    PURCHASE_QUERY_KEYS.requisition(id),
    () => purchaseService.getRequisitionById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useRequisitionsByStatus = (status: RequisitionStatus) => {
  return useQuery<PurchaseRequisition[], Error>(
    PURCHASE_QUERY_KEYS.requisitionsByStatus(status),
    () => purchaseService.getRequisitionsByStatus(status),
    {
      enabled: !!status,
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const useCreateRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseRequisition, Error, CreateRequisitionForm>(
    purchaseService.createRequisition,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.requisitions);
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.dashboard);
      },
    }
  );
};

export const useUpdateRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseRequisition, Error, { id: number; data: Partial<CreateRequisitionForm> }>(
    ({ id, data }) => purchaseService.updateRequisition(id, data),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.requisition(variables.id));
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.requisitions);
      },
    }
  );
};

export const useApproveRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseRequisition, Error, { id: number; comments?: string }>(
    ({ id, comments }) => purchaseService.approveRequisition(id, comments),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.requisition(variables.id));
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.requisitions);
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.dashboard);
      },
    }
  );
};

export const useRejectRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseRequisition, Error, { id: number; reason: string }>(
    ({ id, reason }) => purchaseService.rejectRequisition(id, reason),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.requisition(variables.id));
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.requisitions);
      },
    }
  );
};

export const useConvertRequisitionToPO = () => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseOrder, Error, { id: number; supplierId: number }>(
    ({ id, supplierId }) => purchaseService.convertRequisitionToPO(id, supplierId),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.requisition(variables.id));
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.requisitions);
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.purchaseOrders);
        queryClient.invalidateQueries(PURCHASE_QUERY_KEYS.dashboard);
      },
    }
  );
};

// Goods Received Hooks
export const useGoodsReceived = (page = 0, size = 10) => {
  return useQuery(
    [PURCHASE_QUERY_KEYS.goodsReceived, page, size],
    () => purchaseService.getAllGoodsReceived(page, size),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useGoodsReceivedItem = (id: number) => {
  return useQuery<GoodsReceived, Error>(
    PURCHASE_QUERY_KEYS.goodsReceivedItem(id),
    () => purchaseService.getGoodsReceivedById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

// Payment Voucher Hooks
export const usePaymentVouchers = (page = 0, size = 10) => {
  return useQuery(
    [PURCHASE_QUERY_KEYS.paymentVouchers, page, size],
    () => purchaseService.getAllPaymentVouchers(page, size),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const usePaymentVoucher = (id: number) => {
  return useQuery<PaymentVoucher, Error>(
    PURCHASE_QUERY_KEYS.paymentVoucher(id),
    () => purchaseService.getPaymentVoucherById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useOverduePayments = () => {
  return useQuery<PaymentVoucher[], Error>(
    PURCHASE_QUERY_KEYS.overduePayments,
    purchaseService.getOverduePayments,
    {
      staleTime: 5 * 60 * 1000,
      refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    }
  );
};

// Currency Hooks
export const useCurrentExchangeRate = () => {
  return useQuery(
    PURCHASE_QUERY_KEYS.exchangeRate,
    purchaseService.getCurrentExchangeRate,
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
      refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
    }
  );
};

export const useCurrencyConversion = (usdAmount: number) => {
  return useQuery(
    PURCHASE_QUERY_KEYS.currencyConversion(usdAmount),
    () => purchaseService.convertUsdToEtb(usdAmount),
    {
      enabled: !!usdAmount && usdAmount > 0,
      staleTime: 15 * 60 * 1000,
    }
  );
};

// Approval Workflow Hooks
export const usePendingApprovals = (approverRole: string) => {
  return useQuery(
    PURCHASE_QUERY_KEYS.pendingApprovals(approverRole),
    () => purchaseService.getPendingApprovals(approverRole),
    {
      enabled: !!approverRole,
      staleTime: 2 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }
  );
};

// Health Check Hook
export const usePurchaseHealthCheck = () => {
  return useQuery(
    PURCHASE_QUERY_KEYS.healthCheck,
    purchaseService.healthCheck,
    {
      staleTime: 30 * 1000, // 30 seconds
      refetchInterval: 60 * 1000, // 1 minute
      retry: 2,
    }
  );
};

// Combined hooks for specific workflows
export const useEthiopianPurchaseDashboard = () => {
  const dashboard = usePurchaseDashboard();
  const exchangeRate = useCurrentExchangeRate();
  const overduePayments = useOverduePayments();

  return {
    dashboard,
    exchangeRate,
    overduePayments,
    isLoading: dashboard.isLoading || exchangeRate.isLoading || overduePayments.isLoading,
    hasError: dashboard.isError || exchangeRate.isError || overduePayments.isError,
  };
};

export const useSupplierManagement = () => {
  const suppliers = useSuppliers();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deactivateSupplier = useDeactivateSupplier();
  const activateSupplier = useActivateSupplier();

  return {
    suppliers,
    createSupplier,
    updateSupplier,
    deactivateSupplier,
    activateSupplier,
  };
};
