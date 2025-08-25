/**
 * Advanced Inventory Management Component
 * Phase 1.4: Core ERP Module Enhancement
 * 
 * Features:
 * - Multi-location inventory tracking
 * - Real-time stock monitoring
 * - Automated alerts and notifications
 * - Batch and serial number tracking
 * - Advanced filtering and search
 * - Stock movement history
 * - Inventory valuation reports
 * - Ethiopian tax compliance
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tab,
  Tabs,
  Alert,
  LinearProgress,
  Tooltip,
  Badge,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  SwapHoriz as TransferIcon,
  Assignment as AdjustmentIcon,
  History as HistoryIcon,
  LocationOn as LocationIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

import {
  advancedInventoryService,
  EnhancedInventoryItem,
  InventoryLocation,
  StockMovement,
  ReorderAlert,
  InventoryAnalytics
} from '../services/advancedInventoryService';

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
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdvancedInventoryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<EnhancedInventoryItem[]>([]);
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [reorderAlerts, setReorderAlerts] = useState<ReorderAlert[]>([]);
  const [analytics, setAnalytics] = useState<InventoryAnalytics | null>(null);
  
  // Pagination and filtering
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Dialogs (for future implementation)
  const [, setItemDialogOpen] = useState(false);
  const [, setTransferDialogOpen] = useState(false);
  const [, setAdjustmentDialogOpen] = useState(false);
  const [, setSelectedItem] = useState<EnhancedInventoryItem | null>(null);

  const loadInventoryItems = useCallback(async () => {
    try {
      const filters = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined,
        locationId: selectedLocation || undefined,
        categoryId: selectedCategory || undefined,
        status: selectedStatus || undefined
      };

      const response = await advancedInventoryService.getInventoryItems(filters);
      if (response && response.items) {
        setInventoryItems(response.items);
        setTotalItems(response.total || 0);
      } else {
        setInventoryItems([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Error loading inventory items:', error);
      setInventoryItems([]);
      setTotalItems(0);
    }
  }, [page, rowsPerPage, searchTerm, selectedLocation, selectedCategory, selectedStatus]);

  // Mock functions for other load operations (will be implemented with actual APIs)
  const loadStockMovements = useCallback(async () => {
    try {
      const response = await advancedInventoryService.getStockMovements({
        limit: 50
      });
      setStockMovements(response.movements || []);
    } catch (error) {
      console.error('Error loading stock movements:', error);
      setStockMovements([]);
    }
  }, []);

  const loadReorderAlerts = useCallback(async () => {
    try {
      const alerts = await advancedInventoryService.getReorderAlerts({
        status: 'ACTIVE'
      });
      setReorderAlerts(alerts || []);
    } catch (error) {
      console.error('Error loading reorder alerts:', error);
      setReorderAlerts([]);
    }
  }, []);

  const loadLocations = useCallback(async () => {
    try {
      const locationsData = await advancedInventoryService.getLocations();
      setLocations(locationsData || []);
    } catch (error) {
      console.error('Error loading locations:', error);
      setLocations([]);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    try {
      const analyticsData = await advancedInventoryService.getInventoryAnalytics();
      setAnalytics(analyticsData || null);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setAnalytics(null);
    }
  }, []);

  const loadInventoryData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadInventoryItems(),
        loadStockMovements(),
        loadReorderAlerts()
      ]);
    } catch (error) {
      console.error('Error loading inventory data:', error);
    } finally {
      setLoading(false);
    }
  }, [loadInventoryItems, loadStockMovements, loadReorderAlerts]);

  useEffect(() => {
    loadInventoryData();
    loadLocations();
    loadAnalytics();
  }, [loadInventoryData, loadLocations, loadAnalytics]);

  useEffect(() => {
    loadInventoryItems();
  }, [loadInventoryItems]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
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

  const getStockStatusColor = (item: EnhancedInventoryItem): string => {
    if (item.availableStock <= item.minStockLevel) return 'error';
    if (item.availableStock <= item.reorderPoint) return 'warning';
    if (item.availableStock >= item.maxStockLevel) return 'info';
    return 'success';
  };

  const getStockStatusText = (item: EnhancedInventoryItem): string => {
    if (item.availableStock <= item.minStockLevel) return 'Low Stock';
    if (item.availableStock <= item.reorderPoint) return 'Reorder Point';
    if (item.availableStock >= item.maxStockLevel) return 'Overstock';
    return 'In Stock';
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await advancedInventoryService.acknowledgeAlert(alertId);
      loadReorderAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  // Inventory Items Tab
  const InventoryItemsTab = () => (
    <Box>
      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search items..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={selectedLocation}
                  label="Location"
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <MenuItem value="">All Locations</MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="RAW_MATERIAL">Raw Materials</MenuItem>
                  <MenuItem value="FINISHED_GOODS">Finished Goods</MenuItem>
                  <MenuItem value="SPARE_PARTS">Spare Parts</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                  <MenuItem value="DISCONTINUED">Discontinued</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setItemDialogOpen(true)}
                >
                  Add Item
                </Button>
                <IconButton onClick={loadInventoryData}>
                  <RefreshIcon />
                </IconButton>
                <IconButton>
                  <DownloadIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Inventory Items Table */}
      <Card>
        <CardHeader
          title="Inventory Items"
          subheader={`${totalItems} items total`}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Available Stock</TableCell>
                <TableCell align="right">Reserved</TableCell>
                <TableCell align="right">Unit Cost</TableCell>
                <TableCell align="right">Total Value</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={item.category.name} 
                      size="small" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Typography variant="body2">
                        {formatNumber(item.availableStock)} {item.unit}
                      </Typography>
                      <Chip
                        label={getStockStatusText(item)}
                        size="small"
                        color={getStockStatusColor(item) as any}
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(item.reservedStock)} {item.unit}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.averageCost)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.availableStock * item.averageCost)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      size="small"
                      color={item.status === 'ACTIVE' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.locations.length} location(s)
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit Item">
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setSelectedItem(item);
                          setItemDialogOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Transfer Stock">
                      <IconButton 
                        size="small"
                        onClick={() => {
                          setSelectedItem(item);
                          setTransferDialogOpen(true);
                        }}
                      >
                        <TransferIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Adjust Stock">
                      <IconButton 
                        size="small"
                        onClick={() => {
                          setSelectedItem(item);
                          setAdjustmentDialogOpen(true);
                        }}
                      >
                        <AdjustmentIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  );

  // Stock Movements Tab
  const StockMovementsTab = () => (
    <Box>
      <Card>
        <CardHeader
          title="Recent Stock Movements"
          action={
            <Button startIcon={<HistoryIcon />} onClick={loadStockMovements}>
              Refresh
            </Button>
          }
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Movement Type</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Cost</TableCell>
                <TableCell align="right">Total Value</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    {new Date(movement.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {movement.itemName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {movement.movementType === 'RECEIPT' ? (
                        <TrendingUpIcon color="success" fontSize="small" />
                      ) : (
                        <TrendingDownIcon color="error" fontSize="small" />
                      )}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {movement.movementType}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {movement.fromLocationName || '-'}
                  </TableCell>
                  <TableCell>
                    {movement.toLocationName || '-'}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(movement.quantity)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(movement.unitCost)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(movement.totalValue)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {movement.referenceNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={movement.status}
                      size="small"
                      color={movement.status === 'COMPLETED' ? 'success' : 'default'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );

  // Alerts Tab
  const AlertsTab = () => (
    <Box>
      <Grid container spacing={3}>
        {reorderAlerts.map((alert) => (
          <Grid item xs={12} key={alert.id}>
            <Alert
              severity={getAlertSeverityColor(alert.severity) as any}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => handleAcknowledgeAlert(alert.id)}
                >
                  Acknowledge
                </Button>
              }
            >
              <Typography variant="subtitle2" gutterBottom>
                {alert.alertType}: {alert.itemName}
              </Typography>
              <Typography variant="body2">
                {alert.message}
              </Typography>
              <Typography variant="caption" display="block">
                Location: {alert.locationName} • Current Stock: {alert.currentStock} • 
                Reorder Point: {alert.reorderPoint}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Suggested Action: {alert.suggestedAction}
              </Typography>
            </Alert>
          </Grid>
        ))}
        {reorderAlerts.length === 0 && (
          <Grid item xs={12}>
            <Box textAlign="center" py={4}>
              <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Active Alerts
              </Typography>
              <Typography color="textSecondary">
                All inventory levels are within normal ranges.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  // Analytics Tab
  const AnalyticsTab = () => {
    if (!analytics) return <Typography>Loading analytics...</Typography>;

    return (
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <InventoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {formatCurrency(analytics.totalValue)}
                  </Typography>
                  <Typography color="textSecondary">
                    Total Value
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <AssessmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {formatNumber(analytics.totalItems)}
                  </Typography>
                  <Typography color="textSecondary">
                    Total Items
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <LocationIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {formatNumber(analytics.totalLocations)}
                  </Typography>
                  <Typography color="textSecondary">
                    Locations
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {formatNumber(analytics.alerts.critical + analytics.alerts.high)}
                  </Typography>
                  <Typography color="textSecondary">
                    Critical Alerts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ABC Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="ABC Analysis" />
            <CardContent>
              {analytics.abcAnalysis.map((analysis) => (
                <Box key={analysis.classification} mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">
                      Class {analysis.classification}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {analysis.itemCount} items
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={analysis.valuePercentage}
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    {analysis.valuePercentage.toFixed(1)}% of total value
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Stock Levels */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Stock Level Distribution" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {analytics.stockLevels.optimal}
                    </Typography>
                    <Typography variant="body2">Optimal</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main">
                      {analytics.stockLevels.understock}
                    </Typography>
                    <Typography variant="body2">Understock</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main">
                      {analytics.stockLevels.overstock}
                    </Typography>
                    <Typography variant="body2">Overstock</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="error.main">
                      {analytics.stockLevels.outOfStock}
                    </Typography>
                    <Typography variant="body2">Out of Stock</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Advanced Inventory Management
        </Typography>
        <Badge badgeContent={reorderAlerts.length} color="error">
          <IconButton>
            <WarningIcon />
          </IconButton>
        </Badge>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Inventory Items" />
          <Tab label="Stock Movements" />
          <Tab label={`Alerts (${reorderAlerts.length})`} />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        <InventoryItemsTab />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <StockMovementsTab />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <AlertsTab />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <AnalyticsTab />
      </TabPanel>

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
          <LinearProgress />
        </Box>
      )}
    </Box>
  );
};

export default AdvancedInventoryManagement;
