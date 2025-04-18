const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Le titre est requis"],
            maxlength: [50, "Le titre ne peut pas dépasser 50 caractères"],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, "Le montant est requis"],
            min: [0, "Le montant doit être supérieur ou égal à 0"],
            maxlength: [20, "Le montant ne peut pas dépasser 20 chiffres"],
            trim: true,
        },
        type: {
            type: String,
            default: "expense",
            enum: ["income", "expense"], // Validation pour limiter les types possibles
        },
        date: {
            type: Date,
            required: [true, "La date est requise"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "La catégorie est requise"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "La description est requise"],
            maxlength: [200, "La description ne peut pas dépasser 200 caractères"],
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "L'utilisateur est requis"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Expense', ExpenseSchema);