import { useState, useCallback } from 'react';
import authService from './authService.js';
import { AuthState, LoginCredentials, SignupCredentials, User, MEMORIZATION_LEVELS } from './AuthModel.js';

/**
 * Custom hook for authentication logic
 * This provides the business logic layer between the UI and the data service
 */
export const useAuthViewModel = () => {
  // Initialize auth state
  const [authState, setAuthState] = useState(() => {
    const state = new AuthState();
    
    try {
      // Check if user is already logged in
      const existingToken = authService.getToken();
      const existingUser = authService.getUser();
      
      if (existingToken && existingUser) {
        state.setToken(existingToken);
        state.setUser(existingUser);
      }
    } catch (error) {
      console.warn('Error initializing auth state from storage:', error);
      // Clear any corrupted data
      authService.clearAllAuthData();
    }
    
    return state;
  });

  /**
   * Update auth state
   * @param {Function} updater - Function to update state
   */
  const updateAuthState = useCallback((updater) => {
    setAuthState(prevState => {
      const newState = new AuthState();
      // Copy previous state
      Object.assign(newState, prevState);
      // Apply update
      updater(newState);
      return newState;
    });
  }, []);

  /**
   * Handle user login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - Login result
   */
  const login = useCallback(async (email, password) => {
    // Create credentials object
    const credentials = new LoginCredentials(email, password);
    
    // Validate credentials
    const validation = credentials.validate();
    if (!validation.isValid) {
      updateAuthState(state => {
        state.setError(validation.errors[0]); // Show first error
      });
      return { success: false, error: validation.errors[0] };
    }

    // Set loading state
    updateAuthState(state => {
      state.setLoading(true);
    });

    try {
      // Call auth service
      const result = await authService.login(credentials.email, credentials.password);
      
      if (result.success) {
        // Login successful
        updateAuthState(state => {
          state.setToken(result.data.token);
          state.setUser(new User(result.data.user));
          state.setLoading(false);
        });
        
        return {
          success: true,
          user: result.data.user,
          message: result.message
        };
      } else {
        // Login failed
        updateAuthState(state => {
          state.setError(result.error);
          state.setLoading(false);
        });
        
        return {
          success: false,
          error: result.error,
          code: result.code
        };
      }
    } catch (error) {
      // Unexpected error
      console.error('Login error in ViewModel:', error);
      updateAuthState(state => {
        state.setError('حدث خطأ غير متوقع أثناء تسجيل الدخول');
        state.setLoading(false);
      });
      
      return {
        success: false,
        error: 'حدث خطأ غير متوقع أثناء تسجيل الدخول'
      };
    }
  }, [updateAuthState]);

  /**
   * Handle user signup
   * @param {string} username - User username
   * @param {string} email - User email
   * @param {string} phoneNumber - User phone number (from form)
   * @param {string} password - User password
   * @param {string} confirmPassword - Confirm password
   * @param {string} userRole - User role (from form)
   * @param {string} memorizationLevel - User memorization level (for students)
   * @returns {Promise<Object>} - Signup result
   */
  const signup = useCallback(async (username, email, phoneNumber, password, confirmPassword, userRole, memorizationLevel = '') => {
    // Create credentials object (using original field names for validation)
    const credentials = new SignupCredentials(username, email, phoneNumber, password, confirmPassword, userRole, memorizationLevel);
    
    // Validate credentials
    const validation = credentials.validate();
    if (!validation.isValid) {
      updateAuthState(state => {
        state.setError(validation.errors[0]); // Show first error
      });
      return { success: false, error: validation.errors[0] };
    }

    // Set loading state
    updateAuthState(state => {
      state.setLoading(true);
    });

    try {
      // Call auth service with the exact parameters it expects
      const result = await authService.signup(
        credentials.username,
        credentials.email,
        credentials.phone,      // This maps to phoneNumber
        credentials.password,
        credentials.confirmPassword,
        credentials.role,       // This maps to userRole
        credentials.memorizationLevel // This maps to memorizationLevel
      );
      
      if (result.success) {
        // Signup successful
        updateAuthState(state => {
          if (result.data.token) {
            // If token is returned, user is automatically logged in
            state.setToken(result.data.token);
            state.setUser(new User(result.data.user));
          }
          state.setLoading(false);
        });
        
        return {
          success: true,
          user: result.data.user,
          message: 'تم إنشاء الحساب بنجاح',
          autoLogin: !!result.data.token
        };
      } else {
        // Signup failed
        updateAuthState(state => {
          state.setError(result.error);
          state.setLoading(false);
        });
        
        return {
          success: false,
          error: result.error,
          code: result.code
        };
      }
    } catch (error) {
      // Unexpected error
      console.error('Signup error in ViewModel:', error);
      updateAuthState(state => {
        state.setError('حدث خطأ غير متوقع أثناء إنشاء الحساب');
        state.setLoading(false);
      });
      
      return {
        success: false,
        error: 'حدث خطأ غير متوقع أثناء إنشاء الحساب'
      };
    }
  }, [updateAuthState]);

  /**
   * Handle user logout
   */
  const logout = useCallback(() => {
    // Clear service data
    authService.logout();
    
    // Reset auth state
    updateAuthState(state => {
      state.reset();
    });
  }, [updateAuthState]);

  /**
   * Clear any error messages
   */
  const clearError = useCallback(() => {
    updateAuthState(state => {
      state.clearError();
    });
  }, [updateAuthState]);

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated
   */
  const isAuthenticated = useCallback(() => {
    return authState.isAuthenticated && authService.isAuthenticated();
  }, [authState.isAuthenticated]);

  /**
   * Get current user data
   * @returns {User|null} - Current user or null
   */
  const getCurrentUser = useCallback(() => {
    return authState.user;
  }, [authState.user]);

  /**
   * Refresh user data from storage
   */
  const refreshUserData = useCallback(() => {
    try {
      const token = authService.getToken();
      const userData = authService.getUser();
      
      updateAuthState(state => {
        if (token && userData) {
          state.setToken(token);
          state.setUser(new User(userData));
        } else {
          state.reset();
        }
      });
    } catch (error) {
      console.warn('Error refreshing user data:', error);
      updateAuthState(state => {
        state.reset();
      });
      // Clear corrupted data
      authService.clearAllAuthData();
    }
  }, [updateAuthState]);

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid
   */
  const validateEmail = useCallback((email) => {
    const credentials = new LoginCredentials(email);
    return credentials.isValidEmail(email);
  }, []);

  /**
   * Get authentication error message with proper formatting
   * @returns {string|null} - Formatted error message
   */
  const getFormattedError = useCallback(() => {
    if (!authState.error) return null;
    return authState.error;
  }, [authState.error]);

  // Return the public interface
  return {
    // State
    isLoading: authState.isLoading,
    error: authState.error,
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    
    // Actions
    login,
    signup,
    logout,
    clearError,
    refreshUserData,
    
    // Utilities
    checkAuthentication: isAuthenticated,
    getCurrentUser,
    validateEmail,
    getFormattedError,
    
    // Raw auth state for debugging
    authState
  };
};

