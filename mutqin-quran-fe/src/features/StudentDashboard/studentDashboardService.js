import axios from 'axios';
import authService from '../auth/authService.js';
import userProfileService from '../UserProfile/userProfileService.js';

// Base URLs for the APIs
const SESSIONS_API_BASE_URL = 'https://mutqin-springboot-backend-1.onrender.com/students/student';
const PROGRESS_API_BASE_URL = 'https://mutqin-springboot-backend-1.onrender.com/api/tutor/progress';

// Create axios instance for sessions API
const sessionsApi = axios.create({
  baseURL: SESSIONS_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Create axios instance for progress API
const progressApi = axios.create({
  baseURL: PROGRESS_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Add request interceptors to automatically include auth token
[sessionsApi, progressApi].forEach(api => {
  api.interceptors.request.use(
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
  api.interceptors.response.use(
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
});

// Student dashboard service functions
const studentDashboardService = {
  /**
   * Get student sessions by username
   * @returns {Promise<Object>} - Response data from the server
   */
  async getStudentSessions() {
    try {
      // First get the user profile to obtain the username
      const userProfileResult = await userProfileService.getUserProfile();
      
      if (!userProfileResult.success || !userProfileResult.data.username) {
        return {
          success: false,
          error: 'لم يتم العثور على اسم المستخدم في بيانات الملف الشخصي',
          code: 'USERNAME_NOT_FOUND'
        };
      }

      const username = userProfileResult.data.username;
      
      // Make API call to get sessions
      const response = await sessionsApi.get(`/${username}`);
      
      return {
        success: true,
        data: response.data,
        message: 'تم جلب بيانات الجلسات بنجاح'
      };
    } catch (error) {
      console.error('Get student sessions error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        switch (status) {
          case 401:
            return {
              success: false,
              error: 'انتهت صلاحية جلسة العمل. يرجى تسجيل الدخول مرة أخرى',
              code: 'UNAUTHORIZED'
            };
          case 404:
            return {
              success: false,
              error: 'لم يتم العثور على جلسات للطالب',
              code: 'SESSIONS_NOT_FOUND'
            };
          case 500:
            return {
              success: false,
              error: 'خطأ في الخادم. حاول مرة أخرى لاحقاً',
              code: 'SERVER_ERROR'
            };
          default:
            return {
              success: false,
              error: serverMessage || 'حدث خطأ أثناء جلب بيانات الجلسات',
              code: 'UNKNOWN_ERROR'
            };
        }
      } else if (error.request) {
        return {
          success: false,
          error: 'لا يمكن الاتصال بالخادم. تحقق من اتصالك بالإنترنت',
          code: 'NETWORK_ERROR'
        };
      } else {
        return {
          success: false,
          error: 'حدث خطأ غير متوقع',
          code: 'UNEXPECTED_ERROR'
        };
      }
    }
  },

  /**
   * Get student progress by username
   * @returns {Promise<Object>} - Response data from the server
   */
  async getStudentProgress() {
    try {
      // First get the user profile to obtain the username
      const userProfileResult = await userProfileService.getUserProfile();
      
      if (!userProfileResult.success || !userProfileResult.data.username) {
        return {
          success: false,
          error: 'لم يتم العثور على اسم المستخدم في بيانات الملف الشخصي',
          code: 'USERNAME_NOT_FOUND'
        };
      }

      const username = userProfileResult.data.username;
      
      // Make API call to get progress
      const response = await progressApi.get(`/${username}`);
      
      return {
        success: true,
        data: response.data,
        message: 'تم جلب بيانات التقدم بنجاح'
      };
    } catch (error) {
      console.error('Get student progress error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        switch (status) {
          case 401:
            return {
              success: false,
              error: 'انتهت صلاحية جلسة العمل. يرجى تسجيل الدخول مرة أخرى',
              code: 'UNAUTHORIZED'
            };
          case 404:
            return {
              success: false,
              error: 'لم يتم العثور على بيانات التقدم للطالب',
              code: 'PROGRESS_NOT_FOUND'
            };
          case 500:
            return {
              success: false,
              error: 'خطأ في الخادم. حاول مرة أخرى لاحقاً',
              code: 'SERVER_ERROR'
            };
          default:
            return {
              success: false,
              error: serverMessage || 'حدث خطأ أثناء جلب بيانات التقدم',
              code: 'UNKNOWN_ERROR'
            };
        }
      } else if (error.request) {
        return {
          success: false,
          error: 'لا يمكن الاتصال بالخادم. تحقق من اتصالك بالإنترنت',
          code: 'NETWORK_ERROR'
        };
      } else {
        return {
          success: false,
          error: 'حدث خطأ غير متوقع',
          code: 'UNEXPECTED_ERROR'
        };
      }
    }
  },

  /**
   * Get both sessions and progress data
   * @returns {Promise<Object>} - Combined response data
   */
  async getDashboardData() {
    try {
      const [sessionsResult, progressResult] = await Promise.all([
        this.getStudentSessions(),
        this.getStudentProgress()
      ]);

      return {
        success: true,
        data: {
          sessions: sessionsResult.success ? sessionsResult.data : [],
          progress: progressResult.success ? progressResult.data : [],
          sessionsError: sessionsResult.success ? null : sessionsResult.error,
          progressError: progressResult.success ? null : progressResult.error
        },
        message: 'تم جلب بيانات لوحة التحكم بنجاح'
      };
    } catch (error) {
      console.error('Get dashboard data error:', error);
      return {
        success: false,
        error: 'حدث خطأ أثناء جلب بيانات لوحة التحكم',
        code: 'DASHBOARD_ERROR'
      };
    }
  }
};

export default studentDashboardService;