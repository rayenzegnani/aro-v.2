from recipe_parser import extract_ingredients
from price_database import PriceDatabase
from shopping_list import generate_shopping_list
from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route('/shopping-list', methods=['POST'])
def get_shopping_list():
    data = request.json
    budget = float(data.get('budget', 0))
    meals = data.get('meals', [])
    if not meals:
        return jsonify({"error": "No meals provided"}), 400
    all_ingredients = extract_ingredients(meals)
    db = PriceDatabase('data/prices_mg_geant.json')
    shopping_list, total = generate_shopping_list(all_ingredients, db, budget)
    
    return jsonify({
        "shopping_list": shopping_list,
        "total": total,
        "budget": budget
    })

def cli_main():
    print("Welcome to TnChef AI!")
    budget = float(input("Enter your budget (TND): "))
    meals = input("Enter your meals (comma separated, e.g. mloukhia,pasta,brik): ").split(",")
    meals = [m.strip() for m in meals if m.strip()]

    all_ingredients = extract_ingredients(meals)
    print(f"Extracted ingredients: {all_ingredients}")

    db = PriceDatabase('data/prices_mg_geant.json')
    shopping_list, total = generate_shopping_list(all_ingredients, db, budget)

    print("\nYour Smart Shopping List:")
    for item in shopping_list:
        print(f"- {item['name']} ({item['quantity']}): {item['price']} TND at {item['store']}")
    print(f"\nTotal: {total} TND (Budget: {budget} TND)")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == '--api':
        app.run(host='0.0.0.0', port=5000)
    else:
        cli_main()
