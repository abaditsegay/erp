import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Chip,
  FormControlLabel,
  Switch,
  InputAdornment,
  Autocomplete,
  Alert,
  Checkbox,
  FormGroup,
} from '@mui/material';
import {
  Warehouse as WarehouseIcon,
  Thermostat as ThermostatIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

interface AddWarehouseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (warehouseData: any) => void;
}

const AddWarehouseDialog: React.FC<AddWarehouseDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    location: '',
    region: '',
    type: 'MAIN_WAREHOUSE',
    manager: '',
    contact: '',
    email: '',
    address: '',
    capacity: {
      total: '',
      unit: 'cbm',
    },
    specialization: [] as string[],
    temperature_controlled: false,
    customs_bonded: false,
    security_level: 'standard',
    operating_hours: {
      start: '08:00',
      end: '17:00',
    },
    coordinates: {
      latitude: '',
      longitude: '',
    },
    facilities: {
      loading_docks: '',
      office_space: false,
      parking: false,
      security_system: false,
      fire_safety: false,
      backup_power: false,
    },
    certifications: [] as string[],
    notes: '',
  });

  const [errors, setErrors] = useState<any>({});

  const warehouseTypes = [
    { value: 'MAIN_WAREHOUSE', label: 'Main Warehouse - ዋና መጋዘን' },
    { value: 'DISTRIBUTION_CENTER', label: 'Distribution Center - ስርጭት ማዕከል' },
    { value: 'REGIONAL_HUB', label: 'Regional Hub - ክልላዊ ማዕከል' },
    { value: 'CUSTOMS_WAREHOUSE', label: 'Customs Warehouse - የጉምሩክ መጋዘን' },
    { value: 'COLD_STORAGE', label: 'Cold Storage - ቀዝቃዛ መጋዘን' },
    { value: 'TRANSIT_WAREHOUSE', label: 'Transit Warehouse - የማሸጋገሪያ መጋዘን' },
  ];

  const ethiopianRegions = [
    'Addis Ababa', 'Afar', 'Amhara', 'Benishangul-Gumuz', 'Dire Dawa',
    'Gambela', 'Harari', 'Oromia', 'Sidama', 'SNNP', 'Somali', 'Tigray'
  ];

  const securityLevels = [
    { value: 'basic', label: 'Basic Security - መሰረታዊ ደህንነት' },
    { value: 'standard', label: 'Standard Security - መደበኛ ደህንነት' },
    { value: 'high', label: 'High Security - ከፍተኛ ደህንነት' },
    { value: 'maximum', label: 'Maximum Security - ከፍተኛ ደህንነት' },
  ];

  const specializationOptions = [
    'Electronics', 'Pharmaceuticals', 'Textiles', 'Agricultural Products',
    'Machinery', 'Import Processing', 'Transit Goods', 'Food & Beverages',
    'Construction Materials', 'Mining Equipment', 'Automotive Parts',
    'Chemical Products', 'Medical Equipment', 'Furniture'
  ];

  const certificationOptions = [
    'ISO 9001', 'ISO 14001', 'HACCP', 'GMP', 'GDP',
    'Ethiopian Standards Agency', 'Customs Bonded Facility',
    'Cold Chain Certified', 'Pharmaceutical Storage Certified'
  ];

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) newErrors.name = 'Warehouse name is required';
    if (!formData.code.trim()) newErrors.code = 'Warehouse code is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.manager.trim()) newErrors.manager = 'Manager name is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact number is required';
    if (!formData.capacity.total) newErrors.capacity = 'Capacity is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const warehouseData = {
        ...formData,
        id: `WH${Date.now().toString().slice(-3)}`,
        capacity: {
          total: parseFloat(formData.capacity.total),
          used: 0,
          unit: formData.capacity.unit,
        },
        status: 'active',
        last_inspection: new Date(),
        compliance_score: 100,
        createdDate: new Date(),
      };

      onSubmit(warehouseData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      code: '',
      location: '',
      region: '',
      type: 'MAIN_WAREHOUSE',
      manager: '',
      contact: '',
      email: '',
      address: '',
      capacity: { total: '', unit: 'cbm' },
      specialization: [],
      temperature_controlled: false,
      customs_bonded: false,
      security_level: 'standard',
      operating_hours: { start: '08:00', end: '17:00' },
      coordinates: { latitude: '', longitude: '' },
      facilities: {
        loading_docks: '',
        office_space: false,
        parking: false,
        security_system: false,
        fire_safety: false,
        backup_power: false,
      },
      certifications: [],
      notes: '',
    });
    setErrors({});
    onClose();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as Record<string, any>),
        [field]: value
      }
    }));
  };

  const generateWarehouseCode = (name: string, region: string) => {
    if (name && region) {
      const nameCode = name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
      const regionCode = region.slice(0, 2).toUpperCase();
      return `${regionCode}-${nameCode}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
    }
    return '';
  };

  React.useEffect(() => {
    if (formData.name && formData.region && !formData.code) {
      const generatedCode = generateWarehouseCode(formData.name, formData.region);
      updateFormData('code', generatedCode);
    }
  }, [formData.name, formData.region, formData.code]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <WarehouseIcon color="primary" />
          <Typography variant="h6">Add New Warehouse - አዲስ መጋዘን ይጨምሩ</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Basic Information - መሰረታዊ መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Warehouse Name - የመጋዘን ስም"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="e.g., Addis Ababa Main Warehouse"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Warehouse Code - የመጋዘን ኮድ"
              value={formData.code}
              onChange={(e) => updateFormData('code', e.target.value)}
              error={!!errors.code}
              helperText={errors.code || 'Auto-generated based on name and region'}
              placeholder="AA-MW01"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.region}>
              <InputLabel>Region - ክልል</InputLabel>
              <Select
                value={formData.region}
                onChange={(e) => updateFormData('region', e.target.value)}
                label="Region - ክልል"
              >
                {ethiopianRegions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
              {errors.region && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.region}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City/Location - ከተማ/አካባቢ"
              value={formData.location}
              onChange={(e) => updateFormData('location', e.target.value)}
              error={!!errors.location}
              helperText={errors.location}
              placeholder="e.g., Addis Ababa, Ethiopia"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Address - ሙሉ አድራሻ"
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
              multiline
              rows={2}
              placeholder="Street address, landmarks, postal code, etc."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Warehouse Type - የመጋዘን ዓይነት</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => updateFormData('type', e.target.value)}
                label="Warehouse Type - የመጋዘን ዓይነት"
              >
                {warehouseTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Capacity Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Capacity Information - የአቅም መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Total Capacity - ጠቅላላ አቅም"
              type="number"
              value={formData.capacity.total}
              onChange={(e) => updateNestedData('capacity', 'total', e.target.value)}
              error={!!errors.capacity}
              helperText={errors.capacity}
              InputProps={{
                endAdornment: <InputAdornment position="end">{formData.capacity.unit}</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Unit - አሃድ</InputLabel>
              <Select
                value={formData.capacity.unit}
                onChange={(e) => updateNestedData('capacity', 'unit', e.target.value)}
                label="Unit - አሃድ"
              >
                <MenuItem value="cbm">Cubic Meters (cbm)</MenuItem>
                <MenuItem value="sqm">Square Meters (sqm)</MenuItem>
                <MenuItem value="pallets">Pallets</MenuItem>
                <MenuItem value="tons">Tons</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Management Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Management Information - የአስተዳደር መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Warehouse Manager - የመጋዘን አስተዳዳሪ"
              value={formData.manager}
              onChange={(e) => updateFormData('manager', e.target.value)}
              error={!!errors.manager}
              helperText={errors.manager}
              placeholder="Full name of warehouse manager"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Number - የግንኙነት ቁጥር"
              value={formData.contact}
              onChange={(e) => updateFormData('contact', e.target.value)}
              error={!!errors.contact}
              helperText={errors.contact}
              placeholder="+251-11-xxx-xxxx"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address - ኢሜይል አድራሻ"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="manager@warehouse.com"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Security Level - የደህንነት ደረጃ</InputLabel>
              <Select
                value={formData.security_level}
                onChange={(e) => updateFormData('security_level', e.target.value)}
                label="Security Level - የደህንነት ደረጃ"
              >
                {securityLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Operating Hours */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Opening Time - መክፈቻ ሰዓት"
              type="time"
              value={formData.operating_hours.start}
              onChange={(e) => updateNestedData('operating_hours', 'start', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Closing Time - መዝጊያ ሰዓት"
              type="time"
              value={formData.operating_hours.end}
              onChange={(e) => updateNestedData('operating_hours', 'end', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Specialization */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Specialization & Features - ስፔሻላይዜሽን እና ባህሪያት
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={specializationOptions}
              value={formData.specialization}
              onChange={(_, value) => updateFormData('specialization', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Specialization Areas - የስፔሻላይዜሽን አካባቢዎች"
                  placeholder="Select warehouse specializations"
                />
              )}
            />
          </Grid>

          {/* Special Features */}
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.temperature_controlled}
                  onChange={(e) => updateFormData('temperature_controlled', e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ThermostatIcon fontSize="small" />
                  Temperature Controlled - የሙቀት ቁጥጥር
                </Box>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.customs_bonded}
                  onChange={(e) => updateFormData('customs_bonded', e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon fontSize="small" />
                  Customs Bonded - የጉምሩክ ውል
                </Box>
              }
            />
          </Grid>

          {/* Facilities */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Available Facilities - ያሉ መገልገያዎች
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Number of Loading Docks - የመጫኛ ቦታዎች ቁጥር"
              type="number"
              value={formData.facilities.loading_docks}
              onChange={(e) => updateNestedData('facilities', 'loading_docks', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.facilities.office_space}
                    onChange={(e) => updateNestedData('facilities', 'office_space', e.target.checked)}
                  />
                }
                label="Office Space - የቢሮ ቦታ"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.facilities.parking}
                    onChange={(e) => updateNestedData('facilities', 'parking', e.target.checked)}
                  />
                }
                label="Parking Area - የመኪና ማቆሚያ"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.facilities.security_system}
                    onChange={(e) => updateNestedData('facilities', 'security_system', e.target.checked)}
                  />
                }
                label="Security System - የደህንነት ስርዓት"
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.facilities.fire_safety}
                    onChange={(e) => updateNestedData('facilities', 'fire_safety', e.target.checked)}
                  />
                }
                label="Fire Safety System - የእሳት ደህንነት ስርዓት"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.facilities.backup_power}
                    onChange={(e) => updateNestedData('facilities', 'backup_power', e.target.checked)}
                  />
                }
                label="Backup Power - የመተካ ኃይል"
              />
            </FormGroup>
          </Grid>

          {/* Location Coordinates */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              GPS Coordinates (Optional) - የጂፒኤስ ኮርዲኔት (አማራጭ)
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Latitude - ሊትድ"
              type="number"
              value={formData.coordinates.latitude}
              onChange={(e) => updateNestedData('coordinates', 'latitude', e.target.value)}
              placeholder="e.g., 9.0320"
              inputProps={{ step: 'any' }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Longitude - ሎንጊትድ"
              type="number"
              value={formData.coordinates.longitude}
              onChange={(e) => updateNestedData('coordinates', 'longitude', e.target.value)}
              placeholder="e.g., 38.7459"
              inputProps={{ step: 'any' }}
            />
          </Grid>

          {/* Certifications */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={certificationOptions}
              value={formData.certifications}
              onChange={(_, value) => updateFormData('certifications', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Certifications - የምስክር ወረቀቶች"
                  placeholder="Select applicable certifications"
                />
              )}
            />
          </Grid>

          {/* Additional Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes - ተጨማሪ ማስታወሻዎች"
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              multiline
              rows={3}
              placeholder="Any additional information about the warehouse..."
            />
          </Grid>

          {formData.customs_bonded && (
            <Grid item xs={12}>
              <Alert severity="info">
                Customs bonded warehouses require special licensing and regular inspections.
                የጉምሩክ ውል መጋዘኖች ልዩ ፈቃድ እና መደበኛ ቁጥጥር ያስፈልጋቸዋል።
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel - ሰርዝ
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<WarehouseIcon />}
        >
          Add Warehouse - መጋዘን ጨምር
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWarehouseDialog;
