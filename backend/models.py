from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True)
    hashed_password = Column(String) # Phase 7: JWT Auth
    language = Column(String, default="en")
    village = Column(String, nullable=True)

    farms = relationship("Farm", back_populates="owner")

class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    size_acres = Column(Float)
    soil_type = Column(String)
    water_source = Column(String)
    gps_lat = Column(Float, nullable=True)
    gps_long = Column(Float, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="farms")
    crops = relationship("Crop", back_populates="farm")

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    farming_method = Column(String) # organic, conventional
    plant_date = Column(Date)
    status = Column(String, default="active")
    farm_id = Column(Integer, ForeignKey("farms.id"))

    farm = relationship("Farm", back_populates="crops")
    tasks = relationship("Task", back_populates="crop")
    expenses = relationship("Expense", back_populates="crop")
    revenues = relationship("Revenue", back_populates="crop")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    task_type = Column(String) # irrigation, fertilizer, weeding
    description = Column(String)
    scheduled_date = Column(Date)
    is_completed = Column(Boolean, default=False)
    crop_id = Column(Integer, ForeignKey("crops.id"))

    crop = relationship("Crop", back_populates="tasks")

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    item_name = Column(String)
    amount = Column(Float)
    date_incurred = Column(Date)

    crop = relationship("Crop", back_populates="expenses")

class Revenue(Base):
    __tablename__ = "revenues"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    source = Column(String)
    amount = Column(Float)
    date_received = Column(Date)

    crop = relationship("Crop", back_populates="revenues")
