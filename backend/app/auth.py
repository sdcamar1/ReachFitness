import hmac
from datetime import datetime, timedelta, timezone
from typing import Literal

import jwt
from fastapi import Depends, HTTPException, Request, Response, status

from .config import Settings, get_settings

ACCESS_COOKIE = "reach_access"
REFRESH_COOKIE = "reach_refresh"
ACCESS_MINUTES = 30
REFRESH_DAYS = 7


def create_token(
    email: str,
    secret: str,
    token_type: Literal["access", "refresh"],
) -> str:
    now = datetime.now(timezone.utc)
    expires = now + (
        timedelta(minutes=ACCESS_MINUTES)
        if token_type == "access"
        else timedelta(days=REFRESH_DAYS)
    )
    return jwt.encode(
        {"sub": email, "type": token_type, "iat": now, "exp": expires},
        secret,
        algorithm="HS256",
    )


def set_auth_cookies(response: Response, email: str, secret: str) -> None:
    common = {
        "httponly": True,
        "secure": True,
        "samesite": "none",
        "path": "/api",
    }
    response.set_cookie(
        ACCESS_COOKIE,
        create_token(email, secret, "access"),
        max_age=ACCESS_MINUTES * 60,
        **common,
    )
    response.set_cookie(
        REFRESH_COOKIE,
        create_token(email, secret, "refresh"),
        max_age=REFRESH_DAYS * 86400,
        **common,
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(ACCESS_COOKIE, path="/api", secure=True, samesite="none")
    response.delete_cookie(REFRESH_COOKIE, path="/api", secure=True, samesite="none")


def credentials_match(email: str, password: str, settings: Settings) -> bool:
    return hmac.compare_digest(email.lower(), settings.admin_email.lower()) and (
        hmac.compare_digest(password, settings.admin_password)
    )


def decode_token(token: str, settings: Settings, expected_type: str) -> str:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session.",
        ) from exc
    if payload.get("type") != expected_type or payload.get("sub") != settings.admin_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session.",
        )
    return payload["sub"]


def bearer_token(request: Request) -> str | None:
    authorization = request.headers.get("authorization", "")
    if authorization.lower().startswith("bearer "):
        return authorization[7:].strip()
    return None


def require_admin(
    request: Request,
    settings: Settings = Depends(get_settings),
) -> str:
    token = request.cookies.get(ACCESS_COOKIE) or bearer_token(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )
    return decode_token(token, settings, "access")
