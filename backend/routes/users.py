from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models, schemas
from auth import get_current_user, require_admin

router = APIRouter(prefix="/users", tags=["Users"])


# ─── Notifications ────────────────────────────────────────────────

@router.get("/me/notifications", response_model=List[schemas.NotificationOut])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    notifs = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).order_by(models.Notification.created_at.desc()).all()
    return notifs


@router.put("/me/notifications/{notif_id}/read", response_model=schemas.NotificationOut)
def mark_notification_read(
    notif_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    notif = db.query(models.Notification).filter(
        models.Notification.id == notif_id,
        models.Notification.user_id == current_user.id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.read = True
    db.commit()
    db.refresh(notif)
    return notif


@router.put("/me/notifications/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).update({"read": True})
    db.commit()
    return {"message": "All notifications marked as read"}


# ─── Certificates (past events attended) ─────────────────────────

@router.get("/me/certificates")
def get_certificates(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Return past events the user attended (registered for)."""
    regs = db.query(models.Registration).filter(
        models.Registration.user_id == current_user.id
    ).all()
    certs = []
    for reg in regs:
        event = db.query(models.Event).filter(models.Event.id == reg.event_id).first()
        if event and event.status == "Past":
            certs.append({
                "registration_id": reg.id,
                "event_id": event.id,
                "title": event.title,
                "category": event.category,
                "date": event.date,
                "organizer": event.organizer,
                "poster": event.poster,
                "registered_at": reg.registered_at,
            })
    return certs


# ─── Admin: list all users ────────────────────────────────────────

@router.get("/", response_model=List[schemas.UserOut])
def list_users(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    return db.query(models.User).filter(models.User.role == "student").all()


@router.delete("/{user_id}", status_code=204)
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit()
