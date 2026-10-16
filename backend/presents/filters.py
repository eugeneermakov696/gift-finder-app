from django.db.models import Q

# Mapping from frontend quiz "interests" to database "interests" archetypes
INTEREST_TO_ARCHETYPES = {
    "sports": ["The Active & Outdoor Explorer"],
    "fitness": ["The Active & Outdoor Explorer"],
    "outdoor": ["The Active & Outdoor Explorer"],
    "travel": ["The Active & Outdoor Explorer", "Play, Fun & Party"],
    "gaming": ["The Tech & Gadget Geek", "Play, Fun & Party"],
    "tech": ["The Tech & Gadget Geek"],
    "art": ["The Creative & Artsy Soul"],
    "crafts": ["The Creative & Artsy Soul"],
    "photography": ["The Creative & Artsy Soul", "The Tech & Gadget Geek"],
    "beauty": ["The Self-Care & Wellness Fan"],
    "wellness": ["The Self-Care & Wellness Fan"],
    "jewelry": ["The Self-Care & Wellness Fan", "The Creative & Artsy Soul"],
    "fashion": ["The Self-Care & Wellness Fan", "The Creative & Artsy Soul"],
    "cooking": ["The Homebody & Cozy Life"],
    "books": ["The Homebody & Cozy Life"],
    "coffee": ["The Homebody & Cozy Life"],
    "wine": ["The Homebody & Cozy Life"],
    "home & decor": ["The Homebody & Cozy Life"],
    "home": ["The Homebody & Cozy Life"],
    "pets": ["The Homebody & Cozy Life", "The Active & Outdoor Explorer"],
    "music": ["Play, Fun & Party", "The Creative & Artsy Soul"],
    "movies": ["Play, Fun & Party", "The Homebody & Cozy Life"],
    "experiences": ["Play, Fun & Party", "The Active & Outdoor Explorer"],
}

# Mapping from frontend quiz "category" (gift types) to database Amazon categories
GIFT_TYPE_TO_CATEGORIES = {
    "practical / useful": ["Home & Kitchen", "Clothing & Accessories", "Electronics"],
    "practical": ["Home & Kitchen", "Clothing & Accessories", "Electronics"],
    "useful": ["Home & Kitchen", "Clothing & Accessories", "Electronics"],
    "entertaining / fun": ["Toys & Games", "Costumes & Party"],
    "entertaining": ["Toys & Games", "Costumes & Party"],
    "fun": ["Toys & Games", "Costumes & Party"],
    "creative": ["Toys & Games", "Beauty & Personal Care"],
    "educational": ["Toys & Games", "Electronics"],
    "adventurous": ["Sports & Outdoors"],
    "luxurious": ["Jewelry & Watches", "Beauty & Personal Care", "Clothing & Accessories"],
    "romantic": ["Jewelry & Watches", "Beauty & Personal Care", "Home & Kitchen"],
}


