// hooks/useNotification.tsx
import { useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationState {
  isVisible: boolean;
  type: NotificationType;
  title: string;
  message: string;
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showNotification = useCallback((type: NotificationType, title: string, message: string) => {
    setNotification({ isVisible: true, type, title, message });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isVisible: false }));
    }, 5000);
  }, []);

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  return {
    notification,
    showNotification,
    hideNotification,
  };
}
