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
  Assessment,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-purchase-order':
        navigate('/purchase/orders');
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
            {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={() => handleQuickAction('create-purchase-order')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Create Purchase Order
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Inventory />}
                  onClick={() => handleQuickAction('add-new-item')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Add New Item
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Assessment />}
                  onClick={() => handleQuickAction('generate-report')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Generate Report
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Inventory />}
                  onClick={() => handleQuickAction('view-inventory')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  View Inventory
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
