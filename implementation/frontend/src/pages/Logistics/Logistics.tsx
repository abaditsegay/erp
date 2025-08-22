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
  Inventory as WarehouseIcon,
  Assignment as CustomsIcon,
  Timeline as TrackingIcon,
  Assessment as ReportsIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import ShipmentTrackingPage from './ShipmentTracking';
import WarehouseManagementPage from './WarehouseManagement';
import CustomsClearancePage from './CustomsClearance';
import LogisticsReportsPage from './LogisticsReports';

const Logistics: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getTabValue = () => {
    const path = location.pathname;
    if (path.includes('/tracking')) return 0;
    if (path.includes('/warehouse')) return 1;
    if (path.includes('/customs')) return 2;
    if (path.includes('/reports')) return 3;
    return 0;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/logistics/tracking');
        break;
      case 1:
        navigate('/logistics/warehouse');
        break;
      case 2:
        navigate('/logistics/customs');
        break;
      case 3:
        navigate('/logistics/reports');
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
        <Typography color="text.primary">Logistics & Customs</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        Logistics & Customs Management
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        የሎጂስቲክስ እና ጉምሩክ አስተዳደር - Manage shipments, warehouses, customs clearance, and supply chain operations for your Ethiopian business.
      </Typography>

      <Paper sx={{ width: '100%', mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={getTabValue()} 
            onChange={handleTabChange} 
            aria-label="logistics management tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              icon={<TrackingIcon />} 
              label="Shipment Tracking" 
              iconPosition="start"
            />
            <Tab 
              icon={<WarehouseIcon />} 
              label="Warehouse Management" 
              iconPosition="start"
            />
            <Tab 
              icon={<CustomsIcon />} 
              label="Customs Clearance" 
              iconPosition="start"
            />
            <Tab 
              icon={<ReportsIcon />} 
              label="Logistics Reports" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Routes>
          <Route index element={<Navigate to="tracking" replace />} />
          <Route path="tracking" element={<ShipmentTrackingPage />} />
          <Route path="warehouse" element={<WarehouseManagementPage />} />
          <Route path="customs" element={<CustomsClearancePage />} />
          <Route path="reports" element={<LogisticsReportsPage />} />
        </Routes>
      </Paper>
    </Box>
  );
};

export default Logistics;
