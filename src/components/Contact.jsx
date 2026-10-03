import { useEffect, useRef, useState } from 'react'
import { FaEnvelope, FaGithub, FaFacebookF, FaLinkedinIn, FaInstagram, FaPaperPlane, FaCopy, FaCheck } from 'react-icons/fa'
import { contact, profile } from '../data/portfolio.js'
import ContactForm from './ContactForm.jsx'

function CopyEmailButton() {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
    } catch {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement('textarea')
      ta.value = contact.email
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button type="button" className="copy-email-btn" onClick={copy} aria-live="polite">
      {copied ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy email</>}
    </button>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="section section-alt">
      <div className="container reveal">
        <span className="section-tag">Let us work together</span>
        <h2 className="section-title">Contact</h2>
        <p className="section-sub">
          Freelance-ready for websites, web apps, inventory and database systems, plus branding and design.
        </p>
        <div className="contact-grid">
          <div className="contact-card contact-card-static">
            <span className="contact-icon"><FaEnvelope /></span>
            <strong>Email</strong>
            <small>{contact.email}</small>
            <div className="contact-card-actions">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Gmail
              </a>
              <CopyEmailButton />
            </div>
          </div>
          <a href={contact.github} target="_blank" rel="noopener noreferrer" className="contact-card">
            <span className="contact-icon" aria-hidden="true"><FaGithub /></span>
            <strong>GitHub</strong>
            <small>{contact.githubLabel}</small>
          </a>
          <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="contact-card">
            <span className="contact-icon" aria-hidden="true"><FaFacebookF /></span>
            <strong>Facebook</strong>
            <small>{contact.facebookLabel}</small>
          </a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card">
            <span className="contact-icon" aria-hidden="true"><FaLinkedinIn /></span>
            <strong>LinkedIn</strong>
            <small>{contact.linkedinLabel}</small>
          </a>
          <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="contact-card">
            <span className="contact-icon" aria-hidden="true"><FaInstagram /></span>
            <strong>Instagram</strong>
            <small>{contact.instagramLabel}</small>
          </a>
        </div>
        <div className="contact-actions">
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}&su=${encodeURIComponent(`Freelance project for ${profile.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            <FaPaperPlane /> Say Hello via Gmail
          </a>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}
