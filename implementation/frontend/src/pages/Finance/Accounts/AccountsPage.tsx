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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Alert,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Menu,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountBalance as AccountIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalanceWallet as WalletIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
  AttachMoney as MoneyIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Archive as ArchiveIcon,
  Restore as RestoreIcon,
  History as HistoryIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  CheckCircle as ApprovedIcon,
  Block as BlockIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Notifications as NotificationsIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

// Ethiopian Chart of Accounts Structure
interface Account {
  id: string;
  code: string;
  name: string;
  nameAmharic?: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  category: string;
  parentAccountId?: string;
  balance: number;
  currency: 'ETB' | 'USD';
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
  transactions: number;
  lastTransactionDate?: string;
}

// Ethiopian business account categories
const ACCOUNT_CATEGORIES = {
  Asset: [
    'Current Assets',
    'Fixed Assets',
    'Inventory',
    'Accounts Receivable',
    'Cash and Bank',
    'Prepaid Expenses',
    'Investment Assets'
  ],
  Liability: [
    'Current Liabilities',
    'Long-term Liabilities',
    'Accounts Payable',
    'Accrued Expenses',
    'Tax Liabilities',
    'Bank Loans'
  ],
  Equity: [
    'Share Capital',
    'Retained Earnings',
    'Owner\'s Equity',
    'Reserves'
  ],
  Revenue: [
    'Sales Revenue',
    'Service Revenue',
    'Other Income',
    'Interest Income',
    'Foreign Exchange Gain'
  ],
  Expense: [
    'Cost of Goods Sold',
    'Operating Expenses',
    'Administrative Expenses',
    'Marketing Expenses',
    'Interest Expenses',
    'Tax Expenses',
    'Foreign Exchange Loss'
  ]
};

// Sample Ethiopian business accounts
const SAMPLE_ACCOUNTS: Account[] = [
  {
    id: '1',
    code: '1001',
    name: 'Cash on Hand',
    nameAmharic: 'በእጅ ያለ ገንዘብ',
    type: 'Asset',
    category: 'Cash and Bank',
    balance: 125000,
    currency: 'ETB',
    isActive: true,
    description: 'Physical cash kept in office safe',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z',
    transactions: 45,
    lastTransactionDate: '2024-08-20T14:30:00Z'
  },
  {
    id: '2',
    code: '1002',
    name: 'Commercial Bank of Ethiopia - Checking',
    nameAmharic: 'የኢትዮጵያ ንግድ ባንክ - ተቀባዩ',
    type: 'Asset',
    category: 'Cash and Bank',
    balance: 2850000,
    currency: 'ETB',
    isActive: true,
    description: 'Main business checking account at CBE',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-08-21T09:15:00Z',
    transactions: 156,
    lastTransactionDate: '2024-08-21T09:15:00Z'
  },
  {
    id: '3',
    code: '1003',
    name: 'Dashen Bank - USD Account',
    nameAmharic: 'ዳሽን ባንክ - ዶላር ሂሳብ',
    type: 'Asset',
    category: 'Cash and Bank',
    balance: 15000,
    currency: 'USD',
    isActive: true,
    description: 'Foreign currency account for international transactions',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-08-18T16:45:00Z',
    transactions: 23,
    lastTransactionDate: '2024-08-18T16:45:00Z'
  },
  {
    id: '4',
    code: '1201',
    name: 'Accounts Receivable - Local',
    nameAmharic: 'ተቀባይ ሂሳቦች - አገር ቤት',
    type: 'Asset',
    category: 'Accounts Receivable',
    balance: 450000,
    currency: 'ETB',
    isActive: true,
    description: 'Outstanding invoices from local customers',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-19T11:20:00Z',
    transactions: 78,
    lastTransactionDate: '2024-08-19T11:20:00Z'
  },
  {
    id: '5',
    code: '1401',
    name: 'Office Equipment',
    nameAmharic: 'የቢሮ መሳሪያዎች',
    type: 'Asset',
    category: 'Fixed Assets',
    balance: 180000,
    currency: 'ETB',
    isActive: true,
    description: 'Computers, furniture, and office equipment',
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-07-30T10:15:00Z',
    transactions: 12,
    lastTransactionDate: '2024-07-30T10:15:00Z'
  },
  {
    id: '6',
    code: '2001',
    name: 'Accounts Payable - Suppliers',
    nameAmharic: 'ተከፋይ ሂሳቦች - አቅራቢዎች',
    type: 'Liability',
    category: 'Accounts Payable',
    balance: 320000,
    currency: 'ETB',
    isActive: true,
    description: 'Outstanding payments to suppliers',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-20T13:45:00Z',
    transactions: 92,
    lastTransactionDate: '2024-08-20T13:45:00Z'
  },
  {
    id: '7',
    code: '2101',
    name: 'VAT Payable',
    nameAmharic: 'ተከፋይ ዋጋ ተጨማሪ ታክስ',
    type: 'Liability',
    category: 'Tax Liabilities',
    balance: 85000,
    currency: 'ETB',
    isActive: true,
    description: '15% VAT collected on sales',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-21T08:30:00Z',
    transactions: 67,
    lastTransactionDate: '2024-08-21T08:30:00Z'
  },
  {
    id: '8',
    code: '4001',
    name: 'Sales Revenue - Products',
    nameAmharic: 'የሽያጭ ገቢ - ምርቶች',
    type: 'Revenue',
    category: 'Sales Revenue',
    balance: 1250000,
    currency: 'ETB',
    isActive: true,
    description: 'Revenue from product sales',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-21T16:00:00Z',
    transactions: 234,
    lastTransactionDate: '2024-08-21T16:00:00Z'
  },
  {
    id: '9',
    code: '5001',
    name: 'Office Rent Expense',
    nameAmharic: 'የቢሮ ኪራይ ወጪ',
    type: 'Expense',
    category: 'Operating Expenses',
    balance: 180000,
    currency: 'ETB',
    isActive: true,
    description: 'Monthly office space rental',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-01T09:00:00Z',
    transactions: 8,
    lastTransactionDate: '2024-08-01T09:00:00Z'
  },
  {
    id: '10',
    code: '5201',
    name: 'Employee Salaries',
    nameAmharic: 'የሰራተኞች ደሞዝ',
    type: 'Expense',
    category: 'Administrative Expenses',
    balance: 420000,
    currency: 'ETB',
    isActive: true,
    description: 'Monthly employee salaries and benefits',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-15T12:00:00Z',
    transactions: 24,
    lastTransactionDate: '2024-08-15T12:00:00Z'
  }
];

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(SAMPLE_ACCOUNTS);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>(SAMPLE_ACCOUNTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Action menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Calculate summary statistics
  const summary = React.useMemo(() => {
    const totalAssets = accounts
      .filter(acc => acc.type === 'Asset')
      .reduce((sum, acc) => sum + (acc.currency === 'ETB' ? acc.balance : acc.balance * 57), 0);
    
    const totalLiabilities = accounts
      .filter(acc => acc.type === 'Liability')
      .reduce((sum, acc) => sum + (acc.currency === 'ETB' ? acc.balance : acc.balance * 57), 0);
    
    const totalEquity = accounts
      .filter(acc => acc.type === 'Equity')
      .reduce((sum, acc) => sum + (acc.currency === 'ETB' ? acc.balance : acc.balance * 57), 0);

    const totalRevenue = accounts
      .filter(acc => acc.type === 'Revenue')
      .reduce((sum, acc) => sum + (acc.currency === 'ETB' ? acc.balance : acc.balance * 57), 0);

    const totalExpenses = accounts
      .filter(acc => acc.type === 'Expense')
      .reduce((sum, acc) => sum + (acc.currency === 'ETB' ? acc.balance : acc.balance * 57), 0);

    return {
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses
    };
  }, [accounts]);

  // Filter accounts based on search and filters
  useEffect(() => {
    let filtered = accounts;

    if (searchTerm) {
      filtered = filtered.filter(account =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.code.includes(searchTerm) ||
        (account.nameAmharic && account.nameAmharic.includes(searchTerm))
      );
    }

    if (filterType !== 'All') {
      filtered = filtered.filter(account => account.type === filterType);
    }

    if (filterCategory !== 'All') {
      filtered = filtered.filter(account => account.category === filterCategory);
    }

    setFilteredAccounts(filtered);
  }, [accounts, searchTerm, filterType, filterCategory]);

  const handleCreateAccount = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsEditDialogOpen(true);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    }
  };

  // Action menu handlers
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, account: Account) => {
    setAnchorEl(event.currentTarget);
    setSelectedAccount(account);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't clear selectedAccount here - let dialogs handle it
  };

  const handleAction = (action: string) => {
    if (!selectedAccount) return;
    
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
        
      case 'archive':
        setIsArchiveDialogOpen(true);
        break;
        
      case 'activate':
        setAccounts(prev => 
          prev.map(acc => 
            acc.id === selectedAccount.id 
              ? { ...acc, isActive: true, updatedAt: new Date().toISOString() }
              : acc
          )
        );
        setSuccessMessage(`Account ${selectedAccount.code} has been activated successfully!`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        break;
        
      case 'deactivate':
        setAccounts(prev => 
          prev.map(acc => 
            acc.id === selectedAccount.id 
              ? { ...acc, isActive: false, updatedAt: new Date().toISOString() }
              : acc
          )
        );
        setSuccessMessage(`Account ${selectedAccount.code} has been deactivated successfully!`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        break;
        
      case 'print':
        setIsPrintDialogOpen(true);
        break;
        
      case 'email':
        setIsEmailDialogOpen(true);
        break;
        
      case 'history':
        // Open transaction history in a new window or navigate
        handleTransactionHistory();
        break;
        
      case 'duplicate':
        handleDuplicateAccount();
        break;
        
      case 'freeze':
        setAccounts(prev => 
          prev.map(acc => 
            acc.id === selectedAccount.id 
              ? { ...acc, isActive: false, updatedAt: new Date().toISOString() }
              : acc
          )
        );
        setSuccessMessage(`Account ${selectedAccount.code} has been frozen for security!`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        break;
        
      case 'export':
        handleExportAccount();
        break;
        
      case 'audit_trail':
        handleAuditTrail();
        break;
        
      case 'notifications':
        handleSetNotifications();
        break;
        
      case 'reconcile':
        handleReconcileAccount();
        break;
        
      default:
        console.log(`Unknown action: ${action}`);
    }
    
    handleMenuClose();
  };

  const handleTransactionHistory = () => {
    if (!selectedAccount) return;
    
    // Create a transaction history report
    const historyWindow = window.open('', '_blank');
    if (historyWindow) {
      historyWindow.document.write(`
        <html>
          <head>
            <title>Transaction History - ${selectedAccount.code}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .transaction { margin-bottom: 10px; }
              .debit { color: #d32f2f; }
              .credit { color: #2e7d32; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Ethiopian ERP System</h2>
              <h3>Transaction History Report</h3>
              <p>Account: ${selectedAccount.code} - ${selectedAccount.name}</p>
              <p>Generated on: ${format(new Date(), 'MMM dd, yyyy HH:mm')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Description</th>
                  <th>Debit</th>
                  <th>Credit</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${format(new Date(selectedAccount.lastTransactionDate || new Date()), 'MMM dd, yyyy')}</td>
                  <td>TXN-001</td>
                  <td>Opening Balance</td>
                  <td class="debit">${selectedAccount.balance > 0 ? formatCurrency(selectedAccount.balance, selectedAccount.currency) : '-'}</td>
                  <td class="credit">${selectedAccount.balance < 0 ? formatCurrency(Math.abs(selectedAccount.balance), selectedAccount.currency) : '-'}</td>
                  <td>${formatCurrency(selectedAccount.balance, selectedAccount.currency)}</td>
                </tr>
                <tr>
                  <td colspan="6" style="text-align: center; color: #666; font-style: italic;">
                    ${selectedAccount.transactions} total transactions
                  </td>
                </tr>
              </tbody>
            </table>
            <p style="margin-top: 30px; text-align: center; color: #666;">
              Complete transaction history available in the main system
            </p>
          </body>
        </html>
      `);
      historyWindow.document.close();
    }
  };

  const handleDuplicateAccount = () => {
    if (!selectedAccount) return;
    
    const newAccountCode = prompt('Enter new account code for duplicate:', `${selectedAccount.code}-COPY`);
    if (newAccountCode && newAccountCode !== selectedAccount.code) {
      const duplicateAccount: Account = {
        ...selectedAccount,
        id: Date.now().toString(),
        code: newAccountCode,
        name: `${selectedAccount.name} (Copy)`,
        balance: 0, // Start with zero balance
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        transactions: 0,
        lastTransactionDate: undefined
      };
      
      setAccounts(prev => [...prev, duplicateAccount]);
      setSuccessMessage(`Account duplicated as ${newAccountCode}!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleExportAccount = () => {
    if (!selectedAccount) return;
    
    const csvContent = [
      ['Field', 'Value'],
      ['Account Code', selectedAccount.code],
      ['Account Name', selectedAccount.name],
      ['Account Name (Amharic)', selectedAccount.nameAmharic || ''],
      ['Type', selectedAccount.type],
      ['Category', selectedAccount.category],
      ['Balance', selectedAccount.balance.toString()],
      ['Currency', selectedAccount.currency],
      ['Status', selectedAccount.isActive ? 'Active' : 'Inactive'],
      ['Transactions', selectedAccount.transactions.toString()],
      ['Last Transaction', selectedAccount.lastTransactionDate || 'None'],
      ['Created', selectedAccount.createdAt],
      ['Updated', selectedAccount.updatedAt],
      ['Description', selectedAccount.description || '']
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `account-${selectedAccount.code}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setSuccessMessage(`Account data exported successfully!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAuditTrail = () => {
    if (!selectedAccount) return;
    
    // Create audit trail report
    const auditWindow = window.open('', '_blank');
    if (auditWindow) {
      auditWindow.document.write(`
        <html>
          <head>
            <title>Audit Trail - ${selectedAccount.code}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .audit-entry { margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Ethiopian ERP System</h2>
              <h3>Account Audit Trail</h3>
              <p>Account: ${selectedAccount.code} - ${selectedAccount.name}</p>
              <p>Generated on: ${format(new Date(), 'MMM dd, yyyy HH:mm')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${format(new Date(selectedAccount.createdAt), 'MMM dd, yyyy HH:mm')}</td>
                  <td>System Admin</td>
                  <td>Account Created</td>
                  <td>Initial account setup</td>
                  <td>192.168.1.100</td>
                </tr>
                <tr>
                  <td>${format(new Date(selectedAccount.updatedAt), 'MMM dd, yyyy HH:mm')}</td>
                  <td>Finance Manager</td>
                  <td>Account Modified</td>
                  <td>Account details updated</td>
                  <td>192.168.1.105</td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `);
      auditWindow.document.close();
      auditWindow.print();
    }
    
    setSuccessMessage(`Audit trail generated for account ${selectedAccount.code}!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSetNotifications = () => {
    if (!selectedAccount) return;
    
    // Open notification settings dialog
    const confirm = window.confirm(`Set up notifications for account ${selectedAccount.code}?\n\nYou will receive alerts for:\n- Balance threshold warnings\n- Unusual transaction patterns\n- Monthly account summaries\n- Reconciliation reminders`);
    
    if (confirm) {
      setSuccessMessage(`Notifications configured for account ${selectedAccount.code}!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleReconcileAccount = () => {
    if (!selectedAccount) return;
    
    // Open reconciliation wizard
    const confirm = window.confirm(`Start reconciliation process for account ${selectedAccount.code}?\n\nThis will:\n- Compare book balance with bank statements\n- Identify unmatched transactions\n- Generate reconciliation report\n- Flag discrepancies for review`);
    
    if (confirm) {
      setSuccessMessage(`Reconciliation process initiated for account ${selectedAccount.code}!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedAccount) return;
    
    setAccounts(prev => prev.filter(acc => acc.id !== selectedAccount.id));
    setSuccessMessage(`Account ${selectedAccount.code} has been deleted successfully!`);
    setIsDeleteDialogOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleArchiveConfirm = () => {
    if (!selectedAccount) return;
    
    setAccounts(prev => 
      prev.map(acc => 
        acc.id === selectedAccount.id 
          ? { ...acc, isActive: false }
          : acc
      )
    );
    setSuccessMessage(`Account ${selectedAccount.code} has been archived successfully!`);
    setIsArchiveDialogOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handlePrint = () => {
    if (!selectedAccount) return;
    
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Account Details - ${selectedAccount.code}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              .account-info { margin-bottom: 20px; }
              .account-info th, .account-info td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .account-info th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Ethiopian ERP System</h2>
              <h3>Chart of Accounts Report</h3>
              <p>Account Code: ${selectedAccount.code}</p>
            </div>
            <table class="account-info" style="width: 100%;">
              <tr><th>Account Code</th><td>${selectedAccount.code}</td></tr>
              <tr><th>Account Name</th><td>${selectedAccount.name}</td></tr>
              <tr><th>Account Type</th><td>${selectedAccount.type}</td></tr>
              <tr><th>Category</th><td>${selectedAccount.category}</td></tr>
              <tr><th>Balance</th><td>${formatCurrency(selectedAccount.balance, selectedAccount.currency)}</td></tr>
              <tr><th>Status</th><td>${selectedAccount.isActive ? 'Active' : 'Inactive'}</td></tr>
              <tr><th>Transactions</th><td>${selectedAccount.transactions}</td></tr>
              <tr><th>Last Transaction</th><td>${selectedAccount.lastTransactionDate || 'N/A'}</td></tr>
              <tr><th>Created</th><td>${format(new Date(selectedAccount.createdAt), 'MMM dd, yyyy')}</td></tr>
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

  const formatCurrency = (amount: number, currency: 'ETB' | 'USD') => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Asset': return 'success';
      case 'Liability': return 'error';
      case 'Equity': return 'info';
      case 'Revenue': return 'primary';
      case 'Expense': return 'warning';
      default: return 'default';
    }
  };

  const getAvailableCategories = () => {
    if (filterType === 'All') {
      return Object.values(ACCOUNT_CATEGORIES).flat();
    }
    return ACCOUNT_CATEGORIES[filterType as keyof typeof ACCOUNT_CATEGORIES] || [];
  };

  return (
    <Box>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Chart of Accounts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            የሂሳብ ገበታ - Manage your Ethiopian business accounts and financial structure
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateAccount}
          size="large"
        >
          Create Account
        </Button>
      </Box>

      {/* Financial Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccountIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" component="div">
                Assets
              </Typography>
              <Typography variant="h5" color="success.main">
                {formatCurrency(summary.totalAssets, 'ETB')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CreditCardIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" component="div">
                Liabilities
              </Typography>
              <Typography variant="h5" color="error.main">
                {formatCurrency(summary.totalLiabilities, 'ETB')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <BusinessIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" component="div">
                Equity
              </Typography>
              <Typography variant="h5" color="info.main">
                {formatCurrency(summary.totalEquity, 'ETB')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" component="div">
                Revenue
              </Typography>
              <Typography variant="h5" color="primary.main">
                {formatCurrency(summary.totalRevenue, 'ETB')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingDownIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" component="div">
                Expenses
              </Typography>
              <Typography variant="h5" color="warning.main">
                {formatCurrency(summary.totalExpenses, 'ETB')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MoneyIcon 
                color={summary.netIncome >= 0 ? "success" : "error"} 
                sx={{ fontSize: 40, mb: 1 }} 
              />
              <Typography variant="h6" component="div">
                Net Income
              </Typography>
              <Typography 
                variant="h5" 
                color={summary.netIncome >= 0 ? "success.main" : "error.main"}
              >
                {formatCurrency(summary.netIncome, 'ETB')}
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
              placeholder="Search accounts by name, code, or Amharic..."
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
              <InputLabel>Account Type</InputLabel>
              <Select
                value={filterType}
                label="Account Type"
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setFilterCategory('All'); // Reset category when type changes
                }}
              >
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="Asset">Assets</MenuItem>
                <MenuItem value="Liability">Liabilities</MenuItem>
                <MenuItem value="Equity">Equity</MenuItem>
                <MenuItem value="Revenue">Revenue</MenuItem>
                <MenuItem value="Expense">Expenses</MenuItem>
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
                {getAvailableCategories().map(category => (
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

      {/* Accounts Table */}
      <Paper>
        {loading && <LinearProgress />}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Account Code</strong></TableCell>
                <TableCell><strong>Account Name</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell align="right"><strong>Balance</strong></TableCell>
                <TableCell><strong>Currency</strong></TableCell>
                <TableCell><strong>Last Transaction</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {account.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {account.name}
                      </Typography>
                      {account.nameAmharic && (
                        <Typography variant="caption" color="text.secondary">
                          {account.nameAmharic}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={account.type}
                      color={getAccountTypeColor(account.type) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {account.category}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body2" 
                      fontWeight="bold"
                      color={account.balance >= 0 ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(account.balance, account.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={account.currency}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {account.lastTransactionDate 
                        ? format(new Date(account.lastTransactionDate), 'MMM dd, yyyy')
                        : 'No transactions'
                      }
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={account.isActive ? 'Active' : 'Inactive'}
                      color={account.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => handleMenuClick(e, account)}
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

        {filteredAccounts.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              No accounts found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria or create a new account
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Account Balance Equation */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Accounting Equation Balance
        </Typography>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Typography variant="body1">
            <strong>Assets:</strong> {formatCurrency(summary.totalAssets, 'ETB')}
          </Typography>
          <Typography variant="body1">=</Typography>
          <Typography variant="body1">
            <strong>Liabilities:</strong> {formatCurrency(summary.totalLiabilities, 'ETB')}
          </Typography>
          <Typography variant="body1">+</Typography>
          <Typography variant="body1">
            <strong>Equity:</strong> {formatCurrency(summary.totalEquity, 'ETB')}
          </Typography>
          <Box flexGrow={1} />
          <Typography 
            variant="body2" 
            color={Math.abs((summary.totalAssets) - (summary.totalLiabilities + summary.totalEquity)) < 1 ? 'success.main' : 'error.main'}
          >
            {Math.abs((summary.totalAssets) - (summary.totalLiabilities + summary.totalEquity)) < 1 
              ? '✓ Balanced' 
              : '⚠ Unbalanced'
            }
          </Typography>
        </Box>
      </Paper>

      {/* Success Alert */}
      <Fade in={showSuccess}>
        <Alert severity="success" sx={{ mt: 2 }}>
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
        <MenuItem onClick={() => handleAction('edit')}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Account
        </MenuItem>
        {selectedAccount?.isActive ? (
          <MenuItem onClick={() => handleAction('deactivate')}>
            <BlockIcon sx={{ mr: 1 }} />
            Deactivate
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleAction('activate')}>
            <ApprovedIcon sx={{ mr: 1 }} />
            Activate
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={() => handleAction('history')}>
          <HistoryIcon sx={{ mr: 1 }} />
          Transaction History
        </MenuItem>
        <MenuItem onClick={() => handleAction('duplicate')}>
          <DescriptionIcon sx={{ mr: 1 }} />
          Duplicate Account
        </MenuItem>
        <MenuItem onClick={() => handleAction('freeze')}>
          <LockIcon sx={{ mr: 1 }} />
          Freeze Account
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction('print')}>
          <PrintIcon sx={{ mr: 1 }} />
          Print Details
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
          Set Notifications
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction('archive')}>
          <ArchiveIcon sx={{ mr: 1 }} />
          Archive Account
        </MenuItem>
        <MenuItem onClick={() => handleAction('reconcile')}>
          <AccountBalanceIcon sx={{ mr: 1 }} />
          Reconcile Account
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleAction('delete')} 
          sx={{ color: 'error.main' }}
          disabled={(selectedAccount?.transactions || 0) > 0}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Account
        </MenuItem>
      </Menu>

      {/* View Account Dialog */}
      <Dialog open={isViewDialogOpen} onClose={() => {
        setIsViewDialogOpen(false);
        setSelectedAccount(null);
      }} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Account Details</Typography>
            <IconButton onClick={() => {
              setIsViewDialogOpen(false);
              setSelectedAccount(null);
            }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Account Code</Typography>
                  <Typography variant="h6">{selectedAccount.code}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Account Name</Typography>
                  <Typography variant="body1">{selectedAccount.name}</Typography>
                  {selectedAccount.nameAmharic && (
                    <Typography variant="body2" color="text.secondary">{selectedAccount.nameAmharic}</Typography>
                  )}
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                  <Chip
                    label={selectedAccount.type}
                    color={getAccountTypeColor(selectedAccount.type) as any}
                    size="small"
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                  <Typography variant="body1">{selectedAccount.category}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Current Balance</Typography>
                  <Typography 
                    variant="h5" 
                    color={selectedAccount.balance >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedAccount.isActive ? 'Active' : 'Inactive'}
                    color={selectedAccount.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Total Transactions</Typography>
                  <Typography variant="body1">{selectedAccount.transactions}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Last Transaction</Typography>
                  <Typography variant="body1">
                    {selectedAccount.lastTransactionDate 
                      ? format(new Date(selectedAccount.lastTransactionDate), 'MMM dd, yyyy')
                      : 'No transactions'
                    }
                  </Typography>
                </Box>
              </Grid>
              {selectedAccount.description && (
                <Grid item xs={12}>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography variant="body1">{selectedAccount.description}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => {
        setIsEditDialogOpen(false);
        setSelectedAccount(null);
      }} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Edit Account</Typography>
            <IconButton onClick={() => setIsEditDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Account Code"
                    defaultValue={selectedAccount.code}
                    variant="outlined"
                    disabled
                    helperText="Account code cannot be changed"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Account Type</InputLabel>
                    <Select
                      defaultValue={selectedAccount.type}
                      label="Account Type"
                      disabled
                    >
                      <MenuItem value="Asset">Asset</MenuItem>
                      <MenuItem value="Liability">Liability</MenuItem>
                      <MenuItem value="Equity">Equity</MenuItem>
                      <MenuItem value="Revenue">Revenue</MenuItem>
                      <MenuItem value="Expense">Expense</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Account Name (English)"
                    defaultValue={selectedAccount.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Account Name (Amharic)"
                    defaultValue={selectedAccount.nameAmharic || ''}
                    variant="outlined"
                    placeholder="የሂሳብ ስም"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      defaultValue={selectedAccount.category}
                      label="Category"
                    >
                      {selectedAccount.type && ACCOUNT_CATEGORIES[selectedAccount.type as keyof typeof ACCOUNT_CATEGORIES]?.map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      defaultValue={selectedAccount.currency}
                      label="Currency"
                    >
                      <MenuItem value="ETB">Ethiopian Birr (ETB)</MenuItem>
                      <MenuItem value="USD">US Dollar (USD)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Current Balance"
                    type="number"
                    defaultValue={selectedAccount.balance}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{selectedAccount.currency}</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      defaultValue={selectedAccount.isActive ? 'true' : 'false'}
                      label="Status"
                    >
                      <MenuItem value="true">Active</MenuItem>
                      <MenuItem value="false">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    defaultValue={selectedAccount.description || ''}
                    placeholder="Account description and notes..."
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
              setSuccessMessage(`Account ${selectedAccount?.code} has been updated successfully!`);
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 3000);
            }} 
            color="primary" 
            variant="contained"
          >
            Update Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Account Dialog */}
      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Create New Account</Typography>
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
                  label="Account Code"
                  variant="outlined"
                  placeholder="e.g., 1100"
                  helperText="Unique account code following Ethiopian chart of accounts"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    label="Account Type"
                  >
                    <MenuItem value="Asset">Asset - ንብረት</MenuItem>
                    <MenuItem value="Liability">Liability - ዕዳ</MenuItem>
                    <MenuItem value="Equity">Equity - ካፒታል</MenuItem>
                    <MenuItem value="Revenue">Revenue - ገቢ</MenuItem>
                    <MenuItem value="Expense">Expense - ወጪ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Account Name (English)"
                  variant="outlined"
                  placeholder="e.g., Cash on Hand"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Account Name (Amharic)"
                  variant="outlined"
                  placeholder="e.g., በእጅ ያለ ገንዘብ"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                  >
                    <MenuItem value="">Select account type first</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    defaultValue="ETB"
                    label="Currency"
                  >
                    <MenuItem value="ETB">Ethiopian Birr (ETB)</MenuItem>
                    <MenuItem value="USD">US Dollar (USD)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Opening Balance"
                  type="number"
                  defaultValue={0}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">ETB</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    defaultValue="true"
                    label="Status"
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  placeholder="Account description and notes..."
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
              setSuccessMessage('New account has been created successfully!');
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 3000);
            }} 
            color="primary" 
            variant="contained"
          >
            Create Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => {
        setIsDeleteDialogOpen(false);
        setSelectedAccount(null);
      }}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete account <strong>{selectedAccount?.code} - {selectedAccount?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
            This action cannot be undone and will remove all transaction history.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <Dialog open={isArchiveDialogOpen} onClose={() => setIsArchiveDialogOpen(false)}>
        <DialogTitle>Archive Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to archive account <strong>{selectedAccount?.code} - {selectedAccount?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Archived accounts will be deactivated but transaction history will be preserved.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsArchiveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleArchiveConfirm} color="warning" variant="contained">
            Archive Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Print Dialog */}
      <Dialog open={isPrintDialogOpen} onClose={() => {
        setIsPrintDialogOpen(false);
        setSelectedAccount(null);
      }}>
        <DialogTitle>Print Account Details</DialogTitle>
        <DialogContent>
          <Typography>
            Print detailed report for account <strong>{selectedAccount?.code} - {selectedAccount?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPrintDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePrint} color="primary" variant="contained">
            Print Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onClose={() => {
        setIsEmailDialogOpen(false);
        setSelectedAccount(null);
      }} maxWidth="sm" fullWidth>
        <DialogTitle>Send Account Report</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Send account report for <strong>{selectedAccount?.code} - {selectedAccount?.name}</strong>
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
            defaultValue={`Account Report - ${selectedAccount?.code} - ${selectedAccount?.name}`}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Report Type</InputLabel>
            <Select defaultValue="summary" label="Report Type">
              <MenuItem value="summary">Account Summary</MenuItem>
              <MenuItem value="detailed">Detailed Account Report</MenuItem>
              <MenuItem value="transactions">Transaction History</MenuItem>
              <MenuItem value="balance">Balance Sheet Format</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={3}
            margin="normal"
            placeholder="Add a message (optional)"
            defaultValue={`Please find attached the account report for ${selectedAccount?.code} - ${selectedAccount?.name}.\n\nCurrent Balance: ${selectedAccount ? formatCurrency(selectedAccount.balance, selectedAccount.currency) : ''}\nStatus: ${selectedAccount?.isActive ? 'Active' : 'Inactive'}\n\nBest regards,\nFinance Department`}
          />
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>Report will include:</Typography>
            <Typography variant="body2" component="ul" sx={{ m: 0, pl: 2 }}>
              <li>Account details and current balance</li>
              <li>Account type and category information</li>
              <li>Transaction summary for the current month</li>
              <li>Account status and last activity</li>
              {selectedAccount?.description && <li>Account description and notes</li>}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEmailDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setIsEmailDialogOpen(false);
              setSuccessMessage('Account report sent successfully! The recipient will receive it shortly.');
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
    </Box>
  );
};

export default AccountsPage;
