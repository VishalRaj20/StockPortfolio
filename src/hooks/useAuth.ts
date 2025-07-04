import { useState, useEffect } from 'react';
import { User } from '../types';
import { mongodbService } from '../services/mongodbService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Initialize MongoDB connection
        mongodbService.initialize()
          .then(success => {
            if (!success) {
              console.error('Failed to initialize MongoDB connection on startup');
            }
          })
          .catch(err => {
            console.error('Error initializing MongoDB:', err);
          });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    } else {
      // Still initialize MongoDB even if no user is logged in
      mongodbService.initialize()
        .catch(err => console.error('Error initializing MongoDB:', err));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      console.log(`Attempting to login user: ${email}`);
      
      // Authenticate with MongoDB
      const userData = await mongodbService.loginUser(email, password);
      
      console.log('Login successful, setting user data');
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw new Error((error as Error).message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      console.log(`Attempting to register new user: ${email}`);
      
      // Register user with MongoDB
      const userData = await mongodbService.registerUser(name, email, password);
      
      console.log('Registration successful, setting user data');
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error((error as Error).message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update user profile in MongoDB
      const updatedUser = await mongodbService.updateUserProfile(user.id, updates);
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      throw new Error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('gemini_api_key');
    // Ensure API key is removed on signout
    localStorage.removeItem('apiKey');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    updateProfile,
    logout
  };
};