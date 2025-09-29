import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { useAuthViewModel } from '../AuthViewModel';

const GoogleLoginSuccessHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('');
  const { handleGoogleLoginSuccess } = useAuthViewModel();

  useEffect(() => {
    const processLoginSuccess = async () => {
      // Extract token and user data from URL parameters
      const token = searchParams.get('token');
      const name = searchParams.get('name');
      const email = searchParams.get('email');
      const googleId = searchParams.get('googleId');

      // Check if we have all required parameters
      if (!token || !name || !email || !googleId) {
        setStatus('error');
        setMessage('معاملات تسجيل الدخول مفقودة أو غير مكتملة');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        return;
      }

      try {
        // Handle the login success
        const result = await handleGoogleLoginSuccess(token, name, email, googleId);

        if (result.success) {
          setStatus('success');
          setMessage('تم تسجيل الدخول بواسطة Google بنجاح! جاري التوجيه...');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(result.error || 'فشل في تسجيل الدخول بواسطة Google');
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        console.error('Login success processing error:', error);
        setStatus('error');
        setMessage('حدث خطأ غير متوقع أثناء معالجة تسجيل الدخول');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    processLoginSuccess();
  }, [searchParams, handleGoogleLoginSuccess, navigate]);

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      default:
        return '#CD945F';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <CircularProgress size={40} sx={{ color: '#CD945F' }} />;
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return <CircularProgress size={40} sx={{ color: '#CD945F' }} />;
    }
  };

  return (
    <Box
      className="flex justify-center items-center"
      dir="rtl"
      sx={{ 
        backgroundColor: "#5A340D",
        minHeight: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        overflowY: "auto",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <Paper
        elevation={6}
        className="p-8 shadow-lg w-full max-w-md"
        sx={{ 
          backgroundColor: "#F8F1DE",
          borderRadius: "24px",
          textAlign: 'center'
        }}
      >
        {/* Logo */}
        <Box className="flex justify-center mb-4">
          <img 
            src="/Mutqin-ico.png" 
            alt="Mutqin" 
            style={{ width: 80, height: 80 }}
          />
        </Box>

        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ color: "#5A340D", fontWeight: "bold", mb: 3 }}
        >
          تسجيل الدخول بواسطة Google
        </Typography>

        {/* Status Icon */}
        <Box sx={{ mb: 3, fontSize: '40px' }}>
          {getStatusIcon()}
        </Box>

        {/* Status Message */}
        <Box sx={{ mb: 3 }}>
          {status === 'error' ? (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: '12px',
                textAlign: 'right'
              }}
            >
              {message}
            </Alert>
          ) : (
            <Typography
              variant="body1"
              sx={{ 
                color: getStatusColor(),
                fontWeight: 500,
                fontSize: '16px'
              }}
            >
              {message || (status === 'processing' ? 'جاري معالجة تسجيل الدخول...' : '')}
            </Typography>
          )}
        </Box>

        {/* Additional Info */}
        <Typography
          variant="body2"
          sx={{ color: '#666', fontSize: '14px' }}
        >
          {status === 'processing' && 'يرجى الانتظار...'}
          {status === 'success' && 'سيتم توجيهك إلى لوحة التحكم'}
          {status === 'error' && 'سيتم توجيهك إلى صفحة تسجيل الدخول'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default GoogleLoginSuccessHandler;