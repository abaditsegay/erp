import api from './api';

// Types for logistics data
export interface ShipmentStatus {
  CREATED: 'CREATED';
  PICKED_UP: 'PICKED_UP';
  IN_TRANSIT: 'IN_TRANSIT';
  CUSTOMS_PROCESSING: 'CUSTOMS_PROCESSING';
  CUSTOMS_CLEARED: 'CUSTOMS_CLEARED';
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY';
  DELIVERED: 'DELIVERED';
  DELAYED: 'DELAYED';
  CANCELLED: 'CANCELLED';
  RETURNED: 'RETURNED';
}

export interface TransportMode {
  AIR: 'AIR';
  SEA: 'SEA';
  LAND: 'LAND';
  RAIL: 'RAIL';
  MULTIMODAL: 'MULTIMODAL';
}

export interface Priority {
  LOW: 'LOW';
  NORMAL: 'NORMAL';
  HIGH: 'HIGH';
  URGENT: 'URGENT';
  CRITICAL: 'CRITICAL';
}

export interface Shipment {
  id?: number;
  trackingNumber: string;
  description: string;
  origin: string;
  destination: string;
  status: keyof ShipmentStatus;
  mode: keyof TransportMode;
  priority: keyof Priority;
  carrier?: string;
  weightKg?: number;
  volumeCbm?: number;
  customsValue?: number;
  currency?: string;
  dutyAmount?: number;
  vatAmount?: number;
  totalTaxes?: number;
  createdDate?: string;
  pickupDate?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  customsDeclarationNumber?: string;
  portOfEntry?: string;
  customsAgent?: string;
  tinNumber?: string;
  importerName?: string;
  isInternational?: boolean;
  requiresCustoms?: boolean;
  isTemperatureControlled?: boolean;
  specialInstructions?: string;
}

export interface ShipmentEvent {
  id: number;
  eventType: string;
  location?: string;
  description: string;
  eventTimestamp: string;
  createdBy?: string;
  isMilestone?: boolean;
  additionalData?: string;
}

