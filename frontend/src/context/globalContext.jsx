import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Validation des données
    const validateTransactionData = (data) => {
        if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
            throw new Error("Le montant doit être un nombre positif");
        }
        if (!data.date || isNaN(new Date(data.date).getTime())) {
            throw new Error("La date est invalide");
        }
        if (!data.category || data.category.trim() === "") {
            throw new Error("La catégorie est requise");
        }
        if (!data.description || data.description.trim() === "") {
            throw new Error("La description est requise");
        }
    };

    // Ajouter un revenu
    const addIncome = async (income) => {
        setLoading(true);
        try {
            validateTransactionData(income);
    
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Aucun token trouvé dans localStorage");
            }
    
            await axios.post(`${BASE_URL}add-income`, income, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await getIncomes();
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'ajout du revenu");
            console.error("Error adding income:", err);
        } finally {
            setLoading(false);
        }
    };

    // Récupérer les revenus
    const getIncomes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Aucun token trouvé dans localStorage");
            }
    
            const response = await axios.get(`${BASE_URL}get-incomes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIncomes(response.data.data || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération des revenus");
            console.error("Error fetching incomes:", err);
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un revenu
    const deleteIncome = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            await getIncomes();
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression du revenu");
            console.error("Error deleting income:", err);
        } finally {
            setLoading(false);
        }
    };

    // Ajouter une dépense
    const addExpense = async (expense) => {
        setLoading(true);
        try {
            validateTransactionData(expense);
            await axios.post(`${BASE_URL}add-expense`, expense);
            await getExpenses();
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'ajout de la dépense");
            console.error("Error adding expense:", err);
        } finally {
            setLoading(false);
        }
    };

    // Récupérer les dépenses
    const getExpenses = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Aucun token trouvé dans localStorage");
            }
    
            const response = await axios.get(`${BASE_URL}get-expenses`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setExpenses(response.data.data || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la récupération des dépenses");
            console.error("Error fetching expenses:", err);
        } finally {
            setLoading(false);
        }
    };

    // Supprimer une dépense
    const deleteExpense = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            await getExpenses();
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression de la dépense");
            console.error("Error deleting expense:", err);
        } finally {
            setLoading(false);
        }
    };

    // Calculer le revenu total
    const totalIncome = () => {
        try {
            return incomes.reduce((acc, income) => {
                const amount = parseFloat(income.amount);
                return isNaN(amount) ? acc : acc + amount;
            }, 0);
        } catch (err) {
            console.error("Error calculating total income:", err);
            return 0;
        }
    };

    // Calculer les dépenses totales
    const totalExpenses = () => {
        try {
            return expenses.reduce((acc, expense) => {
                const amount = parseFloat(expense.amount);
                return isNaN(amount) ? acc : acc + amount;
            }, 0);
        } catch (err) {
            console.error("Error calculating total expenses:", err);
            return 0;
        }
    };

    // Calculer le solde total
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    // Historique des transactions
    const transactionHistory = () => {
        try {
            const history = [...incomes, ...expenses];
            history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return history.slice(0, 3);
        } catch (err) {
            console.error("Error getting transaction history:", err);
            return [];
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                addIncome,
                getIncomes,
                incomes,
                deleteIncome,
                expenses,
                totalIncome,
                addExpense,
                getExpenses,
                deleteExpense,
                totalExpenses,
                totalBalance,
                transactionHistory,
                error,
                setError,
                loading,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};