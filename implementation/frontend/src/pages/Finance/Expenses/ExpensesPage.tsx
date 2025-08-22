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
  Tooltip,
  LinearProgress,
  Avatar,
  Stack,
  Fab,
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
    // TODO: Open create expense dialog
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
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Expense">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEditExpense(expense)}
                        disabled={expense.approvalStatus === 'Paid'}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {expense.approvalStatus === 'Submitted' && (
                      <>
                        <Tooltip title="Approve">
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handleApproveExpense(expense.id)}
                          >
                            <ApprovedIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleRejectExpense(expense.id)}
                          >
                            <RejectedIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    <Tooltip title="Delete Expense">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteExpense(expense.id)}
                        disabled={expense.approvalStatus === 'Paid'}
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
    </Box>
  );
};

export default ExpensesPage;