/**
 * AuthViewModel class for non-hook usage
 */
export class AuthViewModel {
  constructor() {
    this.authState = new AuthState();
    this.listeners = [];
    
    // Initialize from storage
    this.refreshFromStorage();
  }

  /**
   * Add state change listener
   * @param {Function} listener - Listener function
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Remove state change listener
   * @param {Function} listener - Listener function
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notify all listeners of state change
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.authState));
  }

  /**
   * Update auth state and notify listeners
   * @param {Function} updater - Function to update state
   */
  updateState(updater) {
    updater(this.authState);
    this.notifyListeners();
  }

  /**
   * Refresh state from storage
   */
  refreshFromStorage() {
    const token = authService.getToken();
    const userData = authService.getUser();
    
    if (token && userData) {
      this.updateState(state => {
        state.setToken(token);
        state.setUser(new User(userData));
      });
    }
  }

  /**
   * Login method for class usage
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - Login result
   */
  async login(email, password) {
    const credentials = new LoginCredentials(email, password);
    
    const validation = credentials.validate();
    if (!validation.isValid) {
      this.updateState(state => {
        state.setError(validation.errors[0]);
      });
      return { success: false, error: validation.errors[0] };
    }

    this.updateState(state => {
      state.setLoading(true);
    });

    try {
      const result = await authService.login(credentials.email, credentials.password);
      
      if (result.success) {
        this.updateState(state => {
          state.setToken(result.data.token);
          state.setUser(new User(result.data.user));
          state.setLoading(false);
        });
        
        return {
          success: true,
          user: result.data.user,
          message: result.message
        };
      } else {
        this.updateState(state => {
          state.setError(result.error);
          state.setLoading(false);
        });
        
        return {
          success: false,
          error: result.error,
          code: result.code
        };
      }
    } catch (error) {
      console.error('Login error in ViewModel:', error);
      this.updateState(state => {
        state.setError('حدث خطأ غير متوقع أثناء تسجيل الدخول');
        state.setLoading(false);
      });
      
      return {
        success: false,
        error: 'حدث خطأ غير متوقع أثناء تسجيل الدخول'
      };
    }
  }

