import { useState } from 'react';
import sessionConfirmService from './sessionConfirmService';

const useSessionConfirmViewModel = () => {
  // State management
  const [eventUuid, setEventUuid] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [isSearchingStudent, setIsSearchingStudent] = useState(false);
  const [isConfirmingSession, setIsConfirmingSession] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [tutorId, setTutorId] = useState(null);

  // Initialize tutor ID on component mount
  const initializeTutorId = () => {
    const currentTutorId = sessionConfirmService.getCurrentTutorId();
    setTutorId(currentTutorId);
    return currentTutorId;
  };

  // Clear all messages
  const clearMessages = () => {
    setSearchError('');
    setConfirmError('');
    setSuccessMessage('');
  };

  // Clear all form data
  const clearForm = () => {
    setEventUuid('');
    setStudentEmail('');
    setStudentData(null);
    clearMessages();
  };

  // Search for student by email
  const searchStudent = async (email) => {
    if (!email) {
      setSearchError('يرجى إدخال البريد الإلكتروني للطالب');
      return false;
    }

    if (!sessionConfirmService.isValidEmail(email)) {
      setSearchError('تنسيق البريد الإلكتروني غير صحيح');
      return false;
    }

    setIsSearchingStudent(true);
    setSearchError('');
    setStudentData(null);

    try {
      const result = await sessionConfirmService.searchStudent(email);
      
      if (result.success && result.data) {
        // Validate that we have the required student data
        if (result.data.id && result.data.email) {
          setStudentData(result.data);
          setSuccessMessage('تم العثور على الطالب بنجاح');
          return true;
        } else {
          setSearchError('بيانات الطالب غير مكتملة');
          return false;
        }
      } else {
        setSearchError(result.message || 'حدث خطأ في البحث عن الطالب');
        return false;
      }
    } catch (error) {
      console.error('Search student error:', error);
      setSearchError('حدث خطأ غير متوقع في البحث عن الطالب');
      return false;
    } finally {
      setIsSearchingStudent(false);
    }
  };

  // Confirm session
  const confirmSession = async () => {
    // Validate inputs
    if (!eventUuid) {
      setConfirmError('يرجى إدخال معرف الحدث');
      return false;
    }

    if (!sessionConfirmService.isValidEventUuid(eventUuid)) {
      setConfirmError('تنسيق معرف الحدث غير صحيح');
      return false;
    }

    if (!studentData) {
      setConfirmError('يرجى البحث عن الطالب أولاً');
      return false;
    }

    const currentTutorId = tutorId || sessionConfirmService.getCurrentTutorId();
    if (!currentTutorId) {
      setConfirmError('لم يتم العثور على معرف المدرس. يرجى تسجيل الدخول مرة أخرى');
      return false;
    }

    setIsConfirmingSession(true);
    setConfirmError('');
    setSuccessMessage('');

    try {
      const result = await sessionConfirmService.confirmSession(
        eventUuid,
        parseInt(studentData.id),
        parseInt(currentTutorId)
      );
      
      if (result.success) {
        setSuccessMessage('تم تأكيد الجلسة بنجاح!');
        // Clear form after successful confirmation
        setTimeout(() => {
          clearForm();
        }, 2000);
        return true;
      } else {
        setConfirmError(result.message || 'حدث خطأ في تأكيد الجلسة');
        return false;
      }
    } catch (error) {
      console.error('Confirm session error:', error);
      setConfirmError('حدث خطأ غير متوقع في تأكيد الجلسة');
      return false;
    } finally {
      setIsConfirmingSession(false);
    }
  };

  // Handle event UUID input change
  const handleEventUuidChange = (value) => {
    setEventUuid(value);
    clearMessages();
  };

  // Handle student email input change
  const handleStudentEmailChange = (value) => {
    setStudentEmail(value);
    setSearchError('');
    setStudentData(null);
  };

  // Handle search button click
  const handleSearchStudent = async () => {
    const success = await searchStudent(studentEmail);
    return success;
  };

  // Handle confirm button click
  const handleConfirmSession = async () => {
    const success = await confirmSession();
    return success;
  };

  // Validate form
  const isFormValid = () => {
    return eventUuid && 
           studentData && 
           sessionConfirmService.isValidEventUuid(eventUuid) && 
           (tutorId || sessionConfirmService.getCurrentTutorId());
  };

  // Check if search is possible
  const canSearchStudent = () => {
    return studentEmail && 
           sessionConfirmService.isValidEmail(studentEmail) && 
           !isSearchingStudent;
  };

  return {
    // State
    eventUuid,
    studentEmail,
    studentData,
    isSearchingStudent,
    isConfirmingSession,
    searchError,
    confirmError,
    successMessage,
    tutorId,

    // Actions
    initializeTutorId,
    handleEventUuidChange,
    handleStudentEmailChange,
    handleSearchStudent,
    handleConfirmSession,
    clearForm,
    clearMessages,

    // Computed
    isFormValid: isFormValid(),
    canSearchStudent: canSearchStudent(),
    
    // Utilities
    isValidEventUuid: sessionConfirmService.isValidEventUuid,
    isValidEmail: sessionConfirmService.isValidEmail
  };
};

export default useSessionConfirmViewModel;