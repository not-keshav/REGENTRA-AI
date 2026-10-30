/**
 * REGENTRA AI - Authentication Context & Role Management
 * Supports RBAC for 5 roles and seamless demo account switching
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  switchUserRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch initial users list
  useEffect(() => {
    async function initAuth() {
      try {
        const res = await fetch('/api/auth/users');
        const data = await res.json();
        if (data.success && data.users?.length > 0) {
          setAllUsers(data.users);
          // Check saved session
          const savedUserId = localStorage.getItem('regentra_user_id');
          const found = data.users.find((u: User) => u.id === savedUserId);
          if (found) {
            setCurrentUser(found);
          } else {
            // Default to Super Admin Dr. R. K. Shrivastava for full system access demonstration
            setCurrentUser(data.users[0]);
          }
        }
      } catch (err) {
        console.error('Failed to initialize users:', err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email: string, role?: UserRole): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem('regentra_user_id', data.user.id);
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
    }
    return false;
  };

  const switchUserRole = async (role: UserRole): Promise<void> => {
    const targetUser = allUsers.find(u => u.role === role) || allUsers[0];
    if (targetUser) {
      await login(targetUser.email, role);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('regentra_user_id');
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, switchUserRole, logout, allUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
