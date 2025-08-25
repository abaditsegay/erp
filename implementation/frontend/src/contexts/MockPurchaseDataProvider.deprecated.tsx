import React, { createContext, useContext, ReactNode } from 'react';
import {
  PurchaseDashboard,
  PurchaseOrder,
  EthiopianSupplier,
  PurchaseRequisition,
  SupplierPerformance,
  SupplierType,
  PurchaseOrderStatus,
  OrderType,
  PriorityLevel,
  PaymentTerms,
  RequisitionStatus,
  PaymentVoucher,
  PaymentStatus,
  PaymentMethod,
  ApprovalStatus,
  Incoterm
} from '../types/purchase';

interface MockPurchaseDataContextType {
  dashboard: PurchaseDashboard;
  suppliers: EthiopianSupplier[];
  purchaseOrders: PurchaseOrder[];
  requisitions: PurchaseRequisition[];
  overduePayments: PaymentVoucher[];
  exchangeRate: {
    usdToEtb: number;
    timestamp: string;
  };
}

const MockPurchaseDataContext = createContext<MockPurchaseDataContextType | undefined>(undefined);

export const useMockPurchaseData = () => {
  const context = useContext(MockPurchaseDataContext);
  if (!context) {
    throw new Error('useMockPurchaseData must be used within a MockPurchaseDataProvider');
  }
  return context;
};

