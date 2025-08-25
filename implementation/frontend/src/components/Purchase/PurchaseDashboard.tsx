import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Container
} from '@mui/material';
import {
  ShoppingCart,
  People,
  Receipt,
  TrendingUp
} from '@mui/icons-material';
import { usePurchaseData } from '../../contexts/PurchaseDataProvider';

const PurchaseDashboard: React.FC = () => {
  const { 
    suppliers, 
    purchaseOrders, 
    grvs,
    loading,
    error 
  } = usePurchaseData();

  if (loading.dashboard || loading.suppliers || loading.purchaseOrders || loading.grvs) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Purchase Dashboard
        </Typography>
        <LinearProgress />
      </Container>
    );
  }

  if (error.dashboard || error.suppliers || error.purchaseOrders || error.grvs) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Purchase Dashboard
        </Typography>
        <Typography color="error">
          {error.dashboard || error.suppliers || error.purchaseOrders || error.grvs}
        </Typography>
      </Container>
    );
  }

  // Calculate metrics
  const totalSuppliers = suppliers.length;
  const totalPurchaseOrders = purchaseOrders.length;
  const totalGRVs = grvs.length;
  const pendingOrders = purchaseOrders.filter(po => po.status === 'PENDING_APPROVAL').length;

  const dashboardCards = [
    {
      title: 'Total Suppliers',
      value: totalSuppliers,
      icon: <People sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#e3f2fd'
    },
    {
      title: 'Purchase Orders',
      value: totalPurchaseOrders,
      icon: <ShoppingCart sx={{ fontSize: 40, color: '#388e3c' }} />,
      color: '#e8f5e8'
    },
    {
      title: 'Goods Received',
      value: totalGRVs,
      icon: <Receipt sx={{ fontSize: 40, color: '#f57c00' }} />,
      color: '#fff3e0'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: <TrendingUp sx={{ fontSize: 40, color: '#d32f2f' }} />,
      color: '#ffebee'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Purchase Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', backgroundColor: card.color }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Purchase Orders
              </Typography>
              {purchaseOrders.slice(0, 5).map((po) => (
                <Box key={po.id} sx={{ py: 1, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body2">
                    {po.poNumber} - {po.status}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Suppliers
              </Typography>
              {suppliers.slice(0, 5).map((supplier) => (
                <Box key={supplier.id} sx={{ py: 1, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body2">
                    {supplier.name} - {supplier.address.country}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PurchaseDashboard;
