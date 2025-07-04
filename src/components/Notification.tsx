import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  isVisible,
  onClose,
}) => {
  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-500" />,
    error: <XCircle className="w-6 h-6 text-red-500" />,
    warning: <AlertCircle className="w-6 h-6 text-yellow-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const progressColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3, type: 'spring', damping: 25 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm w-full sm:w-96"
        >
          <div className={`${colors[type]} border rounded-xl shadow-lg overflow-hidden`}>
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className={`h-1 ${progressColors[type]}`}
            />
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1">{title}</h4>
                  <p className="text-sm opacity-90 leading-relaxed">{message}</p>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-white hover:bg-opacity-20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default Notification;