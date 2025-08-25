/**
 * Advanced Inventory Management Service
 * Phase 1.4: Core ERP Module Enhancement
 * 
 * Features:
 * - Multi-location inventory tracking
 * - Real-time stock monitoring
 * - Automated reorder management
 * - Batch and serial number tracking
 * - Inventory valuation methods
 * - Stock movement analysis
 * - Ethiopian tax compliance
 */

import { apiService } from './apiService';

// Enhanced Inventory Interfaces
export interface InventoryLocation {
  id: string;
  name: string;
  type: 'WAREHOUSE' | 'STORE' | 'FACTORY' | 'DISTRIBUTION_CENTER';
  address: string;
  region: string;
  zone: string;
  woreda: string;
  manager: string;
  capacity: number;
  currentUtilization: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface EnhancedInventoryItem {
  id: string;
  code: string;
  name: string;
  description: string;
  category: InventoryCategory;
  unit: string;
  
  // Classification
  type: 'RAW_MATERIAL' | 'FINISHED_GOODS' | 'WORK_IN_PROGRESS' | 'SPARE_PARTS' | 'CONSUMABLES';
  abcClassification: 'A' | 'B' | 'C';
  criticality: 'CRITICAL' | 'IMPORTANT' | 'NORMAL' | 'NON_CRITICAL';
  
  // Stock Information
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  onOrderStock: number;
  locations: InventoryLocationStock[];
  
  // Reorder Management
  reorderPoint: number;
  reorderQuantity: number;
  maxStockLevel: number;
  minStockLevel: number;
  safetyStock: number;
  leadTimeDays: number;
  
  // Costing
  costingMethod: 'FIFO' | 'LIFO' | 'WEIGHTED_AVERAGE' | 'STANDARD';
  standardCost: number;
  averageCost: number;
  lastPurchaseCost: number;
  
  // Tracking
  batchTracked: boolean;
  serialNumberTracked: boolean;
  expiryTracked: boolean;
  
  // Ethiopian Specific
  exciseTaxApplicable: boolean;
  vatRate: number;
  hsCode?: string;
  
  // Status
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  createdAt: string;
  updatedAt: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  level: number;
  description: string;
  isActive: boolean;
}

export interface InventoryLocationStock {
  locationId: string;
  locationName: string;
  quantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  lastUpdated: string;
  batches?: InventoryBatch[];
}

export interface InventoryBatch {
  id: string;
  batchNumber: string;
  quantity: number;
  manufacturingDate?: string;
  expiryDate?: string;
  supplierBatchNumber?: string;
  qualityStatus: 'APPROVED' | 'PENDING' | 'REJECTED' | 'QUARANTINE';
  cost: number;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  movementType: 'RECEIPT' | 'ISSUE' | 'TRANSFER' | 'ADJUSTMENT' | 'RETURN';
  transactionType: 'PURCHASE' | 'SALE' | 'PRODUCTION' | 'TRANSFER' | 'ADJUSTMENT' | 'RETURN';
  
  fromLocationId?: string;
  fromLocationName?: string;
  toLocationId?: string;
  toLocationName?: string;
  
  quantity: number;
  unitCost: number;
  totalValue: number;
  
  batchId?: string;
  batchNumber?: string;
  
  referenceType: 'PURCHASE_ORDER' | 'SALES_ORDER' | 'PRODUCTION_ORDER' | 'TRANSFER_ORDER' | 'MANUAL_ADJUSTMENT';
  referenceId: string;
  referenceNumber: string;
  
  reason?: string;
  notes?: string;
  
  userId: string;
  userName: string;
  timestamp: string;
  
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface InventoryValuation {
  itemId: string;
  itemName: string;
  locationId: string;
  locationName: string;
  quantity: number;
  
  fifoValue: number;
  lifoValue: number;
  weightedAverageValue: number;
  standardValue: number;
  
  lastMovementDate: string;
  turnoverRatio: number;
  daysOnHand: number;
}

export interface ReorderAlert {
  id: string;
  itemId: string;
  itemName: string;
  locationId: string;
  locationName: string;
  currentStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  
  alertType: 'REORDER_POINT' | 'MINIMUM_STOCK' | 'OVERSTOCK' | 'SLOW_MOVING' | 'EXPIRY_WARNING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  
  suggestedAction: string;
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
}

export interface InventoryAnalytics {
  totalValue: number;
  totalItems: number;
  totalLocations: number;
  
  byCategory: {
    categoryId: string;
    categoryName: string;
    itemCount: number;
    totalValue: number;
    percentage: number;
  }[];
  
  byLocation: {
    locationId: string;
    locationName: string;
    itemCount: number;
    totalValue: number;
    utilization: number;
  }[];
  
  abcAnalysis: {
    classification: 'A' | 'B' | 'C';
    itemCount: number;
    valuePercentage: number;
    quantityPercentage: number;
  }[];
  
  turnoverAnalysis: {
    fastMoving: number;
    normalMoving: number;
    slowMoving: number;
    deadStock: number;
  };
  
  stockLevels: {
    overstock: number;
    optimal: number;
    understock: number;
    outOfStock: number;
  };
  
