import { profile, skills, projects, education, contact } from './portfolio.js'

const skillList = skills.map((s) => s.name).join(', ')
const projectList = projects.map((p) => p.title).join('; ')

function includesAny(text, words) {
  return words.some((w) => text.includes(w))
}

const PROJECT_WORDS = ['northline', 'typeforge', 'typeflow', 'inventory', 'digital room', 'museum', 'three', 'webgl', '3d', 'virtual room', 'gallery', 'immersive', 'money', 'kwenta', 'treasury', 'typing', 'monkey', 'wpm', 'forge', 'stock', 'budget', 'expense', 'track', 'utang', 'gcash', 'scroll', 'finance']

function say(text, topic = null) {
  return { text, topic }
}

function projectByIcon(icon) {
  return projects.find((x) => x.icon === icon)
}

function elaborateTopic(topic) {
  if (!topic) return null
  const p = projectByIcon(topic)
  if (p) {
    const extra =
      topic === 'finance'
        ? ' Scroll down effect aside, it shows he can build polished marketing pages with cinematic scrolling.'
        : topic === 'typing'
          ? ' It tracks WPM and accuracy live, with timed modes like the apps it was inspired by.'
          : topic === 'inventory'
            ? ' It covers stock levels, product records, and sales history for small shops.'
            : topic === 'room'
              ? ' Objects in the room act as gateways to projects, skills, media, and links — like entering a personal creative workspace.'
              : ' It tracks Cash, GCash, Maya, and bank balances in one place, with budgets and an offline utang list.'
    return `${p.title} in more detail:${extra} Built with ${p.stack.join(', ')}.${p.link ? ` Try it live: ${p.link}` : ' Code is available on request — email ' + contact.email + '.'}`
  }
  if (topic === 'skills') {
    return `Going deeper on skills: core strengths are HTML/CSS, JavaScript, React and Tailwind CSS. He pairs React with Node.js APIs and MySQL or PHP backends depending on the project, and also works with Expo, Firebase, Supabase, and Docker.`
  }
  if (topic === 'services') {
    return `The 7 Services panels at a glance: end-to-end websites, Figma UI/UX, React frontends, Node.js backends, MySQL systems like inventory and records, Canva and Figma branding, and digital solutions from Firebase apps to documented capstone builds with defense prep. It closes on a black capstone finale panel — or email ${contact.email} with what you need for a quote.`
  }
  if (topic === 'projects') {
    return `The 5 projects split nicely: TypeForge and Inventory on the creative-systems side, NorthLine front and center as the showpiece, plus Kwenta App and The Digital Room. Which one should I unpack?`
  }
  if (topic === 'education') {
    return `More on education: the BSIT program covered web development, databases, and software systems — exactly the mix behind his inventory system and interactive builds like The Digital Room.`
  }
  if (topic === 'contact' || topic === 'hire') {
    return `Next step to hire him: email ${contact.email} with what you want built, your timeline, and any examples you like. He replies with a quote. His GitHub is ${contact.githubLabel}.`
  }
  if (topic === 'about') {
    return `More about him: beyond code he does graphic design, branding, and digital content, so his sites look as good as they run. ${profile.availability}.`
  }
  return null
}

