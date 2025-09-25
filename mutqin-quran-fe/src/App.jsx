import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import SignupView  from './features/auth/SignupView';
import LoginView from './features/auth/LoginView';
import UserProfileView from './features/UserProfile/UserProfileView';
import TutorsView from './features/Tutors/TutorsView';
import BookSessionView from './features/BookSession/BookSessionView';
import StudentDashboardView from './features/StudentDashboard/StudentDashboardView';
import AIChatView from './features/AIChat/AIChatView';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import authService from './features/auth/authService.js';

function App() {
  // Check if user is already authenticated
  const isAuthenticated = authService.isAuthenticated();
  
  return (
    <>
      <Navigation />
      <Routes>
        <Route path='/signup' element={<SignupView />} />
        <Route path='/login' element={<LoginView />} />
        <Route 
          path='/profile' 
          element={
            <ProtectedRoute>
              <UserProfileView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/tutors' 
          element={
            <ProtectedRoute>
              <TutorsView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/book-session' 
          element={
            <ProtectedRoute>
              <BookSessionView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/dashboard' 
          element={
            <ProtectedRoute>
              <StudentDashboardView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/ai-chat' 
          element={
            <ProtectedRoute>
              <AIChatView />
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
