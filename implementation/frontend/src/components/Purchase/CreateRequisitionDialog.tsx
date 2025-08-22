import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  CreateRequisitionForm,
  CreateRequisitionItemForm,
  PriorityLevel
} from '../../types/purchase';

interface CreateRequisitionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateRequisitionForm) => Promise<void>;
}

const validationSchema = Yup.object({
  department: Yup.string().required('Department is required'),
  requiredDate: Yup.string().required('Required date is required'),
  priority: Yup.string().required('Priority is required'),
  description: Yup.string().required('Description is required'),
  justification: Yup.string().required('Justification is required'),
  currency: Yup.string().required('Currency is required'),
  items: Yup.array().of(
    Yup.object({
      description: Yup.string().required('Item description is required'),
      quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
      unit: Yup.string().required('Unit is required'),
      estimatedUnitPrice: Yup.number().min(0, 'Price must be positive').required('Unit price is required'),
      urgency: Yup.string().required('Urgency is required')
    })
  ).min(1, 'At least one item is required')
});

const steps = ['Basic Information', 'Items & Budget', 'Review & Submit'];

const departments = [
  'IT Department',
  'Human Resources',
  'Finance',
  'Operations',
  'Procurement',
  'Marketing',
  'Sales',
  'Logistics',
  'Quality Control',
  'Maintenance',
  'Administration',
  'Security'
];

const units = [
  'pcs', 'kg', 'liter', 'meter', 'hour', 'day', 'month', 'year',
  'box', 'pack', 'set', 'license', 'service', 'lot'
];

