import { useEffect, useState } from 'react'
import { FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa'
import GooeyNav from './GooeyNav.jsx'

const links = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' }
]

const gooeyItems = links.map((l) => ({ label: l.label, href: `#${l.id}` }))

export default function Navbar({ dark, onToggle, onLogoClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onLogo = (e) => {
    e.preventDefault()
    window.scrollTo(0, 0)
    setOpen(false)
    if (onLogoClick) onLogoClick()
  }

  return (
    <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#about" className="logo" onClick={onLogo} aria-label="Replay site intro">
          <img src="./images/OS_logo.png" alt="Othniel.dev logo" width="60" height="45" className="logo-img" />
          <span className="logo-text">Othniel.dev</span>
        </a>
        <div className="gooey-desktop">
          <GooeyNav
            items={gooeyItems}
            particleCount={12}
            particleDistances={[60, 10]}
            particleR={80}
            initialActiveIndex={0}
            animationTime={400}
            timeVariance={200}
            colors={[1, 1, 1, 1]}
            onNavigate={() => setOpen(false)}
          />
          <a href="#contact" className="btn btn-small" onClick={() => setOpen(false)}>
            Hire Me
          </a>
        </div>
        <nav id="primary-navigation" aria-label="Primary" className={`nav-links nav-links-mobile ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-small" onClick={() => setOpen(false)}>
            Hire Me
          </a>
        </nav>
        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggle}
            aria-pressed={!!dark}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <FaSun /> : <FaMoon />}
          </button>
          <button type="button" className="nav-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="primary-navigation">
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  )
}
