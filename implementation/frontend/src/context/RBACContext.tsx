import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { settingsService, RBACContext as RBACContextType, Role, Permission, SettingsCategory, PermissionAction } from '../services/settingsService';

interface RBACProviderProps {
  children: ReactNode;
  userId?: string;
}

const RBACContext = createContext<RBACContextType | null>(null);

export const RBACProvider: React.FC<RBACProviderProps> = ({ children, userId = 'current-user' }) => {
  const [rbacContext, setRBACContext] = useState<RBACContextType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeRBAC = async () => {
      try {
        setLoading(true);
        setError(null);
        const context = await settingsService.initializeRBAC(userId);
        setRBACContext(context);
      } catch (err) {
        console.error('Failed to initialize RBAC:', err);
        setError('Failed to load user permissions');
        // Set minimal fallback context
        setRBACContext({
          user: { id: userId, roles: [], permissions: [] },
          hasPermission: () => false,
          canAccessTab: () => false
        });
      } finally {
        setLoading(false);
      }
    };

    initializeRBAC();
  }, [userId]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        fontSize: '14px',
        color: '#666'
      }}>
        Loading permissions...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        fontSize: '14px',
        color: '#f44336'
      }}>
        {error}
      </div>
    );
  }

  return (
    <RBACContext.Provider value={rbacContext}>
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

// Hook for checking specific permissions
export const usePermission = (category: SettingsCategory, action: PermissionAction): boolean => {
  const rbac = useRBAC();
  return rbac.hasPermission(category, action);
};

// Hook for checking tab access
export const useTabAccess = (tabIndex: number): boolean => {
  const rbac = useRBAC();
  return rbac.canAccessTab(tabIndex);
};

// Hook for getting user roles
export const useUserRoles = (): Role[] => {
  const rbac = useRBAC();
  return rbac.user.roles;
};

// Hook for getting user permissions
export const useUserPermissions = (): Permission[] => {
  const rbac = useRBAC();
  return rbac.user.permissions;
};

// Component for conditional rendering based on permissions
interface PermissionGateProps {
  category: SettingsCategory;
  action: PermissionAction;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({ 
  category, 
  action, 
  children, 
  fallback = null 
}) => {
  const hasPermission = usePermission(category, action);
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

// Component for role-based rendering
interface RoleGateProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({ 
  allowedRoles, 
  children, 
  fallback = null 
}) => {
  const userRoles = useUserRoles();
  const hasAllowedRole = userRoles.some(role => allowedRoles.includes(role.name));
  return hasAllowedRole ? <>{children}</> : <>{fallback}</>;
};

export default RBACContext;
