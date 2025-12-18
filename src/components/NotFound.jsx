import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Empresa no encontrada</h2>
        <p className="not-found-message">
          Lo sentimos, la empresa que buscas no existe o ha sido removida.
        </p>
        <Link to="/" className="not-found-link">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default NotFound

