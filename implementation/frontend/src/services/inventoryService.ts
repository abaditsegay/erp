import axios from 'axios';
import {
  InventoryDashboard,
  Warehouse,
  StockLevel,
  StockMovement,
  Item,
  CurrencyConversion,
  InventoryStatistics,
  AbcAnalysis,
  PaginatedResponse,
  CreateItemForm,
  CreateWarehouseForm,
  StockMovementForm,
  StockCountForm,
  EthiopianRegion
} from '../types/inventory';

const API_BASE_URL = '/api/inventory';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const inventoryService = {
  // Dashboard
  getDashboard: async (): Promise<InventoryDashboard> => {
    const response = await api.get<InventoryDashboard>('/dashboard');
    return response.data;
  },

  // Warehouses
  getAllWarehouses: async (): Promise<Warehouse[]> => {
    const response = await api.get<Warehouse[]>('/warehouses');
    return response.data;
  },

  getWarehousesByRegion: async (region: EthiopianRegion): Promise<Warehouse[]> => {
    const response = await api.get<Warehouse[]>(`/warehouses/region/${region}`);
    return response.data;
  },

  createWarehouse: async (warehouseData: CreateWarehouseForm): Promise<Warehouse> => {
    const response = await api.post<Warehouse>('/warehouses', warehouseData);
    return response.data;
  },

  updateWarehouse: async (id: number, warehouseData: Partial<CreateWarehouseForm>): Promise<Warehouse> => {
    const response = await api.put<Warehouse>(`/warehouses/${id}`, warehouseData);
    return response.data;
  },

  deleteWarehouse: async (id: number): Promise<void> => {
    await api.delete(`/warehouses/${id}`);
  },

  // Stock Levels
  getWarehouseStock: async (warehouseId: number): Promise<StockLevel[]> => {
    const response = await api.get<StockLevel[]>(`/warehouses/${warehouseId}/stock`);
    return response.data;
  },

  getLowStockItems: async (): Promise<StockLevel[]> => {
    const response = await api.get<StockLevel[]>('/low-stock');
    return response.data;
  },

  updateStockLevel: async (stockId: number, stockData: Partial<StockLevel>): Promise<StockLevel> => {
    const response = await api.put<StockLevel>(`/stock/${stockId}`, stockData);
    return response.data;
  },

  // Stock Movements
  getStockMovements: async (page = 0, size = 10): Promise<PaginatedResponse<StockMovement>> => {
    const response = await api.get<PaginatedResponse<StockMovement>>(`/movements?page=${page}&size=${size}`);
    return response.data;
  },

  getStockMovementsByDateRange: async (startDate: string, endDate: string): Promise<StockMovement[]> => {
    const response = await api.get<StockMovement[]>(`/movements/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  addStockMovement: async (movementData: StockMovementForm): Promise<StockMovement> => {
    const response = await api.post<StockMovement>('/movements', movementData);
    return response.data;
  },

  // Items
  getAllItems: async (page = 0, size = 10): Promise<PaginatedResponse<Item>> => {
    const response = await api.get<PaginatedResponse<Item>>(`/items?page=${page}&size=${size}`);
    return response.data;
  },

  getItemById: async (id: number): Promise<Item> => {
    const response = await api.get<Item>(`/items/${id}`);
    return response.data;
  },

  createItem: async (itemData: CreateItemForm): Promise<Item> => {
    const response = await api.post<Item>('/items', itemData);
    return response.data;
  },

  updateItem: async (id: number, itemData: Partial<CreateItemForm>): Promise<Item> => {
    const response = await api.put<Item>(`/items/${id}`, itemData);
    return response.data;
  },

  deleteItem: async (id: number): Promise<void> => {
    await api.delete(`/items/${id}`);
  },

  // Analytics
  getAbcAnalysis: async (): Promise<AbcAnalysis> => {
    const response = await api.get<AbcAnalysis>('/abc-analysis');
    return response.data;
  },

  getSlowMovingItems: async (days = 90): Promise<Item[]> => {
    const response = await api.get<Item[]>(`/slow-moving?days=${days}`);
    return response.data;
  },

  getInventoryStatistics: async (): Promise<InventoryStatistics> => {
    const response = await api.get<InventoryStatistics>('/statistics');
    return response.data;
  },

  // Currency Conversion (Ethiopian Birr)
  convertUsdToEtb: async (usdAmount: number): Promise<CurrencyConversion> => {
    const response = await api.get<CurrencyConversion>(`/currency/usd-to-etb?usdAmount=${usdAmount}`);
    return response.data;
  },

  getInventoryValuationInEtb: async (): Promise<{ totalValueUsd: number; totalValueEtb: number; exchangeRate: number; timestamp: string }> => {
    const response = await api.get('/valuation/etb');
    return response.data;
  },

  // Customs and Import Management
  getPendingCustomsItems: async (): Promise<Item[]> => {
    const response = await api.get<Item[]>('/customs/pending');
    return response.data;
  },

  // Stock Count Procedures
  initiateStockCount: async (stockCountData: StockCountForm): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/stock-count/initiate', {
      warehouseId: stockCountData.warehouseId,
      countType: stockCountData.countType,
      notes: stockCountData.notes
    });
    return response.data;
  },

  // Health Check
  healthCheck: async (): Promise<{ status: string; service: string; timestamp: string; version: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Helper functions for Ethiopian business operations
export const ethiopianHelpers = {
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

  // Get warehouse type display name
  getWarehouseTypeDisplay: (type: string): string => {
    const typeMap: Record<string, string> = {
      MAIN_WAREHOUSE: 'Main Warehouse',
      DISTRIBUTION_CENTER: 'Distribution Center',
      CUSTOMS_WAREHOUSE: 'Customs Warehouse',
      RETAIL_OUTLET: 'Retail Outlet',
      COLD_STORAGE: 'Cold Storage',
    };
    return typeMap[type] || type;
  },

  // Calculate inventory turnover
  calculateInventoryTurnover: (costOfGoodsSold: number, averageInventory: number): number => {
    return averageInventory > 0 ? costOfGoodsSold / averageInventory : 0;
  },

  // Calculate days sales in inventory
  calculateDaysSalesInInventory: (averageInventory: number, costOfGoodsSold: number): number => {
    const dailyCogs = costOfGoodsSold / 365;
    return dailyCogs > 0 ? averageInventory / dailyCogs : 0;
  },

  // Validate Ethiopian region
  isValidEthiopianRegion: (region: string): boolean => {
    const validRegions = [
      'Addis Ababa', 'Afar', 'Amhara', 'Benishangul-Gumuz', 'Dire Dawa',
      'Gambela', 'Harari', 'Oromia', 'Sidama', 'SNNP', 'Somali', 'Tigray'
    ];
    return validRegions.includes(region);
  },
};

export default inventoryService;
