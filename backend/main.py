from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import os
import models, schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AgriGrow AI API")

# ─── CORS Middleware ───────────────────────────────────────────────────────────
# CORS (Cross-Origin Resource Sharing) is a browser security rule.
# When your frontend (on Vercel) makes API calls to your backend (on Render),
# the browser blocks it by default because they are on different domain names.
# This middleware tells the browser: "Yes, it's safe — allow these domains."
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",           # Local Vite dev server
        "http://localhost:3000",           # Alternative local port
        os.getenv("FRONTEND_URL", "*"),    # Production Vercel URL (set in Render dashboard)
    ],
    allow_credentials=True,
    allow_methods=["*"],   # Allow GET, POST, PUT, DELETE etc.
    allow_headers=["*"],   # Allow all request headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to AgriGrow AI API", "status": "live", "version": "1.0.0"}

import auth

@app.post("/users/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.phone_number == user.phone_number).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        phone_number=user.phone_number, 
        hashed_password=hashed_password,
        language=user.language, 
        village=user.village
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/users/login")
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.phone_number == user.phone_number).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect phone number or password")
    
    access_token = auth.create_access_token(data={"sub": db_user.phone_number})
    return {"access_token": access_token, "token_type": "bearer", "user_id": db_user.id}

@app.post("/crops/", response_model=schemas.Crop)
def create_crop(crop: schemas.CropCreate, farm_id: int, db: Session = Depends(get_db)):
    import logic
    db_crop = models.Crop(**crop.model_dump(), farm_id=farm_id)
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    # Generate schedule upon crop creation
    logic.generate_schedule(db, db_crop)
    return db_crop

@app.get("/crops/{crop_id}/tasks/", response_model=list[schemas.Task])
def get_tasks_for_crop(crop_id: int, db: Session = Depends(get_db)):
    tasks = db.query(models.Task).filter(models.Task.crop_id == crop_id).order_by(models.Task.scheduled_date).all()
    return tasks

