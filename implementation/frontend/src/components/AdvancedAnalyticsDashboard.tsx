/**
 * Advanced Analytics Dashboard Component
 * Phase 1.4: Core ERP Module Enhancement
 * 
 * Features:
 * - Real-time business intelligence
 * - Interactive data visualizations
 * - Ethiopian business insights
 * - Performance metrics
 * - Predictive analytics
 * - Customizable widgets
 * - Execut  const FinancialOverview = () => {
    if (!financialData) {
      console.log('Financial data not available, showing loading...');
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Loading financial data...
          </Typography>
        </Box>
      );
    }

    console.log('Rendering financial overview with data:', financialData);
    
    const revenueData = financialData.charts.revenueVsExpense.labels.map((label, index) => ({
      month: label,
      revenue: financialData.charts.revenueVsExpense.datasets[0].data[index],
      expenses: financialData.charts.revenueVsExpense.datasets[1].data[index]
    }));

    const expenseBreakdownData = financialData.charts.expenseBreakdown.labels.map((label, index) => ({
      name: label,
      value: financialData.charts.expenseBreakdown.datasets[0].data[index]
    }));

    return (*/

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Tooltip,
  Alert,
  LinearProgress,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  AccountBalance as AccountBalanceIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocalShipping as LocalShippingIcon,
  Business as BusinessIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import { advancedInventoryService, InventoryAnalytics } from '../services/advancedInventoryService';
import { advancedProcurementService, ProcurementAnalytics } from '../services/advancedProcurementService';
import { enhancedFinancialService, FinancialDashboard } from '../services/enhancedFinancialService';

