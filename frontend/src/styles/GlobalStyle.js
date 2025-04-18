import styled from "styled-components";

export const MainLayout = styled.div`
    padding: 2rem;
    min-height: 100vh; 
    display: flex;
    gap: 2rem;
    width: 100%;
    max-width: 1440px; 
    margin: 0 auto; /* Center the layout */

    @media (max-width: 768px) {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
    }
`;

export const InnerLayout = styled.div`
    padding: 2rem 1.5rem;
    width: 100%;
    flex: 1;
    
    @media (max-width: 768px) {
        padding: 1rem;
    }
`;