import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  Assignment as AssignmentIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

interface GRVDetailsDialogProps {
  open: boolean;
  grvId: number | null;
  onClose: () => void;
  onUpdate: () => void;
}

// Mock GRV data - in real app, this would come from API
const mockGRVDetails = {
  1: {
    id: 1,
    grvNumber: 'GRV-2024-001',
    purchaseOrder: {
      poNumber: 'PO-2024-015',
      supplier: { 
        name: 'Addis Coffee Exporters Ltd', 
        code: 'ACE001', 
        contact: 'Alemayehu Tadesse',
        phone: '+251-11-123-4567',
        email: 'contact@addiscoffee.et',
        address: 'Bole Road, Addis Ababa, Ethiopia'
      }
    },
    receivedDate: '2024-08-21T10:30:00',
    warehouse: { 
      name: 'Addis Ababa Main Warehouse', 
      region: 'Addis Ababa',
      manager: 'Yonas Bekele',
      phone: '+251-11-234-5678',
      address: 'Industrial Zone, Bole Sub-city'
    },
    status: 'RECEIVED',
    inspectionStatus: 'PENDING',
    customsStatus: 'NOT_APPLICABLE',
    totalValueETB: 824250,
    totalValueUSD: 15000,
    deliveryNote: 'DN-2024-001',
    vehicleNumber: 'AA-123-456',
    driverName: 'Kebede Alemu',
    driverPhone: '+251-911-123456',
    driverLicense: 'DL-2024-001',
    transportationType: 'TRUCK',
    emergencyContact: '+251-911-654321',
    insurancePolicy: 'INS-2024-001',
    customsRequired: false,
    inspectionRequired: true,
    specialHandlingRequired: false,
    inspectionNotes: 'Standard quality inspection required for coffee beans',
    items: [
      {
        id: 1,
        itemName: 'Premium Ethiopian Coffee Beans',
        orderedQty: 1000,
        receivedQty: 950,
        damageQty: 50,
        unit: 'kg',
        unitPrice: 450,
        condition: 'GOOD',
        batchNumber: 'BATCH-2024-001',
        expiryDate: '2025-08-21',
        notes: '50kg damaged due to moisture during transport',
        inspectionResult: 'PENDING',
        qualityGrade: 'A'
      },
      {
        id: 2,
        itemName: 'Coffee Processing Equipment',
        orderedQty: 2,
        receivedQty: 2,
        damageQty: 0,
        unit: 'units',
        unitPrice: 212500,
        condition: 'GOOD',
        batchNumber: 'EQUIP-2024-001',
        serialNumbers: ['EQ001', 'EQ002'],
        notes: 'Equipment in excellent condition',
        inspectionResult: 'PENDING',
        qualityGrade: 'A'
      }
    ],
    inspectionHistory: [
      {
        id: 1,
        date: '2024-08-21T11:00:00',
        inspector: 'Mulugeta Haile',
        status: 'INITIATED',
        notes: 'Inspection started for all items',
        priority: 'NORMAL'
      }
    ],
    workflowSteps: [
      { 
        step: 'RECEIVED', 
        status: 'COMPLETED', 
        date: '2024-08-21T10:30:00', 
        user: 'Kebede Alemu (Driver)',
        notes: 'Goods received at warehouse gate'
      },
      { 
        step: 'INSPECTION_PENDING', 
        status: 'ACTIVE', 
        date: '2024-08-21T11:00:00', 
        user: 'Mulugeta Haile (Inspector)',
        notes: 'Quality inspection in progress'
      },
      { 
        step: 'INSPECTION_COMPLETED', 
        status: 'PENDING', 
        date: null, 
        user: null,
        notes: 'Awaiting inspection completion'
      },
      { 
        step: 'APPROVED', 
        status: 'PENDING', 
        date: null, 
        user: null,
        notes: 'Awaiting final approval'
      },
      { 
        step: 'STOCK_UPDATED', 
        status: 'PENDING', 
        date: null, 
        user: null,
        notes: 'Awaiting stock system update'
      }
    ],
    documents: [
      { name: 'Delivery Note', type: 'PDF', url: '/docs/DN-2024-001.pdf' },
      { name: 'Packing List', type: 'PDF', url: '/docs/PL-2024-001.pdf' },
      { name: 'Quality Certificate', type: 'PDF', url: '/docs/QC-2024-001.pdf' },
      { name: 'Photos - Delivery', type: 'ZIP', url: '/docs/photos-delivery-001.zip' }
    ],
    auditTrail: [
      {
        timestamp: '2024-08-21T10:30:00',
        user: 'Kebede Alemu',
        action: 'GRV_CREATED',
        details: 'GRV created upon delivery arrival'
      },
      {
        timestamp: '2024-08-21T10:45:00',
        user: 'Yonas Bekele',
        action: 'INSPECTION_ASSIGNED',
        details: 'Assigned to Mulugeta Haile for quality inspection'
      },
      {
        timestamp: '2024-08-21T11:00:00',
        user: 'Mulugeta Haile',
        action: 'INSPECTION_STARTED',
        details: 'Quality inspection process initiated'
      }
    ]
  }
};