const CreateRequisitionDialog: React.FC<CreateRequisitionDialogProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const initialValues: CreateRequisitionForm = {
    department: '',
    requiredDate: '',
    priority: PriorityLevel.MEDIUM,
    description: '',
    justification: '',
    items: [
      {
        description: '',
        quantity: 1,
        unit: 'pcs',
        estimatedUnitPrice: 0,
        specifications: '',
        suggestedSupplier: '',
        urgency: 'MEDIUM'
      }
    ],
    estimatedBudget: 0,
    currency: 'ETB'
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (values: CreateRequisitionForm) => {
    try {
      setSubmitting(true);
      
      // Calculate estimated budget from items
      const totalBudget = values.items.reduce(
        (sum, item) => sum + (item.quantity * item.estimatedUnitPrice), 
        0
      );
      
      const formData = {
        ...values,
        estimatedBudget: totalBudget
      };
      
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error creating requisition:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    onClose();
  };

  const getStepContent = (step: number, values: CreateRequisitionForm, setFieldValue: any) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Department *</InputLabel>
                <Field name="department">
                  {({ field }: any) => (
                    <Select {...field} label="Department">
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Field>
              </FormControl>
              <ErrorMessage name="department">
                {(msg) => <div style={{ color: 'red', fontSize: '0.875rem' }}>{msg}</div>}
              </ErrorMessage>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority *</InputLabel>
                <Field name="priority">
                  {({ field }: any) => (
                    <Select {...field} label="Priority">
                      <MenuItem value={PriorityLevel.LOW}>Low</MenuItem>
                      <MenuItem value={PriorityLevel.MEDIUM}>Medium</MenuItem>
                      <MenuItem value={PriorityLevel.HIGH}>High</MenuItem>
                      <MenuItem value={PriorityLevel.URGENT}>Urgent</MenuItem>
                      <MenuItem value={PriorityLevel.CRITICAL}>Critical</MenuItem>
                    </Select>
                  )}
                </Field>
              </FormControl>
              <ErrorMessage name="priority">
                {(msg) => <div style={{ color: 'red', fontSize: '0.875rem' }}>{msg}</div>}
              </ErrorMessage>
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Required Date *"
                value={values.requiredDate ? new Date(values.requiredDate) : null}
                onChange={(date) => setFieldValue('requiredDate', date?.toISOString().split('T')[0] || '')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: false
                  }
                }}
              />
              <ErrorMessage name="requiredDate">
                {(msg) => <div style={{ color: 'red', fontSize: '0.875rem' }}>{msg}</div>}
              </ErrorMessage>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Currency *</InputLabel>
                <Field name="currency">
                  {({ field }: any) => (
                    <Select {...field} label="Currency">
                      <MenuItem value="ETB">Ethiopian Birr (ETB)</MenuItem>
                      <MenuItem value="USD">US Dollar (USD)</MenuItem>
                    </Select>
                  )}
                </Field>
              </FormControl>
              <ErrorMessage name="currency">
                {(msg) => <div style={{ color: 'red', fontSize: '0.875rem' }}>{msg}</div>}
              </ErrorMessage>
            </Grid>

            <Grid item xs={12}>
              <Field name="description">
                {({ field }: any) => (
                  <TextField
                    {...field}
                    label="Description *"
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Brief description of what you're requesting"
                  />
                )}
              </Field>
              <ErrorMessage name="description">
                {(msg) => <div style={{ color: 'red', fontSize: '0.875rem' }}>{msg}</div>}
              </ErrorMessage>
            </Grid>

            <Grid item xs={12}>
              <Field name="justification">
                {({ field }: any) => (
                  <TextField
                    {...field}
                    label="Business Justification *"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Explain why this purchase is necessary and how it benefits the business"
                  />
                )}
              </Field>
              <ErrorMessage name="justification">
                {(msg) => <div style={{ color: 'red', fontSize: '0.875rem' }}>{msg}</div>}
              </ErrorMessage>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Requisition Items
            </Typography>
            
            <FieldArray name="items">
              {({ push, remove }) => (
                <Box>
                  <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Description *</TableCell>
                          <TableCell>Qty *</TableCell>
                          <TableCell>Unit *</TableCell>
                          <TableCell>Unit Price *</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell>Urgency *</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {values.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Field name={`items.${index}.description`}>
                                {({ field }: any) => (
                                  <TextField
                                    {...field}
                                    size="small"
                                    fullWidth
                                    placeholder="Item description"
                                  />
                                )}
                              </Field>
                            </TableCell>
                            <TableCell>
                              <Field name={`items.${index}.quantity`}>
                                {({ field }: any) => (
                                  <TextField
                                    {...field}
                                    type="number"
                                    size="small"
                                    sx={{ width: 80 }}
                                  />
                                )}
                              </Field>
                            </TableCell>
                            <TableCell>
                              <Field name={`items.${index}.unit`}>
                                {({ field }: any) => (
                                  <Select {...field} size="small" sx={{ width: 80 }}>
                                    {units.map((unit) => (
                                      <MenuItem key={unit} value={unit}>
                                        {unit}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                )}
                              </Field>
                            </TableCell>
                            <TableCell>
                              <Field name={`items.${index}.estimatedUnitPrice`}>
                                {({ field }: any) => (
                                  <TextField
                                    {...field}
                                    type="number"
                                    size="small"
                                    sx={{ width: 100 }}
                                  />
                                )}
                              </Field>
                            </TableCell>
                            <TableCell>
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: values.currency
                              }).format(item.quantity * item.estimatedUnitPrice)}
                            </TableCell>
                            <TableCell>
                              <Field name={`items.${index}.urgency`}>
                                {({ field }: any) => (
                                  <Select {...field} size="small" sx={{ width: 100 }}>
                                    <MenuItem value="LOW">Low</MenuItem>
                                    <MenuItem value="MEDIUM">Medium</MenuItem>
                                    <MenuItem value="HIGH">High</MenuItem>
                                    <MenuItem value="CRITICAL">Critical</MenuItem>
                                  </Select>
                                )}
                              </Field>
                            </TableCell>
                            <TableCell>
                              {values.items.length > 1 && (
                                <IconButton size="small" onClick={() => remove(index)}>
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => push({
                      description: '',
                      quantity: 1,
                      unit: 'pcs',
                      estimatedUnitPrice: 0,
                      specifications: '',
                      suggestedSupplier: '',
                      urgency: 'MEDIUM'
                    })}
                  >
                    Add Item
                  </Button>

                  <Box mt={3} p={2} bgcolor="background.paper" borderRadius={1}>
                    <Typography variant="h6">
                      Total Estimated Budget: {' '}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: values.currency
                      }).format(
                        values.items.reduce((sum, item) => sum + (item.quantity * item.estimatedUnitPrice), 0)
                      )}
                    </Typography>
                  </Box>
                </Box>
              )}
            </FieldArray>
          </Box>
        );

      case 2:
        const totalBudget = values.items.reduce(
          (sum, item) => sum + (item.quantity * item.estimatedUnitPrice), 
          0
        );

        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Requisition
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Department:</Typography>
                <Typography variant="body1">{values.department}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Priority:</Typography>
                <Chip label={values.priority} color="primary" size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Required Date:</Typography>
                <Typography variant="body1">{values.requiredDate}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Currency:</Typography>
                <Typography variant="body1">{values.currency}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Description:</Typography>
                <Typography variant="body1">{values.description}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Justification:</Typography>
                <Typography variant="body1">{values.justification}</Typography>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Items ({values.items.length})
            </Typography>
            
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Urgency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity} {item.unit}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: values.currency
                        }).format(item.estimatedUnitPrice)}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: values.currency
                        }).format(item.quantity * item.estimatedUnitPrice)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.urgency} 
                          size="small"
                          color={item.urgency === 'CRITICAL' ? 'error' : 
                                item.urgency === 'HIGH' ? 'warning' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={2} p={2} bgcolor="primary.main" color="primary.contrastText" borderRadius={1}>
              <Typography variant="h6">
                Total Budget: {' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: values.currency
                }).format(totalBudget)}
              </Typography>
            </Box>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Create Purchase Requisition</Typography>
        <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isValid }) => (
          <Form>
            <DialogContent>
              {submitting && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={20} />
                    Creating requisition...
                  </Box>
                </Alert>
              )}
              
              {getStepContent(activeStep, values, setFieldValue)}
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} startIcon={<CancelIcon />}>
                Cancel
              </Button>
              
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={!isValid || submitting}
                >
                  {submitting ? 'Creating...' : 'Create Requisition'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isValid}
                >
                  Next
                </Button>
              )}
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CreateRequisitionDialog;
