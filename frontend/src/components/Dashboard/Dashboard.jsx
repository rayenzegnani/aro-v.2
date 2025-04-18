import { useEffect, useState } from 'react'
import { useGlobalContext } from '../../context/globalContext.jsx';
import History from '../../History/History.jsx';
import { dollar } from '../../utils/Icons.jsx';
import Chart from '../chart/chart.jsx';

function Dashboard() {
    const { totalExpenses, incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses } = useGlobalContext()
    const [timeRange, setTimeRange] = useState('month')
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        getIncomes()
        getExpenses()
    }, [timeRange]) // Refetch when time range changes

    // Calculate analytics metrics
    const analytics = {
        avgIncome: incomes.length > 0 ? (totalIncome() / incomes.length).toFixed(2) : 0,
        avgExpense: expenses.length > 0 ? (totalExpenses() / expenses.length).toFixed(2) : 0,
        incomeVsExpense: totalIncome() > 0 ? ((totalExpenses() / totalIncome()) * 100).toFixed(2) : 0,
        largestIncome: incomes.length > 0 ? Math.max(...incomes.map(item => item.amount)) : 0,
        largestExpense: expenses.length > 0 ? Math.max(...expenses.map(item => item.amount)) : 0
    }

    return (
        <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
            {/* Header with Time Range Selector */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Financial Dashboard</h1>
                <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    {['week', 'month', 'year', 'all'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === range 
                                ? 'bg-blue-600 text-white' 
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Analytics Tabs */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-4">
                    {['overview', 'analytics', 'trends'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === tab 
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Stats Overview */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Income Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</h3>
                                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-full">
                                    +{timeRange}
                                </span>
                            </div>
                            <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
                                {dollar} {totalIncome()}
                            </p>
                            <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-green-500" 
                                    style={{ width: `${Math.min(100, (totalIncome() / (totalIncome() + totalExpenses())) * 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Expense Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expense</h3>
                                <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-full">
                                    -{timeRange}
                                </span>
                            </div>
                            <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
                                {dollar} {totalExpenses()}
                            </p>
                            <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-red-500" 
                                    style={{ width: `${Math.min(100, (totalExpenses() / (totalIncome() + totalExpenses())) * 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Balance Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-700">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Balance</h3>
                            <p className={`mt-2 text-2xl font-bold ${
                                totalBalance() >= 0 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-600 dark:text-red-400'
                            }`}>
                                {dollar} {totalBalance()}
                            </p>
                            <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Savings Rate</span>
                                <span>{totalIncome() > 0 ? ((totalBalance() / totalIncome()) * 100).toFixed(1) : 0}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Chart - Now Larger */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {activeTab === 'overview' ? 'Income vs Expenses' : 
                                 activeTab === 'analytics' ? 'Financial Analytics' : 'Spending Trends'}
                            </h2>
                            <select 
                                className="text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1"
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                            >
                                <option value="week">Last 7 Days</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                                <option value="all">All Time</option>
                            </select>
                        </div>
                        <div className="h-80"> {/* Increased height */}
                            <Chart timeRange={timeRange} />
                        </div>
                    </div>
                </div>

                {/* Right Column - Analytics */}
                <div className="space-y-6">
                    {/* Enhanced Analytics Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Key Metrics</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Income</h3>
                                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                        {dollar} {analytics.avgIncome}
                                    </p>
                                </div>
                                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">
                                        {incomes.length}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Expense</h3>
                                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                        {dollar} {analytics.avgExpense}
                                    </p>
                                </div>
                                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                    <span className="text-red-600 dark:text-red-400 text-xl font-bold">
                                        {expenses.length}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Expense Ratio
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-red-500" 
                                            style={{ width: `${analytics.incomeVsExpense}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {analytics.incomeVsExpense}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History - Compact */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Transactions</h2>
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                View All
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            <History compact={true} />
                        </div>
                    </div>

                    {/* Min/Max Values */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Value Ranges</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex justify-between mb-1">
                                    <span>Income Range</span>
                                    <span className="text-xs text-gray-400">Min/Max</span>
                                </h3>
                                <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-md">
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                                        ${incomes.length > 0 ? Math.min(...incomes.map(item => item.amount)) : 0}
                                    </span>
                                    <div className="flex-1 mx-2 h-1 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500" 
                                            style={{ width: `${incomes.length > 0 ? (analytics.largestIncome / (analytics.largestIncome * 1.2)) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                                        ${analytics.largestIncome}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex justify-between mb-1">
                                    <span>Expense Range</span>
                                    <span className="text-xs text-gray-400">Min/Max</span>
                                </h3>
                                <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">
                                    <span className="text-red-600 dark:text-red-400 font-medium">
                                        ${expenses.length > 0 ? Math.min(...expenses.map(item => item.amount)) : 0}
                                    </span>
                                    <div className="flex-1 mx-2 h-1 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-red-500" 
                                            style={{ width: `${expenses.length > 0 ? (analytics.largestExpense / (analytics.largestExpense * 1.2)) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-red-600 dark:text-red-400 font-medium">
                                        ${analytics.largestExpense}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)
}

export default Dashboard