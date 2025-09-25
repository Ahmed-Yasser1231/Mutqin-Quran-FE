import axios from 'axios';
import authService from '../auth/authService.js';

// Base URL for the tutor students API
const API_BASE_URL = 'https://mutqin-springboot-backend-1.onrender.com/api/tutor/progress/sheikhs';

// Create axios instance with default config
const tutorStudentsApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Add request interceptor to include auth token
tutorStudentsApi.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});

const tutorStudentsService = {
  /**
   * Get tutor's students by tutor username
   * @param {string} tutorUsername - Tutor's username
   * @returns {Promise<Object>} - Response data from the server
   */
  async getTutorStudents(tutorUsername) {
    try {
      if (!tutorUsername) {
        return {
          success: false,
          error: 'اسم المستخدم مطلوب',
          code: 'USERNAME_REQUIRED'
        };
      }

      const response = await tutorStudentsApi.get(`/${tutorUsername}/students`);
      
      return {
        success: true,
        data: response.data,
        message: 'تم جلب بيانات الطلاب بنجاح'
      };
    } catch (error) {
      console.error('Error fetching tutor students:', error);
      
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
              error: 'لم يتم العثور على المعلم أو لا توجد طلاب',
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
              error: 'خطأ في الخادم أثناء جلب بيانات الطلاب',
              code: 'SERVER_ERROR'
            };
          default:
            return {
              success: false,
              error: serverMessage || 'خطأ في جلب بيانات الطلاب',
              code: 'FETCH_ERROR'
            };
        }
      } else if (error.request) {
        return {
          success: false,
          error: 'لا يمكن الاتصال بالخادم لجلب بيانات الطلاب',
          code: 'NETWORK_ERROR'
        };
      } else {
        return {
          success: false,
          error: 'حدث خطأ غير متوقع أثناء جلب بيانات الطلاب',
          code: 'UNEXPECTED_ERROR'
        };
      }
    }
  },

  /**
   * Get student progress statistics
   * @param {Array} students - Array of student objects
   * @returns {Object} - Statistics object
   */
  getStudentsStats(students) {
    if (!Array.isArray(students) || students.length === 0) {
      return {
        totalStudents: 0,
        activeStudents: 0,
        averageProgress: 0,
        completedStudents: 0
      };
    }

    const totalStudents = students.length;
    const activeStudents = students.filter(student => 
      student.isActive !== false && student.status !== 'inactive'
    ).length;
    
    const studentsWithProgress = students.filter(student => 
      student.progress !== undefined && student.progress !== null
    );
    
    const averageProgress = studentsWithProgress.length > 0 
      ? studentsWithProgress.reduce((sum, student) => sum + (student.progress || 0), 0) / studentsWithProgress.length
      : 0;
    
    const completedStudents = students.filter(student => 
      student.progress >= 100 || student.status === 'completed'
    ).length;

    return {
      totalStudents,
      activeStudents,
      averageProgress: Math.round(averageProgress * 100) / 100,
      completedStudents
    };
  },

  /**
   * Format memorization level for display
   * @param {string} level - Memorization level
   * @returns {string} - Formatted level in Arabic
   */
  formatMemorizationLevel(level) {
    if (!level) return 'غير محدد';
    
    const levelMap = {
      'BEGINNER': 'مبتدئ',
      'INTERMEDIATE': 'متوسط',
      'ADVANCED': 'متقدم',
      'HAFIZ': 'حافظ',
      'FULL_QURAN': 'القرآن كاملاً',
      'PARTIAL': 'جزئي'
    };
    
    return levelMap[level.toUpperCase()] || level;
  },

  /**
   * Get progress status with color
   * @param {number} progress - Progress percentage
   * @returns {Object} - Status object with color and text
   */
  getProgressStatus(progress) {
    if (progress === undefined || progress === null) {
      return {
        status: 'unknown',
        text: 'غير محدد',
        color: '#757575',
        bgColor: '#f5f5f5'
      };
    }

    if (progress >= 100) {
      return {
        status: 'completed',
        text: 'مكتمل',
        color: '#4caf50',
        bgColor: '#e8f5e8'
      };
    } else if (progress >= 75) {
      return {
        status: 'excellent',
        text: 'ممتاز',
        color: '#2196f3',
        bgColor: '#e3f2fd'
      };
    } else if (progress >= 50) {
      return {
        status: 'good',
        text: 'جيد',
        color: '#ff9800',
        bgColor: '#fff3e0'
      };
    } else if (progress >= 25) {
      return {
        status: 'fair',
        text: 'مقبول',
        color: '#ff5722',
        bgColor: '#fbe9e7'
      };
    } else {
      return {
        status: 'needs_improvement',
        text: 'يحتاج تحسين',
        color: '#f44336',
        bgColor: '#ffebee'
      };
    }
  }
};

export default tutorStudentsService;