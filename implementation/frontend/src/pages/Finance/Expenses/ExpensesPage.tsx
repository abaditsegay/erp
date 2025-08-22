import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Tooltip,
  LinearProgress,
  Avatar,
  Stack,
  Fab,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Fade,
  Divider,
  Checkbox,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  LocalGasStation as FuelIcon,
  Restaurant as MealIcon,
  Flight as TravelIcon,
  Phone as PhoneIcon,
  ElectricalServices as ElectricIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Cancel as RejectedIcon,
  Upload as UploadIcon,
  MoreVert as MoreVertIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Archive as ArchiveIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  AttachFile as AttachIcon,
  History as HistoryIcon,
  Notifications as NotificationsIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

// Ethiopian Expense Management Structure
interface Expense {
  id: string;
  expenseNumber: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  amount: number;
  currency: 'ETB' | 'USD';
  exchangeRate?: number; // For USD expenses
  amountETB: number; // Converted amount in ETB
  expenseDate: string;
  submittedDate: string;
  submittedBy: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  approvalStatus: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Paid';
  approvedBy?: {
    id: string;
    name: string;
    date: string;
  };
  paymentDate?: string;
  receiptAttached: boolean;
  receiptUrl?: string;
  accountCode?: string;
  taxDeductible: boolean;
  vatApplicable?: boolean; // Whether VAT applies to this expense
  vatAmount?: number; // 15% VAT if applicable
  withholdingTax?: number; // 2% withholding if applicable
  notes?: string;
  tags?: string[];
}

// Ethiopian business expense categories
const EXPENSE_CATEGORIES = {
  'Office & Administrative': [
    'Office Rent',
    'Office Supplies',
    'Utilities (Electricity)',
    'Utilities (Water)',
    'Internet & Phone',
    'Cleaning Services',
    'Security Services'
  ],
  'Travel & Transportation': [
    'Local Transportation',
    'Fuel & Maintenance',
    'Business Travel',
    'Accommodation',
    'Meals & Entertainment',
    'Visa & Documentation'
  ],
  'Professional Services': [
    'Legal Services',
    'Accounting Services',
    'Consulting',
    'Training & Development',
    'Software Licenses',
    'Professional Memberships'
  ],
  'Marketing & Sales': [
    'Advertising',
    'Marketing Materials',
    'Trade Shows',
    'Client Entertainment',
    'Website Development',
    'Social Media Marketing'
  ],
  'Equipment & Technology': [
    'Computer Hardware',
    'Office Equipment',
    'Software',
    'Equipment Maintenance',
    'IT Services',
    'Telecommunications'
  ],
  'Employee Related': [
    'Employee Salaries',
    'Benefits & Insurance',
    'Training',
    'Team Building',
    'Recruitment',
    'Medical Expenses'
  ],
  'Compliance & Legal': [
    'Business License',
    'Tax Payments',
    'Government Fees',
    'Legal Documentation',
    'Audit Fees',
    'Insurance Premiums'
  ]
};

