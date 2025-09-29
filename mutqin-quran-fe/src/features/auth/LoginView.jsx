import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  Link,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuthViewModel } from "./AuthViewModel.js";
import GoogleLoginButton from "./components/GoogleLoginButton";

const validationSchema = Yup.object({
  email: Yup.string().email("صيغة البريد الإلكتروني غير صحيحة").required("البريد الإلكتروني مطلوب"),
  password: Yup.string().required("كلمة المرور مطلوبة"),
});

export default function LoginView() {
  const navigate = useNavigate();
  
  // Use the authentication view model
  const {
    login,
    isLoading,
    error,
    clearError,
    isAuthenticated
  } = useAuthViewModel();

  // Handle successful login and initial authentication check
  React.useEffect(() => {
    if (isAuthenticated) {
      // Redirect to profile page after successful login
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus(null); // Clear any previous status
    
    try {
      const result = await login(values.email, values.password);
      
      if (result.success) {
        // Show success message
        setStatus({
          type: 'success',
          message: result.message || 'تم تسجيل الدخول بنجاح'
        });
        
        // Navigation will be handled by the useEffect above
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      setStatus({
        type: 'error',
        message: 'حدث خطأ غير متوقع أثناء تسجيل الدخول'
      });
    } finally {
      setSubmitting(false);
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
          borderRadius: "24px"
        }}
      >
        {/* أيقونة Mutqin في الأعلى */}
        <Box className="flex justify-center mb-4">
          <Avatar
            sx={{ width: 80, height: 80, bgcolor: "transparent" }}
            variant="circular"
            src="/Mutqin-ico.png"
            alt="Mutqin Logo"
          >
            {/* Fallback في حالة عدم تحميل الصورة */}
            <Typography variant="h4" sx={{ color: "#5A340D" }}>
              M
            </Typography>
          </Avatar>
        </Box>

        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ color: "#5A340D", fontWeight: "bold" }}
        >
          تسجيل الدخول
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              direction: 'rtl',
              '& .MuiAlert-message': {
                textAlign: 'right',
                width: '100%'
              }
            }}
            onClose={clearError}
          >
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleSubmit, values, errors, touched, isSubmitting, status }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Success/Error Status Messages */}
              {status && (
                <Alert 
                  severity={status.type} 
                  sx={{ 
                    mb: 2, 
                    direction: 'rtl',
                    '& .MuiAlert-message': {
                      textAlign: 'right',
                      width: '100%'
                    }
                  }}
                >
                  {status.message}
                </Alert>
              )}
              
              {/* البريد الإلكتروني */}
              <TextField
                fullWidth
                label="البريد الإلكتروني"
                name="email"
                placeholder="أدخل البريد الإلكتروني"
                inputProps={{ dir: "rtl", style: { textAlign: "right" } }}
                InputLabelProps={{
                  sx: { 
                    right: 24, 
                    left: 'auto', 
                    transformOrigin: 'top right',
                    '&.MuiInputLabel-shrink': {
                      right: 24,
                      transform: 'translate(0, -9px) scale(0.75)',
                      transformOrigin: 'top right',
                      background: '#F8F1DE',
                      padding: '0 8px'
                    }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline legend': {
                    textAlign: 'right',
                    marginRight: '24px',
                    marginLeft: 'auto'
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px'
                  }
                }}
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              {/* كلمة المرور */}
              <TextField
                fullWidth
                label="كلمة المرور"
                type="password"
                name="password"
                placeholder="********"
                inputProps={{ dir: "rtl", style: { textAlign: "right" } }}
                InputLabelProps={{
                  sx: { 
                    right: 24, 
                    left: 'auto', 
                    transformOrigin: 'top right',
                    '&.MuiInputLabel-shrink': {
                      right: 24,
                      transform: 'translate(0, -9px) scale(0.75)',
                      transformOrigin: 'top right',
                      background: '#F8F1DE',
                      padding: '0 8px'
                    }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline legend': {
                    textAlign: 'right',
                    marginRight: '24px',
                    marginLeft: 'auto'
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px'
                  }
                }}
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              {/* رابط نسيت كلمة المرور */}
              <Box sx={{ textAlign: 'left', mb: 1 }}>
                <Link 
                  href="/forgot-password" 
                  sx={{ 
                    color: '#5A340D', 
                    fontSize: '14px',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  نسيت كلمة المرور؟
                </Link>
              </Box>

              {/* زر تسجيل الدخول */}
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={isLoading || isSubmitting}
                sx={{
                  backgroundColor: "#CD945F",
                  borderRadius: "20px",
                  mt: 3,
                  py: 2,
                  fontSize: "16px",
                  fontWeight: "600",
                  textTransform: "none",
                  boxShadow: "0px 3px 12px rgba(205, 148, 95, 0.3)",
                  transition: "all 0.2s ease",
                  "&:hover": { 
                    backgroundColor: "#b3784d",
                    boxShadow: "0px 4px 16px rgba(205, 148, 95, 0.4)",
                    transform: "translateY(-1px)"
                  },
                  "&:active": {
                    transform: "translateY(0px)"
                  },
                  "&:disabled": {
                    backgroundColor: "#e0e0e0",
                    color: "#999",
                    transform: "none",
                    boxShadow: "none"
                  }
                }}
              >
                {(isLoading || isSubmitting) ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: '#666' }} />
                    <Typography>جارٍ تسجيل الدخول...</Typography>
                  </Box>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>

              {/* فاصل أو */}
              <Box sx={{ my: 3, position: 'relative' }}>
                <Divider sx={{ borderColor: '#ddd' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#888', 
                      px: 3,
                      backgroundColor: '#F8F1DE',
                      fontSize: '14px'
                    }}
                  >
                    أو
                  </Typography>
                </Divider>
              </Box>

              {/* زر تسجيل الدخول بواسطة Google */}
              <GoogleLoginButton />


              {/* رابط إنشاء حساب */}
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  ليس لديك حساب؟{' '}
                  <Link 
                    href="/signup" 
                    sx={{ 
                      color: '#5A340D', 
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    أنشئ حسابًا
                  </Link>
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
}
