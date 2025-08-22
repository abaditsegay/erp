import axios from 'axios';
import {
  PurchaseRequisition,
  CreateRequisitionForm,
  RequisitionStatus,
  PriorityLevel,
  PaginatedResponse,
  PurchaseOrder,
  ApprovalStatus
} from '../types/purchase';

const API_BASE_URL = '/api/requisitions';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RequisitionFilters {
  search?: string;
  status?: RequisitionStatus;
  priority?: PriorityLevel;
  department?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface DashboardStats {
  totalRequisitions: number;
  pendingApproval: number;
  approved: number;
  underReview: number;
  monthlyRequisitions: number;
  averageProcessingTime: number;
}

export const requisitionService = {
  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get<DashboardStats>('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.log('API not available, returning mock dashboard stats');
      // Return mock Ethiopian data
      return {
        totalRequisitions: 234,
        pendingApproval: 28,
        approved: 45,
        underReview: 12,
        monthlyRequisitions: 67,
        averageProcessingTime: 3.5
      };
    }
  },

  // Get All Requisitions with Filters
  getAllRequisitions: async (
    page = 0, 
    size = 10, 
    filters: RequisitionFilters = {}
  ): Promise<PaginatedResponse<PurchaseRequisition>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      });
      
      const response = await api.get<PaginatedResponse<PurchaseRequisition>>(`?${params}`);
      return response.data;
    } catch (error) {
      console.log('API not available, returning mock requisitions data');
      // Return mock Ethiopian requisitions data
      return getMockRequisitions(page, size, filters);
    }
  },

  // Get Requisition by ID
  getRequisitionById: async (id: number): Promise<PurchaseRequisition> => {
    try {
      const response = await api.get<PurchaseRequisition>(`/${id}`);
      return response.data;
    } catch (error) {
      console.log('API not available, returning mock requisition data');
      return getMockRequisitionById(id);
    }
  },

  // Create New Requisition
  createRequisition: async (requisitionData: CreateRequisitionForm): Promise<PurchaseRequisition> => {
    try {
      const response = await api.post<PurchaseRequisition>('/', requisitionData);
      return response.data;
    } catch (error) {
      console.log('API not available, creating mock requisition');
      return createMockRequisition(requisitionData);
    }
  },

  // Update Requisition
  updateRequisition: async (id: number, requisitionData: Partial<CreateRequisitionForm>): Promise<PurchaseRequisition> => {
    try {
      const response = await api.put<PurchaseRequisition>(`/${id}`, requisitionData);
      return response.data;
    } catch (error) {
      console.log('API not available, updating mock requisition');
      throw new Error('Update requisition not available in mock mode');
    }
  },

  // Approve Requisition
  approveRequisition: async (id: number, comments?: string): Promise<PurchaseRequisition> => {
    try {
      const response = await api.post<PurchaseRequisition>(`/${id}/approve`, { comments });
      return response.data;
    } catch (error) {
      console.log('API not available, approving mock requisition');
      const requisition = getMockRequisitionById(id);
      return {
        ...requisition,
        status: RequisitionStatus.APPROVED,
        updatedAt: new Date().toISOString()
      };
    }
  },

  // Reject Requisition
  rejectRequisition: async (id: number, reason: string): Promise<PurchaseRequisition> => {
    try {
      const response = await api.post<PurchaseRequisition>(`/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.log('API not available, rejecting mock requisition');
      const requisition = getMockRequisitionById(id);
      return {
        ...requisition,
        status: RequisitionStatus.REJECTED,
        updatedAt: new Date().toISOString()
      };
    }
  },

  // Submit Requisition for Approval
  submitRequisition: async (id: number): Promise<PurchaseRequisition> => {
    try {
      const response = await api.post<PurchaseRequisition>(`/${id}/submit`);
      return response.data;
    } catch (error) {
      console.log('API not available, submitting mock requisition');
      const requisition = getMockRequisitionById(id);
      return {
        ...requisition,
        status: RequisitionStatus.SUBMITTED,
        updatedAt: new Date().toISOString()
      };
    }
  },

  // Cancel Requisition
  cancelRequisition: async (id: number, reason: string): Promise<PurchaseRequisition> => {
    try {
      const response = await api.post<PurchaseRequisition>(`/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.log('API not available, cancelling mock requisition');
      const requisition = getMockRequisitionById(id);
      return {
        ...requisition,
        status: RequisitionStatus.CANCELLED,
        updatedAt: new Date().toISOString()
      };
    }
  },

  // Convert Requisition to Purchase Order
  convertToPurchaseOrder: async (id: number, supplierId: number): Promise<PurchaseOrder> => {
    try {
      const response = await api.post<PurchaseOrder>(`/${id}/convert-to-po`, { supplierId });
      return response.data;
    } catch (error) {
      console.log('API not available, converting mock requisition to PO');
      throw new Error('Convert to PO not available in mock mode');
    }
  },

  // Get Requisitions by Status
  getRequisitionsByStatus: async (status: RequisitionStatus): Promise<PurchaseRequisition[]> => {
    try {
      const response = await api.get<PurchaseRequisition[]>(`/status/${status}`);
      return response.data;
    } catch (error) {
      console.log('API not available, returning mock requisitions by status');
      const allRequisitions = await getMockRequisitions(0, 100);
      return allRequisitions.content.filter(req => req.status === status);
    }
  },

  // Get Requisitions by Department
  getRequisitionsByDepartment: async (department: string): Promise<PurchaseRequisition[]> => {
    try {
      const response = await api.get<PurchaseRequisition[]>(`/department/${encodeURIComponent(department)}`);
      return response.data;
    } catch (error) {
      console.log('API not available, returning mock requisitions by department');
      const allRequisitions = await getMockRequisitions(0, 100);
      return allRequisitions.content.filter(req => req.department === department);
    }
  },

  // Get My Requisitions (current user)
  getMyRequisitions: async (page = 0, size = 10): Promise<PaginatedResponse<PurchaseRequisition>> => {
    try {
      const response = await api.get<PaginatedResponse<PurchaseRequisition>>(`/my?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.log('API not available, returning mock my requisitions');
      return getMockRequisitions(page, size, { department: 'IT Department' });
    }
  },

  // Get Pending Approvals for current user
  getPendingApprovals: async (): Promise<PurchaseRequisition[]> => {
    try {
      const response = await api.get<PurchaseRequisition[]>('/pending-approvals');
      return response.data;
    } catch (error) {
      console.log('API not available, returning mock pending approvals');
      const allRequisitions = await getMockRequisitions(0, 50);
      return allRequisitions.content.filter(req => 
        req.status === RequisitionStatus.SUBMITTED || 
        req.status === RequisitionStatus.UNDER_REVIEW
      );
    }
  },

  // Get Departments with Requisition Activity
  getDepartments: async (): Promise<string[]> => {
    try {
      const response = await api.get<string[]>('/departments');
      return response.data;
    } catch (error) {
      console.log('API not available, returning mock departments');
      return [
        'IT Department',
        'Human Resources',
        'Finance',
        'Operations',
        'Procurement',
        'Marketing',
        'Sales',
        'Logistics',
        'Quality Control',
        'Maintenance'
      ];
    }
  },

  // Export Requisitions
  exportRequisitions: async (filters: RequisitionFilters = {}): Promise<Blob> => {
    try {
      const params = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      );
      
      const response = await api.get(`/export?${params}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.log('API not available, export not supported in mock mode');
      throw new Error('Export not available in mock mode');
    }
  }
};

// Mock Data Functions
function getMockRequisitions(page: number, size: number, filters: RequisitionFilters = {}): PaginatedResponse<PurchaseRequisition> {
  const mockRequisitions: PurchaseRequisition[] = [
    {
      id: 1,
      requestNumber: 'REQ-2024-001',
      requestedBy: 'Alemayehu Tesfaye',
      department: 'IT Department',
      requestDate: '2024-08-15T08:00:00Z',
      requiredDate: '2024-08-30T00:00:00Z',
      priority: PriorityLevel.HIGH,
      status: RequisitionStatus.SUBMITTED,
      description: 'Office Equipment and Software Licenses',
      justification: 'Replacement of outdated computers and software upgrades for development team',
      items: [
        {
          id: 1,
          description: 'Desktop Computer - Dell OptiPlex',
          quantity: 5,
          unit: 'pcs',
          estimatedUnitPrice: 45000,
          estimatedTotal: 225000,
          specifications: 'Intel i7, 16GB RAM, 512GB SSD',
          suggestedSupplier: 'Tech Solutions Ethiopia',
          urgency: 'HIGH'
        },
        {
          id: 2,
          description: 'Microsoft Office 365 Business Premium',
          quantity: 10,
          unit: 'licenses',
          estimatedUnitPrice: 2500,
          estimatedTotal: 25000,
          specifications: '1 year subscription',
          suggestedSupplier: 'Microsoft Ethiopia',
          urgency: 'MEDIUM'
        }
      ],
      estimatedBudget: 250000,
      currency: 'ETB',
      approvals: [
        {
          id: 1,
          level: 1,
          approverRole: 'Department Manager',
          approverName: 'Dawit Mengistu',
          status: ApprovalStatus.PENDING,
          requiredAmount: 100000
        }
      ],
      createdAt: '2024-08-15T08:00:00Z',
      updatedAt: '2024-08-15T08:00:00Z'
    },
    {
      id: 2,
      requestNumber: 'REQ-2024-002',
      requestedBy: 'Hanan Ahmed',
      department: 'Human Resources',
      requestDate: '2024-08-10T09:30:00Z',
      requiredDate: '2024-08-25T00:00:00Z',
      priority: PriorityLevel.MEDIUM,
      status: RequisitionStatus.APPROVED,
      description: 'Office Furniture for New Employees',
      justification: 'Furniture needed for 8 new hires starting next month',
      items: [
        {
          id: 3,
          description: 'Office Desk - Wooden Executive',
          quantity: 8,
          unit: 'pcs',
          estimatedUnitPrice: 12000,
          estimatedTotal: 96000,
          specifications: '1.5m x 0.8m, with drawers',
          suggestedSupplier: 'Addis Furniture House',
          urgency: 'MEDIUM'
        },
        {
          id: 4,
          description: 'Office Chair - Ergonomic',
          quantity: 8,
          unit: 'pcs',
          estimatedUnitPrice: 8000,
          estimatedTotal: 64000,
          specifications: 'Adjustable height, lumbar support',
          suggestedSupplier: 'Addis Furniture House',
          urgency: 'MEDIUM'
        }
      ],
      estimatedBudget: 160000,
      currency: 'ETB',
      approvals: [
        {
          id: 2,
          level: 1,
          approverRole: 'Department Manager',
          approverName: 'Yonas Bekele',
          status: ApprovalStatus.APPROVED,
          comments: 'Approved for new employee onboarding',
          approvedAt: '2024-08-12T14:00:00Z',
          requiredAmount: 100000
        }
      ],
      createdAt: '2024-08-10T09:30:00Z',
      updatedAt: '2024-08-12T14:00:00Z'
    },
    {
      id: 3,
      requestNumber: 'REQ-2024-003',
      requestedBy: 'Meron Tadesse',
      department: 'Operations',
      requestDate: '2024-08-18T11:15:00Z',
      requiredDate: '2024-09-01T00:00:00Z',
      priority: PriorityLevel.URGENT,
      status: RequisitionStatus.UNDER_REVIEW,
      description: 'Production Equipment Maintenance',
      justification: 'Critical machinery maintenance to prevent production downtime',
      items: [
        {
          id: 5,
          description: 'Hydraulic Pump Replacement',
          quantity: 2,
          unit: 'pcs',
          estimatedUnitPrice: 85000,
          estimatedTotal: 170000,
          specifications: 'Model HP-2500, compatible with existing system',
          suggestedSupplier: 'Industrial Equipment Ethiopia',
          urgency: 'CRITICAL'
        },
        {
          id: 6,
          description: 'Preventive Maintenance Service',
          quantity: 1,
          unit: 'service',
          estimatedUnitPrice: 35000,
          estimatedTotal: 35000,
          specifications: 'Complete system inspection and service',
          suggestedSupplier: 'Maintenance Solutions Ltd',
          urgency: 'HIGH'
        }
      ],
      estimatedBudget: 205000,
      currency: 'ETB',
      approvals: [
        {
          id: 3,
          level: 1,
          approverRole: 'Operations Manager',
          approverName: 'Berhane Wolde',
          status: ApprovalStatus.APPROVED,
          comments: 'Critical for production continuity',
          approvedAt: '2024-08-19T09:00:00Z',
          requiredAmount: 200000
        },
        {
          id: 4,
          level: 2,
          approverRole: 'Finance Manager',
          approverName: 'Tigist Assefa',
          status: ApprovalStatus.PENDING,
          requiredAmount: 200000
        }
      ],
      createdAt: '2024-08-18T11:15:00Z',
      updatedAt: '2024-08-19T09:00:00Z'
    },
    {
      id: 4,
      requestNumber: 'REQ-2024-004',
      requestedBy: 'Kidist Haile',
      department: 'Marketing',
      requestDate: '2024-08-20T14:45:00Z',
      requiredDate: '2024-09-10T00:00:00Z',
      priority: PriorityLevel.LOW,
      status: RequisitionStatus.DRAFT,
      description: 'Marketing Campaign Materials',
      justification: 'Materials needed for upcoming product launch campaign',
      items: [
        {
          id: 7,
          description: 'Promotional Banners',
          quantity: 20,
          unit: 'pcs',
          estimatedUnitPrice: 1500,
          estimatedTotal: 30000,
          specifications: '2m x 1m, full color print',
          suggestedSupplier: 'Addis Print House',
          urgency: 'LOW'
        },
        {
          id: 8,
          description: 'Marketing Brochures',
          quantity: 5000,
          unit: 'pcs',
          estimatedUnitPrice: 3,
          estimatedTotal: 15000,
          specifications: 'A4 size, glossy paper, 4-page fold',
          suggestedSupplier: 'Modern Printing',
          urgency: 'LOW'
        }
      ],
      estimatedBudget: 45000,
      currency: 'ETB',
      approvals: [],
      createdAt: '2024-08-20T14:45:00Z',
      updatedAt: '2024-08-20T14:45:00Z'
    },
    {
      id: 5,
      requestNumber: 'REQ-2024-005',
      requestedBy: 'Solomon Gebre',
      department: 'Finance',
      requestDate: '2024-08-12T16:20:00Z',
      requiredDate: '2024-08-28T00:00:00Z',
      priority: PriorityLevel.HIGH,
      status: RequisitionStatus.CONVERTED_TO_PO,
      description: 'Financial Software Upgrade',
      justification: 'Upgrade to latest version for compliance and security improvements',
      items: [
        {
          id: 9,
          description: 'SAP Business One License Upgrade',
          quantity: 1,
          unit: 'license',
          estimatedUnitPrice: 450000,
          estimatedTotal: 450000,
          specifications: 'Professional edition with 50 users',
          suggestedSupplier: 'SAP Ethiopia',
          urgency: 'HIGH'
        }
      ],
      estimatedBudget: 450000,
      currency: 'ETB',
      purchaseOrders: [2001],
      approvals: [
        {
          id: 5,
          level: 1,
          approverRole: 'Finance Manager',
          approverName: 'Tigist Assefa',
          status: ApprovalStatus.APPROVED,
          comments: 'Critical for compliance requirements',
          approvedAt: '2024-08-14T10:30:00Z',
          requiredAmount: 500000
        },
        {
          id: 6,
          level: 2,
          approverRole: 'General Manager',
          approverName: 'Dr. Abebe Worku',
          status: ApprovalStatus.APPROVED,
          comments: 'Approved for business continuity',
          approvedAt: '2024-08-15T08:15:00Z',
          requiredAmount: 400000
        }
      ],
      createdAt: '2024-08-12T16:20:00Z',
      updatedAt: '2024-08-16T11:00:00Z'
    }
  ];

  // Apply filters
  let filteredRequisitions = mockRequisitions;

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredRequisitions = filteredRequisitions.filter(req =>
      req.requestNumber.toLowerCase().includes(searchLower) ||
      req.requestedBy.toLowerCase().includes(searchLower) ||
      req.department.toLowerCase().includes(searchLower) ||
      req.description.toLowerCase().includes(searchLower)
    );
  }

  if (filters.status) {
    filteredRequisitions = filteredRequisitions.filter(req => req.status === filters.status);
  }

  if (filters.priority) {
    filteredRequisitions = filteredRequisitions.filter(req => req.priority === filters.priority);
  }

  if (filters.department) {
    filteredRequisitions = filteredRequisitions.filter(req => req.department === filters.department);
  }

  // Pagination
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedContent = filteredRequisitions.slice(startIndex, endIndex);

  return {
    content: paginatedContent,
    page,
    size,
    totalElements: filteredRequisitions.length,
    totalPages: Math.ceil(filteredRequisitions.length / size),
    first: page === 0,
    last: endIndex >= filteredRequisitions.length
  };
}

