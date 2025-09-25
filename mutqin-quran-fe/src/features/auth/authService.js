import axios from 'axios';

// Base URL for the authentication API
const API_BASE_URL = 'https://mutqin-springboot-backend-1.onrender.com/api/auth';

// Create axios instance with default config
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Auth service functions
const authService = {
  /**
   * Login user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} - Response data from the server
   */
  async login(email, password) {
    try {
      const response = await authApi.post('/login', {
        email,
        password,
      });
      
      // If login is successful, store token and fetch user profile
      if (response.data.token && response.data.type) {
        // Format token as "Bearer {token}" for API calls
        const formattedToken = `${response.data.type} ${response.data.token}`;
        localStorage.setItem('authToken', formattedToken);
        // Set auth header for future requests
        this.setAuthHeader(formattedToken);
        
        // Fetch and store user profile data
        await this.fetchAndStoreUserProfile(formattedToken);
      }
      
      return {
        success: true,
        data: response.data,
        message: 'تم تسجيل الدخول بنجاح'
      };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        switch (status) {
          case 401:
            return {
              success: false,
              error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
              code: 'INVALID_CREDENTIALS'
            };
          case 404:
            return {
              success: false,
              error: 'المستخدم غير موجود',
              code: 'USER_NOT_FOUND'
            };
          case 429:
            return {
              success: false,
              error: 'لقد تجاوزت عدد المحاولات المسموحة. حاول مرة أخرى لاحقاً',
              code: 'TOO_MANY_ATTEMPTS'
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
              error: serverMessage || 'حدث خطأ أثناء تسجيل الدخول',
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
   * Register a new user
   * @param {string} username - User's username
   * @param {string} email - User's email
   * @param {string} phoneNumber - User's phone number (from form)
   * @param {string} password - User's password
   * @param {string} confirmPassword - Confirm password
   * @param {string} userRole - User's role from form (STUDENT, TUTOR, PARENT)
   * @param {string} memorizationLevel - User's memorization level (for students)
   * @returns {Promise<Object>} - Response data from the server
   */
  async signup(username, email, phoneNumber, password, confirmPassword, userRole, memorizationLevel = '') {
    try {
      // Clean phone number but keep as string
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      // Validate phone number
      if (!cleanPhone || cleanPhone.length < 10) {
        return {
          success: false,
          error: 'رقم الهاتف غير صحيح - يجب أن يحتوي على 10 أرقام على الأقل',
          code: 'INVALID_PHONE'
        };
      }
      
      // Map form fields to API fields
      const requestData = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone, // Keep phone as string
        password,
        role: userRole.toUpperCase(), // Map userRole to role and ensure uppercase
      };
      
      // Only include memorizationLevel if user is a student and it's provided
      if (userRole.toUpperCase() === 'STUDENT' && memorizationLevel && memorizationLevel.trim()) {
        requestData.memorizationLevel = memorizationLevel.toUpperCase();
      }
      
      const response = await authApi.post('/signup', requestData);
      
      // If signup is successful, store token if returned
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'تم إنشاء الحساب بنجاح'
      };
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        // Function to translate common English server messages to Arabic
        const translateServerMessage = (message) => {
          if (!message || typeof message !== 'string') return message;
          
          const translations = {
            'Username already exists': 'اسم المستخدم مستخدم مسبقاً',
            'Email already exists': 'البريد الإلكتروني مستخدم مسبقاً',
            'User already exists': 'المستخدم موجود مسبقاً',
            'username already exists': 'اسم المستخدم مستخدم مسبقاً',
            'email already exists': 'البريد الإلكتروني مستخدم مسبقاً',
            'user already exists': 'المستخدم موجود مسبقاً'
          };
          
          // Check for exact matches
          if (translations[message]) {
            return translations[message];
          }
          
          // Check for partial matches (case insensitive)
          const lowerMessage = message.toLowerCase();
          for (const [englishMsg, arabicMsg] of Object.entries(translations)) {
            if (lowerMessage.includes(englishMsg.toLowerCase())) {
              return arabicMsg;
            }
          }
          
          return message;
        };
        
        const translatedServerMessage = translateServerMessage(serverMessage);
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: translatedServerMessage || 'بيانات غير صحيحة. تحقق من المعلومات المدخلة',
              code: 'INVALID_DATA'
            };
          case 409:
            return {
              success: false,
              error: translatedServerMessage || 'البريد الإلكتروني أو اسم المستخدم مستخدم مسبقاً',
              code: 'USER_EXISTS'
            };
          case 422:
            return {
              success: false,
              error: translatedServerMessage || 'البيانات المدخلة غير صالحة',
              code: 'VALIDATION_ERROR'
            };
          case 500:
            return {
              success: false,
              error: 'خطأ داخلي في الخادم. يرجى المحاولة مرة أخرى لاحقاً',
              code: 'SERVER_ERROR'
            };
          default:
            return {
              success: false,
              error: translatedServerMessage || 'حدث خطأ أثناء إنشاء الحساب',
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
   * Test server health and basic connectivity
   * @returns {Promise<Object>} - Test result
   */
  async testServerHealth() {
    try {
      const response = await axios.get('https://mutqin-springboot-backend-1.onrender.com/actuator/health');
      
      return {
        success: true,
        message: 'الخادم يعمل بشكل طبيعي',
        data: response.data
      };
    } catch (error) {
      console.error('Health check failed:', error);
      
      if (error.response) {
        return {
          success: false,
          error: `الخادم استجاب برقم حالة ${error.response.status}`,
          details: error.response.data
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'لا يمكن الوصول للخادم - هل يعمل على https://mutqin-springboot-backend-1.onrender.com؟',
          details: error.message
        };
      }
      
      return {
        success: false,
        error: 'خطأ اتصال غير معروف',
        details: error.message
      };
    }
  },

  /**
   * Fetch user profile data from API and store in localStorage
   * @param {string} token - Authentication token (formatted as "Bearer {token}")
   * @returns {Promise<Object>} - Response data from the server
   */
  async fetchAndStoreUserProfile(token) {
    try {
      const profileResponse = await axios.get('https://mutqin-springboot-backend-1.onrender.com/api/profile/user', {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      if (profileResponse.data) {
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(profileResponse.data));
        
        return {
          success: true,
          data: profileResponse.data,
          message: 'تم جلب بيانات المستخدم بنجاح'
        };
      }
      
      return {
        success: false,
        error: 'لم يتم العثور على بيانات المستخدم',
        code: 'NO_USER_DATA'
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
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
              error: 'المستخدم غير موجود',
              code: 'USER_NOT_FOUND'
            };
          case 500:
            return {
              success: false,
              error: 'خطأ في الخادم أثناء جلب بيانات المستخدم',
              code: 'SERVER_ERROR'
            };
          default:
            return {
              success: false,
              error: serverMessage || 'خطأ في جلب بيانات المستخدم',
              code: 'PROFILE_FETCH_ERROR'
            };
        }
      } else if (error.request) {
        return {
          success: false,
          error: 'لا يمكن الاتصال بالخادم لجلب بيانات المستخدم',
          code: 'NETWORK_ERROR'
        };
      } else {
        return {
          success: false,
          error: 'حدث خطأ غير متوقع أثناء جلب بيانات المستخدم',
          code: 'UNEXPECTED_ERROR'
        };
      }
    }
  },

  /**
   * Get stored user profile data from localStorage
   * @returns {Object|null} - User profile data or null
   */
  getUserProfile() {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData || userData === 'undefined' || userData === 'null') {
        return null;
      }
      return JSON.parse(userData);
    } catch (error) {
      console.warn('Error parsing user data from localStorage:', error);
      localStorage.removeItem('userData');
      return null;
    }
  },

  /**
   * Refresh user profile data from API (requires valid token)
   * @returns {Promise<Object>} - Response data from the server
   */
  async refreshUserProfile() {
    try {
      const token = this.getToken();
      if (!token) {
        return {
          success: false,
          error: 'لا توجد جلسة نشطة',
          code: 'NO_TOKEN'
        };
      }
      
      return await this.fetchAndStoreUserProfile(token);
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      return {
        success: false,
        error: 'حدث خطأ أثناء تحديث بيانات المستخدم',
        code: 'REFRESH_ERROR'
      };
    }
  },

  /**
   * Get suggested fixes for common errors
   * @param {number} status - HTTP status code
   * @returns {string} - Suggested fix
   */
  getSuggestedFix(status) {
    switch (status) {
      case 500:
        return 'تحقق من سجلات الخادم الخلفي للتأكد من مشاكل الاتصال بقاعدة البيانات أو الجداول المفقودة أو أخطاء التحقق';
      case 404:
        return 'تحقق من وجود نقطة /api/auth/signup في الخادم الخلفي';
      case 400:
        return 'تحقق من إرسال جميع الحقول المطلوبة بأنواع البيانات الصحيحة';
      case 409:
        return 'قد يكون المستخدم بهذا البريد الإلكتروني/اسم المستخدم موجود مسبقاً';
      default:
        return 'تحقق من سجلات الخادم الخلفي للمزيد من التفاصيل';
    }
  },

  /**
   * Logout user and clear all auth data
   */
  logout() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      // Clear auth header
      this.setAuthHeader(null);
    } catch (error) {
      console.warn('Error during logout:', error);
    }
  },

  /**
   * Clear all authentication data (useful for handling corrupted data)
   */
  clearAllAuthData() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      this.setAuthHeader(null);
    } catch (error) {
      console.warn('Error clearing auth data:', error);
    }
  },

  /**
   * Get stored authentication token
   * @returns {string|null} - Authentication token or null
   */
  getToken() {
    const token = localStorage.getItem('authToken');
    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }
    return token;
  },

  /**
   * Get stored user data - NO LONGER USED
   * User data is now fetched from profile API, not stored in localStorage
   * @returns {Object|null} - Always returns null since we don't store user data
   */
  getUser() {
    // We no longer store user data in localStorage
    // User data should be fetched from profile API when needed
    return null;
  },

  /**
   * Check if user is authenticated (only checks token, not user data)
   * @returns {boolean} - True if user has valid token
   */
  isAuthenticated() {
    const token = this.getToken();
    return !!token; // Only check token, not user data
  },

  /**
   * Set authorization header for future requests
   * @param {string} token - Authentication token (already formatted as "Bearer {token}")
   */
  setAuthHeader(token) {
    if (token) {
      // Token is already formatted, use it directly
      authApi.defaults.headers.common['Authorization'] = token;
    } else {
      delete authApi.defaults.headers.common['Authorization'];
    }
  }
};

// Set auth header if token exists on app initialization
try {
  const existingToken = authService.getToken();
  if (existingToken) {
    authService.setAuthHeader(existingToken);
  }
} catch (error) {
  console.warn('Error initializing auth service:', error);
  // Clear any corrupted data
  authService.clearAllAuthData();
}

export default authService;
