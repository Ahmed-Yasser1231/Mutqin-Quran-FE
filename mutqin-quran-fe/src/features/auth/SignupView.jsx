import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  Box,
  Paper,
  Avatar,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthViewModel } from "./AuthViewModel";
import { USER_ROLES, MEMORIZATION_LEVELS } from "./AuthModel";

const validationSchema = Yup.object({
  username: Yup.string().required("اسم المستخدم مطلوب"),
  email: Yup.string().email("صيغة البريد الإلكتروني غير صحيحة").required("البريد الإلكتروني مطلوب"),
  phoneNumber: Yup.string()
    .matches(
      /^\+?\d{1,4}?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/,
      "رقم الهاتف غير صحيح"
    )
    .required("رقم الهاتف مطلوب"),
  password: Yup.string()
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
      "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز"
    )
    .required("كلمة المرور مطلوبة"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "كلمات المرور غير متطابقة")
    .required("تأكيد كلمة المرور مطلوب"),
  userRole: Yup.string().required("يرجى اختيار الدور"),
  memorizationLevel: Yup.string().when('userRole', {
    is: USER_ROLES.STUDENT,
    then: (schema) => schema.required("يرجى اختيار مستوى الحفظ"),
    otherwise: (schema) => schema.notRequired()
  }),
});

export default function SignupView() {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuthViewModel();

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    clearError();
    setStatus(null);
    
    try {
      const result = await signup(
        values.username,
        values.email,
        values.phoneNumber,  // Form field is 'phoneNumber'
        values.password,
        values.confirmPassword,
        values.userRole,     // Form field is 'userRole'
        values.memorizationLevel || '' // Form field is 'memorizationLevel'
      );

      if (result.success) {
        setStatus({
          type: 'success',
          message: result.message || 'تم إنشاء الحساب بنجاح'
        });
        
        // If auto login, redirect to dashboard
        if (result.autoLogin) {
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          // Otherwise redirect to login
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }
      } else {
        // Error will be handled by AuthViewModel error state
        // No need to set status error since we already have error display
      }
    } catch {
      // Error will be handled by AuthViewModel error state
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
          أنشئ حسابًا
        </Typography>

        <Formik
          initialValues={{
            username: "",
            userRole: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
            memorizationLevel: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleSubmit: formikHandleSubmit, values, errors, touched, isSubmitting, status }) => (
            <Form onSubmit={formikHandleSubmit} className="flex flex-col gap-4">
              {/* Display success messages */}
              {status && status.type === 'success' && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    marginBottom: 2,
                    borderRadius: '12px'
                  }}
                >
                  {status.message}
                </Alert>
              )}

              {/* Display auth error */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    marginBottom: 2,
                    borderRadius: '12px'
                  }}
                >
                  {error}
                </Alert>
              )}
              {/* الدور */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%' }}>
                <RadioGroup
                  row
                  name="userRole"
                  value={values.userRole}
                  onChange={handleChange}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <FormControlLabel value={USER_ROLES.STUDENT} control={<Radio />} label="طالب" />
                  <FormControlLabel value={USER_ROLES.PARENT} control={<Radio />} label="ولي أمر" />
                  <FormControlLabel value={USER_ROLES.TUTOR} control={<Radio />} label="معلم" />
                </RadioGroup>
                {touched.userRole && errors.userRole && (
                  <Typography color="error" variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                    {errors.userRole}
                  </Typography>
                )}
              </Box>

              {/* مستوى الحفظ - يظهر فقط للطلاب */}
              {values.userRole === USER_ROLES.STUDENT && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%' }}>
                  <Typography variant="body2" sx={{ color: '#5A340D', fontWeight: 'bold', mb: 1 }}>
                    مستوى الحفظ
                  </Typography>
                  <RadioGroup
                    row
                    name="memorizationLevel"
                    value={values.memorizationLevel}
                    onChange={handleChange}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 1,
                      flexWrap: 'wrap'
                    }}
                  >
                    <FormControlLabel value={MEMORIZATION_LEVELS.BEGINNER} control={<Radio />} label="مبتدئ" />
                    <FormControlLabel value={MEMORIZATION_LEVELS.INTERMEDIATE} control={<Radio />} label="متوسط" />
                    <FormControlLabel value={MEMORIZATION_LEVELS.ADVANCED} control={<Radio />} label="متقدم" />
                  </RadioGroup>
                  {touched.memorizationLevel && errors.memorizationLevel && (
                    <Typography color="error" variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                      {errors.memorizationLevel}
                    </Typography>
                  )}
                </Box>
              )}

              {/* اسم المستخدم */}
              <TextField
                fullWidth
                label="اسم المستخدم"
                name="username"
                placeholder="أدخل اسم المستخدم"
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
                value={values.username}
                onChange={handleChange}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />

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

              {/* رقم الهاتف */}
              <TextField
                fullWidth
                label="رقم الهاتف"
                name="phoneNumber"
                placeholder="أدخل رقم الهاتف"
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
                value={values.phoneNumber}
                onChange={handleChange}
                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
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

              {/* تأكيد كلمة المرور */}
              <TextField
                fullWidth
                label="تأكيد كلمة المرور"
                type="password"
                name="confirmPassword"
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
                value={values.confirmPassword}
                onChange={handleChange}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />

              {/* زر التسجيل */}
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={isLoading || isSubmitting}
                sx={{
                  backgroundColor: "#CD945F",
                  borderRadius: "18px",
                  mt: 2,
                  "&:hover": { backgroundColor: "#b3784d" },
                  "&:disabled": { backgroundColor: "#e0e0e0" },
                }}
              >
                {isLoading || isSubmitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                    إنشاء الحساب...
                  </Box>
                ) : (
                  'أنشئ حسابًا'
                )}
              </Button>

              {/* رابط تسجيل الدخول */}
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  لديك حساب بالفعل؟{' '}
                  <Link 
                    href="/login" 
                    sx={{ 
                      color: '#5A340D', 
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    سجل دخولك
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
