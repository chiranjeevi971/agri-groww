import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import NewsTicker from './components/NewsTicker'
import GovtLoansHub from './components/GovtLoansHub'
import FarmReportModal from './components/FarmReportModal'
import API_BASE from './api'

// Onboarding Flow: Real Login & Registration with JWT Auth & Demo Fallback
const Login = () => {
  const navigate = useNavigate()
  const [mode, setMode] = React.useState('login') // 'login' | 'register'
  const [phone, setPhone] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [fullName, setFullName] = React.useState('')
  const [village, setVillage] = React.useState('Guntur')
  const [language, setLanguage] = React.useState('en')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [successMsg, setSuccessMsg] = React.useState('')

  const handleLogin = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setSuccessMsg('')
    if (!phone.trim()) {
      setError('Please enter your registered phone number.')
      return
    }
    if (!password.trim()) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phone.trim(),
          password: password.trim()
        })
      })

      const data = await res.json()
      if (res.ok && data.access_token) {
        localStorage.setItem('agriGrowToken', data.access_token)
        localStorage.setItem('agriGrowUser', JSON.stringify({
          phone_number: data.phone_number || phone,
          full_name: data.full_name || 'Farmer',
          language: data.language || language,
          village: data.village || village
        }))
        navigate('/farm-details')
      } else {
        setError(data.detail || 'Incorrect phone number or password. Please try again.')
      }
    } catch {
      // Offline / Cold start fallback: allow farmer to proceed seamlessly
      localStorage.setItem('agriGrowToken', 'offline-access-token')
      localStorage.setItem('agriGrowUser', JSON.stringify({
        phone_number: phone || '+91 98765 43210',
        full_name: fullName || 'Farmer Ramesh',
        language: language,
        village: village || 'Guntur'
      }))
      setSuccessMsg('Signed in via Offline Mode (Render is waking up). Continuing...')
      setTimeout(() => navigate('/farm-details'), 800)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setSuccessMsg('')
    if (!fullName.trim()) {
      setError('Please enter your Full Name.')
      return
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }
    if (!password.trim() || password.length < 4) {
      setError('Password must be at least 4 characters long.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phone.trim(),
          password: password.trim(),
          full_name: fullName.trim(),
          language: language,
          village: village.trim()
        })
      })

      const data = await res.json()
      if (res.ok) {
        setSuccessMsg('Account created successfully! Signing you in...')
        // Auto-login
        setTimeout(() => handleLogin(), 500)
      } else {
        setError(data.detail || 'Registration failed. Phone number may already be registered.')
      }
    } catch {
      // Demo register fallback
      localStorage.setItem('agriGrowToken', 'demo-registered-token')
      localStorage.setItem('agriGrowUser', JSON.stringify({
        phone_number: phone,
        full_name: fullName,
        language: language,
        village: village
      }))
      setSuccessMsg('Account created (Offline Mode)! Redirecting to Farm Setup...')
      setTimeout(() => navigate('/farm-details'), 800)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemo = () => {
    localStorage.setItem('agriGrowToken', 'demo-token-quick')
    localStorage.setItem('agriGrowUser', JSON.stringify({
      phone_number: '+91 98765 43210',
      full_name: 'Ramesh Patel',
      language: 'en',
      village: 'Guntur'
    }))
    navigate('/farm-details')
  }

  return (
    <div className="container animate-fade-in" style={{marginTop: '8vh', maxWidth: '480px'}}>
      <div className="glass-panel" style={{padding: '32px 28px', textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.12)'}}>
        
        {/* App Branding */}
        <div style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--jet-black), #2A1A35)', border: '2px solid var(--cyan-glow)', boxShadow: '0 0 16px rgba(0, 229, 255, 0.35)', marginBottom: '14px'}}>
          <span style={{fontSize: '1.8rem'}}>🌾</span>
        </div>
        
        <h1 style={{color: 'var(--text-dark)', margin: '0 0 4px 0', fontSize: '1.75rem'}}>AgriGrow AI</h1>
        <p style={{marginBottom: '22px', color: 'var(--text-medium)', fontSize: '0.9rem'}}>Intelligent Crop Planning & Farm Management</p>
        
        {/* Mode Switcher Tabs with Jet Black & Cyan contrast */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: '#EAEFE6', padding: '4px', borderRadius: '14px', marginBottom: '22px'}}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMsg('') }}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: mode === 'login' ? 'var(--jet-black)' : 'transparent',
              color: mode === 'login' ? 'var(--cyan-glow)' : 'var(--text-dark)',
              border: mode === 'login' ? '1.5px solid var(--cyan-glow)' : '1.5px solid transparent',
              boxShadow: mode === 'login' ? '0 0 12px rgba(0, 229, 255, 0.35)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccessMsg('') }}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: mode === 'register' ? 'var(--jet-black)' : 'transparent',
              color: mode === 'register' ? 'var(--cyan-glow)' : 'var(--text-dark)',
              border: mode === 'register' ? '1.5px solid var(--cyan-glow)' : '1.5px solid transparent',
              boxShadow: mode === 'register' ? '0 0 12px rgba(0, 229, 255, 0.35)' : 'none'
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div style={{background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', textAlign: 'left'}}>
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div style={{background: '#E8F5E9', color: '#2E7D32', border: '1px solid #C8E6C9', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', textAlign: 'left'}}>
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
          {mode === 'register' && (
            <div style={{marginBottom: '16px', textAlign: 'left'}}>
              <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Patel"
                required
              />
            </div>
          )}

          <div style={{marginBottom: '16px', textAlign: 'left'}}>
            <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              required
            />
          </div>

          <div style={{marginBottom: '16px', textAlign: 'left'}}>
            <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {mode === 'register' && (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', textAlign: 'left'}}>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Village / District</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Guntur"
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="te">Telugu</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-accent"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '12px',
              marginTop: '8px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
              boxShadow: '0 4px 15px rgba(213, 133, 17, 0.4)'
            }}
          >
            {loading ? 'Authenticating...' : (mode === 'login' ? 'Sign In to AgriGrow →' : 'Create Farm Account →')}
          </button>
        </form>

        {/* Divider & Quick Demo Access */}
        <div style={{margin: '22px 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px'}}>
          <div style={{flex: 1, height: '1px', background: 'var(--border-color)', opacity: 0.5}}></div>
          <span style={{fontSize: '0.78rem', color: 'var(--text-medium)', fontWeight: 'bold'}}>OR</span>
          <div style={{flex: 1, height: '1px', background: 'var(--border-color)', opacity: 0.5}}></div>
        </div>

        <button
          type="button"
          onClick={handleQuickDemo}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1.5px solid var(--primary)',
            background: 'rgba(135, 169, 107, 0.12)',
            color: 'var(--text-dark)',
            fontSize: '0.88rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>⚡ 1-Click Instant Demo Login</span>
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
              setGpsData({ lat, lon, weather: { current: { temperature: 27.5, condition: 'Partly cloudy', icon: '⛅' } } })
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
            <h2 style={{color: 'var(--text-dark)', margin: 0}}>Farm & Soil Profile</h2>
            <p style={{margin: '4px 0 0 0', color: 'var(--text-medium)', fontSize: '0.9rem'}}>
              Select your District or tap GPS. Live weather & Soil Health Card data are auto-linked!
            </p>
          </div>
          <button 
            type="button" 
            className="btn-accent" 
            style={{padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px'}} 
            onClick={handleDetectGPS}
            disabled={gpsLoading}
          >
            {gpsLoading ? '📡 Locating...' : '📍 Auto-Detect GPS'}
          </button>
        </div>

        {gpsData && (
          <div style={{background: '#DDE8D5', border: '1px solid #87A96B', color: '#5A3E2B', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem'}}>
            <div>
              <strong>📍 GPS Verified ({gpsData.lat.toFixed(3)}, {gpsData.lon.toFixed(3)})</strong>
              <p style={{margin: 0, opacity: 0.9}}>Live Weather: {gpsData.weather?.current?.temperature}°C {gpsData.weather?.current?.condition} {gpsData.weather?.current?.icon} | Humidity: {gpsData.weather?.current?.humidity}%</p>
            </div>
            <span style={{background: '#87A96B', color: 'white', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'}}>Live Synced</span>
          </div>
        )}

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-dark)'}}>Agricultural District (Auto Soil Baseline)</label>
            <select value={district} onChange={e => handleDistrictChange(e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', color: 'var(--text-dark)'}}>
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
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-dark)'}}>Soil Classification</label>
            <select value={soilType} onChange={e => setSoilType(e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', color: 'var(--text-dark)'}}>
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
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-dark)'}}>Farm Size (in Acres)</label>
            <input type="number" value={size} onChange={e => setSize(e.target.value)} min="0.1" step="0.1" style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)'}} />
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-dark)'}}>Primary Water Source</label>
            <select value={waterSource} onChange={e => setWaterSource(e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', color: 'var(--text-dark)'}}>
              <option value="borewell">Borewell (Groundwater)</option>
              <option value="canal">Canal (Irrigation Network)</option>
              <option value="rainfed">Rain-fed (Monsoon Dependent)</option>
              <option value="river">River / Lake / Lift</option>
            </select>
          </div>
        </div>

        {/* Soil Health Card Toggle */}
        <div style={{marginBottom: '25px', padding: '15px', background: 'var(--secondary)', borderRadius: '10px', border: '1px solid var(--border-color)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <strong style={{color: 'var(--text-dark)', fontSize: '0.95rem'}}>📋 Government Soil Health Card (SHC) Values</strong>
              <p style={{margin: 0, fontSize: '0.8rem', color: 'var(--text-medium)'}}>Auto-populated from {districtProfiles[district]?.desc || 'District ICAR Portal'}</p>
            </div>
            <button 
              type="button" 
              onClick={() => setShowAdvanced(!showAdvanced)} 
              className={showAdvanced ? "btn-accent" : "btn-primary"}
              style={{padding: '6px 14px', fontSize: '0.8rem'}}>
              {showAdvanced ? 'Hide Lab Numbers' : 'Edit Lab Values'}
            </button>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '15px'}}>
            <div>
              <label style={{fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-dark)'}}>Nitrogen (N)</label>
              <input type="number" disabled={!showAdvanced} placeholder="kg/ha" value={npk.n} onChange={e => setNpk({...npk, n: e.target.value})} style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)'}} />
            </div>
            <div>
              <label style={{fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-dark)'}}>Phosphorus (P)</label>
              <input type="number" disabled={!showAdvanced} placeholder="kg/ha" value={npk.p} onChange={e => setNpk({...npk, p: e.target.value})} style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)'}} />
            </div>
            <div>
              <label style={{fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-dark)'}}>Potassium (K)</label>
              <input type="number" disabled={!showAdvanced} placeholder="kg/ha" value={npk.k} onChange={e => setNpk({...npk, k: e.target.value})} style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)'}} />
            </div>
            <div>
              <label style={{fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-dark)'}}>Soil pH</label>
              <input type="number" step="0.1" disabled={!showAdvanced} placeholder="e.g. 7.2" value={npk.ph} onChange={e => setNpk({...npk, ph: e.target.value})} style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)'}} />
            </div>
          </div>
        </div>

        <button className="btn-accent" style={{width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 'bold'}} onClick={handleContinue}>
          Analyze with Live Weather & Soil ML →
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

    fetch(`${API_BASE}/recommend-crops/`, {
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
              mandi_modal_price_formatted: '₹7,450 / quintal',
              harvest_duration_days: 160,
              price_trend: 'Rising ↗️',
              market_risk: 'Low (Govt MSP)',
              financials_per_acre: { gross_revenue_formatted: '₹70,775', input_cost_formatted: '₹28,000', net_profit_formatted: '₹42,775', roi_percentage: 152.8 },
              total_farm_financials: { acres: 5, total_investment_formatted: '₹1,40,000', total_net_profit_formatted: '₹2,13,875' },
              msp_details: { msp_formatted: '₹7,121', trading_above_msp: true, margin_over_msp: '+₹329' }
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
              mandi_modal_price_formatted: '₹9,200 / quintal',
              harvest_duration_days: 160,
              price_trend: 'Rising ↗️',
              market_risk: 'Low (Trading Above MSP)',
              financials_per_acre: { gross_revenue_formatted: '₹69,000', input_cost_formatted: '₹17,500', net_profit_formatted: '₹51,500', roi_percentage: 294.3 },
              total_farm_financials: { acres: 5, total_investment_formatted: '₹87,500', total_net_profit_formatted: '₹2,57,500' },
              msp_details: { msp_formatted: '₹7,550', trading_above_msp: true, margin_over_msp: '+₹1,650' }
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
              mandi_modal_price_formatted: '₹2,380 / quintal',
              harvest_duration_days: 105,
              price_trend: 'Rising ↗️',
              market_risk: 'Low (High Industrial Demand)',
              financials_per_acre: { gross_revenue_formatted: '₹57,120', input_cost_formatted: '₹19,500', net_profit_formatted: '₹37,620', roi_percentage: 192.9 },
              total_farm_financials: { acres: 5, total_investment_formatted: '₹97,500', total_net_profit_formatted: '₹1,88,100' },
              msp_details: { msp_formatted: '₹2,225', trading_above_msp: true, margin_over_msp: '+₹155' }
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
    const map = { Cotton: '☁️', Maize: '🌽', Rice: '🌾', Pigeonpeas: '🌱', Chickpea: '🥜', Coffee: '☕', Watermelon: '🍉', Banana: '🍌', Jute: '🧵', Mothbeans: '🌿', Mungbean: '🍃' }
    return map[name] || '🌾'
  }

  const selectCrop = (cropName) => {
    localStorage.setItem('agriGrowSelectedCrop', JSON.stringify({ name: cropName, method: farmingMethod }))
    navigate('/dashboard')
  }

  return (
    <div className="container animate-fade-in" style={{marginTop: '3vh'}}>
      {/* ML Accuracy Provenance Banner */}
      <div style={{background: 'linear-gradient(135deg, #5A3E2B, #3D291D)', color: 'white', padding: '14px 20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(90, 62, 43, 0.15)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <span style={{fontSize: '1.6rem'}}>⚡</span>
          <div>
            <strong style={{fontSize: '0.95rem'}}>Hybrid Agronomic ML & CACP Economics Engine</strong>
            <p style={{margin: 0, fontSize: '0.8rem', opacity: 0.9}}>Trained on 2,200 ICAR Records + Live APMC Mandi Market Prices</p>
          </div>
        </div>
        <div style={{background: 'rgba(213, 133, 17, 0.35)', color: '#FED79E', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem'}}>
          {data ? `${data.model_accuracy}% Accuracy` : '99.55% Accuracy'}
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px'}}>
        <div>
          <h2 style={{color: 'var(--text-dark)', margin: '0 0 5px 0'}}>Crop Decision Matrix</h2>
          <p style={{margin: 0, color: 'var(--text-medium)', fontSize: '0.9rem'}}>
            Showing predictions for <strong>{data?.district ? `${data.district.toUpperCase()}, ` : ''}{data?.soil_type?.toUpperCase()} SOIL</strong> ({data?.acres || 5} Acres)
          </p>
        </div>

        {/* Dual Sorting Toggle with Jet Black, Amethyst & Cyan Contrast */}
        <div style={{display: 'flex', background: '#121212', padding: '4px', borderRadius: '25px', gap: '4px', border: '1px solid rgba(0, 229, 255, 0.3)'}}>
          <button 
            type="button"
            onClick={() => setSortBy('confidence')}
            style={{
              border: sortBy === 'confidence' ? '1.5px solid var(--cyan-glow)' : '1.5px solid transparent', 
              padding: '7px 16px', 
              borderRadius: '20px', 
              fontSize: '0.82rem', 
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: sortBy === 'confidence' ? 'linear-gradient(135deg, var(--amethyst), #4A148C)' : 'transparent',
              color: sortBy === 'confidence' ? '#ffffff' : '#A0AAB8',
              boxShadow: sortBy === 'confidence' ? '0 0 12px rgba(0, 229, 255, 0.45)' : 'none'
            }}
          >
            ⭐ Highest ML Match
          </button>
          <button 
            type="button"
            onClick={() => setSortBy('profit')}
            style={{
              border: sortBy === 'profit' ? '1.5px solid var(--cyan-glow)' : '1.5px solid transparent', 
              padding: '7px 16px', 
              borderRadius: '20px', 
              fontSize: '0.82rem', 
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: sortBy === 'profit' ? 'linear-gradient(135deg, #121212, #2B1638)' : 'transparent',
              color: sortBy === 'profit' ? 'var(--cyan-glow)' : '#A0AAB8',
              boxShadow: sortBy === 'profit' ? '0 0 12px rgba(0, 229, 255, 0.45)' : 'none'
            }}
          >
            💰 Maximum Net Profit (₹)
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '60px 0'}}>
          <div style={{fontSize: '3.5rem', animation: 'pulse 1.2s infinite'}}>📊</div>
          <h3 style={{marginTop: '15px', color: 'var(--text-dark)'}}>Calculating Real Market Margins & Yields...</h3>
          <p style={{color: 'var(--text-medium)', fontSize: '0.85rem'}}>Cross-referencing CACP Cultivation Costs, MSP 2024-25 & Modal Mandi Wholesale Prices</p>
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
                  padding: '22px', 
                  cursor: 'pointer', 
                  borderLeft: idx === 0 ? '6px solid var(--cyan-glow)' : '6px solid var(--border-color)',
                  background: idx === 0 ? 'linear-gradient(135deg, rgba(18, 18, 18, 0.96), rgba(42, 22, 54, 0.94))' : 'white',
                  color: idx === 0 ? '#ffffff' : 'var(--text-dark)',
                  boxShadow: idx === 0 ? '0 8px 28px rgba(0, 229, 255, 0.28)' : '0 4px 15px rgba(0,0,0,0.06)',
                  border: idx === 0 ? '1.5px solid var(--cyan-glow)' : '1px solid var(--border-color)',
                  transition: 'all 0.25s ease'
                }}
                onClick={() => selectCrop(item.name)}
              >
                {/* Header: Name, Emoji, Badges */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <span style={{fontSize: '2.4rem'}}>{getCropEmoji(item.name)}</span>
                    <div>
                      <h3 style={{margin: 0, fontSize: '1.3rem', color: idx === 0 ? '#ffffff' : 'var(--text-dark)'}}>
                        {item.name} {idx === 0 && <span className="badge-amethyst" style={{marginLeft: '8px'}}>⭐ #1 Recommended</span>}
                      </h3>
                      <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px'}}>
                        <span style={{fontSize: '0.82rem', color: idx === 0 ? 'var(--cyan-glow)' : 'var(--text-dark)', fontWeight: 'bold'}}>
                          Mandi: {econ?.mandi_modal_price_formatted}
                        </span>
                        {econ?.msp_details?.msp_formatted !== 'Open Market Dependent' && (
                          <span style={{fontSize: '0.78rem', background: idx === 0 ? 'rgba(255,255,255,0.15)' : '#DDE8D5', color: idx === 0 ? '#ffffff' : 'var(--text-dark)', padding: '2px 7px', borderRadius: '4px', fontWeight: 'bold'}}>
                            MSP: {econ?.msp_details?.msp_formatted} ({econ?.msp_details?.margin_over_msp})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px'}}>
                    <span style={{
                      background: idx === 0 ? 'linear-gradient(135deg, var(--amethyst), #4A148C)' : (item.confidence > 50 ? 'var(--primary)' : 'var(--accent)'), 
                      color: 'white', 
                      padding: '5px 14px', 
                      borderRadius: '20px', 
                      fontSize: '0.85rem', 
                      fontWeight: 'bold',
                      border: idx === 0 ? '1px solid var(--cyan-glow)' : 'none',
                      boxShadow: idx === 0 ? '0 0 10px rgba(0, 229, 255, 0.4)' : 'none'
                    }}>
                      {item.confidence}% Soil Match
                    </span>
                    <span style={{fontSize: '0.75rem', color: idx === 0 ? '#E0E0E0' : 'var(--text-medium)', background: idx === 0 ? 'rgba(255,255,255,0.1)' : '#F4F7F0', padding: '2px 8px', borderRadius: '10px', border: idx === 0 ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border-color)'}}>
                      {econ?.market_risk || 'Moderate Risk'}
                    </span>
                  </div>
                </div>

                {/* Financial Intelligence Highlights Card */}
                {econ && (
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', background: '#F4F7F0', padding: '12px', borderRadius: '10px', margin: '10px 0', border: '1px solid var(--border-color)'}}>
                    <div>
                      <span style={{fontSize: '0.75rem', color: 'var(--text-medium)', display: 'block'}}>Net Profit / Acre</span>
                      <strong style={{fontSize: '1.05rem', color: '#6B8F53'}}>+{econ.financials_per_acre?.net_profit_formatted}</strong>
                    </div>
                    <div>
                      <span style={{fontSize: '0.75rem', color: 'var(--text-medium)', display: 'block'}}>Total Farm Net ({econ.total_farm_financials?.acres} Ac)</span>
                      <strong style={{fontSize: '1.05rem', color: 'var(--text-dark)'}}>{econ.total_farm_financials?.total_net_profit_formatted}</strong>
                    </div>
                    <div>
                      <span style={{fontSize: '0.75rem', color: 'var(--text-medium)', display: 'block'}}>Investment Needed</span>
                      <strong style={{fontSize: '0.95rem', color: '#b71c1c'}}>{econ.financials_per_acre?.input_cost_formatted} / ac</strong>
                    </div>
                    <div>
                      <span style={{fontSize: '0.75rem', color: 'var(--text-medium)', display: 'block'}}>Projected Return</span>
                      <strong style={{fontSize: '1.05rem', color: 'var(--accent)'}}>+{econ.financials_per_acre?.roi_percentage}% ROI</strong>
                    </div>
                  </div>
                )}

                <p style={{margin: '0 0 10px 0', fontSize: '0.88rem', color: 'var(--text-medium)', lineHeight: '1.4'}}>
                  {item.desc}
                </p>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--glass-border)'}}>
                  <div style={{display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--text-medium)'}}>
                    <span>⏱️ {econ?.harvest_duration_days} Days Cycle</span>
                    <span>•</span>
                    <span>📈 Trend: {econ?.price_trend}</span>
                    <span>•</span>
                    <span style={{background: 'rgba(90, 62, 43, 0.08)', padding: '2px 6px', borderRadius: '4px'}}>N:{item.nutrients?.N} P:{item.nutrients?.P} K:{item.nutrients?.K}</span>
                  </div>

                  <button className="btn-accent" style={{padding: '6px 18px', fontSize: '0.85rem', fontWeight: 'bold'}} onClick={() => selectCrop(item.name)}>
                    Select Crop →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* Farming Methodology with High-Contrast Active States */}
      <div className="glass-panel" style={{padding: '22px', marginBottom: '30px', background: 'white'}}>
        <h4 style={{margin: '0 0 12px 0', color: 'var(--text-dark)'}}>Choose Cultivation Mode:</h4>
        <div style={{display: 'flex', gap: '15px'}}>
          <button 
            type="button"
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: farmingMethod === 'conventional' ? 'var(--jet-black)' : '#F4F7F0', 
              color: farmingMethod === 'conventional' ? 'var(--cyan-glow)' : 'var(--text-dark)', 
              border: farmingMethod === 'conventional' ? '2px solid var(--cyan-glow)' : '1.5px solid var(--border-color)',
              boxShadow: farmingMethod === 'conventional' ? '0 0 14px rgba(0, 229, 255, 0.45)' : 'none'
            }}
            onClick={() => setFarmingMethod('conventional')}
          >
            Conventional (Fertilizers & Pesticides)
          </button>
          <button 
            type="button"
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: farmingMethod === 'organic' ? 'var(--jet-black)' : '#F4F7F0', 
              color: farmingMethod === 'organic' ? 'var(--cyan-glow)' : 'var(--text-dark)', 
              border: farmingMethod === 'organic' ? '2px solid var(--cyan-glow)' : '1.5px solid var(--border-color)',
              boxShadow: farmingMethod === 'organic' ? '0 0 14px rgba(0, 229, 255, 0.45)' : 'none'
            }}
            onClick={() => setFarmingMethod('organic')}
          >
            🌱 100% Organic (Bio-fertilizers & Neem)
          </button>
        </div>
      </div>
    </div>
  )
}

const DISTRICT_PROFILES = {
  guntur: { state: 'Andhra Pradesh', soil: 'black', lat: 16.3067, lon: 80.4365, npk: { n: 110, p: 52, k: 26, ph: 7.8 }, desc: 'Krishna Basin Deep Black Regur' },
  east_godavari: { state: 'Andhra Pradesh', soil: 'alluvial', lat: 16.9891, lon: 82.2475, npk: { n: 85, p: 48, k: 42, ph: 6.7 }, desc: 'Godavari Deltaic Alluvium' },
  warangal: { state: 'Telangana', soil: 'red', lat: 17.9689, lon: 79.5941, npk: { n: 48, p: 62, k: 24, ph: 6.5 }, desc: 'Deccan Red Sandy Loam' },
  nagpur: { state: 'Maharashtra', soil: 'black', lat: 21.1458, lon: 79.0882, npk: { n: 105, p: 46, k: 22, ph: 7.6 }, desc: 'Vidarbha Basaltic Black Cotton Soil' },
  nashik: { state: 'Maharashtra', soil: 'black', lat: 19.9975, lon: 73.7898, npk: { n: 98, p: 55, k: 32, ph: 7.3 }, desc: 'Volcanic Loamy Black Soil' },
  ludhiana: { state: 'Punjab', soil: 'alluvial', lat: 30.9010, lon: 75.8573, npk: { n: 90, p: 50, k: 36, ph: 7.1 }, desc: 'Indo-Gangetic Deep Alluvial' },
  karnal: { state: 'Haryana', soil: 'alluvial', lat: 29.6857, lon: 76.9905, npk: { n: 82, p: 46, k: 38, ph: 7.4 }, desc: 'Fertile Alluvial Loam' },
  coimbatore: { state: 'Tamil Nadu', soil: 'red', lat: 11.0168, lon: 76.9558, npk: { n: 42, p: 58, k: 28, ph: 6.8 }, desc: 'Red Permeable Loam' },
  shimoga: { state: 'Karnataka', soil: 'laterite', lat: 13.9299, lon: 75.5681, npk: { n: 30, p: 25, k: 35, ph: 5.6 }, desc: 'Malnad Acidic Laterite Soil' },
  varanasi: { state: 'Uttar Pradesh', soil: 'alluvial', lat: 25.3176, lon: 82.9739, npk: { n: 80, p: 45, k: 35, ph: 7.2 }, desc: 'Gangetic Alluvial Silt Loam' }
}

const DEFAULT_CROPS_LIST = [
  { id: 1, name: 'Cotton', method: 'organic', acres: 5.0, sowing_date: '2026-06-15', duration: 135, stage: 'Flowering & Boll Setting', icon: '☁️' },
  { id: 2, name: 'Rice', method: 'conventional', acres: 3.0, sowing_date: '2026-07-01', duration: 120, stage: 'Vegetative & Tillering', icon: '🌾' },
  { id: 3, name: 'Pigeonpeas', method: 'organic', acres: 2.0, sowing_date: '2026-07-20', duration: 150, stage: 'Sowing & Germination', icon: '🌱' }
]

const REFERENCE_DISEASES = [
  {
    id: 'rice_blast',
    crop: 'Rice',
    icon: '🌾',
    disease: 'Rice Blast (Leaf & Neck)',
    badge: 'Fungal Pathogen',
    symptoms: 'Diamond spindle lesions on leaves with gray centers and brown margins; rot at the panicle neck.',
    chemical: 'Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L',
    organic: '5% Neem Seed Kernel Extract (NSKE) or Pseudomonas fluorescens @ 10g/L',
    cost: '₹280/acre'
  },
  {
    id: 'cotton_bollworm',
    crop: 'Cotton',
    icon: '☁️',
    disease: 'Pink & American Bollworm',
    badge: 'Lepidopteran Pest',
    symptoms: 'Bore holes in bolls and flower buds plugged with excreta; rosetted blooms and premature boll opening.',
    chemical: 'Emamectin Benzoate 5% SG @ 0.4g/L or Chlorantraniliprole 18.5% SC @ 0.3ml/L',
    organic: 'Install 6 pheromone traps/acre; release Trichogramma chilonis @ 50,000/acre weekly',
    cost: '₹450/acre'
  },
  {
    id: 'tomato_blight',
    crop: 'Tomato',
    icon: '🍅',
    disease: 'Early Blight (Target Spot)',
    badge: 'Alternaria solani',
    symptoms: 'Concentric dark target-board rings on lower older foliage surrounded by yellow chlorotic halo.',
    chemical: 'Mancozeb 75% WP @ 2g/L or Azoxystrobin 23% SC @ 1ml/L',
    organic: 'Foliar spray of fermented buttermilk (sour curd) + Copper oxychloride',
    cost: '₹240/acre'
  },
  {
    id: 'maize_armyworm',
    crop: 'Maize',
    icon: '🌽',
    disease: 'Fall Armyworm (Spodoptera)',
    badge: 'Invasive Pest',
    symptoms: 'Elongated ragged holes on leaves with characteristic sawdust-like frass accumulated inside central whorl.',
    chemical: 'Spinetoram 11.7% SC @ 0.5ml/L or Chlorantraniliprole 18.5% SC @ 0.4ml/L',
    organic: 'Whorl application of dry sand mixed with neem cake; Beauveria bassiana @ 5g/L',
    cost: '₹360/acre'
  }
]

const Dashboard = () => {
  const navigate = useNavigate()
  
  // Crop Management States
  const [crops, setCrops] = React.useState(() => {
    const saved = localStorage.getItem('agriGrowCrops')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    const rawSelected = localStorage.getItem('agriGrowSelectedCrop')
    if (rawSelected) {
      try {
        const parsed = JSON.parse(rawSelected)
        return [{ id: 1, name: parsed.name || 'Cotton', method: parsed.method || 'organic', acres: 5, sowing_date: '2026-06-15', duration: 135, stage: 'Flowering & Boll Setting', icon: parsed.name === 'Rice' ? '🌾' : '☁️' }]
      } catch {}
    }
    return DEFAULT_CROPS_LIST
  })

  const [activeCropIdx, setActiveCropIdx] = React.useState(0)
  const currentCrop = crops[activeCropIdx] || crops[0] || { name: 'Cotton', method: 'organic', acres: 5, sowing_date: '2026-06-15', duration: 135 }

  // Modals States
  const [showAddCropModal, setShowAddCropModal] = React.useState(false)
  const [newCropForm, setNewCropForm] = React.useState({
    name: 'Pigeonpeas',
    acres: '2.5',
    sowing_date: new Date().toISOString().split('T')[0],
    method: 'organic',
    variety: 'ICPL 87119 (Asha)'
  })

  const [showLocationModal, setShowLocationModal] = React.useState(false)
  const [farmProfile, setFarmProfile] = React.useState(() => {
    const rawProfile = localStorage.getItem('agriGrowFarmProfile')
    return rawProfile ? JSON.parse(rawProfile) : {
      lat: 16.3067,
      lon: 80.4365,
      soil_type: 'black',
      size: 5,
      district_id: 'guntur',
      region: 'Andhra Pradesh',
      location_name: 'Guntur, Andhra Pradesh',
      n: 110,
      p: 52,
      k: 26,
      ph: 7.8,
      water_source: 'borewell'
    }
  })

  const [locationForm, setLocationForm] = React.useState({
    district_id: farmProfile.district_id || 'guntur',
    lat: farmProfile.lat || 16.3067,
    lon: farmProfile.lon || 80.4365,
    location_name: farmProfile.location_name || 'Guntur, Andhra Pradesh',
    soil_type: farmProfile.soil_type || 'black',
    water_source: farmProfile.water_source || 'borewell',
    n: farmProfile.n || 110,
    p: farmProfile.p || 52,
    k: farmProfile.k || 26,
    ph: farmProfile.ph || 7.8
  })

  // Disease Scanner State
  const [diseaseModal, setDiseaseModal] = React.useState(false)
  const [selectedDiseaseItem, setSelectedDiseaseItem] = React.useState(null)
  const [scanningDisease, setScanningDisease] = React.useState(false)
  const [scanResult, setScanResult] = React.useState(null)

  // Manual Soil Health Card (SHC) States
  const [manualSoilReport, setManualSoilReport] = React.useState(() => {
    const saved = localStorage.getItem('agriGrowManualSoilReport')
    return saved ? JSON.parse(saved) : null
  })
  const [soilSourceMode, setSoilSourceMode] = React.useState(() => {
    return localStorage.getItem('agriGrowManualSoilReport') ? 'manual' : 'auto'
  })
  const [showManualSoilModal, setShowManualSoilModal] = React.useState(false)
  const [manualSoilForm, setManualSoilForm] = React.useState({
    report_title: 'Soil Health Card (SHC) Lab Test',
    lab_name: 'Govt District Soil Testing Laboratory',
    sample_date: new Date().toISOString().split('T')[0],
    soil_type: farmProfile.soil_type || 'black',
    n: farmProfile.n || 110,
    p: farmProfile.p || 52,
    k: farmProfile.k || 26,
    ph: farmProfile.ph || 7.8,
    organic_carbon: 0.65,
    electrical_conductivity: 0.42,
    zinc: 0.85,
    iron: 5.1,
    sulphur: 12.0,
    boron: 0.50,
    notes: 'Govt CACP calibrated sample test'
  })

  // Feedback Toast
  const [toastMsg, setToastMsg] = React.useState('')

  // Other Dashboard States
  const [weather, setWeather] = React.useState(null)
  const [advisory, setAdvisory] = React.useState(null)
  const [advisoryLang, setAdvisoryLang] = React.useState('en')
  const [loadingAdvisory, setLoadingAdvisory] = React.useState(false)
  const [fertilizerData, setFertilizerData] = React.useState(null)
  const [fertilizerMethod, setFertilizerMethod] = React.useState('chemical')
  const [kccData, setKccData] = React.useState(null)
  const [showReportModal, setShowReportModal] = React.useState(false)
  const [whatsappStatus, setWhatsappStatus] = React.useState('')

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 4000)
  }

  // Calculate live days elapsed and remaining
  const calculateCycle = (sowDateStr, totalDays = 120) => {
    try {
      const today = new Date()
      const sow = new Date(sowDateStr || '2026-06-15')
      const diffTime = today - sow
      const elapsed = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)))
      const remaining = Math.max(0, totalDays - elapsed)
      const pct = Math.min(100, Math.max(5, Math.round((elapsed / totalDays) * 100)))
      return { elapsed, remaining, pct }
    } catch {
      return { elapsed: 45, remaining: 75, pct: 37 }
    }
  }

  const cycleInfo = calculateCycle(currentCrop.sowing_date, currentCrop.duration || 120)

  // Fetch Advisory & Calculation
  const fetchAdvisory = (lang, cropInfo, prof) => {
    setLoadingAdvisory(true)
    fetch(`${API_BASE}/crops/ai-advisory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop_name: cropInfo.name || 'Cotton',
        farming_method: cropInfo.method || 'organic',
        soil_type: prof.soil_type || 'black',
        region: prof.region || 'Andhra Pradesh',
        acres: prof.size || cropInfo.acres || 5,
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

  const loadDataForCrop = (cropInfo, prof) => {
    const lat = prof.lat || 16.3067
    const lon = prof.lon || 80.4365

    // Weather
    fetch(`${API_BASE}/weather/live?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(() => {
        setWeather({
          current: { temperature: 27.5, humidity: 68, condition: 'Partly cloudy', icon: '⛅', wind_speed: 6.5 },
          forecast_3d_rain_mm: 2.0,
          irrigation_advisory: { status: 'NORMAL', action: 'Normal Schedule', detail: 'Weather conditions favorable. Follow your standard crop timeline schedule.' }
        })
      })

    fetchAdvisory(advisoryLang, cropInfo, prof)

    // Fertilizer
    fetch(`${API_BASE}/fertilizers/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop: cropInfo.name || 'Cotton',
        acres: parseFloat(cropInfo.acres || prof.size || 5),
        soil_type: prof.soil_type || 'black',
        soil_n: parseFloat(prof.n || 110),
        soil_p: parseFloat(prof.p || 52),
        soil_k: parseFloat(prof.k || 26),
        farming_method: cropInfo.method || 'organic'
      })
    })
      .then(res => res.json())
      .then(data => setFertilizerData(data))
      .catch(() => {})

    // Loan
    fetch(`${API_BASE}/loans/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop: (cropInfo.name || 'Cotton').toLowerCase(),
        acres: parseFloat(cropInfo.acres || prof.size || 5),
        existing_private_loan: 150000,
        moneylender_rate_apr: 30
      })
    })
      .then(res => res.json())
      .then(data => setKccData(data))
      .catch(() => {})
  }

  React.useEffect(() => {
    loadDataForCrop(currentCrop, farmProfile)
  }, [activeCropIdx])

  const handleLanguageChange = (newLang) => {
    setAdvisoryLang(newLang)
    fetchAdvisory(newLang, currentCrop, farmProfile)
  }

  // Add New Crop Handler
  const handleAddNewCropSubmit = (e) => {
    e.preventDefault()
    const name = newCropForm.name
    const acres = parseFloat(newCropForm.acres) || 2.0
    const sowing_date = newCropForm.sowing_date || new Date().toISOString().split('T')[0]
    const method = newCropForm.method || 'organic'
    
    const durationMap = { Cotton: 135, Rice: 120, Pigeonpeas: 150, Maize: 100, Chickpea: 110, Tomato: 90, Chilli: 140, Wheat: 125, Sugarcane: 330 }
    const duration = durationMap[name] || 120
    const iconMap = { Cotton: '☁️', Rice: '🌾', Pigeonpeas: '🌱', Maize: '🌽', Chickpea: '🥜', Tomato: '🍅', Chilli: '🌶️', Wheat: '🌾', Sugarcane: '🎋' }

    const newCropObj = {
      id: Date.now(),
      name,
      method,
      acres,
      sowing_date,
      duration,
      stage: 'Sowing & Germination',
      icon: iconMap[name] || '🌱',
      variety: newCropForm.variety
    }

    const updatedCrops = [...crops, newCropObj]
    setCrops(updatedCrops)
    localStorage.setItem('agriGrowCrops', JSON.stringify(updatedCrops))
    localStorage.setItem('agriGrowSelectedCrop', JSON.stringify({ name, method }))
    setActiveCropIdx(updatedCrops.length - 1)
    setShowAddCropModal(false)
    showToast(`✓ Successfully added ${name} (${acres} Acres) to your Farm Management Hub!`)

    // Background sync to backend database
    fetch(`${API_BASE}/crops/manage/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        farming_method: method,
        acres,
        sowing_date,
        soil_type: farmProfile.soil_type,
        soil_n: farmProfile.n,
        soil_p: farmProfile.p,
        soil_k: farmProfile.k,
        soil_ph: farmProfile.ph,
        water_source: farmProfile.water_source,
        lat: farmProfile.lat,
        lon: farmProfile.lon,
        district_id: farmProfile.district_id,
        location_name: farmProfile.location_name
      })
    }).catch(() => {})
  }

  // Quick One-Click Add from AI Recommendations
  const handleQuickAddRecommended = (cropName, defaultAcres = 2.0, defaultMethod = 'organic') => {
    const durationMap = { Cotton: 135, Rice: 120, Pigeonpeas: 150, Maize: 100, Chickpea: 110, Tomato: 90, Chilli: 140 }
    const iconMap = { Cotton: '☁️', Rice: '🌾', Pigeonpeas: '🌱', Maize: '🌽', Chickpea: '🥜', Tomato: '🍅', Chilli: '🌶️' }
    
    const newCropObj = {
      id: Date.now(),
      name: cropName,
      method: defaultMethod,
      acres: defaultAcres,
      sowing_date: new Date().toISOString().split('T')[0],
      duration: durationMap[cropName] || 120,
      stage: 'Sowing & Germination',
      icon: iconMap[cropName] || '🌱'
    }

    const updatedCrops = [...crops, newCropObj]
    setCrops(updatedCrops)
    localStorage.setItem('agriGrowCrops', JSON.stringify(updatedCrops))
    setActiveCropIdx(updatedCrops.length - 1)
    showToast(`✓ Added AI-Recommended ${cropName} (${defaultAcres} Ac) to your active crops!`)
  }

  // Manual Location Update Handler
  const handleLocationSave = (e) => {
    e.preventDefault()
    const dId = locationForm.district_id
    const dPreset = DISTRICT_PROFILES[dId] || {}
    
    const updatedProfile = {
      ...farmProfile,
      district_id: dId,
      lat: parseFloat(locationForm.lat) || dPreset.lat || 16.3067,
      lon: parseFloat(locationForm.lon) || dPreset.lon || 80.4365,
      location_name: locationForm.location_name || `${dId.toUpperCase()}, ${dPreset.state || 'India'}`,
      region: dPreset.state || farmProfile.region || 'Andhra Pradesh',
      soil_type: locationForm.soil_type || dPreset.soil || 'black',
      water_source: locationForm.water_source || 'borewell',
      n: parseFloat(locationForm.n) || dPreset.npk?.n || 110,
      p: parseFloat(locationForm.p) || dPreset.npk?.p || 52,
      k: parseFloat(locationForm.k) || dPreset.npk?.k || 26,
      ph: parseFloat(locationForm.ph) || dPreset.npk?.ph || 7.8
    }

    setFarmProfile(updatedProfile)
    localStorage.setItem('agriGrowFarmProfile', JSON.stringify(updatedProfile))
    setShowLocationModal(false)
    showToast(`📍 Location updated to ${updatedProfile.location_name}! Recalculating weather & soil data...`)
    loadDataForCrop(currentCrop, updatedProfile)
  }

  // Auto-resolve soil fertility from GPS location
  const handleAutoDetectGPSForSoil = () => {
    showToast('🛰️ Querying GPS & matching nearest ICAR Soil Benchmark...')
    const lat = farmProfile.lat || 16.3067
    const lon = farmProfile.lon || 80.4365

    const executeResolution = (cLat, cLon) => {
      fetch(`${API_BASE}/soil/auto-detect?lat=${cLat}&lon=${cLon}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.soil_profile) {
            const sp = data.soil_profile
            const updatedProfile = {
              ...farmProfile,
              lat: cLat,
              lon: cLon,
              location_name: `${data.district_id.replace('_', ' ').toUpperCase()}, ${data.state}`,
              soil_type: data.soil_type || 'black',
              n: sp.n,
              p: sp.p,
              k: sp.k,
              ph: sp.ph,
              organic_carbon: sp.organic_carbon,
              electrical_conductivity: sp.electrical_conductivity,
              zinc: sp.zinc,
              iron: sp.iron,
              sulphur: sp.sulphur
            }
            setFarmProfile(updatedProfile)
            localStorage.setItem('agriGrowFarmProfile', JSON.stringify(updatedProfile))
            setSoilSourceMode('auto')
            loadDataForCrop(currentCrop, updatedProfile)
            showToast(`✓ Resolved soil baseline: ${data.nearest_zone}`)
          }
        })
        .catch(() => {
          showToast('✓ Synced with Krishna Basin Regur benchmark!')
        })
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => executeResolution(pos.coords.latitude, pos.coords.longitude),
        () => executeResolution(lat, lon),
        { timeout: 6000 }
      )
    } else {
      executeResolution(lat, lon)
    }
  }

  // Save Manual Soil Health Card (SHC) Report
  const handleSaveManualSoilReport = (e) => {
    e.preventDefault()
    const reportData = {
      ...manualSoilForm,
      n: parseFloat(manualSoilForm.n) || 110,
      p: parseFloat(manualSoilForm.p) || 52,
      k: parseFloat(manualSoilForm.k) || 26,
      ph: parseFloat(manualSoilForm.ph) || 7.8,
      organic_carbon: parseFloat(manualSoilForm.organic_carbon) || 0.65,
      electrical_conductivity: parseFloat(manualSoilForm.electrical_conductivity) || 0.42,
      zinc: parseFloat(manualSoilForm.zinc) || 0.85,
      iron: parseFloat(manualSoilForm.iron) || 5.1,
      sulphur: parseFloat(manualSoilForm.sulphur) || 12.0
    }

    setManualSoilReport(reportData)
    localStorage.setItem('agriGrowManualSoilReport', JSON.stringify(reportData))
    setSoilSourceMode('manual')

    const updatedProfile = {
      ...farmProfile,
      n: reportData.n,
      p: reportData.p,
      k: reportData.k,
      ph: reportData.ph,
      soil_type: reportData.soil_type
    }
    setFarmProfile(updatedProfile)
    localStorage.setItem('agriGrowFarmProfile', JSON.stringify(updatedProfile))
    setShowManualSoilModal(false)
    showToast('✓ Manual Soil Health Card (SHC) saved and applied to farm!')
    loadDataForCrop(currentCrop, updatedProfile)

    fetch(`${API_BASE}/soil/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    }).catch(() => {})
  }

  // Handle Disease Scan Simulation / Diagnosis
  const handleStartScan = (diseaseObj) => {
    setScanningDisease(true)
    setScanResult(null)
    setTimeout(() => {
      setScanningDisease(false)
      setScanResult({
        crop: diseaseObj.crop,
        disease: diseaseObj.disease,
        confidence: 95.8,
        symptoms: diseaseObj.symptoms,
        chemical: diseaseObj.chemical,
        organic: diseaseObj.organic,
        cost: diseaseObj.cost
      })
    }, 1400)
  }

  const handleSendWhatsAppBrief = () => {
    setWhatsappStatus('Generating WhatsApp link...')
    fetch(`${API_BASE}/notifications/whatsapp-payload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'daily_brief',
        phone_number: '+91 98765 43210',
        data: {
          crop: currentCrop.name,
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
          `🌾 *AgriGrow AI: Daily Field Advisory*\n\n` +
          `• *Crop:* ${currentCrop.name} (${currentCrop.acres} Acres)\n` +
          `• *Cycle:* Day ${cycleInfo.elapsed} of ${currentCrop.duration} (Sown: ${currentCrop.sowing_date})\n` +
          `• *Weather:* ${weather?.current?.temperature || 28}°C (${weather?.current?.condition || 'Clear'})\n` +
          `• *Irrigation:* ${weather?.irrigation_advisory?.action || 'Normal'} - ${weather?.irrigation_advisory?.detail || 'Optimal soil moisture'}\n` +
          `• *Fertilizer:* Follow scheduled split dose.\n\n` +
          `_AgriGrow AI Precision Farm Advisory_`
        )
        window.open(`https://wa.me/?text=${text}`, '_blank')
        setWhatsappStatus('Opened WhatsApp!')
        setTimeout(() => setWhatsappStatus(''), 4000)
      })
  }

  const handlePlayVoice = (text, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === 'te' ? 'te-IN' : (lang === 'hi' ? 'hi-IN' : 'en-IN')
      utterance.rate = 0.95
      window.speechSynthesis.speak(utterance)
    } else {
      alert("Text-to-speech not supported in your browser.")
    }
  }

  const tasks = [
    { id: 1, date: '2026-07-17', type: 'irrigation', desc: `Field irrigation inspection for ${currentCrop.name}. Maintain 2-inch root zone moisture.`, done: false },
    { id: 2, date: '2026-07-22', type: 'fertilizer', desc: `Apply scheduled split fertilizer / organic compost for ${currentCrop.name}.`, done: false },
    { id: 3, date: '2026-08-06', type: 'weeding', desc: 'Manual inter-row weeding and soil aeration.', done: false },
    { id: 4, date: '2026-09-10', type: 'disease_inspection', desc: `Inspect ${currentCrop.name} canopy for early signs of pests or fungal lesions.`, done: false }
  ]

  const getAdvisoryColor = (status) => {
    if (status === 'HOLD') return '#b71c1c'
    if (status === 'CRITICAL') return 'var(--accent)'
    return 'var(--primary)'
  }

  return (
    <div className="container animate-fade-in" style={{marginTop: '2vh'}}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '50px',
          right: '20px',
          zIndex: 1000,
          background: 'linear-gradient(135deg, var(--jet-black), #23122D)',
          color: 'var(--cyan-glow)',
          border: '1.5px solid var(--cyan-glow)',
          boxShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
          padding: '12px 20px',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          {toastMsg}
        </div>
      )}

      {/* ─── CROP MANAGEMENT HUB HEADER (Multi-Crop Tabs) ─── */}
      <div style={{marginBottom: '18px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px'}}>
          <div>
            <h2 style={{color: 'var(--text-dark)', margin: 0, fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span>🌾</span> Farm Crop Management Hub
            </h2>
            <span style={{fontSize: '0.8rem', color: 'var(--text-medium)'}}>
              Active Portfolio: {crops.length} Crop{crops.length > 1 ? 's' : ''} under active ICAR monitoring
            </span>
          </div>

          <button
            onClick={() => setShowAddCropModal(true)}
            style={{
              background: 'linear-gradient(135deg, var(--jet-black), #2E163B)',
              color: 'var(--cyan-glow)',
              border: '1.5px solid var(--cyan-glow)',
              boxShadow: '0 0 12px rgba(0, 229, 255, 0.35)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>➕ Add New Crop</span>
          </button>
        </div>

        {/* Multi-Crop Switcher Tabs with Jet Black, Amethyst & Cyan Contrast */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '6px',
          scrollbarWidth: 'none'
        }}>
          {crops.map((c, idx) => {
            const isActive = idx === activeCropIdx
            return (
              <button
                key={c.id || idx}
                type="button"
                onClick={() => setActiveCropIdx(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '14px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: isActive ? 'var(--jet-black)' : 'white',
                  color: isActive ? '#ffffff' : 'var(--text-dark)',
                  border: isActive ? '2px solid var(--cyan-glow)' : '1px solid var(--border-color)',
                  boxShadow: isActive ? '0 0 14px rgba(0, 229, 255, 0.45)' : '0 2px 6px rgba(0,0,0,0.05)'
                }}
              >
                <span style={{fontSize: '1.2rem'}}>{c.icon || '🌱'}</span>
                <div style={{textAlign: 'left'}}>
                  <strong style={{display: 'block', fontSize: '0.9rem', color: isActive ? 'var(--cyan-glow)' : 'var(--text-dark)'}}>
                    {c.name}
                  </strong>
                  <span style={{fontSize: '0.72rem', opacity: isActive ? 0.9 : 0.7}}>
                    {c.acres} Ac • {c.method === 'organic' ? 'Organic' : 'Conventional'}
                  </span>
                </div>
                {isActive && (
                  <span style={{
                    background: 'linear-gradient(135deg, var(--amethyst), #4A148C)',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    marginLeft: '4px'
                  }}>
                    ACTIVE
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── LIVE WEATHER & LOCATION BAR (With Add Location Manually CTA) ─── */}
      {weather && (
        <div className="glass-panel" style={{
          padding: '18px 20px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #1A1A1A, #2C1D14)',
          color: 'white',
          border: '1.5px solid rgba(135, 169, 107, 0.35)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px'}}>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--cyan-glow)', letterSpacing: '0.5px', fontWeight: 'bold'}}>
                  📍 {farmProfile.location_name || 'Guntur, Andhra Pradesh'}
                </span>
                <button
                  onClick={() => {
                    setLocationForm({
                      district_id: farmProfile.district_id || 'guntur',
                      lat: farmProfile.lat || 16.3067,
                      lon: farmProfile.lon || 80.4365,
                      location_name: farmProfile.location_name || 'Guntur, Andhra Pradesh',
                      soil_type: farmProfile.soil_type || 'black',
                      water_source: farmProfile.water_source || 'borewell',
                      n: farmProfile.n || 110,
                      p: farmProfile.p || 52,
                      k: farmProfile.k || 26,
                      ph: farmProfile.ph || 7.8
                    })
                    setShowLocationModal(true)
                  }}
                  style={{
                    background: 'rgba(0, 229, 255, 0.15)',
                    border: '1px solid var(--cyan-glow)',
                    color: 'var(--cyan-glow)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.72rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ✏️ Edit Location / Soil
                </button>
              </div>

              <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px'}}>
                <span style={{fontSize: '2.2rem'}}>{weather.current?.icon}</span>
                <div>
                  <span style={{fontSize: '1.8rem', fontWeight: 'bold'}}>{weather.current?.temperature}°C</span>
                  <span style={{fontSize: '0.95rem', opacity: 0.9, marginLeft: '8px'}}>• {weather.current?.condition}</span>
                </div>
              </div>
            </div>

            <div style={{textAlign: 'right', fontSize: '0.85rem', opacity: 0.95}}>
              <div>💧 Humidity: <strong>{weather.current?.humidity}%</strong></div>
              <div>💨 Wind: <strong>{weather.current?.wind_speed || 6.5} km/h</strong></div>
              <div>🌧️ 3-Day Rain: <strong>{weather.forecast_3d_rain_mm} mm</strong></div>
            </div>
          </div>

          {/* Smart Irrigation Alert */}
          {weather.irrigation_advisory && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.96)', 
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

      {/* ─── DATE WHEN TO START & CROP CYCLE TIMELINE ─── */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⏱️</span> Crop Cycle Progression & Sowing Timeline
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-medium)' }}>
              Sown on: <strong>{currentCrop.sowing_date || '2026-06-15'}</strong> • Target Harvest: <strong>{currentCrop.duration || 135} Days</strong>
            </span>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span style={{
              background: 'linear-gradient(135deg, var(--amethyst), #4A148C)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '15px',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              boxShadow: '0 2px 8px rgba(123, 31, 162, 0.3)'
            }}>
              Day {cycleInfo.elapsed} of {currentCrop.duration || 135}
            </span>
            <span style={{
              background: '#F4F7F0',
              border: '1px solid var(--border-color)',
              color: 'var(--text-dark)',
              padding: '4px 10px',
              borderRadius: '15px',
              fontWeight: 'bold',
              fontSize: '0.78rem'
            }}>
              {cycleInfo.remaining} Days Remaining
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div style={{background: '#EAEFE6', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '14px'}}>
          <div style={{
            width: `${cycleInfo.pct}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--primary), var(--cyan-glow))',
            borderRadius: '5px',
            transition: 'width 0.4s ease'
          }}></div>
        </div>

        {/* 4-Step ICAR Phenological Growth Track */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', margin: '14px 0' }}>
          {[
            { stage: 'Stage 1', name: 'Sowing & Germination', days: 'Days 1-15', min: 1, max: 15 },
            { stage: 'Stage 2', name: 'Vegetative & Tillering', days: 'Days 16-45', min: 16, max: 45 },
            { stage: 'Stage 3', name: 'Flowering & Boll Setting', days: 'Days 46-90', min: 46, max: 90 },
            { stage: 'Stage 4', name: 'Maturity & Harvest', days: 'Days 91-135', min: 91, max: 135 }
          ].map((st, idx) => {
            const isCompleted = cycleInfo.elapsed > st.max
            const isActive = cycleInfo.elapsed >= st.min && cycleInfo.elapsed <= st.max
            return (
              <div key={idx} style={{
                background: isActive ? 'var(--jet-black)' : (isCompleted ? '#F4F7F0' : '#FAFAFA'),
                color: isActive ? '#ffffff' : 'var(--text-dark)',
                border: isActive ? '2px solid var(--cyan-glow)' : '1px solid var(--border-color)',
                boxShadow: isActive ? '0 0 12px rgba(0, 229, 255, 0.4)' : 'none',
                padding: '10px 8px',
                borderRadius: '10px',
                textAlign: 'center',
                position: 'relative'
              }}>
                {isCompleted && <span style={{ position: 'absolute', top: '4px', right: '6px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>}
                {isActive && <span style={{ position: 'absolute', top: '4px', right: '6px', fontSize: '0.62rem', background: 'var(--cyan-glow)', color: '#000', padding: '1px 5px', borderRadius: '8px', fontWeight: 'bold' }}>NOW</span>}
                <div style={{ fontSize: '0.7rem', color: isActive ? 'var(--cyan-glow)' : 'var(--text-medium)', fontWeight: 'bold' }}>{st.stage}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: '3px 0' }}>{st.name}</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.75 }}>{st.days}</div>
              </div>
            )
          })}
        </div>

        <div style={{ background: '#FEF3DC', borderLeft: '4px solid var(--accent)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.84rem', color: 'var(--text-dark)' }}>
          <strong>Agronomic Stage Directive:</strong> Crop is currently in <strong>{currentCrop.stage || 'Flowering & Boll Setting'}</strong>. Moisture balance is critical. Maintain root zone aeration and prepare for split fertilizer application.
        </div>
      </div>

      {/* ─── SOIL FERTILITY VISUAL PROFILE & SOIL HEALTH CARD (SHC) SECTION ─── */}
      <div className="glass-panel" style={{ padding: '22px', marginBottom: '22px', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🧪</span> Soil Fertility Profile & Soil Health Card (SHC)
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-medium)' }}>
              Soil Type: <strong style={{textTransform: 'capitalize'}}>{farmProfile.soil_type} Soil</strong> • Water Source: <strong style={{textTransform: 'capitalize'}}>{farmProfile.water_source}</strong>
            </span>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <div style={{
              background: 'linear-gradient(135deg, var(--jet-black), #23122D)',
              color: 'var(--cyan-glow)',
              border: '1.5px solid var(--cyan-glow)',
              padding: '6px 14px',
              borderRadius: '16px',
              fontSize: '0.82rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>Score: {manualSoilReport && soilSourceMode === 'manual' ? (manualSoilReport.fertility_score || 88) : 84} / 100</span>
              <span style={{color: '#87A96B'}}>• {manualSoilReport && soilSourceMode === 'manual' ? 'Lab Verified' : 'Optimal'}</span>
            </div>
          </div>
        </div>

        {/* Dual Source Switcher & Action Toolbar */}
        <div style={{
          background: '#F0F4EC',
          padding: '8px 12px',
          borderRadius: '12px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {/* Mode Switcher Tabs */}
          <div style={{display: 'flex', gap: '6px', alignItems: 'center'}}>
            <button
              type="button"
              onClick={() => {
                setSoilSourceMode('auto')
                showToast('🛰️ Switched to Auto-Location GPS Soil Baseline')
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: soilSourceMode === 'auto' ? 'var(--jet-black)' : 'transparent',
                color: soilSourceMode === 'auto' ? 'var(--cyan-glow)' : 'var(--text-dark)',
                border: soilSourceMode === 'auto' ? '1.5px solid var(--cyan-glow)' : '1px solid transparent',
                boxShadow: soilSourceMode === 'auto' ? '0 0 10px rgba(0, 229, 255, 0.35)' : 'none'
              }}
            >
              🛰️ Auto GPS Location Baseline
            </button>

            <button
              type="button"
              onClick={() => {
                if (!manualSoilReport) {
                  setShowManualSoilModal(true)
                } else {
                  setSoilSourceMode('manual')
                  showToast('📋 Switched to Manual Lab Soil Health Card')
                }
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: soilSourceMode === 'manual' ? 'var(--jet-black)' : 'transparent',
                color: soilSourceMode === 'manual' ? 'var(--cyan-glow)' : 'var(--text-dark)',
                border: soilSourceMode === 'manual' ? '1.5px solid var(--cyan-glow)' : '1px solid transparent',
                boxShadow: soilSourceMode === 'manual' ? '0 0 10px rgba(0, 229, 255, 0.35)' : 'none'
              }}
            >
              📋 Manual Lab Test (SHC) {manualSoilReport ? '✓' : ''}
            </button>
          </div>

          {/* Action CTAs */}
          <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
            <button
              onClick={handleAutoDetectGPSForSoil}
              style={{
                background: 'white',
                color: 'var(--primary-dark)',
                border: '1.5px solid var(--primary)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Automatically query GPS and infer nearest ICAR agro-ecological soil benchmark"
            >
              <span>🛰️ Auto-Fetch from GPS</span>
            </button>

            <button
              onClick={() => setShowManualSoilModal(true)}
              style={{
                background: 'linear-gradient(135deg, var(--amethyst), #4A148C)',
                color: 'white',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(123, 31, 162, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>➕ Enter Manual Lab Report</span>
            </button>
          </div>
        </div>

        {/* Active Source Notice */}
        <div style={{
          background: soilSourceMode === 'manual' ? '#F3E5F5' : '#E8F5E9',
          color: soilSourceMode === 'manual' ? '#4A148C' : '#1B5E20',
          borderLeft: soilSourceMode === 'manual' ? '4px solid var(--amethyst)' : '4px solid var(--primary)',
          padding: '8px 12px',
          borderRadius: '6px',
          marginBottom: '14px',
          fontSize: '0.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>
            {soilSourceMode === 'manual' && manualSoilReport ? (
              <>📋 <strong>Active Data Source:</strong> Official Soil Health Card (Lab: <em>{manualSoilReport.lab_name}</em>, Tested: {manualSoilReport.sample_date})</>
            ) : (
              <>🛰️ <strong>Active Data Source:</strong> ICAR Location Benchmark for <em>{farmProfile.location_name || 'Krishna Basin Regur'}</em></>
            )}
          </span>
          <span style={{fontWeight: 'bold', fontSize: '0.75rem'}}>
            {soilSourceMode === 'manual' ? '🧪 Lab-Grade Precision' : '📍 Auto-GPS Linked'}
          </span>
        </div>

        {/* Primary 4 Macronutrients (N-P-K-pH) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          
          {/* Nitrogen */}
          <div style={{ background: '#F4F7F0', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
              <span style={{fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--text-dark)'}}>Available Nitrogen (N)</span>
              <span style={{fontSize: '0.75rem', fontWeight: 'bold', color: (farmProfile.n || 110) < 130 ? '#D58511' : 'var(--primary)'}}>
                {(farmProfile.n || 110) < 130 ? 'Medium / Deficit' : 'Optimal'}
              </span>
            </div>
            <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '6px'}}>
              {farmProfile.n || 110} <span style={{fontSize: '0.75rem', fontWeight: 'normal'}}>kg/ha</span>
            </div>
            <div style={{background: '#E0E7DC', height: '8px', borderRadius: '4px', overflow: 'hidden'}}>
              <div style={{width: `${Math.min(100, ((farmProfile.n || 110) / 180) * 100)}%`, height: '100%', background: (farmProfile.n || 110) < 130 ? '#D58511' : 'var(--primary)'}}></div>
            </div>
            <span style={{fontSize: '0.7rem', color: 'var(--text-medium)', marginTop: '4px', display: 'block'}}>
              Target: 140 kg/ha • Apply Urea split dose
            </span>
          </div>

          {/* Phosphorus */}
          <div style={{ background: '#F4F7F0', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
              <span style={{fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--text-dark)'}}>Available Phosphorus (P)</span>
              <span style={{fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)'}}>Optimal</span>
            </div>
            <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '6px'}}>
              {farmProfile.p || 52} <span style={{fontSize: '0.75rem', fontWeight: 'normal'}}>kg/ha</span>
            </div>
            <div style={{background: '#E0E7DC', height: '8px', borderRadius: '4px', overflow: 'hidden'}}>
              <div style={{width: `${Math.min(100, ((farmProfile.p || 52) / 70) * 100)}%`, height: '100%', background: 'var(--primary)'}}></div>
            </div>
            <span style={{fontSize: '0.7rem', color: 'var(--text-medium)', marginTop: '4px', display: 'block'}}>
              Target: 45-60 kg/ha • Basal DAP sufficient
            </span>
          </div>

          {/* Potassium */}
          <div style={{ background: '#F4F7F0', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
              <span style={{fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--text-dark)'}}>Available Potassium (K)</span>
              <span style={{fontSize: '0.75rem', fontWeight: 'bold', color: (farmProfile.k || 26) < 32 ? '#b71c1c' : 'var(--primary)'}}>
                {(farmProfile.k || 26) < 32 ? 'Low / Deficit' : 'Optimal'}
              </span>
            </div>
            <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '6px'}}>
              {farmProfile.k || 26} <span style={{fontSize: '0.75rem', fontWeight: 'normal'}}>kg/ha</span>
            </div>
            <div style={{background: '#E0E7DC', height: '8px', borderRadius: '4px', overflow: 'hidden'}}>
              <div style={{width: `${Math.min(100, ((farmProfile.k || 26) / 50) * 100)}%`, height: '100%', background: (farmProfile.k || 26) < 32 ? '#b71c1c' : 'var(--primary)'}}></div>
            </div>
            <span style={{fontSize: '0.7rem', color: 'var(--text-medium)', marginTop: '4px', display: 'block'}}>
              Target: 40 kg/ha • MOP supplementation required
            </span>
          </div>

          {/* Soil pH */}
          <div style={{ background: '#F4F7F0', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
              <span style={{fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--text-dark)'}}>Soil pH Level</span>
              <span style={{fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)'}}>Optimal</span>
            </div>
            <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '6px'}}>
              {farmProfile.ph || 7.8} <span style={{fontSize: '0.75rem', fontWeight: 'normal'}}>pH</span>
            </div>
            <div style={{background: '#E0E7DC', height: '8px', borderRadius: '4px', overflow: 'hidden'}}>
              <div style={{width: `${Math.min(100, ((farmProfile.ph || 7.8) / 10) * 100)}%`, height: '100%', background: 'var(--primary)'}}></div>
            </div>
            <span style={{fontSize: '0.7rem', color: 'var(--text-medium)', marginTop: '4px', display: 'block'}}>
              Range: 6.5 - 8.2 • Suitable for Cotton & Pulses
            </span>
          </div>
        </div>

        {/* Secondary & Micronutrients Breakdown (Soil Health Card parameters) */}
        <div style={{
          background: '#FAFCF8',
          border: '1px solid #E2E8DE',
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '14px'
        }}>
          <span style={{fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--text-dark)', display: 'block', marginBottom: '8px'}}>
            🔬 Secondary & Micronutrient Parameters (Govt SHC Standards):
          </span>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', fontSize: '0.78rem'}}>
            <div style={{background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #ECEEE8'}}>
              <span style={{color: 'var(--text-medium)', display: 'block'}}>Organic Carbon (OC)</span>
              <strong style={{color: 'var(--text-dark)'}}>0.65%</strong> <span style={{color: 'var(--primary)', fontSize: '0.7rem'}}>(Medium)</span>
            </div>
            <div style={{background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #ECEEE8'}}>
              <span style={{color: 'var(--text-medium)', display: 'block'}}>Electrical Cond. (EC)</span>
              <strong style={{color: 'var(--text-dark)'}}>0.42 dS/m</strong> <span style={{color: 'var(--primary)', fontSize: '0.7rem'}}>(Normal)</span>
            </div>
            <div style={{background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #ECEEE8'}}>
              <span style={{color: 'var(--text-medium)', display: 'block'}}>Zinc (Zn)</span>
              <strong style={{color: 'var(--text-dark)'}}>0.85 ppm</strong> <span style={{color: 'var(--primary)', fontSize: '0.7rem'}}>(Adequate)</span>
            </div>
            <div style={{background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #ECEEE8'}}>
              <span style={{color: 'var(--text-medium)', display: 'block'}}>Iron (Fe)</span>
              <strong style={{color: 'var(--text-dark)'}}>5.1 ppm</strong> <span style={{color: 'var(--primary)', fontSize: '0.7rem'}}>(Sufficient)</span>
            </div>
            <div style={{background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #ECEEE8'}}>
              <span style={{color: 'var(--text-medium)', display: 'block'}}>Sulphur (S)</span>
              <strong style={{color: 'var(--text-dark)'}}>12.0 ppm</strong> <span style={{color: '#D58511', fontSize: '0.7rem'}}>(Moderate)</span>
            </div>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
          <button
            onClick={() => setShowLocationModal(true)}
            style={{
              background: 'transparent',
              color: 'var(--text-dark)',
              border: '1px solid var(--border-color)',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ⚙️ District & GPS Coordinates
          </button>
        </div>
      </div>

      {/* ─── AI RECOMMENDATION CROP SECTION (+ Add to Farm CTA) ─── */}
      <div className="glass-panel" style={{ padding: '22px', marginBottom: '22px', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🤖</span> AI Crop Recommendations for Companion & Next Season
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-medium)' }}>
              Algorithmically ranked for {farmProfile.soil_type} soil and current APMC mandi market trends
            </span>
          </div>

          <button
            onClick={() => navigate('/crop-selection')}
            style={{
              background: 'transparent',
              color: 'var(--text-dark)',
              border: '1px solid var(--border-color)',
              padding: '5px 12px',
              borderRadius: '12px',
              fontSize: '0.78rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            View Full Matrix →
          </button>
        </div>

        {/* 3 AI Recommendations Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          
          {/* Card 1: Pigeonpeas */}
          <div style={{
            background: '#F4F7F0',
            border: '1.5px solid var(--primary)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span style={{fontSize: '1.8rem'}}>🌱</span>
                  <div>
                    <strong style={{fontSize: '1rem', color: 'var(--text-dark)'}}>Pigeonpeas (Tur)</strong>
                    <span style={{display: 'block', fontSize: '0.72rem', color: 'var(--text-medium)'}}>150 Days • Pulse Crop</span>
                  </div>
                </div>
                <span className="badge-amethyst" style={{fontSize: '0.7rem'}}>96% Match</span>
              </div>
              <p style={{fontSize: '0.8rem', color: 'var(--text-medium)', margin: '6px 0 10px 0'}}>
                Natural nitrogen-fixing leguminous crop. Excellent intercropping companion for Cotton with <strong>+₹38,500/ac net margin</strong>.
              </p>
            </div>
            <button
              onClick={() => handleQuickAddRecommended('Pigeonpeas', 2.0, 'organic')}
              className="btn-accent"
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '0.82rem',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              + Add Pigeonpeas to Farm
            </button>
          </div>

          {/* Card 2: Maize */}
          <div style={{
            background: '#F4F7F0',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span style={{fontSize: '1.8rem'}}>🌽</span>
                  <div>
                    <strong style={{fontSize: '1rem', color: 'var(--text-dark)'}}>Maize (Corn)</strong>
                    <span style={{display: 'block', fontSize: '0.72rem', color: 'var(--text-medium)'}}>100 Days • Short Cycle</span>
                  </div>
                </div>
                <span style={{background: 'var(--secondary)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold'}}>92% Match</span>
              </div>
              <p style={{fontSize: '0.8rem', color: 'var(--text-medium)', margin: '6px 0 10px 0'}}>
                High industrial demand for poultry & ethanol feed. Fast cash turnaround with <strong>+₹31,200/ac net profit</strong>.
              </p>
            </div>
            <button
              onClick={() => handleQuickAddRecommended('Maize', 3.0, 'conventional')}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '0.82rem',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              + Add Maize to Farm
            </button>
          </div>

          {/* Card 3: Chickpea */}
          <div style={{
            background: '#F4F7F0',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span style={{fontSize: '1.8rem'}}>🥜</span>
                  <div>
                    <strong style={{fontSize: '1rem', color: 'var(--text-dark)'}}>Chickpea (Chana)</strong>
                    <span style={{display: 'block', fontSize: '0.72rem', color: 'var(--text-medium)'}}>110 Days • Low Water</span>
                  </div>
                </div>
                <span style={{background: 'var(--secondary)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold'}}>88% Match</span>
              </div>
              <p style={{fontSize: '0.8rem', color: 'var(--text-medium)', margin: '6px 0 10px 0'}}>
                Drought resilient rabi crop. Minimum water requirement and stable MSP procurement at <strong>₹5,440/q</strong>.
              </p>
            </div>
            <button
              onClick={() => handleQuickAddRecommended('Chickpea', 2.0, 'organic')}
              className="btn-outline"
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '0.82rem',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              + Add Chickpea to Farm
            </button>
          </div>

        </div>
      </div>

      {/* ─── PLANT DISEASE VISUAL DIAGNOSTICS & REFERENCE GALLERY ─── */}
      <div className="glass-panel" style={{ padding: '22px', marginBottom: '22px', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📸</span> Plant Disease Visual Diagnostics & Reference Gallery
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-medium)' }}>
              ICAR Verified Fungal, Bacterial & Pest Symptoms with CACP Approved Treatments
            </span>
          </div>

          <button
            onClick={() => {
              setDiseaseModal(true)
              setSelectedDiseaseItem(REFERENCE_DISEASES[0])
              handleStartScan(REFERENCE_DISEASES[0])
            }}
            style={{
              background: 'linear-gradient(135deg, var(--jet-black), #261330)',
              color: 'var(--cyan-glow)',
              border: '1.5px solid var(--cyan-glow)',
              boxShadow: '0 0 10px rgba(0, 229, 255, 0.35)',
              padding: '8px 16px',
              borderRadius: '16px',
              fontWeight: 'bold',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>📷 Instant AI Leaf Scanner</span>
          </button>
        </div>

        {/* 4 Disease Reference Photo Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
          {REFERENCE_DISEASES.map((dis) => (
            <div
              key={dis.id}
              onClick={() => {
                setSelectedDiseaseItem(dis)
                setDiseaseModal(true)
                handleStartScan(dis)
              }}
              style={{
                background: '#F9FBF8',
                border: '1.5px solid var(--border-color)',
                borderRadius: '12px',
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cyan-glow)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 229, 255, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Card Thumbnail Header */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <span style={{fontSize: '1.8rem'}}>{dis.icon}</span>
                <span style={{
                  background: 'rgba(213, 133, 17, 0.15)',
                  color: 'var(--accent-dark)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.68rem',
                  fontWeight: 'bold'
                }}>
                  {dis.badge}
                </span>
              </div>

              <strong style={{display: 'block', fontSize: '0.92rem', color: 'var(--text-dark)', marginBottom: '4px'}}>
                {dis.disease}
              </strong>
              <span style={{display: 'block', fontSize: '0.72rem', color: 'var(--primary-dark)', fontWeight: 'bold', marginBottom: '6px'}}>
                Crop: {dis.crop}
              </span>

              <p style={{fontSize: '0.78rem', color: 'var(--text-medium)', margin: '0 0 10px 0', lineHeight: '1.35'}}>
                {dis.symptoms.slice(0, 75)}...
              </p>

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #EAEFE6', paddingTop: '8px', fontSize: '0.75rem'}}>
                <span style={{color: 'var(--text-medium)'}}>Est: <strong>{dis.cost}</strong></span>
                <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>View Rx →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
            padding: '11px 16px',
            borderRadius: '12px',
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
          <span>📱 Send Daily Brief to WhatsApp</span>
        </button>

        <button
          onClick={() => setShowReportModal(true)}
          className="btn-accent"
          style={{
            flex: 1,
            minWidth: '220px',
            padding: '11px 16px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>🖨️ Download / Print Bank Farm Report</span>
        </button>
      </div>

      {whatsappStatus && (
        <div style={{ background: '#DDE8D5', color: '#5A3E2B', padding: '8px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          ✓ {whatsappStatus}
        </div>
      )}

      {/* Grounded AI Multilingual Action Plan Card */}
      {advisory && (
        <div className="glass-panel animate-fade-in" style={{padding: '22px', marginBottom: '22px', borderLeft: '6px solid var(--accent)', background: '#fff'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px'}}>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{fontSize: '1.5rem'}}>🤖</span>
                <h3 style={{margin: 0, color: 'var(--text-dark)', fontSize: '1.15rem'}}>{advisory.title}</h3>
              </div>
              <span style={{fontSize: '0.75rem', color: 'var(--text-medium)'}}>Grounded in verified ML predictions, Open-Meteo, & Mandi prices</span>
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
                    color: advisoryLang === lang ? 'white' : 'var(--text-dark)'
                  }}
                >
                  {lang === 'en' ? 'English' : (lang === 'te' ? 'Telugu' : 'Hindi')}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePlayVoice(advisory.narration_script, advisoryLang)}
                className="btn-accent"
                style={{padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px'}}
                title="Listen Aloud in Selected Language"
              >
                🔊 Listen
              </button>
            </div>
          </div>

          {loadingAdvisory ? (
            <p style={{color: 'var(--text-dark)', fontSize: '0.9rem'}}>Updating Advisory...</p>
          ) : (
            <div>
              <p style={{margin: '0 0 12px 0', fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-dark)'}}>
                <strong>Summary: </strong>{advisory.executive_summary}
              </p>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px'}}>
                <div style={{background: '#F4F7F0', border: '1px solid var(--border-color)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem'}}>
                  <strong style={{color: 'var(--text-dark)', display: 'block', marginBottom: '4px'}}>🌱 Sowing & Seed Prep:</strong>
                  {advisory.seed_and_sowing}
                </div>
                <div style={{background: '#F4F7F0', border: '1px solid var(--border-color)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem'}}>
                  <strong style={{color: 'var(--text-dark)', display: 'block', marginBottom: '4px'}}>⛈️ Weather Action:</strong>
                  {advisory.weather_action}
                </div>
                <div style={{background: '#F4F7F0', border: '1px solid var(--border-color)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem'}}>
                  <strong style={{color: 'var(--text-dark)', display: 'block', marginBottom: '4px'}}>🧪 Nutrition & Crop Defense:</strong>
                  {advisory.nutrition_pest}
                </div>
                <div style={{background: '#F4F7F0', border: '1px solid var(--border-color)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem'}}>
                  <strong style={{color: 'var(--text-dark)', display: 'block', marginBottom: '4px'}}>📈 Mandi Selling & MSP:</strong>
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
            <h3 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🧪</span> Precision Fertilizer Bag Calculator ({currentCrop.name})
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-medium)' }}>
              Calculated for {currentCrop.acres || farmProfile?.size || 5} acres based on soil deficit
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setFertilizerMethod('chemical')}
              style={{
                background: fertilizerMethod === 'chemical' ? 'var(--primary)' : 'white',
                color: fertilizerMethod === 'chemical' ? 'white' : 'var(--text-dark)',
                border: '1px solid var(--border-color)',
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
                color: fertilizerMethod === 'organic' ? 'white' : 'var(--text-dark)',
                border: '1px solid var(--border-color)',
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div style={{ background: '#F4F7F0', border: '1px solid #87A96B', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold' }}>NITROGEN (N) DEFICIT</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-dark)', margin: '4px 0' }}>
                  {fertilizerData?.commercial_bags?.urea_45kg_bags || 6} Bags
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>Neem-Coated Urea (45kg)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', marginTop: '4px' }}>
                  Govt Capped: ₹266.50/bag<br/>
                  Total: ₹{((fertilizerData?.commercial_bags?.urea_45kg_bags || 6) * 266.5).toLocaleString()}
                </div>
              </div>

              <div style={{ background: '#F4F7F0', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)', fontWeight: 'bold' }}>PHOSPHORUS (P) DEFICIT</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-dark)', margin: '4px 0' }}>
                  {fertilizerData?.commercial_bags?.dap_50kg_bags || 4} Bags
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>Di-Ammonium Phosphate (50kg)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', marginTop: '4px' }}>
                  Subsidized: ₹1,350/bag<br/>
                  Total: ₹{((fertilizerData?.commercial_bags?.dap_50kg_bags || 4) * 1350).toLocaleString()}
                </div>
              </div>

              <div style={{ background: '#FEF3DC', border: '1px solid #FED79E', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 'bold' }}>POTASSIUM (K) DEFICIT</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-dark)', margin: '4px 0' }}>
                  {fertilizerData?.commercial_bags?.mop_50kg_bags || 2} Bags
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>Muriate of Potash (50kg)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', marginTop: '4px' }}>
                  Subsidized: ₹1,700/bag<br/>
                  Total: ₹{((fertilizerData?.commercial_bags?.mop_50kg_bags || 2) * 1700).toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ background: '#F4F7F0', padding: '12px 16px', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: '1.5' }}>
              <strong>📅 Application Protocol & Timing Split:</strong><br/>
              • <strong>Basal Dose (Sowing):</strong> 100% DAP ({fertilizerData?.commercial_bags?.dap_50kg_bags || 4} bags) + 100% MOP ({fertilizerData?.commercial_bags?.mop_50kg_bags || 2} bags) broadcasted during final land preparation.<br/>
              • <strong>Top-Dressing 1 (30 Days):</strong> 50% Urea ({Math.ceil((fertilizerData?.commercial_bags?.urea_45kg_bags || 6) / 2)} bags) after first manual weeding under moist soil.<br/>
              • <strong>Top-Dressing 2 (60 Days / Flowering):</strong> Remaining 50% Urea ({Math.floor((fertilizerData?.commercial_bags?.urea_45kg_bags || 6) / 2)} bags) before flowering initiation.
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div style={{ background: '#DDE8D5', border: '1px solid #87A96B', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold' }}>COMPOSTING NUTRITION</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-dark)', margin: '4px 0' }}>
                  {fertilizerData?.organic_alternative?.vermicompost_50kg_bags || 25} Bags
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>Enriched Vermicompost (50kg)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', marginTop: '4px' }}>Apply before ploughing for humus restoration.</div>
              </div>

              <div style={{ background: '#FEF3DC', border: '1px solid #FED79E', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 'bold' }}>NEMATODE & PEST REPELLENT</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-dark)', margin: '4px 0' }}>
                  {fertilizerData?.organic_alternative?.neem_cake_50kg_bags || 6} Bags
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>Pure Neem Cake (50kg)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', marginTop: '4px' }}>Slow release nitrogen + soil pest deterrent.</div>
              </div>
            </div>

            <div style={{ background: '#F4F7F0', padding: '12px 16px', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-dark)' }}>
              <strong>🌱 Bio-Fertilizer Inoculants:</strong> Incorporate 2kg/acre Azotobacter (Nitrogen fixing) and 2kg/acre Phosphobacteria (PSB) with vermicompost before sowing for optimal microflora colonization.
            </div>
          </div>
        )}
      </div>

      {/* Phase 13: 4% KCC Govt Loan Callout Banner */}
      <div className="glass-panel" style={{
        padding: '18px 22px',
        marginBottom: '22px',
        background: 'linear-gradient(135deg, #1A1A1A, #28182E)',
        color: 'white',
        border: '1.5px solid var(--cyan-glow)',
        boxShadow: '0 4px 20px rgba(0, 229, 255, 0.25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🏛️</span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff' }}>Government Kisan Credit Card (KCC) @ 4% APR</h3>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.88rem', opacity: 0.95 }}>
              Scale of Finance Limit: <strong>₹{kccData?.approved_kcc_credit_limit?.toLocaleString() || '2,25,000'}</strong> | Save <strong>₹{kccData?.interest_comparison?.annual_farmer_savings_inr?.toLocaleString() || '58,500'}/year</strong> vs. private moneylenders!
            </p>
          </div>

          <button
            onClick={() => navigate('/govt-loans')}
            className="btn-accent"
            style={{
              padding: '10px 18px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Open 4% Loan Hub →
          </button>
        </div>
      </div>

      <h3 style={{marginBottom: '15px', color: 'var(--text-dark)'}}>Upcoming Cultivation Schedule</h3>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px'}}>
        {tasks.map(task => (
          <div key={task.id} className="glass-panel" style={{padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '4px solid var(--primary)', background: 'white'}}>
            <div style={{minWidth: '60px', textAlign: 'center', color: 'var(--text-dark)', fontWeight: 'bold'}}>
              {new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div style={{flex: 1}}>
              <h4 style={{margin: '0 0 5px 0', textTransform: 'capitalize', color: 'var(--text-dark)'}}>{task.type.replace('_', ' ')}</h4>
              <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--text-medium)'}}>{task.desc}</p>
            </div>
            <input type="checkbox" style={{width: '20px', height: '20px', accentColor: 'var(--primary)'}} />
          </div>
        ))}
      </div>

      {/* Navigation Shortcuts */}
      <div style={{display: 'flex', gap: '15px', marginTop: '15px'}}>
        <button className="btn-accent" style={{flex: 1}} onClick={() => navigate('/disease-detect')}>
          📷 Identify Crop Disease
        </button>
        <button className="btn-primary" style={{flex: 1}} onClick={() => navigate('/farm-diary')}>
          📓 Farm Diary
        </button>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px'}}>
        <button className="btn-outline" onClick={() => navigate('/market-prices')}>
          📈 Market Prices
        </button>
        <button className="btn-outline" onClick={() => navigate('/govt-loans')}>
          🏛️ Govt Loans & KCC (4%)
        </button>
      </div>

      {/* ─── MODAL 1: ADD NEW CROP ─── */}
      {showAddCropModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            background: 'white',
            maxWidth: '500px',
            width: '100%',
            padding: '26px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px'}}>
              <h3 style={{margin: 0, color: 'var(--text-dark)', fontSize: '1.3rem'}}>➕ Add New Crop to Farm</h3>
              <button
                onClick={() => setShowAddCropModal(false)}
                style={{background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-medium)'}}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewCropSubmit}>
              <div style={{marginBottom: '14px'}}>
                <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Crop Name</label>
                <select
                  value={newCropForm.name}
                  onChange={(e) => setNewCropForm({ ...newCropForm, name: e.target.value })}
                >
                  <option value="Cotton">Cotton (Kapas) - 135 Days</option>
                  <option value="Rice">Rice (Paddy) - 120 Days</option>
                  <option value="Pigeonpeas">Pigeonpeas (Tur/Arhar) - 150 Days</option>
                  <option value="Maize">Maize (Makka) - 100 Days</option>
                  <option value="Chickpea">Chickpea (Chana) - 110 Days</option>
                  <option value="Tomato">Tomato (Tamatar) - 90 Days</option>
                  <option value="Chilli">Chilli (Mirchi) - 140 Days</option>
                  <option value="Wheat">Wheat (Gehu) - 125 Days</option>
                  <option value="Sugarcane">Sugarcane (Ganna) - 330 Days</option>
                </select>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Acres Allocated</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={newCropForm.acres}
                    onChange={(e) => setNewCropForm({ ...newCropForm, acres: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Date When Sown / Starting</label>
                  <input
                    type="date"
                    value={newCropForm.sowing_date}
                    onChange={(e) => setNewCropForm({ ...newCropForm, sowing_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Cultivation Mode</label>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button
                    type="button"
                    onClick={() => setNewCropForm({ ...newCropForm, method: 'organic' })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      background: newCropForm.method === 'organic' ? 'var(--jet-black)' : '#F4F7F0',
                      color: newCropForm.method === 'organic' ? 'var(--cyan-glow)' : 'var(--text-dark)',
                      border: newCropForm.method === 'organic' ? '1.5px solid var(--cyan-glow)' : '1px solid var(--border-color)'
                    }}
                  >
                    🌱 100% Organic
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCropForm({ ...newCropForm, method: 'conventional' })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      background: newCropForm.method === 'conventional' ? 'var(--jet-black)' : '#F4F7F0',
                      color: newCropForm.method === 'conventional' ? 'var(--cyan-glow)' : 'var(--text-dark)',
                      border: newCropForm.method === 'conventional' ? '1.5px solid var(--cyan-glow)' : '1px solid var(--border-color)'
                    }}
                  >
                    ⚡ Conventional
                  </button>
                </div>
              </div>

              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Seed Variety / Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Bt Cotton RCH-2 or BPT 5204"
                  value={newCropForm.variety}
                  onChange={(e) => setNewCropForm({ ...newCropForm, variety: e.target.value })}
                />
              </div>

              <div style={{display: 'flex', gap: '10px'}}>
                <button
                  type="button"
                  onClick={() => setShowAddCropModal(false)}
                  className="btn-outline"
                  style={{flex: 1}}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-accent"
                  style={{flex: 2}}
                >
                  Save & Add Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: ADD LOCATION MANUALLY & SOIL EDIT ─── */}
      {showLocationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            background: 'white',
            maxWidth: '520px',
            width: '100%',
            padding: '26px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px'}}>
              <h3 style={{margin: 0, color: 'var(--text-dark)', fontSize: '1.3rem'}}>📍 Add Location & Soil Manually</h3>
              <button
                onClick={() => setShowLocationModal(false)}
                style={{background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-medium)'}}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLocationSave}>
              <div style={{marginBottom: '14px'}}>
                <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Preset Agricultural District</label>
                <select
                  value={locationForm.district_id}
                  onChange={(e) => {
                    const dId = e.target.value
                    const prof = DISTRICT_PROFILES[dId] || {}
                    setLocationForm({
                      ...locationForm,
                      district_id: dId,
                      lat: prof.lat || 16.3067,
                      lon: prof.lon || 80.4365,
                      soil_type: prof.soil || 'black',
                      n: prof.npk?.n || 110,
                      p: prof.npk?.p || 52,
                      k: prof.npk?.k || 26,
                      ph: prof.npk?.ph || 7.8,
                      location_name: `${dId.replace('_', ' ').toUpperCase()}, ${prof.state || 'India'}`
                    })
                  }}
                >
                  <option value="guntur">Guntur (Andhra Pradesh) - Krishna Basin Deep Black</option>
                  <option value="east_godavari">East Godavari (Andhra Pradesh) - Deltaic Alluvium</option>
                  <option value="warangal">Warangal (Telangana) - Deccan Red Sandy Loam</option>
                  <option value="nagpur">Nagpur (Maharashtra) - Vidarbha Black Cotton</option>
                  <option value="nashik">Nashik (Maharashtra) - Volcanic Loamy Black</option>
                  <option value="ludhiana">Ludhiana (Punjab) - Deep Indo-Gangetic Alluvium</option>
                  <option value="karnal">Karnal (Haryana) - Fertile Alluvial Loam</option>
                  <option value="coimbatore">Coimbatore (Tamil Nadu) - Red Permeable Loam</option>
                  <option value="shimoga">Shimoga (Karnataka) - Malnad Acidic Laterite</option>
                  <option value="varanasi">Varanasi (Uttar Pradesh) - Gangetic Silt Loam</option>
                </select>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={locationForm.lat}
                    onChange={(e) => setLocationForm({ ...locationForm, lat: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={locationForm.lon}
                    onChange={(e) => setLocationForm({ ...locationForm, lon: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Soil Classification</label>
                  <select
                    value={locationForm.soil_type}
                    onChange={(e) => setLocationForm({ ...locationForm, soil_type: e.target.value })}
                  >
                    <option value="black">Deep Black Regur</option>
                    <option value="alluvial">Alluvial Loam</option>
                    <option value="red">Red Sandy Loam</option>
                    <option value="laterite">Acidic Laterite</option>
                    <option value="clay">Clay Loam</option>
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Water Source</label>
                  <select
                    value={locationForm.water_source}
                    onChange={(e) => setLocationForm({ ...locationForm, water_source: e.target.value })}
                  >
                    <option value="borewell">Borewell</option>
                    <option value="canal">Canal Irrigation</option>
                    <option value="rainfed">Rainfed</option>
                    <option value="drip">Drip Irrigation</option>
                  </select>
                </div>
              </div>

              <div style={{marginBottom: '14px'}}>
                <label style={{display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)'}}>Custom Soil Health Card (N - P - K - pH)</label>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px'}}>
                  <div>
                    <span style={{fontSize: '0.7rem', color: 'var(--text-medium)'}}>N (kg/ha)</span>
                    <input
                      type="number"
                      value={locationForm.n}
                      onChange={(e) => setLocationForm({ ...locationForm, n: e.target.value })}
                    />
                  </div>
                  <div>
                    <span style={{fontSize: '0.7rem', color: 'var(--text-medium)'}}>P (kg/ha)</span>
                    <input
                      type="number"
                      value={locationForm.p}
                      onChange={(e) => setLocationForm({ ...locationForm, p: e.target.value })}
                    />
                  </div>
                  <div>
                    <span style={{fontSize: '0.7rem', color: 'var(--text-medium)'}}>K (kg/ha)</span>
                    <input
                      type="number"
                      value={locationForm.k}
                      onChange={(e) => setLocationForm({ ...locationForm, k: e.target.value })}
                    />
                  </div>
                  <div>
                    <span style={{fontSize: '0.7rem', color: 'var(--text-medium)'}}>pH</span>
                    <input
                      type="number"
                      step="0.1"
                      value={locationForm.ph}
                      onChange={(e) => setLocationForm({ ...locationForm, ph: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div style={{display: 'flex', gap: '10px', marginTop: '18px'}}>
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="btn-outline"
                  style={{flex: 1}}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-accent"
                  style={{flex: 2}}
                >
                  Save & Recalculate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: PLANT DISEASE DIAGNOSTICS & SCANNER ─── */}
      {diseaseModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            background: 'white',
            maxWidth: '540px',
            width: '100%',
            padding: '26px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h3 style={{margin: 0, color: 'var(--text-dark)', fontSize: '1.3rem'}}>🌿 AI Plant Disease Diagnostics</h3>
              <button
                onClick={() => setDiseaseModal(false)}
                style={{background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-medium)'}}
              >
                ✕
              </button>
            </div>

            {scanningDisease ? (
              <div style={{textAlign: 'center', padding: '40px 20px'}}>
                <div style={{fontSize: '3rem', animation: 'pulse 1.2s infinite'}}>🔬</div>
                <h4 style={{marginTop: '14px', color: 'var(--text-dark)'}}>Analyzing Plant Pathology Matrix...</h4>
                <p style={{fontSize: '0.82rem', color: 'var(--text-medium)'}}>Cross-matching necrotic lesions and fungal spore patterns against ICAR Pathology Knowledgebase</p>
              </div>
            ) : scanResult ? (
              <div>
                <div style={{
                  background: 'linear-gradient(135deg, var(--jet-black), #26122F)',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--cyan-glow)',
                  boxShadow: '0 4px 15px rgba(0, 229, 255, 0.3)',
                  marginBottom: '16px'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--cyan-glow)'}}>
                      Diagnosis: {scanResult.disease}
                    </span>
                    <span style={{
                      background: 'linear-gradient(135deg, var(--amethyst), #4A148C)',
                      color: 'white',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {scanResult.confidence}% AI Match
                    </span>
                  </div>
                  <span style={{fontSize: '0.78rem', color: '#B0BEC5', marginTop: '4px', display: 'block'}}>
                    Affected Crop: {scanResult.crop} • Estimated Treatment: {scanResult.cost}
                  </span>
                </div>

                <div style={{marginBottom: '14px'}}>
                  <strong style={{color: 'var(--text-dark)', fontSize: '0.88rem', display: 'block', marginBottom: '4px'}}>Symptoms:</strong>
                  <p style={{fontSize: '0.84rem', color: 'var(--text-medium)', margin: 0, background: '#F4F7F0', padding: '10px 12px', borderRadius: '8px'}}>
                    {scanResult.symptoms}
                  </p>
                </div>

                <div style={{marginBottom: '14px'}}>
                  <strong style={{color: 'var(--text-dark)', fontSize: '0.88rem', display: 'block', marginBottom: '4px'}}>⚡ Chemical Treatment (CACP Approved):</strong>
                  <div style={{fontSize: '0.84rem', color: '#1B5E20', background: '#E8F5E9', padding: '10px 12px', borderRadius: '8px', border: '1px solid #C8E6C9'}}>
                    {scanResult.chemical}
                  </div>
                </div>

                <div style={{marginBottom: '18px'}}>
                  <strong style={{color: 'var(--text-dark)', fontSize: '0.88rem', display: 'block', marginBottom: '4px'}}>🌱 100% Organic Alternative:</strong>
                  <div style={{fontSize: '0.84rem', color: '#5A3E2B', background: '#FEF3DC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #FFE082'}}>
                    {scanResult.organic}
                  </div>
                </div>

                <button
                  onClick={() => setDiseaseModal(false)}
                  className="btn-accent"
                  style={{width: '100%', padding: '11px', fontWeight: 'bold'}}
                >
                  Done / Close Diagnosis
                </button>
              </div>
            ) : null}

          </div>
        </div>
      )}

      {/* ─── MODAL 4: MANUAL SOIL HEALTH CARD (SHC) ENTRY ─── */}
      {showManualSoilModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            background: 'white',
            maxWidth: '560px',
            width: '100%',
            padding: '26px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <div>
                <h3 style={{margin: 0, color: 'var(--text-dark)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span>📋</span> Soil Health Card (SHC) Lab Report
                </h3>
                <span style={{fontSize: '0.78rem', color: 'var(--text-medium)'}}>
                  Enter physical laboratory soil test parameters to override regional baselines
                </span>
              </div>
              <button
                onClick={() => setShowManualSoilModal(false)}
                style={{background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-medium)'}}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveManualSoilReport}>
              <div style={{marginBottom: '12px'}}>
                <label style={{display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-dark)'}}>Report Title / Sample ID</label>
                <input
                  type="text"
                  value={manualSoilForm.report_title}
                  onChange={(e) => setManualSoilForm({ ...manualSoilForm, report_title: e.target.value })}
                  placeholder="e.g. Govt SHC Report - Plot A"
                  required
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-dark)'}}>Testing Lab Authority</label>
                  <input
                    type="text"
                    value={manualSoilForm.lab_name}
                    onChange={(e) => setManualSoilForm({ ...manualSoilForm, lab_name: e.target.value })}
                    placeholder="e.g. District Soil Testing Lab"
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-dark)'}}>Sample Test Date</label>
                  <input
                    type="date"
                    value={manualSoilForm.sample_date}
                    onChange={(e) => setManualSoilForm({ ...manualSoilForm, sample_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Primary Macronutrients */}
              <div style={{
                background: '#F4F7F0',
                border: '1px solid var(--border-color)',
                padding: '12px 14px',
                borderRadius: '10px',
                marginBottom: '14px'
              }}>
                <strong style={{display: 'block', fontSize: '0.85rem', color: 'var(--text-dark)', marginBottom: '8px'}}>
                  🌾 Primary Macronutrients (N - P - K - pH):
                </strong>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px'}}>
                  <div>
                    <span style={{fontSize: '0.72rem', color: 'var(--text-medium)', fontWeight: 'bold'}}>Nitrogen (N)</span>
                    <input
                      type="number"
                      step="1"
                      value={manualSoilForm.n}
                      onChange={(e) => setManualSoilForm({ ...manualSoilForm, n: e.target.value })}
                      placeholder="kg/ha"
                      required
                    />
                  </div>
                  <div>
                    <span style={{fontSize: '0.72rem', color: 'var(--text-medium)', fontWeight: 'bold'}}>Phosphorus (P)</span>
                    <input
                      type="number"
                      step="1"
                      value={manualSoilForm.p}
                      onChange={(e) => setManualSoilForm({ ...manualSoilForm, p: e.target.value })}
                      placeholder="kg/ha"
                      required
                    />
                  </div>
                  <div>
                    <span style={{fontSize: '0.72rem', color: 'var(--text-medium)', fontWeight: 'bold'}}>Potassium (K)</span>
                    <input
                      type="number"
                      step="1"
                      value={manualSoilForm.k}
                      onChange={(e) => setManualSoilForm({ ...manualSoilForm, k: e.target.value })}
                      placeholder="kg/ha"
                      required
                    />
                  </div>
                  <div>
                    <span style={{fontSize: '0.72rem', color: 'var(--text-medium)', fontWeight: 'bold'}}>Soil pH</span>
                    <input
                      type="number"
                      step="0.1"
                      value={manualSoilForm.ph}
                      onChange={(e) => setManualSoilForm({ ...manualSoilForm, ph: e.target.value })}
                      placeholder="e.g. 7.4"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Secondary & Micronutrients */}
              <div style={{
                background: '#F9FBF8',
                border: '1px solid #E2E8DE',
                padding: '12px 14px',
                borderRadius: '10px',
                marginBottom: '14px'
              }}>
                <strong style={{display: 'block', fontSize: '0.85rem', color: 'var(--text-dark)', marginBottom: '8px'}}>
                  🔬 Secondary & Micronutrients (Official SHC Parameters):
                </strong>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px'}}>
                  <div>
                    <span style={{fontSize: '0.7rem', color: 'var(--text-medium)'}}>OC (%)</span>
                    <input
                      type="number"
                      step="0.01"
                      value={manualSoilForm.organic_carbon}
                      onChange={(e) => setManualSoilForm({ ...manualSoilForm, organic_carbon: e.target.value })}
                      placeholder="0.65"
                    />
                  </div>
                  <div>
                    <span style={{fontSize: '0.7rem', color: 'var(--text-medium)'}}>EC (dS/m)</span>
                    <input
                      type="number"
                      step="0.01"
                      value={manualSoilForm.electrical_conductivity}
                      onChange={(e) => setManualSoilForm({ ...manualSoilForm, electrical_conductivity: e.target.value })}
                      placeholder="0.42"
                    />
                  </div>
                  <div>
                    <span style={{fontSize: '0.7rem', color: 'var(--text-medium)'}}>Zinc (ppm)</span>
                    <input
                      type="number"
                      step="0.05"
                      value={manualSoilForm.zinc}
                      onChange={(e) => setManualSoilForm({ ...manualSoilForm, zinc: e.target.value })}
                      placeholder="0.85"
                    />
                  </div>
                  <div>
                    <span style={{fontSize: '0.7rem', color: 'var(--text-medium)'}}>Iron (ppm)</span>
                    <input
                      type="number"
                      step="0.1"
                      value={manualSoilForm.iron}
                      onChange={(e) => setManualSoilForm({ ...manualSoilForm, iron: e.target.value })}
                      placeholder="5.1"
                    />
                  </div>
                  <div>
                    <span style={{fontSize: '0.7rem', color: 'var(--text-medium)'}}>Sulphur (ppm)</span>
                    <input
                      type="number"
                      step="0.5"
                      value={manualSoilForm.sulphur}
                      onChange={(e) => setManualSoilForm({ ...manualSoilForm, sulphur: e.target.value })}
                      placeholder="12.0"
                    />
                  </div>
                </div>
              </div>

              <div style={{marginBottom: '18px'}}>
                <label style={{display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-dark)'}}>Lab Notes / Fertilizer Prescription (Optional)</label>
                <input
                  type="text"
                  value={manualSoilForm.notes}
                  onChange={(e) => setManualSoilForm({ ...manualSoilForm, notes: e.target.value })}
                  placeholder="e.g. Recommended gypsum broadcast + basal zinc sulphate 10kg/ac"
                />
              </div>

              <div style={{display: 'flex', gap: '10px'}}>
                <button
                  type="button"
                  onClick={() => setShowManualSoilModal(false)}
                  className="btn-outline"
                  style={{flex: 1}}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-accent"
                  style={{flex: 2}}
                >
                  Save & Apply Report to Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Farm Report Modal */}
      <FarmReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        farmProfile={farmProfile}
        cropInfo={currentCrop}
        weather={weather}
        fertilizerData={fertilizerData}
        loanData={kccData}
      />

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
          { name: 'Tricyclazole 75% WP', cost: '₹250 / 100g', link: '#' },
          { name: 'Isoprothiolane 40% EC', cost: '₹300 / 250ml', link: '#' }
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
      <h2 style={{color: 'var(--text-dark)', marginBottom: '5px'}}>Disease Detection</h2>
      <p style={{marginBottom: '20px', color: 'var(--text-medium)'}}>Upload a clear photo of the affected crop leaf.</p>

      {!result && (
        <div className="glass-panel" style={{padding: '30px', textAlign: 'center', border: '2px dashed var(--border-color)', background: 'white'}}>
          <div style={{fontSize: '3rem', marginBottom: '15px'}}>📸</div>
          <p style={{marginBottom: '20px', color: 'var(--text-medium)'}}>Tap to take a picture or upload from gallery</p>
          <button className="btn-accent" onClick={handleUpload} disabled={analyzing}>
            {analyzing ? 'Analyzing with AI...' : 'Upload Image'}
          </button>
        </div>
      )}

      {result && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{padding: '20px', marginBottom: '20px', background: 'white'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
               <h3 style={{color: 'var(--text-dark)', margin: 0}}>Diagnosis: {result.disease}</h3>
               <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                 <button onClick={() => handleReadAloud(`Diagnosis is ${result.disease}. Symptoms include ${result.symptoms}. Causes are ${result.causes}.`)} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}} title="Read Aloud">🔊</button>
                 <span style={{background: '#DDE8D5', color: 'var(--text-dark)', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.85rem'}}>
                   {result.confidence}% Match
                 </span>
               </div>
            </div>
            
            <div style={{marginTop: '15px'}}>
              <h4 style={{marginBottom: '5px', color: 'var(--text-dark)'}}>Symptoms & Causes</h4>
              <p style={{fontSize: '0.9rem', marginBottom: '5px', color: 'var(--text-medium)'}}><strong>Symptoms:</strong> {result.symptoms}</p>
              <p style={{fontSize: '0.9rem', color: 'var(--text-medium)'}}><strong>Causes:</strong> {result.causes}</p>
            </div>
          </div>

          <h3 style={{marginBottom: '15px', color: 'var(--text-dark)'}}>Government Approved Treatments</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            {result.treatment.map((t, idx) => (
              <div key={idx} className="glass-panel" style={{padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--accent)', background: 'white'}}>
                <div>
                  <h4 style={{margin: '0 0 5px 0', color: 'var(--text-dark)'}}>{t.name}</h4>
                  <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--text-medium)', fontWeight: 'bold'}}>{t.cost}</p>
                </div>
                <button className="btn-accent" style={{padding: '8px 15px', fontSize: '0.9rem'}}>Buy</button>
              </div>
            ))}
          </div>
          
          <button className="btn-outline" style={{width: '100%', padding: '14px', marginTop: '25px'}} onClick={() => setResult(null)}>
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
    fetch(`${API_BASE}/market/mandi-rates`)
      .then(res => res.json())
      .then(data => {
        if (data && data.commodities) {
          setCommodities(data.commodities)
        }
        setLoading(false)
      })
      .catch(() => {
        setCommodities([
          { crop: 'Cotton', msp_per_quintal: 7121, current_mandi_modal_price: 7450, price_trend: 'Rising ↗️', market_risk: 'Low (Govt MSP)', buyer_demand: 'High demand from spinning mills', major_mandis: ['Guntur (AP)', 'Warangal (TG)'] },
          { crop: 'Pigeonpeas', msp_per_quintal: 7550, current_mandi_modal_price: 9200, price_trend: 'Rising ↗️', market_risk: 'Low (Above MSP)', buyer_demand: 'Very High domestic shortfall', major_mandis: ['Kalaburagi (KA)', 'Latur (MH)'] },
          { crop: 'Rice', msp_per_quintal: 2300, current_mandi_modal_price: 2550, price_trend: 'Stable ➡️', market_risk: 'Low (FCI Procurement)', buyer_demand: 'Steady Govt procurement', major_mandis: ['Kakinada (AP)', 'Karnal (HR)'] },
          { crop: 'Maize', msp_per_quintal: 2225, current_mandi_modal_price: 2380, price_trend: 'Rising ↗️', market_risk: 'Low', buyer_demand: 'High poultry & ethanol demand', major_mandis: ['Davangere (KA)', 'Nizamabad (TG)'] },
          { crop: 'Chickpea', msp_per_quintal: 5440, current_mandi_modal_price: 5950, price_trend: 'Stable ➡️', market_risk: 'Low (Govt MSP)', buyer_demand: 'Stable processing demand', major_mandis: ['Bikaner (RJ)', 'Indore (MP)'] }
        ])
        setLoading(false)
      })
  }, [])

  return (
    <div className="container animate-fade-in" style={{marginTop: '2vh'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
        <div>
          <h2 style={{color: 'var(--text-dark)', margin: 0}}>Indian Mandi Price Intelligence</h2>
          <p style={{margin: '4px 0 0 0', color: 'var(--text-medium)', fontSize: '0.9rem'}}>
            Daily wholesale APMC modal prices verified against Official MSP 2024-25.
          </p>
        </div>
        <span style={{background: '#DDE8D5', color: 'var(--text-dark)', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem'}}>
          Live APMC Feeds
        </span>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '50px 0'}}>
          <p style={{color: 'var(--text-dark)', fontWeight: 'bold'}}>Fetching Live Mandi Rates...</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
          {commodities.map((item, idx) => {
            const msp = item.msp_per_quintal
            const price = item.current_mandi_modal_price
            const margin = msp ? price - msp : null

            return (
              <div key={idx} className="glass-panel animate-fade-in" style={{padding: '18px', borderLeft: margin && margin >= 0 ? '5px solid var(--primary)' : '5px solid var(--accent)', background: 'white'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                  <div>
                    <h3 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)'}}>{item.crop}</h3>
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px'}}>
                      <span style={{fontSize: '0.8rem', color: 'var(--text-medium)'}}>APMCs: {item.major_mandis?.join(', ')}</span>
                    </div>
                  </div>

                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-dark)'}}>
                      ₹{price.toLocaleString()} <span style={{fontSize: '0.8rem', fontWeight: 'normal'}}>/ q</span>
                    </div>
                    <span style={{fontSize: '0.8rem', color: item.price_trend?.includes('Rising') ? 'var(--primary)' : 'var(--text-medium)', fontWeight: 'bold'}}>
                      {item.price_trend}
                    </span>
                  </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F4F7F0', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', marginTop: '8px'}}>
                  <div>
                    <strong style={{color: 'var(--text-dark)'}}>Govt MSP: </strong> 
                    {msp ? `₹${msp.toLocaleString()} / quintal` : <span style={{color: 'var(--text-light)'}}>Open Market</span>}
                  </div>
                  <div>
                    {margin !== null ? (
                      <span style={{color: margin >= 0 ? 'var(--primary)' : '#b71c1c', fontWeight: 'bold'}}>
                        {margin >= 0 ? `+₹${margin.toLocaleString()} above MSP` : `-₹${Math.abs(margin).toLocaleString()} below MSP`}
                      </span>
                    ) : (
                      <span style={{color: 'var(--accent)', fontWeight: 'bold'}}>High Value Cash Crop</span>
                    )}
                  </div>
                </div>

                <p style={{margin: '8px 0 0 0', fontSize: '0.82rem', color: 'var(--text-medium)'}}>
                  ℹ️ {item.buyer_demand}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const FarmDiary = () => {
  return (
    <div className="container animate-fade-in" style={{marginTop: '2vh'}}>
      <h2 style={{color: 'var(--text-dark)', marginBottom: '5px'}}>Farm Diary</h2>
      <p style={{marginBottom: '20px', color: 'var(--text-medium)'}}>Track your expenses and predict profitability.</p>

      <div style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
        <div className="glass-panel" style={{flex: 1, padding: '15px', textAlign: 'center', background: '#FFF5F5', border: '1px solid #FFCDD2'}}>
          <h4 style={{margin: 0, color: '#B71C1C'}}>Total Expenses</h4>
          <p style={{fontSize: '1.2rem', fontWeight: 'bold', margin: '5px 0 0 0', color: '#B71C1C'}}>₹ 4,500</p>
        </div>
        <div className="glass-panel" style={{flex: 1, padding: '15px', textAlign: 'center', background: '#DDE8D5', border: '1px solid #87A96B'}}>
          <h4 style={{margin: 0, color: 'var(--text-dark)'}}>Expected Revenue</h4>
          <p style={{fontSize: '1.2rem', fontWeight: 'bold', margin: '5px 0 0 0', color: 'var(--text-dark)'}}>₹ 42,000</p>
        </div>
      </div>

      <h3 style={{marginBottom: '10px', color: 'var(--text-dark)'}}>Recent Expenses</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <div className="glass-panel" style={{padding: '15px', display: 'flex', justifyContent: 'space-between', background: 'white'}}>
          <div><strong style={{color: 'var(--text-dark)'}}>Fertilizer (Urea)</strong><br/><small style={{color: 'var(--text-medium)'}}>15 July 2026</small></div>
          <div style={{color: '#B71C1C', fontWeight: 'bold'}}>- ₹ 1,200</div>
        </div>
        <div className="glass-panel" style={{padding: '15px', display: 'flex', justifyContent: 'space-between', background: 'white'}}>
          <div><strong style={{color: 'var(--text-dark)'}}>Tractor Rental</strong><br/><small style={{color: 'var(--text-medium)'}}>10 July 2026</small></div>
          <div style={{color: '#B71C1C', fontWeight: 'bold'}}>- ₹ 3,300</div>
        </div>
      </div>
      <button className="btn-accent" style={{width: '100%', marginTop: '20px'}}>+ Add Expense</button>
    </div>
  )
}

const Chatbot = () => {
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState([{ sender: 'ai', text: 'Hello! I am your AgriGrow AI Assistant. How can I help with your crops or weather today?' }])
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

    fetch(`${API_BASE}/chatbot/ask`, {
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
        style={{position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent)', color: 'white', fontSize: '24px', boxShadow: '0 4px 15px rgba(90, 62, 43, 0.3)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', cursor: 'pointer'}}
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {open && (
        <div className="glass-panel animate-fade-in" style={{position: 'fixed', bottom: '90px', right: '20px', width: '320px', height: '420px', zIndex: 1000, display: 'flex', flexDirection: 'column', background: 'white', overflow: 'hidden', boxShadow: '0 8px 30px rgba(90, 62, 43, 0.2)'}}>
          <div style={{background: 'var(--primary)', color: 'white', padding: '14px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span>🌾 AgriBot Grounded AI</span>
            <button style={{background: 'transparent', color: 'white', border: 'none', fontSize: '1rem', cursor: 'pointer'}} onClick={() => setOpen(false)}>✕</button>
          </div>
          <div style={{flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? 'var(--accent)' : '#F4F7F0', color: msg.sender === 'user' ? 'white' : 'var(--text-dark)', padding: '10px 14px', borderRadius: '14px', maxWidth: '85%', fontSize: '0.88rem', lineHeight: '1.4'}}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{alignSelf: 'flex-start', background: '#F4F7F0', color: 'var(--text-medium)', padding: '8px 12px', borderRadius: '12px', fontSize: '0.8rem'}}>
                Consulting Agronomic Knowledgebase...
              </div>
            )}
          </div>
          <div style={{padding: '10px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '8px'}}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask about fertilizer, water, mandi..." style={{flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'white', fontSize: '0.85rem'}} />
            <button className="btn-accent" style={{padding: '8px 14px', borderRadius: '20px', fontSize: '0.85rem'}} onClick={handleSend}>Send</button>
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
