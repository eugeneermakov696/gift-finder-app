from drf_yasg import openapi

# Standard error response schemas
error_detail_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "detail": openapi.Schema(type=openapi.TYPE_STRING, description="Error message description"),
    }
)

validation_error_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "detail": openapi.Schema(type=openapi.TYPE_STRING, description="Error summary or message"),
        "errors": openapi.Schema(
            type=openapi.TYPE_OBJECT,
            description="Field-level validation error details",
            example={"field_name": ["This field is required."]}
        ),
    }
)

# Common HTTP error responses
ERROR_400_BAD_REQUEST = openapi.Response(
    description="Bad Request - Invalid payload, parameters, or validation error",
    schema=validation_error_schema,
)

ERROR_401_UNAUTHORIZED = openapi.Response(
    description="Unauthorized - Authentication credentials were not provided or are invalid",
    schema=error_detail_schema,
)

ERROR_403_FORBIDDEN = openapi.Response(
    description="Forbidden - You do not have permission to perform this action",
    schema=error_detail_schema,
)

ERROR_404_NOT_FOUND = openapi.Response(
    description="Not Found - The requested resource was not found",
    schema=error_detail_schema,
)

ERROR_500_INTERNAL_SERVER_ERROR = openapi.Response(
    description="Internal Server Error - An unexpected error occurred on the server",
    schema=error_detail_schema,
)

ERROR_503_SERVICE_UNAVAILABLE = openapi.Response(
    description="Service Unavailable - Server or external dependency is currently unavailable",
    schema=error_detail_schema,
)

# Combined common error response mappings
COMMON_ERROR_RESPONSES = {
    400: ERROR_400_BAD_REQUEST,
    401: ERROR_401_UNAUTHORIZED,
    403: ERROR_403_FORBIDDEN,
    404: ERROR_404_NOT_FOUND,
    500: ERROR_500_INTERNAL_SERVER_ERROR,
}

COMMON_AUTH_ERROR_RESPONSES = {
    401: ERROR_401_UNAUTHORIZED,
    403: ERROR_403_FORBIDDEN,
}
