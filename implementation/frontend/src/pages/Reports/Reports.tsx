import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  Assessment as ReportsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as FinanceIcon,
  LocalShipping as LogisticsIcon,
  ShoppingCart as PurchaseIcon,
  Inventory as InventoryIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
} from 'recharts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Sample data for comprehensive reporting
const overallKpiData = [
  { metric: 'Total Revenue', value: '₦48.5M', change: '+12.8%', trend: 'up', color: 'success' },
  { metric: 'Total Expenses', value: '₦32.1M', change: '+5.2%', trend: 'up', color: 'warning' },
  { metric: 'Net Profit', value: '₦16.4M', change: '+28.5%', trend: 'up', color: 'success' },
  { metric: 'Active Orders', value: '1,247', change: '+8.1%', trend: 'up', color: 'info' },
];

const revenueBreakdownData = [
  { name: 'Sales', value: 52, amount: 25200000 },
  { name: 'Logistics Services', value: 28, amount: 13600000 },
  { name: 'Finance Services', value: 15, amount: 7300000 },
  { name: 'Other', value: 5, amount: 2400000 },
];

const monthlyPerformanceData = [
  { month: 'Jan', revenue: 4200000, expenses: 2800000, profit: 1400000, orders: 156 },
  { month: 'Feb', revenue: 3900000, expenses: 2600000, profit: 1300000, orders: 142 },
  { month: 'Mar', revenue: 4500000, expenses: 2900000, profit: 1600000, orders: 168 },
  { month: 'Apr', revenue: 4100000, expenses: 2700000, profit: 1400000, orders: 159 },
  { month: 'May', revenue: 4800000, expenses: 3100000, profit: 1700000, orders: 187 },
  { month: 'Jun', revenue: 4350000, expenses: 2850000, profit: 1500000, orders: 173 },
];

const departmentPerformanceData = [
  { department: 'Finance', budget: 5000000, spent: 4200000, utilization: 84, efficiency: 92 },
  { department: 'Logistics', budget: 3500000, spent: 3150000, utilization: 90, efficiency: 88 },
  { department: 'Purchase', budget: 8000000, spent: 7200000, utilization: 90, efficiency: 85 },
  { department: 'Sales', budget: 2000000, spent: 1650000, utilization: 83, efficiency: 94 },
  { department: 'Inventory', budget: 1500000, spent: 1380000, utilization: 92, efficiency: 89 },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
  }).format(amount);
};

