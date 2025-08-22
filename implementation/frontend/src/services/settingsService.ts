/**
 * Settings Service
 * Handles all settings-related API calls and data management
 */

// RBAC Permission Types
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export' | 'import' | 'manage';
export type SettingsCategory = 'profile' | 'security' | 'notifications' | 'preferences' | 'system' | 'backup' | 'users' | 'roles';

export interface Permission {
  id: string;
  category: SettingsCategory;
  action: PermissionAction;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Permission IDs
  isSystem: boolean; // System roles cannot be deleted
  level: number; // Hierarchy level (1 = highest)
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: string;
  expiresAt?: string;
}

export interface RBACContext {
  user: {
    id: string;
    roles: Role[];
    permissions: Permission[];
  };
  hasPermission: (category: SettingsCategory, action: PermissionAction) => boolean;
  canAccessTab: (tabIndex: number) => boolean;
}

export interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  bio: string;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  theme: string;
  sidebarCollapsed: boolean;
  tablePageSize: number;
}

export interface SystemSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  vatNumber: string;
  businessLicense: string;
  fiscalYearStart: string;
  baseCurrency: string;
  multiCurrency: boolean;
  autoBackup: boolean;
  backupFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  maintenanceMode: boolean;
  debugMode: boolean;
  apiRateLimit: number;
  sessionTimeout: number;
}

export interface NotificationSettings {
  purchaseOrders: 'all' | 'important' | 'none';
  financialTransactions: 'all' | 'important' | 'none';
  systemAlerts: 'all' | 'important' | 'none';
  inventoryAlerts: 'all' | 'important' | 'none';
  customsUpdates: 'all' | 'important' | 'none';
}

export interface SecuritySettings {
  passwordLastChanged: string;
  twoFactorEnabled: boolean;
  activeSessions: Array<{
    id: string;
    device: string;
    location: string;
    lastActive: string;
    current: boolean;
  }>;
  loginHistory: Array<{
    timestamp: string;
    device: string;
    location: string;
    ipAddress: string;
    success: boolean;
  }>;
}

export interface BackupInfo {
  lastBackup: string;
  nextScheduledBackup: string;
  backupSize: string;
  backupLocation: string;
  status: 'success' | 'failed' | 'in_progress';
}

export interface SystemHealth {
  database: {
    status: 'healthy' | 'warning' | 'error';
    connections: number;
    maxConnections: number;
    responseTime: number;
  };
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  uptime: string;
}

// Default Permissions for Settings Categories
const DEFAULT_PERMISSIONS: Permission[] = [
  // Profile Permissions
  { id: 'profile_view', category: 'profile', action: 'view', description: 'View profile information' },
  { id: 'profile_edit', category: 'profile', action: 'edit', description: 'Edit profile information' },
  
  // Security Permissions
  { id: 'security_view', category: 'security', action: 'view', description: 'View security settings' },
  { id: 'security_edit', category: 'security', action: 'edit', description: 'Edit security settings' },
  { id: 'security_manage', category: 'security', action: 'manage', description: 'Manage advanced security features' },
  
  // Notifications Permissions
  { id: 'notifications_view', category: 'notifications', action: 'view', description: 'View notification settings' },
  { id: 'notifications_edit', category: 'notifications', action: 'edit', description: 'Edit notification preferences' },
  
  // Preferences Permissions
  { id: 'preferences_view', category: 'preferences', action: 'view', description: 'View user preferences' },
  { id: 'preferences_edit', category: 'preferences', action: 'edit', description: 'Edit user preferences' },
  
  // System Permissions
  { id: 'system_view', category: 'system', action: 'view', description: 'View system settings' },
  { id: 'system_edit', category: 'system', action: 'edit', description: 'Edit system configuration' },
  { id: 'system_export', category: 'system', action: 'export', description: 'Export system settings' },
  { id: 'system_import', category: 'system', action: 'import', description: 'Import system settings' },
  
  // Backup Permissions
  { id: 'backup_view', category: 'backup', action: 'view', description: 'View backup settings' },
  { id: 'backup_create', category: 'backup', action: 'create', description: 'Create system backups' },
  { id: 'backup_manage', category: 'backup', action: 'manage', description: 'Manage backup operations and maintenance' },
  
  // User Management Permissions
  { id: 'users_view', category: 'users', action: 'view', description: 'View users and their information' },
  { id: 'users_create', category: 'users', action: 'create', description: 'Create new users' },
  { id: 'users_edit', category: 'users', action: 'edit', description: 'Edit user information' },
  { id: 'users_delete', category: 'users', action: 'delete', description: 'Delete users' },
  { id: 'users_manage', category: 'users', action: 'manage', description: 'Full user management access' },
  
  // Role Management Permissions
  { id: 'roles_view', category: 'roles', action: 'view', description: 'View roles and permissions' },
  { id: 'roles_create', category: 'roles', action: 'create', description: 'Create new roles' },
  { id: 'roles_edit', category: 'roles', action: 'edit', description: 'Edit roles and permissions' },
  { id: 'roles_delete', category: 'roles', action: 'delete', description: 'Delete roles' },
  { id: 'roles_manage', category: 'roles', action: 'manage', description: 'Full role management access' },
];

