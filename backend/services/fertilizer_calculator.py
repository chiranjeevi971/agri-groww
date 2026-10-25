import math
from ml.predictor import SOIL_PRESETS

# Standard ICAR Recommended Fertilizer Doses per acre (kg/acre)
CROP_NPK_REQUIREMENTS_PER_ACRE = {
    "Cotton": {"N": 48.0, "P": 24.0, "K": 24.0},
    "Rice": {"N": 42.0, "P": 20.0, "K": 20.0},
    "Maize": {"N": 48.0, "P": 24.0, "K": 16.0},
    "Pigeonpeas": {"N": 10.0, "P": 20.0, "K": 10.0},
    "Chickpea": {"N": 10.0, "P": 20.0, "K": 10.0},
    "Mungbean": {"N": 8.0, "P": 16.0, "K": 8.0},
    "Blackgram": {"N": 8.0, "P": 16.0, "K": 8.0},
    "Watermelon": {"N": 40.0, "P": 25.0, "K": 30.0},
    "Banana": {"N": 80.0, "P": 30.0, "K": 95.0},
    "Coffee": {"N": 35.0, "P": 25.0, "K": 35.0},
    "Jute": {"N": 32.0, "P": 16.0, "K": 16.0},
    "default": {"N": 35.0, "P": 18.0, "K": 18.0}
}

