'use client';

import { useEffect } from 'react';

export default function NotificationHandler() {
  useEffect(() => {
    // Request notification permission if not yet decided
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        // Notification.requestPermission();
      }
    }

    // Listen for new critical alerts
    const handleNewAlert = (event: any) => {
      const alert = event.detail;
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(alert.title || 'CRITICAL SATELLITE FIRE ALERT', {
          body: alert.message || 'Severe thermal anomaly detected near industrial facilities.',
          icon: '/favicon.ico',
        });
      }
    };

    window.addEventListener('satellite_alert_broadcast', handleNewAlert);
    return () => window.removeEventListener('satellite_alert_broadcast', handleNewAlert);
  }, []);

  return null;
}
