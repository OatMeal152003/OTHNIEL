import { FaJs, FaReact, FaNodeJs, FaPython, FaHtml5, FaGitAlt, FaCss3Alt, FaCode } from 'react-icons/fa'
import { SiTypescript, SiNextdotjs, SiTailwindcss } from 'react-icons/si'
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
  git: FaGitAlt
}

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container reveal">
        <span className="section-tag">My Toolbox</span>
        <h2 className="section-title">Skills and Technologies</h2>
        <p className="section-sub">Languages, frameworks, and tools I use to design and build fast, reliable web experiences.</p>
        <div className="skills-grid">
          {skills.map((s) => {
            const Icon = iconMap[s.icon] || FaCode
            return (
              <div key={s.name} className="skill-card">
                <div className="skill-top">
                  <span className="skill-icon"><Icon /></span>
                  <strong>{s.name}</strong>
                </div>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${s.level}%` }} />
                </div>
                <small>{s.level}% proficient</small>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
