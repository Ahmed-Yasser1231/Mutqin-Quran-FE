import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import SignupView  from './features/auth/SignupView';
import LoginView from './features/auth/LoginView';
import GoogleCallbackHandler from './features/auth/components/GoogleCallbackHandler';
import GoogleLoginSuccessHandler from './features/auth/components/GoogleLoginSuccessHandler';
import UserProfileView from './features/UserProfile/UserProfileView';
import TutorsView from './features/Tutors/TutorsView';
import BookSessionView from './features/BookSession/BookSessionView';
import StudentDashboardView from './features/StudentDashboard/StudentDashboardView';
import TutorDashboardView from './features/TutorDashboard/TutorDashboardView';
import TutorStudentsView from './features/TutorStudents/TutorStudentsView';
import TutorCalendlyView from './features/TutorCalendly/TutorCalendlyView';
import SessionConfirmView from './features/SessionConfirm/SessionConfirmView';
import AIChatView from './features/AIChat/AIChatView';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import authService from './features/auth/authService.js';

// Component to handle dashboard redirection based on user role
const DashboardRedirect = () => {
  const userData = authService.getUserProfile();
  const userRole = userData?.role?.toUpperCase();
  
  if (userRole === 'TUTOR') {
    return <TutorDashboardView />;
  } else {
    return <StudentDashboardView />;
  }
};

function App() {
  // Check if user is already authenticated
  const isAuthenticated = authService.isAuthenticated();
  
  return (
    <>
      <Navigation />
      <Routes>
        <Route path='/signup' element={<SignupView />} />
        <Route path='/login' element={<LoginView />} />
        <Route path='/auth/google/callback' element={<GoogleCallbackHandler />} />
        <Route path='/login/success' element={<GoogleLoginSuccessHandler />} />
        <Route 
          path='/profile' 
          element={
            <ProtectedRoute>
              <UserProfileView />
            </ProtectedRoute>
          } 
        />
        {/* Student/Parent only routes */}
        <Route 
          path='/tutors' 
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'PARENT']}>
              <TutorsView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/book-session' 
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'PARENT']}>
              <BookSessionView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/ai-chat' 
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'PARENT']}>
              <AIChatView />
            </ProtectedRoute>
          } 
        />
        {/* Tutor only routes */}
        <Route 
          path='/my-students' 
          element={
            <ProtectedRoute allowedRoles={['TUTOR']}>
              <TutorStudentsView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/calendly-setup' 
          element={
            <ProtectedRoute allowedRoles={['TUTOR']}>
              <TutorCalendlyView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/confirm-session' 
          element={
            <ProtectedRoute allowedRoles={['TUTOR']}>
              <SessionConfirmView />
            </ProtectedRoute>
          } 
        />
        {/* Role-based dashboard */}
        <Route 
          path='/dashboard' 
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/' 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </>
  )
}

export default App
