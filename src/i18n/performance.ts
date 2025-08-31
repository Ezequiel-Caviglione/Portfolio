/**
 * Performance monitoring utilities for i18n system
 */

interface PerformanceMetrics {
  translationLookups: number;
  cacheHits: number;
  cacheMisses: number;
  averageLookupTime: number;
  totalLookupTime: number;
}

class I18nPerformanceMonitor {
  private metrics: PerformanceMetrics = {
    translationLookups: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageLookupTime: 0,
    totalLookupTime: 0,
  };

  private lookupTimes: number[] = [];

  /**
   * Record a translation lookup
   */
  recordLookup(startTime: number, endTime: number, cacheHit: boolean): void {
    const lookupTime = endTime - startTime;
    
    this.metrics.translationLookups++;
    this.lookupTimes.push(lookupTime);
    this.metrics.totalLookupTime += lookupTime;
    this.metrics.averageLookupTime = this.metrics.totalLookupTime / this.metrics.translationLookups;
    
    if (cacheHit) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics & { cacheHitRate: number } {
    const cacheHitRate = this.metrics.translationLookups > 0 
      ? (this.metrics.cacheHits / this.metrics.translationLookups) * 100 
      : 0;

    return {
      ...this.metrics,
      cacheHitRate,
    };
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics = {
      translationLookups: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageLookupTime: 0,
      totalLookupTime: 0,
    };
    this.lookupTimes = [];
  }

  /**
   * Log performance report to console (development only)
   */
  logReport(): void {
    if (process.env.NODE_ENV !== 'development') return;

    const metrics = this.getMetrics();
    
    console.group('🌐 i18n Performance Report');
    console.log(`Total lookups: ${metrics.translationLookups}`);
    console.log(`Cache hit rate: ${metrics.cacheHitRate.toFixed(2)}%`);
    console.log(`Average lookup time: ${metrics.averageLookupTime.toFixed(3)}ms`);
    console.log(`Total lookup time: ${metrics.totalLookupTime.toFixed(3)}ms`);
    
    if (metrics.cacheHitRate < 80) {
      console.warn('⚠️ Low cache hit rate detected. Consider optimizing translation caching.');
    }
    
    if (metrics.averageLookupTime > 1) {
      console.warn('⚠️ High average lookup time detected. Consider optimizing translation lookup.');
    }
    
    console.groupEnd();
  }
}

// Global performance monitor instance
export const performanceMonitor = new I18nPerformanceMonitor();

/**
 * Decorator function to measure translation lookup performance
 */
export function measureTranslationPerformance<T extends (...args: any[]) => any>(
  fn: T,
  cacheCheck: (...args: Parameters<T>) => boolean
): T {
  return ((...args: Parameters<T>) => {
    const startTime = performance.now();
    const result = fn(...args);
    const endTime = performance.now();
    
    const cacheHit = cacheCheck(...args);
    performanceMonitor.recordLookup(startTime, endTime, cacheHit);
    
    return result;
  }) as T;
}

/**
 * Log performance report periodically (development only)
 */
export function startPerformanceReporting(intervalMs: number = 30000): () => void {
  if (process.env.NODE_ENV !== 'development') {
    return () => {}; // No-op in production
  }

  const interval = setInterval(() => {
    const metrics = performanceMonitor.getMetrics();
    if (metrics.translationLookups > 0) {
      performanceMonitor.logReport();
    }
  }, intervalMs);

  return () => clearInterval(interval);
}