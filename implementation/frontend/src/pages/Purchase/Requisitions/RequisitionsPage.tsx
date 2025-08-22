import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  ShoppingCart as CartIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AccessTime as ClockIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { 
  PurchaseRequisition, 
  RequisitionStatus, 
  PriorityLevel,
  CreateRequisitionForm
} from '../../../types/purchase';
import { requisitionService } from '../../../services/requisitionService';
import CreateRequisitionDialog from '../../../components/Purchase/CreateRequisitionDialog';
import RequisitionDetailsDialog from '../../../components/Purchase/RequisitionDetailsDialog';

const RequisitionsPage: React.FC = () => {
  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  
  // Dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState<PurchaseRequisition | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequisitionStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | 'ALL'>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalRequisitions: 0,
    pendingApproval: 0,
    approved: 0,
    underReview: 0,
    monthlyRequisitions: 0,
    averageProcessingTime: 0
  });

  const loadRequisitions = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await requisitionService.getAllRequisitions(page, rowsPerPage, {
        search: searchTerm,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
        department: departmentFilter || undefined
      });
      setRequisitions(response.content);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError('Failed to load requisitions');
      console.error('Error loading requisitions:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter, priorityFilter, departmentFilter]);

  useEffect(() => {
    loadRequisitions();
    loadDashboardStats();
  }, [loadRequisitions]);

  const loadDashboardStats = async () => {
    try {
      const stats = await requisitionService.getDashboardStats();
      setDashboardStats(stats);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    }
  };

  const handleCreateRequisition = async (formData: CreateRequisitionForm) => {
    try {
      await requisitionService.createRequisition(formData);
      setCreateDialogOpen(false);
      loadRequisitions();
      loadDashboardStats();
    } catch (err) {
      console.error('Error creating requisition:', err);
      throw err;
    }
  };

  const handleViewDetails = (requisition: PurchaseRequisition) => {
    setSelectedRequisition(requisition);
    setDetailsDialogOpen(true);
  };

  const handleApproveRequisition = async (id: number, comments?: string) => {
    try {
      await requisitionService.approveRequisition(id, comments);
      loadRequisitions();
      loadDashboardStats();
    } catch (err) {
      console.error('Error approving requisition:', err);
    }
  };

  const handleRejectRequisition = async (id: number, reason: string) => {
    try {
      await requisitionService.rejectRequisition(id, reason);
      loadRequisitions();
      loadDashboardStats();
    } catch (err) {
      console.error('Error rejecting requisition:', err);
    }
  };

  const handleConvertToPO = async (id: number, supplierId: number) => {
    try {
      await requisitionService.convertToPurchaseOrder(id, supplierId);
      loadRequisitions();
      loadDashboardStats();
    } catch (err) {
      console.error('Error converting to PO:', err);
    }
  };

  const getStatusColor = (status: RequisitionStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case RequisitionStatus.DRAFT: return 'default';
      case RequisitionStatus.SUBMITTED: return 'info';
      case RequisitionStatus.UNDER_REVIEW: return 'warning';
      case RequisitionStatus.APPROVED: return 'success';
      case RequisitionStatus.REJECTED: return 'error';
      case RequisitionStatus.CONVERTED_TO_PO: return 'primary';
      case RequisitionStatus.CANCELLED: return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: PriorityLevel): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (priority) {
      case PriorityLevel.LOW: return 'default';
      case PriorityLevel.MEDIUM: return 'info';
      case PriorityLevel.HIGH: return 'warning';
      case PriorityLevel.URGENT: return 'error';
      case PriorityLevel.CRITICAL: return 'error';
      default: return 'default';
    }
  };

  const getDepartments = () => {
    const departments = Array.from(new Set(requisitions.map(r => r.department)));
    return departments.sort();
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Purchase Requisitions
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Ethiopian ERP System - Requisition Management & Approval Workflow
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ height: 'fit-content' }}
        >
          Create Requisition
        </Button>
      </Box>

      {/* Dashboard Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <AssignmentIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                {dashboardStats.totalRequisitions}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Requisitions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <ClockIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                {dashboardStats.pendingApproval}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Pending Approval
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <CheckIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                {dashboardStats.approved}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Approved
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <WarningIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                {dashboardStats.underReview}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Under Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <TrendingUpIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                {dashboardStats.monthlyRequisitions}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                This Month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.dark', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <ClockIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                {dashboardStats.averageProcessingTime}d
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Avg. Processing
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Requisitions"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value as RequisitionStatus | 'ALL')}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value={RequisitionStatus.DRAFT}>Draft</MenuItem>
                <MenuItem value={RequisitionStatus.SUBMITTED}>Submitted</MenuItem>
                <MenuItem value={RequisitionStatus.UNDER_REVIEW}>Under Review</MenuItem>
                <MenuItem value={RequisitionStatus.APPROVED}>Approved</MenuItem>
                <MenuItem value={RequisitionStatus.REJECTED}>Rejected</MenuItem>
                <MenuItem value={RequisitionStatus.CONVERTED_TO_PO}>Converted to PO</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value as PriorityLevel | 'ALL')}
              >
                <MenuItem value="ALL">All Priorities</MenuItem>
                <MenuItem value={PriorityLevel.LOW}>Low</MenuItem>
                <MenuItem value={PriorityLevel.MEDIUM}>Medium</MenuItem>
                <MenuItem value={PriorityLevel.HIGH}>High</MenuItem>
                <MenuItem value={PriorityLevel.URGENT}>Urgent</MenuItem>
                <MenuItem value={PriorityLevel.CRITICAL}>Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={departmentFilter}
                label="Department"
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <MenuItem value="">All Departments</MenuItem>
                {getDepartments().map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={loadRequisitions}
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => {/* Implement export */}}
              >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Requisitions Table */}
      <Paper>
        {loading && <LinearProgress />}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request Number</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Requested By</TableCell>
                <TableCell>Request Date</TableCell>
                <TableCell>Required Date</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Budget (ETB)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requisitions.map((requisition) => (
                <TableRow key={requisition.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {requisition.requestNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>{requisition.department}</TableCell>
                  <TableCell>{requisition.requestedBy}</TableCell>
                  <TableCell>
                    {format(new Date(requisition.requestDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(requisition.requiredDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={requisition.priority} 
                      color={getPriorityColor(requisition.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={requisition.status.replace('_', ' ')} 
                      color={getStatusColor(requisition.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'ETB'
                    }).format(requisition.estimatedBudget)}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewDetails(requisition)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {requisition.status === RequisitionStatus.DRAFT && (
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {requisition.status === RequisitionStatus.APPROVED && (
                        <Tooltip title="Convert to PO">
                          <IconButton size="small">
                            <CartIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Create Requisition Dialog */}
      <CreateRequisitionDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateRequisition}
      />

      {/* Requisition Details Dialog */}
      {selectedRequisition && (
        <RequisitionDetailsDialog
          open={detailsDialogOpen}
          onClose={() => {
            setDetailsDialogOpen(false);
            setSelectedRequisition(null);
          }}
          requisition={selectedRequisition}
          onApprove={handleApproveRequisition}
          onReject={handleRejectRequisition}
          onConvertToPO={handleConvertToPO}
        />
      )}
    </Container>
  );
};

export default RequisitionsPage;
