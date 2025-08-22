import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  AccountBalance as AccountIcon,
  Receipt as ReceiptIcon,
  Assessment as ReportsIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import PaymentsPage from './Payments';
import AccountsPage from './Accounts';
import ExpensesPage from './Expenses';
import ReportsPage from './Reports';

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
      id={`finance-tabpanel-${index}`}
      aria-labelledby={`finance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `finance-tab-${index}`,
    'aria-controls': `finance-tabpanel-${index}`,
  };
}

const Finance: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getTabValue = () => {
    const path = location.pathname;
    if (path.includes('/payments')) return 0;
    if (path.includes('/accounts')) return 1;
    if (path.includes('/expenses')) return 2;
    if (path.includes('/reports')) return 3;
    return 0;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/finance/payments');
        break;
      case 1:
        navigate('/finance/accounts');
        break;
      case 2:
        navigate('/finance/expenses');
        break;
      case 3:
        navigate('/finance/reports');
        break;
    }
  };

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          color="inherit"
          href="/dashboard"
          onClick={(e) => {
            e.preventDefault();
            navigate('/dashboard');
          }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Typography color="text.primary">Finance</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        Finance Management
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage payments, accounts, expenses, and financial transactions for your Ethiopian business.
      </Typography>

      <Paper sx={{ width: '100%', mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={getTabValue()} 
            onChange={handleTabChange} 
            aria-label="finance management tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              icon={<PaymentIcon />} 
              label="Payments" 
              {...a11yProps(0)} 
              iconPosition="start"
            />
            <Tab 
              icon={<AccountIcon />} 
              label="Accounts" 
              {...a11yProps(1)} 
              iconPosition="start"
            />
            <Tab 
              icon={<ReceiptIcon />} 
              label="Expenses" 
              {...a11yProps(2)} 
              iconPosition="start"
            />
            <Tab 
              icon={<ReportsIcon />} 
              label="Reports" 
              {...a11yProps(3)} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Routes>
          <Route index element={<Navigate to="payments" replace />} />
          <Route path="payments/*" element={<PaymentsPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Routes>
      </Paper>
    </Box>
  );
};

export default Finance;
