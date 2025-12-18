import { useState, useEffect } from 'react'
import configurations from '../data/configurations.json'

export const useCompanyConfig = (companySlug) => {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    try {
      if (!companySlug) {
        setError('No company slug provided')
        setLoading(false)
        return
      }

      const company = configurations.companies.find(
        (c) => c.slug === companySlug
      )

      if (company) {
        setConfig(company)
      } else {
        setError('Company not found')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [companySlug])

  return { config, loading, error }
}