// Default Roles with Hierarchical Access
const DEFAULT_ROLES: Role[] = [
  {
    id: 'super',
    name: 'SUPER',
    description: 'Super Administrator with full system access',
    permissions: DEFAULT_PERMISSIONS.map(p => p.id), // All permissions
    isSystem: true,
    level: 1
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'System Administrator with most privileges',
    permissions: [
      'profile_view', 'profile_edit',
      'security_view', 'security_edit', 'security_manage',
      'notifications_view', 'notifications_edit',
      'preferences_view', 'preferences_edit',
      'system_view', 'system_edit', 'system_export',
      'backup_view', 'backup_create', 'backup_manage',
      'users_view', 'users_create', 'users_edit', 'users_delete',
      'roles_view', 'roles_edit'
    ],
    isSystem: true,
    level: 2
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Department Manager with limited administrative access',
    permissions: [
      'profile_view', 'profile_edit',
      'security_view', 'security_edit',
      'notifications_view', 'notifications_edit',
      'preferences_view', 'preferences_edit',
      'system_view',
      'backup_view',
      'users_view', 'users_create', 'users_edit',
      'roles_view'
    ],
    isSystem: true,
    level: 3
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Team Supervisor with basic management access',
    permissions: [
      'profile_view', 'profile_edit',
      'security_view', 'security_edit',
      'notifications_view', 'notifications_edit',
      'preferences_view', 'preferences_edit',
      'system_view',
      'users_view', 'users_edit',
      'roles_view'
    ],
    isSystem: true,
    level: 4
  },
  {
    id: 'user',
    name: 'Standard User',
    description: 'Standard user with basic access',
    permissions: [
      'profile_view', 'profile_edit',
      'security_view', 'security_edit',
      'notifications_view', 'notifications_edit',
      'preferences_view', 'preferences_edit'
    ],
    isSystem: true,
    level: 5
  },
  {
    id: 'readonly',
    name: 'Read Only',
    description: 'Read-only access to settings',
    permissions: [
      'profile_view',
      'security_view',
      'notifications_view',
      'preferences_view',
      'system_view',
      'backup_view',
      'users_view',
      'roles_view'
    ],
    isSystem: true,
    level: 6
  }
];

// Tab to Category Mapping
const TAB_CATEGORIES: SettingsCategory[] = [
  'profile',      // Tab 0: Profile
  'security',     // Tab 1: Security
  'notifications', // Tab 2: Notifications
  'preferences',  // Tab 3: Preferences
  'system',       // Tab 4: System
  'backup',       // Tab 5: Backup & Maintenance
  'users'         // Tab 6: User Management
];

