import { useState, useEffect } from 'react';

export const useRealTimeData = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Simulate connection status
    const checkConnection = () => {
      setIsConnected(navigator.onLine);
      setLastUpdate(new Date());
    };

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    // Listen for online/offline events
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  return {
    isConnected,
    lastUpdate
  };
};