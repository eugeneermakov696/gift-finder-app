import json
import csv
import re
import random
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from presents.models import Present, Wishlist
from presents.services import mock_amazon_scrape


# --- GIFTS / PRODUCTS CRUD ENDPOINTS ---

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


@csrf_exempt
def product_gift_list(request):
    """
    GET: List, filter, sort, and paginate products from the database dynamically.
    POST: Insert a new gift into the database.
    """
    if request.method == 'GET':
        queryset = Present.objects.filter(is_available=True)

        # 1. Apply existing filtering rules
        category_query = request.GET.get('category')
        if category_query:
            queryset = queryset.filter(category__iexact=category_query)

        max_price = request.GET.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                return JsonResponse({"status": "error", "message": "Invalid max_price value"}, status=400)

        search_query = request.GET.get('search')
        if search_query:
            queryset = queryset.filter(Q(title__icontains=search_query) | Q(asin__icontains=search_query))

        # 2. Dynamic Ordering Utility
        sort_by = request.GET.get('sort_by', 'created_at')
        if sort_by == 'price_low':
            queryset = queryset.order_by('price')
        elif sort_by == 'price_high':
            queryset = queryset.order_by('-price')
        elif sort_by == 'rating':
            queryset = queryset.order_by('-rating')
        else:
            queryset = queryset.order_by('-created_at')

        # 3. CHUNKED PAGINATION GENERATOR UTILITY
        page = request.GET.get('page', 1)
        items_per_page = request.GET.get('items_per_page', 10)  # Default chunks of 10 items

        paginator = Paginator(queryset, items_per_page)
        try:
            paginated_queryset = paginator.page(page)
        except PageNotAnInteger:
            paginated_queryset = paginator.page(1)
        except EmptyPage:
            paginated_queryset = paginator.page(paginator.num_pages)

        presents_list = []
        for gift in paginated_queryset:
            presents_list.append({
                "id": gift.id,
                "title": gift.title,
                "asin": gift.asin,
                "amazon_url": gift.amazon_url,
                "image_url": gift.image_url,
                "price": float(gift.price),
                "rating": float(gift.rating) if gift.rating else 0.0,
                "category": gift.category
            })

        return JsonResponse({
            "status": "success",
            "pagination_meta": {
                "total_items": paginator.count,
                "total_pages": paginator.num_pages,
                "current_page": paginated_queryset.number,
                "has_next": paginated_queryset.has_next(),
                "has_previous": paginated_queryset.has_previous(),
            },
            "presents": presents_list
        })

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_gift = Present.objects.create(
                title=data['title'],
                asin=data['asin'],
                amazon_url=data['amazon_url'],
                price=data['price'],
                image_url=data.get('image_url', ''),
                category=data.get('category', 'Uncategorized')
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

    if request.method == 'GET':
        return JsonResponse({
            "status": "success",
            "present": {
                "id": gift.id, "title": gift.title, "asin": gift.asin,
                "amazon_url": gift.amazon_url, "price": float(gift.price),
                "category": gift.category
            }
        })

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            gift.title = data.get('title', gift.title)
            gift.asin = data.get('asin', gift.asin)
            gift.price = data.get('price', gift.price)
            gift.category = data.get('category', gift.category)
            gift.save()
            return JsonResponse({"status": "updated", "message": f"Gift {gift.id} modified successfully."})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    elif request.method == 'DELETE':
        gift.delete()
        return JsonResponse({"status": "deleted", "message": f"Gift {pk} removed completely from database."},
                            status=200)


# --- SCRAPER & AUTOMATION ENDPOINTS ---

@csrf_exempt
def scrape_amazon_item(request):
    """
    POST: Receives an amazon_url, runs the mock scraper engine,
    and automatically saves or updates the record in PostgreSQL.
    """
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "Method not allowed."}, status=405)

    try:
        data = json.loads(request.body)
        amazon_url = data.get('amazon_url', '')

        # Direct verification layer target parsing fallback logic
        asin_match = re.search(r'(?:dp|product)/([A-Z0-9]{10})', amazon_url)
        asin = asin_match.group(1) if asin_match else "B07ZPKZSSC"

        if not asin:
            return JsonResponse({"status": "error", "message": "Invalid Amazon URL."}, status=422)

        mock_seed_price = float(sum(ord(char) for char in asin) % 150) + 9.99

        gift, created = Present.objects.update_or_create(
            asin=asin,
            defaults={
                "title": f"Amazon Choice Product ({asin})",
                "amazon_url": f"https://amazon.com{asin}",
                "price": round(mock_seed_price, 2),
                "original_price": round(mock_seed_price * 1.25, 2),
                "rating": 4.50,
                "reviews_count": 1250,
                "category": "Featured Products",
                "image_url": f"https://ssl-images-amazon.com{asin}.jpg",
                "is_available": True
            }
        )

        return JsonResponse({
            "status": "success",
            "action": "created" if created else "updated",
            "id": gift.id
        })

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)


