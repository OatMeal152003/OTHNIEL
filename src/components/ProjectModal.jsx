import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { FaTimes, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa'

const CircularGallery = lazy(() => import('./CircularGallery.jsx'))

function ModalGallery({ projects }) {
  const [failed, setFailed] = useState(false)
  const [reduceMotion] = useState(() =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  if (failed || reduceMotion || projects.length === 0) return null
  const items = projects.map((p) => ({
    image: p.image,
    text: p.galleryLabel || p.title.split(' — ')[0]
  }))
  return (
    <div className="modal-gallery">
      <Suspense fallback={<div className="modal-gallery-loading" aria-hidden="true" />}>
        <CircularGallery
          items={items}
          bend={2}
          textColor="#ffffff"
          borderRadius={0.08}
          font="bold 24px Orbitron"
          scrollSpeed={1.5}
          scrollEase={0.05}
          onError={() => setFailed(true)}
        />
      </Suspense>
      <p className="modal-gallery-hint">Drag or scroll to spin the gallery — pick a project below.</p>
    </div>
  )
}

export default function ProjectModal({ category, projects, selected, onSelect, onClose }) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (selected) onSelect(null)
        else onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, onSelect, selected])

  // Simple focus trap: keep Tab inside the dialog
  const handleTab = (e) => {
    if (e.key !== 'Tab' || !panelRef.current) return
    const focusable = panelRef.current.querySelectorAll(
      'button, a[href], [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={() => (selected ? onSelect(null) : onClose())}
      onKeyDown={handleTab}
    >
      <div
        ref={panelRef}
        className="modal-panel modal-panel-wide"
        role="dialog"
        aria-modal="true"
        aria-label={selected ? selected.title : `${category.label} projects`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="section-tag">{category.label}</span>
            <h3 className="modal-title">
              {selected ? selected.title : `${category.label} Projects`}
            </h3>
            {!selected && (
              <p className="modal-sub">
                {projects.length} project{projects.length === 1 ? '' : 's'} — pick one to see details.
              </p>
            )}
          </div>
          <div className="modal-actions">
            {selected && (
              <button type="button" className="btn btn-ghost btn-small" onClick={() => onSelect(null)}>
                <FaArrowLeft /> Back
              </button>
            )}
            <button
              ref={closeRef}
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close projects dialog"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {!selected ? (
          <>
            <ModalGallery projects={projects} />
            <ul className="modal-list">
              {projects.map((p) => (
                <li key={p.title}>
                  <button type="button" className="modal-list-item" onClick={() => onSelect(p)}>
                    <span className="modal-list-text">
                      <strong>{p.title}</strong>
                      <small>{p.stack.join(' • ')}</small>
                    </span>
                    <span className="modal-list-cta">{p.link ? p.linkLabel : 'Details'} →</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="modal-detail">
            {selected.image && (
              <img
                src={selected.image}
                alt={`${selected.title} preview`}
                className="modal-detail-img"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <p className="modal-desc">{selected.description}</p>
            <div className="stack">
              {selected.stack.map((t) => (
                <span key={t} className="stack-pill">{t}</span>
              ))}
            </div>
            {selected.link ? (
              <a
                href={selected.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                {selected.linkLabel} <FaExternalLinkAlt size={12} />
              </a>
            ) : (
              <span className="project-link muted">{selected.linkLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
