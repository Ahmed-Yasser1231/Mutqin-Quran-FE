import axios from 'axios';

// Base URL for the authentication API
const API_BASE_URL = 'http://localhost:8080/api/auth';

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
      
      // If login is successful, store token in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
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
      // Handle phone number conversion - try different approaches
      let phoneAsNumber;
      
      // Remove any non-digits first
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      // Try converting to number
      phoneAsNumber = parseInt(cleanPhone, 10);
      
      // Alternative: If backend expects the full number including leading zero
      // you might need to convert differently or keep as string
      
      // Map form fields to API fields
      const requestData = {
        username,
        email,
        phone: phoneAsNumber, // Convert phone to integer
        password,
        role: userRole.toUpperCase(), // Map userRole to role and ensure uppercase
        memorizationLevel: memorizationLevel.toUpperCase() // Include memorization level (uppercase)
      };
      
      // Only include memorizationLevel if user is a student
      if (userRole.toUpperCase() !== 'STUDENT') {
        delete requestData.memorizationLevel;
      }
      
      // Validate phone conversion
      if (isNaN(requestData.phone)) {
        return {
          success: false,
          error: 'رقم الهاتف غير صحيح',
          code: 'INVALID_PHONE'
        };
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
      const response = await axios.get('http://localhost:8080/actuator/health');
      
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
          error: 'لا يمكن الوصول للخادم - هل يعمل على http://localhost:8080؟',
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
   * Test the specific signup endpoint with minimal data
   * @returns {Promise<Object>} - Test result
   */
  async testSignupEndpoint() {
    try {
      // Test with minimal valid data
      const testData = {
        username: 'testuser' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        phone: 1000000000, // Use integer phone number
        password: 'TestPass123!',
        role: 'STUDENT'
      };
      
      const response = await authApi.post('/signup', testData);
      
      return {
        success: true,
        message: 'نقطة تسجيل الحساب تعمل بشكل طبيعي',
        data: response.data
      };
    } catch (error) {
      console.error('Signup endpoint test failed:', error);
      
      if (error.response) {
        return {
          success: false,
          error: `نقطة تسجيل الحساب أرجعت رقم حالة ${error.response.status}`,
          details: error.response.data,
          suggestedFix: this.getSuggestedFix(error.response.status)
        };
      }
      
      return {
        success: false,
        error: 'لا يمكن الوصول لنقطة تسجيل الحساب',
        details: error.message
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
      localStorage.removeItem('user');
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
      localStorage.removeItem('user');
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
   * Get stored user data
   * @returns {Object|null} - User data or null
   */
  getUser() {
    try {
      const userData = localStorage.getItem('user');
      if (!userData || userData === 'undefined' || userData === 'null') {
        return null;
      }
      return JSON.parse(userData);
    } catch (error) {
      console.warn('Error parsing user data from localStorage:', error);
      // Clear invalid data
      localStorage.removeItem('user');
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is authenticated
   */
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  },

  /**
   * Set authorization header for future requests
   * @param {string} token - Authentication token
   */
  setAuthHeader(token) {
    if (token) {
      authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