  alerts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface InventoryReport {
  reportType: 'STOCK_STATUS' | 'VALUATION' | 'MOVEMENT' | 'REORDER' | 'ABC_ANALYSIS' | 'TURNOVER';
  title: string;
  generatedAt: string;
  generatedBy: string;
  
  filters: {
    dateFrom?: string;
    dateTo?: string;
    locationIds?: string[];
    categoryIds?: string[];
    itemIds?: string[];
  };
  
  data: any[];
  summary: any;
  
  exportFormats: ('PDF' | 'EXCEL' | 'CSV')[];
}

class AdvancedInventoryService {
  /**
   * Get enhanced inventory items with advanced filtering
   */
  async getInventoryItems(filters: {
    locationId?: string;
    categoryId?: string;
    type?: string;
    abcClassification?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    items: EnhancedInventoryItem[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiService.get(`/inventory/items?${params}`);
      return response.data as {
        items: EnhancedInventoryItem[];
        total: number;
        page: number;
        totalPages: number;
      };
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      // Return mock data for development
      return this.getMockInventoryItems(filters);
    }
  }

  /**
   * Get inventory item by ID with full details
   */
  async getInventoryItemById(id: string): Promise<EnhancedInventoryItem> {
    try {
      const response = await apiService.get(`/inventory/items/${id}`);
      return response.data as EnhancedInventoryItem;
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      return this.getMockInventoryItem(id);
    }
  }

  /**
   * Create or update inventory item
   */
  async saveInventoryItem(item: Partial<EnhancedInventoryItem>): Promise<EnhancedInventoryItem> {
    try {
      const url = item.id ? `/inventory/items/${item.id}` : '/inventory/items';
      const method = item.id ? 'put' : 'post';
      const response = await apiService[method](url, item);
      return response.data as EnhancedInventoryItem;
    } catch (error) {
      console.error('Error saving inventory item:', error);
      throw error;
    }
  }

  /**
   * Get stock movements with advanced filtering
   */
  async getStockMovements(filters: {
    itemId?: string;
    locationId?: string;
    movementType?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    movements: StockMovement[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiService.get(`/inventory/movements?${params}`);
      return response.data as {
        movements: StockMovement[];
        total: number;
        page: number;
        totalPages: number;
      };
    } catch (error) {
      console.error('Error fetching stock movements:', error);
      return this.getMockStockMovements(filters);
    }
  }

  /**
   * Create stock movement
   */
  async createStockMovement(movement: Omit<StockMovement, 'id' | 'timestamp' | 'status'>): Promise<StockMovement> {
    try {
      const response = await apiService.post('/inventory/movements', movement);
      return response.data as StockMovement;
    } catch (error) {
      console.error('Error creating stock movement:', error);
      throw error;
    }
  }

  /**
   * Get inventory locations
   */
  async getLocations(): Promise<InventoryLocation[]> {
    try {
      const response = await apiService.get('/inventory/locations');
      return response.data as InventoryLocation[];
    } catch (error) {
      console.error('Error fetching locations:', error);
      return this.getMockLocations();
    }
  }

  /**
   * Get inventory valuation
   */
  async getInventoryValuation(filters: {
    locationId?: string;
    categoryId?: string;
    asOfDate?: string;
  } = {}): Promise<InventoryValuation[]> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiService.get(`/inventory/valuation?${params}`);
      return response.data as InventoryValuation[];
    } catch (error) {
      console.error('Error fetching inventory valuation:', error);
      return this.getMockValuation();
    }
  }

  /**
   * Get reorder alerts
   */
  async getReorderAlerts(filters: {
    locationId?: string;
    alertType?: string;
    severity?: string;
    status?: string;
  } = {}): Promise<ReorderAlert[]> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiService.get(`/inventory/alerts?${params}`);
      return response.data as ReorderAlert[];
    } catch (error) {
      console.error('Error fetching reorder alerts:', error);
      return this.getMockReorderAlerts();
    }
  }

  /**
   * Acknowledge reorder alert
   */
  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      await apiService.post(`/inventory/alerts/${alertId}/acknowledge`);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }

