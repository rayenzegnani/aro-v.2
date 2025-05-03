
import styled from "styled-components";
import { menuItems } from "../../utils/menuItems.jsx";
import {  signout } from "../../utils/Icons.jsx";
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
          
          <span>{parametre} Account Settings</span>
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
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 32px;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  padding: var(--spacing-lg);
  width: min(374px, 30%);
  min-width: 300px;
  height: 100%;
  background: var(--nav-bg);
  border: var(--nav-border);
  backdrop-filter: blur(4.5px);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--spacing-lg);
  position: relative;
  z-index: 10;
  box-shadow: var(--shadow-md);
  transition: all 0.4s ease;

  .user-con {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
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
        box-shadow: var(--shadow-md);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

        &:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
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
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.05);
          border-color: rgba(255, 255, 255, 0.9);
        }
      }
    }

    h2 {
      font-size: clamp(1rem, 2vw, 1.2rem);
      color: var(--primary-color);
      font-weight: 600;
      margin-top: var(--spacing-sm);
      word-break: break-word;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
  }

  .menu-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) 0;

    li {
      display: grid;
      grid-template-columns: 30px auto;
      align-items: center;
      gap: var(--spacing-md);
      padding: 0.75rem var(--spacing-md);
      border-radius: var(--radius-md);
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
        transform: translateX(4px);
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
      transform: translateX(0);

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background: var(--active-indicator);
        border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        animation: slideIn 0.3s ease-out;
      }

      @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    }
  }

  .bottom-nav {
    li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem var(--spacing-md);
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--secondary-color);
      font-weight: 500;
      transition: var(--hover-transition);
      margin-buttom:30px;
    height:10px;

      &:hover {
        color: var(--primary-color);
        background: rgba(255, 255, 255, 0.4);
        transform: translateY(-2px);
      }

      i, svg {
        width: 20px;
        height: 20px;
        transition: transform 0.3s ease;
      }

      &:hover i, &:hover svg {
        transform: rotate(-10deg);
      }
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
    border-radius: 0;
    border-left: none;
    border-right: none;
    padding: var(--spacing-md);
    flex-direction: row;
    align-items: center;
    height: auto;
    gap: var(--spacing-md);
    backdrop-filter: blur(2.5px);

    .user-con {
      flex-direction: row;
      gap: var(--spacing-sm);

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
      gap: var(--spacing-sm);

      li {
        grid-template-columns: auto;
        justify-content: center;
        padding: var(--spacing-sm);
        border-radius: var(--radius-sm);

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
        padding: var(--spacing-sm);
        span {
          display: none;
        }
      }
    }
  }

  @media (max-width: 576px) {
    .menu-items {
      display: flex; /* Change from 'none' to 'flex' */
      flex-direction: row; /* Display icons in row */
      gap: var(--spacing-sm); /* Add spacing between icons */
    }

    .bottom-nav li {
      span {
        display: inline !important;
        font-size: 0.8rem;
      }
    }
  }

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

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

  *:focus-visible {
    outline: 2px solid var(--active-indicator);
    outline-offset: 2px;
  }
`;

export default Navigation;
