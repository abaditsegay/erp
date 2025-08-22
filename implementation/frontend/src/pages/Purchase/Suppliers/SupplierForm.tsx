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
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import axios from 'axios';

interface Supplier {
  id?: number;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
}

interface SupplierFormProps {
  supplier?: Supplier | null;
  isEditing: boolean;
  onSuccess: () => void;
  onCancel: () => void;
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
  address: Yup.string()
    .max(500, 'Address must be less than 500 characters'),
});

const API_BASE_URL = '/api/suppliers';

const SupplierForm: React.FC<SupplierFormProps> = ({
  supplier,
  isEditing,
  onSuccess,
  onCancel,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createMutation = useMutation(
    (newSupplier: Supplier) => axios.post(API_BASE_URL, newSupplier),
    {
      onSuccess: () => {
        onSuccess();
      },
      onError: (error: any) => {
        setSubmitError(error.response?.data?.message || 'Error creating supplier');
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, supplier: updatedSupplier }: { id: number; supplier: Supplier }) =>
      axios.put(`${API_BASE_URL}/${id}`, updatedSupplier),
    {
      onSuccess: () => {
        onSuccess();
      },
      onError: (error: any) => {
        setSubmitError(error.response?.data?.message || 'Error updating supplier');
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      code: supplier?.code || '',
      name: supplier?.name || '',
      contactPerson: supplier?.contactPerson || '',
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      address: supplier?.address || '',
      active: supplier?.active !== undefined ? supplier.active : true,
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitError(null);
      
      try {
        if (isEditing && supplier?.id) {
          await updateMutation.mutateAsync({
            id: supplier.id,
            supplier: values,
          });
        } else {
          await createMutation.mutateAsync(values);
        }
      } catch (error) {
        // Error handling is done in mutation callbacks
      }
    },
  });

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

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
            label="Address"
            multiline
            rows={3}
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
            disabled={isLoading}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancel
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
