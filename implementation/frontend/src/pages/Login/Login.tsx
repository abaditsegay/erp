import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Card,
  CardContent,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    const handleUsernameClick = (username: string) => {
        setUsername(username);
        setPassword('secret'); // All test users use 'secret' as password
    };  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{ width: '100%', mt: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Ethiopian ERP System
            </Typography>
            <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
              የኢትዮጵያ ኢንተርፕራይዝ ሪሶርስ ፕላኒንግ
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Ethiopian ERP System - Comprehensive Business Management
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                🔐 Test User Credentials (All users password: <span style={{color: '#1976d2', fontWeight: 'bold'}}>secret</span>)
              </Typography>
              
              <Typography variant="caption" color="primary" sx={{ mt: 1, mb: 2, display: 'block', fontStyle: 'italic', fontWeight: 'bold' }}>
                💡 Click any username below to auto-fill both username and password fields
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, fontSize: '0.75rem' }}>
                <Box 
                  sx={{ cursor: 'pointer', p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => handleUsernameClick('admin')}
                >
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                    👑 System Admin
                  </Typography>
                  <Typography variant="caption" display="block">
                    Username: <strong>admin</strong>
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ cursor: 'pointer', p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => handleUsernameClick('inventory_mgr')}
                >
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                    📦 Inventory Manager
                  </Typography>
                  <Typography variant="caption" display="block">
                    Username: <strong>inventory_mgr</strong>
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ cursor: 'pointer', p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => handleUsernameClick('purchase_mgr')}
                >
                  <Typography variant="caption" color="info.main" sx={{ fontWeight: 'bold' }}>
                    🛒 Purchase Manager
                  </Typography>
                  <Typography variant="caption" display="block">
                    Username: <strong>purchase_mgr</strong>
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ cursor: 'pointer', p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => handleUsernameClick('sales_mgr')}
                >
                  <Typography variant="caption" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    💰 Sales Manager
                  </Typography>
                  <Typography variant="caption" display="block">
                    Username: <strong>sales_mgr</strong>
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ cursor: 'pointer', p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => handleUsernameClick('finance_mgr')}
                >
                  <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                    🏦 Finance Manager
                  </Typography>
                  <Typography variant="caption" display="block">
                    Username: <strong>finance_mgr</strong>
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ cursor: 'pointer', p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => handleUsernameClick('warehouse_op')}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                    🏭 Warehouse Operator
                  </Typography>
                  <Typography variant="caption" display="block">
                    Username: <strong>warehouse_op</strong>
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ cursor: 'pointer', p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => handleUsernameClick('basic_user')}
                >
                  <Typography variant="caption" color="text.primary" sx={{ fontWeight: 'bold' }}>
                    👤 Basic User
                  </Typography>
                  <Typography variant="caption" display="block">
                    Username: <strong>basic_user</strong>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
