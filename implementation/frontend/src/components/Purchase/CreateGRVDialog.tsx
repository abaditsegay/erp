import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Box,
  Autocomplete,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  Alert,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  LocalShipping as ShippingIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

interface CreateGRVDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Mock data for Ethiopian business context
const mockPurchaseOrders = [
  {
    id: 1,
    poNumber: 'PO-2024-020',
    supplier: { name: 'Addis Coffee Exporters Ltd', code: 'ACE001', phone: '+251-11-123-4567' },
    expectedDeliveryDate: '2024-08-22',
    currency: 'ETB' as const,
    totalAmount: 875000,
    status: 'APPROVED',
    items: [
      { id: 1, itemName: 'Premium Ethiopian Coffee Beans', quantity: 1000, unit: 'kg', unitPrice: 450, receivedQty: 0 },
      { id: 2, itemName: 'Coffee Processing Equipment', quantity: 2, unit: 'units', unitPrice: 212500, receivedQty: 0 }
    ]
  },
  {
    id: 2,
    poNumber: 'PO-2024-021',
    supplier: { name: 'Dubai International Trading', code: 'DIT002', phone: '+971-4-123-4567' },
    expectedDeliveryDate: '2024-08-25',
    currency: 'USD' as const,
    totalAmount: 45000,
    status: 'APPROVED',
    items: [
      { id: 3, itemName: 'Medical Equipment (MRI Scanner)', quantity: 1, unit: 'unit', unitPrice: 35000, receivedQty: 0 },
      { id: 4, itemName: 'Medical Supplies Kit', quantity: 50, unit: 'boxes', unitPrice: 200, receivedQty: 0 }
    ]
  },
  {
    id: 3,
    poNumber: 'PO-2024-022',
    supplier: { name: 'Ethiopian Grain Trading', code: 'EGT003', phone: '+251-11-234-5678' },
    expectedDeliveryDate: '2024-08-23',
    currency: 'ETB' as const,
    totalAmount: 234500,
    status: 'APPROVED',
    items: [
      { id: 5, itemName: 'Teff Grain (Premium)', quantity: 5000, unit: 'kg', unitPrice: 35, receivedQty: 0 },
      { id: 6, itemName: 'Wheat Flour', quantity: 2000, unit: 'kg', unitPrice: 42, receivedQty: 0 }
    ]
  }
];

const mockWarehouses = [
  { id: 1, name: 'Addis Ababa Main Warehouse', region: 'Addis Ababa', address: 'Bole Sub-city, Addis Ababa' },
  { id: 2, name: 'Bole International Airport Customs', region: 'Addis Ababa', address: 'Bole International Airport' },
  { id: 3, name: 'Dire Dawa Distribution Center', region: 'Dire Dawa', address: 'Industrial Zone, Dire Dawa' },
  { id: 4, name: 'Mekelle Branch Warehouse', region: 'Tigray', address: 'Industrial Park, Mekelle' },
  { id: 5, name: 'Hawassa Regional Warehouse', region: 'SNNPR', address: 'Hawassa Industrial Park' }
];

