import { useEffect, useRef, useState } from 'react'
import { FaChartLine, FaKeyboard, FaBoxes, FaExternalLinkAlt, FaCode, FaLayerGroup, FaThLarge, FaMousePointer, FaVoteYea, FaWallet } from 'react-icons/fa'
import { projects } from '../data/portfolio.js'

const coverIcons = {
  finance: FaChartLine,
  typing: FaKeyboard,
  inventory: FaBoxes,
  voting: FaVoteYea,
  money: FaWallet
}

// Center-out order so NorthLine (index 2) leads, then outward pairs
const CENTER_OUT_ORDER = [2, 1, 3, 0, 4]
const FLIP_DURATION = 1100
const FLIP_STAGGER = 110
const FLIP_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

function ProjectCard({ p, cardRef, index }) {
  const CoverIcon = coverIcons[p.icon] || FaCode
  return (
    <article
      className="project-card"
      ref={cardRef}
      style={{ '--i': index }}
    >
      <div className="project-cover">
        <span className="project-cover-icon"><CoverIcon /></span>
      </div>
      <div className="project-body">
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <div className="stack">
          {p.stack.map((t) => (
            <span key={t} className="stack-pill">{t}</span>
          ))}
        </div>
        {p.link ? (
          <a
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className="project-link"
            onClick={(e) => e.stopPropagation()}
          >
            {p.linkLabel} <FaExternalLinkAlt size={12} />
          </a>
        ) : (
          <span className="project-link muted">{p.linkLabel}</span>
        )}
      </div>
    </article>
  )
}

export default function Projects() {
  const [spread, setSpread] = useState(false)
  const [animating, setAnimating] = useState(false)
  const cardRefs = useRef([])
  const firstRects = useRef(new Map())
  const animateOnNextPaint = useRef(false)

  const captureFirstPositions = () => {
    firstRects.current.clear()
    cardRefs.current.forEach((el, i) => {
      if (el) firstRects.current.set(i, el.getBoundingClientRect())
    })
  }

  // Run the FLIP animation after React swaps deck <-> grid layout
  useEffect(() => {
    if (!animateOnNextPaint.current) return
    animateOnNextPaint.current = false

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      firstRects.current.clear()
      setAnimating(false)
      return
    }

    const animations = []
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const first = firstRects.current.get(i)
      if (!first) return
      const last = el.getBoundingClientRect()
      if (last.width === 0 || last.height === 0) return

      const dx = first.left - last.left
      const dy = first.top - last.top
      const sx = first.width / last.width
      const sy = first.height / last.height
      if (Math.abs(dx) < 2 && Math.abs(dy) < 2 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) return

      const orderPos = CENTER_OUT_ORDER.indexOf(i)
      const delay = (orderPos === -1 ? i : orderPos) * FLIP_STAGGER
      const anim = el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.55 },
          { transform: 'translate(0, 0) scale(1, 1)', opacity: 1 }
        ],
        { duration: FLIP_DURATION, delay, easing: FLIP_EASING, fill: 'backwards' }
      )
      animations.push(anim.finished.catch(() => {}))
    })

    firstRects.current.clear()
    if (animations.length === 0) {
      setAnimating(false)
      return
    }
    Promise.all(animations).then(() => setAnimating(false)).catch(() => setAnimating(false))
  }, [spread])

  const toggleSpread = () => {
    if (animating) return
    captureFirstPositions()
    animateOnNextPaint.current = true
    setAnimating(true)
    setSpread((s) => !s)
  }

  const spreadDeck = () => {
    if (spread || animating) return
    captureFirstPositions()
    animateOnNextPaint.current = true
    setAnimating(true)
    setSpread(true)
  }

  return (
    <section id="projects" className="section section-alt">
      <div className="container reveal">
        <span className="section-tag">Selected Work</span>
        <h2 className="section-title">Projects</h2>
        <p className="section-sub">A mix of live sites, apps, and systems. More programming projects and tools available on request.</p>

        <div className="deck-controls">
          <button
            type="button"
            className="btn btn-primary deck-toggle"
            onClick={toggleSpread}
            aria-pressed={spread}
            disabled={animating}
          >
            {spread ? <><FaLayerGroup /> Stack into deck</> : <><FaThLarge /> Spread cards out</>}
          </button>
          <span className="deck-hint">
            <FaMousePointer size={12} />
            {animating
              ? 'Dealing the cards…'
              : spread
                ? 'Normal view — click the button to fan them back into a deck.'
                : 'Hover the deck to fan it out — click any card to lay them flat.'}
          </span>
        </div>

        <div
          className={spread ? 'projects-grid flip-stage spread' : 'deck-stage deck flip-stage'}
          onClick={spread ? undefined : spreadDeck}
          role={spread ? undefined : 'button'}
          tabIndex={spread ? undefined : 0}
          aria-label={spread ? undefined : 'Project card deck. Activate to spread cards out.'}
          onKeyDown={spread ? undefined : (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              spreadDeck()
            }
          }}
        >
          {projects.map((p, i) => (
            <ProjectCard
              key={p.title}
              p={p}
              index={i}
              cardRef={(el) => { cardRefs.current[i] = el }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
