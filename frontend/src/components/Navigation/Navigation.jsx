import React from "react";
import styled from "styled-components";
import { menuItems } from "../../utils/menuItems.jsx";
import { signout } from "../../utils/Icons.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { useNavigate } from "react-router-dom";
import { parametre } from "../../utils/Icons.jsx";
import axios from "axios";

function Navigation({ active, setActive }) {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      console.log("Token removed from localStorage");
      navigate("/login");
    } catch (error) {
      console.error("Error during sign-out:", error.message || error);
    }
  };

  return (
    <NavStyled>
      <div className="user-con">
        <div className="avatar-container">
          {user?.avatar ? (
            <img
              src={`http://localhost:5000/${user.avatar}`}
              alt="User Avatar"
              className="avatar"
              onError={(e) => {
                e.target.src = "/default-avatar.png"; // Fallback image
              }}
            />
          ) : (
            <div className="avatar-placeholder">
              <span>No Avatar</span>
            </div>
          )}
        </div>
        <div className="text">
          <h2>{user?.name || "User Name"}</h2>
        </div>
      </div>
      <ul className="menu-items">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActive(item.id)}
            className={active === item.id ? "active" : ""}
            aria-label={`Navigate to ${item.title}`}
          >
            {item.icon}
            <span>{item.title}</span>
          </li>
        ))}
        <li
          onClick={() => navigate("/account-settings")}
          className={active === "account-settings" ? "active" : ""}
          aria-label="Navigate to Account Settings"
        >
          <i className="icon-settings"></i>

          <span> {parametre} Account Settings</span>
        </li>
      </ul>
      <div className="bottom-nav">
        <li onClick={handleSignOut} aria-label="Sign Out">
          {signout} Sign Out
        </li>
      </div>
    </NavStyled>
  );
}

const NavStyled = styled.nav`
  --nav-bg: rgba(252, 246, 249, 0.78);
  --nav-border: 3px solid #FFFFFF;
  --primary-color: rgba(34, 34, 96, 1);
  --secondary-color: rgba(34, 34, 96, 0.6);
  --active-indicator: #222260;
  --hover-transition: all 0.3s cubic-bezier(0.53, 0.21, 0, 1);
  
  padding: 2rem 1.5rem;
  width: min(374px, 30%);
  min-width: 300px;
  height: 100%;
  background: var(--nav-bg);
  border: var(--nav-border);
  backdrop-filter: blur(4.5px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  position: relative;
  z-index: 10;

  /* User container */
  .user-con {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;

    .avatar-container {
      position: relative;
      width: clamp(80px, 10vw, 100px);
      height: clamp(80px, 10vw, 100px);
      
      .avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #FFFFFF;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        
        &:hover {
          transform: scale(1.05);
        }
      }

      .avatar-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        color: var(--secondary-color);
        font-size: 0.8rem;
        border: 2px dashed rgba(255, 255, 255, 0.6);
      }
    }

    h2 {
      font-size: clamp(1rem, 2vw, 1.2rem);
      color: var(--primary-color);
      font-weight: 600;
      margin-top: 0.5rem;
      word-break: break-word;
    }
  }

  /* Menu items */
  .menu-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 0;

    li {
      display: grid;
      grid-template-columns: 30px auto;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: var(--hover-transition);
      color: var(--secondary-color);
      background: transparent;
      position: relative;
      overflow: hidden;

      &:hover {
        color: var(--primary-color);
        background: rgba(255, 255, 255, 0.4);
      }

      i, svg {
        width: 24px;
        height: 24px;
        color: inherit;
        transition: var(--hover-transition);
      }

      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .active {
      color: var(--primary-color) !important;
      background: rgba(255, 255, 255, 0.6);
      font-weight: 600;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background: var(--active-indicator);
        border-radius: 0 10px 10px 0;
      }
    }
  }

  /* Bottom navigation */
  .bottom-nav {
    li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      cursor: pointer;
      color: var(--secondary-color);
      font-weight: 500;
      transition: var(--hover-transition);

      &:hover {
        color: var(--primary-color);
        background: rgba(255, 255, 255, 0.4);
      }

      i, svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  /* Responsive design */
  @media (max-width: 992px) {
    width: 280px;
    padding: 1.5rem 1rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
    border-radius: 0;
    border-left: none;
    border-right: none;
    padding: 1rem;
    flex-direction: row;
    align-items: center;
    height: auto;
    gap: 1rem;

    .user-con {
      flex-direction: row;
      gap: 0.75rem;

      .avatar-container {
        width: 50px;
        height: 50px;
      }

      h2 {
        display: none;
      }
    }

    .menu-items {
      flex-direction: row;
      flex: 1;
      padding: 0;
      justify-content: center;
      gap: 0.25rem;

      li {
        grid-template-columns: auto;
        justify-content: center;
        padding: 0.5rem;
        border-radius: 8px;

        span {
          display: none;
        }

        &::before {
          display: none;
        }
      }

      .active {
        background: rgba(255, 255, 255, 0.8);
      }
    }

    .bottom-nav {
      margin-left: auto;

      li {
        padding: 0.5rem;
        span {
          display: none;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .menu-items {
      display: none;
    }

    .bottom-nav li {
      span {
        display: inline !important;
        font-size: 0.8rem;
      }
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    --nav-bg: rgba(30, 30, 46, 0.78);
    --primary-color: rgba(222, 222, 255, 1);
    --secondary-color: rgba(222, 222, 255, 0.7);
    --active-indicator: #6464f0;
    --nav-border: 3px solid rgba(255, 255, 255, 0.1);

    .menu-items {
      li {
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }

      .active {
        background: rgba(255, 255, 255, 0.15);
      }
    }

    .bottom-nav li:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .user-con {
      .avatar {
        border-color: rgba(255, 255, 255, 0.2);
      }

      .avatar-placeholder {
        background: linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%);
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
`;


export default Navigation;