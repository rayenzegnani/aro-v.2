import styled from "styled-components";
import bg from "../img/bg.png";
import { MainLayout } from "../styles/Layout.js";
import Orb from "../components/orb/orb.jsx";
import Navigation from "../components/Navigation/Navigation.jsx";
import React, { useState, useMemo } from "react";
import Dashboard from "../components/Dashboard/Dashboard.jsx";
import Expenses from "../components/Expenses/Expenses.jsx";
import Income from "../components/incomes/Incomes.jsx";
import  GeminiChat from "../components/chabot/chatbot.jsx";
import Contactus from "../components/contact us/contact us.jsx";
import { useGlobalContext } from "../context/globalContext.jsx";

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
                return < GeminiChat />;
            case 5:
                return <Contactus />;
            default:
                return <Dashboard />;
        }
    };

    // Utilisation de useMemo pour optimiser le rendu de l'Orb
    const orbMemo = useMemo(() => {
        return <Orb />;
    }, []);

    return (
        <AppStyled bg={bg} className="App">
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

// Styles pour la page Dashboard
const AppStyled = styled.div`
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;

    main {
        flex: 1;
        background: rgba(252, 246, 249, 0.78);
        border: 3px solid #ffffff;
        backdrop-filter: blur(4.5px);
        border-radius: 32px;
        overflow-y: auto; /* Permet le défilement vertical si le contenu dépasse */
        overflow-x: hidden; /* Empêche le défilement horizontal */
        padding: 1rem; /* Ajoute un espacement interne */
        transition: all 0.3s ease-in-out; /* Ajoute une transition fluide pour les changements de style */

        &::-webkit-scrollbar {
            width: 8px; /* Largeur de la barre de défilement */
        }

        &::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2); /* Couleur de la barre de défilement */
            border-radius: 4px; /* Arrondi de la barre de défilement */
        }

        &::-webkit-scrollbar-track {
            background-color: transparent; /* Couleur de l'arrière-plan de la barre de défilement */
        }
    }

    @media (max-width: 768px) {
        main {
            border-radius: 16px; /* Réduit le rayon des coins sur les petits écrans */
            padding: 0.5rem; /* Réduit l'espacement interne sur les petits écrans */
        }
    }

    @media (max-width: 480px) {
        main {
            padding: 0.25rem; /* Réduit encore plus l'espacement interne sur les très petits écrans */
        }
    }
`;

export default DashboardPage;