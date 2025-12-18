import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Intentar cargar del localStorage, por defecto español
    const saved = localStorage.getItem('language')
    return saved || 'es'
  })

  useEffect(() => {
    // Guardar en localStorage cuando cambie
    localStorage.setItem('language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es')
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

