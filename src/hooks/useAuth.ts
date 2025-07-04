import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in production, this would validate against a real backend
    if (email && password.length >= 6) {
      const userData: User = {
        id: '1',
        name: email.split('@')[0],
        email: email,
        createdAt: new Date().toISOString()
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock signup - in production, this would create a user in the backend
    if (name && email && password.length >= 6) {
      const userData: User = {
        id: Date.now().toString(),
        name: name,
        email: email,
        createdAt: new Date().toISOString()
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      throw new Error('Invalid user data');
    }
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('gemini_api_key');
  };

  return {
    user,
    isAuthenticated,
    login,
    signup,
    logout
  };
};