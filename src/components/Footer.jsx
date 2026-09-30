import { FaArrowUp } from 'react-icons/fa'
import { profile } from '../data/portfolio.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} {profile.name} — Built with React</span>
        <a href="#about">Back to top <FaArrowUp size={12} /></a>
      </div>
    </footer>
  )
}
