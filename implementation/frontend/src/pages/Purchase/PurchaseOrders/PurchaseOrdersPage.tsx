import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Grid,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  GetApp as DownloadIcon,
  FilterList as FilterIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Schedule as PendingIcon,
  LocalShipping as ShipIcon,
  CheckCircle,
  Schedule,
  Cancel,
} from '@mui/icons-material';
import { useMockPurchaseData } from '../../../contexts/MockPurchaseDataProvider';
import { PurchaseOrder, PurchaseOrderStatus, EthiopianRegion } from '../../../types/purchase';
import { CreatePurchaseOrderDialog } from '../../../components/Purchase/CreatePurchaseOrderDialog';
import { PurchaseOrderDetailsDialog } from '../../../components/Purchase/PurchaseOrderDetailsDialog';

const PurchaseOrdersPage: React.FC = () => {
  const { purchaseOrders, suppliers } = useMockPurchaseData();
  const loading = false; // Mock loading state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatus | 'ALL'>('ALL');
  const [regionFilter, setRegionFilter] = useState<EthiopianRegion | 'ALL'>('ALL');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Filter purchase orders
  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      const matchesRegion = regionFilter === 'ALL' || order.supplier.address.region === regionFilter;
      
      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [purchaseOrders, searchTerm, statusFilter, regionFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = purchaseOrders.length;
    const pending = purchaseOrders.filter(po => po.status === 'PENDING_APPROVAL').length;
    const approved = purchaseOrders.filter(po => po.status === 'APPROVED').length;
    const received = purchaseOrders.filter(po => po.status === 'FULLY_RECEIVED').length;
    const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
    
    return { total, pending, approved, received, totalValue };
  }, [purchaseOrders]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, order: PurchaseOrder) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleViewDetails = () => {
    setDetailsDialogOpen(true);
    handleMenuClose();
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<PurchaseOrderStatus | 'ALL'>) => {
    setStatusFilter(event.target.value as PurchaseOrderStatus | 'ALL');
  };

  const handleRegionFilterChange = (event: SelectChangeEvent<EthiopianRegion | 'ALL'>) => {
    setRegionFilter(event.target.value as EthiopianRegion | 'ALL');
  };

  const getStatusChip = (status: PurchaseOrderStatus) => {
    const statusConfig: Record<PurchaseOrderStatus, { color: any; icon: any }> = {
      [PurchaseOrderStatus.DRAFT]: { color: 'default' as const, icon: <EditIcon fontSize="small" /> },
      [PurchaseOrderStatus.PENDING_APPROVAL]: { color: 'warning' as const, icon: <PendingIcon fontSize="small" /> },
      [PurchaseOrderStatus.APPROVED]: { color: 'success' as const, icon: <ApproveIcon fontSize="small" /> },
      [PurchaseOrderStatus.SENT_TO_SUPPLIER]: { color: 'info' as const, icon: <ShipIcon fontSize="small" /> },
      [PurchaseOrderStatus.ACKNOWLEDGED]: { color: 'primary' as const, icon: <CheckCircle fontSize="small" /> },
      [PurchaseOrderStatus.PARTIALLY_RECEIVED]: { color: 'warning' as const, icon: <Schedule fontSize="small" /> },
      [PurchaseOrderStatus.FULLY_RECEIVED]: { color: 'success' as const, icon: <CheckCircle fontSize="small" /> },
      [PurchaseOrderStatus.INVOICED]: { color: 'info' as const, icon: <CheckCircle fontSize="small" /> },
      [PurchaseOrderStatus.PAID]: { color: 'success' as const, icon: <CheckCircle fontSize="small" /> },
      [PurchaseOrderStatus.CANCELLED]: { color: 'error' as const, icon: <Cancel fontSize="small" /> },
      [PurchaseOrderStatus.CLOSED]: { color: 'default' as const, icon: <CheckCircle fontSize="small" /> },
    };

    const config = statusConfig[status];
    return (
      <Chip
        label={status.replace('_', ' ')}
        color={config.color}
        size="small"
        icon={config.icon}
        sx={{ fontSize: '0.75rem' }}
      />
    );
  };

  const formatCurrency = (amount: number, currency: 'USD' | 'ETB') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading purchase orders...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
          🇪🇹 Purchase Orders Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ 
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#1565c0' }
          }}
        >
          Create Purchase Order
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4" component="div" color="primary">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Approval
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Approved
              </Typography>
                              <Typography variant="h4" component="div" color="success.main">
                  {stats.received}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Value (ETB)
                </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Value (ETB)
              </Typography>
              <Typography variant="h4" component="div" color="primary">
                {formatCurrency(stats.totalValue, 'ETB')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by PO number or supplier..."
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
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="ALL">All Status</MenuItem>
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="PENDING_APPROVAL">Pending Approval</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="SENT_TO_SUPPLIER">Sent to Supplier</MenuItem>
                  <MenuItem value="ACKNOWLEDGED">Acknowledged</MenuItem>
                  <MenuItem value="FULLY_RECEIVED">Received</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Region</InputLabel>
                <Select
                  value={regionFilter}
                  label="Region"
                  onChange={handleRegionFilterChange}
                >
                  <MenuItem value="ALL">All Regions</MenuItem>
                  <MenuItem value="ADDIS_ABABA">Addis Ababa</MenuItem>
                  <MenuItem value="OROMIA">Oromia</MenuItem>
                  <MenuItem value="AMHARA">Amhara</MenuItem>
                  <MenuItem value="TIGRAY">Tigray</MenuItem>
                  <MenuItem value="SIDAMA">Sidama</MenuItem>
                  <MenuItem value="SNNP">SNNP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setRegionFilter('ALL');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No purchase orders found matching your criteria.
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>PO Number</strong></TableCell>
                    <TableCell><strong>Supplier</strong></TableCell>
                    <TableCell><strong>Order Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Total Amount</strong></TableCell>
                    <TableCell><strong>Currency</strong></TableCell>
                    <TableCell><strong>Delivery Date</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                          {order.orderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {order.supplier.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {order.supplier.address.city}, {order.supplier.address.region}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(order.orderDate).toLocaleDateString('en-GB')}
                      </TableCell>
                      <TableCell>
                        {getStatusChip(order.status)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(order.totalAmount, order.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={order.currency}
                          size="small"
                          variant="outlined"
                          color={order.currency === 'ETB' ? 'success' : 'primary'}
                        />
                      </TableCell>
                      <TableCell>
                        {order.expectedDeliveryDate 
                          ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB')
                          : 'TBD'
                        }
                      </TableCell>
                      <TableCell>
                        <Tooltip title="More actions">
                          <IconButton
                            onClick={(e) => handleMenuClick(e, order)}
                            size="small"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <ViewIcon sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit Order
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <PrintIcon sx={{ mr: 1 }} fontSize="small" />
          Print PO
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
          Download PDF
        </MenuItem>
        {selectedOrder?.status === 'PENDING_APPROVAL' && (
          <>
            <MenuItem onClick={handleMenuClose}>
              <ApproveIcon sx={{ mr: 1 }} fontSize="small" />
              Approve
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <RejectIcon sx={{ mr: 1 }} fontSize="small" />
              Reject
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Create Purchase Order Dialog */}
      <CreatePurchaseOrderDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        suppliers={suppliers}
      />

      {/* Purchase Order Details Dialog */}
      {selectedOrder && (
        <PurchaseOrderDetailsDialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          purchaseOrder={selectedOrder}
        />
      )}
    </Box>
  );
};

export default PurchaseOrdersPage;
