from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator


AppointmentStatus = Literal["pending", "confirmed", "cancelled"]
AppointmentFocus = Literal[
    "Strength Training",
    "Weight Loss",
    "Athletic Performance",
]
AppointmentServiceType = Literal["In-Person Training", "Online Coaching"]
AppointmentDuration = Literal["30 Minutes", "60 Minutes"]


class AboutContent(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    title: str = Field(min_length=1, max_length=150)
    bio: str = Field(min_length=1, max_length=8000)
    quote: str = Field(min_length=1, max_length=500)
    image_url: str = Field(max_length=1000)
    credentials: list[str] = Field(default_factory=list, max_length=30)

    @field_validator("credentials")
    @classmethod
    def clean_credentials(cls, value: list[str]) -> list[str]:
        return [item.strip() for item in value if item.strip()]


class AppointmentCreate(BaseModel):
    date: date | None = None
    time: str = ""
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=30)
    service_type: AppointmentServiceType = "In-Person Training"
    duration: AppointmentDuration = "60 Minutes"
    focus: AppointmentFocus
    commitment: str = Field(default="", max_length=50)
    obstacle: str = Field(default="", max_length=2000)
    promotion_code: str = Field(default="", max_length=200)
    contact_preference: str = Field(default="Email", max_length=50)
    notes: str = Field(default="", max_length=2000)


class AppointmentUpdate(BaseModel):
    status: AppointmentStatus


class AppointmentResponse(BaseModel):
    id: str
    date: str
    time: str
    name: str
    email: EmailStr
    phone: str
    service_type: AppointmentServiceType
    duration: AppointmentDuration
    focus: AppointmentFocus
    commitment: str
    obstacle: str
    promotion_code: str
    contact_preference: str
    notes: str
    status: AppointmentStatus
    created_at: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=500)


class AuthResponse(BaseModel):
    email: EmailStr
    access_token: str | None = None


def serialize_appointment(document: dict) -> AppointmentResponse:
    return AppointmentResponse(
        id=str(document["_id"]),
        date=document["date"],
        time=document["time"],
        name=document["name"],
        email=document["email"],
        phone=document["phone"],
        service_type=document.get("service_type", "In-Person Training"),
        duration=document.get("duration", "60 Minutes"),
        focus=document["focus"],
        commitment=document.get("commitment", ""),
        obstacle=document.get("obstacle", ""),
        promotion_code=document.get("promotion_code", ""),
        contact_preference=document.get("contact_preference", "Email"),
        notes=document.get("notes", ""),
        status=document["status"],
        created_at=document["created_at"],
    )


def iso_now() -> str:
    return datetime.now().astimezone().isoformat()
