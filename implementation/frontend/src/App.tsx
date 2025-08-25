import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './contexts/AuthContext';
import { MockDataProvider } from './contexts/MockDataProvider';
import { PurchaseDataProvider } from './contexts/PurchaseDataProvider';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Inventory from './pages/Inventory/Inventory';
import Purchase from './pages/Purchase/Purchase';
import Finance from './pages/Finance/Finance';
import Logistics from './pages/Logistics/Logistics';
import Sales from './pages/Sales/Sales';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdvancedAnalyticsDashboard from './components/AdvancedAnalyticsDashboard';
import AdvancedInventoryManagement from './components/AdvancedInventoryManagement';
import './App.css';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
                    <AuthProvider>
            <MockDataProvider>
              <PurchaseDataProvider>
                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="analytics" element={<AdvancedAnalyticsDashboard />} />
                      <Route path="inventory/*" element={<Inventory />} />
                      <Route path="inventory-advanced" element={<AdvancedInventoryManagement />} />
                      <Route path="purchase/*" element={<Purchase />} />
                      <Route path="finance/*" element={<Finance />} />
                      <Route path="logistics/*" element={<Logistics />} />
                      <Route path="sales/*" element={<Sales />} />
                      <Route path="reports/*" element={<Reports />} />
                      <Route path="settings/*" element={<Settings />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Router>
              </PurchaseDataProvider>
            </MockDataProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
