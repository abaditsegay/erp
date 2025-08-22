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
  LinearProgress,
} from '@mui/material';
import {
  ShoppingCart as PurchaseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Star as StarIcon,
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

// Sample purchase data
const monthlyPurchaseData = [
  { month: 'Jan', orders: 145, value: 8200000, suppliers: 28 },
  { month: 'Feb', orders: 132, value: 7500000, suppliers: 25 },
  { month: 'Mar', orders: 167, value: 9800000, suppliers: 32 },
  { month: 'Apr', orders: 156, value: 8900000, suppliers: 29 },
  { month: 'May', orders: 189, value: 11200000, suppliers: 35 },
  { month: 'Jun', orders: 178, value: 10500000, suppliers: 33 },
];

const supplierPerformanceData = [
  { 
    supplier: 'Addis International Trading', 
    orders: 45, 
    value: 3200000, 
    onTimeDelivery: 94, 
    qualityRating: 4.7,
    currency: 'ETB'
  },
  { 
    supplier: 'Ethiopian Textile Corp', 
    orders: 38, 
    value: 2800000, 
    onTimeDelivery: 89, 
    qualityRating: 4.3,
    currency: 'ETB'
  },
  { 
    supplier: 'Dire Dawa Industrial', 
    orders: 29, 
    value: 2100000, 
    onTimeDelivery: 92, 
    qualityRating: 4.5,
    currency: 'ETB'
  },
  { 
    supplier: 'Global Supply Chain Ltd', 
    orders: 22, 
    value: 125000, 
    onTimeDelivery: 87, 
    qualityRating: 4.2,
    currency: 'USD'
  },
  { 
    supplier: 'Mekelle Manufacturing', 
    orders: 34, 
    value: 1900000, 
    onTimeDelivery: 96, 
    qualityRating: 4.8,
    currency: 'ETB'
  },
];

const purchaseCategoryData = [
  { category: 'Raw Materials', value: 35, amount: 18500000 },
  { category: 'Office Supplies', value: 15, amount: 7900000 },
  { category: 'Equipment', value: 20, amount: 10600000 },
  { category: 'Services', value: 18, amount: 9500000 },
  { category: 'Utilities', value: 12, amount: 6300000 },
];

const requisitionStatusData = [
  { status: 'Pending', count: 23, percentage: 18 },
  { status: 'Approved', count: 67, percentage: 52 },
  { status: 'Under Review', count: 19, percentage: 15 },
  { status: 'Rejected', count: 8, percentage: 6 },
  { status: 'Converted to PO', count: 12, percentage: 9 },
];

const formatCurrency = (amount: number, currency: string = 'ETB') => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

const PurchaseReports: React.FC = () => {
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [supplierFilter, setSupplierFilter] = useState('all');

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h5" component="h1" gutterBottom>
          <PurchaseIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Purchase Analytics & Reports
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Comprehensive purchase management reporting and supplier analysis
        </Typography>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Period</InputLabel>
              <Select
                value={reportPeriod}
                label="Report Period"
                onChange={(e) => setReportPeriod(e.target.value)}
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Supplier Type</InputLabel>
              <Select
                value={supplierFilter}
                label="Supplier Type"
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                <MenuItem value="all">All Suppliers</MenuItem>
                <MenuItem value="local">Local Ethiopian</MenuItem>
                <MenuItem value="international">International</MenuItem>
                <MenuItem value="preferred">Preferred Partners</MenuItem>
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

      {/* Key Purchase Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Purchase Orders
              </Typography>
              <Typography variant="h4" color="primary">
                1,247
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +15.3% this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Purchase Value
              </Typography>
              <Typography variant="h4" color="success.main">
                {formatCurrency(56100000)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +12.7% vs last period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Suppliers
              </Typography>
              <Typography variant="h4" color="info.main">
                182
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +8 new suppliers
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Avg. Delivery Time
              </Typography>
              <Typography variant="h4" color="warning.main">
                12.5 days
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingDownIcon color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  -1.2 days improvement
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Analysis */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Monthly Purchase Trend */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Purchase Orders & Value Trend
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyPurchaseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => [
                    name === 'orders' || name === 'suppliers' ? value : formatCurrency(Number(value)),
                    name === 'orders' ? 'Purchase Orders' : name === 'suppliers' ? 'Active Suppliers' : 'Total Value'
                  ]} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="orders" fill="#2196f3" name="orders" />
                  <Line yAxisId="right" type="monotone" dataKey="value" stroke="#4caf50" name="value" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="suppliers" stroke="#ff9800" name="suppliers" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Purchase Category Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Purchase by Category
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={purchaseCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, value }) => `${category}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {purchaseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Supplier Performance Analysis */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Supplier Performance Analysis
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Performance metrics based on delivery times, quality ratings, and order completion rates.
              </Alert>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Supplier Name</TableCell>
                      <TableCell align="center">Orders</TableCell>
                      <TableCell align="right">Total Value</TableCell>
                      <TableCell align="center">On-Time Delivery</TableCell>
                      <TableCell align="center">Quality Rating</TableCell>
                      <TableCell align="center">Performance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {supplierPerformanceData.map((supplier, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {supplier.supplier}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{supplier.orders}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(supplier.value, supplier.currency)}
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={supplier.onTimeDelivery} 
                                color={supplier.onTimeDelivery >= 90 ? 'success' : supplier.onTimeDelivery >= 80 ? 'warning' : 'error'}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {supplier.onTimeDelivery}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <StarIcon color="warning" sx={{ mr: 0.5, fontSize: 18 }} />
                            <Typography variant="body2">
                              {supplier.qualityRating}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={supplier.onTimeDelivery >= 90 && supplier.qualityRating >= 4.5 ? "Excellent" : 
                                   supplier.onTimeDelivery >= 85 && supplier.qualityRating >= 4.0 ? "Good" : "Needs Improvement"}
                            color={supplier.onTimeDelivery >= 90 && supplier.qualityRating >= 4.5 ? "success" : 
                                   supplier.onTimeDelivery >= 85 && supplier.qualityRating >= 4.0 ? "info" : "warning"}
                            size="small"
                          />
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

      {/* Requisition Status Summary */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Purchase Requisition Status
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={requisitionStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Requisition Workflow Efficiency
              </Typography>
              <Box sx={{ mt: 2 }}>
                {requisitionStatusData.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{item.status}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.count} ({item.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={item.percentage} 
                      color={item.status === 'Approved' ? 'success' : item.status === 'Pending' ? 'warning' : 'info'}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PurchaseReports;
