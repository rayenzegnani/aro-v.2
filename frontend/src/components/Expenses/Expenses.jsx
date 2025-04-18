import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layout';
import ExpenseForm from './ExpenseForm.jsx';
import IncomeItem from '../IncomeItem/IncomeItem';

function Expenses() {
    const { addExpense, expenses, getExpenses, deleteExpense, totalExpenses } = useGlobalContext();
    const [activeFilter, setActiveFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc');

    useEffect(() => {
        getExpenses()
    }, [])

    const filteredExpenses = expenses
        .filter(expense => activeFilter === 'all' || expense.category === activeFilter)
        .sort((a, b) => {
            switch (sortBy) {
                case 'amount-asc': return a.amount - b.amount;
                case 'amount-desc': return b.amount - a.amount;
                case 'date-asc': return new Date(a.date) - new Date(b.date);
                default: return new Date(b.date) - new Date(a.date);
            }
        });

    const categories = [...new Set(expenses.map(expense => expense.category))];

    return (
        <ExpenseStyled>
            <InnerLayout>
                <div className="header">
                    <h1>Expenses</h1>
                    <div className="filters">
                        <select 
                            className="filter-select"
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <select 
                            className="filter-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="amount-desc">Highest Amount</option>
                            <option value="amount-asc">Lowest Amount</option>
                        </select>
                    </div>
                </div>
                
                <div className="total-expense">
                    <h2>Total Expense: <span>DT{totalExpenses()}</span></h2>
                </div>

                <div className="expense-content">
                    <div className="form-container">
                        <ExpenseForm />
                    </div>
                    <div className="expense-list">
                        {filteredExpenses.map((expense) => {
                            const {_id, title, amount, date, category, description, type} = expense;
                            return (
                                <IncomeItem
                                    key={_id}
                                    id={_id} 
                                    title={title} 
                                    description={description} 
                                    amount={amount} 
                                    date={date} 
                                    type={type}
                                    category={category} 
                                    indicatorColor="#ff3030"  // Red indicator for expenses
                                    deleteItem={deleteExpense}
                                />
                            )
                        })}
                    </div>
                </div>
            </InnerLayout>
        </ExpenseStyled>
    )
}

const ExpenseStyled = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: #f8f9fa;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        h1 {
            font-size: 2rem;
            color: #2c3e50;
        }

        .filters {
            display: flex;
            gap: 1rem;

            .filter-select {
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
                color: #333;
                cursor: pointer;
            }
        }
    }

    .total-expense {
        background: white;
        border: 1px solid #eee;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        text-align: center;

        h2 {
            font-size: 1.5rem;
            color: #2c3e50;
            margin: 0;
        }

        span {
            font-size: 2rem;
            font-weight: 700;
            color: #ff3030;  // Red color for expense total
        }
    }

    .expense-content {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2rem;

        .form-container {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            height: fit-content;
        }

        .expense-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    }

    @media (max-width: 768px) {
        .expense-content {
            grid-template-columns: 1fr;
        }

        .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }

        .filters {
            width: 100%;
            flex-direction: column;
        }
    }
`;

export default Expenses