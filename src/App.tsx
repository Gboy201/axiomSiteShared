import './App.css'
import { useState, useEffect } from 'react'

type Theme = 'dark' | 'light'

// external links
const INSTAGRAM_URL = 'https://www.instagram.com/axiomstartups'
const LINKEDIN_URL = 'https://www.linkedin.com/company/axiom-startups/'
const ATTEND_URL = 'https://luma.com/7epaq2w3'
// TODO: confirm Sofia's website url
const SITE_URL = 'https://sofiabodnar.com'

// selected photos shown in the grid
const photos: string[] = [
  '/assets/images/participant-photos/p1.png',
  '/assets/images/participant-photos/p3.png',
  '/assets/images/participant-photos/p5.png',
  '/assets/images/participant-photos/p6.png',
  '/assets/images/event-photos/img12.png',
  '/assets/images/event-photos/img4.png',
  '/assets/images/event-photos/img2.png',
  '/assets/images/event-photos/img1.png',
]

// renders the social icon links used in the header nav
function renderSocials() {
  return (
    <>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
        <img className="social-icon" src="/instagram.svg" alt="Instagram" />
      </a>
      <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
        <img className="social-icon" src="/Linkedin.svg" alt="LinkedIn" />
      </a>
    </>
  )
}

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('axiom-theme')
    return saved === 'light' || saved === 'dark' ? saved : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('axiom-theme', theme)
  }, [theme])

  return (
    <main>
      <div className="header-row">
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 400, marginBottom: '0px', textAlign: 'left' }}>axiom</h1>
          <p style={{ fontSize: '0.95rem', marginTop: '-2px' }}>startup competition for ambitious youth in ontario</p>
          <p style={{ fontSize: '0.95rem', marginTop: '12px' }}>
            <a className="attend-btn" href={ATTEND_URL} target="_blank" rel="noopener noreferrer">attend</a>
            <span style={{ marginLeft: '12px' }}>september 9, 2025</span>
          </p>
        </div>
        <nav className="nav-links">
          <button
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label="toggle theme"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          {renderSocials()}
        </nav>
      </div>

      <section className="section">
        <div className="section-label">about</div>
        <p style={{ fontSize: '1.1rem' }}>
          In math, an axiom is a truth you don't have to prove. In venture, extremely young founders are made to prove themselves just for being young. Axiom makes their potential the starting line, not the thing they defend.
        </p>
        <ul className="facts">
          <li>Backed by several YC companies.</li>
          <li>Of 10 teams, 4 founders went on to YC at 18, across W26 and S26.</li>
        </ul>
      </section>

      <section className="section">
        <div className="section-label">photos from event</div>
        <div className="photo-grid">
          {photos.map((src) => (
            <img key={src} src={src} alt="" loading="lazy" />
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <span>
          built by{' '}
          <a className="grow-link" href={SITE_URL} target="_blank" rel="noopener noreferrer">Sofia Bodnar</a>
        </span>
      </footer>
    </main>
  )
}

export default App
