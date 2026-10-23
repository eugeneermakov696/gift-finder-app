from django.db.models import Q

# Mapping from frontend quiz "interests" to database "interests" / "category"
INTEREST_TO_CATEGORIES = {
    "sports": ["Sports"],
    "fitness": ["Sports", "Outdoor", "Wellness"],
    "outdoor": ["Outdoor", "Sports"],
    "travel": ["Travel", "Outdoor", "Experiences"],
    "gaming": ["Gaming", "Tech"],
    "tech": ["Tech", "Gaming"],
    "art": ["Crafts"],
    "crafts": ["Crafts"],
    "photography": ["Tech", "Travel"],
    "beauty": ["Beauty"],
    "wellness": ["Wellness", "Beauty"],
    "jewelry": ["Jewelry"],
    "fashion": ["Fashion", "Jewelry"],
    "cooking": ["Home & Decor"],
    "books": ["Home & Decor", "Experiences"],
    "coffee": ["Home & Decor"],
    "wine": ["Home & Decor", "Experiences"],
    "home & decor": ["Home & Decor"],
    "home": ["Home & Decor"],
    "pets": ["Home & Decor", "Outdoor"],
    "music": ["Experiences", "Tech"],
    "movies": ["Experiences", "Gaming"],
    "experiences": ["Experiences"],
    "toys": ["Toys"],
}

# Mapping from frontend quiz "category" (gift types) to database categories
GIFT_TYPE_TO_CATEGORIES = {
    "practical / useful": ["Home & Decor", "Tech", "Fashion", "Sports"],
    "practical": ["Home & Decor", "Tech", "Fashion", "Sports"],
    "useful": ["Home & Decor", "Tech", "Fashion", "Sports"],
    "entertaining / fun": ["Gaming", "Toys", "Experiences"],
    "entertaining": ["Gaming", "Toys", "Experiences"],
    "fun": ["Gaming", "Toys", "Experiences"],
    "creative": ["Crafts", "Beauty", "Fashion", "Toys"],
    "educational": ["Toys", "Tech", "Crafts"],
    "adventurous": ["Outdoor", "Travel", "Sports", "Experiences"],
    "luxurious": ["Jewelry", "Beauty", "Fashion"],
    "romantic": ["Jewelry", "Beauty", "Home & Decor", "Experiences"],
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
    # Brackets: Kids (0-10), Teens (11-18), Adults (19-45), Old (49+)
    if age_group_param:
        age_str = age_group_param.strip().lower()
        if any(k in age_str for k in ["0-10", "0-2", "3-5", "6-12", "6-10", "kid", "child", "baby"]):
            queryset = queryset.filter(
                Q(age_group__icontains="Kids") | Q(age_group__iexact="All Ages")
            )
        elif any(k in age_str for k in ["11-18", "13-17", "teen"]):
            queryset = queryset.filter(
                Q(age_group__icontains="Teens") | Q(age_group__iexact="All Ages")
            )
        elif any(k in age_str for k in ["19-45", "18-24", "25-34", "35-44", "adult"]):
            queryset = queryset.filter(
                Q(age_group__icontains="Adults") | Q(age_group__iexact="All Ages")
            )
        elif any(k in age_str for k in ["49", "45", "55", "65", "old", "senior"]):
            queryset = queryset.filter(
                Q(age_group__icontains="Old") | Q(age_group__iexact="All Ages")
            )
        else:
            queryset = queryset.filter(
                Q(age_group__icontains=age_group_param) | Q(age_group__iexact="All Ages")
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

    # 6. Interests (comma-separated support + category mapping, ignore "other")
    if interests_param:
        raw_tokens = [t.strip().lower() for t in interests_param.split(",") if t.strip()]
        if raw_tokens:
            interest_q = Q()
            for token in raw_tokens:
                if token == "other":
                    continue
                interest_q |= Q(interests__icontains=token) | Q(category__icontains=token)
                mapped_cats = INTEREST_TO_CATEGORIES.get(token, [])
                for m_cat in mapped_cats:
                    interest_q |= Q(interests__icontains=m_cat) | Q(category__icontains=m_cat)
            if interest_q:
                queryset = queryset.filter(interest_q)

    # 7. Category / Gift Type (comma-separated support + gift type mapping, ignore "other")
    if category_param:
        raw_categories = [c.strip() for c in category_param.split(",") if c.strip()]
        if raw_categories:
            cat_q = Q()
            for cat in raw_categories:
                cat_lower = cat.lower()
                if cat_lower == "other":
                    continue
                cat_q |= Q(category__icontains=cat)
                mapped_cats = GIFT_TYPE_TO_CATEGORIES.get(cat_lower, [])
                for m_cat in mapped_cats:
                    cat_q |= Q(category__icontains=m_cat)
            if cat_q:
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
