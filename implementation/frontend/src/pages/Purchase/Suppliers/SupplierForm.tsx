import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Grid,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { mockSupplierService, Supplier as MockSupplier, ETHIOPIAN_REGIONS, BUSINESS_CATEGORIES } from '../../../services/mockSupplierService';

interface SupplierFormProps {
  open: boolean;
  onClose: () => void;
  supplier?: MockSupplier | null;
  onSubmit: (supplier: MockSupplier) => void;
  isEditing?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  code: Yup.string()
    .required('Supplier code is required')
    .matches(/^[a-zA-Z0-9_-]+$/, 'Code must contain only alphanumeric characters, hyphens, and underscores'),
  name: Yup.string()
    .required('Supplier name is required')
    .min(2, 'Name must be at least 2 characters'),
  contactPerson: Yup.string()
    .min(2, 'Contact person must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email format'),
  phone: Yup.string()
    .matches(/^[+]?[(]?[\d\s\-()]{7,}$/, 'Invalid phone number format'),
  address: Yup.object({
    street: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    region: Yup.string().required('Region is required'),
    country: Yup.string().required('Country is required'),
    postalCode: Yup.string(),
    poBox: Yup.string(),
  }),
  type: Yup.string().required('Supplier type is required'),
  category: Yup.string().required('Category is required'),
});

const SupplierForm: React.FC<SupplierFormProps> = ({
  supplier,
  isEditing = false,
  onSuccess,
  onCancel,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: MockSupplier) => {
    console.log('SupplierForm: handleSubmit called with values:', values);
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      if (isEditing && supplier?.id) {
        console.log('SupplierForm: Updating existing supplier');
        await mockSupplierService.updateSupplier(supplier.id, values);
      } else {
        console.log('SupplierForm: Creating new supplier');
        // For new suppliers, exclude id, createdAt, updatedAt
        const { id, createdAt, updatedAt, ...supplierData } = values;
        console.log('SupplierForm: Supplier data to create:', supplierData);
        await mockSupplierService.createSupplier(supplierData);
      }
      console.log('SupplierForm: Success, calling onSuccess');
      onSuccess?.();
    } catch (error: any) {
      console.error('SupplierForm: Error saving supplier:', error);
      setSubmitError(error.message || 'Error saving supplier');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: supplier?.id || 0,
      code: supplier?.code || '',
      name: supplier?.name || '',
      type: supplier?.type || 'wholesaler' as const,
      category: supplier?.category || 'Manufacturing',
      contactPerson: supplier?.contactPerson || '',
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      website: supplier?.website || '',
      taxId: supplier?.taxId || '',
      businessLicense: supplier?.businessLicense || '',
      address: {
        street: typeof supplier?.address === 'string' ? supplier.address : supplier?.address?.street || '',
        city: typeof supplier?.address === 'string' ? '' : supplier?.address?.city || '',
        region: typeof supplier?.address === 'string' ? 'Addis Ababa' : supplier?.address?.region || 'Addis Ababa',
        country: typeof supplier?.address === 'string' ? 'Ethiopia' : supplier?.address?.country || 'Ethiopia',
        postalCode: typeof supplier?.address === 'string' ? '' : supplier?.address?.postalCode || '',
        poBox: typeof supplier?.address === 'string' ? '' : supplier?.address?.poBox || '',
      },
      contacts: supplier?.contacts || [],
      bankDetails: supplier?.bankDetails || undefined,
      active: supplier?.active !== undefined ? supplier.active : true,
      rating: supplier?.rating || 0,
      paymentTerms: supplier?.paymentTerms || 'net_30',
      leadTimeDays: supplier?.leadTimeDays || 7,
      minimumOrderAmount: supplier?.minimumOrderAmount || 0,
      currency: supplier?.currency || 'ETB' as const,
      notes: supplier?.notes || '',
      createdAt: supplier?.createdAt || new Date().toISOString(),
      updatedAt: supplier?.updatedAt || new Date().toISOString(),
      ercaRegistration: supplier?.ercaRegistration || '',
      isImporter: supplier?.isImporter || false,
      isExporter: supplier?.isExporter || false,
      specializations: supplier?.specializations || [],
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Formik onSubmit called with:', values);
      console.log('Form validation state - isValid:', formik.isValid, 'errors:', formik.errors);
      handleSubmit(values);
    },
  });

  const isLoading = isSubmitting;

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="code"
            name="code"
            label="Supplier Code *"
            value={formik.values.code}
            onChange={formik.handleChange}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
            disabled={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Supplier Name *"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            disabled={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="contactPerson"
            name="contactPerson"
            label="Contact Person"
            value={formik.values.contactPerson}
            onChange={formik.handleChange}
            error={formik.touched.contactPerson && Boolean(formik.errors.contactPerson)}
            helperText={formik.touched.contactPerson && formik.errors.contactPerson}
            disabled={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            disabled={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.active}
                onChange={(e) => formik.setFieldValue('active', e.target.checked)}
                name="active"
                disabled={isLoading}
              />
            }
            label="Active"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="address"
            name="address"
            label="Street Address"
            multiline
            rows={3}
            value={formik.values.address.street}
            onChange={(e) => formik.setFieldValue('address.street', e.target.value)}
            error={formik.touched.address?.street && Boolean(formik.errors.address?.street)}
            helperText={formik.touched.address?.street && formik.errors.address?.street}
            disabled={isLoading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="address.city"
            label="City"
            value={formik.values.address.city}
            onChange={(e) => formik.setFieldValue('address.city', e.target.value)}
            error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
            helperText={formik.touched.address?.city && formik.errors.address?.city}
            disabled={isLoading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            name="address.region"
            label="Region"
            value={formik.values.address.region}
            onChange={(e) => formik.setFieldValue('address.region', e.target.value)}
            error={formik.touched.address?.region && Boolean(formik.errors.address?.region)}
            helperText={formik.touched.address?.region && formik.errors.address?.region}
            disabled={isLoading}
          >
            {ETHIOPIAN_REGIONS.map((region) => (
              <MenuItem key={region} value={region}>
                {region}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            name="category"
            label="Business Category"
            value={formik.values.category}
            onChange={formik.handleChange}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
            disabled={isLoading}
          >
            {BUSINESS_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            name="type"
            label="Supplier Type"
            value={formik.values.type}
            onChange={formik.handleChange}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
            disabled={isLoading}
          >
            <MenuItem value="manufacturer">Manufacturer</MenuItem>
            <MenuItem value="distributor">Distributor</MenuItem>
            <MenuItem value="wholesaler">Wholesaler</MenuItem>
            <MenuItem value="retailer">Retailer</MenuItem>
            <MenuItem value="service_provider">Service Provider</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            console.log('DEBUG: Current form values:', formik.values);
            console.log('DEBUG: Form errors:', formik.errors);
            console.log('DEBUG: Form touched:', formik.touched);
            console.log('DEBUG: Form is valid:', formik.isValid);
          }}
          variant="outlined"
          disabled={isLoading}
        >
          Debug
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isEditing ? 'Update' : 'Create'} Supplier
        </Button>
      </Box>
    </Box>
  );
};

export default SupplierForm;
