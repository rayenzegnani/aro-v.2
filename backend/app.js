const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { readdirSync } = require('fs');
const { db } = require('./db/db.js');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const userRoutes = require("./routes/user.route");
const chatbotRoute = require("./routes/chatbot.route");

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Assurez-vous que le répertoire 'uploads' existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Répertoire 'uploads' créé à : ${uploadsDir}`);
}

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Utilisez une variable d'environnement pour l'origine
    credentials: true,
}));
app.use(express.json()); // Analyse les corps JSON
app.use(express.urlencoded({ extended: true })); // Analyse les corps URL-encodés
app.use(cookieParser());
app.use('/uploads', express.static(uploadsDir)); // Servir les fichiers statiques dans le répertoire 'uploads'

// Routes spécifiques
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chatbot", chatbotRoute);

// Charger dynamiquement les routes depuis le répertoire 'routes'
readdirSync('./routes').forEach((route) => {
    if (route !== 'user.route.js') { // Évitez de charger deux fois `user.route.js`
        const routePath = `./routes/${route}`;
        try {
            app.use('/api/v1', require(routePath));
        } catch (error) {
            console.error(`Erreur lors du chargement de la route ${route}:`, error.message);
        }
    }
});

// Middleware centralisé de gestion des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur détectée:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erreur interne du serveur',
    });
});

// Gestion des routes non trouvées (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
    });
});

// Démarrer le serveur
const startServer = async () => {
    try {
        await db(); // Connectez-vous à la base de données
        app.listen(PORT, () => {
            console.log(`Le serveur fonctionne sur le port ${PORT}`);
        });
    } catch (error) {
        console.error('Échec du démarrage du serveur:', error.message);
        process.exit(1); // Quittez le processus avec un code d'erreur
    }
};

startServer();