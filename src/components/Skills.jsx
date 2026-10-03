import { FaJs, FaReact, FaNodeJs, FaPython, FaHtml5, FaGitAlt, FaCss3Alt, FaCode, FaTerminal, FaRoute, FaPalette, FaBrain, FaPaintBrush, FaServer } from 'react-icons/fa'
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiPhp, SiLaravel, SiExpo, SiMysql, SiFigma, SiFirebase, SiSupabase, SiVercel, SiPostman, SiDocker } from 'react-icons/si'
import { skills } from '../data/portfolio.js'

const iconMap = {
  javascript: FaJs,
  typescript: SiTypescript,
  react: FaReact,
  nextjs: SiNextdotjs,
  nodejs: FaNodeJs,
  python: FaPython,
  htmlcss: FaHtml5,
  tailwind: SiTailwindcss,
  git: FaGitAlt,
  claude: FaTerminal,
  openai: FaBrain,
  opencode: FaCode,
  omniroute: FaRoute,
  design: FaPalette,
  laravel: SiLaravel,
  php: SiPhp,
  mysql: SiMysql,
  expo: SiExpo,
  canva: FaPaintBrush,
  figma: SiFigma,
  firebase: SiFirebase,
  supabase: SiSupabase,
  vercel: SiVercel,
  postman: SiPostman,
  docker: SiDocker,
  restapi: FaServer
}

function SkillCard({ skill, hidden }) {
  const Icon = iconMap[skill.icon] || FaCode
  return (
    <div className="skill-card" aria-hidden={hidden || undefined}>
      <div className="skill-top">
        <span className="skill-icon" aria-hidden="true"><Icon /></span>
        <strong>{skill.name}</strong>
      </div>
    </div>
  )
}

function MarqueeRow({ items, reverse }) {
  return (
    <div className="marquee">
      <div className={`marquee-track${reverse ? ' reverse' : ''}`}>
        {items.map((s) => (
          <SkillCard key={s.name} skill={s} />
        ))}
        {items.map((s) => (
          <SkillCard key={`${s.name}-copy`} skill={s} hidden />
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container reveal">
        <span className="section-tag">My Toolbox</span>
        <h2 className="section-title">Skills and Technologies</h2>
        <p className="section-sub">Languages, frameworks, and tools I use to design and build fast, reliable web experiences.</p>
        <div className="skills-marquee">
          <MarqueeRow items={skills.slice(0, 13)} />
          <MarqueeRow items={skills.slice(13)} reverse />
        </div>
      </div>
    </section>
  )
}
