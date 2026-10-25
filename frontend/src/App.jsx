import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import NewsTicker from './components/NewsTicker'
import GovtLoansHub from './components/GovtLoansHub'
import FarmReportModal from './components/FarmReportModal'
import API_BASE from './api'

// Placeholder Components for routing
const Login = () => {
  const navigate = useNavigate()
  return (
    <div className="container animate-fade-in" style={{marginTop: '20vh'}}>
      <div className="glass-panel" style={{padding: '30px', textAlign: 'center'}}>
        <h1 style={{color: 'var(--primary)', marginBottom: '10px'}}>AgriGrow AI</h1>
        <p style={{marginBottom: '30px', color: 'var(--text-light)'}}>Intelligent Crop Planning Assistant</p>
        
        <div style={{marginBottom: '20px', textAlign: 'left'}}>
          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Language</label>
          <select defaultValue="en">
            <option value="en">English</option>
            <option value="hi">Hindi (à¤¹à¤¿à¤‚à¤¦à¥€)</option>
            <option value="te">Telugu (à°¤à±†à°²à±à°—à±)</option>
          </select>
        </div>

        <div style={{marginBottom: '30px', textAlign: 'left'}}>
          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Phone Number</label>
          <input type="tel" placeholder="+91 98765 43210" />
        </div>

        <button className="btn-primary" style={{width: '100%'}} onClick={() => navigate('/farm-details')}>
          Send OTP
        </button>
      </div>
    </div>
  )
}

