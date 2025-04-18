import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AccountSettings from "./components/AccountSettings/AccountSettings.jsx";

import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

import { GlobalContextProvider } from "./context/globalContext";

// Route protégée pour les utilisateurs authentifiés
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    if (user && !user.isVerified) {
        return <Navigate to='/verify-email' replace />;
    }

    return children;
};

// Redirection pour les utilisateurs déjà authentifiés
const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (isAuthenticated && user?.isVerified) {
        return <Navigate to='/dashboard' replace />;
    }

    return children;
};

function App() {
    const { isCheckingAuth, checkAuth, user } = useAuthStore();

    useEffect(() => {
        checkAuth(); // Vérifie l'état d'authentification au chargement de l'application
    }, [checkAuth]);

    if (isCheckingAuth) return <LoadingSpinner />; // Affiche un spinner pendant la vérification

    return (
        <GlobalContextProvider>
            <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
                {/* Formes flottantes pour le design */}
                <FloatingShape color='bg-blue-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
                <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
                <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />

                {/* Définition des routes */}
                <Routes>
                    <Route
                        path='/'
                        element={
                            <RedirectAuthenticatedUser>
                                <LoginPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                    <Route
                        path='/signup'
                        element={
                            <RedirectAuthenticatedUser>
                                <SignUpPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                    <Route path='/verify-email' element={<EmailVerificationPage />} />
                    <Route
                        path='/forgot-password'
                        element={
                            <RedirectAuthenticatedUser>
                                <ForgotPasswordPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                    <Route
                        path='/reset-password/:token'
                        element={
                            <RedirectAuthenticatedUser>
                                <ResetPasswordPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                    <Route
                        path='/dashboard'
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/account-settings'
                        element={
                            <ProtectedRoute>
                                <AccountSettings user={user} />
                            </ProtectedRoute>
                        }
                    />
                    <Route path='*' element={<Navigate to='/' replace />} />
                </Routes>
                <Toaster />
            </div>
        </GlobalContextProvider>
    );
}

export default App;