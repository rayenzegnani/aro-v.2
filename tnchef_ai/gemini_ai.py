# gemini_ai.py
# Use OpenRouter API for extracting ingredients from meal names, with fallback to mock if no API key is set
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY
)

def get_ingredients_for_meals(meals):
    """
    Use OpenRouter API to extract ingredients for a list of meal names at once.
    Returns a dict of ingredients and quantities. Falls back to mock if API key not set.
    """
    if not OPENROUTER_API_KEY:
        # Fallback to mock for all meals
        ingredients = {}
        for meal in meals:
            meal = meal.lower()
            if meal == "mloukhia":
                meal_ings = {"mloukhia powder": 1, "beef": 0.5, "olive oil": 0.2, "garlic": 0.05}
            elif meal == "pasta":
                meal_ings = {"pasta": 0.5, "tomato sauce": 0.3, "cheese": 0.2}
            elif meal == "brik":
                meal_ings = {"brik pastry": 1, "egg": 2, "tuna": 0.1, "potato": 0.2}
            else:
                meal_ings = {meal + " ingredient": 1}
            for ing, qty in meal_ings.items():
                if ing in ingredients:
                    ingredients[ing] += qty
                else:
                    ingredients[ing] = qty
        return ingredients

    # Use OpenRouter API for all meals at once
    prompt = (
        "For each of the following Tunisian meals: " + ", ".join(meals) + ". "
        "List all unique ingredients and the total quantities needed for each, combining ingredients across meals where possible. "
        "Return as a JSON object with ingredient names as keys and total quantities as values. Example: {'mloukhia powder': 1, 'beef': 0.5, 'pasta': 0.5}"
        "RETURN ONLY JSON NO TEXT ALLOWED"
    )
    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-maverick:free",
            messages=[{"role": "user", "content": prompt}],
            extra_headers={
                "HTTP-Referer": "https://tnchef.ai",
                "X-Title": "TnChef AI",
            },
            extra_body={}
        )
        import json
        import re
        text = completion.choices[0].message.content
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        else:
            return {meal + " ingredient": 1 for meal in meals}
    except Exception as e:
        print(f"AI extraction failed: {e}")
        return {meal + " ingredient": 1 for meal in meals}

# Keep the old function for backward compatibility
def get_ingredients_for_meal(meal):
    """
    Use OpenRouter API to extract ingredients for a given meal name.
    Returns a dict of ingredients and quantities. Falls back to mock if API key not set.
    """
    if not OPENROUTER_API_KEY:
        # Fallback to mock
        meal = meal.lower()
        if meal == "mloukhia":
            return {"mloukhia powder": 1, "beef": 0.5, "olive oil": 0.2, "garlic": 0.05}
        elif meal == "pasta":
            return {"pasta": 0.5, "tomato sauce": 0.3, "cheese": 0.2}
        elif meal == "brik":
            return {"brik pastry": 1, "egg": 2, "tuna": 0.1, "potato": 0.2}
        else:
            return {meal + " ingredient": 1}

    # Use OpenRouter API
    prompt = f"List the ingredients and approximate quantities (in kg or units) needed to make the Tunisian meal '{meal}'. Return as a JSON object with ingredient names as keys and quantities as values. Example: {{'mloukhia powder': 1, 'beef': 0.5}}"
    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-maverick:free",
            messages=[{"role": "user", "content": prompt}],
            extra_headers={
                "HTTP-Referer": "https://tnchef.ai",
                "X-Title": "TnChef AI",
            },
            extra_body={}
        )
        import json
        import re
        # Try to extract JSON from response
        text = completion.choices[0].message.content
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        else:
            return {meal + " ingredient": 1}
    except Exception as e:
        print(f"AI extraction failed: {e}")
        return {meal + " ingredient": 1}
