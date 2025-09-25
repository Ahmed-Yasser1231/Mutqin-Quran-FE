import { useState, useEffect, useCallback } from 'react';
import tutorDashboardService from './tutorDashboardService.js';
import authService from '../auth/authService.js';

export const useTutorDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Get current user data
  const userData = authService.getUserProfile();
  const tutorUsername = userData?.username;

  /**
   * Fetch tutor dashboard data
   */
  const fetchTutorSessions = useCallback(async (showLoading = true) => {
    if (!tutorUsername) {
      setError('لم يتم العثور على اسم المستخدم');
      return;
    }

    try {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      const response = await tutorDashboardService.getTutorSessions(tutorUsername);

      if (response.success) {
        setSessions(Array.isArray(response.data) ? response.data : []);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError(response.error || 'حدث خطأ أثناء جلب الجلسات');
        setSessions([]);
        
        // Handle token expiration
        if (response.code === 'TOKEN_EXPIRED') {
          authService.logout();
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Error in fetchTutorSessions:', error);
      setError('حدث خطأ غير متوقع');
      setSessions([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [tutorUsername]);

  /**
   * Refresh dashboard data
   */
  const refreshDashboard = useCallback(() => {
    fetchTutorSessions(false);
  }, [fetchTutorSessions]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get session statistics
   */
  const getSessionStats = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const todaySessions = sessions.filter(session => {
      const sessionDate = new Date(session.sessionDate);
      return sessionDate >= today && sessionDate < tomorrow;
    });

    const upcomingSessions = sessions.filter(session => {
      const sessionDate = new Date(session.sessionDate);
      return sessionDate >= tomorrow && sessionDate < nextWeek;
    });

    const totalUpcoming = sessions.filter(session => {
      const sessionDate = new Date(session.sessionDate);
      return sessionDate >= now;
    });

    return {
      today: todaySessions.length,
      upcoming: upcomingSessions.length,
      total: sessions.length,
      totalUpcoming: totalUpcoming.length
    };
  }, [sessions]);

  /**
   * Format session date for display
   */
  const formatSessionDate = useCallback((dateString) => {
    return tutorDashboardService.formatSessionDate(dateString);
  }, []);

  /**
   * Get session status
   */
  const getSessionStatus = useCallback((dateString) => {
    return tutorDashboardService.getSessionStatus(dateString);
  }, []);

  /**
   * Sort sessions by date (nearest first)
   */
  const sortedSessions = useCallback(() => {
    return [...sessions].sort((a, b) => {
      const dateA = new Date(a.sessionDate);
      const dateB = new Date(b.sessionDate);
      return dateA - dateB;
    });
  }, [sessions]);

  // Load data on component mount
  useEffect(() => {
    if (tutorUsername) {
      fetchTutorSessions();
    }
  }, [fetchTutorSessions, tutorUsername]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (tutorUsername && !isLoading) {
        refreshDashboard();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [tutorUsername, isLoading, refreshDashboard]);

  return {
    // Data
    sessions: sortedSessions(),
    userData,
    tutorUsername,
    
    // Status
    isLoading,
    error,
    refreshing,
    lastUpdated,
    
    // Stats
    sessionStats: getSessionStats(),
    
    // Actions
    fetchTutorSessions,
    refreshDashboard,
    clearError,
    
    // Utilities
    formatSessionDate,
    getSessionStatus
  };
};