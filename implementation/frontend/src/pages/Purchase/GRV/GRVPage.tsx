import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocalShipping as ShippingIcon,
  Assessment as AssessmentIcon,
  Inventory as InventoryIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CloudDownload as ImportIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import CreateGRVDialog from '../../../components/Purchase/CreateGRVDialog';
import GRVDetailsDialog from '../../../components/Purchase/GRVDetailsDialog';

// Mock GRV data with Ethiopian business context
const mockGRVStats = {
  totalGRVs: 156,
  pendingInspection: 12,
  awaitingCustoms: 8,
  completedToday: 5,
  totalValueReceivedETB: 2450000,
  totalValueReceivedUSD: 44580,
  averageProcessingTime: 2.5,
  qualityAcceptanceRate: 0.94
};

const mockGRVs = [
  {
    id: 1,
    grvNumber: 'GRV-2024-001',
    purchaseOrder: {
      poNumber: 'PO-2024-015',
      supplier: { name: 'Addis Coffee Exporters Ltd', code: 'ACE001' }
    },
    receivedDate: '2024-08-21T10:30:00',
    warehouse: { name: 'Addis Ababa Main Warehouse', region: 'Addis Ababa' },
    status: 'RECEIVED',
    inspectionStatus: 'PENDING',
    customsStatus: 'NOT_APPLICABLE',
    totalValueETB: 824250,
    totalValueUSD: 15000,
    deliveryNote: 'DN-2024-001',
    vehicleNumber: 'AA-123-456',
    driverName: 'Kebede Alemu',
    driverPhone: '+251-911-123456'
  },
  {
    id: 2,
    grvNumber: 'GRV-2024-002',
    purchaseOrder: {
      poNumber: 'PO-2024-016',
      supplier: { name: 'Dubai International Trading', code: 'DIT002' }
    },
    receivedDate: '2024-08-20T14:15:00',
    warehouse: { name: 'Bole International Airport Customs', region: 'Addis Ababa' },
    status: 'INSPECTED',
    inspectionStatus: 'COMPLETED',
    customsStatus: 'IN_PROGRESS',
    totalValueETB: 1648500,
    totalValueUSD: 30000,
    deliveryNote: 'DN-2024-002',
    vehicleNumber: 'AA-456-789',
    driverName: 'Mohammed Ali',
    driverPhone: '+251-911-456789'
  },
  {
    id: 3,
    grvNumber: 'GRV-2024-003',
    purchaseOrder: {
      poNumber: 'PO-2024-017',
      supplier: { name: 'Ethiopian Grain Trading', code: 'EGT003' }
    },
    receivedDate: '2024-08-19T09:45:00',
    warehouse: { name: 'Dire Dawa Distribution Center', region: 'Dire Dawa' },
    status: 'COMPLETED',
    inspectionStatus: 'COMPLETED',
    customsStatus: 'NOT_APPLICABLE',
    totalValueETB: 412125,
    totalValueUSD: 7500,
    deliveryNote: 'DN-2024-003',
    vehicleNumber: 'DD-789-123',
    driverName: 'Haile Gebremariam',
    driverPhone: '+251-911-789123'
  },
  {
    id: 4,
    grvNumber: 'GRV-2024-004',
    purchaseOrder: {
      poNumber: 'PO-2024-018',
      supplier: { name: 'Mekelle Medical Supplies', code: 'MMS004' }
    },
    receivedDate: '2024-08-18T16:20:00',
    warehouse: { name: 'Mekelle Branch Warehouse', region: 'Tigray' },
    status: 'ACCEPTED',
    inspectionStatus: 'COMPLETED',
    customsStatus: 'NOT_APPLICABLE',
    totalValueETB: 1097000,
    totalValueUSD: 19958,
    deliveryNote: 'DN-2024-004',
    vehicleNumber: 'MK-321-654',
    driverName: 'Girmay Hagos',
    driverPhone: '+251-911-321654'
  },
  {
    id: 5,
    grvNumber: 'GRV-2024-005',
    purchaseOrder: {
      poNumber: 'PO-2024-019',
      supplier: { name: 'Hawassa Textile Manufacturing', code: 'HTM005' }
    },
    receivedDate: '2024-08-17T11:10:00',
    warehouse: { name: 'Hawassa Regional Warehouse', region: 'SNNPR' },
    status: 'PARTIALLY_ACCEPTED',
    inspectionStatus: 'COMPLETED',
    customsStatus: 'NOT_APPLICABLE',
    totalValueETB: 549450,
    totalValueUSD: 10000,
    deliveryNote: 'DN-2024-005',
    vehicleNumber: 'HW-654-987',
    driverName: 'Desta Tadesse',
    driverPhone: '+251-911-654987'
  }
];

const GRVPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [inspectionFilter, setInspectionFilter] = useState('');
  const [customsFilter, setCustomsFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedGRVId, setSelectedGRVId] = useState<number | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleViewGRV = (id: number) => {
    setSelectedGRVId(id);
    setDetailsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'ACCEPTED': return 'info';
      case 'PARTIALLY_ACCEPTED': return 'warning';
      case 'REJECTED': return 'error';
      case 'DRAFT': return 'default';
      default: return 'primary';
    }
  };

  const getInspectionStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircleIcon color="success" />;
      case 'IN_PROGRESS': return <ScheduleIcon color="warning" />;
      case 'FAILED': return <CheckCircleIcon color="error" />;
      default: return <ScheduleIcon color="disabled" />;
    }
  };

  const getCustomsStatusIcon = (status: string) => {
    switch (status) {
      case 'CLEARED': return <CheckCircleIcon color="success" />;
      case 'IN_PROGRESS': return <ScheduleIcon color="warning" />;
      case 'HELD': return <CheckCircleIcon color="error" />;
      case 'NOT_APPLICABLE': return <CheckCircleIcon color="disabled" />;
      default: return <ScheduleIcon color="disabled" />;
    }
  };

  const formatCurrency = (amount: number, currency: 'USD' | 'ETB') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'ETB' ? 'USD' : currency,
      minimumFractionDigits: 2
    }).format(amount) + (currency === 'ETB' ? ' ETB' : '');
  };

  // Filter GRVs based on current tab and filters
  const getFilteredGRVs = () => {
    let filtered = [...mockGRVs];

    // Tab-based filtering
    switch (activeTab) {
      case 1: // Pending Inspection
        filtered = filtered.filter(grv => grv.inspectionStatus === 'PENDING');
        break;
      case 2: // Customs Clearance
        filtered = filtered.filter(grv => grv.customsStatus === 'IN_PROGRESS' || grv.customsStatus === 'PENDING');
        break;
      case 3: // Recently Completed
        filtered = filtered.filter(grv => grv.status === 'COMPLETED');
        break;
    }

    // Apply additional filters
    if (statusFilter) {
      filtered = filtered.filter(grv => grv.status === statusFilter);
    }
    if (inspectionFilter) {
      filtered = filtered.filter(grv => grv.inspectionStatus === inspectionFilter);
    }
    if (customsFilter) {
      filtered = filtered.filter(grv => grv.customsStatus === customsFilter);
    }
    if (warehouseFilter) {
      filtered = filtered.filter(grv => grv.warehouse.region === warehouseFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(grv => 
        grv.grvNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grv.purchaseOrder.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grv.purchaseOrder.supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grv.deliveryNote.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const renderDashboard = () => (
    <Grid container spacing={3}>
      {/* Statistics Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Total GRVs
                </Typography>
                <Typography variant="h4">
                  {mockGRVStats.totalGRVs}
                </Typography>
                <Typography variant="body2" color="success.main">
                  +12% from last month
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
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Pending Inspection
                </Typography>
                <Typography variant="h4">
                  {mockGRVStats.pendingInspection}
                </Typography>
                <Typography variant="body2" color="warning.main">
                  Requires attention
                </Typography>
              </Box>
              <AssessmentIcon color="warning" sx={{ fontSize: 40 }} />
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
                  Awaiting Customs
                </Typography>
                <Typography variant="h4">
                  {mockGRVStats.awaitingCustoms}
                </Typography>
                <Typography variant="body2" color="info.main">
                  At Bole Airport
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
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Completed Today
                </Typography>
                <Typography variant="h4">
                  {mockGRVStats.completedToday}
                </Typography>
                <Typography variant="body2" color="success.main">
                  On schedule
                </Typography>
              </Box>
              <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Financial Summary */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Value Received This Month
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              {formatCurrency(mockGRVStats.totalValueReceivedETB, 'ETB')}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              USD: {formatCurrency(mockGRVStats.totalValueReceivedUSD, 'USD')}
            </Typography>
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                Exchange Rate: 54.95 ETB/USD
              </Typography>
              <Typography variant="body2" color="success.main">
                +18% from last month
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Quality Metrics */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quality & Performance Metrics
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Quality Acceptance Rate
              </Typography>
              <Typography variant="h4" color="success.main">
                {(mockGRVStats.qualityAcceptanceRate * 100).toFixed(1)}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={mockGRVStats.qualityAcceptanceRate * 100} 
                color="success"
                sx={{ mt: 1 }}
              />
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Average Processing Time
              </Typography>
              <Typography variant="h6">
                {mockGRVStats.averageProcessingTime} hours
              </Typography>
              <Typography variant="body2" color="success.main">
                15% faster than target
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Regional Performance */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Regional Distribution
            </Typography>
            <Grid container spacing={2}>
              {[
                { region: 'Addis Ababa', count: 45, percentage: 29 },
                { region: 'Dire Dawa', count: 28, percentage: 18 },
                { region: 'Hawassa (SNNPR)', count: 35, percentage: 22 },
                { region: 'Mekelle (Tigray)', count: 25, percentage: 16 },
                { region: 'Bahir Dar (Amhara)', count: 23, percentage: 15 }
              ].map((item) => (
                <Grid item xs={12} sm={6} md={2.4} key={item.region}>
                  <Box textAlign="center">
                    <Typography variant="h5" color="primary">
                      {item.count}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.region}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      {item.percentage}%
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderGRVList = () => {
    const filteredGRVs = getFilteredGRVs();
    const paginatedGRVs = filteredGRVs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              Goods Received Vouchers ({filteredGRVs.length})
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                size="small"
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<ImportIcon />}
                size="small"
              >
                Import
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                size="small"
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
              >
                Create GRV
              </Button>
            </Box>
          </Box>

          {/* Filters */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="GRV, PO, Supplier..."
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="RECEIVED">Received</MenuItem>
                  <MenuItem value="INSPECTED">Inspected</MenuItem>
                  <MenuItem value="ACCEPTED">Accepted</MenuItem>
                  <MenuItem value="PARTIALLY_ACCEPTED">Partially Accepted</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Inspection</InputLabel>
                <Select
                  value={inspectionFilter}
                  onChange={(e) => setInspectionFilter(e.target.value)}
                  label="Inspection"
                >
                  <MenuItem value="">All Inspections</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="FAILED">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Customs</InputLabel>
                <Select
                  value={customsFilter}
                  onChange={(e) => setCustomsFilter(e.target.value)}
                  label="Customs"
                >
                  <MenuItem value="">All Customs</MenuItem>
                  <MenuItem value="NOT_APPLICABLE">Not Applicable</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="CLEARED">Cleared</MenuItem>
                  <MenuItem value="HELD">Held</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Region</InputLabel>
                <Select
                  value={warehouseFilter}
                  onChange={(e) => setWarehouseFilter(e.target.value)}
                  label="Region"
                >
                  <MenuItem value="">All Regions</MenuItem>
                  <MenuItem value="Addis Ababa">Addis Ababa</MenuItem>
                  <MenuItem value="Dire Dawa">Dire Dawa</MenuItem>
                  <MenuItem value="SNNPR">SNNPR (Hawassa)</MenuItem>
                  <MenuItem value="Tigray">Tigray (Mekelle)</MenuItem>
                  <MenuItem value="Amhara">Amhara (Bahir Dar)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <IconButton size="small">
                <FilterIcon />
              </IconButton>
            </Grid>
          </Grid>

          {/* Alert for filtered results */}
          {(statusFilter || inspectionFilter || customsFilter || warehouseFilter || searchQuery) && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Showing {filteredGRVs.length} GRVs matching your filters.
              <Button size="small" onClick={() => {
                setStatusFilter('');
                setInspectionFilter('');
                setCustomsFilter('');
                setWarehouseFilter('');
                setSearchQuery('');
              }}>
                Clear all filters
              </Button>
            </Alert>
          )}

          {/* GRV Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>GRV Number</TableCell>
                  <TableCell>PO Number</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Received Date</TableCell>
                  <TableCell>Warehouse</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Inspection</TableCell>
                  <TableCell>Customs</TableCell>
                  <TableCell>Value (ETB)</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedGRVs.map((grv) => (
                  <TableRow key={grv.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {grv.grvNumber}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {grv.deliveryNote}
                      </Typography>
                    </TableCell>
                    <TableCell>{grv.purchaseOrder.poNumber}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {grv.purchaseOrder.supplier.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {grv.purchaseOrder.supplier.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {format(new Date(grv.receivedDate), 'MMM dd, yyyy')}
                      <br />
                      <Typography variant="caption" color="textSecondary">
                        {format(new Date(grv.receivedDate), 'HH:mm')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {grv.warehouse.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {grv.warehouse.region}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={grv.status.replace('_', ' ')}
                        color={getStatusColor(grv.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={grv.inspectionStatus}>
                        {getInspectionStatusIcon(grv.inspectionStatus)}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={grv.customsStatus}>
                        {getCustomsStatusIcon(grv.customsStatus)}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(grv.totalValueETB, 'ETB')}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatCurrency(grv.totalValueUSD, 'USD')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {grv.driverName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {grv.vehicleNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewGRV(grv.id)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredGRVs.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Goods Received Vouchers
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Ethiopian ERP System - Comprehensive goods receipt, inspection, and customs clearance management
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Dashboard" />
        <Tab label="All GRVs" />
        <Tab label="Pending Inspection" />
        <Tab label="Customs Clearance" />
        <Tab label="Recently Completed" />
      </Tabs>

      {activeTab === 0 && renderDashboard()}
      {activeTab >= 1 && renderGRVList()}

      <CreateGRVDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={() => {
          setCreateDialogOpen(false);
          // Add refresh logic here
        }}
      />

      <GRVDetailsDialog
        open={detailsDialogOpen}
        grvId={selectedGRVId}
        onClose={() => {
          setDetailsDialogOpen(false);
          setSelectedGRVId(null);
        }}
        onUpdate={() => {
          // Add refresh logic here
        }}
      />
    </Box>
  );
};

export default GRVPage;