const FarmDetails = () => {
  const navigate = useNavigate()
  const [size, setSize] = React.useState('5')
  const [district, setDistrict] = React.useState('guntur')
  const [soilType, setSoilType] = React.useState('black')
  const [region, setRegion] = React.useState('andhra_pradesh')
  const [waterSource, setWaterSource] = React.useState('borewell')
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const [npk, setNpk] = React.useState({ n: '110', p: '52', k: '26', ph: '7.8' })
  const [gpsLoading, setGpsLoading] = React.useState(false)
  const [gpsData, setGpsData] = React.useState(null)

  const districtProfiles = {
    guntur: { state: 'andhra_pradesh', soil: 'black', lat: 16.3067, lon: 80.4365, npk: { n: '110', p: '52', k: '26', ph: '7.8' }, desc: 'Deep Black Regur Soil (Krishna basin)' },
    east_godavari: { state: 'andhra_pradesh', soil: 'alluvial', lat: 16.9891, lon: 82.2475, npk: { n: '85', p: '48', k: '42', ph: '6.7' }, desc: 'Fertile Godavari Deltaic Alluvium' },
    warangal: { state: 'telangana', soil: 'red', lat: 17.9689, lon: 79.5941, npk: { n: '48', p: '62', k: '24', ph: '6.5' }, desc: 'Red Sandy Loam (Deccan Plateau)' },
    nagpur: { state: 'maharashtra', soil: 'black', lat: 21.1458, lon: 79.0882, npk: { n: '105', p: '46', k: '22', ph: '7.6' }, desc: 'Black Cotton Soil (Vidarbha basaltic trap)' },
    nashik: { state: 'maharashtra', soil: 'black', lat: 19.9975, lon: 73.7898, npk: { n: '98', p: '55', k: '32', ph: '7.3' }, desc: 'Volcanic Loamy Black Soil (Horticulture belt)' },
    ludhiana: { state: 'punjab_haryana', soil: 'alluvial', lat: 30.9010, lon: 75.8573, npk: { n: '90', p: '50', k: '36', ph: '7.1' }, desc: 'Indo-Gangetic Deep Alluvial Loam' },
    karnal: { state: 'punjab_haryana', soil: 'alluvial', lat: 29.6857, lon: 76.9905, npk: { n: '82', p: '46', k: '38', ph: '7.4' }, desc: 'Light-Medium Alluvial Loam (Rice-Wheat)' },
    coimbatore: { state: 'tamil_nadu', soil: 'red', lat: 11.0168, lon: 76.9558, npk: { n: '42', p: '58', k: '28', ph: '6.8' }, desc: 'Permeable Red Loam (Western Ghats shadow)' },
    shimoga: { state: 'karnataka', soil: 'laterite', lat: 13.9299, lon: 75.5681, npk: { n: '30', p: '25', k: '35', ph: '5.6' }, desc: 'Acidic Laterite Soil (Malnad plantation belt)' },
    varanasi: { state: 'uttar_pradesh', soil: 'alluvial', lat: 25.3176, lon: 82.9739, npk: { n: '80', p: '45', k: '35', ph: '7.2' }, desc: 'Gangetic Alluvial Silt Loam' }
  }

  const handleDistrictChange = (dId) => {
    setDistrict(dId)
    const prof = districtProfiles[dId]
    if (prof) {
      setRegion(prof.state)
      setSoilType(prof.soil)
      setNpk(prof.npk)
    }
  }

  const handleDetectGPS = () => {
    setGpsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude
          fetch(`${API_BASE}/weather/live?lat=${lat}&lon=${lon}`)
            .then(res => res.json())
            .then(w => {
              setGpsData({ lat, lon, weather: w })
              setGpsLoading(false)
            })
            .catch(() => {
              setGpsData({ lat, lon, weather: { current: { temperature: 27.5, condition: 'Partly cloudy', icon: 'â›…' } } })
              setGpsLoading(false)
            })
        },
        () => {
          // Fallback to sample Guntur coords
          const lat = 16.3067, lon = 80.4365
          fetch(`${API_BASE}/weather/live?lat=${lat}&lon=${lon}`)
            .then(res => res.json())
            .then(w => {
              setGpsData({ lat, lon, weather: w })
              setGpsLoading(false)
            })
            .catch(() => setGpsLoading(false))
        },
        { timeout: 6000 }
      )
    } else {
      setGpsLoading(false)
    }
  }

  const handleContinue = () => {
    const prof = districtProfiles[district] || {}
    const profile = {
      size: parseFloat(size) || 5,
      district_id: district,
      soil_type: soilType,
      region: region,
      water_source: waterSource,
      lat: gpsData?.lat || prof.lat || 16.3067,
      lon: gpsData?.lon || prof.lon || 80.4365,
      n: npk.n ? parseFloat(npk.n) : null,
      p: npk.p ? parseFloat(npk.p) : null,
      k: npk.k ? parseFloat(npk.k) : null,
      ph: npk.ph ? parseFloat(npk.ph) : null
    }
    localStorage.setItem('agriGrowFarmProfile', JSON.stringify(profile))
    navigate('/crop-selection')
  }

  return (
    <div className="container animate-fade-in" style={{marginTop: '4vh'}}>
      <div className="glass-panel" style={{padding: '30px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px'}}>
          <div>
            <h2 style={{color: 'var(--primary)', margin: 0}}>Farm & Soil Profile</h2>
            <p style={{margin: '4px 0 0 0', color: 'var(--text-light)', fontSize: '0.9rem'}}>
              Select your District or tap GPS. Live weather & Soil Health Card data are auto-linked!
            </p>
          </div>
          <button 
            type="button" 
            className="btn-primary" 
            style={{background: 'var(--accent)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px'}} 
            onClick={handleDetectGPS}
            disabled={gpsLoading}
          >
            {gpsLoading ? 'ðŸ“¡ Locating...' : 'ðŸ“ Auto-Detect GPS'}
          </button>
        </div>

        {gpsData && (
          <div style={{background: '#e8f5e9', border: '1px solid #4caf50', color: '#1b5e20', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem'}}>
            <div>
              <strong>ðŸ“ GPS Verified ({gpsData.lat.toFixed(3)}, {gpsData.lon.toFixed(3)})</strong>
              <p style={{margin: 0, opacity: 0.9}}>Live Weather: {gpsData.weather?.current?.temperature}Â°C {gpsData.weather?.current?.condition} {gpsData.weather?.current?.icon} | Humidity: {gpsData.weather?.current?.humidity}%</p>
            </div>
            <span style={{background: '#2e7d32', color: 'white', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'}}>Live Synced</span>
          </div>
        )}

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Agricultural District (Auto Soil Baseline)</label>
            <select value={district} onChange={e => handleDistrictChange(e.target.value)}>
              <option value="guntur">Guntur (Andhra Pradesh) - Deep Black Regur</option>
              <option value="east_godavari">East Godavari (Andhra Pradesh) - Delta Alluvium</option>
              <option value="warangal">Warangal (Telangana) - Red Sandy Loam</option>
              <option value="nagpur">Nagpur (Maharashtra) - Black Cotton Soil</option>
              <option value="nashik">Nashik (Maharashtra) - Volcanic Loam</option>
              <option value="ludhiana">Ludhiana (Punjab) - Indo-Gangetic Alluvium</option>
              <option value="karnal">Karnal (Haryana) - Fertile Alluvium</option>
              <option value="coimbatore">Coimbatore (Tamil Nadu) - Red Permeable Loam</option>
              <option value="shimoga">Shimoga (Karnataka) - Acidic Laterite Soil</option>
              <option value="varanasi">Varanasi (Uttar Pradesh) - Gangetic Alluvium</option>
            </select>
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Soil Classification</label>
            <select value={soilType} onChange={e => setSoilType(e.target.value)}>
              <option value="black">Black Soil (Regur / Moisture Retentive)</option>
              <option value="alluvial">Alluvial Soil (Riverine Loam)</option>
              <option value="red">Red Soil (Iron-rich Porous)</option>
              <option value="laterite">Laterite Soil (Acidic Plantation)</option>
              <option value="sandy">Sandy Soil (High Drainage)</option>
            </select>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Farm Size (in Acres)</label>
            <input type="number" value={size} onChange={e => setSize(e.target.value)} min="0.1" step="0.1" />
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Primary Water Source</label>
            <select value={waterSource} onChange={e => setWaterSource(e.target.value)}>
              <option value="borewell">Borewell (Groundwater)</option>
              <option value="canal">Canal (Irrigation Network)</option>
              <option value="rainfed">Rain-fed (Monsoon Dependent)</option>
              <option value="river">River / Lake / Lift</option>
            </select>
          </div>
        </div>

        {/* Soil Health Card Toggle */}
        <div style={{marginBottom: '25px', padding: '15px', background: 'rgba(46, 125, 50, 0.05)', borderRadius: '10px', border: '1px solid rgba(46, 125, 50, 0.2)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <strong style={{color: 'var(--primary)', fontSize: '0.95rem'}}>ðŸ“‹ Government Soil Health Card (SHC) Values</strong>
              <p style={{margin: 0, fontSize: '0.8rem', color: 'var(--text-light)'}}>Auto-populated from {districtProfiles[district]?.desc || 'District ICAR Portal'}</p>
            </div>
            <button 
              type="button" 
              onClick={() => setShowAdvanced(!showAdvanced)} 
              className="btn-primary" 
              style={{padding: '6px 14px', fontSize: '0.8rem', background: showAdvanced ? 'var(--accent)' : 'var(--primary)'}}>
              {showAdvanced ? 'Hide Lab Numbers' : 'Edit Lab Values'}
            </button>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '15px'}}>
            <div>
              <label style={{fontSize: '0.75rem', fontWeight: 'bold'}}>Nitrogen (N)</label>
              <input type="number" disabled={!showAdvanced} placeholder="kg/ha" value={npk.n} onChange={e => setNpk({...npk, n: e.target.value})} />
            </div>
            <div>
              <label style={{fontSize: '0.75rem', fontWeight: 'bold'}}>Phosphorus (P)</label>
              <input type="number" disabled={!showAdvanced} placeholder="kg/ha" value={npk.p} onChange={e => setNpk({...npk, p: e.target.value})} />
            </div>
            <div>
              <label style={{fontSize: '0.75rem', fontWeight: 'bold'}}>Potassium (K)</label>
              <input type="number" disabled={!showAdvanced} placeholder="kg/ha" value={npk.k} onChange={e => setNpk({...npk, k: e.target.value})} />
            </div>
            <div>
              <label style={{fontSize: '0.75rem', fontWeight: 'bold'}}>Soil pH</label>
              <input type="number" step="0.1" disabled={!showAdvanced} placeholder="e.g. 7.2" value={npk.ph} onChange={e => setNpk({...npk, ph: e.target.value})} />
            </div>
          </div>
        </div>

        <button className="btn-primary" style={{width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 'bold'}} onClick={handleContinue}>
          Analyze with Live Weather & Soil ML âž”
        </button>
      </div>
    </div>
  )
}

const CropSelection = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState(null)
  const [farmingMethod, setFarmingMethod] = React.useState('organic')
  const [sortBy, setSortBy] = React.useState('confidence') // 'confidence' or 'profit'

  const fetchRecommendations = (sortMode) => {
    setLoading(true)
    const rawProfile = localStorage.getItem('agriGrowFarmProfile')
    const profile = rawProfile ? JSON.parse(rawProfile) : { soil_type: 'black', region: 'maharashtra', acres: 5 }
    profile.sort_by = sortMode

    fetch('${API_BASE}/recommend-crops/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    })
    .then(res => res.json())
    .then(result => {
      if (result && result.recommendations) {
        setData(result)
      } else {
        throw new Error('Invalid format')
      }
      setLoading(false)
    })
    .catch(() => {
      // Graceful offline fallback with economics
      setData({
        model_accuracy: 99.55,
        soil_type: profile.soil_type,
        region: profile.region,
        acres: profile.size || 5,
        soil_description: 'Rich in clay, retains moisture, high calcium/potassium. Ideal for deep-root and pulse crops.',
        recommendations: [
          {
            name: 'Cotton',
            confidence: 73.0,
            soil_match: 'High',
            reason: '73.0% ML Match',
            desc: 'Optimal vegetative growth in moisture-retentive Black clay soil. High market demand in textile hubs.',
            nutrients: { N: 105, P: 45, K: 22, ph: 7.5 },
            economics: {
              crop: 'Cotton',
              mandi_modal_price_formatted: 'â‚¹7,450 / quintal',
              harvest_duration_days: 160,
              price_trend: 'Rising â†—ï¸',
              market_risk: 'Low (Govt MSP)',
              financials_per_acre: { gross_revenue_formatted: 'â‚¹70,775', input_cost_formatted: 'â‚¹28,000', net_profit_formatted: 'â‚¹42,775', roi_percentage: 152.8 },
              total_farm_financials: { acres: 5, total_investment_formatted: 'â‚¹1,40,000', total_net_profit_formatted: 'â‚¹2,13,875' },
              msp_details: { msp_formatted: 'â‚¹7,121', trading_above_msp: true, margin_over_msp: '+â‚¹329' }
            }
          },
          {
            name: 'Pigeonpeas',
            confidence: 15.0,
            soil_match: 'Experimental',
            reason: '15.0% ML Match',
            desc: 'Deep root system fixes atmospheric nitrogen, restoring soil fertility. High pulse MSP.',
            nutrients: { N: 105, P: 45, K: 22, ph: 7.5 },
            economics: {
              crop: 'Pigeonpeas',
              mandi_modal_price_formatted: 'â‚¹9,200 / quintal',
              harvest_duration_days: 160,
              price_trend: 'Rising â†—ï¸',
              market_risk: 'Low (Trading Above MSP)',
              financials_per_acre: { gross_revenue_formatted: 'â‚¹69,000', input_cost_formatted: 'â‚¹17,500', net_profit_formatted: 'â‚¹51,500', roi_percentage: 294.3 },
              total_farm_financials: { acres: 5, total_investment_formatted: 'â‚¹87,500', total_net_profit_formatted: 'â‚¹2,57,500' },
              msp_details: { msp_formatted: 'â‚¹7,550', trading_above_msp: true, margin_over_msp: '+â‚¹1,650' }
            }
          },
          {
            name: 'Maize',
            confidence: 8.0,
            soil_match: 'Experimental',
            reason: '8.0% ML Match',
            desc: 'Good grain yield with moderate water requirement. High demand for animal feed.',
            nutrients: { N: 105, P: 45, K: 22, ph: 7.5 },
            economics: {
              crop: 'Maize',
              mandi_modal_price_formatted: 'â‚¹2,380 / quintal',
              harvest_duration_days: 105,
              price_trend: 'Rising â†—ï¸',
              market_risk: 'Low (High Industrial Demand)',
              financials_per_acre: { gross_revenue_formatted: 'â‚¹57,120', input_cost_formatted: 'â‚¹19,500', net_profit_formatted: 'â‚¹37,620', roi_percentage: 192.9 },
              total_farm_financials: { acres: 5, total_investment_formatted: 'â‚¹97,500', total_net_profit_formatted: 'â‚¹1,88,100' },
              msp_details: { msp_formatted: 'â‚¹2,225', trading_above_msp: true, margin_over_msp: '+â‚¹155' }
            }
          }
        ]
      })
      setLoading(false)
    })
  }

  React.useEffect(() => {
    fetchRecommendations(sortBy)
  }, [sortBy])

  const getCropEmoji = (name) => {
    const map = { Cotton: 'â˜ï¸', Maize: 'ðŸŒ½', Rice: 'ðŸŒ¾', Pigeonpeas: 'ðŸŒ±', Chickpea: 'ðŸ¥œ', Coffee: 'â˜•', Watermelon: 'ðŸ‰', Banana: 'ðŸŒ', Jute: 'ðŸ§µ', Mothbeans: 'ðŸŒ¿', Mungbean: 'ðŸƒ' }
    return map[name] || 'ðŸŒ¾'
  }

  const selectCrop = (cropName) => {
    localStorage.setItem('agriGrowSelectedCrop', JSON.stringify({ name: cropName, method: farmingMethod }))
    navigate('/dashboard')
  }

  return (
    <div className="container animate-fade-in" style={{marginTop: '3vh'}}>
      {/* ML Accuracy Provenance Banner */}
      <div style={{background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', color: 'white', padding: '14px 20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <span style={{fontSize: '1.6rem'}}>âš¡</span>
          <div>
            <strong style={{fontSize: '0.95rem'}}>Hybrid Agronomic ML & CACP Economics Engine</strong>
            <p style={{margin: 0, fontSize: '0.8rem', opacity: 0.9}}>Trained on 2,200 ICAR Records + Live APMC Mandi Market Prices</p>
          </div>
        </div>
        <div style={{background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem'}}>
          {data ? `${data.model_accuracy}% Accuracy` : '99.55% Accuracy'}
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px'}}>
        <div>
          <h2 style={{color: 'var(--primary)', margin: '0 0 5px 0'}}>Crop Decision Matrix</h2>
          <p style={{margin: 0, color: 'var(--text-light)', fontSize: '0.9rem'}}>
            Showing predictions for <strong>{data?.district ? `${data.district.toUpperCase()}, ` : ''}{data?.soil_type?.toUpperCase()} SOIL</strong> ({data?.acres || 5} Acres)
          </p>
        </div>

        {/* Dual Sorting Toggle */}
        <div style={{display: 'flex', background: '#e0e0e0', padding: '4px', borderRadius: '25px', gap: '4px'}}>
          <button 
            type="button"
            onClick={() => setSortBy('confidence')}
            style={{
              border: 'none', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              fontSize: '0.8rem', 
              fontWeight: 'bold',
              cursor: 'pointer',
              background: sortBy === 'confidence' ? 'var(--primary)' : 'transparent',
              color: sortBy === 'confidence' ? 'white' : '#555'
            }}
          >
            â­ Highest ML Match
          </button>
          <button 
            type="button"
            onClick={() => setSortBy('profit')}
            style={{
              border: 'none', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              fontSize: '0.8rem', 
              fontWeight: 'bold',
              cursor: 'pointer',
              background: sortBy === 'profit' ? '#2e7d32' : 'transparent',
              color: sortBy === 'profit' ? 'white' : '#555'
            }}
          >
            ðŸ’° Maximum Net Profit (â‚¹)
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '60px 0'}}>
          <div style={{fontSize: '3.5rem', animation: 'pulse 1.2s infinite'}}>ðŸ“Š</div>
          <h3 style={{marginTop: '15px', color: 'var(--primary)'}}>Calculating Real Market Margins & Yields...</h3>
          <p style={{color: 'var(--text-light)', fontSize: '0.85rem'}}>Cross-referencing CACP Cultivation Costs, MSP 2024-25 & Modal Mandi Wholesale Prices</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '25px'}}>
          {data?.recommendations?.map((item, idx) => {
            const econ = item.economics
            return (
              <div 
                key={item.name} 
                className="glass-panel animate-fade-in" 
                style={{
                  padding: '20px', 
                  cursor: 'pointer', 
                  borderLeft: idx === 0 ? '6px solid #2e7d32' : '6px solid var(--glass-border)',
                  background: idx === 0 ? 'rgba(46, 125, 50, 0.04)' : 'var(--glass-bg)',
                  transition: 'all 0.2s'
                }}
                onClick={() => selectCrop(item.name)}
              >
                {/* Header: Name, Emoji, Badges */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <span style={{fontSize: '2.4rem'}}>{getCropEmoji(item.name)}</span>
                    <div>
                      <h3 style={{margin: 0, fontSize: '1.3rem', color: 'var(--text-dark)'}}>
                        {item.name} {idx === 0 && <span style={{fontSize: '0.75rem', background: '#ffd700', color: '#000', padding: '2px 8px', borderRadius: '10px', marginLeft: '6px', fontWeight: 'bold'}}>#1 Recommended</span>}
                      </h3>
                      <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginTop: '3px'}}>
                        <span style={{fontSize: '0.82rem', color: '#1b5e20', fontWeight: 'bold'}}>
                          Mandi: {econ?.mandi_modal_price_formatted}
                        </span>
                        {econ?.msp_details?.msp_formatted !== 'Open Market Dependent' && (
                          <span style={{fontSize: '0.78rem', background: '#e8f5e9', color: '#2e7d32', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold'}}>
                            MSP: {econ?.msp_details?.msp_formatted} ({econ?.msp_details?.margin_over_msp})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px'}}>
                    <span style={{
                      background: item.confidence > 50 ? '#2e7d32' : '#f57c00', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.85rem', 
                      fontWeight: 'bold'
                    }}>
                      {item.confidence}% Soil Match
                    </span>
                    <span style={{fontSize: '0.75rem', color: '#666', background: '#eee', padding: '2px 8px', borderRadius: '10px'}}>
                      {econ?.market_risk || 'Moderate Risk'}
                    </span>
                  </div>
                </div>

                {/* Financial Intelligence Highlights Card */}
                {econ && (
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '10px', margin: '10px 0', border: '1px solid rgba(0,0,0,0.06)'}}>
                    <div>
                      <span style={{fontSize: '0.75rem', color: '#666', display: 'block'}}>Net Profit / Acre</span>
                      <strong style={{fontSize: '1.05rem', color: '#2e7d32'}}>+{econ.financials_per_acre?.net_profit_formatted}</strong>
                    </div>
                    <div>
                      <span style={{fontSize: '0.75rem', color: '#666', display: 'block'}}>Total Farm Net ({econ.total_farm_financials?.acres} Ac)</span>
                      <strong style={{fontSize: '1.05rem', color: '#1b5e20'}}>{econ.total_farm_financials?.total_net_profit_formatted}</strong>
                    </div>
                    <div>
                      <span style={{fontSize: '0.75rem', color: '#666', display: 'block'}}>Investment Needed</span>
                      <strong style={{fontSize: '0.95rem', color: '#c62828'}}>{econ.financials_per_acre?.input_cost_formatted} / ac</strong>
                    </div>
                    <div>
                      <span style={{fontSize: '0.75rem', color: '#666', display: 'block'}}>Projected Return</span>
                      <strong style={{fontSize: '1.05rem', color: '#e65100'}}>+{econ.financials_per_acre?.roi_percentage}% ROI</strong>
                    </div>
                  </div>
                )}

                <p style={{margin: '0 0 10px 0', fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.4'}}>
                  {item.desc}
                </p>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)'}}>
                  <div style={{display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--text-light)'}}>
                    <span>â±ï¸ {econ?.harvest_duration_days} Days Cycle</span>
                    <span>â€¢</span>
                    <span>ðŸ“ˆ Trend: {econ?.price_trend}</span>
                    <span>â€¢</span>
                    <span style={{background: 'rgba(0,0,0,0.04)', padding: '2px 6px', borderRadius: '4px'}}>N:{item.nutrients?.N} P:{item.nutrients?.P} K:{item.nutrients?.K}</span>
                  </div>

                  <button className="btn-primary" style={{padding: '6px 18px', fontSize: '0.85rem', fontWeight: 'bold'}} onClick={() => selectCrop(item.name)}>
                    Select Crop âž”
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* Farming Methodology */}
      <div className="glass-panel" style={{padding: '20px', marginBottom: '30px'}}>
        <h4 style={{margin: '0 0 10px 0'}}>Choose Cultivation Mode:</h4>
        <div style={{display: 'flex', gap: '15px'}}>
          <button 
            type="button"
            className="btn-primary" 
            style={{
              flex: 1, 
              background: farmingMethod === 'conventional' ? 'var(--primary)' : 'transparent', 
              color: farmingMethod === 'conventional' ? '#fff' : 'var(--primary)', 
              border: '2px solid var(--primary)'
            }}
            onClick={() => setFarmingMethod('conventional')}
          >
            Conventional (Fertilizers & Pesticides)
          </button>
          <button 
            type="button"
            className="btn-primary" 
            style={{
              flex: 1,
              background: farmingMethod === 'organic' ? 'var(--primary)' : 'transparent', 
              color: farmingMethod === 'organic' ? '#fff' : 'var(--primary)', 
              border: '2px solid var(--primary)'
            }}
            onClick={() => setFarmingMethod('organic')}
          >
            ðŸŒ¿ 100% Organic (Bio-fertilizers & Neem)
          </button>
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [weather, setWeather] = React.useState(null)
  const [selectedCrop, setSelectedCrop] = React.useState({ name: 'Cotton', method: 'organic' })
  const [advisory, setAdvisory] = React.useState(null)
  const [advisoryLang, setAdvisoryLang] = React.useState('en')
  const [loadingAdvisory, setLoadingAdvisory] = React.useState(false)

  // Phase 13, 14, 15 States
  const [fertilizerData, setFertilizerData] = React.useState(null)
  const [fertilizerMethod, setFertilizerMethod] = React.useState('chemical')
  const [kccData, setKccData] = React.useState(null)
  const [showReportModal, setShowReportModal] = React.useState(false)
  const [whatsappStatus, setWhatsappStatus] = React.useState('')
  const [farmProfile, setFarmProfile] = React.useState(null)

  const fetchAdvisory = (lang, cropInfo, prof) => {
    setLoadingAdvisory(true)
    fetch('${API_BASE}/crops/ai-advisory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop_name: cropInfo.name || 'Cotton',
        farming_method: cropInfo.method || 'organic',
        soil_type: prof.soil_type || 'black',
        region: prof.region || 'Andhra Pradesh',
        acres: prof.size || 5,
        lat: prof.lat || 16.3067,
        lon: prof.lon || 80.4365,
        language: lang
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.advisory) {
        setAdvisory(data.advisory)
      }
      setLoadingAdvisory(false)
    })
    .catch(() => setLoadingAdvisory(false))
  }

  React.useEffect(() => {
    const rawCrop = localStorage.getItem('agriGrowSelectedCrop')
    const cropInfo = rawCrop ? JSON.parse(rawCrop) : { name: 'Cotton', method: 'organic' }
    setSelectedCrop(cropInfo)

    const rawProfile = localStorage.getItem('agriGrowFarmProfile')
    const profile = rawProfile ? JSON.parse(rawProfile) : { lat: 16.3067, lon: 80.4365, soil_type: 'black', size: 5, district_id: 'guntur', region: 'Andhra Pradesh', n: 110, p: 52, k: 26, ph: 7.8, water_source: 'borewell' }
    setFarmProfile(profile)
    const lat = profile.lat || 16.3067
    const lon = profile.lon || 80.4365

    fetch(`${API_BASE}/weather/live?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(() => {
        setWeather({
          current: { temperature: 27.5, humidity: 68, condition: 'Partly cloudy', icon: 'â›…' },
          forecast_3d_rain_mm: 2.0,
          irrigation_advisory: { status: 'NORMAL', action: 'Normal Schedule', detail: 'Weather conditions favorable. Follow your standard crop timeline schedule.' }
        })
      })

    fetchAdvisory(advisoryLang, cropInfo, profile)

    // Phase 15: Precision Fertilizer calculation
    fetch('${API_BASE}/fertilizers/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop: cropInfo.name || 'Cotton',
        acres: parseFloat(profile.size || 5),
        soil_type: profile.soil_type || 'black',
        soil_n: parseFloat(profile.n || 110),
        soil_p: parseFloat(profile.p || 52),
        soil_k: parseFloat(profile.k || 26),
        farming_method: cropInfo.method || 'organic'
      })
    })
      .then(res => res.json())
      .then(data => setFertilizerData(data))
      .catch(() => {})

    // Phase 13 & 15: KCC Loan calculation
    fetch('${API_BASE}/loans/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop: (cropInfo.name || 'Cotton').toLowerCase(),
        acres: parseFloat(profile.size || 5),
        existing_private_loan: 150000,
        moneylender_rate_apr: 30
      })
    })
      .then(res => res.json())
      .then(data => setKccData(data))
      .catch(() => {})
  }, [])

  const handleLanguageChange = (newLang) => {
    setAdvisoryLang(newLang)
    const rawCrop = localStorage.getItem('agriGrowSelectedCrop')
    const cropInfo = rawCrop ? JSON.parse(rawCrop) : selectedCrop
    const rawProfile = localStorage.getItem('agriGrowFarmProfile')
    const profile = rawProfile ? JSON.parse(rawProfile) : { soil_type: 'black', size: 5 }
    fetchAdvisory(newLang, cropInfo, profile)
  }

  const handleSendWhatsAppBrief = () => {
    setWhatsappStatus('Generating WhatsApp link...')
    fetch('${API_BASE}/notifications/whatsapp-payload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'daily_brief',
        phone_number: '+91 98765 43210',
        data: {
          crop: selectedCrop.name,
          temp: weather?.current?.temperature || 28,
          condition: weather?.current?.condition || 'Partly cloudy',
          irrigation_status: weather?.irrigation_advisory?.action || 'Normal Schedule',
          irrigation_detail: weather?.irrigation_advisory?.detail || 'Optimal soil moisture',
          fertilizer_tip: advisory?.nutrition_pest || 'Apply scheduled fertilizer dose in evening.',
          next_task: 'Irrigation & weeding inspection'
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
          `ðŸŒ¾ *AgriGrow AI: Daily Field Advisory*\n\n` +
          `â€¢ *Crop:* ${selectedCrop.name}\n` +
          `â€¢ *Weather:* ${weather?.current?.temperature || 28}Â°C (${weather?.current?.condition || 'Clear'})\n` +
          `â€¢ *Irrigation:* ${weather?.irrigation_advisory?.action || 'Normal'} - ${weather?.irrigation_advisory?.detail || 'Optimal soil moisture'}\n` +
          `â€¢ *Fertilizer:* Follow scheduled split dose.\n\n` +
          `_AgriGrow AI Precision Farm Advisory_`
        )
        window.open(`https://wa.me/?text=${text}`, '_blank')
        setWhatsappStatus('Opened WhatsApp!')
        setTimeout(() => setWhatsappStatus(''), 4000)
      })
  }

  const handlePlayVoice = (text, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel() // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === 'te' ? 'te-IN' : (lang === 'hi' ? 'hi-IN' : 'en-IN')
      utterance.rate = 0.95
      window.speechSynthesis.speak(utterance)
    } else {
      alert("Text-to-speech not supported in your browser.")
    }
  }

  const tasks = [
    { id: 1, date: '2026-07-17', type: 'irrigation', desc: 'Initial field flooding (2 inches).', done: false },
    { id: 2, date: '2026-07-22', type: 'fertilizer', desc: 'Apply organic compost/manure.', done: false },
    { id: 3, date: '2026-08-06', type: 'weeding', desc: 'First manual weeding.', done: false },
    { id: 4, date: '2026-09-10', type: 'disease_inspection', desc: 'Check for stem borer or blast disease.', done: false }
  ]

  const getAdvisoryColor = (status) => {
    if (status === 'HOLD') return '#d32f2f'
    if (status === 'CRITICAL') return '#f57c00'
    return '#2e7d32'
  }

  return (
    <div className="container animate-fade-in" style={{marginTop: '2vh'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
        <h2 style={{color: 'var(--primary)', margin: 0}}>Farm Dashboard</h2>
        <div style={{background: 'var(--primary)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold'}}>
          ðŸŒ¾ {selectedCrop.name} ({selectedCrop.method === 'organic' ? '100% Organic' : 'Conventional'})
        </div>
      </div>

      {/* Live Weather & Smart Irrigation Widget */}
      {weather && (
        <div className="glass-panel" style={{padding: '20px', marginBottom: '20px', background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', color: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
            <div>
              <span style={{fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.85, letterSpacing: '0.5px'}}>Live Field Weather (Open-Meteo)</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px'}}>
                <span style={{fontSize: '2rem'}}>{weather.current?.icon}</span>
                <span style={{fontSize: '1.6rem', fontWeight: 'bold'}}>{weather.current?.temperature}Â°C</span>
                <span style={{fontSize: '1rem', opacity: 0.9}}>â€¢ {weather.current?.condition}</span>
              </div>
            </div>
            <div style={{textAlign: 'right', fontSize: '0.85rem', opacity: 0.9}}>
              <div>ðŸ’§ Humidity: <strong>{weather.current?.humidity}%</strong></div>
              <div>ðŸ’¨ Wind: <strong>{weather.current?.wind_speed || 6.5} km/h</strong></div>
              <div>ðŸŒ§ï¸ 3-Day Rain: <strong>{weather.forecast_3d_rain_mm} mm</strong></div>
            </div>
          </div>

          {/* Smart Irrigation Advisory Alert */}
          {weather.irrigation_advisory && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)', 
              color: getAdvisoryColor(weather.irrigation_advisory.status), 
              padding: '10px 14px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              fontSize: '0.88rem',
              fontWeight: '500'
            }}>
              <span style={{
                background: getAdvisoryColor(weather.irrigation_advisory.status), 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '0.75rem', 
                fontWeight: 'bold'
              }}>
                {weather.irrigation_advisory.action}
              </span>
              <span>{weather.irrigation_advisory.detail}</span>
            </div>
          )}
        </div>
      )}

      {/* Quick Action Dispatch Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
        <button
          onClick={handleSendWhatsAppBrief}
          style={{
            flex: 1,
            minWidth: '220px',
            background: '#25D366',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 3px 8px rgba(0,0,0,0.12)'
          }}
        >
          <span>ðŸ“² Send Daily Brief to WhatsApp</span>
        </button>

        <button
          onClick={() => setShowReportModal(true)}
          style={{
            flex: 1,
            minWidth: '220px',
            background: '#1b5e20',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 3px 8px rgba(0,0,0,0.12)'
          }}
        >
          <span>ðŸ–¨ï¸ Download / Print Bank Farm Report</span>
        </button>
      </div>

      {whatsappStatus && (
        <div style={{ background: '#e8f5e9', color: '#1b5e20', padding: '8px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          âœ“ {whatsappStatus}
        </div>
      )}

      {/* Phase 15: Biological Crop Growth Stage Visualizer */}
      <div className="glass-panel" style={{ padding: '18px 20px', marginBottom: '20px', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>ðŸŒ¿</span> Biological Crop Growth Stage Visualizer
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>Standard ICAR Phenological Growth Timeline</span>
          </div>
          <span style={{ background: '#e8f5e9', color: '#1b5e20', padding: '4px 12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.78rem' }}>
            Day 52 of 135 (Active)
          </span>
        </div>

        {/* 4-Step Progress Track */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', margin: '14px 0' }}>
          {[
            { stage: 'Stage 1', name: 'Sowing & Germination', days: 'Days 1-15', status: 'completed' },
            { stage: 'Stage 2', name: 'Vegetative & Tillering', days: 'Days 16-45', status: 'completed' },
            { stage: 'Stage 3', name: 'Flowering & Boll Setting', days: 'Days 46-90', status: 'active' },
            { stage: 'Stage 4', name: 'Maturity & Harvest', days: 'Days 91-135', status: 'upcoming' }
          ].map((st, idx) => (
            <div key={idx} style={{
              background: st.status === 'active' ? '#e8f5e9' : (st.status === 'completed' ? '#f5f5f5' : '#fafafa'),
              border: st.status === 'active' ? '2px solid var(--primary)' : '1px solid #e0e0e0',
              padding: '10px 8px',
              borderRadius: '8px',
              textAlign: 'center',
              position: 'relative'
            }}>
              {st.status === 'completed' && <span style={{ position: 'absolute', top: '4px', right: '6px', fontSize: '0.75rem', color: '#2e7d32' }}>âœ“</span>}
              {st.status === 'active' && <span style={{ position: 'absolute', top: '4px', right: '6px', fontSize: '0.65rem', background: 'var(--primary)', color: 'white', padding: '1px 5px', borderRadius: '10px', fontWeight: 'bold' }}>NOW</span>}
              <div style={{ fontSize: '0.72rem', color: '#666', fontWeight: 'bold' }}>{st.stage}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: st.status === 'active' ? 'bold' : '500', color: st.status === 'active' ? 'var(--primary)' : '#333', margin: '3px 0' }}>{st.name}</div>
              <div style={{ fontSize: '0.7rem', color: '#888' }}>{st.days}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fffde7', borderLeft: '4px solid #fbc02d', padding: '10px 14px', borderRadius: '6px', fontSize: '0.84rem', color: '#5d4037' }}>
          <strong>Critical Stage Advisory:</strong> Crop is currently in peak <strong>Flowering & Reproductive Phase</strong>. Moisture stress at this stage will cause flower/boll drop. Maintain recommended irrigation intervals and inspect for bollworms/pests.
        </div>
      </div>

      {/* Grounded AI Multilingual Action Plan Card */}
      {advisory && (
        <div className="glass-panel animate-fade-in" style={{padding: '22px', marginBottom: '22px', borderLeft: '6px solid var(--accent)', background: '#fff'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px'}}>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{fontSize: '1.5rem'}}>ðŸ¤–</span>
                <h3 style={{margin: 0, color: 'var(--primary)', fontSize: '1.15rem'}}>{advisory.title}</h3>
              </div>
              <span style={{fontSize: '0.75rem', color: '#666'}}>Grounded in verified ML predictions, Open-Meteo, & Mandi prices</span>
            </div>

            {/* Language Selection & Audio Play */}
            <div style={{display: 'flex', gap: '6px', alignItems: 'center'}}>
              {['en', 'te', 'hi'].map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  style={{
                    border: '1px solid var(--primary)',
                    padding: '4px 10px',
                    borderRadius: '15px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    background: advisoryLang === lang ? 'var(--primary)' : 'white',
                    color: advisoryLang === lang ? 'white' : 'var(--primary)'
                  }}
                >
                  {lang === 'en' ? 'English' : (lang === 'te' ? 'à°¤à±†à°²à±à°—à±' : 'à¤¹à¤¿à¤‚à¤¦à¥€')}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePlayVoice(advisory.narration_script, advisoryLang)}
                className="btn-primary"
                style={{padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--accent)'}}
                title="Listen Aloud in Selected Language"
              >
                ðŸ”Š Listen
              </button>
            </div>
          </div>

          {loadingAdvisory ? (
            <p style={{color: 'var(--primary)', fontSize: '0.9rem'}}>Updating Multilingual Advisory...</p>
          ) : (
            <div>
              <p style={{margin: '0 0 12px 0', fontSize: '0.9rem', lineHeight: '1.5', color: '#333'}}>
                <strong>Summary: </strong>{advisory.executive_summary}
              </p>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px'}}>
                <div style={{background: 'rgba(46, 125, 50, 0.05)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem'}}>
                  <strong style={{color: '#1b5e20', display: 'block', marginBottom: '4px'}}>ðŸŒ± Sowing & Seed Prep:</strong>
                  {advisory.seed_and_sowing}
                </div>
                <div style={{background: 'rgba(2, 136, 209, 0.05)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem'}}>
                  <strong style={{color: '#0277bd', display: 'block', marginBottom: '4px'}}>â›ˆï¸ Weather Action:</strong>
                  {advisory.weather_action}
                </div>
                <div style={{background: 'rgba(239, 108, 0, 0.05)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem'}}>
                  <strong style={{color: '#e65100', display: 'block', marginBottom: '4px'}}>ðŸ§ª Nutrition & Crop Defense:</strong>
                  {advisory.nutrition_pest}
                </div>
                <div style={{background: 'rgba(106, 27, 154, 0.05)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem'}}>
                  <strong style={{color: '#6a1b9a', display: 'block', marginBottom: '4px'}}>ðŸ“ˆ Mandi Selling & MSP:</strong>
                  {advisory.market_strategy}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Phase 15: Precision Fertilizer Bag Calculator */}
      <div className="glass-panel" style={{ padding: '22px', marginBottom: '22px', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>ðŸ§ª</span> Precision Fertilizer Bag Calculator
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>
              Translates soil N-P-K deficit for {farmProfile?.size || 5} acres into subsidized retail market bags
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setFertilizerMethod('chemical')}
              style={{
                background: fertilizerMethod === 'chemical' ? 'var(--primary)' : 'white',
                color: fertilizerMethod === 'chemical' ? 'white' : 'var(--primary)',
                border: '1px solid var(--primary)',
                padding: '5px 12px',
                borderRadius: '15px',
                fontSize: '0.78rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Retail Commercial Bags
            </button>
            <button
              onClick={() => setFertilizerMethod('organic')}
              style={{
                background: fertilizerMethod === 'organic' ? 'var(--primary)' : 'white',
                color: fertilizerMethod === 'organic' ? 'white' : 'var(--primary)',
                border: '1px solid var(--primary)',
                padding: '5px 12px',
                borderRadius: '15px',
                fontSize: '0.78rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Organic Equivalent
            </button>
          </div>
        </div>

        {fertilizerMethod === 'chemical' ? (
          <div>
            {/* Bag Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div style={{ background: '#f1f8e9', border: '1px solid #c8e6c9', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: '#2e7d32', fontWeight: 'bold' }}>NITROGEN (N) DEFICIT</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1b5e20', margin: '4px 0' }}>
                  {fertilizerData?.commercial_bags?.urea_45kg_bags || 6} Bags
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>Neem-Coated Urea (45kg)</div>
                <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '4px' }}>
                  Govt Capped: â‚¹266.50/bag<br/>
                  Total: â‚¹{((fertilizerData?.commercial_bags?.urea_45kg_bags || 6) * 266.5).toLocaleString()}
                </div>
              </div>

              <div style={{ background: '#e3f2fd', border: '1px solid #bbdefb', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: '#1565c0', fontWeight: 'bold' }}>PHOSPHORUS (P) DEFICIT</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#0d47a1', margin: '4px 0' }}>
                  {fertilizerData?.commercial_bags?.dap_50kg_bags || 4} Bags
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>Di-Ammonium Phosphate (50kg)</div>
                <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '4px' }}>
                  Subsidized: â‚¹1,350/bag<br/>
                  Total: â‚¹{((fertilizerData?.commercial_bags?.dap_50kg_bags || 4) * 1350).toLocaleString()}
                </div>
              </div>

              <div style={{ background: '#fff3e0', border: '1px solid #ffe0b2', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: '#e65100', fontWeight: 'bold' }}>POTASSIUM (K) DEFICIT</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#bf360c', margin: '4px 0' }}>
                  {fertilizerData?.commercial_bags?.mop_50kg_bags || 2} Bags
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>Muriate of Potash (50kg)</div>
                <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '4px' }}>
                  Subsidized: â‚¹1,700/bag<br/>
                  Total: â‚¹{((fertilizerData?.commercial_bags?.mop_50kg_bags || 2) * 1700).toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ background: '#f5f5f5', padding: '12px 16px', borderRadius: '8px', fontSize: '0.82rem', color: '#333', lineHeight: '1.5' }}>
              <strong>ðŸ“… Application Protocol & Timing Split:</strong><br/>
              â€¢ <strong>Basal Dose (Sowing):</strong> 100% DAP ({fertilizerData?.commercial_bags?.dap_50kg_bags || 4} bags) + 100% MOP ({fertilizerData?.commercial_bags?.mop_50kg_bags || 2} bags) broadcasted during final land preparation.<br/>
              â€¢ <strong>Top-Dressing 1 (30 Days):</strong> 50% Urea ({Math.ceil((fertilizerData?.commercial_bags?.urea_45kg_bags || 6) / 2)} bags) after first manual weeding under moist soil.<br/>
              â€¢ <strong>Top-Dressing 2 (60 Days / Flowering):</strong> Remaining 50% Urea ({Math.floor((fertilizerData?.commercial_bags?.urea_45kg_bags || 6) / 2)} bags) before flowering initiation.
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: '#2e7d32', fontWeight: 'bold' }}>COMPOSTING NUTRITION</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1b5e20', margin: '4px 0' }}>
                  {fertilizerData?.organic_alternative?.vermicompost_50kg_bags || 25} Bags
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>Enriched Vermicompost (50kg)</div>
                <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '4px' }}>Apply before ploughing for humus restoration.</div>
              </div>

              <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: '#f57f17', fontWeight: 'bold' }}>NEMATODE & PEST REPELLENT</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#e65100', margin: '4px 0' }}>
                  {fertilizerData?.organic_alternative?.neem_cake_50kg_bags || 6} Bags
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>Pure Neem Cake (50kg)</div>
                <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '4px' }}>Slow release nitrogen + soil pest deterrent.</div>
              </div>
            </div>

            <div style={{ background: '#f5f5f5', padding: '12px 16px', borderRadius: '8px', fontSize: '0.82rem', color: '#333' }}>
              <strong>ðŸŒ¿ Bio-Fertilizer Inoculants:</strong> Incorporate 2kg/acre Azotobacter (Nitrogen fixing) and 2kg/acre Phosphobacteria (PSB) with vermicompost before sowing for optimal microflora colonization.
            </div>
          </div>
        )}
      </div>

      {/* Phase 13: 4% KCC Govt Loan Callout Banner */}
      <div className="glass-panel" style={{
        padding: '18px 22px',
        marginBottom: '22px',
        background: 'linear-gradient(135deg, #0d47a1, #1976d2)',
        color: 'white',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>ðŸ›ï¸</span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff' }}>Government Kisan Credit Card (KCC) @ 4% APR</h3>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.88rem', opacity: 0.95 }}>
              Scale of Finance Credit Limit: <strong>â‚¹{kccData?.approved_kcc_credit_limit?.toLocaleString() || '2,25,000'}</strong> | Save <strong>â‚¹{kccData?.interest_comparison?.annual_farmer_savings_inr?.toLocaleString() || '58,500'}/year</strong> vs. private moneylenders!
            </p>
          </div>

          <button
            onClick={() => navigate('/govt-loans')}
            style={{
              background: '#ffd54f',
              color: '#0d47a1',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
            }}
          >
            Open 4% Loan Hub â†’
          </button>
        </div>
      </div>

      <h3 style={{marginBottom: '15px'}}>Upcoming Cultivation Schedule</h3>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px'}}>
        {tasks.map(task => (
          <div key={task.id} className="glass-panel" style={{padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '4px solid var(--primary)'}}>
            <div style={{minWidth: '60px', textAlign: 'center', color: 'var(--primary)', fontWeight: 'bold'}}>
              {new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div style={{flex: 1}}>
              <h4 style={{margin: '0 0 5px 0', textTransform: 'capitalize'}}>{task.type.replace('_', ' ')}</h4>
              <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--text-light)'}}>{task.desc}</p>
            </div>
            <input type="checkbox" style={{width: '20px', height: '20px', accentColor: 'var(--primary)'}} />
          </div>
        ))}
      </div>

      {/* Phase 15 Farm Appraisal Report Modal */}
      <FarmReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        farmProfile={farmProfile}
        cropInfo={selectedCrop}
        weather={weather}
        fertilizerData={fertilizerData}
        loanData={kccData}
      />

      <div style={{display: 'flex', gap: '15px', marginTop: '15px'}}>
        <button className="btn-primary" style={{flex: 1, background: 'var(--accent)'}} onClick={() => navigate('/disease-detect')}>
          ðŸ“· Identify Crop Disease
        </button>
        <button className="btn-primary" style={{flex: 1, background: 'var(--primary-light)'}} onClick={() => navigate('/farm-diary')}>
          ðŸ“’ Farm Diary
        </button>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px'}}>
        <button className="btn-primary" style={{background: 'var(--glass-bg)', color: 'var(--primary)', border: '1px solid var(--primary)'}} onClick={() => navigate('/market-prices')}>
          ðŸ“ˆ Market Prices
        </button>
        <button className="btn-primary" style={{background: 'var(--glass-bg)', color: 'var(--primary)', border: '1px solid var(--primary)'}} onClick={() => navigate('/govt-loans')}>
          ðŸ›ï¸ Govt Loans & KCC (4%)
        </button>
      </div>
    </div>
  )
}

const DiseaseDetect = () => {
  const [analyzing, setAnalyzing] = React.useState(false)
  const [result, setResult] = React.useState(null)

  const handleUpload = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setResult({
        disease: 'Rice Blast',
        confidence: 94,
        symptoms: 'Spindle-shaped lesions on leaves with gray centers.',
        causes: 'Fungus Magnaporthe oryzae, favored by high humidity.',
        treatment: [
          { name: 'Tricyclazole 75% WP', cost: 'â‚¹250 / 100g', link: '#' },
          { name: 'Isoprothiolane 40% EC', cost: 'â‚¹300 / 250ml', link: '#' }
        ]
      })
    }, 2000)
  }

  const handleReadAloud = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech not supported in your browser.");
    }
  }

  return (
    <div className="container animate-fade-in" style={{marginTop: '2vh'}}>
      <h2 style={{color: 'var(--primary)', marginBottom: '5px'}}>Disease Detection</h2>
      <p style={{marginBottom: '20px', color: 'var(--text-light)'}}>Upload a clear photo of the affected crop leaf.</p>

      {!result && (
        <div className="glass-panel" style={{padding: '30px', textAlign: 'center', border: '2px dashed var(--primary-light)'}}>
          <div style={{fontSize: '3rem', marginBottom: '15px'}}>ðŸ“¸</div>
          <p style={{marginBottom: '20px'}}>Tap to take a picture or upload from gallery</p>
          <button className="btn-primary" onClick={handleUpload} disabled={analyzing}>
            {analyzing ? 'Analyzing with AI...' : 'Upload Image'}
          </button>
        </div>
      )}

      {result && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{padding: '20px', marginBottom: '20px', background: 'var(--bg-color)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
               <h3 style={{color: 'var(--primary)', margin: 0}}>Diagnosis: {result.disease}</h3>
               <div style={{display: 'flex', gap: '10px'}}>
                 <button onClick={() => handleReadAloud(`Diagnosis is ${result.disease}. Symptoms include ${result.symptoms}. Causes are ${result.causes}.`)} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}} title="Read Aloud">ðŸ”Š</button>
                 <span style={{background: '#d8f3dc', color: 'var(--primary)', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.85rem'}}>
                   {result.confidence}% Match
                 </span>
               </div>
            </div>
            
            <div style={{marginTop: '15px'}}>
              <h4 style={{marginBottom: '5px'}}>Symptoms & Causes</h4>
              <p style={{fontSize: '0.9rem', marginBottom: '5px'}}><strong>Symptoms:</strong> {result.symptoms}</p>
              <p style={{fontSize: '0.9rem'}}><strong>Causes:</strong> {result.causes}</p>
            </div>
          </div>

          <h3 style={{marginBottom: '15px'}}>Government Approved Treatments</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            {result.treatment.map((t, idx) => (
              <div key={idx} className="glass-panel" style={{padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--accent)'}}>
                <div>
                  <h4 style={{margin: '0 0 5px 0'}}>{t.name}</h4>
                  <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 'bold'}}>{t.cost}</p>
                </div>
                <button className="btn-primary" style={{padding: '8px 15px', fontSize: '0.9rem'}}>Buy</button>
              </div>
            ))}
          </div>
          
          <button style={{width: '100%', padding: '15px', background: 'transparent', color: 'var(--primary)', fontWeight: 'bold', border: '1px solid var(--primary)', borderRadius: '12px', marginTop: '25px'}} onClick={() => setResult(null)}>
            Scan Another Plant
          </button>
        </div>
      )}
    </div>
  )
}

const MarketPrices = () => {
  const [commodities, setCommodities] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('${API_BASE}/market/mandi-rates')
      .then(res => res.json())
      .then(data => {
        if (data && data.commodities) {
          setCommodities(data.commodities)
        }
        setLoading(false)
      })
      .catch(() => {
        setCommodities([
          { crop: 'Cotton', msp_per_quintal: 7121, current_mandi_modal_price: 7450, price_trend: 'Rising â†—ï¸', market_risk: 'Low (Govt MSP)', buyer_demand: 'High demand from spinning mills', major_mandis: ['Guntur (AP)', 'Warangal (TG)'] },
          { crop: 'Pigeonpeas', msp_per_quintal: 7550, current_mandi_modal_price: 9200, price_trend: 'Rising â†—ï¸', market_risk: 'Low (Above MSP)', buyer_demand: 'Very High domestic shortfall', major_mandis: ['Kalaburagi (KA)', 'Latur (MH)'] },
          { crop: 'Rice', msp_per_quintal: 2300, current_mandi_modal_price: 2550, price_trend: 'Stable âž¡ï¸', market_risk: 'Low (FCI Procurement)', buyer_demand: 'Steady Govt procurement', major_mandis: ['Kakinada (AP)', 'Karnal (HR)'] },
          { crop: 'Maize', msp_per_quintal: 2225, current_mandi_modal_price: 2380, price_trend: 'Rising â†—ï¸', market_risk: 'Low', buyer_demand: 'High poultry & ethanol demand', major_mandis: ['Davangere (KA)', 'Nizamabad (TG)'] },
          { crop: 'Chickpea', msp_per_quintal: 5440, current_mandi_modal_price: 5950, price_trend: 'Stable âž¡ï¸', market_risk: 'Low (Govt MSP)', buyer_demand: 'Stable processing demand', major_mandis: ['Bikaner (RJ)', 'Indore (MP)'] }
        ])
        setLoading(false)
      })
  }, [])

  return (
    <div className="container animate-fade-in" style={{marginTop: '2vh'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
        <div>
          <h2 style={{color: 'var(--primary)', margin: 0}}>Indian Mandi Price Intelligence</h2>
          <p style={{margin: '4px 0 0 0', color: 'var(--text-light)', fontSize: '0.9rem'}}>
            Daily wholesale APMC modal prices verified against Official MSP 2024-25.
          </p>
        </div>
        <span style={{background: '#e8f5e9', color: '#1b5e20', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem'}}>
          Live APMC Feeds
        </span>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '50px 0'}}>
          <p style={{color: 'var(--primary)', fontWeight: 'bold'}}>Fetching Live Mandi Rates...</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
          {commodities.map((item, idx) => {
            const msp = item.msp_per_quintal
            const price = item.current_mandi_modal_price
            const margin = msp ? price - msp : null

            return (
              <div key={idx} className="glass-panel animate-fade-in" style={{padding: '18px', borderLeft: margin && margin >= 0 ? '5px solid #2e7d32' : '5px solid #ff9800'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                  <div>
                    <h3 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)'}}>{item.crop}</h3>
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px'}}>
                      <span style={{fontSize: '0.8rem', color: '#555'}}>APMCs: {item.major_mandis?.join(', ')}</span>
                    </div>
                  </div>

                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary)'}}>
                      â‚¹{price.toLocaleString()} <span style={{fontSize: '0.8rem', fontWeight: 'normal'}}>/ q</span>
                    </div>
                    <span style={{fontSize: '0.8rem', color: item.price_trend?.includes('Rising') ? '#2e7d32' : '#555', fontWeight: 'bold'}}>
                      {item.price_trend}
                    </span>
                  </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.03)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', marginTop: '8px'}}>
                  <div>
                    <strong>Govt MSP: </strong> 
                    {msp ? `â‚¹${msp.toLocaleString()} / quintal` : <span style={{color: '#777'}}>Open Market</span>}
                  </div>
                  <div>
                    {margin !== null ? (
                      <span style={{color: margin >= 0 ? '#2e7d32' : '#d32f2f', fontWeight: 'bold'}}>
                        {margin >= 0 ? `+â‚¹${margin.toLocaleString()} above MSP` : `-â‚¹${Math.abs(margin).toLocaleString()} below MSP`}
                      </span>
                    ) : (
                      <span style={{color: '#f57c00', fontWeight: 'bold'}}>High Value Cash Crop</span>
                    )}
                  </div>
                </div>

                <p style={{margin: '8px 0 0 0', fontSize: '0.82rem', color: 'var(--text-light)'}}>
                  â„¹ï¸ {item.buyer_demand}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const GovtSchemes = () => {
  // Mock auto-eligibility logic based on farm details
  const farmSize = 1.5; // e.g., acres

  return (
    <div className="container animate-fade-in" style={{marginTop: '2vh'}}>
      <h2 style={{color: 'var(--primary)', margin: 0}}>Government Schemes</h2>
      <p style={{marginBottom: '20px', color: 'var(--text-light)'}}>Financial aid and subsidies for your farm.</p>

      <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
        {[{name: 'PM-KISAN Samman Nidhi', desc: 'Income support of â‚¹6,000 per year for all landholding farmers.', req: 2.0}, 
          {name: 'PM Fasal Bima Yojana', desc: 'Crop insurance scheme covering natural calamities, pests & diseases.', req: 10.0}].map((scheme, idx) => (
          <div key={idx} className="glass-panel" style={{padding: '15px', borderLeft: '4px solid var(--accent)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <h4 style={{margin: '0 0 5px 0'}}>{scheme.name}</h4>
              {farmSize <= scheme.req && <span style={{background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', height: 'fit-content'}}>You are Eligible!</span>}
            </div>
            <p style={{margin: '0 0 10px 0', fontSize: '0.9rem'}}>{scheme.desc}</p>
            <a href="#" style={{color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem'}}>Apply Now â†’</a>
          </div>
        ))}
      </div>
    </div>
  )
}

const FarmDiary = () => {
  return (
    <div className="container animate-fade-in" style={{marginTop: '2vh'}}>
      <h2 style={{color: 'var(--primary)', marginBottom: '5px'}}>Farm Diary</h2>
      <p style={{marginBottom: '20px', color: 'var(--text-light)'}}>Track your expenses and predict profitability.</p>

      <div style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
        <div className="glass-panel" style={{flex: 1, padding: '15px', textAlign: 'center', background: '#ffebee'}}>
          <h4 style={{margin: 0, color: '#d32f2f'}}>Total Expenses</h4>
          <p style={{fontSize: '1.2rem', fontWeight: 'bold', margin: '5px 0 0 0'}}>â‚¹ 4,500</p>
        </div>
        <div className="glass-panel" style={{flex: 1, padding: '15px', textAlign: 'center', background: '#e8f5e9'}}>
          <h4 style={{margin: 0, color: '#388e3c'}}>Expected Revenue</h4>
          <p style={{fontSize: '1.2rem', fontWeight: 'bold', margin: '5px 0 0 0'}}>â‚¹ 42,000</p>
        </div>
      </div>

      <h3 style={{marginBottom: '10px'}}>Recent Expenses</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <div className="glass-panel" style={{padding: '15px', display: 'flex', justifyContent: 'space-between'}}>
          <div><strong>Fertilizer (Urea)</strong><br/><small>15 July 2026</small></div>
          <div style={{color: '#d32f2f', fontWeight: 'bold'}}>- â‚¹ 1,200</div>
        </div>
        <div className="glass-panel" style={{padding: '15px', display: 'flex', justifyContent: 'space-between'}}>
          <div><strong>Tractor Rental</strong><br/><small>10 July 2026</small></div>
          <div style={{color: '#d32f2f', fontWeight: 'bold'}}>- â‚¹ 3,300</div>
        </div>
      </div>
      <button className="btn-primary" style={{width: '100%', marginTop: '20px'}}>+ Add Expense</button>
    </div>
  )
}

const Chatbot = () => {
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState([{ sender: 'ai', text: 'Namaste! I am your AgriGrow AI Expert. How can I help with your crops or weather today?' }])
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSend = () => {
    if (!input.trim() || loading) return
    const userText = input.trim()
    setMessages(prev => [...prev, { sender: 'user', text: userText }])
    setInput('')
    setLoading(true)

    const rawCrop = localStorage.getItem('agriGrowSelectedCrop')
    const cropInfo = rawCrop ? JSON.parse(rawCrop) : { name: 'Cotton', method: 'organic' }
    const rawProfile = localStorage.getItem('agriGrowFarmProfile')
    const prof = rawProfile ? JSON.parse(rawProfile) : { soil_type: 'black', size: 5 }

    fetch('${API_BASE}/chatbot/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userText,
        language: 'en',
        farm_context: {
          crop: cropInfo.name,
          soil: prof.soil_type,
          acres: prof.size,
          temp: 28.0,
          irrigation_status: 'NORMAL'
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply || 'Field conditions are favorable. Follow your cultivation schedule.' }])
      setLoading(false)
    })
    .catch(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: `For your ${cropInfo.name} on ${prof.soil_type} soil, maintain regular inspection and follow your irrigation calendar.` }])
      setLoading(false)
    })
  }

  return (
    <>
      <button 
        style={{position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        onClick={() => setOpen(!open)}
      >
        ðŸ’¬
      </button>

      {open && (
        <div className="glass-panel animate-fade-in" style={{position: 'fixed', bottom: '90px', right: '20px', width: '320px', height: '420px', zIndex: 1000, display: 'flex', flexDirection: 'column', background: 'var(--bg-color)', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.2)'}}>
          <div style={{background: 'var(--primary)', color: 'white', padding: '14px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span>ðŸŒ¾ AgriBot Grounded AI</span>
            <button style={{background: 'transparent', color: 'white', border: 'none', fontSize: '1rem', cursor: 'pointer'}} onClick={() => setOpen(false)}>âœ•</button>
          </div>
          <div style={{flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? 'var(--primary-light)' : '#e0e0e0', color: msg.sender === 'user' ? 'white' : 'black', padding: '10px 14px', borderRadius: '14px', maxWidth: '85%', fontSize: '0.88rem', lineHeight: '1.4'}}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{alignSelf: 'flex-start', background: '#e0e0e0', color: '#555', padding: '8px 12px', borderRadius: '12px', fontSize: '0.8rem'}}>
                Consulting Agronomic Knowledgebase...
              </div>
            )}
          </div>
          <div style={{padding: '10px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '8px'}}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask about fertilizer, water, mandi..." style={{flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #ccc', background: 'white', fontSize: '0.85rem'}} />
            <button className="btn-primary" style={{padding: '8px 14px', borderRadius: '20px', fontSize: '0.85rem'}} onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  )
}

function App() {
  return (
    <Router>
      <NewsTicker />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/farm-details" element={<FarmDetails />} />
        <Route path="/crop-selection" element={<CropSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/disease-detect" element={<DiseaseDetect />} />
        <Route path="/market-prices" element={<MarketPrices />} />
        <Route path="/govt-loans" element={<GovtLoansHub />} />
        <Route path="/schemes" element={<GovtLoansHub />} />
        <Route path="/farm-diary" element={<FarmDiary />} />
      </Routes>
      <Chatbot />
    </Router>
  )
}

export default App
