// Performance Monitor - Minimal Implementation
export interface PerformanceMetrics {
  renderTime: number;
  loadTime: number;
  memoryUsage: number;
  timestamp: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  
  startMeasure(name: string): void {
    performance.mark(`${name}-start`);
  }
  
  endMeasure(name: string): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    return measure ? measure.duration : 0;
  }
  
  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
  }
  
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }
  
  clearMetrics(): void {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

export function usePerformanceMonitor(name: string) {
  // Placeholder hook implementation
  return {
    startMeasure: () => performanceMonitor.startMeasure(name),
    endMeasure: () => performanceMonitor.endMeasure(name)
  };
}