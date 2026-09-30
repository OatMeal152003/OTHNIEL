import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Education from './components/Education.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Assistant from './components/Assistant.jsx'
import { useReveal } from './hooks/useReveal.js'
import './App.css'

export default function App() {
  useReveal()
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
      <Navbar dark={dark} onToggle={() => setDark((d) => !d)} />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
      <Assistant />
    </>
  )
}
