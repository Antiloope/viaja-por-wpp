import { useLanguage } from '../context/LanguageContext'
import './LanguageSelector.css'

const LanguageSelector = () => {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button 
      className="language-selector"
      onClick={toggleLanguage}
      aria-label="Change language"
    >
      {language === 'es' ? 'ES' : 'EN'}
    </button>
  )
}

export default LanguageSelector

