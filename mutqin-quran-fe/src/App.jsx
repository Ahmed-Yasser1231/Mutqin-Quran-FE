import './App.css';
import { Route, Routes } from 'react-router-dom';
import SignupView  from './features/auth/SignupView';
import LoginView from './features/auth/LoginView';

function App() {
  return (
    <>
      <Routes>
        <Route path='/signup' element={<SignupView />} />
        <Route path='/login' element={<LoginView />} />
        <Route path='/' element={<LoginView />} />
      </Routes>
    </>
  )
}

export default App
