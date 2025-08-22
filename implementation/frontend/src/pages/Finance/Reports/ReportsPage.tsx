import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Alert,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Assessment as ReportIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BalanceSheetIcon,
  MonetizationOn as CashFlowIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Download as DownloadIcon,
  DateRange as DateRangeIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  AccountBalanceWallet as WalletIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ResponsiveContainer,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

// Ethiopian Financial Reports Structure
interface FinancialReport {
  id: string;
  name: string;
  nameAmharic: string;
  description: string;
  category: 'Financial Statements' | 'Management Reports' | 'Tax Reports' | 'Analysis Reports';
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  lastGenerated?: string;
  canSchedule: boolean;
  requiredPermissions: string[];
  estimatedTime: string; // Time to generate report
  format: ('PDF' | 'Excel' | 'CSV')[];
}

// Sample financial data for charts
const monthlyData = [
  { month: 'Jan', revenue: 850000, expenses: 650000, profit: 200000 },
  { month: 'Feb', revenue: 920000, expenses: 720000, profit: 200000 },
  { month: 'Mar', revenue: 780000, expenses: 580000, profit: 200000 },
  { month: 'Apr', revenue: 1100000, expenses: 850000, profit: 250000 },
  { month: 'May', revenue: 1250000, expenses: 950000, profit: 300000 },
  { month: 'Jun', revenue: 1150000, expenses: 890000, profit: 260000 },
  { month: 'Jul', revenue: 1300000, expenses: 980000, profit: 320000 },
  { month: 'Aug', revenue: 1180000, expenses: 920000, profit: 260000 },
];

const expenseCategories = [
  { name: 'Salaries & Benefits', value: 420000, color: '#8884d8' },
  { name: 'Office & Admin', value: 180000, color: '#82ca9d' },
  { name: 'Travel & Transport', value: 125000, color: '#ffc658' },
  { name: 'Marketing', value: 89000, color: '#ff7300' },
  { name: 'Professional Services', value: 75000, color: '#00ff00' },
  { name: 'Equipment & Tech', value: 65000, color: '#ff0000' },
];

const accountBalances = [
  { account: 'Cash & Bank', balance: 2850000, type: 'Asset' },
  { account: 'Accounts Receivable', balance: 450000, type: 'Asset' },
  { account: 'Inventory', balance: 320000, type: 'Asset' },
  { account: 'Equipment', balance: 180000, type: 'Asset' },
  { account: 'Accounts Payable', balance: -320000, type: 'Liability' },
  { account: 'VAT Payable', balance: -85000, type: 'Liability' },
];

