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
  Checkbox,
  Slider,
  Autocomplete,
  FormGroup,
  Divider,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { SupplierType } from '../../types/purchase';

interface AdvancedFiltersDialogProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  currentFilters?: any;
}

const AdvancedFiltersDialog: React.FC<AdvancedFiltersDialogProps> = ({
  open,
  onClose,
  onApplyFilters,
  currentFilters = {},
}) => {
  const [filters, setFilters] = useState({
    supplierTypes: currentFilters.supplierTypes || [],
    categories: currentFilters.categories || [],
    regions: currentFilters.regions || [],
    cities: currentFilters.cities || [],
    ratingRange: currentFilters.ratingRange || [1, 5],
    isActive: currentFilters.isActive !== undefined ? currentFilters.isActive : null,
    hasEmail: currentFilters.hasEmail || false,
    hasWebsite: currentFilters.hasWebsite || false,
    hasSecondaryPhone: currentFilters.hasSecondaryPhone || false,
    paymentTerms: currentFilters.paymentTerms || [],
    currencies: currentFilters.currencies || [],
    specializations: currentFilters.specializations || [],
    dateRange: {
      createdAfter: currentFilters.dateRange?.createdAfter || '',
      createdBefore: currentFilters.dateRange?.createdBefore || '',
      modifiedAfter: currentFilters.dateRange?.modifiedAfter || '',
      modifiedBefore: currentFilters.dateRange?.modifiedBefore || '',
    },
    searchInDescription: currentFilters.searchInDescription || '',
    searchInContactPerson: currentFilters.searchInContactPerson || '',
  });

  const ethiopianRegions = [
    'Addis Ababa', 'Afar', 'Amhara', 'Benishangul-Gumuz', 'Dire Dawa',
    'Gambela', 'Harari', 'Oromia', 'Sidama', 'SNNP', 'Somali', 'Tigray'
  ];

  const ethiopianCities = [
    'Addis Ababa', 'Dire Dawa', 'Adama', 'Gondar', 'Mekelle', 'Hawassa',
    'Bahir Dar', 'Dessie', 'Jimma', 'Jijiga', 'Shashamane', 'Bishoftu',
    'Arba Minch', 'Hosaena', 'Harar', 'Dilla', 'Nekemte', 'Debre Markos'
  ];

  const categoryOptions = [
    'GENERAL', 'MANUFACTURING', 'SERVICES', 'CONSTRUCTION', 'TECHNOLOGY',
    'AGRICULTURE', 'HEALTHCARE', 'EDUCATION', 'AUTOMOTIVE', 'FOOD_BEVERAGE',
    'TEXTILES', 'CHEMICALS', 'ELECTRONICS', 'MACHINERY', 'PHARMACEUTICALS'
  ];

  const paymentTermsOptions = [
    'NET_15', 'NET_30', 'NET_45', 'NET_60', 'COD', 'PREPAID', 'CREDIT'
  ];

  const currencyOptions = [
    'ETB', 'USD', 'EUR', 'GBP', 'CNY', 'AED'
  ];

  const specializationOptions = [
    'Raw Materials', 'Finished Goods', 'Services', 'Construction Materials',
    'Technology Equipment', 'Agricultural Products', 'Medical Supplies',
    'Office Supplies', 'Automotive Parts', 'Food & Beverages',
    'Textiles & Clothing', 'Chemicals', 'Electronics', 'Machinery',
    'Pharmaceuticals', 'Consulting Services', 'Transportation',
    'Energy & Utilities', 'Environmental Services', 'Educational Materials'
  ];

  const supplierTypeOptions = [
    { value: SupplierType.LOCAL, label: 'Local - የሀገር ውስጥ' },
    { value: SupplierType.INTERNATIONAL, label: 'International - ዓለም አቀፍ' },
    { value: SupplierType.GOVERNMENT, label: 'Government - መንግስት' },
    { value: SupplierType.NGO, label: 'NGO - መንግስታዊ ያልሆነ ድርጅት' },
    { value: SupplierType.COOPERATIVE, label: 'Cooperative - ህብረት ስራ' },
  ];

  const handleSupplierTypeChange = (type: SupplierType) => {
    setFilters(prev => ({
      ...prev,
      supplierTypes: prev.supplierTypes.includes(type)
        ? prev.supplierTypes.filter((t: SupplierType) => t !== type)
        : [...prev.supplierTypes, type]
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c: string) => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handlePaymentTermChange = (term: string) => {
    setFilters(prev => ({
      ...prev,
      paymentTerms: prev.paymentTerms.includes(term)
        ? prev.paymentTerms.filter((t: string) => t !== term)
        : [...prev.paymentTerms, term]
    }));
  };

  const handleCurrencyChange = (currency: string) => {
    setFilters(prev => ({
      ...prev,
      currencies: prev.currencies.includes(currency)
        ? prev.currencies.filter((c: string) => c !== currency)
        : [...prev.currencies, currency]
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      supplierTypes: [],
      categories: [],
      regions: [],
      cities: [],
      ratingRange: [1, 5],
      isActive: null,
      hasEmail: false,
      hasWebsite: false,
      hasSecondaryPhone: false,
      paymentTerms: [],
      currencies: [],
      specializations: [],
      dateRange: {
        createdAfter: '',
        createdBefore: '',
        modifiedAfter: '',
        modifiedBefore: '',
      },
      searchInDescription: '',
      searchInContactPerson: '',
    };
    setFilters(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.supplierTypes.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.regions.length > 0) count++;
    if (filters.cities.length > 0) count++;
    if (filters.ratingRange[0] > 1 || filters.ratingRange[1] < 5) count++;
    if (filters.isActive !== null) count++;
    if (filters.hasEmail) count++;
    if (filters.hasWebsite) count++;
    if (filters.hasSecondaryPhone) count++;
    if (filters.paymentTerms.length > 0) count++;
    if (filters.currencies.length > 0) count++;
    if (filters.specializations.length > 0) count++;
    if (filters.dateRange.createdAfter || filters.dateRange.createdBefore || 
        filters.dateRange.modifiedAfter || filters.dateRange.modifiedBefore) count++;
    if (filters.searchInDescription) count++;
    if (filters.searchInContactPerson) count++;
    return count;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6">Advanced Filters - የላቀ ማጣሪያዎች</Typography>
          {getActiveFiltersCount() > 0 && (
            <Chip 
              label={`${getActiveFiltersCount()} filters active`} 
              color="primary" 
              size="small" 
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Supplier Type Filters */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Supplier Types - የአቅራቢ ዓይነቶች
            </Typography>
            <FormGroup row>
              {supplierTypeOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={filters.supplierTypes.includes(option.value)}
                      onChange={() => handleSupplierTypeChange(option.value)}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
          </Grid>

          <Divider sx={{ width: '100%' }} />

          {/* Category Filters */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Categories - ምድቦች
            </Typography>
            <FormGroup row>
              {categoryOptions.map((category) => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                  }
                  label={category.replace('_', ' ')}
                />
              ))}
            </FormGroup>
          </Grid>

          <Divider sx={{ width: '100%' }} />

          {/* Location Filters */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Location Filters - የአካባቢ ማጣሪያዎች
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={ethiopianRegions}
              value={filters.regions}
              onChange={(_, value) => setFilters(prev => ({ ...prev, regions: value }))}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Regions - ክልሎች"
                  placeholder="Select regions"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={ethiopianCities}
              value={filters.cities}
              onChange={(_, value) => setFilters(prev => ({ ...prev, cities: value }))}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cities - ከተሞች"
                  placeholder="Select cities"
                />
              )}
            />
          </Grid>

          <Divider sx={{ width: '100%' }} />

          {/* Rating Filter */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Rating Range - የደረጃ ክልል
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={filters.ratingRange}
                onChange={(_, value) => setFilters(prev => ({ ...prev, ratingRange: value as number[] }))}
                valueLabelDisplay="auto"
                min={1}
                max={5}
                step={0.5}
                marks={[
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 5, label: '5' },
                ]}
              />
              <Typography variant="body2" color="text.secondary">
                Rating between {filters.ratingRange[0]} and {filters.ratingRange[1]} stars
              </Typography>
            </Box>
          </Grid>

          <Divider sx={{ width: '100%' }} />

          {/* Status and Properties */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Status and Properties - ሁኔታ እና ባህሪያት
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status - ሁኔታ</InputLabel>
              <Select
                value={filters.isActive === null ? 'all' : filters.isActive ? 'active' : 'inactive'}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters(prev => ({
                    ...prev,
                    isActive: value === 'all' ? null : value === 'active'
                  }));
                }}
                label="Status - ሁኔታ"
              >
                <MenuItem value="all">All Suppliers</MenuItem>
                <MenuItem value="active">Active Only</MenuItem>
                <MenuItem value="inactive">Inactive Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.hasEmail}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasEmail: e.target.checked }))}
                  />
                }
                label="Has Email Address - ኢሜይል አድራሻ አለው"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.hasWebsite}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasWebsite: e.target.checked }))}
                  />
                }
                label="Has Website - ድረ ገጽ አለው"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.hasSecondaryPhone}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasSecondaryPhone: e.target.checked }))}
                  />
                }
                label="Has Secondary Phone - ሁለተኛ ስልክ አለው"
              />
            </FormGroup>
          </Grid>

          <Divider sx={{ width: '100%' }} />

          {/* Payment Terms */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Payment Terms - የክፍያ ወቅቶች
            </Typography>
            <FormGroup row>
              {paymentTermsOptions.map((term) => (
                <FormControlLabel
                  key={term}
                  control={
                    <Checkbox
                      checked={filters.paymentTerms.includes(term)}
                      onChange={() => handlePaymentTermChange(term)}
                    />
                  }
                  label={term.replace('_', ' ')}
                />
              ))}
            </FormGroup>
          </Grid>

          <Divider sx={{ width: '100%' }} />

          {/* Currencies */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Currencies - ምንዛሬዎች
            </Typography>
            <FormGroup row>
              {currencyOptions.map((currency) => (
                <FormControlLabel
                  key={currency}
                  control={
                    <Checkbox
                      checked={filters.currencies.includes(currency)}
                      onChange={() => handleCurrencyChange(currency)}
                    />
                  }
                  label={currency}
                />
              ))}
            </FormGroup>
          </Grid>

          <Divider sx={{ width: '100%' }} />

          {/* Specializations */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={specializationOptions}
              value={filters.specializations}
              onChange={(_, value) => setFilters(prev => ({ ...prev, specializations: value }))}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Specializations - ልዩ ችሎታዎች"
                  placeholder="Select specializations"
                />
              )}
            />
          </Grid>

          <Divider sx={{ width: '100%' }} />

          {/* Date Range Filters */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Date Filters - የቀን ማጣሪያዎች
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Created After - ከዚህ በኋላ የተፈጠረ"
              type="date"
              value={filters.dateRange.createdAfter}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, createdAfter: e.target.value }
              }))}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Created Before - ከዚህ በፊት የተፈጠረ"
              type="date"
              value={filters.dateRange.createdBefore}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, createdBefore: e.target.value }
              }))}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Modified After - ከዚህ በኋላ የተቀየረ"
              type="date"
              value={filters.dateRange.modifiedAfter}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, modifiedAfter: e.target.value }
              }))}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Modified Before - ከዚህ በፊት የተቀየረ"
              type="date"
              value={filters.dateRange.modifiedBefore}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, modifiedBefore: e.target.value }
              }))}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Divider sx={{ width: '100%' }} />

          {/* Text Search Filters */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Additional Search - ተጨማሪ ፍለጋ
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search in Description - በመግለጫ ውስጥ ፍለጋ"
              value={filters.searchInDescription}
              onChange={(e) => setFilters(prev => ({ ...prev, searchInDescription: e.target.value }))}
              placeholder="Search supplier descriptions..."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Contact Person - ግንኙነት ሰው ፍለጋ"
              value={filters.searchInContactPerson}
              onChange={(e) => setFilters(prev => ({ ...prev, searchInContactPerson: e.target.value }))}
              placeholder="Search contact person names..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={handleClear} 
          color="inherit"
          startIcon={<ClearIcon />}
        >
          Clear All - ሁሉም አጽዳ
        </Button>
        <Button onClick={onClose} color="inherit">
          Cancel - ሰርዝ
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          startIcon={<SearchIcon />}
        >
          Apply Filters ({getActiveFiltersCount()}) - ማጣሪያዎች ተግብር
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdvancedFiltersDialog;
