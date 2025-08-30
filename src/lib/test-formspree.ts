// Test utility for Formspree configuration
import config from './config'

export interface FormspreeTestResult {
  isConfigured: boolean
  endpoint: string
  formId: string
  canTest: boolean
  message: string
}

export function testFormspreeConfig(): FormspreeTestResult {
  const result: FormspreeTestResult = {
    isConfigured: config.formspree.isConfigured,
    endpoint: config.formspree.endpoint,
    formId: config.formspree.formId,
    canTest: false,
    message: ''
  }

  if (!result.isConfigured) {
    result.message = 'Formspree no está configurado. Por favor, configura PUBLIC_FORMSPREE_FORM_ID en tu archivo .env'
    return result
  }

  result.canTest = true
  result.message = 'Formspree está configurado correctamente'
  return result
}

export async function testFormspreeSubmission(): Promise<{
  success: boolean
  message: string
  error?: any
}> {
  const configTest = testFormspreeConfig()
  
  if (!configTest.canTest) {
    return {
      success: false,
      message: configTest.message
    }
  }

  try {
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test de configuración',
      message: 'Este es un mensaje de prueba para verificar la configuración de Formspree.',
      _replyto: 'test@example.com',
      _subject: 'Test de configuración del portfolio'
    }

    const response = await fetch(config.formspree.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    if (response.ok) {
      return {
        success: true,
        message: 'Test exitoso. Revisa tu email y el dashboard de Formspree.'
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: 'Error en el test de Formspree',
        error: errorData
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error de conexión al probar Formspree',
      error
    }
  }
}