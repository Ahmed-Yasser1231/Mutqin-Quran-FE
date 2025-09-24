import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useBookSessionViewModel from './BookSessionViewModel.js';
import { FiCalendar, FiClock, FiUser, FiExternalLink, FiCheck, FiLoader } from 'react-icons/fi';

const BookSessionView = ({ studentId, tutorId }) => {
  const location = useLocation();
  const {
    loading,
    error,
    success,
    bookingData,
    bookSession,
    clearMessages,
    clearBookingData
  } = useBookSessionViewModel();

  // Get tutorId from navigation state if available
  const navigationTutorId = location.state?.tutorId;
  
  const [localStudentId, setLocalStudentId] = React.useState(studentId || '');
  const [localTutorId, setLocalTutorId] = React.useState(tutorId || navigationTutorId || '');
  const [showStudentIdInput, setShowStudentIdInput] = React.useState(false);

  // Clear messages when component mounts
  useEffect(() => {
    clearMessages();
    clearBookingData();
  }, [clearMessages, clearBookingData]);

  // Handle book session button click
  const handleBookSession = () => {
    // Pass null for studentId to let the system fetch it automatically
    bookSession(localStudentId || null, localTutorId);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#5A340D' }}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="rounded-2xl shadow-lg p-6 mb-6" style={{ backgroundColor: '#F8F1DE' }}>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#CD945F' }}>
                <FiCalendar className="text-white text-3xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>حجز جلسة تعليمية</h1>
            <p style={{ color: '#333333' }}>احجز جلستك التعليمية مع أفضل المعلمين</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#ffebee', border: '1px solid #f44336' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5" style={{ color: '#f44336' }} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mr-3">
                <p className="text-sm" style={{ color: '#d32f2f' }}>{error}</p>
              </div>
              <button
                onClick={clearMessages}
                className="mr-auto text-sm underline"
                style={{ color: '#d32f2f' }}
              >
                إخفاء
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#e8f5e8', border: '1px solid #4caf50' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiCheck className="h-5 w-5" style={{ color: '#4caf50' }} />
              </div>
              <div className="mr-3">
                <p className="text-sm" style={{ color: '#2e7d32' }}>{success}</p>
              </div>
              {loading && (
                <div className="mr-auto">
                  <FiLoader className="animate-spin" style={{ color: '#4caf50' }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Booking Information */}
          <div className="rounded-2xl shadow-lg p-8" style={{ backgroundColor: '#F8F1DE' }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#000000' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)' }}>
                <FiUser style={{ color: '#CD945F' }} />
              </div>
              معلومات الحجز
            </h2>

            <div className="space-y-6">
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)' }}>
                    <FiCalendar style={{ color: '#CD945F' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: '#000000' }}>اختيار التوقيت المناسب</h3>
                    <p className="text-sm" style={{ color: '#333333' }}>اختر الوقت الذي يناسبك من الأوقات المتاحة</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)' }}>
                    <FiClock style={{ color: '#CD945F' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: '#000000' }}>جلسات مرنة</h3>
                    <p className="text-sm" style={{ color: '#333333' }}>مدة الجلسة قابلة للتخصيص حسب احتياجاتك</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)' }}>
                    <FiUser style={{ color: '#CD945F' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: '#000000' }}>معلمون مؤهلون</h3>
                    <p className="text-sm" style={{ color: '#333333' }}>جلسات مع أفضل المعلمين المتخصصين</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(205, 148, 95, 0.1)' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#000000' }}>كيفية الحجز:</h4>
                <ol className="text-sm space-y-1" style={{ color: '#333333' }}>
                  <li>1. اضغط على زر "حجز جلسة جديدة"</li>
                  <li>2. سيتم توجيهك إلى صفحة Calendly</li>
                  <li>3. اختر التوقيت المناسب لك</li>
                  <li>4. أكمل معلومات الحجز</li>
                  <li>5. ستصلك رسالة تأكيد بالبريد الإلكتروني</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Booking Actions */}
          <div className="rounded-2xl shadow-lg p-8" style={{ backgroundColor: '#F8F1DE' }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#000000' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)' }}>
                <FiCalendar style={{ color: '#CD945F' }} />
              </div>
              حجز الجلسة
            </h2>

            <div className="space-y-6">
              {/* Booking Data Display */}
              {bookingData && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4caf50' }}>
                  <h3 className="font-semibold mb-2" style={{ color: '#2e7d32' }}>معلومات الحجز:</h3>
                  {bookingData.message && (
                    <p className="text-sm mb-2" style={{ color: '#2e7d32' }}>{bookingData.message}</p>
                  )}
                  {bookingData.scheduling_url && (
                    <div className="flex items-center gap-2">
                      <FiExternalLink style={{ color: '#2e7d32' }} />
                      <a 
                        href={bookingData.scheduling_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline"
                        style={{ color: '#2e7d32' }}
                      >
                        فتح رابط الحجز
                      </a>
                    </div>
                  )}
                </div>
              )}

            {/* Input Fields for IDs if not provided as props */}
            {!studentId && showStudentIdInput && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                  معرف الطالب (اختياري)
                </label>
                <input
                  type="text"
                  value={localStudentId}
                  onChange={(e) => setLocalStudentId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: '#CD945F',
                    focusRingColor: '#5A340D'
                  }}
                  placeholder="سيتم جلبه تلقائياً من بياناتك"
                />
              </div>
            )}
            
            {!studentId && !showStudentIdInput && (
              <div className="mb-4 text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(205, 148, 95, 0.1)' }}>
                <p className="text-sm mb-2" style={{ color: '#333333' }}>
                  ✨ سيتم جلب معرف الطالب تلقائياً من بريدك الإلكتروني المسجل
                </p>
                <button
                  type="button"
                  onClick={() => setShowStudentIdInput(true)}
                  className="text-sm underline"
                  style={{ color: '#CD945F' }}
                >
                  إدخال معرف طالب مختلف يدوياً
                </button>
              </div>
            )}
            
            {!tutorId && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                  معرف المعلم *
                </label>
                <input
                  type="text"
                  value={localTutorId}
                  onChange={(e) => setLocalTutorId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: '#CD945F',
                    focusRingColor: '#5A340D'
                  }}
                  placeholder="أدخل معرف المعلم"
                  required
                />
              </div>
            )}

              {/* Primary Booking Button */}
              <button
                onClick={handleBookSession}
                disabled={loading || !localTutorId}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white rounded-lg font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#CD945F' }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#b3784d')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#CD945F')}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin text-xl" />
                    <span>جاري الحجز...</span>
                  </>
                ) : (
                  <>
                    <FiCalendar className="text-xl" />
                    <span>حجز جلسة</span>
                  </>
                )}
              </button>              {/* Help Text */}
              <div className="text-center">
                <p className="text-sm" style={{ color: '#333333' }}>
                  هل تحتاج مساعدة؟ 
                  <a href="/contact" className="underline mr-1" style={{ color: '#CD945F' }}>
                    تواصل معنا
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="rounded-lg p-6 max-w-sm w-full mx-4" style={{ backgroundColor: '#F8F1DE' }}>
              <div className="text-center">
                <FiLoader className="animate-spin text-4xl mx-auto mb-4" style={{ color: '#CD945F' }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>جاري حجز الجلسة</h3>
                <p className="text-sm" style={{ color: '#333333' }}>يرجى الانتظار...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSessionView;