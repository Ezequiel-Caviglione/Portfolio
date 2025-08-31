import { startPerformanceReporting, performanceMonitor } from './performance';
import { preloadTranslations } from './lazy-translations';
import { supportedLanguages } from './translations';

/**
 * Initialize i18n performance optimizations
 * Call this function early in your app initialization
 */
export function initI18nPerformance(): () => void {
  // Preload all supported translations for better performance
  preloadTranslations(supportedLanguages);
  
  // Start performance monitoring in development
  const stopReporting = startPerformanceReporting(30000); // Report every 30 seconds
  
  // Log initial setup in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🌐 i18n performance monitoring initialized');
    
    // Log performance report when the page is about to unload
    const handleBeforeUnload = () => {
      performanceMonitor.logReport();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Return cleanup function
      return () => {
        stopReporting();
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }
  
  return stopReporting;
}

/**
 * Get current i18n performance metrics
 * Useful for debugging and monitoring
 */
export function getI18nPerformanceMetrics() {
  return performanceMonitor.getMetrics();
}

/**
 * Reset i18n performance metrics
 * Useful for testing or when you want to start fresh measurements
 */
export function resetI18nPerformanceMetrics() {
  performanceMonitor.reset();
}