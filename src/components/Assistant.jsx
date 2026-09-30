import { useEffect, useRef, useState } from 'react'
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa'
import { getOatmealReply, oatmealSuggestions } from '../data/assistant.js'
import { ensureOatmealAI, askOatmealAI } from '../data/oatmealAI.js'

const GREETING = {
  from: 'oatmeal',
  text: "Hi! I am Oatmeal, Othniel's assistant. Ask me about his skills, 5 projects, education, or how to hire him."
}

// aiStatus: 'loading' | 'ready' | 'failed'
// The smart model downloads automatically in the background on page load.
// Visitors just chat — offline brain answers until the model is ready.
export default function Assistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [aiStatus, setAiStatus] = useState('loading')
  const [aiProgress, setAiProgress] = useState(null)
  // Ring the FAB on page load until the visitor first opens the chat.
  const [seen, setSeen] = useState(() => {
    try {
      return localStorage.getItem('oatmeal-seen') === '1'
    } catch {
      return false
    }
  })
  const bodyRef = useRef(null)
  const topicRef = useRef(null)
  const loadAttempted = useRef(false)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [messages, typing, open])

  // Auto-download the smart model shortly after page load so it is ready ASAP.
  // Deferred slightly so first paint and the visitor's own browsing come first.
  useEffect(() => {
    if (loadAttempted.current) return
    loadAttempted.current = true
    const timer = setTimeout(() => {
      setAiProgress({ progress: 0, text: 'Starting…' })
      ensureOatmealAI((report) => setAiProgress(report)).then(
        () => {
          setAiStatus('ready')
          setAiProgress(null)
        },
        () => {
          // Silent fallback: offline brain keeps answering, no download talk.
          setAiStatus('failed')
          setAiProgress(null)
        }
      )
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const openChat = () => {
    if (!seen) {
      setSeen(true)
      try {
        localStorage.setItem('oatmeal-seen', '1')
      } catch {
        // ignore storage errors
      }
    }
    setOpen(true)
  }

  const send = async (raw) => {
    const text = raw.trim()
    if (!text || typing) return
    const nextMessages = [...messages, { from: 'you', text }]
    setMessages(nextMessages)
    setInput('')
    setTyping(true)

    // Smart on-device AI when ready; instant offline brain otherwise.
    if (aiStatus === 'ready') {
      try {
        const reply = await askOatmealAI(text, nextMessages)
        setMessages((m) => [...m, { from: 'oatmeal', text: reply }])
      } catch {
        const { text: fallback, topic } = getOatmealReply(text, { topic: topicRef.current })
        topicRef.current = topic || topicRef.current
        setMessages((m) => [...m, { from: 'oatmeal', text: fallback }])
      } finally {
        setTyping(false)
      }
      return
    }

    setTimeout(() => {
      const { text: reply, topic } = getOatmealReply(text, { topic: topicRef.current })
      topicRef.current = topic || topicRef.current
      setMessages((m) => [...m, { from: 'oatmeal', text: reply }])
      setTyping(false)
    }, 650)
  }

  const statusLabel =
    aiStatus === 'ready'
      ? 'Smart AI on'
      : aiStatus === 'loading'
        ? `Loading smart AI… ${aiProgress?.progress ?? 0}%`
        : 'Oatmeal'

  return (
    <>
      <button
        type="button"
        className={`oatmeal-fab ${open ? 'hidden' : ''} ${seen ? '' : 'ringing'}`}
        onClick={openChat}
        aria-label="Open Oatmeal assistant"
        title="Chat with Oatmeal"
      >
        <FaRobot />
      </button>

      {open && (
        <div className="oatmeal-panel" role="dialog" aria-label="Oatmeal assistant chat">
          <div className="oatmeal-header">
            <span className="oatmeal-avatar"><FaRobot /></span>
            <div>
              <strong>Oatmeal</strong>
              <small>{statusLabel}</small>
            </div>
            <button type="button" className="oatmeal-close" onClick={() => setOpen(false)} aria-label="Close assistant">
              <FaTimes />
            </button>
          </div>

          {aiStatus === 'loading' && aiProgress && (
            <div className="oatmeal-loadbar" aria-live="polite">
              <div className="oatmeal-loadbar-fill" style={{ width: `${aiProgress.progress}%` }} />
              <small>{aiProgress.text || `Loading smart AI… ${aiProgress.progress}%`}</small>
            </div>
          )}

          <div className="oatmeal-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`oatmeal-msg ${m.from}`}>
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="oatmeal-msg oatmeal oatmeal-thinking" aria-live="polite">
                <span className="oatmeal-dot" />
                <span className="oatmeal-dot" />
                <span className="oatmeal-dot" />
              </div>
            )}
          </div>

          <div className="oatmeal-chips">
            {oatmealSuggestions.map((s) => (
              <button key={s} type="button" onClick={() => send(s)} disabled={typing}>
                {s}
              </button>
            ))}
          </div>

          <form
            className="oatmeal-input"
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about skills, projects…"
              aria-label="Message Oatmeal"
            />
            <button type="submit" aria-label="Send message" disabled={typing || !input.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
