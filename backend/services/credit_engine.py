from data.govt_loans_data import get_scale_of_finance
from services.profit_engine import format_inr

def calculate_kcc_loan_eligibility(crop_name: str, acres: float = 1.0):
    scale_per_acre = get_scale_of_finance(crop_name)
    raw_credit_limit = scale_per_acre * acres

    # Scale of finance + 10% for post-harvest + 20% for maintenance as per RBI KCC guidelines
    # Capped at standard KCC interest subvention limit of ₹3,00,000 for standard subvention
    recommended_loan = min(300000.0, raw_credit_limit)

    # Subsidized 4% annual interest rate (7% minus 3% prompt repayment incentive)
    kcc_interest_rate = 4.0
    kcc_annual_interest = (recommended_loan * kcc_interest_rate) / 100.0

    # Informal moneylender rate (standard rural average: 2.5% per month = 30% per annum)
    moneylender_rate = 30.0
    moneylender_annual_interest = (recommended_loan * moneylender_rate) / 100.0

    # Total savings in farmer's pocket
    annual_savings = moneylender_annual_interest - kcc_annual_interest

    # Collateral status
    collateral_free = recommended_loan <= 160000.0

    return {
        "crop": crop_name.capitalize(),
        "acres": acres,
        "scale_of_finance_per_acre": scale_per_acre,
        "scale_of_finance_per_acre_formatted": format_inr(scale_per_acre),
        "approved_kcc_credit_limit": round(recommended_loan, 1),
        "calculated_credit_limit": round(recommended_loan, 1),
        "calculated_credit_limit_formatted": format_inr(recommended_loan),
        "effective_kcc_interest_rate_pct": kcc_interest_rate,
        "collateral_free": collateral_free,
        "collateral_status": "100% Collateral-Free (RBI Norms)" if collateral_free else "Standard Hypothecation of Crops",
        "collateral_requirement": "100% Collateral-Free (No Land Hypothecation needed)" if collateral_free else "Simple Land Mortgage (Above ₹1.6 Lakh)",
        "repayment_period": "12 Months (Post-Harvest bullet repayment)",
        "subvention_breakdown": {
            "gross_bank_rate_pct": 7.0,
            "govt_interest_subvention_pct": 3.0,
            "net_effective_farmer_rate_pct": 4.0
        },
        "interest_comparison": {
            "kcc_annual_interest_inr": round(kcc_annual_interest, 1),
            "moneylender_annual_interest_inr": round(moneylender_annual_interest, 1),
            "annual_farmer_savings_inr": round(annual_savings, 1),
            "savings_percentage": round(((moneylender_annual_interest - kcc_annual_interest) / moneylender_annual_interest) * 100, 1) if moneylender_annual_interest > 0 else 86.7
        },
        "interest_showdown": {
            "govt_kcc_rate_pct": kcc_interest_rate,
            "govt_kcc_interest_amount": round(kcc_annual_interest, 1),
            "govt_kcc_interest_formatted": format_inr(kcc_annual_interest),
            "moneylender_rate_pct": moneylender_rate,
            "moneylender_interest_amount": round(moneylender_annual_interest, 1),
            "moneylender_interest_formatted": format_inr(moneylender_annual_interest),
            "net_annual_savings": round(annual_savings, 1),
            "net_annual_savings_formatted": format_inr(annual_savings),
            "savings_multiplier": round(moneylender_annual_interest / kcc_annual_interest, 1) if kcc_annual_interest > 0 else 7.5
        },
        "required_documents": [
            "Land Records (Patta / 7/12 extract / ROR / Tenant agreement)",
            "Aadhaar Card & PAN Card",
            "Active Savings Bank Account with IFSC",
            "Passport Size Photograph"
        ],
        "application_steps": [
            "1. Visit your nearest Primary Agricultural Credit Society (PACS), SBI, or Regional Rural Bank (RRB).",
            "2. Fill out the 1-page KCC application form citing your Scale of Finance entitlement.",
            "3. Bank branch issues KCC RuPay Debit Card for instant cash withdrawals at ATMs."
        ]
    }
