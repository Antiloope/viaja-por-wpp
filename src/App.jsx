import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { CompanyProvider, useCompany } from './context/CompanyContext'
import CompanyHeader from './components/CompanyHeader'
import RequestForm from './components/RequestForm'
import LandingPage from './components/LandingPage'
import NotFound from './components/NotFound'
import './App.css'

function CompanyPage() {
  return (
    <CompanyProvider>
      <CompanyPageContent />
    </CompanyProvider>
  )
}

function CompanyPageContent() {
  const { config, loading, error } = useCompany()
  
  if (loading) {
    return (
      <div className="App">
        <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</div>
      </div>
    )
  }
  
  if (error || !config) {
    return <NotFound />
  }
  
  return (
    <div className="App">
      <CompanyHeader />
      <main className="App-main">
        <RequestForm />
      </main>
    </div>
  )
}

function LandingPageWrapper() {
  return <LandingPage />
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename="/viaja-por-wpp">
        <Routes>
          <Route path="/:companySlug" element={<CompanyPage />} />
          <Route path="/" element={<LandingPageWrapper />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App

