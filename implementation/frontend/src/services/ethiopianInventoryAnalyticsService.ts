/**
 * Ethiopian Inventory Analytics Service
 * Comprehensive service for inventory analysis, reporting, and management operations
 */

import { 
  InventoryAnalytics, 
  ABCAnalysis, 
  SlowMovingItem, 
  StockCountData, 
  ValuationReport, 
  TaskStatus, 
  StockView,
  ReorderRequest,
  EditableInventoryItem,
  EthiopianInventoryMetrics,
  ReportExportOptions,
  InventoryItem,
  StockViewItem
} from '../types/inventoryAnalytics';

class EthiopianInventoryAnalyticsService {
  private readonly API_BASE = '/api/inventory';
  private readonly EXCHANGE_RATE = 57.25; // Current USD to ETB rate

  // ===== STOCK VIEW OPERATIONS =====
  
  /**
   * Get comprehensive stock view for a warehouse
   */
  async getStockView(warehouseId: number, filters?: any): Promise<StockView> {
    try {
      // In a real implementation, this would call the backend API
      // For demo purposes, returning mock data
      return this.generateMockStockView(warehouseId, filters);
    } catch (error) {
      console.error('Error fetching stock view:', error);
      throw new Error('Failed to fetch stock view');
    }
  }

  /**
   * Get stock view for all warehouses
   */
  async getAllStockViews(filters?: any): Promise<StockView[]> {
    const warehouseIds = [1, 2, 3, 4, 5]; // Mock warehouse IDs
    const stockViews = await Promise.all(
      warehouseIds.map(id => this.getStockView(id, filters))
    );
    return stockViews;
  }

  // ===== ITEM EDITING OPERATIONS =====

  /**
   * Get editable item details
   */
  async getEditableItem(itemId: number): Promise<EditableInventoryItem> {
    try {
      return this.generateMockEditableItem(itemId);
    } catch (error) {
      console.error('Error fetching editable item:', error);
      throw new Error('Failed to fetch item details');
    }
  }

  /**
   * Update inventory item
   */
  async updateInventoryItem(itemId: number, itemData: Partial<EditableInventoryItem>): Promise<EditableInventoryItem> {
    try {
      // In real implementation, send PUT request to backend
      console.log('Updating item:', itemId, itemData);
      
      // Return updated item data
      return {
        ...await this.getEditableItem(itemId),
        ...itemData,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'Current User'
      };
    } catch (error) {
      console.error('Error updating item:', error);
      throw new Error('Failed to update item');
    }
  }

  // ===== REORDER OPERATIONS =====

  /**
   * Create reorder request
   */
  async createReorderRequest(itemId: number, quantity: number, notes?: string): Promise<ReorderRequest> {
    try {
      return this.generateMockReorderRequest(itemId, quantity, notes);
    } catch (error) {
      console.error('Error creating reorder request:', error);
      throw new Error('Failed to create reorder request');
    }
  }

  /**
   * Get pending reorder requests
   */
  async getPendingReorderRequests(): Promise<ReorderRequest[]> {
    try {
      return [
        this.generateMockReorderRequest(1, 500, 'Low stock - urgent'),
        this.generateMockReorderRequest(2, 200, 'Seasonal demand increase'),
        this.generateMockReorderRequest(3, 1000, 'Bulk order for cost savings')
      ];
    } catch (error) {
      console.error('Error fetching reorder requests:', error);
      throw new Error('Failed to fetch reorder requests');
    }
  }

  // ===== ABC ANALYSIS =====

  /**
   * Perform ABC analysis on inventory
   */
  async getAbcAnalysis(warehouseId?: number): Promise<ABCAnalysis> {
    try {
      return this.generateMockAbcAnalysis();
    } catch (error) {
      console.error('Error performing ABC analysis:', error);
      throw new Error('Failed to perform ABC analysis');
    }
  }

  // ===== SLOW MOVING ITEMS =====

  /**
   * Get slow moving items analysis
   */
  async getSlowMovingItems(dayThreshold: number = 90): Promise<SlowMovingItem[]> {
    try {
      return this.generateMockSlowMovingItems(dayThreshold);
    } catch (error) {
      console.error('Error fetching slow moving items:', error);
      throw new Error('Failed to fetch slow moving items');
    }
  }

