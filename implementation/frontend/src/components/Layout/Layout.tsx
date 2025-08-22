import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as PurchaseIcon,
  Sell as SalesIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountBalance as FinanceIcon,
  LocalShipping as LogisticsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import EthiopianLanguageSwitcher from '../Common/EthiopianLanguageSwitcher';
import EthiopianCalendarWidget from '../Common/EthiopianCalendarWidget';
import { ethiopianLanguageService } from '../../services/ethiopianLanguageService';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', key: 'dashboard' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory', key: 'inventory' },
    { text: 'Purchase', icon: <PurchaseIcon />, path: '/purchase', key: 'purchase' },
    { text: 'Finance', icon: <FinanceIcon />, path: '/finance', key: 'finance' },
    { text: 'Logistics', icon: <LogisticsIcon />, path: '/logistics', key: 'logistics' },
    { text: 'Sales', icon: <SalesIcon />, path: '/sales', key: 'sales' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/reports', key: 'reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings', key: 'settings' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          🇪🇹 Ethiopian ERP
        </Typography>
      </Toolbar>
      
      {/* Ethiopian Calendar Widget - Compact version for drawer */}
      <Box sx={{ p: 2 }}>
        <EthiopianCalendarWidget 
          compact={true} 
          showGregorianDate={false}
          showHolidays={false}
          showTime={false}
        />
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={ethiopianLanguageService.translate(item.key)} 
                secondary={item.text !== ethiopianLanguageService.translate(item.key) ? item.text : undefined}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            🇪🇹 Ethiopian Enterprise Resource Planning
          </Typography>
          
          {/* Ethiopian Language Switcher */}
          <Box sx={{ mr: 2 }}>
            <EthiopianLanguageSwitcher variant="compact" />
          </Box>
          
          <Typography variant="body2" sx={{ mr: 2 }}>
            {ethiopianLanguageService.getGreeting()}, {user?.firstName} {user?.lastName}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            {ethiopianLanguageService.translate('logout') || 'Logout'}
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
