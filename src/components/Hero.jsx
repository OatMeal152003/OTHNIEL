import { FaMapMarkerAlt, FaLaptopCode, FaArrowDown, FaEnvelope } from 'react-icons/fa'
import { profile } from '../data/portfolio.js'
import { contact } from '../data/portfolio.js'
import HeroShader from './HeroShader.jsx'
import ProfileCard from './ProfileCard.jsx'

export default function Hero() {
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="about" className="hero">
      <HeroShader />
      <div className="container hero-grid reveal">
        <div>
          <h1>
            Hi, I am <span className="accent-text">{profile.name}</span>
          </h1>
          <h2>{profile.title}</h2>
          <p className="lead">{profile.bio}</p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary"><FaLaptopCode /> View My Work <FaArrowDown size={13} /></a>
            <a href="#contact" className="btn btn-ghost"><FaEnvelope /> Contact Me</a>
          </div>
          <div className="hero-meta">
            <span><FaMapMarkerAlt /> {profile.location}</span>
            <span><FaLaptopCode /> {profile.tagline}</span>
          </div>
        </div>
        <div className="hero-profile">
          <ProfileCard
            avatarUrl="./images/Real.png"
            name={profile.name}
            title={profile.title}
            handle={contact.githubLabel}
            status={profile.availability}
            contactText="Contact Me"
            showUserInfo
            enableTilt
            enableMobileTilt={false}
            behindGlowEnabled
            onContactClick={scrollToContact}
          />
        </div>
      </div>
    </section>
  )
}
