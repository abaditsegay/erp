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
  Stack
} from '@mui/material';
import {
  Search,
  FilterList,
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
  CheckCircle
} from '@mui/icons-material';
import { useMockPurchaseData } from '../../contexts/MockPurchaseDataProvider';
import { EthiopianSupplier, SupplierType } from '../../types/purchase';

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
}

const SupplierDetailDialog: React.FC<SupplierDetailDialogProps> = ({
  supplier,
  open,
  onClose
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
        <Button variant="contained" startIcon={<Edit />}>
          Edit Supplier
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main supplier management component
const SupplierManagement: React.FC = () => {
  const { suppliers } = useMockPurchaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedSupplier, setSelectedSupplier] = useState<EthiopianSupplier | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Filter suppliers based on search and type filter
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'ALL' || supplier.supplierType === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleViewSupplier = (supplier: EthiopianSupplier) => {
    setSelectedSupplier(supplier);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedSupplier(null);
  };

  // Get supplier stats
  const supplierStats = {
    total: suppliers.length,
    local: suppliers.filter(s => s.supplierType === SupplierType.LOCAL).length,
    international: suppliers.filter(s => s.supplierType === SupplierType.INTERNATIONAL).length,
    active: suppliers.filter(s => s.isActive).length,
    avgRating: suppliers.reduce((sum, s) => sum + (s.rating || 0), 0) / suppliers.length
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
      </Box>

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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  onChange={(e) => setFilterType(e.target.value)}
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
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                fullWidth
              >
                Advanced Filters
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                startIcon={<Add />}
                fullWidth
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
          <Typography variant="h6" gutterBottom>
            Suppliers ({filteredSuppliers.length})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell align="center">Rating</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
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
                        label={supplier.supplierType} 
                        size="small"
                        color={getSupplierTypeColor(supplier.supplierType) as any}
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
                        {supplier.address.city}, {supplier.address.region}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{supplier.currency}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <Rating 
                          value={supplier.rating} 
                          precision={0.1} 
                          readOnly 
                          size="small" 
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {supplier.rating?.toFixed(1)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={supplier.isActive ? 'Active' : 'Inactive'} 
                        size="small"
                        color={supplier.isActive ? 'success' : 'default'}
                        icon={supplier.isActive ? <CheckCircle /> : undefined}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewSupplier(supplier)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="default">
                          <Edit fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Supplier Detail Dialog */}
      <SupplierDetailDialog
        supplier={selectedSupplier}
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
      />
    </Box>
  );
};

export default SupplierManagement;
