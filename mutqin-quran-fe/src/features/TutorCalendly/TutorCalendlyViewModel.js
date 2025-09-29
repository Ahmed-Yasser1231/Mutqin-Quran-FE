import { useState, useCallback } from 'react';
import calendlyService from './tutorCalendlyService';
import authService from '../auth/authService';

export const useTutorCalendlyViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear success state
   */
  const clearSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  /**
   * Update tutor's Calendly session link
   * @param {string} sessionLink - Calendly session link
   * @returns {Promise<Object>} - Update result
   */
  const updateSessionLink = useCallback(async (sessionLink) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get current user data
      const userData = authService.getUserProfile();
      const username = userData?.username || userData?.name;

      if (!username) {
        setError('لا يمكن الحصول على بيانات المستخدم');
        setIsLoading(false);
        return {
          success: false,
          error: 'لا يمكن الحصول على بيانات المستخدم'
        };
      }

      // Validate the link format
      if (!calendlyService.validateCalendlyLink(sessionLink)) {
        setError('رابط Calendly غير صحيح. يجب أن يكون بالصيغة: https://calendly.com/username/meeting-name');
        setIsLoading(false);
        return {
          success: false,
          error: 'رابط Calendly غير صحيح'
        };
      }

      // Call service to update the link
      const result = await calendlyService.updateSessionLink(username, sessionLink);

      if (result.success) {
        setSuccess(true);
        setIsLoading(false);
        return {
          success: true,
          message: result.message
        };
      } else {
        setError(result.error);
        setIsLoading(false);
        return {
          success: false,
          error: result.error,
          code: result.code
        };
      }
    } catch (error) {
      console.error('Update session link error in ViewModel:', error);
      const errorMessage = 'حدث خطأ غير متوقع أثناء تحديث رابط الجلسات';
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  /**
   * Validate Calendly link format
   * @param {string} link - Link to validate
   * @returns {boolean} - True if valid
   */
  const validateLink = useCallback((link) => {
    return calendlyService.validateCalendlyLink(link);
  }, []);

  return {
    // State
    isLoading,
    error,
    success,
    
    // Actions
    updateSessionLink,
    clearError,
    clearSuccess,
    
    // Utilities
    validateLink
  };
};