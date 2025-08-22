import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  department?: string;
  jobTitle?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  quickLogin: (username: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const DEMO_USERS: User[] = [
  {
    id: 1,
    username: 'super.admin',
    email: 'super.admin@erp.com',
    firstName: 'Super',
    lastName: 'Administrator',
    roles: ['SUPER'],
    department: 'IT',
    jobTitle: 'System Administrator'
  },
  {
    id: 2,
    username: 'admin',
    email: 'admin@erp.com',
    firstName: 'John',
    lastName: 'Admin',
    roles: ['Administrator'],
    department: 'IT',
    jobTitle: 'IT Manager'
  },
  {
    id: 3,
    username: 'manager',
    email: 'manager@erp.com',
    firstName: 'Sarah',
    lastName: 'Manager',
    roles: ['Manager'],
    department: 'Operations',
    jobTitle: 'Operations Manager'
  },
  {
    id: 4,
    username: 'supervisor',
    email: 'supervisor@erp.com',
    firstName: 'Mike',
    lastName: 'Supervisor',
    roles: ['Supervisor'],
    department: 'Sales',
    jobTitle: 'Sales Supervisor'
  },
  {
    id: 5,
    username: 'user',
    email: 'user@erp.com',
    firstName: 'Jane',
    lastName: 'User',
    roles: ['Standard User'],
    department: 'Marketing',
    jobTitle: 'Marketing Specialist'
  },
  {
    id: 6,
    username: 'readonly',
    email: 'readonly@erp.com',
    firstName: 'Bob',
    lastName: 'Viewer',
    roles: ['Read Only'],
    department: 'Finance',
    jobTitle: 'Financial Analyst'
  }
];

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export demo users for login page
export { DEMO_USERS };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token in localStorage
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Find user by username
      const user = DEMO_USERS.find(u => u.username === username);
      
      if (user && password === 'password') { // Simple password for demo
        const mockToken = 'mock-jwt-token';
        
        setUser(user);
        setToken(mockToken);
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('authUser', JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const quickLogin = (username: string): Promise<boolean> => {
    return login(username, 'password');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    loading,
    quickLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
