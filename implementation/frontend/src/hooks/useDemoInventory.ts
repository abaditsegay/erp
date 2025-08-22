import { useMockData } from '../contexts/MockDataProvider';

// Demo hooks that provide mock data for development/demonstration
export const useDemoInventoryDashboard = () => {
  const mockData = useMockData();
  
  return {
    dashboard: { data: mockData.dashboard, isLoading: false, isError: false },
    lowStock: { data: mockData.lowStockItems, isLoading: false, isError: false },
    valuationEtb: { data: mockData.valuationEtb, isLoading: false, isError: false },
    pendingCustoms: { data: mockData.pendingCustomsItems, isLoading: false, isError: false },
    isLoading: false,
    hasError: false,
  };
};

export const useDemoWarehouses = () => {
  const mockData = useMockData();
  
  return {
    data: mockData.warehouses,
    isLoading: false,
    isError: false,
  };
};

// Re-export all the real hooks for when backend is available
export * from './useInventory';
