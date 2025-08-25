import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Autocomplete,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Close,
  Save,
  Inventory,
  Category,
  AttachMoney,
  Business,
  WarningAmber,
} from '@mui/icons-material';
import { InventoryItem } from '../../types/inventoryAnalytics';

interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  onItemAdded?: (item: InventoryItem) => void;
}

// Form data interface that includes additional fields for creation
interface ItemFormData {
  sku?: string;
  name: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  warehouseId: number;
  warehouseName?: string;
  supplierName?: string;
  notes?: string;
  // Additional form-specific fields
  unitOfMeasure: string;
  storageCondition: string;
  expiryDate?: string;
  batchNumber?: string;
  serialNumber?: string;
  barcode?: string;
  taxRate: number;
  isHazardous: boolean;
  requiresLicense: boolean;
}

// Ethiopian business categories and units
const ITEM_CATEGORIES = [
  'Electronics & Technology',
  'Textiles & Clothing',
  'Food & Beverages', 
  'Agricultural Products',
  'Coffee & Spices',
  'Construction Materials',
  'Automotive Parts',
  'Pharmaceuticals',
  'Beauty & Personal Care',
  'Home & Garden',
  'Industrial Equipment',
  'Office Supplies',
  'Raw Materials',
  'Handicrafts & Art',
  'Leather Products',
  'Mining & Minerals',
];

const UNITS_OF_MEASURE = [
  'pieces (pcs)',
  'kilograms (kg)',
  'grams (g)',
  'liters (L)',
  'milliliters (mL)',
  'meters (m)',
  'centimeters (cm)',
  'square meters (m²)',
  'cubic meters (m³)',
  'boxes',
  'cartons',
  'packages',
  'bundles',
  'sets',
  'pairs',
  'dozens',
  'tons',
  'quintals (qt)',
  'bags',
  'rolls',
];

const STORAGE_CONDITIONS = [
  'Room Temperature',
  'Cool & Dry',
  'Refrigerated (2-8°C)',
  'Frozen (-18°C)',
  'Controlled Humidity',
  'Away from Sunlight',
  'Hazmat Storage',
  'Climate Controlled',
];

const WAREHOUSES = [
  { id: 1, name: 'Addis Ababa Main Warehouse', region: 'Addis Ababa' },
  { id: 2, name: 'Bahir Dar Regional Hub', region: 'Amhara' },
  { id: 3, name: 'Dire Dawa Distribution Center', region: 'Dire Dawa' },
  { id: 4, name: 'Hawassa Storage Facility', region: 'SNNPR' },
  { id: 5, name: 'Mekelle Northern Depot', region: 'Tigray' },
  { id: 6, name: 'Jimma Coffee Warehouse', region: 'Oromia' },
];

const SUPPLIERS = [
  'Awash Trading PLC',
  'Ethiopian Coffee Export Enterprise',
  'Habesha Textiles Ltd',
  'Addis Electronics Import',
  'Horn of Africa Trading',
  'Blue Nile Manufacturing',
  'Shewa Distribution Services',
  'Golden Tulip Imports',
  'Rift Valley Products',
  'East African Suppliers',
];

