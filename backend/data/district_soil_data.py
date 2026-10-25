# Curated Indian District Soil Health Card (SHC) & Agro-Ecological Knowledgebase
# Based on ICAR, NBSS&LUP, and Ministry of Agriculture Soil Health Card Portal benchmarks

DISTRICTS_DATA = {
    "guntur": {
        "id": "guntur",
        "name": "Guntur",
        "state": "Andhra Pradesh",
        "lat": 16.3067,
        "lon": 80.4365,
        "predominant_soil": "black",
        "soil_name": "Deep Black Clayey Soil (Regur)",
        "shc_baseline": {"N": 110, "P": 52, "K": 26, "ph": 7.8},
        "rainfall_avg_mm": 110.0,
        "specialty": "Chilli, Cotton, Blackgram, Paddy",
        "description": "Krishna river basin with fertile black clay soils holding high moisture. Ideal for Cotton and Spices."
    },
    "east_godavari": {
        "id": "east_godavari",
        "name": "East Godavari (Kakinada / Rajahmundry)",
        "state": "Andhra Pradesh",
        "lat": 16.9891,
        "lon": 82.2475,
        "predominant_soil": "alluvial",
        "soil_name": "Deltaic Alluvial Soil",
        "shc_baseline": {"N": 85, "P": 48, "K": 42, "ph": 6.7},
        "rainfall_avg_mm": 180.0,
        "specialty": "Paddy, Coconut, Banana, Sugarcane",
        "description": "Godavari deltaic belt with rich organic alluvium and canal networks."
    },
    "warangal": {
        "id": "warangal",
        "name": "Warangal",
        "state": "Telangana",
        "lat": 17.9689,
        "lon": 79.5941,
        "predominant_soil": "red",
        "soil_name": "Red Sandy Loam (Chalka)",
        "shc_baseline": {"N": 48, "P": 62, "K": 24, "ph": 6.5},
        "rainfall_avg_mm": 95.0,
        "specialty": "Cotton, Redgram, Maize, Chilli",
        "description": "Deccan plateau with well-drained red gravel soils, responsive to phosphorus application."
    },
    "nagpur": {
        "id": "nagpur",
        "name": "Nagpur (Vidarbha)",
        "state": "Maharashtra",
        "lat": 21.1458,
        "lon": 79.0882,
        "predominant_soil": "black",
        "soil_name": "Medium to Deep Black Cotton Soil",
        "shc_baseline": {"N": 105, "P": 46, "K": 22, "ph": 7.6},
        "rainfall_avg_mm": 115.0,
        "specialty": "Orange, Cotton, Soybean, Pigeonpeas",
        "description": "Basaltic Deccan trap soils with high cation exchange capacity. Celebrated for Cotton and Mandarin Oranges."
    },
    "nashik": {
        "id": "nashik",
        "name": "Nashik",
        "state": "Maharashtra",
        "lat": 19.9975,
        "lon": 73.7898,
        "predominant_soil": "black",
        "soil_name": "Volcanic Loamy Black Soil",
        "shc_baseline": {"N": 98, "P": 55, "K": 32, "ph": 7.3},
        "rainfall_avg_mm": 90.0,
        "specialty": "Grapes, Onion, Tomato, Pomegranate",
        "description": "Godavari headwaters with well-aerated black loams, renowned for horticulture and viticulture."
    },
    "ludhiana": {
        "id": "ludhiana",
        "name": "Ludhiana",
        "state": "Punjab",
        "lat": 30.9010,
        "lon": 75.8573,
        "predominant_soil": "alluvial",
        "soil_name": "Indo-Gangetic Alluvial Loam",
        "shc_baseline": {"N": 90, "P": 50, "K": 36, "ph": 7.1},
        "rainfall_avg_mm": 80.0,
        "specialty": "Wheat, Rice, Maize, Mustard",
        "description": "Highly productive alluvial plains with deep root horizons, supported by dense canal and tubewell networks."
    },
    "karnal": {
        "id": "karnal",
        "name": "Karnal",
        "state": "Haryana",
        "lat": 29.6857,
        "lon": 76.9905,
        "predominant_soil": "alluvial",
        "soil_name": "Light-medium Alluvial Loam",
        "shc_baseline": {"N": 82, "P": 46, "K": 38, "ph": 7.4},
        "rainfall_avg_mm": 75.0,
        "specialty": "Basmati Rice, Wheat, Sugarcane",
        "description": "Home of Central Soil Salinity Research Institute. High nutrient holding capacity."
    },
    "coimbatore": {
        "id": "coimbatore",
        "name": "Coimbatore",
        "state": "Tamil Nadu",
        "lat": 11.0168,
        "lon": 76.9558,
        "predominant_soil": "red",
        "soil_name": "Red Loamy Soil",
        "shc_baseline": {"N": 42, "P": 58, "K": 28, "ph": 6.8},
        "rainfall_avg_mm": 85.0,
        "specialty": "Cotton, Sorghum, Banana, Groundnut",
        "description": "Western Ghats shadow zone with permeable red soils, highly responsive to micro-irrigation."
    },
    "shimoga": {
        "id": "shimoga",
        "name": "Shimoga (Shivamogga)",
        "state": "Karnataka",
        "lat": 13.9299,
        "lon": 75.5681,
        "predominant_soil": "laterite",
        "soil_name": "Laterite and Red Loam",
        "shc_baseline": {"N": 30, "P": 25, "K": 35, "ph": 5.6},
        "rainfall_avg_mm": 190.0,
        "specialty": "Arecanut, Paddy, Ginger, Coffee",
        "description": "Malnad region with humid climate and acidic laterite soils. Ideal for spice and plantation agriculture."
    },
    "varanasi": {
        "id": "varanasi",
        "name": "Varanasi",
        "state": "Uttar Pradesh",
        "lat": 25.3176,
        "lon": 82.9739,
        "predominant_soil": "alluvial",
        "soil_name": "Gangetic Alluvial Clay Loam",
        "shc_baseline": {"N": 80, "P": 45, "K": 35, "ph": 7.2},
        "rainfall_avg_mm": 105.0,
        "specialty": "Paddy, Wheat, Vegetables, Pulses",
        "description": "Middle Ganges plains with high silt content and natural organic replenishment."
    }
}

def get_all_districts():
    return [
        {
            "id": d["id"],
            "name": d["name"],
            "state": d["state"],
            "predominant_soil": d["predominant_soil"],
            "specialty": d["specialty"]
        }
        for d in DISTRICTS_DATA.values()
    ]

def get_district_by_id(district_id: str):
    return DISTRICTS_DATA.get(district_id.lower().strip())

def find_nearest_district(lat: float, lon: float):
    # Euclidean approximation for quick nearest district match
    best_dist = None
    best_match = None
    for d in DISTRICTS_DATA.values():
        dist_sq = (d["lat"] - lat) ** 2 + (d["lon"] - lon) ** 2
        if best_dist is None or dist_sq < best_dist:
            best_dist = dist_sq
            best_match = d
    return best_match
