# Official Government Agricultural Credit & Low-Interest Schemes Database
# Sources: NABARD Scale of Finance (2024-25), Ministry of Agriculture & Farmers Welfare, RBI Circulars

# Scale of Finance per acre (Standard maximum short-term crop loan limit under KCC)
SCALE_OF_FINANCE_PER_ACRE = {
    "Cotton": 36000.0,
    "Rice": 32000.0,
    "Maize": 25000.0,
    "Pigeonpeas": 22000.0,
    "Chickpea": 20000.0,
    "Mungbean": 18000.0,
    "Blackgram": 18000.0,
    "Watermelon": 40000.0,
    "Banana": 75000.0,
    "Coffee": 48000.0,
    "Jute": 26000.0,
    "default": 25000.0
}

# Curated High-Impact Low-Interest Government Loan & Subsidy Schemes
GOVT_LOAN_SCHEMES = [
    {
        "id": "kcc_subvention",
        "name": "Kisan Credit Card (KCC) with Interest Subvention",
        "ministry": "Ministry of Agriculture & RBI",
        "effective_interest_rate": "4.0% per annum",
        "standard_interest": "7.0%",
        "subvention_subsidy": "3.0% prompt repayment incentive by Central Govt",
        "max_limit": "₹3,00,000 (Collateral-free up to ₹1,60,000)",
        "purpose": "Short-term crop cultivation expenses, seeds, fertilizers, diesel, and labor.",
        "eligibility": "All landholding farmers, tenant farmers, sharecroppers, and oral lessees.",
        "key_benefit": "Zero collateral up to ₹1.6 Lakh. Repay upon harvest within 12 months.",
        "portal_url": "https://pib.gov.in/PressReleasePage.aspx?PRID=1968840",
        "badge": "⭐ Most Popular (4% APR)"
    },
    {
        "id": "aif_infrastructure",
        "name": "Agriculture Infrastructure Fund (AIF)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "effective_interest_rate": "3.0% Interest Subvention (Net ~5.5-6%)",
        "standard_interest": "8.5 - 9.0%",
        "subvention_subsidy": "3.0% interest subvention up to ₹2 Crores for 7 years",
        "max_limit": "Up to ₹2,00,00,000 (2 Crores)",
        "purpose": "Post-harvest infrastructure: Farm warehouses, cold stores, sorting/grading units, solar dryers.",
        "eligibility": "Individual farmers, FPOs, Agri-entrepreneurs, Primary Agricultural Credit Societies (PACS).",
        "key_benefit": "Credit guarantee coverage under CGTMSE for loans up to ₹2 Crore.",
        "portal_url": "https://agriinfra.dac.gov.in/",
        "badge": "Infrastructure & Storage"
    },
    {
        "id": "pm_kusum",
        "name": "PM-KUSUM (Solar Agricultural Pumps Scheme)",
        "ministry": "Ministry of New and Renewable Energy (MNRE)",
        "effective_interest_rate": "Direct Capital Subsidy up to 90%",
        "standard_interest": "Commercial loan for remaining 10-30%",
        "subvention_subsidy": "60% Govt Subsidy (30% Central + 30% State) + 30% Bank Loan",
        "max_limit": "Standalone Solar Pump (Up to 7.5 HP)",
        "purpose": "Replacing diesel pumps with grid-independent solar water pumps.",
        "eligibility": "Individual farmers, water user associations, and cooperatives.",
        "key_benefit": "Farmer only pays 10% of total pump cost upfront. Drastically cuts diesel/electricity bills.",
        "portal_url": "https://pmkusum.mnre.gov.in/",
        "badge": "⚡ 90% Solar Subsidy"
    },
    {
        "id": "pmfme_credit",
        "name": "PM Formalisation of Micro Food Processing (PMFME)",
        "ministry": "Ministry of Food Processing Industries (MoFPI)",
        "effective_interest_rate": "Credit-Linked Capital Subsidy @ 35%",
        "standard_interest": "Standard Priority Sector Lending (PSL) rates",
        "subvention_subsidy": "35% of eligible project cost (Maximum ₹10 Lakhs)",
        "max_limit": "₹10,00,000 subsidy per unit",
        "purpose": "Food processing units: Flour mills, oil expellers, spice grinding, pickle/jam making, pulse processing.",
        "eligibility": "Individual micro-enterprises, SHGs, FPOs, and Producer Cooperatives.",
        "key_benefit": "35% direct non-refundable government grant deposited into bank loan account.",
        "portal_url": "https://pmfme.mofpi.gov.in/",
        "badge": "Agri-Processing Grant"
    },
    {
        "id": "shg_stree_nidhi",
        "name": "SHG Agri-Allied Credit (Stree Nidhi / NRLM)",
        "ministry": "Ministry of Rural Development",
        "effective_interest_rate": "Subsidized 4.0% to 7.0%",
        "standard_interest": "11.0%",
        "subvention_subsidy": "Interest subvention under Deendayal Antyodaya Yojana - NRLM",
        "max_limit": "₹10,00,000 for Women Self-Help Groups",
        "purpose": "Dairy, poultry, goat rearing, organic farming, and vegetable cultivation by women farmers.",
        "eligibility": "Women members of registered Self-Help Groups (SHGs).",
        "key_benefit": "No mortgage required. Fast-track disbursal via rural cooperative societies.",
        "portal_url": "https://nrlm.gov.in/",
        "badge": "👩‍🌾 Women Farmer Credit"
    }
]

# Real-Time Government Policy & Loan News Circulars Feed
LIVE_GOVT_NEWS_TICKER = [
    {
        "id": 1,
        "tag": "RBI CIRCULAR",
        "headline": "KCC Prompt Repayment Incentive confirmed at 3% for 2024-25: Net interest remains 4% p.a. for loans up to ₹3 Lakh.",
        "date": "October 2024"
    },
    {
        "id": 2,
        "tag": "PM-KISAN KCC DRIVE",
        "headline": "Special nationwide saturation drive launched: All PM-KISAN beneficiaries eligible for pre-approved Kisan Credit Cards.",
        "date": "October 2024"
    },
    {
        "id": 3,
        "tag": "SOLAR PUMP UPDATE",
        "headline": "PM-KUSUM Component-B applications open across states: Avail 90% subsidy for off-grid 5HP and 7.5HP solar pumps.",
        "date": "October 2024"
    },
    {
        "id": 4,
        "tag": "MSP REVISION",
        "headline": "Cabinet approves Minimum Support Price hike for Rabi crops: Wheat raised to ₹2,425/q, Gram (Chickpea) raised to ₹5,650/q.",
        "date": "October 2024"
    },
    {
        "id": 5,
        "tag": "AIF FINANCING",
        "headline": "NABARD disburses ₹38,000 Crore under Agriculture Infrastructure Fund with 3% interest subvention for rural godowns and cold stores.",
        "date": "October 2024"
    }
]

def get_scale_of_finance(crop_name: str) -> float:
    for c, val in SCALE_OF_FINANCE_PER_ACRE.items():
        if c.lower() == crop_name.lower().strip():
            return val
    return SCALE_OF_FINANCE_PER_ACRE["default"]