// Sample Ethiopian business expenses
const SAMPLE_EXPENSES: Expense[] = [
  {
    id: '1',
    expenseNumber: 'EXP-2024-001',
    title: 'Office Electricity Bill - August 2024',
    description: 'Monthly electricity bill for head office',
    category: 'Office & Administrative',
    subcategory: 'Utilities (Electricity)',
    amount: 8500,
    currency: 'ETB',
    amountETB: 8500,
    expenseDate: '2024-08-15T00:00:00Z',
    submittedDate: '2024-08-16T09:30:00Z',
    submittedBy: {
      id: 'emp001',
      name: 'Almaz Tadesse',
      email: 'almaz.tadesse@company.et',
      department: 'Administration'
    },
    approvalStatus: 'Approved',
    approvedBy: {
      id: 'mgr001',
      name: 'Dawit Bekele',
      date: '2024-08-16T14:15:00Z'
    },
    paymentDate: '2024-08-17T10:00:00Z',
    receiptAttached: true,
    receiptUrl: '/receipts/electricity-aug-2024.pdf',
    accountCode: '5103',
    taxDeductible: true,
    vatAmount: 1275, // 15% VAT
    notes: 'Ethiopian Electric Utility bill for main office',
    tags: ['utilities', 'monthly', 'recurring']
  },
  {
    id: '2',
    expenseNumber: 'EXP-2024-002',
    title: 'Business Travel - Dire Dawa Client Meeting',
    description: 'Round trip flight and accommodation for client presentation',
    category: 'Travel & Transportation',
    subcategory: 'Business Travel',
    amount: 12500,
    currency: 'ETB',
    amountETB: 12500,
    expenseDate: '2024-08-18T00:00:00Z',
    submittedDate: '2024-08-19T08:45:00Z',
    submittedBy: {
      id: 'emp002',
      name: 'Kebede Mengistu',
      email: 'kebede.mengistu@company.et',
      department: 'Sales'
    },
    approvalStatus: 'Submitted',
    receiptAttached: true,
    receiptUrl: '/receipts/travel-dire-dawa.pdf',
    accountCode: '5201',
    taxDeductible: true,
    notes: 'Ethiopian Airlines flight + Dire Dawa hotel for 2 days',
    tags: ['travel', 'client-meeting', 'sales']
  },
  {
    id: '3',
    expenseNumber: 'EXP-2024-003',
    title: 'Legal Services - Contract Review',
    description: 'Legal consultation for international contract review',
    category: 'Professional Services',
    subcategory: 'Legal Services',
    amount: 450,
    currency: 'USD',
    exchangeRate: 57.2,
    amountETB: 25740,
    expenseDate: '2024-08-20T00:00:00Z',
    submittedDate: '2024-08-20T16:20:00Z',
    submittedBy: {
      id: 'emp003',
      name: 'Hanan Ahmed',
      email: 'hanan.ahmed@company.et',
      department: 'Legal'
    },
    approvalStatus: 'Approved',
    approvedBy: {
      id: 'mgr002',
      name: 'Meron Teshome',
      date: '2024-08-21T09:30:00Z'
    },
    receiptAttached: true,
    accountCode: '5301',
    taxDeductible: true,
    withholdingTax: 514.8, // 2% withholding on professional services
    notes: 'International contract legal review by Ethiopian law firm',
    tags: ['legal', 'contract', 'professional-services']
  },
  {
    id: '4',
    expenseNumber: 'EXP-2024-004',
    title: 'Office Supplies - Stationery & Equipment',
    description: 'Monthly office supplies purchase',
    category: 'Office & Administrative',
    subcategory: 'Office Supplies',
    amount: 3200,
    currency: 'ETB',
    amountETB: 3200,
    expenseDate: '2024-08-19T00:00:00Z',
    submittedDate: '2024-08-19T11:15:00Z',
    submittedBy: {
      id: 'emp004',
      name: 'Tigist Wolde',
      email: 'tigist.wolde@company.et',
      department: 'Administration'
    },
    approvalStatus: 'Paid',
    approvedBy: {
      id: 'mgr001',
      name: 'Dawit Bekele',
      date: '2024-08-19T15:45:00Z'
    },
    paymentDate: '2024-08-20T14:30:00Z',
    receiptAttached: true,
    accountCode: '5102',
    taxDeductible: true,
    vatAmount: 480, // 15% VAT
    notes: 'Office supplies from local vendor in Addis Ababa',
    tags: ['office-supplies', 'monthly', 'stationery']
  },
  {
    id: '5',
    expenseNumber: 'EXP-2024-005',
    title: 'Team Lunch - Client Entertainment',
    description: 'Business lunch with international clients',
    category: 'Marketing & Sales',
    subcategory: 'Client Entertainment',
    amount: 2800,
    currency: 'ETB',
    amountETB: 2800,
    expenseDate: '2024-08-21T00:00:00Z',
    submittedDate: '2024-08-21T15:30:00Z',
    submittedBy: {
      id: 'emp005',
      name: 'Samuel Girma',
      email: 'samuel.girma@company.et',
      department: 'Sales'
    },
    approvalStatus: 'Draft',
    receiptAttached: false,
    accountCode: '5401',
    taxDeductible: false, // Entertainment expenses limited deductibility
    notes: 'Business lunch at Sheraton Addis for client presentation',
    tags: ['entertainment', 'client', 'sales']
  },
  {
    id: '6',
    expenseNumber: 'EXP-2024-006',
    title: 'Software License - Microsoft Office 365',
    description: 'Annual Microsoft Office 365 subscription for 25 users',
    category: 'Equipment & Technology',
    subcategory: 'Software',
    amount: 320,
    currency: 'USD',
    exchangeRate: 57.2,
    amountETB: 18304,
    expenseDate: '2024-08-22T00:00:00Z',
    submittedDate: '2024-08-22T10:00:00Z',
    submittedBy: {
      id: 'emp006',
      name: 'Yohannes Tefera',
      email: 'yohannes.tefera@company.et',
      department: 'IT'
    },
    approvalStatus: 'Rejected',
    receiptAttached: true,
    accountCode: '5501',
    taxDeductible: true,
    notes: 'Annual software license renewal - requires budget approval',
    tags: ['software', 'license', 'annual', 'microsoft']
  }
];

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(SAMPLE_EXPENSES);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(SAMPLE_EXPENSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [loading, setLoading] = useState(false);

  // Action menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Calculate summary statistics
  const summary = React.useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonth = expenses.filter(exp => {
      const expDate = new Date(exp.expenseDate);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });

    const pending = expenses.filter(exp => exp.approvalStatus === 'Submitted');
    const approved = expenses.filter(exp => exp.approvalStatus === 'Approved');
    const paid = expenses.filter(exp => exp.approvalStatus === 'Paid');

    return {
      totalThisMonth: thisMonth.reduce((sum, exp) => sum + exp.amountETB, 0),
      pendingAmount: pending.reduce((sum, exp) => sum + exp.amountETB, 0),
      approvedAmount: approved.reduce((sum, exp) => sum + exp.amountETB, 0),
      paidAmount: paid.reduce((sum, exp) => sum + exp.amountETB, 0),
      pendingCount: pending.length,
      totalExpenses: expenses.length,
      avgExpenseAmount: expenses.length > 0 ? expenses.reduce((sum, exp) => sum + exp.amountETB, 0) / expenses.length : 0
    };
  }, [expenses]);

  // Filter expenses based on search and filters
  useEffect(() => {
    let filtered = expenses;

    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.expenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter(expense => expense.approvalStatus === filterStatus);
    }

    if (filterCategory !== 'All') {
      filtered = filtered.filter(expense => expense.category === filterCategory);
    }

    setFilteredExpenses(filtered);
  }, [expenses, searchTerm, filterStatus, filterCategory]);

  const formatCurrency = (amount: number, currency: 'ETB' | 'USD' = 'ETB') => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'default';
      case 'Submitted': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Paid': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <ApprovedIcon />;
      case 'Submitted': return <PendingIcon />;
      case 'Rejected': return <RejectedIcon />;
      case 'Paid': return <MoneyIcon />;
      default: return <PendingIcon />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Travel & Transportation': return <TravelIcon />;
      case 'Office & Administrative': return <BusinessIcon />;
      case 'Marketing & Sales': return <TrendingUpIcon />;
      case 'Equipment & Technology': return <ElectricIcon />;
      case 'Professional Services': return <PersonIcon />;
      case 'Employee Related': return <PersonIcon />;
      default: return <ReceiptIcon />;
    }
  };

  const handleCreateExpense = () => {
  const handleCreateExpense = () => {
    setIsCreateDialogOpen(true);
  };
    console.log('Create new expense');
  };

  const handleEditExpense = (expense: Expense) => {
    // TODO: Open edit expense dialog
    console.log('Edit expense:', expense);
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
    }
  };

  const handleApproveExpense = (expenseId: string) => {
    setExpenses(prev => 
      prev.map(exp => 
        exp.id === expenseId 
          ? { 
              ...exp, 
              approvalStatus: 'Approved' as const,
              approvedBy: {
                id: 'current-user',
                name: 'Current Manager',
                date: new Date().toISOString()
              }
            }
          : exp
      )
    );
  };

  const handleRejectExpense = (expenseId: string) => {
    setExpenses(prev => 
      prev.map(exp => 
        exp.id === expenseId 
          ? { ...exp, approvalStatus: 'Rejected' as const }
          : exp
      )
    );
  };

  // Enhanced action menu handlers
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, expense: Expense) => {
    setAnchorEl(event.currentTarget);
    setSelectedExpense(expense);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't clear selectedExpense here - let dialogs handle it
  };

  const handleAction = (action: string) => {
    if (!selectedExpense) return;
    
    switch (action) {
      case 'view':
        setIsViewDialogOpen(true);
        break;
        
      case 'edit':
        setIsEditDialogOpen(true);
        break;
        
      case 'delete':
        setIsDeleteDialogOpen(true);
        break;
        
      case 'approve':
        handleApproveExpense(selectedExpense.id);
        setSuccessMessage(`Expense ${selectedExpense.expenseNumber} has been approved successfully!`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        break;
        
      case 'reject':
        handleRejectExpense(selectedExpense.id);
        setSuccessMessage(`Expense ${selectedExpense.expenseNumber} has been rejected.`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        break;
        
      case 'print':
        setIsPrintDialogOpen(true);
        break;
        
      case 'email':
        setIsEmailDialogOpen(true);
        break;
        
      case 'duplicate':
        handleDuplicateExpense();
        break;
        
      case 'download_receipt':
        handleDownloadReceipt();
        break;

      case 'expense_history':
        handleExpenseHistory();
        break;

      case 'payment_details':
        handlePaymentDetails();
        break;

      case 'export':
        handleExportExpense();
        break;

      case 'archive':
        handleArchiveExpense();
        break;

      case 'resubmit':
        handleResubmitExpense();
        break;
        
      case 'audit_trail':
        handleAuditTrail();
        break;
        
      case 'notifications':
        handleSetNotifications();
        break;
        
      case 'flag_review':
        handleFlagForReview();
        break;
    }
    
    setAnchorEl(null);
  };

  const handleDuplicateExpense = () => {
    if (!selectedExpense) return;
    
    const duplicateExpense: Expense = {
      ...selectedExpense,
      id: Date.now().toString(),
      expenseNumber: `EXP-2024-${String(expenses.length + 1).padStart(3, '0')}`,
      approvalStatus: 'Draft',
      submittedDate: new Date().toISOString(),
      approvedBy: undefined,
      paymentDate: undefined,
      title: `Copy of ${selectedExpense.title}`,
    };
    setExpenses(prev => [...prev, duplicateExpense]);
    setSuccessMessage(`Expense duplicated as ${duplicateExpense.expenseNumber}!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDownloadReceipt = () => {
    if (!selectedExpense) return;
    
    if (selectedExpense.receiptAttached && selectedExpense.receiptUrl) {
      // Simulate receipt download
      const link = document.createElement('a');
      link.href = selectedExpense.receiptUrl;
      link.download = `Receipt_${selectedExpense.expenseNumber}.pdf`;
      link.click();
      
      setSuccessMessage('Receipt downloaded successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setSuccessMessage('No receipt attached to this expense.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleExpenseHistory = () => {
    if (!selectedExpense) return;
    
    // Generate expense history window
    const historyWindow = window.open('', '_blank', 'width=800,height=600');
    if (historyWindow) {
      const historyContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Expense History - ${selectedExpense.expenseNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background: #1976d2; color: white; padding: 20px; border-radius: 5px; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .timeline { border-left: 3px solid #1976d2; padding-left: 20px; }
            .timeline-item { margin: 15px 0; }
            .date { font-weight: bold; color: #1976d2; }
            .amount { font-size: 18px; font-weight: bold; color: #2e7d32; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Expense History Report</h1>
            <p>Expense Number: ${selectedExpense.expenseNumber}</p>
            <p>Generated on: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}</p>
          </div>
          
          <div class="section">
            <h2>Expense Details</h2>
            <table>
              <tr><th>Title</th><td>${selectedExpense.title}</td></tr>
              <tr><th>Category</th><td>${selectedExpense.category}</td></tr>
              <tr><th>Amount</th><td class="amount">${formatCurrency(selectedExpense.amount, selectedExpense.currency)}</td></tr>
              <tr><th>Expense Date</th><td>${format(new Date(selectedExpense.expenseDate), 'MMMM dd, yyyy')}</td></tr>
              <tr><th>Submitted By</th><td>${selectedExpense.submittedBy.name}</td></tr>
              <tr><th>Department</th><td>${selectedExpense.submittedBy.department}</td></tr>
              <tr><th>Current Status</th><td>${selectedExpense.approvalStatus}</td></tr>
            </table>
          </div>

          <div class="section">
            <h2>Approval Timeline</h2>
            <div class="timeline">
              <div class="timeline-item">
                <div class="date">${format(new Date(selectedExpense.submittedDate), 'MMM dd, yyyy HH:mm')}</div>
                <div>Expense submitted by ${selectedExpense.submittedBy.name}</div>
              </div>
              ${selectedExpense.approvedBy ? `
                <div class="timeline-item">
                  <div class="date">${format(new Date(selectedExpense.approvedBy.date), 'MMM dd, yyyy HH:mm')}</div>
                  <div>Expense approved by ${selectedExpense.approvedBy.name}</div>
                </div>
              ` : ''}
              ${selectedExpense.paymentDate ? `
                <div class="timeline-item">
                  <div class="date">${format(new Date(selectedExpense.paymentDate), 'MMM dd, yyyy HH:mm')}</div>
                  <div>Payment processed</div>
                </div>
              ` : ''}
            </div>
          </div>

          ${selectedExpense.description ? `
            <div class="section">
              <h2>Description</h2>
              <p>${selectedExpense.description}</p>
            </div>
          ` : ''}

          <div class="section">
            <h2>Financial Information</h2>
            <table>
              <tr><th>Original Amount</th><td>${formatCurrency(selectedExpense.amount, selectedExpense.currency)}</td></tr>
              <tr><th>Amount in ETB</th><td>${formatCurrency(selectedExpense.amountETB, 'ETB')}</td></tr>
              ${selectedExpense.exchangeRate ? `<tr><th>Exchange Rate</th><td>${selectedExpense.exchangeRate}</td></tr>` : ''}
              <tr><th>VAT Applicable</th><td>${selectedExpense.vatApplicable ? 'Yes' : 'No'}</td></tr>
              ${selectedExpense.vatAmount ? `<tr><th>VAT Amount</th><td>${formatCurrency(selectedExpense.vatAmount, 'ETB')}</td></tr>` : ''}
              ${selectedExpense.withholdingTax ? `<tr><th>Withholding Tax</th><td>${formatCurrency(selectedExpense.withholdingTax, 'ETB')}</td></tr>` : ''}
              ${selectedExpense.accountCode ? `<tr><th>Account Code</th><td>${selectedExpense.accountCode}</td></tr>` : ''}
            </table>
          </div>

          <div class="section">
            <h2>Attachments</h2>
            <p>Receipt Attached: ${selectedExpense.receiptAttached ? 'Yes' : 'No'}</p>
            ${selectedExpense.receiptUrl ? `<p>Receipt URL: <a href="${selectedExpense.receiptUrl}" target="_blank">${selectedExpense.receiptUrl}</a></p>` : ''}
          </div>
        </body>
        </html>
      `;
      
      historyWindow.document.write(historyContent);
      historyWindow.document.close();
      
      setSuccessMessage('Expense history report generated successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handlePaymentDetails = () => {
    if (!selectedExpense) return;
    
    // Generate payment details window
    const paymentWindow = window.open('', '_blank', 'width=700,height=500');
    if (paymentWindow) {
      const paymentContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Payment Details - ${selectedExpense.expenseNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background: #2e7d32; color: white; padding: 20px; border-radius: 5px; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .amount { font-size: 24px; font-weight: bold; color: #2e7d32; }
            .status { padding: 5px 10px; border-radius: 15px; color: white; display: inline-block; }
            .paid { background: #2e7d32; }
            .approved { background: #1976d2; }
            .pending { background: #f57c00; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Payment Details</h1>
            <p>Expense Number: ${selectedExpense.expenseNumber}</p>
          </div>
          
          <div class="section">
            <h2>Payment Information</h2>
            <p class="amount">${formatCurrency(selectedExpense.amountETB, 'ETB')}</p>
            <p>Status: <span class="status ${selectedExpense.approvalStatus.toLowerCase()}">${selectedExpense.approvalStatus}</span></p>
            
            <table>
              <tr><th>Expense Amount</th><td>${formatCurrency(selectedExpense.amount, selectedExpense.currency)}</td></tr>
              <tr><th>Amount in ETB</th><td>${formatCurrency(selectedExpense.amountETB, 'ETB')}</td></tr>
              ${selectedExpense.vatAmount ? `<tr><th>VAT Amount</th><td>${formatCurrency(selectedExpense.vatAmount, 'ETB')}</td></tr>` : ''}
              ${selectedExpense.withholdingTax ? `<tr><th>Withholding Tax</th><td>-${formatCurrency(selectedExpense.withholdingTax, 'ETB')}</td></tr>` : ''}
              <tr><th>Net Payment</th><td><strong>${formatCurrency(selectedExpense.amountETB - (selectedExpense.withholdingTax || 0), 'ETB')}</strong></td></tr>
            </table>
          </div>

          <div class="section">
            <h2>Payee Information</h2>
            <table>
              <tr><th>Name</th><td>${selectedExpense.submittedBy.name}</td></tr>
              <tr><th>Email</th><td>${selectedExpense.submittedBy.email}</td></tr>
              <tr><th>Department</th><td>${selectedExpense.submittedBy.department}</td></tr>
            </table>
          </div>

          ${selectedExpense.paymentDate ? `
            <div class="section">
              <h2>Payment Details</h2>
              <table>
                <tr><th>Payment Date</th><td>${format(new Date(selectedExpense.paymentDate), 'MMMM dd, yyyy')}</td></tr>
                <tr><th>Payment Method</th><td>Bank Transfer</td></tr>
                <tr><th>Reference Number</th><td>PAY-${selectedExpense.expenseNumber}</td></tr>
              </table>
            </div>
          ` : `
            <div class="section">
              <h2>Payment Status</h2>
              <p>Payment is pending approval and processing.</p>
              ${selectedExpense.approvalStatus === 'Approved' ? '<p>Payment will be processed within 3-5 business days.</p>' : ''}
            </div>
          `}
        </body>
        </html>
      `;
      
      paymentWindow.document.write(paymentContent);
      paymentWindow.document.close();
    }
  };

  const handleExportExpense = () => {
    if (!selectedExpense) return;
    
    const csvContent = [
      ['Field', 'Value'],
      ['Expense Number', selectedExpense.expenseNumber],
      ['Title', selectedExpense.title],
      ['Category', selectedExpense.category],
      ['Amount', `${selectedExpense.amount} ${selectedExpense.currency}`],
      ['Amount in ETB', `${selectedExpense.amountETB} ETB`],
      ['Expense Date', format(new Date(selectedExpense.expenseDate), 'yyyy-MM-dd')],
      ['Submitted Date', format(new Date(selectedExpense.submittedDate), 'yyyy-MM-dd')],
      ['Submitted By', selectedExpense.submittedBy.name],
      ['Department', selectedExpense.submittedBy.department],
      ['Status', selectedExpense.approvalStatus],
      ['VAT Applicable', selectedExpense.vatApplicable ? 'Yes' : 'No'],
      ['Receipt Attached', selectedExpense.receiptAttached ? 'Yes' : 'No'],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense_${selectedExpense.expenseNumber}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    setSuccessMessage('Expense data exported successfully!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleArchiveExpense = () => {
    if (!selectedExpense) return;
    
    setExpenses(prev => prev.map(expense =>
      expense.id === selectedExpense.id
        ? { ...expense, archived: true }
        : expense
    ));
    
    setSuccessMessage(`Expense ${selectedExpense.expenseNumber} has been archived.`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleResubmitExpense = () => {
    if (!selectedExpense) return;
    
    setExpenses(prev => prev.map(expense =>
      expense.id === selectedExpense.id
        ? { 
            ...expense, 
            approvalStatus: 'Submitted',
            submittedDate: new Date().toISOString(),
            approvedBy: undefined
          }
        : expense
    ));
    
    setSuccessMessage(`Expense ${selectedExpense.expenseNumber} has been resubmitted for approval.`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteConfirm = () => {
    if (!selectedExpense) return;
    
    setExpenses(prev => prev.filter(exp => exp.id !== selectedExpense.id));
    setSuccessMessage(`Expense ${selectedExpense.expenseNumber} has been deleted successfully!`);
    setIsDeleteDialogOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handlePrint = () => {
    if (!selectedExpense) return;
    
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Expense Report - ${selectedExpense.expenseNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              .expense-info { margin-bottom: 20px; }
              .expense-info th, .expense-info td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .expense-info th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Ethiopian ERP System</h2>
              <h3>Expense Report</h3>
              <p>Expense Number: ${selectedExpense.expenseNumber}</p>
            </div>
            <table class="expense-info" style="width: 100%;">
              <tr><th>Expense Number</th><td>${selectedExpense.expenseNumber}</td></tr>
              <tr><th>Title</th><td>${selectedExpense.title}</td></tr>
              <tr><th>Category</th><td>${selectedExpense.category}</td></tr>
              <tr><th>Amount</th><td>${formatCurrency(selectedExpense.amount, selectedExpense.currency)}</td></tr>
              <tr><th>Amount (ETB)</th><td>${formatCurrency(selectedExpense.amountETB)}</td></tr>
              <tr><th>Expense Date</th><td>${format(new Date(selectedExpense.expenseDate), 'MMM dd, yyyy')}</td></tr>
              <tr><th>Submitted By</th><td>${selectedExpense.submittedBy.name}</td></tr>
              <tr><th>Department</th><td>${selectedExpense.submittedBy.department}</td></tr>
              <tr><th>Status</th><td>${selectedExpense.approvalStatus}</td></tr>
              <tr><th>Receipt Attached</th><td>${selectedExpense.receiptAttached ? 'Yes' : 'No'}</td></tr>
              <tr><th>Tax Deductible</th><td>${selectedExpense.taxDeductible ? 'Yes' : 'No'}</td></tr>
              ${selectedExpense.vatAmount ? `<tr><th>VAT Amount (15%)</th><td>${formatCurrency(selectedExpense.vatAmount)}</td></tr>` : ''}
              ${selectedExpense.withholdingTax ? `<tr><th>Withholding Tax (2%)</th><td>${formatCurrency(selectedExpense.withholdingTax)}</td></tr>` : ''}
              ${selectedExpense.notes ? `<tr><th>Notes</th><td>${selectedExpense.notes}</td></tr>` : ''}
            </table>
            <p style="margin-top: 30px; text-align: center; color: #666;">
              Generated on ${format(new Date(), 'MMM dd, yyyy HH:mm')}
            </p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    
    setIsPrintDialogOpen(false);
  };

  const handleAuditTrail = () => {
    if (!selectedExpense) return;
    
    // Create audit trail report
    const auditWindow = window.open('', '_blank');
    if (auditWindow) {
      auditWindow.document.write(`
        <html>
          <head>
            <title>Expense Audit Trail - ${selectedExpense.expenseNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Ethiopian ERP System</h2>
              <h3>Expense Audit Trail</h3>
              <p>Expense: ${selectedExpense.expenseNumber} - ${selectedExpense.title}</p>
              <p>Generated on: ${format(new Date(), 'MMM dd, yyyy HH:mm')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${format(new Date(selectedExpense.submittedDate), 'MMM dd, yyyy HH:mm')}</td>
                  <td>${selectedExpense.submittedBy}</td>
                  <td>Expense Submitted</td>
                  <td>Initial expense submission</td>
                  <td>Submitted</td>
                </tr>
                ${selectedExpense.approvedBy ? `
                <tr>
                  <td>${format(new Date(), 'MMM dd, yyyy HH:mm')}</td>
                  <td>${selectedExpense.approvedBy}</td>
                  <td>Expense ${selectedExpense.approvalStatus}</td>
                  <td>Approval decision made</td>
                  <td>${selectedExpense.approvalStatus}</td>
                </tr>
                ` : ''}
              </tbody>
            </table>
          </body>
        </html>
      `);
      auditWindow.document.close();
      auditWindow.print();
    }
    
    setSuccessMessage(`Audit trail generated for expense ${selectedExpense.expenseNumber}!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSetNotifications = () => {
    if (!selectedExpense) return;
    
    // Open notification settings dialog
    const confirm = window.confirm(`Set up notifications for expense ${selectedExpense.expenseNumber}?\n\nYou will receive alerts for:\n- Approval status changes\n- Payment confirmations\n- Document submission reminders\n- Reimbursement updates`);
    
    if (confirm) {
      setSuccessMessage(`Notifications configured for expense ${selectedExpense.expenseNumber}!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleFlagForReview = () => {
    if (!selectedExpense) return;
    
    // Flag expense for special review
    const reason = window.prompt(`Flag expense ${selectedExpense.expenseNumber} for review?\n\nPlease provide reason for flagging:`);
    
    if (reason) {
      setExpenses(prev => prev.map(expense =>
        expense.id === selectedExpense.id
          ? { 
              ...expense, 
              notes: expense.notes + `\n[FLAGGED FOR REVIEW: ${reason}]`
            }
          : expense
      ));
      
      setSuccessMessage(`Expense ${selectedExpense.expenseNumber} flagged for review!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <Box>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Expense Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            የወጪ አስተዳደር - Track and manage business expenses for your Ethiopian company
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateExpense}
          size="large"
        >
          Submit Expense
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MoneyIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" component="div">
                This Month
              </Typography>
              <Typography variant="h5" color="primary.main">
                {formatCurrency(summary.totalThisMonth)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total expenses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PendingIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" component="div">
                Pending Approval
              </Typography>
              <Typography variant="h5" color="warning.main">
                {formatCurrency(summary.pendingAmount)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {summary.pendingCount} expenses waiting
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ApprovedIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" component="div">
                Approved
              </Typography>
              <Typography variant="h5" color="success.main">
                {formatCurrency(summary.approvedAmount)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ready for payment
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ReceiptIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" component="div">
                Average Expense
              </Typography>
              <Typography variant="h5" color="info.main">
                {formatCurrency(summary.avgExpenseAmount)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {summary.totalExpenses} total expenses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search expenses by title, number, or submitter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Submitted">Submitted</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                label="Category"
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="All">All Categories</MenuItem>
                {Object.keys(EXPENSE_CATEGORIES).map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => {/* Export functionality */}}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Expenses Table */}
      <Paper>
        {loading && <LinearProgress />}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Expense #</strong></TableCell>
                <TableCell><strong>Title & Category</strong></TableCell>
                <TableCell><strong>Submitted By</strong></TableCell>
                <TableCell align="right"><strong>Amount</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Receipt</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {expense.expenseNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                        {getCategoryIcon(expense.category)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {expense.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {expense.category}
                          {expense.subcategory && ` • ${expense.subcategory}`}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {expense.submittedBy.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {expense.submittedBy.department}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(expense.amount, expense.currency)}
                      </Typography>
                      {expense.currency === 'USD' && (
                        <Typography variant="caption" color="text.secondary">
                          {formatCurrency(expense.amountETB, 'ETB')}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {format(new Date(expense.expenseDate), 'MMM dd, yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(expense.approvalStatus)}
                      label={expense.approvalStatus}
                      color={getStatusColor(expense.approvalStatus) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {expense.receiptAttached ? (
                      <Chip
                        label="Attached"
                        color="success"
                        size="small"
                        icon={<UploadIcon />}
                      />
                    ) : (
                      <Chip
                        label="Missing"
                        color="error"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => handleMenuClick(e, expense)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredExpenses.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              No expenses found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria or submit a new expense
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Floating Action Button for Quick Expense Entry */}
      <Fab
        color="primary"
        aria-label="add expense"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreateExpense}
      >
        <AddIcon />
      </Fab>

      {/* Success Alert */}
      <Fade in={showSuccess}>
        <Alert severity="success" sx={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>
          {successMessage || 'Operation completed successfully!'}
        </Alert>
      </Fade>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('view')}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleAction('edit')} disabled={selectedExpense?.approvalStatus === 'Paid'}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Expense
        </MenuItem>
        {selectedExpense?.approvalStatus === 'Submitted' && (
          <>
            <MenuItem onClick={() => handleAction('approve')}>
              <ApprovedIcon sx={{ mr: 1 }} />
              Approve
            </MenuItem>
            <MenuItem onClick={() => handleAction('reject')}>
              <RejectedIcon sx={{ mr: 1 }} />
              Reject
            </MenuItem>
            <Divider />
          </>
        )}
        {selectedExpense?.approvalStatus === 'Rejected' && (
          <>
            <MenuItem onClick={() => handleAction('resubmit')}>
              <UploadIcon sx={{ mr: 1 }} />
              Resubmit
            </MenuItem>
            <Divider />
          </>
        )}
        <MenuItem onClick={() => handleAction('duplicate')}>
          <DescriptionIcon sx={{ mr: 1 }} />
          Duplicate Expense
        </MenuItem>
        <MenuItem onClick={() => handleAction('expense_history')}>
          <HistoryIcon sx={{ mr: 1 }} />
          Expense History
        </MenuItem>
        <MenuItem onClick={() => handleAction('payment_details')}>
          <MoneyIcon sx={{ mr: 1 }} />
          Payment Details
        </MenuItem>
        <Divider />
        {selectedExpense?.receiptAttached && (
          <MenuItem onClick={() => handleAction('download_receipt')}>
            <AttachIcon sx={{ mr: 1 }} />
            Download Receipt
          </MenuItem>
        )}
        <MenuItem onClick={() => handleAction('print')}>
          <PrintIcon sx={{ mr: 1 }} />
          Print Report
        </MenuItem>
        <MenuItem onClick={() => handleAction('email')}>
          <EmailIcon sx={{ mr: 1 }} />
          Send Report
        </MenuItem>
        <MenuItem onClick={() => handleAction('export')}>
          <DownloadIcon sx={{ mr: 1 }} />
          Export Data
        </MenuItem>
        <MenuItem onClick={() => handleAction('audit_trail')}>
          <HistoryIcon sx={{ mr: 1 }} />
          Audit Trail
        </MenuItem>
        <MenuItem onClick={() => handleAction('notifications')}>
          <NotificationsIcon sx={{ mr: 1 }} />
          Set Alerts
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction('archive')}>
          <ArchiveIcon sx={{ mr: 1 }} />
          Archive Expense
        </MenuItem>
        <MenuItem onClick={() => handleAction('flag_review')}>
          <FlagIcon sx={{ mr: 1 }} />
          Flag for Review
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }} disabled={selectedExpense?.approvalStatus === 'Paid'}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Expense
        </MenuItem>
      </Menu>

      {/* View Expense Dialog */}
      <Dialog open={isViewDialogOpen} onClose={() => {
        setIsViewDialogOpen(false);
        setSelectedExpense(null);
      }} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Expense Details</Typography>
            <IconButton onClick={() => {
              setIsViewDialogOpen(false);
              setSelectedExpense(null);
            }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedExpense && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Expense Number</Typography>
                  <Typography variant="h6">{selectedExpense.expenseNumber}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                  <Typography variant="body1">{selectedExpense.title}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                  <Typography variant="body1">{selectedExpense.category}</Typography>
                  {selectedExpense.subcategory && (
                    <Typography variant="body2" color="text.secondary">{selectedExpense.subcategory}</Typography>
                  )}
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                  <Typography variant="h5" color="primary.main">
                    {formatCurrency(selectedExpense.amount, selectedExpense.currency)}
                  </Typography>
                  {selectedExpense.currency === 'USD' && (
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(selectedExpense.amountETB)} (Exchange Rate: {selectedExpense.exchangeRate})
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Submitted By</Typography>
                  <Typography variant="body1">{selectedExpense.submittedBy.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedExpense.submittedBy.department}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    icon={getStatusIcon(selectedExpense.approvalStatus)}
                    label={selectedExpense.approvalStatus}
                    color={getStatusColor(selectedExpense.approvalStatus) as any}
                    size="small"
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Expense Date</Typography>
                  <Typography variant="body1">
                    {format(new Date(selectedExpense.expenseDate), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Receipt</Typography>
                  <Chip
                    label={selectedExpense.receiptAttached ? 'Attached' : 'Missing'}
                    color={selectedExpense.receiptAttached ? 'success' : 'error'}
                    size="small"
                    variant={selectedExpense.receiptAttached ? 'filled' : 'outlined'}
                  />
                </Box>
              </Grid>
              {selectedExpense.description && (
                <Grid item xs={12}>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography variant="body1">{selectedExpense.description}</Typography>
                  </Box>
                </Grid>
              )}
              {selectedExpense.notes && (
                <Grid item xs={12}>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                    <Typography variant="body1">{selectedExpense.notes}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Expense Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete expense <strong>{selectedExpense?.expenseNumber} - {selectedExpense?.title}</strong>?
          </Typography>
          <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
            This action cannot be undone and will remove the expense record permanently.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete Expense
          </Button>
        </DialogActions>
      </Dialog>

      {/* Print Dialog */}
      <Dialog open={isPrintDialogOpen} onClose={() => setIsPrintDialogOpen(false)}>
        <DialogTitle>Print Expense Report</DialogTitle>
        <DialogContent>
          <Typography>
            Print detailed report for expense <strong>{selectedExpense?.expenseNumber} - {selectedExpense?.title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPrintDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePrint} color="primary" variant="contained">
            Print Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Edit Expense</Typography>
            <IconButton onClick={() => setIsEditDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedExpense && (
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Expense Title"
                    defaultValue={selectedExpense.title}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      defaultValue={selectedExpense.category}
                      label="Category"
                    >
                      {Object.keys(EXPENSE_CATEGORIES).map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    defaultValue={selectedExpense.amount}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{selectedExpense.currency}</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Expense Date"
                    type="date"
                    defaultValue={selectedExpense.expenseDate.split('T')[0]}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    defaultValue={selectedExpense.description || ''}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Chip
                        label={selectedExpense.receiptAttached ? 'Receipt Attached' : 'No Receipt'}
                        color={selectedExpense.receiptAttached ? 'success' : 'error'}
                        icon={selectedExpense.receiptAttached ? <UploadIcon /> : <AttachIcon />}
                      />
                    }
                    label=""
                  />
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AttachIcon />}
                    sx={{ ml: 2 }}
                  >
                    Upload Receipt
                    <input type="file" accept=".pdf,.jpg,.png" hidden />
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Chip
                        label={selectedExpense.taxDeductible ? 'Tax Deductible' : 'Not Tax Deductible'}
                        color={selectedExpense.taxDeductible ? 'success' : 'default'}
                      />
                    }
                    label=""
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={2}
                    defaultValue={selectedExpense.notes || ''}
                    placeholder="Add any additional notes..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setIsEditDialogOpen(false);
              setSuccessMessage(`Expense ${selectedExpense?.expenseNumber} has been updated successfully!`);
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 3000);
            }} 
            color="primary" 
            variant="contained"
          >
            Update Expense
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onClose={() => setIsEmailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Expense Report</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Send expense report for <strong>{selectedExpense?.expenseNumber} - {selectedExpense?.title}</strong>
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            margin="normal"
            placeholder="Enter recipient email"
            defaultValue="finance@company.et"
          />
          <TextField
            fullWidth
            label="Subject"
            margin="normal"
            defaultValue={`Expense Report - ${selectedExpense?.expenseNumber} - ${selectedExpense?.title}`}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Report Type</InputLabel>
            <Select defaultValue="summary" label="Report Type">
              <MenuItem value="summary">Expense Summary</MenuItem>
              <MenuItem value="detailed">Detailed Expense Report</MenuItem>
              <MenuItem value="receipt">Expense with Receipt</MenuItem>
              <MenuItem value="approval">Approval Summary</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            margin="normal"
            placeholder="Add a message (optional)"
            defaultValue={`Please find attached the expense report for ${selectedExpense?.expenseNumber} - ${selectedExpense?.title}.\n\nExpense Amount: ${selectedExpense ? formatCurrency(selectedExpense.amountETB, 'ETB') : ''}\nStatus: ${selectedExpense?.approvalStatus}\nSubmitted by: ${selectedExpense?.submittedBy.name}\nDepartment: ${selectedExpense?.submittedBy.department}\n\nBest regards,\nFinance Department`}
          />
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>Report will include:</Typography>
            <Typography variant="body2" component="ul" sx={{ m: 0, pl: 2 }}>
              <li>Expense details and amount breakdown</li>
              <li>Approval status and timeline</li>
              <li>Submitter information and department</li>
              <li>Tax calculations (VAT, withholding tax)</li>
              {selectedExpense?.receiptAttached && <li>Receipt attachment</li>}
              {selectedExpense?.notes && <li>Additional notes and comments</li>}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEmailDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setIsEmailDialogOpen(false);
              setSuccessMessage('Expense report sent successfully! The recipient will receive it shortly.');
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 3000);
            }} 
            color="primary" 
            variant="contained"
            startIcon={<EmailIcon />}
          >
            Send Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Expense Dialog */}
      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Submit New Expense</Typography>
            <IconButton onClick={() => setIsCreateDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expense Title"
                  variant="outlined"
                  placeholder="e.g., Office Supplies Purchase"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                  >
                    <MenuItem value="Travel">Travel & Transport - ጉዞ እና መጓጓዣ</MenuItem>
                    <MenuItem value="Office">Office Supplies - የቢሮ እቃዎች</MenuItem>
                    <MenuItem value="Communication">Communication - ግንኙነት</MenuItem>
                    <MenuItem value="Entertainment">Entertainment - መዝናኛ</MenuItem>
                    <MenuItem value="Marketing">Marketing & Advertising - ማስታወቂያ</MenuItem>
                    <MenuItem value="Professional">Professional Services - ሙያዊ አገልግሎት</MenuItem>
                    <MenuItem value="Utilities">Utilities - መገልገያ</MenuItem>
                    <MenuItem value="Equipment">Equipment & Maintenance - መሳሪያ እና ጥገና</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">ETB</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expense Date"
                  type="date"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  placeholder="Detailed description of the expense..."
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Receipt/Invoice Upload
                  </Typography>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    sx={{ width: '100%', height: 56 }}
                  >
                    Upload Receipt
                    <input
                      type="file"
                      hidden
                      accept="image/*,.pdf"
                      multiple
                    />
                  </Button>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Accepted formats: JPG, PNG, PDF (Max 5MB each)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Tax Deductible Expense"
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  Check if this expense is eligible for tax deduction
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  multiline
                  rows={2}
                  placeholder="Any additional information or special notes..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setIsCreateDialogOpen(false);
              setSuccessMessage('Expense submitted successfully for approval!');
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 3000);
            }} 
            color="primary" 
            variant="contained"
          >
            Submit Expense
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default ExpensesPage;
