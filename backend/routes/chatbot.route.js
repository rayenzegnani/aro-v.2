const express = require('express');
const router = express.Router();
const { getFinancialAdvice } = require('../controllers/chatbot.controller');
const verifyToken = require('../middleware/verifyToken');

// Route to get financial advice from AI
router.post('/message', getFinancialAdvice);

module.exports = router;