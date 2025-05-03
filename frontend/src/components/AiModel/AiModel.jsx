import { useState } from 'react';
import './AiModel.css';

const AIModel = () => {
  const [budget, setBudget] = useState('');
  const [meal, setMeal] = useState('');
  const [meals, setMeals] = useState([]);
  const [shoppingList, setShoppingList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMeal = () => {
    if (meal.trim() === '') return;
    setMeals([...meals, meal.trim()]);
    setMeal('');
  };

  const handleRemoveMeal = (index) => {
    const newMeals = meals.filter((_, i) => i !== index);
    setMeals(newMeals);
  };

  const handleSubmit = async () => {
    if (budget === '' || meals.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budget: parseFloat(budget),
          meals: meals,
        }),
      });

      const data = await response.json();
      setShoppingList(data);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-container">
      <header className="ai-header">
        <div className="ai-header-content">
          <div className="ai-avatar">
            <span>AI</span>
          </div>
          <h1>Shopping List Assistant</h1>
        </div>
      </header>

      <div className="ai-content">
        <div className="input-group">
          <label className="input-label">Budget</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter your budget"
            className="ai-input"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Add Meals</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddMeal()}
              placeholder="Enter a meal"
              className="ai-input"
            />
            <button
              onClick={handleAddMeal}
              className="ai-button"
            >
              Add
            </button>
          </div>
        </div>

        {meals.length > 0 && (
          <div className="meals-container">
            {meals.map((meal, index) => (
              <div
                key={index}
                className="meal-tag"
              >
                <span>{meal}</span>
                <button onClick={() => handleRemoveMeal(index)}>×</button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading || budget === '' || meals.length === 0}
          className="ai-button"
          style={{ width: '100%', marginTop: '1.5rem' }}
        >
          {isLoading ? 'Generating Shopping List...' : 'Get Shopping List'}
        </button>

        {isLoading && (
          <div className="loading-indicator">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        )}

        {shoppingList && (
          <div className="shopping-list">
            <h2 className="shopping-list-header">Shopping List (Total: {shoppingList.total}DT)</h2>
            <div className="space-y-2">
              {shoppingList.shopping_list.map((item, index) => (
                <div key={index} className="shopping-item">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({item.store})</span>
                  </div>
                  <div className="text-right">
                    <div>Quantity: {item.quantity}</div>
                    <div>{item.price}DT</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIModel;