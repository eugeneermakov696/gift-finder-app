import re
import random


def extract_asin_from_url(url):
    """
    Uses regex rules to extract the 10-character Amazon Standard Identification Number (ASIN)
    """
    asin_match = re.search(r'/(?:dp|gp/product)/([A-Z0-9]{10})', url)
    return asin_match.group(1) if asin_match else None


def mock_amazon_scrape(url):
    """
    Simulates sending requests to Amazon and parsing HTML text logs.
    Returns structured data based on the extracted ASIN.
    """
    asin = extract_asin_from_url(url)
    if not asin:
        return None

    # Generate deterministic pricing based on the characters of the ASIN string
    mock_seed_price = float(sum(ord(char) for char in asin) % 150) + 9.99

    mock_titles = [
        "Premium Ergonomic Office Chair",
        "Ultra-Wide Curved Gaming Monitor",
        "Stainless Steel Smart Coffee Maker",
        "Portable Noise-Canceling Bluetooth Earbuds"
    ]

    # Pick a title based on the ASIN string length or structure
    selected_title = mock_titles[len(asin) % len(mock_titles)]

    return {
        "title": f"Amazon Choice: {selected_title}",
        "asin": asin,
        "amazon_url": f"https://amazon.com{asin}",
        "price": round(mock_seed_price, 2),
        "original_price": round(mock_seed_price * 1.25, 2),
        "category": "Featured Products",
        "rating": round(random.uniform(4.0, 4.9), 2),
        "reviews_count": random.randint(150, 12000),
        "image_url": f"https://ssl-images-amazon.com{asin}.jpg"
    }
