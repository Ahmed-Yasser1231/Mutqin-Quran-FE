import axios from 'axios';
import authService from '../auth/authService.js';

// Base URL for the user profile API
const PROFILE_API_BASE_URL = 'https://mutqin-springboot-backend-1.onrender.com/api/profile';

// Create axios instance with default config
const profileApi = axios.create({
  baseURL: PROFILE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to automatically include auth token
profileApi.interceptors.request.use(
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
profileApi.interceptors.response.use(
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

// User profile service functions
const userProfileService = {
  /**
   * Get user profile information
   * @returns {Promise<Object>} - Response data from the server
   */
  async getUserProfile() {
    try {
      const response = await profileApi.get('/user');
      
      return {
        success: true,
        data: response.data,
        message: 'تم جلب بيانات الملف الشخصي بنجاح'
      };
    } catch (error) {
      console.error('Get profile error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        switch (status) {
          case 401:
            return {
              success: false,
              error: 'انتهت صلاحية جلسة العمل. يرجى تسجيل الدخول مرة أخرى',
              code: 'UNAUTHORIZED'
            };
          case 403:
            return {
              success: false,
              error: 'ليس لديك صلاحية للوصول لهذه البيانات',
              code: 'FORBIDDEN'
            };
          case 404:
            return {
              success: false,
              error: 'الملف الشخصي غير موجود',
              code: 'PROFILE_NOT_FOUND'
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
              error: serverMessage || 'حدث خطأ أثناء جلب بيانات الملف الشخصي',
              code: 'UNKNOWN_ERROR'
            };
        }
      } else if (error.request) {
        // Network error
        return {
          success: false,
          error: 'لا يمكن الاتصال بالخادم. تحقق من اتصالك بالإنترنت',
          code: 'NETWORK_ERROR'
        };
      } else {
        // Other error
        return {
          success: false,
          error: 'حدث خطأ غير متوقع',
          code: 'UNEXPECTED_ERROR'
        };
      }
    }
  },

  /**
   * Update user profile information
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} - Response data from the server
   */
  async updateUserProfile(profileData) {
    try {
      const response = await profileApi.put('', profileData);
      
      // Don't store user data - just return the response
      return {
        success: true,
        data: response.data,
        message: 'تم تحديث الملف الشخصي بنجاح'
      };
    } catch (error) {
      console.error('Update profile error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: serverMessage || 'بيانات غير صحيحة. تحقق من المعلومات المدخلة',
              code: 'INVALID_DATA'
            };
          case 401:
            return {
              success: false,
              error: 'انتهت صلاحية جلسة العمل. يرجى تسجيل الدخول مرة أخرى',
              code: 'UNAUTHORIZED'
            };
          case 403:
            return {
              success: false,
              error: 'ليس لديك صلاحية لتعديل هذه البيانات',
              code: 'FORBIDDEN'
            };
          case 422:
            return {
              success: false,
              error: serverMessage || 'البيانات المدخلة غير صالحة',
              code: 'VALIDATION_ERROR'
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
              error: serverMessage || 'حدث خطأ أثناء تحديث الملف الشخصي',
              code: 'UNKNOWN_ERROR'
            };
        }
      } else if (error.request) {
        // Network error
        return {
          success: false,
          error: 'لا يمكن الاتصال بالخادم. تحقق من اتصالك بالإنترنت',
          code: 'NETWORK_ERROR'
        };
      } else {
        // Other error
        return {
          success: false,
          error: 'حدث خطأ غير متوقع',
          code: 'UNEXPECTED_ERROR'
        };
      }
    }
  },

  /**
   * Get current user ID using search API with email
   * @returns {Promise<Object>} - Response with user ID
   */
  async getCurrentUserId() {
    try {
      // First, get the user profile to obtain the email
      const userProfileResponse = await profileApi.get('/user');
      
      if (!userProfileResponse.data || !userProfileResponse.data.email) {
        return {
          success: false,
          error: 'لم يتم العثور على البريد الإلكتروني في بيانات المستخدم',
          code: 'EMAIL_NOT_FOUND'
        };
      }

      const userEmail = userProfileResponse.data.email;
      
      // Now use the search API to get the user ID
      const searchResponse = await profileApi.get(`/search?emailOrUsername=${encodeURIComponent(userEmail)}`);
      
      if (searchResponse.data && searchResponse.data.id) {
        return {
          success: true,
          userId: searchResponse.data.id,
          data: searchResponse.data,
          email: userEmail
        };
      } else {
        return {
          success: false,
          error: 'لم يتم العثور على المستخدم في نتائج البحث',
          code: 'USER_NOT_FOUND_IN_SEARCH'
        };
      }
    } catch (error) {
      console.error('Get user ID error:', error);
      
      // Handle different types of errors
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
              error: 'لم يتم العثور على المستخدم',
              code: 'USER_NOT_FOUND'
            };
          default:
            return {
              success: false,
              error: serverMessage || 'فشل في جلب معرف المستخدم',
              code: 'GET_USER_ID_ERROR'
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
   * Search for user by email or username
   * @param {string} emailOrUsername - Email or username to search for
   * @returns {Promise<Object>} - Response with user data
   */
  async searchUserByEmail(emailOrUsername) {
    try {
      const response = await profileApi.get(`/search?emailOrUsername=${encodeURIComponent(emailOrUsername)}`);
      
      return {
        success: true,
        userId: response.data.id,
        data: response.data
      };
    } catch (error) {
      console.error('Search user error:', error);
      
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
              error: 'لم يتم العثور على المستخدم',
              code: 'USER_NOT_FOUND'
            };
          default:
            return {
              success: false,
              error: serverMessage || 'فشل في البحث عن المستخدم',
              code: 'SEARCH_ERROR'
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
   * Delete user account
   * @returns {Promise<Object>} - Response data from the server
   */
  async deleteUserAccount() {
    try {
      const response = await profileApi.delete('');
      
      if (response.status === 200 || response.status === 204) {
        // Account deleted successfully, logout user
        authService.logout();
        return {
          success: true,
          message: 'تم حذف الحساب بنجاح'
        };
      }
      
      return {
        success: false,
        error: 'فشل في حذف الحساب'
      };
      
    } catch (error) {
      console.error('Error deleting account:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'حدث خطأ أثناء حذف الحساب';
        
        if (status === 401) {
          return {
            success: false,
            error: 'انتهت صلاحية جلسة العمل. يرجى تسجيل الدخول مرة أخرى',
            code: 'UNAUTHORIZED'
          };
        } else if (status === 403) {
          return {
            success: false,
            error: 'ليس لديك صلاحية لحذف هذا الحساب',
            code: 'FORBIDDEN'
          };
        } else if (status === 404) {
          return {
            success: false,
            error: 'الحساب غير موجود',
            code: 'NOT_FOUND'
          };
        } else {
          return {
            success: false,
            error: message,
            code: `HTTP_${status}`
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
   * Check if user has valid authentication
   * @returns {boolean} - True if user has valid token
   */
  isAuthenticated() {
    return authService.isAuthenticated();
  }
};

export default userProfileService;