import React from 'react';
import { FiUsers, FiPhone, FiImage, FiTrendingUp, FiX } from 'react-icons/fi';

const TutorStats = ({ stats, onClose }) => {
  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow" style={{ backgroundColor: '#F8F1DE' }}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="text-2xl text-white" />
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-bold" style={{ color: '#000000' }}>{value}</h3>
          {subtitle && (
            <p className="text-sm" style={{ color: '#333333' }}>{subtitle}</p>
          )}
        </div>
      </div>
      <h4 className="font-medium" style={{ color: '#000000' }}>{title}</h4>
    </div>
  );

  return (
    <div className="rounded-2xl shadow-lg p-6 mb-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #CD945F 0%, #5A340D 100%)' }}>
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
      >
        <FiX className="text-white" />
      </button>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">إحصائيات المعلمين</h2>
          <p style={{ color: 'rgba(248, 241, 222, 0.8)' }}>نظرة عامة على جميع المعلمين في المنصة</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FiUsers}
            title="إجمالي المعلمين"
            value={stats.totalTutors.toLocaleString('ar-SA')}
            subtitle="معلم مسجل"
            color="bg-blue-500"
          />
          
          <StatCard
            icon={FiPhone}
            title="لديهم أرقام هواتف"
            value={stats.tutorsWithPhone.toLocaleString('ar-SA')}
            subtitle={`${stats.totalTutors > 0 ? Math.round((stats.tutorsWithPhone / stats.totalTutors) * 100) : 0}% من المجموع`}
            color="bg-green-500"
          />
          
          <StatCard
            icon={FiImage}
            title="لديهم صور شخصية"
            value={stats.tutorsWithProfilePicture.toLocaleString('ar-SA')}
            subtitle={`${stats.totalTutors > 0 ? Math.round((stats.tutorsWithProfilePicture / stats.totalTutors) * 100) : 0}% من المجموع`}
            color="bg-purple-500"
          />
          
          <StatCard
            icon={FiTrendingUp}
            title="متوسط النقاط"
            value={parseFloat(stats.averagePoints).toLocaleString('ar-SA')}
            subtitle="نقطة لكل معلم"
            color="bg-yellow-500"
          />
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(248, 241, 222, 0.3)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="text-lg font-semibold mb-1">معدل اكتمال الملفات</h4>
              <p style={{ color: 'rgba(248, 241, 222, 0.8)' }}>
                {stats.totalTutors > 0 
                  ? `${Math.round(((stats.tutorsWithPhone + stats.tutorsWithProfilePicture) / (stats.totalTutors * 2)) * 100)}%`
                  : '0%'
                }
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-1">معلمون نشطون</h4>
              <p style={{ color: 'rgba(248, 241, 222, 0.8)' }}>
                {stats.totalTutors.toLocaleString('ar-SA')} معلم
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-1">إجمالي النقاط</h4>
              <p style={{ color: 'rgba(248, 241, 222, 0.8)' }}>
                {(stats.totalTutors * parseFloat(stats.averagePoints)).toLocaleString('ar-SA')} نقطة
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorStats;