import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

// Configuration globale d'Axios
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    // Fonction d'inscription
    signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, name });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            console.error("Signup error:", error.response?.data || error.message);
            set({
                error: error.response?.data?.message || "Erreur lors de l'inscription",
                isLoading: false,
            });
            throw error;
        }
    },

    // Fonction de connexion
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const token = response.data.token;

            // Stocker le token dans localStorage
            localStorage.setItem("token", token);
            console.log("Token stocké dans localStorage:", token);

            // Configurer Axios pour inclure le token dans les requêtes
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            set({
                isAuthenticated: true,
                user: response.data.user,
                error: null,
                isLoading: false,
            });
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            set({
                error: error.response?.data?.message || "Identifiants invalides",
                isLoading: false,
            });
            throw error;
        }
    },

    // Fonction de déconnexion
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
            set({ isAuthenticated: false, user: null, isLoading: false });
        } catch (error) {
            console.error("Logout error:", error.response?.data || error.message);
            set({
                error: error.response?.data?.message || "Erreur lors de la déconnexion",
                isLoading: false,
            });
            throw error;
        }
    },

    // Fonction de vérification de l'authentification
    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.warn("Aucun token trouvé dans localStorage");
                set({ isAuthenticated: false, user: null, isCheckingAuth: false });
                return;
            }

            // Configurer Axios avec le token
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            const response = await axios.get(`${API_URL}/check-auth`);
            if (response?.data?.user) {
                set({
                    isAuthenticated: true,
                    user: response.data.user,
                    isCheckingAuth: false,
                });
            } else {
                console.warn("Utilisateur non trouvé dans la réponse");
                set({ isAuthenticated: false, user: null, isCheckingAuth: false });
            }
        } catch (error) {
            console.error("Erreur dans checkAuth:", error.response?.data?.message || error.message);
            set({
                isAuthenticated: false,
                user: null,
                isCheckingAuth: false,
                error: error.response?.data?.message || "Échec de l'authentification",
            });
        }
    },

    // Fonction de vérification de l'email
    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'email:", error.response?.data || error.message);
            set({
                error: error.response?.data?.message || "Erreur lors de la vérification de l'email",
                isLoading: false,
            });
            throw error;
        }
    },

    // Fonction de récupération de mot de passe
    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            console.error("Erreur lors de la récupération du mot de passe:", error.response?.data || error.message);
            set({
                isLoading: false,
                error: error.response?.data?.message || "Erreur lors de l'envoi de l'email de réinitialisation",
            });
            throw error;
        }
    },

    // Fonction de réinitialisation de mot de passe
    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            console.error("Erreur lors de la réinitialisation du mot de passe:", error.response?.data || error.message);
            set({
                isLoading: false,
                error: error.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe",
            });
            throw error;
        }
    },
}));