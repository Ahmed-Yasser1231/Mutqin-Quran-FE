import React from 'react';
import { FiArrowRight, FiUser, FiMail, FiPhone, FiAward, FiCalendar, FiHash } from 'react-icons/fi';

const TutorDetails = ({ tutor, onBack }) => {
  const getInitials = (name) => {
    if (!name) return 'غ';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const formatPoints = (points) => {
    const pointsNum = parseInt(points || 0);
    return pointsNum.toLocaleString('ar-SA');
  };

  return (
    <div className="rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: '#F8F1DE' }}>
      {/* Header */}
      <div className="p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #CD945F 0%, #5A340D 100%)' }}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-6 text-white transition-colors"
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            <FiArrowRight className="text-xl" />
            <span className="font-medium">العودة إلى القائمة</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {tutor.profilePictureUrl ? (
                <img
                  src={tutor.profilePictureUrl}
                  alt={tutor.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white border-opacity-30 mx-auto lg:mx-0"
                />
              ) : (
                <div className="w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto lg:mx-0" style={{ backgroundColor: 'rgba(90, 52, 13, 0.3)' }}>
                  {getInitials(tutor.username)}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center lg:text-right">
              <h1 className="text-3xl font-bold mb-2">
                {tutor.username || 'غير محدد'}
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-lg mb-4">
                <FiAward className="text-yellow-300" />
                <span>{formatPoints(tutor.points)} نقطة</span>
              </div>
              <div className="inline-flex px-4 py-2 bg-white bg-opacity-20 rounded-full">
                <span className="font-medium" style={{ color: '#000000' }}>معلم معتمد</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#000000' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)' }}>
                <FiUser style={{ color: '#CD945F' }} />
              </div>
              معلومات الاتصال
            </h2>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(205, 148, 95, 0.1)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)' }}>
                  <FiMail style={{ color: '#CD945F' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: '#000000' }}>البريد الإلكتروني</h3>
                  <p className="break-all" style={{ color: '#333333' }}>
                    {tutor.email || 'غير محدد'}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(205, 148, 95, 0.1)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(34, 139, 34, 0.2)' }}>
                  <FiPhone style={{ color: '#228B22' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: '#000000' }}>رقم الهاتف</h3>
                  <p style={{ color: '#333333' }}>
                    {tutor.phone || 'غير محدد'}
                  </p>
                </div>
              </div>

              {/* Age */}
              <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(205, 148, 95, 0.1)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)' }}>
                  <FiCalendar style={{ color: '#CD945F' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: '#000000' }}>العمر</h3>
                  <p style={{ color: '#333333' }}>
                    {tutor.age ? `${tutor.age} سنة` : 'غير محدد'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#000000' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)' }}>
                <FiHash style={{ color: '#CD945F' }} />
              </div>
              معلومات الحساب
            </h2>

            <div className="space-y-4">
              {/* User ID */}
              <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(205, 148, 95, 0.1)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)' }}>
                  <FiHash style={{ color: '#CD945F' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: '#000000' }}>معرف المستخدم</h3>
                  <p className="font-mono" style={{ color: '#333333' }}>
                    #{tutor.id}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(205, 148, 95, 0.1)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)' }}>
                  <FiUser style={{ color: '#CD945F' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: '#000000' }}>الدور</h3>
                  <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)', color: '#000000' }}>
                    {tutor.role === 'TUTOR' ? 'معلم' : tutor.role}
                  </div>
                </div>
              </div>

              {/* Points */}
              <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(205, 148, 95, 0.1)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255, 215, 0, 0.2)' }}>
                  <FiAward style={{ color: '#FFD700' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: '#000000' }}>النقاط المكتسبة</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold" style={{ color: '#FFD700' }}>
                      {formatPoints(tutor.points)}
                    </span>
                    <span style={{ color: '#333333' }}>نقطة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 pt-8" style={{ borderTop: '1px solid rgba(205, 148, 95, 0.3)' }}>
          <div className="flex flex-wrap gap-4 justify-center">
            {tutor.email && (
              <a
                href={`mailto:${tutor.email}`}
                className="flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#CD945F' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#b3784d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#CD945F'}
              >
                <FiMail />
                <span>إرسال بريد إلكتروني</span>
              </a>
            )}
            
            {tutor.phone && (
              <a
                href={`tel:${tutor.phone}`}
                className="flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#228B22' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1e7b1e'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#228B22'}
              >
                <FiPhone />
                <span>الاتصال</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetails;