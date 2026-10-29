from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True)
    hashed_password = Column(String) # Phase 7: JWT Auth
    full_name = Column(String, nullable=True)
    language = Column(String, default="en")
    village = Column(String, nullable=True)
    created_at = Column(Date, nullable=True)

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
    status = Column(String, default="active") # active, harvested, planned
    farm_id = Column(Integer, ForeignKey("farms.id"))

    # Enhanced crop cycle management fields
    acres_allocated = Column(Float, default=1.0)
    sowing_date = Column(Date, nullable=True)
    expected_harvest_date = Column(Date, nullable=True)
    district_id = Column(String, nullable=True)
    soil_n = Column(Float, nullable=True)
    soil_p = Column(Float, nullable=True)
    soil_k = Column(Float, nullable=True)
    soil_ph = Column(Float, nullable=True)
    water_source = Column(String, nullable=True)
    location_name = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    farm = relationship("Farm", back_populates="crops")
    tasks = relationship("Task", back_populates="crop")
    expenses = relationship("Expense", back_populates="crop")
    revenues = relationship("Revenue", back_populates="crop")
    diseases = relationship("DiseaseRecord", back_populates="crop")

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

class DiseaseRecord(Base):
    __tablename__ = "disease_records"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"), nullable=True)
    crop_name = Column(String)
    disease_name = Column(String)
    confidence = Column(Float)
    detected_date = Column(Date)
    symptoms = Column(String)
    treatment = Column(String)
    image_url = Column(String, nullable=True)

    crop = relationship("Crop", back_populates="diseases")

class SoilReport(Base):
    __tablename__ = "soil_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    report_title = Column(String) # e.g. "Govt SHC Lab Test #421"
    lab_name = Column(String, nullable=True)
    sample_date = Column(Date, nullable=True)
    soil_type = Column(String, default="black")
    
    # Primary Macronutrients
    n = Column(Float) # Nitrogen kg/ha
    p = Column(Float) # Phosphorus kg/ha
    k = Column(Float) # Potassium kg/ha
    ph = Column(Float) # pH
    
    # Secondary & Micronutrients (Official Soil Health Card format)
    organic_carbon = Column(Float, nullable=True) # OC % (e.g. 0.65)
    electrical_conductivity = Column(Float, nullable=True) # EC dS/m (e.g. 0.42)
    zinc = Column(Float, nullable=True) # Zn ppm
    iron = Column(Float, nullable=True) # Fe ppm
    boron = Column(Float, nullable=True) # B ppm
    sulphur = Column(Float, nullable=True) # S ppm
    
    fertility_score = Column(Float, default=80.0) # 0-100 score
    notes = Column(String, nullable=True)
    created_at = Column(Date, nullable=True)


