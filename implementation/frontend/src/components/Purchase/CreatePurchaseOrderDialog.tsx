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
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { EthiopianSupplier, OrderType, PriorityLevel, EthiopianRegion } from '../../types/purchase';

interface CreatePurchaseOrderDialogProps {
  open: boolean;
  onClose: () => void;
  suppliers: EthiopianSupplier[];
}

interface PurchaseOrderItem {
  id: number;
  itemName: string;
  sku: string;
  description: string;
  category: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
}

const ethiopianProducts = [
  { name: 'Ethiopian Coffee Beans - Yirgacheffe', sku: 'ETH-COF-001', category: 'Agriculture', unit: 'kg' },
  { name: 'Teff Flour', sku: 'ETH-GRN-002', category: 'Grains', unit: 'kg' },
  { name: 'Berbere Spice Mix', sku: 'ETH-SPC-003', category: 'Spices', unit: 'kg' },
  { name: 'Sesame Seeds', sku: 'ETH-SED-004', category: 'Seeds', unit: 'kg' },
  { name: 'Red Kidney Beans', sku: 'ETH-LEG-005', category: 'Legumes', unit: 'kg' },
  { name: 'Construction Steel Bars', sku: 'ETH-STL-006', category: 'Construction', unit: 'tons' },
  { name: 'Medical Supplies Kit', sku: 'ETH-MED-007', category: 'Healthcare', unit: 'boxes' },
  { name: 'Solar Panel 300W', sku: 'ETH-SOL-008', category: 'Energy', unit: 'pieces' },
  { name: 'School Textbooks (Grade 1-8)', sku: 'ETH-EDU-009', category: 'Education', unit: 'sets' },
  { name: 'Water Purification Tablets', sku: 'ETH-WAT-010', category: 'Health', unit: 'tablets' },
];

