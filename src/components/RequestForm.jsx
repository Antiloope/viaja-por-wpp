import { useState } from 'react'
import { useTranslation } from '../utils/useTranslation'
import { companyConfig } from '../data/companyConfig'
import { generateWhatsAppURL } from '../utils/whatsapp'
import LocationPicker from './LocationPicker'
import DateTimePicker from './DateTimePicker'
import './RequestForm.css'

const RequestForm = () => {
  const { t, language } = useTranslation()
  
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
      companyConfig.whatsappNumber,
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
      <h2 className="form-title">{t('requestForm')}</h2>

      <LocationPicker
        label={t('origin')}
        value={formData.origin}
        onChange={(value) => setFormData({ ...formData, origin: value })}
        error={errors.origin}
        required
      />

      <LocationPicker
        label={t('destination')}
        value={formData.destination}
        onChange={(value) => setFormData({ ...formData, destination: value })}
        error={errors.destination}
        required
      />

      <DateTimePicker
        date={formData.date}
        time={formData.time}
        onDateChange={(value) => setFormData({ ...formData, date: value })}
        onTimeChange={(value) => setFormData({ ...formData, time: value })}
        dateError={errors.date}
        timeError={errors.time}
      />

      <div className="form-field">
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

      <div className="form-field">
        <label className="form-label">
          {t('notes')}
          <span className="optional"> ({t('optional')})</span>
        </label>
        <textarea
          className="form-textarea"
          rows="4"
          placeholder={t('notesPlaceholder')}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
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

