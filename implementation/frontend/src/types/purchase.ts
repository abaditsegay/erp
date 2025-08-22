// Ethiopian Purchase Management Types
export interface EthiopianSupplier {
  id: number;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    region: EthiopianRegion;
    country: string;
    poBox?: string;
  };
  supplierType: SupplierType;
  paymentTerms: PaymentTerms;
  currency: 'USD' | 'ETB';
  taxNumber?: string;
  licenseNumber?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    swiftCode?: string;
    branch: string;
  };
  isImporter: boolean;
  customsLicense?: string;
  rating: number; // 1-5 stars
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  supplier: EthiopianSupplier;
  orderDate: string;
  expectedDeliveryDate?: string;
  status: PurchaseOrderStatus;
  orderType: OrderType;
  priority: PriorityLevel;
  currency: 'USD' | 'ETB';
  exchangeRate?: number; // ETB per USD when currency is USD
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  customsDuty: number;
  totalAmount: number;
  items: PurchaseOrderItem[];
  deliveryAddress: {
    warehouse: string;
    address: string;
    city: string;
    region: EthiopianRegion;
    contactPerson: string;
    phone: string;
  };
  paymentTerms: PaymentTerms;
  notes?: string;
  incoterm?: Incoterm;
  customsDocuments?: CustomsDocument[];
  approvals: PurchaseApproval[];
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: number;
  item: {
    id: number;
    name: string;
    sku: string;
    description?: string;
    category: string;
    unit: string;
    hsCode?: string; // Harmonized System Code for customs
  };
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'PERCENTAGE' | 'FIXED';
  lineTotal: number;
  taxRate: number;
  taxAmount: number;
  expectedDeliveryDate?: string;
  specifications?: string;
  qualityRequirements?: string;
}

export interface PurchaseApproval {
  id: number;
  level: number;
  approverRole: string;
  approverName: string;
  status: ApprovalStatus;
  comments?: string;
  approvedAt?: string;
  requiredAmount?: number; // Approval required above this amount
}

export interface CustomsDocument {
  id: number;
  documentType: CustomsDocumentType;
  documentNumber: string;
  issuedDate: string;
  expiryDate?: string;
  issuingAuthority: string;
  status: DocumentStatus;
  filePath?: string;
}

export interface PurchaseRequisition {
  id: number;
  requestNumber: string;
  requestedBy: string;
  department: string;
  requestDate: string;
  requiredDate: string;
  priority: PriorityLevel;
  status: RequisitionStatus;
  description: string;
  justification: string;
  items: RequisitionItem[];
  estimatedBudget: number;
  currency: 'USD' | 'ETB';
  approvals: PurchaseApproval[];
  purchaseOrders?: number[]; // Related PO IDs
  createdAt: string;
  updatedAt: string;
}

export interface RequisitionItem {
  id: number;
  description: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  estimatedTotal: number;
  specifications?: string;
  suggestedSupplier?: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface GoodsReceived {
  id: number;
  grnNumber: string;
  purchaseOrder: PurchaseOrder;
  receivedDate: string;
  receivedBy: string;
  warehouse: string;
  supplier: EthiopianSupplier;
  status: GRNStatus;
  items: GoodsReceivedItem[];
  notes?: string;
  qualityCheck: {
    inspector: string;
    inspectionDate: string;
    status: 'PASSED' | 'FAILED' | 'PARTIAL';
    notes?: string;
  };
  customsClearance?: {
    clearanceDate?: string;
    customsOfficer?: string;
    dutyPaid: number;
    documents: CustomsDocument[];
  };
  invoiceMatching: {
    supplierInvoiceNumber?: string;
    invoiceDate?: string;
    invoiceAmount?: number;
    matched: boolean;
    discrepancies?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface GoodsReceivedItem {
  id: number;
  purchaseOrderItem: PurchaseOrderItem;
  orderedQuantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
  unitPrice: number;
  lineTotal: number;
  qualityStatus: 'GOOD' | 'DAMAGED' | 'EXPIRED' | 'SUBSTANDARD';
  expiryDate?: string;
  batchNumber?: string;
  serialNumbers?: string[];
  storageLocation: string;
  notes?: string;
}

export interface PaymentVoucher {
  id: number;
  voucherNumber: string;
  purchaseOrder: PurchaseOrder;
  supplier: EthiopianSupplier;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  currency: 'USD' | 'ETB';
  exchangeRate?: number;
  amountToPay: number;
  amountPaid: number;
  discountTaken: number;
  withholdingTax: number;
  bankCharges: number;
  status: PaymentStatus;
  bankReference?: string;
  paymentTerms: PaymentTerms;
  dueDate: string;
  approvals: PurchaseApproval[];
  attachments?: string[];
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Enums for Ethiopian Business Context
export enum SupplierType {
  LOCAL = 'LOCAL',
  INTERNATIONAL = 'INTERNATIONAL',
  GOVERNMENT = 'GOVERNMENT',
  NGO = 'NGO',
  COOPERATIVE = 'COOPERATIVE'
}

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  SENT_TO_SUPPLIER = 'SENT_TO_SUPPLIER',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  FULLY_RECEIVED = 'FULLY_RECEIVED',
  INVOICED = 'INVOICED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED'
}

export enum OrderType {
  STANDARD = 'STANDARD',
  BLANKET = 'BLANKET',
  CONTRACT = 'CONTRACT',
  EMERGENCY = 'EMERGENCY',
  IMPORT = 'IMPORT',
  LOCAL = 'LOCAL'
}

export enum PriorityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL'
}

export enum PaymentTerms {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  NET_15 = 'NET_15',
  NET_30 = 'NET_30',
  NET_45 = 'NET_45',
  NET_60 = 'NET_60',
  NET_90 = 'NET_90',
  ADVANCE_PAYMENT = 'ADVANCE_PAYMENT',
  LETTER_OF_CREDIT = 'LETTER_OF_CREDIT',
  CONSIGNMENT = 'CONSIGNMENT'
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK',
  LETTER_OF_CREDIT = 'LETTER_OF_CREDIT',
  MOBILE_MONEY = 'MOBILE_MONEY', // M-Birr, CBE-Birr
  WIRE_TRANSFER = 'WIRE_TRANSFER'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DELEGATED = 'DELEGATED'
}

export enum RequisitionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CONVERTED_TO_PO = 'CONVERTED_TO_PO',
  CANCELLED = 'CANCELLED'
}

export enum GRNStatus {
  DRAFT = 'DRAFT',
  RECEIVED = 'RECEIVED',
  INSPECTED = 'INSPECTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PARTIAL = 'PARTIAL'
}

export enum CustomsDocumentType {
  COMMERCIAL_INVOICE = 'COMMERCIAL_INVOICE',
  PACKING_LIST = 'PACKING_LIST',
  BILL_OF_LADING = 'BILL_OF_LADING',
  CERTIFICATE_OF_ORIGIN = 'CERTIFICATE_OF_ORIGIN',
  IMPORT_PERMIT = 'IMPORT_PERMIT',
  QUALITY_CERTIFICATE = 'QUALITY_CERTIFICATE',
  PHYTOSANITARY_CERTIFICATE = 'PHYTOSANITARY_CERTIFICATE',
  CUSTOMS_DECLARATION = 'CUSTOMS_DECLARATION'
}

export enum DocumentStatus {
  VALID = 'VALID',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}

export enum Incoterm {
  EXW = 'EXW', // Ex Works
  FCA = 'FCA', // Free Carrier
  CPT = 'CPT', // Carriage Paid To
  CIP = 'CIP', // Carriage and Insurance Paid To
  DAP = 'DAP', // Delivered at Place
  DPU = 'DPU', // Delivered at Place Unloaded
  DDP = 'DDP', // Delivered Duty Paid
  FAS = 'FAS', // Free Alongside Ship
  FOB = 'FOB', // Free on Board
  CFR = 'CFR', // Cost and Freight
  CIF = 'CIF'  // Cost, Insurance and Freight
}

// Ethiopian Regions for supplier addresses
export type EthiopianRegion = 
  | 'Addis Ababa'
  | 'Afar'
  | 'Amhara'
  | 'Benishangul-Gumuz'
  | 'Dire Dawa'
  | 'Gambela'
  | 'Harari'
  | 'Oromia'
  | 'Sidama'
  | 'SNNP'
  | 'Somali'
  | 'Tigray';

export const ETHIOPIAN_REGIONS: EthiopianRegion[] = [
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
];

// Dashboard and Analytics
export interface PurchaseDashboard {
  totalPurchaseOrders: number;
  pendingApprovals: number;
  overduePayments: number;
  monthlySpending: number;
  yearlySpending: number;
  topSuppliers: SupplierPerformance[];
  recentOrders: PurchaseOrder[];
  pendingReceipts: PurchaseOrder[];
  currencyBreakdown: {
    usd: number;
    etb: number;
  };
  approvalWorkflow: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface SupplierPerformance {
  supplier: EthiopianSupplier;
  totalOrders: number;
  totalValue: number;
  onTimeDelivery: number; // percentage
  qualityRating: number; // 1-5 stars
  lastOrderDate: string;
  averageLeadTime: number; // days
}

// Form Types for Create/Update Operations
export interface CreatePurchaseOrderForm {
  supplierId: number;
  orderDate: string;
  expectedDeliveryDate?: string;
  orderType: OrderType;
  priority: PriorityLevel;
  currency: 'USD' | 'ETB';
  items: CreatePurchaseOrderItemForm[];
  deliveryWarehouseId: number;
  deliveryAddress: string;
  deliveryContactPerson: string;
  deliveryPhone: string;
  paymentTerms: PaymentTerms;
  incoterm?: Incoterm;
  notes?: string;
}

export interface CreatePurchaseOrderItemForm {
  itemId: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'PERCENTAGE' | 'FIXED';
  taxRate: number;
  expectedDeliveryDate?: string;
  specifications?: string;
  qualityRequirements?: string;
}

export interface CreateSupplierForm {
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    region: EthiopianRegion;
    country: string;
    poBox?: string;
  };
  supplierType: SupplierType;
  paymentTerms: PaymentTerms;
  currency: 'USD' | 'ETB';
  taxNumber?: string;
  licenseNumber?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    swiftCode?: string;
    branch: string;
  };
  isImporter: boolean;
  customsLicense?: string;
}

export interface CreateRequisitionForm {
  department: string;
  requiredDate: string;
  priority: PriorityLevel;
  description: string;
  justification: string;
  items: CreateRequisitionItemForm[];
  estimatedBudget: number;
  currency: 'USD' | 'ETB';
}

export interface CreateRequisitionItemForm {
  description: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  specifications?: string;
  suggestedSupplier?: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// API Response Types
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Ethiopian Business Constants
export const ETHIOPIAN_TAX_RATES = {
  VAT: 0.15, // 15% VAT
  WITHHOLDING_TAX: 0.02, // 2% withholding tax on services
  CUSTOMS_DUTY: 0.10, // Average 10% customs duty
  EXCISE_TAX: 0.30 // 30% on luxury items
};

export const ETHIOPIAN_BANKS = [
  'Commercial Bank of Ethiopia',
  'Development Bank of Ethiopia',
  'Awash Bank',
  'Dashen Bank',
  'Bank of Abyssinia',
  'Wegagen Bank',
  'United Bank',
  'Nib International Bank',
  'Cooperative Bank of Oromia',
  'Lion International Bank',
  'Oromia International Bank',
  'Bunna International Bank',
  'Berhan International Bank',
  'Abay Bank',
  'Addis International Bank',
  'Debub Global Bank',
  'Enat Bank',
  'Hibret Bank',
  'Siinqee Bank',
  'Tsehay Bank'
];

export const PAYMENT_TERMS_DESCRIPTIONS = {
  [PaymentTerms.CASH_ON_DELIVERY]: 'Payment due upon delivery',
  [PaymentTerms.NET_15]: 'Payment due within 15 days',
  [PaymentTerms.NET_30]: 'Payment due within 30 days',
  [PaymentTerms.NET_45]: 'Payment due within 45 days',
  [PaymentTerms.NET_60]: 'Payment due within 60 days',
  [PaymentTerms.NET_90]: 'Payment due within 90 days',
  [PaymentTerms.ADVANCE_PAYMENT]: 'Payment required in advance',
  [PaymentTerms.LETTER_OF_CREDIT]: 'Payment via Letter of Credit',
  [PaymentTerms.CONSIGNMENT]: 'Payment when goods are sold'
};
