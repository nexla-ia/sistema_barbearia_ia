import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user roles
export type UserRole = 'client' | 'employee' | 'admin';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  password?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  isAuthenticated: boolean;
  hasPermission: (requiredRole: UserRole) => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the token with your backend
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock login - in production, this would call your API
      // This is just for demonstration purposes
      if (email === 'admin@example.com' && password === 'password') {
        const adminUser: User = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
      } else if (email === 'employee@example.com' && password === 'password') {
        const employeeUser: User = {
          id: 'emp-1',
          name: 'Employee User',
          email: 'employee@example.com',
          role: 'employee',
        };
        setUser(employeeUser);
        localStorage.setItem('user', JSON.stringify(employeeUser));
      } else if (email === 'client@example.com' && password === 'password') {
        const clientUser: User = {
          id: 'client-1',
          name: 'Client User',
          email: 'client@example.com',
          role: 'client',
        };
        setUser(clientUser);
        localStorage.setItem('user', JSON.stringify(clientUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError((err as Error).message);
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: UserRole = 'client') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock registration - in production, this would call your API
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (err) {
      setError((err as Error).message);
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has required role
  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    // Role hierarchy: admin > employee > client
    if (user.role === 'admin') return true;
    if (user.role === 'employee' && requiredRole !== 'admin') return true;
    if (user.role === 'client' && requiredRole === 'client') return true;
    
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        register,
        updateUser,
        isAuthenticated: !!user,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}