from django.db import connection
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from config.swagger import ERROR_503_SERVICE_UNAVAILABLE


@swagger_auto_schema(
    tags=["api/health"],
    method="get",
    operation_summary="Health Check",
    operation_description="Returns the operational status of the API and its database connectivity.",
    responses={
        200: openapi.Response(
            "Service is healthy",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "status": openapi.Schema(type=openapi.TYPE_STRING, example="ok"),
                    "database": openapi.Schema(type=openapi.TYPE_STRING, example="ok"),
                }
            )
        ),
        503: ERROR_503_SERVICE_UNAVAILABLE
    }
)
@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def health_check(request):
    db_status = "ok"
    try:
        connection.ensure_connection()
    except Exception:
        db_status = "unavailable"

    status_code = status.HTTP_200_OK if db_status == "ok" else status.HTTP_503_SERVICE_UNAVAILABLE
    return Response({"status": "ok", "database": db_status}, status=status_code)
