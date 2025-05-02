import styled from "styled-components";

export const MainLayout = styled.main`
    padding: 2rem;
    min-height: 100vh;
    display: flex;
    gap: 2rem;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;

    @media (max-width: 768px) {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
    }

    @media (max-width: 576px) {
        padding: 0.5rem; /* Adjusted padding for smaller screens */
        gap: 1rem; /* Adjusted gap for better layout on small screens */
    }
`;

export const InnerLayout = styled.section`
    padding: 2rem 1.5rem;
    width: 100%;
    flex: 1;

    @media (max-width: 768px) {
        padding: 1rem;
    }

    @media (max-width: 576px) {
        padding: 0.5rem; /* Reduced padding for very small screens */
    }
`;
