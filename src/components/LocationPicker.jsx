import { useState, useEffect, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet'
import { useTranslation } from '../utils/useTranslation'
import { useCompany } from '../context/CompanyContext'
import 'leaflet/dist/leaflet.css'
import './LocationPicker.css'

// Fix para los iconos de Leaflet en Vite
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Componente para detectar clicks en el mapa
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng)
    }
  })
  return null
}

// Función de geocodificación inversa usando Nominatim
const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ViajaPorWPP/1.0'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Geocoding failed')
    }
    
    const data = await response.json()
    
    if (data && data.display_name) {
      return data.display_name
    }
    
    return null
  } catch (error) {
    console.error('Error en geocodificación:', error)
    return null
  }
}

// Función de búsqueda de direcciones (geocodificación directa)
const searchAddresses = async (query) => {
  if (!query || query.length < 3) {
    return []
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ViajaPorWPP/1.0'
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

const LocationPicker = ({ label, value, onChange, error, required = true }) => {
  const { t } = useTranslation()
  const { config } = useCompany()
  const [position, setPosition] = useState(null)
  const [address, setAddress] = useState(value || '')
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  
  const geocodeTimeoutRef = useRef(null)
  const searchTimeoutRef = useRef(null)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Coordenadas iniciales del mapa
  const mapCenter = config?.mapCenter || { lat: -32.8895, lng: -68.8458 }
  const mapZoom = config?.mapZoom || 13

  // Sincronizar address con value cuando cambia externamente
  useEffect(() => {
    if (value && !isEditing) {
      setAddress(value)
    }
  }, [value, isEditing])

  // Función para actualizar posición y geocodificar
  const updatePosition = useCallback(async (latlng, skipGeocode = false) => {
    setPosition([latlng.lat, latlng.lng])
    
    if (skipGeocode) {
      return
    }

    setIsGeocoding(true)

    // Debounce: cancelar geocodificación anterior si existe
    if (geocodeTimeoutRef.current) {
      clearTimeout(geocodeTimeoutRef.current)
    }

    // Esperar 800ms antes de geocodificar (debounce)
    geocodeTimeoutRef.current = setTimeout(async () => {
      try {
        const geocodedAddress = await reverseGeocode(latlng.lat, latlng.lng)
        if (geocodedAddress) {
          setAddress(geocodedAddress)
          // No llamar onChange aquí, solo actualizar el estado local
        } else {
          const fallbackAddress = `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`
          setAddress(fallbackAddress)
        }
      } catch (error) {
        const fallbackAddress = `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`
        setAddress(fallbackAddress)
      } finally {
        setIsGeocoding(false)
      }
    }, 800)
  }, [])

  // Manejar click en el mapa
  const handleMapClick = useCallback((latlng) => {
    updatePosition(latlng)
    setShowSuggestions(false)
  }, [updatePosition])

  // Manejar drag del marker
  const handleMarkerDragEnd = useCallback((e) => {
    const marker = e.target
    const position = marker.getLatLng()
    updatePosition(position)
    setShowSuggestions(false)
  }, [updatePosition])

  // Búsqueda de direcciones mientras se escribe
  const handleInputChange = useCallback((e) => {
    const query = e.target.value
    setAddress(query)
    setSelectedSuggestionIndex(-1)

    // Limpiar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Si el input está vacío, ocultar sugerencias
    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      setPosition(null)
      return
    }

    // Debounce de búsqueda
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true)
      const results = await searchAddresses(query)
      setSuggestions(results)
      setShowSuggestions(true)
      setIsSearching(false)
    }, 500)
  }, [])

  // Seleccionar una sugerencia
  const handleSelectSuggestion = useCallback((suggestion) => {
    setAddress(suggestion.display_name)
    setPosition([suggestion.lat, suggestion.lon])
    setShowSuggestions(false)
    setSuggestions([])
    // No confirmar aún, solo mostrar el pin
  }, [])

  // Confirmar la selección actual
  const handleConfirm = useCallback(() => {
    if (address.trim()) {
      onChange(address.trim())
      setIsEditing(false)
      setShowSuggestions(false)
    }
  }, [address, onChange])

  // Cancelar edición
  const handleCancel = useCallback(() => {
    setAddress(value || '')
    setIsEditing(false)
    setShowSuggestions(false)
    setSuggestions([])
    setPosition(null)
  }, [value])

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        handleSelectSuggestion(suggestions[selectedSuggestionIndex])
      } else {
        handleConfirm()
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

  const handleEditClick = () => {
    setIsEditing(true)
    setAddress(value || '')
    setPosition(null)
    setShowSuggestions(false)
    setSuggestions([])
    // Focus en el input después de un pequeño delay
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
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

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current)
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Centrar el mapa cuando cambia la posición
  const mapKey = position ? `${position[0]}-${position[1]}` : 'initial'

  return (
    <div className="location-picker">
      <label className="location-picker-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      {(!value || isEditing) ? (
        <div className="location-picker-container">
          <div className="map-wrapper">
            <MapContainer
              key={mapKey}
              center={position || [mapCenter.lat, mapCenter.lng]}
              zoom={position ? 15 : mapZoom}
              scrollWheelZoom={true}
              className="leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {position && (
                <Marker
                  position={position}
                  draggable={true}
                  eventHandlers={{
                    dragend: handleMarkerDragEnd
                  }}
                />
              )}
              <MapClickHandler onMapClick={handleMapClick} />
            </MapContainer>
            {isGeocoding && (
              <div className="geocoding-indicator">
                <span>{t('geocoding')}</span>
              </div>
            )}
            {config?.operatingArea && (
              <div className="operating-area-indicator">
                <span className="area-badge">{t('operatingArea')}</span>
              </div>
            )}
          </div>
          
          <div className="input-with-suggestions">
            <input
              ref={inputRef}
              type="text"
              className="location-input"
              placeholder={label === t('origin') ? t('selectOrigin') : t('selectDestination')}
              value={address}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              autoFocus={isEditing}
            />
            {isSearching && (
              <div className="searching-indicator">
                <span>{t('searching')}</span>
              </div>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div ref={suggestionsRef} className="suggestions-dropdown">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.place_id}
                    className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  >
                    <span className="suggestion-icon">📍</span>
                    <span className="suggestion-text">{suggestion.display_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <p className="map-instructions">
            {t('mapInstructions')}
          </p>
          
          <div className="location-actions">
            <button
              type="button"
              className="confirm-btn"
              onClick={handleConfirm}
              disabled={!address.trim()}
            >
              {t('confirm')}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      ) : (
        <div className="location-selected">
          <div className="selected-location-display">
            <span className="location-icon">📍</span>
            <span className="location-text">{value}</span>
          </div>
          <button 
            type="button"
            className="edit-location-btn"
            onClick={handleEditClick}
          >
            {t('edit')}
          </button>
        </div>
      )}
      
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default LocationPicker