def filter_presents_queryset(queryset, query_params):
    """
    Smart adapter that maps frontend quiz and catalog parameters
    to the Amazon presents database schema.
    """
    category_param = query_params.get("category")
    min_price_param = query_params.get("min_price")
    max_price_param = query_params.get("max_price")
    search_param = query_params.get("search")
    sort_by_param = query_params.get("sort_by")
    gender_param = query_params.get("gender_target")
    occasion_param = query_params.get("occasion")
    interests_param = query_params.get("interests")
    recipient_param = query_params.get("recipient")
    age_group_param = query_params.get("age_group")

    # 1. Search (Title or ASIN)
    if search_param:
        queryset = queryset.filter(
            Q(title__icontains=search_param) | Q(asin__icontains=search_param)
        )

    # 2. Price filtering
    if min_price_param:
        try:
            queryset = queryset.filter(price__gte=float(min_price_param))
        except (ValueError, TypeError):
            pass

    if max_price_param:
        try:
            queryset = queryset.filter(price__lte=float(max_price_param))
        except (ValueError, TypeError):
            pass

    # 3. Gender Target
    if gender_param:
        g = gender_param.strip().lower()
        if g in ["male", "men", "man", "boy", "him"]:
            # Exclude items that are explicitly female clothing/accessories
            female_kw = ["women", "womens", "woman", "ladies", "blouse", "bra", "bralette", "skirt", "dressy"]
            female_title_q = Q()
            for kw in female_kw:
                female_title_q |= Q(title__icontains=kw)

            queryset = queryset.filter(
                (
                    Q(gender_target__iexact="Men")
                    | Q(gender_target__iexact="Unisex")
                    | Q(recipient__icontains="For Him")
                    | Q(recipient__icontains="Unisex")
                )
                & ~Q(gender_target__iexact="Women")
                & ~Q(recipient__iexact="For Her")
                & ~female_title_q
            )
        elif g in ["female", "women", "woman", "girl", "her"]:
            female_kw = ["women", "womens", "woman", "ladies", "blouse", "bra", "bralette", "skirt", "dressy"]
            female_title_q = Q()
            for kw in female_kw:
                female_title_q |= Q(title__icontains=kw)

            male_kw = ["beard", "mustache", "boxer", "boxers", "aftershave", "men's underwear"]
            male_title_q = Q()
            for kw in male_kw:
                male_title_q |= Q(title__icontains=kw)

            queryset = queryset.filter(
                (
                    Q(gender_target__iexact="Women")
                    | Q(gender_target__iexact="Unisex")
                    | Q(recipient__icontains="For Her")
                    | Q(recipient__icontains="Unisex")
                    | female_title_q
                )
                & ~Q(gender_target__iexact="Men")
                & ~male_title_q
            )
        elif g in ["kids", "children", "child"]:
            queryset = queryset.filter(
                Q(gender_target__iexact="Kids")
                | Q(recipient__icontains="Kids")
                | Q(age_group__iexact="Kids")
            )
        elif g in ["unisex"]:
            queryset = queryset.filter(
                Q(gender_target__iexact="Unisex") | Q(recipient__icontains="Unisex")
            )
        else:
            queryset = queryset.filter(
                Q(gender_target__icontains=gender_param)
                | Q(gender_target__iexact="Unisex")
            )

    # 4. Age Group
    if age_group_param:
        age_str = age_group_param.strip().lower()
        if any(k in age_str for k in ["0-2", "baby", "toddler", "infant"]):
            queryset = queryset.filter(
                Q(age_group__iexact="Baby") | Q(age_group__iexact="All Ages")
            )
        elif any(k in age_str for k in ["3-5", "6-12", "13-17", "kid", "teen", "child"]):
            queryset = queryset.filter(
                Q(age_group__iexact="Kids")
                | Q(recipient__icontains="Kids")
                | Q(age_group__iexact="All Ages")
            )
        else:
            # Adults (18+)
            queryset = queryset.filter(
                (
                    Q(age_group__icontains="Adults")
                    | Q(age_group__iexact="All Ages")
                )
                & ~(
                    Q(age_group__in=["Baby", "Kids"])
                    & ~Q(recipient__icontains="Unisex")
                )
            )

    # 5. Recipient / Relationship
    if recipient_param:
        r = recipient_param.strip().lower()
        if any(k in r for k in ["child", "grandchild", "kid"]):
            queryset = queryset.filter(
                Q(recipient__icontains="Kids")
                | Q(gender_target__iexact="Kids")
                | Q(age_group__iexact="Kids")
                | Q(recipient__icontains="Unisex")
            )
        elif any(k in r for k in ["him", "boyfriend", "husband", "dad", "father", "brother", "son", "grandpa"]):
            queryset = queryset.filter(
                Q(recipient__icontains="For Him") | Q(recipient__icontains="Unisex")
            )
        elif any(k in r for k in ["her", "girlfriend", "wife", "mom", "mother", "sister", "daughter", "grandma"]):
            queryset = queryset.filter(
                Q(recipient__icontains="For Her") | Q(recipient__icontains="Unisex")
            )
        else:
            # Partner, Friend, Colleague, Boss, Neighbor, Relative, Other
            if gender_param and gender_param.strip().lower() in ["male", "men", "man", "boy", "him"]:
                queryset = queryset.filter(
                    Q(recipient__icontains="For Him") | Q(recipient__icontains="Unisex")
                )
            elif gender_param and gender_param.strip().lower() in ["female", "women", "woman", "girl", "her"]:
                queryset = queryset.filter(
                    Q(recipient__icontains="For Her") | Q(recipient__icontains="Unisex")
                )
            else:
                queryset = queryset.filter(
                    Q(recipient__icontains=recipient_param)
                    | Q(recipient__icontains="Unisex")
                    | Q(recipient__icontains="For Him")
                    | Q(recipient__icontains="For Her")
                )

    # 6. Interests (comma-separated support + archetype mapping)
    if interests_param:
        raw_tokens = [t.strip().lower() for t in interests_param.split(",") if t.strip()]
        if raw_tokens:
            interest_q = Q()
            for token in raw_tokens:
                interest_q |= Q(interests__icontains=token)
                archetypes = INTEREST_TO_ARCHETYPES.get(token, [])
                for arch in archetypes:
                    interest_q |= Q(interests__icontains=arch)
            queryset = queryset.filter(interest_q)

    # 7. Category / Gift Type (comma-separated support + gift type mapping)
    if category_param:
        raw_categories = [c.strip() for c in category_param.split(",") if c.strip()]
        if raw_categories:
            cat_q = Q()
            for cat in raw_categories:
                cat_lower = cat.lower()
                cat_q |= Q(category__icontains=cat)
                mapped_cats = GIFT_TYPE_TO_CATEGORIES.get(cat_lower, [])
                for m_cat in mapped_cats:
                    cat_q |= Q(category__icontains=m_cat)
            queryset = queryset.filter(cat_q)

    # 8. Occasion (comma-separated + apostrophe normalization)
    if occasion_param:
        raw_occasions = [o.strip() for o in occasion_param.split(",") if o.strip()]
        if raw_occasions:
            occ_q = Q()
            for occ in raw_occasions:
                occ_straight = occ.replace("’", "'")
                occ_curly = occ.replace("'", "’")
                occ_q |= Q(occasion__icontains=occ_straight) | Q(occasion__icontains=occ_curly)
            queryset = queryset.filter(occ_q)

    # 9. Sorting
    if sort_by_param == "price_low":
        queryset = queryset.order_by("price")
    elif sort_by_param == "price_high":
        queryset = queryset.order_by("-price")
    elif sort_by_param == "rating":
        queryset = queryset.order_by("-rating", "-reviews_count")
    elif sort_by_param == "popular":
        queryset = queryset.order_by("-reviews_count", "-rating")
    else:
        queryset = queryset.order_by("-created_at")

    return queryset
