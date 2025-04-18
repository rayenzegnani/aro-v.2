const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "L'utilisateur est requis"],
        },
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
            default: "income",
            enum: ["income", "expense"], // Ajout d'une validation pour les types
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
            maxlength: [200, "La description ne peut pas dépasser 200 caractères"], // Augmentation de la limite
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Income', IncomeSchema);