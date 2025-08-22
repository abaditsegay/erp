import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  ShoppingCart as CartIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { 
  PurchaseRequisition, 
  RequisitionStatus,
  PriorityLevel,
  ApprovalStatus,
  EthiopianSupplier
} from '../../types/purchase';

interface RequisitionDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  requisition: PurchaseRequisition;
  onApprove: (id: number, comments?: string) => Promise<void>;
  onReject: (id: number, reason: string) => Promise<void>;
  onConvertToPO: (id: number, supplierId: number) => Promise<void>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`requisition-tabpanel-${index}`}
      aria-labelledby={`requisition-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const RequisitionDetailsDialog: React.FC<RequisitionDetailsDialogProps> = ({
  open,
  onClose,
  requisition,
  onApprove,
  onReject,
  onConvertToPO
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [approvalComments, setApprovalComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<number>(0);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  const getApprovalStatusColor = (status: ApprovalStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case ApprovalStatus.PENDING: return 'warning';
      case ApprovalStatus.APPROVED: return 'success';
      case ApprovalStatus.REJECTED: return 'error';
      case ApprovalStatus.DELEGATED: return 'info';
      default: return 'default';
    }
  };

  const handleApprove = async () => {
    try {
      await onApprove(requisition.id, approvalComments);
      setShowApprovalDialog(false);
      setApprovalComments('');
    } catch (error) {
      console.error('Error approving requisition:', error);
    }
  };

  const handleReject = async () => {
    try {
      await onReject(requisition.id, rejectionReason);
      setShowRejectionDialog(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting requisition:', error);
    }
  };

  const handleConvert = async () => {
    try {
      await onConvertToPO(requisition.id, selectedSupplier);
      setShowConvertDialog(false);
      setSelectedSupplier(0);
    } catch (error) {
      console.error('Error converting to PO:', error);
    }
  };

  const totalBudget = requisition.items.reduce(
    (sum, item) => sum + item.estimatedTotal, 
    0
  );

  // Mock suppliers for conversion
  const mockSuppliers: EthiopianSupplier[] = [
    {
      id: 1,
      name: 'Tech Solutions Ethiopia',
      code: 'TSE001',
      contactPerson: 'Meseret Tadesse',
      email: 'info@techsolutions.et',
      phone: '+251911234567',
      address: {
        street: 'Bole Road',
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        country: 'Ethiopia',
        poBox: '1234'
      },
      supplierType: 'LOCAL' as any,
      paymentTerms: 'NET_30' as any,
      currency: 'ETB',
      taxNumber: '1234567890',
      isImporter: false,
      rating: 4.5,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">
              Requisition Details - {requisition.requestNumber}
            </Typography>
            <Box display="flex" gap={1} mt={1}>
              <Chip 
                label={requisition.status.replace('_', ' ')} 
                color={getStatusColor(requisition.status)}
                size="small"
              />
              <Chip 
                label={requisition.priority} 
                color={getPriorityColor(requisition.priority)}
                size="small"
              />
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Overview" />
          <Tab label="Items" />
          <Tab label="Approval Workflow" />
          <Tab label="History" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="subtitle2">Request Number:</Typography>
                    <Typography variant="body1">{requisition.requestNumber}</Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2">Requested By:</Typography>
                    <Typography variant="body1">{requisition.requestedBy}</Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2">Department:</Typography>
                    <Typography variant="body1">{requisition.department}</Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2">Request Date:</Typography>
                    <Typography variant="body1">
                      {format(new Date(requisition.requestDate), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2">Required Date:</Typography>
                    <Typography variant="body1">
                      {format(new Date(requisition.requiredDate), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Budget Information
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="subtitle2">Currency:</Typography>
                    <Typography variant="body1">{requisition.currency}</Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2">Total Items:</Typography>
                    <Typography variant="body1">{requisition.items.length}</Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2">Estimated Budget:</Typography>
                    <Typography variant="h6" color="primary">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: requisition.currency
                      }).format(totalBudget)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Description & Justification
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="subtitle2">Description:</Typography>
                    <Typography variant="body1">{requisition.description}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Business Justification:</Typography>
                    <Typography variant="body1">{requisition.justification}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Requisition Items ({requisition.items.length})
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Urgency</TableCell>
                  <TableCell>Suggested Supplier</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requisition.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {item.description}
                      </Typography>
                      {item.specifications && (
                        <Typography variant="caption" color="textSecondary">
                          {item.specifications}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{item.quantity} {item.unit}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: requisition.currency
                      }).format(item.estimatedUnitPrice)}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: requisition.currency
                      }).format(item.estimatedTotal)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.urgency} 
                        size="small"
                        color={item.urgency === 'CRITICAL' ? 'error' : 
                              item.urgency === 'HIGH' ? 'warning' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{item.suggestedSupplier || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={3} p={2} bgcolor="primary.main" color="primary.contrastText" borderRadius={1}>
            <Typography variant="h6">
              Total Budget: {' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: requisition.currency
              }).format(totalBudget)}
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Approval Workflow
          </Typography>
          
          {requisition.approvals.length > 0 ? (
            <Stepper orientation="vertical">
              {requisition.approvals.map((approval, index) => (
                <Step key={approval.id} active={true}>
                  <StepLabel>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle1">
                        Level {approval.level}: {approval.approverRole}
                      </Typography>
                      <Chip 
                        label={approval.status} 
                        color={getApprovalStatusColor(approval.status)}
                        size="small"
                      />
                    </Box>
                  </StepLabel>
                  <StepContent>
                    <Box ml={2}>
                      <Typography variant="body2">
                        <strong>Approver:</strong> {approval.approverName}
                      </Typography>
                      {approval.requiredAmount && (
                        <Typography variant="body2">
                          <strong>Amount Threshold:</strong> {' '}
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: requisition.currency
                          }).format(approval.requiredAmount)}
                        </Typography>
                      )}
                      {approval.comments && (
                        <Typography variant="body2">
                          <strong>Comments:</strong> {approval.comments}
                        </Typography>
                      )}
                      {approval.approvedAt && (
                        <Typography variant="body2" color="textSecondary">
                          <strong>Approved:</strong> {format(new Date(approval.approvedAt), 'MMM dd, yyyy HH:mm')}
                        </Typography>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          ) : (
            <Alert severity="info">
              No approval workflow configured for this requisition.
            </Alert>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Activity History
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  <AssignmentIcon />
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary="Requisition Created"
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Created by {requisition.requestedBy}
                    </Typography>
                    <Typography variant="caption">
                      {format(new Date(requisition.createdAt), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>

            {requisition.approvals
              .filter(approval => approval.status === ApprovalStatus.APPROVED && approval.approvedAt)
              .map((approval, index) => (
                <ListItem key={`approval-${index}`}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                      <CheckIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={`Approved by ${approval.approverRole}`}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {approval.approverName}
                        </Typography>
                        <Typography variant="caption">
                          {approval.approvedAt && format(new Date(approval.approvedAt), 'MMM dd, yyyy HH:mm')}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}

            {requisition.updatedAt !== requisition.createdAt && (
              <ListItem>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                    <EditIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary="Last Updated"
                  secondary={
                    <Typography variant="caption">
                      {format(new Date(requisition.updatedAt), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>

        {requisition.status === RequisitionStatus.SUBMITTED && (
          <>
            <Button
              color="error"
              onClick={() => setShowRejectionDialog(true)}
              startIcon={<CancelIcon />}
            >
              Reject
            </Button>
            <Button
              color="success"
              variant="contained"
              onClick={() => setShowApprovalDialog(true)}
              startIcon={<CheckIcon />}
            >
              Approve
            </Button>
          </>
        )}

        {requisition.status === RequisitionStatus.APPROVED && (
          <Button
            variant="contained"
            onClick={() => setShowConvertDialog(true)}
            startIcon={<CartIcon />}
          >
            Convert to PO
          </Button>
        )}
      </DialogActions>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onClose={() => setShowApprovalDialog(false)}>
        <DialogTitle>Approve Requisition</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Approval Comments (Optional)"
            value={approvalComments}
            onChange={(e) => setApprovalComments(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApprovalDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApprove}>
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onClose={() => setShowRejectionDialog(false)}>
        <DialogTitle>Reject Requisition</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason *"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{ mt: 2 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRejectionDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleReject}
            disabled={!rejectionReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Convert to PO Dialog */}
      <Dialog open={showConvertDialog} onClose={() => setShowConvertDialog(false)}>
        <DialogTitle>Convert to Purchase Order</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Supplier *</InputLabel>
            <Select
              value={selectedSupplier}
              label="Select Supplier"
              onChange={(e) => setSelectedSupplier(Number(e.target.value))}
            >
              {mockSuppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name} - {supplier.currency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConvertDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleConvert}
            disabled={!selectedSupplier}
          >
            Convert to PO
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default RequisitionDetailsDialog;