class SettingsService {
  private currentUser: any = null;
  private userRoles: Role[] = [];
  private userPermissions: Permission[] = [];

  // Initialize RBAC for current user
  async initializeRBAC(userId: string): Promise<RBACContext> {
    try {
      // In a real app, fetch from API
      const userRoles = await this.getUserRoles(userId);
      const userPermissions = await this.getUserPermissions(userId);
      
      this.userRoles = userRoles;
      this.userPermissions = userPermissions;
      
      return {
        user: {
          id: userId,
          roles: userRoles,
          permissions: userPermissions
        },
        hasPermission: this.hasPermission.bind(this),
        canAccessTab: this.canAccessTab.bind(this)
      };
    } catch (error) {
      console.error('Error initializing RBAC:', error);
      // Fallback to minimal permissions
      return {
        user: { id: userId, roles: [], permissions: [] },
        hasPermission: () => false,
        canAccessTab: () => false
      };
    }
  }

  // Check if user has specific permission
  hasPermission(category: SettingsCategory, action: PermissionAction): boolean {
    // SUPER role has all permissions
    if (this.userRoles.some(role => role.name === 'SUPER')) {
      return true;
    }

    // Check if user has the specific permission
    const permissionId = `${category}_${action}`;
    return this.userPermissions.some(permission => permission.id === permissionId);
  }

  // Check if user can access a specific tab
  canAccessTab(tabIndex: number): boolean {
    if (tabIndex < 0 || tabIndex >= TAB_CATEGORIES.length) {
      return false;
    }

    const category = TAB_CATEGORIES[tabIndex];
    return this.hasPermission(category, 'view');
  }

