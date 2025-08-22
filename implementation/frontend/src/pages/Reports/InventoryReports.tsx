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
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
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

// Sample inventory data
const inventoryTurnoverData = [
  { month: 'Jan', turnover: 6.2, value: 25000000, items: 1850 },
  { month: 'Feb', turnover: 5.8, value: 23500000, items: 1782 },
  { month: 'Mar', turnover: 7.1, value: 28000000, items: 1920 },
  { month: 'Apr', turnover: 6.9, value: 26800000, items: 1886 },
  { month: 'May', turnover: 7.5, value: 29200000, items: 1975 },
  { month: 'Jun', turnover: 7.2, value: 28600000, items: 1945 },
];

const categoryAnalysisData = [
  { category: 'Raw Materials', value: 35, amount: 18500000, items: 456 },
  { category: 'Finished Goods', value: 28, amount: 14800000, items: 234 },
  { category: 'Work in Progress', value: 20, amount: 10600000, items: 178 },
  { category: 'Maintenance Supplies', value: 12, amount: 6300000, items: 298 },
  { category: 'Office Supplies', value: 5, amount: 2600000, items: 145 },
];

const warehousePerformanceData = [
  { 
    warehouse: 'Addis Ababa Main', 
    location: 'Addis Ababa',
    capacity: 50000, 
    utilization: 78, 
    efficiency: 92,
    items: 1250,
    value: 15600000
  },
  { 
    warehouse: 'Dire Dawa Distribution', 
    location: 'Dire Dawa',
    capacity: 25000, 
    utilization: 65, 
    efficiency: 88,
    items: 890,
    value: 8900000
  },
  { 
    warehouse: 'Mekelle Hub', 
    location: 'Mekelle',
    capacity: 15000, 
    utilization: 82, 
    efficiency: 85,
    items: 567,
    value: 6700000
  },
  { 
    warehouse: 'Bahir Dar Regional', 
    location: 'Bahir Dar',
    capacity: 20000, 
    utilization: 71, 
    efficiency: 90,
    items: 734,
    value: 7800000
  },
];

const lowStockItems = [
  { item: 'Steel Rods - 12mm', category: 'Raw Materials', current: 45, minimum: 100, reorderPoint: 120, supplier: 'Ethiopian Steel Corp' },
  { item: 'Office Paper A4', category: 'Office Supplies', current: 12, minimum: 50, reorderPoint: 75, supplier: 'Addis Stationery' },
  { item: 'Hydraulic Oil', category: 'Maintenance', current: 8, minimum: 20, reorderPoint: 30, supplier: 'Industrial Supplies Ltd' },
  { item: 'Safety Helmets', category: 'Safety Equipment', current: 23, minimum: 50, reorderPoint: 60, supplier: 'Safety First Ethiopia' },
  { item: 'Motor Bearings', category: 'Spare Parts', current: 15, minimum: 25, reorderPoint: 35, supplier: 'Mechanical Parts Co' },
];

const movementAnalysisData = [
  { type: 'Receipts', count: 145, value: 8200000 },
  { type: 'Issues', count: 189, value: 7800000 },
  { type: 'Transfers', count: 67, value: 2100000 },
  { type: 'Adjustments', count: 23, value: 350000 },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
  }).format(amount);
};

