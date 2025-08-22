import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  InputAdornment,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  DateRange as DateIcon,
  AccountBalance as BankIcon,
  CreditCard as CardIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { 
  Payment, 
  PaymentItem, 
  paymentService 
} from '../../services/paymentService';

const steps = ['Basic Information', 'Items & Budget', 'Review & Submit'];

// Ethiopian vendors data
const ethiopianVendors = [
  { id: 'vendor_001', name: 'Addis Ababa Tech Solutions PLC', type: 'Technology', taxId: 'TIN001234567', status: 'active' },
  { id: 'vendor_002', name: 'Ethiopian Construction Corp', type: 'Construction', taxId: 'TIN001234568', status: 'active' },
  { id: 'vendor_003', name: 'Bole Trading Enterprise', type: 'Trading', taxId: 'TIN001234569', status: 'active' },
  { id: 'vendor_004', name: 'Habesha Coffee Exporters', type: 'Export', taxId: 'TIN001234570', status: 'active' },
  { id: 'vendor_005', name: 'Ethiopian Airlines Services', type: 'Aviation', taxId: 'TIN001234571', status: 'active' },
  { id: 'vendor_006', name: 'Awash Manufacturing PLC', type: 'Manufacturing', taxId: 'TIN001234572', status: 'active' },
  { id: 'vendor_007', name: 'Merkato Trading House', type: 'Trading', taxId: 'TIN001234573', status: 'active' },
  { id: 'vendor_008', name: 'Blue Nile Textiles', type: 'Textile', taxId: 'TIN001234574', status: 'active' },
];

// Ethiopian payment methods
const paymentMethods = [
  { id: 'cbe_transfer', name: 'Commercial Bank of Ethiopia Transfer', type: 'bank', fees: 25 },
  { id: 'dashen_transfer', name: 'Dashen Bank Transfer', type: 'bank', fees: 30 },
  { id: 'awash_transfer', name: 'Awash Bank Transfer', type: 'bank', fees: 28 },
  { id: 'nib_transfer', name: 'NIB International Bank Transfer', type: 'bank', fees: 35 },
  { id: 'mbirr', name: 'M-Birr Mobile Money', type: 'mobile', fees: 15 },
  { id: 'hellocash', name: 'HelloCash Mobile Wallet', type: 'mobile', fees: 12 },
  { id: 'ebirr', name: 'eBirr Mobile Payment', type: 'mobile', fees: 10 },
  { id: 'cash', name: 'Cash Payment', type: 'cash', fees: 0 },
  { id: 'check', name: 'Bank Check', type: 'check', fees: 5 },
];

// Payment categories
const paymentCategories = [
  'Office Supplies',
  'Technology & Equipment',
  'Professional Services',
  'Utilities',
  'Travel & Transportation',
  'Marketing & Advertising',
  'Maintenance & Repairs',
  'Insurance',
  'Legal & Compliance',
  'Training & Development',
  'Construction',
  'Raw Materials',
  'Inventory',
  'Subcontractors',
  'Other',
];

// Ethiopian business units
const businessUnits = [
  'Head Office - Addis Ababa',
  'Bole Branch',
  'Merkato Branch',
  'Bahir Dar Branch',
  'Dire Dawa Branch',
  'Hawassa Branch',
  'Mekelle Branch',
  'Jimma Branch',
  'Gondar Branch',
  'Adama Branch',
];

interface CreatePaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payment: Partial<Payment>) => void;
  editPayment?: Payment | null;
}

