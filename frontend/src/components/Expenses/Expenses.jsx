import React, { useEffect, useState } from 'react'
import { InnerLayout } from '../../styles/Layout.js';
import { useGlobalContext } from '../../context/globalContext.jsx';
import ExpenseForm from './ExpenseForm.jsx';
import IncomeItem from '../IncomeItem/IncomeItem.jsx';

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
        <div className="p-4 md:p-8 overflow-auto bg-white :bg-gray-800 min-h-screen">
            <InnerLayout>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-white-7">Expense Management</h1>
                    
                    <div className="flex flex-wrap gap-2">
                        <select 
                            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800"
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        
                        <select 
                            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800"
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

                <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200 flex justify-center items-center">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                        Total Expenses: 
                        <span className="ml-3 text-2xl md:text-3xl font-bold text-red-800">
                            DT {totalExpenses()}
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Expense</h3>
                            <ExpenseForm />
                        </div>

                        <div className="lg:hidden mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Expense Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-700">
                                    <span>Transactions:</span>
                                    <span className="font-medium">{expenses.length}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Avg. Expense:</span>
                                    <span className="font-medium">DT {(totalExpenses() / (expenses.length || 1)).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Expense History ({filteredExpenses.length})
                                </h3>
                                <div className="text-sm text-gray-600">
                                    Showing: {activeFilter === 'all' ? 'All' : activeFilter}
                                </div>
                            </div>

                            {filteredExpenses.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No expense records found
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                    {filteredExpenses.map((expense) => {
                                        const { _id, title, amount, date, category, description, type } = expense;
                                        return (
                                            <div key={_id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-800">{title}</h4>
                                                            <p className="text-sm text-gray-600">{category} • {new Date(date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-800">DT {amount}</p>
                                                    <button 
                                                        onClick={() => deleteExpense(_id)}
                                                        className="mt-1 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="hidden lg:block lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 sticky top-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Expense Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-700">
                                    <span>Total Transactions:</span>
                                    <span className="font-medium">{expenses.length}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Average Expense:</span>
                                    <span className="font-medium">DT {(totalExpenses() / (expenses.length || 1)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Highest Expense:</span>
                                    <span className="font-medium">DT {expenses.length > 0 ? Math.max(...expenses.map(i => i.amount)) : 0}</span>
                                </div>
                                <div className="pt-4 mt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-gray-700 mb-3">
                                        <span>Categories:</span>
                                        <span className="font-medium">{categories.length}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {categories.slice(0, 3).map(cat => (
                                            <div key={cat} className="flex justify-between text-sm text-gray-600">
                                                <span>{cat}</span>
                                                <span>{expenses.filter(i => i.category === cat).length}</span>
                                            </div>
                                        ))}
                                        {categories.length > 3 && (
                                            <div className="text-sm text-blue-600">+{categories.length - 3} more</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </div>
    )
}

export default Expenses