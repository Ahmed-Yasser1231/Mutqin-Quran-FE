import axios from 'axios';
import authService from '../auth/authService.js';

// Base URL for the tutor API
const PROFILE_API_BASE_URL = 'https://mutqin-springboot-backend-1.onrender.com/api/profile';

// Create axios instance with default config
const tutorApi = axios.create({
  baseURL: PROFILE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout for tutor data
});

// Add request interceptor to automatically include auth token
tutorApi.interceptors.request.use(
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
tutorApi.interceptors.response.use(
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

// Tutor service functions
const tutorService = {
  /**
   * Get all tutors information
   * @returns {Promise<Object>} - Response data from the server
   */
  async getAllTutors() {
    try {
      const response = await tutorApi.get('/roles?role=TUTOR');
      
      return {
        success: true,
        data: response.data,
        message: 'تم جلب بيانات المعلمين بنجاح'
      };
    } catch (error) {
      console.error('Get tutors error:', error);
      
      // Handle different types of errors
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'حدث خطأ في الخادم';
        
        switch (status) {
          case 400:
            return {
              success: false,
              message: 'طلب غير صحيح',
              error: message
            };
          case 401:
            return {
              success: false,
              message: 'غير مصرح لك بالوصول',
              error: message
            };
          case 403:
            return {
              success: false,
              message: 'ممنوع الوصول',
              error: message
            };
          case 404:
            return {
              success: false,
              message: 'لم يتم العثور على معلمين',
              error: message
            };
          case 500:
            return {
              success: false,
              message: 'خطأ في الخادم الداخلي',
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
          message: 'حدث خطأ غير متوقع',
          error: error.message
        };
      }
    }
  },

  /**
   * Get tutor by ID
   * @param {string} tutorId - Tutor's ID
   * @returns {Promise<Object>} - Response data from the server
   */
  async getTutorById(tutorId) {
    try {
      const response = await tutorApi.get(`/${tutorId}`);
      
      return {
        success: true,
        data: response.data,
        message: 'تم جلب بيانات المعلم بنجاح'
      };
    } catch (error) {
      console.error('Get tutor by ID error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'حدث خطأ في الخادم';
        
        switch (status) {
          case 404:
            return {
              success: false,
              message: 'لم يتم العثور على هذا المعلم',
              error: message
            };
          default:
            return {
              success: false,
              message: `خطأ في جلب بيانات المعلم: ${status}`,
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

export default tutorService;