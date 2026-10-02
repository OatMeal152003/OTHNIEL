// @ts-check
import { useEffect, useRef } from 'react'

const DPR_CAP = 1.25
const COLS = 26
const ROWS = 15
const HORIZON = 0.36
const SCROLL_SPEED = 0.05
const RIPPLE_COOLDOWN = 0.12

function makeNoiseTile() {
  const s = 128
  const c = document.createElement('canvas')
  c.width = s
  c.height = s
  const ctx = c.getContext('2d')
  if (!ctx) return null
  const img = ctx.createImageData(s, s)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = (Math.random() * 255) | 0
    img.data[i] = v
    img.data[i + 1] = v
    img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  return c
}

/**
 * Monochrome 3D wireframe terrain. A perspective grid scrolls gently;
 * the cursor dents the surface with spring inertia, fast moves spawn
 * expanding ripple waves, nearby lines brighten, and everything settles
 * when the pointer rests. Canvas 2D, zero dependencies.
 */
export default function HeroShader() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const section = canvas.parentElement
    if (!section) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const noise = makeNoiseTile()
    const target = { x: 0, y: 0.55 }
    const pos = { x: 0, y: 0.55 }
    const vel = { x: 0, y: 0 }
    /** @type {Array<{x:number,y:number,t0:number}>} */
    let ripples = []
    let lastRipple = -10
    let elapsed = 0
    let scroll = 0
    let raf = 0
    let running = false
    let visible = true
    let lastFrame = 0
    /** @type {CanvasGradient|null} */
    let glowCache = null
    let glowLight = -1

    const readLightBg = () => (document.body.classList.contains('dark-mode') ? 1 : 0)

    const resize = () => {
      const rect = section.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      const w = Math.max(1, Math.round(rect.width * dpr))
      const h = Math.max(1, Math.round(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return rect
    }

    const heightAt = (wx, wy, t, speedBoost) => {
      let h = 0.055 * Math.sin(wx * 2.1 + t * 1.1) + 0.045 * Math.cos(wy * 3.1 - t * 0.8)
      const dx = pos.x - wx
      const dy = (pos.y - wy) * 1.35
      const dent = Math.exp(-(dx * dx + dy * dy) / 0.2)
      h += dent * (0.5 + speedBoost * 0.5)
      for (const r of ripples) {
        const age = t - r.t0
        if (age < 0 || age > 2.2) continue
        const rx = wx - r.x
        const ry = (wy - r.y) * 1.35
        const d = Math.sqrt(rx * rx + ry * ry)
        h += 0.32 * Math.sin(13 * d - 6.5 * age) * Math.exp(-3 * d) * Math.exp(-1.7 * age)
      }
      return h
    }

    const render = (rect, t) => {
      const W = rect.width
      const H = rect.height
      if (W < 2 || H < 2) return
      const light = readLightBg() === 1
      const horizonY = H * HORIZON

      // Base.
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      if (light) {
        bg.addColorStop(0, '#f7f7f7')
        bg.addColorStop(1, '#ffffff')
      } else {
        bg.addColorStop(0, '#101012')
        bg.addColorStop(1, '#000000')
      }
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      const speed = Math.hypot(vel.x, vel.y)
      const speedBoost = Math.min(1, speed / 6)

      // World-space cursor for brightness falloff.
      const buckets = [[], [], [], [], [], []]
      const pushSeg = (x1, y1, x2, y2, bright) => {
        const b = Math.max(0, Math.min(5, (bright * 6) | 0))
        buckets[b].push(x1, y1, x2, y2)
      }

      const rowScreenY = (fy) => horizonY + (H - horizonY) * Math.pow(fy, 2.1)
      const colHalf = (fy) => W * (0.06 + 0.62 * fy)

      const sample = (wx, fy) => {
        const h = heightAt(wx, fy, t, speedBoost)
        const sy = rowScreenY(fy) - h * H * 0.11
        const dirx = pos.x - wx
        const sx = W / 2 + wx * colHalf(fy) + Math.tanh(dirx * 2.2) * h * 52
        const mdx = wx - pos.x
        const mdy = (fy - pos.y) * 1.35
        const bright = 0.10 + fy * 0.22 + Math.exp(-(mdx * mdx + mdy * mdy) / 0.25) * 0.55
        return { sx, sy, bright }
      }

      // Horizontal rows (scroll toward viewer).
      for (let i = 0; i < ROWS; i += 1) {
        const fy = (((i / ROWS + scroll) % 1) + 1) % 1
        let prev = null
        for (let j = 0; j <= COLS; j += 1) {
          const wx = (j / COLS - 0.5) * 2.4
          const p = sample(wx, fy)
          if (prev) pushSeg(prev.sx, prev.sy, p.sx, p.sy, (prev.bright + p.bright) / 2)
          prev = p
        }
      }
      // Vertical columns (skip the segment where scroll wraps bottom->top).
      for (let j = 0; j <= COLS; j += 1) {
        const wx = (j / COLS - 0.5) * 2.4
        let prev = null
        let prevFy = -1
        for (let i = 0; i <= ROWS; i += 1) {
          const fy = (((i / ROWS + scroll) % 1) + 1) % 1
          const p = sample(wx, fy)
          if (prev && fy >= prevFy) pushSeg(prev.sx, prev.sy, p.sx, p.sy, (prev.bright + p.bright) / 2)
          prev = p
          prevFy = fy
        }
      }

      ctx.lineWidth = 1
      for (let b = 0; b < 6; b += 1) {
        const segs = buckets[b]
        if (segs.length === 0) continue
        const a = 0.06 + (b / 5) * 0.5
        ctx.strokeStyle = light ? `rgba(0,0,0,${a.toFixed(3)})` : `rgba(255,255,255,${a.toFixed(3)})`
        ctx.beginPath()
        for (let k = 0; k < segs.length; k += 4) {
          ctx.moveTo(segs[k], segs[k + 1])
          ctx.lineTo(segs[k + 2], segs[k + 3])
        }
        ctx.stroke()
      }

      // Horizon glow band.
      const hg = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 40)
      if (light) {
        hg.addColorStop(0, 'rgba(0,0,0,0)')
        hg.addColorStop(0.5, 'rgba(0,0,0,0.10)')
        hg.addColorStop(1, 'rgba(0,0,0,0)')
      } else {
        hg.addColorStop(0, 'rgba(255,255,255,0)')
        hg.addColorStop(0.5, 'rgba(255,255,255,0.08)')
        hg.addColorStop(1, 'rgba(255,255,255,0)')
      }
      ctx.fillStyle = hg
      ctx.fillRect(0, horizonY - 40, W, 80)

      // Cursor glow dot.
      const cx = W / 2 + pos.x * W * 0.68
      const cy = horizonY + (H - horizonY) * Math.pow(Math.max(0, Math.min(1, pos.y)), 2.1)
      if (glowCache === null || glowLight !== (light ? 1 : 0)) {
        glowLight = light ? 1 : 0
        glowCache = ctx.createRadialGradient(0, 0, 0, 0, 0, 46)
        if (light) {
          glowCache.addColorStop(0, 'rgba(0,0,0,0.30)')
          glowCache.addColorStop(1, 'rgba(0,0,0,0)')
        } else {
          glowCache.addColorStop(0, 'rgba(255,255,255,0.35)')
          glowCache.addColorStop(1, 'rgba(255,255,255,0)')
        }
      }
      ctx.save()
      ctx.translate(cx, Math.max(0, Math.min(H, cy)))
      ctx.fillStyle = glowCache
      ctx.fillRect(-46, -46, 92, 92)
      ctx.restore()

      // Vignette.
      const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75)
      if (light) {
        vg.addColorStop(0, 'rgba(255,255,255,0)')
        vg.addColorStop(1, 'rgba(0,0,0,0.14)')
      } else {
        vg.addColorStop(0, 'rgba(0,0,0,0)')
        vg.addColorStop(1, 'rgba(0,0,0,0.55)')
      }
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, W, H)

      // Animated film grain.
      if (noise) {
        const ox = (Math.random() * 128) | 0
        const oy = (Math.random() * 128) | 0
        ctx.globalAlpha = 0.05
        for (let yy = -oy; yy < H; yy += 128) {
          for (let xx = -ox; xx < W; xx += 128) {
            ctx.drawImage(noise, xx, yy)
          }
        }
        ctx.globalAlpha = 1
      }
    }

    const frame = (now) => {
      if (!running) return
      const dt = Math.min(0.033, (now - (lastFrame || now)) / 1000 || 0.016)
      lastFrame = now
      elapsed += dt
      scroll = (scroll + SCROLL_SPEED * dt) % 1

      // Spring cursor with inertia.
      vel.x += (target.x - pos.x) * 90 * dt
      vel.y += (target.y - pos.y) * 90 * dt
      vel.x *= Math.exp(-8 * dt)
      vel.y *= Math.exp(-8 * dt)
      pos.x += vel.x * dt
      pos.y += vel.y * dt

      // Fast moves spawn expanding ripple waves.
      const speed = Math.hypot(vel.x, vel.y)
      if (speed > 2.4 && elapsed - lastRipple > RIPPLE_COOLDOWN && visible) {
        lastRipple = elapsed
        ripples.push({ x: pos.x, y: pos.y, t0: elapsed })
        if (ripples.length > 8) ripples.shift()
      }
      ripples = ripples.filter((r) => elapsed - r.t0 < 2.2)

      const rect = resize()
      render(rect, elapsed)
      raf = requestAnimationFrame(frame)
    }

    const kick = () => {
      if (!visible || reduceMotion || running) return
      running = true
      lastFrame = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const onMove = (e) => {
      const rect = section.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      const horizonY = rect.height * HORIZON
      target.x = Math.max(-1.4, Math.min(1.4, (px / rect.width - 0.5) * 2.4))
      target.y = Math.max(-0.2, Math.min(1.2, (py - horizonY) / (rect.height - horizonY)))
      kick()
    }
    const onLeave = () => {
      target.x = 0
      target.y = 0.55
      kick()
    }

    if (reduceMotion) {
      const rect = resize()
      render(rect, 0)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (!visible) {
          running = false
          cancelAnimationFrame(raf)
        } else {
          kick()
        }
      },
      { threshold: 0 }
    )
    observer.observe(section)

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else {
        kick()
      }
    }

    section.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', resize)
    resize()
    kick()

    return () => {
      running = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      section.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', resize)
      ripples = []
      glowCache = null
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-wire" aria-hidden="true" />
}
