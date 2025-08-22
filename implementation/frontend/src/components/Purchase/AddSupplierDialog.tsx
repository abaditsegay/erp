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
  Business as BusinessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { SupplierType } from '../../types/purchase';

interface AddSupplierDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (supplierData: any) => void;
}

const AddSupplierDialog: React.FC<AddSupplierDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    secondaryPhone: '',
    supplierType: SupplierType.LOCAL,
    isActive: true,
    rating: 5,
    currency: 'ETB',
    paymentTerms: 'NET_30',
    category: 'GENERAL',
    address: {
      street: '',
      city: '',
      region: '',
      country: 'Ethiopia',
      poBox: '',
    },
    bankDetails: {
      bankName: '',
      accountNumber: '',
      branchName: '',
      swiftCode: '',
    },
    businessLicense: '',
    taxNumber: '',
    website: '',
    description: '',
    specializations: [] as string[],
  });

  const [errors, setErrors] = useState<any>({});

  const ethiopianRegions = [
    'Addis Ababa', 'Afar', 'Amhara', 'Benishangul-Gumuz', 'Dire Dawa',
    'Gambela', 'Harari', 'Oromia', 'Sidama', 'SNNP', 'Somali', 'Tigray'
  ];

  const ethiopianCities = [
    'Addis Ababa', 'Dire Dawa', 'Adama', 'Gondar', 'Mekelle', 'Hawassa',
    'Bahir Dar', 'Dessie', 'Jimma', 'Jijiga', 'Shashamane', 'Bishoftu',
    'Arba Minch', 'Hosaena', 'Harar', 'Dilla', 'Nekemte', 'Debre Markos'
  ];

  const paymentTermsOptions = [
    { value: 'NET_15', label: 'Net 15 Days' },
    { value: 'NET_30', label: 'Net 30 Days' },
    { value: 'NET_45', label: 'Net 45 Days' },
    { value: 'NET_60', label: 'Net 60 Days' },
    { value: 'COD', label: 'Cash on Delivery' },
    { value: 'PREPAID', label: 'Prepaid' },
    { value: 'CREDIT', label: 'Credit Terms' },
  ];

  const categoryOptions = [
    'GENERAL', 'MANUFACTURING', 'SERVICES', 'CONSTRUCTION', 'TECHNOLOGY',
    'AGRICULTURE', 'HEALTHCARE', 'EDUCATION', 'AUTOMOTIVE', 'FOOD_BEVERAGE',
    'TEXTILES', 'CHEMICALS', 'ELECTRONICS', 'MACHINERY', 'PHARMACEUTICALS'
  ];

  const specializationOptions = [
    'Raw Materials', 'Finished Goods', 'Services', 'Construction Materials',
    'Technology Equipment', 'Agricultural Products', 'Medical Supplies',
    'Office Supplies', 'Automotive Parts', 'Food & Beverages',
    'Textiles & Clothing', 'Chemicals', 'Electronics', 'Machinery',
    'Pharmaceuticals', 'Consulting Services', 'Transportation',
    'Energy & Utilities', 'Environmental Services', 'Educational Materials'
  ];

  const ethiopianBanks = [
    'Commercial Bank of Ethiopia',
    'Awash Bank',
    'Dashen Bank',
    'Bank of Abyssinia',
    'Wegagen Bank',
    'United Bank',
    'Nib International Bank',
    'Cooperative Bank of Oromia',
    'Lion International Bank',
    'Zemen Bank',
    'Bunna International Bank',
    'Berhan International Bank',
    'Abay Bank',
    'Addis International Bank',
    'Debub Global Bank',
    'Enat Bank',
    'Shabelle Bank',
    'Hijra Bank',
    'Premium Bank',
    'Tsehay Bank'
  ];

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.code.trim()) newErrors.code = 'Supplier code is required';
    if (!formData.name.trim()) newErrors.name = 'Supplier name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.street.trim()) newErrors.addressStreet = 'Street address is required';
    if (!formData.address.city.trim()) newErrors.addressCity = 'City is required';
    if (!formData.address.region.trim()) newErrors.addressRegion = 'Region is required';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation for Ethiopian format
    if (formData.phone && !/^(\+251|0)?[97]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Ethiopian phone number';
    }

    // Code validation (alphanumeric only)
    if (formData.code && !/^[A-Za-z0-9_-]+$/.test(formData.code)) {
      newErrors.code = 'Supplier code must contain only letters, numbers, hyphens, and underscores';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const supplierData = {
        ...formData,
        id: Date.now(), // In real app, this would be generated by backend
        createdDate: new Date(),
        modifiedDate: new Date(),
      };

      onSubmit(supplierData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      code: '',
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      secondaryPhone: '',
      supplierType: SupplierType.LOCAL,
      isActive: true,
      rating: 5,
      currency: 'ETB',
      paymentTerms: 'NET_30',
      category: 'GENERAL',
      address: {
        street: '',
        city: '',
        region: '',
        country: 'Ethiopia',
        poBox: '',
      },
      bankDetails: {
        bankName: '',
        accountNumber: '',
        branchName: '',
        swiftCode: '',
      },
      businessLicense: '',
      taxNumber: '',
      website: '',
      description: '',
      specializations: [],
    });
    setErrors({});
    onClose();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: undefined
      }));
    }
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BusinessIcon color="primary" />
          <Typography variant="h6">Add New Supplier - አዲስ አቅራቢ ያክሉ</Typography>
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

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Supplier Code - የአቅራቢ ኮድ"
              value={formData.code}
              onChange={(e) => updateFormData('code', e.target.value.toUpperCase())}
              error={!!errors.code}
              helperText={errors.code}
              placeholder="SUP001"
              required
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Supplier Name - የአቅራቢ ስም"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="e.g., Ethiopian Trading Company"
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Supplier Type - የአቅራቢ ዓይነት</InputLabel>
              <Select
                value={formData.supplierType}
                onChange={(e) => updateFormData('supplierType', e.target.value)}
                label="Supplier Type - የአቅራቢ ዓይነት"
              >
                <MenuItem value={SupplierType.LOCAL}>Local - የሀገር ውስጥ</MenuItem>
                <MenuItem value={SupplierType.INTERNATIONAL}>International - ዓለም አቀፍ</MenuItem>
                <MenuItem value={SupplierType.GOVERNMENT}>Government - መንግስት</MenuItem>
                <MenuItem value={SupplierType.NGO}>NGO - መንግስታዊ ያልሆነ ድርጅት</MenuItem>
                <MenuItem value={SupplierType.COOPERATIVE}>Cooperative - ህብረት ስራ</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category - ምድብ</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => updateFormData('category', e.target.value)}
                label="Category - ምድብ"
              >
                {categoryOptions.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Contact Information - የመገናኛ መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Person - ግንኙነት ሰው"
              value={formData.contactPerson}
              onChange={(e) => updateFormData('contactPerson', e.target.value)}
              error={!!errors.contactPerson}
              helperText={errors.contactPerson}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment>,
              }}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address - ኢሜይል አድራሻ"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>,
              }}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Primary Phone - ዋና ስልክ"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone || 'Format: +251912345678 or 0912345678'}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment>,
              }}
              placeholder="+251912345678"
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Secondary Phone - ሁለተኛ ስልክ"
              value={formData.secondaryPhone}
              onChange={(e) => updateFormData('secondaryPhone', e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment>,
              }}
              placeholder="+251911234567"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Website - ድረ ገጽ"
              value={formData.website}
              onChange={(e) => updateFormData('website', e.target.value)}
              placeholder="https://example.com"
            />
          </Grid>

          {/* Address Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Address Information - የአድራሻ መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address - መንገድ አድራሻ"
              value={formData.address.street}
              onChange={(e) => updateNestedData('address', 'street', e.target.value)}
              error={!!errors.addressStreet}
              helperText={errors.addressStreet}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LocationIcon /></InputAdornment>,
              }}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Autocomplete
              options={ethiopianCities}
              value={formData.address.city}
              onChange={(_, value) => updateNestedData('address', 'city', value || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City - ከተማ"
                  error={!!errors.addressCity}
                  helperText={errors.addressCity}
                  required
                />
              )}
              freeSolo
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Autocomplete
              options={ethiopianRegions}
              value={formData.address.region}
              onChange={(_, value) => updateNestedData('address', 'region', value || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Region - ክልል"
                  error={!!errors.addressRegion}
                  helperText={errors.addressRegion}
                  required
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="P.O. Box - የፖስታ ሳጥን"
              value={formData.address.poBox}
              onChange={(e) => updateNestedData('address', 'poBox', e.target.value)}
              placeholder="12345"
            />
          </Grid>

          {/* Business Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Business Information - የንግድ መረጃ
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Business License - የንግድ ፈቃድ"
              value={formData.businessLicense}
              onChange={(e) => updateFormData('businessLicense', e.target.value)}
              placeholder="BL123456789"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tax Number - የታክስ ቁጥር"
              value={formData.taxNumber}
              onChange={(e) => updateFormData('taxNumber', e.target.value)}
              placeholder="TIN123456789"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Payment Terms - የክፍያ ወቅት</InputLabel>
              <Select
                value={formData.paymentTerms}
                onChange={(e) => updateFormData('paymentTerms', e.target.value)}
                label="Payment Terms - የክፍያ ወቅት"
              >
                {paymentTermsOptions.map((term) => (
                  <MenuItem key={term.value} value={term.value}>
                    {term.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                <MenuItem value="CNY">CNY - Chinese Yuan</MenuItem>
                <MenuItem value="AED">AED - UAE Dirham</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Supplier Rating - የአቅራቢ ደረጃ
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarIcon color="primary" />
                <TextField
                  type="number"
                  value={formData.rating}
                  onChange={(e) => updateFormData('rating', Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
                  inputProps={{ min: 1, max: 5 }}
                  sx={{ width: 80 }}
                />
                <Typography variant="body2">/ 5</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Bank Details */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Bank Details - የባንክ ዝርዝር
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={ethiopianBanks}
              value={formData.bankDetails.bankName}
              onChange={(_, value) => updateNestedData('bankDetails', 'bankName', value || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Bank Name - የባንክ ስም"
                />
              )}
              freeSolo
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Account Number - የሂሳብ ቁጥር"
              value={formData.bankDetails.accountNumber}
              onChange={(e) => updateNestedData('bankDetails', 'accountNumber', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Branch Name - የቅርንጫፍ ስም"
              value={formData.bankDetails.branchName}
              onChange={(e) => updateNestedData('bankDetails', 'branchName', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="SWIFT Code - ስዊፍት ኮድ"
              value={formData.bankDetails.swiftCode}
              onChange={(e) => updateNestedData('bankDetails', 'swiftCode', e.target.value.toUpperCase())}
              placeholder="For international transfers"
            />
          </Grid>

          {/* Specializations */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={specializationOptions}
              value={formData.specializations}
              onChange={(_, value) => updateFormData('specializations', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Specializations - ልዩ ችሎታዎች"
                  placeholder="Select supplier specializations"
                />
              )}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description - መግለጫ"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              multiline
              rows={3}
              placeholder="Additional information about the supplier..."
            />
          </Grid>

          {/* Active Status */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => updateFormData('isActive', e.target.checked)}
                />
              }
              label="Active Supplier - ንቁ አቅራቢ"
            />
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info">
              Please ensure all information is accurate. Required fields are marked with an asterisk (*).
              ሁሉም መረጃዎች ትክክል መሆናቸውን እርግጠኛ ይሁኑ። የሚያስፈልጉ ቦታዎች በኮከብ (*) ምልክት ተደርጎባቸዋል።
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
          startIcon={<BusinessIcon />}
        >
          Add Supplier - አቅራቢ ያክሉ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSupplierDialog;
