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
    sort_by_param = query_params.get("sort_by")
    gender_param = query_params.get("gender_target")
    occasion_param = query_params.get("occasion")
    interests_param = query_params.get("interests")
    recipient_param = query_params.get("recipient")
    age_group_param = query_params.get("age_group")

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
            queryset = queryset.filter(
                (
                    Q(gender_target__iexact="Men")
                    | Q(gender_target__iexact="Male")
                    | Q(gender_target__iexact="Unisex")
                    | Q(recipient__icontains="For Him")
                    | Q(recipient__icontains="Unisex")
                )
                & ~Q(gender_target__iexact="Women")
                & ~Q(gender_target__iexact="Female")
                & ~Q(recipient__iexact="For Her")
            )
        elif g in ["female", "women", "woman", "girl", "her"]:
            queryset = queryset.filter(
                (
                    Q(gender_target__iexact="Women")
                    | Q(gender_target__iexact="Female")
                    | Q(gender_target__iexact="Unisex")
                    | Q(recipient__icontains="For Her")
                    | Q(recipient__icontains="Unisex")
                )
                & ~Q(gender_target__iexact="Men")
                & ~Q(gender_target__iexact="Male")
                & ~Q(recipient__iexact="For Him")
            )
        elif g in ["kids", "children", "child"]:
            queryset = queryset.filter(
                Q(gender_target__iexact="Kids")
                | Q(recipient__icontains="Kids")
                | Q(age_group__icontains="Kids")
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

    # 4. Age Group (Catalog unique values: Adults, Kids, Teens, Olds, Old, All Ages)
    if age_group_param:
        raw_age_groups = [a.strip() for a in age_group_param.split(",") if a.strip()]
        if raw_age_groups:
            age_q = Q()
            for age in raw_age_groups:
                age_lower = age.lower()
                if any(k in age_lower for k in ["0-10", "0-2", "3-5", "6-12", "6-10", "kid", "child", "baby"]):
                    age_q |= Q(age_group__icontains="Kids") | Q(age_group__iexact="All Ages")
                elif any(k in age_lower for k in ["11-18", "13-18", "13-17", "teen"]):
                    age_q |= Q(age_group__icontains="Teens") | Q(age_group__iexact="All Ages")
                elif any(k in age_lower for k in ["19-45", "18-24", "25-34", "35-44", "adult"]):
                    age_q |= Q(age_group__icontains="Adults") | Q(age_group__iexact="All Ages")
                elif any(k in age_lower for k in ["46+", "49", "45", "55", "65", "old", "senior"]):
                    age_q |= Q(age_group__icontains="Old") | Q(age_group__iexact="All Ages")
                elif "all" in age_lower:
                    age_q |= Q(age_group__icontains="All Ages")
                else:
                    age_q |= Q(age_group__icontains=age) | Q(age_group__iexact="All Ages")
            if age_q:
                queryset = queryset.filter(age_q)

    # 5. Recipient / Relationship (Catalog unique values: Partner, Friend, Relatives, Other)
    if recipient_param:
        raw_recipients = [r.strip() for r in recipient_param.split(",") if r.strip()]
        if raw_recipients:
            rec_q = Q()
            for rec in raw_recipients:
                rec_lower = rec.lower()
                if rec_lower in ["partner", "friend", "other"]:
                    rec_q |= Q(recipient__icontains=rec)
                elif "relative" in rec_lower:
                    rec_q |= Q(recipient__icontains="Relative")
                elif any(k == rec_lower for k in ["child", "grandchild", "kid", "kids"]):
                    rec_q |= (
                        Q(recipient__icontains="Kids")
                        | Q(gender_target__iexact="Kids")
                        | Q(age_group__icontains="Kids")
                        | Q(recipient__icontains="Unisex")
                    )
                elif any(k in rec_lower for k in ["boyfriend", "husband", "dad", "father", "brother", "son", "grandpa", "him"]):
                    rec_q |= Q(recipient__icontains="For Him") | Q(recipient__icontains="Unisex")
                elif any(k in rec_lower for k in ["girlfriend", "wife", "mom", "mother", "sister", "daughter", "grandma", "her"]):
                    rec_q |= Q(recipient__icontains="For Her") | Q(recipient__icontains="Unisex")
                else:
                    rec_q |= Q(recipient__icontains=rec)
            if rec_q:
                queryset = queryset.filter(rec_q)

    # 6. Interests (Catalog unique values: Toys, Fashion, Beauty, Sports, Home & Decor, Experiences, Travel, Crafts, Jewelry, Wellness, Tech, Outdoor, Gaming)
    if interests_param:
        raw_tokens = [t.strip() for t in interests_param.split(",") if t.strip()]
        if raw_tokens:
            interest_q = Q()
            for token in raw_tokens:
                token_lower = token.lower()
                if token_lower == "other":
                    continue
                interest_q |= Q(interests__icontains=token) | Q(category__icontains=token)
                mapped_cats = INTEREST_TO_CATEGORIES.get(token_lower, [])
                for m_cat in mapped_cats:
                    interest_q |= Q(interests__icontains=m_cat) | Q(category__icontains=m_cat)
            if interest_q:
                queryset = queryset.filter(interest_q)

    # 7. Category / Gift Type (Catalog unique values: Toys, Fashion, Beauty, Sports, Home & Decor, Experiences, Travel, Crafts, Jewelry, Wellness, Tech, Outdoor, Gaming)
    if category_param:
        raw_categories = [c.strip() for c in category_param.split(",") if c.strip()]
        if raw_categories:
            cat_q = Q()
            for cat in raw_categories:
                cat_lower = cat.lower()
                if cat_lower == "other":
                    continue
                cat_q |= Q(category__iexact=cat) | Q(category__icontains=cat)
                mapped_cats = GIFT_TYPE_TO_CATEGORIES.get(cat_lower, [])
                for m_cat in mapped_cats:
                    cat_q |= Q(category__icontains=m_cat)
            if cat_q:
                queryset = queryset.filter(cat_q)

    # 8. Occasion (Catalog unique values: Birthday, Christmas, Anniversary, Housewarming, mother_day, Thanksgiving, Father’s Day, father_day, wedding_or_engagement, Party, Halloween, Graduation, Retirement)
    if occasion_param:
        raw_occasions = [o.strip() for o in occasion_param.split(",") if o.strip()]
        if raw_occasions:
            occ_q = Q()
            for occ in raw_occasions:
                occ_lower = occ.lower().replace("’", "'").strip()
                if "mother" in occ_lower:
                    occ_q |= (
                        Q(occasion__icontains="mother_day")
                        | Q(occasion__icontains="Mother’s Day")
                        | Q(occasion__icontains="Mother's Day")
                    )
                elif "father" in occ_lower:
                    occ_q |= (
                        Q(occasion__icontains="Father’s Day")
                        | Q(occasion__icontains="father_day")
                        | Q(occasion__icontains="Father's Day")
                    )
                elif "wedding" in occ_lower or "engagement" in occ_lower:
                    occ_q |= (
                        Q(occasion__icontains="wedding_or_engagement")
                        | Q(occasion__icontains="Wedding or Engagement")
                    )
                elif "anniversary" in occ_lower:
                    occ_q |= Q(occasion__icontains="anniversary")
                else:
                    occ_straight = occ.replace("’", "'")
                    occ_curly = occ.replace("'", "’")
                    occ_q |= Q(occasion__icontains=occ_straight) | Q(occasion__icontains=occ_curly)
            if occ_q:
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
