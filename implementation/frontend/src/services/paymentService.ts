// Ethiopian Payment Service
// Handles payment processing, vendor payments, and financial transactions for Ethiopian ERP

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank_transfer' | 'cash' | 'check' | 'mobile_money' | 'card';
  accountNumber?: string;
  bankName?: string;
  isActive: boolean;
  ethiopianMethod?: boolean; // CBE, Dashen Bank, M-Birr, etc.
}

export interface Vendor {
  id: string;
  name: string;
  taxNumber: string;
  bankAccount: string;
  bankName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string; // Ethiopian regions
  isLocal: boolean;
}

export interface PaymentItem {
  id: string;
  description: string;
  amount: number;
  currency: 'ETB' | 'USD';
  taxAmount?: number;
  vatRate?: number; // Ethiopian VAT rate (15%)
  withholding?: number; // Ethiopian withholding tax
}

export interface Payment {
  id: string;
  paymentNumber: string;
  vendorId: string;
  vendor: Vendor;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
  items: PaymentItem[];
  totalAmount: number;
  currency: 'ETB' | 'USD';
  exchangeRate?: number; // ETB to USD rate
  status: 'draft' | 'pending_approval' | 'approved' | 'processing' | 'paid' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  requestedBy: string;
  approvedBy?: string;
  paidBy?: string;
  requestDate: Date;
  dueDate: Date;
  approvalDate?: Date;
  paymentDate?: Date;
  reference: string;
  invoiceNumber?: string;
  poNumber?: string; // Purchase Order reference
  requisitionNumber?: string; // Requisition reference
  notes?: string;
  attachments?: string[];
  taxInvoice?: boolean; // Ethiopian tax invoice requirement
  vatCertificate?: boolean; // VAT registration certificate
  withholdingCertificate?: boolean; // Withholding tax certificate
  department: string;
  category: 'supplier_payment' | 'expense_reimbursement' | 'salary' | 'tax_payment' | 'utility' | 'service' | 'other';
  isRecurring?: boolean;
  recurringPeriod?: 'monthly' | 'quarterly' | 'annual';
}

export interface PaymentDashboardStats {
  totalPayments: number;
  pendingApproval: number;
  approved: number;
  processing: number;
  paid: number;
  failed: number;
  totalAmountETB: number;
  totalAmountUSD: number;
  monthlyProcessed: number;
  averageProcessingTime: number; // in days
  pendingValue: number;
  overduePayments: number;
}

export interface PaymentFilters {
  status?: string[];
  priority?: string[];
  currency?: string[];
  category?: string[];
  department?: string[];
  vendor?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  amountFrom?: number;
  amountTo?: number;
  paymentMethod?: string[];
}

class PaymentService {
  // Ethiopian Payment Methods
  private ethiopianPaymentMethods: PaymentMethod[] = [
    {
      id: 'cbe-001',
      name: 'Commercial Bank of Ethiopia - Main Account',
      type: 'bank_transfer',
      accountNumber: '1000012345678',
      bankName: 'Commercial Bank of Ethiopia',
      isActive: true,
      ethiopianMethod: true,
    },
    {
      id: 'dashen-001',
      name: 'Dashen Bank - Operations Account',
      type: 'bank_transfer',
      accountNumber: '2000567890123',
      bankName: 'Dashen Bank S.C.',
      isActive: true,
      ethiopianMethod: true,
    },
    {
      id: 'awash-001',
      name: 'Awash Bank - Foreign Currency Account',
      type: 'bank_transfer',
      accountNumber: '3000678901234',
      bankName: 'Awash International Bank',
      isActive: true,
      ethiopianMethod: true,
    },
    {
      id: 'mbirr-001',
      name: 'M-Birr Mobile Money',
      type: 'mobile_money',
      accountNumber: '+251911234567',
      bankName: 'M-Birr Service',
      isActive: true,
      ethiopianMethod: true,
    },
    {
      id: 'cash-001',
      name: 'Cash Payment',
      type: 'cash',
      isActive: true,
      ethiopianMethod: true,
    },
    {
      id: 'check-001',
      name: 'Company Check',
      type: 'check',
      isActive: true,
      ethiopianMethod: true,
    },
  ];

