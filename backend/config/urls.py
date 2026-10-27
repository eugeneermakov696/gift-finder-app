from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from config.views import health_check

schema_view = get_schema_view(
    openapi.Info(
        title="Gift of Presents API",
        default_version="v1",
        description="Interactive documentation portal for the Amazon Localhost Gift Backend Application.",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("api/", health_check, name="api-health"),
    path("api/health/", health_check, name="api-health-detail"),
    path("admin/", admin.site.urls),
    path("", include("presents.urls")),
    path("", include("users.urls")),

    re_path(r"^swagger(?P<format>\.json|\.yaml)$", schema_view.without_ui(cache_timeout=0), name="schema-json"),
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
]

# Giftly Admin Branding
admin.site.site_header = "Giftly Administration"
admin.site.site_title = "Giftly Admin Portal"
admin.site.index_title = "Store Management & Catalog Control"
admin.site.site_url = None
admin.site.enable_nav_sidebar = False

# Ensure static files (including custom admin CSS/JS) are always served in all environments
from django.contrib.staticfiles.views import serve as staticfiles_serve

urlpatterns += [
    re_path(r"^static/(?P<path>.*)$", staticfiles_serve, {"insecure": True}),
]