function getMockRequisitionById(id: number): PurchaseRequisition {
  const allRequisitions = getMockRequisitions(0, 100);
  const requisition = allRequisitions.content.find(req => req.id === id);
  
  if (!requisition) {
    throw new Error(`Requisition with ID ${id} not found`);
  }
  
  return requisition;
}

function createMockRequisition(formData: CreateRequisitionForm): PurchaseRequisition {
  const newId = Math.floor(Math.random() * 10000) + 1000;
  const requestNumber = `REQ-2024-${String(newId).padStart(3, '0')}`;
  
  return {
    id: newId,
    requestNumber,
    requestedBy: 'Current User', // Would come from auth context
    department: formData.department,
    requestDate: new Date().toISOString(),
    requiredDate: formData.requiredDate,
    priority: formData.priority,
    status: RequisitionStatus.DRAFT,
    description: formData.description,
    justification: formData.justification,
    items: formData.items.map((item, index) => ({
      id: newId * 100 + index,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      estimatedUnitPrice: item.estimatedUnitPrice,
      estimatedTotal: item.quantity * item.estimatedUnitPrice,
      specifications: item.specifications,
      suggestedSupplier: item.suggestedSupplier,
      urgency: item.urgency
    })),
    estimatedBudget: formData.estimatedBudget,
    currency: formData.currency,
    approvals: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export default requisitionService;
