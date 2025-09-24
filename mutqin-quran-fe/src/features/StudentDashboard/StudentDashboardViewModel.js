import { useState, useEffect, useCallback } from 'react';
import studentDashboardService from './studentDashboardService.js';

/**
 * Custom hook for student dashboard management
 * @returns {Object} - Dashboard state and functions
 */
export const useStudentDashboard = () => {
  // State management
  const [sessions, setSessions] = useState([]);
  const [progress, setProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionsError, setSessionsError] = useState(null);
  const [progressError, setProgressError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
    setSessionsError(null);
    setProgressError(null);
  }, []);

  /**
   * Format session date for display
   * @param {string} dateString - ISO date string
   * @returns {Object} - Formatted date components
   */
  const formatSessionDate = useCallback((dateString) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('ar-SA'),
        time: date.toLocaleTimeString('ar-SA', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        dayOfWeek: date.toLocaleDateString('ar-SA', { weekday: 'long' }),
        isUpcoming: date > new Date(),
        isPast: date < new Date()
      };
    } catch (error) {
      console.error('Error formatting date:', error);
      return {
        date: 'تاريخ غير صحيح',
        time: '',
        dayOfWeek: '',
        isUpcoming: false,
        isPast: false
      };
    }
  }, []);

  /**
   * Get session status in Arabic
   * @param {string} status - Session status
   * @returns {Object} - Status text and color
   */
  const getSessionStatus = useCallback((status) => {
    const statusMap = {
      'upcoming': { text: 'قادمة', color: '#2196F3', bgColor: '#E3F2FD' },
      'completed': { text: 'مكتملة', color: '#4CAF50', bgColor: '#E8F5E8' },
      'cancelled': { text: 'ملغاة', color: '#F44336', bgColor: '#FFEBEE' },
      'in-progress': { text: 'جارية', color: '#FF9800', bgColor: '#FFF3E0' }
    };
    
    return statusMap[status] || { text: status, color: '#757575', bgColor: '#F5F5F5' };
  }, []);

  /**
   * Translate memorization level to Arabic
   * @param {string} level - Memorization level in English
   * @returns {string} - Memorization level in Arabic
   */
  const translateMemorizationLevel = useCallback((level) => {
    if (!level) return 'غير محدد';
    
    const levelMap = {
      'BEGINNER': 'مبتدئ',
      'INTERMEDIATE': 'متوسط',
      'ADVANCED': 'متقدم',
      'HAFIZ': 'حافظ',
      'EXPERT': 'خبير',
      'MASTER': 'أستاذ',
      'Beginner': 'مبتدئ',
      'Intermediate': 'متوسط',
      'Advanced': 'متقدم',
      'Hafiz': 'حافظ',
      'Expert': 'خبير',
      'Master': 'أستاذ'
    };
    
    return levelMap[level] || level;
  }, []);

  /**
   * Calculate progress statistics
   * @param {Array} progressData - Progress data array
   * @returns {Object} - Calculated statistics
   */
  const calculateProgressStats = useCallback((progressData) => {
    if (!progressData || progressData.length === 0) {
      return {
        totalPoints: 0,
        totalNewPages: 0,
        totalSessions: 0,
        averagePoints: 0,
        currentLevel: 'غير محدد',
        latestProgress: null
      };
    }

    const totalPoints = progressData.reduce((sum, item) => sum + parseInt(item.points || 0), 0);
    const totalNewPages = progressData.reduce((sum, item) => sum + parseInt(item.newLearnedPages || 0), 0);
    const totalSessions = progressData.reduce((sum, item) => sum + parseInt(item.sessionsAttended || 0), 0);
    const averagePoints = progressData.length > 0 ? Math.round(totalPoints / progressData.length) : 0;
    
    // Get the latest progress entry
    const latestProgress = progressData.reduce((latest, item) => {
      const itemDate = new Date(item.updatedAt);
      const latestDate = new Date(latest.updatedAt);
      return itemDate > latestDate ? item : latest;
    }, progressData[0]);

    const rawLevel = latestProgress?.memorizationLevel || latestProgress?.user?.memorizationleveltype || 'غير محدد';
    const currentLevel = translateMemorizationLevel(rawLevel);

    return {
      totalPoints,
      totalNewPages,
      totalSessions,
      averagePoints,
      currentLevel,
      latestProgress
    };
  }, [translateMemorizationLevel]);

  /**
   * Fetch dashboard data (sessions and progress)
   */
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSessionsError(null);
    setProgressError(null);

    try {
      const result = await studentDashboardService.getDashboardData();
      
      if (result.success) {
        setSessions(result.data.sessions || []);
        setProgress(result.data.progress || []);
        setSessionsError(result.data.sessionsError);
        setProgressError(result.data.progressError);
        setLastUpdated(new Date());
      } else {
        setError(result.error || 'حدث خطأ أثناء جلب بيانات لوحة التحكم');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch only sessions data
   */
  const fetchSessions = useCallback(async () => {
    try {
      const result = await studentDashboardService.getStudentSessions();
      
      if (result.success) {
        setSessions(result.data || []);
        setSessionsError(null);
      } else {
        setSessionsError(result.error || 'حدث خطأ أثناء جلب بيانات الجلسات');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessionsError('حدث خطأ غير متوقع');
    }
  }, []);

  /**
   * Fetch only progress data
   */
  const fetchProgress = useCallback(async () => {
    try {
      const result = await studentDashboardService.getStudentProgress();
      
      if (result.success) {
        setProgress(result.data || []);
        setProgressError(null);
      } else {
        setProgressError(result.error || 'حدث خطأ أثناء جلب بيانات التقدم');
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgressError('حدث خطأ غير متوقع');
    }
  }, []);

  // Load data when component mounts
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    // State
    sessions,
    progress,
    isLoading,
    error,
    sessionsError,
    progressError,
    lastUpdated,
    
    // Computed values
    progressStats: calculateProgressStats(progress),
    
    // Actions
    fetchDashboardData,
    fetchSessions,
    fetchProgress,
    clearError,
    
    // Utility functions
    formatSessionDate,
    getSessionStatus,
    translateMemorizationLevel
  };
};

export default useStudentDashboard;