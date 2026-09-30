import { profile, skills, projects, education, contact } from './portfolio.js'

// NOTE: @mlc-ai/web-llm is dynamically imported inside ensureOatmealAI() so the
// heavy engine stays out of the main bundle and only downloads on opt-in.

// Small, fast models tried in order. First success wins.
const MODELS = [
  'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
  'Llama-3.2-1B-Instruct-q4f16_1-MLC'
]

const skillList = skills.map((s) => s.name).join(', ')
const projectList = projects.map((p) => p.title).join('; ')

function systemPrompt() {
  return [
    'You are Oatmeal, the friendly talking assistant on Othniel Sulpico\'s portfolio website.',
    'Answer concisely (1-4 sentences) with no emojis. Be warm and conversational for small talk,',
    'but always ground facts about Othniel in this profile — never invent jobs, rates, or links:',
    `Name: ${profile.name}. Title: ${profile.title}. Location: ${profile.location}. Availability: ${profile.availability}.`,
    `Bio: ${profile.bio}`,
    `Skills: ${skillList}.`,
    `Projects: ${projectList}.`,
    ...projects.map((p) => `- ${p.title}: ${p.description} Stack: ${p.stack.join(', ')}.${p.link ? ` Link: ${p.link}` : ''}`),
    `Education: ${education.degree}, ${education.school}. ${education.details}`,
    `Contact: email ${contact.email}, GitHub ${contact.github} (${contact.githubLabel}), Facebook/mail ${contact.facebookLabel}. Resume: Contact-section download button.`,
    'If asked something you cannot know (e.g. exact rates), say Othniel replies by email and give his email.'
  ].join('\n')
}

let engine = null
let enginePromise = null
let activeModel = null

export function oatmealAIActiveModel() {
  return activeModel
}

function webGPUSupported() {
  return typeof navigator !== 'undefined' && !!navigator.gpu
}

// Loads the in-browser model (downloads once, then cached). Resolves with the engine.
export function ensureOatmealAI(onProgress) {
  if (engine) return Promise.resolve(engine)
  if (enginePromise) return enginePromise
  if (!webGPUSupported()) {
    return Promise.reject(new Error('UNSUPPORTED'))
  }

  enginePromise = (async () => {
    let lastError = null
    // Dynamic import keeps the ~6MB engine out of the initial page bundle.
    let CreateMLCEngine
    try {
      ;({ CreateMLCEngine } = await import('@mlc-ai/web-llm'))
    } catch (err) {
      enginePromise = null
      throw err
    }
    for (const model of MODELS) {
      try {
        const eng = await CreateMLCEngine(model, {
          initProgressCallback: (report) => {
            if (onProgress) {
              const pct = Math.round((report.progress || 0) * 100)
              onProgress({ model, text: report.text || '', progress: pct })
            }
          }
        })
        engine = eng
        activeModel = model
        return eng
      } catch (err) {
        lastError = err
      }
    }
    enginePromise = null
    throw lastError || new Error('LOAD_FAILED')
  })()

  return enginePromise
}

export async function askOatmealAI(userText, history = []) {
  const eng = await ensureOatmealAI()
  const chatHistory = history
    .filter((m) => m.from === 'you' || m.from === 'oatmeal')
    .slice(-8)
    .map((m) => ({
      role: m.from === 'you' ? 'user' : 'assistant',
      content: m.text
    }))

  const res = await eng.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt() }, ...chatHistory, { role: 'user', content: userText }],
    temperature: 0.6,
    max_tokens: 220
  })
  const reply = res?.choices?.[0]?.message?.content?.trim()
  if (!reply) throw new Error('Empty AI reply')
  return reply
}
