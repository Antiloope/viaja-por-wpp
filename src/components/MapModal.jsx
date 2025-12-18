import { useState, useEffect, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet'
import { useTranslation } from '../utils/useTranslation'
import { useCompany } from '../context/CompanyContext'
import 'leaflet/dist/leaflet.css'
import './MapModal.css'

// Fix para los iconos de Leaflet
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

// Función de geocodificación inversa
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

const MapModal = ({ isOpen, onClose, onConfirm, label }) => {
  const { t } = useTranslation()
  const { config } = useCompany()
  const [position, setPosition] = useState(null)
  const [address, setAddress] = useState('')
  const [isGeocoding, setIsGeocoding] = useState(false)
  const geocodeTimeoutRef = useRef(null)

  const mapCenter = config?.mapCenter || { lat: -32.8895, lng: -68.8458 }
  const mapZoom = config?.mapZoom || 13

  // Resetear cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setPosition(null)
      setAddress('')
    }
  }, [isOpen])

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Función para actualizar posición y geocodificar
  const updatePosition = useCallback(async (latlng) => {
    setPosition([latlng.lat, latlng.lng])
    setIsGeocoding(true)

    if (geocodeTimeoutRef.current) {
      clearTimeout(geocodeTimeoutRef.current)
    }

    geocodeTimeoutRef.current = setTimeout(async () => {
      try {
        const geocodedAddress = await reverseGeocode(latlng.lat, latlng.lng)
        if (geocodedAddress) {
          setAddress(geocodedAddress)
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

  const handleMapClick = useCallback((latlng) => {
    updatePosition(latlng)
  }, [updatePosition])

  const handleMarkerDragEnd = useCallback((e) => {
    const marker = e.target
    const position = marker.getLatLng()
    updatePosition(position)
  }, [updatePosition])

  const handleConfirm = () => {
    if (address && position) {
      onConfirm(address, position)
      onClose()
    }
  }

  const handleClose = () => {
    onClose()
  }

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current)
      }
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className={`map-modal-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}>
      <div className="map-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="map-modal-header">
          <h3 className="map-modal-title">
            {t('selectLocation')} - {label}
          </h3>
          <button 
            className="map-modal-close"
            onClick={handleClose}
            aria-label={t('close')}
          >
            ✕
          </button>
        </div>
        
        <div className="map-modal-body">
          <div className="map-container-wrapper">
            <MapContainer
              center={position || [mapCenter.lat, mapCenter.lng]}
              zoom={position ? 15 : mapZoom}
              scrollWheelZoom={true}
              className="map-modal-map"
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
          </div>
          
          {address && (
            <div className="selected-address">
              <span className="address-label">{t('selectedAddress')}:</span>
              <span className="address-text">{address}</span>
            </div>
          )}
        </div>

        <div className="map-modal-footer">
          <button 
            className="map-modal-cancel"
            onClick={handleClose}
          >
            {t('cancel')}
          </button>
          <button 
            className="map-modal-confirm"
            onClick={handleConfirm}
            disabled={!address || !position}
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MapModal

