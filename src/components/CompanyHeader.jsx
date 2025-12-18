import { companyConfig } from '../data/companyConfig'
import { useTranslation } from '../utils/useTranslation'
import LanguageSelector from './LanguageSelector'
import './CompanyHeader.css'

const CompanyHeader = () => {
  const { t } = useTranslation()

  return (
    <header className="company-header">
      <LanguageSelector />
      <div className="company-header-content">
        {companyConfig.logo && (
          <div className="company-logo">
            <img src={companyConfig.logo} alt={companyConfig.name} />
          </div>
        )}
        <h1 className="company-name">{companyConfig.name}</h1>
        <p className="company-description">{t('companyDescription')}</p>
        {companyConfig.operatingArea && (
          <p className="company-area">
            {t('operatingAreaLabel')}: {companyConfig.operatingArea}
          </p>
        )}
      </div>
    </header>
  )
}

export default CompanyHeader

