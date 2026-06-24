import asyncio
import logging

import httpx

from .config import Settings

logger = logging.getLogger(__name__)


def _send_email(settings: Settings, to: str, subject: str, html: str) -> None:
    if not settings.resend_api_key:
        logger.info("RESEND_API_KEY is empty; skipped email to %s", to)
        return
    response = httpx.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {settings.resend_api_key}",
            "Content-Type": "application/json",
        },
        json={
            "from": settings.sender_email,
            "to": [to],
            "subject": subject,
            "html": html,
        },
        timeout=15,
    )
    response.raise_for_status()


async def send_email_safe(
    settings: Settings,
    to: str,
    subject: str,
    html: str,
) -> None:
    try:
        await asyncio.to_thread(_send_email, settings, to, subject, html)
    except Exception:
        logger.exception("Email delivery failed for %s", to)


async def notify_new_booking(settings: Settings, appointment: dict) -> None:
    is_consultation = appointment.get("time") == "Pending"
    details = "".join(
        f"<p><strong>{label}:</strong> {appointment.get(key, '')}</p>"
        for label, key in (
            ("Name", "name"),
            ("Email", "email"),
            ("Phone", "phone"),
            ("Date", "date"),
            ("Time", "time"),
            ("Session Type", "service_type"),
            ("Focus", "focus"),
            ("Commitment", "commitment"),
            ("Obstacle", "obstacle"),
            ("Preferred Contact", "contact_preference"),
            ("Promotion Code", "promotion_code"),
            ("Notes", "notes"),
        )
    )
    await send_email_safe(
        settings,
        settings.notify_email,
        (
            "New REACH consultation request"
            if is_consultation
            else f"New REACH booking: {appointment['date']} at {appointment['time']}"
        ),
        f"<h1>New session request</h1>{details}",
    )


async def notify_booking_confirmed(settings: Settings, appointment: dict) -> None:
    if appointment.get("time") == "Pending":
        html = (
            f"<h1>You're confirmed.</h1>"
            f"<p>Hi {appointment['name']}, your REACH Fitness consultation "
            "request has been received.</p>"
            "<p>We will contact you shortly to review your goals and schedule "
            "the next step.</p>"
        )
    else:
        html = (
            f"<h1>You're confirmed.</h1>"
            f"<p>Hi {appointment['name']}, your REACH Fitness session is set for "
            f"<strong>{appointment['date']} at {appointment['time']}</strong>.</p>"
            f"<p>Session type: {appointment.get('service_type', 'In-Person Training')}.</p>"
            "<p>Reply to this email if you need anything before your session.</p>"
        )
    await send_email_safe(
        settings,
        appointment["email"],
        (
            "Your REACH Fitness consultation request is confirmed"
            if appointment.get("time") == "Pending"
            else "Your REACH Fitness session is confirmed"
        ),
        html,
    )
