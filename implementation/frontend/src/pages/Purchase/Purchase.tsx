import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Avatar,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Dashboard,
  People,
  ShoppingCart,
  Assignment,
  Receipt,
  AttachMoney,
  LocalShipping,
  Analytics
} from '@mui/icons-material';
import MockPurchaseDataProvider from '../../contexts/MockPurchaseDataProvider';
import PurchaseDashboard from '../../components/Purchase/PurchaseDashboard';
import SupplierManagement from '../../components/Purchase/SupplierManagement';
import SuppliersPage from './Suppliers/SuppliersPage';
import PurchaseOrdersPage from './PurchaseOrders/PurchaseOrdersPage';
import RequisitionsPage from './Requisitions/RequisitionsPage';
import GRVPage from './GRV/GRVPage';

// Purchase navigation cards data
const purchaseCards = [
  {
    title: 'Dashboard',
    description: 'Purchase overview and key metrics',
    icon: <Dashboard sx={{ fontSize: 40 }} />,
    path: '/purchase/dashboard',
    color: '#1976d2'
  },
  {
    title: 'Suppliers',
    description: 'Manage Ethiopian and international suppliers',
    icon: <People sx={{ fontSize: 40 }} />,
    path: '/purchase/suppliers',
    color: '#388e3c'
  },
  {
    title: 'Purchase Orders',
    description: 'Create and manage purchase orders',
    icon: <ShoppingCart sx={{ fontSize: 40 }} />,
    path: '/purchase/orders',
    color: '#f57c00'
  },
  {
    title: 'Requisitions',
    description: 'Purchase requisition workflow',
    icon: <Assignment sx={{ fontSize: 40 }} />,
    path: '/purchase/requisitions',
    color: '#7b1fa2'
  },
  {
    title: 'Goods Received',
    description: 'Track received goods and inspections',
    icon: <Receipt sx={{ fontSize: 40 }} />,
    path: '/purchase/goods-received',
    color: '#c2185b'
  },
  {
    title: 'Payments',
    description: 'Payment vouchers and processing',
    icon: <AttachMoney sx={{ fontSize: 40 }} />,
    path: '/purchase/payments',
    color: '#00796b'
  },
  {
    title: 'Logistics',
    description: 'Shipping and customs tracking',
    icon: <LocalShipping sx={{ fontSize: 40 }} />,
    path: '/purchase/logistics',
    color: '#455a64'
  },
  {
    title: 'Reports',
    description: 'Purchase analytics and reports',
    icon: <Analytics sx={{ fontSize: 40 }} />,
    path: '/purchase/reports',
    color: '#3f51b5'
  }
];

const PurchaseHome: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Purchase Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Ethiopian ERP System - Comprehensive Purchase Operations
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {purchaseCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardActionArea 
                onClick={() => handleCardClick(card.path)}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent sx={{ textAlign: 'center', height: '100%' }}>
                  <Avatar
                    sx={{
                      bgcolor: card.color,
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

// Breadcrumb component
const PurchaseBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const getBreadcrumbLabel = (segment: string) => {
    switch (segment) {
      case 'purchase': return 'Purchase';
      case 'dashboard': return 'Dashboard';
      case 'suppliers': return 'Suppliers';
      case 'orders': return 'Purchase Orders';
      case 'requisitions': return 'Requisitions';
      case 'goods-received': return 'Goods Received';
      case 'payments': return 'Payments';
      case 'logistics': return 'Logistics';
      case 'reports': return 'Reports';
      default: return segment;
    }
  };

  if (pathSegments.length <= 1) return null;

  return (
    <Box sx={{ px: 3, py: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <Breadcrumbs>
        <Link color="inherit" href="/purchase" underline="hover">
          Purchase
        </Link>
        {pathSegments.slice(1).map((segment, index) => (
          <Typography key={index} color="text.primary">
            {getBreadcrumbLabel(segment)}
          </Typography>
        ))}
      </Breadcrumbs>
    </Box>
  );
};

const Purchase: React.FC = () => {
  return (
    <MockPurchaseDataProvider>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <PurchaseBreadcrumbs />
        <Routes>
          <Route path="/" element={<PurchaseHome />} />
          <Route path="/dashboard" element={<PurchaseDashboard />} />
          <Route path="/suppliers" element={<SupplierManagement />} />
          <Route path="/suppliers/*" element={<SuppliersPage />} />
          <Route path="/orders" element={<PurchaseOrdersPage />} />
          <Route path="/requisitions" element={<RequisitionsPage />} />
          <Route path="/goods-received" element={<GRVPage />} />
          <Route path="/payments" element={
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Typography variant="h4">Payment Management</Typography>
              <Typography variant="body1" color="textSecondary">
                Payment processing coming soon...
              </Typography>
            </Container>
          } />
          <Route path="/logistics" element={
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Typography variant="h4">Logistics & Customs</Typography>
              <Typography variant="body1" color="textSecondary">
                Logistics tracking coming soon...
              </Typography>
            </Container>
          } />
          <Route path="/reports" element={
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Typography variant="h4">Purchase Reports</Typography>
              <Typography variant="body1" color="textSecondary">
                Analytics and reporting coming soon...
              </Typography>
            </Container>
          } />
        </Routes>
      </Box>
    </MockPurchaseDataProvider>
  );
};

export default Purchase;
