import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { CompanyProvider, useCompany } from './context/CompanyContext'
import CompanyHeader from './components/CompanyHeader'
import RequestForm from './components/RequestForm'
import LandingPage from './components/LandingPage'
import NotFound from './components/NotFound'
import Footer from './components/Footer'
import './App.css'

function MainContent() {
  const { companySlug, config, loading, error } = useCompany()
  
  // Si hay un companySlug en query params, mostrar la página de empresa
  if (companySlug) {
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
        <Footer />
      </div>
    )
  }
  
  // Si no hay companySlug, mostrar landing page
  return <LandingPage />
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename="/reserva-por-app">
        <CompanyProvider>
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="*" element={<MainContent />} />
          </Routes>
        </CompanyProvider>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App

