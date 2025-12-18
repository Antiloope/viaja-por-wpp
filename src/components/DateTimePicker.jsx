import { useTranslation } from '../utils/useTranslation'
import './DateTimePicker.css'

const DateTimePicker = ({ date, time, onDateChange, onTimeChange, dateError, timeError }) => {
  const { t } = useTranslation()

  const getTodayString = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDateChange = (e) => {
    const selectedDate = e.target.value
    const today = getTodayString()
    
    if (selectedDate < today) {
      // La validación se manejará en el componente padre
      return
    }
    
    onDateChange(selectedDate)
  }

  return (
    <div className="datetime-picker">
      <div className="datetime-row">
        <div className="date-picker-container">
          <label className="datetime-label">
            {t('date')}
            <span className="required">*</span>
          </label>
          <input
            type="date"
            className={`date-input ${dateError ? 'error' : ''}`}
            value={date || ''}
            onChange={handleDateChange}
            min={getTodayString()}
            required
          />
          {dateError && <span className="error-message">{dateError}</span>}
        </div>

        <div className="time-picker-container">
          <label className="datetime-label">
            {t('time')}
            <span className="required">*</span>
          </label>
          <input
            type="time"
            className={`time-input ${timeError ? 'error' : ''}`}
            value={time || ''}
            onChange={(e) => onTimeChange(e.target.value)}
            required
          />
          {timeError && <span className="error-message">{timeError}</span>}
        </div>
      </div>
    </div>
  )
}

export default DateTimePicker