  // ===== STOCK COUNT PROCEDURES =====

  /**
   * Get stock count procedures and data
   */
  async getStockCountData(warehouseId?: number): Promise<StockCountData[]> {
    try {
      return this.generateMockStockCountData();
    } catch (error) {
      console.error('Error fetching stock count data:', error);
      throw new Error('Failed to fetch stock count data');
    }
  }

  /**
   * Initialize new stock count
   */
  async initializeStockCount(warehouseId: number, countType: string): Promise<StockCountData> {
    try {
      return this.generateMockStockCountData()[0]; // Return first mock count
    } catch (error) {
      console.error('Error initializing stock count:', error);
      throw new Error('Failed to initialize stock count');
    }
  }

  // ===== VALUATION REPORTS =====

  /**
   * Get inventory valuation report in ETB
   */
  async getValuationReport(warehouseId?: number, method: string = 'weighted_average'): Promise<ValuationReport> {
    try {
      return this.generateMockValuationReport(warehouseId, method);
    } catch (error) {
      console.error('Error generating valuation report:', error);
      throw new Error('Failed to generate valuation report');
    }
  }

  // ===== TASK STATUS =====

  /**
   * Get inventory-related task status
   */
  async getTaskStatus(): Promise<TaskStatus[]> {
    try {
      return this.generateMockTaskStatus();
    } catch (error) {
      console.error('Error fetching task status:', error);
      throw new Error('Failed to fetch task status');
    }
  }

  /**
   * Update task status
   */
  async updateTaskStatus(taskId: number, status: string, progress: number, notes?: string): Promise<TaskStatus> {
    try {
      const tasks = await this.getTaskStatus();
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');

      return {
        ...task,
        status: status as any,
        progress,
        notes: notes || task.notes,
        completedDate: status === 'completed' ? new Date().toISOString() : undefined
      };
    } catch (error) {
      console.error('Error updating task status:', error);
      throw new Error('Failed to update task status');
    }
  }

  // ===== REPORT EXPORT =====

  /**
   * Export reports in various formats
   */
  async exportReport(reportType: string, options: ReportExportOptions): Promise<Blob> {
    try {
      // In real implementation, this would generate actual file
      const mockData = JSON.stringify({
        reportType,
        generatedDate: new Date().toISOString(),
        data: 'Mock report data would be here'
      });
      
      return new Blob([mockData], { type: 'application/json' });
    } catch (error) {
      console.error('Error exporting report:', error);
      throw new Error('Failed to export report');
    }
  }

  // ===== ETHIOPIAN-SPECIFIC OPERATIONS =====

  /**
   * Get Ethiopian inventory metrics (customs, taxes, etc.)
   */
  async getEthiopianMetrics(itemId: number): Promise<EthiopianInventoryMetrics> {
    return {
      customsValue: 50000,
      customsValueEtb: 50000 * this.EXCHANGE_RATE,
      dutyPaid: 7500,
      vatPaid: 7650,
      exciseTaxPaid: 0,
      importDutyPercentage: 15,
      vatPercentage: 15,
      exciseTaxPercentage: 0,
      clearanceStatus: 'cleared',
      clearanceDate: new Date().toISOString(),
      customsReference: 'ETH-2024-001234',
      portOfEntry: 'Bole International Airport',
      declarationNumber: 'DEC-2024-567890'
    };
  }

  /**
   * Convert USD to ETB
   */
  convertUsdToEtb(usdAmount: number): number {
    return usdAmount * this.EXCHANGE_RATE;
  }

