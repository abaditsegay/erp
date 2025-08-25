import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Grid,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Close,
  Search,
  Visibility,
  Edit,
  FilterList,
  Download,
  Refresh,
  LocationOn,
  Inventory as InventoryIcon,
  AttachMoney,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { StockView } from '../../types/inventoryAnalytics';
import { ethiopianInventoryAnalyticsService } from '../../services/ethiopianInventoryAnalyticsService';

interface StockViewDialogProps {
  open: boolean;
  onClose: () => void;
  warehouseId: number;
  warehouseName: string;
}

const StockViewDialog: React.FC<StockViewDialogProps> = ({
  open,
  onClose,
  warehouseId,
  warehouseName
}) => {
  const [stockView, setStockView] = useState<StockView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchStockView = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        sortBy,
        sortOrder
      };
      const data = await ethiopianInventoryAnalyticsService.getStockView(warehouseId, filters);
      setStockView(data);
    } catch (err) {
      setError('Failed to load stock view');
      console.error('Error fetching stock view:', err);
    } finally {
      setLoading(false);
    }
  }, [warehouseId, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  useEffect(() => {
    if (open && warehouseId) {
      fetchStockView();
    }
  }, [open, warehouseId, fetchStockView]);

  const handleSearch = () => {
    fetchStockView();
  };

  const handleExport = () => {
    // In real implementation, would export the data
    console.log('Exporting stock view for warehouse:', warehouseId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'success';
      case 'low_stock': return 'warning';
      case 'out_of_stock': return 'error';
      case 'overstock': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      case 'overstock': return 'Overstock';
      default: return status;
    }
  };

  const filteredItems = stockView?.items.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  }) || [];

  const uniqueCategories = Array.from(new Set(stockView?.items.map(item => item.category) || []));

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
            <InventoryIcon sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h6">Stock View - {warehouseName}</Typography>
              <Typography variant="body2" color="textSecondary">
                Region: {stockView?.region || 'Loading...'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchStockView} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export">
              <IconButton onClick={handleExport}>
                <Download />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : stockView ? (
          <>
            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="textSecondary" variant="body2">
                          Total Items
                        </Typography>
                        <Typography variant="h6">
                          {stockView.summary.totalItems}
                        </Typography>
                      </Box>
                      <InventoryIcon color="primary" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="textSecondary" variant="body2">
                          Total Value (USD)
                        </Typography>
                        <Typography variant="h6">
                          ${stockView.summary.totalValue.toLocaleString()}
                        </Typography>
                      </Box>
                      <AttachMoney color="success" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="textSecondary" variant="body2">
                          Low Stock Items
                        </Typography>
                        <Typography variant="h6" color="warning.main">
                          {stockView.summary.lowStockItems}
                        </Typography>
                      </Box>
                      <TrendingDown color="warning" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="textSecondary" variant="body2">
                          Out of Stock
                        </Typography>
                        <Typography variant="h6" color="error.main">
                          {stockView.summary.outOfStockItems}
                        </Typography>
                      </Box>
                      <TrendingUp color="error" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="in_stock">In Stock</MenuItem>
                    <MenuItem value="low_stock">Low Stock</MenuItem>
                    <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                    <MenuItem value="overstock">Overstock</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {uniqueCategories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="sku">SKU</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                    <MenuItem value="stock">Stock Level</MenuItem>
                    <MenuItem value="value">Value</MenuItem>
                    <MenuItem value="lastMovement">Last Movement</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={handleSearch}
                  size="small"
                  sx={{ height: '40px' }}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>

            {/* Stock Items Table */}
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>SKU</TableCell>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total Value</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Last Movement</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {item.sku}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.category}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          {item.currentStock} {item.unit}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          ${item.unitPrice.toFixed(2)}
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
                          label={getStatusLabel(item.status)}
                          color={getStatusColor(item.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.location.zone}-{item.location.aisle}-{item.location.shelf}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Bin: {item.location.bin}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(item.lastMovement.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {item.lastMovement.type}: {item.lastMovement.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.supplier?.name || 'N/A'}
                        </Typography>
                        {item.supplier?.contact && (
                          <Typography variant="caption" color="textSecondary">
                            {item.supplier.contact}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Item">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Location">
                          <IconButton size="small">
                            <LocationOn />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredItems.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                No items found matching the current filters.
              </Alert>
            )}
          </>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handleExport} startIcon={<Download />}>
          Export to Excel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockViewDialog;
