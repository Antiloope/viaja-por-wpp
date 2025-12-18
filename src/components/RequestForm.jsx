import { useState } from 'react'
import { useTranslation } from '../utils/useTranslation'
import { useCompany } from '../context/CompanyContext'
import { generateWhatsAppURL } from '../utils/whatsapp'
import LocationInput from './LocationInput'
import DateTimePicker from './DateTimePicker'
import './RequestForm.css'

const RequestForm = () => {
  const { t, language } = useTranslation()
  const { config } = useCompany()
  
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    passengers: '',
    notes: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.origin.trim()) {
      newErrors.origin = t('selectOriginError')
    }

    if (!formData.destination.trim()) {
      newErrors.destination = t('selectDestinationError')
    }

    if (!formData.date) {
      newErrors.date = t('dateRequired')
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const selectedDate = new Date(formData.date)
      
      if (selectedDate < today) {
        newErrors.date = t('invalidDate')
      }
    }

    if (!formData.time) {
      newErrors.time = t('timeRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Generar URL de WhatsApp
    const whatsappURL = generateWhatsAppURL(
      config?.whatsappNumber || '',
      {
        origin: formData.origin,
        destination: formData.destination,
        date: formData.date,
        time: formData.time,
        passengers: formData.passengers || null,
        notes: formData.notes || null
      },
      language
    )

    // Redirigir a WhatsApp
    window.location.href = whatsappURL
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <div className="form-fields-grid">
        <LocationInput
          label={t('origin')}
          value={formData.origin}
          onChange={(value) => setFormData({ ...formData, origin: value })}
          error={errors.origin}
          required
        />

        <LocationInput
          label={t('destination')}
          value={formData.destination}
          onChange={(value) => setFormData({ ...formData, destination: value })}
          error={errors.destination}
          required
        />

        <div className="form-row">
          <div className="form-field compact-field">
            <label className="form-label">
              {t('passengers')}
              <span className="optional"> ({t('optional')})</span>
            </label>
            <input
              type="number"
              className="form-input"
              min="1"
              placeholder={t('passengersPlaceholder')}
              value={formData.passengers}
              onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
            />
          </div>

          <DateTimePicker
            date={formData.date}
            time={formData.time}
            onDateChange={(value) => setFormData({ ...formData, date: value })}
            onTimeChange={(value) => setFormData({ ...formData, time: value })}
            dateError={errors.date}
            timeError={errors.time}
          />
        </div>

        <div className="form-field compact-field">
          <label className="form-label">
            {t('notes')}
            <span className="optional"> ({t('optional')})</span>
          </label>
          <textarea
            className="form-textarea"
            rows="2"
            placeholder={t('notesPlaceholder')}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? '...' : t('sendRequest')}
      </button>
    </form>
  )
}

export default RequestForm
