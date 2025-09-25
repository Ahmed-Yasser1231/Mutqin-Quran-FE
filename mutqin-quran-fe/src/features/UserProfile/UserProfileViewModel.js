import { useState, useEffect, useCallback } from 'react';
import userProfileService from './userProfileService.js';

/**
 * Custom hook for user profile management
 * @returns {Object} - Profile state and functions
 */
export const useUserProfileViewModel = () => {
  // State management
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(userProfileService.isAuthenticated());

  /**
   * Check authentication status and update state
   */
  const checkAuthStatus = useCallback(() => {
    const authStatus = userProfileService.isAuthenticated();
    setIsAuthenticated(authStatus);
    return authStatus;
  }, []);

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
    setUpdateSuccess(false);
  }, []);

  /**
   * Fetch user profile data
   */
  const fetchProfile = useCallback(async () => {
    if (!checkAuthStatus()) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await userProfileService.getUserProfile();
      
      if (result.success) {
        setProfile(result.data);
      } else {
        setError(result.error || 'حدث خطأ أثناء جلب بيانات الملف الشخصي');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  }, [checkAuthStatus]);

  /**
   * Update user profile data
   * @param {Object} profileData - Updated profile data
   */
  const updateProfile = useCallback(async (profileData) => {
    if (!checkAuthStatus()) {
      setError('يجب تسجيل الدخول أولاً');
      return false;
    }

    setIsUpdating(true);
    setError(null);
    setUpdateSuccess(false);

    try {
      const result = await userProfileService.updateUserProfile(profileData);
      
      if (result.success) {
        setProfile(result.data);
        setUpdateSuccess(true);
        return true;
      } else {
        setError(result.error || 'حدث خطأ أثناء تحديث الملف الشخصي');
        return false;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('حدث خطأ غير متوقع');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [checkAuthStatus]);

  /**
   * Reload profile data (force refresh)
   */
  const reloadProfile = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  /**
   * Delete user account
   */
  const deleteAccount = useCallback(async () => {
    if (!checkAuthStatus()) {
      setError('يجب تسجيل الدخول أولاً');
      return false;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const result = await userProfileService.deleteUserAccount();
      
      if (result.success) {
        // Account deleted successfully - user will be automatically logged out by the service
        return {
          success: true,
          message: result.message || 'تم حذف الحساب بنجاح'
        };
      } else {
        setError(result.error || 'حدث خطأ أثناء حذف الحساب');
        return {
          success: false,
          error: result.error || 'حدث خطأ أثناء حذف الحساب'
        };
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('حدث خطأ غير متوقع');
      return {
        success: false,
        error: 'حدث خطأ غير متوقع'
      };
    } finally {
      setIsUpdating(false);
    }
  }, [checkAuthStatus]);

  // Auto-fetch profile on component mount if authenticated
  useEffect(() => {
    if (checkAuthStatus()) {
      fetchProfile();
    }
  }, [fetchProfile, checkAuthStatus]);

  // Periodically check auth status in case token expires
  useEffect(() => {
    const authCheckInterval = setInterval(() => {
      const currentAuthStatus = checkAuthStatus();
      if (!currentAuthStatus && profile) {
        // User was logged out, clear profile data
        setProfile(null);
        setError('انتهت صلاحية جلسة العمل. يرجى تسجيل الدخول مرة أخرى');
      }
    }, 60000); // Check every minute

    return () => clearInterval(authCheckInterval);
  }, [checkAuthStatus, profile]);

  return {
    // State
    profile,
    isLoading,
    error,
    isUpdating,
    updateSuccess,
    
    // Actions
    fetchProfile,
    updateProfile,
    reloadProfile,
    deleteAccount,
    clearError,
    clearSuccess,
    checkAuthStatus,
    
    // Computed values
    isAuthenticated,
  };
};

export default useUserProfileViewModel;