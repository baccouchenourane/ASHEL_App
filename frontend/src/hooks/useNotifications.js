import { useState, useEffect, useCallback } from 'react';

/**
 * useNotifications Hook
 * Fetches and manages notifications for a citizen
 * @param {string|number} citoyenId - The citizen ID
 * @param {string} [type] - Optional notification type filter (e.g., 'SIGNALEMENT', 'RECLAMATION')
 */
export function useNotifications(citoyenId, type) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Get CIN from localStorage
  const getCin = useCallback(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user_ashel') || '{}');
      return user.cin || null;
    } catch {
      return null;
    }
  }, []);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    if (!citoyenId) return;
    
    setLoading(true);
    try {
      const cin = getCin();
      if (!cin) throw new Error('CIN not found');
      
      const response = await fetch(`/api/notifications/citoyen/${cin}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      
      let data = await response.json();
      
      // Filter by type if provided
      if (type) {
        data = data.filter(n => n.type === type);
      }
      
      setNotifications(data);
      
      // Count unread notifications
      const unread = data.filter(n => n.statut === 'NON_LU').length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback: return empty array
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [citoyenId, type, getCin]);

  // Mark single notification as read
  const markOne = useCallback(async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/mark-read`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, statut: 'LU' } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAll = useCallback(async () => {
    try {
      const cin = getCin();
      if (!cin) throw new Error('CIN not found');
      
      const response = await fetch(`/api/notifications/citoyen/${cin}/mark-all-read`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to mark all notifications as read');
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, statut: 'LU' }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [getCin]);

  // Refresh notifications
  const refresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Fetch on mount and when citoyenId changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markOne,
    markAll,
    refresh,
  };
}
