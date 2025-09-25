import React, { useEffect, useState } from 'react';
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
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { FaSignOutAlt, FaCog, FaBell, FaUser, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUserProfileViewModel } from './UserProfileViewModel.js';
import authService from '../auth/authService.js';

export default function UserProfileArabicUI() {
  const navigate = useNavigate();
  
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
    isAuthenticated,
    updateProfile,
    deleteAccount
  } = useUserProfileViewModel();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    phone: ''
  });

  // Original data to track changes
  const [originalData, setOriginalData] = useState({
    username: '',
    phone: ''
  });

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      const profileData = {
        username: profile.username || '',
        phone: profile.phone || ''
      };
      setFormData(profileData);
      setOriginalData(profileData);
    }
  }, [profile]);

  // Check if data has changed
  const hasChanges = () => {
    return formData.username !== originalData.username || 
           formData.phone !== originalData.phone;
  };

  // Handle input changes
  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    // Check if any data has changed
    if (!hasChanges()) {
      return; // No changes to save
    }

    try {
      const updateData = {
        username: formData.username,
        phone: formData.phone
      };
      
      const success = await updateProfile(updateData);
      if (success) {
        // Update original data to match current data
        setOriginalData({
          username: formData.username,
          phone: formData.phone
        });
        // Refresh profile data to show updated info
        fetchProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Handle settings toggle
  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  // Handle delete account dialog
  const handleDeleteAccountClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteConfirmationText('');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText.toLowerCase() !== 'حذف') {
      return;
    }

    try {
      const result = await deleteAccount();
      if (result.success) {
        // User will be automatically logged out and redirected
        navigate('/login', { 
          replace: true,
          state: { message: result.message }
        });
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      handleDeleteDialogClose();
    }
  };

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
        <MenuItem 
          sx={{ justifyContent: 'flex-end', gap: 1 }}
          onClick={handleSettingsClick}
        >
          الإعدادات <FaCog />
        </MenuItem>
        <MenuItem sx={{ justifyContent: 'flex-end', gap: 1 }}>
          إشعارات <FaBell />
        </MenuItem>

        {/* Settings submenu - appears when settings is clicked */}
        {showSettings && (
          <>
            <Divider sx={{ my: 1 }} />
            <MenuItem
              sx={{
                justifyContent: 'flex-end',
                gap: 1,
                color: 'error.main',
                fontWeight: 'bold',
                mr: 2,
                fontSize: '0.9rem'
              }}
              onClick={handleDeleteAccountClick}
            >
              حذف الحساب <FaTrash />
            </MenuItem>
          </>
        )}
        <Divider sx={{ my: 2 }} />
        <MenuItem
          sx={{
            justifyContent: 'flex-end',
            gap: 1,
            color: 'error.main',
            fontWeight: 'bold'
          }}
          onClick={handleLogout}
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
          value={formData.username}
          onChange={handleInputChange('username')}
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
          value={formData.phone}
          onChange={handleInputChange('phone')}
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
          label="العمر"
          value={profile.age || ''}
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
              direction: 'ltr'
            }
          }}
          disabled
        />
        <TextField
          fullWidth
          label="النقاط"
          value={profile.points || '0'}
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
              direction: 'ltr'
            }
          }}
          disabled
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
          disabled={isUpdating || !hasChanges()}
          onClick={handleSaveChanges}
        >
          {isUpdating ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              جاري الحفظ...
            </>
          ) : !hasChanges() ? (
            'لا توجد تغييرات'
          ) : (
            'حفظ التغييرات'
          )}
        </Button>
      </Paper>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            direction: 'rtl',
            textAlign: 'right'
          }
        }}
      >
        <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
          تأكيد حذف الحساب
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, direction: 'rtl' }}>
            <strong>تحذير:</strong> هذا الإجراء لا يمكن التراجع عنه!
          </DialogContentText>
          <DialogContentText sx={{ mb: 2, direction: 'rtl' }}>
            سيتم حذف حسابك وجميع بياناتك بشكل نهائي من المنصة. لن تتمكن من استرداد أي من المعلومات أو البيانات المرتبطة بحسابك.
          </DialogContentText>
          <DialogContentText sx={{ mb: 3, direction: 'rtl' }}>
            للمتابعة، يرجى كتابة كلمة <strong>"حذف"</strong> في الحقل أدناه:
          </DialogContentText>
          <TextField
            fullWidth
            label="اكتب 'حذف' للتأكيد"
            value={deleteConfirmationText}
            onChange={(e) => setDeleteConfirmationText(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': {
                right: 0,
                left: 'auto',
                transformOrigin: 'top right',
                textAlign: 'right'
              },
              '& .MuiOutlinedInput-root': {
                direction: 'rtl'
              }
            }}
            error={deleteConfirmationText !== '' && deleteConfirmationText.toLowerCase() !== 'حذف'}
            helperText={deleteConfirmationText !== '' && deleteConfirmationText.toLowerCase() !== 'حذف' ? 'يجب كتابة كلمة "حذف" بالضبط' : ''}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start', gap: 2, p: 3 }}>
          <Button
            onClick={handleDeleteDialogClose}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
            disabled={isUpdating || deleteConfirmationText.toLowerCase() !== 'حذف'}
            sx={{ minWidth: 100 }}
          >
            {isUpdating ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                جاري الحذف...
              </>
            ) : (
              'حذف الحساب نهائياً'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
