import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <Link to="/" className="footer-link">
          Inicio
        </Link>
        <span className="footer-separator">•</span>
        <span className="footer-text">
          Reserva tu viaje de forma fácil y rápida
        </span>
      </div>
    </footer>
  )
}

export default Footer

