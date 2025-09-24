import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiAward, FiChevronLeft, FiCalendar } from 'react-icons/fi';

const TutorCard = ({ tutor, viewMode, onSelect }) => {
  const navigate = useNavigate();
  
  const getInitials = (name) => {
    if (!name) return 'غ';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const handleBookSession = (e) => {
    e.stopPropagation(); // Prevent card click
    navigate('/book-session', { state: { tutorId: tutor.id } });
  };

  const formatPoints = (points) => {
    const pointsNum = parseInt(points || 0);
    return pointsNum.toLocaleString('ar-SA');
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={onSelect}
        className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer p-6 border hover:border-opacity-80"
        style={{ 
          backgroundColor: '#F8F1DE',
          borderColor: '#CD945F',
          borderWidth: '1px'
        }}
        onMouseEnter={(e) => e.target.style.borderColor = '#b3784d'}
        onMouseLeave={(e) => e.target.style.borderColor = '#CD945F'}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Profile Picture or Initials */}
            <div className="relative">
              {tutor.profilePictureUrl ? (
                <img
                  src={tutor.profilePictureUrl}
                  alt={tutor.username}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #CD945F 0%, #5A340D 100%)' }}>
                  {getInitials(tutor.username)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* Tutor Info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1" style={{ color: '#000000' }}>
                {tutor.username || 'غير محدد'}
              </h3>
              
              <div className="flex items-center gap-4 text-sm mb-2" style={{ color: '#333333' }}>
                <div className="flex items-center gap-1">
                  <FiMail style={{ color: '#CD945F' }} />
                  <span>{tutor.email || 'غير محدد'}</span>
                </div>
                
                {tutor.phone && (
                  <div className="flex items-center gap-1">
                    <FiPhone style={{ color: '#228B22' }} />
                    <span>{tutor.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <FiAward style={{ color: '#FFD700' }} />
                <span className="text-sm font-medium" style={{ color: '#000000' }}>
                  {formatPoints(tutor.points)} نقطة
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBookSession}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: '#CD945F',
                color: 'white'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b3784d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#CD945F'}
            >
              <FiCalendar />
              <span>حجز جلسة</span>
            </button>
            
            <FiChevronLeft className="text-xl" style={{ color: '#CD945F' }} />
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      onClick={onSelect}
      className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border group"
      style={{ 
        backgroundColor: '#F8F1DE',
        borderColor: '#CD945F',
        borderWidth: '1px'
      }}
      onMouseEnter={(e) => e.target.style.borderColor = '#b3784d'}
      onMouseLeave={(e) => e.target.style.borderColor = '#CD945F'}
    >
      {/* Header */}
      <div className="p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #CD945F 0%, #5A340D 100%)' }}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full translate-y-8 -translate-x-8"></div>
        
        <div className="relative z-10 text-center">
          {/* Profile Picture or Initials */}
          {tutor.profilePictureUrl ? (
            <img
              src={tutor.profilePictureUrl}
              alt={tutor.username}
              className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-white border-opacity-30 mb-3"
            />
          ) : (
            <div className="w-20 h-20 mx-auto rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-bold text-2xl mb-3">
              {getInitials(tutor.username)}
            </div>
          )}
          
          <h3 className="text-lg font-bold mb-1 truncate">
            {tutor.username || 'غير محدد'}
          </h3>
          
          <div className="flex items-center justify-center gap-1 text-sm opacity-90">
            <FiAward />
            <span>{formatPoints(tutor.points)} نقطة</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="space-y-3">
          {/* Email */}
          <div className="flex items-start gap-3">
            <FiMail className="mt-1 flex-shrink-0" style={{ color: '#CD945F' }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" title={tutor.email} style={{ color: '#333333' }}>
                {tutor.email || 'غير محدد'}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <FiPhone className="flex-shrink-0" style={{ color: '#228B22' }} />
            <div className="flex-1">
              <p className="text-sm" style={{ color: '#333333' }}>
                {tutor.phone || 'غير محدد'}
              </p>
            </div>
          </div>

          {/* Age */}
          <div className="flex items-center gap-3">
            <FiUser className="flex-shrink-0" style={{ color: '#CD945F' }} />
            <div className="flex-1">
              <p className="text-sm" style={{ color: '#333333' }}>
                العمر: {tutor.age || 'غير محدد'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 space-y-3" style={{ borderTop: '1px solid rgba(205, 148, 95, 0.3)' }}>
          <button
            onClick={handleBookSession}
            className="w-full flex items-center justify-center gap-2 py-3 font-medium text-sm rounded-lg transition-all duration-200 hover:scale-105"
            style={{ 
              backgroundColor: '#CD945F',
              color: 'white'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#b3784d'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#CD945F'}
          >
            <FiCalendar />
            <span>حجز جلسة</span>
          </button>
          
          <button 
            className="w-full flex items-center justify-center gap-2 py-2 font-medium text-sm rounded-lg transition-colors"
            style={{ color: '#CD945F' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(205, 148, 95, 0.1)';
              e.target.style.color = '#b3784d';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#CD945F';
            }}
          >
            <span>عرض التفاصيل</span>
            <FiChevronLeft className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;