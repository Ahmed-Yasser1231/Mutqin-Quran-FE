import { useState } from 'react';
import sessionService from './sessionService.js';
import userProfileService from '../UserProfile/userProfileService.js';

// Custom hook for session booking management (ViewModel)
const useBookSessionViewModel = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingData, setBookingData] = useState(null);

  // Book a session and redirect to Calendly
  const bookSession = async (providedStudentId, tutorId) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    let studentId = providedStudentId;
    
    // If student ID is not provided, try to fetch it from current user using search API
    if (!studentId) {
      try {
        setSuccess('جاري جلب معرف الطالب من بياناتك...');
        const userResult = await userProfileService.getCurrentUserId();
        if (userResult.success) {
          studentId = userResult.userId;
          setSuccess('تم جلب معرف الطالب بنجاح');
        } else {
          const errorMessage = `فشل في جلب معرف الطالب: ${userResult.error || 'خطأ غير معروف'}`;
          setError(errorMessage);
          setLoading(false);
          return {
            success: false,
            message: errorMessage
          };
        }
      } catch (error) {
        console.error('Error fetching current user ID:', error);
        const errorMessage = 'حدث خطأ أثناء جلب معرف الطالب من البحث بالبريد الإلكتروني';
        setError(errorMessage);
        setLoading(false);
        return {
          success: false,
          message: errorMessage
        };
      }
    }
    
    // Validate required parameters
    if (!studentId || !tutorId) {
      const errorMessage = 'معرف الطالب ومعرف المعلم مطلوبان';
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        message: errorMessage
      };
    }
    
    try {
      const result = await sessionService.bookSession(studentId, tutorId);
      
      if (result.success) {
        setBookingData(result.data);
        setSuccess(result.message);
        
        // Check if we have a scheduling URL to redirect to
        if (result.data?.scheduling_url) {
          // Show success message briefly, then redirect
          setTimeout(() => {
            window.location.href = result.data.scheduling_url;
          }, 2000); // 2 second delay to show success message
          
          return {
            success: true,
            redirectUrl: result.data.scheduling_url,
            message: result.data.message || 'جاري التوجيه إلى صفحة الحجز...'
          };
        } else {
          setError('لم يتم الحصول على رابط الحجز');
          return {
            success: false,
            message: 'لم يتم الحصول على رابط الحجز'
          };
        }
      } else {
        setError(result.message || 'فشل في حجز الجلسة');
        return {
          success: false,
          message: result.message || 'فشل في حجز الجلسة'
        };
      }
    } catch (err) {
      console.error('Error booking session:', err);
      const errorMessage = 'حدث خطأ غير متوقع أثناء حجز الجلسة';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };



  // Get user sessions
  const getUserSessions = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await sessionService.getUserSessions();
      
      if (result.success) {
        setSuccess(result.message);
        return {
          success: true,
          data: result.data,
          message: result.message
        };
      } else {
        setError(result.message || 'فشل في جلب الجلسات');
        return {
          success: false,
          message: result.message || 'فشل في جلب الجلسات'
        };
      }
    } catch (err) {
      console.error('Error getting user sessions:', err);
      const errorMessage = 'حدث خطأ غير متوقع أثناء جلب الجلسات';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Clear booking data
  const clearBookingData = () => {
    setBookingData(null);
    clearMessages();
  };

  return {
    // State
    loading,
    error,
    success,
    bookingData,
    
    // Actions
    bookSession,
    getUserSessions,
    clearMessages,
    clearBookingData,
  };
};

export default useBookSessionViewModel;