  /**
   * Format Ethiopian Birr
   */
  formatEtb(amount: number): string {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Format USD
   */
  formatUsd(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  // ===== PRIVATE MOCK DATA GENERATORS =====

  private generateMockStockView(warehouseId: number, filters?: any): StockView {
    const warehouseNames = {
      1: 'Addis Ababa Main Warehouse',
      2: 'Dire Dawa Distribution Center',
      3: 'Mekelle Regional Hub',
      4: 'Bahir Dar Storage Facility',
      5: 'Hawassa Branch Warehouse'
    };

    const regions = {
      1: 'Addis Ababa',
      2: 'Dire Dawa',
      3: 'Tigray',
      4: 'Amhara',
      5: 'SNNPR'
    };

    const items: StockViewItem[] = [
      {
        id: 1,
        sku: 'COFFEE-001',
        name: 'Premium Ethiopian Coffee Beans',
        category: 'Agricultural Products',
        currentStock: 250,
        unit: 'kg',
        unitPrice: 15.50,
        totalValue: 3875,
        totalValueEtb: 3875 * this.EXCHANGE_RATE,
        reorderLevel: 50,
        reorderQuantity: 200,
        status: 'in_stock',
        lastMovement: {
          date: '2024-08-20T14:30:00Z',
          type: 'out',
          quantity: 25,
          reference: 'SO-2024-001'
        },
        supplier: {
          id: 1,
          name: 'Ethiopian Coffee Cooperative',
          contact: '+251-11-123-4567'
        },
        location: {
          zone: 'A',
          aisle: '1',
          shelf: '3',
          bin: 'A1-3-B'
        }
      },
      {
        id: 2,
        sku: 'TEFF-002',
        name: 'Organic Teff Flour',
        category: 'Food Products',
        currentStock: 15,
        unit: 'bags',
        unitPrice: 25.00,
        totalValue: 375,
        totalValueEtb: 375 * this.EXCHANGE_RATE,
        reorderLevel: 20,
        reorderQuantity: 100,
        status: 'low_stock',
        lastMovement: {
          date: '2024-08-22T10:15:00Z',
          type: 'out',
          quantity: 10,
          reference: 'SO-2024-003'
        },
        supplier: {
          id: 2,
          name: 'Teff Farmers Union',
          contact: '+251-11-234-5678'
        },
        location: {
          zone: 'B',
          aisle: '2',
          shelf: '1',
          bin: 'B2-1-A'
        }
      },
      {
        id: 3,
        sku: 'SPICE-003',
        name: 'Berbere Spice Mix',
        category: 'Spices & Seasonings',
        currentStock: 0,
        unit: 'kg',
        unitPrice: 8.75,
        totalValue: 0,
        totalValueEtb: 0,
        reorderLevel: 10,
        reorderQuantity: 50,
        status: 'out_of_stock',
        lastMovement: {
          date: '2024-08-18T16:45:00Z',
          type: 'out',
          quantity: 5,
          reference: 'SO-2024-002'
        },
        supplier: {
          id: 3,
          name: 'Ethiopian Spice Company',
          contact: '+251-11-345-6789'
        },
        location: {
          zone: 'C',
          aisle: '1',
          shelf: '2',
          bin: 'C1-2-C'
        }
      }
    ];

    const summary = {
      totalItems: items.length,
      totalValue: items.reduce((sum, item) => sum + item.totalValue, 0),
      totalValueEtb: items.reduce((sum, item) => sum + item.totalValueEtb, 0),
      inStockItems: items.filter(item => item.status === 'in_stock').length,
      lowStockItems: items.filter(item => item.status === 'low_stock').length,
      outOfStockItems: items.filter(item => item.status === 'out_of_stock').length,
      overstockItems: items.filter(item => item.status === 'overstock').length,
      categories: [
        { name: 'Agricultural Products', count: 1, value: 3875 },
        { name: 'Food Products', count: 1, value: 375 },
        { name: 'Spices & Seasonings', count: 1, value: 0 }
      ]
    };

    return {
      warehouseId,
      warehouseName: warehouseNames[warehouseId as keyof typeof warehouseNames] || 'Unknown Warehouse',
      region: regions[warehouseId as keyof typeof regions] || 'Unknown Region',
      items,
      summary,
      filters: filters || {}
    };
  }

  private generateMockEditableItem(itemId: number): EditableInventoryItem {
    return {
      id: itemId,
      sku: 'COFFEE-001',
      name: 'Premium Ethiopian Coffee Beans',
      description: 'High-quality Arabica coffee beans from Ethiopian highlands',
      category: 'Agricultural Products',
      unitOfMeasure: 'kg',
      unitPrice: 15.50,
      reorderLevel: 50,
      reorderQuantity: 200,
      leadTimeDays: 14,
      isActive: true,
      trackSerial: false,
      trackBatch: true,
      supplierId: 1,
      supplierName: 'Ethiopian Coffee Cooperative',
      manufacturerPartNumber: 'ECC-COFFEE-001',
      barcode: '1234567890123',
      weight: 1.0,
      dimensions: {
        length: 30,
        width: 20,
        height: 15,
        unit: 'cm'
      },
      storageRequirements: {
        temperature: {
          min: 10,
          max: 25,
          unit: 'celsius'
        },
        humidity: {
          min: 30,
          max: 60
        },
        specialHandling: ['Keep dry', 'Avoid direct sunlight', 'First in, first out']
      },
      location: {
        zone: 'A',
        aisle: '1',
        shelf: '3',
        bin: 'A1-3-B'
      },
      tags: ['organic', 'premium', 'export-quality', 'ethiopian'],
      notes: 'Premium grade coffee for export markets',
      lastUpdated: new Date().toISOString(),
      updatedBy: 'System Admin'
    };
  }

  private generateMockReorderRequest(itemId: number, quantity: number, notes?: string): ReorderRequest {
    return {
      id: Math.floor(Math.random() * 1000),
      itemId,
      itemName: 'Premium Ethiopian Coffee Beans',
      itemSku: 'COFFEE-001',
      currentStock: 25,
      reorderLevel: 50,
      suggestedQuantity: 200,
      requestedQuantity: quantity,
      unitPrice: 15.50,
      totalCost: quantity * 15.50,
      totalCostEtb: quantity * 15.50 * this.EXCHANGE_RATE,
      supplierId: 1,
      supplierName: 'Ethiopian Coffee Cooperative',
      leadTimeDays: 14,
      expectedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      status: 'draft',
      requestedBy: 'Inventory Manager',
      requestedDate: new Date().toISOString(),
      warehouseId: 1,
      warehouseName: 'Addis Ababa Main Warehouse',
      notes: notes || 'Standard reorder',
      justification: 'Stock level below minimum threshold'
    };
  }

  private generateMockAbcAnalysis(): ABCAnalysis {
    const allItems: InventoryItem[] = [
      // A Items (High value, high turnover)
      {
        id: 1, sku: 'COFFEE-001', name: 'Premium Ethiopian Coffee Beans', category: 'Agricultural Products',
        currentStock: 250, unitPrice: 15.50, totalValue: 3875, monthlyUsage: 100, annualUsage: 1200,
        turnoverRate: 4.8, abcClassification: 'A', warehouseId: 1, warehouseName: 'Addis Ababa Main',
        supplierId: 1, supplierName: 'Ethiopian Coffee Cooperative', reorderLevel: 50, reorderQuantity: 200,
        lastMovementDate: '2024-08-20', leadTimeDays: 14, isActive: true
      },
      // B Items (Medium value, medium turnover)
      {
        id: 2, sku: 'TEFF-002', name: 'Organic Teff Flour', category: 'Food Products',
        currentStock: 150, unitPrice: 25.00, totalValue: 3750, monthlyUsage: 50, annualUsage: 600,
        turnoverRate: 2.4, abcClassification: 'B', warehouseId: 1, warehouseName: 'Addis Ababa Main',
        supplierId: 2, supplierName: 'Teff Farmers Union', reorderLevel: 20, reorderQuantity: 100,
        lastMovementDate: '2024-08-18', leadTimeDays: 21, isActive: true
      },
      // C Items (Low value, low turnover)
      {
        id: 3, sku: 'SPICE-003', name: 'Berbere Spice Mix', category: 'Spices & Seasonings',
        currentStock: 75, unitPrice: 8.75, totalValue: 656.25, monthlyUsage: 10, annualUsage: 120,
        turnoverRate: 1.6, abcClassification: 'C', warehouseId: 1, warehouseName: 'Addis Ababa Main',
        supplierId: 3, supplierName: 'Ethiopian Spice Company', reorderLevel: 10, reorderQuantity: 50,
        lastMovementDate: '2024-08-15', leadTimeDays: 7, isActive: true
      }
    ];

    return {
      aItems: allItems.filter(item => item.abcClassification === 'A'),
      bItems: allItems.filter(item => item.abcClassification === 'B'),
      cItems: allItems.filter(item => item.abcClassification === 'C'),
      analysis: {
        aItemsPercentage: 33.3,
        bItemsPercentage: 33.3,
        cItemsPercentage: 33.3,
        aValuePercentage: 47.0,
        bValuePercentage: 45.5,
        cValuePercentage: 7.5
      }
    };
  }

  private generateMockSlowMovingItems(dayThreshold: number): SlowMovingItem[] {
    return [
      {
        id: 1,
        item: {
          id: 4, sku: 'EQUIP-004', name: 'Old Office Equipment', category: 'Office Equipment',
          currentStock: 5, unitPrice: 150.00, totalValue: 750, monthlyUsage: 0, annualUsage: 1,
          turnoverRate: 0.1, abcClassification: 'C', warehouseId: 1, warehouseName: 'Addis Ababa Main',
          reorderLevel: 2, reorderQuantity: 5, lastMovementDate: '2024-05-15', leadTimeDays: 30, isActive: false
        },
        daysSinceLastMovement: 100,
        quantityOnHand: 5,
        totalValue: 750,
        totalValueEtb: 750 * this.EXCHANGE_RATE,
        monthlyUsageAverage: 0.1,
        recommendedAction: 'liquidation',
        reason: 'No movement for over 90 days, obsolete technology',
        priority: 'medium',
        warehouseName: 'Addis Ababa Main',
        categoryName: 'Office Equipment'
      },
      {
        id: 2,
        item: {
          id: 5, sku: 'SEASON-005', name: 'Seasonal Decorations', category: 'Seasonal Items',
          currentStock: 20, unitPrice: 12.50, totalValue: 250, monthlyUsage: 2, annualUsage: 24,
          turnoverRate: 0.8, abcClassification: 'C', warehouseId: 2, warehouseName: 'Dire Dawa Distribution',
          reorderLevel: 5, reorderQuantity: 25, lastMovementDate: '2024-06-01', leadTimeDays: 14, isActive: true
        },
        daysSinceLastMovement: 82,
        quantityOnHand: 20,
        totalValue: 250,
        totalValueEtb: 250 * this.EXCHANGE_RATE,
        monthlyUsageAverage: 2,
        recommendedAction: 'promotion',
        reason: 'Seasonal item, promote before next season',
        priority: 'low',
        warehouseName: 'Dire Dawa Distribution',
        categoryName: 'Seasonal Items'
      }
    ];
  }

  private generateMockStockCountData(): StockCountData[] {
    return [
      {
        id: 1,
        countType: 'cycle',
        status: 'in_progress',
        scheduledDate: '2024-08-25T09:00:00Z',
        startDate: '2024-08-25T09:15:00Z',
        warehouseId: 1,
        warehouseName: 'Addis Ababa Main Warehouse',
        itemsToCount: 250,
        itemsCounted: 180,
        variancesFound: 5,
        totalVarianceValue: 125.50,
        totalVarianceValueEtb: 125.50 * this.EXCHANGE_RATE,
        countedBy: 'Warehouse Team A',
        notes: 'Monthly cycle count - Zone A & B',
        items: [
          {
            id: 1,
            itemId: 1,
            itemName: 'Premium Ethiopian Coffee Beans',
            itemSku: 'COFFEE-001',
            systemQuantity: 250,
            countedQuantity: 248,
            variance: -2,
            variancePercentage: -0.8,
            unitPrice: 15.50,
            varianceValue: -31.00,
            varianceValueEtb: -31.00 * this.EXCHANGE_RATE,
            reason: 'Possible spillage during handling',
            countedBy: 'John Doe',
            countedDate: '2024-08-25T10:30:00Z'
          }
        ]
      }
    ];
  }

  private generateMockValuationReport(warehouseId?: number, method: string = 'weighted_average'): ValuationReport {
    return {
      reportDate: new Date().toISOString(),
      warehouseId,
      warehouseName: warehouseId ? 'Addis Ababa Main Warehouse' : undefined,
      valuationMethod: method as any,
      exchangeRate: this.EXCHANGE_RATE,
      categories: [
        {
          categoryId: 1,
          categoryName: 'Agricultural Products',
          itemCount: 15,
          totalQuantity: 1250,
          totalValueUsd: 25750,
          totalValueEtb: 25750 * this.EXCHANGE_RATE,
          percentageOfTotal: 45.2,
          averageUnitPrice: 20.60,
          fastMovingItemsCount: 12,
          slowMovingItemsCount: 3
        },
        {
          categoryId: 2,
          categoryName: 'Food Products',
          itemCount: 25,
          totalQuantity: 800,
          totalValueUsd: 18500,
          totalValueEtb: 18500 * this.EXCHANGE_RATE,
          percentageOfTotal: 32.5,
          averageUnitPrice: 23.13,
          fastMovingItemsCount: 20,
          slowMovingItemsCount: 5
        }
      ],
      warehouses: [
        {
          warehouseId: 1,
          warehouseName: 'Addis Ababa Main',
          region: 'Addis Ababa',
          itemCount: 250,
          totalValueUsd: 125000,
          totalValueEtb: 125000 * this.EXCHANGE_RATE,
          utilizationPercentage: 78,
          capacity: 50000,
          activeItems: 235,
          inactiveItems: 15,
          lastUpdated: new Date().toISOString()
        }
      ],
      summary: {
        totalItemsCount: 500,
        totalValueUsd: 250000,
        totalValueEtb: 250000 * this.EXCHANGE_RATE,
        totalQuantity: 15750,
        averageItemValue: 500,
        highestValueCategory: 'Agricultural Products',
        lowestValueCategory: 'Office Supplies',
        mostActiveWarehouse: 'Addis Ababa Main',
        leastActiveWarehouse: 'Bahir Dar Regional',
        lastValuationDate: new Date().toISOString()
      }
    };
  }

  private generateMockTaskStatus(): TaskStatus[] {
    return [
      {
        id: 1,
        taskType: 'stock_count',
        title: 'Monthly Cycle Count - Zone A',
        description: 'Perform physical count of all items in Zone A of main warehouse',
        status: 'in_progress',
        priority: 'high',
        assignedTo: 'Warehouse Team A',
        assignedBy: 'Inventory Manager',
        createdDate: '2024-08-24T08:00:00Z',
        dueDate: '2024-08-25T17:00:00Z',
        progress: 65,
        relatedWarehouseId: 1,
        relatedWarehouseName: 'Addis Ababa Main',
        estimatedHours: 8,
        actualHours: 5.5,
        notes: 'Found 3 discrepancies so far, investigating causes'
      },
      {
        id: 2,
        taskType: 'reorder',
        title: 'Reorder Coffee Beans',
        description: 'Place urgent order for Premium Ethiopian Coffee Beans',
        status: 'pending',
        priority: 'urgent',
        assignedTo: 'Procurement Manager',
        assignedBy: 'Inventory Manager',
        createdDate: '2024-08-23T14:00:00Z',
        dueDate: '2024-08-24T12:00:00Z',
        progress: 25,
        relatedItemId: 1,
        relatedItemName: 'Premium Ethiopian Coffee Beans',
        estimatedHours: 2,
        notes: 'Stock level critically low, expedite if possible'
      },
      {
        id: 3,
        taskType: 'customs_clearance',
        title: 'Clear Solar Panel Shipment',
        description: 'Process customs clearance for imported solar panels',
        status: 'overdue',
        priority: 'critical',
        assignedTo: 'Customs Officer',
        assignedBy: 'Logistics Manager',
        createdDate: '2024-08-20T10:00:00Z',
        dueDate: '2024-08-22T16:00:00Z',
        progress: 80,
        relatedItemId: 6,
        relatedItemName: 'Solar Panels 300W',
        estimatedHours: 6,
        actualHours: 4.5,
        notes: 'Awaiting final approval from customs authority'
      }
    ];
  }
}

// Export singleton instance
export const ethiopianInventoryAnalyticsService = new EthiopianInventoryAnalyticsService();
export default ethiopianInventoryAnalyticsService;
