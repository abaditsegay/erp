import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
} from '@mui/material';
import {
  AccountBalance as FinanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Sample financial data
const financialSummaryData = [
  { category: 'Revenue', q1: 12500000, q2: 13800000, q3: 14200000, q4: 15600000 },
  { category: 'Expenses', q1: 8200000, q2: 8900000, q3: 9100000, q4: 9800000 },
  { category: 'Net Profit', q1: 4300000, q2: 4900000, q3: 5100000, q4: 5800000 },
];

const monthlyRevenueData = [
  { month: 'Jan', revenue: 4200000, expenses: 2800000, profit: 1400000 },
  { month: 'Feb', revenue: 3900000, expenses: 2600000, profit: 1300000 },
  { month: 'Mar', revenue: 4500000, expenses: 2900000, profit: 1600000 },
  { month: 'Apr', revenue: 4100000, expenses: 2700000, profit: 1400000 },
  { month: 'May', revenue: 4800000, expenses: 3100000, profit: 1700000 },
  { month: 'Jun', revenue: 4350000, expenses: 2850000, profit: 1500000 },
];

const expenseBreakdownData = [
  { category: 'Salaries & Benefits', amount: 18500000, percentage: 42 },
  { category: 'Operations', amount: 8200000, percentage: 18 },
  { category: 'Logistics', amount: 7300000, percentage: 17 },
  { category: 'Marketing', amount: 4900000, percentage: 11 },
  { category: 'Administration', amount: 3200000, percentage: 7 },
  { category: 'Other', amount: 2100000, percentage: 5 },
];

const accountsReceivableData = [
  { customer: 'Ethiopian Airlines', amount: 2500000, daysOutstanding: 15, status: 'Current' },
  { customer: 'Ethio Telecom', amount: 1800000, daysOutstanding: 32, status: 'Overdue' },
  { customer: 'Commercial Bank of Ethiopia', amount: 3200000, daysOutstanding: 8, status: 'Current' },
  { customer: 'Ethiopian Electric Power', amount: 950000, daysOutstanding: 45, status: 'Overdue' },
  { customer: 'Dashen Bank', amount: 1600000, daysOutstanding: 12, status: 'Current' },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
  }).format(amount);
};

const FinancialReports: React.FC = () => {
  const [reportPeriod, setReportPeriod] = useState('quarterly');
  const [reportType, setReportType] = useState('summary');

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h5" component="h1" gutterBottom>
          <FinanceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Financial Reports & Analysis
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Comprehensive financial reporting for Ethiopian business operations
        </Typography>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="summary">Financial Summary</MenuItem>
                <MenuItem value="detailed">Detailed P&L</MenuItem>
                <MenuItem value="balance_sheet">Balance Sheet</MenuItem>
                <MenuItem value="cash_flow">Cash Flow</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Period</InputLabel>
              <Select
                value={reportPeriod}
                label="Period"
                onChange={(e) => setReportPeriod(e.target.value)}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              fullWidth
            >
              Export Report
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              fullWidth
              onClick={() => window.print()}
            >
              Print Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Key Financial Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(56100000)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +12.8% YoY
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Net Profit
              </Typography>
              <Typography variant="h4" color="success.main">
                {formatCurrency(20100000)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +18.5% YoY
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Operating Margin
              </Typography>
              <Typography variant="h4" color="info.main">
                35.8%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +2.3% improvement
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Cash Position
              </Typography>
              <Typography variant="h4" color="secondary.main">
                {formatCurrency(8900000)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingDownIcon color="warning" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="warning.main">
                  -5.2% vs last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Analysis */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Monthly Revenue Trend */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Revenue, Expenses & Profit Trend
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#2196f3" name="Revenue" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#ff9800" name="Expenses" strokeWidth={2} />
                  <Line type="monotone" dataKey="profit" stroke="#4caf50" name="Profit" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Expense Breakdown */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expense Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={expenseBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percentage }) => `${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {expenseBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Accounts Receivable */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Accounts Receivable Summary
              </Typography>
              <Alert severity="warning" sx={{ mb: 2 }}>
                2 customers have overdue payments totaling {formatCurrency(2750000)}. Follow-up required.
              </Alert>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Amount (ETB)</TableCell>
                      <TableCell align="right">Days Outstanding</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accountsReceivableData.map((account, index) => (
                      <TableRow key={index}>
                        <TableCell>{account.customer}</TableCell>
                        <TableCell align="right">{formatCurrency(account.amount)}</TableCell>
                        <TableCell align="right">{account.daysOutstanding} days</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={account.status}
                            color={account.status === 'Current' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button size="small" variant="outlined">
                            {account.status === 'Current' ? 'View' : 'Follow Up'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialReports;
