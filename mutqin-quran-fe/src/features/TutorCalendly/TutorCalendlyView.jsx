import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { FiCalendar, FiLink, FiCheck, FiInfo } from 'react-icons/fi';
import { useTutorCalendlyViewModel } from './TutorCalendlyViewModel';

const TutorCalendlyView = () => {
  const [sessionLink, setSessionLink] = useState('');
  const {
    isLoading,
    error,
    success,
    updateSessionLink,
    clearError,
    clearSuccess,
    validateLink
  } = useTutorCalendlyViewModel();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!sessionLink.trim()) {
      return;
    }

    await updateSessionLink(sessionLink.trim());
  };

  const handleLinkChange = (e) => {
    const newLink = e.target.value;
    setSessionLink(newLink);
    
    // Clear previous states when user starts typing
    if (error) clearError();
    if (success) clearSuccess();
  };

  const isValidLink = sessionLink.trim() && validateLink(sessionLink.trim());

  return (
    <Box
      dir="rtl"
      sx={{
        backgroundColor: "#5A340D",
        minHeight: "100vh",
        padding: "20px",
        paddingTop: "80px", // Account for fixed navigation
      }}
    >
      <Box sx={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#F8F1DE",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            textAlign: "center"
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <FiCalendar size={32} color="#CD945F" />
            <Typography
              variant="h4"
              sx={{
                color: "#5A340D",
                fontWeight: "bold",
                marginRight: "12px"
              }}
            >
              إعداد Calendly
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ color: "#666", fontSize: "16px" }}
          >
            قم بإضافة رابط Calendly الخاص بك لتسهيل حجز الجلسات مع الطلاب
          </Typography>
        </Paper>

        {/* Instructions Card */}
        <Card
          sx={{
            backgroundColor: "#F8F1DE",
            borderRadius: "16px",
            marginBottom: "24px",
            border: "1px solid #E0E0E0"
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FiInfo size={20} color="#CD945F" />
              <Typography
                variant="h6"
                sx={{ color: "#5A340D", fontWeight: "bold", marginRight: "8px" }}
              >
                كيفية الحصول على رابط Calendly
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6, mb: 2 }}>
              1. قم بتسجيل الدخول إلى حسابك في Calendly
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6, mb: 2 }}>
              2. اذهب إلى "Event Types" وحدد نوع الحدث المطلوب
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6, mb: 2 }}>
              3. انسخ الرابط من المتصفح أو من صفحة الحدث
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
              <strong>مثال:</strong> https://calendly.com/username/meeting-name
            </Typography>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#F8F1DE",
            borderRadius: "16px",
            padding: "32px"
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#5A340D",
                  fontWeight: "bold",
                  marginBottom: "12px",
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <FiLink size={20} style={{ marginLeft: '8px' }} />
                رابط جلسة Calendly
              </Typography>
              
              <TextField
                fullWidth
                value={sessionLink}
                onChange={handleLinkChange}
                placeholder="https://calendly.com/username/meeting-name"
                variant="outlined"
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: isValidLink ? "#4caf50" : "#E0E0E0",
                      borderWidth: isValidLink ? "2px" : "1px"
                    },
                    "&:hover fieldset": {
                      borderColor: isValidLink ? "#4caf50" : "#CD945F",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: isValidLink ? "#4caf50" : "#CD945F",
                    }
                  }
                }}
                InputProps={{
                  endAdornment: isValidLink && (
                    <FiCheck size={20} color="#4caf50" />
                  )
                }}
              />
              
              {sessionLink.trim() && !isValidLink && (
                <Typography
                  variant="caption"
                  sx={{ color: "#f44336", marginTop: "8px", display: "block" }}
                >
                  رابط غير صحيح. يجب أن يكون بالصيغة: https://calendly.com/username/meeting-name
                </Typography>
              )}
            </Box>

            <Divider sx={{ marginY: "24px" }} />

            {/* Error Alert */}
            {error && (
              <Alert
                severity="error"
                sx={{ marginBottom: "16px", borderRadius: "12px" }}
                onClose={clearError}
              >
                {error}
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert
                severity="success"
                sx={{ marginBottom: "16px", borderRadius: "12px" }}
                onClose={clearSuccess}
              >
                تم حفظ رابط Calendly بنجاح! يمكن للطلاب الآن حجز جلسات معك
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!isValidLink || isLoading}
              sx={{
                backgroundColor: "#CD945F",
                color: "white",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#B8834A",
                },
                "&:disabled": {
                  backgroundColor: "#E0E0E0",
                  color: "#9E9E9E"
                }
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'inherit' }} />
                  جاري الحفظ...
                </Box>
              ) : (
                'حفظ رابط Calendly'
              )}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default TutorCalendlyView;