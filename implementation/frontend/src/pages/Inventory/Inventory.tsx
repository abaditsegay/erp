import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warehouse,
  TrendingDown,
  TrendingUp,
  Warning,
  AccountBalance,
  LocalShipping,
  Analytics,
  Add,
  Refresh,
  Visibility,
  Edit,
  AttachMoney,
  Public,
} from '@mui/icons-material';
import { useDemoInventoryDashboard, useDemoWarehouses } from '../../hooks/useDemoInventory';
import { ethiopianHelpers } from '../../services/inventoryService';
import { ETHIOPIAN_REGIONS } from '../../types/inventory';

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

const Inventory: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [activeTab, setActiveTab] = useState(0);

  const {
    dashboard,
    lowStock,
    valuationEtb,
    pendingCustoms,
    isLoading,
    hasError,
  } = useDemoInventoryDashboard();

  const { data: warehouses, isLoading: warehousesLoading } = useDemoWarehouses();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Ethiopian Inventory Dashboard...
        </Typography>
      </Box>
    );
  }

  if (hasError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load inventory data. Please try again later.
      </Alert>
    );
  }

  const filteredWarehouses = warehouses?.filter(warehouse => 
    selectedRegion === 'All' || warehouse.region === selectedRegion
  ) || [];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
          <InventoryIcon sx={{ mr: 2, fontSize: 40 }} />
          Ethiopian Inventory Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Region</InputLabel>
            <Select
              value={selectedRegion}
              label="Region"
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <MenuItem value="All">All Regions</MenuItem>
              {ETHIOPIAN_REGIONS.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => console.log('Add item')}
          >
            Add Item
          </Button>
          <Tooltip title="Refresh Data">
            <IconButton onClick={() => window.location.reload()}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Currency Conversion Alert */}
      {valuationEtb.data && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          icon={<AttachMoney />}
        >
          <Typography variant="body2">
            <strong>Current Exchange Rate:</strong> 1 USD = {valuationEtb.data.exchangeRate.toFixed(2)} ETB
            &nbsp;|&nbsp;
            <strong>Total Inventory Value:</strong> {ethiopianHelpers.formatUsd(valuationEtb.data.totalValueUsd)} 
            ({ethiopianHelpers.formatEtb(valuationEtb.data.totalValueEtb)})
          </Typography>
        </Alert>
      )}

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Items
                  </Typography>
                  <Typography variant="h4">
                    {dashboard.data?.totalItems || 0}
                  </Typography>
                </Box>
                <InventoryIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Warehouses
                  </Typography>
                  <Typography variant="h4">
                    {filteredWarehouses.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedRegion === 'All' ? 'All Regions' : selectedRegion}
                  </Typography>
                </Box>
                <Warehouse color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Low Stock Items
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {lowStock.data?.length || 0}
                  </Typography>
                </Box>
                <Warning color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Customs
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {pendingCustoms.data?.length || 0}
                  </Typography>
                </Box>
                <LocalShipping color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for Different Sections */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="inventory tabs">
          <Tab label="Warehouses" icon={<Warehouse />} />
          <Tab label="Low Stock Alerts" icon={<Warning />} />
          <Tab label="Customs Clearance" icon={<LocalShipping />} />
          <Tab label="Analytics" icon={<Analytics />} />
        </Tabs>
      </Paper>

      {/* Warehouses Tab */}
      <TabPanel value={activeTab} index={0}>
        {warehousesLoading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {filteredWarehouses.map((warehouse) => (
              <Grid item xs={12} md={6} lg={4} key={warehouse.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {warehouse.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {warehouse.address}
                    </Typography>
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Chip
                        label={ethiopianHelpers.getWarehouseTypeDisplay(warehouse.type)}
                        color="primary"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip
                        label={warehouse.region}
                        color="secondary"
                        size="small"
                        icon={<Public />}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">
                        Capacity: {warehouse.capacity?.toLocaleString() || 'N/A'}
                      </Typography>
                      <Chip
                        label={warehouse.isActive ? 'Active' : 'Inactive'}
                        color={warehouse.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<Visibility />}>
                      View Stock
                    </Button>
                    <Button size="small" startIcon={<Edit />}>
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Low Stock Alerts Tab */}
      <TabPanel value={activeTab} index={1}>
        {lowStock.data && lowStock.data.length > 0 ? (
          <List>
            {lowStock.data.map((stock, index) => (
              <React.Fragment key={stock.id}>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${stock.item.name} (${stock.item.sku})`}
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          Current Stock: {stock.currentQuantity} | Minimum: {stock.minimumQuantity}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Warehouse: {stock.warehouse?.name || 'N/A'} ({stock.warehouse?.region || 'N/A'})
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" color="warning.main">
                      {stock.currentQuantity}
                    </Typography>
                    <Button size="small" variant="outlined" sx={{ mt: 1 }}>
                      Reorder
                    </Button>
                  </Box>
                </ListItem>
                {index < lowStock.data.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Alert severity="success">
            <Typography variant="h6">No Low Stock Items</Typography>
            <Typography>All items are above minimum stock levels.</Typography>
          </Alert>
        )}
      </TabPanel>

      {/* Customs Clearance Tab */}
      <TabPanel value={activeTab} index={2}>
        {pendingCustoms.data && pendingCustoms.data.length > 0 ? (
          <List>
            {pendingCustoms.data.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <ListItemIcon>
                    <LocalShipping color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${item.name} (${item.sku})`}
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          Category: {item.category}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Value: {ethiopianHelpers.formatUsd(item.unitPriceUsd)}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label="Pending Customs"
                      color="error"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <br />
                    <Button size="small" variant="outlined">
                      Track Status
                    </Button>
                  </Box>
                </ListItem>
                {index < pendingCustoms.data.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Alert severity="success">
            <Typography variant="h6">No Pending Customs Items</Typography>
            <Typography>All items have cleared customs successfully.</Typography>
          </Alert>
        )}
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Inventory Turnover
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <TrendingUp color="success" sx={{ mr: 1 }} />
                  <Typography variant="h4" color="success.main">
                    {dashboard.data?.inventoryTurnover?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Times per year
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Days Sales Inventory
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <TrendingDown color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h4" color="warning.main">
                    {dashboard.data?.daysSalesInventory?.toFixed(0) || '0'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Days
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                  <Button variant="outlined" startIcon={<Analytics />}>
                    ABC Analysis Report
                  </Button>
                  <Button variant="outlined" startIcon={<TrendingDown />}>
                    Slow Moving Items
                  </Button>
                  <Button variant="outlined" startIcon={<AccountBalance />}>
                    Stock Count Procedure
                  </Button>
                  <Button variant="outlined" startIcon={<AttachMoney />}>
                    Valuation Report (ETB)
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Inventory;
