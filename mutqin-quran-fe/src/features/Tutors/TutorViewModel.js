import { useState, useEffect } from 'react';
import tutorService from './tutorService.js';

// Custom hook for tutor management (ViewModel)
const useTutorViewModel = () => {
  // State management
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all tutors
  const fetchTutors = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await tutorService.getAllTutors();
      
      if (result.success) {
        setTutors(result.data || []);
        setSuccess(result.message);
      } else {
        setError(result.message || 'فشل في جلب بيانات المعلمين');
        setTutors([]);
      }
    } catch (err) {
      console.error('Error fetching tutors:', err);
      setError('حدث خطأ غير متوقع أثناء جلب بيانات المعلمين');
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific tutor by ID
  const fetchTutorById = async (tutorId) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await tutorService.getTutorById(tutorId);
      
      if (result.success) {
        setSelectedTutor(result.data);
        setSuccess(result.message);
      } else {
        setError(result.message || 'فشل في جلب بيانات المعلم');
        setSelectedTutor(null);
      }
    } catch (err) {
      console.error('Error fetching tutor by ID:', err);
      setError('حدث خطأ غير متوقع أثناء جلب بيانات المعلم');
      setSelectedTutor(null);
    } finally {
      setLoading(false);
    }
  };

  // Select a tutor from the list
  const selectTutor = (tutor) => {
    setSelectedTutor(tutor);
    setError('');
    setSuccess('');
  };

  // Clear selected tutor
  const clearSelectedTutor = () => {
    setSelectedTutor(null);
    setError('');
    setSuccess('');
  };

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Filter tutors by search term
  const filterTutors = (searchTerm) => {
    if (!searchTerm) return tutors;
    
    return tutors.filter(tutor => 
      tutor.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.phone?.includes(searchTerm)
    );
  };

  // Get tutor statistics
  const getTutorStats = () => {
    return {
      totalTutors: tutors.length,
      tutorsWithPhone: tutors.filter(tutor => tutor.phone).length,
      tutorsWithProfilePicture: tutors.filter(tutor => tutor.profilePictureUrl).length,
      averagePoints: tutors.length > 0 
        ? (tutors.reduce((sum, tutor) => sum + parseInt(tutor.points || 0), 0) / tutors.length).toFixed(1)
        : 0
    };
  };

  // Auto-fetch tutors on component mount
  useEffect(() => {
    fetchTutors();
  }, []);

  return {
    // State
    tutors,
    selectedTutor,
    loading,
    error,
    success,
    
    // Actions
    fetchTutors,
    fetchTutorById,
    selectTutor,
    clearSelectedTutor,
    clearMessages,
    filterTutors,
    getTutorStats,
  };
};

export default useTutorViewModel;