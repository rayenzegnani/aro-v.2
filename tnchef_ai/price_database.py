
import json

class PriceDatabase:
    def __init__(self, filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            self.data = json.load(f)

    def get_cheapest(self, ingredient, quantity):
        """
        Returns the cheapest product for the given ingredient and quantity.
        Output: dict with keys: name, price, store, quantity
        """
        matches = [item for item in self.data if item['ingredient'].lower() == ingredient.lower()]
        if not matches:
            return None
        cheapest = min(matches, key=lambda x: x['price'])
        return {"name": cheapest['name'], "price": cheapest['price'], "store": cheapest['store'], "quantity": quantity}
