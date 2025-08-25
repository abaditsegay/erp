/**
 * Ethiopian Inventory Analytics Types
 * Comprehensive types for inventory management, analysis, and reporting
 */

export interface InventoryAnalytics {
  totalItems: number;
  totalValue: number;
  totalValueEtb: number;
  inventoryTurnover: number;
  daysSalesInventory: number;
  abcAnalysis: ABCAnalysis;
  slowMovingItems: SlowMovingItem[];
  stockCountData: StockCountData;
  valuationReport: ValuationReport;
  taskStatus: TaskStatus[];
}

// ABC Analysis Types
export interface ABCAnalysis {
  aItems: InventoryItem[];
  bItems: InventoryItem[];
  cItems: InventoryItem[];
  analysis: {
    aItemsPercentage: number;
    bItemsPercentage: number;
    cItemsPercentage: number;
    aValuePercentage: number;
    bValuePercentage: number;
    cValuePercentage: number;
  };
}

export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  unitPrice: number;
  totalValue: number;
  monthlyUsage: number;
  annualUsage: number;
  turnoverRate: number;
  abcClassification: 'A' | 'B' | 'C';
  warehouseId: number;
  warehouseName: string;
  supplierId?: number;
  supplierName?: string;
  reorderLevel: number;
  reorderQuantity: number;
  lastMovementDate: string;
  leadTimeDays: number;
  isActive: boolean;
  notes?: string;
}

// Slow Moving Items Types
export interface SlowMovingItem {
  id: number;
  item: InventoryItem;
  daysSinceLastMovement: number;
  quantityOnHand: number;
  totalValue: number;
  totalValueEtb: number;
  monthlyUsageAverage: number;
  recommendedAction: 'promotion' | 'liquidation' | 'return_to_supplier' | 'write_off' | 'transfer';
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  warehouseName: string;
  categoryName: string;
}

// Stock Count Types
export interface StockCountData {
  id: number;
  countType: 'cycle' | 'annual' | 'spot' | 'perpetual';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  startDate?: string;
  completedDate?: string;
  warehouseId: number;
  warehouseName: string;
  itemsToCount: number;
  itemsCounted: number;
  variancesFound: number;
  totalVarianceValue: number;
  totalVarianceValueEtb: number;
  countedBy: string;
  verifiedBy?: string;
  notes?: string;
  items: StockCountItem[];
}

export interface StockCountItem {
  id: number;
  itemId: number;
  itemName: string;
  itemSku: string;
  systemQuantity: number;
  countedQuantity: number;
  variance: number;
  variancePercentage: number;
  unitPrice: number;
  varianceValue: number;
  varianceValueEtb: number;
  reason?: string;
  notes?: string;
  countedBy: string;
  countedDate: string;
}

// Valuation Report Types
export interface ValuationReport {
  reportDate: string;
  warehouseId?: number;
  warehouseName?: string;
  valuationMethod: 'fifo' | 'lifo' | 'weighted_average' | 'standard_cost';
  exchangeRate: number;
  categories: CategoryValuation[];
  warehouses: WarehouseValuation[];
  summary: ValuationSummary;
}

export interface CategoryValuation {
  categoryId: number;
  categoryName: string;
  itemCount: number;
  totalQuantity: number;
  totalValueUsd: number;
  totalValueEtb: number;
  percentageOfTotal: number;
  averageUnitPrice: number;
  fastMovingItemsCount: number;
  slowMovingItemsCount: number;
}

export interface WarehouseValuation {
  warehouseId: number;
  warehouseName: string;
  region: string;
  itemCount: number;
  totalValueUsd: number;
  totalValueEtb: number;
  utilizationPercentage: number;
  capacity: number;
  activeItems: number;
  inactiveItems: number;
  lastUpdated: string;
}

export interface ValuationSummary {
  totalItemsCount: number;
  totalValueUsd: number;
  totalValueEtb: number;
  totalQuantity: number;
  averageItemValue: number;
  highestValueCategory: string;
  lowestValueCategory: string;
  mostActiveWarehouse: string;
  leastActiveWarehouse: string;
  lastValuationDate: string;
}

