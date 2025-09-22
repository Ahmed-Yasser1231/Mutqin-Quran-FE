import React, { useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Divider,
  MenuItem,
  Paper,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import { FaSignOutAlt, FaCog, FaBell, FaUser } from 'react-icons/fa';
import { useUserProfileViewModel } from './UserProfileViewModel.js';

export default function UserProfileArabicUI() {
  const {
    profile,
    isLoading,
    error,
    isUpdating,
    updateSuccess,
    fetchProfile,
    reloadProfile,
    clearError,
    clearSuccess,
    isAuthenticated
  } = useUserProfileViewModel();

  // success message timeout
  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(clearSuccess, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, clearSuccess]);

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="warning">يجب تسجيل الدخول لعرض الملف الشخصي</Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={clearError}>
              إغلاق
            </Button>
          }
        >
          {error}
        </Alert>
        <Button variant="contained" onClick={reloadProfile}>إعادة المحاولة</Button>
      </Container>
    );
  }

  if (!profile) {
    fetchProfile();
    return null;
  }

  return (
    <Box
      sx={{
        bgcolor: '#5a3416',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        p: { xs: 2, md: 6 },
        gap: { xs: 2, md: 4 },
        direction: 'rtl'
      }}
    >
      {/* === Left side menu === */}
      <Paper
        elevation={4}
        sx={{
          width: 260,
          p: 3,
          borderRadius: 3,
          bgcolor: '#f5ead9',
          textAlign: 'center'
        }}
      >
        <Avatar
          src={profile.avatarUrl || ''}
          sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
        />
        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
          {profile.username || 'اسمك'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profile.email}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Menu items */}
        <MenuItem sx={{ justifyContent: 'flex-end', gap: 1 }}>
          الملف الشخصي <FaUser />
        </MenuItem>
        <MenuItem sx={{ justifyContent: 'flex-end', gap: 1 }}>
          الإعدادات <FaCog />
        </MenuItem>
        <MenuItem sx={{ justifyContent: 'flex-end', gap: 1 }}>
          إشعارات <FaBell />
        </MenuItem>
        <Divider sx={{ my: 2 }} />
        <MenuItem
          sx={{
            justifyContent: 'flex-end',
            gap: 1,
            color: 'error.main',
            fontWeight: 'bold'
          }}
          onClick={() => alert('تسجيل الخروج')}
        >
          تسجيل الخروج <FaSignOutAlt />
        </MenuItem>
      </Paper>

      {/* === Right side edit form === */}
      <Paper
        elevation={4}
        sx={{
          flexGrow: 1,
          maxWidth: 500,
          p: 4,
          borderRadius: 3,
          bgcolor: '#f5ead9',
          direction: 'rtl'
        }}
      >
        {updateSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            تم حفظ التغييرات بنجاح
          </Alert>
        )}

        <Box textAlign="center" mb={2}>
          <Avatar
            src={profile.avatarUrl || ''}
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 1,
              cursor: 'pointer'
            }}
          />
          <Typography variant="subtitle1">{profile.username}</Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.email}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="الاسم"
          defaultValue={profile.username}
          variant="standard"
          sx={{ 
            mb: 2,
            '& .MuiInputLabel-root': {
              right: 0,
              left: 'auto',
              transformOrigin: 'top right',
              textAlign: 'right'
            },
            '& .MuiInput-root': {
              direction: 'rtl'
            }
          }}
        />
        <TextField
          fullWidth
          label="حساب البريد الإلكتروني"
          value={profile.email}
          variant="standard"
          sx={{ 
            mb: 2,
            '& .MuiInputLabel-root': {
              right: 0,
              left: 'auto',
              transformOrigin: 'top right',
              textAlign: 'right'
            },
            '& .MuiInput-root': {
              direction: 'ltr' // Keep email LTR for readability
            }
          }}
          disabled
        />
        <TextField
          fullWidth
          label="رقم الجوال"
          defaultValue={profile.phone || ''}
          variant="standard"
          sx={{ 
            mb: 2,
            '& .MuiInputLabel-root': {
              right: 0,
              left: 'auto',
              transformOrigin: 'top right',
              textAlign: 'right'
            },
            '& .MuiInput-root': {
              direction: 'ltr' // Keep phone number LTR
            }
          }}
        />
        <TextField
          fullWidth
          label="الدور"
          value={profile.role === 'STUDENT' ? 'طالب' : profile.role === 'TUTOR' ? 'معلم' : profile.role === 'PARENT' ? 'ولي أمر' : profile.role}
          variant="standard"
          sx={{ 
            mb: 2,
            '& .MuiInputLabel-root': {
              right: 0,
              left: 'auto',
              transformOrigin: 'top right',
              textAlign: 'right'
            },
            '& .MuiInput-root': {
              direction: 'rtl'
            }
          }}
          disabled
        />
        <TextField
          fullWidth
          label="مستوى الحفظ"
          value={profile.memorizationleveltype === 'BEGINNER' ? 'مبتدئ' : profile.memorizationleveltype === 'INTERMEDIATE' ? 'متوسط' : profile.memorizationleveltype === 'ADVANCED' ? 'متقدم' : profile.memorizationleveltype === 'HAFIZ' ? 'حافظ' : profile.memorizationleveltype || 'غير محدد'}
          variant="standard"
          sx={{ 
            mb: 3,
            '& .MuiInputLabel-root': {
              right: 0,
              left: 'auto',
              transformOrigin: 'top right',
              textAlign: 'right'
            },
            '& .MuiInput-root': {
              direction: 'rtl'
            }
          }}
          disabled
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ bgcolor: '#a86834', '&:hover': { bgcolor: '#8f5426' } }}
          disabled={isUpdating}
          onClick={() => alert('حفظ التغييرات')}
        >
          حفظ التغييرات
        </Button>
      </Paper>
    </Box>
  );
}
