"""
Seed the database with initial data:
  - 1 Admin: admin@university.edu / admin123
  - 1 Student: student@university.edu / student123 (Khushi Singh)
  - 12 sample events across all categories

Run: python seed.py
"""

import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
from models import User, Event, Registration, Notification
from auth import hash_password

Base.metadata.create_all(bind=engine)

EVENTS_DATA = [
    {
        "title": "National Hackathon 2026",
        "category": "Technical",
        "date": "2026-03-15",
        "time": "09:00 AM",
        "venue": "Tech Innovation Hub, Block A",
        "status": "Upcoming",
        "participants": 87,
        "capacity": 150,
        "description": "Join us for an intense 48-hour hackathon where teams build innovative solutions to real-world problems. Industry mentors, exciting prizes, and networking opportunities await. All domains welcome — Web, AI/ML, IoT, Blockchain.",
        "poster": "⚡",
        "tags": ["Hackathon", "Coding", "AI/ML", "Prize Money"],
        "color": "#00f5ff",
    },
    {
        "title": "Spring Cultural Fest 2026",
        "category": "Annual Fest",
        "date": "2026-03-20",
        "time": "05:00 PM",
        "venue": "University Amphitheater",
        "status": "Upcoming",
        "participants": 320,
        "capacity": 500,
        "description": "The grandest annual cultural festival of the university spanning 3 days with music, dance, art exhibitions, fashion shows, debates, and star night performances.",
        "poster": "🎪",
        "tags": ["Cultural", "Music", "Dance", "Festival", "Star Night"],
        "color": "#ff006e",
    },
    {
        "title": "TCS Internship Drive",
        "category": "Internship",
        "date": "2026-03-18",
        "time": "10:00 AM",
        "venue": "Placement Cell, Admin Block",
        "status": "Upcoming",
        "participants": 145,
        "capacity": 200,
        "description": "TCS is visiting campus for their prestigious NextStep internship program. Roles available in software development, data analytics, and cloud computing. Package: ₹3.36 LPA.",
        "poster": "💼",
        "tags": ["Placement", "Internship", "TCS", "CS", "IT"],
        "color": "#ffd60a",
    },
    {
        "title": "Inter-College Cricket Tournament",
        "category": "Sports",
        "date": "2026-03-10",
        "time": "08:00 AM",
        "venue": "University Cricket Ground",
        "status": "Ongoing",
        "participants": 180,
        "capacity": 180,
        "description": "The most anticipated cricket tournament of the year with 12 college teams competing. T20 format, professional umpires, live scoring, and trophy plus cash prizes.",
        "poster": "🏏",
        "tags": ["Cricket", "Sports", "T20", "Inter-College"],
        "color": "#06d6a0",
    },
    {
        "title": "AI/ML Workshop Series",
        "category": "Workshop",
        "date": "2026-03-08",
        "time": "02:00 PM",
        "venue": "Seminar Hall 3, CS Block",
        "status": "Ongoing",
        "participants": 60,
        "capacity": 80,
        "description": "A 5-day intensive workshop covering hands-on machine learning, neural networks, NLP, and computer vision with Python. Participants build 3 real-world projects. Certificate provided.",
        "poster": "🤖",
        "tags": ["AI", "ML", "Python", "Deep Learning", "Certificate"],
        "color": "#8338ec",
    },
    {
        "title": "Entrepreneurship Summit",
        "category": "Educational",
        "date": "2026-03-09",
        "time": "11:00 AM",
        "venue": "Convention Center, Main Block",
        "status": "Ongoing",
        "participants": 210,
        "capacity": 300,
        "description": "Two-day summit featuring talks by successful startup founders, VC panel discussions, startup pitch competitions, and networking sessions.",
        "poster": "🎓",
        "tags": ["Startup", "Entrepreneurship", "VC", "Innovation"],
        "color": "#ffd60a",
    },
    {
        "title": "Photography Exhibition",
        "category": "Entertainment",
        "date": "2026-02-28",
        "time": "10:00 AM",
        "venue": "Art Gallery, Humanities Block",
        "status": "Past",
        "participants": 95,
        "capacity": 100,
        "description": "A stunning photography exhibition showcasing student work across genres — portrait, landscape, street, and experimental. 3-day event with jury awards.",
        "poster": "🎭",
        "tags": ["Photography", "Art", "Exhibition", "Creative"],
        "color": "#ff006e",
    },
    {
        "title": "Tree Plantation Drive",
        "category": "Community",
        "date": "2026-02-25",
        "time": "07:00 AM",
        "venue": "University Campus (East Wing)",
        "status": "Past",
        "participants": 250,
        "capacity": 300,
        "description": "Campus-wide tree plantation initiative as part of our Green Campus Mission. 500+ saplings with the Forest Department. Community service certificates issued.",
        "poster": "🌱",
        "tags": ["Environment", "NSS", "Green", "Community Service"],
        "color": "#06d6a0",
    },
    {
        "title": "Robotics Competition",
        "category": "Technical",
        "date": "2026-02-20",
        "time": "09:00 AM",
        "venue": "Electronics Lab, ECE Block",
        "status": "Past",
        "participants": 75,
        "capacity": 100,
        "description": "Teams design and build autonomous robots. Categories: Line follower, Maze solver, and Freestyle. Cash prizes and components kit for winners.",
        "poster": "🦾",
        "tags": ["Robotics", "Arduino", "Competition", "Electronics"],
        "color": "#00f5ff",
    },
    {
        "title": "Mental Health Awareness Week",
        "category": "Community",
        "date": "2026-03-25",
        "time": "10:00 AM",
        "venue": "Counseling Center & Online",
        "status": "Upcoming",
        "participants": 40,
        "capacity": 200,
        "description": "Week-long awareness program with counseling sessions, yoga workshops, open mic for sharing experiences, and expert talks. Breaking stigma and building community.",
        "poster": "🌸",
        "tags": ["Mental Health", "Wellness", "Community", "Yoga"],
        "color": "#8338ec",
    },
    {
        "title": "CodeSprint Competitive Programming",
        "category": "Technical",
        "date": "2026-03-22",
        "time": "01:00 PM",
        "venue": "Computer Lab 1 & Online",
        "status": "Upcoming",
        "participants": 110,
        "capacity": 200,
        "description": "3-hour competitive programming contest on Codeforces platform. DSA problems across difficulty levels. Top 10 get certificates + swag.",
        "poster": "💻",
        "tags": ["Competitive Programming", "DSA", "Codeforces", "Prize"],
        "color": "#00f5ff",
    },
    {
        "title": "Classical Music Night",
        "category": "Entertainment",
        "date": "2026-03-05",
        "time": "07:30 PM",
        "venue": "Open Air Theatre",
        "status": "Past",
        "participants": 400,
        "capacity": 450,
        "description": "An enchanting evening showcasing classical Indian and Western music by talented students and alumni. Sitar recitals, violin solos, choir, and jazz fusion finale.",
        "poster": "🎵",
        "tags": ["Music", "Classical", "Cultural", "Evening"],
        "color": "#ff006e",
    },
]


def seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(User).first():
            print("✓ Database already seeded. Skipping.")
            return

        print("🌱 Seeding database...")

        # ── Admin user ──────────────────────────────────────────
        admin = User(
            email="admin@university.edu",
            hashed_password=hash_password("admin123"),
            name="Dr. Priya Mehta",
            role="admin",
            dept="Event Management & Student Affairs",
            is_active=True,
        )
        db.add(admin)
        db.flush()

        # ── Student user ─────────────────────────────────────────
        student = User(
            email="student@university.edu",
            hashed_password=hash_password("student123"),
            name="Khushi Singh",
            role="student",
            dept="Computer Science & Engineering",
            year="3rd Year",
            roll_no="F233200",
            cgpa=8.7,
            is_active=True,
        )
        db.add(student)
        db.flush()

        # ── Events ──────────────────────────────────────────────
        event_objs = []
        for ev in EVENTS_DATA:
            tags = ev.pop("tags")
            event = Event(
                **ev,
                tags=json.dumps(tags),
                organizer=admin.name,
                organizer_id=admin.id,
            )
            db.add(event)
            event_objs.append((event, tags))

        db.flush()

        # ── Student notifications ─────────────────────────────
        student_notifs = [
            ("reminder", "National Hackathon 2026 starts in 6 days!"),
            ("confirmation", "Registration confirmed for TCS Internship Drive"),
            ("announcement", "AI/ML Workshop Day 2 materials uploaded to portal"),
            ("reminder", "Spring Cultural Fest registration closes tomorrow!"),
            ("result", "You scored 94/100 in Photography Exhibition jury round!"),
        ]
        for i, (ntype, msg) in enumerate(student_notifs):
            notif = Notification(user_id=student.id, type=ntype, message=msg, read=(i >= 3))
            db.add(notif)

        # ── Admin notifications ───────────────────────────────
        admin_notifs = [
            ("alert", "Hackathon registration 87/150 — send reminder blast"),
            ("info", "Cultural Fest venue booking confirmed by admin office"),
            ("warning", "Cricket Ground maintenance — backup venue needed"),
            ("info", "TCS HR team confirmed visit for internship drive"),
        ]
        for i, (ntype, msg) in enumerate(admin_notifs):
            notif = Notification(user_id=admin.id, type=ntype, message=msg, read=(i >= 2))
            db.add(notif)

        # ── Register student in some events ──────────────────
        # Hackathon (id might vary, use index)
        db.flush()
        all_events = db.query(Event).all()
        register_titles = [
            "National Hackathon 2026", "TCS Internship Drive",
            "AI/ML Workshop Series", "Photography Exhibition",
            "Tree Plantation Drive", "Classical Music Night",
        ]
        for ev in all_events:
            if ev.title in register_titles:
                reg = Registration(user_id=student.id, event_id=ev.id)
                db.add(reg)

        db.commit()
        print(f"✅ Seeded: 2 users, {len(EVENTS_DATA)} events, 10 notifications")
        print("\n🔑 Login credentials:")
        print("   Student: student@university.edu / student123")
        print("   Admin:   admin@university.edu   / admin123")
        print("\n🚀 API Docs: http://localhost:8000/docs")

    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
