from datetime import date, timedelta

import pytest

from app.booking import WEEKDAY_SLOTS, WEEKEND_SLOTS, slots_for_date, validate_slot


def next_day(weekday: int) -> date:
    value = date.today() + timedelta(days=1)
    while value.weekday() != weekday:
        value += timedelta(days=1)
    return value


def test_weekday_has_evening_slot_only():
    assert slots_for_date(next_day(0)) == WEEKDAY_SLOTS == ("18:00",)


def test_weekend_has_four_slots():
    assert slots_for_date(next_day(5)) == WEEKEND_SLOTS


def test_invalid_weekday_slot_is_rejected():
    with pytest.raises(ValueError, match="not available"):
        validate_slot(next_day(2), "09:00", "UTC")


def test_past_date_is_rejected():
    with pytest.raises(ValueError, match="Past dates"):
        validate_slot(date.today() - timedelta(days=1), "18:00", "UTC")