export interface ShipmentStatusData {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface MonthlyShipmentData {
  month: string;
  year: number;
  shipmentCount: number;
  totalValue: number;
}

export interface TopDestinationData {
  destination: string;
  shipmentCount: number;
  percentage: number;
  trend: string;
}

export interface WarehouseUtilizationData {
  warehouseCode: string;
  warehouseName: string;
  utilizationPercentage: number;
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
  status: string;
}

export interface CustomsClearanceData {
  portOfEntry: string;
  clearedCount: number;
  pendingCount: number;
  averageProcessingDays: number;
  performance: string;
}

export interface LogisticsDashboard {
  totalShipments: number;
  deliveredShipments: number;
  inTransitShipments: number;
  delayedShipments: number;
  onTimeDeliveryPercentage: number;
  averageProcessingTimeDays: number;
  totalShipmentValue: number;
  currency: string;
  lastUpdated: string;
  statusDistribution: ShipmentStatusData[];
  monthlyTrends: MonthlyShipmentData[];
  topDestinations: TopDestinationData[];
  warehouseUtilization: WarehouseUtilizationData[];
  customsPerformance: CustomsClearanceData[];
}

export interface ShipmentSearchParams {
  trackingNumber?: string;
  status?: keyof ShipmentStatus;
  destination?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Logistics Service
const logisticsService = {
  // Dashboard and Reports
  getDashboard: async (): Promise<LogisticsDashboard> => {
    const response = await api.get<LogisticsDashboard>('/logistics/dashboard');
    return response.data;
  },

  getMonthlyTrends: async (): Promise<MonthlyShipmentData[]> => {
    const response = await api.get<MonthlyShipmentData[]>('/logistics/reports/monthly-trends');
    return response.data;
  },

  getStatusDistribution: async (): Promise<ShipmentStatusData[]> => {
    const response = await api.get<ShipmentStatusData[]>('/logistics/reports/status-distribution');
    return response.data;
  },

  getTopDestinations: async (): Promise<TopDestinationData[]> => {
    const response = await api.get<TopDestinationData[]>('/logistics/reports/top-destinations');
    return response.data;
  },

  getWarehouseUtilization: async (): Promise<WarehouseUtilizationData[]> => {
    const response = await api.get<WarehouseUtilizationData[]>('/logistics/reports/warehouse-utilization');
    return response.data;
  },

  getCustomsPerformance: async (): Promise<CustomsClearanceData[]> => {
    const response = await api.get<CustomsClearanceData[]>('/logistics/reports/customs-performance');
    return response.data;
  },

  getPerformanceMetrics: async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get('/logistics/reports/performance', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Shipment Management
  getAllShipments: async (page: number = 0, size: number = 20): Promise<PagedResponse<Shipment>> => {
    const response = await api.get<PagedResponse<Shipment>>('/logistics/shipments', {
      params: { page, size }
    });
    return response.data;
  },

  searchShipments: async (params: ShipmentSearchParams): Promise<PagedResponse<Shipment>> => {
    const response = await api.get<PagedResponse<Shipment>>('/logistics/shipments/search', {
      params
    });
    return response.data;
  },

  getShipmentByTrackingNumber: async (trackingNumber: string): Promise<Shipment> => {
    const response = await api.get<Shipment>(`/logistics/shipments/tracking/${trackingNumber}`);
    return response.data;
  },

  createShipment: async (shipment: Omit<Shipment, 'id'>): Promise<Shipment> => {
    const response = await api.post<Shipment>('/logistics/shipments', shipment);
    return response.data;
  },

  updateShipmentStatus: async (
    id: number, 
    status: keyof ShipmentStatus, 
    location?: string, 
    description?: string
  ): Promise<Shipment> => {
    const response = await api.put<Shipment>(`/logistics/shipments/${id}/status`, null, {
      params: { status, location, description }
    });
    return response.data;
  },

  // Shipment Events
  getShipmentEvents: async (shipmentId: number): Promise<ShipmentEvent[]> => {
    const response = await api.get<ShipmentEvent[]>(`/logistics/shipments/${shipmentId}/events`);
    return response.data;
  },

  addShipmentEvent: async (
    shipmentId: number, 
    eventType: string, 
    description: string, 
    location?: string
  ): Promise<ShipmentEvent> => {
    const response = await api.post<ShipmentEvent>(`/logistics/shipments/${shipmentId}/events`, null, {
      params: { eventType, description, location }
    });
    return response.data;
  },

  // Attention and Alerts
  getShipmentsRequiringAttention: async (): Promise<Shipment[]> => {
    const response = await api.get<Shipment[]>('/logistics/shipments/attention');
    return response.data;
  },

  // Utility functions
  formatCurrency: (amount: number, currency: string = 'ETB'): string => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: currency === 'ETB' ? 'ETB' : 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  },

  getStatusColor: (status: keyof ShipmentStatus): string => {
    const statusColors: Record<keyof ShipmentStatus, string> = {
      CREATED: '#607d8b',
      PICKED_UP: '#9c27b0',
      IN_TRANSIT: '#2196f3',
      CUSTOMS_PROCESSING: '#ff9800',
      CUSTOMS_CLEARED: '#4caf50',
      OUT_FOR_DELIVERY: '#3f51b5',
      DELIVERED: '#4caf50',
      DELAYED: '#ff5722',
      CANCELLED: '#f44336',
      RETURNED: '#795548'
    };
    return statusColors[status] || '#757575';
  },

  getStatusDisplayName: (status: keyof ShipmentStatus): string => {
    const statusNames: Record<keyof ShipmentStatus, string> = {
      CREATED: 'Created',
      PICKED_UP: 'Picked Up',
      IN_TRANSIT: 'In Transit',
      CUSTOMS_PROCESSING: 'Customs Processing',
      CUSTOMS_CLEARED: 'Customs Cleared',
      OUT_FOR_DELIVERY: 'Out for Delivery',
      DELIVERED: 'Delivered',
      DELAYED: 'Delayed',
      CANCELLED: 'Cancelled',
      RETURNED: 'Returned'
    };
    return statusNames[status] || status;
  },

  getModeDisplayName: (mode: keyof TransportMode): string => {
    const modeNames: Record<keyof TransportMode, string> = {
      AIR: 'Air',
      SEA: 'Sea',
      LAND: 'Land',
      RAIL: 'Rail',
      MULTIMODAL: 'Multimodal'
    };
    return modeNames[mode] || mode;
  },

  getPriorityDisplayName: (priority: keyof Priority): string => {
    const priorityNames: Record<keyof Priority, string> = {
      LOW: 'Low',
      NORMAL: 'Normal',
      HIGH: 'High',
      URGENT: 'Urgent',
      CRITICAL: 'Critical'
    };
    return priorityNames[priority] || priority;
  },

  getPriorityColor: (priority: keyof Priority): string => {
    const priorityColors: Record<keyof Priority, string> = {
      LOW: '#4caf50',
      NORMAL: '#2196f3',
      HIGH: '#ff9800',
      URGENT: '#ff5722',
      CRITICAL: '#f44336'
    };
    return priorityColors[priority] || '#757575';
  },

  calculateDeliveryProgress: (status: keyof ShipmentStatus): number => {
    const statusProgress: Record<keyof ShipmentStatus, number> = {
      CREATED: 10,
      PICKED_UP: 20,
      IN_TRANSIT: 50,
      CUSTOMS_PROCESSING: 70,
      CUSTOMS_CLEARED: 80,
      OUT_FOR_DELIVERY: 90,
      DELIVERED: 100,
      DELAYED: 50,
      CANCELLED: 0,
      RETURNED: 0
    };
    return statusProgress[status] || 0;
  },

  formatEthiopianDate: (dateString: string): string => {
    // This would integrate with the Gregorian calendar service
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ET', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Africa/Addis_Ababa'
    });
  },

  formatEthiopianDateTime: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-ET', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Addis_Ababa'
    });
  }
};

export default logisticsService;
