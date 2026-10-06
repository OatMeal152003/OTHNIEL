import { useCallback, useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Skills from './components/Skills.jsx'
import Services from './components/Services.jsx'
import Projects from './components/Projects.jsx'
import Education from './components/Education.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Assistant from './components/Assistant.jsx'
import LogoIntro from './components/LogoIntro.jsx'
import { useReveal } from './hooks/useReveal.js'
import './styles/01-base.css'
import './styles/02-hero.css'
import './styles/03-lightbox-sections.css'
import './styles/04-skills-projects-deck.css'
import './styles/05-education-contact-footer.css'
import './styles/06-assistant.css'
import './styles/07-responsive-intro.css'
import './styles/08-dark-a11y.css'
import './styles/09-services.css'
import './styles/10-folders-modals.css'

export default function App() {
  useReveal()
  const [intro, setIntro] = useState({ id: 0, show: true })
  const hideIntro = useCallback(() => {
    setIntro((s) => ({ ...s, show: false }))
  }, [])
  const replayIntro = useCallback(() => {
    window.scrollTo(0, 0)
    setIntro((s) => ({ id: s.id + 1, show: true }))
  }, [])
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('portfolio-theme') === 'dark'
    } catch {
      return false
    }
  })

  useEffect(() => {
    document.body.classList.toggle('dark-mode', dark)
    try {
      localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light')
    } catch {
      // ignore storage errors
    }
  }, [dark])

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar dark={dark} onToggle={() => setDark((d) => !d)} onLogoClick={replayIntro} />
      <main id="main-content">
        <Hero dark={dark} />
        <Skills />
        <Services />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
      <Assistant />
      {intro.show && <LogoIntro key={intro.id} onDone={hideIntro} />}
    </>
  )
}
