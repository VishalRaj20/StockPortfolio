import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, password: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onSignup }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLoginMode) {
        await onLogin(formData.email, formData.password);
      } else {
        await onSignup(formData.name, formData.email, formData.password);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
    setShowPassword(false);
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-5 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {isLoginMode ? 'Welcome Back!' : 'Create an Account'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
                {!isLoginMode && (
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.name}
                      required
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Full Name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    required
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    required
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isLoginMode ? 'Signing In...' : 'Signing Up...'}</span>
                    </div>
                  ) : (
                    isLoginMode ? 'Sign In' : 'Sign Up'
                  )}
                </button>

                <p className="text-center text-sm text-gray-600">
                  {isLoginMode ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    {isLoginMode ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </form>

              <div className="bg-gray-100 px-6 py-4 text-xs text-center text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
