import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { mockSupplierService, Supplier } from '../../../services/mockSupplierService';
import SupplierForm from './SupplierForm';

interface SupplierStats {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
}

const SuppliersPageSimple: React.FC = () => {
  // State management
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState<SupplierStats>({
    totalCount: 0,
    activeCount: 0,
    inactiveCount: 0,
  });

  // Load suppliers data
  const loadSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let result: Supplier[];
      if (searchTerm) {
        result = await mockSupplierService.searchSuppliers(searchTerm);
      } else {
        result = await mockSupplierService.getAllSuppliers();
      }
      setSuppliers(result);
      
      // Update stats
      setStats({
        totalCount: result.length,
        activeCount: result.filter(s => s.active).length,
        inactiveCount: result.filter(s => !s.active).length,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load suppliers');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadSuppliers();
  }, [searchTerm, loadSuppliers]);

  // Event handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAdd = () => {
    console.log('SuppliersPage: Add button clicked');
    setSelectedSupplier(null);
    setIsEditing(false);
    setOpenForm(true);
  };

  const handleEdit = (supplier: Supplier) => {
    console.log('SuppliersPage: Edit button clicked for supplier:', supplier);
    setSelectedSupplier(supplier);
    setIsEditing(true);
    setOpenForm(true);
  };

  const handleView = (supplier: Supplier) => {
    console.log('SuppliersPage: View button clicked for supplier:', supplier);
    setSelectedSupplier(supplier);
    setOpenView(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await mockSupplierService.deleteSupplier(id);
        await loadSuppliers(); // Refresh the list
      } catch (err: any) {
        setError(err.message || 'Failed to delete supplier');
      }
    }
  };

  const handleToggleActive = async (supplier: Supplier) => {
    try {
      await mockSupplierService.updateSupplier(supplier.id, { 
        ...supplier, 
        active: !supplier.active 
      });
      await loadSuppliers(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to update supplier');
    }
  };

  const handleFormSuccess = () => {
    setOpenForm(false);
    loadSuppliers(); // Refresh the list
  };

  const handleFormSubmit = async (supplierData: Supplier) => {
    console.log('SuppliersPage: handleFormSubmit called with:', supplierData);
    try {
      if (isEditing && selectedSupplier) {
        console.log('SuppliersPage: Updating supplier');
        await mockSupplierService.updateSupplier(selectedSupplier.id, supplierData);
      } else {
        console.log('SuppliersPage: Creating new supplier');
        await mockSupplierService.createSupplier(supplierData);
      }
      console.log('SuppliersPage: Success, calling handleFormSuccess');
      handleFormSuccess();
    } catch (err: any) {
      console.error('SuppliersPage: Error in handleFormSubmit:', err);
      setError(err.message || 'Failed to save supplier');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Supplier Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Suppliers
              </Typography>
              <Typography variant="h4">
                {stats.totalCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Suppliers
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.activeCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Inactive Suppliers
              </Typography>
              <Typography variant="h4" color="error.main">
                {stats.inactiveCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadSuppliers}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Supplier
          </Button>
        </Box>
      </Box>

      {/* Suppliers Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading suppliers...
                  </TableCell>
                </TableRow>
              ) : suppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No suppliers found
                  </TableCell>
                </TableRow>
              ) : (
                suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.code}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.contactPerson}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.type}</TableCell>
                    <TableCell>
                      <Chip
                        label={supplier.active ? 'Active' : 'Inactive'}
                        color={supplier.active ? 'success' : 'error'}
                        size="small"
                        onClick={() => handleToggleActive(supplier)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleView(supplier)}
                        title="View"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(supplier)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(supplier.id)}
                        title="Delete"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Supplier Dialog */}
      <Dialog 
        open={openForm} 
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Edit Supplier' : 'Add New Supplier'}
        </DialogTitle>
        <DialogContent>
          <SupplierForm
            open={openForm}
            onClose={() => setOpenForm(false)}
            supplier={selectedSupplier}
            onSubmit={handleFormSubmit}
            isEditing={isEditing}
            onSuccess={handleFormSuccess}
            onCancel={() => setOpenForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Supplier Dialog */}
      <Dialog 
        open={openView} 
        onClose={() => setOpenView(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Supplier Details</DialogTitle>
        <DialogContent>
          {selectedSupplier && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Code:</Typography>
                  <Typography>{selectedSupplier.code}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Name:</Typography>
                  <Typography>{selectedSupplier.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Contact Person:</Typography>
                  <Typography>{selectedSupplier.contactPerson}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Email:</Typography>
                  <Typography>{selectedSupplier.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Phone:</Typography>
                  <Typography>{selectedSupplier.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Type:</Typography>
                  <Typography>{selectedSupplier.type}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Address:</Typography>
                  <Typography>
                    {selectedSupplier.address.street}, {selectedSupplier.address.city}, {selectedSupplier.address.region}
                  </Typography>
                </Grid>
                {selectedSupplier.website && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Website:</Typography>
                    <Typography>{selectedSupplier.website}</Typography>
                  </Grid>
                )}
                {selectedSupplier.taxId && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Tax ID:</Typography>
                    <Typography>{selectedSupplier.taxId}</Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>
            Close
          </Button>
          {selectedSupplier && (
            <Button
              variant="contained"
              onClick={() => {
                setOpenView(false);
                handleEdit(selectedSupplier);
              }}
            >
              Edit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuppliersPageSimple;
