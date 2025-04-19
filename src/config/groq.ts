// Check if API key is available
const apiKey = import.meta.env.VITE_GROQ_API_KEY;
if (!apiKey) {
  console.error('Groq API key is missing. Please check your .env file and make sure VITE_GROQ_API_KEY is set.');
}

export const GROQ_CONFIG = {
  API_KEY: apiKey,
  BASE_URL: 'https://api.groq.com/openai/v1',
  MODEL: 'meta-llama/llama-4-maverick-17b-128e-instruct', // Updated to use the specified model
  TEMPERATURE: 0.7,
  MAX_TOKENS: 1000,
};

// Debug information
console.log('Groq Configuration:', {
  ...GROQ_CONFIG,
  API_KEY: apiKey ? '***' : 'MISSING', // Don't log the actual API key
}); 