const CreateGRVDialog: React.FC<CreateGRVDialogProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState(1);
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [grvData, setGrvData] = useState({
    deliveryNote: '',
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    driverLicense: '',
    receivedDate: new Date().toISOString().split('T')[0],
    receivedTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
    customsRequired: false,
    customsDeclarationNumber: '',
    inspectionRequired: true,
    inspectionNotes: '',
    specialHandlingRequired: false,
    specialHandlingNotes: '',
    transportationType: 'TRUCK',
    emergencyContact: '',
    insurancePolicy: ''
  });
  const [receivedItems, setReceivedItems] = useState<any[]>([]);

  const handlePOSelection = (po: any) => {
    setSelectedPO(po);
    setReceivedItems(po.items.map((item: any) => ({
      ...item,
      receivedQty: 0,
      damageQty: 0,
      notes: '',
      condition: 'GOOD',
      batchNumber: '',
      expiryDate: '',
      serialNumbers: []
    })));
    setStep(2);
  };

  const handleItemQuantityChange = (itemId: number, field: string, value: any) => {
    setReceivedItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCreate = () => {
    // Validation
    if (!selectedPO || !selectedWarehouse) {
      alert('Please select both Purchase Order and Warehouse');
      return;
    }

    if (receivedItems.some(item => item.receivedQty > item.quantity)) {
      alert('Received quantity cannot exceed ordered quantity');
      return;
    }

    if (!grvData.deliveryNote || !grvData.vehicleNumber || !grvData.driverName) {
      alert('Please fill in all required delivery information');
      return;
    }

    // Create GRV logic would go here
    console.log('Creating GRV:', {
      purchaseOrder: selectedPO,
      warehouse: selectedWarehouse,
      grvData,
      items: receivedItems
    });

    onSuccess();
  };

  const formatCurrency = (amount: number, currency: 'USD' | 'ETB') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'ETB' ? 'USD' : currency,
      minimumFractionDigits: 2
    }).format(amount) + (currency === 'ETB' ? ' ETB' : '');
  };

  const renderStep1 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Purchase Order
      </Typography>
      <TextField
        fullWidth
        label="Search Purchase Orders"
        placeholder="Search by PO number, supplier name..."
        InputProps={{
          startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
        }}
        sx={{ mb: 3 }}
      />
      
      <Grid container spacing={2}>
        {mockPurchaseOrders.map((po) => (
          <Grid item xs={12} key={po.id}>
            <Card 
              variant="outlined" 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { boxShadow: 2 },
                border: selectedPO?.id === po.id ? 2 : 1,
                borderColor: selectedPO?.id === po.id ? 'primary.main' : 'grey.300'
              }}
              onClick={() => handlePOSelection(po)}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" color="primary">
                      {po.poNumber}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <BusinessIcon sx={{ mr: 1, fontSize: 16 }} color="action" />
                      <Typography variant="body2">
                        {po.supplier.name} ({po.supplier.code})
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Phone: {po.supplier.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Expected Delivery
                    </Typography>
                    <Typography variant="body1">
                      {new Date(po.expectedDeliveryDate).toLocaleDateString()}
                    </Typography>
                    <Chip 
                      label={po.status} 
                      color="success" 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Total Amount
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(po.totalAmount, po.currency)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {po.items.length} items
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderStep2 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Delivery Information
      </Typography>
      
      <Grid container spacing={3}>
        {/* Selected PO Summary */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Selected Purchase Order: {selectedPO?.poNumber}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Supplier: {selectedPO?.supplier.name} • 
                Amount: {formatCurrency(selectedPO?.totalAmount, selectedPO?.currency)} • 
                Items: {selectedPO?.items.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Warehouse Selection */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={mockWarehouses}
            getOptionLabel={(option) => `${option.name} (${option.region})`}
            value={selectedWarehouse}
            onChange={(event, newValue) => setSelectedWarehouse(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Receiving Warehouse *"
                required
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body1">{option.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {option.region} - {option.address}
                  </Typography>
                </Box>
              </Box>
            )}
          />
        </Grid>

        {/* Delivery Note */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Delivery Note Number *"
            required
            value={grvData.deliveryNote}
            onChange={(e) => setGrvData(prev => ({ ...prev, deliveryNote: e.target.value }))}
            placeholder="DN-2024-XXX"
          />
        </Grid>

        {/* Vehicle Information */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Vehicle Number *"
            required
            value={grvData.vehicleNumber}
            onChange={(e) => setGrvData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
            placeholder="AA-123-456"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <FormLabel component="legend">Transportation Type</FormLabel>
            <RadioGroup
              row
              value={grvData.transportationType}
              onChange={(e) => setGrvData(prev => ({ ...prev, transportationType: e.target.value }))}
            >
              <FormControlLabel value="TRUCK" control={<Radio />} label="Truck" />
              <FormControlLabel value="CARGO_PLANE" control={<Radio />} label="Cargo Plane" />
              <FormControlLabel value="SHIP" control={<Radio />} label="Ship" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Insurance Policy"
            value={grvData.insurancePolicy}
            onChange={(e) => setGrvData(prev => ({ ...prev, insurancePolicy: e.target.value }))}
            placeholder="INS-2024-XXX"
          />
        </Grid>

        {/* Driver Information */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Driver Name *"
            required
            value={grvData.driverName}
            onChange={(e) => setGrvData(prev => ({ ...prev, driverName: e.target.value }))}
            placeholder="Kebede Alemu"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Driver Phone *"
            required
            value={grvData.driverPhone}
            onChange={(e) => setGrvData(prev => ({ ...prev, driverPhone: e.target.value }))}
            placeholder="+251-911-123456"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Driver License"
            value={grvData.driverLicense}
            onChange={(e) => setGrvData(prev => ({ ...prev, driverLicense: e.target.value }))}
            placeholder="DL-2024-XXX"
          />
        </Grid>

        {/* Received Date and Time */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Received Date"
            type="date"
            value={grvData.receivedDate}
            onChange={(e) => setGrvData(prev => ({ ...prev, receivedDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Received Time"
            type="time"
            value={grvData.receivedTime}
            onChange={(e) => setGrvData(prev => ({ ...prev, receivedTime: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Emergency Contact */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Emergency Contact"
            value={grvData.emergencyContact}
            onChange={(e) => setGrvData(prev => ({ ...prev, emergencyContact: e.target.value }))}
            placeholder="+251-911-XXX-XXX"
          />
        </Grid>

        {/* Special Requirements */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Special Requirements
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={grvData.customsRequired}
                onChange={(e) => setGrvData(prev => ({ ...prev, customsRequired: e.target.checked }))}
              />
            }
            label="Customs Clearance Required"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={grvData.inspectionRequired}
                onChange={(e) => setGrvData(prev => ({ ...prev, inspectionRequired: e.target.checked }))}
              />
            }
            label="Quality Inspection Required"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={grvData.specialHandlingRequired}
                onChange={(e) => setGrvData(prev => ({ ...prev, specialHandlingRequired: e.target.checked }))}
              />
            }
            label="Special Handling Required"
          />
        </Grid>

        {grvData.customsRequired && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Customs Declaration Number"
              value={grvData.customsDeclarationNumber}
              onChange={(e) => setGrvData(prev => ({ ...prev, customsDeclarationNumber: e.target.value }))}
              placeholder="CD-2024-XXX"
            />
          </Grid>
        )}

        {grvData.specialHandlingRequired && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Special Handling Notes"
              multiline
              rows={2}
              value={grvData.specialHandlingNotes}
              onChange={(e) => setGrvData(prev => ({ ...prev, specialHandlingNotes: e.target.value }))}
              placeholder="Fragile items, temperature sensitive, etc."
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Inspection Notes"
            multiline
            rows={3}
            value={grvData.inspectionNotes}
            onChange={(e) => setGrvData(prev => ({ ...prev, inspectionNotes: e.target.value }))}
            placeholder="General notes about the delivery condition, packaging, etc."
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderStep3 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Item Receipt Details
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Please verify the quantities received for each item. You can record partial receipts, damaged goods, and additional details.
      </Alert>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Ordered Qty</TableCell>
              <TableCell>Received Qty</TableCell>
              <TableCell>Damaged Qty</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Batch/Serial</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receivedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {item.itemName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Unit: {item.unit}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {item.quantity.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    value={item.receivedQty}
                    onChange={(e) => handleItemQuantityChange(item.id, 'receivedQty', parseInt(e.target.value) || 0)}
                    inputProps={{ min: 0, max: item.quantity }}
                    sx={{ width: 100 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    value={item.damageQty}
                    onChange={(e) => handleItemQuantityChange(item.id, 'damageQty', parseInt(e.target.value) || 0)}
                    inputProps={{ min: 0, max: item.receivedQty }}
                    sx={{ width: 100 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatCurrency(item.unitPrice, selectedPO?.currency)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={item.condition}
                      onChange={(e) => handleItemQuantityChange(item.id, 'condition', e.target.value)}
                    >
                      <MenuItem value="GOOD">Good</MenuItem>
                      <MenuItem value="DAMAGED">Damaged</MenuItem>
                      <MenuItem value="EXPIRED">Expired</MenuItem>
                      <MenuItem value="DEFECTIVE">Defective</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Batch/Serial"
                    value={item.batchNumber}
                    onChange={(e) => handleItemQuantityChange(item.id, 'batchNumber', e.target.value)}
                    sx={{ width: 120 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Notes"
                    value={item.notes}
                    onChange={(e) => handleItemQuantityChange(item.id, 'notes', e.target.value)}
                    sx={{ width: 150 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={3}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Receipt Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Total Items
                </Typography>
                <Typography variant="h6">
                  {receivedItems.length}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Total Received
                </Typography>
                <Typography variant="h6">
                  {receivedItems.reduce((sum, item) => sum + item.receivedQty, 0)}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Total Damaged
                </Typography>
                <Typography variant="h6" color="error">
                  {receivedItems.reduce((sum, item) => sum + item.damageQty, 0)}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Completion Rate
                </Typography>
                <Typography variant="h6" color="success.main">
                  {((receivedItems.reduce((sum, item) => sum + item.receivedQty, 0) / 
                     receivedItems.reduce((sum, item) => sum + item.quantity, 0)) * 100).toFixed(1)}%
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <ShippingIcon sx={{ mr: 1 }} color="primary" />
          Create Goods Received Voucher - Step {step} of 3
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {step > 1 && (
          <Button onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button 
            variant="contained" 
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && !selectedPO}
          >
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={handleCreate}>
            Create GRV
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateGRVDialog;
