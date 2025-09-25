import React from 'react';
import { useTutorStudents } from './TutorStudentsViewModel.js';
import { 
  FiUsers, 
  FiUser, 
  FiTrendingUp, 
  FiRefreshCw,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiBookOpen,
  FiAward,
  FiMail,
  FiUserCheck
} from 'react-icons/fi';

const TutorStudentsView = () => {
  const {
    students,
    userData,
    isLoading,
    error,
    refreshing,
    lastUpdated,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    studentsStats,
    refreshStudents,
    clearError,
    formatMemorizationLevel,
    getProgressStatus
  } = useTutorStudents();

  const handleRefresh = () => {
    clearError();
    refreshStudents();
  };

  if (isLoading && students.length === 0) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#5A340D' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <FiRefreshCw className="animate-spin text-6xl mx-auto mb-4" style={{ color: '#CD945F' }} />
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#F8F1DE' }}>
                جاري تحميل بيانات الطلاب...
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
                طلابي
              </h1>
              <p style={{ color: '#F8F1DE', opacity: 0.8 }}>
                مرحباً {userData?.username || 'معلم'} - إدارة ومتابعة طلابك
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
                  إجمالي الطلاب
                </p>
                <p className="text-2xl font-bold" style={{ color: '#5A340D' }}>
                  {studentsStats.totalStudents}
                </p>
              </div>
              <FiUsers className="text-3xl" style={{ color: '#CD945F' }} />
            </div>
          </div>

          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#F8F1DE' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#5A340D', opacity: 0.7 }}>
                  الطلاب النشطون
                </p>
                <p className="text-2xl font-bold" style={{ color: '#5A340D' }}>
                  {studentsStats.activeStudents}
                </p>
              </div>
              <FiUserCheck className="text-3xl" style={{ color: '#4caf50' }} />
            </div>
          </div>

          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#F8F1DE' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#5A340D', opacity: 0.7 }}>
                  متوسط التقدم
                </p>
                <p className="text-2xl font-bold" style={{ color: '#5A340D' }}>
                  {studentsStats.averageProgress}%
                </p>
              </div>
              <FiTrendingUp className="text-3xl" style={{ color: '#2196f3' }} />
            </div>
          </div>

          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#F8F1DE' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#5A340D', opacity: 0.7 }}>
                  المكملون
                </p>
                <p className="text-2xl font-bold" style={{ color: '#5A340D' }}>
                  {studentsStats.completedStudents}
                </p>
              </div>
              <FiAward className="text-3xl" style={{ color: '#ff9800' }} />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 rounded-lg shadow-md" style={{ backgroundColor: '#F8F1DE' }}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2" style={{ color: '#5A340D', opacity: 0.5 }} />
                <input
                  type="text"
                  placeholder="البحث بالاسم أو البريد الإلكتروني..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: '#CD945F',
                    backgroundColor: 'white',
                    color: '#5A340D',
                    focusRingColor: '#CD945F'
                  }}
                />
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 appearance-none"
                  style={{ 
                    borderColor: '#CD945F',
                    backgroundColor: 'white',
                    color: '#5A340D'
                  }}
                >
                  <option value="name">ترتيب حسب الاسم</option>
                  <option value="progress">ترتيب حسب التقدم</option>
                  <option value="memorizationLevel">ترتيب حسب مستوى الحفظ</option>
                </select>
              </div>

              {/* Filter By */}
              <div className="relative">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 appearance-none"
                  style={{ 
                    borderColor: '#CD945F',
                    backgroundColor: 'white',
                    color: '#5A340D'
                  }}
                >
                  <option value="all">جميع الطلاب</option>
                  <option value="active">الطلاب النشطون</option>
                  <option value="completed">المكملون</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="rounded-lg shadow-md" style={{ backgroundColor: '#F8F1DE' }}>
          <div className="p-6 border-b" style={{ borderBottomColor: '#CD945F' }}>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#5A340D' }}>
              <FiUsers />
              قائمة الطلاب ({students.length})
            </h2>
          </div>

          <div className="p-6">
            {students.length === 0 ? (
              <div className="text-center py-12">
                <FiUsers className="text-6xl mx-auto mb-4" style={{ color: '#CD945F', opacity: 0.5 }} />
                <h3 className="text-xl font-medium mb-2" style={{ color: '#5A340D' }}>
                  لا توجد طلاب
                </h3>
                <p style={{ color: '#5A340D', opacity: 0.7 }}>
                  {searchTerm || filterBy !== 'all' 
                    ? 'لا توجد نتائج تطابق البحث أو الفلتر المحدد'
                    : 'لم يتم تسجيل أي طلاب بعد'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student, index) => {
                  const progressStatus = getProgressStatus(student.progress);
                  
                  return (
                    <div
                      key={student.id || student.username || index}
                      className="p-4 rounded-lg border-r-4 transition-all duration-200 hover:shadow-lg"
                      style={{ 
                        backgroundColor: 'white',
                        borderRightColor: progressStatus.color
                      }}
                    >
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <FiUser className="text-lg" style={{ color: progressStatus.color }} />
                          <h3 className="font-medium text-lg" style={{ color: '#5A340D' }}>
                            {student.name || student.username || 'طالب'}
                          </h3>
                        </div>
                        
                        {student.email && (
                          <div className="flex items-center gap-1 text-sm" style={{ color: '#5A340D', opacity: 0.7 }}>
                            <FiMail />
                            <span>{student.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium" style={{ color: '#5A340D' }}>
                            التقدم
                          </span>
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: progressStatus.color + '20',
                              color: progressStatus.color
                            }}
                          >
                            {progressStatus.text}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              backgroundColor: progressStatus.color,
                              width: `${student.progress || 0}%`
                            }}
                          ></div>
                        </div>
                        <div className="text-center mt-1">
                          <span className="text-sm font-medium" style={{ color: '#5A340D' }}>
                            {student.progress || 0}%
                          </span>
                        </div>
                      </div>

                      {/* Memorization Level */}
                      {student.memorizationLevel && (
                        <div className="flex items-center gap-1 text-sm" style={{ color: '#5A340D', opacity: 0.8 }}>
                          <FiBookOpen />
                          <span>{formatMemorizationLevel(student.memorizationLevel)}</span>
                        </div>
                      )}
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

export default TutorStudentsView;