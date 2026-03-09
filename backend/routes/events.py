import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
import models, schemas
from auth import get_current_user, require_admin

router = APIRouter(prefix="/events", tags=["Events"])


def _serialize_event(event: models.Event, user_id: Optional[int], db: Session) -> dict:
    """Convert ORM event to dict with computed fields."""
    tags = []
    try:
        tags = json.loads(event.tags) if event.tags else []
    except Exception:
        tags = []

    registered = False
    if user_id:
        reg = db.query(models.Registration).filter(
            models.Registration.event_id == event.id,
            models.Registration.user_id == user_id
        ).first()
        registered = reg is not None

    return {
        "id": event.id,
        "title": event.title,
        "category": event.category,
        "date": event.date,
        "time": event.time,
        "venue": event.venue,
        "description": event.description,
        "capacity": event.capacity,
        "participants": event.participants,
        "poster": event.poster,
        "tags": tags,
        "status": event.status,
        "organizer": event.organizer,
        "color": event.color,
        "registered": registered,
        "created_at": event.created_at,
    }


# ─── GET all events ─────────────────────────────────────────────

@router.get("/", response_model=List[schemas.EventOut])
def get_events(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(
        lambda token=None, db=Depends(get_db): None
    )
):
    # public endpoint — no auth required
    from fastapi import Request
    q = db.query(models.Event)
    if category and category != "All":
        q = q.filter(models.Event.category == category)
    if status and status != "All":
        q = q.filter(models.Event.status == status)
    if search:
        q = q.filter(
            models.Event.title.ilike(f"%{search}%") |
            models.Event.description.ilike(f"%{search}%")
        )
    events = q.order_by(models.Event.created_at.desc()).all()
    return [_serialize_event(e, None, db) for e in events]


# We need the optional user-aware version of get_events too
@router.get("/me", response_model=List[schemas.EventOut])
def get_my_events(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Return events the current user is registered for."""
    regs = db.query(models.Registration).filter(
        models.Registration.user_id == current_user.id
    ).all()
    event_ids = [r.event_id for r in regs]
    events = db.query(models.Event).filter(models.Event.id.in_(event_ids)).all()
    return [_serialize_event(e, current_user.id, db) for e in events]


@router.get("/all-authenticated", response_model=List[schemas.EventOut])
def get_all_events_auth(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get all events with the 'registered' flag set for current user."""
    q = db.query(models.Event)
    if category and category != "All":
        q = q.filter(models.Event.category == category)
    if status and status != "All":
        q = q.filter(models.Event.status == status)
    if search:
        q = q.filter(
            models.Event.title.ilike(f"%{search}%") |
            models.Event.description.ilike(f"%{search}%")
        )
    events = q.order_by(models.Event.created_at.desc()).all()
    return [_serialize_event(e, current_user.id, db) for e in events]


# ─── GET single event ────────────────────────────────────────────

@router.get("/{event_id}", response_model=schemas.EventOut)
def get_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return _serialize_event(event, None, db)


# ─── CREATE event (admin) ────────────────────────────────────────

@router.post("/", response_model=schemas.EventOut, status_code=201)
def create_event(
    payload: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin)
):
    data = payload.model_dump()
    tags = data.pop("tags", [])
    event = models.Event(
        **data,
        tags=json.dumps(tags),
        organizer=current_user.name,
        organizer_id=current_user.id,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return _serialize_event(event, current_user.id, db)


# ─── UPDATE event (admin) ────────────────────────────────────────

@router.put("/{event_id}", response_model=schemas.EventOut)
def update_event(
    event_id: int,
    payload: schemas.EventUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    data = payload.model_dump(exclude_unset=True)
    if "tags" in data:
        data["tags"] = json.dumps(data["tags"])
    for field, value in data.items():
        setattr(event, field, value)
    db.commit()
    db.refresh(event)
    return _serialize_event(event, current_user.id, db)


# ─── DELETE event (admin) ────────────────────────────────────────

@router.delete("/{event_id}", status_code=204)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()


# ─── REGISTER for event ──────────────────────────────────────────

@router.post("/{event_id}/register", status_code=201)
def register_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.status == "Past":
        raise HTTPException(status_code=400, detail="Cannot register for a past event")
    if event.participants >= event.capacity:
        raise HTTPException(status_code=400, detail="Event is at full capacity")

    existing = db.query(models.Registration).filter(
        models.Registration.user_id == current_user.id,
        models.Registration.event_id == event_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered")

    reg = models.Registration(user_id=current_user.id, event_id=event_id)
    event.participants += 1
    db.add(reg)

    # Confirmation notification
    notif = models.Notification(
        user_id=current_user.id,
        type="confirmation",
        message=f"🎉 Registration confirmed for '{event.title}' on {event.date} at {event.time}.",
    )
    db.add(notif)
    db.commit()
    return {"message": "Registration successful", "event_id": event_id}


# ─── UN-REGISTER from event ──────────────────────────────────────

@router.delete("/{event_id}/register", status_code=200)
def unregister_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    reg = db.query(models.Registration).filter(
        models.Registration.user_id == current_user.id,
        models.Registration.event_id == event_id
    ).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")

    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if event and event.participants > 0:
        event.participants -= 1

    db.delete(reg)
    db.commit()
    return {"message": "Unregistered successfully"}


# ─── GET registrations for an event (admin) ──────────────────────

@router.get("/{event_id}/registrations")
def get_event_registrations(
    event_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    regs = db.query(models.Registration).filter(
        models.Registration.event_id == event_id
    ).all()
    return [
        {
            "id": r.id,
            "registered_at": r.registered_at,
            "attended": r.attended,
            "user": {
                "id": r.user.id,
                "name": r.user.name,
                "email": r.user.email,
                "roll_no": r.user.roll_no,
                "dept": r.user.dept,
                "year": r.user.year,
            }
        }
        for r in regs
    ]


# ─── Mark attendance (admin) ─────────────────────────────────────

@router.patch("/{event_id}/registrations/{reg_id}/attend")
def mark_attended(
    event_id: int,
    reg_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    reg = db.query(models.Registration).filter(
        models.Registration.id == reg_id,
        models.Registration.event_id == event_id
    ).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    reg.attended = not reg.attended
    db.commit()
    return {"attended": reg.attended}