// Task Status Types
export interface TaskStatus {
  id: number;
  taskType: 'stock_count' | 'reorder' | 'transfer' | 'adjustment' | 'disposal' | 'customs_clearance';
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent';
  assignedTo: string;
  assignedBy: string;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  progress: number; // 0-100
  relatedItemId?: number;
  relatedItemName?: string;
  relatedWarehouseId?: number;
  relatedWarehouseName?: string;
  estimatedHours?: number;
  actualHours?: number;
  notes?: string;
  attachments?: TaskAttachment[];
}

export interface TaskAttachment {
  id: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedDate: string;
  uploadedBy: string;
  fileUrl: string;
}

// Stock View Types
export interface StockView {
  warehouseId: number;
  warehouseName: string;
  region: string;
  items: StockViewItem[];
  summary: StockViewSummary;
  filters: StockViewFilters;
}

export interface StockViewItem {
  id: number;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  totalValueEtb: number;
  reorderLevel: number;
  reorderQuantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
  lastMovement: {
    date: string;
    type: 'in' | 'out' | 'adjustment' | 'transfer';
    quantity: number;
    reference: string;
  };
  supplier?: {
    id: number;
    name: string;
    contact: string;
  };
  location: {
    zone: string;
    aisle: string;
    shelf: string;
    bin: string;
  };
}

export interface StockViewSummary {
  totalItems: number;
  totalValue: number;
  totalValueEtb: number;
  inStockItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockItems: number;
  categories: {
    name: string;
    count: number;
    value: number;
  }[];
}

export interface StockViewFilters {
  category?: string;
  status?: string;
  zone?: string;
  supplier?: string;
  searchTerm?: string;
  sortBy?: 'name' | 'sku' | 'category' | 'stock' | 'value' | 'lastMovement';
  sortOrder?: 'asc' | 'desc';
}

// Reorder Types
export interface ReorderRequest {
  id: number;
  itemId: number;
  itemName: string;
  itemSku: string;
  currentStock: number;
  reorderLevel: number;
  suggestedQuantity: number;
  requestedQuantity: number;
  unitPrice: number;
  totalCost: number;
  totalCostEtb: number;
  supplierId: number;
  supplierName: string;
  leadTimeDays: number;
  expectedDeliveryDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'submitted' | 'approved' | 'ordered' | 'delivered' | 'cancelled';
  requestedBy: string;
  requestedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  warehouseId: number;
  warehouseName: string;
  notes?: string;
  justification: string;
}

// Edit Item Types
export interface EditableInventoryItem {
  id: number;
  sku: string;
  name: string;
  description?: string;
  category: string;
  unitOfMeasure: string;
  unitPrice: number;
  reorderLevel: number;
  reorderQuantity: number;
  leadTimeDays: number;
  isActive: boolean;
  trackSerial: boolean;
  trackBatch: boolean;
  supplierId?: number;
  supplierName?: string;
  manufacturerPartNumber?: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch';
  };
  storageRequirements?: {
    temperature?: {
      min: number;
      max: number;
      unit: 'celsius' | 'fahrenheit';
    };
    humidity?: {
      min: number;
      max: number;
    };
    specialHandling?: string[];
  };
  location: {
    zone: string;
    aisle: string;
    shelf: string;
    bin: string;
  };
  tags?: string[];
  notes?: string;
  lastUpdated: string;
  updatedBy: string;
}

// Ethiopian-specific interfaces
export interface EthiopianInventoryMetrics {
  customsValue: number;
  customsValueEtb: number;
  dutyPaid: number;
  vatPaid: number;
  exciseTaxPaid: number;
  importDutyPercentage: number;
  vatPercentage: number;
  exciseTaxPercentage: number;
  clearanceStatus: 'pending' | 'in_process' | 'cleared' | 'held' | 'rejected';
  clearanceDate?: string;
  customsReference?: string;
  portOfEntry: string;
  declarationNumber?: string;
}

export interface EthiopianBusinessRules {
  minimumStockDays: number;
  maximumStockDays: number;
  seasonalityFactor: number;
  localProcurementPercentage: number;
  foreignExchangeRequired: boolean;
  licenseRequired: boolean;
  licenseType?: string;
  licenseExpiryDate?: string;
  restrictedForExport: boolean;
  dutyFreeEligible: boolean;
}

// Report Export Types
export interface ReportExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  includeDetails: boolean;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  filters?: {
    warehouseIds?: number[];
    categoryIds?: number[];
    supplierIds?: number[];
  };
  groupBy?: 'warehouse' | 'category' | 'supplier' | 'none';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  language: 'en' | 'am'; // English or Amharic
}
