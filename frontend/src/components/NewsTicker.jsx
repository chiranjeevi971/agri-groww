import React from 'react'
import { useNavigate } from 'react-router-dom'
import API_BASE from '../api'

const DEFAULT_NEWS = [
  { id: 'tn1', tag: 'KCC 4% APR', headline: 'NABARD: Kisan Credit Card interest rate capped at 4% with prompt repayment subvention. Apply with zero collateral up to ₹1.60L.' },
  { id: 'tn2', tag: 'PM-KUSUM 90%', headline: 'Solar Pump Scheme: Central & State govt subsidy up to 90% for 3HP-7.5HP solar irrigation pumps.' },
  { id: 'tn3', tag: 'AIF 3% REBATE', headline: 'Agriculture Infrastructure Fund: 3% interest subvention on farm mechanization, packhouses and solar dryers.' },
  { id: 'tn4', tag: 'FERTILIZER SUBSIDY', headline: 'Government Price Cap: Neem-Coated Urea 45kg fixed at ₹266.50/bag; DAP 50kg subsidized at ₹1,350/bag.' },
  { id: 'tn5', tag: 'PMFME 35%', headline: 'PM Micro Food Processing: 35% capital subsidy (up to ₹10 Lakhs) for chilli powder, oil expeller, and dal mills.' }
]

const NewsTicker = () => {
  const navigate = useNavigate()
  const [news, setNews] = React.useState(DEFAULT_NEWS)
  const [isPaused, setIsPaused] = React.useState(false)
  const [speed, setSpeed] = React.useState(180) // 180s = very slow, comfortable reading

  React.useEffect(() => {
    fetch(`${API_BASE}/loans/schemes`)
      .then(res => res.json())
      .then(data => {
        if (data && data.ticker_news && data.ticker_news.length > 0) {
          setNews(data.ticker_news)
        }
      })
      .catch(() => {
        // Keeps DEFAULT_NEWS on fallback
      })
  }, [])

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 999 }}>
      {/* Top Navigation Brand Bar (Matches Screenshot Header) */}
      <div style={{
        background: 'linear-gradient(90deg, #07152B, #0B1E3C 40%, #0B274F)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 18px',
        borderBottom: '1px solid rgba(216, 185, 107, 0.3)',
        boxShadow: '0 2px 12px rgba(11, 30, 60, 0.35)'
      }}>
        {/* Brand Logo & Name */}
        <div 
          onClick={() => navigate('/dashboard')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #E3B74E, #D19F38)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            boxShadow: '0 0 10px rgba(227, 183, 78, 0.45)'
          }}>
            🌾
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <strong style={{ fontSize: '1.15rem', color: '#E3B74E', letterSpacing: '-0.3px' }}>Agri-Grow</strong>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#CBD5E1', display: 'block', opacity: 0.9 }}>
              Smart Farming • Better Tomorrow
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsPaused(!isPaused)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: isPaused ? '#E3B74E' : '#E2E8F0',
              border: '1px solid rgba(227, 183, 78, 0.4)',
              padding: '6px 12px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s'
            }}
            title={isPaused ? "Resume Scrolling" : "Pause Scrolling"}
          >
            <span>{isPaused ? '▶ Play' : '⏸ Pause'}</span>
          </button>

          <button
            onClick={() => navigate('/govt-loans')}
            style={{
              background: 'linear-gradient(135deg, #E3B74E, #C99C32)',
              color: '#0B1E3C',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '20px',
              fontWeight: '800',
              fontSize: '0.78rem',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(227, 183, 78, 0.4)',
              whiteSpace: 'nowrap'
            }}
          >
            Explore 4X Loans →
          </button>
        </div>
      </div>

      {/* Slow Marquee Banner */}
      <div className="news-ticker-container" style={{
        background: '#07152B',
        display: 'flex',
        alignItems: 'center',
        height: '34px',
        overflow: 'hidden'
      }}>
        {/* Live Badge */}
        <div style={{
          background: 'linear-gradient(135deg, #0B274F, #07152B)',
          color: '#E3B74E',
          padding: '0 12px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          fontWeight: '800',
          fontSize: '0.72rem',
          letterSpacing: '0.5px',
          whiteSpace: 'nowrap',
          borderRight: '1px solid rgba(227, 183, 78, 0.4)',
          zIndex: 2,
          cursor: 'pointer'
        }} onClick={() => navigate('/govt-loans')}>
          <span style={{
            display: 'inline-block',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#E3B74E',
            marginRight: '6px',
            boxShadow: '0 0 6px #E3B74E',
            animation: 'pulse 1.5s infinite'
          }}></span>
          LIVE RADAR
        </div>

        {/* Marquee Animation */}
        <div 
          style={{
            flex: 1,
            overflow: 'hidden',
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/govt-loans')}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          title="Hover to pause or click to view Govt Schemes Hub"
        >
          <div 
            className="news-ticker-text" 
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              fontSize: '0.80rem',
              lineHeight: '34px',
              animationDuration: `${speed}s`,
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          >
            {news.concat(news).map((item, idx) => (
              <span key={idx} style={{ marginRight: '45px', display: 'inline-flex', alignItems: 'center' }}>
                <span style={{
                  background: 'rgba(227, 183, 78, 0.15)',
                  color: '#E3B74E',
                  border: '1px solid rgba(227, 183, 78, 0.4)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontSize: '0.70rem',
                  fontWeight: '700',
                  marginRight: '8px'
                }}>
                  {item.tag || 'GOVT UPDATE'}
                </span>
                <span style={{ color: '#F1F5F9' }}>{item.headline}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsTicker
