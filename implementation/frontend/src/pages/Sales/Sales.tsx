import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Alert,
  Fade,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  ShoppingCart as OrderIcon,
  RequestQuote as QuoteIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  CheckCircle as ApproveIcon,
  Transform as ConvertIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Ethiopian business context
const ethiopianRegions = [
  'Addis Ababa',
  'Oromia',
  'Amhara',
  'Tigray',
  'Somali',
  'Afar',
  'SNNPR',
  'Benishangul-Gumuz',
  'Gambela',
  'Harari',
  'Dire Dawa'
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
      id={`sales-tabpanel-${index}`}
      aria-labelledby={`sales-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface SalesOrder {
  id: number;
  orderNumber: string;
  customer: string;
  orderDate: string;
  deliveryDate: string;
  status: 'Draft' | 'Approved' | 'In Production' | 'Delivered' | 'Invoiced';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  totalAmount: number;
  region: string;
  items: number;
  salesRep: string;
}

interface Quotation {
  id: number;
  quotationNumber: string;
  customer: string;
  quotationDate: string;
  validUntil: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired' | 'Converted';
  totalAmount: number;
  items: number;
  preparedBy: string;
}

interface Customer {
  id: number;
  code: string;
  name: string;
  region: string;
  phone: string;
  email: string;
  type: 'Individual' | 'Business' | 'Government';
}

// Mock data for demonstration
const mockOrders: SalesOrder[] = [
  {
    id: 1,
    orderNumber: 'SO-2024-000001',
    customer: 'የኢትዮጵያ ንግድ ማህበር (Ethiopian Trade Association)',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-25',
    status: 'Approved',
    priority: 'High',
    totalAmount: 125000,
    region: 'Addis Ababa',
    items: 5,
    salesRep: 'አበበ ተክለ (Abebe Tekle)'
  },
  {
    id: 2,
    orderNumber: 'SO-2024-000002',
    customer: 'Oromia Coffee Cooperative',
    orderDate: '2024-01-16',
    deliveryDate: '2024-02-01',
    status: 'In Production',
    priority: 'Normal',
    totalAmount: 87500,
    region: 'Oromia',
    items: 3,
    salesRep: 'ሐና ምርጫ (Hana Mircha)'
  },
  {
    id: 3,
    orderNumber: 'SO-2024-000003',
    customer: 'ሲዳማ ካፌ ኤክስፖርት (Sidama Coffee Export)',
    orderDate: '2024-01-18',
    deliveryDate: '2024-02-05',
    status: 'Draft',
    priority: 'High',
    totalAmount: 245000,
    region: 'SNNPR',
    items: 8,
    salesRep: 'መስፍን ገብረማርያም (Mesfin Gebremariam)'
  },
  {
    id: 4,
    orderNumber: 'SO-2024-000004',
    customer: 'አማራ ግብርና ማህበር (Amhara Agriculture Association)',
    orderDate: '2024-01-20',
    deliveryDate: '2024-02-10',
    status: 'Delivered',
    priority: 'Normal',
    totalAmount: 165000,
    region: 'Amhara',
    items: 6,
    salesRep: 'ቀሳነት አህመድ (Qesanet Ahmed)'
  },
  {
    id: 5,
    orderNumber: 'SO-2024-000005',
    customer: 'ትግራይ ኢንዱስትሪ ዞን (Tigray Industrial Zone)',
    orderDate: '2024-01-22',
    deliveryDate: '2024-02-15',
    status: 'Invoiced',
    priority: 'Urgent',
    totalAmount: 320000,
    region: 'Tigray',
    items: 12,
    salesRep: 'ሳሙኤል ሃይሌ (Samuel Haile)'
  }
];

const mockQuotations: Quotation[] = [
  {
    id: 1,
    quotationNumber: 'QT-2024-000001',
    customer: 'ሚኒስትሪ ኦፍ ኤግሪክልቸር (Ministry of Agriculture)',
    quotationDate: '2024-01-18',
    validUntil: '2024-02-18',
    status: 'Sent',
    totalAmount: 245000,
    items: 8,
    preparedBy: 'ደስታ አሳምነው (Desta Asamnew)'
  },
  {
    id: 2,
    quotationNumber: 'QT-2024-000002',
    customer: 'Hawassa Industrial Park',
    quotationDate: '2024-01-19',
    validUntil: '2024-02-19',
    status: 'Draft',
    totalAmount: 156000,
    items: 4,
    preparedBy: 'መስከረም ታደሰ (Meskerem Tadesse)'
  },
  {
    id: 3,
    quotationNumber: 'QT-2024-000003',
    customer: 'የደቡብ ክልል ካፌ ውህደት (Southern Region Coffee Union)',
    quotationDate: '2024-01-21',
    validUntil: '2024-02-21',
    status: 'Accepted',
    totalAmount: 380000,
    items: 15,
    preparedBy: 'ፍሬሐይወት ገሥ (Frehiwot Gesse)'
  },
  {
    id: 4,
    quotationNumber: 'QT-2024-000004',
    customer: 'ድሬዳዋ ድስትሪብዩሽን ሴንተር (Dire Dawa Distribution Center)',
    quotationDate: '2024-01-23',
    validUntil: '2024-02-23',
    status: 'Rejected',
    totalAmount: 95000,
    items: 3,
    preparedBy: 'አህመድ አብዱላሂ (Ahmed Abdullahi)'
  },
  {
    id: 5,
    quotationNumber: 'QT-2024-000005',
    customer: 'የገምቤላ ንግድ ማ/ድ (Gambella Trade Organization)',
    quotationDate: '2024-01-24',
    validUntil: '2024-02-24',
    status: 'Expired',
    totalAmount: 175000,
    items: 7,
    preparedBy: 'በላይ መንግስቱ (Belay Mengistu)'
  },
  {
    id: 6,
    quotationNumber: 'QT-2024-000006',
    customer: 'አፋር ክልል ንግድ ማህበር (Afar Regional Trade Association)',
    quotationDate: '2024-01-25',
    validUntil: '2024-02-25',
    status: 'Converted',
    totalAmount: 290000,
    items: 11,
    preparedBy: 'ሩብ አሊ (Ruben Ali)'
  }
];

const mockCustomers: Customer[] = [
  {
    id: 1,
    code: 'CUST-001',
    name: 'የኢትዮጵያ ንግድ ማህበር (Ethiopian Trade Association)',
    region: 'Addis Ababa',
    phone: '+251911123456',
    email: 'info@eta.gov.et',
    type: 'Government'
  },
  {
    id: 2,
    code: 'CUST-002',
    name: 'Oromia Coffee Cooperative',
    region: 'Oromia',
    phone: '+251921234567',
    email: 'contact@oromiacoffee.com',
    type: 'Business'
  },
  {
    id: 3,
    code: 'CUST-003',
    name: 'ሲዳማ ካፌ ኤክስፖርት (Sidama Coffee Export)',
    region: 'SNNPR',
    phone: '+251931345678',
    email: 'export@sidamacoffee.et',
    type: 'Business'
  },
  {
    id: 4,
    code: 'CUST-004',
    name: 'አማራ ግብርና ማህበር (Amhara Agriculture Association)',
    region: 'Amhara',
    phone: '+251941456789',
    email: 'info@amaragriculture.gov.et',
    type: 'Government'
  },
  {
    id: 5,
    code: 'CUST-005',
    name: 'ሚኒስትሪ ኦፍ ኤግሪክልቸር (Ministry of Agriculture)',
    region: 'Addis Ababa',
    phone: '+251951567890',
    email: 'ministry@agriculture.gov.et',
    type: 'Government'
  },
  {
    id: 6,
    code: 'CUST-006',
    name: 'Hawassa Industrial Park',
    region: 'SNNPR',
    phone: '+251961678901',
    email: 'info@hawassapark.com',
    type: 'Business'
  },
  {
    id: 7,
    code: 'CUST-007',
    name: 'ትግራይ ኢንዱስትሪ ዞን (Tigray Industrial Zone)',
    region: 'Tigray',
    phone: '+251971789012',
    email: 'contact@tigrayindustry.et',
    type: 'Business'
  },
  {
    id: 8,
    code: 'CUST-008',
    name: 'ድሬዳዋ ድስትሪብዩሽን ሴንተር (Dire Dawa Distribution Center)',
    region: 'Dire Dawa',
    phone: '+251981890123',
    email: 'distribution@diredawa.et',
    type: 'Business'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Draft': return 'default';
    case 'Approved': case 'Sent': return 'primary';
    case 'In Production': return 'warning';
    case 'Delivered': case 'Accepted': return 'success';
    case 'Invoiced': return 'info';
    case 'Rejected': case 'Expired': return 'error';
    case 'Converted': return 'secondary';
    default: return 'default';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Low': return 'default';
    case 'Normal': return 'primary';
    case 'High': return 'warning';
    case 'Urgent': return 'error';
    default: return 'default';
  }
};

const Sales: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOrderDialogOpen, setIsCreateOrderDialogOpen] = useState(false);
  const [isCreateQuotationDialogOpen, setIsCreateQuotationDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orders, setOrders] = useState(mockOrders);
  const [quotations, setQuotations] = useState(mockQuotations);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, item: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't clear selectedItem immediately - let it be cleared when dialogs close
  };

  const handleAction = (action: string) => {
    if (!selectedItem) return;
    
    switch (action) {
      case 'view':
        setIsViewDialogOpen(true);
        break;
        
      case 'edit':
        setIsEditDialogOpen(true);
        break;
        
      case 'approve':
        if (selectedItem.orderNumber) {
          setOrders(orders.map(order => 
            order.id === selectedItem.id 
              ? { ...order, status: 'Approved' as const }
              : order
          ));
          setSuccessMessage(`Order ${selectedItem.orderNumber} has been approved successfully!`);
        } else if (selectedItem.quotationNumber) {
          setQuotations(quotations.map(quote => 
            quote.id === selectedItem.id 
              ? { ...quote, status: 'Sent' as const }
              : quote
          ));
          setSuccessMessage(`Quotation ${selectedItem.quotationNumber} has been sent successfully!`);
        }
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        break;
        
      case 'convert':
        // Convert quotation to order
        const newOrder: SalesOrder = {
          id: Date.now(),
          orderNumber: `SO-2024-${String(orders.length + 1).padStart(6, '0')}`,
          customer: selectedItem.customer,
          orderDate: new Date().toISOString().split('T')[0],
          deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'Draft',
          priority: 'Normal',
          totalAmount: selectedItem.totalAmount,
          region: 'Addis Ababa',
          items: selectedItem.items,
          salesRep: selectedItem.preparedBy
        };
        
        setOrders([...orders, newOrder]);
        setQuotations(quotations.map(quote => 
          quote.id === selectedItem.id 
            ? { ...quote, status: 'Converted' as const }
            : quote
        ));
        setSuccessMessage(`Quotation ${selectedItem.quotationNumber} has been converted to order ${newOrder.orderNumber}!`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        break;
        
      case 'print':
        setIsPrintDialogOpen(true);
        break;
        
      case 'email':
        setIsEmailDialogOpen(true);
        break;
        
      case 'delete':
        setIsDeleteDialogOpen(true);
        break;
        
      default:
        console.log(`Unknown action: ${action}`);
    }
    
    handleMenuClose();
  };

  const handleEdit = (editData: any) => {
    if (!selectedItem) return;
    
    if (selectedItem.orderNumber) {
      // Update order
      setOrders(orders.map(order => 
        order.id === selectedItem.id 
          ? { 
              ...order, 
              deliveryDate: editData.deliveryDate,
              priority: editData.priority,
              region: editData.region,
              salesRep: editData.salesRep,
              notes: editData.notes
            }
          : order
      ));
      setSuccessMessage(`Order ${selectedItem.orderNumber} has been updated successfully!`);
    } else if (selectedItem.quotationNumber) {
      // Update quotation
      setQuotations(quotations.map(quote => 
        quote.id === selectedItem.id 
          ? { 
              ...quote, 
              validUntil: editData.validUntil,
              preparedBy: editData.preparedBy,
              notes: editData.notes
            }
          : quote
      ));
      setSuccessMessage(`Quotation ${selectedItem.quotationNumber} has been updated successfully!`);
    }
    
    setIsEditDialogOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    
    if (selectedItem.orderNumber) {
      setOrders(orders.filter(order => order.id !== selectedItem.id));
      setSuccessMessage(`Order ${selectedItem.orderNumber} has been deleted successfully!`);
    } else if (selectedItem.quotationNumber) {
      setQuotations(quotations.filter(quote => quote.id !== selectedItem.id));
      setSuccessMessage(`Quotation ${selectedItem.quotationNumber} has been deleted successfully!`);
    }
    
    setIsDeleteDialogOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handlePrint = () => {
    if (!selectedItem) return;
    
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const isOrder = selectedItem.orderNumber;
      const documentType = isOrder ? 'Sales Order' : 'Quotation';
      const documentNumber = isOrder ? selectedItem.orderNumber : selectedItem.quotationNumber;
      
      printWindow.document.write(`
        <html>
          <head>
            <title>${documentType} - ${documentNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              .company-name { font-size: 24px; font-weight: bold; color: #2196f3; }
              .document-title { font-size: 20px; margin-top: 10px; }
              .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
              .label { font-weight: bold; }
              .section { margin: 20px 0; }
              .section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="company-name">የኢትዮጵያ ኢአርፒ ሲስተም (Ethiopian ERP System)</div>
              <div class="document-title">${documentType}</div>
            </div>
            
            <div class="section">
              <div class="section-title">Document Information</div>
              <div class="info-row">
                <span><span class="label">${documentType} Number:</span> ${documentNumber}</span>
                <span><span class="label">Date:</span> ${isOrder ? selectedItem.orderDate : selectedItem.quotationDate}</span>
              </div>
              ${isOrder ? `
                <div class="info-row">
                  <span><span class="label">Delivery Date:</span> ${selectedItem.deliveryDate}</span>
                  <span><span class="label">Priority:</span> ${selectedItem.priority}</span>
                </div>
                <div class="info-row">
                  <span><span class="label">Status:</span> ${selectedItem.status}</span>
                  <span><span class="label">Region:</span> ${selectedItem.region}</span>
                </div>
              ` : `
                <div class="info-row">
                  <span><span class="label">Valid Until:</span> ${selectedItem.validUntil}</span>
                  <span><span class="label">Status:</span> ${selectedItem.status}</span>
                </div>
              `}
            </div>
            
            <div class="section">
              <div class="section-title">Customer Information</div>
              <div class="info-row">
                <span><span class="label">Customer:</span> ${selectedItem.customer}</span>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Financial Information</div>
              <div class="info-row">
                <span><span class="label">Total Amount:</span> ${selectedItem.totalAmount.toLocaleString()} ETB</span>
                <span><span class="label">Items Count:</span> ${selectedItem.items}</span>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Representative Information</div>
              <div class="info-row">
                <span><span class="label">${isOrder ? 'Sales Representative' : 'Prepared By'}:</span> ${isOrder ? selectedItem.salesRep : selectedItem.preparedBy}</span>
              </div>
            </div>
            
            <div class="section" style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>Ethiopian ERP System - Sales Management Module</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    
    setIsPrintDialogOpen(false);
    setSuccessMessage(`${selectedItem.orderNumber || selectedItem.quotationNumber} has been sent to printer!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSendEmail = (emailData: { to: string; subject: string; message: string }) => {
    if (!selectedItem) return;
    
    // Simulate email sending
    console.log('Sending email:', {
      to: emailData.to,
      subject: emailData.subject,
      message: emailData.message,
      attachment: selectedItem.orderNumber || selectedItem.quotationNumber
    });
    
    setIsEmailDialogOpen(false);
    setSuccessMessage(`Email sent successfully to ${emailData.to}!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Form validation schemas
  const orderValidationSchema = Yup.object({
    customer: Yup.string().required('Customer is required'),
    deliveryDate: Yup.date().required('Delivery date is required').min(new Date(), 'Delivery date cannot be in the past'),
    priority: Yup.string().required('Priority is required'),
    region: Yup.string().required('Delivery region is required'),
    salesRep: Yup.string().required('Sales representative is required')
  });

  const quotationValidationSchema = Yup.object({
    customer: Yup.string().required('Customer is required'),
    validUntil: Yup.date().required('Valid until date is required').min(new Date(), 'Valid until date cannot be in the past'),
    preparedBy: Yup.string().required('Prepared by is required')
  });

  const orderFormik = useFormik({
    initialValues: {
      customer: '',
      deliveryDate: '',
      priority: 'Normal',
      region: '',
      salesRep: '',
      notes: ''
    },
    validationSchema: orderValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const newOrder: SalesOrder = {
        id: Date.now(),
        orderNumber: `SO-2024-${String(orders.length + 1).padStart(6, '0')}`,
        customer: values.customer,
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: values.deliveryDate,
        status: 'Draft',
        priority: values.priority as any,
        totalAmount: 0,
        region: values.region,
        items: 0,
        salesRep: values.salesRep
      };
      
      setOrders([...orders, newOrder]);
      setIsCreateOrderDialogOpen(false);
      resetForm();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  });

  const quotationFormik = useFormik({
    initialValues: {
      customer: '',
      validUntil: '',
      preparedBy: '',
      notes: ''
    },
    validationSchema: quotationValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const newQuotation: Quotation = {
        id: Date.now(),
        quotationNumber: `QT-2024-${String(quotations.length + 1).padStart(6, '0')}`,
        customer: values.customer,
        quotationDate: new Date().toISOString().split('T')[0],
        validUntil: values.validUntil,
        status: 'Draft',
        totalAmount: 0,
        items: 0,
        preparedBy: values.preparedBy
      };
      
      setQuotations([...quotations, newQuotation]);
      setIsCreateQuotationDialogOpen(false);
      resetForm();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  });

  // Filter data based on search term
  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.salesRep.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuotations = quotations.filter(quotation =>
    quotation.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.preparedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalSalesValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => ['Draft', 'Approved', 'In Production'].includes(order.status)).length;
  const activeQuotations = quotations.filter(quote => ['Draft', 'Sent'].includes(quote.status)).length;
  const uniqueCustomers = new Set([...orders.map(o => o.customer), ...quotations.map(q => q.customer)]).size;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Success Alert */}
      <Fade in={showSuccess}>
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage || 'Operation completed successfully!'}
        </Alert>
      </Fade>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          የሽያጭ አስተዳደር (Sales Management)
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Comprehensive sales management for Ethiopian business operations
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" component="div">
                    Total Sales
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {totalSalesValue.toLocaleString()} ETB
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" component="div">
                    Pending Orders
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {pendingOrders}
                  </Typography>
                </Box>
                <OrderIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" component="div">
                    Active Quotations
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {activeQuotations}
                  </Typography>
                </Box>
                <QuoteIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #7b1fa2 0%, #ba68c8 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" component="div">
                    Unique Customers
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {uniqueCustomers}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="sales tabs">
            <Tab label="Sales Orders" icon={<OrderIcon />} iconPosition="start" />
            <Tab label="Quotations" icon={<QuoteIcon />} iconPosition="start" />
            <Tab label="Analytics" icon={<TrendingUpIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Sales Orders Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              placeholder="Search orders..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateOrderDialogOpen(true)}
              sx={{ fontWeight: 'bold' }}
            >
              Create Order
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Order Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Order Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Delivery Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Region</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Amount (ETB)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sales Rep</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>{order.deliveryDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status) as any}
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.priority}
                        color={getPriorityColor(order.priority) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{order.region}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {order.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>{order.salesRep}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, order)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Quotations Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              placeholder="Search quotations..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateQuotationDialogOpen(true)}
              sx={{ fontWeight: 'bold' }}
            >
              Create Quotation
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Quotation Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Quotation Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Valid Until</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Amount (ETB)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Prepared By</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuotations.map((quotation) => (
                  <TableRow key={quotation.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {quotation.quotationNumber}
                    </TableCell>
                    <TableCell>{quotation.customer}</TableCell>
                    <TableCell>{quotation.quotationDate}</TableCell>
                    <TableCell>{quotation.validUntil}</TableCell>
                    <TableCell>
                      <Chip
                        label={quotation.status}
                        color={getStatusColor(quotation.status) as any}
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {quotation.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>{quotation.items}</TableCell>
                    <TableCell>{quotation.preparedBy}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, quotation)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Sales Analytics Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Analytics functionality will be implemented with detailed charts and reports
                showcasing Ethiopian business metrics, regional performance, and cultural insights.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Regional Sales Distribution
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sales performance across Ethiopian regions including Addis Ababa, Oromia, Amhara, and others.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Ethiopian Calendar Performance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sales trends aligned with Ethiopian calendar months and cultural holidays.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('view')}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleAction('edit')}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        {selectedItem?.status === 'Draft' && (
          <MenuItem onClick={() => handleAction('approve')}>
            <ApproveIcon sx={{ mr: 1 }} />
            Approve
          </MenuItem>
        )}
        {selectedItem?.quotationNumber && selectedItem?.status !== 'Converted' && (
          <MenuItem onClick={() => handleAction('convert')}>
            <ConvertIcon sx={{ mr: 1 }} />
            Convert to Order
          </MenuItem>
        )}
        <MenuItem onClick={() => handleAction('print')}>
          <PrintIcon sx={{ mr: 1 }} />
          Print
        </MenuItem>
        <MenuItem onClick={() => handleAction('email')}>
          <EmailIcon sx={{ mr: 1 }} />
          Send Email
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create Order Dialog */}
      <Dialog open={isCreateOrderDialogOpen} onClose={() => setIsCreateOrderDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Sales Order</DialogTitle>
        <form onSubmit={orderFormik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={mockCustomers}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer"
                      error={orderFormik.touched.customer && Boolean(orderFormik.errors.customer)}
                      helperText={orderFormik.touched.customer && orderFormik.errors.customer}
                    />
                  )}
                  onChange={(_, value) => orderFormik.setFieldValue('customer', value?.name || '')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="deliveryDate"
                  label="Delivery Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={orderFormik.values.deliveryDate}
                  onChange={orderFormik.handleChange}
                  error={orderFormik.touched.deliveryDate && Boolean(orderFormik.errors.deliveryDate)}
                  helperText={orderFormik.touched.deliveryDate && orderFormik.errors.deliveryDate}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={orderFormik.values.priority}
                    onChange={orderFormik.handleChange}
                    label="Priority"
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={ethiopianRegions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Delivery Region"
                      error={orderFormik.touched.region && Boolean(orderFormik.errors.region)}
                      helperText={orderFormik.touched.region && orderFormik.errors.region}
                    />
                  )}
                  onChange={(_, value) => orderFormik.setFieldValue('region', value || '')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="salesRep"
                  label="Sales Representative"
                  value={orderFormik.values.salesRep}
                  onChange={orderFormik.handleChange}
                  error={orderFormik.touched.salesRep && Boolean(orderFormik.errors.salesRep)}
                  helperText={orderFormik.touched.salesRep && orderFormik.errors.salesRep}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="notes"
                  label="Notes"
                  multiline
                  rows={3}
                  value={orderFormik.values.notes}
                  onChange={orderFormik.handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCreateOrderDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create Order</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create Quotation Dialog */}
      <Dialog open={isCreateQuotationDialogOpen} onClose={() => setIsCreateQuotationDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Quotation</DialogTitle>
        <form onSubmit={quotationFormik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={mockCustomers}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer"
                      error={quotationFormik.touched.customer && Boolean(quotationFormik.errors.customer)}
                      helperText={quotationFormik.touched.customer && quotationFormik.errors.customer}
                    />
                  )}
                  onChange={(_, value) => quotationFormik.setFieldValue('customer', value?.name || '')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="validUntil"
                  label="Valid Until"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={quotationFormik.values.validUntil}
                  onChange={quotationFormik.handleChange}
                  error={quotationFormik.touched.validUntil && Boolean(quotationFormik.errors.validUntil)}
                  helperText={quotationFormik.touched.validUntil && quotationFormik.errors.validUntil}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="preparedBy"
                  label="Prepared By"
                  value={quotationFormik.values.preparedBy}
                  onChange={quotationFormik.handleChange}
                  error={quotationFormik.touched.preparedBy && Boolean(quotationFormik.errors.preparedBy)}
                  helperText={quotationFormik.touched.preparedBy && quotationFormik.errors.preparedBy}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="notes"
                  label="Notes"
                  multiline
                  rows={3}
                  value={quotationFormik.values.notes}
                  onChange={quotationFormik.handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCreateQuotationDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create Quotation</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onClose={() => { setIsViewDialogOpen(false); setSelectedItem(null); }} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main', mr: 2 }}>
            {selectedItem?.orderNumber ? <OrderIcon /> : <QuoteIcon />}
          </Avatar>
          {selectedItem?.orderNumber ? 'Sales Order Details' : 'Quotation Details'}
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box sx={{ mt: 2 }}>
              {/* Document Header */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {selectedItem.orderNumber || selectedItem.quotationNumber}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {selectedItem.customer}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    <Chip
                      label={selectedItem.status}
                      color={getStatusColor(selectedItem.status) as any}
                      size="medium"
                      sx={{ fontSize: '1.1rem', fontWeight: 'bold', mb: 1, py: 1, px: 2 }}
                    />
                    {selectedItem.orderNumber && (
                      <Box>
                        <Chip
                          label={selectedItem.priority}
                          color={getPriorityColor(selectedItem.priority) as any}
                          size="medium"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Paper>

              {/* Main Details */}
              <Grid container spacing={4}>
                {/* Left Column */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                    📄 Document Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          📅
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedItem.orderNumber ? selectedItem.orderDate : selectedItem.quotationDate}
                        secondary={selectedItem.orderNumber ? 'Order Date' : 'Quotation Date'}
                      />
                    </ListItem>
                    {selectedItem.orderNumber ? (
                      <ListItem>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                            🚚
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={selectedItem.deliveryDate}
                          secondary="Delivery Date"
                        />
                      </ListItem>
                    ) : (
                      <ListItem>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                            ⏰
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={selectedItem.validUntil}
                          secondary="Valid Until"
                        />
                      </ListItem>
                    )}
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                          💰
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={`${selectedItem.totalAmount.toLocaleString()} ETB`}
                        secondary="Total Amount"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                          📦
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={`${selectedItem.items} item${selectedItem.items !== 1 ? 's' : ''}`}
                        secondary="Number of Items"
                      />
                    </ListItem>
                  </List>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                    👥 People & Location
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'purple', width: 32, height: 32 }}>
                          👤
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedItem.orderNumber ? selectedItem.salesRep : selectedItem.preparedBy}
                        secondary={selectedItem.orderNumber ? 'Sales Representative' : 'Prepared By'}
                      />
                    </ListItem>
                    {selectedItem.orderNumber && (
                      <ListItem>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: 'green', width: 32, height: 32 }}>
                            📍
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={selectedItem.region}
                          secondary="Delivery Region"
                        />
                      </ListItem>
                    )}
                  </List>

                  {/* Customer Information */}
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, mt: 3, color: 'primary.main' }}>
                    🏢 Customer Details
                  </Typography>
                  {(() => {
                    const customer = mockCustomers.find(c => c.name === selectedItem.customer);
                    if (customer) {
                      return (
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: 'orange', width: 32, height: 32 }}>
                                🏷️
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={customer.code}
                              secondary="Customer Code"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: 'blue', width: 32, height: 32 }}>
                                📧
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={customer.email}
                              secondary="Email Address"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: 'teal', width: 32, height: 32 }}>
                                📱
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={customer.phone}
                              secondary="Phone Number"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: 'indigo', width: 32, height: 32 }}>
                                🏛️
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={customer.type}
                              secondary="Customer Type"
                            />
                          </ListItem>
                        </List>
                      );
                    }
                    return <Typography color="text.secondary">Customer details not found</Typography>;
                  })()}
                </Grid>
              </Grid>

              {/* Actions Summary */}
              <Paper sx={{ p: 2, mt: 3, bgcolor: 'info.light' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  🔧 Available Actions
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip icon={<EditIcon />} label="Edit" variant="outlined" />
                  <Chip icon={<PrintIcon />} label="Print" variant="outlined" />
                  <Chip icon={<EmailIcon />} label="Email" variant="outlined" />
                  {selectedItem.status === 'Draft' && (
                    <Chip icon={<ApproveIcon />} label="Approve" variant="outlined" color="success" />
                  )}
                  {selectedItem.quotationNumber && selectedItem.status !== 'Converted' && (
                    <Chip icon={<ConvertIcon />} label="Convert to Order" variant="outlined" color="warning" />
                  )}
                </Box>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => { setIsViewDialogOpen(false); setSelectedItem(null); }} size="large">
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleAction('edit')}
            startIcon={<EditIcon />}
            size="large"
          >
            Edit
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleAction('print')}
            startIcon={<PrintIcon />}
            color="secondary"
            size="large"
          >
            Print
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit {selectedItem?.orderNumber ? 'Sales Order' : 'Quotation'}
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Customer"
                    defaultValue={selectedItem.customer}
                    disabled
                    variant="outlined"
                  />
                </Grid>
                {selectedItem.orderNumber ? (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Delivery Date"
                        type="date"
                        defaultValue={selectedItem.deliveryDate}
                        InputLabelProps={{ shrink: true }}
                        id="edit-delivery-date"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Priority</InputLabel>
                        <Select 
                          defaultValue={selectedItem.priority} 
                          label="Priority"
                          id="edit-priority"
                        >
                          <MenuItem value="Low">Low</MenuItem>
                          <MenuItem value="Normal">Normal</MenuItem>
                          <MenuItem value="High">High</MenuItem>
                          <MenuItem value="Urgent">Urgent</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        options={ethiopianRegions}
                        defaultValue={selectedItem.region}
                        renderInput={(params) => (
                          <TextField {...params} label="Delivery Region" required />
                        )}
                        onChange={(_, value) => {
                          const input = document.getElementById('edit-region') as HTMLInputElement;
                          if (input) input.value = value || '';
                        }}
                      />
                      <input type="hidden" id="edit-region" defaultValue={selectedItem.region} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Sales Representative"
                        defaultValue={selectedItem.salesRep}
                        id="edit-sales-rep"
                        required
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Valid Until"
                        type="date"
                        defaultValue={selectedItem.validUntil}
                        InputLabelProps={{ shrink: true }}
                        id="edit-valid-until"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Prepared By"
                        defaultValue={selectedItem.preparedBy}
                        id="edit-prepared-by"
                        required
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    placeholder="Additional notes..."
                    id="edit-notes"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              if (!selectedItem) return;
              
              const editData: any = {};
              
              if (selectedItem.orderNumber) {
                const deliveryDate = (document.getElementById('edit-delivery-date') as HTMLInputElement)?.value;
                const priority = (document.getElementById('edit-priority') as HTMLInputElement)?.value;
                const region = (document.getElementById('edit-region') as HTMLInputElement)?.value;
                const salesRep = (document.getElementById('edit-sales-rep') as HTMLInputElement)?.value;
                const notes = (document.getElementById('edit-notes') as HTMLTextAreaElement)?.value;
                
                if (!deliveryDate || !priority || !region || !salesRep) {
                  alert('Please fill in all required fields');
                  return;
                }
                
                editData.deliveryDate = deliveryDate;
                editData.priority = priority;
                editData.region = region;
                editData.salesRep = salesRep;
                editData.notes = notes;
              } else {
                const validUntil = (document.getElementById('edit-valid-until') as HTMLInputElement)?.value;
                const preparedBy = (document.getElementById('edit-prepared-by') as HTMLInputElement)?.value;
                const notes = (document.getElementById('edit-notes') as HTMLTextAreaElement)?.value;
                
                if (!validUntil || !preparedBy) {
                  alert('Please fill in all required fields');
                  return;
                }
                
                editData.validUntil = validUntil;
                editData.preparedBy = preparedBy;
                editData.notes = notes;
              }
              
              handleEdit(editData);
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Print Confirmation Dialog */}
      <Dialog open={isPrintDialogOpen} onClose={() => setIsPrintDialogOpen(false)}>
        <DialogTitle>Print Document</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to print {selectedItem?.orderNumber || selectedItem?.quotationNumber}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPrintDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePrint}>
            Print
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onClose={() => setIsEmailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="To"
              placeholder="customer@example.com"
              sx={{ mb: 2 }}
              id="email-to"
            />
            <TextField
              fullWidth
              label="Subject"
              defaultValue={`${selectedItem?.orderNumber ? 'Sales Order' : 'Quotation'} - ${selectedItem?.orderNumber || selectedItem?.quotationNumber}`}
              sx={{ mb: 2 }}
              id="email-subject"
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              defaultValue={`Dear Valued Customer,

Please find attached the ${selectedItem?.orderNumber ? 'sales order' : 'quotation'} ${selectedItem?.orderNumber || selectedItem?.quotationNumber}.

If you have any questions, please don't hesitate to contact us.

Best regards,
Ethiopian ERP Sales Team`}
              id="email-message"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEmailDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              const to = (document.getElementById('email-to') as HTMLInputElement)?.value || '';
              const subject = (document.getElementById('email-subject') as HTMLInputElement)?.value || '';
              const message = (document.getElementById('email-message') as HTMLTextAreaElement)?.value || '';
              handleSendEmail({ to, subject, message });
            }}
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone!
          </Alert>
          <Typography>
            Are you sure you want to delete {selectedItem?.orderNumber || selectedItem?.quotationNumber}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Sales;
