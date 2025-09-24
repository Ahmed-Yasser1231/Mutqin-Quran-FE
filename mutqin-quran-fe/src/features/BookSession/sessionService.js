import axios from 'axios';
import authService from '../auth/authService.js';

// Base URL for the session booking API
const SESSION_API_BASE_URL = 'https://mutqin-springboot-backend-1.onrender.com/students/sessions';

// Create axios instance with default config
const sessionApi = axios.create({
  baseURL: SESSION_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Add request interceptor to automatically include auth token
sessionApi.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = token; // Token is already formatted as "Bearer {token}"
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
sessionApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, logout user
      authService.logout();
      // Optionally redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Session booking service functions
const sessionService = {
  /**
   * Book a session and get Calendly redirect URL
   * @param {number} studentId - Student's ID
   * @param {number} tutorId - Tutor's ID
   * @returns {Promise<Object>} - Response data from the server
   */
  async bookSession(studentId, tutorId) {
    try {
      const response = await sessionApi.post('/book', {
        studentId,
        tutorId
      });
      
      return {
        success: true,
        data: response.data,
        message: 'تم إنشاء رابط الحجز بنجاح'
      };
    } catch (error) {
      console.error('Book session error:', error);
      
      // Handle different types of errors
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'حدث خطأ في الخادم';
        
        switch (status) {
          case 400:
            return {
              success: false,
              message: 'طلب غير صحيح - تحقق من البيانات المرسلة',
              error: message
            };
          case 401:
            return {
              success: false,
              message: 'غير مصرح لك بحجز الجلسات - يرجى تسجيل الدخول',
              error: message
            };
          case 403:
            return {
              success: false,
              message: 'ممنوع الوصول - تحقق من صلاحياتك',
              error: message
            };
          case 404:
            return {
              success: false,
              message: 'خدمة الحجز غير متاحة حالياً',
              error: message
            };
          case 409:
            return {
              success: false,
              message: 'لديك جلسة محجوزة بالفعل',
              error: message
            };
          case 500:
            return {
              success: false,
              message: 'خطأ في الخادم الداخلي - يرجى المحاولة مرة أخرى',
              error: message
            };
          default:
            return {
              success: false,
              message: `خطأ غير متوقع: ${status}`,
              error: message
            };
        }
      } else if (error.request) {
        // Network error or no response received
        return {
          success: false,
          message: 'فشل في الاتصال بالخادم. تحقق من اتصال الإنترنت.',
          error: 'Network error'
        };
      } else {
        // Something else happened
        return {
          success: false,
          message: 'حدث خطأ غير متوقع أثناء الحجز',
          error: error.message
        };
      }
    }
  },

  /**
   * Get user's booked sessions (if available)
   * @returns {Promise<Object>} - Response data from the server
   */
  async getUserSessions() {
    try {
      const response = await sessionApi.get('/my-sessions');
      
      return {
        success: true,
        data: response.data,
        message: 'تم جلب الجلسات بنجاح'
      };
    } catch (error) {
      console.error('Get user sessions error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'حدث خطأ في الخادم';
        
        switch (status) {
          case 404:
            return {
              success: false,
              message: 'لا توجد جلسات محجوزة',
              error: message
            };
          default:
            return {
              success: false,
              message: `خطأ في جلب الجلسات: ${status}`,
              error: message
            };
        }
      } else if (error.request) {
        return {
          success: false,
          message: 'فشل في الاتصال بالخادم. تحقق من اتصال الإنترنت.',
          error: 'Network error'
        };
      } else {
        return {
          success: false,
          message: 'حدث خطأ غير متوقع',
          error: error.message
        };
      }
    }
  }
};

export default sessionService;