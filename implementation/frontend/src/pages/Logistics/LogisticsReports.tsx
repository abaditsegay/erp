import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import {
  Assessment as ReportsIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  LocalShipping as ShippingIcon,
  Warehouse as WarehouseIcon,
  Assignment as CustomsIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import {
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
  LineChart,
  Line,
} from 'recharts';
import logisticsService from '../../services/logisticsService';

// Chart data interfaces (local format for charts)
interface ChartStatusData {
  name: string;
  value: number;
  color: string;
}

interface ChartMonthlyData {
  month: string;
  shipments: number;
  value: number;
}

interface ChartDestinationData {
  destination: string;
  shipments: number;
  percentage: number;
}

interface ChartWarehouseData {
  warehouse: string;
  utilization: number;
  capacity: number;
}

interface ChartCustomsData {
  port: string;
  cleared: number;
  pending: number;
  avgTime: number;
}

// Mock data for reports - will be replaced with real API data
const mockShipmentStatusData: ChartStatusData[] = [
  { name: 'Delivered', value: 45, color: '#4caf50' },
  { name: 'In Transit', value: 25, color: '#2196f3' },
  { name: 'Delayed', value: 15, color: '#ff9800' },
  { name: 'Cancelled', value: 15, color: '#f44336' },
];

const mockMonthlyShipmentsData: ChartMonthlyData[] = [
  { month: 'Jan', shipments: 120, value: 2500000 },
  { month: 'Feb', shipments: 145, value: 2800000 },
  { month: 'Mar', shipments: 132, value: 2650000 },
  { month: 'Apr', shipments: 158, value: 3200000 },
  { month: 'May', shipments: 167, value: 3400000 },
  { month: 'Jun', shipments: 189, value: 3800000 },
];

const mockWarehouseUtilizationData: ChartWarehouseData[] = [
  { warehouse: 'AA-MAIN', utilization: 70, capacity: 50000 },
  { warehouse: 'DD-DIST', utilization: 72, capacity: 25000 },
  { warehouse: 'MK-HUB', utilization: 80, capacity: 15000 },
  { warehouse: 'BOL-CUST', utilization: 81, capacity: 8000 },
];

const mockCustomsClearanceData: ChartCustomsData[] = [
  { port: 'Bole Airport', cleared: 89, pending: 12, avgTime: 2.1 },
  { port: 'Dire Dawa', cleared: 45, pending: 8, avgTime: 3.2 },
  { port: 'Mekelle', cleared: 23, pending: 5, avgTime: 2.8 },
];

const mockTopDestinationsData: ChartDestinationData[] = [
  { destination: 'Addis Ababa', shipments: 156, percentage: 35 },
  { destination: 'Dire Dawa', shipments: 89, percentage: 20 },
  { destination: 'Mekelle', shipments: 67, percentage: 15 },
  { destination: 'Bahir Dar', shipments: 45, percentage: 10 },
  { destination: 'Hawassa', shipments: 34, percentage: 8 },
  { destination: 'Others', shipments: 54, percentage: 12 },
];

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LogisticsReportsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState('last_30_days');
  const [reportType, setReportType] = useState('summary');
  
  // Chart data (using mock data for demonstration)
  const chartStatusData: ChartStatusData[] = mockShipmentStatusData;
  const chartMonthlyData: ChartMonthlyData[] = mockMonthlyShipmentsData;
  const chartDestinationData: ChartDestinationData[] = mockTopDestinationsData;
  const chartWarehouseData: ChartWarehouseData[] = mockWarehouseUtilizationData;
  const chartCustomsData: ChartCustomsData[] = mockCustomsClearanceData;

  // Load dashboard data (simplified version)
  useEffect(() => {
    // TODO: Add real data loading functionality
    // For now, we use mock data
    console.log('Dashboard loaded with date range:', dateRange);
  }, [dateRange]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatCurrency = (amount: number, currency: string = 'ETB') => {
    return logisticsService.formatCurrency(amount, currency);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Logistics Reports - የሎጂስቲክስ ሪፖርቶች
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Analytics and reports for logistics operations, shipments, and performance metrics
        </Typography>
      </Box>

      {/* Report Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="last_7_days">Last 7 Days</MenuItem>
                <MenuItem value="last_30_days">Last 30 Days</MenuItem>
                <MenuItem value="last_3_months">Last 3 Months</MenuItem>
                <MenuItem value="last_year">Last Year</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="summary">Summary Report</MenuItem>
                <MenuItem value="detailed">Detailed Report</MenuItem>
                <MenuItem value="performance">Performance Report</MenuItem>
                <MenuItem value="financial">Financial Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              fullWidth
              onClick={() => alert('Export functionality will be implemented')}
            >
              Export PDF
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

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Shipments
                  </Typography>
                  <Typography variant="h4">
                    1,211
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +12% from last month
                  </Typography>
                </Box>
                <ShippingIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    On-Time Delivery
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    94.2%
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +2.1% improvement
                  </Typography>
                </Box>
                <ScheduleIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avg. Processing Time
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    2.4 days
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    -0.3 days improvement
                  </Typography>
                </Box>
                <CustomsIcon color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Value
                  </Typography>
                  <Typography variant="h5" color="secondary.main">
                    {formatCurrency(19375000)}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +18% growth
                  </Typography>
                </Box>
                <TrendingUpIcon color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for Different Report Views */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="logistics reports tabs">
            <Tab label="Shipment Analytics" icon={<ShippingIcon />} iconPosition="start" />
            <Tab label="Warehouse Reports" icon={<WarehouseIcon />} iconPosition="start" />
            <Tab label="Customs Analytics" icon={<CustomsIcon />} iconPosition="start" />
            <Tab label="Performance Metrics" icon={<ReportsIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* Shipment Analytics Tab */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Shipment Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip formatter={(value, name) => [
                        name === 'shipments' ? value : formatCurrency(Number(value)),
                        name === 'shipments' ? 'Shipments' : 'Value'
                      ]} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="shipments" fill="#2196f3" name="Shipments" />
                      <Line yAxisId="right" type="monotone" dataKey="value" stroke="#ff7300" name="Value (ETB)" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Shipment Status Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartStatusData.map((entry: ChartStatusData, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Destinations
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Destination</TableCell>
                          <TableCell align="right">Shipments</TableCell>
                          <TableCell align="right">Percentage</TableCell>
                          <TableCell align="center">Trend</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {chartDestinationData.map((destination: ChartDestinationData, index: number) => (
                          <TableRow key={destination.destination}>
                            <TableCell>{destination.destination}</TableCell>
                            <TableCell align="right">{destination.shipments}</TableCell>
                            <TableCell align="right">{destination.percentage}%</TableCell>
                            <TableCell align="center">
                              <Chip
                                label={index < 3 ? "↗ Growing" : "→ Stable"}
                                color={index < 3 ? "success" : "default"}
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

        <TabPanel value={tabValue} index={1}>
          {/* Warehouse Reports Tab */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Warehouse Utilization
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartWarehouseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="warehouse" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                      <Legend />
                      <Bar dataKey="utilization" fill="#4caf50" name="Utilization %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Warehouse Capacity Overview
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Warehouse</TableCell>
                          <TableCell align="right">Total Capacity (cbm)</TableCell>
                          <TableCell align="right">Current Utilization</TableCell>
                          <TableCell align="right">Available Space</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {chartWarehouseData.map((warehouse) => {
                          const usedSpace = Math.round((warehouse.utilization / 100) * warehouse.capacity);
                          const availableSpace = warehouse.capacity - usedSpace;
                          return (
                            <TableRow key={warehouse.warehouse}>
                              <TableCell>{warehouse.warehouse}</TableCell>
                              <TableCell align="right">{warehouse.capacity.toLocaleString()}</TableCell>
                              <TableCell align="right">{warehouse.utilization}%</TableCell>
                              <TableCell align="right">{availableSpace.toLocaleString()}</TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={warehouse.utilization > 85 ? "Near Capacity" : warehouse.utilization > 70 ? "Good" : "Available"}
                                  color={warehouse.utilization > 85 ? "warning" : warehouse.utilization > 70 ? "success" : "info"}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Customs Analytics Tab */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Customs Clearance Performance by Port
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Port of Entry</TableCell>
                          <TableCell align="right">Cleared (This Month)</TableCell>
                          <TableCell align="right">Pending</TableCell>
                          <TableCell align="right">Avg. Processing Time</TableCell>
                          <TableCell align="center">Performance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {chartCustomsData.map((port) => (
                          <TableRow key={port.port}>
                            <TableCell>{port.port}</TableCell>
                            <TableCell align="right">{port.cleared}</TableCell>
                            <TableCell align="right">{port.pending}</TableCell>
                            <TableCell align="right">{port.avgTime} days</TableCell>
                            <TableCell align="center">
                              <Chip
                                label={port.avgTime < 2.5 ? "Excellent" : port.avgTime < 3.5 ? "Good" : "Needs Improvement"}
                                color={port.avgTime < 2.5 ? "success" : port.avgTime < 3.5 ? "info" : "warning"}
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

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Customs Clearance Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartCustomsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {chartCustomsData.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Customs Revenue
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {formatCurrency(4850000)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Import duties and taxes collected
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Average Clearance Time
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    2.4 days
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Across all ports of entry
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {/* Performance Metrics Tab */}
          <Alert severity="info" sx={{ mb: 2 }}>
            Advanced performance analytics and KPI dashboard will be implemented here.
          </Alert>
          <Typography variant="body1">
            Performance metrics and KPI tracking coming soon...
          </Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default LogisticsReportsPage;
