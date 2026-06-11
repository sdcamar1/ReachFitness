from datetime import date
from zoneinfo import ZoneInfo

WEEKDAY_SLOTS = ("18:00",)
WEEKEND_SLOTS = ("09:00", "12:00", "15:00", "18:00")


def slots_for_date(value: date) -> tuple[str, ...]:
    return WEEKEND_SLOTS if value.weekday() >= 5 else WEEKDAY_SLOTS


def validate_slot(value: date, time: str, timezone_name: str) -> None:
    today = date.today()
    try:
        from datetime import datetime

        today = datetime.now(ZoneInfo(timezone_name)).date()
    except (KeyError, ValueError):
        pass

    if value < today:
        raise ValueError("Past dates cannot be booked.")
    if time not in slots_for_date(value):
        raise ValueError("That time is not available for the selected date.")

