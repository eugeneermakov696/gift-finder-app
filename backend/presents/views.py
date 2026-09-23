from django.http import JsonResponse
from presents.models import Present


def product_gift_list(request):
    """
    Fetches real present records from the PostgreSQL database
    and serializes them into a JSON payload for the frontend.
    """
    # Fetch active records from the database
    gifts_queryset = Present.objects.filter(is_available=True)

    # Structure the records into a dictionary list
    presents_list = []
    for gift in gifts_queryset:
        presents_list.append({
            "id": gift.id,
            "title": gift.title,
            "asin": gift.asin,
            "amazon_url": gift.amazon_url,
            "image_url": gift.image_url if gift.image_url else "",
            "price": float(gift.price),  # Convert Decimal to float for JSON validation
            "original_price": float(gift.original_price) if gift.original_price else None,
            "rating": float(gift.rating) if gift.rating else None,
            "reviews_count": gift.reviews_count,
            "category": gift.category if gift.category else "Uncategorized"
        })

    response_data = {
        "status": "success",
        "count": len(presents_list),
        "message": "Dynamic Gift Selection Engine Live",
        "presents": presents_list
    }

    return JsonResponse(response_data)
