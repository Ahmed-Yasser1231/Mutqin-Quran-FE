import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import authService from '../auth/authService.js';
import userProfileService from './userProfileService.js';

/**
 * Test component to demonstrate the token storage and profile API integration
 * This component shows how the login saves the token and how to call the profile API
 */
export default function TokenTestComponent() {
  const [loginResult, setLoginResult] = useState(null);
  const [profileResult, setProfileResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [storedToken, setStoredToken] = useState(null);

  // Test login with sample credentials
  const testLogin = async () => {
    setIsLoading(true);
    setLoginResult(null);
    
    try {
      // You can modify these test credentials
      const result = await authService.login('test@example.com', 'password123');
      setLoginResult(result);
      
      // Check stored token
      const token = authService.getToken();
      setStoredToken(token);
    } catch (error) {
      setLoginResult({
        success: false,
        error: 'خطأ في الاختبار: ' + error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test profile API call
  const testProfileAPI = async () => {
    setIsLoading(true);
    setProfileResult(null);
    
    try {
      const result = await userProfileService.getUserProfile();
      setProfileResult(result);
    } catch (error) {
      setProfileResult({
        success: false,
        error: 'خطأ في اختبار الملف الشخصي: ' + error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check current token
  const checkStoredToken = () => {
    const token = authService.getToken();
    setStoredToken(token);
    
    alert(`
      Token: ${token || 'لا يوجد'}
      Authenticated: ${authService.isAuthenticated()}
      ملاحظة: لا نحفظ بيانات المستخدم في localStorage، نحصل عليها من Profile API
    `);
  };

  // Clear auth data
  const clearAuthData = () => {
    authService.logout();
    setStoredToken(null);
    setLoginResult(null);
    setProfileResult(null);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        اختبار التدفق الصحيح: Login → Token → Profile API
      </Typography>
      
      <Typography variant="body1" color="text.secondary" mb={3}>
        التدفق الصحيح: تسجيل الدخول → حفظ Token → استدعاء Profile API → عرض البيانات
      </Typography>

      <Grid container spacing={3}>
        {/* Test Controls */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                أدوات الاختبار
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  onClick={testLogin}
                  disabled={isLoading}
                  fullWidth
                >
                  {isLoading ? <CircularProgress size={20} /> : 'اختبار تسجيل الدخول'}
                </Button>
                
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={testProfileAPI}
                  disabled={isLoading || !authService.isAuthenticated()}
                  fullWidth
                >
                  {isLoading ? <CircularProgress size={20} /> : 'اختبار API الملف الشخصي'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={checkStoredToken}
                  fullWidth
                >
                  فحص Token المحفوظ
                </Button>
                
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearAuthData}
                  fullWidth
                >
                  مسح بيانات المصادقة
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Display */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              النتائج
            </Typography>

            {/* Current Token Status */}
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                حالة Token الحالي:
              </Typography>
              <Alert severity={authService.isAuthenticated() ? 'success' : 'warning'}>
                {authService.isAuthenticated() 
                  ? `مصادق ✓ - Token: ${storedToken?.substring(0, 50)}...`
                  : 'غير مصادق - لا يوجد token'
                }
              </Alert>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                ملاحظة: بيانات المستخدم يتم جلبها من Profile API، لا تُحفظ في localStorage
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Login Result */}
            {loginResult && (
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  نتيجة تسجيل الدخول:
                </Typography>
                <Alert severity={loginResult.success ? 'success' : 'error'}>
                  {loginResult.success ? (
                    <div>
                      <strong>نجح تسجيل الدخول!</strong>
                      <br />
                      الرسالة: {loginResult.message}
                      <br />
                      Token محفوظ: {storedToken ? 'نعم ✓' : 'لا ✗'}
                    </div>
                  ) : (
                    <div>
                      <strong>فشل تسجيل الدخول</strong>
                      <br />
                      الخطأ: {loginResult.error}
                    </div>
                  )}
                </Alert>
              </Box>
            )}

            {/* Profile Result */}
            {profileResult && (
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  نتيجة API الملف الشخصي:
                </Typography>
                <Alert severity={profileResult.success ? 'success' : 'error'}>
                  {profileResult.success ? (
                    <div>
                      <strong>تم جلب الملف الشخصي بنجاح!</strong>
                      <br />
                      البيانات: {JSON.stringify(profileResult.data, null, 2)}
                    </div>
                  ) : (
                    <div>
                      <strong>فشل جلب الملف الشخصي</strong>
                      <br />
                      الخطأ: {profileResult.error}
                      <br />
                      الكود: {profileResult.code}
                    </div>
                  )}
                </Alert>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Instructions */}
      <Paper sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          تعليمات الاستخدام - التدفق الصحيح:
        </Typography>
        <Typography variant="body2" component="div">
          <ol>
            <li><strong>تسجيل الدخول:</strong> اضغط "اختبار تسجيل الدخول" → يتم حفظ Token فقط</li>
            <li><strong>استدعاء Profile API:</strong> اضغط "اختبار API الملف الشخصي" → يرسل Token ويجلب بيانات المستخدم</li>
            <li><strong>عرض البيانات:</strong> البيانات تُعرض من الاستجابة مباشرة، لا تُحفظ في localStorage</li>
            <li><strong>فحص Token:</strong> استخدم "فحص Token المحفوظ" لرؤية Token المحفوظ فقط</li>
          </ol>
          <br />
          <strong>🎯 الفكرة الأساسية:</strong>
          <ul>
            <li>✅ Login API → حفظ Token فقط</li>
            <li>✅ Profile API → استخدام Token لجلب بيانات المستخدم</li>
            <li>✅ لا نحفظ بيانات المستخدم في localStorage</li>
            <li>✅ البيانات تُجلب حسب الحاجة من الخادم</li>
          </ul>
          <br />
          <strong>ملاحظة:</strong> يجب أن يكون الخادم الخلفي يعمل على http://localhost:8080
        </Typography>
      </Paper>
    </Box>
  );
}