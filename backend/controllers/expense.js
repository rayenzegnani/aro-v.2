const Expense = require("../models/ExpenseModel");

// Middleware de vérification d'authentification
const checkAuth = (req, res, next) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({
            success: false,
            message: "Utilisateur non authentifié",
        });
    }
    next();
};

exports.addExpense = async (req, res) => {
    try {
        const { title, amount, category, description, date } = req.body;

        // Validation des champs obligatoires
        const requiredFields = { title, category, description, date, amount };
        const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Les champs suivants sont obligatoires : ${missingFields.join(", ")}`,
            });
        }

        // Validation du montant
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Le montant doit être un nombre valide et supérieur à 0",
            });
        }

        // Validation de la date
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Format de date invalide. Utilisez le format YYYY-MM-DD",
            });
        }

        const today = new Date();
        if (dateObj > today) {
            return res.status(400).json({
                success: false,
                message: "La date ne peut pas être dans le futur",
            });
        }

        // Vérifiez si l'utilisateur est authentifié
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non authentifié",
            });
        }

        // Création de la dépense
        const expense = new Expense({
            title,
            amount: numAmount,
            category,
            description,
            date: dateObj,
            user: req.user._id,
        });

        await expense.save();
        res.status(201).json({
            success: true,
            message: "Dépense ajoutée avec succès",
            data: expense,
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout de la dépense:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'ajout de la dépense",
            error: error.message,
        });
    }
};

exports.getExpense = async (req, res) => {
    try {
        // Vérifiez si l'utilisateur est authentifié
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non authentifié",
            });
        }

        // Récupérez les dépenses de l'utilisateur
        const expenses = await Expense.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des dépenses:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des dépenses",
            error: error.message,
        });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifiez si l'ID est fourni
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID de la dépense non fourni",
            });
        }

        // Vérifiez si l'utilisateur est authentifié
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non authentifié",
            });
        }

        // Recherchez la dépense à supprimer
        const expense = await Expense.findOne({ _id: id, user: req.user._id });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Dépense non trouvée",
            });
        }

        await expense.deleteOne();

        res.status(200).json({
            success: true,
            message: "Dépense supprimée avec succès",
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de la dépense:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de la dépense",
            error: error.message,
        });
    }
};