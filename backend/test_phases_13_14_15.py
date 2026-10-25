import sys
import json
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_govt_loans_schemes():
    res = client.get("/loans/schemes")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert "schemes" in data and len(data["schemes"]) >= 5
    assert "ticker_news" in data and len(data["ticker_news"]) >= 5
    assert "scale_of_finance_crops" in data
    # Check KCC scheme details
    kcc = next((s for s in data["schemes"] if "kcc" in s["id"]), None)
    assert kcc is not None
    assert "4.0%" in (kcc.get("effective_interest_rate") or kcc.get("interest_rate") or "")
    return True

def test_kcc_loan_calculator():
    payload = {
        "crop": "cotton",
        "acres": 5.0,
        "existing_private_loan": 150000.0,
        "moneylender_rate_apr": 30.0
    }
    res = client.post("/loans/calculate", json=payload)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data["crop"] == "Cotton"
    assert data["approved_kcc_credit_limit"] == 180000.0 # 36,000 * 5
    assert data["interest_comparison"]["kcc_annual_interest_inr"] == 7200.0 # 180,000 * 0.04
    assert data["interest_comparison"]["moneylender_annual_interest_inr"] == 54000.0 # 180,000 * 0.30
    assert data["interest_comparison"]["annual_farmer_savings_inr"] == 46800.0
    assert data["subvention_breakdown"]["net_effective_farmer_rate_pct"] == 4.0
    return True

def test_fertilizer_bag_calculator():
    payload = {
        "crop": "Cotton",
        "acres": 5.0,
        "soil_type": "black",
        "soil_n": 110.0,
        "soil_p": 52.0,
        "soil_k": 26.0,
        "farming_method": "conventional"
    }
    res = client.post("/fertilizers/calculate", json=payload)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert "commercial_bags" in data
    assert data["commercial_bags"]["urea_45kg_bags"] >= 1
    assert data["commercial_bags"]["dap_50kg_bags"] >= 1
    assert data["commercial_bags"]["mop_50kg_bags"] >= 1
    assert "organic_alternative" in data
    assert data["organic_alternative"]["vermicompost_50kg_bags"] >= 1
    assert "subsidized_input_cost_inr" in data
    assert "application_schedule" in data and len(data["application_schedule"]) == 3
    return True

def test_whatsapp_notification_dispatch():
    # Test Daily Brief
    brief_payload = {
        "type": "daily_brief",
        "phone_number": "+91 98765 43210",
        "data": {
            "crop": "Cotton",
            "temp": 28.5,
            "condition": "Partly cloudy",
            "irrigation_status": "Normal Schedule",
            "irrigation_detail": "Soil moisture optimal",
            "fertilizer_tip": "Apply top dressing 1",
            "next_task": "Manual weeding"
        }
    }
    res1 = client.post("/notifications/whatsapp-payload", json=brief_payload)
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["status"] == "success"
    assert "https://wa.me/" in data1["whatsapp_url"]
    assert "AgriGrow" in data1["message"]

    # Test KCC Loan Alert
    loan_payload = {
        "type": "kcc_loan",
        "phone_number": "+91 98765 43210",
        "data": {
            "crop": "Cotton",
            "acres": 5.0,
            "credit_limit": 225000.0,
            "kcc_interest": 9000.0,
            "moneylender_interest": 67500.0,
            "annual_savings": 58500.0
        }
    }
    res2 = client.post("/notifications/whatsapp-payload", json=loan_payload)
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["status"] == "success"
    assert "https://wa.me/" in data2["whatsapp_url"]
    assert "KCC" in data2["message"]
    return True

if __name__ == "__main__":
    t1 = test_govt_loans_schemes()
    t2 = test_kcc_loan_calculator()
    t3 = test_fertilizer_bag_calculator()
    t4 = test_whatsapp_notification_dispatch()
    print(f"ALL TESTS PASSED: Schemes={t1}, LoanCalc={t2}, FertCalc={t3}, WhatsApp={t4}")
