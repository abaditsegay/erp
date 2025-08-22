import { useQuery, useMutation, useQueryClient } from 'react-query';
import { inventoryService } from '../services/inventoryService';
import {
  InventoryDashboard,
  Warehouse,
  StockLevel,
  StockMovement,
  Item,
  CreateItemForm,
  CreateWarehouseForm,
  StockMovementForm,
  StockCountForm,
  EthiopianRegion
} from '../types/inventory';

// Query Keys for React Query
export const INVENTORY_QUERY_KEYS = {
  dashboard: 'inventory-dashboard',
  warehouses: 'warehouses',
  warehousesByRegion: (region: EthiopianRegion) => ['warehouses', 'region', region],
  warehouseStock: (warehouseId: number) => ['warehouse-stock', warehouseId],
  lowStock: 'low-stock',
  stockMovements: 'stock-movements',
  items: 'items',
  item: (id: number) => ['item', id],
  abcAnalysis: 'abc-analysis',
  slowMovingItems: (days: number) => ['slow-moving-items', days],
  statistics: 'inventory-statistics',
  currencyConversion: (amount: number) => ['currency-conversion', amount],
  valuationEtb: 'inventory-valuation-etb',
  customsPending: 'customs-pending',
  healthCheck: 'inventory-health',
} as const;

// Dashboard Hook
export const useInventoryDashboard = () => {
  return useQuery<InventoryDashboard, Error>(
    INVENTORY_QUERY_KEYS.dashboard,
    inventoryService.getDashboard,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    }
  );
};

// Warehouse Hooks
export const useWarehouses = () => {
  return useQuery<Warehouse[], Error>(
    INVENTORY_QUERY_KEYS.warehouses,
    inventoryService.getAllWarehouses,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

export const useWarehousesByRegion = (region: EthiopianRegion) => {
  return useQuery<Warehouse[], Error>(
    INVENTORY_QUERY_KEYS.warehousesByRegion(region),
    () => inventoryService.getWarehousesByRegion(region),
    {
      enabled: !!region,
      staleTime: 10 * 60 * 1000,
    }
  );
};

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation<Warehouse, Error, CreateWarehouseForm>(
    inventoryService.createWarehouse,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.warehouses);
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.dashboard);
      },
    }
  );
};

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation<Warehouse, Error, { id: number; data: Partial<CreateWarehouseForm> }>(
    ({ id, data }) => inventoryService.updateWarehouse(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.warehouses);
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.dashboard);
      },
    }
  );
};

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>(
    inventoryService.deleteWarehouse,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.warehouses);
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.dashboard);
      },
    }
  );
};

// Stock Level Hooks
export const useWarehouseStock = (warehouseId: number) => {
  return useQuery<StockLevel[], Error>(
    INVENTORY_QUERY_KEYS.warehouseStock(warehouseId),
    () => inventoryService.getWarehouseStock(warehouseId),
    {
      enabled: !!warehouseId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
};

export const useLowStockItems = () => {
  return useQuery<StockLevel[], Error>(
    INVENTORY_QUERY_KEYS.lowStock,
    inventoryService.getLowStockItems,
    {
      staleTime: 1 * 60 * 1000, // 1 minute
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }
  );
};

export const useUpdateStockLevel = () => {
  const queryClient = useQueryClient();

  return useMutation<StockLevel, Error, { stockId: number; data: Partial<StockLevel> }>(
    ({ stockId, data }) => inventoryService.updateStockLevel(stockId, data),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.lowStock);
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.dashboard);
        // Invalidate specific warehouse stock if we know which warehouse
        queryClient.invalidateQueries(['warehouse-stock']);
      },
    }
  );
};

// Stock Movement Hooks
export const useStockMovements = (page = 0, size = 10) => {
  return useQuery(
    [INVENTORY_QUERY_KEYS.stockMovements, page, size],
    () => inventoryService.getStockMovements(page, size),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const useStockMovementsByDateRange = (startDate: string, endDate: string) => {
  return useQuery<StockMovement[], Error>(
    [INVENTORY_QUERY_KEYS.stockMovements, 'date-range', startDate, endDate],
    () => inventoryService.getStockMovementsByDateRange(startDate, endDate),
    {
      enabled: !!startDate && !!endDate,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useAddStockMovement = () => {
  const queryClient = useQueryClient();

  return useMutation<StockMovement, Error, StockMovementForm>(
    inventoryService.addStockMovement,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.stockMovements);
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.dashboard);
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.lowStock);
        queryClient.invalidateQueries(['warehouse-stock']);
      },
    }
  );
};

