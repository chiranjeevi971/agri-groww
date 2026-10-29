import React from 'react'
import { useNavigate } from 'react-router-dom'
import API_BASE from '../api'

const DEFAULT_SCHEMES = [
  {
    id: 'kcc_scale_of_finance',
    name: 'Kisan Credit Card (KCC) Crop Loan',
    category: 'crop_loan',
    ministry: 'Ministry of Agriculture & Farmers Welfare / NABARD',
    interest_rate: '4.0% APR (7% base - 3% prompt repayment incentive)',
    subsidy_grant: '3% annual interest subvention',
    max_amount: '₹3,00,000 at 4% APR (Up to ₹1,60,000 100% collateral-free)',
    collateral_requirement: 'No collateral or margin money required up to ₹1,60,000 (raised to ₹2L under tie-up).',
    description: 'Provides timely credit to farmers for crop cultivation inputs (seeds, fertilizer, diesel, labour) and post-harvest expenses.',
    eligibility: [
      'All farmers: Owner cultivators, tenant farmers, oral lessees and sharecroppers.',
      'Valid Aadhaar, land records (Pahani / 7-12 RoR) or lease agreement.',
      'Active savings account with any Commercial Bank, RRB or Cooperative Bank.'
    ],
    documents_required: ['Aadhaar Card', 'Land Revenue Record (7/12, RoR or 1-B)', 'Passport Photo', 'Soil Health Card (Preferred)'],
    apply_url: 'https://pmkisan.gov.in',
    helpline: '1800-115-526'
  },
  {
    id: 'aif_post_harvest',
    name: 'Agriculture Infrastructure Fund (AIF)',
    category: 'infrastructure',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    interest_rate: 'Subsidized with 3.0% per annum interest rebate',
    subsidy_grant: '3% interest subvention for 7 years + CGTMSE credit guarantee fee paid by Govt',
    max_amount: 'Loans up to ₹2.00 Crore per project',
    collateral_requirement: 'Credit guarantee coverage available under CGTMSE for loans up to ₹2.00 Crore with zero third-party collateral.',
    description: 'Medium to long-term debt financing for post-harvest management infrastructure: solar cold rooms, pack houses, assaying units, and ripening chambers.',
    eligibility: [
      'Individual Farmers, FPOs, PACS, Self Help Groups, and Agri-entrepreneurs.',
      'Detailed Project Report (DPR) for post-harvest asset creation.'
    ],
    documents_required: ['Detailed Project Report (DPR)', 'Land Ownership / Long Lease deed', 'Bank Statement 6 Months', 'KYC Documents'],
    apply_url: 'https://agriinfra.dac.gov.in',
    helpline: '1800-180-1551'
  },
  {
    id: 'pm_kusum_solar',
    name: 'PM-KUSUM Solar Water Pump Scheme (Component-B)',
    category: 'solar_energy',
    ministry: 'Ministry of New and Renewable Energy (MNRE)',
    interest_rate: 'Zero ongoing power cost (100% solar off-grid / grid-tied)',
    subsidy_grant: 'Up to 90% total subsidy (30% Central + 30-60% State Govt subsidy; Farmer pays only 10%)',
    max_amount: 'Standalone Solar PV Pump systems up to 7.5 HP capacity',
    collateral_requirement: 'Hypothecation of solar pump equipment only. No agricultural land mortgage.',
    description: 'Replacement of expensive diesel pumps and erratic grid pumps with clean solar agricultural pumps for uninterrupted daytime irrigation.',
    eligibility: [
      'Individual farmers possessing land with an underground water source (borewell/open well).',
      'Farmers without existing electrical grid connection or seeking diesel pump replacement.'
    ],
    documents_required: ['Land Pahani / 1-B showing borewell/water source', 'Aadhaar Card', 'Bank Passbook copy', 'Electricity DISCOM NOC'],
    apply_url: 'https://pmkusum.mnre.gov.in',
    helpline: '1800-180-3333'
  },
  {
    id: 'pmfme_food_processing',
    name: 'PM Formalisation of Micro Food Processing (PMFME)',
    category: 'processing',
    ministry: 'Ministry of Food Processing Industries (MoFPI)',
    interest_rate: 'Normal Bank lending rate with 35% Capital Credit-linked Subsidy',
    subsidy_grant: '35% credit-linked capital subsidy (Maximum ₹10.00 Lakh per unit)',
    max_amount: '₹30.00 Lakh project cost',
    collateral_requirement: 'Eligible for CGTMSE collateral-free bank guarantee.',
    description: 'Financial, technical and business support for upgrading micro-enterprises like chilli grinding, turmeric polishers, cold-press oil mills, and pulse processing.',
    eligibility: [
      'Individual micro-food processing units, FPOs, and SHG enterprise groups.',
      'Existing units or new entrepreneurs under the One District One Product (ODOP) focus.'
    ],
    documents_required: ['Udyam Registration', 'DPR & Quotation of Machinery', 'Bank Passbook', 'Aadhaar & PAN'],
    apply_url: 'https://pmfme.mofpi.gov.in',
    helpline: '011-26497107'
  },
  {
    id: 'shg_stree_nidhi',
    name: 'SHG Mahila Kisan Credit & Stree Nidhi Microfinance',
    category: 'women_empowerment',
    ministry: 'Ministry of Rural Development / State Rural Livelihoods Mission',
    interest_rate: '3.0% - 7.0% APR (Subsidized through Vaddi Leni Runalu / YSR Sunna Vaddi)',
    subsidy_grant: '100% interest subvention for prompt monthly repayment',
    max_amount: '₹1,00,000 to ₹5,00,000 per SHG woman farmer member',
    collateral_requirement: 'Peer guarantee / Group social collateral. Zero land mortgage.',
    description: 'Affordable credit for women farmers and dairy operators for seed purchases, micro-irrigation kits, milch animals, and organic fertilizer inputs.',
    eligibility: [
      'Women farmers belonging to active Self Help Groups (SHG / VO).',
      'Minimum 6 months of prompt micro-savings track record.'
    ],
    documents_required: ['SHG Member Passbook', 'Aadhaar Card', 'Group Resolution for Loan'],
    apply_url: 'https://nrlm.gov.in',
    helpline: '1800-425-45678'
  }
]

