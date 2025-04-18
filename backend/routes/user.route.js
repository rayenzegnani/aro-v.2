const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload.middleware"); // Import correct
const User = require("../models/user.model");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.post("/upload-avatar", verifyToken, upload.single("avatar"), async (req, res) => {
    try {
        const userId = req.user._id; // Récupération de l'ID utilisateur depuis le token
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const userRecord = await User.findById(userId);
        if (!userRecord) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Supprimez l'ancien avatar si nécessaire
        if (userRecord.avatar) {
            const oldAvatarPath = path.join(__dirname, "../uploads/avatars", path.basename(userRecord.avatar));
            if (fs.existsSync(oldAvatarPath)) {
                try {
                    fs.unlinkSync(oldAvatarPath); // Supprimez l'ancien fichier
                } catch (err) {
                    console.error("Error deleting old avatar:", err);
                }
            }
        }

        // Mettez à jour le chemin de l'avatar
        const avatarPath = `../uploads/avatars/${req.file.filename}`;
        userRecord.avatar = avatarPath;
        await userRecord.save();

        res.status(200).json({
            success: true,
            message: "Avatar uploaded successfully",
            avatar: avatarPath,
        });
    } catch (error) {
        console.error("Error uploading avatar:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;