import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from presents.models import Wishlist, Present


def export_wishlist_json(request, pk):
    """
    GET: Outputs a structured JSON data stream for a specific wishlist.
    Ideal for sharing raw data payloads across services.
    """
    try:
        wishlist = Wishlist.objects.get(pk=pk)
    except Wishlist.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Wishlist not found"}, status=404)

    items_data = []
    for item in wishlist.items.all():
        items_data.append({
            "present_id": item.id,
            "title": item.title,
            "asin": item.asin,
            "amazon_url": item.amazon_url,
            "current_price": float(item.price),
            "category": item.category
        })

    return JsonResponse({
        "status": "success",
        "exported_at": "2026-09-23",
        "wishlist_metadata": {
            "wishlist_id": wishlist.id,
            "name": wishlist.name,
            "owner": wishlist.user.username,
            "total_items": len(items_data)
        },
        "presents": items_data
    }, json_dumps_params={'indent': 2})  # Formats JSON cleanly for human reading


@csrf_exempt
def trigger_price_check(request, pk):
    """
    POST: Simulates a background worker scanning Amazon to check for price adjustments.
    Logs old price vs new price metrics instantly.
    """
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "Method not allowed. Use POST."}, status=405)

    try:
        gift = Present.objects.get(pk=pk)
        old_price = float(gift.price)

        # Simulate a mock price adjustment engine drop (e.g., a 10% discount)
        new_price = round(old_price * 0.90, 2)

        # Persist new calculated data to PostgreSQL
        gift.original_price = gift.price  # Move current price to original/strikethrough price
        gift.price = new_price
        gift.save()

        return JsonResponse({
            "status": "success",
            "message": f"Price tracker scan complete for ASIN: {gift.asin}",
            "product_title": gift.title,
            "price_metrics": {
                "previous_price": old_price,
                "new_price": new_price,
                "discount_detected": "10% Price Drop Alert!"
            }
        })
    except Present.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Product record not found"}, status=404)
