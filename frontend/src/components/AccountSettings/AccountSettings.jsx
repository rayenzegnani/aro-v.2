import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AvatarUpload from "../Avatar/upload-avatar.jsx";

const AccountSettings = ({ user }) => {
    const [avatar, setAvatar] = useState(user?.avatar || "");
    const [token, setToken] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("token"); // Récupérez le token depuis localStorage
        setToken(storedToken);
        console.log("Token in AccountSettings:", storedToken); // Vérifiez si le token est bien récupéré
    }, []);

    const handleAvatarUpdate = (newAvatar) => {
        setAvatar(newAvatar);
        console.log("Avatar updated:", newAvatar);
    };

    return (
        <AccountSettingsStyled>
            <h2>Account Settings</h2>
            <div className="avatar-section">
                <h3>Update Profile Picture</h3>
                <div className="avatar-preview">
                    {avatar ? (
                        <img
                            src={`http://localhost:5000/${avatar}`}
                            alt="Profile Avatar"
                            className="avatar"
                            onError={(e) => {
                                e.target.src = "/default-avatar.png";
                            }}
                        />
                    ) : (
                        <div className="avatar-placeholder">
                            <span>No Avatar</span>
                        </div>
                    )}
                </div>
                <AvatarUpload
                    userId={user?._id}
                    onAvatarUpdate={handleAvatarUpdate}
                    token={token} // Passez le token ici
                />
            </div>
        </AccountSettingsStyled>
    );
};




const AccountSettingsStyled = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  .avatar-section {
    text-align: center;

    .avatar-preview {
      margin: 1rem 0;

      .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #ddd;
      }

      .avatar-placeholder {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
        color: #555;
        border: 2px dashed #aaa;
      }
    }
  }

  .password-section {
    margin-top: 2rem;

    .input-control {
      margin-bottom: 1rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
      }

      input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
    }

    .submit-btn {
      background-color: #4caf50;
      color: white;
      padding: 0.8rem 1.6rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #45a049;
      }
    }

    .success-message {
      color: green;
      margin-bottom: 1rem;
    }

    .error-message {
      color: red;
      margin-bottom: 1rem;
    }
  }
`;

export default AccountSettings;