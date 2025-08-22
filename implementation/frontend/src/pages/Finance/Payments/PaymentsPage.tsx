import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment,
  Pagination,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Payment as PaymentIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  TrendingUp as TrendingUpIcon,
  PendingActions as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  AccountBalance as BankIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  ContentCopy as ContentCopyIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import CreatePaymentDialog from '../../../components/Finance/CreatePaymentDialog';
import PaymentDetailsDialog from '../../../components/Finance/PaymentDetailsDialog';
import { 
  Payment, 
  PaymentDashboardStats,
  paymentService 
} from '../../../services/paymentService';

const PaymentsPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [actionMenu, setActionMenu] = useState<{
    anchorEl: HTMLElement | null;
    payment: Payment | null;
  }>({ anchorEl: null, payment: null });

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [paymentsData, statsData] = await Promise.all([
        paymentService.getPayments(),
        paymentService.getDashboardStats(),
      ]);
      setPayments(paymentsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      enqueueSnackbar('Error loading payments data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter payments when search term or filters change
  const filterPayments = useCallback(() => {
    let filtered = payments;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.paymentNumber.toLowerCase().includes(search) ||
        payment.vendor.name.toLowerCase().includes(search) ||
        payment.description.toLowerCase().includes(search) ||
        payment.reference.toLowerCase().includes(search) ||
        payment.department.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(payment => payment.priority === priorityFilter);
    }

    // Currency filter
    if (currencyFilter !== 'all') {
      filtered = filtered.filter(payment => payment.currency === currencyFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(payment => payment.category === categoryFilter);
    }

    setFilteredPayments(filtered);
    setPage(1); // Reset to first page when filters change
  }, [payments, searchTerm, statusFilter, priorityFilter, currencyFilter, categoryFilter]);

  useEffect(() => {
    filterPayments();
  }, [filterPayments]);

  const handleCreatePayment = () => {
    setSelectedPayment(null);
    setCreateDialogOpen(true);
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setDetailsDialogOpen(true);
    setActionMenu({ anchorEl: null, payment: null });
  };

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setCreateDialogOpen(true);
    setActionMenu({ anchorEl: null, payment: null });
  };

  const handleApprovePayment = async (payment: Payment) => {
    try {
      await paymentService.approvePayment(payment.id, 'Current User', 'Approved via payment dashboard');
      enqueueSnackbar('Payment approved successfully', { variant: 'success' });
      loadData();
    } catch (error) {
      console.error('Error approving payment:', error);
      enqueueSnackbar('Error approving payment', { variant: 'error' });
    }
    setActionMenu({ anchorEl: null, payment: null });
  };

  const handleRejectPayment = async (payment: Payment) => {
    try {
      await paymentService.rejectPayment(payment.id, 'Current User', 'Rejected via payment dashboard');
      enqueueSnackbar('Payment rejected', { variant: 'warning' });
      loadData();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      enqueueSnackbar('Error rejecting payment', { variant: 'error' });
    }
    setActionMenu({ anchorEl: null, payment: null });
  };

  const handleProcessPayment = async (payment: Payment) => {
    try {
      await paymentService.processPayment(payment.id, 'Current User');
      enqueueSnackbar('Payment processing started', { variant: 'info' });
      loadData();
    } catch (error) {
      console.error('Error processing payment:', error);
      enqueueSnackbar('Error processing payment', { variant: 'error' });
    }
    setActionMenu({ anchorEl: null, payment: null });
  };

  const handleMarkPaid = async (payment: Payment) => {
    try {
      await paymentService.markPaymentPaid(payment.id, 'Current User', `TXN-${Date.now()}`);
      enqueueSnackbar('Payment marked as paid', { variant: 'success' });
      loadData();
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      enqueueSnackbar('Error marking payment as paid', { variant: 'error' });
    }
    setActionMenu({ anchorEl: null, payment: null });
  };

  const handleDeletePayment = async (payment: Payment) => {
    try {
      if (payment.status !== 'draft') {
        enqueueSnackbar('Only draft payments can be deleted', { variant: 'warning' });
        return;
      }
      await paymentService.deletePayment(payment.id);
      enqueueSnackbar('Payment deleted successfully', { variant: 'success' });
      loadData();
    } catch (error) {
      console.error('Error deleting payment:', error);
      enqueueSnackbar('Error deleting payment', { variant: 'error' });
    }
    setActionMenu({ anchorEl: null, payment: null });
  };

  const handlePrintPayment = (payment: Payment) => {
    // Create printable payment document
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Payment Voucher - ${payment.paymentNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              .payment-details { width: 100%; border-collapse: collapse; margin-top: 20px; }
              .payment-details th, .payment-details td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .payment-details th { background-color: #f2f2f2; }
              .signature-area { margin-top: 40px; display: flex; justify-content: space-between; }
              .signature { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Ethiopian ERP System</h2>
              <h3>Payment Voucher</h3>
              <p>Payment Number: ${payment.paymentNumber}</p>
              <p>Date: ${payment.dueDate}</p>
            </div>
            <table class="payment-details">
              <tr><th>Vendor</th><td>${payment.vendor.name}</td></tr>
              <tr><th>Description</th><td>${payment.description}</td></tr>
              <tr><th>Amount</th><td>ETB ${payment.totalAmount.toLocaleString()}</td></tr>
              <tr><th>Status</th><td>${payment.status}</td></tr>
              <tr><th>Priority</th><td>${payment.priority}</td></tr>
            </table>
            <div class="signature-area">
              <div class="signature">Prepared By</div>
              <div class="signature">Approved By</div>
              <div class="signature">Received By</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    closeActionMenu();
  };

  const handleEmailPayment = (payment: Payment) => {
    const emailContent = `Payment Details:\n\nPayment Number: ${payment.paymentNumber}\nVendor: ${payment.vendor.name}\nAmount: ETB ${payment.totalAmount.toLocaleString()}\nDue Date: ${payment.dueDate}\nStatus: ${payment.status}\n\nGenerated from Ethiopian ERP System`;
    
    const confirm = window.confirm(`Send payment details via email?\n\n${emailContent}`);
    if (confirm) {
      // In a real app, this would send an email
      alert(`Payment details for ${payment.paymentNumber} have been sent via email.`);
    }
    closeActionMenu();
  };

  const handleDuplicatePayment = (payment: Payment) => {
    const confirm = window.confirm(`Create a duplicate of payment ${payment.paymentNumber}?\n\nThis will create a new draft payment with the same details.`);
    
    if (confirm) {
      // In a real app, this would make an API call
      alert(`Payment ${payment.paymentNumber} has been duplicated successfully! The new payment is in draft status.`);
    }
    closeActionMenu();
  };

  const handleAuditTrail = (payment: Payment) => {
    // Create audit trail report
    const auditWindow = window.open('', '_blank');
    if (auditWindow) {
      auditWindow.document.write(`
        <html>
          <head>
            <title>Payment Audit Trail - ${payment.paymentNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Ethiopian ERP System</h2>
              <h3>Payment Audit Trail</h3>
              <p>Payment: ${payment.paymentNumber} - ${payment.vendor.name}</p>
              <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>Status Change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${new Date().toLocaleString()}</td>
                  <td>Finance User</td>
                  <td>Payment Created</td>
                  <td>Initial payment creation</td>
                  <td>Draft</td>
                </tr>
                <tr>
                  <td>${new Date().toLocaleString()}</td>
                  <td>Finance Manager</td>
                  <td>Status Updated</td>
                  <td>Payment status changed</td>
                  <td>${payment.status}</td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `);
      auditWindow.document.close();
      auditWindow.print();
    }
    closeActionMenu();
  };

  const handleActionMenu = (event: React.MouseEvent<HTMLElement>, payment: Payment) => {
    setActionMenu({ anchorEl: event.currentTarget, payment });
  };

  const closeActionMenu = () => {
    setActionMenu({ anchorEl: null, payment: null });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'pending_approval':
        return 'warning';
      case 'approved':
        return 'info';
      case 'processing':
        return 'primary';
      case 'paid':
        return 'success';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'default';
      case 'medium':
        return 'primary';
      case 'high':
        return 'warning';
      case 'urgent':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'ETB') {
      return `ETB ${amount.toLocaleString()}`;
    } else {
      return `$${amount.toLocaleString()}`;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-ET', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Pagination
  const paginatedPayments = filteredPayments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading payments...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Payment Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Process vendor payments, track expenses, and manage financial transactions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreatePayment}
          size="large"
        >
          Create Payment
        </Button>
      </Box>

      {/* Dashboard Statistics */}
      {stats && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Total Payments
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalPayments}
                    </Typography>
                  </Box>
                  <PaymentIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Pending Approval
                    </Typography>
                    <Typography variant="h4" color="warning.main">
                      {stats.pendingApproval}
                    </Typography>
                  </Box>
                  <PendingIcon color="warning" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Approved
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {stats.approved}
                    </Typography>
                  </Box>
                  <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Total Value (ETB)
                    </Typography>
                    <Typography variant="h5">
                      {formatCurrency(stats.totalAmountETB, 'ETB')}
                    </Typography>
                  </Box>
                  <BankIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Processing
                    </Typography>
                    <Typography variant="h4" color="info.main">
                      {stats.processing}
                    </Typography>
                  </Box>
                  <TrendingUpIcon color="info" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Paid This Month
                    </Typography>
                    <Typography variant="h4">
                      {stats.monthlyProcessed}
                    </Typography>
                  </Box>
                  <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Failed
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {stats.failed}
                    </Typography>
                  </Box>
                  <ErrorIcon color="error" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Overdue
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {stats.overduePayments}
                    </Typography>
                  </Box>
                  <ErrorIcon color="error" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="pending_approval">Pending Approval</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Currency"
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
            >
              <MenuItem value="all">All Currencies</MenuItem>
              <MenuItem value="ETB">Ethiopian Birr</MenuItem>
              <MenuItem value="USD">US Dollar</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="supplier_payment">Supplier Payment</MenuItem>
              <MenuItem value="expense_reimbursement">Expense Reimbursement</MenuItem>
              <MenuItem value="salary">Salary</MenuItem>
              <MenuItem value="tax_payment">Tax Payment</MenuItem>
              <MenuItem value="utility">Utility</MenuItem>
              <MenuItem value="service">Service</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={1}>
            <Tooltip title="Advanced Filters">
              <IconButton>
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Payments Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Payment #</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Department</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPayments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {payment.paymentNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {payment.reference}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {payment.vendor.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {payment.vendor.contactPerson}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(payment.totalAmount, payment.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.currency}
                      size="small"
                      variant="outlined"
                      color={payment.currency === 'ETB' ? 'primary' : 'secondary'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(payment.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.priority.toUpperCase()}
                      color={getPriorityColor(payment.priority) as any}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(payment.dueDate)}
                    </Typography>
                    {payment.dueDate < new Date() && !['paid', 'cancelled'].includes(payment.status) && (
                      <Typography variant="caption" color="error">
                        Overdue
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.department}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleViewPayment(payment)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More Actions">
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleActionMenu(e, payment)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" p={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
            />
          </Box>
        )}
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenu.anchorEl}
        open={Boolean(actionMenu.anchorEl)}
        onClose={closeActionMenu}
      >
        {actionMenu.payment && (
          <>
            <MenuItem onClick={() => handleViewPayment(actionMenu.payment!)}>
              <ListItemIcon>
                <ViewIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>
            
            {actionMenu.payment.status === 'draft' && (
              <MenuItem onClick={() => handleEditPayment(actionMenu.payment!)}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit Payment</ListItemText>
              </MenuItem>
            )}
            
            {actionMenu.payment.status === 'pending_approval' && (
              <>
                <MenuItem onClick={() => handleApprovePayment(actionMenu.payment!)}>
                  <ListItemIcon>
                    <ApproveIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Approve</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleRejectPayment(actionMenu.payment!)}>
                  <ListItemIcon>
                    <RejectIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Reject</ListItemText>
                </MenuItem>
              </>
            )}
            
            {actionMenu.payment.status === 'approved' && (
              <MenuItem onClick={() => handleProcessPayment(actionMenu.payment!)}>
                <ListItemIcon>
                  <PaymentIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Process Payment</ListItemText>
              </MenuItem>
            )}
            
            {actionMenu.payment.status === 'processing' && (
              <MenuItem onClick={() => handleMarkPaid(actionMenu.payment!)}>
                <ListItemIcon>
                  <CheckCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Mark as Paid</ListItemText>
              </MenuItem>
            )}
            
            <Divider />
            
            <MenuItem onClick={() => handlePrintPayment(actionMenu.payment!)}>
              <ListItemIcon>
                <PrintIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Print Payment</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={() => handleEmailPayment(actionMenu.payment!)}>
              <ListItemIcon>
                <EmailIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Email Payment</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={() => handleDuplicatePayment(actionMenu.payment!)}>
              <ListItemIcon>
                <ContentCopyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Duplicate Payment</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={() => handleAuditTrail(actionMenu.payment!)}>
              <ListItemIcon>
                <HistoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Audit Trail</ListItemText>
            </MenuItem>
            
            <Divider />
            
            {actionMenu.payment.status === 'draft' && (
              <MenuItem onClick={() => handleDeletePayment(actionMenu.payment!)}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>

      {/* Create/Edit Payment Dialog */}
      <CreatePaymentDialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setSelectedPayment(null);
        }}
        onSubmit={async (paymentData) => {
          try {
            if (selectedPayment) {
              // Update existing payment
              await paymentService.updatePayment(selectedPayment.id, paymentData);
              enqueueSnackbar('Payment updated successfully', { variant: 'success' });
            } else {
              // Create new payment
              await paymentService.createPayment(paymentData as any);
              enqueueSnackbar('Payment created successfully', { variant: 'success' });
            }
            loadData();
            setCreateDialogOpen(false);
            setSelectedPayment(null);
          } catch (error) {
            console.error('Error saving payment:', error);
            enqueueSnackbar('Error saving payment', { variant: 'error' });
          }
        }}
        editPayment={selectedPayment}
      />

      {/* Payment Details Dialog */}
      {selectedPayment && (
        <PaymentDetailsDialog
          open={detailsDialogOpen}
          onClose={() => {
            setDetailsDialogOpen(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
          onEdit={(payment) => {
            setSelectedPayment(payment);
            setDetailsDialogOpen(false);
            setCreateDialogOpen(true);
          }}
          onApprove={async (paymentId) => {
            try {
              await paymentService.approvePayment(paymentId, 'Current User', 'Approved via payment management system');
              loadData();
              enqueueSnackbar('Payment approved successfully', { variant: 'success' });
            } catch (error) {
              console.error('Error approving payment:', error);
              enqueueSnackbar('Error approving payment', { variant: 'error' });
            }
          }}
          onReject={async (paymentId, reason) => {
            try {
              await paymentService.rejectPayment(paymentId, 'Current User', reason);
              loadData();
              enqueueSnackbar('Payment rejected', { variant: 'warning' });
            } catch (error) {
              console.error('Error rejecting payment:', error);
              enqueueSnackbar('Error rejecting payment', { variant: 'error' });
            }
          }}
          onProcess={async (paymentId) => {
            try {
              await paymentService.processPayment(paymentId, 'Current User');
              loadData();
              enqueueSnackbar('Payment processing initiated', { variant: 'info' });
            } catch (error) {
              console.error('Error processing payment:', error);
              enqueueSnackbar('Error processing payment', { variant: 'error' });
            }
          }}
        />
      )}
    </Box>
  );
};

export default PaymentsPage;
