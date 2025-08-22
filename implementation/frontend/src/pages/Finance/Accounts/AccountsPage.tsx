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
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Account">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEditAccount(account)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Account">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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
    </Box>
  );
};

export default AccountsPage;
