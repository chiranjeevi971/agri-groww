import math
from data.mandi_market_data import get_market_profile

def format_inr(val: float) -> str:
    """Format numeric float to Indian Rupee string (e.g., 42775 -> ₹42,775)"""
    val = round(val)
    s = str(abs(val))
    if len(s) <= 3:
        res = s
    else:
        last3 = s[-3:]
        remaining = s[:-3]
        groups = []
        while len(remaining) > 2:
            groups.insert(0, remaining[-2:])
            remaining = remaining[:-2]
        if remaining:
            groups.insert(0, remaining)
        res = ",".join(groups) + "," + last3
    return f"{'-' if val < 0 else ''}₹{res}"

def calculate_crop_economics(crop_name: str, acres: float = 1.0, ml_confidence: float = 80.0):
    m = get_market_profile(crop_name)

    yield_per_acre = m["avg_yield_quintals_per_acre"]
    price_per_q = m["current_mandi_modal_price"]
    input_cost_per_acre = m["estimated_input_cost_per_acre"]

    gross_rev_per_acre = yield_per_acre * price_per_q
    net_profit_per_acre = gross_rev_per_acre - input_cost_per_acre

    total_investment = input_cost_per_acre * acres
    total_gross = gross_rev_per_acre * acres
    total_net = net_profit_per_acre * acres

    roi_pct = round((net_profit_per_acre / input_cost_per_acre) * 100.0, 1) if input_cost_per_acre > 0 else 0.0

    msp = m["msp_per_quintal"]
    msp_info = None
    if msp:
        guaranteed_min_rev = yield_per_acre * msp
        diff = price_per_q - msp
        msp_info = {
            "msp_price": msp,
            "msp_formatted": format_inr(msp),
            "trading_above_msp": diff >= 0,
            "margin_over_msp": format_inr(diff) if diff > 0 else f"-{format_inr(abs(diff))}",
            "guaranteed_floor_revenue_per_acre": format_inr(guaranteed_min_rev),
            "safety_verdict": "MSP Safety Net Active - Downside Protected by Govt"
        }
    else:
        msp_info = {
            "msp_price": None,
            "msp_formatted": "Open Market Dependent",
            "trading_above_msp": True,
            "margin_over_msp": "N/A",
            "guaranteed_floor_revenue_per_acre": "Market Variable",
            "safety_verdict": "High Market Upside, No Floor Price"
        }

    return {
        "crop": m["crop"],
        "ml_suitability_confidence": ml_confidence,
        "mandi_modal_price_per_q": price_per_q,
        "mandi_modal_price_formatted": f"{format_inr(price_per_q)} / quintal",
        "avg_yield_quintals_per_acre": yield_per_acre,
        "harvest_duration_days": m["harvest_duration_days"],
        "price_trend": m["price_trend"],
        "market_risk": m["market_risk"],
        "major_mandis": m["major_mandis"],
        "buyer_demand": m["buyer_demand"],
        "msp_details": msp_info,
        "financials_per_acre": {
            "gross_revenue": round(gross_rev_per_acre, 1),
            "gross_revenue_formatted": format_inr(gross_rev_per_acre),
            "input_cost": round(input_cost_per_acre, 1),
            "input_cost_formatted": format_inr(input_cost_per_acre),
            "net_profit": round(net_profit_per_acre, 1),
            "net_profit_formatted": format_inr(net_profit_per_acre),
            "roi_percentage": roi_pct
        },
        "total_farm_financials": {
            "acres": acres,
            "total_investment": round(total_investment, 1),
            "total_investment_formatted": format_inr(total_investment),
            "total_gross_revenue": round(total_gross, 1),
            "total_gross_revenue_formatted": format_inr(total_gross),
            "total_net_profit": round(total_net, 1),
            "total_net_profit_formatted": format_inr(total_net)
        }
    }
