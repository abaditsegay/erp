import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Close as CloseIcon,
  Print as PrintIcon,
  GetApp as DownloadIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { PurchaseOrder, PurchaseOrderStatus } from '../../types/purchase';

interface PurchaseOrderDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  purchaseOrder: PurchaseOrder;
}

export const PurchaseOrderDetailsDialog: React.FC<PurchaseOrderDetailsDialogProps> = ({
  open,
  onClose,
  purchaseOrder,
}) => {
  const getStatusChip = (status: PurchaseOrderStatus) => {
    const statusConfig: Record<PurchaseOrderStatus, { color: any; label: string }> = {
      [PurchaseOrderStatus.DRAFT]: { color: 'default', label: 'Draft' },
      [PurchaseOrderStatus.PENDING_APPROVAL]: { color: 'warning', label: 'Pending Approval' },
      [PurchaseOrderStatus.APPROVED]: { color: 'success', label: 'Approved' },
      [PurchaseOrderStatus.SENT_TO_SUPPLIER]: { color: 'info', label: 'Sent to Supplier' },
      [PurchaseOrderStatus.ACKNOWLEDGED]: { color: 'primary', label: 'Acknowledged' },
      [PurchaseOrderStatus.PARTIALLY_RECEIVED]: { color: 'warning', label: 'Partially Received' },
      [PurchaseOrderStatus.FULLY_RECEIVED]: { color: 'success', label: 'Fully Received' },
      [PurchaseOrderStatus.INVOICED]: { color: 'info', label: 'Invoiced' },
      [PurchaseOrderStatus.PAID]: { color: 'success', label: 'Paid' },
      [PurchaseOrderStatus.CANCELLED]: { color: 'error', label: 'Cancelled' },
      [PurchaseOrderStatus.CLOSED]: { color: 'default', label: 'Closed' },
    };

    const config = statusConfig[status];
    return (
      <Chip
        label={config.label}
        color={config.color}
        variant="filled"
      />
    );
  };

  const formatCurrency = (amount: number, currency: 'USD' | 'ETB') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5">🇪🇹 Purchase Order Details</Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            {purchaseOrder.orderNumber}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {getStatusChip(purchaseOrder.status)}
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Header Information */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" color="primary">
                        Order Information
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      <strong>Order Date:</strong> {formatDate(purchaseOrder.orderDate)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Order Type:</strong> {purchaseOrder.orderType}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Priority:</strong> {purchaseOrder.priority}
                    </Typography>
                    {purchaseOrder.expectedDeliveryDate && (
                      <Typography variant="body1">
                        <strong>Expected Delivery:</strong> {formatDate(purchaseOrder.expectedDeliveryDate)}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" color="primary">
                        Financial Information
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      <strong>Currency:</strong> {purchaseOrder.currency}
                    </Typography>
                    {purchaseOrder.exchangeRate && (
                      <Typography variant="body1">
                        <strong>Exchange Rate:</strong> {purchaseOrder.exchangeRate} ETB/USD
                      </Typography>
                    )}
                    <Typography variant="body1">
                      <strong>Payment Terms:</strong> {purchaseOrder.paymentTerms}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Incoterm:</strong> {purchaseOrder.incoterm || 'Not specified'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Supplier Information */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" color="primary">
                    Supplier Information
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      {purchaseOrder.supplier.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Code: {purchaseOrder.supplier.code}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Contact Person:</strong> {purchaseOrder.supplier.contactPerson}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <EmailIcon sx={{ mr: 1, fontSize: 'small' }} />
                      <Typography variant="body1">{purchaseOrder.supplier.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <PhoneIcon sx={{ mr: 1, fontSize: 'small' }} />
                      <Typography variant="body1">{purchaseOrder.supplier.phone}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ mr: 1, fontSize: 'small' }} />
                      <Typography variant="body1"><strong>Address</strong></Typography>
                    </Box>
                    <Typography variant="body1">
                      {purchaseOrder.supplier.address.street}
                    </Typography>
                    <Typography variant="body1">
                      {purchaseOrder.supplier.address.city}, {purchaseOrder.supplier.address.region}
                    </Typography>
                    <Typography variant="body1">
                      {purchaseOrder.supplier.address.country}
                    </Typography>
                    {purchaseOrder.supplier.address.poBox && (
                      <Typography variant="body1">
                        P.O. Box: {purchaseOrder.supplier.address.poBox}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Delivery Information */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" color="primary">
                    Delivery Information
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Warehouse:</strong> {purchaseOrder.deliveryAddress.warehouse}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Address:</strong> {purchaseOrder.deliveryAddress.address}
                    </Typography>
                    <Typography variant="body1">
                      <strong>City:</strong> {purchaseOrder.deliveryAddress.city}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Region:</strong> {purchaseOrder.deliveryAddress.region}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Contact Person:</strong> {purchaseOrder.deliveryAddress.contactPerson}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Phone:</strong> {purchaseOrder.deliveryAddress.phone}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Order Items
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Item</strong></TableCell>
                        <TableCell><strong>SKU</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                        <TableCell align="right"><strong>Quantity</strong></TableCell>
                        <TableCell align="right"><strong>Unit Price</strong></TableCell>
                        <TableCell align="right"><strong>Discount</strong></TableCell>
                        <TableCell align="right"><strong>Line Total</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {purchaseOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {item.item.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Category: {item.item.category}
                            </Typography>
                          </TableCell>
                          <TableCell>{item.item.sku}</TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {item.item.description || 'No description'}
                            </Typography>
                            {item.specifications && (
                              <Typography variant="caption" color="textSecondary" display="block">
                                Specs: {item.specifications}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {item.quantity} {item.item.unit}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.unitPrice, purchaseOrder.currency)}
                          </TableCell>
                          <TableCell align="right">
                            {item.discount}% ({item.discountType})
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {formatCurrency(item.lineTotal, purchaseOrder.currency)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Totals */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Order Summary
                </Typography>
                <Grid container>
                  <Grid item xs={12} md={8}>
                    {purchaseOrder.notes && (
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Notes:
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {purchaseOrder.notes}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body1">
                        <strong>Subtotal:</strong> {formatCurrency(purchaseOrder.subtotal, purchaseOrder.currency)}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Tax:</strong> {formatCurrency(purchaseOrder.taxAmount, purchaseOrder.currency)}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Shipping:</strong> {formatCurrency(purchaseOrder.shippingCost, purchaseOrder.currency)}
                      </Typography>
                      {purchaseOrder.customsDuty > 0 && (
                        <Typography variant="body1">
                          <strong>Customs Duty:</strong> {formatCurrency(purchaseOrder.customsDuty, purchaseOrder.currency)}
                        </Typography>
                      )}
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="h6" color="primary">
                        <strong>Total:</strong> {formatCurrency(purchaseOrder.totalAmount, purchaseOrder.currency)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Approval History */}
          {purchaseOrder.approvals && purchaseOrder.approvals.length > 0 && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Approval History
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Level</strong></TableCell>
                          <TableCell><strong>Approver</strong></TableCell>
                          <TableCell><strong>Role</strong></TableCell>
                          <TableCell><strong>Status</strong></TableCell>
                          <TableCell><strong>Date</strong></TableCell>
                          <TableCell><strong>Comments</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {purchaseOrder.approvals.map((approval) => (
                          <TableRow key={approval.id}>
                            <TableCell>{approval.level}</TableCell>
                            <TableCell>{approval.approverName}</TableCell>
                            <TableCell>{approval.approverRole}</TableCell>
                            <TableCell>
                              <Chip 
                                label={approval.status} 
                                size="small"
                                color={approval.status === 'APPROVED' ? 'success' : 
                                       approval.status === 'REJECTED' ? 'error' : 'warning'}
                              />
                            </TableCell>
                            <TableCell>
                              {approval.approvedAt ? formatDate(approval.approvedAt) : 'Pending'}
                            </TableCell>
                            <TableCell>{approval.comments || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
        <Button
          startIcon={<PrintIcon />}
          variant="outlined"
          color="primary"
        >
          Print PO
        </Button>
        <Button
          startIcon={<DownloadIcon />}
          variant="outlined"
          color="primary"
        >
          Download PDF
        </Button>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
