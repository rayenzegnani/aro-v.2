import styled from "styled-components";
import bg from "../img/bg.png";
import { MainLayout } from "../styles/Layout.js";
import Orb from "../components/orb/orb.jsx";
import Navigation from "../components/Navigation/Navigation.jsx";
import  { useState, useMemo, useEffect } from "react";
import Dashboard from "../components/Dashboard/Dashboard.jsx";
import Expenses from "../components/Expenses/Expenses.jsx";
import Income from "../components/incomes/Incomes.jsx";
import GeminiChat from "../components/chabot/chatbot.jsx";
import Contactus from "../components/contact us/contact us.jsx";
import { useGlobalContext } from "../context/globalContext.jsx";
import AiModel from"../components/AiModel/AiModel.jsx";


function DashboardPage() {
  const [active, setActive] = useState(1); // État pour suivre l'onglet actif

  const global = useGlobalContext();

  // Vérifiez si le contexte global est disponible
  if (!global) {
      console.error("GlobalContext is undefined. Ensure the provider is set up correctly.");
      return <div>Error: Global context not available</div>;
  }

  // Fonction pour afficher le contenu en fonction de l'onglet actif
  const displayData = () => {
      switch (active) {
          case 1:
              return <Dashboard />;
        
          case 2:
              return <Income />;
          case 3:
              return <Expenses />;
          case 4:
              return <GeminiChat/>;
          case 5:
              return <Contactus />;
          case 6: return <AiModel/>
          default:
              return <Dashboard />;
      }
  };

  // Utilisation de useMemo pour optimiser le rendu de l'Orb
  const orbMemo = useMemo(() => {
      return <Orb />;
  }, []);

  return (
      <AppStyled  className="App">
          {orbMemo}
          <MainLayout>
              {/* Navigation */}
              <Navigation active={active} setActive={setActive} />
              {/* Contenu principal */}
              <main>{displayData()}</main>
          </MainLayout>
      </AppStyled>
  );
}


const AppStyled = styled.div`
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center;

  main {
    flex: 1;
    background:rgb(1, 95, 104); /* Arrière-plan blanc semi-transparent */
    border: ${props => props.isMobile ? '2px' : '3px'} solidrgb(224, 226, 229); /* Bordure bleue */
    backdrop-filter: blur(${props => props.isMobile ? '3.5px' : '4.5px'});
    border-radius: ${props => props.isMobile ? '16px' : '32px'};
    padding: ${props => props.isMobile ? '0.75rem' : '1.5rem'};
    overflow: auto;
    transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    will-change: transform;

    /* Scrollbar styling - cross browser */
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }

    &::-webkit-scrollbar-track {
      background: transparent;
      margin: 8px 0;
    }
  }

  .error-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: #ff4d4f;
    font-size: 1.2rem;
    background: rgba(255, 255, 255, 0.9);
  }

  @media (max-width: 480px) {
    main {
      padding: 0.5rem;
      border-radius: 12px;
      backdrop-filter: blur(2.5px);
    }
  }
`;

export default DashboardPage;