// Ethiopian Financial Reports
const FINANCIAL_REPORTS: FinancialReport[] = [
  {
    id: 'income-statement',
    name: 'Income Statement',
    nameAmharic: 'የገቢና ወጪ መግለጫ',
    description: 'Profit and Loss statement showing revenue, expenses, and net income',
    category: 'Financial Statements',
    frequency: 'Monthly',
    lastGenerated: '2024-08-20T10:30:00Z',
    canSchedule: true,
    requiredPermissions: ['finance.view', 'reports.income_statement'],
    estimatedTime: '2-3 minutes',
    format: ['PDF', 'Excel']
  },
  {
    id: 'balance-sheet',
    name: 'Balance Sheet',
    nameAmharic: 'የቀሪ ሒሳብ መግለጫ',
    description: 'Statement of financial position showing assets, liabilities, and equity',
    category: 'Financial Statements',
    frequency: 'Monthly',
    lastGenerated: '2024-08-20T10:30:00Z',
    canSchedule: true,
    requiredPermissions: ['finance.view', 'reports.balance_sheet'],
    estimatedTime: '2-3 minutes',
    format: ['PDF', 'Excel']
  },
  {
    id: 'cash-flow',
    name: 'Cash Flow Statement',
    nameAmharic: 'የገንዘብ ፍሰት መግለጫ',
    description: 'Statement showing cash receipts and payments during the period',
    category: 'Financial Statements',
    frequency: 'Monthly',
    lastGenerated: '2024-08-18T14:15:00Z',
    canSchedule: true,
    requiredPermissions: ['finance.view', 'reports.cash_flow'],
    estimatedTime: '3-4 minutes',
    format: ['PDF', 'Excel']
  },
  {
    id: 'trial-balance',
    name: 'Trial Balance',
    nameAmharic: 'የሚዛን ፈተና',
    description: 'List of all accounts with their debit and credit balances',
    category: 'Financial Statements',
    frequency: 'Monthly',
    lastGenerated: '2024-08-21T09:00:00Z',
    canSchedule: true,
    requiredPermissions: ['finance.view', 'reports.trial_balance'],
    estimatedTime: '1-2 minutes',
    format: ['PDF', 'Excel', 'CSV']
  },
  {
    id: 'vat-report',
    name: 'VAT Report',
    nameAmharic: 'የዋጋ ተጨማሪ ታክስ ሪፖርት',
    description: 'Value Added Tax report for Ethiopian tax authority submission',
    category: 'Tax Reports',
    frequency: 'Monthly',
    lastGenerated: '2024-08-15T16:45:00Z',
    canSchedule: true,
    requiredPermissions: ['finance.view', 'tax.vat_report'],
    estimatedTime: '5-7 minutes',
    format: ['PDF', 'Excel']
  },
  {
    id: 'withholding-tax',
    name: 'Withholding Tax Report',
    nameAmharic: 'የምንጭ ታክስ ሪፖርት',
    description: 'Withholding tax report for suppliers and professional services',
    category: 'Tax Reports',
    frequency: 'Monthly',
    lastGenerated: '2024-08-10T11:20:00Z',
    canSchedule: true,
    requiredPermissions: ['finance.view', 'tax.withholding_report'],
    estimatedTime: '3-4 minutes',
    format: ['PDF', 'Excel']
  },
  {
    id: 'expense-analysis',
    name: 'Expense Analysis',
    nameAmharic: 'የወጪ ትንተና',
    description: 'Detailed analysis of expenses by category, department, and vendor',
    category: 'Analysis Reports',
    frequency: 'Weekly',
    lastGenerated: '2024-08-19T13:30:00Z',
    canSchedule: true,
    requiredPermissions: ['finance.view', 'reports.expense_analysis'],
    estimatedTime: '4-5 minutes',
    format: ['PDF', 'Excel', 'CSV']
  },
  {
    id: 'aging-report',
    name: 'Accounts Receivable Aging',
    nameAmharic: 'የተቀባይ ሒሳቦች የእድሜ ሪፖርት',
    description: 'Analysis of outstanding customer invoices by age',
    category: 'Management Reports',
    frequency: 'Weekly',
    lastGenerated: '2024-08-21T08:15:00Z',
    canSchedule: true,
    requiredPermissions: ['finance.view', 'reports.aging'],
    estimatedTime: '2-3 minutes',
    format: ['PDF', 'Excel']
  },
  {
    id: 'budget-variance',
    name: 'Budget vs Actual',
    nameAmharic: 'በጀት እና ትክክለኛ ወጪ ማወዳደሪያ',
    description: 'Comparison of budgeted amounts vs actual spending',
    category: 'Management Reports',
    frequency: 'Monthly',
    lastGenerated: '2024-08-16T10:45:00Z',
    canSchedule: true,
    requiredPermissions: ['finance.view', 'budget.variance'],
    estimatedTime: '6-8 minutes',
    format: ['PDF', 'Excel']
  },
  {
    id: 'payment-register',
    name: 'Payment Register',
    nameAmharic: 'የክፍያ መዝገብ',
    description: 'Complete record of all payments made during the period',
    category: 'Management Reports',
    frequency: 'Daily',
    lastGenerated: '2024-08-21T17:30:00Z',
    canSchedule: true,
    requiredPermissions: ['finance.view', 'payments.register'],
    estimatedTime: '1-2 minutes',
    format: ['PDF', 'Excel', 'CSV']
  }
];

