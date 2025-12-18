import { translations } from '../data/translations'

export const generateWhatsAppURL = (companyNumber, formData, language = 'es') => {
  const t = translations[language].whatsappMessage
  
  // Limpiar el número de WhatsApp (solo números)
  const cleanNumber = String(companyNumber).replace(/\D/g, '')
  
  // Formatear fecha a formato legible (YYYY-MM-DD -> DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }
  
  // Construir el mensaje formateado
  let message = `*${t.header}*\n\n`
  message += `*${t.origin}:* ${formData.origin}\n`
  message += `*${t.destination}:* ${formData.destination}\n`
  message += `*${t.date}:* ${formatDate(formData.date)}\n`
  message += `*${t.time}:* ${formData.time}\n`
  
  if (formData.passengers) {
    message += `*${t.passengers}:* ${formData.passengers}\n`
  }
  
  if (formData.notes) {
    message += `*${t.notes}:* ${formData.notes}\n`
  }
  
  // Codificar el mensaje para URL
  const encodedMessage = encodeURIComponent(message)
  
  // Generar URL de WhatsApp
  const whatsappURL = `https://wa.me/${cleanNumber}?text=${encodedMessage}`
  
  return whatsappURL
}

