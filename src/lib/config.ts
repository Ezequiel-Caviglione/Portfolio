// Configuration for external services

export const config = {
  formspree: {
    // Get the form ID from environment variables
    // In development, this will use the .env file
    // In production, set PUBLIC_FORMSPREE_FORM_ID in your deployment environment
    formId: import.meta.env.PUBLIC_FORMSPREE_FORM_ID || 'your-form-id',
    
    // Construct the full Formspree endpoint URL
    get endpoint() {
      return `https://formspree.io/f/${this.formId}`
    },
    
    // Check if Formspree is properly configured
    get isConfigured() {
      return this.formId && this.formId !== 'your-form-id'
    }
  }
} as const

export default config