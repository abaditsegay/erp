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
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  LocalShipping as ShippingIcon,
  Flight as FlightIcon,
  Train as TrainIcon,
  DirectionsBoat as BoatIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

// Mock data - In real app, this would come from API
const mockShipments = [
  {
    id: 'SH001',
    trackingNumber: 'ETH-2024-001',
    description: 'Electronics Import from Dubai',
    origin: 'Dubai, UAE',
    destination: 'Addis Ababa, Ethiopia',
    status: 'in_transit',
    carrier: 'Ethiopian Airlines Cargo',
    estimatedDelivery: new Date('2024-01-25'),
    actualDelivery: null,
    weight: '2500 kg',
    value: { amount: 150000, currency: 'ETB' },
    mode: 'air',
    priority: 'high',
    timeline: [
      {
        date: new Date('2024-01-15'),
        status: 'created',
        location: 'Dubai, UAE',
        description: 'Shipment created and documentation prepared'
      },
      {
        date: new Date('2024-01-16'),
        status: 'picked_up',
        location: 'Dubai, UAE',
        description: 'Package picked up from supplier'
      },
      {
        date: new Date('2024-01-18'),
        status: 'in_transit',
        location: 'Dubai International Airport',
        description: 'Departed Dubai for Addis Ababa'
      },
      {
        date: new Date('2024-01-20'),
        status: 'customs_processing',
        location: 'Bole International Airport',
        description: 'Arrived at destination, customs clearance in progress'
      }
    ]
  },
  {
    id: 'SH002',
    trackingNumber: 'ETH-2024-002',
    description: 'Medical Supplies from Germany',
    origin: 'Frankfurt, Germany',
    destination: 'Mekelle, Ethiopia',
    status: 'delivered',
    carrier: 'DHL Express',
    estimatedDelivery: new Date('2024-01-10'),
    actualDelivery: new Date('2024-01-12'),
    weight: '150 kg',
    value: { amount: 75000, currency: 'ETB' },
    mode: 'air',
    priority: 'urgent',
    timeline: [
      {
        date: new Date('2024-01-05'),
        status: 'created',
        location: 'Frankfurt, Germany',
        description: 'Shipment created'
      },
      {
        date: new Date('2024-01-08'),
        status: 'delivered',
        location: 'Mekelle, Ethiopia',
        description: 'Successfully delivered to recipient'
      }
    ]
  },
  {
    id: 'SH003',
    trackingNumber: 'ETH-2024-003',
    description: 'Agricultural Equipment from China',
    origin: 'Shanghai, China',
    destination: 'Dire Dawa, Ethiopia',
    status: 'delayed',
    carrier: 'COSCO Shipping',
    estimatedDelivery: new Date('2024-02-15'),
    actualDelivery: null,
    weight: '15000 kg',
    value: { amount: 2500000, currency: 'ETB' },
    mode: 'sea',
    priority: 'medium',
    timeline: [
      {
        date: new Date('2024-01-05'),
        status: 'created',
        location: 'Shanghai, China',
        description: 'Shipment created'
      },
      {
        date: new Date('2024-01-12'),
        status: 'delayed',
        location: 'Shanghai Port',
        description: 'Delayed due to port congestion'
      }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'success';
    case 'in_transit': return 'info';
    case 'delayed': return 'warning';
    case 'cancelled': return 'error';
    case 'customs_processing': return 'secondary';
    default: return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered': return <CheckCircleIcon />;
    case 'in_transit': return <ShippingIcon />;
    case 'delayed': return <WarningIcon />;
    case 'cancelled': return <ErrorIcon />;
    case 'customs_processing': return <PendingIcon />;
    default: return <InventoryIcon />;
  }
};

const getModeIcon = (mode: string) => {
  switch (mode) {
    case 'air': return <FlightIcon />;
    case 'sea': return <BoatIcon />;
    case 'rail': return <TrainIcon />;
    default: return <ShippingIcon />;
  }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: currency === 'ETB' ? 'ETB' : 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

const ShipmentTrackingPage: React.FC = () => {
  const [shipments] = useState(mockShipments);
  const [filteredShipments, setFilteredShipments] = useState(mockShipments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter shipments based on search and status
  useEffect(() => {
    let filtered = shipments;

    if (searchTerm) {
      filtered = filtered.filter(shipment =>
        shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.status === statusFilter);
    }

    setFilteredShipments(filtered);
  }, [searchTerm, statusFilter, shipments]);

  const handleViewShipment = (shipment: any) => {
    setSelectedShipment(shipment);
    setDialogOpen(true);
  };

  const getDeliveryProgress = (shipment: any) => {
    const statusOrder = ['created', 'picked_up', 'in_transit', 'customs_processing', 'delivered'];
    const currentIndex = statusOrder.indexOf(shipment.status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  // Statistics
  const totalShipments = shipments.length;
  const deliveredShipments = shipments.filter(s => s.status === 'delivered').length;
  const inTransitShipments = shipments.filter(s => s.status === 'in_transit').length;
  const delayedShipments = shipments.filter(s => s.status === 'delayed').length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Shipment Tracking - የመላኪያ መከታተያ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track and manage all shipments across different transportation modes
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
                    Total Shipments
                  </Typography>
                  <Typography variant="h4">
                    {totalShipments}
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
                  <Typography color="text.secondary" gutterBottom>
                    In Transit
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {inTransitShipments}
                  </Typography>
                </Box>
                <ShippingIcon color="info" sx={{ fontSize: 40 }} />
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
                    Delivered
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {deliveredShipments}
                  </Typography>
                </Box>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
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
                    Delayed
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {delayedShipments}
                  </Typography>
                </Box>
                <WarningIcon color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by tracking number, description, or location..."
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
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="created">Created</MenuItem>
                <MenuItem value="in_transit">In Transit</MenuItem>
                <MenuItem value="customs_processing">Customs Processing</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="delayed">Delayed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              fullWidth
              onClick={() => alert('Create shipment functionality will be implemented')}
            >
              Create Shipment
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Shipments Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tracking Number</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Estimated Delivery</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredShipments.map((shipment) => (
                <TableRow key={shipment.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {shipment.trackingNumber}
                    </Typography>
                    <Chip
                      label={shipment.priority}
                      size="small"
                      color={shipment.priority === 'urgent' ? 'error' : shipment.priority === 'high' ? 'warning' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{shipment.description}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2">{shipment.origin}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          → {shipment.destination}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(shipment.status)}
                      label={shipment.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(shipment.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getModeIcon(shipment.mode)}
                      <Typography variant="body2">
                        {shipment.mode.toUpperCase()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {format(shipment.estimatedDelivery, 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(shipment.value.amount, shipment.value.currency)}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewShipment(shipment)}
                      color="primary"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton size="small" color="secondary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Shipment Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Shipment Details - {selectedShipment?.trackingNumber}
        </DialogTitle>
        <DialogContent>
          {selectedShipment && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Shipment Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {selectedShipment.description}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Route
                    </Typography>
                    <Typography variant="body1">
                      {selectedShipment.origin} → {selectedShipment.destination}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Carrier
                    </Typography>
                    <Typography variant="body1">
                      {selectedShipment.carrier}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Weight
                    </Typography>
                    <Typography variant="body1">
                      {selectedShipment.weight}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Delivery Progress
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={getDeliveryProgress(selectedShipment)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {Math.round(getDeliveryProgress(selectedShipment))}% Complete
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Timeline
                  </Typography>
                  <List>
                    {selectedShipment.timeline.map((event: any, index: number) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemIcon>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              backgroundColor: event.status === selectedShipment.status ? 'primary.main' : 'grey.300',
                              color: event.status === selectedShipment.status ? 'white' : 'grey.600'
                            }}
                          >
                            {getStatusIcon(event.status)}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {event.status.replace('_', ' ').toUpperCase()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {event.location}
                              </Typography>
                              <Typography variant="caption">
                                {format(event.date, 'MMM dd, yyyy HH:mm')}
                              </Typography>
                            </Box>
                          }
                          secondary={event.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShipmentTrackingPage;
