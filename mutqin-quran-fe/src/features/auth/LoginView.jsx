import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  Link,
  Divider,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";

const validationSchema = Yup.object({
  email: Yup.string().email("صيغة البريد الإلكتروني غير صحيحة").required("البريد الإلكتروني مطلوب"),
  password: Yup.string().required("كلمة المرور مطلوبة"),
});

export default function LoginView() {
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

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  }
                }}
              >
                تسجيل الدخول
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
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  console.log("تسجيل الدخول بـ Google");
                }}
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
                  }
                }}
              >
                <FcGoogle size={20} />
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#424242"
                  }}
                >
                  تسجيل الدخول بواسطة Google
                </Typography>
              </Button>


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
