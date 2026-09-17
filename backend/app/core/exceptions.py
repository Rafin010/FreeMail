"""FastAPI exception handling."""

from fastapi import Request, status
from fastapi.responses import JSONResponse


class AppException(Exception):
    """Base exception for application errors."""
    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST, code: str = "bad_request"):
        self.message = message
        self.status_code = status_code
        self.code = code
        super().__init__(self.message)


class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status.HTTP_404_NOT_FOUND, "not_found")


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Not authenticated"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED, "unauthorized")


class ForbiddenException(AppException):
    def __init__(self, message: str = "Not authorized to access this resource"):
        super().__init__(message, status.HTTP_403_FORBIDDEN, "forbidden")


class ConflictException(AppException):
    def __init__(self, message: str = "Resource already exists"):
        super().__init__(message, status.HTTP_409_CONFLICT, "conflict")


async def app_exception_handler(request: Request, exc: AppException):
    """Global handler for all custom AppExceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": exc.code, "message": exc.message}},
    )