  /**
   * Get inventory analytics
   */
  async getInventoryAnalytics(filters: {
    locationIds?: string[];
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<InventoryAnalytics> {
    try {
      // Temporarily return mock data directly for debugging
      console.log('Loading inventory analytics with filters:', filters);
      return this.getMockAnalytics();
      
      // TODO: Re-enable API call when backend is ready
      // const response = await apiService.post('/inventory/analytics', filters);
      // return response.data as InventoryAnalytics;
    } catch (error) {
      console.error('Error fetching inventory analytics:', error);
      return this.getMockAnalytics();
    }
  }

  /**
   * Generate inventory report
   */
  async generateReport(reportType: InventoryReport['reportType'], filters: any = {}): Promise<InventoryReport> {
    try {
      const response = await apiService.post('/inventory/reports', {
        reportType,
        filters
      });
      return response.data as InventoryReport;
    } catch (error) {
      console.error('Error generating report:', error);
      return this.getMockReport(reportType, filters);
    }
  }

  /**
   * Perform stock adjustment
   */
  async adjustStock(adjustment: {
    itemId: string;
    locationId: string;
    newQuantity: number;
    reason: string;
    notes?: string;
  }): Promise<StockMovement> {
    try {
      const response = await apiService.post('/inventory/adjust', adjustment);
      return response.data as StockMovement;
    } catch (error) {
      console.error('Error adjusting stock:', error);
      throw error;
    }
  }

  /**
   * Transfer stock between locations
   */
  async transferStock(transfer: {
    itemId: string;
    fromLocationId: string;
    toLocationId: string;
    quantity: number;
    notes?: string;
  }): Promise<StockMovement> {
    try {
      const response = await apiService.post('/inventory/transfer', transfer);
      return response.data as StockMovement;
    } catch (error) {
      console.error('Error transferring stock:', error);
      throw error;
    }
  }

  // Mock data methods for development
  private getMockInventoryItems(filters: any): any {
    const mockItems: EnhancedInventoryItem[] = [
      {
        id: '1',
        code: 'CFB001',
        name: 'Ethiopian Coffee Beans - Grade 1',
        description: 'Premium Arabica coffee beans from Sidama region - Single origin',
        category: { id: 'cat1', name: 'Raw Materials', code: 'RM', level: 1, description: 'Raw materials for production', isActive: true },
        unit: 'KG',
        type: 'RAW_MATERIAL',
        abcClassification: 'A',
        criticality: 'CRITICAL',
        totalStock: 5500,
        availableStock: 4800,
        reservedStock: 700,
        onOrderStock: 2500,
        locations: [
          {
            locationId: 'loc1',
            locationName: 'Main Warehouse - Addis Ababa',
            quantity: 3200,
            availableQuantity: 2800,
            reservedQuantity: 400,
            lastUpdated: new Date().toISOString()
          },
          {
            locationId: 'loc2',
            locationName: 'Processing Center - Hawassa',
            quantity: 2300,
            availableQuantity: 2000,
            reservedQuantity: 300,
            lastUpdated: new Date().toISOString()
          }
        ],
        reorderPoint: 1200,
        reorderQuantity: 3500,
        maxStockLevel: 8500,
        minStockLevel: 900,
        safetyStock: 600,
        leadTimeDays: 14,
        costingMethod: 'WEIGHTED_AVERAGE',
        standardCost: 85.50,
        averageCost: 87.20,
        lastPurchaseCost: 89.00,
        batchTracked: true,
        serialNumberTracked: false,
        expiryTracked: true,
        exciseTaxApplicable: false,
        vatRate: 15,
        hsCode: '0901.11',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        code: 'PKG250',
        name: 'Packaging Material - 250g Coffee Bags',
        description: 'Biodegradable coffee packaging bags with Ethiopian branding',
        category: { id: 'cat2', name: 'Packaging Materials', code: 'PKG', level: 1, description: 'Packaging and labeling materials', isActive: true },
        unit: 'PCS',
        type: 'RAW_MATERIAL',
        abcClassification: 'B',
        criticality: 'IMPORTANT',
        totalStock: 15000,
        availableStock: 12500,
        reservedStock: 2500,
        onOrderStock: 10000,
        locations: [
          {
            locationId: 'loc1',
            locationName: 'Main Warehouse - Addis Ababa',
            quantity: 12000,
            availableQuantity: 10000,
            reservedQuantity: 2000,
            lastUpdated: new Date().toISOString()
          },
          {
            locationId: 'loc3',
            locationName: 'Packaging Facility - Mekelle',
            quantity: 3000,
            availableQuantity: 2500,
            reservedQuantity: 500,
            lastUpdated: new Date().toISOString()
          }
        ],
        reorderPoint: 5000,
        reorderQuantity: 15000,
        maxStockLevel: 25000,
        minStockLevel: 3000,
        safetyStock: 2000,
        leadTimeDays: 21,
        costingMethod: 'FIFO',
        standardCost: 2.50,
        averageCost: 2.75,
        lastPurchaseCost: 2.80,
        batchTracked: true,
        serialNumberTracked: false,
        expiryTracked: false,
        exciseTaxApplicable: false,
        vatRate: 15,
        hsCode: '4819.20',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        code: 'CFR250',
        name: 'Premium Roasted Coffee - 250g',
        description: 'Medium roast Ethiopian coffee, packaged and ready for retail',
        category: { id: 'cat3', name: 'Finished Goods', code: 'FG', level: 1, description: 'Ready for sale products', isActive: true },
        unit: 'PCS',
        type: 'FINISHED_GOODS',
        abcClassification: 'A',
        criticality: 'CRITICAL',
        totalStock: 8500,
        availableStock: 7200,
        reservedStock: 1300,
        onOrderStock: 0,
        locations: [
          {
            locationId: 'loc1',
            locationName: 'Main Warehouse - Addis Ababa',
            quantity: 5500,
            availableQuantity: 4700,
            reservedQuantity: 800,
            lastUpdated: new Date().toISOString()
          },
          {
            locationId: 'loc4',
            locationName: 'Retail Store - Bole',
            quantity: 2000,
            availableQuantity: 1800,
            reservedQuantity: 200,
            lastUpdated: new Date().toISOString()
          },
          {
            locationId: 'loc5',
            locationName: 'Distribution Center - Dire Dawa',
            quantity: 1000,
            availableQuantity: 700,
            reservedQuantity: 300,
            lastUpdated: new Date().toISOString()
          }
        ],
        reorderPoint: 2000,
        reorderQuantity: 5000,
        maxStockLevel: 12000,
        minStockLevel: 1500,
        safetyStock: 800,
        leadTimeDays: 7,
        costingMethod: 'WEIGHTED_AVERAGE',
        standardCost: 165.00,
        averageCost: 172.50,
        lastPurchaseCost: 0,
        batchTracked: true,
        serialNumberTracked: false,
        expiryTracked: true,
        exciseTaxApplicable: false,
        vatRate: 15,
        hsCode: '0901.21',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        code: 'SPR001',
        name: 'Coffee Roasting Machine Belt',
        description: 'Replacement belt for Probat roasting machines',
        category: { id: 'cat4', name: 'Spare Parts', code: 'SP', level: 1, description: 'Machine spare parts and maintenance items', isActive: true },
        unit: 'PCS',
        type: 'SPARE_PARTS',
        abcClassification: 'C',
        criticality: 'IMPORTANT',
        totalStock: 12,
        availableStock: 8,
        reservedStock: 4,
        onOrderStock: 6,
        locations: [
          {
            locationId: 'loc2',
            locationName: 'Processing Center - Hawassa',
            quantity: 8,
            availableQuantity: 5,
            reservedQuantity: 3,
            lastUpdated: new Date().toISOString()
          },
          {
            locationId: 'loc1',
            locationName: 'Main Warehouse - Addis Ababa',
            quantity: 4,
            availableQuantity: 3,
            reservedQuantity: 1,
            lastUpdated: new Date().toISOString()
          }
        ],
        reorderPoint: 6,
        reorderQuantity: 12,
        maxStockLevel: 20,
        minStockLevel: 4,
        safetyStock: 3,
        leadTimeDays: 45,
        costingMethod: 'FIFO',
        standardCost: 1850.00,
        averageCost: 1920.00,
        lastPurchaseCost: 1980.00,
        batchTracked: false,
        serialNumberTracked: true,
        expiryTracked: false,
        exciseTaxApplicable: false,
        vatRate: 15,
        hsCode: '8419.90',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        code: 'CFB002',
        name: 'Ethiopian Coffee Beans - Grade 2',
        description: 'Commercial grade Arabica coffee beans for bulk processing',
        category: { id: 'cat1', name: 'Raw Materials', code: 'RM', level: 1, description: 'Raw materials for production', isActive: true },
        unit: 'KG',
        type: 'RAW_MATERIAL',
        abcClassification: 'B',
        criticality: 'NORMAL',
        totalStock: 8200,
        availableStock: 7500,
        reservedStock: 700,
        onOrderStock: 3000,
        locations: [
          {
            locationId: 'loc1',
            locationName: 'Main Warehouse - Addis Ababa',
            quantity: 5000,
            availableQuantity: 4600,
            reservedQuantity: 400,
            lastUpdated: new Date().toISOString()
          },
          {
            locationId: 'loc2',
            locationName: 'Processing Center - Hawassa',
            quantity: 3200,
            availableQuantity: 2900,
            reservedQuantity: 300,
            lastUpdated: new Date().toISOString()
          }
        ],
        reorderPoint: 2000,
        reorderQuantity: 4000,
        maxStockLevel: 12000,
        minStockLevel: 1500,
        safetyStock: 800,
        leadTimeDays: 14,
        costingMethod: 'WEIGHTED_AVERAGE',
        standardCost: 65.00,
        averageCost: 67.50,
        lastPurchaseCost: 69.00,
        batchTracked: true,
        serialNumberTracked: false,
        expiryTracked: true,
        exciseTaxApplicable: false,
        vatRate: 15,
        hsCode: '0901.12',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '6',
        code: 'LAB001',
        name: 'Coffee Cup Labels - Premium',
        description: 'High-quality waterproof labels for premium coffee packaging',
        category: { id: 'cat2', name: 'Packaging Materials', code: 'PKG', level: 1, description: 'Packaging and labeling materials', isActive: true },
        unit: 'PCS',
        type: 'RAW_MATERIAL',
        abcClassification: 'C',
        criticality: 'NORMAL',
        totalStock: 25000,
        availableStock: 18500,
        reservedStock: 6500,
        onOrderStock: 20000,
        locations: [
          {
            locationId: 'loc1',
            locationName: 'Main Warehouse - Addis Ababa',
            quantity: 20000,
            availableQuantity: 15000,
            reservedQuantity: 5000,
            lastUpdated: new Date().toISOString()
          },
          {
            locationId: 'loc3',
            locationName: 'Packaging Facility - Mekelle',
            quantity: 5000,
            availableQuantity: 3500,
            reservedQuantity: 1500,
            lastUpdated: new Date().toISOString()
          }
        ],
        reorderPoint: 8000,
        reorderQuantity: 25000,
        maxStockLevel: 40000,
        minStockLevel: 5000,
        safetyStock: 3000,
        leadTimeDays: 30,
        costingMethod: 'FIFO',
        standardCost: 0.85,
        averageCost: 0.92,
        lastPurchaseCost: 0.95,
        batchTracked: true,
        serialNumberTracked: false,
        expiryTracked: false,
        exciseTaxApplicable: false,
        vatRate: 15,
        hsCode: '4821.10',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '7',
        code: 'ESP001',
        name: 'Espresso Coffee Blend - 1kg',
        description: 'Dark roast espresso blend for commercial use',
        category: { id: 'cat3', name: 'Finished Goods', code: 'FG', level: 1, description: 'Ready for sale products', isActive: true },
        unit: 'PCS',
        type: 'FINISHED_GOODS',
        abcClassification: 'B',
        criticality: 'IMPORTANT',
        totalStock: 3200,
        availableStock: 2800,
        reservedStock: 400,
        onOrderStock: 0,
        locations: [
          {
            locationId: 'loc1',
            locationName: 'Main Warehouse - Addis Ababa',
            quantity: 2000,
            availableQuantity: 1800,
            reservedQuantity: 200,
            lastUpdated: new Date().toISOString()
          },
          {
            locationId: 'loc4',
            locationName: 'Retail Store - Bole',
            quantity: 800,
            availableQuantity: 700,
            reservedQuantity: 100,
            lastUpdated: new Date().toISOString()
          },
          {
            locationId: 'loc5',
            locationName: 'Distribution Center - Dire Dawa',
            quantity: 400,
            availableQuantity: 300,
            reservedQuantity: 100,
            lastUpdated: new Date().toISOString()
          }
        ],
        reorderPoint: 800,
        reorderQuantity: 2000,
        maxStockLevel: 5000,
        minStockLevel: 600,
        safetyStock: 400,
        leadTimeDays: 7,
        costingMethod: 'WEIGHTED_AVERAGE',
        standardCost: 580.00,
        averageCost: 615.00,
        lastPurchaseCost: 0,
        batchTracked: true,
        serialNumberTracked: false,
        expiryTracked: true,
        exciseTaxApplicable: false,
        vatRate: 15,
        hsCode: '0901.21',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '8',
        code: 'CLN001',
        name: 'Equipment Cleaning Solution',
        description: 'Food-grade cleaning solution for coffee processing equipment',
        category: { id: 'cat5', name: 'Consumables', code: 'CON', level: 1, description: 'Consumable items and supplies', isActive: true },
        unit: 'LTR',
        type: 'CONSUMABLES',
        abcClassification: 'C',
        criticality: 'NORMAL',
        totalStock: 180,
        availableStock: 145,
        reservedStock: 35,
        onOrderStock: 100,
        locations: [
          {
            locationId: 'loc2',
            locationName: 'Processing Center - Hawassa',
            quantity: 120,
            availableQuantity: 95,
            reservedQuantity: 25,
            lastUpdated: new Date().toISOString()
          },
          {
            locationId: 'loc1',
            locationName: 'Main Warehouse - Addis Ababa',
            quantity: 60,
            availableQuantity: 50,
            reservedQuantity: 10,
            lastUpdated: new Date().toISOString()
          }
        ],
        reorderPoint: 50,
        reorderQuantity: 200,
        maxStockLevel: 300,
        minStockLevel: 30,
        safetyStock: 20,
        leadTimeDays: 21,
        costingMethod: 'FIFO',
        standardCost: 45.00,
        averageCost: 47.50,
        lastPurchaseCost: 48.50,
        batchTracked: true,
        serialNumberTracked: false,
        expiryTracked: true,
        exciseTaxApplicable: false,
        vatRate: 15,
        hsCode: '3402.20',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Apply filters
    let filteredItems = mockItems;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.code.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.locationId) {
      filteredItems = filteredItems.filter(item =>
        item.locations.some(loc => loc.locationId === filters.locationId)
      );
    }

    if (filters.categoryId) {
      filteredItems = filteredItems.filter(item => item.category.id === filters.categoryId);
    }

    if (filters.status) {
      filteredItems = filteredItems.filter(item => item.status === filters.status);
    }

    if (filters.type) {
      filteredItems = filteredItems.filter(item => item.type === filters.type);
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      total: filteredItems.length,
      page: page,
      totalPages: Math.ceil(filteredItems.length / limit)
    };
  }

  private getMockInventoryItem(id: string): EnhancedInventoryItem {
    return this.getMockInventoryItems({}).items[0];
  }

  private getMockStockMovements(filters: any): any {
    const mockMovements: StockMovement[] = [
      {
        id: '1',
        itemId: '1',
        itemName: 'Ethiopian Coffee Beans - Grade 1',
        movementType: 'RECEIPT',
        transactionType: 'PURCHASE',
        toLocationId: 'loc1',
        toLocationName: 'Main Warehouse - Addis Ababa',
        quantity: 2500,
        unitCost: 89.00,
        totalValue: 222500,
        batchNumber: 'BATCH-CFB-001-2024-003',
        referenceType: 'PURCHASE_ORDER',
        referenceId: 'po001',
        referenceNumber: 'PO-2024-001',
        reason: 'Purchase receipt from Sidama Coffee Cooperative',
        notes: 'Premium quality beans, direct from farm. Moisture content: 11.5%',
        userId: 'samuel.admin',
        userName: 'Samuel Haile (Admin)',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      },
      {
        id: '2',
        itemId: '3',
        itemName: 'Premium Roasted Coffee - 250g',
        movementType: 'ISSUE',
        transactionType: 'SALE',
        fromLocationId: 'loc1',
        fromLocationName: 'Main Warehouse - Addis Ababa',
        toLocationId: 'loc4',
        toLocationName: 'Retail Store - Bole',
        quantity: 200,
        unitCost: 172.50,
        totalValue: 34500,
        batchNumber: 'BATCH-CFR-250-2024-012',
        referenceType: 'SALES_ORDER',
        referenceId: 'so045',
        referenceNumber: 'SO-2024-045',
        reason: 'Stock transfer for retail sales',
        notes: 'Fresh roast batch - roasted 3 days ago',
        userId: 'zara.sales',
        userName: 'Zara Tadesse (Sales)',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      },
      {
        id: '3',
        itemId: '2',
        itemName: 'Packaging Material - 250g Coffee Bags',
        movementType: 'RECEIPT',
        transactionType: 'PURCHASE',
        toLocationId: 'loc1',
        toLocationName: 'Main Warehouse - Addis Ababa',
        quantity: 10000,
        unitCost: 2.80,
        totalValue: 28000,
        batchNumber: 'BATCH-PKG-250-2024-005',
        referenceType: 'PURCHASE_ORDER',
        referenceId: 'po008',
        referenceNumber: 'PO-2024-008',
        reason: 'Purchase from Ethiopian Packaging Solutions',
        notes: 'Biodegradable bags with new Ethiopian heritage design',
        userId: 'dawit.procurement',
        userName: 'Dawit Mengistu (Procurement)',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      },
      {
        id: '4',
        itemId: '1',
        itemName: 'Ethiopian Coffee Beans - Grade 1',
        movementType: 'ISSUE',
        transactionType: 'PRODUCTION',
        fromLocationId: 'loc1',
        fromLocationName: 'Main Warehouse - Addis Ababa',
        toLocationId: 'loc2',
        toLocationName: 'Processing Center - Hawassa',
        quantity: 500,
        unitCost: 87.20,
        totalValue: 43600,
        batchNumber: 'BATCH-CFB-001-2024-003',
        referenceType: 'PRODUCTION_ORDER',
        referenceId: 'prod023',
        referenceNumber: 'PROD-2024-023',
        reason: 'Production consumption for roasting',
        notes: 'Medium roast production batch',
        userId: 'tekle.production',
        userName: 'Tekle Assefa (Production)',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      },
      {
        id: '5',
        itemId: '3',
        itemName: 'Premium Roasted Coffee - 250g',
        movementType: 'RECEIPT',
        transactionType: 'PRODUCTION',
        fromLocationId: 'loc2',
        fromLocationName: 'Processing Center - Hawassa',
        toLocationId: 'loc1',
        toLocationName: 'Main Warehouse - Addis Ababa',
        quantity: 1800,
        unitCost: 165.00,
        totalValue: 297000,
        batchNumber: 'BATCH-CFR-250-2024-012',
        referenceType: 'PRODUCTION_ORDER',
        referenceId: 'prod023',
        referenceNumber: 'PROD-2024-023',
        reason: 'Production completion - packaging finished',
        notes: 'Fresh roast - yield: 3.6:1 ratio from green beans',
        userId: 'tekle.production',
        userName: 'Tekle Assefa (Production)',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      },
      {
        id: '6',
        itemId: '5',
        itemName: 'Ethiopian Coffee Beans - Grade 2',
        movementType: 'RECEIPT',
        transactionType: 'PURCHASE',
        toLocationId: 'loc1',
        toLocationName: 'Main Warehouse - Addis Ababa',
        quantity: 3000,
        unitCost: 69.00,
        totalValue: 207000,
        batchNumber: 'BATCH-CFB-002-2024-002',
        referenceType: 'PURCHASE_ORDER',
        referenceId: 'po010',
        referenceNumber: 'PO-2024-010',
        reason: 'Purchase from Oromia Coffee Union',
        notes: 'Commercial grade for bulk processing. Moisture: 12%',
        userId: 'dawit.procurement',
        userName: 'Dawit Mengistu (Procurement)',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      },
      {
        id: '7',
        itemId: '2',
        itemName: 'Packaging Material - 250g Coffee Bags',
        movementType: 'ISSUE',
        transactionType: 'PRODUCTION',
        fromLocationId: 'loc1',
        fromLocationName: 'Main Warehouse - Addis Ababa',
        toLocationId: 'loc2',
        toLocationName: 'Processing Center - Hawassa',
        quantity: 1800,
        unitCost: 2.75,
        totalValue: 4950,
        batchNumber: 'BATCH-PKG-250-2024-005',
        referenceType: 'PRODUCTION_ORDER',
        referenceId: 'prod023',
        referenceNumber: 'PROD-2024-023',
        reason: 'Production consumption for packaging',
        notes: 'Used for premium coffee packaging run',
        userId: 'tekle.production',
        userName: 'Tekle Assefa (Production)',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      },
      {
        id: '8',
        itemId: '7',
        itemName: 'Espresso Coffee Blend - 1kg',
        movementType: 'ISSUE',
        transactionType: 'SALE',
        fromLocationId: 'loc1',
        fromLocationName: 'Main Warehouse - Addis Ababa',
        toLocationId: 'loc5',
        toLocationName: 'Distribution Center - Dire Dawa',
        quantity: 50,
        unitCost: 615.00,
        totalValue: 30750,
        batchNumber: 'BATCH-ESP-001-2024-008',
        referenceType: 'SALES_ORDER',
        referenceId: 'so052',
        referenceNumber: 'SO-2024-052',
        reason: 'Wholesale order for restaurants',
        notes: 'Export order to Djibouti restaurants',
        userId: 'zara.sales',
        userName: 'Zara Tadesse (Sales)',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      },
      {
        id: '9',
        itemId: '4',
        itemName: 'Coffee Roasting Machine Belt',
        movementType: 'RECEIPT',
        transactionType: 'PURCHASE',
        toLocationId: 'loc1',
        toLocationName: 'Main Warehouse - Addis Ababa',
        quantity: 6,
        unitCost: 1980.00,
        totalValue: 11880,
        referenceType: 'PURCHASE_ORDER',
        referenceId: 'po005',
        referenceNumber: 'PO-2024-005',
        reason: 'Spare parts inventory replenishment',
        notes: 'Import from Germany - Probat original parts',
        userId: 'dawit.procurement',
        userName: 'Dawit Mengistu (Procurement)',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      },
      {
        id: '10',
        itemId: '8',
        itemName: 'Equipment Cleaning Solution',
        movementType: 'ISSUE',
        transactionType: 'TRANSFER',
        fromLocationId: 'loc1',
        fromLocationName: 'Main Warehouse - Addis Ababa',
        toLocationId: 'loc2',
        toLocationName: 'Processing Center - Hawassa',
        quantity: 25,
        unitCost: 47.50,
        totalValue: 1187.50,
        batchNumber: 'BATCH-CLN-001-2024-003',
        referenceType: 'TRANSFER_ORDER',
        referenceId: 'maint015',
        referenceNumber: 'MAINT-2024-015',
        reason: 'Monthly equipment cleaning routine',
        notes: 'Deep cleaning of roasting equipment scheduled',
        userId: 'maintenance.team',
        userName: 'Maintenance Team',
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      },
      {
        id: '11',
        itemId: '6',
        itemName: 'Coffee Cup Labels - Premium',
        movementType: 'RECEIPT',
        transactionType: 'PURCHASE',
        toLocationId: 'loc3',
        toLocationName: 'Packaging Facility - Mekelle',
        quantity: 20000,
        unitCost: 0.95,
        totalValue: 19000,
        batchNumber: 'BATCH-LAB-001-2024-004',
        referenceType: 'PURCHASE_ORDER',
        referenceId: 'po012',
        referenceNumber: 'PO-2024-012',
        reason: 'Purchase from Addis Label Printing',
        notes: 'High-quality waterproof labels with new design',
        userId: 'dawit.procurement',
        userName: 'Dawit Mengistu (Procurement)',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      },
      {
        id: '12',
        itemId: '1',
        itemName: 'Ethiopian Coffee Beans - Grade 1',
        movementType: 'ADJUSTMENT',
        transactionType: 'ADJUSTMENT',
        fromLocationId: 'loc1',
        fromLocationName: 'Main Warehouse - Addis Ababa',
        toLocationId: 'loc1',
        toLocationName: 'Main Warehouse - Addis Ababa',
        quantity: -50,
        unitCost: 87.20,
        totalValue: -4360,
        batchNumber: 'BATCH-CFB-001-2024-002',
        referenceType: 'MANUAL_ADJUSTMENT',
        referenceId: 'adj003',
        referenceNumber: 'ADJ-2024-003',
        reason: 'Stock count variance - shortage found',
        notes: 'Physical count revealed 50kg shortage. Investigating possible causes.',
        userId: 'inventory.team',
        userName: 'Inventory Team',
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      },
      {
        id: '13',
        itemId: '3',
        itemName: 'Premium Roasted Coffee - 250g',
        movementType: 'TRANSFER',
        transactionType: 'TRANSFER',
        fromLocationId: 'loc1',
        fromLocationName: 'Main Warehouse - Addis Ababa',
        toLocationId: 'loc4',
        toLocationName: 'Retail Store - Bole',
        quantity: 300,
        unitCost: 172.50,
        totalValue: 51750,
        batchNumber: 'BATCH-CFR-250-2024-011',
        referenceType: 'TRANSFER_ORDER',
        referenceId: 'trf008',
        referenceNumber: 'TRF-2024-008',
        reason: 'Stock replenishment for retail store',
        notes: 'High demand expected for weekend sales',
        userId: 'zara.sales',
        userName: 'Zara Tadesse (Sales)',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      },
      {
        id: '14',
        itemId: '4',
        itemName: 'Coffee Roasting Machine Belt',
        movementType: 'ISSUE',
        transactionType: 'TRANSFER',
        fromLocationId: 'loc1',
        fromLocationName: 'Main Warehouse - Addis Ababa',
        toLocationId: 'loc2',
        toLocationName: 'Processing Center - Hawassa',
        quantity: 1,
        unitCost: 1920.00,
        totalValue: 1920,
        referenceType: 'TRANSFER_ORDER',
        referenceId: 'maint012',
        referenceNumber: 'MAINT-2024-012',
        reason: 'Emergency replacement - belt failure',
        notes: 'Roaster #2 belt replacement during scheduled maintenance',
        userId: 'maintenance.team',
        userName: 'Maintenance Team',
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED'
      }
    ];

    // Apply filters
    let filteredMovements = mockMovements;

    if (filters.itemId) {
      filteredMovements = filteredMovements.filter(movement => movement.itemId === filters.itemId);
    }

    if (filters.movementType) {
      filteredMovements = filteredMovements.filter(movement => movement.movementType === filters.movementType);
    }

    if (filters.transactionType) {
      filteredMovements = filteredMovements.filter(movement => movement.transactionType === filters.transactionType);
    }

    if (filters.locationId) {
      filteredMovements = filteredMovements.filter(movement =>
        movement.fromLocationId === filters.locationId ||
        movement.toLocationId === filters.locationId
      );
    }

    if (filters.referenceType) {
      filteredMovements = filteredMovements.filter(movement => movement.referenceType === filters.referenceType);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filteredMovements = filteredMovements.filter(movement => 
        new Date(movement.timestamp) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filteredMovements = filteredMovements.filter(movement => 
        new Date(movement.timestamp) <= toDate
      );
    }

    // Sort by timestamp (newest first)
    filteredMovements.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMovements = filteredMovements.slice(startIndex, endIndex);

    return {
      movements: paginatedMovements,
      total: filteredMovements.length,
      page: page,
      totalPages: Math.ceil(filteredMovements.length / limit)
    };
  }

  private getMockLocations(): InventoryLocation[] {
    return [
      {
        id: 'loc1',
        name: 'Main Warehouse - Addis Ababa',
        type: 'WAREHOUSE',
        address: 'Bole Subcity, Addis Ababa',
        region: 'Addis Ababa',
        zone: 'Bole',
        woreda: 'Woreda 03',
        manager: 'Ato Tesfaye Bekele',
        capacity: 12000,
        currentUtilization: 78,
        status: 'ACTIVE',
        coordinates: {
          latitude: 9.0192,
          longitude: 38.7525
        }
      },
      {
        id: 'loc2',
        name: 'Processing Center - Hawassa',
        type: 'FACTORY',
        address: 'Industrial Zone, Hawassa',
        region: 'SNNPR',
        zone: 'Sidama',
        woreda: 'Hawassa Zuria',
        manager: 'W/ro Almaz Tadesse',
        capacity: 6000,
        currentUtilization: 85,
        status: 'ACTIVE',
        coordinates: {
          latitude: 7.0621,
          longitude: 38.4755
        }
      },
      {
        id: 'loc3',
        name: 'Packaging Facility - Mekelle',
        type: 'FACTORY',
        address: 'Qwiha Industrial Park, Mekelle',
        region: 'Tigray',
        zone: 'Central',
        woreda: 'Mekelle Special',
        manager: 'Ato Gebrehiwot Alemayehu',
        capacity: 3500,
        currentUtilization: 65,
        status: 'ACTIVE',
        coordinates: {
          latitude: 13.4967,
          longitude: 39.4755
        }
      },
      {
        id: 'loc4',
        name: 'Retail Store - Bole',
        type: 'STORE',
        address: 'Bole Road, Addis Ababa',
        region: 'Addis Ababa',
        zone: 'Bole',
        woreda: 'Woreda 05',
        manager: 'W/t Hanan Mohammed',
        capacity: 800,
        currentUtilization: 92,
        status: 'ACTIVE',
        coordinates: {
          latitude: 9.0084,
          longitude: 38.7975
        }
      },
      {
        id: 'loc5',
        name: 'Distribution Center - Dire Dawa',
        type: 'DISTRIBUTION_CENTER',
        address: 'Industrial Area, Dire Dawa',
        region: 'Dire Dawa',
        zone: 'Dire Dawa Admin',
        woreda: 'Dire Dawa',
        manager: 'Ato Ahmed Hassan',
        capacity: 2500,
        currentUtilization: 70,
        status: 'ACTIVE',
        coordinates: {
          latitude: 9.5926,
          longitude: 41.8662
        }
      }
    ];
  }

  private getMockValuation(): InventoryValuation[] {
    return [
      {
        itemId: '1',
        itemName: 'Ethiopian Coffee Beans - Grade 1',
        locationId: 'loc1',
        locationName: 'Main Warehouse - Addis Ababa',
        quantity: 3000,
        fifoValue: 141600,
        lifoValue: 144000,
        weightedAverageValue: 142800,
        standardValue: 136500,
        lastMovementDate: new Date().toISOString(),
        turnoverRatio: 6.5,
        daysOnHand: 56
      }
    ];
  }

  private getMockReorderAlerts(): ReorderAlert[] {
    return [
      {
        id: '1',
        itemId: '2',
        itemName: 'Packaging Material - 250g Coffee Bags',
        locationId: 'loc1',
        locationName: 'Main Warehouse - Addis Ababa',
        currentStock: 4500,
        reorderPoint: 5000,
        reorderQuantity: 15000,
        alertType: 'REORDER_POINT',
        severity: 'HIGH',
        message: 'Stock level has reached reorder point - immediate action required',
        suggestedAction: 'Create purchase order for 15,000 units from Ethiopian Packaging Solutions',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE'
      },
      {
        id: '2',
        itemId: '4',
        itemName: 'Coffee Roasting Machine Belt',
        locationId: 'loc2',
        locationName: 'Processing Center - Hawassa',
        currentStock: 4,
        reorderPoint: 6,
        reorderQuantity: 12,
        alertType: 'REORDER_POINT',
        severity: 'CRITICAL',
        message: 'Critical spare part below reorder point - production risk',
        suggestedAction: 'Emergency purchase order for 12 units - contact German supplier',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE'
      },
      {
        id: '3',
        itemId: '8',
        itemName: 'Equipment Cleaning Solution',
        locationId: 'loc2',
        locationName: 'Processing Center - Hawassa',
        currentStock: 35,
        reorderPoint: 50,
        reorderQuantity: 200,
        alertType: 'REORDER_POINT',
        severity: 'MEDIUM',
        message: 'Cleaning supplies running low - schedule replenishment',
        suggestedAction: 'Order 200 liters from chemical supplier within 2 weeks',
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE'
      },
      {
        id: '4',
        itemId: '3',
        itemName: 'Premium Roasted Coffee - 250g',
        locationId: 'loc4',
        locationName: 'Retail Store - Bole',
        currentStock: 150,
        reorderPoint: 200,
        reorderQuantity: 500,
        alertType: 'REORDER_POINT',
        severity: 'HIGH',
        message: 'Best-selling product below reorder point at retail location',
        suggestedAction: 'Transfer 500 units from main warehouse immediately',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE'
      },
      {
        id: '5',
        itemId: '1',
        itemName: 'Ethiopian Coffee Beans - Grade 1',
        locationId: 'loc1',
        locationName: 'Main Warehouse - Addis Ababa',
        currentStock: 1100,
        reorderPoint: 1200,
        reorderQuantity: 3500,
        alertType: 'REORDER_POINT',
        severity: 'HIGH',
        message: 'Premium coffee beans approaching minimum stock level',
        suggestedAction: 'Contact Sidama Coffee Cooperative for 3,500kg order',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE'
      },
      {
        id: '6',
        itemId: '7',
        itemName: 'Espresso Coffee Blend - 1kg',
        locationId: 'loc5',
        locationName: 'Distribution Center - Dire Dawa',
        currentStock: 45,
        reorderPoint: 60,
        reorderQuantity: 200,
        alertType: 'REORDER_POINT',
        severity: 'MEDIUM',
        message: 'Export product running low at distribution center',
        suggestedAction: 'Transfer 200 units from main warehouse for export orders',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE'
      },
      {
        id: '7',
        itemId: '6',
        itemName: 'Coffee Cup Labels - Premium',
        locationId: 'loc3',
        locationName: 'Packaging Facility - Mekelle',
        currentStock: 7500,
        reorderPoint: 8000,
        reorderQuantity: 25000,
        alertType: 'REORDER_POINT',
        severity: 'LOW',
        message: 'Packaging labels approaching reorder threshold',
        suggestedAction: 'Schedule purchase of 25,000 labels from Addis Label Printing',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE'
      },
      {
        id: '8',
        itemId: '5',
        itemName: 'Ethiopian Coffee Beans - Grade 2',
        locationId: 'loc2',
        locationName: 'Processing Center - Hawassa',
        currentStock: 1800,
        reorderPoint: 2000,
        reorderQuantity: 4000,
        alertType: 'REORDER_POINT',
        severity: 'MEDIUM',
        message: 'Commercial grade beans below optimal level for bulk processing',
        suggestedAction: 'Order 4,000kg from Oromia Coffee Union for continuous production',
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE'
      }
    ];
  }

  private getMockAnalytics(): InventoryAnalytics {
    return {
      totalValue: 8750000, // ETB 8.75 Million
      totalItems: 245,
      totalLocations: 5,
      byCategory: [
        {
          categoryId: 'cat1',
          categoryName: 'Raw Materials',
          itemCount: 85,
          totalValue: 4200000, // ETB 4.2M
          percentage: 48
        },
        {
          categoryId: 'cat3',
          categoryName: 'Finished Goods',
          itemCount: 92,
          totalValue: 3150000, // ETB 3.15M
          percentage: 36
        },
        {
          categoryId: 'cat2',
          categoryName: 'Packaging Materials',
          itemCount: 45,
          totalValue: 875000, // ETB 875K
          percentage: 10
        },
        {
          categoryId: 'cat4',
          categoryName: 'Spare Parts',
          itemCount: 15,
          totalValue: 350000, // ETB 350K
          percentage: 4
        },
        {
          categoryId: 'cat5',
          categoryName: 'Consumables',
          itemCount: 8,
          totalValue: 175000, // ETB 175K
          percentage: 2
        }
      ],
      byLocation: [
        {
          locationId: 'loc1',
          locationName: 'Main Warehouse - Addis Ababa',
          itemCount: 185,
          totalValue: 5250000, // ETB 5.25M
          utilization: 78
        },
        {
          locationId: 'loc2',
          locationName: 'Processing Center - Hawassa',
          itemCount: 125,
          totalValue: 2100000, // ETB 2.1M
          utilization: 85
        },
        {
          locationId: 'loc4',
          locationName: 'Retail Store - Bole',
          itemCount: 65,
          totalValue: 875000, // ETB 875K
          utilization: 92
        },
        {
          locationId: 'loc3',
          locationName: 'Packaging Facility - Mekelle',
          itemCount: 35,
          totalValue: 350000, // ETB 350K
          utilization: 65
        },
        {
          locationId: 'loc5',
          locationName: 'Distribution Center - Dire Dawa',
          itemCount: 45,
          totalValue: 175000, // ETB 175K
          utilization: 70
        }
      ],
      abcAnalysis: [
        { classification: 'A', itemCount: 49, valuePercentage: 80, quantityPercentage: 20 },
        { classification: 'B', itemCount: 73, valuePercentage: 15, quantityPercentage: 30 },
        { classification: 'C', itemCount: 123, valuePercentage: 5, quantityPercentage: 50 }
      ],
      turnoverAnalysis: {
        fastMoving: 68, // High-demand coffee products, packaging
        normalMoving: 132, // Regular inventory items
        slowMoving: 35, // Specialized equipment, spare parts
        deadStock: 10 // Obsolete items needing clearance
      },
      stockLevels: {
        overstock: 18, // Items with excess inventory
        optimal: 156, // Well-balanced stock levels
        understock: 58, // Items below optimal levels
        outOfStock: 13 // Items requiring immediate attention
      },
      alerts: {
        critical: 8, // Critical spare parts, emergency situations
        high: 15, // Premium coffee beans, packaging materials
        medium: 25, // Commercial grade items, consumables
        low: 12 // Non-critical items with minor alerts
      }
    };
  }

  private getMockReport(reportType: string, filters: any): InventoryReport {
    return {
      reportType: reportType as any,
      title: `${reportType.replace('_', ' ')} Report`,
      generatedAt: new Date().toISOString(),
      generatedBy: 'Admin User',
      filters,
      data: [],
      summary: {},
      exportFormats: ['PDF', 'EXCEL', 'CSV']
    };
  }
}

export const advancedInventoryService = new AdvancedInventoryService();
export default AdvancedInventoryService;
