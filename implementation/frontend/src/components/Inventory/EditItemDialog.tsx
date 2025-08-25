import React, { useState, useEffect } from 'react';
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
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import {
  Close,
  Save,
  Edit,
  LocationOn,
  LocalShipping,
  Business,
  Scale,
  Thermostat,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { EditableInventoryItem } from '../../types/inventoryAnalytics';
import { ethiopianInventoryAnalyticsService } from '../../services/ethiopianInventoryAnalyticsService';

interface EditItemDialogProps {
  open: boolean;
  onClose: () => void;
  itemId: number;
  onSave?: (item: EditableInventoryItem) => void;
}

const EditItemDialog: React.FC<EditItemDialogProps> = ({
  open,
  onClose,
  itemId,
  onSave
}) => {
  const [item, setItem] = useState<EditableInventoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItem = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ethiopianInventoryAnalyticsService.getEditableItem(itemId);
      setItem(data);
    } catch (err) {
      setError('Failed to load item details');
      console.error('Error fetching item:', err);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    if (open && itemId) {
      fetchItem();
    }
  }, [open, itemId, fetchItem]);

  const handleSave = async () => {
    if (!item) return;

    setSaving(true);
    try {
      const updatedItem = await ethiopianInventoryAnalyticsService.updateInventoryItem(itemId, item);
      onSave?.(updatedItem);
      onClose();
    } catch (err) {
      setError('Failed to save item');
      console.error('Error saving item:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    if (!item) return;
    setItem({ ...item, [field]: value });
  };

  const handleNestedChange = (parentField: string, field: string, value: any) => {
    if (!item) return;
    setItem({
      ...item,
      [parentField]: {
        ...item[parentField as keyof EditableInventoryItem] as any,
        [field]: value
      }
    });
  };

  const categories = [
    'Agricultural Products',
    'Food Products',
    'Spices & Seasonings',
    'Raw Materials',
    'Finished Goods',
    'Office Supplies',
    'Equipment',
    'Seasonal Items'
  ];

  const unitsOfMeasure = [
    'kg', 'g', 'lb', 'oz',
    'pcs', 'boxes', 'bags', 'bottles',
    'liters', 'ml', 'gallons',
    'meters', 'cm', 'inches',
    'sq meters', 'cubic meters'
  ];

  const specialHandlingOptions = [
    'Keep dry',
    'Avoid direct sunlight',
    'First in, first out',
    'Fragile - handle with care',
    'Refrigeration required',
    'Toxic - use protective equipment',
    'Flammable - keep away from heat',
    'Heavy - use mechanical aids'
  ];

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!item) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Alert severity="error">Failed to load item details</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

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
            <Edit sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h6">Edit Item - {item.sku}</Typography>
              <Typography variant="body2" color="textSecondary">
                {item.name}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Basic Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <InventoryIcon sx={{ mr: 1 }} />
              Basic Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  value={item.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Item Name"
                  value={item.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={item.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={item.category}
                    label="Category"
                    onChange={(e) => handleChange('category', e.target.value)}
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Unit of Measure</InputLabel>
                  <Select
                    value={item.unitOfMeasure}
                    label="Unit of Measure"
                    onChange={(e) => handleChange('unitOfMeasure', e.target.value)}
                  >
                    {unitsOfMeasure.map(unit => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Unit Price (USD)"
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleChange('unitPrice', parseFloat(e.target.value) || 0)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Barcode"
                  value={item.barcode || ''}
                  onChange={(e) => handleChange('barcode', e.target.value)}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={item.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                  />
                }
                label="Active Item"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={item.trackSerial}
                    onChange={(e) => handleChange('trackSerial', e.target.checked)}
                  />
                }
                label="Track Serial Numbers"
                sx={{ ml: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={item.trackBatch}
                    onChange={(e) => handleChange('trackBatch', e.target.checked)}
                  />
                }
                label="Track Batches"
                sx={{ ml: 2 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Inventory Settings */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalShipping sx={{ mr: 1 }} />
              Inventory Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Reorder Level"
                  type="number"
                  value={item.reorderLevel}
                  onChange={(e) => handleChange('reorderLevel', parseInt(e.target.value) || 0)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Reorder Quantity"
                  type="number"
                  value={item.reorderQuantity}
                  onChange={(e) => handleChange('reorderQuantity', parseInt(e.target.value) || 0)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Lead Time (Days)"
                  type="number"
                  value={item.leadTimeDays}
                  onChange={(e) => handleChange('leadTimeDays', parseInt(e.target.value) || 0)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Supplier Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Business sx={{ mr: 1 }} />
              Supplier Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Supplier Name"
                  value={item.supplierName || ''}
                  onChange={(e) => handleChange('supplierName', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Manufacturer Part Number"
                  value={item.manufacturerPartNumber || ''}
                  onChange={(e) => handleChange('manufacturerPartNumber', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Physical Properties */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Scale sx={{ mr: 1 }} />
              Physical Properties
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={item.weight || ''}
                  onChange={(e) => handleChange('weight', parseFloat(e.target.value) || undefined)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Length (cm)"
                  type="number"
                  value={item.dimensions?.length || ''}
                  onChange={(e) => handleNestedChange('dimensions', 'length', parseFloat(e.target.value) || 0)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Width (cm)"
                  type="number"
                  value={item.dimensions?.width || ''}
                  onChange={(e) => handleNestedChange('dimensions', 'width', parseFloat(e.target.value) || 0)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  type="number"
                  value={item.dimensions?.height || ''}
                  onChange={(e) => handleNestedChange('dimensions', 'height', parseFloat(e.target.value) || 0)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Storage Requirements */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Thermostat sx={{ mr: 1 }} />
              Storage Requirements
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Min Temperature (°C)"
                  type="number"
                  value={item.storageRequirements?.temperature?.min || ''}
                  onChange={(e) => {
                    const temp = parseFloat(e.target.value) || 0;
                    handleNestedChange('storageRequirements', 'temperature', {
                      ...item.storageRequirements?.temperature,
                      min: temp
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Max Temperature (°C)"
                  type="number"
                  value={item.storageRequirements?.temperature?.max || ''}
                  onChange={(e) => {
                    const temp = parseFloat(e.target.value) || 0;
                    handleNestedChange('storageRequirements', 'temperature', {
                      ...item.storageRequirements?.temperature,
                      max: temp
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Min Humidity (%)"
                  type="number"
                  value={item.storageRequirements?.humidity?.min || ''}
                  onChange={(e) => {
                    const humidity = parseFloat(e.target.value) || 0;
                    handleNestedChange('storageRequirements', 'humidity', {
                      ...item.storageRequirements?.humidity,
                      min: humidity
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Max Humidity (%)"
                  type="number"
                  value={item.storageRequirements?.humidity?.max || ''}
                  onChange={(e) => {
                    const humidity = parseFloat(e.target.value) || 0;
                    handleNestedChange('storageRequirements', 'humidity', {
                      ...item.storageRequirements?.humidity,
                      max: humidity
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={specialHandlingOptions}
                  value={item.storageRequirements?.specialHandling || []}
                  onChange={(_, newValue) => {
                    handleNestedChange('storageRequirements', 'specialHandling', newValue);
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Special Handling Instructions"
                      placeholder="Select handling instructions"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ mr: 1 }} />
              Storage Location
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Zone"
                  value={item.location.zone}
                  onChange={(e) => handleNestedChange('location', 'zone', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Aisle"
                  value={item.location.aisle}
                  onChange={(e) => handleNestedChange('location', 'aisle', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Shelf"
                  value={item.location.shelf}
                  onChange={(e) => handleNestedChange('location', 'shelf', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Bin"
                  value={item.location.bin}
                  onChange={(e) => handleNestedChange('location', 'bin', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tags and Notes */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tags and Notes
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={item.tags || []}
                  onChange={(_, newValue) => handleChange('tags', newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Add tags (press Enter to add)"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={item.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave} 
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} /> : <Save />}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditItemDialog;
