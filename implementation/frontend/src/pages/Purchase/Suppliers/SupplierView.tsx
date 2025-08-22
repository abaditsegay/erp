import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ActivateIcon,
  ToggleOff as DeactivateIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

interface Supplier {
  id: number;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface SupplierViewProps {
  supplier: Supplier;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  isLoading?: boolean;
}

const SupplierView: React.FC<SupplierViewProps> = ({
  supplier,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardContent>
        {/* Header with actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {supplier.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Code: {supplier.code}
              </Typography>
              <Chip
                label={supplier.active ? 'Active' : 'Inactive'}
                color={supplier.active ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit Supplier">
              <IconButton onClick={onEdit} disabled={isLoading}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={supplier.active ? 'Deactivate' : 'Activate'}>
              <IconButton onClick={onToggleStatus} disabled={isLoading}>
                {supplier.active ? <DeactivateIcon /> : <ActivateIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Supplier">
              <IconButton onClick={onDelete} disabled={isLoading} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Contact Information */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="primary" />
              Contact Information
            </Typography>
            
            <Box sx={{ ml: 4 }}>
              {supplier.contactPerson && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact Person
                  </Typography>
                  <Typography variant="body1">{supplier.contactPerson}</Typography>
                </Box>
              )}

              {supplier.email && (
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      <a href={`mailto:${supplier.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {supplier.email}
                      </a>
                    </Typography>
                  </Box>
                </Box>
              )}

              {supplier.phone && (
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      <a href={`tel:${supplier.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {supplier.phone}
                      </a>
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon color="primary" />
              Address
            </Typography>
            
            <Box sx={{ ml: 4 }}>
              {supplier.address ? (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {supplier.address}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No address provided
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Metadata */}
        {(supplier.createdAt || supplier.updatedAt) && (
          <>
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body2">
                  {formatDate(supplier.createdAt)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {formatDate(supplier.updatedAt)}
                </Typography>
              </Grid>
            </Grid>
          </>
        )}

        {/* Additional Actions */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onEdit} disabled={isLoading}>
            Edit Supplier
          </Button>
          <Button
            variant="outlined"
            color={supplier.active ? 'warning' : 'success'}
            onClick={onToggleStatus}
            disabled={isLoading}
          >
            {supplier.active ? 'Deactivate' : 'Activate'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SupplierView;
