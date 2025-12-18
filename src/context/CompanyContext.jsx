import { createContext, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useCompanyConfig } from '../hooks/useCompanyConfig'

const CompanyContext = createContext(null)

export const CompanyProvider = ({ children }) => {
  const { companySlug } = useParams()
  const { config, loading, error } = useCompanyConfig(companySlug)

  return (
    <CompanyContext.Provider value={{ config, loading, error, companySlug }}>
      {children}
    </CompanyContext.Provider>
  )
}

export const useCompany = () => {
  const context = useContext(CompanyContext)
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider')
  }
  return context
}

