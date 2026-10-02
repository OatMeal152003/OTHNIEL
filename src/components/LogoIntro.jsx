// @ts-check
import { useCallback, useEffect, useRef, useState } from 'react'

const INTRO_SRC = './videos/Logo_intro.mp4'
const FADE_MS = 450
const SAFETY_MS = 9000

/**
 * Full-screen logo intro. Autoplays the logo animation on visit,
 * fades out when the video ends (click skips). Renders nothing
 * under prefers-reduced-motion.
 */
export default function LogoIntro({ onDone }) {
  const [fading, setFading] = useState(false)
  const [ready, setReady] = useState(false)
  const doneRef = useRef(false)
  const videoRef = useRef(null)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setFading(true)
    window.setTimeout(() => onDone(), FADE_MS)
  }, [onDone])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return undefined
    }
    document.body.style.overflow = 'hidden'
    const safety = window.setTimeout(finish, SAFETY_MS)
    const video = videoRef.current
    // Some browsers gate autoplay: play explicitly, skip on failure.
    if (video) {
      const attempt = video.play()
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => finish())
      }
    }
    return () => {
      document.body.style.overflow = ''
      window.clearTimeout(safety)
    }
  }, [finish])

  return (
    <div
      className={`intro-overlay${fading ? ' fading' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site intro animation"
      onClick={finish}
    >
      <video
        ref={videoRef}
        className={`intro-video${ready ? ' ready' : ''}`}
        src={INTRO_SRC}
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setReady(true)}
        onEnded={finish}
        onError={finish}
      />
      <span className="intro-skip" aria-hidden="true">Click anywhere to skip</span>
    </div>
  )
}
