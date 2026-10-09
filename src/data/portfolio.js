export const profile = {
  name: 'Othniel Sulpico',
  title: 'Full-Stack Web Developer & Creative Designer',
  tagline: 'I build responsive websites, web applications, and database-driven systems with a creative twist.',
  bio: "I'm Othniel Sulpico, a web developer focused on building responsive websites, web applications, and database-driven systems. I also have a passion for graphic design, branding, and digital content, allowing me to approach projects from both a technical and creative perspective.",
  location: 'Philippines',
  availability: 'Available for freelance projects'
}

export const skills = [
  { name: 'JavaScript', icon: 'javascript' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'React', icon: 'react' },
  { name: 'Next.js', icon: 'nextjs' },
  { name: 'Node.js', icon: 'nodejs' },
  { name: 'Python', icon: 'python' },
  { name: 'HTML / CSS', icon: 'htmlcss' },
  { name: 'Tailwind CSS', icon: 'tailwind' },
  { name: 'Git / GitHub', icon: 'git' },
  { name: 'Claude Code', icon: 'claude' },
  { name: 'OpenAI', icon: 'openai' },
  { name: 'OpenCode', icon: 'opencode' },
  { name: 'Omniroute', icon: 'omniroute' },
  { name: 'Graphics Designing', icon: 'design' },
  { name: 'Laravel', icon: 'laravel' },
  { name: 'PHP', icon: 'php' },
  { name: 'MySQL', icon: 'mysql' },
  { name: 'Expo', icon: 'expo' },
  { name: 'Canva', icon: 'canva' },
  { name: 'Figma', icon: 'figma' },
  { name: 'Firebase', icon: 'firebase' },
  { name: 'Supabase', icon: 'supabase' },
  { name: 'Vercel', icon: 'vercel' },
  { name: 'Postman', icon: 'postman' },
  { name: 'Docker', icon: 'docker' },
  { name: 'REST API', icon: 'restapi' }
]

export const services = [
  {
    title: 'Web Development',
    eyebrow: 'End-to-end websites',
    description:
      'Complete websites — from landing pages to business sites. Designed, built, deployed, and documented.',
    tags: ['Business Sites', 'Landing Pages', 'SEO'],
    theme: 'dark'
  },
  {
    title: 'UI/UX Design',
    eyebrow: 'Interfaces & experience',
    description:
      'Clean, usable interfaces prototyped in Figma — layouts, flows, and design systems developers can actually build.',
    tags: ['Figma', 'Prototypes', 'Design Systems'],
    theme: 'dark'
  },
  {
    title: 'Frontend Development',
    eyebrow: 'Interaction & motion',
    description:
      'Responsive React interfaces with smooth motion and real state — fast, accessible, and pixel-faithful.',
    tags: ['React', 'Responsive', 'Performance'],
    theme: 'dark'
  },
  {
    title: 'Backend Development',
    eyebrow: 'Servers, APIs & logic',
    description:
      'REST APIs and application backends with Node.js — auth, validation, and business logic that holds up.',
    tags: ['REST', 'Node.js', 'Auth'],
    theme: 'light'
  },
  {
    title: 'Database & Systems',
    eyebrow: 'Data that stays correct',
    description:
      'MySQL-backed systems — inventory, enrollment, and records — with reports and admin controls.',
    tags: ['MySQL', 'Reports', 'Admin Panel'],
    theme: 'light'
  },
  {
    title: 'Branding & Creative Design',
    eyebrow: 'Identity & content',
    description:
      'Logos, social kits, and page visuals in Canva and Figma — branding that matches the build.',
    tags: ['Logos', 'Social Kits', 'Canva'],
    theme: 'light'
  },
  {
    title: 'Digital Solutions',
    eyebrow: 'Systems for ambitious ideas',
    description:
      'Firebase and Supabase apps, automations, and capstone builds — documented, demo-ready, and built with you.',
    tags: ['Firebase', 'Supabase', 'Capstone Builds'],
    theme: 'light'
  }
]

export const projectCategories = [
  {
    id: 'websites',
    label: 'Websites',
    hint: 'Live sites & immersive web experiences',
    color: '#000000',
    icon: 'finance'
  },
  {
    id: 'systems',
    label: 'Systems',
    hint: 'Database-driven systems',
    color: '#404040',
    icon: 'inventory'
  },
  {
    id: 'apps',
    label: 'Applications',
    hint: 'Interactive apps & tools',
    color: '#737373',
    icon: 'typing'
  }
]

