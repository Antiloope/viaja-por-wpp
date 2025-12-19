import { useState, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from '../utils/useTranslation'
import MapModal from './MapModal'
import PinIcon from './PinIcon'
import './LocationInput.css'

// Función de búsqueda de direcciones
const searchAddresses = async (query) => {
  if (!query || query.length < 3) {
    return []
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ReservaPorApp/1.0'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Search failed')
    }
    
    const data = await response.json()
    
    return data.map(item => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      place_id: item.place_id
    }))
  } catch (error) {
    console.error('Error en búsqueda:', error)
    return []
  }
}

const LocationInput = ({ label, value, onChange, error, required = true }) => {
  const { t } = useTranslation()
  const [address, setAddress] = useState(value || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [mapModalOpen, setMapModalOpen] = useState(false)
  
  const searchTimeoutRef = useRef(null)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Sincronizar address con value
  useEffect(() => {
    if (value) {
      setAddress(value)
    }
  }, [value])

  // Búsqueda de direcciones mientras se escribe
  const handleInputChange = useCallback((e) => {
    const query = e.target.value
    setAddress(query)
    setSelectedSuggestionIndex(-1)
    onChange(query) // Actualizar inmediatamente

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true)
      const results = await searchAddresses(query)
      setSuggestions(results)
      setShowSuggestions(true)
      setIsSearching(false)
    }, 500)
  }, [onChange])

  // Seleccionar una sugerencia
  const handleSelectSuggestion = useCallback((suggestion) => {
    setAddress(suggestion.display_name)
    onChange(suggestion.display_name)
    setShowSuggestions(false)
    setSuggestions([])
  }, [onChange])

  // Confirmar desde el mapa
  const handleMapConfirm = useCallback((address, position) => {
    setAddress(address)
    onChange(address)
    setMapModalOpen(false)
  }, [onChange])

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        handleSelectSuggestion(suggestions[selectedSuggestionIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <div className="location-input-field">
        <label className="location-input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
        <div className="location-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className={`location-input ${error ? 'error' : ''}`}
            placeholder={label === t('origin') ? t('selectOrigin') : t('selectDestination')}
            value={address}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
          {isSearching && (
            <div className="searching-indicator">
              <span>{t('searching')}</span>
            </div>
          )}
          <button
            type="button"
            className="map-picker-btn"
            onClick={() => setMapModalOpen(true)}
            title={t('selectOnMap')}
          >
            <PinIcon size={20} color="white" />
          </button>
          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestionsRef} className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.place_id}
                  className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  <span className="suggestion-icon">
                    <PinIcon size={16} color="#76748C" />
                  </span>
                  <span className="suggestion-text">{suggestion.display_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {error && <span className="error-message">{error}</span>}
      </div>
      
      <MapModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        onConfirm={handleMapConfirm}
        label={label}
      />
    </>
  )
}

export default LocationInput

