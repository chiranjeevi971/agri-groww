# Agricultural Economic Benchmarks: MSP, APMC Mandi Modal Prices, Yields, and Costs
# Sources: CACP (Commission for Agricultural Costs & Prices) 2024-25, Agmarknet, ICAR

CROP_MARKET_DATA = {
    "Cotton": {
        "crop": "Cotton",
        "msp_per_quintal": 7121.0,
        "current_mandi_modal_price": 7450.0,
        "avg_yield_quintals_per_acre": 9.5,
        "estimated_input_cost_per_acre": 28000.0,
        "harvest_duration_days": 160,
        "price_trend": "Rising ↗️",
        "market_risk": "Low (Govt MSP)",
        "major_mandis": ["Guntur (AP)", "Warangal (TG)", "Rajkot (GJ)", "Nagpur (MH)"],
        "buyer_demand": "High - Domestic spinning mills & export demand active."
    },
    "Rice": {
        "crop": "Rice",
        "msp_per_quintal": 2300.0,
        "current_mandi_modal_price": 2550.0,
        "avg_yield_quintals_per_acre": 22.0,
        "estimated_input_cost_per_acre": 24000.0,
        "harvest_duration_days": 125,
        "price_trend": "Stable ➡️",
        "market_risk": "Low (FCI Procurement)",
        "major_mandis": ["Kakinada (AP)", "Karnal (HR)", "Khanna (PB)", "Burdwan (WB)"],
        "buyer_demand": "Steady - Guaranteed government procurement channels."
    },
    "Maize": {
        "crop": "Maize",
        "msp_per_quintal": 2225.0,
        "current_mandi_modal_price": 2380.0,
        "avg_yield_quintals_per_acre": 24.0,
        "estimated_input_cost_per_acre": 19500.0,
        "harvest_duration_days": 105,
        "price_trend": "Rising ↗️",
        "market_risk": "Low (High Industrial Demand)",
        "major_mandis": ["Davangere (KA)", "Nizamabad (TG)", "Chhindwara (MP)", "Gulabbagh (BR)"],
        "buyer_demand": "High - Strong ethanol blending policy & poultry feed consumption."
    },
    "Pigeonpeas": {
        "crop": "Pigeonpeas",
        "msp_per_quintal": 7550.0,
        "current_mandi_modal_price": 9200.0,
        "avg_yield_quintals_per_acre": 7.5,
        "estimated_input_cost_per_acre": 17500.0,
        "harvest_duration_days": 160,
        "price_trend": "Rising ↗️",
        "market_risk": "Low (Trading Above MSP)",
        "major_mandis": ["Kalaburagi (KA)", "Latur (MH)", "Akola (MH)", "Tandur (TG)"],
        "buyer_demand": "Very High - Domestic pulse shortfall has pushed prices well above MSP."
    },
    "Chickpea": {
        "crop": "Chickpea",
        "msp_per_quintal": 5440.0,
        "current_mandi_modal_price": 5950.0,
        "avg_yield_quintals_per_acre": 8.5,
        "estimated_input_cost_per_acre": 16000.0,
        "harvest_duration_days": 110,
        "price_trend": "Stable ➡️",
        "market_risk": "Low (Govt MSP)",
        "major_mandis": ["Bikaner (RJ)", "Indore (MP)", "Jalna (MH)", "Kurnool (AP)"],
        "buyer_demand": "Moderate - Stable festive and processing demand."
    },
    "Mungbean": {
        "crop": "Mungbean",
        "msp_per_quintal": 8558.0,
        "current_mandi_modal_price": 8800.0,
        "avg_yield_quintals_per_acre": 5.0,
        "estimated_input_cost_per_acre": 14000.0,
        "harvest_duration_days": 70,
        "price_trend": "Stable ➡️",
        "market_risk": "Moderate",
        "major_mandis": ["Sumerpur (RJ)", "Gadag (KA)", "Merta City (RJ)"],
        "buyer_demand": "High - Shortest 70-day cycle with premium market price."
    },
    "Blackgram": {
        "crop": "Blackgram",
        "msp_per_quintal": 7400.0,
        "current_mandi_modal_price": 8100.0,
        "avg_yield_quintals_per_acre": 5.5,
        "estimated_input_cost_per_acre": 15000.0,
        "harvest_duration_days": 80,
        "price_trend": "Rising ↗️",
        "market_risk": "Moderate",
        "major_mandis": ["Tenali (AP)", "Latur (MH)", "Kota (RJ)"],
        "buyer_demand": "High - Sustained South Indian culinary and mill demand."
    },
    "Watermelon": {
        "crop": "Watermelon",
        "msp_per_quintal": None,
        "current_mandi_modal_price": 1150.0,
        "avg_yield_quintals_per_acre": 110.0,
        "estimated_input_cost_per_acre": 36000.0,
        "harvest_duration_days": 85,
        "price_trend": "Volatile ⚠️",
        "market_risk": "High (Perishable)",
        "major_mandis": ["Azadpur (Delhi)", "Vashi (Mumbai)", "Koyambedu (Chennai)"],
        "buyer_demand": "Seasonal Surge - High turnover in summer months."
    },
    "Banana": {
        "crop": "Banana",
        "msp_per_quintal": None,
        "current_mandi_modal_price": 1850.0,
        "avg_yield_quintals_per_acre": 160.0,
        "estimated_input_cost_per_acre": 85000.0,
        "harvest_duration_days": 330,
        "price_trend": "Stable ➡️",
        "market_risk": "Moderate",
        "major_mandis": ["Jalgaon (MH)", "Theni (TN)", "Hajipur (BR)"],
        "buyer_demand": "Consistent - High volume round-the-year commercial crop."
    },
    "Coffee": {
        "crop": "Coffee",
        "msp_per_quintal": None,
        "current_mandi_modal_price": 22500.0,
        "avg_yield_quintals_per_acre": 4.5,
        "estimated_input_cost_per_acre": 42000.0,
        "harvest_duration_days": 270,
        "price_trend": "Rising ↗️",
        "market_risk": "Moderate (Export Linked)",
        "major_mandis": ["Chikkamagaluru (KA)", "Kushalnagar (KA)", "Wayanad (KL)"],
        "buyer_demand": "Very High - International Robusta/Arabica prices at multi-year highs."
    },
    "Jute": {
        "crop": "Jute",
        "msp_per_quintal": 5050.0,
        "current_mandi_modal_price": 5200.0,
        "avg_yield_quintals_per_acre": 14.0,
        "estimated_input_cost_per_acre": 26000.0,
        "harvest_duration_days": 130,
        "price_trend": "Stable ➡️",
        "market_risk": "Low (Jute Corp of India MSP)",
        "major_mandis": ["Kolkata (WB)", "Nagaon (AS)", "Purnea (BR)"],
        "buyer_demand": "Stable - Compulsory packaging norms by Govt of India."
    }
}

def get_market_profile(crop_name: str):
    # Case-insensitive lookup with fallback
    for name, data in CROP_MARKET_DATA.items():
        if name.lower() == crop_name.lower().strip():
            return data
    # Generic fallback for unlisted crops
    return {
        "crop": crop_name.capitalize(),
        "msp_per_quintal": None,
        "current_mandi_modal_price": 3200.0,
        "avg_yield_quintals_per_acre": 12.0,
        "estimated_input_cost_per_acre": 22000.0,
        "harvest_duration_days": 120,
        "price_trend": "Stable ➡️",
        "market_risk": "Moderate",
        "major_mandis": ["State APMC Wholesale Markets"],
        "buyer_demand": "Standard regional agricultural demand."
    }

def get_all_mandi_rates():
    return list(CROP_MARKET_DATA.values())
