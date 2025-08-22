import React, { createContext, useContext, ReactNode } from 'react';
import {
  InventoryDashboard,
  Warehouse,
  StockLevel,
  Item,
  WarehouseType,
  StockMovement,
  MovementType,
} from '../types/inventory';

interface MockDataContextType {
  dashboard: InventoryDashboard;
  warehouses: Warehouse[];
  lowStockItems: StockLevel[];
  pendingCustomsItems: Item[];
  valuationEtb: {
    totalValueUsd: number;
    totalValueEtb: number;
    exchangeRate: number;
    timestamp: string;
  };
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};

// Mock Ethiopian business data
const createMockData = (): MockDataContextType => {
  const mockItems: Item[] = [
    {
      id: 1,
      name: 'Ethiopian Coffee Beans - Arabica',
      description: 'Premium Ethiopian Arabica coffee beans from Sidamo region',
      sku: 'ETH-COFFEE-001',
      category: 'Coffee & Beverages',
      unitPrice: 850, // ETB
      unitPriceUsd: 15.50,
      unit: 'kg',
      isActive: true,
      createdDate: '2024-01-15',
      modifiedDate: '2024-02-10',
    },
    {
      id: 2,
      name: 'Injera Making Equipment',
      description: 'Traditional injera making equipment for restaurants',
      sku: 'ETH-EQUIP-002',
      category: 'Kitchen Equipment',
      unitPrice: 12500, // ETB
      unitPriceUsd: 228.00,
      unit: 'pcs',
      isActive: true,
      createdDate: '2024-01-20',
      modifiedDate: '2024-02-05',
    },
    {
      id: 3,
      name: 'Teff Flour - White',
      description: 'High-quality white teff flour for injera production',
      sku: 'ETH-TEFF-003',
      category: 'Food & Grain',
      unitPrice: 145, // ETB
      unitPriceUsd: 2.65,
      unit: 'kg',
      isActive: true,
      createdDate: '2024-02-01',
    },
    {
      id: 4,
      name: 'Berbere Spice Mix',
      description: 'Authentic Ethiopian berbere spice blend',
      sku: 'ETH-SPICE-004',
      category: 'Spices & Seasonings',
      unitPrice: 580, // ETB
      unitPriceUsd: 10.60,
      unit: 'kg',
      isActive: true,
      createdDate: '2024-01-10',
    },
    {
      id: 5,
      name: 'Solar Panel System - Imported',
      description: 'Solar panel system awaiting customs clearance',
      sku: 'IMP-SOLAR-005',
      category: 'Electronics',
      unitPrice: 27500, // ETB
      unitPriceUsd: 500.00,
      unit: 'set',
      isActive: true,
      createdDate: '2024-02-15',
    },
  ];

  const mockWarehouses: Warehouse[] = [
    {
      id: 1,
      name: 'Addis Ababa Main Warehouse',
      address: 'Bole Road, Addis Ababa',
      region: 'Addis Ababa',
      type: WarehouseType.MAIN_WAREHOUSE,
      capacity: 10000,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Dire Dawa Distribution Center',
      address: 'Commercial District, Dire Dawa',
      region: 'Dire Dawa',
      type: WarehouseType.DISTRIBUTION_CENTER,
      capacity: 5000,
      isActive: true,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-02-10T00:00:00Z',
    },
    {
      id: 3,
      name: 'Customs Warehouse - Bole Airport',
      address: 'Bole International Airport, Addis Ababa',
      region: 'Addis Ababa',
      type: WarehouseType.CUSTOMS_WAREHOUSE,
      capacity: 2000,
      isActive: true,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-02-05T00:00:00Z',
    },
    {
      id: 4,
      name: 'Bahir Dar Cold Storage',
      address: 'Industrial Zone, Bahir Dar',
      region: 'Amhara',
      type: WarehouseType.COLD_STORAGE,
      capacity: 1500,
      isActive: true,
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-02-12T00:00:00Z',
    },
    {
      id: 5,
      name: 'Hawassa Regional Outlet',
      address: 'City Center, Hawassa',
      region: 'Sidama',
      type: WarehouseType.RETAIL_OUTLET,
      capacity: 800,
      isActive: true,
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-15T00:00:00Z',
    },
  ];

  const mockLowStockItems: StockLevel[] = [
    {
      id: 1,
      item: mockItems[0], // Ethiopian Coffee Beans
      warehouse: mockWarehouses[0],
      currentQuantity: 15,
      minimumQuantity: 50,
      maximumQuantity: 200,
      reorderPoint: 30,
      lastUpdated: '2024-02-15T10:30:00Z',
    },
    {
      id: 2,
      item: mockItems[2], // Teff Flour
      warehouse: mockWarehouses[1],
      currentQuantity: 8,
      minimumQuantity: 25,
      maximumQuantity: 100,
      reorderPoint: 15,
      lastUpdated: '2024-02-14T14:20:00Z',
    },
  ];

  const mockPendingCustomsItems: Item[] = [
    mockItems[4], // Solar Panel System
  ];

  const mockStockMovements: StockMovement[] = [
    {
      id: 1,
      item: mockItems[0],
      warehouse: mockWarehouses[0],
      movementType: MovementType.IN,
      quantity: 100,
      unitCost: 850,
      reason: 'Purchase from supplier',
      movementDate: '2024-02-10T09:00:00Z',
      createdBy: 'John Doe',
    },
    {
      id: 2,
      item: mockItems[1],
      warehouse: mockWarehouses[1],
      movementType: MovementType.OUT,
      quantity: 2,
      unitCost: 12500,
      reason: 'Sale to restaurant',
      movementDate: '2024-02-12T15:30:00Z',
      createdBy: 'Jane Smith',
    },
  ];

  const dashboard: InventoryDashboard = {
    totalItems: mockItems.length,
    totalValue: 125000, // Total in ETB
    lowStockItems: mockLowStockItems.length,
    warehouseCount: mockWarehouses.length,
    recentMovements: mockStockMovements,
    inventoryTurnover: 4.2,
    daysSalesInventory: 87,
  };

  const valuationEtb = {
    totalValueUsd: 2273.00,
    totalValueEtb: 125000,
    exchangeRate: 54.95,
    timestamp: '2024-02-15T12:00:00Z',
  };

  return {
    dashboard,
    warehouses: mockWarehouses,
    lowStockItems: mockLowStockItems,
    pendingCustomsItems: mockPendingCustomsItems,
    valuationEtb,
  };
};

interface MockDataProviderProps {
  children: ReactNode;
}

export const MockDataProvider: React.FC<MockDataProviderProps> = ({ children }) => {
  const mockData = createMockData();

  return (
    <MockDataContext.Provider value={mockData}>
      {children}
    </MockDataContext.Provider>
  );
};

export default MockDataProvider;
