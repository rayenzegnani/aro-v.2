const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Service to interact with OpenRouter AI API for financial advice
 */
class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.siteUrl = process.env.SITE_URL || 'http://localhost:5173';
    this.siteName = process.env.SITE_NAME || 'Finance Advisor';
    this.model = process.env.AI_MODEL || 'meta-llama/llama-4-maverick:free';
    this.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  }

  /**
   * Get financial advice from AI based on user query
   * @param {string} query - User's financial question
   * @returns {Promise<object>} - AI response
   */
  async getFinancialAdvice(query) {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Act as a knowledgeable and empathetic financial advisor chatbot designed to help users achieve their financial goals. Your expertise includes budgeting, investing, retirement planning, debt management, savings strategies, tax optimization, and insurance. Communicate in a professional yet approachable tone, simplifying complex concepts (e.g., compound interest, asset allocation) into easy-to-understand language without jargon.'
            },
            {
              role: 'user',
              content: query
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': this.siteUrl,
            'X-Title': this.siteName,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error calling OpenRouter AI:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || 'Failed to get financial advice');
    }
  }
}

module.exports = new AIService();