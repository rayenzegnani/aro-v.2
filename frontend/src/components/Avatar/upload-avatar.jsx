import React, { useState, useEffect } from "react";
import axios from "axios";

const AvatarUpload = ({ userId, onAvatarUpdate, token }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        console.log("Token received in AvatarUpload:", token);
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
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setMessage("✅ Avatar updated successfully!");
                onAvatarUpdate(response.data.avatar);
            } else {
                setMessage("❌ Failed to upload avatar.");
            }
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message || "Error uploading avatar");
            } else if (error.request) {
                setMessage("No response from server.");
            } else {
                setMessage("Upload error. Check your connection.");
            }
            console.error("Error:", error.response || error);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-white shadow-md rounded-lg w-full max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-800">Upload Your Avatar</h3>

            {preview ? (
                <img
                    src={preview}
                    alt="Preview"
                    className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 shadow"
                />
            ) : (
                <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-400">
                    Preview
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
            />

            <button
                onClick={handleUpload}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            >
                Upload
            </button>

            {message && (
                <p className={`text-sm font-medium ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default AvatarUpload;
