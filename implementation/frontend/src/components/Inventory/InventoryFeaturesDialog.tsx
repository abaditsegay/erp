import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  Close,
  TrendingDown,
  AccountBalance,
  AttachMoney,
  Assessment,
  Assignment,
  LocalShipping,
  Refresh,
  Download,
  ReorderSharp,
} from '@mui/icons-material';
import {
  SlowMovingItem,
  StockCountData,
  ValuationReport,
  TaskStatus,
  ReorderRequest
} from '../../types/inventoryAnalytics';
import { ethiopianInventoryAnalyticsService } from '../../services/ethiopianInventoryAnalyticsService';

interface InventoryFeaturesDialogProps {
  open: boolean;
  onClose: () => void;
  feature: 'slow_moving' | 'stock_count' | 'valuation' | 'task_status' | 'reorder';
  warehouseId?: number;
  itemId?: number;
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
      id={`features-tabpanel-${index}`}
      aria-labelledby={`features-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const InventoryFeaturesDialog: React.FC<InventoryFeaturesDialogProps> = ({
  open,
  onClose,
  feature,
  warehouseId,
  itemId
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Data states for different features
  const [slowMovingItems, setSlowMovingItems] = useState<SlowMovingItem[]>([]);
  const [stockCountData, setStockCountData] = useState<StockCountData[]>([]);
  const [valuationReport, setValuationReport] = useState<ValuationReport | null>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatus[]>([]);
  const [reorderRequests, setReorderRequests] = useState<ReorderRequest[]>([]);

  // Form states
  const [dayThreshold, setDayThreshold] = useState(90);
  const [valuationMethod, setValuationMethod] = useState('weighted_average');
  const [reorderQuantity, setReorderQuantity] = useState(100);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, feature, warehouseId, itemId]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      switch (feature) {
        case 'slow_moving':
          const slowItems = await ethiopianInventoryAnalyticsService.getSlowMovingItems(dayThreshold);
          setSlowMovingItems(slowItems);
          break;
        case 'stock_count':
          const countData = await ethiopianInventoryAnalyticsService.getStockCountData(warehouseId);
          setStockCountData(countData);
          break;
        case 'valuation':
          const valuation = await ethiopianInventoryAnalyticsService.getValuationReport(warehouseId, valuationMethod);
          setValuationReport(valuation);
          break;
        case 'task_status':
          const tasks = await ethiopianInventoryAnalyticsService.getTaskStatus();
          setTaskStatus(tasks);
          break;
        case 'reorder':
          const reorders = await ethiopianInventoryAnalyticsService.getPendingReorderRequests();
          setReorderRequests(reorders);
          break;
        default:
          break;
      }
    } catch (err) {
      setError(`Failed to load ${feature.replace('_', ' ')} data`);
      console.error(`Error fetching ${feature}:`, err);
    } finally {
      setLoading(false);
    }
  }, [feature, warehouseId, dayThreshold, valuationMethod]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleExport = () => {
    console.log(`Exporting ${feature} data`);
  };

  const getFeatureTitle = () => {
    switch (feature) {
      case 'slow_moving': return 'Slow Moving Items Analysis';
      case 'stock_count': return 'Stock Count Procedures';
      case 'valuation': return 'Inventory Valuation Report (ETB)';
      case 'task_status': return 'Task Status Management';
      case 'reorder': return 'Reorder Management';
      default: return 'Inventory Feature';
    }
  };

  const getFeatureIcon = () => {
    switch (feature) {
      case 'slow_moving': return <TrendingDown />;
      case 'stock_count': return <AccountBalance />;
      case 'valuation': return <AttachMoney />;
      case 'task_status': return <Assignment />;
      case 'reorder': return <ReorderSharp />;
      default: return <Assessment />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'cleared':
      case 'approved':
      case 'delivered':
        return 'success';
      case 'in_progress':
      case 'pending':
      case 'submitted':
        return 'warning';
      case 'overdue':
      case 'cancelled':
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleCreateReorder = async () => {
    if (!itemId) return;
    try {
      await ethiopianInventoryAnalyticsService.createReorderRequest(itemId, reorderQuantity, 'Created from inventory management');
      fetchData();
    } catch (err) {
      console.error('Error creating reorder:', err);
    }
  };

  const renderSlowMovingItems = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Days Threshold"
            type="number"
            value={dayThreshold}
            onChange={(e) => setDayThreshold(parseInt(e.target.value) || 90)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button variant="outlined" onClick={fetchData} fullWidth>
            Refresh Analysis
          </Button>
        </Grid>
      </Grid>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Found {slowMovingItems.length} items with no movement for {dayThreshold}+ days. 
          Consider promotional activities or liquidation strategies.
        </Typography>
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Details</TableCell>
              <TableCell align="right">Days Since Last Movement</TableCell>
              <TableCell align="right">Current Stock</TableCell>
              <TableCell align="right">Total Value</TableCell>
              <TableCell>Recommended Action</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Warehouse</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slowMovingItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {item.item.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    SKU: {item.item.sku} | {item.categoryName}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6" color="warning.main">
                    {item.daysSinceLastMovement}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {item.quantityOnHand.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    ${item.totalValue.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    ETB {item.totalValueEtb.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.recommendedAction.replace('_', ' ').toUpperCase()}
                    color={
                      item.recommendedAction === 'promotion' ? 'info' :
                      item.recommendedAction === 'liquidation' ? 'warning' :
                      item.recommendedAction === 'write_off' ? 'error' : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.priority.toUpperCase()}
                    color={getPriorityColor(item.priority) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{item.warehouseName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderStockCount = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {stockCountData.map((count) => (
          <Grid item xs={12} key={count.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {count.countType.replace('_', ' ').toUpperCase()} Count - {count.warehouseName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Scheduled: {new Date(count.scheduledDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip
                    label={count.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(count.status) as any}
                  />
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="textSecondary">Items to Count</Typography>
                    <Typography variant="h6">{count.itemsToCount}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="textSecondary">Items Counted</Typography>
                    <Typography variant="h6">{count.itemsCounted}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="textSecondary">Variances Found</Typography>
                    <Typography variant="h6" color={count.variancesFound > 0 ? 'error.main' : 'success.main'}>
                      {count.variancesFound}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="textSecondary">Variance Value</Typography>
                    <Typography variant="h6" color={count.totalVarianceValue !== 0 ? 'error.main' : 'success.main'}>
                      ${Math.abs(count.totalVarianceValue).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Progress: {((count.itemsCounted / count.itemsToCount) * 100).toFixed(1)}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(count.itemsCounted / count.itemsToCount) * 100} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                {count.notes && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">{count.notes}</Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderValuationReport = () => (
    <Box sx={{ p: 3 }}>
      {valuationReport && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Valuation Method</InputLabel>
                <Select
                  value={valuationMethod}
                  label="Valuation Method"
                  onChange={(e) => setValuationMethod(e.target.value)}
                >
                  <MenuItem value="fifo">FIFO (First In, First Out)</MenuItem>
                  <MenuItem value="lifo">LIFO (Last In, First Out)</MenuItem>
                  <MenuItem value="weighted_average">Weighted Average</MenuItem>
                  <MenuItem value="standard_cost">Standard Cost</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="outlined" onClick={fetchData} fullWidth>
                Refresh Report
              </Button>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Exchange Rate:</strong> 1 USD = {valuationReport.exchangeRate.toFixed(2)} ETB
              &nbsp;|&nbsp;
              <strong>Report Date:</strong> {new Date(valuationReport.reportDate).toLocaleDateString()}
              &nbsp;|&nbsp;
              <strong>Method:</strong> {valuationMethod.replace('_', ' ').toUpperCase()}
            </Typography>
          </Alert>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary.main">
                    Total Items
                  </Typography>
                  <Typography variant="h4">
                    {valuationReport.summary.totalItemsCount.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="success.main">
                    Total Value (USD)
                  </Typography>
                  <Typography variant="h4">
                    ${valuationReport.summary.totalValueUsd.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="warning.main">
                    Total Value (ETB)
                  </Typography>
                  <Typography variant="h4">
                    ETB {valuationReport.summary.totalValueEtb.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="By Category" />
            <Tab label="By Warehouse" />
            <Tab label="Summary" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Item Count</TableCell>
                    <TableCell align="right">Total Quantity</TableCell>
                    <TableCell align="right">Value (USD)</TableCell>
                    <TableCell align="right">Value (ETB)</TableCell>
                    <TableCell align="right">% of Total</TableCell>
                    <TableCell align="right">Avg Unit Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {valuationReport.categories.map((category) => (
                    <TableRow key={category.categoryId} hover>
                      <TableCell>{category.categoryName}</TableCell>
                      <TableCell align="right">{category.itemCount}</TableCell>
                      <TableCell align="right">{category.totalQuantity.toLocaleString()}</TableCell>
                      <TableCell align="right">${category.totalValueUsd.toLocaleString()}</TableCell>
                      <TableCell align="right">ETB {category.totalValueEtb.toLocaleString()}</TableCell>
                      <TableCell align="right">{category.percentageOfTotal.toFixed(1)}%</TableCell>
                      <TableCell align="right">${category.averageUnitPrice.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Warehouse</TableCell>
                    <TableCell>Region</TableCell>
                    <TableCell align="right">Item Count</TableCell>
                    <TableCell align="right">Value (USD)</TableCell>
                    <TableCell align="right">Value (ETB)</TableCell>
                    <TableCell align="right">Utilization</TableCell>
                    <TableCell>Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {valuationReport.warehouses.map((warehouse) => (
                    <TableRow key={warehouse.warehouseId} hover>
                      <TableCell>{warehouse.warehouseName}</TableCell>
                      <TableCell>{warehouse.region}</TableCell>
                      <TableCell align="right">{warehouse.itemCount}</TableCell>
                      <TableCell align="right">${warehouse.totalValueUsd.toLocaleString()}</TableCell>
                      <TableCell align="right">ETB {warehouse.totalValueEtb.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${warehouse.utilizationPercentage}%`}
                          color={warehouse.utilizationPercentage > 85 ? 'error' : warehouse.utilizationPercentage > 70 ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(warehouse.lastUpdated).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Key Insights</Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Highest Value Category"
                          secondary={valuationReport.summary.highestValueCategory}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Most Active Warehouse"
                          secondary={valuationReport.summary.mostActiveWarehouse}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Average Item Value"
                          secondary={`$${valuationReport.summary.averageItemValue.toLocaleString()}`}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Total Inventory Quantity"
                          secondary={`${valuationReport.summary.totalQuantity.toLocaleString()} units`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Least Active Warehouse"
                          secondary={valuationReport.summary.leastActiveWarehouse}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Last Valuation"
                          secondary={new Date(valuationReport.summary.lastValuationDate).toLocaleDateString()}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </>
      )}
    </Box>
  );

  const renderTaskStatus = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {taskStatus.map((task) => (
          <Grid item xs={12} md={6} key={task.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {task.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {task.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                    <Chip
                      label={task.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(task.status) as any}
                      size="small"
                    />
                    <Chip
                      label={task.priority.toUpperCase()}
                      color={getPriorityColor(task.priority) as any}
                      size="small"
                    />
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Assigned To</Typography>
                    <Typography variant="body2">{task.assignedTo}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Due Date</Typography>
                    <Typography variant="body2">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Task Type</Typography>
                    <Typography variant="body2">
                      {task.taskType.replace('_', ' ').toUpperCase()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">Progress</Typography>
                    <Typography variant="body2">{task.progress}%</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={task.progress} 
                    sx={{ height: 8, borderRadius: 4 }}
                    color={
                      task.status === 'completed' ? 'success' :
                      task.status === 'overdue' ? 'error' :
                      task.progress > 75 ? 'info' : 'primary'
                    }
                  />
                </Box>

                {task.relatedItemName && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocalShipping fontSize="small" color="action" />
                    <Typography variant="body2" color="textSecondary">
                      Related Item: {task.relatedItemName}
                    </Typography>
                  </Box>
                )}

                {task.relatedWarehouseName && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AccountBalance fontSize="small" color="action" />
                    <Typography variant="body2" color="textSecondary">
                      Warehouse: {task.relatedWarehouseName}
                    </Typography>
                  </Box>
                )}

                {task.notes && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">{task.notes}</Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderReorderManagement = () => (
    <Box sx={{ p: 3 }}>
      {itemId && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Create New Reorder Request</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Reorder Quantity"
                  type="number"
                  value={reorderQuantity}
                  onChange={(e) => setReorderQuantity(parseInt(e.target.value) || 100)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button variant="contained" onClick={handleCreateReorder} fullWidth>
                  Create Reorder Request
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Typography variant="h6" gutterBottom>Pending Reorder Requests</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Details</TableCell>
              <TableCell align="right">Current Stock</TableCell>
              <TableCell align="right">Reorder Level</TableCell>
              <TableCell align="right">Requested Qty</TableCell>
              <TableCell align="right">Total Cost</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Expected Delivery</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reorderRequests.map((request) => (
              <TableRow key={request.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {request.itemName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    SKU: {request.itemSku}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color={request.currentStock <= request.reorderLevel ? 'error.main' : 'inherit'}>
                    {request.currentStock}
                  </Typography>
                </TableCell>
                <TableCell align="right">{request.reorderLevel}</TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    {request.requestedQuantity}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    ${request.totalCost.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    ETB {request.totalCostEtb.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>{request.supplierName}</TableCell>
                <TableCell>
                  <Chip
                    label={request.priority.toUpperCase()}
                    color={getPriorityColor(request.priority) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={request.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(request.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(request.expectedDeliveryDate).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderContent = () => {
    switch (feature) {
      case 'slow_moving':
        return renderSlowMovingItems();
      case 'stock_count':
        return renderStockCount();
      case 'valuation':
        return renderValuationReport();
      case 'task_status':
        return renderTaskStatus();
      case 'reorder':
        return renderReorderManagement();
      default:
        return <Typography>Feature not implemented</Typography>;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xl" 
      fullWidth
      PaperProps={{ sx: { height: '90vh' } }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getFeatureIcon()}
            <Typography variant="h6" sx={{ ml: 2 }}>
              {getFeatureTitle()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={fetchData} disabled={loading}>
              <Refresh />
            </IconButton>
            <IconButton onClick={handleExport}>
              <Download />
            </IconButton>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        ) : (
          renderContent()
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handleExport} startIcon={<Download />}>
          Export Data
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryFeaturesDialog;
