import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Payment as PaymentIcon,
  AccountBalance as BankIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  DateRange as DateIcon,
  Person as PersonIcon,
  Note as NoteIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  History as HistoryIcon,
  Approval as ApprovalIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { 
  Payment, 
  PaymentItem,
  paymentService 
} from '../../services/paymentService';

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
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface PaymentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  payment: Payment | null;
  onEdit?: (payment: Payment) => void;
  onApprove?: (paymentId: string) => void;
  onReject?: (paymentId: string, reason: string) => void;
  onProcess?: (paymentId: string) => void;
}

const PaymentDetailsDialog: React.FC<PaymentDetailsDialogProps> = ({
  open,
  onClose,
  payment,
  onEdit,
  onApprove,
  onReject,
  onProcess,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  // Mock approval workflow data
  const approvalSteps = [
    {
      id: 'finance_review',
      name: 'Finance Review',
      assignedTo: 'Meron Tadesse (Finance Manager)',
      status: payment?.status === 'draft' ? 'pending' : 'completed',
      completedAt: payment?.status !== 'draft' ? '2024-01-15T10:30:00Z' : null,
      notes: 'Payment verified against purchase order and invoice',
    },
    {
      id: 'director_approval',
      name: 'Director Approval',
      assignedTo: 'Dr. Abebe Kebede (Director)',
      status: payment?.status === 'approved' || payment?.status === 'processing' || payment?.status === 'paid' ? 'completed' : 
             payment?.status === 'pending_approval' ? 'pending' : 'waiting',
      completedAt: payment?.status === 'approved' || payment?.status === 'processing' || payment?.status === 'paid' ? '2024-01-15T14:45:00Z' : null,
      notes: 'Approved for payment processing',
    },
    {
      id: 'payment_processing',
      name: 'Payment Processing',
      assignedTo: 'Almaz Worku (Accounts Payable)',
      status: payment?.status === 'paid' ? 'completed' : 
             payment?.status === 'processing' ? 'in_progress' : 'waiting',
      completedAt: payment?.status === 'paid' ? '2024-01-16T09:15:00Z' : null,
      notes: payment?.status === 'paid' ? 'Payment processed via CBE transfer' : '',
    },
  ];

  const loadPaymentHistory = useCallback(async () => {
    if (!payment) return;
    
    // Mock history data
    const history = [
      {
        id: '1',
        action: 'Payment Created',
        user: 'Samuel Tekle',
        timestamp: payment.requestDate,
        details: 'Payment request submitted for approval',
        icon: 'create',
      },
      {
        id: '2',
        action: 'Finance Review',
        user: 'Meron Tadesse',
        timestamp: '2024-01-15T10:30:00Z',
        details: 'Payment verified and approved by finance team',
        icon: 'approve',
      },
      {
        id: '3',
        action: 'Director Approval',
        user: 'Dr. Abebe Kebede',
        timestamp: '2024-01-15T14:45:00Z',
        details: 'Final approval granted for payment processing',
        icon: 'approve',
      },
    ];

    if (payment.status === 'processing' || payment.status === 'paid') {
      history.push({
        id: '4',
        action: 'Payment Processing',
        user: 'Almaz Worku',
        timestamp: '2024-01-16T09:15:00Z',
        details: 'Payment initiated via bank transfer',
        icon: 'process',
      });
    }

    if (payment.status === 'paid') {
      history.push({
        id: '5',
        action: 'Payment Completed',
        user: 'System',
        timestamp: '2024-01-16T11:30:00Z',
        details: 'Payment successfully transferred to vendor',
        icon: 'complete',
      });
    }

    setPaymentHistory(history);
  }, [payment]);

  useEffect(() => {
    if (payment) {
      // Load payment history
      loadPaymentHistory();
    }
  }, [payment, loadPaymentHistory]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleApprove = () => {
    if (payment && onApprove) {
      onApprove(payment.id);
      enqueueSnackbar('Payment approved successfully', { variant: 'success' });
    }
  };

  const handleReject = () => {
    if (payment && onReject && rejectReason.trim()) {
      onReject(payment.id, rejectReason);
      setShowRejectDialog(false);
      setRejectReason('');
      enqueueSnackbar('Payment rejected', { variant: 'warning' });
    }
  };

  const handleProcess = () => {
    if (payment && onProcess) {
      onProcess(payment.id);
      enqueueSnackbar('Payment processing initiated', { variant: 'info' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'pending_approval': return 'warning';
      case 'approved': return 'info';
      case 'processing': return 'primary';
      case 'paid': return 'success';
      case 'failed': return 'error';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const calculateTax = () => {
    if (!payment) return { vat: 0, withholding: 0 };
    
    const subtotal = payment.items.reduce((sum, item) => sum + item.amount, 0);
    const vat = subtotal * 0.15; // 15% VAT
    const withholding = subtotal * 0.02; // 2% withholding tax
    
    return { vat, withholding };
  };

  const tax = calculateTax();

  if (!payment) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaymentIcon color="primary" />
              <Box>
                <Typography variant="h6">
                  Payment Details
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {payment.paymentNumber}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={payment.status.replace('_', ' ').toUpperCase()}
                color={getStatusColor(payment.status)}
                size="small"
              />
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Overview" icon={<ViewIcon />} />
              <Tab label="Items" icon={<ReceiptIcon />} />
              <Tab label="Approval Workflow" icon={<ApprovalIcon />} />
              <Tab label="History" icon={<HistoryIcon />} />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {/* Payment Summary */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Payment Summary
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Total Amount:</Typography>
                      <Typography variant="h5" color="primary.main">
                        {formatCurrency(payment.totalAmount, payment.currency)}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Status:</Typography>
                      <Chip
                        label={payment.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(payment.status)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Priority:</Typography>
                      <Chip
                        label={payment.priority.toUpperCase()}
                        color={getPriorityColor(payment.priority)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Due Date:</Typography>
                      <Typography variant="body1">
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Category:</Typography>
                      <Typography variant="body1">
                        {payment.category.replace('_', ' ').toUpperCase()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Vendor Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Vendor Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Vendor Name:</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {payment.vendor.name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Tax Number:</Typography>
                      <Typography variant="body1">
                        {payment.vendor.taxNumber}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Bank Account:</Typography>
                      <Typography variant="body1">
                        {payment.vendor.bankAccount} - {payment.vendor.bankName}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Contact:</Typography>
                      <Typography variant="body1">
                        {payment.vendor.contactPerson}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {payment.vendor.phone} • {payment.vendor.email}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Address:</Typography>
                      <Typography variant="body1">
                        {payment.vendor.address}, {payment.vendor.city}, {payment.vendor.region}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Payment Details */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Payment Details
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Payment Method:</Typography>
                      <Typography variant="body1">
                        {payment.paymentMethod.name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Reference:</Typography>
                      <Typography variant="body1">
                        {payment.reference}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Department:</Typography>
                      <Typography variant="body1">
                        {payment.department}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Requested By:</Typography>
                      <Typography variant="body1">
                        {payment.requestedBy}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Request Date:</Typography>
                      <Typography variant="body1">
                        {new Date(payment.requestDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Ethiopian Tax Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Ethiopian Tax Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">VAT (15%):</Typography>
                      <Typography variant="body1">
                        {formatCurrency(tax.vat, payment.currency)}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Withholding Tax (2%):</Typography>
                      <Typography variant="body1" color="success.main">
                        -{formatCurrency(tax.withholding, payment.currency)}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Tax Invoice Required:</Typography>
                      <Chip
                        label={payment.taxInvoice ? 'Yes' : 'No'}
                        color={payment.taxInvoice ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">VAT Certificate:</Typography>
                      <Chip
                        label={payment.vatCertificate ? 'Available' : 'N/A'}
                        color={payment.vatCertificate ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Withholding Certificate:</Typography>
                      <Chip
                        label={payment.withholdingCertificate ? 'Available' : 'N/A'}
                        color={payment.withholdingCertificate ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Description and Notes */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Description & Notes
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Description:</Typography>
                      <Typography variant="body1">
                        {payment.description}
                      </Typography>
                    </Box>
                    {payment.notes && (
                      <Box>
                        <Typography variant="body2" color="textSecondary">Notes:</Typography>
                        <Typography variant="body1">
                          {payment.notes}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Payment Items ({payment.items.length})
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Currency</TableCell>
                      <TableCell align="right">Tax Amount</TableCell>
                      <TableCell align="right">VAT Rate</TableCell>
                      <TableCell align="right">Withholding</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payment.items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">
                          {item.amount.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">{item.currency}</TableCell>
                        <TableCell align="right">
                          {item.taxAmount ? item.taxAmount.toLocaleString() : '-'}
                        </TableCell>
                        <TableCell align="right">
                          {item.vatRate ? `${(item.vatRate * 100).toFixed(1)}%` : '-'}
                        </TableCell>
                        <TableCell align="right">
                          {item.withholding ? item.withholding.toLocaleString() : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Payment Summary
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Subtotal:</Typography>
                        <Typography fontWeight="medium">
                          {formatCurrency(payment.items.reduce((sum, item) => sum + item.amount, 0), payment.currency)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>VAT (15%):</Typography>
                        <Typography fontWeight="medium">
                          {formatCurrency(tax.vat, payment.currency)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Withholding Tax (2%):</Typography>
                        <Typography fontWeight="medium" color="success.main">
                          -{formatCurrency(tax.withholding, payment.currency)}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Total Amount:</Typography>
                        <Typography variant="h6" color="primary.main">
                          {formatCurrency(payment.totalAmount, payment.currency)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Approval Workflow
              </Typography>
              <Stepper orientation="vertical">
                {approvalSteps.map((step, index) => (
                  <Step key={step.id} active={true}>
                    <StepLabel
                      icon={
                        step.status === 'completed' ? (
                          <CheckCircleIcon color="success" />
                        ) : step.status === 'in_progress' ? (
                          <PendingIcon color="primary" />
                        ) : step.status === 'pending' ? (
                          <ScheduleIcon color="warning" />
                        ) : (
                          <ScheduleIcon color="disabled" />
                        )
                      }
                    >
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {step.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {step.assignedTo}
                        </Typography>
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ pb: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                          {step.notes}
                        </Typography>
                        {step.completedAt && (
                          <Typography variant="caption" color="textSecondary">
                            Completed: {new Date(step.completedAt).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              {/* Approval Actions */}
              {(payment.status === 'pending_approval' || payment.status === 'draft') && (
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Approval Actions
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<ApproveIcon />}
                        onClick={handleApprove}
                      >
                        Approve Payment
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<RejectIcon />}
                        onClick={() => setShowRejectDialog(true)}
                      >
                        Reject Payment
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {payment.status === 'approved' && (
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Processing Actions
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PaymentIcon />}
                      onClick={handleProcess}
                    >
                      Process Payment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Payment History
              </Typography>
              <List>
                {paymentHistory.map((entry, index) => (
                  <ListItem key={entry.id} sx={{ py: 2 }}>
                    <ListItemIcon>
                      {entry.icon === 'create' && <NoteIcon color="primary" />}
                      {entry.icon === 'approve' && <CheckCircleIcon color="success" />}
                      {entry.icon === 'process' && <PaymentIcon color="warning" />}
                      {entry.icon === 'complete' && <CheckCircleIcon color="success" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight="medium">
                          {entry.action}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            by {entry.user} • {new Date(entry.timestamp).toLocaleString()}
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
            </Box>
          </TabPanel>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => onEdit(payment)}
            >
              Edit Payment
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this payment:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRejectDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={!rejectReason.trim()}
          >
            Reject Payment
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentDetailsDialog;