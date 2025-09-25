import React from 'react';
import { useTutorDashboard } from './TutorDashboardViewModel.js';
import { 
  FiCalendar, 
  FiUser, 
  FiClock, 
  FiRefreshCw,
  FiAlertCircle,
  FiUsers,
  FiBookOpen,
  FiAward
} from 'react-icons/fi';

const TutorDashboardView = () => {
  const {
    sessions,
    userData,
    isLoading,
    error,
    refreshing,
    lastUpdated,
    sessionStats,
    refreshDashboard,
    clearError,
    formatSessionDate,
    getSessionStatus
  } = useTutorDashboard();

  const handleRefresh = () => {
    clearError();
    refreshDashboard();
  };

  if (isLoading && sessions.length === 0) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#5A340D' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <FiRefreshCw className="animate-spin text-6xl mx-auto mb-4" style={{ color: '#CD945F' }} />
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#F8F1DE' }}>
                جاري تحميل بياناتك...
              </h2>
              <p style={{ color: '#F8F1DE', opacity: 0.8 }}>
                يرجى الانتظار
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#5A340D' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#F8F1DE' }}>
                لوحة تحكم المعلم
              </h1>
              <p style={{ color: '#F8F1DE', opacity: 0.8 }}>
                مرحباً {userData?.username || 'معلم'} - إدارة جلساتك القادمة
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80"
              style={{ backgroundColor: '#CD945F', color: 'white' }}
            >
              <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} />
              تحديث
            </button>
          </div>
          
          {lastUpdated && (
            <p className="text-sm" style={{ color: '#F8F1DE', opacity: 0.6 }}>
              آخر تحديث: {lastUpdated.toLocaleString('ar-EG')}
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#dc2626', color: 'white' }}>
            <FiAlertCircle className="text-xl flex-shrink-0" />
            <div className="flex-grow">
              <p className="font-medium">خطأ في تحميل البيانات</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#F8F1DE' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#5A340D', opacity: 0.7 }}>
                  جلسات اليوم
                </p>
                <p className="text-2xl font-bold" style={{ color: '#5A340D' }}>
                  {sessionStats.today}
                </p>
              </div>
              <FiCalendar className="text-3xl" style={{ color: '#CD945F' }} />
            </div>
          </div>

          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#F8F1DE' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#5A340D', opacity: 0.7 }}>
                  الجلسات القادمة
                </p>
                <p className="text-2xl font-bold" style={{ color: '#5A340D' }}>
                  {sessionStats.totalUpcoming}
                </p>
              </div>
              <FiClock className="text-3xl" style={{ color: '#CD945F' }} />
            </div>
          </div>

          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#F8F1DE' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#5A340D', opacity: 0.7 }}>
                  إجمالي الجلسات
                </p>
                <p className="text-2xl font-bold" style={{ color: '#5A340D' }}>
                  {sessionStats.total}
                </p>
              </div>
              <FiUsers className="text-3xl" style={{ color: '#CD945F' }} />
            </div>
          </div>

          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#F8F1DE' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#5A340D', opacity: 0.7 }}>
                  حالة النشاط
                </p>
                <p className="text-lg font-bold" style={{ color: '#5A340D' }}>
                  {sessionStats.total > 0 ? 'نشط' : 'غير نشط'}
                </p>
              </div>
              <FiAward className="text-3xl" style={{ color: sessionStats.total > 0 ? '#4caf50' : '#757575' }} />
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="rounded-lg shadow-md" style={{ backgroundColor: '#F8F1DE' }}>
          <div className="p-6 border-b" style={{ borderBottomColor: '#CD945F' }}>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#5A340D' }}>
              <FiCalendar />
              الجلسات القادمة
            </h2>
          </div>

          <div className="p-6">
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <FiCalendar className="text-6xl mx-auto mb-4" style={{ color: '#CD945F', opacity: 0.5 }} />
                <h3 className="text-xl font-medium mb-2" style={{ color: '#5A340D' }}>
                  لا توجد جلسات مجدولة
                </h3>
                <p style={{ color: '#5A340D', opacity: 0.7 }}>
                  لا توجد جلسات مجدولة في الوقت الحالي
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session, index) => {
                  const status = getSessionStatus(session.sessionDate);
                  
                  return (
                    <div
                      key={`${session.sessionId || session.id || index}`}
                      className="p-4 rounded-lg border-r-4 transition-all duration-200 hover:shadow-md"
                      style={{ 
                        backgroundColor: status.bgColor,
                        borderRightColor: status.color
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <FiUser className="text-lg" style={{ color: status.color }} />
                            <h3 className="font-medium text-lg" style={{ color: '#5A340D' }}>
                              {session.studentName || session.student?.name || 'طالب'}
                            </h3>
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: status.color + '20',
                                color: status.color
                              }}
                            >
                              {status.text}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm" style={{ color: '#5A340D', opacity: 0.8 }}>
                            <div className="flex items-center gap-1">
                              <FiCalendar />
                              <span>{formatSessionDate(session.sessionDate)}</span>
                            </div>
                            
                            {session.subject && (
                              <div className="flex items-center gap-1">
                                <FiBookOpen />
                                <span>{session.subject}</span>
                              </div>
                            )}
                          </div>

                          {session.notes && (
                            <p className="mt-2 text-sm" style={{ color: '#5A340D', opacity: 0.7 }}>
                              ملاحظات: {session.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboardView;