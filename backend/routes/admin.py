from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models, schemas
from auth import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", response_model=schemas.AdminStats)
def get_stats(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    events = db.query(models.Event).all()
    return {
        "total_events": len(events),
        "total_participants": sum(e.participants for e in events),
        "upcoming_count": sum(1 for e in events if e.status == "Upcoming"),
        "ongoing_count": sum(1 for e in events if e.status == "Ongoing"),
        "past_count": sum(1 for e in events if e.status == "Past"),
        "total_users": db.query(models.User).filter(models.User.role == "student").count(),
        "total_registrations": db.query(models.Registration).count(),
    }


@router.post("/notifications/broadcast", status_code=201)
def broadcast_notification(
    payload: schemas.NotificationCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    """Send an announcement to a specific user or all students."""
    if payload.user_id:
        notif = models.Notification(
            user_id=payload.user_id,
            type=payload.type,
            message=payload.message,
        )
        db.add(notif)
    else:
        students = db.query(models.User).filter(
            models.User.role == "student",
            models.User.is_active == True
        ).all()
        for student in students:
            notif = models.Notification(
                user_id=student.id,
                type=payload.type,
                message=payload.message,
            )
            db.add(notif)
    db.commit()
    return {"message": "Notification(s) sent successfully"}
