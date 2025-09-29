import React, { useEffect } from 'react';
import { 
  FiSearch, 
  FiCheck, 
  FiUser, 
  FiCalendar, 
  FiMail, 
  FiHash,
  FiAlertCircle,
  FiCheckCircle,
  FiLoader
} from 'react-icons/fi';
import useSessionConfirmViewModel from './SessionConfirmViewModel';

const SessionConfirmView = () => {
  const {
    eventUuid,
    studentEmail,
    studentData,
    isSearchingStudent,
    isConfirmingSession,
    searchError,
    confirmError,
    successMessage,
    tutorId,
    initializeTutorId,
    handleEventUuidChange,
    handleStudentEmailChange,
    handleSearchStudent,
    handleConfirmSession,
    clearForm,
    isFormValid,
    canSearchStudent
  } = useSessionConfirmViewModel();

  // Initialize tutor ID on component mount
  useEffect(() => {
    initializeTutorId();
  }, [initializeTutorId]);

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#5A340D' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#CD945F', color: 'white' }}>
            <FiCalendar className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#F8F1DE' }}>
            تأكيد الجلسة
          </h1>
          <p style={{ color: '#F8F1DE', opacity: 0.8 }}>
            قم بتأكيد الجلسة عن طريق إدخال معرف الحدث والبحث عن الطالب
          </p>
        </div>

        {/* Main Form Card */}
        <div className="rounded-2xl shadow-xl p-8 mb-6" style={{ backgroundColor: '#F8F1DE' }}>
          {/* Current Tutor Info */}
          {tutorId && (
            <div className="border rounded-lg p-4 mb-6" style={{ backgroundColor: 'rgba(205, 148, 95, 0.1)', borderColor: '#CD945F' }}>
              <div className="flex items-center">
                <FiUser className="w-5 h-5 ml-2" style={{ color: '#CD945F' }} />
                <span className="font-medium" style={{ color: '#5A340D' }}>
                  معرف المدرس: {tutorId}
                </span>
              </div>
            </div>
          )}

          {/* Event UUID Input */}
          <div className="mb-6">
            <label htmlFor="eventUuid" className="block text-sm font-medium mb-2" style={{ color: '#5A340D' }}>
              <FiHash className="w-4 h-4 inline ml-1" />
              معرف الحدث (Event UUID)
            </label>
            <input
              type="text"
              id="eventUuid"
              value={eventUuid}
              onChange={(e) => handleEventUuidChange(e.target.value)}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors"
              style={{ 
                borderColor: '#CD945F', 
                backgroundColor: 'white',
                color: '#5A340D'
              }}
              onFocus={(e) => {
                e.target.style.ringColor = '#CD945F';
                e.target.style.boxShadow = '0 0 0 2px rgba(205, 148, 95, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
              dir="ltr"
            />
            <p className="text-xs mt-1 text-left" style={{ color: '#5A340D', opacity: 0.6 }}>
              Format: xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx
            </p>
          </div>

          {/* Student Email Input */}
          <div className="mb-6">
            <label htmlFor="studentEmail" className="block text-sm font-medium mb-2" style={{ color: '#5A340D' }}>
              <FiMail className="w-4 h-4 inline ml-1" />
              البريد الإلكتروني للطالب
            </label>
            <div className="flex gap-3">
              <input
                type="email"
                id="studentEmail"
                value={studentEmail}
                onChange={(e) => handleStudentEmailChange(e.target.value)}
                placeholder="student@example.com"
                className="flex-1 px-4 py-3 border rounded-lg focus:border-transparent transition-colors"
                style={{ 
                  borderColor: '#CD945F', 
                  backgroundColor: 'white',
                  color: '#5A340D'
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 2px rgba(205, 148, 95, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                }}
                dir="ltr"
              />
              <button
                onClick={handleSearchStudent}
                disabled={!canSearchStudent}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                style={{
                  backgroundColor: canSearchStudent ? '#CD945F' : '#999999',
                  color: 'white',
                  cursor: canSearchStudent ? 'pointer' : 'not-allowed',
                  opacity: canSearchStudent ? 1 : 0.6
                }}
                onMouseEnter={(e) => {
                  if (canSearchStudent) {
                    e.target.style.backgroundColor = '#B8835A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canSearchStudent) {
                    e.target.style.backgroundColor = '#CD945F';
                  }
                }}
              >
                {isSearchingStudent ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <FiSearch className="w-4 h-4" />
                )}
                بحث
              </button>
            </div>
          </div>

          {/* Search Error */}
          {searchError && (
            <div className="mb-4 p-4 border rounded-lg flex items-start gap-3" style={{ backgroundColor: '#dc2626', borderColor: '#dc2626', color: 'white' }}>
              <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>{searchError}</p>
            </div>
          )}

          {/* Student Data Display */}
          {studentData && (
            <div className="mb-6 p-4 border rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: '#22c55e' }}>
              <div className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#22c55e' }} />
                <div className="flex-1">
                  <h3 className="font-medium mb-2" style={{ color: '#5A340D' }}>تم العثور على الطالب</h3>
                  <div className="space-y-1 text-sm" style={{ color: '#5A340D' }}>
                    <p><strong>الاسم:</strong> {studentData.firstName} {studentData.lastName}</p>
                    <p><strong>البريد الإلكتروني:</strong> {studentData.email}</p>
                    <p><strong>المعرف:</strong> {studentData.id}</p>
                    {studentData.username && (
                      <p><strong>اسم المستخدم:</strong> {studentData.username}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Error */}
          {confirmError && (
            <div className="mb-4 p-4 border rounded-lg flex items-start gap-3" style={{ backgroundColor: '#dc2626', borderColor: '#dc2626', color: 'white' }}>
              <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>{confirmError}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 border rounded-lg flex items-start gap-3" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: '#22c55e' }}>
              <FiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#22c55e' }} />
              <p style={{ color: '#5A340D' }}>{successMessage}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleConfirmSession}
              disabled={!isFormValid || isConfirmingSession}
              className="flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: (isFormValid && !isConfirmingSession) ? '#22c55e' : '#999999',
                color: 'white',
                cursor: (isFormValid && !isConfirmingSession) ? 'pointer' : 'not-allowed',
                opacity: (isFormValid && !isConfirmingSession) ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (isFormValid && !isConfirmingSession) {
                  e.target.style.backgroundColor = '#16a34a';
                }
              }}
              onMouseLeave={(e) => {
                if (isFormValid && !isConfirmingSession) {
                  e.target.style.backgroundColor = '#22c55e';
                }
              }}
            >
              {isConfirmingSession ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                <FiCheck className="w-4 h-4" />
              )}
              {isConfirmingSession ? 'جاري التأكيد...' : 'تأكيد الجلسة'}
            </button>

            <button
              onClick={clearForm}
              className="px-6 py-3 border rounded-lg transition-colors"
              style={{ 
                borderColor: '#CD945F', 
                color: '#5A340D',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(205, 148, 95, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              مسح النموذج
            </button>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="rounded-2xl shadow-md p-6" style={{ backgroundColor: '#F8F1DE' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#5A340D' }}>تعليمات الاستخدام</h2>
          <div className="space-y-3 text-sm" style={{ color: '#5A340D' }}>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)', color: '#CD945F' }}>
                1
              </span>
              <p>أدخل معرف الحدث (Event UUID) الخاص بالجلسة المراد تأكيدها</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)', color: '#CD945F' }}>
                2
              </span>
              <p>أدخل البريد الإلكتروني للطالب واضغط على "بحث" للعثور عليه</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)', color: '#CD945F' }}>
                3
              </span>
              <p>تأكد من صحة بيانات الطالب المعروضة</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)', color: '#CD945F' }}>
                4
              </span>
              <p>اضغط على "تأكيد الجلسة" لإتمام عملية التأكيد</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionConfirmView;