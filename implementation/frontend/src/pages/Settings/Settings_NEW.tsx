import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Switch,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  FormControlLabel,
  RadioGroup,
  Radio,
  Slider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link,
  Fab,
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Storage as SystemIcon,
  Backup as BackupIcon,
  Assignment as AuditIcon,
  PhotoCamera as CameraIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Group as UserManagementIcon,
  Upload as UploadIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { settingsService, UserSettings, SystemSettings } from '../../services/settingsService';
import UserManagement from './UserManagement';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [backupDialog, setBackupDialog] = useState(false);
  const [successAlert, setSuccessAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [importDialog, setImportDialog] = useState(false);

  // Settings state
  const [userSettings, setUserSettings] = useState<UserSettings>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    jobTitle: '',
    bio: '',
    language: 'en',
    timezone: 'Africa/Addis_Ababa',
    dateFormat: 'DD/MM/YYYY',
    currency: 'ETB',
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    theme: 'light',
    sidebarCollapsed: false,
    tablePageSize: 25,
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    vatNumber: '',
    businessLicense: '',
    fiscalYearStart: '07-01',
    baseCurrency: 'ETB',
    multiCurrency: true,
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 90,
    maintenanceMode: false,
    debugMode: false,
    apiRateLimit: 1000,
    sessionTimeout: 30,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [userSettingsData, systemSettingsData] = await Promise.all([
        settingsService.getUserSettings(),
        settingsService.getSystemSettings(),
      ]);
      setUserSettings(userSettingsData);
      setSystemSettings(systemSettingsData);
    } catch (error) {
      console.error('Error loading settings:', error);
      setSuccessAlert('Error loading settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUserSettingChange = (setting: string, value: any) => {
    setUserSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSystemSettingChange = (setting: string, value: any) => {
    setSystemSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSaveSettings = async (category: string) => {
    try {
      setLoading(true);
      if (category === 'Profile') {
        await settingsService.updateUserSettings(userSettings);
      } else if (category === 'System') {
        await settingsService.updateSystemSettings(systemSettings);
      }
      setSuccessAlert(`${category} settings saved successfully!`);
      setTimeout(() => setSuccessAlert(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSuccessAlert('Error saving settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async (type: 'full' | 'database' | 'configuration') => {
    try {
      await settingsService.createBackup(type);
      setSuccessAlert(`${type} backup initiated successfully!`);
      setBackupDialog(false);
      setTimeout(() => setSuccessAlert(''), 3000);
    } catch (error) {
      console.error('Error creating backup:', error);
      setSuccessAlert('Error creating backup. Please try again.');
    }
  };

  const handleExportSettings = async () => {
    try {
      const blob = await settingsService.exportSettings();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `erp-settings-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccessAlert('Settings exported successfully!');
      setTimeout(() => setSuccessAlert(''), 3000);
    } catch (error) {
      console.error('Error exporting settings:', error);
      setSuccessAlert('Error exporting settings. Please try again.');
    }
  };

  const handleImportSettings = async (file: File) => {
    try {
      await settingsService.importSettings(file);
      setSuccessAlert('Settings imported successfully! Please refresh the page.');
      setImportDialog(false);
      setTimeout(() => setSuccessAlert(''), 3000);
    } catch (error) {
      console.error('Error importing settings:', error);
      setSuccessAlert('Error importing settings. Please try again.');
    }
  };

  return (
    <Box>
      {/* Breadcrumbs */}
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
        <Typography color="text.primary">Settings</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          System Settings
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Configure your ERP system preferences, security settings, and system parameters for optimal performance.
        </Typography>
      </Box>

      {/* Success Alert */}
      {successAlert && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successAlert}
        </Alert>
      )}

      {/* Settings Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PersonIcon />} label="Profile" />
          <Tab icon={<SecurityIcon />} label="Security" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
          <Tab icon={<LanguageIcon />} label="Preferences" />
          <Tab icon={<SystemIcon />} label="System" />
          <Tab icon={<BackupIcon />} label="Backup & Maintenance" />
          <Tab icon={<UserManagementIcon />} label="User Management" />
        </Tabs>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            User Profile Settings
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Manage your personal information and account preferences.
          </Typography>
          {/* Profile content will be rendered here */}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Security Settings
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Configure authentication and security preferences.
          </Typography>
          {/* Security content will be rendered here */}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Notification Settings
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Manage how and when you receive notifications.
          </Typography>
          {/* Notifications content will be rendered here */}
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Preferences
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Customize your interface and regional settings.
          </Typography>
          {/* Preferences content will be rendered here */}
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <Typography variant="h6" gutterBottom>
            System Configuration
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Configure company information and system-wide settings.
          </Typography>
          {/* System content will be rendered here */}
        </TabPanel>

        <TabPanel value={activeTab} index={5}>
          <Typography variant="h6" gutterBottom>
            Backup & Maintenance
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Manage system backups and maintenance operations.
          </Typography>
          {/* Backup content will be rendered here */}
        </TabPanel>

        <TabPanel value={activeTab} index={6}>
          <UserManagement />
        </TabPanel>
      </Paper>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="settings"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setSuccessAlert('Quick settings functionality will be implemented')}
      >
        <SettingsIcon />
      </Fab>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                await settingsService.changePassword('currentPassword', 'newPassword');
                setChangePasswordOpen(false);
                setSuccessAlert('Password updated successfully!');
                setTimeout(() => setSuccessAlert(''), 3000);
              } catch (error) {
                setSuccessAlert('Error updating password. Please try again.');
              }
            }}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Backup Dialog */}
      <Dialog open={backupDialog} onClose={() => setBackupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create System Backup</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Choose the type of backup you want to create:
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<BackupIcon />}
                onClick={() => handleBackup('full')}
                sx={{ justifyContent: 'flex-start', p: 2 }}
              >
                <Box>
                  <Typography variant="subtitle2">Full System Backup</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Complete backup including database, files, and configuration
                  </Typography>
                </Box>
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<BackupIcon />}
                onClick={() => handleBackup('database')}
                sx={{ justifyContent: 'flex-start', p: 2 }}
              >
                <Box>
                  <Typography variant="subtitle2">Database Only</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Backup only the database content
                  </Typography>
                </Box>
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<BackupIcon />}
                onClick={() => handleBackup('configuration')}
                sx={{ justifyContent: 'flex-start', p: 2 }}
              >
                <Box>
                  <Typography variant="subtitle2">Configuration Only</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Backup system settings and configuration
                  </Typography>
                </Box>
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackupDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Import Settings Dialog */}
      <Dialog open={importDialog} onClose={() => setImportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Upload a settings file to import configuration:
          </Typography>
          <Box sx={{ mt: 2, p: 3, border: '2px dashed', borderColor: 'grey.300', borderRadius: 1, textAlign: 'center' }}>
            <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography variant="body2" color="textSecondary">
              Click to select a settings file (.json)
            </Typography>
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              id="settings-upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImportSettings(file);
                }
              }}
            />
            <label htmlFor="settings-upload">
              <Button variant="outlined" component="span" sx={{ mt: 1 }}>
                Choose File
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
