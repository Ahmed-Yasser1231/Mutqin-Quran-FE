import React from 'react';
import { useStudentDashboard } from './StudentDashboardViewModel.js';
import { 
  FiCalendar, 
  FiTrendingUp, 
  FiUser, 
  FiClock, 
  FiAward, 
  FiBookOpen, 
  FiTarget,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

const StudentDashboardView = () => {
  const {
    sessions,
    progress,
    isLoading,
    error,
    sessionsError,
    progressError,
    lastUpdated,
    progressStats,
    fetchDashboardData,
    clearError,
    formatSessionDate,
    getSessionStatus,
    translateMemorizationLevel
  } = useStudentDashboard();

  const handleRefresh = () => {
    clearError();
    fetchDashboardData();
  };

  if (isLoading && sessions.length === 0 && progress.length === 0) {
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
        <div className="rounded-2xl shadow-lg p-6 mb-6" style={{ backgroundColor: '#F8F1DE' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
                لوحة التحكم الطلابية
              </h1>
              <p style={{ color: '#333333' }}>
                تتبع جلساتك وتقدمك في حفظ القرآن الكريم
              </p>
              {lastUpdated && (
                <p className="text-sm mt-2" style={{ color: '#666666' }}>
                  آخر تحديث: {lastUpdated.toLocaleString('ar-SA')}
                </p>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: '#CD945F',
                color: 'white'
              }}
              onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#b3784d')}
              onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#CD945F')}
            >
              <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
              <span>تحديث</span>
            </button>
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#ffebee', border: '1px solid #f44336' }}>
            <div className="flex items-center gap-3">
              <FiAlertCircle style={{ color: '#f44336' }} />
              <p style={{ color: '#d32f2f' }}>{error}</p>
              <button
                onClick={clearError}
                className="mr-auto text-sm underline"
                style={{ color: '#d32f2f' }}
              >
                إخفاء
              </button>
            </div>
          </div>
        )}

        {/* Progress Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Points */}
          <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: '#F8F1DE' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#666666' }}>
                  إجمالي النقاط
                </p>
                <p className="text-2xl font-bold" style={{ color: '#000000' }}>
                  {progressStats.totalPoints.toLocaleString('ar-SA')}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)' }}>
                <FiAward className="text-2xl" style={{ color: '#CD945F' }} />
              </div>
            </div>
          </div>

          {/* New Pages Learned */}
          <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: '#F8F1DE' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#666666' }}>
                  الصفحات المحفوظة
                </p>
                <p className="text-2xl font-bold" style={{ color: '#000000' }}>
                  {progressStats.totalNewPages.toLocaleString('ar-SA')}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(76, 175, 80, 0.2)' }}>
                <FiBookOpen className="text-2xl" style={{ color: '#4CAF50' }} />
              </div>
            </div>
          </div>

          {/* Sessions Attended */}
          <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: '#F8F1DE' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#666666' }}>
                  الجلسات المكتملة
                </p>
                <p className="text-2xl font-bold" style={{ color: '#000000' }}>
                  {progressStats.totalSessions.toLocaleString('ar-SA')}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(33, 150, 243, 0.2)' }}>
                <FiCalendar className="text-2xl" style={{ color: '#2196F3' }} />
              </div>
            </div>
          </div>

          {/* Current Level */}
          <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: '#F8F1DE' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#666666' }}>
                  المستوى الحالي
                </p>
                <p className="text-lg font-bold" style={{ color: '#000000' }}>
                  {progressStats.currentLevel}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 152, 0, 0.2)' }}>
                <FiTarget className="text-2xl" style={{ color: '#FF9800' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Sessions Section */}
          <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: '#F8F1DE' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#000000' }}>
                الجلسات
              </h2>
              <FiCalendar className="text-2xl" style={{ color: '#CD945F' }} />
            </div>

            {sessionsError && (
              <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#ffebee', border: '1px solid #f44336' }}>
                <div className="flex items-center gap-3">
                  <FiAlertCircle style={{ color: '#f44336' }} />
                  <p className="text-sm" style={{ color: '#d32f2f' }}>{sessionsError}</p>
                </div>
              </div>
            )}

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <FiCalendar className="text-4xl mx-auto mb-4" style={{ color: '#CD945F', opacity: 0.5 }} />
                  <p style={{ color: '#666666' }}>لا توجد جلسات محجوزة</p>
                </div>
              ) : (
                sessions.map((session) => {
                  const dateInfo = formatSessionDate(session.date);
                  const statusInfo = getSessionStatus(session.status);
                  
                  return (
                    <div 
                      key={session.sessionId}
                      className="border rounded-lg p-4"
                      style={{ borderColor: '#CD945F', borderWidth: '1px' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FiUser style={{ color: '#CD945F' }} />
                          <span className="font-medium" style={{ color: '#000000' }}>
                            الشيخ {session.sheikhUsername}
                          </span>
                        </div>
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            color: statusInfo.color,
                            backgroundColor: statusInfo.bgColor
                          }}
                        >
                          {statusInfo.text}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm" style={{ color: '#666666' }}>
                        <div className="flex items-center gap-1">
                          <FiCalendar />
                          <span>{dateInfo.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock />
                          <span>{dateInfo.time}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs mt-2" style={{ color: '#888888' }}>
                        {dateInfo.dayOfWeek}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Progress Section */}
          <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: '#F8F1DE' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#000000' }}>
                التقدم
              </h2>
              <FiTrendingUp className="text-2xl" style={{ color: '#CD945F' }} />
            </div>

            {progressError && (
              <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#ffebee', border: '1px solid #f44336' }}>
                <div className="flex items-center gap-3">
                  <FiAlertCircle style={{ color: '#f44336' }} />
                  <p className="text-sm" style={{ color: '#d32f2f' }}>{progressError}</p>
                </div>
              </div>
            )}

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {progress.length === 0 ? (
                <div className="text-center py-8">
                  <FiTrendingUp className="text-4xl mx-auto mb-4" style={{ color: '#CD945F', opacity: 0.5 }} />
                  <p style={{ color: '#666666' }}>لا توجد بيانات تقدم</p>
                </div>
              ) : (
                progress.map((progressItem) => {
                  const createdDate = new Date(progressItem.createdAt).toLocaleDateString('ar-SA');
                  
                  return (
                    <div 
                      key={progressItem.id}
                      className="border rounded-lg p-4"
                      style={{ borderColor: '#CD945F', borderWidth: '1px' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FiBookOpen style={{ color: '#4CAF50' }} />
                          <span className="font-medium" style={{ color: '#000000' }}>
                            {progressItem.newLearnedPages} صفحة جديدة
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiAward style={{ color: '#FFD700' }} />
                          <span className="font-medium" style={{ color: '#000000' }}>
                            {progressItem.points} نقطة
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-2" style={{ color: '#666666' }}>
                        <div className="flex items-center gap-1">
                          <FiCalendar />
                          <span>الجلسات: {progressItem.sessionsAttended}</span>
                        </div>
                        {progressItem.memorizationLevel && (
                          <div className="flex items-center gap-1">
                            <FiTarget />
                            <span>{translateMemorizationLevel(progressItem.memorizationLevel)}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs" style={{ color: '#888888' }}>
                        تاريخ الإضافة: {createdDate}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardView;