import React, { useState } from 'react';
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
  TablePagination,
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
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import SupplierForm from './SupplierForm';
import SupplierView from './SupplierView';

interface Supplier {
  id: number;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  createdDate: string;
  modifiedDate: string;
}

interface SupplierStats {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
}

interface PaginatedResponse {
  content: Supplier[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const API_BASE_URL = '/api/suppliers';

const SuppliersPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  // Fetch suppliers with pagination
  const { data: suppliersData, isLoading, error, refetch } = useQuery<PaginatedResponse>(
    ['suppliers', page, rowsPerPage, searchTerm],
    async () => {
      if (searchTerm) {
        const response = await axios.get(`${API_BASE_URL}/search?name=${encodeURIComponent(searchTerm)}`);
        return {
          content: response.data,
          totalElements: response.data.length,
          totalPages: 1,
          size: response.data.length,
          number: 0,
        };
      } else {
        const response = await axios.get(`${API_BASE_URL}?page=${page}&size=${rowsPerPage}&sortBy=name&sortDir=asc`);
        return response.data;
      }
    },
    {
      keepPreviousData: true,
    }
  );

  // Fetch supplier statistics
  const { data: stats } = useQuery<SupplierStats>('supplier-stats', async () => {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    return response.data;
  });

  // Delete mutation
  const deleteMutation = useMutation(
    (id: number) => axios.delete(`${API_BASE_URL}/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('suppliers');
        queryClient.invalidateQueries('supplier-stats');
      },
    }
  );

  // Toggle active status mutation
  const toggleActiveMutation = useMutation(
    ({ id, activate }: { id: number; activate: boolean }) =>
      axios.put(`${API_BASE_URL}/${id}/${activate ? 'activate' : 'deactivate'}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('suppliers');
        queryClient.invalidateQueries('supplier-stats');
      },
    }
  );

  const handleChangePage = (_: unknown, newPage: number) => {
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

  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    setIsEditing(false);
    setOpenForm(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditing(true);
    setOpenForm(true);
  };

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setOpenView(true);
  };

  const handleDeleteSupplier = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  const handleToggleActive = async (supplier: Supplier) => {
    try {
      await toggleActiveMutation.mutateAsync({
        id: supplier.id,
        activate: !supplier.active,
      });
    } catch (error) {
      console.error('Error toggling supplier status:', error);
    }
  };

  const handleFormSuccess = () => {
    setOpenForm(false);
    queryClient.invalidateQueries('suppliers');
    queryClient.invalidateQueries('supplier-stats');
  };

  if (error) {
    return (
      <Box>
        <Alert severity="error">
          Error loading suppliers. Please check if the backend server is running on port 8081.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Supplier Management
        </Typography>
        <Box display="flex" gap={2}>
          <Tooltip title="Refresh">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSupplier}
          >
            Add Supplier
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <BusinessIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Suppliers
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalCount}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <BusinessIcon color="success" sx={{ mr: 1 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Active Suppliers
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {stats.activeCount}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <BusinessIcon color="error" sx={{ mr: 1 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Inactive Suppliers
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {stats.inactiveCount}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Search */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Search suppliers by name"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

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
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : suppliersData?.content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No suppliers found
                  </TableCell>
                </TableRow>
              ) : (
                suppliersData?.content.map((supplier) => (
                  <TableRow key={supplier.id} hover>
                    <TableCell>{supplier.code}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <BusinessIcon color="primary" sx={{ mr: 1 }} />
                        {supplier.name}
                      </Box>
                    </TableCell>
                    <TableCell>{supplier.contactPerson || '-'}</TableCell>
                    <TableCell>
                      {supplier.email ? (
                        <Box display="flex" alignItems="center">
                          <EmailIcon sx={{ mr: 1, fontSize: 16 }} />
                          {supplier.email}
                        </Box>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {supplier.phone ? (
                        <Box display="flex" alignItems="center">
                          <PhoneIcon sx={{ mr: 1, fontSize: 16 }} />
                          {supplier.phone}
                        </Box>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={supplier.active ? 'Active' : 'Inactive'}
                        color={supplier.active ? 'success' : 'error'}
                        size="small"
                        onClick={() => handleToggleActive(supplier)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => handleViewSupplier(supplier)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditSupplier(supplier)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {suppliersData && !searchTerm && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={suppliersData.totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' },
        }}
        onClick={handleAddSupplier}
      >
        <AddIcon />
      </Fab>

      {/* Supplier Form Dialog */}
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
            supplier={selectedSupplier}
            isEditing={isEditing}
            onSuccess={handleFormSuccess}
            onCancel={() => setOpenForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Supplier View Dialog */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Supplier Details</DialogTitle>
        <DialogContent>
          {selectedSupplier && (
            <SupplierView 
              supplier={selectedSupplier} 
              onEdit={() => {
                setOpenForm(true);
                setIsEditing(true);
                setOpenView(false);
              }}
              onDelete={() => handleDeleteSupplier(selectedSupplier.id)}
              onToggleStatus={() => handleToggleActive(selectedSupplier)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenView(false);
              handleEditSupplier(selectedSupplier!);
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuppliersPage;