// Returns { text, topic }. Pass { topic } from the previous turn for follow-ups.
export function getOatmealReply(rawMessage, context = {}) {
  const text = rawMessage.toLowerCase().trim()

  if (!text) return say('Ask me anything about Othniel, for example: skills, projects, education, or contact.')

  // Follow-ups that lean on the previous topic ("tell me more", "it?", "that one")
  const lastTopic = context.topic || null
  if (lastTopic && /^(tell me more|more|what else|and\?|continue|go on|more details|explain|explain it|why|how so|how does it work|what about it|what about that|how about it|and it\??|it\?|that one|this one|that\?|this\?)$/.test(text)) {
    const elaboration = elaborateTopic(lastTopic)
    if (elaboration) return say(elaboration, lastTopic)
  }
  if (lastTopic && includesAny(text, ['it ', 'that ', 'this ', 'its ', 'itself'])) {
    const elaboration = elaborateTopic(lastTopic)
    if (elaboration && text.split(' ').length <= 8) return say(elaboration, lastTopic)
  }

  // Greetings
  if (/^(hi|hello|hey|yo|good\s?(morning|afternoon|evening))\b/.test(text)) {
    return say(`Hello! I am Oatmeal, ${profile.name}'s portfolio assistant. Ask me about his skills, projects, education, or how to hire him.`)
  }

  // Who is Oatmeal / who are you
  if (includesAny(text, ['who are you', 'what are you', 'oatmeal', 'your name'])) {
    return say(`I am Oatmeal, the talking assistant on ${profile.name}'s portfolio. I answer questions about what he does, his skills, his 5 projects, and how to contact him.`)
  }

  // Name / about / bio (skip when a specific project is named — project checks run below)
  if (!includesAny(text, PROJECT_WORDS) && includesAny(text, ['your name', 'who is', 'about', 'bio', 'introduce', 'background'])) {
    return say(`${profile.name} is a ${profile.title} based in ${profile.location}. ${profile.bio}`, 'about')
  }

  // Title / what does he do / services
  if (!includesAny(text, PROJECT_WORDS) && includesAny(text, ['what does', 'what can', 'service', 'services', 'offer', 'do you do', 'title', 'role', 'job', 'work'])) {
    return say(`${profile.name} offers 7 services: web development, UI/UX design, frontend and backend development, database and systems, branding and creative design, plus digital solutions including capstone builds. Scroll through the Services panels on this page, or email ${contact.email} for a quote.`, 'services')
  }

  // Skills
  if (includesAny(text, ['skill', 'tech', 'stack', 'tools', 'language', 'framework', 'proficient'])) {
    // Specific skill check
    const found = skills.find((s) => text.includes(s.name.toLowerCase().split(' ')[0]))
    if (found) return say(`Yes — ${found.name} is in ${profile.name}'s toolbox. Full toolbox: ${skillList}.`, 'skills')
    return say(`${profile.name}'s toolbox: ${skillList}. Strongest areas are HTML/CSS, JavaScript, React, and Tailwind CSS.`, 'skills')
  }

  // Projects overview
  if (includesAny(text, ['project', 'portfolio', 'work', 'built', 'showcase'])) {
    if (!includesAny(text, ['northline', 'typeforge', 'typeflow', 'inventory', 'digital room', 'museum', 'money', 'track'])) {
      return say(`He has 5 projects: ${projectList}. Ask me about any one by name, for example "Tell me about NorthLine".`, 'projects')
    }
  }

  // Individual projects
  if (includesAny(text, ['northline', 'treasury', 'finance', 'scroll'])) {
    const p = projectByIcon('finance')
    return say(`${p.title}: ${p.description} Built with ${p.stack.join(', ')}. Live demo: ${p.link}`, 'finance')
  }
  if (includesAny(text, ['typeforge', 'typeflow', 'forge', 'typing', 'monkey', 'wpm'])) {
    const p = projectByIcon('typing')
    return say(`${p.title}: ${p.description} Built with ${p.stack.join(', ')}. Live demo: ${p.link}`, 'typing')
  }
  if (includesAny(text, ['inventory', 'stock'])) {
    const p = projectByIcon('inventory')
    return say(`${p.title}: ${p.description} Built with ${p.stack.join(', ')}.`, 'inventory')
  }
  if (includesAny(text, ['digital room', 'museum', 'virtual room', 'gallery', 'three.js', 'threejs', 'webgl', 'immersive'])) {
    const p = projectByIcon('room')
    return say(`${p.title}: ${p.description} Built with ${p.stack.join(', ')}. Live demo: ${p.link}`, 'room')
  }
  if (includesAny(text, ['money', 'kwenta', 'track', 'budget', 'expense', 'utang', 'gcash', 'finance app'])) {
    const p = projectByIcon('money')
    return say(`${p.title}: ${p.description} Built with ${p.stack.join(', ')}.`, 'money')
  }

  // Education
  if (includesAny(text, ['education', 'school', 'study', 'studied', 'degree', 'college', 'university', 'siargao', 'bsit', 'graduate'])) {
    return say(`${profile.name} holds a ${education.degree} from ${education.school}. ${education.details}`, 'education')
  }

  // Contact
  if (includesAny(text, ['contact', 'email', 'mail', 'reach', 'github', 'facebook', 'linkedin', 'instagram', 'social', 'link'])) {
    return say(`You can reach ${profile.name} at ${contact.email} (there is a copy-email button and a project inquiry form right on this page). GitHub: ${contact.github} (${contact.githubLabel}). Facebook: ${contact.facebook} (${contact.facebookLabel}). LinkedIn: ${contact.linkedin} (${contact.linkedinLabel}). Instagram: ${contact.instagram} (${contact.instagramLabel}).`, 'contact')
  }

  // Resume
  if (includesAny(text, ['resume', 'cv', 'download'])) {
    return say(`Othniel shares his latest resume on request — email ${contact.email} and he will send a copy, along with a quote for your project.`, 'contact')
  }

  // Hiring / rates / availability
  if (includesAny(text, ['hire', 'freelance', 'available', 'rate', 'price', 'cost', 'commission'])) {
    return say(`${profile.availability} — open for websites, web apps, inventory systems, interactive 3D experiences, and branding work. Email ${contact.email} with your project details for a quote.`, 'hire')
  }

  // Location
  if (includesAny(text, ['where', 'location', 'based', 'country', 'philippines'])) {
    return say(`${profile.name} is based in ${profile.location} and works with freelance clients remotely.`, 'about')
  }

  // Thanks / bye
  if (includesAny(text, ['thank', 'thanks', 'salamat'])) {
    return say('You are welcome! Anything else you want to know — skills, projects, or how to hire him?')
  }
  if (includesAny(text, ['bye', 'goodbye', 'see you', 'good night'])) {
    return say('Goodbye! If you need a website, web app, or system built, email othnielsulpico3@gmail.com.')
  }

  // Simple conversation / small talk
  if (includesAny(text, ['how are you', 'how r u', 'how is it going', 'how are u', 'kamusta'])) {
    return say(`I am running well, thank you for asking! How are you? By the way, I can also tell you about ${profile.name}'s skills, projects, or how to hire him.`)
  }
  if (text === 'good' || text === 'great' || text === 'fine' || text === 'ok' || text === 'okay' || includesAny(text, ["i'm good", 'i am good', 'doing well', 'doing fine'])) {
    return say('Glad to hear that! Want to hear what Othniel is good at too? Try "What are his skills?"')
  }
  if (includesAny(text, ['what is up', "what's up", 'wassup', 'sup'])) {
    return say(`Just here answering questions about ${profile.name}. What is up with you — looking for a developer, or just browsing?`)
  }
  if (includesAny(text, ['who made you', 'who created you', 'who built you'])) {
    return say(`I was built for ${profile.name}'s portfolio to answer questions about him. He is a ${profile.title}.`)
  }
  if (includesAny(text, ['how old are you', 'your age'])) {
    return say('I am as old as this portfolio — brand new and still learning. Othniel keeps teaching me new answers.')
  }
  if (includesAny(text, ['where are you', 'where do you live'])) {
    return say(`I live right here on this page, in the bottom-right corner. ${profile.name} is based in ${profile.location}.`)
  }
  if (includesAny(text, ['help', 'what can you do', 'commands', 'options'])) {
    return say('I chat about simple things, and I know Othniel well. Try: "How are you?", "Tell me a joke", "List his projects", "What are his skills?", or "How do I hire him?"')
  }
  if (includesAny(text, ['joke', 'funny', 'make me laugh'])) {
    const jokes = [
      'Why do programmers prefer dark mode? Because light attracts bugs.',
      'Why did the developer go broke? He used up all his cache.',
      'There are only 10 kinds of people: those who understand binary and those who do not.'
    ]
    return say(jokes[text.length % jokes.length] + ' Want to hear about real projects too? Try "List his projects".')
  }
  if (includesAny(text, ['motivate', 'motivation', 'inspire', 'advice'])) {
    return say('Small progress every day builds great portfolios. Othniel went from fun side projects to full systems that way. What do you want to build?')
  }
  if (includesAny(text, ['nice', 'cool', 'awesome', 'great site', 'beautiful', 'amazing'])) {
    return say(`Thank you! I will pass the compliment to ${profile.name}. Want a tour? Ask me to list his projects.`)
  }
  if (includesAny(text, ['yes', 'yeah', 'yep', 'sure', 'sige'])) {
    if (lastTopic) {
      const elaboration = elaborateTopic(lastTopic)
      if (elaboration && !includesAny(text, ['okay', 'ok'])) return say(elaboration, lastTopic)
    }
    return say('Great! What next — skills, projects, education, or contact info?')
  }
  if (includesAny(text, ['no', 'nope', 'never mind', 'nevermind'])) {
    return say('No worries. I am here if you change your mind — just ask about skills, projects, or hiring.')
  }
  if (includesAny(text, ['tell me more', 'more', 'what else', 'and then', 'continue'])) {
    if (lastTopic) {
      const elaboration = elaborateTopic(lastTopic)
      if (elaboration) return say(elaboration, lastTopic)
    }
    return say(`Here is more: ${profile.name} built 5 projects — ${projectList}. He holds a ${education.degree}. Email him at ${contact.email} to start a project.`, 'projects')
  }
  if (includesAny(text, ['i need', 'i want', 'looking for', 'can you build', 'make me'])) {
    return say(`Noted! ${profile.name} takes freelance work for websites, web apps, and database systems. Email ${contact.email} with what you need and he will reply with a quote.`, 'hire')
  }

  // Fallback — stay in the current topic if there is one
  if (lastTopic) {
    const elaboration = elaborateTopic(lastTopic)
    if (elaboration) return say(`I am not sure I caught that, but sticking with our topic: ${elaboration}`, lastTopic)
  }
  return say(`I can answer questions about ${profile.name}: his skills (${skillList}), his 5 projects, his education at ${education.school}, or contact info. Try "What are his skills?" or "Tell me about The Digital Room".`)
}

export const oatmealSuggestions = [
  'What are his skills?',
  'What services does he offer?',
  'List his projects',
  'Tell me about NorthLine',
  'His education?',
  'How do I hire him?'
]

// NOTE: Smart replies now come from the in-browser model in oatmealAI.js
// (no API keys needed). This file is the instant offline brain + fallback.
