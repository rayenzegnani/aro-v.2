import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import AvatarUpload from "../Avatar/upload-avatar.jsx";

const AccountSettings = ({ user }) => {
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [token, setToken] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleAvatarUpdate = (newAvatar) => {
    setAvatar(newAvatar);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setMessage("");
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/v1/user/update-password",
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        setMessage("Password updated successfully.");
        setError("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error updating password.");
      setMessage("");
    }
  };

  return (
    <AccountSettingsStyled>
      <h2>Account Settings</h2>

      <div className="section avatar-section">
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
          token={token}
        />
      </div>

      <div className="section password-section">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <div className="input-control">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-control">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-control">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn">
            Update Password
          </button>
        </form>
      </div>
    </AccountSettingsStyled>
  );
};






const AccountSettingsStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 2rem;
  max-width: 700px;
  margin: 2rem auto;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);

  h2 {
    text-align: center;
    color: #1f2937;
    font-size: 1.8rem;
  }

  .section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }

  .avatar-preview {
    display: flex;
    justify-content: center;
    align-items: center;

    .avatar,
    .avatar-placeholder {
      width: 130px;
      height: 130px;
      border-radius: 50%;
    }

    .avatar {
      object-fit: cover;
      border: 3px solid #d1d5db;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .avatar-placeholder {
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      color: #9ca3af;
      border: 2px dashed #d1d5db;
    }
  }

  input[type="file"] {
    margin-bottom: 1rem;
  }

  button {
    background: linear-gradient(to right, #22c55e, #16a34a);
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(34, 197, 94, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(22, 163, 74, 0.4);
    }

    &:active {
      transform: scale(0.97);
      box-shadow: 0 3px 6px rgba(22, 163, 74, 0.2);
    }

    &:disabled {
      background: #a7f3d0;
      cursor: not-allowed;
    }
  }

  .password-section {
    form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      width: 100%;
      max-width: 400px;
    }

    .input-control {
      display: flex;
      flex-direction: column;
      width: 100%;

      label {
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #374151;
      }

      input {
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: border-color 0.2s;

        &:focus {
          outline: none;
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
        }
      }
    }

    .success-message {
      color: #10b981;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .error-message {
      color: #ef4444;
      font-weight: 500;
      font-size: 0.95rem;
    }
  }
`;





export default AccountSettings;