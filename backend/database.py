import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

# Read DATABASE_URL from environment variable (Render PostgreSQL sets this automatically)
DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    # Render and Heroku use postgres:// which SQLAlchemy 2.0 requires as postgresql://
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
else:
    # Default fallback to local SQLite
    DATABASE_URL = "sqlite:///./agrigrow.db"
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
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
    """Safely adds newly defined columns to existing tables if not present (supports SQLite & PostgreSQL)."""
    with engine.connect() as conn:
        dialect = engine.dialect.name
        
        # User columns
        user_new_cols = [
            ("full_name", "VARCHAR(255)"),
            ("created_at", "DATE")
        ]

        # Crop columns
        crop_new_cols = [
            ("acres_allocated", "FLOAT DEFAULT 1.0"),
            ("sowing_date", "DATE"),
            ("expected_harvest_date", "DATE"),
            ("district_id", "VARCHAR(100)"),
            ("soil_n", "FLOAT"),
            ("soil_p", "FLOAT"),
            ("soil_k", "FLOAT"),
            ("soil_ph", "FLOAT"),
            ("water_source", "VARCHAR(100)"),
            ("location_name", "VARCHAR(255)"),
            ("latitude", "FLOAT"),
            ("longitude", "FLOAT")
        ]

        if dialect == "sqlite":
            try:
                user_cols = [row[1] for row in conn.execute(text("PRAGMA table_info(users)")).fetchall()]
                for col_name, col_def in user_new_cols:
                    if col_name not in user_cols:
                        conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_def}"))
                conn.commit()
            except Exception:
                pass

            try:
                crop_cols = [row[1] for row in conn.execute(text("PRAGMA table_info(crops)")).fetchall()]
                for col_name, col_def in crop_new_cols:
                    if col_name not in crop_cols:
                        conn.execute(text(f"ALTER TABLE crops ADD COLUMN {col_name} {col_def}"))
                conn.commit()
            except Exception:
                pass

        elif dialect == "postgresql":
            try:
                for col_name, col_def in user_new_cols:
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN IF NOT EXISTS {col_name} {col_def}"))
                for col_name, col_def in crop_new_cols:
                    conn.execute(text(f"ALTER TABLE crops ADD COLUMN IF NOT EXISTS {col_name} {col_def}"))
                conn.commit()
            except Exception:
                pass