const Reports: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState('last_6_months');
  const [reportType, setReportType] = useState('summary');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleExport = (format: string) => {
    alert(`Exporting report in ${format} format...`);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          <ReportsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Enterprise Reports & Analytics
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Comprehensive ERP reporting across all business operations
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
                <MenuItem value="summary">Executive Summary</MenuItem>
                <MenuItem value="detailed">Detailed Analysis</MenuItem>
                <MenuItem value="comparative">Comparative Report</MenuItem>
                <MenuItem value="forecast">Forecast Analysis</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="last_30_days">Last 30 Days</MenuItem>
                <MenuItem value="last_3_months">Last 3 Months</MenuItem>
                <MenuItem value="last_6_months">Last 6 Months</MenuItem>
                <MenuItem value="last_year">Last Year</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              fullWidth
              onClick={() => alert('Refreshing data...')}
            >
              Refresh
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              fullWidth
              onClick={() => handleExport('PDF')}
            >
              Export PDF
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              fullWidth
              onClick={() => window.print()}
            >
              Print
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Overall KPIs */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {overallKpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {kpi.metric}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {kpi.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {kpi.trend === 'up' ? (
                        <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                      ) : (
                        <TrendingDownIcon color="error" sx={{ mr: 0.5 }} />
                      )}
                      <Typography variant="body2" color={`${kpi.color}.main`}>
                        {kpi.change}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    {index === 0 && <FinanceIcon color="primary" sx={{ fontSize: 40 }} />}
                    {index === 1 && <LogisticsIcon color="warning" sx={{ fontSize: 40 }} />}
                    {index === 2 && <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />}
                    {index === 3 && <PurchaseIcon color="info" sx={{ fontSize: 40 }} />}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Report Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Executive Summary" icon={<ReportsIcon />} iconPosition="start" />
            <Tab label="Financial Analytics" icon={<FinanceIcon />} iconPosition="start" />
            <Tab label="Logistics Performance" icon={<LogisticsIcon />} iconPosition="start" />
            <Tab label="Purchase Analytics" icon={<PurchaseIcon />} iconPosition="start" />
            <Tab label="Department Performance" icon={<InventoryIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* Executive Summary Tab */}
          <Grid container spacing={3}>
            {/* Revenue Breakdown */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue Breakdown by Source
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={revenueBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Monthly Performance Trend */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Performance Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={monthlyPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip formatter={(value, name) => [
                        name === 'orders' ? value : formatCurrency(Number(value)),
                        name === 'orders' ? 'Orders' : name === 'revenue' ? 'Revenue' : name === 'expenses' ? 'Expenses' : 'Profit'
                      ]} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" fill="#2196f3" name="Revenue" />
                      <Bar yAxisId="left" dataKey="expenses" fill="#ff9800" name="Expenses" />
                      <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#4caf50" name="Orders" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Key Metrics Summary */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Key Business Metrics Summary
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    This executive summary provides a high-level overview of all ERP operations across Finance, Logistics, Purchase, and other departments.
                  </Alert>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Financial Health
                      </Typography>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">Revenue Growth Rate</Typography>
                        <LinearProgress variant="determinate" value={85} color="success" />
                        <Typography variant="caption">85% of target achieved</Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">Profit Margin</Typography>
                        <LinearProgress variant="determinate" value={72} color="primary" />
                        <Typography variant="caption">34% margin (Target: 30%)</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Operational Efficiency
                      </Typography>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">Order Fulfillment Rate</Typography>
                        <LinearProgress variant="determinate" value={94} color="success" />
                        <Typography variant="caption">94% on-time delivery</Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">Inventory Turnover</Typography>
                        <LinearProgress variant="determinate" value={78} color="info" />
                        <Typography variant="caption">7.8x annual turnover</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Customer Satisfaction
                      </Typography>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">Customer Retention</Typography>
                        <LinearProgress variant="determinate" value={88} color="success" />
                        <Typography variant="caption">88% retention rate</Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">Service Quality Score</Typography>
                        <LinearProgress variant="determinate" value={91} color="success" />
                        <Typography variant="caption">4.6/5.0 average rating</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Financial Analytics Tab */}
          <Alert severity="info" sx={{ mb: 2 }}>
            Detailed financial reports including revenue analysis, expense tracking, profit margins, and cash flow analysis.
          </Alert>
          
          {/* Quick Financial Metrics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue Trends
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {formatCurrency(56100000)}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +12.8% YoY Growth
                  </Typography>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    View Detailed Report
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Operating Margin
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    35.8%
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Above industry average
                  </Typography>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    P&L Analysis
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Cash Flow
                  </Typography>
                  <Typography variant="h4" color="secondary.main">
                    {formatCurrency(8900000)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current liquid assets
                  </Typography>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    Cash Flow Statement
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="body2" color="text.secondary" paragraph>
            Comprehensive financial reporting system integrating with the Finance module including:
            • Revenue and expense analysis with trend projections
            • Cash flow reports and working capital analysis
            • Budget vs actual comparisons with variance analysis
            • Financial ratios and key performance indicators
            • Profit and loss statements with drill-down capabilities
            • Balance sheet analysis and asset management
            • Accounts receivable and payable aging reports
            • Tax reporting and Ethiopian compliance metrics
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Logistics Performance Tab */}
          <Alert severity="info" sx={{ mb: 2 }}>
            Comprehensive logistics analytics including shipment tracking, warehouse utilization, and customs performance.
          </Alert>
          
          {/* Quick Logistics Metrics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Shipments
                  </Typography>
                  <Typography variant="h4" color="primary">
                    1,211
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    94% on-time delivery
                  </Typography>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    Shipment Analytics
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Warehouse Utilization
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    74%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Across 4 locations
                  </Typography>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    Warehouse Reports
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Customs Clearance
                  </Typography>
                  <Typography variant="h4" color="secondary.main">
                    2.4 days
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Average processing time
                  </Typography>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    Customs Analytics
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="body2" color="text.secondary" paragraph>
            Advanced logistics reporting system integrating with the Logistics module including:
            • Shipment tracking and delivery performance analytics
            • Warehouse utilization and capacity optimization reports
            • Customs clearance efficiency and compliance metrics
            • Transportation cost analysis and route optimization
            • Regional performance metrics across Ethiopian locations
            • Supplier delivery performance and logistics KPIs
            • Real-time tracking and exception reporting
            • Cross-border shipping and documentation analysis
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {/* Purchase Analytics Tab */}
          <Alert severity="info" sx={{ mb: 2 }}>
            Purchase analytics including supplier performance, cost analysis, and procurement efficiency metrics.
          </Alert>
          
          {/* Quick Purchase Metrics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Purchase Orders
                  </Typography>
                  <Typography variant="h4" color="primary">
                    1,247
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +15.3% this month
                  </Typography>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    Order Analytics
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Supplier Performance
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    4.6/5.0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average rating
                  </Typography>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    Supplier Reports
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Cost Savings
                  </Typography>
                  <Typography variant="h4" color="secondary.main">
                    8.7%
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Vs previous period
                  </Typography>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    Cost Analysis
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="body2" color="text.secondary" paragraph>
            Comprehensive purchase management reporting integrating with the Purchase module including:
            • Supplier performance analysis with quality and delivery metrics
            • Purchase order tracking and approval workflow efficiency
            • Cost savings analysis and budget variance reporting
            • Requisition approval workflow metrics and bottleneck analysis
            • Goods received tracking and quality control reports
            • Purchase trend analysis and demand forecasting
            • Vendor evaluation and contract performance monitoring
            • Category spend analysis and strategic sourcing insights
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          {/* Department Performance Tab */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Department Performance Overview
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Department</TableCell>
                          <TableCell align="right">Budget (ETB)</TableCell>
                          <TableCell align="right">Spent (ETB)</TableCell>
                          <TableCell align="right">Utilization</TableCell>
                          <TableCell align="right">Efficiency Score</TableCell>
                          <TableCell align="center">Performance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {departmentPerformanceData.map((dept) => (
                          <TableRow key={dept.department}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {dept.department === 'Finance' && <FinanceIcon sx={{ mr: 1 }} />}
                                {dept.department === 'Logistics' && <LogisticsIcon sx={{ mr: 1 }} />}
                                {dept.department === 'Purchase' && <PurchaseIcon sx={{ mr: 1 }} />}
                                {dept.department === 'Inventory' && <InventoryIcon sx={{ mr: 1 }} />}
                                <Typography variant="body2" fontWeight="medium">
                                  {dept.department}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">{formatCurrency(dept.budget)}</TableCell>
                            <TableCell align="right">{formatCurrency(dept.spent)}</TableCell>
                            <TableCell align="right">{dept.utilization}%</TableCell>
                            <TableCell align="right">{dept.efficiency}%</TableCell>
                            <TableCell align="center">
                              <Chip
                                label={dept.efficiency >= 90 ? "Excellent" : dept.efficiency >= 85 ? "Good" : "Needs Improvement"}
                                color={dept.efficiency >= 90 ? "success" : dept.efficiency >= 85 ? "info" : "warning"}
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
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Reports;
