const aiService = require('../services/ai.service');

/**
 * Get financial advice from AI based on user query
 * @param {Object} req - Express request object with query in the body
 * @param {Object} res - Express response object
 */
const getFinancialAdvice = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a query'
      });
    }

    const aiResponse = await aiService.getFinancialAdvice(query);
    
    return res.status(200).json({
      success: true,
      message: 'Financial advice retrieved successfully',
      data: aiResponse
    });
  } catch (error) {
    console.error('Error in getFinancialAdvice controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get financial advice'
    });
  }
};

module.exports = {
  getFinancialAdvice
};