  // Get available permissions
  async getAvailablePermissions(): Promise<Permission[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(DEFAULT_PERMISSIONS), 100);
    });
  }

  // Get all roles
  async getAllRoles(): Promise<Role[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...DEFAULT_ROLES]), 100);
    });
  }

  // Get user roles
  async getUserRoles(userId: string): Promise<Role[]> {
    return new Promise((resolve) => {
      // Mock implementation - in real app, fetch from API
      let mockRoles: Role[];
      
      if (userId === 'super-admin') {
        mockRoles = [DEFAULT_ROLES.find(r => r.name === 'SUPER')!];
      } else if (userId === 'admin-user') {
        mockRoles = [DEFAULT_ROLES.find(r => r.name === 'Administrator')!];
      } else if (userId === 'manager-user') {
        mockRoles = [DEFAULT_ROLES.find(r => r.name === 'Manager')!];
      } else {
        mockRoles = [DEFAULT_ROLES.find(r => r.name === 'Standard User')!];
      }
      
      setTimeout(() => resolve(mockRoles), 100);
    });
  }

  // Get user permissions (derived from roles)
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const userRoles = await this.getUserRoles(userId);
    const permissionIds = new Set<string>();
    
    userRoles.forEach(role => {
      role.permissions.forEach(permissionId => {
        permissionIds.add(permissionId);
      });
    });

    const userPermissions = DEFAULT_PERMISSIONS.filter(permission => 
      permissionIds.has(permission.id)
    );

    return userPermissions;
  }

  // Create new role
  async createRole(roleData: Partial<Role>): Promise<Role> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!roleData.name || !roleData.description) {
          reject(new Error('Role name and description are required'));
          return;
        }

        const newRole: Role = {
          id: `role_${Date.now()}`,
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions || [],
          isSystem: false,
          level: 10 // Custom roles get lower priority
        };

        resolve(newRole);
      }, 500);
    });
  }

  // Update role
  async updateRole(roleId: string, roleData: Partial<Role>): Promise<Role> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingRole = DEFAULT_ROLES.find(r => r.id === roleId);
        if (!existingRole) {
          reject(new Error('Role not found'));
          return;
        }

        if (existingRole.isSystem && roleData.name && roleData.name !== existingRole.name) {
          reject(new Error('Cannot modify system role name'));
          return;
        }

        const updatedRole: Role = {
          ...existingRole,
          ...roleData,
          id: roleId // Ensure ID doesn't change
        };

        resolve(updatedRole);
      }, 500);
    });
  }

  // Delete role
  async deleteRole(roleId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const role = DEFAULT_ROLES.find(r => r.id === roleId);
        if (!role) {
          reject(new Error('Role not found'));
          return;
        }

        if (role.isSystem) {
          reject(new Error('Cannot delete system role'));
          return;
        }

        resolve();
      }, 500);
    });
  }

  // Assign role to user
  async assignRoleToUser(userId: string, roleId: string): Promise<UserRole> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const role = DEFAULT_ROLES.find(r => r.id === roleId);
        if (!role) {
          reject(new Error('Role not found'));
          return;
        }

        const userRole: UserRole = {
          userId,
          roleId,
          assignedBy: 'current-user-id', // Would be actual current user
          assignedAt: new Date().toISOString()
        };

        resolve(userRole);
      }, 500);
    });
  }

  // Remove role from user
  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }

  // Get role hierarchy (for role assignment restrictions)
  getRoleHierarchy(): Role[] {
    return [...DEFAULT_ROLES].sort((a, b) => a.level - b.level);
  }

  // Check if user can assign/modify a specific role
  canManageRole(currentUserRoles: Role[], targetRole: Role): boolean {
    // SUPER can manage all roles
    if (currentUserRoles.some(role => role.name === 'SUPER')) {
      return true;
    }

    // Users can only manage roles with lower hierarchy level
    const currentUserMaxLevel = Math.min(...currentUserRoles.map(role => role.level));
    return targetRole.level > currentUserMaxLevel;
  }
  private baseUrl = '/api/settings';

  // User Settings
  async getUserSettings(): Promise<UserSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/user`);
      if (!response.ok) throw new Error('Failed to fetch user settings');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user settings:', error);
      // Return mock data for development
      return {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+251 911 123456',
        department: 'Finance',
        jobTitle: 'Finance Manager',
        bio: 'Finance manager with 5+ years of experience in Ethiopian market.',
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
      };
    }
  }

  async updateUserSettings(settings: Partial<UserSettings>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error('Failed to update user settings');
    } catch (error) {
      console.error('Error updating user settings:', error);
      // Mock success for development
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // System Settings
  async getSystemSettings(): Promise<SystemSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/system`);
      if (!response.ok) throw new Error('Failed to fetch system settings');
      return await response.json();
    } catch (error) {
      console.error('Error fetching system settings:', error);
      // Return mock data for development
      return {
        companyName: 'Ethiopian Import/Export Co.',
        companyAddress: 'Bole Sub-city, Addis Ababa, Ethiopia',
        companyPhone: '+251 111 234567',
        companyEmail: 'info@ethio-import-export.com',
        vatNumber: 'VAT123456789',
        businessLicense: 'BL987654321',
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
      };
    }
  }

  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/system`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error('Failed to update system settings');
    } catch (error) {
      console.error('Error updating system settings:', error);
      // Mock success for development
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Security Settings
  async getSecuritySettings(): Promise<SecuritySettings> {
    try {
      const response = await fetch(`${this.baseUrl}/security`);
      if (!response.ok) throw new Error('Failed to fetch security settings');
      return await response.json();
    } catch (error) {
      console.error('Error fetching security settings:', error);
      // Return mock data for development
      return {
        passwordLastChanged: '2024-07-22T10:30:00Z',
        twoFactorEnabled: false,
        activeSessions: [
          {
            id: '1',
            device: 'Chrome on Windows',
            location: 'Addis Ababa, Ethiopia',
            lastActive: '2024-08-22T14:30:00Z',
            current: true,
          },
        ],
        loginHistory: [
          {
            timestamp: '2024-08-22T08:00:00Z',
            device: 'Chrome on Windows',
            location: 'Addis Ababa, Ethiopia',
            ipAddress: '192.168.1.100',
            success: true,
          },
        ],
      };
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!response.ok) throw new Error('Failed to change password');
    } catch (error) {
      console.error('Error changing password:', error);
      // Mock success for development
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async enableTwoFactor(): Promise<{ qrCode: string; secret: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/2fa/enable`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to enable 2FA');
      return await response.json();
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      // Return mock data for development
      return {
        qrCode: 'data:image/png;base64,mockqrcode',
        secret: 'JBSWY3DPEHPK3PXP',
      };
    }
  }

  async disableTwoFactor(code: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/2fa/disable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error('Failed to disable 2FA');
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      // Mock success for development
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  async terminateSession(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to terminate session');
    } catch (error) {
      console.error('Error terminating session:', error);
      // Mock success for development
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Backup & Maintenance
  async getBackupInfo(): Promise<BackupInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/backup/info`);
      if (!response.ok) throw new Error('Failed to fetch backup info');
      return await response.json();
    } catch (error) {
      console.error('Error fetching backup info:', error);
      // Return mock data for development
      return {
        lastBackup: '2024-08-22T02:00:00Z',
        nextScheduledBackup: '2024-08-23T02:00:00Z',
        backupSize: '2.3 GB',
        backupLocation: '/backups/erp-system',
        status: 'success',
      };
    }
  }

  async createBackup(type: 'full' | 'database' | 'configuration'): Promise<{ jobId: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/backup/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });
      if (!response.ok) throw new Error('Failed to create backup');
      return await response.json();
    } catch (error) {
      console.error('Error creating backup:', error);
      // Return mock data for development
      return { jobId: 'job-' + Date.now() };
    }
  }

  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) throw new Error('Failed to fetch system health');
      return await response.json();
    } catch (error) {
      console.error('Error fetching system health:', error);
      // Return mock data for development
      return {
        database: {
          status: 'healthy',
          connections: 15,
          maxConnections: 100,
          responseTime: 45,
        },
        storage: {
          used: 75.2,
          total: 100,
          percentage: 75.2,
        },
        memory: {
          used: 4.2,
          total: 8,
          percentage: 52.5,
        },
        cpu: {
          usage: 23.4,
          cores: 4,
        },
        uptime: '15 days, 8 hours, 23 minutes',
      };
    }
  }

  async clearCache(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/cache/clear`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to clear cache');
    } catch (error) {
      console.error('Error clearing cache:', error);
      // Mock success for development
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async exportLogs(startDate: string, endDate: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/logs/export?start=${startDate}&end=${endDate}`);
      if (!response.ok) throw new Error('Failed to export logs');
      return await response.blob();
    } catch (error) {
      console.error('Error exporting logs:', error);
      // Return mock blob for development
      return new Blob(['Mock log data'], { type: 'text/plain' });
    }
  }

  // Notification Settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications`);
      if (!response.ok) throw new Error('Failed to fetch notification settings');
      return await response.json();
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      // Return mock data for development
      return {
        purchaseOrders: 'all',
        financialTransactions: 'important',
        systemAlerts: 'all',
        inventoryAlerts: 'important',
        customsUpdates: 'all',
      };
    }
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error('Failed to update notification settings');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      // Mock success for development
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Import/Export Settings
  async exportSettings(): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/export`);
      if (!response.ok) throw new Error('Failed to export settings');
      return await response.blob();
    } catch (error) {
      console.error('Error exporting settings:', error);
      // Return mock blob for development
      const mockSettings = {
        userSettings: await this.getUserSettings(),
        systemSettings: await this.getSystemSettings(),
        notificationSettings: await this.getNotificationSettings(),
      };
      return new Blob([JSON.stringify(mockSettings, null, 2)], { type: 'application/json' });
    }
  }

  async importSettings(file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('settings', file);
      
      const response = await fetch(`${this.baseUrl}/import`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to import settings');
    } catch (error) {
      console.error('Error importing settings:', error);
      // Mock success for development
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export const settingsService = new SettingsService();
export default settingsService;
