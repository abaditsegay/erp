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
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Flight as FlightIcon,
  Train as TrainIcon,
  DirectionsBoat as BoatIcon,
} from '@mui/icons-material';

interface CreateShipmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (shipmentData: any) => void;
}

const CreateShipmentDialog: React.FC<CreateShipmentDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    description: '',
    origin: '',
    destination: '',
    carrier: '',
    mode: 'road',
    priority: 'medium',
    weight: '',
    value: '',
    currency: 'ETB',
    estimatedDelivery: '',
    recipient: {
      name: '',
      phone: '',
      email: '',
      address: '',
    },
    shipper: {
      name: '',
      phone: '',
      email: '',
      address: '',
    },
    isInternational: false,
    requiresCustoms: false,
    isTemperatureControlled: false,
    specialInstructions: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
  });

  const [errors, setErrors] = useState<any>({});

  const transportModes = [
    { value: 'road', label: 'Road Transport', icon: <ShippingIcon /> },
    { value: 'air', label: 'Air Freight', icon: <FlightIcon /> },
    { value: 'sea', label: 'Sea Freight', icon: <BoatIcon /> },
    { value: 'rail', label: 'Rail Transport', icon: <TrainIcon /> },
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: '#4caf50' },
    { value: 'medium', label: 'Medium', color: '#ff9800' },
    { value: 'high', label: 'High', color: '#f44336' },
    { value: 'urgent', label: 'Urgent', color: '#9c27b0' },
  ];

  const ethiopianCities = [
    'Addis Ababa', 'Dire Dawa', 'Mekelle', 'Adama', 'Gondar', 'Awassa',
    'Bahir Dar', 'Jimma', 'Jijiga', 'Shashemene', 'Nekemte', 'Debre Markos',
    'Harar', 'Dessie', 'Kombolcha', 'Arba Minch', 'Hosaena', 'Wolaita Sodo'
  ];

  const internationalLocations = [
    'Dubai, UAE', 'Djibouti City, Djibouti', 'Mumbai, India', 'Guangzhou, China',
    'Frankfurt, Germany', 'Nairobi, Kenya', 'Istanbul, Turkey', 'London, UK',
    'Shanghai, China', 'Cairo, Egypt', 'Khartoum, Sudan', 'Kampala, Uganda'
  ];

  const carriers = [
    'Ethiopian Airlines Cargo', 'DHL Express', 'FedEx', 'UPS',
    'COSCO Shipping', 'Maersk Line', 'Ethiopian Shipping Lines',
    'TransEthiopia', 'Comet Transport', 'Highway Bus Service'
  ];

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.origin.trim()) newErrors.origin = 'Origin is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.carrier.trim()) newErrors.carrier = 'Carrier is required';
    if (!formData.weight) newErrors.weight = 'Weight is required';
    if (!formData.value) newErrors.value = 'Value is required';
    if (!formData.estimatedDelivery) newErrors.estimatedDelivery = 'Estimated delivery is required';
    if (!formData.recipient.name.trim()) newErrors.recipientName = 'Recipient name is required';
    if (!formData.recipient.phone.trim()) newErrors.recipientPhone = 'Recipient phone is required';
    if (!formData.shipper.name.trim()) newErrors.shipperName = 'Shipper name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const shipmentData = {
        ...formData,
        trackingNumber: `ETH-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        status: 'created',
        createdDate: new Date(),
        weight: `${formData.weight} kg`,
        value: {
          amount: parseFloat(formData.value),
          currency: formData.currency,
        },
        timeline: [
          {
            date: new Date(),
            status: 'created',
            location: formData.origin,
            description: 'Shipment created and documentation prepared',
          },
        ],
      };

      onSubmit(shipmentData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      description: '',
      origin: '',
      destination: '',
      carrier: '',
      mode: 'road',
      priority: 'medium',
      weight: '',
      value: '',
      currency: 'ETB',
      estimatedDelivery: '',
      recipient: { name: '', phone: '', email: '', address: '' },
      shipper: { name: '', phone: '', email: '', address: '' },
      isInternational: false,
      requiresCustoms: false,
      isTemperatureControlled: false,
      specialInstructions: '',
      dimensions: { length: '', width: '', height: '' },
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

  const updateNestedData = (section: 'recipient' | 'shipper' | 'dimensions', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ShippingIcon color="primary" />
          <Typography variant="h6">Create New Shipment - አዲስ ጭነት ይፍጠሩ</Typography>
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
              label="Shipment Description - የጭነት መግለጫ"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="e.g., Electronics Import from Dubai"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Priority - ቅድሚያ</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => updateFormData('priority', e.target.value)}
                label="Priority - ቅድሚያ"
              >
                {priorityLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label={level.label}
                        sx={{ bgcolor: level.color, color: 'white', minWidth: 60 }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Transport Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Transport Information - የትራንስፖርት መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={formData.isInternational ? internationalLocations : ethiopianCities}
              value={formData.origin}
              onChange={(_, value) => updateFormData('origin', value || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Origin - ምንጭ"
                  error={!!errors.origin}
                  helperText={errors.origin}
                />
              )}
              freeSolo
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={ethiopianCities}
              value={formData.destination}
              onChange={(_, value) => updateFormData('destination', value || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Destination - መድረሻ"
                  error={!!errors.destination}
                  helperText={errors.destination}
                />
              )}
              freeSolo
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Transport Mode - የትራንስፖርት ዓይነት</InputLabel>
              <Select
                value={formData.mode}
                onChange={(e) => updateFormData('mode', e.target.value)}
                label="Transport Mode - የትራንስፖርት ዓይነት"
              >
                {transportModes.map((mode) => (
                  <MenuItem key={mode.value} value={mode.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {mode.icon}
                      {mode.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={carriers}
              value={formData.carrier}
              onChange={(_, value) => updateFormData('carrier', value || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Carrier - አጓዥ"
                  error={!!errors.carrier}
                  helperText={errors.carrier}
                />
              )}
              freeSolo
            />
          </Grid>

          {/* Package Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Package Information - የፓኬጅ መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Weight (kg) - ክብደት"
              type="number"
              value={formData.weight}
              onChange={(e) => updateFormData('weight', e.target.value)}
              error={!!errors.weight}
              helperText={errors.weight}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Length (cm) - ርዝመት"
              type="number"
              value={formData.dimensions.length}
              onChange={(e) => updateNestedData('dimensions', 'length', e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Width (cm) - ስፋት"
              type="number"
              value={formData.dimensions.width}
              onChange={(e) => updateNestedData('dimensions', 'width', e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Height (cm) - ቁመት"
              type="number"
              value={formData.dimensions.height}
              onChange={(e) => updateNestedData('dimensions', 'height', e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Value - ዋጋ"
              type="number"
              value={formData.value}
              onChange={(e) => updateFormData('value', e.target.value)}
              error={!!errors.value}
              helperText={errors.value}
              InputProps={{
                startAdornment: <InputAdornment position="start">{formData.currency}</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Currency - ምንዛሬ</InputLabel>
              <Select
                value={formData.currency}
                onChange={(e) => updateFormData('currency', e.target.value)}
                label="Currency - ምንዛሬ"
              >
                <MenuItem value="ETB">ETB - Ethiopian Birr</MenuItem>
                <MenuItem value="USD">USD - US Dollar</MenuItem>
                <MenuItem value="EUR">EUR - Euro</MenuItem>
                <MenuItem value="GBP">GBP - British Pound</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estimated Delivery Date - የተገመተ የማድረሻ ቀን"
              type="date"
              value={formData.estimatedDelivery}
              onChange={(e) => updateFormData('estimatedDelivery', e.target.value)}
              error={!!errors.estimatedDelivery}
              helperText={errors.estimatedDelivery}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Recipient Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Recipient Information - የተቀባይ መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Recipient Name - የተቀባይ ስም"
              value={formData.recipient.name}
              onChange={(e) => updateNestedData('recipient', 'name', e.target.value)}
              error={!!errors.recipientName}
              helperText={errors.recipientName}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Recipient Phone - የተቀባይ ስልክ"
              value={formData.recipient.phone}
              onChange={(e) => updateNestedData('recipient', 'phone', e.target.value)}
              error={!!errors.recipientPhone}
              helperText={errors.recipientPhone}
              placeholder="+251-11-xxx-xxxx"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Recipient Email - የተቀባይ ኢሜይል"
              type="email"
              value={formData.recipient.email}
              onChange={(e) => updateNestedData('recipient', 'email', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Recipient Address - የተቀባይ አድራሻ"
              value={formData.recipient.address}
              onChange={(e) => updateNestedData('recipient', 'address', e.target.value)}
              multiline
              rows={1}
            />
          </Grid>

          {/* Shipper Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Shipper Information - የላኪ መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Shipper Name - የላኪ ስም"
              value={formData.shipper.name}
              onChange={(e) => updateNestedData('shipper', 'name', e.target.value)}
              error={!!errors.shipperName}
              helperText={errors.shipperName}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Shipper Phone - የላኪ ስልክ"
              value={formData.shipper.phone}
              onChange={(e) => updateNestedData('shipper', 'phone', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Shipper Email - የላኪ ኢሜይል"
              type="email"
              value={formData.shipper.email}
              onChange={(e) => updateNestedData('shipper', 'email', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Shipper Address - የላኪ አድራሻ"
              value={formData.shipper.address}
              onChange={(e) => updateNestedData('shipper', 'address', e.target.value)}
              multiline
              rows={1}
            />
          </Grid>

          {/* Special Requirements */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Special Requirements - ልዩ መስፈርቶች
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isInternational}
                  onChange={(e) => {
                    updateFormData('isInternational', e.target.checked);
                    if (e.target.checked) {
                      updateFormData('requiresCustoms', true);
                    }
                  }}
                />
              }
              label="International Shipment - ዓለም አቀፍ ጭነት"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.requiresCustoms}
                  onChange={(e) => updateFormData('requiresCustoms', e.target.checked)}
                />
              }
              label="Requires Customs - ጉምሩክ ይፈልጋል"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isTemperatureControlled}
                  onChange={(e) => updateFormData('isTemperatureControlled', e.target.checked)}
                />
              }
              label="Temperature Controlled - የሙቀት ቁጥጥር"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Special Instructions - ልዩ መመሪያዎች"
              value={formData.specialInstructions}
              onChange={(e) => updateFormData('specialInstructions', e.target.value)}
              multiline
              rows={3}
              placeholder="Any special handling requirements, delivery instructions, etc."
            />
          </Grid>

          {formData.isInternational && (
            <Grid item xs={12}>
              <Alert severity="info">
                International shipments require customs clearance and may take additional time for processing.
                ዓለም አቀፍ ጭነቶች የጉምሩክ ማጽዳት ይፈልጋሉ እና ለማቀነባበር ተጨማሪ ጊዜ ሊወስድ ይችላል።
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
          startIcon={<ShippingIcon />}
        >
          Create Shipment - ጭነት ፍጠር
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateShipmentDialog;