// Mock Ethiopian business purchase data
const createMockPurchaseData = (): MockPurchaseDataContextType => {
  const mockSuppliers: EthiopianSupplier[] = [
    {
      id: 1,
      name: 'Addis Coffee Exporters',
      code: 'SUP-001',
      contactPerson: 'Yohannes Tadesse',
      email: 'yohannes@addiscoffee.et',
      phone: '+251-11-123-4567',
      address: {
        street: 'Bole Road, Building 123',
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        country: 'Ethiopia',
        poBox: '1234'
      },
      supplierType: SupplierType.LOCAL,
      paymentTerms: PaymentTerms.NET_30,
      currency: 'ETB',
      taxNumber: '1234567890',
      licenseNumber: 'ET-EXP-001',
      bankDetails: {
        bankName: 'Commercial Bank of Ethiopia',
        accountNumber: '1000123456789',
        swiftCode: 'CBETETAA',
        branch: 'Bole Branch'
      },
      isImporter: false,
      rating: 4.5,
      isActive: true,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-02-10T00:00:00Z'
    },
    {
      id: 2,
      name: 'Dubai International Trading LLC',
      code: 'SUP-002',
      contactPerson: 'Ahmed Al-Rashid',
      email: 'ahmed@dubaitrading.ae',
      phone: '+971-4-567-8901',
      address: {
        street: 'Trade Center, Office 301',
        city: 'Dubai',
        region: 'Addis Ababa', // For demo purposes, use Ethiopian region
        country: 'UAE'
      },
      supplierType: SupplierType.INTERNATIONAL,
      paymentTerms: PaymentTerms.LETTER_OF_CREDIT,
      currency: 'USD',
      licenseNumber: 'UAE-IMP-002',
      bankDetails: {
        bankName: 'Emirates NBD',
        accountNumber: 'AE123456789012345',
        swiftCode: 'EBILAEAD',
        branch: 'Trade Center Branch'
      },
      isImporter: true,
      customsLicense: 'ET-IMP-2024-001',
      rating: 4.2,
      isActive: true,
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-02-15T00:00:00Z'
    },
    {
      id: 3,
      name: 'Dire Dawa Agricultural Cooperative',
      code: 'SUP-003',
      contactPerson: 'Fatuma Mohammed',
      email: 'fatuma@ddagricoop.et',
      phone: '+251-25-111-2233',
      address: {
        street: 'Agricultural Zone, Sector 5',
        city: 'Dire Dawa',
        region: 'Dire Dawa',
        country: 'Ethiopia',
        poBox: '567'
      },
      supplierType: SupplierType.COOPERATIVE,
      paymentTerms: PaymentTerms.NET_15,
      currency: 'ETB',
      taxNumber: '9876543210',
      licenseNumber: 'ET-COOP-003',
      bankDetails: {
        bankName: 'Cooperative Bank of Oromia',
        accountNumber: '2000567890123',
        branch: 'Dire Dawa Branch'
      },
      isImporter: false,
      rating: 4.8,
      isActive: true,
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-20T00:00:00Z'
    },
    {
      id: 4,
      name: 'World Food Programme Ethiopia',
      code: 'SUP-004',
      contactPerson: 'Sarah Johnson',
      email: 'sarah.johnson@wfp.org',
      phone: '+251-11-647-8000',
      address: {
        street: 'UN Compound, Africa Avenue',
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        country: 'Ethiopia',
        poBox: '5580'
      },
      supplierType: SupplierType.NGO,
      paymentTerms: PaymentTerms.NET_45,
      currency: 'USD',
      licenseNumber: 'UN-WFP-ET',
      isImporter: true,
      rating: 5.0,
      isActive: true,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-02-25T00:00:00Z'
    },
    {
      id: 5,
      name: 'Ethiopian Steel Manufacturing',
      code: 'SUP-005',
      contactPerson: 'Dawit Haile',
      email: 'dawit@ethsteel.et',
      phone: '+251-11-456-7890',
      address: {
        street: 'Industrial Zone, Plot 45',
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        country: 'Ethiopia',
        poBox: '9876'
      },
      supplierType: SupplierType.LOCAL,
      paymentTerms: PaymentTerms.NET_60,
      currency: 'ETB',
      taxNumber: '5432167890',
      licenseNumber: 'ET-MFG-005',
      bankDetails: {
        bankName: 'Development Bank of Ethiopia',
        accountNumber: '3000789012345',
        branch: 'Industrial Zone Branch'
      },
      isImporter: false,
      rating: 4.1,
      isActive: true,
      createdAt: '2024-01-25T00:00:00Z',
      updatedAt: '2024-02-18T00:00:00Z'
    }
  ];

  const mockPurchaseOrders: PurchaseOrder[] = [
    {
      id: 1,
      orderNumber: 'PO-20240215-001',
      supplier: mockSuppliers[0], // Addis Coffee Exporters
      orderDate: '2024-02-15',
      expectedDeliveryDate: '2024-03-01',
      status: PurchaseOrderStatus.APPROVED,
      orderType: OrderType.STANDARD,
      priority: PriorityLevel.MEDIUM,
      currency: 'ETB',
      exchangeRate: 54.95,
      subtotal: 125000,
      taxAmount: 18750, // 15% VAT
      shippingCost: 5000,
      customsDuty: 0,
      totalAmount: 148750,
      items: [
        {
          id: 1,
          item: {
            id: 1,
            name: 'Premium Ethiopian Coffee Beans',
            sku: 'COFFEE-001',
            description: 'Grade 1 Sidamo Coffee Beans',
            category: 'Coffee & Beverages',
            unit: 'kg',
            hsCode: '0901.11'
          },
          quantity: 500,
          unitPrice: 250,
          discount: 0,
          discountType: 'PERCENTAGE',
          lineTotal: 125000,
          taxRate: 15,
          taxAmount: 18750
        }
      ],
      deliveryAddress: {
        warehouse: 'Main Warehouse',
        address: 'Mercato District, Warehouse Complex',
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        contactPerson: 'Alemayehu Bekele',
        phone: '+251-11-555-1234'
      },
      paymentTerms: PaymentTerms.NET_30,
      notes: 'Ensure proper packaging for export quality coffee',
      approvals: [
        {
          id: 1,
          level: 1,
          approverRole: 'Purchase Manager',
          approverName: 'Meron Tadesse',
          status: ApprovalStatus.APPROVED,
          comments: 'Good supplier, approved for processing',
          approvedAt: '2024-02-16T10:30:00Z'
        }
      ],
      createdBy: 'Tesfaye Wolde',
      approvedBy: 'Meron Tadesse',
      createdAt: '2024-02-15T09:00:00Z',
      updatedAt: '2024-02-16T10:30:00Z'
    },
    {
      id: 2,
      orderNumber: 'PO-20240220-002',
      supplier: mockSuppliers[1], // Dubai International Trading
      orderDate: '2024-02-20',
      expectedDeliveryDate: '2024-03-15',
      status: PurchaseOrderStatus.PENDING_APPROVAL,
      orderType: OrderType.IMPORT,
      priority: PriorityLevel.HIGH,
      currency: 'USD',
      exchangeRate: 54.95,
      subtotal: 25000,
      taxAmount: 3750,
      shippingCost: 2000,
      customsDuty: 2500,
      totalAmount: 33250,
      items: [
        {
          id: 2,
          item: {
            id: 2,
            name: 'Solar Panel Systems',
            sku: 'SOLAR-001',
            description: '320W Monocrystalline Solar Panels',
            category: 'Electronics',
            unit: 'pcs',
            hsCode: '8541.40'
          },
          quantity: 100,
          unitPrice: 250,
          discount: 0,
          discountType: 'PERCENTAGE',
          lineTotal: 25000,
          taxRate: 15,
          taxAmount: 3750
        }
      ],
      deliveryAddress: {
        warehouse: 'Customs Warehouse',
        address: 'Bole International Airport',
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        contactPerson: 'Henok Mehari',
        phone: '+251-11-666-5678'
      },
      paymentTerms: PaymentTerms.LETTER_OF_CREDIT,
      incoterm: Incoterm.CIF,
      notes: 'Requires import permit and quality certification',
      approvals: [
        {
          id: 2,
          level: 1,
          approverRole: 'Purchase Manager',
          approverName: 'Meron Tadesse',
          status: ApprovalStatus.PENDING,
          requiredAmount: 50000
        }
      ],
      createdBy: 'Zara Ahmed',
      createdAt: '2024-02-20T14:00:00Z',
      updatedAt: '2024-02-20T14:00:00Z'
    }
  ];

  const mockRequisitions: PurchaseRequisition[] = [
    {
      id: 1,
      requestNumber: 'REQ-20240218-001',
      requestedBy: 'Almaz Kebede',
      department: 'Operations',
      requestDate: '2024-02-18',
      requiredDate: '2024-03-05',
      priority: PriorityLevel.MEDIUM,
      status: RequisitionStatus.APPROVED,
      description: 'Office equipment and supplies for new branch',
      justification: 'Expansion to Hawassa branch requires new office setup',
      items: [
        {
          id: 1,
          description: 'Office Desks',
          quantity: 10,
          unit: 'pcs',
          estimatedUnitPrice: 5000,
          estimatedTotal: 50000,
          specifications: 'Wooden desk with drawers, 1.2m x 0.8m',
          suggestedSupplier: 'Ethiopian Furniture Works',
          urgency: 'MEDIUM'
        },
        {
          id: 2,
          description: 'Computer Chairs',
          quantity: 10,
          unit: 'pcs',
          estimatedUnitPrice: 3000,
          estimatedTotal: 30000,
          specifications: 'Ergonomic office chairs with adjustable height',
          urgency: 'MEDIUM'
        }
      ],
      estimatedBudget: 80000,
      currency: 'ETB',
      approvals: [
        {
          id: 1,
          level: 1,
          approverRole: 'Department Head',
          approverName: 'Bekele Worku',
          status: ApprovalStatus.APPROVED,
          comments: 'Necessary for branch operations',
          approvedAt: '2024-02-19T11:00:00Z'
        }
      ],
      createdAt: '2024-02-18T16:00:00Z',
      updatedAt: '2024-02-19T11:00:00Z'
    }
  ];

  const mockOverduePayments: PaymentVoucher[] = [
    {
      id: 1,
      voucherNumber: 'PV-20240101-001',
      purchaseOrder: mockPurchaseOrders[0],
      supplier: mockSuppliers[0],
      paymentDate: '2024-01-15',
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      currency: 'ETB',
      amountToPay: 148750,
      amountPaid: 0,
      discountTaken: 0,
      withholdingTax: 2975, // 2% withholding tax
      bankCharges: 500,
      status: PaymentStatus.OVERDUE,
      paymentTerms: PaymentTerms.NET_30,
      dueDate: '2024-02-14',
      approvals: [
        {
          id: 1,
          level: 1,
          approverRole: 'Finance Manager',
          approverName: 'Tigist Haile',
          status: ApprovalStatus.APPROVED,
          approvedAt: '2024-02-10T15:00:00Z'
        }
      ],
      createdBy: 'Mulugeta Worku',
      approvedBy: 'Tigist Haile',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-02-10T15:00:00Z'
    }
  ];

  const mockSupplierPerformance: SupplierPerformance[] = mockSuppliers.map((supplier, index) => ({
    supplier,
    totalOrders: 15 + index * 5,
    totalValue: 250000 + index * 100000,
    onTimeDelivery: 85 + index * 2,
    qualityRating: 4.0 + index * 0.2,
    lastOrderDate: '2024-02-15',
    averageLeadTime: 10 + index * 2
  }));

  const dashboard: PurchaseDashboard = {
    totalPurchaseOrders: mockPurchaseOrders.length,
    pendingApprovals: mockPurchaseOrders.filter(po => po.status === PurchaseOrderStatus.PENDING_APPROVAL).length,
    overduePayments: mockOverduePayments.length,
    monthlySpending: 1250000, // ETB
    yearlySpending: 15000000, // ETB
    topSuppliers: mockSupplierPerformance.slice(0, 5),
    recentOrders: mockPurchaseOrders.slice(0, 5),
    pendingReceipts: mockPurchaseOrders.filter(po => po.status === PurchaseOrderStatus.SENT_TO_SUPPLIER),
    currencyBreakdown: {
      usd: 75000,
      etb: 8000000
    },
    approvalWorkflow: {
      pending: 3,
      approved: 12,
      rejected: 1
    }
  };

  const exchangeRate = {
    usdToEtb: 54.95,
    timestamp: '2024-02-25T12:00:00Z'
  };

  return {
    dashboard,
    suppliers: mockSuppliers,
    purchaseOrders: mockPurchaseOrders,
    requisitions: mockRequisitions,
    overduePayments: mockOverduePayments,
    exchangeRate
  };
};

interface MockPurchaseDataProviderProps {
  children: ReactNode;
}

export const MockPurchaseDataProvider: React.FC<MockPurchaseDataProviderProps> = ({ children }) => {
  const mockData = createMockPurchaseData();

  return (
    <MockPurchaseDataContext.Provider value={mockData}>
      {children}
    </MockPurchaseDataContext.Provider>
  );
};

export default MockPurchaseDataProvider;