@app.post("/crops/{crop_id}/expenses/", response_model=schemas.Expense)
def add_expense(crop_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = models.Expense(**expense.model_dump(), crop_id=crop_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.post("/crops/{crop_id}/revenues/", response_model=schemas.Revenue)
def add_revenue(crop_id: int, revenue: schemas.RevenueCreate, db: Session = Depends(get_db)):
    db_revenue = models.Revenue(**revenue.model_dump(), crop_id=crop_id)
    db.add(db_revenue)
    db.commit()
    db.refresh(db_revenue)
    return db_revenue

from ml.predictor import predictor, SOIL_PRESETS, REGION_CLIMATE_PRESETS
from services.weather_service import get_live_weather
from data.district_soil_data import get_all_districts, get_district_by_id, find_nearest_district
from data.mandi_market_data import get_all_mandi_rates, get_market_profile
from services.profit_engine import calculate_crop_economics
from services.ai_advisory import generate_grounded_advisory, answer_grounded_chat
from data.govt_loans_data import GOVT_LOAN_SCHEMES, LIVE_GOVT_NEWS_TICKER, SCALE_OF_FINANCE_PER_ACRE
from services.credit_engine import calculate_kcc_loan_eligibility
from services.fertilizer_calculator import calculate_fertilizer_bags
from services.notification_service import create_whatsapp_daily_brief, create_whatsapp_loan_alert

@app.get("/weather/live")
def get_weather(lat: float = 21.1458, lon: float = 79.0882):
    """Returns live weather conditions & smart irrigation advisory via Open-Meteo"""
    return get_live_weather(lat, lon)

@app.get("/districts/")
def list_districts():
    """Returns curated list of Indian agricultural districts with Soil Health Card profiles"""
    return {"status": "success", "districts": get_all_districts()}

@app.get("/districts/{district_id}")
def get_district_profile(district_id: str):
    profile = get_district_by_id(district_id)
    if not profile:
        raise HTTPException(status_code=404, detail="District profile not found")
    return {"status": "success", "district": profile}

@app.get("/market/mandi-rates")
def list_mandi_rates():
    """Returns live Indian commodity wholesale rates, official MSP 2024-25, and CACP costs"""
    return {"status": "success", "commodities": get_all_mandi_rates()}

@app.post("/recommend-crops/")
def recommend_crops(
    payload: Optional[schemas.CropRecommendationRequest] = None,
    soil_type: Optional[str] = None,
    region: Optional[str] = None,
    db: Session = Depends(get_db)
):
    district_data = None
    lat = payload.lat if payload else None
    lon = payload.lon if payload else None
    acres = float(payload.acres) if payload and payload.acres else 1.0
    sort_by = (payload.sort_by if payload and payload.sort_by else "confidence").lower()

    # 1. District lookup if provided
    if payload and payload.district_id:
        district_data = get_district_by_id(payload.district_id)
        if district_data:
            lat = lat or district_data["lat"]
            lon = lon or district_data["lon"]

    # 2. Coordinate fallback or nearest district
    if lat is not None and lon is not None and not district_data:
        district_data = find_nearest_district(lat, lon)

    active_soil = (
        payload.soil_type 
        if payload and payload.soil_type 
        else (district_data["predominant_soil"] if district_data else (soil_type or "black"))
    ).lower()

    active_region = (
        payload.region 
        if payload and payload.region 
        else (district_data["state"].lower().replace(" ", "_") if district_data else (region or "maharashtra"))
    ).lower()

    # 3. Soil Health Card Nutrient resolution: Custom NPK > District Baseline > Soil Type Preset
    soil_preset = SOIL_PRESETS.get(active_soil, SOIL_PRESETS["black"])
    shc_baseline = district_data["shc_baseline"] if district_data else soil_preset

    n = payload.n if payload and payload.n is not None else shc_baseline["N"]
    p = payload.p if payload and payload.p is not None else shc_baseline["P"]
    k = payload.k if payload and payload.k is not None else shc_baseline["K"]
    ph = payload.ph if payload and payload.ph is not None else shc_baseline["ph"]

    # 4. Weather resolution: Live Weather API > Regional Climate Preset
    live_weather = None
    if lat is not None and lon is not None:
        live_weather = get_live_weather(lat, lon)
        temp = live_weather["current"]["temperature"]
        hum = live_weather["current"]["humidity"]
        rain = max(40.0, float(live_weather["forecast_3d_rain_mm"] * 10.0))
        weather_source = f"Live Open-Meteo ({live_weather['current']['condition']} {live_weather['current']['icon']}, {temp}°C, {hum}% RH)"
    else:
        climate_preset = REGION_CLIMATE_PRESETS.get(active_region, REGION_CLIMATE_PRESETS["general_india"])
        temp = climate_preset["temperature"]
        hum = climate_preset["humidity"]
        rain = climate_preset["rainfall"]
        weather_source = "Regional Climatological Average"

    top_k = payload.top_k if payload and payload.top_k else 4

    # 5. Execute Scikit-Learn Random Forest Classifier
    raw_predictions = predictor.predict(n, p, k, temp, hum, ph, rain, top_k=top_k)

    crop_notes = {
        "Cotton": "Optimal vegetative growth in moisture-retentive Black clay soil. High market demand in textile hubs.",
        "Maize": "Good grain yield with moderate water requirement. High industrial demand for animal feed & ethanol.",
        "Rice": "Requires standing water and alluvial basin. High yield under canal/flood irrigation.",
        "Pigeonpeas": "Deep root system fixes atmospheric nitrogen, restoring soil fertility. High pulse market rate.",
        "Chickpea": "Rabi leguminous crop; flourishes in cool weather and clay loams with low input cost.",
        "Coffee": "Thrives in shade and slightly acidic laterite soils at higher altitudes. Strong global export market.",
        "Watermelon": "Fast 85-day cash crop, thrives in warm well-drained soils with high summer local returns.",
        "Banana": "Heavy feeder with massive biomass; generates high regular revenue under irrigated loams.",
        "Mothbeans": "Extremely drought-tolerant pulse for arid and sandy tracts.",
        "Mungbean": "Short 70-day kharif catch crop; high protein, soil restorative, and premium mandi rate.",
        "Jute": "Golden fiber crop suitable for humid alluvial delta zones with compulsory packaging demand."
    }

    enriched_recommendations = []
    for item in raw_predictions:
        c_name = item["crop"]
        econ = calculate_crop_economics(c_name, acres=acres, ml_confidence=item["confidence"])
        desc = crop_notes.get(c_name, f"Agronomically suitable for {active_soil.capitalize()} soil with {item['confidence']}% ML match.")
        enriched_recommendations.append({
            "name": c_name,
            "confidence": item["confidence"],
            "soil_match": item["soil_match"],
            "reason": f"{item['confidence']}% ML Match",
            "desc": desc,
            "nutrients": item["input_nutrients"],
            "economics": econ
        })

    # Sort based on user preference: "profit" vs "confidence"
    if sort_by == "profit":
        enriched_recommendations.sort(
            key=lambda x: x["economics"]["financials_per_acre"]["net_profit"], 
            reverse=True
        )

    return {
        "status": "success",
        "engine": "Scikit-Learn Random Forest (ICAR Benchmark Dataset)",
        "model_accuracy": round(predictor.package.get("accuracy", 0.995) * 100, 2),
        "district": district_data["name"] if district_data else None,
        "soil_type": active_soil,
        "region": active_region,
        "acres": acres,
        "sort_by": sort_by,
        "soil_description": district_data["description"] if district_data else soil_preset["description"],
        "weather_source": weather_source,
        "live_weather": live_weather,
        "recommendations": enriched_recommendations
    }




@app.post("/disease-detect/")
def detect_disease():
    import os
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if gemini_api_key:
        try:
            from google import genai
            client = genai.Client(api_key=gemini_api_key)
            # Simulated image input
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents='Analyze this crop leaf image. Identify disease, symptoms, causes, and treatments. Return JSON format only.'
            )
            # parse response (simplified)
            return {"status": "success", "raw_ai": response.text}
        except Exception as e:
            return {"error": str(e)}
            
    # Fallback mock if no API key is provided
    return {
        "disease": "Rice Blast",
        "confidence": 94,
        "symptoms": "Spindle-shaped lesions on leaves with gray centers.",
        "causes": "Fungus Magnaporthe oryzae, favored by high humidity.",
        "treatment": [
            {"name": "Tricyclazole 75% WP", "cost": "₹250 / 100g", "link": "#"},
            {"name": "Isoprothiolane 40% EC", "cost": "₹300 / 250ml", "link": "#"}
        ]
    }

@app.post("/crops/ai-advisory")
def get_crop_ai_advisory(req: schemas.AIAdvisoryRequest):
    lat = req.lat or 16.3067
    lon = req.lon or 80.4365
    weather = get_live_weather(lat, lon)
    economics = calculate_crop_economics(req.crop_name, acres=req.acres or 5.0)

    advisory = generate_grounded_advisory(
        crop_name=req.crop_name,
        farming_method=req.farming_method or "organic",
        soil_type=req.soil_type or "black",
        region=req.region or "Andhra Pradesh",
        acres=req.acres or 5.0,
        weather=weather,
        economics=economics,
        language=req.language or "en"
    )
    return {"status": "success", "advisory": advisory}

@app.post("/chatbot/ask")
def chat_with_agribot(req: schemas.ChatbotRequest):
    answer = answer_grounded_chat(
        message=req.message,
        farm_context=req.farm_context or {},
        language=req.language or "en"
    )
    return {"status": "success", "reply": answer}

@app.get("/loans/schemes")
def get_loan_schemes_and_news():
    """Returns low-interest government loan schemes and live policy circulars ticker"""
    return {
        "status": "success",
        "schemes": GOVT_LOAN_SCHEMES,
        "news_ticker": LIVE_GOVT_NEWS_TICKER,
        "ticker_news": LIVE_GOVT_NEWS_TICKER,
        "scale_of_finance_crops": SCALE_OF_FINANCE_PER_ACRE
    }

@app.post("/loans/calculate")
def calculate_loan(req: schemas.LoanCalculationRequest):
    """Calculates KCC credit limit & moneylender savings showdown"""
    crop = req.crop or req.crop_name or "Cotton"
    result = calculate_kcc_loan_eligibility(crop_name=crop, acres=req.acres)
    response = {"status": "success", "loan_details": result}
    response.update(result)
    return response

@app.post("/fertilizers/calculate")
def calculate_fertilizers(req: schemas.FertilizerCalculationRequest):
    """Computes exact commercial fertilizer bags (Urea, DAP, MOP / Organic)"""
    crop = req.crop or req.crop_name or "Cotton"
    custom_npk = req.custom_npk
    if not custom_npk and (req.soil_n or req.soil_p or req.soil_k):
        custom_npk = {}
        if req.soil_n: custom_npk["N"] = req.soil_n
        if req.soil_p: custom_npk["P"] = req.soil_p
        if req.soil_k: custom_npk["K"] = req.soil_k

    result = calculate_fertilizer_bags(
        crop_name=crop,
        acres=req.acres,
        soil_type=req.soil_type,
        custom_npk=custom_npk,
        farming_method=req.farming_method
    )
    response = {"status": "success", "fertilizer_plan": result}
    response.update(result)
    return response

@app.post("/notifications/whatsapp-payload")
def generate_whatsapp_notification(req: schemas.NotificationPayloadRequest):
    """Generates formatted WhatsApp message and universal https://wa.me/?text= link"""
    n_type = req.type or req.notification_type or "daily_brief"
    data = req.data or {}
    
    if n_type in ["loan_alert", "kcc_loan"]:
        merged_loan = dict(req.loan_data or {})
        merged_loan.update(data)
        payload = create_whatsapp_loan_alert(merged_loan)
    else:
        merged_farm = dict(req.farm_data or {})
        merged_farm.update(data)
        payload = create_whatsapp_daily_brief(merged_farm)
    
    return {
        "status": "success",
        "notification": payload,
        "whatsapp_url": payload.get("share_url"),
        "message": payload.get("message_text")
    }


