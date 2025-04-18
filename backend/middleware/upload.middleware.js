const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Définir le répertoire des avatars
const avatarsDir = path.join(__dirname, "../uploads/avatars");

// Vérifiez si le répertoire existe, sinon créez-le
if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
    console.log(`Répertoire 'avatars' créé à : ${avatarsDir}`);
}

// Configuration du stockage avec multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Vérifiez si le répertoire des avatars existe
        if (!fs.existsSync(avatarsDir)) {
            fs.mkdirSync(avatarsDir, { recursive: true }); // Créez le répertoire si nécessaire
            console.log(`Répertoire 'avatars' créé à : ${avatarsDir}`);
        }
        cb(null, avatarsDir); // Enregistrer les fichiers dans le répertoire des avatars
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const sanitizedFilename = file.originalname
            .toLowerCase() // Convertir en minuscules pour éviter les problèmes de casse
            .replace(/[^a-z0-9.\-_]/g, ""); // Nettoyer le nom du fichier
        cb(null, `${uniqueSuffix}-${sanitizedFilename}`);
    },
});

// Filtrer les fichiers pour n'accepter que les images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true); // Accepter les fichiers d'image
    } else {
        cb(new Error("Only image files are allowed!"), false); // Rejeter les autres types de fichiers
    }
};

// Configuration de multer
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille : 5 Mo
    fileFilter,
});

module.exports = upload;