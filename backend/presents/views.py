from django.http import JsonResponse

def product_gift_list(request):
    """
    A simple test endpoint returning a mock list of presents
    """
    mock_data = {
        "status": "success",
        "message": "Welcome to the Gift of Presents API on Amazon Localhost!",
        "presents": [
            {"id": 1, "name": "Wireless Headphones", "price": 99.99, "amazon_url": "https://amazon.com"},
            {"id": 2, "name": "Mechanical Keyboard", "price": 45.50, "amazon_url": "https://amazon.com"}
        ]
    }
    return JsonResponse(mock_data)
