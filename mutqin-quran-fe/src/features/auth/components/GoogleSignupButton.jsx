import React, { useState } from 'react';
import { Button, Box, CircularProgress, Alert } from '@mui/material';
import { FcGoogle } from 'react-icons/fc';

const GoogleSignupButton = ({ onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignup = () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create Google OAuth URL with parameters to force account selection
      // This will show the account picker even if user is already signed in
      const baseUrl = 'https://mutqin-springboot-backend-1.onrender.com/oauth2/authorization/google';
      
      // Add parameters to force Google to show account selection
      const urlWithParams = `${baseUrl}?prompt=select_account&access_type=offline`;
      
      // Alternative approach: Clear any existing Google session first
      // You can also try: prompt=consent (forces consent screen) or prompt=login (forces re-authentication)
      
      window.location.href = urlWithParams;
    } catch (error) {
      console.error('Google signup error:', error);
      const errorMessage = 'حدث خطأ أثناء تهيئة التسجيل بواسطة Google';
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
        onClick={handleGoogleSignup}
        disabled={isLoading}
        sx={{
          borderColor: '#dadce0',
          color: '#3c4043',
          backgroundColor: 'white',
          borderRadius: '18px',
          textTransform: 'none',
          fontSize: '14px',
          fontWeight: 500,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          '&:hover': {
            backgroundColor: '#f8f9fa',
            borderColor: '#dadce0',
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
            <span>التسجيل بواسطة Google</span>
          </>
        )}
      </Button>
    </Box>
  );
};

export default GoogleSignupButton;