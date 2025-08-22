import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Warehouse as WarehouseIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  LocationOn as LocationIcon,
  Storage as StorageIcon,
  LocalShipping as ShippingIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

import AddWarehouseDialog from '../../components/Logistics/AddWarehouseDialog';

// Mock data for Ethiopian warehouses
const mockWarehouses = [
  {
    id: 'WH001',
    name: 'Addis Ababa Main Warehouse',
    code: 'AA-MAIN',
    location: 'Addis Ababa, Ethiopia',
    region: 'Addis Ababa',
    type: 'MAIN_WAREHOUSE',
    capacity: { total: 50000, used: 35000, unit: 'cbm' },
    status: 'active',
    manager: 'Alemayehu Tadesse',
    contact: '+251-11-555-0001',
    specialization: ['Electronics', 'Pharmaceuticals', 'Textiles'],
    temperature_controlled: true,
    customs_bonded: true,
    last_inspection: new Date('2024-01-10'),
    compliance_score: 95,
  },
  {
    id: 'WH002',
    name: 'Dire Dawa Distribution Center',
    code: 'DD-DIST',
    location: 'Dire Dawa, Ethiopia',
    region: 'Dire Dawa',
    type: 'DISTRIBUTION_CENTER',
    capacity: { total: 25000, used: 18000, unit: 'cbm' },
    status: 'active',
    manager: 'Birtukan Mekonnen',
    contact: '+251-25-555-0002',
    specialization: ['Agricultural Products', 'Machinery'],
    temperature_controlled: false,
    customs_bonded: true,
    last_inspection: new Date('2024-01-05'),
    compliance_score: 88,
  },
  {
    id: 'WH003',
    name: 'Mekelle Regional Hub',
    code: 'MK-HUB',
    location: 'Mekelle, Tigray',
    region: 'Tigray',
    type: 'REGIONAL_HUB',
    capacity: { total: 15000, used: 12000, unit: 'cbm' },
    status: 'active',
    manager: 'Tsegay Gebrehiwot',
    contact: '+251-34-555-0003',
    specialization: ['Mining Equipment', 'Construction Materials'],
    temperature_controlled: false,
    customs_bonded: false,
    last_inspection: new Date('2023-12-28'),
    compliance_score: 92,
  },
  {
    id: 'WH004',
    name: 'Bole Airport Customs Warehouse',
    code: 'BOL-CUST',
    location: 'Bole International Airport, Addis Ababa',
    region: 'Addis Ababa',
    type: 'CUSTOMS_WAREHOUSE',
    capacity: { total: 8000, used: 6500, unit: 'cbm' },
    status: 'active',
    manager: 'Hanna Wolde',
    contact: '+251-11-555-0004',
    specialization: ['Import Processing', 'Transit Goods'],
    temperature_controlled: true,
    customs_bonded: true,
    last_inspection: new Date('2024-01-15'),
    compliance_score: 98,
  }
];

