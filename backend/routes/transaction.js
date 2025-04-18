const { addExpense, getExpense, deleteExpense } = require('../controllers/expense.js');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income.js');
const verifyToken  = require('../middleware/verifyToken');

const router = require('express').Router();

// Routes pour les revenus
router.post('/add-income', verifyToken, addIncome); // Ajouter un revenu
router.get('/get-incomes', verifyToken, getIncomes); // Récupérer tous les revenus
router.delete('/delete-income/:id', verifyToken, deleteIncome); // Supprimer un revenu par ID

// Routes pour les dépenses
router.post('/add-expense', verifyToken, addExpense); // Ajouter une dépense
router.get('/get-expenses', verifyToken, getExpense); // Récupérer toutes les dépenses
router.delete('/delete-expense/:id', verifyToken, deleteExpense); // Supprimer une dépense par ID

module.exports = router;