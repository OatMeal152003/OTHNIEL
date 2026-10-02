import { useEffect, useState } from 'react'
import { FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa'

const links = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' }
]

export default function Navbar({ dark, onToggle }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#about" className="logo">
          <img src="./images/OS_logo.png" alt="Othniel.dev logo" width="60" height="45" className="logo-img" />
          <span className="logo-text">Othniel.dev</span>
        </a>
        <nav id="primary-navigation" aria-label="Primary" className={`nav-links ${open ? 'open' : ''}`}>
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