const InventoryReports: React.FC = () => {
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [warehouseFilter, setWarehouseFilter] = useState('all');

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h5" component="h1" gutterBottom>
          <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Inventory Analytics & Reports
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Comprehensive inventory management reporting and warehouse analysis
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
              <InputLabel>Warehouse</InputLabel>
              <Select
                value={warehouseFilter}
                label="Warehouse"
                onChange={(e) => setWarehouseFilter(e.target.value)}
              >
                <MenuItem value="all">All Warehouses</MenuItem>
                <MenuItem value="addis">Addis Ababa Main</MenuItem>
                <MenuItem value="dire">Dire Dawa Distribution</MenuItem>
                <MenuItem value="mekelle">Mekelle Hub</MenuItem>
                <MenuItem value="bahir">Bahir Dar Regional</MenuItem>
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

      {/* Key Inventory Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Inventory Value
              </Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(52800000)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +5.8% this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total SKUs
              </Typography>
              <Typography variant="h4" color="info.main">
                2,311
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +45 new items
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Inventory Turnover
              </Typography>
              <Typography variant="h4" color="success.main">
                7.2x
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +0.3x improvement
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Low Stock Alerts
              </Typography>
              <Typography variant="h4" color="error.main">
                23
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <WarningIcon color="error" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="error.main">
                  Immediate attention needed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Analysis */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Inventory Turnover Trend */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inventory Turnover & Value Trend
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={inventoryTurnoverData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => [
                    name === 'turnover' ? `${value}x` : name === 'items' ? value : formatCurrency(Number(value)),
                    name === 'turnover' ? 'Turnover Rate' : name === 'items' ? 'Total Items' : 'Inventory Value'
                  ]} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="turnover" stroke="#4caf50" name="turnover" strokeWidth={3} />
                  <Line yAxisId="right" type="monotone" dataKey="value" stroke="#2196f3" name="value" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="items" stroke="#ff9800" name="items" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inventory by Category
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryAnalysisData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, value }) => `${category}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryAnalysisData.map((entry, index) => (
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

      {/* Low Stock Alerts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <WarningIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Low Stock Items - Immediate Action Required
              </Typography>
              <Alert severity="error" sx={{ mb: 2 }}>
                {lowStockItems.length} items are below minimum stock levels. Purchase orders should be created immediately.
              </Alert>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Current Stock</TableCell>
                      <TableCell align="right">Minimum Level</TableCell>
                      <TableCell align="right">Reorder Point</TableCell>
                      <TableCell>Preferred Supplier</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {item.item}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell align="right">
                          <Typography color="error.main" fontWeight="bold">
                            {item.current}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{item.minimum}</TableCell>
                        <TableCell align="right">{item.reorderPoint}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell align="center">
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="error"
                            onClick={() => alert(`Creating PO for ${item.item}`)}
                          >
                            Create PO
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

      {/* Warehouse Performance */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Warehouse Performance Analysis
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Warehouse</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell align="right">Capacity (cbm)</TableCell>
                      <TableCell align="center">Utilization</TableCell>
                      <TableCell align="center">Efficiency</TableCell>
                      <TableCell align="right">Items</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {warehousePerformanceData.map((warehouse, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {warehouse.warehouse}
                          </Typography>
                        </TableCell>
                        <TableCell>{warehouse.location}</TableCell>
                        <TableCell align="right">{warehouse.capacity.toLocaleString()}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ width: '60px', mr: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={warehouse.utilization} 
                                color={warehouse.utilization >= 80 ? 'warning' : 'success'}
                              />
                            </Box>
                            <Typography variant="body2">
                              {warehouse.utilization}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ width: '60px', mr: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={warehouse.efficiency} 
                                color={warehouse.efficiency >= 90 ? 'success' : 'info'}
                              />
                            </Box>
                            <Typography variant="body2">
                              {warehouse.efficiency}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{warehouse.items.toLocaleString()}</TableCell>
                        <TableCell align="right">{formatCurrency(warehouse.value)}</TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={warehouse.utilization < 85 && warehouse.efficiency >= 85 ? <CheckIcon /> : <WarningIcon />}
                            label={warehouse.utilization < 85 && warehouse.efficiency >= 85 ? "Optimal" : "Monitor"}
                            color={warehouse.utilization < 85 && warehouse.efficiency >= 85 ? "success" : "warning"}
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

      {/* Movement Analysis */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inventory Movement Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={movementAnalysisData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'count' ? value : formatCurrency(Number(value)),
                    name === 'count' ? 'Count' : 'Value'
                  ]} />
                  <Bar dataKey="count" fill="#2196f3" name="count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Movement Summary
              </Typography>
              <Box sx={{ mt: 2 }}>
                {movementAnalysisData.map((movement, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium">{movement.type}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {movement.count} transactions
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Total Value:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(movement.value)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(movement.count / 200) * 100} 
                      color={movement.type === 'Receipts' ? 'success' : movement.type === 'Issues' ? 'info' : 'warning'}
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

export default InventoryReports;
