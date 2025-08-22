import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Avatar,
  Menu,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Assignment as RoleIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
} from '@mui/icons-material';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  role: string;
  status: 'active' | 'inactive' | 'locked';
  lastLogin: string;
  createdDate: string;
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions] = useState<Permission[]>([
    { id: 'user_view', name: 'View Users', description: 'View user information', module: 'User Management' },
    { id: 'user_create', name: 'Create Users', description: 'Create new users', module: 'User Management' },
    { id: 'user_edit', name: 'Edit Users', description: 'Edit user information', module: 'User Management' },
    { id: 'user_delete', name: 'Delete Users', description: 'Delete users', module: 'User Management' },
    { id: 'purchase_view', name: 'View Purchases', description: 'View purchase orders', module: 'Purchase' },
    { id: 'purchase_create', name: 'Create Purchases', description: 'Create purchase orders', module: 'Purchase' },
    { id: 'purchase_approve', name: 'Approve Purchases', description: 'Approve purchase orders', module: 'Purchase' },
    { id: 'finance_view', name: 'View Finance', description: 'View financial data', module: 'Finance' },
    { id: 'finance_process', name: 'Process Payments', description: 'Process financial transactions', module: 'Finance' },
    { id: 'settings_view', name: 'View Settings', description: 'View system settings', module: 'Settings' },
    { id: 'settings_edit', name: 'Edit Settings', description: 'Edit system settings', module: 'Settings' },
  ]);

  const [userDialog, setUserDialog] = useState({ open: false, user: null as User | null, mode: 'create' as 'create' | 'edit' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', item: null as any });
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement | null; user: User | null }>({ el: null, user: null });
  const [successAlert, setSuccessAlert] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = () => {
    // Mock data - in real app, this would come from API
    setUsers([
      {
        id: '1',
        username: 'john.doe',
        email: 'john.doe@company.com',
        firstName: 'John',
        lastName: 'Doe',
        department: 'Finance',
        role: 'Finance Manager',
        status: 'active',
        lastLogin: '2024-08-22T10:30:00Z',
        createdDate: '2024-01-15T09:00:00Z',
        permissions: ['finance_view', 'finance_process', 'purchase_view'],
      },
      {
        id: '2',
        username: 'jane.smith',
        email: 'jane.smith@company.com',
        firstName: 'Jane',
        lastName: 'Smith',
        department: 'Purchase',
        role: 'Purchase Officer',
        status: 'active',
        lastLogin: '2024-08-22T08:15:00Z',
        createdDate: '2024-02-01T10:00:00Z',
        permissions: ['purchase_view', 'purchase_create'],
      },
      {
        id: '3',
        username: 'admin',
        email: 'admin@company.com',
        firstName: 'System',
        lastName: 'Administrator',
        department: 'IT',
        role: 'Administrator',
        status: 'active',
        lastLogin: '2024-08-22T14:00:00Z',
        createdDate: '2024-01-01T00:00:00Z',
        permissions: ['user_view', 'user_create', 'user_edit', 'user_delete', 'settings_view', 'settings_edit'],
      },
    ]);
  };

  const loadRoles = () => {
    // Mock data - in real app, this would come from API
    setRoles([
      {
        id: '1',
        name: 'Administrator',
        description: 'Full system access with all permissions',
        permissions: ['user_view', 'user_create', 'user_edit', 'user_delete', 'settings_view', 'settings_edit', 'purchase_view', 'purchase_create', 'purchase_approve', 'finance_view', 'finance_process'],
        userCount: 1,
      },
      {
        id: '2',
        name: 'Finance Manager',
        description: 'Financial operations and reporting access',
        permissions: ['finance_view', 'finance_process', 'purchase_view'],
        userCount: 3,
      },
      {
        id: '3',
        name: 'Purchase Officer',
        description: 'Purchase order creation and management',
        permissions: ['purchase_view', 'purchase_create'],
        userCount: 5,
      },
      {
        id: '4',
        name: 'Purchase Manager',
        description: 'Purchase oversight and approval authority',
        permissions: ['purchase_view', 'purchase_create', 'purchase_approve'],
        userCount: 2,
      },
      {
        id: '5',
        name: 'Viewer',
        description: 'Read-only access to permitted modules',
        permissions: ['purchase_view', 'finance_view'],
        userCount: 8,
      },
    ]);
  };

  const handleUserAction = (action: string, user?: User) => {
    setMenuAnchor({ el: null, user: null });
    
    switch (action) {
      case 'create':
        setUserDialog({ open: true, user: null, mode: 'create' });
        break;
      case 'edit':
        setUserDialog({ open: true, user: user!, mode: 'edit' });
        break;
      case 'delete':
        setDeleteDialog({ open: true, type: 'user', item: user });
        break;
      case 'lock':
        // Toggle user lock status
        if (user) {
          const newStatus = user.status === 'locked' ? 'active' : 'locked';
          setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
          setSuccessAlert(`User ${user.firstName} ${user.lastName} has been ${newStatus === 'locked' ? 'locked' : 'unlocked'}`);
          setTimeout(() => setSuccessAlert(''), 3000);
        }
        break;
    }
  };

  const handleRoleAction = (action: string, role?: Role) => {
    // Role management functionality will be implemented in a future update
    setSuccessAlert(`Role ${action} functionality will be implemented soon`);
    setTimeout(() => setSuccessAlert(''), 3000);
  };

  const handleSaveUser = (userData: any) => {
    if (userDialog.mode === 'create') {
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username || 'newuser',
        email: userData.email || 'user@example.com',
        firstName: userData.firstName || 'New',
        lastName: userData.lastName || 'User',
        department: userData.department || 'General',
        role: userData.role || 'User',
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdDate: new Date().toISOString(),
        permissions: userData.permissions || [],
      };
      setUsers([...users, newUser]);
      setSuccessAlert('User created successfully');
    } else {
      setUsers(users.map(u => u.id === userDialog.user?.id ? { ...u, ...userData } : u));
      setSuccessAlert('User updated successfully');
    }
    setUserDialog({ open: false, user: null, mode: 'create' });
    setTimeout(() => setSuccessAlert(''), 3000);
  };

  const handleDelete = () => {
    if (deleteDialog.type === 'user') {
      setUsers(users.filter(u => u.id !== deleteDialog.item.id));
      setSuccessAlert('User deleted successfully');
    } else if (deleteDialog.type === 'role') {
      setRoles(roles.filter(r => r.id !== deleteDialog.item.id));
      setSuccessAlert('Role deleted successfully');
    }
    setDeleteDialog({ open: false, type: '', item: null });
    setTimeout(() => setSuccessAlert(''), 3000);
  };

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'locked': return 'error';
      default: return 'default';
    }
  };

  const renderUsersTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">User Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleUserAction('create')}
        >
          Add User
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>{user.firstName[0]}{user.lastName[0]}</Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            @{user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getUserStatusColor(user.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => setMenuAnchor({ el: e.currentTarget, user })}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  const renderRolesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Role Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleRoleAction('create')}
        >
          Add Role
        </Button>
      </Box>

      <Grid container spacing={3}>
        {roles.map((role) => (
          <Grid item xs={12} md={6} lg={4} key={role.id}>
            <Card>
              <CardHeader
                avatar={<RoleIcon />}
                title={role.name}
                subheader={`${role.userCount} users`}
                action={
                  <IconButton onClick={() => handleRoleAction('edit', role)}>
                    <EditIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {role.description}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Permissions ({role.permissions.length})
                </Typography>
                <Box sx={{ maxHeight: 100, overflow: 'auto' }}>
                  {role.permissions.slice(0, 5).map((permId) => {
                    const perm = permissions.find(p => p.id === permId);
                    return perm ? (
                      <Chip
                        key={permId}
                        label={perm.name}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ) : null;
                  })}
                  {role.permissions.length > 5 && (
                    <Chip
                      label={`+${role.permissions.length - 5} more`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderPermissionsTab = () => {
    const groupedPermissions = permissions.reduce((groups, permission) => {
      const module = permission.module;
      if (!groups[module]) {
        groups[module] = [];
      }
      groups[module].push(permission);
      return groups;
    }, {} as Record<string, Permission[]>);

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          System Permissions
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Below are all available permissions in the system, organized by module.
        </Typography>

        {Object.entries(groupedPermissions).map(([module, perms]) => (
          <Accordion key={module} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{module} ({perms.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {perms.map((permission) => (
                  <ListItem key={permission.id}>
                    <ListItemIcon>
                      <SecurityIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={permission.name}
                      secondary={permission.description}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };

  return (
    <Box>
      {successAlert && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successAlert}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PersonIcon />} label="Users" />
          <Tab icon={<RoleIcon />} label="Roles" />
          <Tab icon={<SecurityIcon />} label="Permissions" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderUsersTab()}
          {activeTab === 1 && renderRolesTab()}
          {activeTab === 2 && renderPermissionsTab()}
        </Box>
      </Paper>

      {/* User Action Menu */}
      <Menu
        anchorEl={menuAnchor.el}
        open={Boolean(menuAnchor.el)}
        onClose={() => setMenuAnchor({ el: null, user: null })}
      >
        <MenuItem onClick={() => handleUserAction('edit', menuAnchor.user!)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={() => handleUserAction('lock', menuAnchor.user!)}>
          {menuAnchor.user?.status === 'locked' ? <UnlockIcon sx={{ mr: 1 }} /> : <LockIcon sx={{ mr: 1 }} />}
          {menuAnchor.user?.status === 'locked' ? 'Unlock User' : 'Lock User'}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleUserAction('delete', menuAnchor.user!)} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* User Dialog */}
      <Dialog open={userDialog.open} onClose={() => setUserDialog({ open: false, user: null, mode: 'create' })} maxWidth="md" fullWidth>
        <DialogTitle>
          {userDialog.mode === 'create' ? 'Create New User' : 'Edit User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                defaultValue={userDialog.user?.firstName || ''}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                defaultValue={userDialog.user?.lastName || ''}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                defaultValue={userDialog.user?.username || ''}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                defaultValue={userDialog.user?.email || ''}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select defaultValue={userDialog.user?.department || ''} label="Department">
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Purchase">Purchase</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Logistics">Logistics</MenuItem>
                  <MenuItem value="HR">Human Resources</MenuItem>
                  <MenuItem value="IT">Information Technology</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select defaultValue={userDialog.user?.role || ''} label="Role">
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.name}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {userDialog.mode === 'create' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      )
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    required
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialog({ open: false, user: null, mode: 'create' })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSaveUser({})} // In real app, collect form data
          >
            {userDialog.mode === 'create' ? 'Create User' : 'Update User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: '', item: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteDialog.type}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, type: '', item: null })}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
