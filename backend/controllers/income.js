const IncomeSchema = require("../models/incomeModel");

exports.addIncome = async (req, res) => {
    try {
        const { title, amount, category, description, date } = req.body;

        // Validation des champs requis
        if (!title || !category || !description || !date) {
            return res.status(400).json({
                success: false,
                message: "Tous les champs sont obligatoires",
            });
        }

        // Validation du montant
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Le montant doit être un nombre positif",
            });
        }

        // Validation de la date
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Format de date invalide",
            });
        }

        // Vérifiez si l'utilisateur est authentifié
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - utilisateur non authentifié",
            });
        }

        const income = new IncomeSchema({
            title,
            amount: numAmount,
            category,
            description,
            date: dateObj,
            user: req.user._id,
        });

        await income.save();
        res.status(201).json({
            success: true,
            message: "Revenu ajouté avec succès",
            data: income,
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout du revenu:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'ajout du revenu",
            error: error.message,
        });
    }
};

exports.getIncomes = async (req, res) => {
    try {
        // Vérifiez si l'utilisateur est authentifié
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - utilisateur non authentifié",
            });
        }

        // Récupérez les revenus de l'utilisateur
        const incomes = await IncomeSchema.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: incomes.length,
            data: incomes,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des revenus:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des revenus",
            error: error.message,
        });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifiez si l'ID est fourni
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID du revenu non fourni",
            });
        }

        // Vérifiez si l'utilisateur est authentifié
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - utilisateur non authentifié",
            });
        }

        // Recherchez le revenu à supprimer
        const income = await IncomeSchema.findOne({ _id: id, user: req.user._id });

        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Revenu non trouvé",
            });
        }

        await income.deleteOne();

        res.status(200).json({
            success: true,
            message: "Revenu supprimé avec succès",
        });
    } catch (error) {
        console.error("Erreur lors de la suppression du revenu:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression du revenu",
            error: error.message,
        });
    }
};