import { useEffect, useRef } from 'react'
import { FaTimes, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa'

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
        className="modal-panel"
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
        ) : (
          <div className="modal-detail">
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
