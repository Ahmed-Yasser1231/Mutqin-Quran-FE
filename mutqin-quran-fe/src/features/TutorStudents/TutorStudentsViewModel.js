import { useState, useEffect, useCallback } from 'react';
import tutorStudentsService from './tutorStudentsService.js';
import authService from '../auth/authService.js';

export const useTutorStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, progress, memorizationLevel
  const [filterBy, setFilterBy] = useState('all'); // all, active, completed

  // Get current user data
  const userData = authService.getUserProfile();
  const tutorUsername = userData?.username;

  /**
   * Fetch tutor students data
   */
  const fetchTutorStudents = useCallback(async (showLoading = true) => {
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

      const response = await tutorStudentsService.getTutorStudents(tutorUsername);

      if (response.success) {
        setStudents(Array.isArray(response.data) ? response.data : []);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError(response.error || 'حدث خطأ أثناء جلب بيانات الطلاب');
        setStudents([]);
        
        // Handle token expiration
        if (response.code === 'TOKEN_EXPIRED') {
          authService.logout();
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Error in fetchTutorStudents:', error);
      setError('حدث خطأ غير متوقع');
      setStudents([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [tutorUsername]);

  /**
   * Refresh students data
   */
  const refreshStudents = useCallback(() => {
    fetchTutorStudents(false);
  }, [fetchTutorStudents]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get filtered and sorted students
   */
  const filteredAndSortedStudents = useCallback(() => {
    let filtered = [...students];

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(student => 
        (student.name && student.name.toLowerCase().includes(search)) ||
        (student.username && student.username.toLowerCase().includes(search)) ||
        (student.email && student.email.toLowerCase().includes(search))
      );
    }

    // Apply status filter
    if (filterBy !== 'all') {
      if (filterBy === 'active') {
        filtered = filtered.filter(student => 
          student.isActive !== false && student.status !== 'inactive'
        );
      } else if (filterBy === 'completed') {
        filtered = filtered.filter(student => 
          student.progress >= 100 || student.status === 'completed'
        );
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '', 'ar');
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'memorizationLevel':
          return (a.memorizationLevel || '').localeCompare(b.memorizationLevel || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [students, searchTerm, sortBy, filterBy]);

  /**
   * Get students statistics
   */
  const studentsStats = useCallback(() => {
    return tutorStudentsService.getStudentsStats(students);
  }, [students]);

  /**
   * Format memorization level
   */
  const formatMemorizationLevel = useCallback((level) => {
    return tutorStudentsService.formatMemorizationLevel(level);
  }, []);

  /**
   * Get progress status
   */
  const getProgressStatus = useCallback((progress) => {
    return tutorStudentsService.getProgressStatus(progress);
  }, []);

  // Load data on component mount
  useEffect(() => {
    if (tutorUsername) {
      fetchTutorStudents();
    }
  }, [fetchTutorStudents, tutorUsername]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (tutorUsername && !isLoading) {
        refreshStudents();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [tutorUsername, isLoading, refreshStudents]);

  return {
    // Data
    students: filteredAndSortedStudents(),
    allStudents: students,
    userData,
    tutorUsername,
    
    // Status
    isLoading,
    error,
    refreshing,
    lastUpdated,
    
    // Filters and search
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    
    // Stats
    studentsStats: studentsStats(),
    
    // Actions
    fetchTutorStudents,
    refreshStudents,
    clearError,
    
    // Utilities
    formatMemorizationLevel,
    getProgressStatus
  };
};