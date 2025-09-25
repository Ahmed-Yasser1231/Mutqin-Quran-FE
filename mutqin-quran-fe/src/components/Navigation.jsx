import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiUser, FiUsers, FiCalendar, FiLogOut, FiGrid, FiMic } from 'react-icons/fi';
import authService from '../features/auth/authService.js';

const Navigation = () => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const userData = authService.getUserProfile();
  const userRole = userData?.role?.toUpperCase();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  if (!isAuthenticated) {
    return null;
  }

  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      {
        path: '/dashboard',
        label: 'لوحة التحكم',
        icon: FiGrid
      },
      {
        path: '/profile',
        label: 'الملف الشخصي',
        icon: FiUser
      }
    ];

    if (userRole === 'TUTOR') {
      // Tutor-specific navigation
      return [
        ...commonItems,
        {
          path: '/my-students',
          label: 'طلابي',
          icon: FiUsers
        }
      ];
    } else {
      // Student/Parent navigation (full access)
      return [
        ...commonItems,
        {
          path: '/tutors',
          label: 'المعلمون',
          icon: FiUsers
        },
        {
          path: '/book-session',
          label: 'حجز جلسة',
          icon: FiCalendar
        },
        {
          path: '/ai-chat',
          label: 'التسميع الصوتي',
          icon: FiMic
        }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="shadow-lg border-b-2" style={{ backgroundColor: '#F8F1DE', borderBottomColor: '#CD945F' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <img 
              src="/Mutqin-ico.png" 
              alt="Mutqin" 
              className="h-8 w-8 ml-3"
            />
            <span className="text-xl font-bold" style={{ color: '#000000' }}>متقن</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'shadow-md' 
                      : 'hover:bg-opacity-50'
                    }
                  `}
                  style={{
                    backgroundColor: isActive ? '#CD945F' : 'transparent',
                    color: isActive ? 'white' : '#000000',
                    ...(isActive ? {} : {
                      ':hover': {
                        backgroundColor: 'rgba(205, 148, 95, 0.1)',
                        color: '#CD945F'
                      }
                    })
                  }}
                  onMouseEnter={(e) => !isActive && (e.target.style.backgroundColor = 'rgba(205, 148, 95, 0.1)')}
                  onMouseLeave={(e) => !isActive && (e.target.style.backgroundColor = 'transparent')}
                >
                  <Icon className="text-lg" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
              style={{ color: '#d32f2f' }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(211, 47, 47, 0.1)';
                e.target.style.color = '#b71c1c';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#d32f2f';
              }}
            >
              <FiLogOut className="text-lg" />
              <span className="font-medium">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;