const AddItemDialog: React.FC<AddItemDialogProps> = ({
  open,
  onClose,
  onItemAdded,
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    category: '',
    unitPrice: 0,
    unitOfMeasure: '',
    currentStock: 0,
    reorderLevel: 0,
    reorderQuantity: 0,
    warehouseId: 1,
    supplierName: '',
    storageCondition: 'Room Temperature',
    taxRate: 15, // Default Ethiopian VAT rate
    isHazardous: false,
    requiresLicense: false,
    notes: '',
  });

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validations
    if (!formData.name?.trim()) {
      newErrors.name = 'Item name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.unitOfMeasure) {
      newErrors.unitOfMeasure = 'Unit of measure is required';
    }
    if (!formData.supplierName) {
      newErrors.supplierName = 'Supplier is required';
    }

    // Numeric validations
    if (formData.unitPrice <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    }
    if (formData.reorderLevel < 0) {
      newErrors.reorderLevel = 'Reorder level cannot be negative';
    }
    if (formData.currentStock < 0) {
      newErrors.currentStock = 'Initial stock cannot be negative';
    }
    if (formData.reorderQuantity <= 0) {
      newErrors.reorderQuantity = 'Reorder quantity must be greater than 0';
    }
    if (formData.taxRate < 0 || formData.taxRate > 100) {
      newErrors.taxRate = 'Tax rate must be between 0 and 100';
    }

    // Business logic validations
    if (formData.reorderLevel > formData.currentStock) {
      newErrors.reorderLevel = 'Reorder level cannot exceed current stock';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Generate new item ID (in real app, this would come from API)
      const newId = Date.now();
      
      // Create new inventory item
      const newItem: InventoryItem = {
        id: newId,
        sku: formData.sku || `SKU-${newId}`,
        name: formData.name!,
        category: formData.category!,
        unitPrice: formData.unitPrice!,
        totalValue: formData.unitPrice! * formData.currentStock!,
        currentStock: formData.currentStock!,
        monthlyUsage: 0, // Will be calculated over time
        annualUsage: 0, // Will be calculated over time
        turnoverRate: 0, // Will be calculated over time
        abcClassification: 'C', // Default classification
        warehouseId: formData.warehouseId!,
        warehouseName: selectedWarehouse?.name || '',
        supplierName: formData.supplierName!,
        reorderLevel: formData.reorderLevel!,
        reorderQuantity: formData.reorderQuantity!,
        lastMovementDate: new Date().toISOString(),
        leadTimeDays: 7, // Default lead time
        isActive: true,
        notes: formData.notes,
      };

      // In real implementation, this would be an API call
      console.log('Adding new inventory item:', newItem);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call success callback
      if (onItemAdded) {
        onItemAdded(newItem);
      }

      // Reset form and close dialog
      setFormData({
        name: '',
        category: '',
        unitPrice: 0,
        unitOfMeasure: '',
        currentStock: 0,
        reorderLevel: 0,
        reorderQuantity: 0,
        warehouseId: 1,
        supplierName: '',
        storageCondition: 'Room Temperature',
        taxRate: 15,
        isHazardous: false,
        requiresLicense: false,
        notes: '',
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding item:', error);
      setErrors({ submit: 'Failed to add item. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const selectedWarehouse = WAREHOUSES.find(w => w.id === formData.warehouseId);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <Inventory color="primary" />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="div">
            Add New Inventory Item
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ethiopian ERP Inventory Management
          </Typography>
        </Box>
        <Button
          onClick={onClose}
          startIcon={<Close />}
          variant="outlined"
          size="small"
        >
          Cancel
        </Button>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.submit}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Category color="primary" />
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Item Name *"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="e.g., Ethiopian Coffee Arabica Grade 1"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category *</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                label="Category *"
              >
                {ITEM_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              multiline
              rows={2}
              placeholder="Additional information about the item..."
            />
          </Grid>

          {/* Pricing & Measurement */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoney color="primary" />
              Pricing & Measurement
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Unit Price (ETB) *"
              type="number"
              value={formData.unitPrice}
              onChange={(e) => handleFieldChange('unitPrice', parseFloat(e.target.value) || 0)}
              error={!!errors.unitPrice}
              helperText={errors.unitPrice}
              InputProps={{
                startAdornment: <InputAdornment position="start">ETB</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Autocomplete
              options={UNITS_OF_MEASURE}
              value={formData.unitOfMeasure}
              onChange={(_, value) => handleFieldChange('unitOfMeasure', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Unit of Measure *"
                  error={!!errors.unitOfMeasure}
                  helperText={errors.unitOfMeasure}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Tax Rate (%)"
              type="number"
              value={formData.taxRate}
              onChange={(e) => handleFieldChange('taxRate', parseFloat(e.target.value) || 0)}
              error={!!errors.taxRate}
              helperText={errors.taxRate || 'Ethiopian VAT rate (default 15%)'}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Grid>

          {/* Stock Information */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Inventory color="primary" />
              Stock Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Current Stock *"
              type="number"
              value={formData.currentStock}
              onChange={(e) => handleFieldChange('currentStock', parseInt(e.target.value) || 0)}
              error={!!errors.currentStock}
              helperText={errors.currentStock}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Reorder Level *"
              type="number"
              value={formData.reorderLevel}
              onChange={(e) => handleFieldChange('reorderLevel', parseInt(e.target.value) || 0)}
              error={!!errors.reorderLevel}
              helperText={errors.reorderLevel}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Storage Warehouse *</InputLabel>
              <Select
                value={formData.warehouseId}
                onChange={(e) => handleFieldChange('warehouseId', e.target.value)}
                label="Storage Warehouse *"
              >
                {WAREHOUSES.map((warehouse) => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name} ({warehouse.region})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Reorder Quantity *"
              type="number"
              value={formData.reorderQuantity}
              onChange={(e) => handleFieldChange('reorderQuantity', parseInt(e.target.value) || 0)}
              error={!!errors.reorderQuantity}
              helperText={errors.reorderQuantity || 'Quantity to order when stock is low'}
            />
          </Grid>

          {/* Supplier Information */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business color="primary" />
              Supplier & Storage
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={SUPPLIERS}
              value={formData.supplierName}
              onChange={(_, value) => handleFieldChange('supplierName', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplier *"
                  error={!!errors.supplierName}
                  helperText={errors.supplierName}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Storage Condition</InputLabel>
              <Select
                value={formData.storageCondition}
                onChange={(e) => handleFieldChange('storageCondition', e.target.value)}
                label="Storage Condition"
              >
                {STORAGE_CONDITIONS.map((condition) => (
                  <MenuItem key={condition} value={condition}>
                    {condition}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Optional Fields */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Batch Number"
              value={formData.batchNumber}
              onChange={(e) => handleFieldChange('batchNumber', e.target.value)}
              placeholder="e.g., BT2024-001"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Serial Number"
              value={formData.serialNumber}
              onChange={(e) => handleFieldChange('serialNumber', e.target.value)}
              placeholder="e.g., SN123456789"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Barcode"
              value={formData.barcode}
              onChange={(e) => handleFieldChange('barcode', e.target.value)}
              placeholder="e.g., 123456789012"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleFieldChange('expiryDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Compliance & Regulations */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningAmber color="primary" />
              Compliance & Regulations
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isHazardous}
                  onChange={(e) => handleFieldChange('isHazardous', e.target.checked)}
                />
              }
              label="Hazardous Material"
            />
            {formData.isHazardous && (
              <Typography variant="caption" color="warning.main" display="block">
                Requires special handling and storage
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.requiresLicense}
                  onChange={(e) => handleFieldChange('requiresLicense', e.target.checked)}
                />
              }
              label="Requires License"
            />
            {formData.requiresLicense && (
              <Typography variant="caption" color="info.main" display="block">
                ERCA license or permit required
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes"
              value={formData.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              multiline
              rows={3}
              placeholder="Any additional information about this item..."
            />
          </Grid>

          {/* Summary Information */}
          {selectedWarehouse && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Summary
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={`Warehouse: ${selectedWarehouse.name}`} size="small" />
                  <Chip label={`Region: ${selectedWarehouse.region}`} size="small" />
                  <Chip 
                    label={`Total Value: ETB ${(formData.unitPrice * formData.currentStock).toLocaleString()}`} 
                    color="primary" 
                    size="small" 
                  />
                  {formData.isHazardous && <Chip label="Hazardous" color="warning" size="small" />}
                  {formData.requiresLicense && <Chip label="License Required" color="info" size="small" />}
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
        >
          {loading ? 'Adding Item...' : 'Add Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog;
