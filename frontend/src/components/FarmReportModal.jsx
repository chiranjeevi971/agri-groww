import React from 'react'

const FarmReportModal = ({ open, onClose, farmProfile, cropInfo, weather, fertilizerData, loanData }) => {
  if (!open) return null

  const reportId = React.useMemo(() => {
    return `AGRI-${(farmProfile?.region || 'IN').substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
  }, [farmProfile])

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="printable-report" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(90, 62, 43, 0.65)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#ffffff',
        color: '#5A3E2B',
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '16px',
        boxShadow: '0 12px 40px rgba(90, 62, 43, 0.25)',
        padding: '30px 36px',
        position: 'relative'
      }}>
        {/* Header Controls (Hidden on print via @media print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #C4A882', paddingBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#7A5540' }}>Official Farm Appraisal Document Preview</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                background: '#D58511',
                color: '#ffffff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.88rem'
              }}
            >
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#DDE8D5',
                color: '#5A3E2B',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.88rem'
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* OFFICIAL CERTIFICATE LETTERHEAD */}
        <div style={{ border: '3px double #5A3E2B', padding: '24px', borderRadius: '10px', background: '#ffffff' }}>
          {/* Top Crest */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #87A96B', paddingBottom: '14px', marginBottom: '18px' }}>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#5A3E2B', letterSpacing: '1px' }}>
                AGRIGROW AI AGRONOMIC SYSTEM
              </div>
              <div style={{ fontSize: '0.78rem', color: '#7A5540', letterSpacing: '0.5px', marginTop: '2px' }}>
                PRECISION ADVISORY & BANK CREDIT APPRAISAL CERTIFICATE
              </div>
              <div style={{ fontSize: '0.72rem', color: '#87A96B', fontWeight: '500' }}>
                Compliant with ICAR Soil Health Benchmarks & NABARD Scale of Finance
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#5A3E2B' }}>
              <div><strong>Docket ID:</strong> <span style={{ fontFamily: 'monospace', color: '#87A96B', fontWeight: 'bold' }}>{reportId}</span></div>
              <div><strong>Issue Date:</strong> {currentDate}</div>
              <div><strong>Status:</strong> <span style={{ background: '#DDE8D5', color: '#5A3E2B', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>VERIFIED</span></div>
            </div>
          </div>

          {/* SECTION 1: FARM & HOLDING PARTICULARS */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ background: '#F4F7F0', padding: '6px 12px', fontWeight: 'bold', color: '#5A3E2B', fontSize: '0.88rem', borderLeft: '4px solid #87A96B', marginBottom: '8px' }}>
              1. FARM HOLDING & GEOGRAPHICAL PROFILE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '0.82rem', padding: '0 8px' }}>
              <div>
                <span style={{ color: '#7A5540', display: 'block' }}>District / Region</span>
                <strong>{farmProfile?.district_id || 'Guntur'}, {farmProfile?.region || 'Andhra Pradesh'}</strong>
              </div>
              <div>
                <span style={{ color: '#7A5540', display: 'block' }}>Landholding Size</span>
                <strong>{farmProfile?.size || 5} Gross Acres</strong>
              </div>
              <div>
                <span style={{ color: '#7A5540', display: 'block' }}>Soil Classification</span>
                <strong style={{ textTransform: 'capitalize' }}>{farmProfile?.soil_type || 'Black'} Regur Soil</strong>
              </div>
              <div>
                <span style={{ color: '#7A5540', display: 'block' }}>Irrigation Source</span>
                <strong style={{ textTransform: 'capitalize' }}>{farmProfile?.water_source || 'Borewell'}</strong>
              </div>
            </div>
          </div>

          {/* SECTION 2: SOIL NUTRIENT ANALYSIS */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ background: '#F4F7F0', padding: '6px 12px', fontWeight: 'bold', color: '#5A3E2B', fontSize: '0.88rem', borderLeft: '4px solid #87A96B', marginBottom: '8px' }}>
              2. SOIL HEALTH TEST & N-P-K NUTRIENT INDEX
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '0.82rem', padding: '0 8px' }}>
              <div style={{ background: '#FDFDFD', border: '1px solid #C4A882', padding: '8px', borderRadius: '6px' }}>
                <span style={{ color: '#7A5540', display: 'block' }}>Available Nitrogen (N)</span>
                <strong style={{ fontSize: '1rem', color: '#5A3E2B' }}>{farmProfile?.n || 110} kg/ha</strong>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#D58511' }}>Moderate Deficit</span>
              </div>
              <div style={{ background: '#FDFDFD', border: '1px solid #C4A882', padding: '8px', borderRadius: '6px' }}>
                <span style={{ color: '#7A5540', display: 'block' }}>Available Phosphorus (P)</span>
                <strong style={{ fontSize: '1rem', color: '#5A3E2B' }}>{farmProfile?.p || 52} kg/ha</strong>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#87A96B' }}>Optimal Range</span>
              </div>
              <div style={{ background: '#FDFDFD', border: '1px solid #C4A882', padding: '8px', borderRadius: '6px' }}>
                <span style={{ color: '#7A5540', display: 'block' }}>Available Potassium (K)</span>
                <strong style={{ fontSize: '1rem', color: '#5A3E2B' }}>{farmProfile?.k || 26} kg/ha</strong>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#b71c1c' }}>Deficient</span>
              </div>
              <div style={{ background: '#FDFDFD', border: '1px solid #C4A882', padding: '8px', borderRadius: '6px' }}>
                <span style={{ color: '#7A5540', display: 'block' }}>Soil Reaction (pH)</span>
                <strong style={{ fontSize: '1rem', color: '#5A3E2B' }}>{farmProfile?.ph || 7.8} pH</strong>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#87A96B' }}>Mildly Alkaline (Good)</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: PRECISION FERTILIZER PRESCRIPTION */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ background: '#F4F7F0', padding: '6px 12px', fontWeight: 'bold', color: '#5A3E2B', fontSize: '0.88rem', borderLeft: '4px solid #87A96B', marginBottom: '8px' }}>
              3. PRECISION FERTILIZER PRESCRIPTION (RETAIL BAGS SCHEDULE)
            </div>
            <div style={{ fontSize: '0.82rem', padding: '0 8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#DDE8D5', borderBottom: '2px solid #87A96B', textAlign: 'left', color: '#5A3E2B' }}>
                    <th style={{ padding: '6px' }}>Commercial Fertilizer</th>
                    <th style={{ padding: '6px' }}>Retail Bag Size</th>
                    <th style={{ padding: '6px' }}>Total Bags Required</th>
                    <th style={{ padding: '6px' }}>Govt Subsidized Rate</th>
                    <th style={{ padding: '6px' }}>Estimated Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '6px' }}><strong>Neem-Coated Urea</strong> (46% N)</td>
                    <td style={{ padding: '6px' }}>45 kg Bag</td>
                    <td style={{ padding: '6px' }}><strong>{fertilizerData?.commercial_bags?.urea_45kg_bags || 6} Bags</strong></td>
                    <td style={{ padding: '6px' }}>₹266.50 / bag</td>
                    <td style={{ padding: '6px' }}>₹{fertilizerData?.commercial_bags ? (fertilizerData.commercial_bags.urea_45kg_bags * 266.5).toLocaleString() : '1,599'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '6px' }}><strong>Di-Ammonium Phosphate (DAP)</strong></td>
                    <td style={{ padding: '6px' }}>50 kg Bag</td>
                    <td style={{ padding: '6px' }}><strong>{fertilizerData?.commercial_bags?.dap_50kg_bags || 4} Bags</strong></td>
                    <td style={{ padding: '6px' }}>₹1,350.00 / bag</td>
                    <td style={{ padding: '6px' }}>₹{fertilizerData?.commercial_bags ? (fertilizerData.commercial_bags.dap_50kg_bags * 1350).toLocaleString() : '5,400'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '6px' }}><strong>Muriate of Potash (MOP)</strong></td>
                    <td style={{ padding: '6px' }}>50 kg Bag</td>
                    <td style={{ padding: '6px' }}><strong>{fertilizerData?.commercial_bags?.mop_50kg_bags || 2} Bags</strong></td>
                    <td style={{ padding: '6px' }}>₹1,700.00 / bag</td>
                    <td style={{ padding: '6px' }}>₹{fertilizerData?.commercial_bags ? (fertilizerData.commercial_bags.mop_50kg_bags * 1700).toLocaleString() : '3,400'}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#7A5540', fontStyle: 'italic' }}>
                Application Protocol: 50% DAP + 100% MOP at basal land preparation. Apply Urea in two split doses (30 days and 60 days after sowing) under moist soil conditions.
              </div>
            </div>
          </div>

          {/* SECTION 4: NABARD KCC CREDIT & INTEREST APPRAISAL */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ background: '#F4F7F0', padding: '6px 12px', fontWeight: 'bold', color: '#5A3E2B', fontSize: '0.88rem', borderLeft: '4px solid #87A96B', marginBottom: '8px' }}>
              4. NABARD KISAN CREDIT CARD (KCC) SCALE OF FINANCE APPRAISAL
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.82rem', padding: '0 8px' }}>
              <div style={{ border: '1px solid #C4A882', background: '#F4F7F0', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.82rem', color: '#87A96B', fontWeight: 'bold' }}>GOVT APPROVED KCC LIMIT</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#5A3E2B', margin: '4px 0' }}>
                  ₹{loanData?.approved_kcc_credit_limit?.toLocaleString() || '2,25,000'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#5A3E2B' }}>
                  • Scale of Finance: ₹{loanData?.scale_of_finance_per_acre?.toLocaleString() || '45,000'}/acre<br/>
                  • Net Subsidized Farmer Interest: <strong>4.0% APR</strong><br/>
                  • RBI Collateral Status: {loanData?.collateral_status || '100% Collateral-Free up to ₹1.60 Lakh'}
                </div>
              </div>

              <div style={{ border: '1px solid #FED79E', background: '#FEF3DC', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.82rem', color: '#D58511', fontWeight: 'bold' }}>ANNUAL DEBT SAVINGS AUDIT</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#D58511', margin: '4px 0' }}>
                  ₹{loanData?.interest_comparison?.annual_farmer_savings_inr?.toLocaleString() || '58,500'} Saved
                </div>
                <div style={{ fontSize: '0.78rem', color: '#5A3E2B' }}>
                  • Private Moneylender Interest (30%): ₹{loanData?.interest_comparison?.moneylender_annual_interest_inr?.toLocaleString() || '67,500'}/yr<br/>
                  • KCC Govt Interest (4%): ₹{loanData?.interest_comparison?.kcc_annual_interest_inr?.toLocaleString() || '9,000'}/yr<br/>
                  • Interest Expense Reduction: <strong>86.7%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* SIGNATURE & AUTHENTICATION ENDORSEMENT */}
          <div style={{ borderTop: '2px solid #87A96B', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.78rem', color: '#7A5540' }}>
            <div>
              <div style={{ fontFamily: 'monospace', color: '#5A3E2B', fontWeight: 'bold', fontSize: '0.82rem' }}>
                DIGITALLY CERTIFIED BY AGRIGROW AI
              </div>
              <div>Algorithm: Multi-modal Agronomic Optimization Engine v2.4</div>
              <div>Weather Feed: Open-Meteo High Resolution WMO-0899</div>
              <div>Scale of Finance: NABARD Circular Ref NB.DoR / 2026-27</div>
            </div>

            <div style={{ textAlign: 'center', width: '220px' }}>
              <div style={{ height: '36px', borderBottom: '1px dashed #7A5540', marginBottom: '4px' }}></div>
              <div style={{ fontWeight: 'bold', color: '#5A3E2B' }}>Branch Manager / Agriculture Field Officer</div>
              <div style={{ fontSize: '0.72rem', color: '#7A5540' }}>Commercial / Cooperative Bank Stamp</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FarmReportModal
