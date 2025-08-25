import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import {
  Close,
  Warehouse,
  LocationOn,
  Business,
  Phone,
  Public,
} from '@mui/icons-material';
import { ETHIOPIAN_REGIONS } from '../../types/inventory';

interface WarehouseData {
  id: number;
  name: string;
  type: 'main' | 'distribution' | 'retail' | 'customs';
  address: string;
  region: string;
  city: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  managerName?: string;
  capacity?: number;
  currentUtilization?: number;
  isActive: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  storageTypes: string[];
  customsRegistration?: string;
  taxId?: string;
  notes?: string;
}

interface EditWarehouseDialogProps {
  open: boolean;
  onClose: () => void;
  warehouseId?: number;
}

const WAREHOUSE_TYPES = [
  { value: 'main', label: 'Main Warehouse' },
  { value: 'distribution', label: 'Distribution Center' },
  { value: 'retail', label: 'Retail Outlet' },
  { value: 'customs', label: 'Customs Warehouse' },
];

const STORAGE_TYPES = [
  'General Storage',
  'Cold Storage',
  'Hazardous Materials',
  'Bulk Storage',
  'High Value Items',
  'Temperature Controlled',
  'Frozen Storage',
  'Pharmaceutical',
];

const EditWarehouseDialog: React.FC<EditWarehouseDialogProps> = ({
  open,
  onClose,
  warehouseId,
}) => {
  const [loading, setLoading] = useState(false);
  const [warehouse, setWarehouse] = useState<WarehouseData>({
    id: 0,
    name: '',
    type: 'main',
    address: '',
    region: 'Addis Ababa',
    city: '',
    phone: '',
    email: '',
    managerName: '',
    capacity: 0,
    currentUtilization: 0,
    isActive: true,
    storageTypes: [],
    notes: '',
  });

  const loadWarehouse = useCallback(async () => {
    setLoading(true);
    try {
      // Mock warehouse data - in real app, this would come from API
      const mockWarehouse: WarehouseData = {
        id: warehouseId || 1,
        name: `Warehouse ${warehouseId}`,
        type: 'main',
        address: '123 Industrial Street',
        region: 'Addis Ababa',
        city: 'Addis Ababa',
        postalCode: '1000',
        phone: '+251-11-123-4567',
        email: `warehouse${warehouseId}@example.com`,
        managerName: 'Alemayehu Tadesse',
        capacity: 50000,
        currentUtilization: 35000,
        isActive: true,
        coordinates: {
          latitude: 9.0245,
          longitude: 38.7442,
        },
        storageTypes: ['General Storage', 'Cold Storage'],
        customsRegistration: 'CW-001-2024',
        taxId: 'TIN-0123456789',
        notes: 'Main distribution center for Addis Ababa region',
      };
      setWarehouse(mockWarehouse);
    } catch (error) {
      console.error('Error loading warehouse:', error);
    } finally {
      setLoading(false);
    }
  }, [warehouseId]);

  useEffect(() => {
    if (open && warehouseId) {
      loadWarehouse();
    }
  }, [open, warehouseId, loadWarehouse]);

  const handleFieldChange = (field: keyof WarehouseData, value: any) => {
    setWarehouse(prev => ({ ...prev, [field]: value }));
  };

    const handleStorageTypeChange = (checked: boolean, storageType: string) => {
    setWarehouse(prev => ({
      ...prev,
      storageTypes: checked
        ? [...prev.storageTypes, storageType]
        : prev.storageTypes.filter(type => type !== storageType)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Mock save - in real app, this would call API
      console.log('Saving warehouse:', warehouse);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onClose();
    } catch (error) {
      console.error('Error saving warehouse:', error);
    } finally {
      setLoading(false);
    }
  };

  const utilizationPercentage = warehouse.capacity 
    ? Math.round((warehouse.currentUtilization || 0) / warehouse.capacity * 100)
    : 0;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{ sx: { height: '90vh' } }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Warehouse sx={{ mr: 2 }} />
            <Typography variant="h6">
              {warehouseId ? 'Edit Warehouse' : 'Create Warehouse'}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            Loading warehouse data...
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Business sx={{ mr: 1 }} />
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Warehouse Name"
                value={warehouse.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Warehouse Type</InputLabel>
                <Select
                  value={warehouse.type}
                  label="Warehouse Type"
                  onChange={(e) => handleFieldChange('type', e.target.value)}
                >
                  {WAREHOUSE_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Manager Name"
                value={warehouse.managerName}
                onChange={(e) => handleFieldChange('managerName', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={warehouse.isActive}
                    onChange={(e) => handleFieldChange('isActive', e.target.checked)}
                  />
                }
                label="Active Warehouse"
              />
            </Grid>

            {/* Location Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <LocationOn sx={{ mr: 1 }} />
                Location Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={warehouse.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                multiline
                rows={2}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Region</InputLabel>
                <Select
                  value={warehouse.region}
                  label="Region"
                  onChange={(e) => handleFieldChange('region', e.target.value)}
                >
                  {ETHIOPIAN_REGIONS.map((region) => (
                    <MenuItem key={region} value={region}>
                      {region}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                value={warehouse.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Postal Code"
                value={warehouse.postalCode || ''}
                onChange={(e) => handleFieldChange('postalCode', e.target.value)}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Phone sx={{ mr: 1 }} />
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={warehouse.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="+251-11-123-4567"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                value={warehouse.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                type="email"
              />
            </Grid>

            {/* Capacity Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Warehouse sx={{ mr: 1 }} />
                Capacity & Utilization
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Capacity (sq ft)"
                type="number"
                value={warehouse.capacity || ''}
                onChange={(e) => handleFieldChange('capacity', parseInt(e.target.value) || 0)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Utilization (sq ft)"
                type="number"
                value={warehouse.currentUtilization || ''}
                onChange={(e) => handleFieldChange('currentUtilization', parseInt(e.target.value) || 0)}
              />
            </Grid>

            {warehouse.capacity && warehouse.currentUtilization && (
              <Grid item xs={12}>
                <Alert 
                  severity={utilizationPercentage > 85 ? 'warning' : utilizationPercentage > 95 ? 'error' : 'info'}
                  sx={{ mb: 2 }}
                >
                  Current utilization: {utilizationPercentage}% 
                  ({warehouse.currentUtilization?.toLocaleString()} / {warehouse.capacity.toLocaleString()} sq ft)
                </Alert>
              </Grid>
            )}

            {/* Storage Types */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Storage Types
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {STORAGE_TYPES.map((storageType) => (
                  <Chip
                    key={storageType}
                    label={storageType}
                    clickable
                    color={warehouse.storageTypes.includes(storageType) ? 'primary' : 'default'}
                    onClick={() => handleStorageTypeChange(!warehouse.storageTypes.includes(storageType), storageType)}
                  />
                ))}
              </Box>
            </Grid>

            {/* Ethiopian Compliance */}
            {warehouse.type === 'customs' && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Public sx={{ mr: 1 }} />
                    Ethiopian Compliance
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Customs Registration Number"
                    value={warehouse.customsRegistration || ''}
                    onChange={(e) => handleFieldChange('customsRegistration', e.target.value)}
                    placeholder="CW-001-2024"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tax Identification Number"
                    value={warehouse.taxId || ''}
                    onChange={(e) => handleFieldChange('taxId', e.target.value)}
                    placeholder="TIN-0123456789"
                  />
                </Grid>
              </>
            )}

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={warehouse.notes || ''}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                multiline
                rows={3}
                placeholder="Additional information about this warehouse..."
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSave} 
          disabled={loading || !warehouse.name || !warehouse.address}
        >
          {loading ? 'Saving...' : 'Save Warehouse'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditWarehouseDialog;
