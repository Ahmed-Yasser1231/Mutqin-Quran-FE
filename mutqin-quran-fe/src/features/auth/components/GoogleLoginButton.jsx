import React, { useState } from 'react';
import { Button, Box, CircularProgress, Alert } from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import { useAuthViewModel } from '../AuthViewModel';

const GoogleLoginButton = ({ onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { initiateGoogleLogin } = useAuthViewModel();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await initiateGoogleLogin();
      
      if (!result.success) {
        const errorMessage = result.error || 'حدث خطأ أثناء تهيئة تسجيل الدخول بواسطة Google';
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
        setIsLoading(false);
      }
      // If successful, the user will be redirected to Google OAuth, so no need to handle success here
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = 'حدث خطأ أثناء تهيئة تسجيل الدخول بواسطة Google';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            marginBottom: 2,
            borderRadius: '12px'
          }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      <Button
        variant="outlined"
        fullWidth
        onClick={handleGoogleLogin}
        disabled={isLoading}
        sx={{
          borderColor: "#E0E0E0",
          backgroundColor: "#fff",
          color: "#424242",
          borderRadius: "20px",
          py: 2,
          px: 3,
          textTransform: "none",
          fontSize: "16px",
          fontWeight: "500",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#fafafa",
            borderColor: "#dadce0",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.12)",
            transform: "translateY(-1px)"
          },
          "&:active": {
            transform: "translateY(0px)"
          },
          '&:disabled': {
            backgroundColor: '#f5f5f5',
            borderColor: '#e0e0e0',
            color: '#9e9e9e'
          }
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} sx={{ color: '#CD945F' }} />
            <span>جاري التحميل...</span>
          </Box>
        ) : (
          <>
            <FcGoogle size={20} />
            <span>تسجيل الدخول بواسطة Google</span>
          </>
        )}
      </Button>
    </Box>
  );
};

export default GoogleLoginButton;