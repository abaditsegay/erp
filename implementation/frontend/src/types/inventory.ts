// Types for Ethiopian Inventory Management System

export interface Item {
  id: number;
  name: string;
  description?: string;
  sku: string;
  category?: string;
  unitPrice: number;
  unitPriceUsd: number; // USD price for Ethiopian business
  standardCost?: number;
  reorderLevel?: number;
  maxStockLevel?: number;
  unit: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string;
}

export interface Warehouse {
  id: number;
  name: string;
  address: string;
  region: EthiopianRegion;
  type: WarehouseType;
  capacity?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum WarehouseType {
  MAIN_WAREHOUSE = 'MAIN_WAREHOUSE',
  DISTRIBUTION_CENTER = 'DISTRIBUTION_CENTER',
  CUSTOMS_WAREHOUSE = 'CUSTOMS_WAREHOUSE',
  RETAIL_OUTLET = 'RETAIL_OUTLET',
  COLD_STORAGE = 'COLD_STORAGE'
}

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT'
}

export interface StockLevel {
  id: number;
  item: Item;
  warehouse?: Warehouse;
  currentQuantity: number;
  minimumQuantity: number;
  maximumQuantity: number;
  reorderPoint: number;
  lastUpdated: string;
}

export interface StockMovement {
  id: number;
  item: Item;
  warehouse?: Warehouse;
  movementType: string;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  movementDate: string;
  reference?: string;
  reason?: string;
  notes?: string;
  fromLocation?: string;
  toLocation?: string;
  createdBy?: string;
}

export interface InventoryDashboard {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  warehouseCount: number;
  recentMovements: StockMovement[];
  inventoryTurnover?: number;
  daysSalesInventory?: number;
}

export interface WarehouseStats {
  warehouseId: number;
  warehouseName: string;
  location: string;
  itemCount: number;
  totalValue: number;
  utilizationPercentage: number;
  lowStockCount: number;
}

export interface CategoryStats {
  category: string;
  itemCount: number;
  totalValue: number;
  lowStockCount: number;
}

export interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  user?: string;
  reference?: string;
}

export interface CurrencyConversion {
  usdAmount: number;
  etbAmount: number;
  exchangeRate: number;
  timestamp: string;
}

export interface InventoryStatistics {
  totalItems: number;
  totalWarehouses: number;
  lowStockItems: number;
  totalValueUsd: number;
  totalValueEtb: number;
  timestamp: string;
}

export interface AbcAnalysis {
  A: Item[];
  B: Item[];
  C: Item[];
}

// Ethiopian Regions for warehouse location
export const ETHIOPIAN_REGIONS = [
  'Addis Ababa',
  'Afar',
  'Amhara',
  'Benishangul-Gumuz',
  'Dire Dawa',
  'Gambela',
  'Harari',
  'Oromia',
  'Sidama',
  'SNNP',
  'Somali',
  'Tigray'
] as const;

export type EthiopianRegion = typeof ETHIOPIAN_REGIONS[number];

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Form types
export interface CreateItemForm {
  name: string;
  description?: string;
  sku: string;
  category?: string;
  unitPrice: number;
  standardCost?: number;
  reorderLevel?: number;
  maxStockLevel?: number;
  unit: string;
}

export interface CreateWarehouseForm {
  name: string;
  location: string;
  address?: string;
  city?: string;
  region?: EthiopianRegion;
  warehouseType: WarehouseType;
  capacity?: number;
  description?: string;
}

export interface StockMovementForm {
  itemId: number;
  movementType: string;
  quantity: number;
  unitCost?: number;
  reference?: string;
  notes?: string;
  fromLocation?: string;
  toLocation?: string;
}

export interface StockCountForm {
  warehouseId: number;
  countType: 'FULL' | 'CYCLE' | 'SPOT';
  notes?: string;
}
