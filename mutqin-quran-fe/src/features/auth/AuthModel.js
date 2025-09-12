/**
 * User roles constants
 */
export const USER_ROLES = {
  STUDENT: 'STUDENT',
  TUTOR: 'TUTOR',
  PARENT: 'PARENT'
};

/**
 * Memorization levels constants
 */
export const MEMORIZATION_LEVELS = {
  BEGINNER: 'BEGINNER',        // مبتدئ
  INTERMEDIATE: 'INTERMEDIATE', // متوسط
  ADVANCED: 'ADVANCED'         // متقدم
};

/**
 * User data model
 */
export class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.username = data.username || '';
    this.role = data.role || 'user';
    this.isVerified = data.isVerified || data.is_verified || false;
    this.createdAt = data.createdAt || data.created_at || null;
    this.updatedAt = data.updatedAt || data.updated_at || null;
  }

  /**
   * Get full name of the user
   * @returns {string} - Full name
   */
    getUsername() {
        return this.username;
    }

  /**
   * Get display name for UI
   * @returns {string} - Display name
   */

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean} - True if user has the role
   */
  hasRole(role) {
    return this.role === role;
  }

  /**
   * Convert to plain object for storage
   * @returns {Object} - Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      role: this.role,
      isVerified: this.isVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * Authentication state model
 */
export class AuthState {
  constructor() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
    this.isLoading = false;
    this.error = null;
    this.lastLoginAt = null;
  }

  /**
   * Set user data
   * @param {Object|User} userData - User data
   */
  setUser(userData) {
    this.user = userData instanceof User ? userData : new User(userData);
    this.isAuthenticated = true;
    this.error = null;
    this.lastLoginAt = new Date().toISOString();
  }

  /**
   * Set authentication token
   * @param {string} token - Authentication token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Set loading state
   * @param {boolean} isLoading - Loading state
   */
  setLoading(isLoading) {
    this.isLoading = isLoading;
    if (isLoading) {
      this.error = null; // Clear error when starting new operation
    }
  }

  /**
   * Set error state
   * @param {string|Object} error - Error message or error object
   */
  setError(error) {
    this.error = typeof error === 'string' ? error : error?.message || 'حدث خطأ غير متوقع';
    this.isLoading = false;
  }

  /**
   * Clear error state
   */
  clearError() {
    this.error = null;
  }

  /**
   * Reset to initial state (logout)
   */
  reset() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
    this.isLoading = false;
    this.error = null;
    this.lastLoginAt = null;
  }

  /**
   * Get current state as plain object
   * @returns {Object} - Current auth state
   */
  toJSON() {
    return {
      user: this.user?.toJSON() || null,
      token: this.token,
      isAuthenticated: this.isAuthenticated,
      isLoading: this.isLoading,
      error: this.error,
      lastLoginAt: this.lastLoginAt
    };
  }
}

/**
 * Login credentials model
 */
export class LoginCredentials {
  constructor(email = '', password = '') {
    this.email = email.trim().toLowerCase();
    this.password = password;
  }

  /**
   * Validate credentials
   * @returns {Object} - Validation result with isValid boolean and errors array
   */
  validate() {
    const errors = [];

    // Email validation
    if (!this.email) {
      errors.push('البريد الإلكتروني مطلوب');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('صيغة البريد الإلكتروني غير صحيحة');
    }

    // Password validation
    if (!this.password) {
      errors.push('كلمة المرور مطلوبة');
    } else if (this.password.length < 6) {
      errors.push('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if email format is valid
   * @param {string} email - Email to validate
   * @returns {boolean} - True if email is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Convert to plain object for API request
   * @returns {Object} - Plain object for API
   */
  toJSON() {
    return {
      email: this.email,
      password: this.password
    };
  }
}

/**
 * Signup credentials model
 */
export class SignupCredentials {
  constructor(username = '', email = '', phone = '', password = '', confirmPassword = '', role = '', memorizationLevel = '') {
    this.username = username.trim();
    this.email = email.trim().toLowerCase();
    this.phone = phone.trim();
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.role = role;
    this.memorizationLevel = memorizationLevel;
  }

  /**
   * Validate signup credentials
   * @returns {Object} - Validation result with isValid boolean and errors array
   */
  validate() {
    const errors = [];

    // Username validation
    if (!this.username) {
      errors.push('اسم المستخدم مطلوب');
    } else if (this.username.length < 3) {
      errors.push('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
    } else if (this.username.length > 50) {
      errors.push('اسم المستخدم يجب أن يكون أقل من 50 حرف');
    }

    // Email validation
    if (!this.email) {
      errors.push('البريد الإلكتروني مطلوب');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('صيغة البريد الإلكتروني غير صحيحة');
    }

    // Phone validation
    if (!this.phone) {
      errors.push('رقم الهاتف مطلوب');
    } else if (!this.isValidPhone(this.phone)) {
      errors.push('رقم الهاتف غير صحيح');
    }

    // Password validation
    if (!this.password) {
      errors.push('كلمة المرور مطلوبة');
    } else if (!this.isValidPassword(this.password)) {
      errors.push('كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز');
    }

    // Confirm password validation
    if (!this.confirmPassword) {
      errors.push('تأكيد كلمة المرور مطلوب');
    } else if (this.password !== this.confirmPassword) {
      errors.push('كلمات المرور غير متطابقة');
    }

    // Role validation
    if (!this.role) {
      errors.push('يرجى اختيار الدور');
    } else if (!Object.values(USER_ROLES).includes(this.role)) {
      errors.push('الدور المحدد غير صحيح');
    }

    // Memorization level validation (required for students only)
    if (this.role === USER_ROLES.STUDENT) {
      if (!this.memorizationLevel) {
        errors.push('يرجى اختيار مستوى الحفظ');
      } else if (!Object.values(MEMORIZATION_LEVELS).includes(this.memorizationLevel)) {
        errors.push('مستوى الحفظ المحدد غير صحيح');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if email format is valid
   * @param {string} email - Email to validate
   * @returns {boolean} - True if email is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if phone format is valid
   * @param {string} phone - Phone to validate
   * @returns {boolean} - True if phone is valid
   */
  isValidPhone(phone) {
    const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Check if password meets requirements
   * @param {string} password - Password to validate
   * @returns {boolean} - True if password is valid
   */
  isValidPassword(password) {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    return passwordRegex.test(password);
  }

  /**
   * Convert to plain object for API request
   * @returns {Object} - Plain object for API
   */
  toJSON() {
    return {
      username: this.username,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: this.role,
      memorizationLevel: this.memorizationLevel
    };
  }
}

/**
 * API Response model
 */
export class ApiResponse {
  constructor(success = false, data = null, error = null, code = null) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Create success response
   * @param {*} data - Response data
   * @returns {ApiResponse} - Success response
   */
  static success(data) {
    return new ApiResponse(true, data, null, null);
  }

  /**
   * Create error response
   * @param {string} error - Error message
   * @param {string} code - Error code
   * @returns {ApiResponse} - Error response
   */
  static error(error, code = null) {
    return new ApiResponse(false, null, error, code);
  }

  /**
   * Check if response is successful
   * @returns {boolean} - True if successful
   */
  isSuccess() {
    return this.success;
  }

  /**
   * Check if response has error
   * @returns {boolean} - True if has error
   */
  hasError() {
    return !this.success && this.error !== null;
  }
}

export default {
  User,
  AuthState,
  LoginCredentials,
  SignupCredentials,
  ApiResponse,
  USER_ROLES,
  MEMORIZATION_LEVELS
};