const CROPS = [
  { id: 'cotton', name: 'Cotton', scaleOfFinance: 45000 },
  { id: 'rice', name: 'Rice (Paddy)', scaleOfFinance: 38000 },
  { id: 'chilli', name: 'Chilli (Mirchi)', scaleOfFinance: 65000 },
  { id: 'maize', name: 'Maize', scaleOfFinance: 30000 },
  { id: 'groundnut', name: 'Groundnut', scaleOfFinance: 32000 },
  { id: 'sugarcane', name: 'Sugarcane', scaleOfFinance: 72000 },
  { id: 'turmeric', name: 'Turmeric', scaleOfFinance: 80000 },
  { id: 'tomato', name: 'Tomato', scaleOfFinance: 55000 },
  { id: 'wheat', name: 'Wheat', scaleOfFinance: 35000 },
  { id: 'soybean', name: 'Soybean', scaleOfFinance: 28000 }
]

const GovtLoansHub = () => {
  const navigate = useNavigate()

  // Prepopulate from user farm profile
  const [selectedCrop, setSelectedCrop] = React.useState('cotton')
  const [acres, setAcres] = React.useState('5')
  const [existingLoan, setExistingLoan] = React.useState('150000')
  const [moneylenderApr, setMoneylenderApr] = React.useState('30')
  const [schemes, setSchemes] = React.useState(DEFAULT_SCHEMES)
  const [filterCat, setFilterCat] = React.useState('all')
  const [activeTab, setActiveTab] = React.useState('calculator') // 'calculator' | 'schemes'
  const [calcResult, setCalcResult] = React.useState(null)
  const [loadingCalc, setLoadingCalc] = React.useState(false)
  const [whatsappStatus, setWhatsappStatus] = React.useState('')

  React.useEffect(() => {
    // Read local storage profile
    const rawCrop = localStorage.getItem('agriGrowSelectedCrop')
    if (rawCrop) {
      try {
        const c = JSON.parse(rawCrop)
        const match = CROPS.find(item => item.name.toLowerCase().includes(c.name.toLowerCase()))
        if (match) setSelectedCrop(match.id)
      } catch (e) {}
    }
    const rawProfile = localStorage.getItem('agriGrowFarmProfile')
    if (rawProfile) {
      try {
        const p = JSON.parse(rawProfile)
        if (p.size) setAcres(String(p.size))
      } catch (e) {}
    }

    // Fetch schemes from backend
    fetch(`${API_BASE}/loans/schemes`)
      .then(res => res.json())
      .then(data => {
        if (data && data.schemes && data.schemes.length > 0) {
          setSchemes(data.schemes)
        }
      })
      .catch(() => {})

    // Run initial calculation
    runCalculation('cotton', 5, 150000, 30)
  }, [])

  const runCalculation = (cropId, ac, existLoan, apr) => {
    setLoadingCalc(true)
    fetch(`${API_BASE}/loans/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop: cropId || selectedCrop,
        acres: parseFloat(ac || acres || 5),
        existing_private_loan: parseFloat(existLoan || existingLoan || 0),
        moneylender_rate_apr: parseFloat(apr || moneylenderApr || 30)
      })
    })
      .then(res => res.json())
      .then(data => {
        setCalcResult(data)
        setLoadingCalc(false)
      })
      .catch(() => {
        // Fallback calculation in frontend
        const cObj = CROPS.find(c => c.id === cropId) || CROPS[0]
        const lim = Math.min(300000, cObj.scaleOfFinance * (parseFloat(ac) || 5))
        const kccInt = Math.round(lim * 0.04)
        const privInt = Math.round(lim * 0.30)
        setCalcResult({
          crop: cObj.name,
          acres: parseFloat(ac) || 5,
          scale_of_finance_per_acre: cObj.scaleOfFinance,
          approved_kcc_credit_limit: lim,
          effective_kcc_interest_rate_pct: 4.0,
          collateral_free: lim <= 160000,
          collateral_status: lim <= 160000 ? '100% Collateral-Free (RBI Norms)' : 'Standard Hypothecation of Crops',
          interest_comparison: {
            kcc_annual_interest_inr: kccInt,
            moneylender_annual_interest_inr: privInt,
            annual_farmer_savings_inr: privInt - kccInt,
            savings_percentage: 86.7
          },
          subvention_breakdown: {
            gross_bank_rate_pct: 7.0,
            govt_interest_subvention_pct: 3.0,
            net_effective_farmer_rate_pct: 4.0
          },
          repayment_deadline_days: 365,
          action_advice: `Apply at nearest SBI / Andhra Bank / Gramin Bank with your land RoR to save ₹${(privInt - kccInt).toLocaleString()} every year.`
        })
        setLoadingCalc(false)
      })
  }

  const handleCalculateSubmit = (e) => {
    e.preventDefault()
    runCalculation(selectedCrop, acres, existingLoan, moneylenderApr)
  }

  const handleShareKccWhatsApp = () => {
    if (!calcResult) return
    setWhatsappStatus('Generating link...')

    fetch(`${API_BASE}/notifications/whatsapp-payload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'kcc_loan',
        phone_number: '+91 98765 43210',
        data: {
          crop: calcResult.crop,
          acres: calcResult.acres,
          credit_limit: calcResult.approved_kcc_credit_limit,
          kcc_interest: calcResult.interest_comparison?.kcc_annual_interest_inr,
          moneylender_interest: calcResult.interest_comparison?.moneylender_annual_interest_inr,
          annual_savings: calcResult.interest_comparison?.annual_farmer_savings_inr
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.whatsapp_url) {
          window.open(data.whatsapp_url, '_blank')
          setWhatsappStatus('Dispatched to WhatsApp!')
          setTimeout(() => setWhatsappStatus(''), 4000)
        }
      })
      .catch(() => {
        const text = encodeURIComponent(
          `🌾 *AgriGrow AI: Govt KCC Loan Eligibility Alert*\n\n` +
          `• *Crop:* ${calcResult.crop} (${calcResult.acres} Acres)\n` +
          `• *Approved Credit Limit:* ₹${calcResult.approved_kcc_credit_limit.toLocaleString()} @ 4% APR\n` +
          `• *Govt KCC Interest:* ₹${calcResult.interest_comparison?.kcc_annual_interest_inr.toLocaleString()}/yr\n` +
          `• *Private Moneylender (30%):* ₹${calcResult.interest_comparison?.moneylender_annual_interest_inr.toLocaleString()}/yr\n` +
          `💰 *Net Annual Farmer Savings:* ₹${calcResult.interest_comparison?.annual_farmer_savings_inr.toLocaleString()}\n\n` +
          `✅ 100% Collateral-Free up to ₹1.60 Lakh under RBI guidelines.\n` +
          `Apply online: https://pmkisan.gov.in`
        )
        window.open(`https://wa.me/?text=${text}`, '_blank')
        setWhatsappStatus('Opened WhatsApp!')
        setTimeout(() => setWhatsappStatus(''), 4000)
      })
  }

  const handleShareSchemeWhatsApp = (sch) => {
    const text = encodeURIComponent(
      `🏛️ *Government Agricultural Scheme Alert*\n\n` +
      `*${sch.name}*\n` +
      `• *Subsidized Interest / Grant:* ${sch.interest_rate}\n` +
      `• *Max Financial Aid:* ${sch.max_amount}\n` +
      `• *Subsidy Benefit:* ${sch.subsidy_grant}\n` +
      `• *Collateral Norms:* ${sch.collateral_requirement}\n\n` +
      `🔗 *Official Portal:* ${sch.apply_url}\n` +
      `📞 *Toll-Free Helpline:* ${sch.helpline || '1800-180-1551'}\n\n` +
      `_Shared via AgriGrow AI Smart Agricultural Hub_`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const filteredSchemes = filterCat === 'all' 
    ? schemes 
    : schemes.filter(s => s.category === filterCat)

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2vh', paddingBottom: '50px' }}>
      {/* Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn-outline"
          style={{ padding: '6px 14px', fontSize: '0.85rem' }}
        >
          ← Back to Farm Dashboard
        </button>
        <div style={{ background: '#DDE8D5', color: '#5A3E2B', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.8rem', border: '1px solid #C4A882' }}>
          🏛️ NABARD & RBI Regulated
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--text-dark)', margin: '0 0 5px 0' }}>Government Agricultural Loans & KCC Hub</h2>
        <p style={{ margin: 0, color: 'var(--text-medium)', fontSize: '0.92rem' }}>
          Eliminate high-interest rural debt with 4% KCC credit limits, interest subventions, and capital grants.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #C4A882', paddingBottom: '6px' }}>
        <button
          onClick={() => setActiveTab('calculator')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'calculator' ? '3px solid var(--accent)' : '3px solid transparent',
            color: activeTab === 'calculator' ? 'var(--text-dark)' : 'var(--text-light)',
            fontWeight: 'bold',
            padding: '8px 16px',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          ⚖️ KCC @ 4% vs Moneylender Showdown
        </button>
        <button
          onClick={() => setActiveTab('schemes')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'schemes' ? '3px solid var(--accent)' : '3px solid transparent',
            color: activeTab === 'schemes' ? 'var(--text-dark)' : 'var(--text-light)',
            fontWeight: 'bold',
            padding: '8px 16px',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          📋 Curated Govt Schemes Directory ({schemes.length})
        </button>
      </div>

      {/* TAB 1: KCC CALCULATOR & SHOWDOWN */}
      {activeTab === 'calculator' && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', background: 'white' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🌾</span> NABARD Scale of Finance Credit Calculator
            </h3>

            <form onSubmit={handleCalculateSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-dark)' }}>Cultivated Crop</label>
                <select 
                  value={selectedCrop} 
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #C4A882', background: 'white', color: 'var(--text-dark)' }}
                >
                  {CROPS.map(c => (
                    <option key={c.id} value={c.id}>{c.name} (Scale: ₹{c.scaleOfFinance.toLocaleString()}/acre)</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-dark)' }}>Landholding (Acres)</label>
                <input 
                  type="number" 
                  step="0.5" 
                  min="0.5" 
                  max="100" 
                  value={acres} 
                  onChange={(e) => setAcres(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #C4A882' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-dark)' }}>Private Moneylender Debt (₹)</label>
                <input 
                  type="number" 
                  step="5000" 
                  min="0" 
                  value={existingLoan} 
                  onChange={(e) => setExistingLoan(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #C4A882' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-dark)' }}>Moneylender APR (%)</label>
                <input 
                  type="number" 
                  step="1" 
                  min="12" 
                  max="60" 
                  value={moneylenderApr} 
                  onChange={(e) => setMoneylenderApr(e.target.value)}
                  placeholder="30% (standard 2.5%/mo)"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #C4A882' }} 
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button 
                  type="submit" 
                  className="btn-accent" 
                  style={{ width: '100%', height: '42px', fontSize: '0.92rem', fontWeight: 'bold' }}
                  disabled={loadingCalc}
                >
                  {loadingCalc ? 'Calculating Scale of Finance...' : '🔍 Compute KCC Limit & Savings'}
                </button>
              </div>
            </form>

            {/* SHOWDOWN RESULTS */}
            {calcResult && (
              <div className="animate-fade-in" style={{ marginTop: '20px' }}>
                {/* Huge Savings Hero Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #5A3E2B, #3D291D)',
                  color: 'white',
                  padding: '20px 24px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(90, 62, 43, 0.25)',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.9 }}>
                        Annual Farmer Debt Relief Benefit
                      </div>
                      <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#FED79E', margin: '4px 0' }}>
                        ₹{calcResult.interest_comparison?.annual_farmer_savings_inr?.toLocaleString()} SAVED / YEAR
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.95 }}>
                        Switching your ₹{calcResult.approved_kcc_credit_limit?.toLocaleString()} working capital from private moneylender to 4% KCC saves {calcResult.interest_comparison?.savings_percentage}% on interest!
                      </div>
                    </div>

                    <button
                      onClick={handleShareKccWhatsApp}
                      style={{
                        background: '#25D366',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '25px',
                        fontSize: '0.95rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                      }}
                    >
                      <span>📱 Send to WhatsApp</span>
                    </button>
                  </div>
                  {whatsappStatus && (
                    <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#FED79E', fontWeight: 'bold' }}>
                      ✓ {whatsappStatus}
                    </div>
                  )}
                </div>

                {/* Side-by-Side Comparison Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  {/* Card A: KCC Govt Loan */}
                  <div style={{ background: '#F4F7F0', border: '2px solid #87A96B', borderRadius: '10px', padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#5A3E2B', fontSize: '1.05rem' }}>🏛️ Kisan Credit Card (KCC)</span>
                      <span style={{ background: '#87A96B', color: 'white', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        GOVT OF INDIA
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: '#5A3E2B', lineHeight: '1.8' }}>
                      <div>Approved Credit Limit: <strong>₹{calcResult.approved_kcc_credit_limit?.toLocaleString()}</strong></div>
                      <div>Scale of Finance: <strong>₹{calcResult.scale_of_finance_per_acre?.toLocaleString()} / acre</strong></div>
                      <div>Base Bank Interest: <span style={{ textDecoration: 'line-through', color: '#888' }}>7.0%</span></div>
                      <div>Interest Subvention: <span style={{ color: '#87A96B', fontWeight: 'bold' }}>- 3.0% (Prompt Repayment)</span></div>
                      <div>Effective Farmer Rate: <strong style={{ color: '#5A3E2B', fontSize: '1.1rem' }}>4.0% APR</strong></div>
                      <div style={{ marginTop: '8px', borderTop: '1px dashed #C4A882', paddingTop: '8px' }}>
                        Annual Interest Cost: <strong style={{ color: '#5A3E2B', fontSize: '1.2rem' }}>₹{calcResult.interest_comparison?.kcc_annual_interest_inr?.toLocaleString()}</strong>
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <span style={{
                          background: calcResult.collateral_free ? '#DDE8D5' : '#FEF3DC',
                          color: calcResult.collateral_free ? '#5A3E2B' : '#D58511',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 'bold',
                          display: 'inline-block'
                        }}>
                          {calcResult.collateral_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card B: Private Moneylender */}
                  <div style={{ background: '#FFF5F5', border: '2px solid #E57373', borderRadius: '10px', padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#B71C1C', fontSize: '1.05rem' }}>⚠️ Private Moneylender / Dealer</span>
                      <span style={{ background: '#D32F2F', color: 'white', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        HIGH DEBT TRAP
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: '#333', lineHeight: '1.8' }}>
                      <div>Loan Principal: <strong>₹{calcResult.approved_kcc_credit_limit?.toLocaleString()}</strong></div>
                      <div>Monthly Interest: <strong>2.5% to 3.0% per month</strong></div>
                      <div>Effective APR: <strong style={{ color: '#B71C1C', fontSize: '1.1rem' }}>{moneylenderApr}% per year</strong></div>
                      <div>Collateral Demanded: <span style={{ color: '#B71C1C' }}>Blank Cheque, Land Passbook, Promissory Note</span></div>
                      <div style={{ marginTop: '26px', borderTop: '1px dashed #E57373', paddingTop: '8px' }}>
                        Annual Interest Cost: <strong style={{ color: '#B71C1C', fontSize: '1.2rem' }}>₹{calcResult.interest_comparison?.moneylender_annual_interest_inr?.toLocaleString()}</strong>
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <span style={{
                          background: '#FFCDD2',
                          color: '#B71C1C',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 'bold',
                          display: 'inline-block'
                        }}>
                          Debt Spiral Risk: High compounding burden
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Practical Step-by-Step Action Guide */}
                <div style={{ background: '#FEF3DC', borderLeft: '4px solid #D58511', padding: '14px 18px', borderRadius: '8px', fontSize: '0.88rem', color: '#5A3E2B', lineHeight: '1.6' }}>
                  <strong>🏛️ How to Claim Your 4% KCC at the Bank:</strong>
                  <div style={{ marginTop: '4px' }}>
                    1. Carry your latest <strong>Pahani / 7-12 RoR</strong> and <strong>Aadhaar Card</strong>.<br/>
                    2. Request the branch manager for a <strong>Crop Loan under NABARD Scale of Finance for {calcResult.crop}</strong>.<br/>
                    3. Since your credit limit is {calcResult.collateral_free ? 'under ₹1.60 Lakh, the bank CANNOT demand mortgage or registration charges' : 'covered under standard crop hypothecation'}.<br/>
                    4. Pay back or roll over within <strong>12 months</strong> to secure the 3% Prompt Repayment Subvention, keeping your net interest rate at exactly <strong>4.0%</strong>!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CURATED SCHEMES DIRECTORY */}
      {activeTab === 'schemes' && (
        <div className="animate-fade-in">
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
            {[
              { id: 'all', label: 'All Schemes' },
              { id: 'crop_loan', label: '🌾 Crop Credit (KCC)' },
              { id: 'infrastructure', label: '🏗️ Infrastructure & Cold Storage (AIF)' },
              { id: 'solar_energy', label: '☀️ Solar Water Pumps (PM-KUSUM)' },
              { id: 'processing', label: '🏭 Food Processing (PMFME)' },
              { id: 'women_empowerment', label: '👩‍🌾 Women SHG Credit (Stree Nidhi)' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCat(cat.id)}
                style={{
                  background: filterCat === cat.id ? 'var(--primary)' : 'white',
                  color: filterCat === cat.id ? 'white' : 'var(--text-dark)',
                  border: '1px solid var(--border-color)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {filteredSchemes.map((sch) => (
              <div key={sch.id} className="glass-panel" style={{ padding: '22px', borderLeft: '6px solid var(--primary)', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', color: 'var(--text-dark)' }}>{sch.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{sch.ministry}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: '#DDE8D5', color: '#5A3E2B', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 'bold' }}>
                      {sch.interest_rate}
                    </span>
                    <button
                      onClick={() => handleShareSchemeWhatsApp(sch)}
                      style={{ background: '#25D366', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '15px', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      📱 WhatsApp Share
                    </button>
                  </div>
                </div>

                <p style={{ margin: '0 0 14px 0', fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: '1.5' }}>
                  {sch.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', background: '#F4F7F0', padding: '14px', borderRadius: '8px', fontSize: '0.84rem', marginBottom: '14px' }}>
                  <div>
                    <strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '2px' }}>💰 Maximum Loan / Project Cap:</strong>
                    {sch.max_amount}
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '2px' }}>🎁 Subsidy & Subvention:</strong>
                    {sch.subsidy_grant}
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '2px' }}>🛡️ Collateral Requirements:</strong>
                    {sch.collateral_requirement}
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '2px' }}>📄 Key Documents:</strong>
                    {sch.documents_required?.join(', ')}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                    📞 Helpline: <strong>{sch.helpline || '1800-180-1551'}</strong>
                  </div>
                  <a
                    href={sch.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent"
                    style={{ textDecoration: 'none', fontSize: '0.84rem', padding: '8px 16px', display: 'inline-block' }}
                  >
                    Apply on Official Portal ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GovtLoansHub