export const CreatePurchaseOrderDialog: React.FC<CreatePurchaseOrderDialogProps> = ({
  open,
  onClose,
  suppliers,
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState<EthiopianSupplier | null>(null);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.STANDARD);
  const [priority, setPriority] = useState<PriorityLevel>(PriorityLevel.MEDIUM);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'ETB'>('ETB');
  const [deliveryRegion, setDeliveryRegion] = useState<EthiopianRegion>('Addis Ababa');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);

  const addNewItem = () => {
    const newItem: PurchaseOrderItem = {
      id: Date.now(),
      itemName: '',
      sku: '',
      description: '',
      category: '',
      unit: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      lineTotal: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: keyof PurchaseOrderItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate line total
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
          const subtotal = updatedItem.quantity * updatedItem.unitPrice;
          updatedItem.lineTotal = subtotal - (subtotal * updatedItem.discount / 100);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const selectProduct = (itemId: number, product: any) => {
    updateItem(itemId, 'itemName', product.name);
    updateItem(itemId, 'sku', product.sku);
    updateItem(itemId, 'category', product.category);
    updateItem(itemId, 'unit', product.unit);
  };

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const taxRate = 0.15; // 15% VAT in Ethiopia
    const taxAmount = subtotal * taxRate;
    return {
      subtotal,
      taxAmount,
      total: subtotal + taxAmount,
    };
  };

  const handleSubmit = () => {
    if (!selectedSupplier || items.length === 0) {
      alert('Please select a supplier and add at least one item.');
      return;
    }

    const totals = calculateTotal();
    const orderNumber = `PO-${Date.now()}`;
    
    // Here you would typically send the data to your backend
    console.log('Creating Purchase Order:', {
      orderNumber,
      supplier: selectedSupplier,
      orderType,
      priority,
      currency,
      expectedDeliveryDate,
      deliveryRegion,
      items,
      totals,
      notes,
    });

    alert(`Purchase Order ${orderNumber} created successfully!`);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedSupplier(null);
    setOrderType(OrderType.STANDARD);
    setPriority(PriorityLevel.MEDIUM);
    setExpectedDeliveryDate('');
    setCurrency('ETB');
    setDeliveryRegion('Addis Ababa');
    setNotes('');
    setItems([]);
  };

  const totals = calculateTotal();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', mb: 2 }}>
        <Typography variant="h5">🇪🇹 Create New Purchase Order</Typography>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* Supplier Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Supplier Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Autocomplete
              value={selectedSupplier}
              onChange={(_, newValue) => setSelectedSupplier(newValue)}
              options={suppliers}
              getOptionLabel={(option) => `${option.name} (${option.code})`}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {option.address.city}, {option.address.region} • {option.currency}
                    </Typography>
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Supplier"
                  placeholder="Search suppliers..."
                  required
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth required>
              <InputLabel>Order Type</InputLabel>
              <Select
                value={orderType}
                label="Order Type"
                onChange={(e) => setOrderType(e.target.value as OrderType)}
              >
                <MenuItem value={OrderType.STANDARD}>Standard</MenuItem>
                <MenuItem value={OrderType.IMPORT}>Import</MenuItem>
                <MenuItem value={OrderType.LOCAL}>Local</MenuItem>
                <MenuItem value={OrderType.EMERGENCY}>Emergency</MenuItem>
                <MenuItem value={OrderType.CONTRACT}>Contract</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth required>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              >
                <MenuItem value={PriorityLevel.LOW}>Low</MenuItem>
                <MenuItem value={PriorityLevel.MEDIUM}>Medium</MenuItem>
                <MenuItem value={PriorityLevel.HIGH}>High</MenuItem>
                <MenuItem value={PriorityLevel.URGENT}>Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Delivery Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
              Delivery Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Expected Delivery Date"
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Delivery Region</InputLabel>
              <Select
                value={deliveryRegion}
                label="Delivery Region"
                onChange={(e) => setDeliveryRegion(e.target.value as EthiopianRegion)}
              >
                <MenuItem value="Addis Ababa">Addis Ababa</MenuItem>
                <MenuItem value="Oromia">Oromia</MenuItem>
                <MenuItem value="Amhara">Amhara</MenuItem>
                <MenuItem value="Tigray">Tigray</MenuItem>
                <MenuItem value="Sidama">Sidama</MenuItem>
                <MenuItem value="SNNP">SNNP</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={currency}
                label="Currency"
                onChange={(e) => setCurrency(e.target.value as 'USD' | 'ETB')}
              >
                <MenuItem value="ETB">Ethiopian Birr (ETB)</MenuItem>
                <MenuItem value="USD">US Dollar (USD)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Items Section */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
              <Typography variant="h6" color="primary">
                Order Items
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addNewItem}
                size="small"
              >
                Add Item
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Unit Price ({currency})</TableCell>
                    <TableCell>Discount (%)</TableCell>
                    <TableCell>Line Total</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Autocomplete
                          options={ethiopianProducts}
                          getOptionLabel={(option) => option.name}
                          onChange={(_, value) => value && selectProduct(item.id, value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Select product..."
                              sx={{ minWidth: 200 }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {item.sku}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          sx={{ width: 80 }}
                          inputProps={{ min: 0, step: 0.1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.unit}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          sx={{ width: 100 }}
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={item.discount}
                          onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                          sx={{ width: 80 }}
                          inputProps={{ min: 0, max: 100, step: 0.1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {item.lineTotal.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="textSecondary">
                          No items added yet. Click "Add Item" to get started.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Order Totals */}
          {items.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Box sx={{ minWidth: 300 }}>
                  <Typography variant="body1">
                    Subtotal: <strong>{totals.subtotal.toFixed(2)} {currency}</strong>
                  </Typography>
                  <Typography variant="body1">
                    VAT (15%): <strong>{totals.taxAmount.toFixed(2)} {currency}</strong>
                  </Typography>
                  <Typography variant="h6" color="primary">
                    Total: <strong>{totals.total.toFixed(2)} {currency}</strong>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Order Notes"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions or notes..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
        <Button
          onClick={onClose}
          startIcon={<CancelIcon />}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={!selectedSupplier || items.length === 0}
        >
          Create Purchase Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};
