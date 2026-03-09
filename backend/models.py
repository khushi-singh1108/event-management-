from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(20), default="student")  # "student" or "admin"
    dept = Column(String(255), nullable=True)
    year = Column(String(50), nullable=True)
    roll_no = Column(String(50), nullable=True)
    cgpa = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    registrations = relationship("Registration", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    category = Column(String(100), nullable=False)
    date = Column(String(20), nullable=False)   # YYYY-MM-DD
    time = Column(String(20), nullable=False)
    venue = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    capacity = Column(Integer, nullable=False, default=100)
    participants = Column(Integer, default=0)
    poster = Column(String(10), default="🎉")
    tags = Column(Text, default="[]")           # JSON-encoded list
    status = Column(String(20), default="Upcoming")  # Upcoming, Ongoing, Past
    organizer = Column(String(255), nullable=True)
    organizer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    color = Column(String(20), default="#00f5ff")
    created_at = Column(DateTime, default=datetime.utcnow)

    registrations = relationship("Registration", back_populates="event", cascade="all, delete-orphan")
    organizer_user = relationship("User", foreign_keys=[organizer_id])


class Registration(Base):
    __tablename__ = "registrations"
    __table_args__ = (UniqueConstraint("user_id", "event_id", name="uq_user_event"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    registered_at = Column(DateTime, default=datetime.utcnow)
    attended = Column(Boolean, default=False)

    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), default="info")   # reminder, confirmation, announcement, alert, warning, result
    message = Column(String(1000), nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")
