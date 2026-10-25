import os
import joblib
import numpy as np
import pandas as pd

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(CURRENT_DIR, "crop_model.joblib")

# Standard Agro-Ecological Nutrient & Climate Presets for Indian Soil Types
# Based on ICAR & National Bureau of Soil Survey (NBSS & LUP)
SOIL_PRESETS = {
    "black": {
        "N": 105, "P": 45, "K": 22,
        "ph": 7.5,
        "typical_crops": ["cotton", "pigeonpeas", "chickpea", "maize"],
        "description": "Rich in clay, retains moisture, high calcium/potassium. Ideal for deep-root and pulse crops."
    },
    "alluvial": {
        "N": 80, "P": 48, "K": 38,
        "ph": 6.8,
        "typical_crops": ["rice", "maize", "jute", "wheat"],
        "description": "Fertile riverine soil, balanced organic matter, excellent for cereals and water-intensive crops."
    },
    "red": {
        "N": 40, "P": 65, "K": 20,
        "ph": 6.2,
        "typical_crops": ["pigeonpeas", "mothbeans", "mungbean", "mango"],
        "description": "Porous and aerated, rich in iron, moderate water retention. Excellent for pulses, oilseeds and millets."
    },
    "laterite": {
        "N": 25, "P": 20, "K": 30,
        "ph": 5.4,
        "typical_crops": ["coconut", "coffee", "banana", "papaya"],
        "description": "Acidic and well-drained, rich in organic matter in tropical zones. Ideal for plantation & fruit crops."
    },
    "sandy": {
        "N": 95, "P": 18, "K": 48,
        "ph": 6.4,
        "typical_crops": ["watermelon", "muskmelon", "mothbeans"],
        "description": "High drainage, warms up fast, lower nutrient retention. Optimal for cucurbits and drought-tolerant crops."
    }
}

# Regional Indian Climate Presets (Temperature °C, Humidity %, Rainfall mm)
REGION_CLIMATE_PRESETS = {
    "andhra_pradesh": {"temperature": 28.5, "humidity": 72.0, "rainfall": 110.0},
    "telangana": {"temperature": 29.0, "humidity": 65.0, "rainfall": 95.0},
    "maharashtra": {"temperature": 26.5, "humidity": 75.0, "rainfall": 105.0},
    "punjab_haryana": {"temperature": 22.0, "humidity": 60.0, "rainfall": 80.0},
    "karnataka": {"temperature": 25.0, "humidity": 70.0, "rainfall": 120.0},
    "tamil_nadu": {"temperature": 30.0, "humidity": 78.0, "rainfall": 115.0},
    "uttar_pradesh": {"temperature": 24.0, "humidity": 68.0, "rainfall": 95.0},
    "west_bengal": {"temperature": 27.0, "humidity": 82.0, "rainfall": 180.0},
    "general_india": {"temperature": 26.0, "humidity": 70.0, "rainfall": 100.0}
}

class CropPredictor:
    def __init__(self):
        self.package = None
        self.model = None
        self.classes = None
        self._load_model()

    def _load_model(self):
        if not os.path.exists(MODEL_PATH):
            from ml.train_model import train_crop_model
            train_crop_model()
        self.package = joblib.load(MODEL_PATH)
        self.model = self.package["model"]
        self.classes = self.package["classes"]

    def predict(self, n: float, p: float, k: float, temp: float, humidity: float, ph: float, rainfall: float, top_k: int = 3):
        input_data = pd.DataFrame([{
            "N": n, "P": p, "K": k,
            "temperature": temp,
            "humidity": humidity,
            "ph": ph,
            "rainfall": rainfall
        }])

        probabilities = self.model.predict_proba(input_data)[0]
        top_indices = np.argsort(probabilities)[::-1][:top_k]

        results = []
        for idx in top_indices:
            crop_name = self.classes[idx]
            confidence = float(probabilities[idx]) * 100.0
            results.append({
                "crop": crop_name.capitalize(),
                "confidence": round(confidence, 1),
                "soil_match": "High" if confidence > 70 else ("Moderate" if confidence > 40 else "Experimental"),
                "input_nutrients": {"N": n, "P": p, "K": k, "ph": ph},
                "climate": {"temp": temp, "humidity": humidity, "rainfall": rainfall}
            })
        return results

    def predict_from_soil_and_region(self, soil_type: str, region: str = "general_india", custom_npk: dict = None, top_k: int = 3):
        soil_key = soil_type.lower().strip()
        region_key = region.lower().strip().replace(" ", "_")

        soil_info = SOIL_PRESETS.get(soil_key, SOIL_PRESETS["black"])
        climate_info = REGION_CLIMATE_PRESETS.get(region_key, REGION_CLIMATE_PRESETS["general_india"])

        n = custom_npk.get("N", soil_info["N"]) if custom_npk else soil_info["N"]
        p = custom_npk.get("P", soil_info["P"]) if custom_npk else soil_info["P"]
        k = custom_npk.get("K", soil_info["K"]) if custom_npk else soil_info["K"]
        ph = custom_npk.get("ph", soil_info["ph"]) if custom_npk else soil_info["ph"]

        temp = climate_info["temperature"]
        hum = climate_info["humidity"]
        rain = climate_info["rainfall"]

        predictions = self.predict(n, p, k, temp, hum, ph, rain, top_k=top_k)
        return {
            "soil_type": soil_type,
            "region": region,
            "soil_description": soil_info["description"],
            "model_accuracy": self.package.get("accuracy", 0.99),
            "recommendations": predictions
        }

# Global predictor singleton
predictor = CropPredictor()