  /**
   * Signup method for class usage
   * @param {string} username - User username
   * @param {string} email - User email
   * @param {string} phoneNumber - User phone number (from form)
   * @param {string} password - User password
   * @param {string} confirmPassword - Confirm password
   * @param {string} userRole - User role (from form)
   * @param {string} memorizationLevel - User memorization level (for students)
   * @returns {Promise<Object>} - Signup result
   */
  async signup(username, email, phoneNumber, password, confirmPassword, userRole, memorizationLevel = '') {
    const credentials = new SignupCredentials(username, email, phoneNumber, password, confirmPassword, userRole, memorizationLevel);
    
    const validation = credentials.validate();
    if (!validation.isValid) {
      this.updateState(state => {
        state.setError(validation.errors[0]);
      });
      return { success: false, error: validation.errors[0] };
    }

    this.updateState(state => {
      state.setLoading(true);
    });

    try {
      const result = await authService.signup(
        credentials.username,
        credentials.email,
        credentials.phone,      // Maps phoneNumber to phone
        credentials.password,
        credentials.confirmPassword,
        credentials.role,       // Maps userRole to role
        credentials.memorizationLevel // Maps memorizationLevel
      );
      
      if (result.success) {
        this.updateState(state => {
          if (result.data.token) {
            state.setToken(result.data.token);
            state.setUser(new User(result.data.user));
          }
          state.setLoading(false);
        });
        
        return {
          success: true,
          user: result.data.user,
          message: result.message,
          autoLogin: !!result.data.token
        };
      } else {
        this.updateState(state => {
          state.setError(result.error);
          state.setLoading(false);
        });
        
        return {
          success: false,
          error: result.error,
          code: result.code
        };
      }
    } catch (error) {
      console.error('Signup error in ViewModel:', error);
      this.updateState(state => {
        state.setError('حدث خطأ غير متوقع أثناء إنشاء الحساب');
        state.setLoading(false);
      });
      
      return {
        success: false,
        error: 'حدث خطأ غير متوقع أثناء إنشاء الحساب'
      };
    }
  }

  /**
   * Logout method for class usage
   */
  logout() {
    authService.logout();
    this.updateState(state => {
      state.reset();
    });
  }

  /**
   * Clear error for class usage
   */
  clearError() {
    this.updateState(state => {
      state.clearError();
    });
  }
}

export default useAuthViewModel;
