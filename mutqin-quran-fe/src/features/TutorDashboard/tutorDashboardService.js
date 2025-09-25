import axios from 'axios';
import authService from '../auth/authService.js';

// Base URL for the tutor dashboard API
const API_BASE_URL = 'https://mutqin-springboot-backend-1.onrender.com';

// Create axios instance with default config
const tutorDashboardApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Add request interceptor to include auth token
tutorDashboardApi.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});

const tutorDashboardService = {
  /**
   * Get tutor's upcoming sessions by username
   * @param {string} username - Tutor's username
   * @returns {Promise<Object>} - Response data from the server
   */
  async getTutorSessions(username) {
    try {
      if (!username) {
        return {
          success: false,
          error: 'اسم المستخدم مطلوب',
          code: 'USERNAME_REQUIRED'
        };
      }

      const response = await tutorDashboardApi.get(`/students/sheikh/${username}`);
      
      return {
        success: true,
        data: response.data,
        message: 'تم جلب الجلسات بنجاح'
      };
    } catch (error) {
      console.error('Error fetching tutor sessions:', error);
      
      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        switch (status) {
          case 401:
            return {
              success: false,
              error: 'انتهت صلاحية جلسة المستخدم',
              code: 'TOKEN_EXPIRED'
            };
          case 404:
            return {
              success: false,
              error: 'لم يتم العثور على المعلم أو لا توجد جلسات',
              code: 'TUTOR_NOT_FOUND'
            };
          case 403:
            return {
              success: false,
              error: 'ليس لديك صلاحية للوصول لهذه البيانات',
              code: 'ACCESS_DENIED'
            };
          case 500:
            return {
              success: false,
              error: 'خطأ في الخادم أثناء جلب الجلسات',
              code: 'SERVER_ERROR'
            };
          default:
            return {
              success: false,
              error: serverMessage || 'خطأ في جلب بيانات الجلسات',
              code: 'FETCH_ERROR'
            };
        }
      } else if (error.request) {
        return {
          success: false,
          error: 'لا يمكن الاتصال بالخادم لجلب الجلسات',
          code: 'NETWORK_ERROR'
        };
      } else {
        return {
          success: false,
          error: 'حدث خطأ غير متوقع أثناء جلب الجلسات',
          code: 'UNEXPECTED_ERROR'
        };
      }
    }
  },

  /**
   * Format session date for display
   * @param {string} dateString - Date string from API
   * @returns {string} - Formatted date string in Arabic
   */
  formatSessionDate(dateString) {
    try {
      const date = new Date(dateString);
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      
      return date.toLocaleDateString('ar-EG', options);
    } catch (error) {
      console.warn('Error formatting date:', error);
      return dateString;
    }
  },

  /**
   * Get session status based on date and current time
   * @param {string} dateString - Session date string
   * @returns {Object} - Status object with color and text
   */
  getSessionStatus(dateString) {
    try {
      const sessionDate = new Date(dateString);
      const now = new Date();
      const timeDiff = sessionDate.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);

      if (hoursDiff < 0) {
        return {
          status: 'past',
          text: 'منتهية',
          color: '#757575',
          bgColor: '#f5f5f5'
        };
      } else if (hoursDiff < 1) {
        return {
          status: 'soon',
          text: 'قريباً',
          color: '#ff9800',
          bgColor: '#fff3e0'
        };
      } else if (hoursDiff < 24) {
        return {
          status: 'today',
          text: 'اليوم',
          color: '#2196f3',
          bgColor: '#e3f2fd'
        };
      } else {
        return {
          status: 'upcoming',
          text: 'قادمة',
          color: '#4caf50',
          bgColor: '#e8f5e8'
        };
      }
    } catch (error) {
      console.warn('Error getting session status:', error);
      return {
        status: 'unknown',
        text: 'غير محدد',
        color: '#757575',
        bgColor: '#f5f5f5'
      };
    }
  }
};

export default tutorDashboardService;