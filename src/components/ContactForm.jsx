import { useState } from 'react'
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa'
import { contact } from '../data/portfolio.js'

// Keyless sending: opens Gmail compose with the inquiry prefilled.
// The visitor just presses Send in Gmail — no mail app, no API keys, no backend.
export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    const name = form.name.trim().slice(0, 100)
    const email = form.email.trim().slice(0, 254)
    const message = form.message.trim().slice(0, 2000)
    if (!name || !email || !message) return
    const subject = `Portfolio inquiry from ${name}`
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_blank',
      'noopener'
    )
    setSent(true)
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <h3>Send a project inquiry</h3>
      <label htmlFor="contact-name">
        Your name
        <input
          id="contact-name"
          type="text"
          name="name"
          value={form.name}
          onChange={set('name')}
          placeholder="Juan Dela Cruz"
          required
          autoComplete="name"
          maxLength={100}
        />
      </label>
      <label htmlFor="contact-email">
        Your email
        <input
          id="contact-email"
          type="email"
          name="email"
          value={form.email}
          onChange={set('email')}
          placeholder="you@example.com"
          required
          autoComplete="email"
          maxLength={254}
        />
      </label>
      <label htmlFor="contact-message">
        Project details
        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={set('message')}
          placeholder="What do you want built? Timeline? Budget range?"
          rows={5}
          required
          maxLength={2000}
        />
      </label>

      <button type="submit" className="btn btn-primary">
        <FaPaperPlane /> Send via Gmail
      </button>

      {sent && (
        <p className="form-note form-success" role="status">
          <FaCheckCircle /> Gmail opened with your message prefilled — just press Send there.
        </p>
      )}
    </form>
  )
}