export const projects = [
  {
    title: 'TypeForge — Typing Speed App',
    description:
      'Typing trainer inspired by Monkeytype and TypingMaster. Live WPM and accuracy tracking, timed modes, and smooth typing feedback to build speed.',
    stack: ['React', 'JavaScript', 'CSS', 'LocalStorage'],
    link: 'https://typeforge.gamer.gd',
    linkLabel: 'Live Demo',
    icon: 'typing',
    category: 'websites',
    galleryLabel: 'TypeForge',
    image: './images/TypeForge.png'
  },
  {
    title: 'Inventory Management System',
    description:
      'Database-driven inventory system with stock tracking, product management, and sales records. Built for small businesses that need simple, reliable controls.',
    stack: ['PHP / Node.js', 'MySQL', 'HTML', 'CSS'],
    link: '',
    linkLabel: 'Code on request',
    icon: 'inventory',
    category: 'systems',
    galleryLabel: 'Inventory',
    image: 'https://picsum.photos/seed/inventory-sys/800/600?grayscale'
  },
  {
    title: 'NorthLine — Calm Treasury Finance Site',
    description:
      'Finance marketing site with a scroll-scrubbed video hero. Scrolling drives the video timeline for a cinematic effect. Tagline: Treasury that stays calm under pressure.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Scroll Animation'],
    link: 'https://oatmeal152003.github.io/mywebsite/',
    linkLabel: 'Live Demo',
    icon: 'finance',
    category: 'websites',
    galleryLabel: 'NorthLine',
    image: './images/NorthLine.png'
  },
  {
    title: 'Kwenta App',
    description:
      'Kwenta helps you keep track of your money without the stress. Log an expense in just a few taps, see where your pesos go each month, and set budgets that nudge you gently instead of scolding you. Keep your Cash, GCash, Maya, and bank balances in one place, and track who owes you (and who you owe) with the built-in utang list. Kwenta works fully offline, so you can record spending anywhere, and your data stays on your phone unless you choose to back it up.',
    stack: ['React', 'JavaScript', 'LocalStorage', 'Charts'],
    link: 'https://kwenta-app-chi.vercel.app/',
    linkLabel: 'Live Demo',
    installTitle: 'Install as app',
    installSteps: [
      'Open the Live Demo link in Chrome (Android) or Safari (iPhone) on your phone.',
      'Android / Chrome: tap the ⋮ menu (top-right), then tap "Add to Home screen" or "Install app" and confirm.',
      'iPhone / Safari: tap the Share button, scroll down, tap "Add to Home Screen", then tap Add.',
      'Launch Kwenta from the new home-screen icon — it opens full-screen like a native app and works offline.'
    ],
    icon: 'money',
    category: 'apps',
    galleryLabel: 'Kwenta App',
    image: './images/Kwenta.png'
  },
  {
    title: 'The Digital Room — Interactive 3D Portfolio Museum',
    description:
      'Interactive 3D portfolio experience styled as a virtual museum room. Instead of menus and cards, visitors explore a designed room where everyday objects open projects, skills, media, and links — like stepping into a personal creative workspace.',
    stack: ['Three.js', 'WebGL', 'JavaScript', 'Vercel'],
    link: 'https://the-digital-room.vercel.app/',
    linkLabel: 'Live Demo',
    icon: 'room',
    category: 'websites',
    galleryLabel: 'Digital Room',
    image: './images/The%20Digital%20Room.png'
  }
]

export const education = {
  school: 'Siargao Island Institute of Technology',
  degree: 'Bachelor of Science in Information Technology',
  details: 'Focused on web development, databases, and software systems.'
}

export const contact = {
  email: 'othnielsulpico3@gmail.com',
  github: 'https://github.com/OatMeal152003',
  githubLabel: 'OatMeal152003',
  facebook: 'https://www.facebook.com/othniel.sulpico',
  facebookLabel: 'othniel.sulpico',
  linkedin: 'https://www.linkedin.com/in/othniel-sulpico-587a68440/',
  linkedinLabel: 'Othniel Sulpico',
  instagram: 'https://www.instagram.com/mr.oat_meal/',
  instagramLabel: 'mr.oat_meal',
  resumePath: './resume.pdf'
}