def calculate_fertilizer_bags(
    crop_name: str,
    acres: float = 1.0,
    soil_type: str = "black",
    custom_npk: dict = None,
    farming_method: str = "conventional"
):
    crop_key = crop_name.capitalize()
    rec = CROP_NPK_REQUIREMENTS_PER_ACRE.get(crop_key, CROP_NPK_REQUIREMENTS_PER_ACRE["default"])

    # Soil Health Card baseline credit
    soil_info = SOIL_PRESETS.get(soil_type.lower(), SOIL_PRESETS["black"])
    soil_n = custom_npk.get("N", soil_info["N"]) if custom_npk else soil_info["N"]
    soil_p = custom_npk.get("P", soil_info["P"]) if custom_npk else soil_info["P"]
    soil_k = custom_npk.get("K", soil_info["K"]) if custom_npk else soil_info["K"]

    # Soil adjustment factor (High baseline reduces required chemical dose by up to 25%)
    n_adj = 0.85 if soil_n > 90 else (1.15 if soil_n < 50 else 1.0)
    p_adj = 0.85 if soil_p > 50 else (1.15 if soil_p < 25 else 1.0)
    k_adj = 0.85 if soil_k > 35 else (1.15 if soil_k < 15 else 1.0)

    net_n_per_acre = rec["N"] * n_adj
    net_p_per_acre = rec["P"] * p_adj
    net_k_per_acre = rec["K"] * k_adj

    total_n_farm = net_n_per_acre * acres
    total_p_farm = net_p_per_acre * acres
    total_k_farm = net_k_per_acre * acres

    is_organic = farming_method.lower() == "organic"

    if is_organic:
        vermicompost_tons = round(acres * 1.5, 1)
        neem_cake_bags_50kg = max(1, math.ceil((acres * 100.0) / 50.0))
        rock_phosphate_bags_50kg = max(1, math.ceil((acres * 50.0) / 50.0))
        biofertilizer_packets = math.ceil(acres * 2)

        return {
            "farming_method": "100% Organic Bio-Fertilization",
            "crop": crop_key,
            "acres": acres,
            "soil_type": soil_type,
            "commercial_bags": [
                {
                    "item": "Well-Decomposed Vermicompost",
                    "quantity": f"{vermicompost_tons} Tons",
                    "specs": "Rich in beneficial humic acid & microbes",
                    "timing": "Basal application during final land preparation",
                    "cost_estimate": f"₹{int(vermicompost_tons * 3500)}"
                },
                {
                    "item": "Neem Cake Organic Fertilizer",
                    "quantity": f"{neem_cake_bags_50kg} Bags (50 kg)",
                    "specs": "Natural nitrification inhibitor & nematode repeller",
                    "timing": "Mix with soil 7 days before sowing",
                    "cost_estimate": f"₹{neem_cake_bags_50kg * 1200}"
                },
                {
                    "item": "Rock Phosphate / Bone Meal",
                    "quantity": f"{rock_phosphate_bags_50kg} Bags (50 kg)",
                    "specs": "Natural organic source of slow-release phosphorus",
                    "timing": "Basal dose at sowing time",
                    "cost_estimate": f"₹{rock_phosphate_bags_50kg * 850}"
                },
                {
                    "item": "Azospirillum & PSB Biofertilizer",
                    "quantity": f"{biofertilizer_packets} Packets (200g)",
                    "specs": "Fixes atmospheric N and solubilizes native soil phosphorus",
                    "timing": "Seed inoculation before sowing",
                    "cost_estimate": f"₹{biofertilizer_packets * 60}"
                }
            ],
            "estimated_total_cost": f"₹{int(vermicompost_tons * 3500 + neem_cake_bags_50kg * 1200 + rock_phosphate_bags_50kg * 850 + biofertilizer_packets * 60)}",
            "application_protocol": "Split into 2 applications: 60% as basal application, 40% as Jeevamrutha foliar spray at 30 and 60 days."
        }
    else:
        # 1 Bag DAP (50kg, 18-46-0) = 9kg N + 23kg P
        dap_bags = max(1, math.ceil(total_p_farm / 23.0))
        n_supplied_by_dap = dap_bags * 9.0

        # Remaining N from Neem-Coated Urea (45kg bag standard in India, 46-0-0) = 20.7kg N
        rem_n = max(0.0, total_n_farm - n_supplied_by_dap)
        urea_bags = max(1, math.ceil(rem_n / 20.7))

        # 1 Bag MOP (Muriate of Potash, 50kg, 0-0-60) = 30kg K
        mop_bags = max(1, math.ceil(total_k_farm / 30.0))

        cost_urea = urea_bags * 266  # Subsidized govt price ₹266.50 per 45kg bag
        cost_dap = dap_bags * 1350    # Subsidized govt price ₹1,350 per 50kg bag
        cost_mop = mop_bags * 1700    # Subsidized price ₹1,700 per 50kg bag
        total_cost = cost_urea + cost_dap + cost_mop

        return {
            "farming_method": "Conventional Balanced Fertilization (Govt Subsidized Bags)",
            "crop": crop_key,
            "acres": acres,
            "soil_type": soil_type,
            "commercial_bags": {
                "urea_45kg_bags": urea_bags,
                "dap_50kg_bags": dap_bags,
                "mop_50kg_bags": mop_bags
            },
            "commercial_bags_list": [
                {
                    "item": "Neem-Coated Urea (45 kg bag)",
                    "quantity": f"{urea_bags} Bags",
                    "specs": "46% Nitrogen (Slow Release)",
                    "timing": "Split into 3 doses: 25% at 20 days, 50% at 45 days, 25% at 75 days",
                    "govt_subsidized_price": f"₹{cost_urea} (₹266.50/bag)"
                },
                {
                    "item": "Di-Ammonium Phosphate - DAP (50 kg bag)",
                    "quantity": f"{dap_bags} Bags",
                    "specs": "18% N + 46% P₂O₅ (Root Establishment)",
                    "timing": "100% as Basal application at the time of sowing",
                    "govt_subsidized_price": f"₹{cost_dap} (₹1,350/bag)"
                },
                {
                    "item": "Muriate of Potash - MOP (50 kg bag)",
                    "quantity": f"{mop_bags} Bags",
                    "specs": "60% K₂O (Disease Resistance & Grain Weight)",
                    "timing": "50% Basal + 50% at flowering/boll stage",
                    "govt_subsidized_price": f"₹{cost_mop} (₹1,700/bag)"
                }
            ],
            "organic_alternative": {
                "vermicompost_50kg_bags": max(5, int(acres * 5)),
                "neem_cake_50kg_bags": max(2, int(acres * 2))
            },
            "subsidized_input_cost_inr": total_cost,
            "estimated_total_cost": f"₹{total_cost}",
            "application_schedule": [
                {"stage": "Basal Dose (Sowing)", "desc": f"100% DAP ({dap_bags} bags) + 100% MOP ({mop_bags} bags)"},
                {"stage": "Top-Dressing 1 (30 Days)", "desc": f"50% Urea ({math.ceil(urea_bags / 2)} bags) under moist soil"},
                {"stage": "Top-Dressing 2 (60 Days)", "desc": f"Remaining 50% Urea ({math.floor(urea_bags / 2)} bags) before flowering"}
            ],
            "application_protocol": "Never apply Urea when heavy rain is forecasted. Always place DAP 5cm to the side and 5cm below the seed line."
        }