// Item Hooks
export const useItems = (page = 0, size = 10) => {
  return useQuery(
    [INVENTORY_QUERY_KEYS.items, page, size],
    () => inventoryService.getAllItems(page, size),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useItem = (id: number) => {
  return useQuery<Item, Error>(
    INVENTORY_QUERY_KEYS.item(id),
    () => inventoryService.getItemById(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
    }
  );
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, CreateItemForm>(
    inventoryService.createItem,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.items);
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.dashboard);
      },
    }
  );
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, { id: number; data: Partial<CreateItemForm> }>(
    ({ id, data }) => inventoryService.updateItem(id, data),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.items);
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.item(variables.id));
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.dashboard);
      },
    }
  );
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>(
    inventoryService.deleteItem,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.items);
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.dashboard);
      },
    }
  );
};

// Analytics Hooks
export const useAbcAnalysis = () => {
  return useQuery(
    INVENTORY_QUERY_KEYS.abcAnalysis,
    inventoryService.getAbcAnalysis,
    {
      staleTime: 60 * 60 * 1000, // 1 hour
    }
  );
};

export const useSlowMovingItems = (days = 90) => {
  return useQuery<Item[], Error>(
    INVENTORY_QUERY_KEYS.slowMovingItems(days),
    () => inventoryService.getSlowMovingItems(days),
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );
};

export const useInventoryStatistics = () => {
  return useQuery(
    INVENTORY_QUERY_KEYS.statistics,
    inventoryService.getInventoryStatistics,
    {
      staleTime: 10 * 60 * 1000,
    }
  );
};

// Currency Conversion Hooks (Ethiopian Birr)
export const useCurrencyConversion = (usdAmount: number) => {
  return useQuery(
    INVENTORY_QUERY_KEYS.currencyConversion(usdAmount),
    () => inventoryService.convertUsdToEtb(usdAmount),
    {
      enabled: !!usdAmount && usdAmount > 0,
      staleTime: 15 * 60 * 1000, // 15 minutes
    }
  );
};

export const useInventoryValuationEtb = () => {
  return useQuery(
    INVENTORY_QUERY_KEYS.valuationEtb,
    inventoryService.getInventoryValuationInEtb,
    {
      staleTime: 10 * 60 * 1000,
    }
  );
};

// Customs Hooks
export const usePendingCustomsItems = () => {
  return useQuery<Item[], Error>(
    INVENTORY_QUERY_KEYS.customsPending,
    inventoryService.getPendingCustomsItems,
    {
      staleTime: 5 * 60 * 1000,
      refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    }
  );
};

// Stock Count Hook
export const useInitiateStockCount = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, StockCountForm>(
    inventoryService.initiateStockCount,
    {
      onSuccess: () => {
        // Invalidate all stock-related queries as they may be affected
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.dashboard);
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.lowStock);
        queryClient.invalidateQueries(['warehouse-stock']);
        queryClient.invalidateQueries(INVENTORY_QUERY_KEYS.stockMovements);
      },
    }
  );
};

// Health Check Hook
export const useInventoryHealthCheck = () => {
  return useQuery(
    INVENTORY_QUERY_KEYS.healthCheck,
    inventoryService.healthCheck,
    {
      staleTime: 30 * 1000, // 30 seconds
      refetchInterval: 60 * 1000, // 1 minute
      retry: 2,
    }
  );
};

// Combined hooks for specific workflows
export const useEthiopianInventoryDashboard = () => {
  const dashboard = useInventoryDashboard();
  const lowStock = useLowStockItems();
  const valuationEtb = useInventoryValuationEtb();
  const pendingCustoms = usePendingCustomsItems();

  return {
    dashboard,
    lowStock,
    valuationEtb,
    pendingCustoms,
    isLoading: dashboard.isLoading || lowStock.isLoading || valuationEtb.isLoading || pendingCustoms.isLoading,
    hasError: dashboard.isError || lowStock.isError || valuationEtb.isError || pendingCustoms.isError,
  };
};