  // Ethiopian Vendors (Suppliers)
  private ethiopianVendors: Vendor[] = [
    {
      id: 'vendor-001',
      name: 'Tech Solutions Ethiopia Ltd',
      taxNumber: 'TIN-0012345678',
      bankAccount: '1000123456789',
      bankName: 'Commercial Bank of Ethiopia',
      contactPerson: 'Ato Dawit Mengistu',
      phone: '+251911234567',
      email: 'dawit@techsolutions.et',
      address: 'Bole Sub-City, Woreda 03',
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      isLocal: true,
    },
    {
      id: 'vendor-002',
      name: 'Addis Furniture Manufacturing',
      taxNumber: 'TIN-0023456789',
      bankAccount: '2000234567890',
      bankName: 'Dashen Bank S.C.',
      contactPerson: 'W/ro Tigist Assefa',
      phone: '+251922345678',
      email: 'tigist@addisfurniture.et',
      address: 'Akaki Kality Sub-City',
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      isLocal: true,
    },
    {
      id: 'vendor-003',
      name: 'Industrial Equipment Ethiopia',
      taxNumber: 'TIN-0034567890',
      bankAccount: '3000345678901',
      bankName: 'Awash International Bank',
      contactPerson: 'Ato Berhane Wolde',
      phone: '+251933456789',
      email: 'berhane@industrial-et.com',
      address: 'Yeka Sub-City, Woreda 08',
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      isLocal: true,
    },
    {
      id: 'vendor-004',
      name: 'Ethiopia Telecommunications Corporation',
      taxNumber: 'TIN-0045678901',
      bankAccount: '1000456789012',
      bankName: 'Commercial Bank of Ethiopia',
      contactPerson: 'Ato Yonas Bekele',
      phone: '+251944567890',
      email: 'yonas@ethiotelecom.et',
      address: 'Churchill Avenue',
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      isLocal: true,
    },
    {
      id: 'vendor-005',
      name: 'Ethiopian Electric Power Corporation',
      taxNumber: 'TIN-0056789012',
      bankAccount: '2000567890123',
      bankName: 'Dashen Bank S.C.',
      contactPerson: 'W/ro Hana Tadesse',
      phone: '+251955678901',
      email: 'hana@eep.gov.et',
      address: 'De Gaulle Square',
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      isLocal: true,
    },
    {
      id: 'vendor-006',
      name: 'Dire Dawa Marketing Services',
      taxNumber: 'TIN-0067890123',
      bankAccount: '3000678901234',
      bankName: 'Awash International Bank',
      contactPerson: 'Ato Ahmed Hussein',
      phone: '+251966789012',
      email: 'ahmed@ddmarketing.et',
      address: 'Kezira Area',
      city: 'Dire Dawa',
      region: 'Dire Dawa',
      isLocal: true,
    },
  ];

