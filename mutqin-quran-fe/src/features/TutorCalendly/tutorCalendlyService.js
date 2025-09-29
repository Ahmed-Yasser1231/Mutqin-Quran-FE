import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'https://mutqin-springboot-backend-1.onrender.com/api/tutor/progress';

// Create axios instance with default config
const calendlyApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add auth token to requests
calendlyApi.interceptors.request.use(
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

const calendlyService = {
  /**
   * Update tutor's Calendly session link
   * @param {string} username - Tutor's username
   * @param {string} link - Calendly session link
   * @returns {Promise<Object>} - Response data from the server
   */
  async updateSessionLink(username, link) {
    try {
      const response = await calendlyApi.post(`/event-type-link/${username}`, {
        link: link
      });
      
      return {
        success: true,
        data: response.data,
        message: 'تم تحديث رابط الجلسات بنجاح'
      };
    } catch (error) {
      console.error('Update session link error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: 'رابط غير صحيح أو بيانات مفقودة',
              code: 'INVALID_DATA'
            };
          case 401:
            return {
              success: false,
              error: 'غير مصرح لك بتحديث رابط الجلسات',
              code: 'UNAUTHORIZED'
            };
          case 403:
            return {
              success: false,
              error: 'ليس لديك صلاحية لتحديث رابط الجلسات',
              code: 'FORBIDDEN'
            };
          case 404:
            return {
              success: false,
              error: 'المعلم غير موجود',
              code: 'TUTOR_NOT_FOUND'
            };
          case 500:
            return {
              success: false,
              error: 'خطأ في الخادم أثناء تحديث رابط الجلسات',
              code: 'SERVER_ERROR'
            };
          default:
            return {
              success: false,
              error: serverMessage || 'خطأ في تحديث رابط الجلسات',
              code: 'UPDATE_ERROR'
            };
        }
      } else if (error.request) {
        return {
          success: false,
          error: 'لا يمكن الاتصال بالخادم لتحديث رابط الجلسات',
          code: 'NETWORK_ERROR'
        };
      } else {
        return {
          success: false,
          error: 'حدث خطأ غير متوقع أثناء تحديث رابط الجلسات',
          code: 'UNEXPECTED_ERROR'
        };
      }
    }
  },

  /**
   * Validate Calendly link format
   * @param {string} link - Calendly link to validate
   * @returns {boolean} - True if valid Calendly link
   */
  validateCalendlyLink(link) {
    if (!link || typeof link !== 'string') {
      return false;
    }
    
    // Basic Calendly URL validation
    const calendlyPattern = /^https:\/\/calendly\.com\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;
    return calendlyPattern.test(link.trim());
  }
};

export default calendlyService;