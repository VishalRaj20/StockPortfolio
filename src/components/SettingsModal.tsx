import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Save, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string;
  onSaveApiKey: (apiKey: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentApiKey,
  onSaveApiKey
}) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save delay
      onSaveApiKey(apiKey.trim());
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setApiKey(currentApiKey);
    setShowApiKey(false);
    onClose();
  };

  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const hasEnvApiKey = envApiKey && envApiKey !== 'your_gemini_api_key_here';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Key className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Environment API Key Status */}
                {hasEnvApiKey ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-green-800 mb-1">
                          API Key Loaded from Environment
                        </h3>
                        <p className="text-xs text-green-700">
                          Your Gemini API key is automatically loaded from the .env.local file. 
                          All features are enabled and working.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800 mb-1">
                          No Environment API Key Found
                        </h3>
                        <p className="text-xs text-yellow-700">
                          Add your Gemini API key to the .env.local file for automatic loading, 
                          or enter it manually below.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Manual API Key Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gemini API Key {hasEnvApiKey && '(Override)'}
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={hasEnvApiKey ? "Override environment API key" : "Enter your Gemini API key"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {hasEnvApiKey 
                      ? "This will override the API key from your .env.local file"
                      : "Your API key is stored locally and used to fetch real-time news and AI analysis"
                    }
                  </p>
                </div>

                {/* Environment Setup Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-800 mb-1">
                        Environment Setup (Recommended)
                      </h3>
                      <ol className="text-xs text-blue-700 space-y-1">
                        <li>1. Create a .env.local file in your project root</li>
                        <li>2. Add: VITE_GEMINI_API_KEY=your_actual_api_key</li>
                        <li>3. Restart the development server</li>
                        <li>4. The API key will be loaded automatically</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* API Key Instructions */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Key className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 mb-1">
                        How to get your Gemini API Key
                      </h3>
                      <ol className="text-xs text-gray-700 space-y-1">
                        <li>1. Visit Google AI Studio (aistudio.google.com)</li>
                        <li>2. Sign in with your Google account</li>
                        <li>3. Click "Get API Key" in the left sidebar</li>
                        <li>4. Create a new API key or use an existing one</li>
                        <li>5. Copy and paste the key here or in .env.local</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Features enabled with API key */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-800 mb-2">
                    Features enabled with API key:
                  </h3>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Real-time news analysis and sentiment detection</li>
                    <li>• AI-powered portfolio insights and recommendations</li>
                    <li>• Automatic news categorization and filtering</li>
                    <li>• Smart notifications for portfolio-relevant news</li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!apiKey.trim() || isSaving}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSaving ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>Save API Key</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;