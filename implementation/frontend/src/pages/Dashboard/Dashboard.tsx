import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  People,
  ShoppingCart,
  Inventory,
  AttachMoney,
  Assignment,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-purchase-order':
        navigate('/purchase/orders');
        break;
      case 'add-new-supplier':
        navigate('/purchase/suppliers');
        break;
      case 'create-requisition':
        navigate('/purchase/requisitions');
        break;
      case 'process-payment':
        navigate('/finance/payments');
        break;
      case 'add-new-item':
        navigate('/inventory');
        break;
      case 'generate-report':
        navigate('/reports');
        break;
      case 'view-inventory':
        navigate('/inventory');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };
  const stats = [
    {
      title: 'Total Sales',
      value: '$124,532',
      change: '+12.5%',
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary.main',
    },
    {
      title: 'Inventory Items',
      value: '1,248',
      change: '+3.2%',
      icon: <Inventory sx={{ fontSize: 40, color: 'secondary.main' }} />,
      color: 'secondary.main',
    },
    {
      title: 'Purchase Orders',
      value: '156',
      change: '+8.1%',
      icon: <ShoppingCart sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.main',
    },
    {
      title: 'Active Users',
      value: '42',
      change: '+5.0%',
      icon: <People sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning.main',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Welcome to your ERP system dashboard. Here's an overview of your business metrics.
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {stat.value}
                    </Typography>
                    <Typography color="success.main">
                      {stat.change}
                    </Typography>
                  </Box>
                  <Box>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                • Purchase Order PO-001234 has been approved
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                • New item "Laptop Computer" added to inventory
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                • Sales Order SO-005678 has been shipped
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                • Inventory count completed for Warehouse A
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={() => handleQuickAction('create-purchase-order')}
                  sx={{ 
                    justifyContent: 'flex-start',
                    py: 2,
                    backgroundColor: '#3B82F6',
                    '&:hover': {
                      backgroundColor: '#2563EB',
                    }
                  }}
                >
                  Create Purchase Order
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<People />}
                  onClick={() => handleQuickAction('add-new-supplier')}
                  sx={{ 
                    justifyContent: 'flex-start',
                    py: 2,
                    color: '#3B82F6',
                    borderColor: '#3B82F6',
                    '&:hover': {
                      borderColor: '#2563EB',
                      backgroundColor: 'rgba(59, 130, 246, 0.04)',
                    }
                  }}
                >
                  Add New Supplier
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Assignment />}
                  onClick={() => handleQuickAction('create-requisition')}
                  sx={{ 
                    justifyContent: 'flex-start',
                    py: 2,
                    color: '#EF4444',
                    borderColor: '#EF4444',
                    '&:hover': {
                      borderColor: '#DC2626',
                      backgroundColor: 'rgba(239, 68, 68, 0.04)',
                    }
                  }}
                >
                  Create Requisition
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<AttachMoney />}
                  onClick={() => handleQuickAction('process-payment')}
                  sx={{ 
                    justifyContent: 'flex-start',
                    py: 2,
                    color: '#10B981',
                    borderColor: '#10B981',
                    '&:hover': {
                      borderColor: '#059669',
                      backgroundColor: 'rgba(16, 185, 129, 0.04)',
                    }
                  }}
                >
                  Process Payment
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
