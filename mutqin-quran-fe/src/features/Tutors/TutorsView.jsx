import React, { useState } from 'react';
import useTutorViewModel from './TutorViewModel.js';
import TutorCard from './components/TutorCard.jsx';
import TutorDetails from './components/TutorDetails.jsx';
import TutorStats from './components/TutorStats.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { FiSearch, FiRefreshCw, FiUsers, FiGrid, FiList } from 'react-icons/fi';

const TutorsView = () => {
  const {
    tutors,
    selectedTutor,
    loading,
    error,
    success,
    fetchTutors,
    selectTutor,
    clearSelectedTutor,
    clearMessages,
    filterTutors,
    getTutorStats
  } = useTutorViewModel();

  // Local state for UI interactions
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showStats, setShowStats] = useState(true);

  // Filter tutors based on search term
  const filteredTutors = filterTutors(searchTerm);
  const stats = getTutorStats();

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    clearMessages();
  };

  // Handle refresh
  const handleRefresh = () => {
    setSearchTerm('');
    clearSelectedTutor();
    fetchTutors();
  };

  // Handle tutor selection
  const handleTutorSelect = (tutor) => {
    selectTutor(tutor);
  };

  // Handle back to list
  const handleBackToList = () => {
    clearSelectedTutor();
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#5A340D' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="rounded-2xl shadow-lg p-6 mb-6" style={{ backgroundColor: '#F8F1DE' }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#CD945F' }}>
                <FiUsers className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#000000' }}>المعلمون</h1>
                <p style={{ color: '#333333' }}>تصفح جميع المعلمين المتاحين في المنصة</p>
              </div>
            </div>
            
            {!selectedTutor && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ backgroundColor: '#CD945F' }}
                  onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#b3784d')}
                  onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#CD945F')}
                >
                  <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
                  تحديث
                </button>
                
                <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #CD945F' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className="p-2 transition-colors"
                    style={{
                      backgroundColor: viewMode === 'grid' ? '#CD945F' : '#F8F1DE',
                      color: viewMode === 'grid' ? 'white' : '#000000'
                    }}
                  >
                    <FiGrid />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className="p-2 transition-colors"
                    style={{
                      backgroundColor: viewMode === 'list' ? '#CD945F' : '#F8F1DE',
                      color: viewMode === 'list' ? 'white' : '#000000'
                    }}
                  >
                    <FiList />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        {showStats && !selectedTutor && (
          <TutorStats 
            stats={stats} 
            onClose={() => setShowStats(false)}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mr-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mr-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && <LoadingSpinner />}

        {/* Selected Tutor Details */}
        {selectedTutor && (
          <TutorDetails 
            tutor={selectedTutor}
            onBack={handleBackToList}
          />
        )}

        {/* Tutors List */}
        {!selectedTutor && !loading && (
          <>
            {/* Search Bar */}
            <div className="rounded-2xl shadow-lg p-6 mb-6" style={{ backgroundColor: '#F8F1DE' }}>
              <div className="relative">
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl" style={{ color: '#CD945F' }} />
                <input
                  type="text"
                  placeholder="ابحث عن معلم بالاسم أو البريد الإلكتروني أو رقم الهاتف..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pr-12 pl-4 py-3 rounded-lg text-right transition-all"
                  style={{ 
                    border: '2px solid #CD945F',
                    backgroundColor: 'white',
                    color: '#000000'
                  }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(205, 148, 95, 0.2)'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                />
              </div>
              
              {searchTerm && (
                <div className="mt-3 text-sm" style={{ color: '#333333' }}>
                  نتائج البحث: {filteredTutors.length} من أصل {tutors.length} معلم
                </div>
              )}
            </div>

            {/* Tutors Grid/List */}
            {filteredTutors.length > 0 ? (
              <div className={`
                ${viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                  : 'space-y-4'
                }
              `}>
                {filteredTutors.map((tutor) => (
                  <TutorCard
                    key={tutor.id}
                    tutor={tutor}
                    viewMode={viewMode}
                    onSelect={() => handleTutorSelect(tutor)}
                  />
                ))}
              </div>
            ) : (
              !loading && (
                <div className="rounded-2xl shadow-lg p-12 text-center" style={{ backgroundColor: '#F8F1DE' }}>
                  <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(205, 148, 95, 0.1)' }}>
                    <FiUsers className="text-4xl" style={{ color: '#CD945F' }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#000000' }}>
                    {searchTerm ? 'لم يتم العثور على معلمين' : 'لا يوجد معلمون متاحون'}
                  </h3>
                  <p style={{ color: '#333333' }}>
                    {searchTerm 
                      ? 'جرب تغيير مصطلحات البحث أو امسح مربع البحث لرؤية جميع المعلمين'
                      : 'لا يوجد معلمون مسجلون في المنصة حالياً'
                    }
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 px-6 py-2 text-white rounded-lg transition-colors"
                      style={{ backgroundColor: '#CD945F' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#b3784d'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#CD945F'}
                    >
                      مسح البحث
                    </button>
                  )}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TutorsView;