  // Mock Ethiopian Payment Data
  private mockPayments: Payment[] = [
    {
      id: 'pay-001',
      paymentNumber: 'PAY-2025-001',
      vendorId: 'vendor-001',
      vendor: this.ethiopianVendors[0],
      paymentMethodId: 'cbe-001',
      paymentMethod: this.ethiopianPaymentMethods[0],
      items: [
        {
          id: 'item-001',
          description: 'Desktop Computers - Dell OptiPlex',
          amount: 180000,
          currency: 'ETB',
          taxAmount: 23483.33,
          vatRate: 15,
          withholding: 3600,
        },
        {
          id: 'item-002',
          description: 'Microsoft Office Licenses',
          amount: 75000,
          currency: 'ETB',
          taxAmount: 9782.61,
          vatRate: 15,
          withholding: 1500,
        },
      ],
      totalAmount: 255000,
      currency: 'ETB',
      status: 'pending_approval',
      priority: 'high',
      description: 'IT Equipment Purchase - Q1 2025',
      requestedBy: 'Dawit Mengistu - IT Manager',
      requestDate: new Date('2025-08-15'),
      dueDate: new Date('2025-08-25'),
      reference: 'PO-2025-045',
      invoiceNumber: 'INV-TSE-2025-089',
      poNumber: 'PO-2025-045',
      requisitionNumber: 'REQ-2025-067',
      notes: 'Urgent IT equipment for new employees',
      taxInvoice: true,
      vatCertificate: true,
      withholdingCertificate: true,
      department: 'Information Technology',
      category: 'supplier_payment',
    },
    {
      id: 'pay-002',
      paymentNumber: 'PAY-2025-002',
      vendorId: 'vendor-002',
      vendor: this.ethiopianVendors[1],
      paymentMethodId: 'dashen-001',
      paymentMethod: this.ethiopianPaymentMethods[1],
      items: [
        {
          id: 'item-003',
          description: 'Office Desks and Chairs',
          amount: 125000,
          currency: 'ETB',
          taxAmount: 16304.35,
          vatRate: 15,
          withholding: 2500,
        },
      ],
      totalAmount: 125000,
      currency: 'ETB',
      status: 'approved',
      priority: 'medium',
      description: 'Office Furniture for HR Department',
      requestedBy: 'Tigist Assefa - HR Manager',
      approvedBy: 'Dr. Abebe Worku - General Manager',
      requestDate: new Date('2025-08-10'),
      dueDate: new Date('2025-08-20'),
      approvalDate: new Date('2025-08-18'),
      reference: 'PO-2025-041',
      invoiceNumber: 'INV-AFM-2025-134',
      poNumber: 'PO-2025-041',
      requisitionNumber: 'REQ-2025-052',
      notes: 'Furniture for new office expansion',
      taxInvoice: true,
      vatCertificate: true,
      withholdingCertificate: true,
      department: 'Human Resources',
      category: 'supplier_payment',
    },
    {
      id: 'pay-003',
      paymentNumber: 'PAY-2025-003',
      vendorId: 'vendor-004',
      vendor: this.ethiopianVendors[3],
      paymentMethodId: 'cbe-001',
      paymentMethod: this.ethiopianPaymentMethods[0],
      items: [
        {
          id: 'item-004',
          description: 'Internet and Phone Services - Monthly',
          amount: 35000,
          currency: 'ETB',
          taxAmount: 4565.22,
          vatRate: 15,
        },
      ],
      totalAmount: 35000,
      currency: 'ETB',
      status: 'paid',
      priority: 'medium',
      description: 'Monthly Telecommunications Bill',
      requestedBy: 'Yonas Bekele - Operations Manager',
      approvedBy: 'Tigist Assefa - Finance Manager',
      paidBy: 'Hanan Ahmed - Accounts Payable',
      requestDate: new Date('2025-08-01'),
      dueDate: new Date('2025-08-15'),
      approvalDate: new Date('2025-08-12'),
      paymentDate: new Date('2025-08-14'),
      reference: 'UTIL-2025-08',
      invoiceNumber: 'INV-ETC-2025-789',
      notes: 'Regular monthly utility payment',
      taxInvoice: true,
      vatCertificate: true,
      department: 'Operations',
      category: 'utility',
      isRecurring: true,
      recurringPeriod: 'monthly',
    },
    {
      id: 'pay-004',
      paymentNumber: 'PAY-2025-004',
      vendorId: 'vendor-005',
      vendor: this.ethiopianVendors[4],
      paymentMethodId: 'dashen-001',
      paymentMethod: this.ethiopianPaymentMethods[1],
      items: [
        {
          id: 'item-005',
          description: 'Electricity Bill - August 2025',
          amount: 28500,
          currency: 'ETB',
          taxAmount: 3717.39,
          vatRate: 15,
        },
      ],
      totalAmount: 28500,
      currency: 'ETB',
      status: 'processing',
      priority: 'high',
      description: 'Monthly Electricity Bill',
      requestedBy: 'Yonas Bekele - Operations Manager',
      approvedBy: 'Tigist Assefa - Finance Manager',
      requestDate: new Date('2025-08-05'),
      dueDate: new Date('2025-08-22'),
      approvalDate: new Date('2025-08-19'),
      reference: 'UTIL-2025-09',
      invoiceNumber: 'INV-EEP-2025-456',
      notes: 'Monthly electricity payment',
      taxInvoice: true,
      vatCertificate: true,
      department: 'Operations',
      category: 'utility',
      isRecurring: true,
      recurringPeriod: 'monthly',
    },
    {
      id: 'pay-005',
      paymentNumber: 'PAY-2025-005',
      vendorId: 'vendor-006',
      vendor: this.ethiopianVendors[5],
      paymentMethodId: 'awash-001',
      paymentMethod: this.ethiopianPaymentMethods[2],
      items: [
        {
          id: 'item-006',
          description: 'Marketing Campaign Materials',
          amount: 85000,
          currency: 'ETB',
          taxAmount: 11087.00,
          vatRate: 15,
          withholding: 1700,
        },
      ],
      totalAmount: 85000,
      currency: 'ETB',
      status: 'draft',
      priority: 'medium',
      description: 'Q3 Marketing Campaign Materials',
      requestedBy: 'Meron Tadesse - Marketing Manager',
      requestDate: new Date('2025-08-20'),
      dueDate: new Date('2025-08-30'),
      reference: 'MKT-2025-023',
      invoiceNumber: 'INV-DMS-2025-112',
      requisitionNumber: 'REQ-2025-078',
      notes: 'Marketing materials for Q3 campaign',
      taxInvoice: true,
      vatCertificate: true,
      withholdingCertificate: true,
      department: 'Marketing',
      category: 'service',
    },
  ];

  // API Methods
  async getDashboardStats(): Promise<PaymentDashboardStats> {
    try {
      // In real implementation, this would call the backend API
      // For now, calculate from mock data
      const payments = this.mockPayments;
      const totalPayments = payments.length;
      const pendingApproval = payments.filter(p => p.status === 'pending_approval').length;
      const approved = payments.filter(p => p.status === 'approved').length;
      const processing = payments.filter(p => p.status === 'processing').length;
      const paid = payments.filter(p => p.status === 'paid').length;
      const failed = payments.filter(p => p.status === 'failed').length;
      
      const totalAmountETB = payments
        .filter(p => p.currency === 'ETB')
        .reduce((sum, p) => sum + p.totalAmount, 0);
      
      const totalAmountUSD = payments
        .filter(p => p.currency === 'USD')
        .reduce((sum, p) => sum + p.totalAmount, 0);

      const monthlyProcessed = payments
        .filter(p => p.status === 'paid' && p.paymentDate && 
          p.paymentDate.getMonth() === new Date().getMonth())
        .length;

      const overduePayments = payments
        .filter(p => p.dueDate < new Date() && !['paid', 'cancelled'].includes(p.status))
        .length;

      const pendingValue = payments
        .filter(p => ['pending_approval', 'approved', 'processing'].includes(p.status))
        .reduce((sum, p) => sum + p.totalAmount, 0);

      return {
        totalPayments,
        pendingApproval,
        approved,
        processing,
        paid,
        failed,
        totalAmountETB,
        totalAmountUSD,
        monthlyProcessed,
        averageProcessingTime: 3.5, // Mock average
        pendingValue,
        overduePayments,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return mock data on error
      return {
        totalPayments: 156,
        pendingApproval: 12,
        approved: 8,
        processing: 5,
        paid: 125,
        failed: 6,
        totalAmountETB: 2850000,
        totalAmountUSD: 15000,
        monthlyProcessed: 45,
        averageProcessingTime: 3.2,
        pendingValue: 895000,
        overduePayments: 3,
      };
    }
  }

  async getPayments(filters?: PaymentFilters): Promise<Payment[]> {
    try {
      // In real implementation, this would call the backend API with filters
      let payments = [...this.mockPayments];

      if (filters) {
        if (filters.status?.length) {
          payments = payments.filter(p => filters.status!.includes(p.status));
        }
        if (filters.priority?.length) {
          payments = payments.filter(p => filters.priority!.includes(p.priority));
        }
        if (filters.currency?.length) {
          payments = payments.filter(p => filters.currency!.includes(p.currency));
        }
        if (filters.category?.length) {
          payments = payments.filter(p => filters.category!.includes(p.category));
        }
        if (filters.department?.length) {
          payments = payments.filter(p => filters.department!.includes(p.department));
        }
        if (filters.vendor?.length) {
          payments = payments.filter(p => filters.vendor!.includes(p.vendorId));
        }
        if (filters.dateFrom) {
          payments = payments.filter(p => p.requestDate >= filters.dateFrom!);
        }
        if (filters.dateTo) {
          payments = payments.filter(p => p.requestDate <= filters.dateTo!);
        }
        if (filters.amountFrom) {
          payments = payments.filter(p => p.totalAmount >= filters.amountFrom!);
        }
        if (filters.amountTo) {
          payments = payments.filter(p => p.totalAmount <= filters.amountTo!);
        }
      }

      return payments.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());
    } catch (error) {
      console.error('Error fetching payments:', error);
      return this.mockPayments;
    }
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    try {
      // In real implementation, this would call the backend API
      return this.mockPayments.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error fetching payment:', error);
      return null;
    }
  }

