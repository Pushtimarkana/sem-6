// src/context/NotificationContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getLoggedInUser } from "../services/authService";
import { getUserById } from "../services/userService";
import { buildNotifications, getReadIds, saveReadIds } from "../services/notificationService";
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const loggedUser = getLoggedInUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const refresh = useCallback(async () => {
    if (!loggedUser?.userId) return;
    setLoading(true);
    try {
      const res      = await getUserById(loggedUser.userId);
      const tasks    = res.data?.assignedTasks ?? [];
      const readIds  = getReadIds(loggedUser.userId);
      const built    = buildNotifications(tasks, readIds);
      setNotifications(built);
    } catch (e) {
      console.error("Notification load failed:", e);
    } finally {
      setLoading(false);
    }
  }, [loggedUser?.userId]);

  // Load on mount + poll every 60 seconds
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const markRead = useCallback((id) => {
    setNotifications(prev => {
      const updated  = prev.map(n => n.id === id ? { ...n, read: true } : n);
      const readIds  = updated.filter(n => n.read).map(n => n.id);
      saveReadIds(loggedUser?.userId, readIds);
      return updated;
    });
  }, [loggedUser?.userId]);

  const markAllRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      saveReadIds(loggedUser?.userId, updated.map(n => n.id));
      return updated;
    });
  }, [loggedUser?.userId]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, refresh, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);