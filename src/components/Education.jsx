import { FaGraduationCap } from 'react-icons/fa'
import { education } from '../data/portfolio.js'

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="container reveal">
        <span className="section-tag">Background</span>
        <h2 className="section-title">Education</h2>
        <div className="edu-card">
          <div className="edu-icon-box"><FaGraduationCap /></div>
          <div>
            <h3>{education.degree}</h3>
            <p className="edu-school">{education.school}</p>
            <p className="edu-details">{education.details}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
