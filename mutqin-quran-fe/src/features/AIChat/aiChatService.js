// AI Voice Chat service for handling voice-only chat functionality
// Note: This service only accepts voice input, no text input supported
const aiChatService = {
  /**
   * Get the AI Chat URL
   * @returns {string} - The Hugging Face Space URL
   */
  getChatUrl() {
    return 'https://mahmoudgomaa8545-tasmee3-mutqin.hf.space/';
  },

  /**
   * Open AI Chat in a new tab
   */
  openChatInNewTab() {
    window.open(this.getChatUrl(), '_blank', 'noopener,noreferrer');
  },

  /**
   * Redirect to AI Chat in the same window
   */
  redirectToChat() {
    window.location.href = this.getChatUrl();
  },

  /**
   * Check if the chat service is available
   * @returns {Promise<boolean>} - True if the service is accessible
   */
  async checkAvailability() {
    try {
      await fetch(this.getChatUrl(), { 
        method: 'HEAD', 
        mode: 'no-cors' 
      });
      return true;
    } catch (error) {
      console.warn('AI Chat service may not be available:', error);
      return false;
    }
  }
};

export default aiChatService;