const GRVDetailsDialog: React.FC<GRVDetailsDialogProps> = ({
  open,
  grvId,
  onClose,
  onUpdate
}) => {
  const [grvData, setGrvData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [inspectionDecision, setInspectionDecision] = useState('');

  useEffect(() => {
    if (grvId && mockGRVDetails[grvId as keyof typeof mockGRVDetails]) {
      setGrvData(mockGRVDetails[grvId as keyof typeof mockGRVDetails]);
    }
  }, [grvId]);

  if (!grvData) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'APPROVED': return 'success';
      case 'ACCEPTED': return 'info';
      case 'PARTIALLY_ACCEPTED': return 'warning';
      case 'REJECTED': return 'error';
      case 'PENDING': return 'warning';
      case 'IN_PROGRESS': return 'info';
      case 'FAILED': return 'error';
      default: return 'default';
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircleIcon color="success" />;
      case 'ACTIVE': return <ScheduleIcon color="primary" />;
      case 'PENDING': return <ScheduleIcon color="disabled" />;
      case 'FAILED': return <ErrorIcon color="error" />;
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

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleInspectionUpdate = () => {
    // In real app, this would call API to update inspection
    console.log('Updating inspection:', { inspectionNotes, inspectionDecision });
    onUpdate();
  };

  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* Basic Information */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              GRV Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary" component="div">
                  GRV Number
                </Typography>
                <Typography variant="h6" color="primary" component="div">
                  {grvData.grvNumber}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary" component="div">
                  Status
                </Typography>
                <Chip 
                  label={grvData.status} 
                  color={getStatusColor(grvData.status)} 
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary" component="div">
                  Purchase Order
                </Typography>
                <Typography variant="body1" component="div">
                  {grvData.purchaseOrder.poNumber}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary" component="div">
                  Delivery Note
                </Typography>
                <Typography variant="body1" component="div">
                  {grvData.deliveryNote}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" component="div">
                  Received Date & Time
                </Typography>
                <Box display="flex" alignItems="center">
                  <CalendarIcon sx={{ mr: 1, fontSize: 16 }} color="action" />
                  <Typography variant="body1" component="span">
                    {formatDateTime(grvData.receivedDate)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Supplier Information */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Supplier Information
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              {grvData.purchaseOrder.supplier.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Code: {grvData.purchaseOrder.supplier.code}
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <PersonIcon sx={{ mr: 1, fontSize: 16 }} color="action" />
              <Typography variant="body2">
                {grvData.purchaseOrder.supplier.contact}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <PhoneIcon sx={{ mr: 1, fontSize: 16 }} color="action" />
              <Typography variant="body2">
                {grvData.purchaseOrder.supplier.phone}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <LocationIcon sx={{ mr: 1, fontSize: 16 }} color="action" />
              <Typography variant="body2">
                {grvData.purchaseOrder.supplier.address}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Warehouse Information */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Warehouse Information
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              {grvData.warehouse.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Region: {grvData.warehouse.region}
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <PersonIcon sx={{ mr: 1, fontSize: 16 }} color="action" />
              <Typography variant="body2">
                Manager: {grvData.warehouse.manager}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <PhoneIcon sx={{ mr: 1, fontSize: 16 }} color="action" />
              <Typography variant="body2">
                {grvData.warehouse.phone}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <LocationIcon sx={{ mr: 1, fontSize: 16 }} color="action" />
              <Typography variant="body2">
                {grvData.warehouse.address}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Delivery Information */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Delivery Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Vehicle Number
                </Typography>
                <Typography variant="body1">
                  {grvData.vehicleNumber}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Transportation
                </Typography>
                <Typography variant="body1">
                  {grvData.transportationType}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Driver Name
                </Typography>
                <Typography variant="body1">
                  {grvData.driverName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Driver Phone
                </Typography>
                <Typography variant="body1">
                  {grvData.driverPhone}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  License
                </Typography>
                <Typography variant="body1">
                  {grvData.driverLicense}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Insurance
                </Typography>
                <Typography variant="body1">
                  {grvData.insurancePolicy}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Financial Summary */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Financial Summary
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="textSecondary">
                  Total Value (ETB)
                </Typography>
                <Typography variant="h4" color="primary">
                  {formatCurrency(grvData.totalValueETB, 'ETB')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="textSecondary">
                  Total Value (USD)
                </Typography>
                <Typography variant="h4" color="secondary">
                  {formatCurrency(grvData.totalValueUSD, 'USD')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="textSecondary">
                  Exchange Rate
                </Typography>
                <Typography variant="h6">
                  54.95 ETB/USD
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Status Summary */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Status Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="body2" color="textSecondary">
                    Inspection Status
                  </Typography>
                  <Chip 
                    label={grvData.inspectionStatus} 
                    color={getStatusColor(grvData.inspectionStatus)} 
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {grvData.inspectionRequired ? 'Required' : 'Not Required'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="body2" color="textSecondary">
                    Customs Status
                  </Typography>
                  <Chip 
                    label={grvData.customsStatus.replace('_', ' ')} 
                    color={getStatusColor(grvData.customsStatus)} 
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {grvData.customsRequired ? 'Required' : 'Not Required'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="body2" color="textSecondary">
                    Special Handling
                  </Typography>
                  <Chip 
                    label={grvData.specialHandlingRequired ? 'Required' : 'Not Required'} 
                    color={grvData.specialHandlingRequired ? 'warning' : 'default'} 
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {grvData.specialHandlingRequired ? 'Special handling needed' : 'Standard handling'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderItems = () => (
    <TableContainer component={Card}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            <TableCell>Ordered</TableCell>
            <TableCell>Received</TableCell>
            <TableCell>Damaged</TableCell>
            <TableCell>Condition</TableCell>
            <TableCell>Batch/Serial</TableCell>
            <TableCell>Unit Price</TableCell>
            <TableCell>Total Value</TableCell>
            <TableCell>Quality</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grvData.items.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {item.itemName}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Unit: {item.unit}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="medium">
                  {item.orderedQty.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" color="success.main">
                  {item.receivedQty.toLocaleString()}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(item.receivedQty / item.orderedQty) * 100} 
                  color="success"
                  sx={{ mt: 1 }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body1" color={item.damageQty > 0 ? 'error.main' : 'textSecondary'}>
                  {item.damageQty.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={item.condition} 
                  color={item.condition === 'GOOD' ? 'success' : 'warning'} 
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {item.batchNumber}
                </Typography>
                {item.serialNumbers && (
                  <Typography variant="caption" color="textSecondary">
                    {item.serialNumbers.join(', ')}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatCurrency(item.unitPrice, 'ETB')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(item.receivedQty * item.unitPrice, 'ETB')}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={`Grade ${item.qualityGrade}`} 
                  color="info" 
                  size="small"
                />
                <Typography variant="caption" display="block" color="textSecondary">
                  {item.inspectionResult}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ maxWidth: 200 }}>
                  {item.notes}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderWorkflow = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          GRV Processing Workflow
        </Typography>
        <Stepper orientation="vertical">
          {grvData.workflowSteps.map((step: any, index: number) => (
            <Step key={index} active={step.status === 'ACTIVE'} completed={step.status === 'COMPLETED'}>
              <StepLabel 
                icon={getStepIcon(step.status)}
                sx={{
                  '& .MuiStepLabel-label': {
                    color: step.status === 'COMPLETED' ? 'success.main' : 
                           step.status === 'ACTIVE' ? 'primary.main' : 'text.secondary'
                  }
                }}
              >
                <Typography variant="subtitle1">
                  {step.step.replace('_', ' ')}
                </Typography>
                {step.date && (
                  <Typography variant="body2" color="textSecondary">
                    {formatDateTime(step.date)} • {step.user}
                  </Typography>
                )}
              </StepLabel>
              <StepContent>
                <Typography variant="body2">
                  {step.notes}
                </Typography>
                {step.status === 'ACTIVE' && step.step === 'INSPECTION_PENDING' && (
                  <Box mt={2}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Quality inspection is currently in progress. You can update the inspection status below.
                    </Alert>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Inspection Notes"
                          multiline
                          rows={3}
                          value={inspectionNotes}
                          onChange={(e) => setInspectionNotes(e.target.value)}
                          placeholder="Enter inspection findings and recommendations..."
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Inspection Decision</InputLabel>
                          <Select
                            value={inspectionDecision}
                            onChange={(e) => setInspectionDecision(e.target.value)}
                            label="Inspection Decision"
                          >
                            <MenuItem value="APPROVED">Approve All Items</MenuItem>
                            <MenuItem value="PARTIAL">Partial Approval</MenuItem>
                            <MenuItem value="REJECTED">Reject All Items</MenuItem>
                            <MenuItem value="HOLD">Put on Hold</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleInspectionUpdate}
                          disabled={!inspectionDecision}
                          fullWidth
                        >
                          Update Inspection
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </CardContent>
    </Card>
  );

  const renderDocuments = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Related Documents
        </Typography>
        <List>
          {grvData.documents.map((doc: any, index: number) => (
            <ListItem key={index} divider>
              <ListItemIcon>
                <AssignmentIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={doc.name}
                secondary={`Format: ${doc.type}`}
              />
              <IconButton color="primary" onClick={() => window.open(doc.url, '_blank')}>
                <DownloadIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderAuditTrail = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Audit Trail
        </Typography>
        <List>
          {grvData.auditTrail.map((entry: any, index: number) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" fontWeight="medium">
                      {entry.action.replace('_', ' ')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatDateTime(entry.timestamp)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      User: {entry.user}
                    </Typography>
                    <Typography variant="body2">
                      {entry.details}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <ViewIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">
              GRV Details - {grvData.grvNumber}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={() => setEditMode(!editMode)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton color="primary">
              <PrintIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Button 
            variant={activeTab === 'overview' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('overview')}
            sx={{ mr: 1, mb: 1 }}
          >
            Overview
          </Button>
          <Button 
            variant={activeTab === 'items' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('items')}
            sx={{ mr: 1, mb: 1 }}
          >
            Items ({grvData.items.length})
          </Button>
          <Button 
            variant={activeTab === 'workflow' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('workflow')}
            sx={{ mr: 1, mb: 1 }}
          >
            Workflow
          </Button>
          <Button 
            variant={activeTab === 'documents' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('documents')}
            sx={{ mr: 1, mb: 1 }}
          >
            Documents
          </Button>
          <Button 
            variant={activeTab === 'audit' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('audit')}
            sx={{ mr: 1, mb: 1 }}
          >
            Audit Trail
          </Button>
        </Box>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'items' && renderItems()}
        {activeTab === 'workflow' && renderWorkflow()}
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'audit' && renderAuditTrail()}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" startIcon={<PrintIcon />}>
          Print GRV
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GRVDetailsDialog;
