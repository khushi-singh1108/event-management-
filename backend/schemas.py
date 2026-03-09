from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime


# ─────────────────────────── AUTH ───────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "student"
    dept: Optional[str] = None
    year: Optional[str] = None
    roll_no: Optional[str] = None
    cgpa: Optional[float] = None

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v

    @field_validator("role")
    @classmethod
    def validate_role(cls, v):
        if v not in ("student", "admin"):
            raise ValueError("Role must be 'student' or 'admin'")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    role: str
    dept: Optional[str] = None
    year: Optional[str] = None
    roll_no: Optional[str] = None
    cgpa: Optional[float] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    dept: Optional[str] = None
    year: Optional[str] = None
    roll_no: Optional[str] = None
    cgpa: Optional[float] = None


# ─────────────────────────── EVENTS ───────────────────────────

class EventCreate(BaseModel):
    title: str
    category: str
    date: str
    time: str
    venue: str
    description: str
    capacity: int = 100
    poster: str = "🎉"
    tags: List[str] = []
    status: str = "Upcoming"
    color: str = "#00f5ff"

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v not in ("Upcoming", "Ongoing", "Past"):
            raise ValueError("Status must be Upcoming, Ongoing or Past")
        return v


class EventUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    venue: Optional[str] = None
    description: Optional[str] = None
    capacity: Optional[int] = None
    poster: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None
    color: Optional[str] = None


class EventOut(BaseModel):
    id: int
    title: str
    category: str
    date: str
    time: str
    venue: str
    description: str
    capacity: int
    participants: int
    poster: str
    tags: List[str]
    status: str
    organizer: Optional[str]
    color: str
    registered: bool = False   # injected per-request
    created_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────── REGISTRATIONS ───────────────────────────

class RegistrationOut(BaseModel):
    id: int
    user_id: int
    event_id: int
    registered_at: datetime
    attended: bool
    user: Optional[UserOut] = None
    event: Optional[EventOut] = None

    class Config:
        from_attributes = True


# ─────────────────────────── NOTIFICATIONS ───────────────────────────

class NotificationOut(BaseModel):
    id: int
    user_id: int
    type: str
    message: str
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationCreate(BaseModel):
    message: str
    type: str = "announcement"
    user_id: Optional[int] = None   # None = broadcast to all students


# ─────────────────────────── ADMIN STATS ───────────────────────────

class AdminStats(BaseModel):
    total_events: int
    total_participants: int
    upcoming_count: int
    ongoing_count: int
    past_count: int
    total_users: int
    total_registrations: int


Token.model_rebuild()
