import asyncio
from contextlib import asynccontextmanager
from datetime import date

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, FastAPI, HTTPException, Query, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo import ASCENDING, AsyncMongoClient, ReturnDocument
from pymongo.errors import DuplicateKeyError

from .auth import (
    REFRESH_COOKIE,
    clear_auth_cookies,
    credentials_match,
    decode_token,
    require_admin,
    set_auth_cookies,
)
from .booking import validate_slot
from .config import Settings, get_settings
from .email_service import notify_booking_confirmed, notify_new_booking
from .models import (
    AboutContent,
    AppointmentCreate,
    AppointmentResponse,
    AppointmentStatus,
    AppointmentUpdate,
    AuthResponse,
    LoginRequest,
    iso_now,
    serialize_appointment,
)

DEFAULT_ABOUT = AboutContent(
    name="Rose Copes",
    title="Founder · REACH Fitness",
    bio=(
        "Rose Copes brings the perspective of an NCAA Division I athlete at Grand "
        "Canyon University to every coaching relationship. Her own experience in "
        "high-performance environments shaped a practical belief: lasting progress "
        "comes from training the whole athlete, not chasing isolated outcomes.\n\n"
        "Now a Doctor of Physical Therapy student at Rockhurst University, Rose "
        "connects strength and conditioning with a deeper understanding of movement, "
        "recovery, and long-term health. Her work is especially focused on helping "
        "youth and collegiate athletes build durable foundations for sport and life.\n\n"
        "REACH Fitness brings resistance, enhancement, athletics, conditioning, and "
        "health into one deliberate practice. Each session meets the athlete where "
        "they are and moves them toward where they want to go."
    ),
    quote="Your goals are within reach. Let's build the foundation to get you there.",
    image_url="/images/coach-portrait.png",
    credentials=[
        "BS in Biology",
        "NSCA CSCS Certified",
        "Division I NCAA Athlete",
    ],
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    client = AsyncMongoClient(settings.mongo_url)
    db = client[settings.db_name]
    app.state.mongo_client = client
    app.state.db = db
    await db.appointments.create_index(
        [("active_slot", ASCENDING)],
        unique=True,
        sparse=True,
    )
    await db.appointments.create_index([("date", ASCENDING), ("time", ASCENDING)])
    await db.about.update_one(
        {"_id": "about"},
        {"$setOnInsert": DEFAULT_ABOUT.model_dump()},
        upsert=True,
    )
    yield
    await client.close()


app = FastAPI(title="REACH Fitness API", lifespan=lifespan)
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def database(request: Request):
    return request.app.state.db


def appointment_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except InvalidId as exc:
        raise HTTPException(status_code=404, detail="Appointment not found.") from exc


@app.get("/")
async def root() -> dict[str, str]:
    return {"name": "REACH Fitness API", "status": "ok"}


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/auth/login", response_model=AuthResponse)
async def login(
    payload: LoginRequest,
    response: Response,
    settings: Settings = Depends(get_settings),
) -> AuthResponse:
    if not credentials_match(payload.email, payload.password, settings):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    set_auth_cookies(response, settings.admin_email, settings.jwt_secret)
    return AuthResponse(email=settings.admin_email)


@app.get("/api/auth/me", response_model=AuthResponse)
async def me(email: str = Depends(require_admin)) -> AuthResponse:
    return AuthResponse(email=email)


@app.post("/api/auth/logout", status_code=204)
async def logout(response: Response) -> None:
    clear_auth_cookies(response)


@app.post("/api/auth/refresh", response_model=AuthResponse)
async def refresh(
    request: Request,
    response: Response,
    settings: Settings = Depends(get_settings),
) -> AuthResponse:
    token = request.cookies.get(REFRESH_COOKIE)
    if not token:
        raise HTTPException(status_code=401, detail="Refresh token required.")
    email = decode_token(token, settings, "refresh")
    set_auth_cookies(response, email, settings.jwt_secret)
    return AuthResponse(email=email)


@app.get("/api/about", response_model=AboutContent)
async def get_about(db=Depends(database)) -> AboutContent:
    document = await db.about.find_one({"_id": "about"})
    if not document:
        return DEFAULT_ABOUT
    document.pop("_id", None)
    return AboutContent(**document)


@app.put("/api/about", response_model=AboutContent)
async def update_about(
    payload: AboutContent,
    _admin: str = Depends(require_admin),
    db=Depends(database),
) -> AboutContent:
    await db.about.update_one(
        {"_id": "about"},
        {"$set": payload.model_dump()},
        upsert=True,
    )
    return payload


@app.post(
    "/api/appointments",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_appointment(
    payload: AppointmentCreate,
    db=Depends(database),
    settings: Settings = Depends(get_settings),
) -> AppointmentResponse:
    try:
        validate_slot(payload.date, payload.time, settings.studio_timezone)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    document = {
        **payload.model_dump(mode="json"),
        "status": "pending",
        "created_at": iso_now(),
        "active_slot": f"{payload.date.isoformat()}|{payload.time}",
    }
    try:
        result = await db.appointments.insert_one(document)
    except DuplicateKeyError as exc:
        raise HTTPException(status_code=409, detail="That slot was just booked.") from exc
    document["_id"] = result.inserted_id
    asyncio.create_task(notify_new_booking(settings, document))
    return serialize_appointment(document)


@app.get("/api/appointments/booked")
async def booked_appointments(
    date_value: date = Query(alias="date"),
    db=Depends(database),
) -> dict[str, list[str]]:
    cursor = db.appointments.find(
        {"date": date_value.isoformat(), "status": {"$ne": "cancelled"}},
        {"time": 1},
    )
    times = [document["time"] async for document in cursor]
    return {"times": sorted(times)}


@app.get("/api/appointments", response_model=list[AppointmentResponse])
async def list_appointments(
    appointment_status: AppointmentStatus | None = Query(default=None, alias="status"),
    _admin: str = Depends(require_admin),
    db=Depends(database),
) -> list[AppointmentResponse]:
    query = {"status": appointment_status} if appointment_status else {}
    cursor = db.appointments.find(query).sort(
        [("date", ASCENDING), ("time", ASCENDING)]
    )
    return [serialize_appointment(document) async for document in cursor]


@app.patch(
    "/api/appointments/{appointment_id_value}",
    response_model=AppointmentResponse,
)
async def update_appointment(
    appointment_id_value: str,
    payload: AppointmentUpdate,
    _admin: str = Depends(require_admin),
    db=Depends(database),
    settings: Settings = Depends(get_settings),
) -> AppointmentResponse:
    object_id = appointment_id(appointment_id_value)
    current = await db.appointments.find_one({"_id": object_id})
    if not current:
        raise HTTPException(status_code=404, detail="Appointment not found.")

    update: dict = {"$set": {"status": payload.status}}
    if payload.status == "cancelled":
        update["$unset"] = {"active_slot": ""}
    else:
        update["$set"]["active_slot"] = f"{current['date']}|{current['time']}"

    try:
        document = await db.appointments.find_one_and_update(
            {"_id": object_id},
            update,
            return_document=ReturnDocument.AFTER,
        )
    except DuplicateKeyError as exc:
        raise HTTPException(
            status_code=409,
            detail="Another active appointment now occupies this slot.",
        ) from exc

    if current["status"] != "confirmed" and payload.status == "confirmed":
        asyncio.create_task(notify_booking_confirmed(settings, document))
    return serialize_appointment(document)


@app.delete("/api/appointments/{appointment_id_value}", status_code=204)
async def delete_appointment(
    appointment_id_value: str,
    _admin: str = Depends(require_admin),
    db=Depends(database),
) -> None:
    result = await db.appointments.delete_one(
        {"_id": appointment_id(appointment_id_value)}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found.")

