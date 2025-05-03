# recipe_parser.py
# Extracts ingredients from meal names using Gemini AI (mocked)
from gemini_ai import get_ingredients_for_meals

def extract_ingredients(meals):
    """
    Given a list of meal names, return a dict of ingredients and quantities needed.
    Uses AI to extract all ingredients for all meals at once.
    """
    return get_ingredients_for_meals(meals)
