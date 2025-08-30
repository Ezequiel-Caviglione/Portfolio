// Simple JavaScript test for Formspree configuration
// This can be run in the browser console to test the setup

function testFormspreeConfig() {
  // Get the form ID from environment (this will work in Astro)
  const formId = import.meta.env?.PUBLIC_FORMSPREE_FORM_ID || 'your-form-id'
  const endpoint = `https://formspree.io/f/${formId}`
  const isConfigured = formId && formId !== 'your-form-id'
  
  console.log('Formspree Configuration Test:')
  console.log('Form ID:', formId)
  console.log('Endpoint:', endpoint)
  console.log('Is Configured:', isConfigured)
  
  return {
    formId,
    endpoint,
    isConfigured,
    message: isConfigured 
      ? 'Formspree está configurado correctamente' 
      : 'Formspree necesita configuración. Actualiza PUBLIC_FORMSPREE_FORM_ID en tu archivo .env'
  }
}

async function testFormspreeSubmission() {
  const config = testFormspreeConfig()
  
  if (!config.isConfigured) {
    console.error(config.message)
    return { success: false, message: config.message }
  }
  
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test de configuración',
    message: 'Este es un mensaje de prueba para verificar la configuración de Formspree.',
    _replyto: 'test@example.com',
    _subject: 'Test de configuración del portfolio'
  }
  
  try {
    console.log('Enviando test a:', config.endpoint)
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })
    
    if (response.ok) {
      console.log('✅ Test exitoso!')
      return {
        success: true,
        message: 'Test exitoso. Revisa tu email y el dashboard de Formspree.'
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Error en el test:', errorData)
      return {
        success: false,
        message: 'Error en el test de Formspree',
        error: errorData
      }
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error)
    return {
      success: false,
      message: 'Error de conexión al probar Formspree',
      error: error.message
    }
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testFormspreeConfig = testFormspreeConfig
  window.testFormspreeSubmission = testFormspreeSubmission
}