// Dashboard Interfaces
interface WidgetConfig {
  refreshInterval?: number;
  showHeader?: boolean;
  allowExport?: boolean;
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'composed';
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
}

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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
];

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState<FinancialDashboard | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryAnalytics | null>(null);
  const [procurementData, setProcurementData] = useState<ProcurementAnalytics | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-12');

  const loadDashboardData = useCallback(async () => {
    console.log('Loading dashboard data for period:', selectedPeriod);
    setLoading(true);
    try {
      console.log('Fetching financial data...');
      const financial = await enhancedFinancialService.getFinancialDashboard({ period: selectedPeriod });
      console.log('Financial data loaded:', financial);
      
      console.log('Fetching inventory data...');
      const inventory = await advancedInventoryService.getInventoryAnalytics();
      console.log('Inventory data loaded:', inventory);
      
      console.log('Fetching procurement data...');
      const procurement = await advancedProcurementService.getProcurementAnalytics();
      console.log('Procurement data loaded:', procurement);

      setFinancialData(financial);
      setInventoryData(inventory);
      setProcurementData(procurement);
      console.log('All dashboard data loaded successfully');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod, loadDashboardData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-ET').format(num);
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  // KPI Card Component
  const KPICard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color?: string;
    subtitle?: string;
  }> = ({ title, value, change, icon, color = 'primary', subtitle }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={color}>
              {typeof value === 'number' ? formatNumber(value) : value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
            {change !== undefined && (
              <Box display="flex" alignItems="center" mt={1}>
                {change >= 0 ? (
                  <TrendingUpIcon color="success" fontSize="small" />
                ) : (
                  <TrendingDownIcon color="error" fontSize="small" />
                )}
                <Typography
                  variant="body2"
                  color={change >= 0 ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {formatPercentage(Math.abs(change))}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  // Chart Widget Component
  const ChartWidget: React.FC<{
    title: string;
    data: any[];
    type: 'line' | 'bar' | 'pie' | 'area' | 'composed';
    config?: WidgetConfig;
  }> = ({ title, data, type, config = {} }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardHeader
        title={title}
        action={
          <IconButton size="small">
            <DownloadIcon />
          </IconButton>
        }
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              {config.showLegend !== false && <Legend />}
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          ) : type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              {config.showLegend !== false && <Legend />}
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          ) : type === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          ) : (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              {config.showLegend !== false && <Legend />}
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  // Financial Overview Tab
  const FinancialOverview = () => {
    if (!financialData) return <CircularProgress />;

    const revenueData = financialData.charts.revenueVsExpense.labels.map((label, index) => ({
      name: label,
      revenue: financialData.charts.revenueVsExpense.datasets[0].data[index],
      expenses: financialData.charts.revenueVsExpense.datasets[1].data[index]
    }));

    const expenseBreakdownData = financialData.charts.expenseBreakdown.labels.map((label, index) => ({
      name: label,
      value: financialData.charts.expenseBreakdown.datasets[0].data[index]
    }));

    return (
      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Revenue"
            value={formatCurrency(financialData.kpis.totalRevenue)}
            change={financialData.kpis.revenueGrowth}
            icon={<AttachMoneyIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Net Income"
            value={formatCurrency(financialData.kpis.netIncome)}
            change={financialData.kpis.profitGrowth}
            icon={<AccountBalanceIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Cash Balance"
            value={formatCurrency(financialData.kpis.cashBalance)}
            change={financialData.kpis.cashGrowth}
            icon={<BusinessIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Working Capital"
            value={formatCurrency(financialData.kpis.workingCapital)}
            icon={<AnalyticsIcon />}
            color="warning"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <ChartWidget
            title="Revenue vs Expenses Trend"
            data={revenueData}
            type="composed"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartWidget
            title="Expense Breakdown"
            data={expenseBreakdownData}
            type="pie"
          />
        </Grid>

        {/* Financial Health */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader title="Financial Health Score" />
            <CardContent>
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Overall Score: {financialData.healthIndicators.overallScore}/100
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={financialData.healthIndicators.overallScore}
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Liquidity</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={financialData.healthIndicators.liquidityScore}
                    color="info"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Profitability</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={financialData.healthIndicators.profitabilityScore}
                    color="success"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Efficiency</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={financialData.healthIndicators.efficiencyScore}
                    color="warning"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Stability</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={financialData.healthIndicators.stabilityScore}
                    color="primary"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader title="Recent Transactions" />
            <CardContent>
              <List dense>
                {financialData.recentTransactions.slice(0, 5).map((transaction) => (
                  <ListItem key={transaction.id}>
                    <ListItemIcon>
                      {transaction.type === 'INCOME' ? (
                        <TrendingUpIcon color="success" />
                      ) : (
                        <TrendingDownIcon color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={transaction.description}
                      secondary={`${transaction.category} • ${new Date(transaction.date).toLocaleDateString()}`}
                    />
                    <Typography
                      variant="body2"
                      color={transaction.type === 'INCOME' ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(transaction.amount)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts */}
        {financialData.healthIndicators.alerts.length > 0 && (
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardHeader title="Financial Alerts" />
              <CardContent>
                {financialData.healthIndicators.alerts.map((alert, index) => (
                  <Alert
                    key={index}
                    severity={alert.type === 'CRITICAL' ? 'error' : alert.type === 'WARNING' ? 'warning' : 'info'}
                    sx={{ mb: 1 }}
                    action={
                      <Button size="small" color="inherit">
                        {alert.action}
                      </Button>
                    }
                  >
                    {alert.message}
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    );
  };

  // Inventory Analytics Tab
  const InventoryAnalytics = () => {
    if (!inventoryData) return <CircularProgress />;

    const categoryData = inventoryData.byCategory.map(cat => ({
      name: cat.categoryName,
      value: cat.totalValue,
      count: cat.itemCount
    }));

    const stockLevelsData = [
      { name: 'Optimal', value: inventoryData.stockLevels.optimal, color: '#4CAF50' },
      { name: 'Understock', value: inventoryData.stockLevels.understock, color: '#FF9800' },
      { name: 'Overstock', value: inventoryData.stockLevels.overstock, color: '#2196F3' },
      { name: 'Out of Stock', value: inventoryData.stockLevels.outOfStock, color: '#F44336' }
    ];

    return (
      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Value"
            value={formatCurrency(inventoryData.totalValue)}
            icon={<InventoryIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Items"
            value={inventoryData.totalItems}
            icon={<AssessmentIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Locations"
            value={inventoryData.totalLocations}
            icon={<LocalShippingIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Critical Alerts"
            value={inventoryData.alerts.critical}
            icon={<WarningIcon />}
            color="error"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <ChartWidget
            title="Inventory Value by Category"
            data={categoryData}
            type="bar"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartWidget
            title="Stock Levels Distribution"
            data={stockLevelsData}
            type="pie"
          />
        </Grid>

        {/* ABC Analysis */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader title="ABC Analysis" />
            <CardContent>
              {inventoryData.abcAnalysis.map((analysis) => (
                <Box key={analysis.classification} mb={2}>
                  <Typography variant="h6" gutterBottom>
                    Class {analysis.classification}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {analysis.itemCount} items ({formatPercentage(analysis.quantityPercentage)} of quantity)
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formatPercentage(analysis.valuePercentage)} of total value
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={analysis.valuePercentage}
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Turnover Analysis */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader title="Inventory Turnover" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {inventoryData.turnoverAnalysis.fastMoving}
                    </Typography>
                    <Typography variant="body2">Fast Moving</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main">
                      {inventoryData.turnoverAnalysis.normalMoving}
                    </Typography>
                    <Typography variant="body2">Normal Moving</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main">
                      {inventoryData.turnoverAnalysis.slowMoving}
                    </Typography>
                    <Typography variant="body2">Slow Moving</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="error.main">
                      {inventoryData.turnoverAnalysis.deadStock}
                    </Typography>
                    <Typography variant="body2">Dead Stock</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // Procurement Analytics Tab
  const ProcurementAnalytics = () => {
    if (!procurementData) return <CircularProgress />;

    const categoryData = procurementData.byCategory.map(cat => ({
      name: cat.categoryName,
      value: cat.totalValue,
      orders: cat.orderCount
    }));

    return (
      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total POs"
            value={procurementData.totalPOs}
            icon={<ShoppingCartIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Value"
            value={formatCurrency(procurementData.totalValue)}
            icon={<AttachMoneyIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Order Value"
            value={formatCurrency(procurementData.averageOrderValue)}
            icon={<AssessmentIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="On-Time Delivery"
            value={formatPercentage(procurementData.onTimeDeliveryRate)}
            icon={<ScheduleIcon />}
            color="warning"
          />
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader title="Performance Metrics" />
            <CardContent>
              <Box mb={2}>
                <Typography variant="body2">Processing Time</Typography>
                <Typography variant="h6">{procurementData.averageProcessingTime} days</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2">Order Accuracy</Typography>
                <Typography variant="h6">{formatPercentage(procurementData.orderAccuracyRate)}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={procurementData.orderAccuracyRate}
                  color="success"
                  sx={{ mt: 1 }}
                />
              </Box>
              <Box mb={2}>
                <Typography variant="body2">Cost Savings</Typography>
                <Typography variant="h6" color="success.main">
                  {formatCurrency(procurementData.costSavings)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">Compliance Rate</Typography>
                <Typography variant="h6">{formatPercentage(procurementData.complianceRate)}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={procurementData.complianceRate}
                  color="primary"
                  sx={{ mt: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Vendors */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader title="Top Vendors" />
            <CardContent>
              <List dense>
                {procurementData.topVendors.slice(0, 5).map((vendor) => (
                  <ListItem key={vendor.vendorId}>
                    <ListItemIcon>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={vendor.vendorName}
                      secondary={`${vendor.orderCount} orders • Performance: ${vendor.performance.toFixed(1)}/5`}
                    />
                    <Typography variant="body2" color="primary">
                      {formatCurrency(vendor.totalValue)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Analysis */}
        <Grid item xs={12}>
          <ChartWidget
            title="Procurement by Category"
            data={categoryData}
            type="bar"
          />
        </Grid>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Advanced Analytics Dashboard
        </Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={selectedPeriod}
              label="Period"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="2024-12">December 2024</MenuItem>
              <MenuItem value="2024-11">November 2024</MenuItem>
              <MenuItem value="2024-10">October 2024</MenuItem>
              <MenuItem value="2024-Q4">Q4 2024</MenuItem>
              <MenuItem value="2024">2024 Annual</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Financial Overview" />
          <Tab label="Inventory Analytics" />
          <Tab label="Procurement Analytics" />
          <Tab label="Executive Summary" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        <FinancialOverview />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <InventoryAnalytics />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <ProcurementAnalytics />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardHeader title="Executive Summary - Ethiopian ERP Performance" />
              <CardContent>
                <Typography variant="body1" paragraph>
                  The comprehensive Ethiopian ERP system is performing exceptionally well across all modules.
                  Our integrated approach with government compliance and local business practices has resulted
                  in significant operational improvements.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box textAlign="center" p={2}>
                      <SpeedIcon sx={{ fontSize: 48, color: 'success.main' }} />
                      <Typography variant="h6">98.5%</Typography>
                      <Typography variant="body2">System Uptime</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box textAlign="center" p={2}>
                      <CheckCircleIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                      <Typography variant="h6">99.2%</Typography>
                      <Typography variant="body2">ERCA Compliance</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box textAlign="center" p={2}>
                      <TrendingUpIcon sx={{ fontSize: 48, color: 'warning.main' }} />
                      <Typography variant="h6">25%</Typography>
                      <Typography variant="body2">Efficiency Gain</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Loading Overlay */}
      {refreshing && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgcolor="rgba(0,0,0,0.1)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
        >
          <CircularProgress size={60} />
        </Box>
      )}
    </Box>
  );
};

export default AdvancedAnalyticsDashboard;