const ReportsPage: React.FC = () => {
  const [reports] = useState<FinancialReport[]>(FINANCIAL_REPORTS);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [dateRange, setDateRange] = useState<string>('current-month');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [actionMenu, setActionMenu] = useState<{
    anchorEl: HTMLElement | null;
    report: FinancialReport | null;
  }>({ anchorEl: null, report: null });
  const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredReports = reports.filter(report => 
    filterCategory === 'All' || report.category === filterCategory
  );

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(reportId);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(null);
      // TODO: Trigger actual report generation
      console.log(`Generated report: ${reportId}`);
    }, 3000);
  };

  const handleScheduleReport = (reportId: string) => {
    // TODO: Open schedule dialog
    console.log(`Schedule report: ${reportId}`);
  };

  const handleActionMenu = (event: React.MouseEvent<HTMLElement>, report: FinancialReport) => {
    setActionMenu({ anchorEl: event.currentTarget, report });
  };

  const closeActionMenu = () => {
    setActionMenu({ anchorEl: null, report: null });
  };

  const handleViewReport = (report: FinancialReport) => {
    setSelectedReport(report);
    setDialogOpen(true);
    closeActionMenu();
  };

  const handleEditReport = (report: FinancialReport) => {
    console.log(`Edit report: ${report.id}`);
    closeActionMenu();
  };

  const handleDeleteReport = (report: FinancialReport) => {
    console.log(`Delete report: ${report.id}`);
    closeActionMenu();
  };

  const handleEmailReport = (report: FinancialReport) => {
    console.log(`Email report: ${report.id}`);
    closeActionMenu();
  };

  const handlePrintReport = (report: FinancialReport) => {
    console.log(`Print report: ${report.id}`);
    closeActionMenu();
  };

  const handleArchiveReport = (report: FinancialReport) => {
    console.log(`Archive report: ${report.id}`);
    closeActionMenu();
  };

  const handleShareReport = (report: FinancialReport) => {
    console.log(`Share report: ${report.id}`);
    closeActionMenu();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Financial Statements': return <BalanceSheetIcon />;
      case 'Management Reports': return <BarChartIcon />;
      case 'Tax Reports': return <BusinessIcon />;
      case 'Analysis Reports': return <PieChartIcon />;
      default: return <ReportIcon />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Financial Statements': return 'primary';
      case 'Management Reports': return 'success';
      case 'Tax Reports': return 'error';
      case 'Analysis Reports': return 'info';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Financial Reports
          </Typography>
          <Typography variant="body1" color="text.secondary">
            የገንዘብ ሪፖርቶች - Generate comprehensive financial reports for your Ethiopian business
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('grid')}
            startIcon={<BarChartIcon />}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('table')}
            startIcon={<ViewIcon />}
          >
            Table View
          </Button>
        </Stack>
      </Box>

      {/* Key Metrics Dashboard */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Revenue vs Expenses
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value/1000}K`} />
                <RechartsTooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" name="Revenue" />
                <Area type="monotone" dataKey="expenses" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Expense Categories
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Stats */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Monthly Revenue</Typography>
              <Typography variant="h4" color="success.main">
                {formatCurrency(1180000)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingDownIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Monthly Expenses</Typography>
              <Typography variant="h4" color="warning.main">
                {formatCurrency(920000)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MoneyIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Net Profit</Typography>
              <Typography variant="h4" color="primary.main">
                {formatCurrency(260000)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <WalletIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Cash Balance</Typography>
              <Typography variant="h4" color="info.main">
                {formatCurrency(2850000)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Report Category</InputLabel>
              <Select
                value={filterCategory}
                label="Report Category"
                onChange={(e) => setFilterCategory(e.target.value)}
                startAdornment={<FilterIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="All">All Categories</MenuItem>
                <MenuItem value="Financial Statements">Financial Statements</MenuItem>
                <MenuItem value="Management Reports">Management Reports</MenuItem>
                <MenuItem value="Tax Reports">Tax Reports</MenuItem>
                <MenuItem value="Analysis Reports">Analysis Reports</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value)}
                startAdornment={<DateRangeIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="current-month">Current Month</MenuItem>
                <MenuItem value="last-month">Last Month</MenuItem>
                <MenuItem value="current-quarter">Current Quarter</MenuItem>
                <MenuItem value="last-quarter">Last Quarter</MenuItem>
                <MenuItem value="current-year">Current Year</MenuItem>
                <MenuItem value="last-year">Last Year</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Alert severity="info" sx={{ height: '56px', display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">
                All reports are generated based on Ethiopian accounting standards and tax requirements
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </Paper>

      {/* Reports Grid or Table */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredReports.map((report) => (
            <Grid item xs={12} sm={6} md={4} key={report.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                      {getCategoryIcon(report.category)}
                      <Box ml={1}>
                        <Typography variant="h6" component="div">
                          {report.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {report.nameAmharic}
                        </Typography>
                      </Box>
                    </Box>
                    <Tooltip title="More Actions">
                      <IconButton size="small" onClick={(e) => handleActionMenu(e, report)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {report.description}
                  </Typography>

                  <Stack spacing={1} mb={2}>
                    <Chip
                      label={report.category}
                      color={getCategoryColor(report.category) as any}
                      size="small"
                    />
                    <Chip
                      label={`${report.frequency} Report`}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <List dense>
                    <ListItem disablePadding>
                      <ListItemIcon>
                        <ScheduleIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Generation Time" 
                        secondary={report.estimatedTime}
                      />
                    </ListItem>
                    {report.lastGenerated && (
                      <ListItem disablePadding>
                        <ListItemIcon>
                          <DateRangeIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Last Generated" 
                          secondary={format(new Date(report.lastGenerated), 'MMM dd, yyyy HH:mm')}
                        />
                      </ListItem>
                    )}
                    <ListItem disablePadding>
                      <ListItemIcon>
                        <DownloadIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Export Formats" 
                        secondary={report.format.join(', ')}
                      />
                    </ListItem>
                  </List>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={isGenerating === report.id ? <LinearProgress /> : <ReportIcon />}
                    onClick={() => handleGenerateReport(report.id)}
                    disabled={isGenerating === report.id}
                    size="small"
                  >
                    {isGenerating === report.id ? 'Generating...' : 'Generate'}
                  </Button>
                  
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewReport(report)}
                    >
                      Preview
                    </Button>
                    {report.canSchedule && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ScheduleIcon />}
                        onClick={() => handleScheduleReport(report.id)}
                      >
                        Schedule
                      </Button>
                    )}
                  </Stack>
                </CardActions>

                {isGenerating === report.id && (
                  <LinearProgress sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Report Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Last Generated</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Formats</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {getCategoryIcon(report.category)}
                        <Box ml={2}>
                          <Typography variant="body2" fontWeight="medium">
                            {report.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {report.nameAmharic}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.category}
                        color={getCategoryColor(report.category) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.frequency}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {report.lastGenerated ? (
                        <Typography variant="body2">
                          {format(new Date(report.lastGenerated), 'MMM dd, yyyy HH:mm')}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Never
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={isGenerating === report.id ? 'Generating...' : 'Ready'}
                        color={isGenerating === report.id ? 'warning' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {report.format.join(', ')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Generate Report">
                        <IconButton 
                          size="small" 
                          onClick={() => handleGenerateReport(report.id)}
                          disabled={isGenerating === report.id}
                        >
                          <ReportIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleViewReport(report)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More Actions">
                        <IconButton size="small" onClick={(e) => handleActionMenu(e, report)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Account Balances Summary */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Balances Summary
        </Typography>
        <Grid container spacing={2}>
          {accountBalances.map((account, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                <Typography variant="body2">{account.account}</Typography>
                <Typography 
                  variant="body2" 
                  fontWeight="bold"
                  color={account.balance >= 0 ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(Math.abs(account.balance))}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenu.anchorEl}
        open={Boolean(actionMenu.anchorEl)}
        onClose={closeActionMenu}
      >
        {actionMenu.report && (
          <>
            <MenuItem onClick={() => handleViewReport(actionMenu.report!)}>
              <ListItemIcon>
                <ViewIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={() => handleGenerateReport(actionMenu.report!.id)}>
              <ListItemIcon>
                <ReportIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Generate Report</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={() => handleEditReport(actionMenu.report!)}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Configuration</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={() => handlePrintReport(actionMenu.report!)}>
              <ListItemIcon>
                <PrintIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Print Report</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={() => handleEmailReport(actionMenu.report!)}>
              <ListItemIcon>
                <EmailIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Email Report</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={() => handleShareReport(actionMenu.report!)}>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Share Report</ListItemText>
            </MenuItem>
            
            {actionMenu.report.canSchedule && (
              <MenuItem onClick={() => handleScheduleReport(actionMenu.report!.id)}>
                <ListItemIcon>
                  <ScheduleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Schedule Report</ListItemText>
              </MenuItem>
            )}
            
            <MenuItem onClick={() => handleArchiveReport(actionMenu.report!)}>
              <ListItemIcon>
                <ArchiveIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Archive</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={() => handleDeleteReport(actionMenu.report!)}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Report Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedReport && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center">
                {getCategoryIcon(selectedReport.category)}
                <Box ml={2}>
                  <Typography variant="h6">{selectedReport.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedReport.nameAmharic}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedReport.description}
              </Typography>
              
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Category:</Typography>
                  <Chip
                    label={selectedReport.category}
                    color={getCategoryColor(selectedReport.category) as any}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Frequency:</Typography>
                  <Typography variant="body2">{selectedReport.frequency}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Generation Time:</Typography>
                  <Typography variant="body2">{selectedReport.estimatedTime}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Export Formats:</Typography>
                  <Typography variant="body2">{selectedReport.format.join(', ')}</Typography>
                </Grid>
              </Grid>

              {selectedReport.lastGenerated && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Last generated: {format(new Date(selectedReport.lastGenerated), 'MMMM dd, yyyy HH:mm')}
                </Alert>
              )}
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Required Permissions: {selectedReport.requiredPermissions.join(', ')}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button 
                variant="contained" 
                onClick={() => handleGenerateReport(selectedReport.id)}
                disabled={isGenerating === selectedReport.id}
              >
                {isGenerating === selectedReport.id ? 'Generating...' : 'Generate Report'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ReportsPage;
