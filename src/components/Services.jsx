import { useEffect, useRef } from 'react'
import { FaPaperPlane } from 'react-icons/fa'
import { services } from '../data/portfolio.js'

const PANEL_COUNT = services.length

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export default function Services() {
  const trackRef = useRef(null)
  const stageRef = useRef(null)
  const panelRefs = useRef([])
  const numRef = useRef(null)
  const dotsRef = useRef([])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined
    // Reduced-motion users get the static stacked fallback (see CSS) — never transform panels for them.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const panels = panelRefs.current.filter(Boolean)
    let ticking = false
    let raf = 0
    let live = -1

    const update = () => {
      ticking = false
      const total = track.offsetHeight - window.innerHeight
      const top = track.getBoundingClientRect().top
      const p = total > 0 ? clamp01(-top / total) : 0
      // +0.5: the incoming panel goes live (text animates in) while the outgoing
      // panel is only half lifted — entrance overlaps exit instead of waiting for it.
      const active = Math.min(PANEL_COUNT - 1, Math.floor(p * PANEL_COUNT + 0.5))
      if (stageRef.current) stageRef.current.classList.toggle('finale-visible', p > 0.985)
      if (active !== live) {
        live = active
        panels.forEach((el, i) => el.classList.toggle('is-live', i === active))
      }
      panels.forEach((el, i) => {
        const q = easeOutCubic(clamp01(p * PANEL_COUNT - i))
        el.style.transform = `translateY(${(-q * 100).toFixed(3)}%) scale(${(1 - 0.04 * q).toFixed(4)})`
        el.style.setProperty('--q', q.toFixed(4))
      })
      if (numRef.current) {
        numRef.current.textContent = `${String(active + 1).padStart(2, '0')} / ${String(PANEL_COUNT).padStart(2, '0')}`
      }
      dotsRef.current.forEach((d, i) => {
        if (d) d.classList.toggle('active', i === active)
      })
    }

    const requestUpdate = () => {
      if (!ticking) {
        ticking = true
        raf = requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  return (
    <section id="services" className="services-pin" aria-label="Services">
      <h2 className="visually-hidden">Services offered by Othniel Sulpico</h2>
      <div className="services-track" ref={trackRef}>
        <div className="services-stage" ref={stageRef}>
          <p className="services-kicker">Othniel.dev — Services</p>
          <div className="services-finale" aria-label="Capstone finale">
            <div className="services-finale-inner">
              <span className="section-tag">For students</span>
              <h3>Building a capstone or thesis system?</h3>
              <p>Documentation, defense prep, and source walkthrough included.</p>
              <a href="#contact" className="btn btn-primary"><FaPaperPlane /> Request a Quote</a>
            </div>
          </div>
          {services.map((s, i) => (
            <article
              key={s.title}
              ref={(el) => { panelRefs.current[i] = el }}
              className={`service-panel tone-${i}`}
              data-theme={s.theme}
              style={{ zIndex: PANEL_COUNT - i }}
              aria-label={`${s.title}: service ${i + 1} of ${PANEL_COUNT}`}
            >
              <div className="service-panel-inner">
                <span className="service-big-num rise" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <p className="service-eyebrow rise">{s.eyebrow}</p>
                <h3 className="service-panel-title rise">{s.title}</h3>
                <p className="service-panel-desc rise">{s.description}</p>
                <div className="stack service-panel-tags rise">
                  {s.tags.map((t) => (
                    <span key={t} className="stack-pill">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
          <div className="services-progress" aria-hidden="true">
            <span ref={numRef} className="services-count">01 / 07</span>
            <span className="services-dots">
              {services.map((s, i) => (
                <span
                  key={s.title}
                  ref={(el) => { dotsRef.current[i] = el }}
                  className={`services-dot${i === 0 ? ' active' : ''}`}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
