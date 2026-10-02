import { useCallback, useEffect, useRef, useState } from 'react'
import { FaMapMarkerAlt, FaLaptopCode, FaArrowDown, FaEnvelope, FaExpand, FaTimes } from 'react-icons/fa'
import { profile } from '../data/portfolio.js'
import HeroShader from './HeroShader.jsx'

const PROFILE_SRC = './images/profile.jpg'

export default function Hero() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const triggerRef = useRef(null)
  const closeBtnRef = useRef(null)

  const open = useCallback((e) => {
    triggerRef.current = e?.currentTarget ?? null
    setLightboxOpen(true)
  }, [])
  const close = useCallback(() => setLightboxOpen(false), [])

  useEffect(() => {
    if (!lightboxOpen) return
    closeBtnRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      triggerRef.current?.focus?.()
    }
  }, [lightboxOpen, close])

  return (
    <section id="about" className="hero">
      <HeroShader />
      <div className="container hero-grid reveal">
        <div>
          <h1>
            Hi, I am <span className="accent-text">{profile.name}</span>
          </h1>
          <h2>{profile.title}</h2>
          <p className="lead">{profile.bio}</p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary"><FaLaptopCode /> View My Work <FaArrowDown size={13} /></a>
            <a href="#contact" className="btn btn-ghost"><FaEnvelope /> Contact Me</a>
          </div>
          <div className="hero-meta">
            <span><FaMapMarkerAlt /> {profile.location}</span>
            <span><FaLaptopCode /> {profile.tagline}</span>
          </div>
        </div>
        <div className="profile-card">
          <button
            type="button"
            className="profile-card-trigger"
            onClick={open}
            aria-label={`Enlarge photo of ${profile.name}`}
            aria-haspopup="dialog"
          >
            <img
              src={PROFILE_SRC}
              alt={profile.name}
              className="profile-card-image"
              width="560"
              height="840"
              loading="eager"
              decoding="async"
            />
            <span className="profile-hover-hint" aria-hidden="true"><FaExpand /> View photo</span>
          </button>
          <div className="profile-card-bottom">
            <h3 className="profile-card-name">{profile.name}</h3>
            <p className="profile-card-title">{profile.title}</p>
            <div className="profile-card-stats">
              <div><strong>5</strong><span>Projects</span></div>
              <div><strong>9</strong><span>Skills</span></div>
              <div><strong>BSIT</strong><span>Degree</span></div>
            </div>
          </div>
        </div>
      </div>
      {lightboxOpen && (
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true" aria-label="Profile photo enlarged">
          <button ref={closeBtnRef} type="button" className="lightbox-close" onClick={close} aria-label="Close enlarged photo">
            <FaTimes />
          </button>
          <img
            src={PROFILE_SRC}
            alt={`${profile.name} - full size`}
            className="lightbox-img"
            width="900"
            height="1200"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="lightbox-caption">Click anywhere or press Esc to close</p>
        </div>
      )}
    </section>
  )
}
