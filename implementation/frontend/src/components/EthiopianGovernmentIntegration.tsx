import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Business,
  Assessment,
  LocalShipping,
  AccountBalance,
  Security,
  TrendingUp,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Info,
  AttachMoney,
  ImportExport,
  DirectionsCar,
  Receipt
} from '@mui/icons-material';

// Import government services
import { 
  ercaService, 
  nbeService, 
  eicService, 
  eccService, 
  ftaService 
} from '../services/government';

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
      id={`government-tabpanel-${index}`}
      aria-labelledby={`government-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EthiopianGovernmentIntegration: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ERCA State
  const [vatNumber, setVatNumber] = useState('');
  const [vatValidationResult, setVatValidationResult] = useState<any>(null);
  const [taxDeclarationData, setTaxDeclarationData] = useState({
    declarationType: 'VAT',
    period: '2024-01',
    grossSales: 0,
    vatAmount: 0
  });

  // NBE State
  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [forexPermitData, setForexPermitData] = useState({
    businessName: '',
    amount: 0,
    currency: 'USD',
    purpose: 'IMPORT'
  });

  // EIC State
  const [investmentPermitData, setInvestmentPermitData] = useState({
    businessName: '',
    sector: 'MANUFACTURING',
    investmentAmount: 0,
    location: 'Addis Ababa'
  });
  const [investmentOpportunities, setInvestmentOpportunities] = useState<any[]>([]);

  // ECC State
  const [importDeclarationData, setImportDeclarationData] = useState({
    declarantName: '',
    importerName: '',
    goodsDescription: '',
    value: 0,
    currency: 'USD',
    hsCode: ''
  });
  const [tariffInfo, setTariffInfo] = useState<any>(null);

  // FTA State
  const [vehicleRegistrationData, setVehicleRegistrationData] = useState({
    ownerName: '',
    chassisNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vehicleType: 'PRIVATE'
  });
  const [transportRoutes, setTransportRoutes] = useState<any[]>([]);

  const [detailsDialog, setDetailsDialog] = useState<{
    open: boolean;
    title: string;
    content: any;
  }>({
    open: false,
    title: '',
    content: null
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load exchange rates and transport routes
      const [rates, routes] = await Promise.all([
        nbeService.getExchangeRate('USD'),
        ftaService.getTransportRoutes()
      ]);

      setExchangeRates([rates]);
      setTransportRoutes(routes);
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
    setSuccess(null);
  };

  // ERCA Functions
  const validateVAT = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await ercaService.validateVATNumber({
        vatNumber,
        businessName: 'Demo Business',
        businessType: 'MANUFACTURING'
      });
      
      setVatValidationResult(result);
      setSuccess('VAT validation completed successfully');
    } catch (error) {
      setError('Failed to validate VAT number');
    } finally {
      setLoading(false);
    }
  };

  const submitTaxDeclaration = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await ercaService.submitTaxDeclaration({
        vatNumber: vatNumber || 'ET1234567890',
        declarationPeriod: taxDeclarationData.period,
        grossSales: taxDeclarationData.grossSales,
        exemptSales: 0,
        taxableSupplies: taxDeclarationData.grossSales,
        inputVAT: taxDeclarationData.vatAmount * 0.8,
        outputVAT: taxDeclarationData.vatAmount,
        netVATPayable: taxDeclarationData.vatAmount * 0.2,
        transactionDetails: []
      });
      
      setSuccess(`Tax declaration submitted successfully. Status: ${result.status}`);
      setDetailsDialog({
        open: true,
        title: 'Tax Declaration Result',
        content: result
      });
    } catch (error) {
      setError('Failed to submit tax declaration');
    } finally {
      setLoading(false);
    }
  };

  // NBE Functions
  const submitForexPermit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await nbeService.applyForForexPermit({
        applicantDetails: {
          businessName: 'Demo Business',
          vatNumber: vatNumber || 'ET1234567890',
          businessLicense: 'BL001234',
          contactPerson: 'Demo Contact',
          phoneNumber: '+251-911-123456',
          email: 'demo@business.et'
        },
        transactionDetails: {
          amount: forexPermitData.amount,
          currency: forexPermitData.currency,
          purpose: forexPermitData.purpose as 'IMPORT' | 'EXPORT' | 'SERVICE' | 'REMITTANCE' | 'INVESTMENT',
          description: 'Business transaction',
          beneficiaryDetails: {
            name: 'Beneficiary Name',
            bankName: 'International Bank',
            accountNumber: '1234567890',
            swiftCode: 'INTLUS33',
            country: forexPermitData.purpose === 'IMPORT' ? 'USA' : 'Ethiopia'
          }
        },
        supportingDocuments: []
      });
      
      setSuccess(`Forex permit application submitted. Reference: ${result.permitNumber}`);
      setDetailsDialog({
        open: true,
        title: 'Forex Permit Result',
        content: result
      });
    } catch (error) {
      setError('Failed to submit forex permit application');
    } finally {
      setLoading(false);
    }
  };

  // EIC Functions
  const submitInvestmentPermit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await eicService.applyForInvestmentPermit({
        applicantDetails: {
          investorName: 'Demo Investor',
          investorType: 'DOMESTIC',
          nationality: 'Ethiopian',
          contactDetails: {
            address: 'Addis Ababa, Ethiopia',
            phone: '+251-911-123456',
            email: 'investor@business.et',
            region: 'Addis Ababa',
            city: 'Addis Ababa'
          }
        },
        projectDetails: {
          projectName: investmentPermitData.businessName + ' Project',
          projectType: investmentPermitData.sector,
          sector: investmentPermitData.sector,
          subSector: investmentPermitData.sector,
          location: {
            region: 'Addis Ababa',
            zone: 'Zone 1',
            woreda: 'Woreda 1',
            kebele: 'Kebele 1'
          },
          investmentCapital: {
            totalCapital: investmentPermitData.investmentAmount,
            foreignCurrency: 0,
            domesticCapital: investmentPermitData.investmentAmount,
            currency: 'ETB'
          },
          employmentPlan: {
            directEmployment: Math.floor(investmentPermitData.investmentAmount / 50000),
            indirectEmployment: Math.floor(investmentPermitData.investmentAmount / 100000),
            skillLevels: {
              management: 2,
              professional: 5,
              skilled: 10,
              unskilled: 15
            }
          },
          implementationSchedule: {
            startDate: new Date().toISOString().split('T')[0],
            completionDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            phases: []
          }
        },
        requestedIncentives: ['TAX_EXEMPTION'],
        environmentalImpact: {
          hasEnvironmentalImpact: false,
          eiaRequired: false
        }
      });      setSuccess(`Investment permit application submitted. Application number: ${result.applicationNumber}`);
      setDetailsDialog({
        open: true,
        title: 'Investment Permit Result',
        content: result
      });
    } catch (error) {
      setError('Failed to submit investment permit application');
    } finally {
      setLoading(false);
    }
  };

  const searchInvestmentOpportunities = async () => {
    try {
      setLoading(true);
      const result = await eicService.searchInvestmentOpportunities({
        sector: investmentPermitData.sector,
        region: investmentPermitData.location
      });
      setInvestmentOpportunities(result);
      setSuccess(`Found ${result.length} investment opportunities`);
    } catch (error) {
      setError('Failed to search investment opportunities');
    } finally {
      setLoading(false);
    }
  };

  // ECC Functions
  const submitImportDeclaration = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await eccService.submitImportDeclaration({
        declarantDetails: {
          name: importDeclarationData.declarantName,
          vatNumber: vatNumber || 'ET1234567890',
          customsCode: 'CC123456',
          licenseNumber: 'IL123456',
          address: 'Addis Ababa, Ethiopia',
          phoneNumber: '+251-911-123456',
          email: 'declarant@business.et'
        },
        importerDetails: {
          name: importDeclarationData.importerName,
          vatNumber: vatNumber || 'ET1234567890',
          businessLicenseNumber: 'BL123456',
          address: 'Addis Ababa, Ethiopia'
        },
        supplierDetails: {
          name: 'International Supplier Ltd',
          address: 'New York, USA',
          country: 'United States'
        },
        shipmentDetails: {
          portOfEntry: 'ETADD',
          transportMode: 'AIR',
          billOfLadingNumber: 'BL123456789',
          containerNumbers: ['CONT123456'],
          packageCount: 10,
          grossWeight: 1000,
          netWeight: 900,
          manifestNumber: 'MF123456'
        },
        goodsDetails: [{
          itemNumber: 1,
          hsCode: importDeclarationData.hsCode || '0901.11',
          description: importDeclarationData.goodsDescription,
          quantity: 1000,
          unit: 'KG',
          unitValue: importDeclarationData.value / 1000,
          totalValue: importDeclarationData.value,
          countryOfOrigin: 'United States',
          tareWeight: 100,
          netWeight: 900,
          packaging: 'Bags',
          markAndNumbers: 'DEMO123'
        }],
        valuation: {
          totalValue: importDeclarationData.value,
          currency: importDeclarationData.currency,
          incoterms: 'CIF',
          freightCharges: importDeclarationData.value * 0.1,
          insuranceCharges: importDeclarationData.value * 0.02,
          exchangeRate: 54.50
        },
        attachments: []
      });
      
      setSuccess(`Import declaration submitted. Declaration number: ${result.declarationNumber}`);
      setDetailsDialog({
        open: true,
        title: 'Import Declaration Result',
        content: result
      });
    } catch (error) {
      setError('Failed to submit import declaration');
    } finally {
      setLoading(false);
    }
  };

  const getTariffInfo = async () => {
    try {
      setLoading(true);
      const result = await eccService.getTariffInfo(importDeclarationData.hsCode || '0901.11');
      setTariffInfo(result);
      setSuccess('Tariff information retrieved successfully');
    } catch (error) {
      setError('Failed to get tariff information');
    } finally {
      setLoading(false);
    }
  };

  // FTA Functions
  const registerVehicle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await ftaService.registerVehicle({
        ownerDetails: {
          name: vehicleRegistrationData.ownerName,
          nationalId: 'ID123456789',
          address: 'Addis Ababa, Ethiopia',
          phoneNumber: '+251-911-123456',
          email: 'owner@vehicle.et'
        },
        vehicleDetails: {
          chassisNumber: vehicleRegistrationData.chassisNumber,
          engineNumber: 'ENG123456',
          make: vehicleRegistrationData.make,
          model: vehicleRegistrationData.model,
          year: vehicleRegistrationData.year,
          color: 'White',
          vehicleType: vehicleRegistrationData.vehicleType as any,
          fuelType: 'GASOLINE',
          engineCapacity: 2000,
          seatingCapacity: 5
        },
        insuranceDetails: {
          insuranceCompany: 'Ethiopian Insurance Corporation',
          policyNumber: 'POL123456',
          coverageType: 'COMPREHENSIVE',
          coverageAmount: 500000,
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        attachments: []
      });
      
      setSuccess(`Vehicle registered successfully. Registration number: ${result.registrationNumber}`);
      setDetailsDialog({
        open: true,
        title: 'Vehicle Registration Result',
        content: result
      });
    } catch (error) {
      setError('Failed to register vehicle');
    } finally {
      setLoading(false);
    }
  };

  const closeDetailsDialog = () => {
    setDetailsDialog({ open: false, title: '', content: null });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        🇪🇹 Ethiopian Government Integration
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        Comprehensive integration with Ethiopian government systems for business compliance and operations.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab icon={<Receipt />} label="ERCA (Tax & Customs)" />
        <Tab icon={<AccountBalance />} label="NBE (Banking & Forex)" />
        <Tab icon={<Business />} label="EIC (Investment)" />
        <Tab icon={<ImportExport />} label="ECC (Customs)" />
        <Tab icon={<DirectionsCar />} label="FTA (Transport)" />
      </Tabs>

      {/* ERCA Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  VAT Validation
                </Typography>
                <TextField
                  fullWidth
                  label="VAT Number"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  placeholder="ET1234567890"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={validateVAT}
                  disabled={loading || !vatNumber}
                  startIcon={loading ? <CircularProgress size={20} /> : <Security />}
                >
                  Validate VAT
                </Button>
                {vatValidationResult && (
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      icon={vatValidationResult.valid ? <CheckCircle /> : <ErrorIcon />}
                      label={vatValidationResult.valid ? 'Valid' : 'Invalid'}
                      color={vatValidationResult.valid ? 'success' : 'error'}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tax Declaration
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Declaration Type</InputLabel>
                  <Select
                    value={taxDeclarationData.declarationType}
                    onChange={(e) => setTaxDeclarationData({
                      ...taxDeclarationData,
                      declarationType: e.target.value
                    })}
                  >
                    <MenuItem value="VAT">VAT Return</MenuItem>
                    <MenuItem value="INCOME_TAX">Income Tax</MenuItem>
                    <MenuItem value="WITHHOLDING_TAX">Withholding Tax</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  type="month"
                  label="Tax Period"
                  value={taxDeclarationData.period}
                  onChange={(e) => setTaxDeclarationData({
                    ...taxDeclarationData,
                    period: e.target.value
                  })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Gross Sales (ETB)"
                  value={taxDeclarationData.grossSales}
                  onChange={(e) => setTaxDeclarationData({
                    ...taxDeclarationData,
                    grossSales: Number(e.target.value)
                  })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="VAT Amount (ETB)"
                  value={taxDeclarationData.vatAmount}
                  onChange={(e) => setTaxDeclarationData({
                    ...taxDeclarationData,
                    vatAmount: Number(e.target.value)
                  })}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={submitTaxDeclaration}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Assessment />}
                >
                  Submit Declaration
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* NBE Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Exchange Rates
                </Typography>
                {exchangeRates.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Currency</TableCell>
                          <TableCell>Rate (ETB)</TableCell>
                          <TableCell>Last Updated</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {exchangeRates.map((rate, index) => (
                          <TableRow key={index}>
                            <TableCell>{rate.fromCurrency}/{rate.toCurrency}</TableCell>
                            <TableCell>{rate.rate}</TableCell>
                            <TableCell>{new Date(rate.lastUpdated).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="textSecondary">Loading exchange rates...</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Forex Permit Application
                </Typography>
                <TextField
                  fullWidth
                  label="Business Name"
                  value={forexPermitData.businessName}
                  onChange={(e) => setForexPermitData({
                    ...forexPermitData,
                    businessName: e.target.value
                  })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Amount"
                  value={forexPermitData.amount}
                  onChange={(e) => setForexPermitData({
                    ...forexPermitData,
                    amount: Number(e.target.value)
                  })}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={forexPermitData.currency}
                    onChange={(e) => setForexPermitData({
                      ...forexPermitData,
                      currency: e.target.value
                    })}
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Purpose</InputLabel>
                  <Select
                    value={forexPermitData.purpose}
                    onChange={(e) => setForexPermitData({
                      ...forexPermitData,
                      purpose: e.target.value
                    })}
                  >
                    <MenuItem value="IMPORT">Import Payment</MenuItem>
                    <MenuItem value="EXPORT">Export Proceeds</MenuItem>
                    <MenuItem value="SERVICE">Service Payment</MenuItem>
                    <MenuItem value="INVESTMENT">Investment</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={submitForexPermit}
                  disabled={loading || !forexPermitData.businessName}
                  startIcon={loading ? <CircularProgress size={20} /> : <AttachMoney />}
                >
                  Apply for Permit
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* EIC Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Investment Permit Application
                </Typography>
                <TextField
                  fullWidth
                  label="Business Name"
                  value={investmentPermitData.businessName}
                  onChange={(e) => setInvestmentPermitData({
                    ...investmentPermitData,
                    businessName: e.target.value
                  })}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Sector</InputLabel>
                  <Select
                    value={investmentPermitData.sector}
                    onChange={(e) => setInvestmentPermitData({
                      ...investmentPermitData,
                      sector: e.target.value
                    })}
                  >
                    <MenuItem value="MANUFACTURING">Manufacturing</MenuItem>
                    <MenuItem value="AGRICULTURE">Agriculture</MenuItem>
                    <MenuItem value="TECHNOLOGY">Technology</MenuItem>
                    <MenuItem value="TOURISM">Tourism</MenuItem>
                    <MenuItem value="CONSTRUCTION">Construction</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  type="number"
                  label="Investment Amount (USD)"
                  value={investmentPermitData.investmentAmount}
                  onChange={(e) => setInvestmentPermitData({
                    ...investmentPermitData,
                    investmentAmount: Number(e.target.value)
                  })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Location"
                  value={investmentPermitData.location}
                  onChange={(e) => setInvestmentPermitData({
                    ...investmentPermitData,
                    location: e.target.value
                  })}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={submitInvestmentPermit}
                    disabled={loading || !investmentPermitData.businessName}
                    startIcon={loading ? <CircularProgress size={20} /> : <Business />}
                  >
                    Apply for Permit
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={searchInvestmentOpportunities}
                    disabled={loading}
                    startIcon={<TrendingUp />}
                  >
                    Search Opportunities
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Investment Opportunities
                </Typography>
                {investmentOpportunities.length > 0 ? (
                  <List>
                    {investmentOpportunities.map((opportunity, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <TrendingUp />
                        </ListItemIcon>
                        <ListItemText
                          primary={opportunity.title}
                          secondary={`${opportunity.sector} - ${opportunity.location}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="textSecondary">
                    Click "Search Opportunities" to find investment opportunities
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* ECC Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Import Declaration
                </Typography>
                <TextField
                  fullWidth
                  label="Declarant Name"
                  value={importDeclarationData.declarantName}
                  onChange={(e) => setImportDeclarationData({
                    ...importDeclarationData,
                    declarantName: e.target.value
                  })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Importer Name"
                  value={importDeclarationData.importerName}
                  onChange={(e) => setImportDeclarationData({
                    ...importDeclarationData,
                    importerName: e.target.value
                  })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Goods Description"
                  value={importDeclarationData.goodsDescription}
                  onChange={(e) => setImportDeclarationData({
                    ...importDeclarationData,
                    goodsDescription: e.target.value
                  })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="HS Code"
                  value={importDeclarationData.hsCode}
                  onChange={(e) => setImportDeclarationData({
                    ...importDeclarationData,
                    hsCode: e.target.value
                  })}
                  placeholder="0901.11"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Value"
                  value={importDeclarationData.value}
                  onChange={(e) => setImportDeclarationData({
                    ...importDeclarationData,
                    value: Number(e.target.value)
                  })}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={submitImportDeclaration}
                    disabled={loading || !importDeclarationData.declarantName}
                    startIcon={loading ? <CircularProgress size={20} /> : <ImportExport />}
                  >
                    Submit Declaration
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={getTariffInfo}
                    disabled={loading}
                    startIcon={<Info />}
                  >
                    Get Tariff Info
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tariff Information
                </Typography>
                {tariffInfo ? (
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>HS Code</TableCell>
                          <TableCell>{tariffInfo.hsCode}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Description</TableCell>
                          <TableCell>{tariffInfo.description}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Customs Duty</TableCell>
                          <TableCell>{tariffInfo.customsDutyRate}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>VAT</TableCell>
                          <TableCell>{tariffInfo.vatRate}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Surtax</TableCell>
                          <TableCell>{tariffInfo.surtaxRate}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Service Charge</TableCell>
                          <TableCell>{tariffInfo.serviceChargeRate}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="textSecondary">
                    Enter HS Code and click "Get Tariff Info" to see duty rates
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* FTA Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Vehicle Registration
                </Typography>
                <TextField
                  fullWidth
                  label="Owner Name"
                  value={vehicleRegistrationData.ownerName}
                  onChange={(e) => setVehicleRegistrationData({
                    ...vehicleRegistrationData,
                    ownerName: e.target.value
                  })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Chassis Number"
                  value={vehicleRegistrationData.chassisNumber}
                  onChange={(e) => setVehicleRegistrationData({
                    ...vehicleRegistrationData,
                    chassisNumber: e.target.value
                  })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Make"
                  value={vehicleRegistrationData.make}
                  onChange={(e) => setVehicleRegistrationData({
                    ...vehicleRegistrationData,
                    make: e.target.value
                  })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Model"
                  value={vehicleRegistrationData.model}
                  onChange={(e) => setVehicleRegistrationData({
                    ...vehicleRegistrationData,
                    model: e.target.value
                  })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Year"
                  value={vehicleRegistrationData.year}
                  onChange={(e) => setVehicleRegistrationData({
                    ...vehicleRegistrationData,
                    year: Number(e.target.value)
                  })}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Vehicle Type</InputLabel>
                  <Select
                    value={vehicleRegistrationData.vehicleType}
                    onChange={(e) => setVehicleRegistrationData({
                      ...vehicleRegistrationData,
                      vehicleType: e.target.value
                    })}
                  >
                    <MenuItem value="PRIVATE">Private</MenuItem>
                    <MenuItem value="COMMERCIAL">Commercial</MenuItem>
                    <MenuItem value="FREIGHT">Freight</MenuItem>
                    <MenuItem value="PASSENGER">Passenger</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={registerVehicle}
                  disabled={loading || !vehicleRegistrationData.ownerName}
                  startIcon={loading ? <CircularProgress size={20} /> : <DirectionsCar />}
                >
                  Register Vehicle
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Available Transport Routes
                </Typography>
                {transportRoutes.length > 0 ? (
                  <List>
                    {transportRoutes.map((route, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <LocalShipping />
                        </ListItemIcon>
                        <ListItemText
                          primary={route.name}
                          secondary={`Distance: ${route.distance} km - Duration: ${route.estimatedDuration}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="textSecondary">Loading transport routes...</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Details Dialog */}
      <Dialog
        open={detailsDialog.open}
        onClose={closeDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{detailsDialog.title}</DialogTitle>
        <DialogContent>
          {detailsDialog.content && (
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(detailsDialog.content, null, 2)}
            </pre>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetailsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EthiopianGovernmentIntegration;
