import { useCallback, useEffect, useRef, useState } from 'react'
import { FaMapMarkerAlt, FaLaptopCode, FaArrowDown, FaEnvelope, FaExpand, FaTimes } from 'react-icons/fa'
import { profile } from '../data/portfolio.js'
import { contact } from '../data/portfolio.js'
import HeroShader from './HeroShader.jsx'
import ProfileCard from './ProfileCard.jsx'
import TechText from './TechText.jsx'

const PROFILE_SRC = './images/Real.png'

export default function Hero({ dark }) {
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

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="about" className="hero">
      <HeroShader />
      <div className="container hero-grid reveal">
        <div>
          <h1 className="sr-only">{profile.name}</h1>
          {/* Remount the canvas engine on theme change so letter sprites,
              drag state, and selection frames never carry stale state
              across a color-scheme switch. */}
          <div className="hero-name" aria-hidden="true" key={dark ? 'hero-name-dark' : 'hero-name-light'}>
            <TechText
              text="Othniel"
              fontWeight={700}
              fontSize={150}
              color={dark ? '#0a0a0a' : '#ffffff'}
              accentColor={dark ? '#525252' : '#a3a3a3'}
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
              align="left"
              className="hero-name-line"
            />
            <TechText
              text="Sulpico"
              fontWeight={700}
              fontSize={150}
              color={dark ? '#0a0a0a' : '#ffffff'}
              accentColor={dark ? '#525252' : '#a3a3a3'}
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
              align="left"
              className="hero-name-line"
            />
          </div>
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
        <div className="hero-profile">
          <ProfileCard
            avatarUrl={PROFILE_SRC}
            name={profile.name}
            title={profile.title}
            handle={contact.githubLabel}
            status={profile.availability}
            contactText="Contact Me"
            showUserInfo
            enableTilt
            enableMobileTilt={false}
            behindGlowEnabled
            onContactClick={scrollToContact}
          />
          <button
            type="button"
            className="hero-profile-zoom"
            onClick={open}
            aria-label={`Enlarge photo of ${profile.name}`}
            aria-haspopup="dialog"
          >
            <FaExpand /> Zoom
          </button>
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
