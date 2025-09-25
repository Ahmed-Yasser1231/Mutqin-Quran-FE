import { useState, useCallback } from 'react';
import aiChatService from './aiChatService.js';

/**
 * Custom hook for AI Chat management
 * @returns {Object} - AI Chat state and functions
 */
export const useAIChat = () => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check if AI Chat service is available
   */
  const checkAvailability = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const available = await aiChatService.checkAvailability();
      setIsAvailable(available);
      
      if (!available) {
        setError('خدمة الذكي الاصطناعي غير متاحة حالياً. يرجى المحاولة لاحقاً.');
      }
    } catch (error) {
      console.error('Error checking AI Chat availability:', error);
      setError('حدث خطأ أثناء التحقق من توفر الخدمة');
      setIsAvailable(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Open AI Chat in a new tab
   */
  const openChatInNewTab = useCallback(() => {
    try {
      aiChatService.openChatInNewTab();
    } catch (error) {
      console.error('Error opening AI Chat:', error);
      setError('حدث خطأ أثناء فتح نافذة المحادثة');
    }
  }, []);

  /**
   * Redirect to AI Chat in the same window
   */
  const redirectToChat = useCallback(() => {
    try {
      setIsLoading(true);
      aiChatService.redirectToChat();
    } catch (error) {
      console.error('Error redirecting to AI Chat:', error);
      setError('حدث خطأ أثناء التوجيه إلى صفحة المحادثة');
      setIsLoading(false);
    }
  }, []);

  /**
   * Get the chat URL
   */
  const getChatUrl = useCallback(() => {
    return aiChatService.getChatUrl();
  }, []);

  return {
    // State
    isLoading,
    isAvailable,
    error,
    
    // Actions
    checkAvailability,
    openChatInNewTab,
    redirectToChat,
    clearError,
    getChatUrl
  };
};

export default useAIChat;