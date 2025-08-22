import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar
} from '@mui/material';
import { useAuth, DEMO_USERS } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (username: string) => {
    setLoading(true);
    setError('');

    try {
      const success = await quickLogin(username);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Quick login failed');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'SUPER': '#f44336',
      'Administrator': '#ff9800',
      'Manager': '#2196f3',
      'Supervisor': '#4caf50',
      'Standard User': '#9c27b0',
      'Read Only': '#607d8b'
    };
    return colors[role] || '#607d8b';
  };

  const getAvatarInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          ERP System
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Enterprise Resource Planning Solution
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Manual Login Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom textAlign="center">
              Manual Login
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                disabled={loading}
              />
              <TextField
                fullWidth
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                disabled={loading}
              />
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Box>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Demo Credentials
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Password for all users: <strong>password</strong>
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Access Role Selection */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom textAlign="center">
              Quick Access by Role
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
              Click any user card to login instantly and test role-based permissions
            </Typography>

            <Grid container spacing={2}>
              {DEMO_USERS.map((user) => (
                <Grid item xs={12} key={user.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        elevation: 4,
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => handleQuickLogin(user.username)}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            bgcolor: getRoleColor(user.roles[0]),
                            width: 40,
                            height: 40,
                            fontSize: '0.875rem'
                          }}
                        >
                          {getAvatarInitials(user.firstName, user.lastName)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.jobTitle} • {user.department}
                          </Typography>
                        </Box>
                        <Chip
                          label={user.roles[0]}
                          size="small"
                          sx={{
                            bgcolor: getRoleColor(user.roles[0]),
                            color: 'white',
                            fontWeight: 'medium'
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        @{user.username}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        disabled={loading}
                        sx={{ textTransform: 'none' }}
                      >
                        Login as {user.roles[0]}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Each role demonstrates different access levels in the Settings section
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          SUPER has full access • Administrator manages system • Manager handles operations • 
          Supervisor oversees teams • Standard User has basic access • Read Only can only view
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