@csrf_exempt
def trigger_price_check(request, pk):
    """POST: Simulates scanning Amazon for price updates and changes."""
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "Method not allowed."}, status=405)
    try:
        gift = Present.objects.get(pk=pk)
        old_price = float(gift.price)
        new_price = round(old_price * 0.90, 2)
        gift.original_price = gift.price
        gift.price = new_price
        gift.save()
        return JsonResponse({"status": "success", "price_metrics": {"previous": old_price, "new": new_price}})
    except Present.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Product not found"}, status=404)


# --- WISHLIST MANAGEMENT ENDPOINTS ---

@csrf_exempt
def wishlist_list(request):
    """GET: List wishlists. POST: Create a wishlist container."""
    if request.method == 'GET':
        wishlists = Wishlist.objects.all()
        data = [{"id": w.id, "owner": w.user.username, "name": w.name, "items_count": w.items.count()} for w in
                wishlists]
        return JsonResponse({"status": "success", "wishlists": data})

    elif request.method == 'POST':
        try:
            body = json.loads(request.body)
            user_id = body.get('user_id', 1)
            user = User.objects.get(pk=user_id)
            new_list = Wishlist.objects.create(user=user, name=body.get('name', 'My Wishlist'))
            return JsonResponse({"status": "created", "wishlist_id": new_list.id}, status=201)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)


@csrf_exempt
def wishlist_detail(request, pk):
    """
    GET: View items in wishlist (Publicly visible).
    POST: Add/Remove items from wishlist (Strictly restricted to Token owner).
    """
    try:
        wishlist = Wishlist.objects.get(pk=pk)
    except Wishlist.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Wishlist not found"}, status=404)

    if request.method == 'GET':
        presents = [{"id": i.id, "title": i.title, "asin": i.asin, "price": float(i.price)} for i in
                    wishlist.items.all()]
        return JsonResponse({
            "wishlist_id": wishlist.id,
            "name": wishlist.name,
            "owner": wishlist.user.username,
            "presents": presents
        })

    elif request.method == 'POST':
        # --- CUSTOM API TOKEN VALIDATION LAYER ---
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
            return JsonResponse({"status": "error", "message": "Authentication required. Missing token header."},
                                status=401)

        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            if wishlist.user != token.user:
                return JsonResponse({"status": "error", "message": "Permission denied. You do not own this wishlist."},
                                    status=403)
        except Token.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Invalid or expired token security signature."},
                                status=401)
        # ------------------------------------------

        try:
            body = json.loads(request.body)
            present = Present.objects.get(pk=body.get('present_id'))
            action = body.get('action')

            if action == "add":
                # Enforce database protection ceiling limit check
                if wishlist.items.count() >= 50:
                    return JsonResponse({
                        "status": "error",
                        "message": "Wishlist limit reached. Maximum capacity is 50 items."
                    }, status=400)
                wishlist.items.add(present)
            elif action == "remove":
                if action == "add":
                    wishlist.items.add(present)
                elif action == "remove":
                    wishlist.items.remove(present)
                else:
                    return JsonResponse({"status": "error", "message": "Invalid action. Use add/remove."}, status=400)

            return JsonResponse({"status": "success", "message": f"Action '{action}' processed successfully."})
        except Present.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Target product item missing from database."},
                                status=404)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)


# --- EXPORTERS & SECURITY ENDPOINTS ---

@csrf_exempt
def user_register(request):
    """POST: Register a user."""
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "Method not allowed."}, status=405)
    try:
        data = json.loads(request.body)
        if User.objects.filter(username=data['username']).exists():
            return JsonResponse({"status": "error", "message": "Username taken."}, status=400)
        user = User.objects.create_user(username=data['username'], password=data['password'])
        token, _ = Token.objects.get_or_create(user=user)
        return JsonResponse({"status": "success", "token": token.key}, status=201)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)


@csrf_exempt
def user_login(request):
    """POST: Login a user."""
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "Method not allowed."}, status=405)
    try:
        data = json.loads(request.body)
        user = authenticate(username=data['username'], password=data['password'])
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return JsonResponse({"status": "success", "token": token.key})
        return JsonResponse({"status": "error", "message": "Invalid credentials."}, status=401)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)


def export_wishlist_csv(request, pk):
    """GET: Export wishlist metadata to CSV."""
    try:
        wishlist = Wishlist.objects.get(pk=pk)
    except Wishlist.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Wishlist not found."}, status=404)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{wishlist.name}_export.csv"'

    writer = csv.writer(response)
    writer.writerow(['ID', 'Title', 'ASIN', 'URL', 'Price', 'Category'])
    for item in wishlist.items.all():
        writer.writerow([item.id, item.title, item.asin, item.amazon_url, item.price, item.category])
    return response


def export_wishlist_json(request, pk):
    """GET: Export wishlist metadata to JSON data stream."""
    try:
        wishlist = Wishlist.objects.get(pk=pk)
    except Wishlist.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Wishlist not found"}, status=404)

    items = [{"id": i.id, "title": i.title, "asin": i.asin, "price": float(i.price)} for i in wishlist.items.all()]
    return JsonResponse({"wishlist": wishlist.name, "presents": items})

