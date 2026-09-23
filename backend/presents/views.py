from django.db.models import Q
from presents.models import Present
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from presents.services import mock_amazon_scrape


@csrf_exempt
def product_gift_list(request):
    """
    GET: List & filter products from the database.
    POST: Insert a new gift into the database.
    """
    if request.method == "GET":
        queryset = Present.objects.filter(is_available=True)

        # Filters
        category_query = request.GET.get("category")
        if category_query:
            queryset = queryset.filter(category__iexact=category_query)

        max_price = request.GET.get("max_price")
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                return JsonResponse({"status": "error", "message": "Invalid max_price value"}, status=400)

        search_query = request.GET.get("search")
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | Q(asin__icontains=search_query)
            )

        presents_list = []
        for gift in queryset:
            presents_list.append({
                "id": gift.id, "title": gift.title, "asin": gift.asin,
                "amazon_url": gift.amazon_url, "image_url": gift.image_url,
                "price": float(gift.price), "category": gift.category
            })
        return JsonResponse({"status": "success", "results_count": len(presents_list), "presents": presents_list})

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            new_gift = Present.objects.create(
                title=data["title"],
                asin=data["asin"],
                amazon_url=data["amazon_url"],
                price=data["price"],
                image_url=data.get("image_url", ""),
                category=data.get("category", "Uncategorized")
            )
            return JsonResponse({
                "status": "created",
                "message": f"Gift {new_gift.id} added successfully!",
                "id": new_gift.id
            }, status=201)
        except KeyError as e:
            return JsonResponse({"status": "error", "message": f"Missing required field: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)


@csrf_exempt
def product_gift_detail(request, pk):
    """
    GET: Retrieve a single product record.
    PUT: Modify fields on an existing product record.
    DELETE: Remove a product record from the ecosystem.
    """
    try:
        gift = Present.objects.get(pk=pk)
    except Present.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Product record not found"}, status=404)

    if request.method == "GET":
        return JsonResponse({
            "status": "success",
            "present": {
                "id": gift.id, "title": gift.title, "asin": gift.asin,
                "amazon_url": gift.amazon_url, "price": float(gift.price),
                "category": gift.category
            }
        })

    elif request.method == "PUT":
        try:
            data = json.loads(request.body)
            gift.title = data.get("title", gift.title)
            gift.asin = data.get("asin", gift.asin)
            gift.price = data.get("price", gift.price)
            gift.category = data.get("category", gift.category)
            gift.save()
            return JsonResponse({"status": "updated", "message": f"Gift {gift.id} modified successfully."})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    elif request.method == "DELETE":
        gift.delete()
        return JsonResponse({"status": "deleted", "message": f"Gift {pk} removed completely from database."}, status=200)

@csrf_exempt
def scrape_amazon_item(request):
    """
    POST: Receives an amazon_url payload, extracts the ASIN, simulates
    a scraping script run, and returns the metadata instantly.
    """
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "Method not allowed. Use POST."}, status=405)

    try:
        data = json.loads(request.body)
        amazon_url = data.get('amazon_url')

        if not amazon_url:
            return JsonResponse({"status": "error", "message": "Missing required field: amazon_url"}, status=400)

        scraped_data = mock_amazon_scrape(amazon_url)

        if not scraped_data:
            return JsonResponse({
                "status": "error",
                "message": "Could not identify a valid 10-digit Amazon ASIN within the provided URL format."
            }, status=422)

        return JsonResponse({
            "status": "success",
            "message": "Data retrieved from mock Amazon parser engine.",
            "data": scraped_data
        })

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)
