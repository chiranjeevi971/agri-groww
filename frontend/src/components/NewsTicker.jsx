import React from 'react'
import { useNavigate } from 'react-router-dom'
import API_BASE from '../api'

const DEFAULT_NEWS = [
  { id: 'tn1', tag: 'KCC 4% APR', headline: 'NABARD: Kisan Credit Card interest rate capped at 4% with prompt repayment subvention. Apply with zero collateral up to â‚¹1.60L.' },
  { id: 'tn2', tag: 'PM-KUSUM 90%', headline: 'Solar Pump Scheme: Central & State govt subsidy up to 90% for 3HP-7.5HP solar irrigation pumps.' },
  { id: 'tn3', tag: 'AIF 3% REBATE', headline: 'Agriculture Infrastructure Fund: 3% interest subvention on farm mechanization, packhouses and solar dryers.' },
  { id: 'tn4', tag: 'FERTILIZER SUBSIDY', headline: 'Government Price Cap: Neem-Coated Urea 45kg fixed at â‚¹266.50/bag; DAP 50kg subsidized at â‚¹1,350/bag.' },
  { id: 'tn5', tag: 'PMFME 35%', headline: 'PM Micro Food Processing: 35% capital subsidy (up to â‚¹10 Lakhs) for chilli powder, oil expeller, and dal mills.' }
]

const NewsTicker = () => {
  const navigate = useNavigate()
  const [news, setNews] = React.useState(DEFAULT_NEWS)

  React.useEffect(() => {
    fetch('${API_BASE}/loans/schemes')
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
    <div className="news-ticker-container" style={{
      position: 'sticky',
      top: 0,
      zIndex: 999,
      background: 'linear-gradient(90deg, #1b5e20, #0d3b13)',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '2px solid #ffd54f',
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      height: '38px',
      overflow: 'hidden'
    }}>
      {/* Live Badge */}
      <div style={{
        background: '#d32f2f',
        color: '#ffffff',
        padding: '0 12px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '0.78rem',
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
        boxShadow: '2px 0 6px rgba(0,0,0,0.3)',
        zIndex: 2,
        cursor: 'pointer'
      }} onClick={() => navigate('/govt-loans')}>
        <span style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#ffeb3b',
          marginRight: '6px',
          animation: 'pulse 1.5s infinite'
        }}></span>
        GOVT POLICY RADAR
      </div>

      {/* Marquee Animation */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
      }} onClick={() => navigate('/govt-loans')}>
        <div className="news-ticker-text" style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          fontSize: '0.82rem',
          lineHeight: '38px'
        }}>
          {news.concat(news).map((item, idx) => (
            <span key={idx} style={{ marginRight: '40px', display: 'inline-flex', alignItems: 'center' }}>
              <span style={{
                background: 'rgba(255, 213, 79, 0.25)',
                color: '#ffd54f',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 'bold',
                marginRight: '8px'
              }}>
                {item.tag || 'GOVT UPDATE'}
              </span>
              <span>{item.headline}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Action Shortcut */}
      <button 
        onClick={() => navigate('/govt-loans')}
        style={{
          background: '#ffd54f',
          color: '#1b5e20',
          border: 'none',
          padding: '0 14px',
          height: '100%',
          fontWeight: 'bold',
          fontSize: '0.75rem',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          zIndex: 2,
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.background = '#ffe082'}
        onMouseLeave={(e) => e.target.style.background = '#ffd54f'}
      >
        Explore 4% Loans â†’
      </button>
    </div>
  )
}

export default NewsTicker

