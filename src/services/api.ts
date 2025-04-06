
// Backend API service

// Base URL for the API - change this to your production URL when deploying
const API_BASE_URL = 'http://127.0.0.1:8000';

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'kn', name: 'Kannada' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' }
];

// Get language name by code
export const getLanguageName = (code: string): string => {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  return language ? language.name : 'Unknown';
};

// Get language code for speech recognition
export const getSpeechLanguageCode = (code: string): string => {
  const languageMap: Record<string, string> = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'ta': 'ta-IN',
    'kn': 'kn-IN',
    'te': 'te-IN',
    'mr': 'mr-IN'
  };
  return languageMap[code] || 'en-US';
};

// API endpoints
export const ApiService = {
  // Start voice assistant
  startVoiceAssistant: async (language: string) => {
    try {
      console.log(`Starting voice assistant in ${language}...`);
      const response = await fetch(`${API_BASE_URL}/start_voice_assistant/${language}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to start voice assistant');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error starting voice assistant:', error);
      throw error;
    }
  },
  
  // Text-based question answering
  askQuestion: async (question: string, language: string) => {
    try {
      console.log(`Asking question in ${language}: ${question}`);
      const formData = new FormData();
      formData.append('question', question);
      formData.append('language', language);
      
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get answer');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error asking question:', error);
      throw error;
    }
  },
  
  // Crop detection
  detectCrop: async (imageFile: File) => {
    try {
      console.log('Detecting crop from image...');
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await fetch(`${API_BASE_URL}/detect_crop`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to detect crop');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error detecting crop:', error);
      throw error;
    }
  },
  
  // Weather information
  getWeather: async (cityName: string, language: string) => {
    try {
      console.log(`Getting weather for ${cityName} in ${language}...`);
      const response = await fetch(`${API_BASE_URL}/weather/${encodeURIComponent(cityName)}?language=${language}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get weather data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting weather:', error);
      throw error;
    }
  }
};
