import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Assignment as DocumentIcon,
  Gavel as CustomsIcon,
  AttachMoney as TaxIcon,
  Schedule as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Pending as PendingIcon,
  Flight as FlightIcon,
  LocalShipping as ShippingIcon,
  AccountBalance as BankIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

// Mock data for customs clearance
const mockCustomsEntries = [
  {
    id: 'CE001',
    declarationNumber: 'ETH-IMP-2024-001',
    importerName: 'TechCorp Ethiopia',
    importerTin: '0123456789',
    description: 'Computer Equipment and Accessories',
    origin: 'Dubai, UAE',
    portOfEntry: 'Bole International Airport',
    arrivalDate: new Date('2024-01-20'),
    declarationDate: new Date('2024-01-21'),
    status: 'customs_examination',
    priority: 'normal',
    customsValue: { amount: 250000, currency: 'USD' },
    dutyAmount: { amount: 1125000, currency: 'ETB' },
    vatAmount: { amount: 562500, currency: 'ETB' },
    totalTaxes: { amount: 1687500, currency: 'ETB' },
    customsAgent: 'Addis Customs Brokerage',
    officer: 'Tekle Haile',
    hsCode: '8471.30.00',
    weight: '1250 kg',
    packages: 25,
    regime: 'PERMANENT_IMPORT',
    inspectionRequired: true,
    documentsSubmitted: true,
    paymentStatus: 'pending',
    estimatedClearance: new Date('2024-01-25'),
    steps: [
      { step: 'Document Submission', status: 'completed', date: new Date('2024-01-21') },
      { step: 'Declaration Processing', status: 'completed', date: new Date('2024-01-22') },
      { step: 'Customs Examination', status: 'in_progress', date: null },
      { step: 'Tax Assessment', status: 'pending', date: null },
      { step: 'Payment Processing', status: 'pending', date: null },
      { step: 'Release Authorization', status: 'pending', date: null },
    ]
  },
  {
    id: 'CE002',
    declarationNumber: 'ETH-IMP-2024-002',
    importerName: 'Pharmaceutical Solutions Ltd',
    importerTin: '0987654321',
    description: 'Medical Supplies and Equipment',
    origin: 'Mumbai, India',
    portOfEntry: 'Bole International Airport',
    arrivalDate: new Date('2024-01-18'),
    declarationDate: new Date('2024-01-18'),
    status: 'released',
    priority: 'urgent',
    customsValue: { amount: 50000, currency: 'USD' },
    dutyAmount: { amount: 225000, currency: 'ETB' },
    vatAmount: { amount: 112500, currency: 'ETB' },
    totalTaxes: { amount: 337500, currency: 'ETB' },
    customsAgent: 'Global Trade Services',
    officer: 'Meron Tadesse',
    hsCode: '3004.90.00',
    weight: '350 kg',
    packages: 12,
    regime: 'PERMANENT_IMPORT',
    inspectionRequired: false,
    documentsSubmitted: true,
    paymentStatus: 'paid',
    estimatedClearance: new Date('2024-01-19'),
    steps: [
      { step: 'Document Submission', status: 'completed', date: new Date('2024-01-18') },
      { step: 'Declaration Processing', status: 'completed', date: new Date('2024-01-18') },
      { step: 'Customs Examination', status: 'completed', date: new Date('2024-01-18') },
      { step: 'Tax Assessment', status: 'completed', date: new Date('2024-01-18') },
      { step: 'Payment Processing', status: 'completed', date: new Date('2024-01-19') },
      { step: 'Release Authorization', status: 'completed', date: new Date('2024-01-19') },
    ]
  },
  {
    id: 'CE003',
    declarationNumber: 'ETH-IMP-2024-003',
    importerName: 'Agricultural Supplies Co.',
    importerTin: '1122334455',
    description: 'Agricultural Machinery Parts',
    origin: 'Guangzhou, China',
    portOfEntry: 'Dire Dawa Dry Port',
    arrivalDate: new Date('2024-01-15'),
    declarationDate: new Date('2024-01-16'),
    status: 'delayed',
    priority: 'normal',
    customsValue: { amount: 75000, currency: 'USD' },
    dutyAmount: { amount: 337500, currency: 'ETB' },
    vatAmount: { amount: 168750, currency: 'ETB' },
    totalTaxes: { amount: 506250, currency: 'ETB' },
    customsAgent: 'Dire Dawa Customs Services',
    officer: 'Ahmed Yusuf',
    hsCode: '8432.90.00',
    weight: '2500 kg',
    packages: 8,
    regime: 'PERMANENT_IMPORT',
    inspectionRequired: true,
    documentsSubmitted: false,
    paymentStatus: 'pending',
    estimatedClearance: new Date('2024-01-28'),
    steps: [
      { step: 'Document Submission', status: 'in_progress', date: null },
      { step: 'Declaration Processing', status: 'pending', date: null },
      { step: 'Customs Examination', status: 'pending', date: null },
      { step: 'Tax Assessment', status: 'pending', date: null },
      { step: 'Payment Processing', status: 'pending', date: null },
      { step: 'Release Authorization', status: 'pending', date: null },
    ]
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customs-tabpanel-${index}`}
      aria-labelledby={`customs-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'released': return 'success';
    case 'customs_examination': return 'info';
    case 'tax_assessment': return 'warning';
    case 'delayed': return 'error';
    case 'pending_documents': return 'warning';
    case 'payment_pending': return 'secondary';
    default: return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'released': return <CheckCircleIcon />;
    case 'customs_examination': return <CustomsIcon />;
    case 'delayed': return <WarningIcon />;
    default: return <PendingIcon />;
  }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: currency === 'ETB' ? 'ETB' : 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

const CustomsClearancePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [customsEntries] = useState(mockCustomsEntries);
  const [filteredEntries, setFilteredEntries] = useState(mockCustomsEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter entries based on search and status
  useEffect(() => {
    let filtered = customsEntries;

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.declarationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.importerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(entry => entry.status === statusFilter);
    }

    setFilteredEntries(filtered);
  }, [searchTerm, statusFilter, customsEntries]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewEntry = (entry: any) => {
    setSelectedEntry(entry);
    setDialogOpen(true);
  };

  // Calculate statistics
  const totalEntries = customsEntries.length;
  const releasedEntries = customsEntries.filter(e => e.status === 'released').length;
  const pendingEntries = customsEntries.filter(e => e.status !== 'released').length;
  const totalDuties = customsEntries.reduce((sum, entry) => sum + entry.dutyAmount.amount, 0);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Customs Clearance - ጉምሩክ ማጽዳት
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage import/export customs clearance processes and documentation
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Entries
                  </Typography>
                  <Typography variant="h4">
                    {totalEntries}
                  </Typography>
                </Box>
                <DocumentIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Released
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {releasedEntries}
                  </Typography>
                </Box>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    In Process
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {pendingEntries}
                  </Typography>
                </Box>
                <ClockIcon color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Duties
                  </Typography>
                  <Typography variant="h5" color="info.main">
                    {formatCurrency(totalDuties, 'ETB')}
                  </Typography>
                </Box>
                <TaxIcon color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="customs clearance tabs">
            <Tab label="Import Clearance" icon={<FlightIcon />} iconPosition="start" />
            <Tab label="Export Clearance" icon={<ShippingIcon />} iconPosition="start" />
            <Tab label="Tax Summary" icon={<TaxIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* Import Clearance Tab */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by declaration number, importer, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status Filter</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status Filter"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="customs_examination">Customs Examination</MenuItem>
                    <MenuItem value="tax_assessment">Tax Assessment</MenuItem>
                    <MenuItem value="payment_pending">Payment Pending</MenuItem>
                    <MenuItem value="released">Released</MenuItem>
                    <MenuItem value="delayed">Delayed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  fullWidth
                  onClick={() => alert('Create customs entry functionality will be implemented')}
                >
                  New Entry
                </Button>
              </Grid>
            </Grid>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Declaration Number</TableCell>
                  <TableCell>Importer</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Port of Entry</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Customs Value</TableCell>
                  <TableCell>Total Taxes</TableCell>
                  <TableCell>Estimated Clearance</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {entry.declarationNumber}
                      </Typography>
                      <Chip
                        label={entry.priority}
                        size="small"
                        color={entry.priority === 'urgent' ? 'error' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{entry.importerName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        TIN: {entry.importerTin}
                      </Typography>
                    </TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{entry.portOfEntry}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        From: {entry.origin}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(entry.status)}
                        label={entry.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(entry.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {formatCurrency(entry.customsValue.amount, entry.customsValue.currency)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(entry.totalTaxes.amount, entry.totalTaxes.currency)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Duty: {formatCurrency(entry.dutyAmount.amount, entry.dutyAmount.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(entry.estimatedClearance, 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewEntry(entry)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" color="secondary">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Export Clearance Tab */}
          <Alert severity="info" sx={{ mb: 2 }}>
            Export clearance functionality will be implemented here.
          </Alert>
          <Typography variant="body1">
            Export customs clearance tracking coming soon...
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Tax Summary Tab */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Tax Collections
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {formatCurrency(totalDuties, 'ETB')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Import duties collected this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Average Processing Time
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    2.5 days
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average customs clearance time
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Entry Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Customs Entry Details - {selectedEntry?.declarationNumber}
        </DialogTitle>
        <DialogContent>
          {selectedEntry && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Entry Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Importer"
                      secondary={`${selectedEntry.importerName} (TIN: ${selectedEntry.importerTin})`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Description"
                      secondary={selectedEntry.description}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="HS Code"
                      secondary={selectedEntry.hsCode}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Origin"
                      secondary={selectedEntry.origin}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Port of Entry"
                      secondary={selectedEntry.portOfEntry}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Customs Agent"
                      secondary={selectedEntry.customsAgent}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Customs Officer"
                      secondary={selectedEntry.officer}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Financial Summary
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Customs Value"
                      secondary={formatCurrency(selectedEntry.customsValue.amount, selectedEntry.customsValue.currency)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Import Duty"
                      secondary={formatCurrency(selectedEntry.dutyAmount.amount, selectedEntry.dutyAmount.currency)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="VAT (15%)"
                      secondary={formatCurrency(selectedEntry.vatAmount.amount, selectedEntry.vatAmount.currency)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Total Taxes"
                      secondary={
                        <Typography variant="body1" fontWeight="bold">
                          {formatCurrency(selectedEntry.totalTaxes.amount, selectedEntry.totalTaxes.currency)}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Payment Status"
                      secondary={
                        <Chip
                          label={selectedEntry.paymentStatus.toUpperCase()}
                          color={selectedEntry.paymentStatus === 'paid' ? 'success' : 'warning'}
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Clearance Progress
                </Typography>
                <Stepper activeStep={selectedEntry.steps.findIndex((s: any) => s.status === 'in_progress')} alternativeLabel>
                  {selectedEntry.steps.map((step: any, index: number) => (
                    <Step key={index}>
                      <StepLabel
                        StepIconProps={{
                          style: {
                            color: step.status === 'completed' ? '#4caf50' :
                                   step.status === 'in_progress' ? '#2196f3' : '#9e9e9e'
                          }
                        }}
                      >
                        {step.step}
                        {step.date && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            {format(step.date, 'MMM dd, yyyy')}
                          </Typography>
                        )}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<BankIcon />}>
            Process Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomsClearancePage;
