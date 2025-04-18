import React, { useState, useEffect } from "react";
import axios from "axios";

const AvatarUpload = ({ userId, onAvatarUpdate, token }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        console.log("Token received in AvatarUpload:", token); // Vérifiez si le token est bien reçu
    }, [token]);

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file to upload.");
            return;
        }

        if (!token) {
            setMessage("Authentication token is missing. Please log in again.");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/v1/user/upload-avatar",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`, // Assurez-vous que `token` est valide
                    },
                }
            );

            if (response.status === 200) {
                setMessage("Avatar updated successfully!");
                onAvatarUpdate(response.data.avatar); // Met à jour l'avatar dans le parent
            } else {
                setMessage("Failed to upload avatar. Please try again.");
            }
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message || "Error uploading avatar");
            } else if (error.request) {
                setMessage("No response from server. Please try again later.");
            } else {
                setMessage("Error uploading avatar. Please check your connection.");
            }
            console.error("Error:", error.response || error);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {preview && <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover" />}
            <input type="file" accept="image/*" onChange={handleChange} />
            <button onClick={handleUpload} className="bg-green-500 text-white px-4 py-2 rounded">
                Upload
            </button>
            {message && <p className="text-sm mt-2">{message}</p>}
        </div>
    );
};

export default AvatarUpload;