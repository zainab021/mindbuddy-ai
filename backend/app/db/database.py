"""
app/db/database.py
──────────────────
SQLAlchemy engine and session setup.

get_db() is a FastAPI dependency — inject it into any route that needs the DB:

    @router.get("/items")
    def list_items(db: Session = Depends(get_db)):
        ...
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.config.settings import DATABASE_URL


class Base(DeclarativeBase):
    """All ORM models inherit from this base class."""
    pass


# pool_pre_ping=True reconnects automatically if Supabase drops idle connections
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine)


def get_db():
    """Yield a database session, then close it when the request is done."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
