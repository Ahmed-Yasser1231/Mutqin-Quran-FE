import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import SignupView  from './features/auth/SignupView';
import LoginView from './features/auth/LoginView';
import UserProfileView from './features/UserProfile/UserProfileView';
import TokenTestComponent from './features/UserProfile/TokenTestComponent';
import ProtectedRoute from './components/ProtectedRoute';
import authService from './features/auth/authService.js';

function App() {
  // Check if user is already authenticated
  const isAuthenticated = authService.isAuthenticated();
  
  return (
    <>
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
        <Route path='/test-token' element={<TokenTestComponent />} />
        <Route 
          path='/' 
          element={
            isAuthenticated ? <Navigate to="/profile" replace /> : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </>
  )
}

export default App
