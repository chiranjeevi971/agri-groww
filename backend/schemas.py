from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class UserBase(BaseModel):
    phone_number: str
    full_name: Optional[str] = None
    language: str = "en"
    village: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    phone_number: str
    password: str

class User(UserBase):
    id: int
    created_at: Optional[date] = None
    
    class Config:
        from_attributes = True

class FarmBase(BaseModel):
    size_acres: float
    soil_type: str
    water_source: str
    gps_lat: Optional[float] = None
    gps_long: Optional[float] = None

class FarmCreate(FarmBase):
    pass

class Farm(FarmBase):
    id: int
    owner_id: int
    
    class Config:
        from_attributes = True

class CropBase(BaseModel):
    name: str
    farming_method: str = "conventional"
    plant_date: Optional[date] = None
    status: str = "active"
    acres_allocated: Optional[float] = 1.0
    sowing_date: Optional[date] = None
    expected_harvest_date: Optional[date] = None
    district_id: Optional[str] = None
    soil_n: Optional[float] = None
    soil_p: Optional[float] = None
    soil_k: Optional[float] = None
    soil_ph: Optional[float] = None
    water_source: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class CropCreate(CropBase):
    pass

class Crop(CropBase):
    id: int
    farm_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class DiseaseRecordCreate(BaseModel):
    crop_id: Optional[int] = None
    crop_name: str
    disease_name: str
    confidence: float
    detected_date: Optional[date] = None
    symptoms: str
    treatment: str
    image_url: Optional[str] = None

class DiseaseRecord(DiseaseRecordCreate):
    id: int

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    task_type: str
    description: str
    scheduled_date: date
    is_completed: bool = False

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    crop_id: int
    
    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    item_name: str
    amount: float
    date_incurred: date

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int
    crop_id: int

    class Config:
        from_attributes = True

class RevenueBase(BaseModel):
    source: str
    amount: float
    date_received: date

class RevenueCreate(RevenueBase):
    pass

class Revenue(RevenueBase):
    id: int
    crop_id: int

    class Config:
        from_attributes = True

class CropRecommendationRequest(BaseModel):
    soil_type: Optional[str] = "black"
    region: Optional[str] = "maharashtra"
    district_id: Optional[str] = None
    acres: Optional[float] = 1.0
    sort_by: Optional[str] = "confidence" # "confidence" or "profit"
    lat: Optional[float] = None
    lon: Optional[float] = None
    n: Optional[float] = None
    p: Optional[float] = None
    k: Optional[float] = None
    ph: Optional[float] = None
    top_k: int = 4

class AIAdvisoryRequest(BaseModel):
    crop_name: str
    farming_method: Optional[str] = "organic"
    soil_type: Optional[str] = "black"
    region: Optional[str] = "Andhra Pradesh"
    acres: Optional[float] = 5.0
    district_id: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    language: Optional[str] = "en"

class ChatbotRequest(BaseModel):
    message: str
    language: Optional[str] = "en"
    farm_context: Optional[dict] = None

class LoanCalculationRequest(BaseModel):
    crop: Optional[str] = None
    crop_name: Optional[str] = "Cotton"
    acres: float = 1.0
    existing_private_loan: Optional[float] = 150000.0
    moneylender_rate_apr: Optional[float] = 30.0

class FertilizerCalculationRequest(BaseModel):
    crop: Optional[str] = None
    crop_name: Optional[str] = "Cotton"
    acres: float = 1.0
    soil_type: str = "black"
    soil_n: Optional[float] = None
    soil_p: Optional[float] = None
    soil_k: Optional[float] = None
    farming_method: str = "conventional"
    custom_npk: Optional[dict] = None

class NotificationPayloadRequest(BaseModel):
    type: Optional[str] = None
    notification_type: Optional[str] = "daily_brief" # "daily_brief" or "loan_alert" or "kcc_loan"
    phone_number: Optional[str] = "+91 98765 43210"
    data: Optional[dict] = None
    farm_data: Optional[dict] = None
    loan_data: Optional[dict] = None





