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
    const subject = `Portfolio inquiry from ${form.name}`
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
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
      <label>
        Your name
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={set('name')}
          placeholder="Juan Dela Cruz"
          required
          autoComplete="name"
        />
      </label>
      <label>
        Your email
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={set('email')}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </label>
      <label>
        Project details
        <textarea
          name="message"
          value={form.message}
          onChange={set('message')}
          placeholder="What do you want built? Timeline? Budget range?"
          rows={5}
          required
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
