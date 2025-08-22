import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Button,
  Stack
} from '@mui/material';
import {
  ShoppingCart,
  Pending,
  Warning,
  TrendingUp,
  AttachMoney,
  People,
  Visibility,
  Edit,
  Receipt,
  LocalShipping,
  AccountBalance,
  Assignment
} from '@mui/icons-material';
import { useMockPurchaseData } from '../../contexts/MockPurchaseDataProvider';
import { PurchaseOrderStatus, PaymentStatus } from '../../types/purchase';

// Utility function to format Ethiopian Birr
const formatETB = (amount: number): string => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2
  }).format(amount);
};

// Utility function to format USD
const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case PurchaseOrderStatus.APPROVED:
      return 'success';
    case PurchaseOrderStatus.PENDING_APPROVAL:
      return 'warning';
    case PurchaseOrderStatus.CANCELLED:
      return 'error';
    case PurchaseOrderStatus.SENT_TO_SUPPLIER:
      return 'info';
    case PaymentStatus.OVERDUE:
      return 'error';
    case PaymentStatus.PENDING:
      return 'warning';
    case PaymentStatus.PAID:
      return 'success';
    default:
      return 'default';
  }
};

// Dashboard card component
interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend
}) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {subtitle && (
            <Typography color="textSecondary" variant="body2">
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              {trend}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const PurchaseDashboard: React.FC = () => {
  const { dashboard, exchangeRate } = useMockPurchaseData();
  const navigate = useNavigate();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-purchase-order':
        navigate('/purchase/orders');
        break;
      case 'add-supplier':
        navigate('/purchase/suppliers');
        break;
      case 'create-requisition':
        navigate('/purchase/requisitions');
        break;
      case 'process-payment':
        navigate('/finance/payments');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Purchase Management Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Ethiopian ERP System - Purchase Operations Overview
        </Typography>
        <Box mt={2} sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            Current Exchange Rate: 1 USD = {exchangeRate.usdToEtb} ETB
            (Updated: {new Date(exchangeRate.timestamp).toLocaleString()})
          </Typography>
        </Box>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Purchase Orders"
            value={dashboard.totalPurchaseOrders}
            icon={<ShoppingCart />}
            color="primary.main"
            trend="+12% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Pending Approvals"
            value={dashboard.pendingApprovals}
            subtitle="Requires attention"
            icon={<Pending />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Overdue Payments"
            value={dashboard.overduePayments}
            subtitle="Immediate action needed"
            icon={<Warning />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Monthly Spending"
            value={formatETB(dashboard.monthlySpending)}
            subtitle="February 2024"
            icon={<TrendingUp />}
            color="success.main"
            trend="+8.5% vs last month"
          />
        </Grid>
      </Grid>

      {/* Currency Breakdown and Approval Workflow */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
                Currency Breakdown
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body1">Ethiopian Birr (ETB)</Typography>
                  <Typography variant="h6" color="primary">
                    {formatETB(dashboard.currencyBreakdown.etb)}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={75} 
                  sx={{ mb: 2, height: 8, borderRadius: 4 }}
                />
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body1">US Dollar (USD)</Typography>
                  <Typography variant="h6" color="secondary">
                    {formatUSD(dashboard.currencyBreakdown.usd)}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={25} 
                  color="secondary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Approval Workflow Status
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center">
                    <Chip 
                      label="Pending" 
                      size="small" 
                      color="warning" 
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2">Awaiting Approval</Typography>
                  </Box>
                  <Typography variant="h6">{dashboard.approvalWorkflow.pending}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center">
                    <Chip 
                      label="Approved" 
                      size="small" 
                      color="success" 
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2">Completed</Typography>
                  </Box>
                  <Typography variant="h6">{dashboard.approvalWorkflow.approved}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <Chip 
                      label="Rejected" 
                      size="small" 
                      color="error" 
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2">Declined</Typography>
                  </Box>
                  <Typography variant="h6">{dashboard.approvalWorkflow.rejected}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Suppliers */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  <People sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Top Suppliers
                </Typography>
                <Button size="small" variant="outlined">View All</Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Supplier</TableCell>
                      <TableCell align="right">Orders</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell align="right">Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboard.topSuppliers.slice(0, 5).map((supplier) => (
                      <TableRow key={supplier.supplier.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {supplier.supplier.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {supplier.supplier.supplierType}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{supplier.totalOrders}</TableCell>
                        <TableCell align="right">
                          {supplier.supplier.currency === 'ETB' 
                            ? formatETB(supplier.totalValue)
                            : formatUSD(supplier.totalValue)
                          }
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={supplier.qualityRating.toFixed(1)} 
                            size="small" 
                            color={supplier.qualityRating >= 4.5 ? 'success' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recent Purchase Orders
                </Typography>
                <Button size="small" variant="outlined">View All</Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order #</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboard.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {order.orderNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {order.supplier.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {order.currency === 'ETB' 
                            ? formatETB(order.totalAmount)
                            : formatUSD(order.totalAmount)
                          }
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={order.status} 
                            size="small" 
                            color={getStatusColor(order.status) as any}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1}>
                            <IconButton size="small" color="primary">
                              <Visibility fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="default">
                              <Edit fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <LocalShipping sx={{ mr: 1, verticalAlign: 'middle' }} />
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<ShoppingCart />}
                color="primary"
                onClick={() => handleQuickAction('create-purchase-order')}
              >
                Create Purchase Order
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<People />}
                color="primary"
                onClick={() => handleQuickAction('add-supplier')}
              >
                Add New Supplier
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Assignment />}
                color="secondary"
                onClick={() => handleQuickAction('create-requisition')}
              >
                Create Requisition
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<AttachMoney />}
                color="success"
                onClick={() => handleQuickAction('process-payment')}
              >
                Process Payment
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PurchaseDashboard;
