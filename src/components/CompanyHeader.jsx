import { useCompany } from '../context/CompanyContext'
import { useTranslation } from '../utils/useTranslation'
import LanguageSelector from './LanguageSelector'
import './CompanyHeader.css'

const CompanyHeader = () => {
  const { t } = useTranslation()
  const { config, loading } = useCompany()

  if (loading || !config) {
    return (
      <header className="company-header">
        <LanguageSelector />
        <div className="company-header-content">
          <div style={{ textAlign: 'center', padding: '1rem' }}>Cargando...</div>
        </div>
      </header>
    )
  }

  return (
    <header className="company-header">
      <LanguageSelector />
      <div className="company-header-content">
        {config.logo && (
          <div className="company-logo">
            <img src={config.logo} alt={config.name} />
          </div>
        )}
        <h1 className="company-name">{config.name}</h1>
        {config.description && (
          <p className="company-description">{config.description}</p>
        )}
        {config.operatingArea && (
          <p className="company-area">
            {t('operatingAreaLabel')}: {config.operatingArea}
          </p>
        )}
      </div>
    </header>
  )
}

export default CompanyHeader

