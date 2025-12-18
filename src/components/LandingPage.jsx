import { landingConfig } from '../data/landingConfig'
import './LandingPage.css'

const LandingPage = () => {
  const handleContactClick = () => {
    const cleanNumber = String(landingConfig.contactPhone).replace(/\D/g, '')
    const message = encodeURIComponent(landingConfig.defaultMessage)
    const whatsappURL = `https://wa.me/${cleanNumber}?text=${message}`
    window.location.href = whatsappURL
  }

  // Formatear número para mostrar (agregar espacios para legibilidad)
  const formatPhoneForDisplay = (phone) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length >= 10) {
      // Formato: +XX XXX XXX XXXX
      return phone.replace(/(\+?\d{2})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4')
    }
    return phone
  }
  const displayPhone = formatPhoneForDisplay(landingConfig.contactPhone)

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">Viaja por WPP</h1>
        <p className="landing-subtitle">
          Plataforma para empresas de transporte privado
        </p>
        
        <div className="contact-card">
          <div className="contact-icon">📱</div>
          <h2 className="contact-title">¿Quieres tu propia página?</h2>
          <p className="contact-description">
            Contacta con nosotros por WhatsApp para conseguir tu página personalizada
          </p>
          
          <div className="phone-display">
            <span className="phone-number">{displayPhone}</span>
          </div>
          
          <button 
            className="contact-button"
            onClick={handleContactClick}
          >
            Enviar WhatsApp
          </button>
        </div>

        <div className="features-section">
          <h3>Características</h3>
          <ul className="features-list">
            <li>✅ Solicitudes de transporte estructuradas</li>
            <li>✅ Selección de origen y destino en mapa interactivo</li>
            <li>✅ Integración directa con WhatsApp</li>
            <li>✅ Personalización completa para tu empresa</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

