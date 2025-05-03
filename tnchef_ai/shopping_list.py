# shopping_list.py
def generate_shopping_list(ingredients: dict, db, budget: float):
    """
    For each ingredient, pick the cheapest product and sum total.
    If over budget, return what can be bought within budget.
    """
    shopping_list = []
    total = 0.0
    for ing, qty in ingredients.items():
        product = db.get_cheapest(ing, qty)
        if product:
            if total + product['price'] > budget:
                continue  # skip if over budget
            shopping_list.append(product)
            total += product['price']
    return shopping_list, total
