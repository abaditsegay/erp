import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Stack,
  Alert,
  CircularProgress,
  Pagination,
  TableSortLabel
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Visibility,
  Email,
  Phone,
  LocationOn,
  Business,
  AccountBalance,
  Star,
  LocalShipping,
  CheckCircle,
  Refresh
} from '@mui/icons-material';
import { EthiopianSupplier, SupplierType } from '../../types/purchase';
import SupplierForm from '../../pages/Purchase/Suppliers/SupplierForm';
import { supplierService, Supplier, PaginationParams } from '../../services/supplierService';

// Get supplier type color
const getSupplierTypeColor = (type: SupplierType) => {
  switch (type) {
    case SupplierType.LOCAL:
      return 'primary';
    case SupplierType.INTERNATIONAL:
      return 'secondary';
    case SupplierType.GOVERNMENT:
      return 'info';
    case SupplierType.NGO:
      return 'success';
    case SupplierType.COOPERATIVE:
      return 'warning';
    default:
      return 'default';
  }
};

// Supplier detail dialog component
interface SupplierDetailDialogProps {
  supplier: EthiopianSupplier | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (supplier: EthiopianSupplier) => void;
}

const SupplierDetailDialog: React.FC<SupplierDetailDialogProps> = ({
  supplier,
  open,
  onClose,
  onEdit
}) => {
  if (!supplier) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{supplier.name}</Typography>
          <Chip 
            label={supplier.supplierType} 
            color={getSupplierTypeColor(supplier.supplierType) as any}
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Contact Information
                </Typography>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center">
                    <Email sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{supplier.email}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">{supplier.phone}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <LocationOn sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Address</Typography>
                      <Typography variant="body1">
                        {supplier.address.street}<br />
                        {supplier.address.city}, {supplier.address.region}<br />
                        {supplier.address.country}
                        {supplier.address.poBox && <><br />P.O. Box: {supplier.address.poBox}</>}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Business Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Business Information
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Supplier Code</Typography>
                    <Typography variant="body1" fontWeight="medium">{supplier.code}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Contact Person</Typography>
                    <Typography variant="body1">{supplier.contactPerson}</Typography>
                  </Box>
                  {supplier.taxNumber && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">Tax Number</Typography>
                      <Typography variant="body1">{supplier.taxNumber}</Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography variant="body2" color="text.secondary">Payment Terms</Typography>
                    <Typography variant="body1">{supplier.paymentTerms}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Currency</Typography>
                    <Typography variant="body1">{supplier.currency}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Star sx={{ mr: 1, color: 'warning.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Rating</Typography>
                      <Rating value={supplier.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {supplier.rating?.toFixed(1)} out of 5
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Banking Information */}
          {supplier.bankDetails && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Banking Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Bank Name</Typography>
                      <Typography variant="body1">{supplier.bankDetails.bankName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Account Number</Typography>
                      <Typography variant="body1">{supplier.bankDetails.accountNumber}</Typography>
                    </Grid>
                    {supplier.bankDetails.swiftCode && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">SWIFT Code</Typography>
                        <Typography variant="body1">{supplier.bankDetails.swiftCode}</Typography>
                      </Grid>
                    )}
                    {supplier.bankDetails.branch && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Branch</Typography>
                        <Typography variant="body1">{supplier.bankDetails.branch}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {supplier && onEdit && (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => {
              onClose();
              onEdit(supplier);
            }}
          >
            Edit Supplier
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

// Main supplier management component
const SupplierManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedSupplier, setSelectedSupplier] = useState<EthiopianSupplier | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [editSupplierOpen, setEditSupplierOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Load suppliers from service with pagination
  const loadSuppliers = async (newPage?: number, newPageSize?: number) => {
    console.log('SupplierManagement: loadSuppliers called');
    setLoading(true);
    setError(null);
    
    const currentPage = newPage !== undefined ? newPage : page;
    const currentPageSize = newPageSize !== undefined ? newPageSize : pageSize;
    
    try {
      console.log('SupplierManagement: Calling supplierService.getPaginatedSuppliers()');
      const paginationParams: PaginationParams = {
        page: currentPage,
        size: currentPageSize,
        sort: sortBy,
        direction: sortDirection
      };
      
      const result = await supplierService.getPaginatedSuppliers(paginationParams);
      console.log('SupplierManagement: Got paginated suppliers from service:', result);
      
      setSuppliers(result.content);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages);
      setPage(currentPage);
      setPageSize(currentPageSize);
      
      if (result.content.length === 0 && result.totalElements === 0) {
        console.warn('SupplierManagement: No suppliers returned from API');
        setError('No suppliers found. Please add some suppliers or check the backend connection.');
      }
    } catch (err: any) {
      console.error('SupplierManagement: Error loading suppliers:', err);
      setError(err.message || 'Failed to load suppliers. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Force refresh suppliers (called after add/edit)
  const refreshSuppliers = async () => {
    console.log('SupplierManagement: Forcing refresh of suppliers...');
    await loadSuppliers(page, pageSize);
  };

  // Load suppliers on component mount
  React.useEffect(() => {
    loadSuppliers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pagination handlers
  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    console.log('SupplierManagement: Page changed to:', newPage);
    loadSuppliers(newPage - 1); // MUI Pagination is 1-based, our API is 0-based
  };

  const handlePageSizeChange = (event: any) => {
    const newPageSize = parseInt(event.target.value, 10);
    console.log('SupplierManagement: Page size changed to:', newPageSize);
    setPage(0); // Reset to first page when changing page size
    loadSuppliers(0, newPageSize);
  };

  const handleSort = (column: string) => {
    console.log('SupplierManagement: Sort requested for column:', column);
    const isAsc = sortBy === column && sortDirection === 'asc';
    const newDirection = isAsc ? 'desc' : 'asc';
    setSortBy(column);
    setSortDirection(newDirection);
    loadSuppliers(page, pageSize);
  };

  // Convert Supplier to EthiopianSupplier for compatibility
  const convertToEthiopianSupplier = (supplier: Supplier): EthiopianSupplier => {
    return {
      id: supplier.id || 0,
      code: supplier.code,
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: {
        street: supplier.address,
        city: 'Addis Ababa', // Default city
        region: 'Addis Ababa' as any, // Default region
        country: 'Ethiopia',
        poBox: ''
      },
      bankDetails: {
        bankName: '',
        accountNumber: '',
        branch: ''
      },
      paymentTerms: 'Net 30' as any,
      currency: 'ETB' as any,
      supplierType: SupplierType.LOCAL,
      isActive: supplier.active,
      isImporter: false,
      licenseNumber: '',
      rating: 4.0,
      createdAt: supplier.createdDate || new Date().toISOString(),
      updatedAt: supplier.updatedDate || new Date().toISOString()
    };
  };

  // Filter suppliers based on search and type filter (now applied on current page only)
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Since we don't have type information, treat all as LOCAL
    const supplierType = SupplierType.LOCAL;
    const matchesType = filterType === 'ALL' || supplierType === filterType;
    
    return matchesSearch && matchesType;
  });

  // Handle search term changes with debouncing
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // Reset to first page when searching
    setPage(0);
    // In a real implementation, you'd want to debounce this and call the API
    // For now, it just filters the current page results
  };

  const handleFilterTypeChange = (event: any) => {
    setFilterType(event.target.value);
    setPage(0); // Reset to first page when changing filter
    // In a real implementation, you'd call the API with the new filter
  };

  // Debug logging
  React.useEffect(() => {
    console.log('SupplierManagement: Render update - suppliers count:', suppliers.length);
    console.log('SupplierManagement: Render update - filtered suppliers count:', filteredSuppliers.length);
    console.log('SupplierManagement: Render update - loading:', loading);
    console.log('SupplierManagement: Render update - error:', error);
    console.log('SupplierManagement: Render update - pagination:', { page, pageSize, totalElements, totalPages });
  }, [suppliers, filteredSuppliers, loading, error, page, pageSize, totalElements, totalPages]);

  const handleViewSupplier = (supplier: EthiopianSupplier) => {
    setSelectedSupplier(supplier);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedSupplier(null);
  };

  const handleAddSupplier = () => {
    console.log('SupplierManagement: Add Supplier button clicked');
    setSelectedSupplier(null);
    setAddSupplierOpen(true);
  };

  const handleEditSupplier = (supplier: EthiopianSupplier) => {
    console.log('SupplierManagement: Edit Supplier button clicked for:', supplier);
    setSelectedSupplier(supplier);
    setEditSupplierOpen(true);
  };

  const handleFormSubmit = async (supplierData: any) => {
    console.log('SupplierManagement: Form submitted with:', supplierData);
    try {
      // Convert complex supplier data to simple format for backend
      const simpleSupplierData: Omit<Supplier, 'id' | 'createdDate' | 'updatedDate'> = {
        code: supplierData.code,
        name: supplierData.name,
        contactPerson: supplierData.contactPerson,
        email: supplierData.email,
        phone: supplierData.phone,
        address: typeof supplierData.address === 'string' ? supplierData.address : 
                `${supplierData.address?.street || ''}, ${supplierData.address?.city || ''}, ${supplierData.address?.region || ''}`,
        active: supplierData.active !== false
      };

      if (editSupplierOpen && selectedSupplier) {
        console.log('SupplierManagement: Updating supplier');
        await supplierService.updateSupplier(selectedSupplier.id, simpleSupplierData);
      } else {
        console.log('SupplierManagement: Creating new supplier');
        const createdSupplier = await supplierService.createSupplier(simpleSupplierData);
        console.log('SupplierManagement: Supplier created:', createdSupplier);
      }
      setAddSupplierOpen(false);
      setEditSupplierOpen(false);
      setSelectedSupplier(null);
      // Force refresh the suppliers list
      console.log('SupplierManagement: Forcing refresh of suppliers list...');
      await refreshSuppliers();
    } catch (error: any) {
      console.error('SupplierManagement: Error saving supplier:', error);
      setError(error.message || 'Failed to save supplier');
    }
  };

  const handleFormCancel = () => {
    setAddSupplierOpen(false);
    setEditSupplierOpen(false);
    setSelectedSupplier(null);
  };

  // Get supplier stats
  const supplierStats = {
    total: totalElements, // Use total from pagination
    local: totalElements, // All suppliers are local since we don't have type info
    international: 0,
    active: totalElements, // Assuming all returned suppliers are active
    avgRating: 4.2 // Fixed rating since we don't have rating info
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Supplier Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage Ethiopian and international suppliers
        </Typography>
        {!loading && totalElements > 0 && (
          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
            ✓ Connected to live database - showing {totalElements} suppliers total
          </Typography>
        )}
        {!loading && totalElements > 0 && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            Page {page + 1} of {totalPages} • Showing {suppliers.length} of {totalElements} suppliers
          </Typography>
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Suppliers
                  </Typography>
                  <Typography variant="h4">{supplierStats.total}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Business />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Local Suppliers
                  </Typography>
                  <Typography variant="h4">{supplierStats.local}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <LocationOn />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    International
                  </Typography>
                  <Typography variant="h4">{supplierStats.international}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <LocalShipping />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Avg Rating
                  </Typography>
                  <Typography variant="h4">{supplierStats.avgRating.toFixed(1)}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Star />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={handleFilterTypeChange}
                  label="Filter by Type"
                >
                  <MenuItem value="ALL">All Types</MenuItem>
                  <MenuItem value={SupplierType.LOCAL}>Local</MenuItem>
                  <MenuItem value={SupplierType.INTERNATIONAL}>International</MenuItem>
                  <MenuItem value={SupplierType.GOVERNMENT}>Government</MenuItem>
                  <MenuItem value={SupplierType.NGO}>NGO</MenuItem>
                  <MenuItem value={SupplierType.COOPERATIVE}>Cooperative</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                fullWidth
                onClick={refreshSuppliers}
                disabled={loading}
              >
                Refresh
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<Add />}
                fullWidth
                onClick={handleAddSupplier}
              >
                Add Supplier
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Suppliers ({filteredSuppliers.length} on this page)
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="textSecondary">
                Rows per page:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  displayEmpty
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'name'}
                      direction={sortBy === 'name' ? sortDirection : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      Supplier
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'contactPerson'}
                      direction={sortBy === 'contactPerson' ? sortDirection : 'asc'}
                      onClick={() => handleSort('contactPerson')}
                    >
                      Contact
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell align="center">Rating</TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={sortBy === 'active'}
                      direction={sortBy === 'active' ? sortDirection : 'asc'}
                      onClick={() => handleSort('active')}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress size={40} />
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Loading suppliers...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="textSecondary">
                        {searchTerm ? `No suppliers found matching "${searchTerm}"` : 'No suppliers found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {supplier.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {supplier.code}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label="Local" 
                        size="small"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{supplier.contactPerson}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {supplier.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {supplier.address}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">ETB</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <Rating 
                          value={4.2} 
                          precision={0.1} 
                          readOnly 
                          size="small" 
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          4.2
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={supplier.active ? 'Active' : 'Inactive'} 
                        size="small"
                        color={supplier.active ? 'success' : 'default'}
                        icon={supplier.active ? <CheckCircle /> : undefined}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewSupplier(convertToEthiopianSupplier(supplier))}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="default"
                          onClick={() => handleEditSupplier(convertToEthiopianSupplier(supplier))}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" alignItems="center" mt={3} mb={1}>
              <Pagination
                count={totalPages}
                page={page + 1} // MUI Pagination is 1-based
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                disabled={loading}
              />
            </Box>
          )}
          
          {/* Pagination Info */}
          {totalElements > 0 && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Typography variant="body2" color="textSecondary">
                Showing {(page * pageSize) + 1} to {Math.min((page + 1) * pageSize, totalElements)} of {totalElements} suppliers
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Supplier Detail Dialog */}
      <SupplierDetailDialog
        supplier={selectedSupplier}
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        onEdit={handleEditSupplier}
      />

      {/* Add Supplier Dialog */}
      <Dialog 
        open={addSupplierOpen} 
        onClose={handleFormCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Supplier</DialogTitle>
        <DialogContent>
          <SupplierForm
            open={addSupplierOpen}
            onClose={handleFormCancel}
            supplier={null}
            onSubmit={handleFormSubmit}
            isEditing={false}
            onSuccess={() => {
              setAddSupplierOpen(false);
              setSelectedSupplier(null);
            }}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Dialog */}
      <Dialog 
        open={editSupplierOpen} 
        onClose={handleFormCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Supplier</DialogTitle>
        <DialogContent>
          <SupplierForm
            open={editSupplierOpen}
            onClose={handleFormCancel}
            supplier={selectedSupplier as any} // Type conversion needed due to different interfaces
            onSubmit={handleFormSubmit}
            isEditing={true}
            onSuccess={() => {
              setEditSupplierOpen(false);
              setSelectedSupplier(null);
            }}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SupplierManagement;
