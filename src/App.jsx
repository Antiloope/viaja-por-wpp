import { LanguageProvider } from './context/LanguageContext'
import CompanyHeader from './components/CompanyHeader'
import RequestForm from './components/RequestForm'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <CompanyHeader />
        <main className="App-main">
          <RequestForm />
        </main>
      </div>
    </LanguageProvider>
  )
}

export default App

