from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./agrigrow.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def auto_migrate_columns():
    """Safely adds newly defined columns to existing SQLite tables if not present."""
    with engine.connect() as conn:
        # Check users table
        try:
            user_cols = [row[1] for row in conn.execute(text("PRAGMA table_info(users)")).fetchall()]
            if "full_name" not in user_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN full_name TEXT"))
            if "created_at" not in user_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN created_at DATE"))
            conn.commit()
        except Exception:
            pass

        # Check crops table
        try:
            crop_cols = [row[1] for row in conn.execute(text("PRAGMA table_info(crops)")).fetchall()]
            new_crop_cols = [
                ("acres_allocated", "REAL DEFAULT 1.0"),
                ("sowing_date", "DATE"),
                ("expected_harvest_date", "DATE"),
                ("district_id", "TEXT"),
                ("soil_n", "REAL"),
                ("soil_p", "REAL"),
                ("soil_k", "REAL"),
                ("soil_ph", "REAL"),
                ("water_source", "TEXT"),
                ("location_name", "TEXT"),
                ("latitude", "REAL"),
                ("longitude", "REAL")
            ]
            for col_name, col_def in new_crop_cols:
                if col_name not in crop_cols:
                    conn.execute(text(f"ALTER TABLE crops ADD COLUMN {col_name} {col_def}"))
            conn.commit()
        except Exception:
            pass