  async createPayment(payment: Partial<Payment>): Promise<Payment> {
    try {
      // In real implementation, this would call the backend API
      const newPayment: Payment = {
        id: `pay-${Date.now()}`,
        paymentNumber: `PAY-2025-${String(this.mockPayments.length + 1).padStart(3, '0')}`,
        vendorId: payment.vendorId!,
        vendor: this.ethiopianVendors.find(v => v.id === payment.vendorId)!,
        paymentMethodId: payment.paymentMethodId!,
        paymentMethod: this.ethiopianPaymentMethods.find(pm => pm.id === payment.paymentMethodId)!,
        items: payment.items || [],
        totalAmount: payment.totalAmount || 0,
        currency: payment.currency || 'ETB',
        status: 'draft',
        priority: payment.priority || 'medium',
        description: payment.description || '',
        requestedBy: payment.requestedBy || 'Current User',
        requestDate: new Date(),
        dueDate: payment.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        reference: payment.reference || '',
        department: payment.department || '',
        category: payment.category || 'supplier_payment',
        taxInvoice: payment.taxInvoice || false,
        vatCertificate: payment.vatCertificate || false,
        withholdingCertificate: payment.withholdingCertificate || false,
      };

      this.mockPayments.push(newPayment);
      return newPayment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    try {
      // In real implementation, this would call the backend API
      const paymentIndex = this.mockPayments.findIndex(p => p.id === id);
      if (paymentIndex === -1) {
        throw new Error('Payment not found');
      }

      this.mockPayments[paymentIndex] = {
        ...this.mockPayments[paymentIndex],
        ...updates,
      };

      return this.mockPayments[paymentIndex];
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  async approvePayment(id: string, approvedBy: string, comments?: string): Promise<Payment> {
    try {
      const payment = await this.getPaymentById(id);
      if (!payment) {
        throw new Error('Payment not found');
      }

      return await this.updatePayment(id, {
        status: 'approved',
        approvedBy,
        approvalDate: new Date(),
        notes: comments ? `${payment.notes}\n\nApproval: ${comments}` : payment.notes,
      });
    } catch (error) {
      console.error('Error approving payment:', error);
      throw error;
    }
  }

  async rejectPayment(id: string, rejectedBy: string, reason: string): Promise<Payment> {
    try {
      const payment = await this.getPaymentById(id);
      if (!payment) {
        throw new Error('Payment not found');
      }

      return await this.updatePayment(id, {
        status: 'draft',
        notes: `${payment.notes}\n\nRejected by ${rejectedBy}: ${reason}`,
      });
    } catch (error) {
      console.error('Error rejecting payment:', error);
      throw error;
    }
  }

  async processPayment(id: string, processedBy: string): Promise<Payment> {
    try {
      const payment = await this.getPaymentById(id);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'approved') {
        throw new Error('Payment must be approved before processing');
      }

      return await this.updatePayment(id, {
        status: 'processing',
        notes: `${payment.notes}\n\nProcessing started by ${processedBy}`,
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  async markPaymentPaid(id: string, paidBy: string, transactionRef?: string): Promise<Payment> {
    try {
      const payment = await this.getPaymentById(id);
      if (!payment) {
        throw new Error('Payment not found');
      }

      return await this.updatePayment(id, {
        status: 'paid',
        paidBy,
        paymentDate: new Date(),
        reference: transactionRef || payment.reference,
        notes: `${payment.notes}\n\nPayment completed by ${paidBy}` + 
               (transactionRef ? ` (Transaction: ${transactionRef})` : ''),
      });
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      throw error;
    }
  }

  async deletePayment(id: string): Promise<boolean> {
    try {
      // In real implementation, this would call the backend API
      const paymentIndex = this.mockPayments.findIndex(p => p.id === id);
      if (paymentIndex === -1) {
        return false;
      }

      this.mockPayments.splice(paymentIndex, 1);
      return true;
    } catch (error) {
      console.error('Error deleting payment:', error);
      return false;
    }
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      // In real implementation, this would call the backend API
      return this.ethiopianPaymentMethods.filter(pm => pm.isActive);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return this.ethiopianPaymentMethods;
    }
  }

  async getVendors(): Promise<Vendor[]> {
    try {
      // In real implementation, this would call the backend API
      return this.ethiopianVendors;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      return this.ethiopianVendors;
    }
  }

  async getExchangeRate(): Promise<number> {
    // In real implementation, this would call the Ethiopian National Bank API
    // Current approximate ETB to USD rate
    return 58.50;
  }
}

export const paymentService = new PaymentService();
