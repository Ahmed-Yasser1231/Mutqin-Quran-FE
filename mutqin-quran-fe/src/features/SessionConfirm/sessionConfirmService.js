import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'https://mutqin-springboot-backend-1.onrender.com';

// Create axios instance with default config
const sessionConfirmApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Add auth token to requests
sessionConfirmApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const sessionConfirmService = {
  /**
   * Search for student by email or username
   * @param {string} emailOrUsername - Student's email or username
   * @returns {Promise<Object>} - Response data from the server
   */
  async searchStudent(emailOrUsername) {
    try {
      const response = await sessionConfirmApi.get(`/api/profile/search`, {
        params: {
          emailOrUsername: emailOrUsername
        }
      });
      
      return {
        success: true,
        data: response.data,
        message: 'تم العثور على الطالب بنجاح'
      };
    } catch (error) {
      console.error('Search student error:', error);
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || 'حدث خطأ في البحث عن الطالب';
        
        if (status === 404) {
          return {
            success: false,
            message: 'لم يتم العثور على الطالب',
            errorCode: 'STUDENT_NOT_FOUND',
            code: 'STUDENT_NOT_FOUND'
          };
        } else if (status === 400) {
          return {
            success: false,
            message: 'بيانات البحث غير صحيحة',
            errorCode: 'INVALID_SEARCH_DATA',
            code: 'INVALID_SEARCH_DATA'
          };
        } else if (status === 401) {
          return {
            success: false,
            message: 'يجب تسجيل الدخول أولاً',
            errorCode: 'UNAUTHORIZED',
            code: 'UNAUTHORIZED'
          };
        } else {
          return {
            success: false,
            message: message,
            errorCode: 'SEARCH_ERROR',
            code: 'SEARCH_ERROR'
          };
        }
      } else if (error.request) {
        // Network error
        return {
          success: false,
          message: 'تحقق من اتصالك بالإنترنت',
          errorCode: 'NETWORK_ERROR',
          code: 'NETWORK_ERROR'
        };
      } else {
        // Other error
        return {
          success: false,
          message: 'حدث خطأ غير متوقع',
          errorCode: 'UNKNOWN_ERROR',
          code: 'UNKNOWN_ERROR'
        };
      }
    }
  },

  /**
   * Confirm session with event UUID, student ID, and tutor ID
   * @param {string} eventUuid - Event UUID
   * @param {number} studentId - Student ID
   * @param {number} tutorId - Tutor ID
   * @returns {Promise<Object>} - Response data from the server
   */
  async confirmSession(eventUuid, studentId, tutorId) {
    try {
      const response = await sessionConfirmApi.post(`/students/sessions/confirm`, null, {
        params: {
          eventUuid: eventUuid,
          studentId: studentId,
          tutorId: tutorId
        }
      });
      
      return {
        success: true,
        data: response.data,
        message: 'تم تأكيد الجلسة بنجاح'
      };
    } catch (error) {
      console.error('Confirm session error:', error);
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || 'حدث خطأ في تأكيد الجلسة';
        
        if (status === 404) {
          return {
            success: false,
            message: 'لم يتم العثور على الجلسة أو المعرف غير صحيح',
            errorCode: 'SESSION_NOT_FOUND',
            code: 'SESSION_NOT_FOUND'
          };
        } else if (status === 400) {
          return {
            success: false,
            message: 'بيانات الجلسة غير صحيحة',
            errorCode: 'INVALID_SESSION_DATA',
            code: 'INVALID_SESSION_DATA'
          };
        } else if (status === 401) {
          return {
            success: false,
            message: 'يجب تسجيل الدخول أولاً',
            errorCode: 'UNAUTHORIZED',
            code: 'UNAUTHORIZED'
          };
        } else if (status === 403) {
          return {
            success: false,
            message: 'غير مسموح لك بتأكيد هذه الجلسة',
            errorCode: 'FORBIDDEN',
            code: 'FORBIDDEN'
          };
        } else if (status === 409) {
          return {
            success: false,
            message: 'تم تأكيد الجلسة مسبقاً',
            errorCode: 'ALREADY_CONFIRMED',
            code: 'ALREADY_CONFIRMED'
          };
        } else {
          return {
            success: false,
            message: message,
            errorCode: 'CONFIRM_ERROR',
            code: 'CONFIRM_ERROR'
          };
        }
      } else if (error.request) {
        // Network error
        return {
          success: false,
          message: 'تحقق من اتصالك بالإنترنت',
          errorCode: 'NETWORK_ERROR',
          code: 'NETWORK_ERROR'
        };
      } else {
        // Other error
        return {
          success: false,
          message: 'حدث خطأ غير متوقع',
          errorCode: 'UNKNOWN_ERROR',
          code: 'UNKNOWN_ERROR'
        };
      }
    }
  },

  /**
   * Get current tutor ID from stored user data
   * @returns {number|null} - Tutor ID or null if not found
   */
  getCurrentTutorId() {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const tutorId = user.id || user.userId || null;
        return tutorId ? parseInt(tutorId, 10) : null;
      }
      
      // Fallback to userId
      const userId = localStorage.getItem('userId');
      if (userId) {
        const parsedId = parseInt(userId, 10);
        return isNaN(parsedId) ? null : parsedId;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting tutor ID:', error);
      return null;
    }
  },

  /**
   * Validate event UUID format
   * @param {string} eventUuid - Event UUID to validate
   * @returns {boolean} - True if valid UUID format
   */
  isValidEventUuid(eventUuid) {
    if (!eventUuid || typeof eventUuid !== 'string') {
      return false;
    }
    
    // UUID v4 pattern
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(eventUuid);
  },

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid email format
   */
  isValidEmail(email) {
    if (!email || typeof email !== 'string') {
      return false;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
};

export default sessionConfirmService;