const mockInventoryItems = [
  {
    id: 'INV001',
    sku: 'ELEC-001',
    name: 'Samsung Galaxy Smartphones',
    warehouse: 'WH001',
    zone: 'A-01',
    quantity: 500,
    unit: 'units',
    value: { amount: 2500000, currency: 'ETB' },
    status: 'available',
    last_movement: new Date('2024-01-20'),
    movement_type: 'inbound',
    supplier: 'Samsung Ethiopia',
    batch: 'BTH-2024-001',
    expiry_date: null,
  },
  {
    id: 'INV002',
    sku: 'PHARM-001',
    name: 'Paracetamol Tablets',
    warehouse: 'WH001',
    zone: 'B-03',
    quantity: 10000,
    unit: 'boxes',
    value: { amount: 150000, currency: 'ETB' },
    status: 'available',
    last_movement: new Date('2024-01-18'),
    movement_type: 'inbound',
    supplier: 'Epharm',
    batch: 'BTH-2024-002',
    expiry_date: new Date('2026-01-01'),
  },
  {
    id: 'INV003',
    sku: 'AGR-001',
    name: 'Fertilizer - NPK',
    warehouse: 'WH002',
    zone: 'C-01',
    quantity: 200,
    unit: 'tons',
    value: { amount: 800000, currency: 'ETB' },
    status: 'reserved',
    last_movement: new Date('2024-01-15'),
    movement_type: 'outbound',
    supplier: 'Ethiopian Fertilizer',
    batch: 'BTH-2024-003',
    expiry_date: null,
  }
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
      id={`warehouse-tabpanel-${index}`}
      aria-labelledby={`warehouse-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'success';
    case 'maintenance': return 'warning';
    case 'inactive': return 'error';
    case 'available': return 'success';
    case 'reserved': return 'warning';
    case 'out_of_stock': return 'error';
    default: return 'default';
  }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: currency === 'ETB' ? 'ETB' : 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

const getCapacityPercentage = (used: number, total: number) => {
  return Math.round((used / total) * 100);
};

const WarehouseManagementPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [warehouses, setWarehouses] = useState(mockWarehouses);
  const [inventoryItems] = useState(mockInventoryItems);
  const [filteredWarehouses, setFilteredWarehouses] = useState(mockWarehouses);
  const [filteredInventory] = useState(mockInventoryItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addWarehouseOpen, setAddWarehouseOpen] = useState(false);

  // Filter warehouses based on search and region
  useEffect(() => {
    let filtered = warehouses;

    if (searchTerm) {
      filtered = filtered.filter(warehouse =>
        warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warehouse.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (regionFilter !== 'all') {
      filtered = filtered.filter(warehouse => warehouse.region === regionFilter);
    }

    setFilteredWarehouses(filtered);
  }, [searchTerm, regionFilter, warehouses]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewWarehouse = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setDialogOpen(true);
  };

  const handleAddWarehouse = (warehouseData: any) => {
    const newWarehouse = {
      ...warehouseData,
      id: `WH${Date.now().toString().slice(-3)}`,
      status: 'active',
      capacity: {
        total: warehouseData.capacity?.total || 1000,
        used: 0,
        available: warehouseData.capacity?.total || 1000,
      },
      lastActivity: new Date(),
      inventoryValue: 0,
      manager: warehouseData.manager || 'TBD',
    };
    setWarehouses(prev => [newWarehouse, ...prev]);
    setFilteredWarehouses(prev => [newWarehouse, ...prev]);
  };

  // Calculate totals
  const totalCapacity = warehouses.reduce((sum, wh) => sum + wh.capacity.total, 0);
  const totalUsed = warehouses.reduce((sum, wh) => sum + wh.capacity.used, 0);
  const averageUtilization = Math.round((totalUsed / totalCapacity) * 100);
  const activeWarehouses = warehouses.filter(wh => wh.status === 'active').length;

  // Ethiopian regions for filter
  const ethiopianRegions = [
    'Addis Ababa', 'Dire Dawa', 'Tigray', 'Afar', 'Amhara', 'Oromia',
    'Somali', 'Benishangul-Gumuz', 'SNNP', 'Gambela', 'Harari', 'Sidama'
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Warehouse Management - የመጋዘን አስተዳደር
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage warehouses, inventory, and storage operations across Ethiopia
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Warehouses
                  </Typography>
                  <Typography variant="h4">
                    {activeWarehouses}
                  </Typography>
                </Box>
                <WarehouseIcon color="primary" sx={{ fontSize: 40 }} />
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
                    Total Capacity
                  </Typography>
                  <Typography variant="h4">
                    {(totalCapacity / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    cbm
                  </Typography>
                </Box>
                <StorageIcon color="info" sx={{ fontSize: 40 }} />
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
                    Utilization
                  </Typography>
                  <Typography variant="h4" color={averageUtilization > 80 ? 'warning.main' : 'success.main'}>
                    {averageUtilization}%
                  </Typography>
                </Box>
                <AssessmentIcon color={averageUtilization > 80 ? 'warning' : 'success'} sx={{ fontSize: 40 }} />
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
                    Inventory Items
                  </Typography>
                  <Typography variant="h4">
                    {inventoryItems.length}
                  </Typography>
                </Box>
                <InventoryIcon color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="warehouse management tabs">
            <Tab label="Warehouses" icon={<WarehouseIcon />} iconPosition="start" />
            <Tab label="Inventory" icon={<InventoryIcon />} iconPosition="start" />
            <Tab label="Movements" icon={<ShippingIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* Warehouse List Tab */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search warehouses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Region</InputLabel>
                  <Select
                    value={regionFilter}
                    label="Region"
                    onChange={(e) => setRegionFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Regions</MenuItem>
                    {ethiopianRegions.map((region) => (
                      <MenuItem key={region} value={region}>{region}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  fullWidth
                  onClick={() => setAddWarehouseOpen(true)}
                >
                  Add Warehouse
                </Button>
              </Grid>
            </Grid>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Warehouse</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Utilization</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredWarehouses.map((warehouse) => {
                  const utilization = getCapacityPercentage(warehouse.capacity.used, warehouse.capacity.total);
                  return (
                    <TableRow key={warehouse.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {warehouse.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {warehouse.code}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body2">{warehouse.location}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {warehouse.region}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {warehouse.type.replace('_', ' ')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {warehouse.capacity.total.toLocaleString()} {warehouse.capacity.unit}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={utilization}
                            sx={{ width: 60, height: 6 }}
                            color={utilization > 80 ? 'warning' : 'primary'}
                          />
                          <Typography variant="body2">
                            {utilization}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={warehouse.status.toUpperCase()}
                          color={getStatusColor(warehouse.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {warehouse.manager}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleViewWarehouse(warehouse)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton size="small" color="secondary">
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Inventory Tab */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Warehouse</TableCell>
                  <TableCell>Zone</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Movement</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {item.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      {warehouses.find(wh => wh.id === item.warehouse)?.code || item.warehouse}
                    </TableCell>
                    <TableCell>{item.zone}</TableCell>
                    <TableCell>
                      {item.quantity.toLocaleString()} {item.unit}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(item.value.amount, item.value.currency)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.status.toUpperCase()}
                        color={getStatusColor(item.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {item.movement_type === 'inbound' ? (
                          <TrendingUpIcon color="success" fontSize="small" />
                        ) : (
                          <TrendingDownIcon color="warning" fontSize="small" />
                        )}
                        <Typography variant="body2">
                          {format(item.last_movement, 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Movements Tab */}
          <Alert severity="info" sx={{ mb: 2 }}>
            Stock movement tracking and history will be displayed here.
          </Alert>
          <Typography variant="body1">
            Movement history functionality coming soon...
          </Typography>
        </TabPanel>
      </Paper>

      {/* Warehouse Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Warehouse Details - {selectedWarehouse?.name}
        </DialogTitle>
        <DialogContent>
          {selectedWarehouse && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Warehouse Code"
                      secondary={selectedWarehouse.code}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Location"
                      secondary={selectedWarehouse.location}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Type"
                      secondary={selectedWarehouse.type.replace('_', ' ')}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Manager"
                      secondary={selectedWarehouse.manager}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Contact"
                      secondary={selectedWarehouse.contact}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Operational Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Capacity"
                      secondary={`${selectedWarehouse.capacity.total.toLocaleString()} ${selectedWarehouse.capacity.unit}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Current Usage"
                      secondary={`${selectedWarehouse.capacity.used.toLocaleString()} ${selectedWarehouse.capacity.unit} (${getCapacityPercentage(selectedWarehouse.capacity.used, selectedWarehouse.capacity.total)}%)`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Temperature Controlled"
                      secondary={selectedWarehouse.temperature_controlled ? 'Yes' : 'No'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Customs Bonded"
                      secondary={selectedWarehouse.customs_bonded ? 'Yes' : 'No'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Compliance Score"
                      secondary={`${selectedWarehouse.compliance_score}%`}
                    />
                    <ListItemSecondaryAction>
                      {selectedWarehouse.compliance_score >= 95 ? (
                        <CheckCircleIcon color="success" />
                      ) : selectedWarehouse.compliance_score >= 85 ? (
                        <WarningIcon color="warning" />
                      ) : (
                        <WarningIcon color="error" />
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <AddWarehouseDialog
        open={addWarehouseOpen}
        onClose={() => setAddWarehouseOpen(false)}
        onSubmit={handleAddWarehouse}
      />
    </Box>
  );
};

export default WarehouseManagementPage;
