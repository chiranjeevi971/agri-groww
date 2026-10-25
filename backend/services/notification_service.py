import urllib.parse
from services.profit_engine import format_inr

def create_whatsapp_daily_brief(farm_data: dict) -> dict:
    crop = farm_data.get("crop", "Cotton")
    acres = farm_data.get("acres", 5)
    district = farm_data.get("district", "Guntur")
    weather = farm_data.get("weather", {})
    economics = farm_data.get("economics", {})

    temp = weather.get("current", {}).get("temperature", 28)
    condition = weather.get("current", {}).get("condition", "Partly cloudy")
    icon = weather.get("current", {}).get("icon", "⛅")
    rain_3d = weather.get("forecast_3d_rain_mm", 0)
    irrigation_action = weather.get("irrigation_advisory", {}).get("action", "Normal Schedule")
    irrigation_detail = weather.get("irrigation_advisory", {}).get("detail", "Follow standard watering interval.")

    mandi_price = economics.get("mandi_modal_price_formatted", "₹7,450 / quintal")
    msp_price = economics.get("msp_details", {}).get("msp_formatted", "₹7,121 / quintal")
    trend = economics.get("price_trend", "Rising ↗️")

    text = (
        f"🌾 *AGRIGROW DAILY FIELD ADVISORY*\n"
        f"📍 *Farm:* {district} | {acres} Acres of {crop}\n"
        f"────────────────────\n"
        f"{icon} *Live Weather:* {temp}°C, {condition}\n"
        f"🌧️ *3-Day Rain Forecast:* {rain_3d} mm\n"
        f"💧 *Irrigation Advisory:* *{irrigation_action}*\n"
        f"👉 _{irrigation_detail}_\n"
        f"────────────────────\n"
        f"💰 *Mandi Modal Rate:* {mandi_price} ({trend})\n"
        f"🏛️ *Govt MSP Floor:* {msp_price}\n"
        f"────────────────────\n"
        f"📲 _Automated via AgriGrow AI - Digital Agronomist_"
    )

    encoded = urllib.parse.quote(text)
    wa_url = f"https://wa.me/?text={encoded}"

    return {
        "channel": "WhatsApp",
        "message_text": text,
        "share_url": wa_url,
        "recipient_type": "Universal Direct Link"
    }

def create_whatsapp_loan_alert(loan_data: dict) -> dict:
    crop = loan_data.get("crop", "Cotton")
    acres = loan_data.get("acres", 5)
    limit = loan_data.get("calculated_credit_limit_formatted", "₹1,80,000")
    kcc_interest = loan_data.get("interest_showdown", {}).get("govt_kcc_interest_formatted", "₹7,200")
    savings = loan_data.get("interest_showdown", {}).get("net_annual_savings_formatted", "₹46,800")
    collateral = loan_data.get("collateral_requirement", "Collateral-Free")

    text = (
        f"🏛️ *GOVT KCC LOAN ELIGIBILITY ALERT*\n"
        f"🌾 *Farm Entitlement:* {acres} Acres of {crop}\n"
        f"────────────────────\n"
        f"💳 *Pre-Approved KCC Credit Limit:* *{limit}*\n"
        f"📉 *Subsidized Interest Rate:* *4.0% per annum*\n"
        f"🛡️ *Collateral Status:* _{collateral}_\n"
        f"────────────────────\n"
        f"⚠️ *Moneylender Trap vs Govt KCC:*\n"
        f"• Govt KCC Interest: {kcc_interest} / year\n"
        f"• Private Moneylender (30%): Higher by 7.5x!\n"
        f"🎉 *Total Money Saved in Your Pocket:* *{savings}*\n"
        f"────────────────────\n"
        f"📋 _Apply at nearest SBI / Cooperative Bank / PACS_\n"
        f"📲 _Powered by AgriGrow AI FinTech Engine_"
    )

    encoded = urllib.parse.quote(text)
    wa_url = f"https://wa.me/?text={encoded}"

    return {
        "channel": "WhatsApp",
        "message_text": text,
        "share_url": wa_url,
        "recipient_type": "Universal Direct Link"
    }