const CreatePaymentDialog: React.FC<CreatePaymentDialogProps> = ({
  open,
  onClose,
  onSubmit,
  editPayment
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = useState(0);
  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  // Form validation schema
  const validationSchema = Yup.object({
    vendor: Yup.string().required('Vendor is required'),
    title: Yup.string().required('Payment title is required'),
    description: Yup.string().required('Description is required'),
    dueDate: Yup.date().required('Due date is required'),
    priority: Yup.string().required('Priority is required'),
    category: Yup.string().required('Category is required'),
    businessUnit: Yup.string().required('Business unit is required'),
    paymentMethod: Yup.string().required('Payment method is required'),
    currency: Yup.string().required('Currency is required'),
  });

  const formik = useFormik({
    initialValues: {
      vendor: editPayment?.vendorId || '',
      title: editPayment?.description || '',
      description: editPayment?.description || '',
      dueDate: editPayment?.dueDate ? new Date(editPayment.dueDate) : new Date(),
      priority: editPayment?.priority || 'medium',
      category: editPayment?.category || '',
      businessUnit: editPayment?.department || 'Head Office - Addis Ababa',
      paymentMethod: editPayment?.paymentMethodId || '',
      currency: editPayment?.currency || 'ETB',
      notes: editPayment?.notes || '',
      tags: [],
      requiresApproval: true,
      isRecurring: false,
      recurringPeriod: 'monthly',
    },
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  // Initialize edit mode
  useEffect(() => {
    if (editPayment) {
      const vendor = ethiopianVendors.find(v => v.id === editPayment.vendorId);
      setSelectedVendor(vendor);
      setPaymentItems(editPayment.items || []);
    } else {
      // Reset for new payment
      setPaymentItems([]);
      setSelectedVendor(null);
      setActiveStep(0);
      formik.resetForm();
    }
  }, [editPayment, open]);

  // Calculate totals with Ethiopian tax rules
  const calculateTotals = () => {
    const subtotal = paymentItems.reduce((sum, item) => sum + item.amount, 0);
    const vatRate = 0.15; // 15% VAT in Ethiopia
    const withholdingRate = 0.02; // 2% withholding tax
    
    const vat = subtotal * vatRate;
    const withholding = subtotal * withholdingRate;
    const total = subtotal + vat - withholding;

    return {
      subtotal,
      vat,
      withholding,
      total,
    };
  };

  const totals = calculateTotals();

  // Handle adding payment item
  const handleAddItem = () => {
    const newItem: PaymentItem = {
      id: `item_${Date.now()}`,
      description: '',
      amount: 0,
      currency: formik.values.currency as 'ETB' | 'USD',
    };
    setPaymentItems([...paymentItems, newItem]);
  };

  // Handle updating payment item
  const handleUpdateItem = (index: number, field: keyof PaymentItem, value: any) => {
    const updatedItems = [...paymentItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setPaymentItems(updatedItems);
  };

  // Handle removing payment item
  const handleRemoveItem = (index: number) => {
    const updatedItems = paymentItems.filter((_, i) => i !== index);
    setPaymentItems(updatedItems);
  };

  // Handle vendor selection
  const handleVendorChange = (vendorId: string) => {
    const vendor = ethiopianVendors.find(v => v.id === vendorId);
    setSelectedVendor(vendor);
    formik.setFieldValue('vendor', vendorId);
  };

  // Navigation functions
  const handleNext = () => {
    if (activeStep === 0) {
      formik.submitForm();
      if (formik.isValid) {
        setActiveStep((prev) => prev + 1);
      }
    } else if (activeStep === 1) {
      if (paymentItems.length === 0) {
        enqueueSnackbar('Please add at least one payment item', { variant: 'warning' });
        return;
      }
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    if (activeStep !== steps.length - 1) return;

    try {
      const paymentData: Partial<Payment> = {
        id: editPayment?.id || `PAY-${Date.now()}`,
        paymentNumber: editPayment?.paymentNumber || `PAY-${Date.now()}`,
        vendorId: values.vendor,
        vendor: selectedVendor ? {
          id: selectedVendor.id,
          name: selectedVendor.name,
          taxNumber: selectedVendor.taxId,
          bankAccount: '1234567890',
          bankName: 'Commercial Bank of Ethiopia',
          contactPerson: 'Contact Person',
          phone: '+251911123456',
          email: 'contact@vendor.com',
          address: 'Addis Ababa',
          city: 'Addis Ababa',
          region: 'Addis Ababa',
          isLocal: true,
        } : editPayment?.vendor,
        paymentMethodId: values.paymentMethod,
        paymentMethod: editPayment?.paymentMethod || {
          id: values.paymentMethod,
          name: paymentMethods.find(m => m.id === values.paymentMethod)?.name || '',
          type: 'bank_transfer',
          isActive: true,
          ethiopianMethod: true,
        },
        items: paymentItems,
        totalAmount: totals.total,
        currency: values.currency as 'ETB' | 'USD',
        status: editPayment?.status || 'draft',
        priority: values.priority as 'low' | 'medium' | 'high' | 'urgent',
        description: values.description,
        requestedBy: 'Current User',
        requestDate: editPayment?.requestDate || new Date(),
        dueDate: values.dueDate,
        reference: `REF-${Date.now()}`,
        department: values.businessUnit,
        category: values.category as any,
        notes: values.notes,
        taxInvoice: true,
        vatCertificate: true,
        withholdingCertificate: true,
      };

      await onSubmit(paymentData);
      handleClose();
      enqueueSnackbar(
        editPayment ? 'Payment updated successfully' : 'Payment created successfully',
        { variant: 'success' }
      );
    } catch (error) {
      console.error('Error submitting payment:', error);
      enqueueSnackbar('Error submitting payment', { variant: 'error' });
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    formik.resetForm();
    setPaymentItems([]);
    setSelectedVendor(null);
    onClose();
  };

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Vendor"
                  name="vendor"
                  value={formik.values.vendor}
                  onChange={(e) => handleVendorChange(e.target.value)}
                  error={formik.touched.vendor && Boolean(formik.errors.vendor)}
                  helperText={formik.touched.vendor && formik.errors.vendor}
                  InputProps={{
                    startAdornment: <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                >
                  {ethiopianVendors.map((vendor) => (
                    <MenuItem key={vendor.id} value={vendor.id}>
                      <Box>
                        <Typography variant="body2">{vendor.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {vendor.type} • TIN: {vendor.taxId}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Payment Title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  InputProps={{
                    startAdornment: <ReceiptIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Due Date"
                    value={formik.values.dueDate}
                    onChange={(date) => formik.setFieldValue('dueDate', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.dueDate && Boolean(formik.errors.dueDate),
                        helperText: formik.touched.dueDate && formik.errors.dueDate ? String(formik.errors.dueDate) : '',
                        InputProps: {
                          startAdornment: <DateIcon sx={{ mr: 1, color: 'action.active' }} />,
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Priority"
                  name="priority"
                  value={formik.values.priority}
                  onChange={formik.handleChange}
                  error={formik.touched.priority && Boolean(formik.errors.priority)}
                  helperText={formik.touched.priority && formik.errors.priority}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  helperText={formik.touched.category && formik.errors.category}
                >
                  {paymentCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Business Unit"
                  name="businessUnit"
                  value={formik.values.businessUnit}
                  onChange={formik.handleChange}
                  error={formik.touched.businessUnit && Boolean(formik.errors.businessUnit)}
                  helperText={formik.touched.businessUnit && formik.errors.businessUnit}
                >
                  {businessUnits.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Payment Method"
                  name="paymentMethod"
                  value={formik.values.paymentMethod}
                  onChange={formik.handleChange}
                  error={formik.touched.paymentMethod && Boolean(formik.errors.paymentMethod)}
                  helperText={formik.touched.paymentMethod && formik.errors.paymentMethod}
                  InputProps={{
                    startAdornment: <BankIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.id} value={method.id}>
                      <Box>
                        <Typography variant="body2">{method.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Fee: {method.fees} ETB
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Currency"
                  name="currency"
                  value={formik.values.currency}
                  onChange={formik.handleChange}
                  error={formik.touched.currency && Boolean(formik.errors.currency)}
                  helperText={formik.touched.currency && formik.errors.currency}
                  InputProps={{
                    startAdornment: <MoneyIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                >
                  <MenuItem value="ETB">Ethiopian Birr (ETB)</MenuItem>
                  <MenuItem value="USD">US Dollar (USD)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.requiresApproval}
                      onChange={(e) => formik.setFieldValue('requiresApproval', e.target.checked)}
                    />
                  }
                  label="Requires approval workflow"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Payment Items</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                variant="outlined"
                size="small"
              >
                Add Item
              </Button>
            </Box>

            {paymentItems.length === 0 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                No payment items added yet. Click "Add Item" to get started.
              </Alert>
            ) : (
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Currency</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <TextField
                            size="small"
                            value={item.description}
                            onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                            placeholder="Item description"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={item.amount}
                            onChange={(e) => handleUpdateItem(index, 'amount', parseFloat(e.target.value) || 0)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {formik.values.currency}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.currency}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveItem(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Tax Calculation Summary */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tax Calculation Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Subtotal:</Typography>
                      <Typography fontWeight="medium">
                        {formik.values.currency} {totals.subtotal.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>VAT (15%):</Typography>
                      <Typography fontWeight="medium">
                        {formik.values.currency} {totals.vat.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Withholding Tax (2%):</Typography>
                      <Typography fontWeight="medium" color="success.main">
                        -{formik.values.currency} {totals.withholding.toLocaleString()}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6">Total Amount:</Typography>
                      <Typography variant="h6" color="primary.main">
                        {formik.values.currency} {totals.total.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Payment Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      Payment Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Vendor:</Typography>
                      <Typography variant="body1">{selectedVendor?.name}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Title:</Typography>
                      <Typography variant="body1">{formik.values.title}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Due Date:</Typography>
                      <Typography variant="body1">
                        {formik.values.dueDate.toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Priority:</Typography>
                      <Chip
                        label={formik.values.priority}
                        color={
                          formik.values.priority === 'urgent' ? 'error' :
                          formik.values.priority === 'high' ? 'warning' :
                          formik.values.priority === 'medium' ? 'info' : 'default'
                        }
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Business Unit:</Typography>
                      <Typography variant="body1">{formik.values.businessUnit}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      Payment Summary
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Total Items:</Typography>
                      <Typography variant="body1">{paymentItems.length}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Subtotal:</Typography>
                      <Typography variant="body1">
                        {formik.values.currency} {totals.subtotal.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">VAT (15%):</Typography>
                      <Typography variant="body1">
                        {formik.values.currency} {totals.vat.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">Withholding (2%):</Typography>
                      <Typography variant="body1" color="success.main">
                        -{formik.values.currency} {totals.withholding.toLocaleString()}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box>
                      <Typography variant="subtitle1" color="textSecondary">Total Amount:</Typography>
                      <Typography variant="h6" color="primary.main">
                        {formik.values.currency} {totals.total.toLocaleString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      Payment Items ({paymentItems.length})
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Currency</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paymentItems.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.description}</TableCell>
                              <TableCell align="right">
                                {formik.values.currency} {item.amount.toLocaleString()}
                              </TableCell>
                              <TableCell align="right">
                                {item.currency}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 2 }}>
              {formik.values.requiresApproval 
                ? 'This payment will go through the approval workflow before processing.'
                : 'This payment will be processed immediately after creation.'
              }
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MoneyIcon color="primary" />
          <Typography variant="h6">
            {editPayment ? 'Edit Payment' : 'Create New Payment'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === 0 && !formik.isValid}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => formik.submitForm()}
            disabled={paymentItems.length === 0}
          >
            {editPayment ? 'Update Payment' : 'Create Payment'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreatePaymentDialog;
