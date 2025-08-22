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
  Receipt as ReceiptIcon,
  Flight as FlightIcon,
  DirectionsBoat as BoatIcon,
  LocalShipping as TruckIcon,
  Scale as ScaleIcon,
  MonetizationOn as MoneyIcon,
} from '@mui/icons-material';

interface CreateCustomsEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (entryData: any) => void;
}

const CreateCustomsEntryDialog: React.FC<CreateCustomsEntryDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    importerName: '',
    importerTin: '',
    importerAddress: '',
    description: '',
    origin: '',
    portOfEntry: 'Bole International Airport',
    arrivalDate: '',
    declarationDate: new Date().toISOString().split('T')[0],
    priority: 'normal',
    customsValue: '',
    currency: 'USD',
    weight: '',
    packages: '',
    hsCode: '',
    regime: 'PERMANENT_IMPORT',
    inspectionRequired: false,
    transportMode: 'air',
    carrierName: '',
    billOfLading: '',
    invoiceNumber: '',
    packingList: '',
    certificateOfOrigin: '',
    customsAgent: '',
    declarantName: '',
    declarantLicense: '',
    specialRequirements: [] as string[],
    additionalNotes: '',
  });

  const [errors, setErrors] = useState<any>({});

  const portsOfEntry = [
    'Bole International Airport',
    'Dire Dawa Dry Port',
    'Modjo Dry Port',
    'Semera-Logia Dry Port',
    'Mekelle Airport',
    'Kombolcha Dry Port',
    'Jimma Airport',
    'Gondar Airport',
  ];

  const regimeTypes = [
    { value: 'PERMANENT_IMPORT', label: 'Permanent Import - ቋሚ ማስመጣት' },
    { value: 'TEMPORARY_IMPORT', label: 'Temporary Import - ጊዜያዊ ማስመጣት' },
    { value: 'TRANSIT', label: 'Transit - ማሸጋገሪያ' },
    { value: 'BONDED_WAREHOUSE', label: 'Bonded Warehouse - የውል መጋዘን' },
    { value: 'FREE_ZONE', label: 'Free Zone - ነፃ ዞን' },
    { value: 'RE_EXPORT', label: 'Re-export - ዳግም ወደ ውጭ መላክ' },
  ];

  const transportModes = [
    { value: 'air', label: 'Air Freight', icon: <FlightIcon /> },
    { value: 'sea', label: 'Sea Freight', icon: <BoatIcon /> },
    { value: 'road', label: 'Road Transport', icon: <TruckIcon /> },
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: '#4caf50' },
    { value: 'normal', label: 'Normal', color: '#2196f3' },
    { value: 'high', label: 'High', color: '#ff9800' },
    { value: 'urgent', label: 'Urgent', color: '#f44336' },
  ];

  const specialRequirementOptions = [
    'Pharmaceutical Inspection',
    'Agricultural Quarantine',
    'Electronics Verification',
    'Food Safety Inspection',
    'Hazardous Materials',
    'Luxury Goods Verification',
    'Intellectual Property Check',
    'Environmental Compliance',
    'Medical Device Certification',
    'Chemical Analysis Required',
  ];

  const commonCustomsAgents = [
    'Addis Customs Brokerage',
    'Global Trade Services',
    'Dire Dawa Customs Services',
    'Ethiopian Freight Forwarders',
    'Bole Cargo Services',
    'Prime Customs Agency',
    'Swift Clearance Services',
  ];

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.importerName.trim()) newErrors.importerName = 'Importer name is required';
    if (!formData.importerTin.trim()) newErrors.importerTin = 'Importer TIN is required';
    if (!formData.description.trim()) newErrors.description = 'Goods description is required';
    if (!formData.origin.trim()) newErrors.origin = 'Country of origin is required';
    if (!formData.arrivalDate) newErrors.arrivalDate = 'Arrival date is required';
    if (!formData.customsValue) newErrors.customsValue = 'Customs value is required';
    if (!formData.weight) newErrors.weight = 'Weight is required';
    if (!formData.packages) newErrors.packages = 'Number of packages is required';
    if (!formData.hsCode.trim()) newErrors.hsCode = 'HS Code is required';
    if (!formData.carrierName.trim()) newErrors.carrierName = 'Carrier name is required';
    if (!formData.declarantName.trim()) newErrors.declarantName = 'Declarant name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDutyAndTax = (value: number) => {
    // Simplified calculation - in real implementation, this would use actual tariff rates
    const dutyRate = 0.15; // 15% duty rate example
    const vatRate = 0.15; // 15% VAT rate
    const exciseRate = 0.1; // 10% excise tax example (for applicable goods)
    
    const dutyAmount = value * dutyRate;
    const vatAmount = (value + dutyAmount) * vatRate;
    const exciseAmount = value * exciseRate; // Only for certain goods
    
    return {
      dutyAmount: dutyAmount * 57, // Convert to ETB (approximate rate)
      vatAmount: vatAmount * 57,
      exciseAmount: exciseAmount * 57,
      totalTaxes: (dutyAmount + vatAmount + exciseAmount) * 57,
    };
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const customsValue = parseFloat(formData.customsValue);
      const taxes = calculateDutyAndTax(customsValue);
      
      const entryData = {
        id: `CE${Date.now().toString().slice(-3)}`,
        declarationNumber: `ETH-IMP-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        ...formData,
        status: 'document_submission',
        customsValue: {
          amount: customsValue,
          currency: formData.currency,
        },
        dutyAmount: {
          amount: Math.round(taxes.dutyAmount),
          currency: 'ETB',
        },
        vatAmount: {
          amount: Math.round(taxes.vatAmount),
          currency: 'ETB',
        },
        totalTaxes: {
          amount: Math.round(taxes.totalTaxes),
          currency: 'ETB',
        },
        weight: `${formData.weight} kg`,
        packages: parseInt(formData.packages),
        documentsSubmitted: false,
        paymentStatus: 'pending',
        estimatedClearance: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        steps: [
          { step: 'Document Submission', status: 'in_progress', date: null },
          { step: 'Declaration Processing', status: 'pending', date: null },
          { step: 'Customs Examination', status: 'pending', date: null },
          { step: 'Tax Assessment', status: 'pending', date: null },
          { step: 'Payment Processing', status: 'pending', date: null },
          { step: 'Release Authorization', status: 'pending', date: null },
        ],
        createdDate: new Date(),
      };

      onSubmit(entryData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      importerName: '',
      importerTin: '',
      importerAddress: '',
      description: '',
      origin: '',
      portOfEntry: 'Bole International Airport',
      arrivalDate: '',
      declarationDate: new Date().toISOString().split('T')[0],
      priority: 'normal',
      customsValue: '',
      currency: 'USD',
      weight: '',
      packages: '',
      hsCode: '',
      regime: 'PERMANENT_IMPORT',
      inspectionRequired: false,
      transportMode: 'air',
      carrierName: '',
      billOfLading: '',
      invoiceNumber: '',
      packingList: '',
      certificateOfOrigin: '',
      customsAgent: '',
      declarantName: '',
      declarantLicense: '',
      specialRequirements: [],
      additionalNotes: '',
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ReceiptIcon color="primary" />
          <Typography variant="h6">Create Customs Entry - አዲስ ጉምሩክ ምዝገባ ይፍጠሩ</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Importer Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Importer Information - የማስመጫ መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Importer Name - የማስመጫ ስም"
              value={formData.importerName}
              onChange={(e) => updateFormData('importerName', e.target.value)}
              error={!!errors.importerName}
              helperText={errors.importerName}
              placeholder="e.g., TechCorp Ethiopia"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Importer TIN - የማስመጫ ታክስ ቁጥር"
              value={formData.importerTin}
              onChange={(e) => updateFormData('importerTin', e.target.value)}
              error={!!errors.importerTin}
              helperText={errors.importerTin}
              placeholder="0123456789"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Importer Address - የማስመጫ አድራሻ"
              value={formData.importerAddress}
              onChange={(e) => updateFormData('importerAddress', e.target.value)}
              multiline
              rows={2}
              placeholder="Full business address"
            />
          </Grid>

          {/* Goods Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Goods Information - የሸቀጦች መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Goods Description - የሸቀጦች መግለጫ"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={2}
              placeholder="Detailed description of imported goods"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Country of Origin - የመነሻ አገር"
              value={formData.origin}
              onChange={(e) => updateFormData('origin', e.target.value)}
              error={!!errors.origin}
              helperText={errors.origin}
              placeholder="e.g., Dubai, UAE"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="HS Code - ኤች ኤስ ኮድ"
              value={formData.hsCode}
              onChange={(e) => updateFormData('hsCode', e.target.value)}
              error={!!errors.hsCode}
              helperText={errors.hsCode}
              placeholder="e.g., 8471.30.00"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Weight (kg) - ክብደት"
              type="number"
              value={formData.weight}
              onChange={(e) => updateFormData('weight', e.target.value)}
              error={!!errors.weight}
              helperText={errors.weight}
              InputProps={{
                startAdornment: <InputAdornment position="start"><ScaleIcon /></InputAdornment>,
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Number of Packages - የፓኬጆች ቁጥር"
              type="number"
              value={formData.packages}
              onChange={(e) => updateFormData('packages', e.target.value)}
              error={!!errors.packages}
              helperText={errors.packages}
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
                    <Chip
                      size="small"
                      label={level.label}
                      sx={{ bgcolor: level.color, color: 'white', minWidth: 60 }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Valuation Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Valuation Information - የዋጋ መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Customs Value - የጉምሩክ ዋጋ"
              type="number"
              value={formData.customsValue}
              onChange={(e) => updateFormData('customsValue', e.target.value)}
              error={!!errors.customsValue}
              helperText={errors.customsValue}
              InputProps={{
                startAdornment: <InputAdornment position="start"><MoneyIcon /></InputAdornment>,
                endAdornment: <InputAdornment position="end">{formData.currency}</InputAdornment>,
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
                <MenuItem value="USD">USD - US Dollar</MenuItem>
                <MenuItem value="EUR">EUR - Euro</MenuItem>
                <MenuItem value="GBP">GBP - British Pound</MenuItem>
                <MenuItem value="CNY">CNY - Chinese Yuan</MenuItem>
                <MenuItem value="AED">AED - UAE Dirham</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Tax Estimation */}
          {formData.customsValue && (
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="subtitle2" gutterBottom>
                  Estimated Tax Calculation - የግምት ታክስ ሂሳብ
                </Typography>
                {(() => {
                  const taxes = calculateDutyAndTax(parseFloat(formData.customsValue) || 0);
                  return (
                    <Box>
                      <Typography variant="body2">
                        Duty: {Math.round(taxes.dutyAmount).toLocaleString()} ETB
                      </Typography>
                      <Typography variant="body2">
                        VAT: {Math.round(taxes.vatAmount).toLocaleString()} ETB
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        Total Estimated Taxes: {Math.round(taxes.totalTaxes).toLocaleString()} ETB
                      </Typography>
                    </Box>
                  );
                })()}
              </Alert>
            </Grid>
          )}

          {/* Transport Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Transport Information - የትራንስፖርት መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Port of Entry - የመግቢያ ወደብ</InputLabel>
              <Select
                value={formData.portOfEntry}
                onChange={(e) => updateFormData('portOfEntry', e.target.value)}
                label="Port of Entry - የመግቢያ ወደብ"
              >
                {portsOfEntry.map((port) => (
                  <MenuItem key={port} value={port}>
                    {port}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Transport Mode - የትራንስፖርት ዓይነት</InputLabel>
              <Select
                value={formData.transportMode}
                onChange={(e) => updateFormData('transportMode', e.target.value)}
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
            <TextField
              fullWidth
              label="Arrival Date - የመምጣት ቀን"
              type="date"
              value={formData.arrivalDate}
              onChange={(e) => updateFormData('arrivalDate', e.target.value)}
              error={!!errors.arrivalDate}
              helperText={errors.arrivalDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Declaration Date - የማወጃ ቀን"
              type="date"
              value={formData.declarationDate}
              onChange={(e) => updateFormData('declarationDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Carrier Name - የአጓዥ ስም"
              value={formData.carrierName}
              onChange={(e) => updateFormData('carrierName', e.target.value)}
              error={!!errors.carrierName}
              helperText={errors.carrierName}
              placeholder="e.g., Ethiopian Airlines Cargo"
            />
          </Grid>

          {/* Regime and Documentation */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Regime and Documentation - ስርዓት እና ሰነዶች
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Customs Regime - የጉምሩክ ስርዓት</InputLabel>
              <Select
                value={formData.regime}
                onChange={(e) => updateFormData('regime', e.target.value)}
                label="Customs Regime - የጉምሩክ ስርዓት"
              >
                {regimeTypes.map((regime) => (
                  <MenuItem key={regime.value} value={regime.value}>
                    {regime.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.inspectionRequired}
                  onChange={(e) => updateFormData('inspectionRequired', e.target.checked)}
                />
              }
              label="Physical Inspection Required - የአካል ቁመናና ጥናት ያስፈልጋል"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bill of Lading/AWB - የመጫኛ ደብዳቤ"
              value={formData.billOfLading}
              onChange={(e) => updateFormData('billOfLading', e.target.value)}
              placeholder="e.g., AWB123456789"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Invoice Number - የሂሳብ ቁጥር"
              value={formData.invoiceNumber}
              onChange={(e) => updateFormData('invoiceNumber', e.target.value)}
              placeholder="e.g., INV-2024-001"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Packing List - የማሸጊያ ዝርዝር"
              value={formData.packingList}
              onChange={(e) => updateFormData('packingList', e.target.value)}
              placeholder="e.g., PL-2024-001"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Certificate of Origin - የመነሻ ምስክር ወረቀት"
              value={formData.certificateOfOrigin}
              onChange={(e) => updateFormData('certificateOfOrigin', e.target.value)}
              placeholder="e.g., CO-2024-001"
            />
          </Grid>

          {/* Agent Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Agent Information - የወኪል መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={commonCustomsAgents}
              value={formData.customsAgent}
              onChange={(_, value) => updateFormData('customsAgent', value || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Customs Agent - የጉምሩክ ወኪል"
                  placeholder="Select or enter agent name"
                />
              )}
              freeSolo
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Declarant Name - የአመልካች ስም"
              value={formData.declarantName}
              onChange={(e) => updateFormData('declarantName', e.target.value)}
              error={!!errors.declarantName}
              helperText={errors.declarantName}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Declarant License - የአመልካች ፈቃድ"
              value={formData.declarantLicense}
              onChange={(e) => updateFormData('declarantLicense', e.target.value)}
              placeholder="e.g., CBL-2024-001"
            />
          </Grid>

          {/* Special Requirements */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={specialRequirementOptions}
              value={formData.specialRequirements}
              onChange={(_, value) => updateFormData('specialRequirements', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Special Requirements - ልዩ መስፈርቶች"
                  placeholder="Select applicable special requirements"
                />
              )}
            />
          </Grid>

          {/* Additional Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes - ተጨማሪ ማስታወሻዎች"
              value={formData.additionalNotes}
              onChange={(e) => updateFormData('additionalNotes', e.target.value)}
              multiline
              rows={3}
              placeholder="Any additional information or special instructions..."
            />
          </Grid>

          <Grid item xs={12}>
            <Alert severity="warning">
              <Typography variant="body2">
                Please ensure all information is accurate. Incorrect declarations may result in delays, penalties, or legal consequences.
                ሁሉም መረጃዎች ትክክል መሆናቸውን እርግጠኛ ይሁኑ። የተሳሳቱ ማውጫዎች መዘግየት፣ ቅጣት ወይም ህጋዊ መዘዞችን ሊያስከትሉ ይችላሉ።
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel - ሰርዝ
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<ReceiptIcon />}
        >
          Create Entry - ምዝገባ ፍጠር
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCustomsEntryDialog;
