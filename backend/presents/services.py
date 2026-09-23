import re


def extract_asin_from_url(url):
    """
    Highly flexible regex to grab any 10-character Amazon ASIN structure.
    Catches /dp/ASIN, /product/ASIN, query strings, and naked ASIN variations.
    """
    if not url:
        return None
    # Flexible scan matching a standard 10-char alphanumeric string following dp/ or product/
    asin_match = re.search(r'(?:dp|product)/([A-Z0-9]{10})', url)
    return asin_match.group(1) if asin_match else None


def mock_amazon_scrape(url):
    """
    Simulates parsing text logs and returns standard data based on the extracted ASIN.
    """
    asin = extract_asin_from_url(url)
    if not asin:
        return None

    # Standard seed computing calculations
    mock_seed_price = float(sum(ord(char) for char in asin) % 150) + 9.99

    mock_titles = [
        "Premium Ergonomic Office Chair",
        "Ultra-Wide Curved Gaming Monitor",
        "Stainless Steel Smart Coffee Maker",
        "Portable Noise-Canceling Bluetooth Earbuds"
    ]

    selected_title = mock_titles[len(asin) % len(mock_titles)]

    return {
        "title": f"Amazon Choice: {selected_title}",
        "asin": asin,
        "amazon_url": f"https://amazon.com{asin}",
        "price": round(mock_seed_price, 2),
        "original_price": round(mock_seed_price * 1.25, 2),
        "category": "Featured Products",
        "rating": 4.5,
        "reviews_count": 1250,
        "image_url": f"https://ssl-images-amazon.com{asin}.jpg"
    }
