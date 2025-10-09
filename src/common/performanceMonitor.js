// Copyright (C) 2017-2023 Smart code 203358507

const { isFirefox } = require('./firefoxOptimizations');

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            frameDrops: 0,
            avgFrameTime: 0,
            lastFrameTime: performance.now()
        };
        
        if (isFirefox()) {
            this.startMonitoring();
        }
    }
    
    startMonitoring() {
        let frameCount = 0;
        let totalFrameTime = 0;
        
        const measureFrame = () => {
            const now = performance.now();
            const frameTime = now - this.metrics.lastFrameTime;
            
            if (frameTime > 16.67) { // > 60fps threshold
                this.metrics.frameDrops++;
            }
            
            totalFrameTime += frameTime;
            frameCount++;
            this.metrics.avgFrameTime = totalFrameTime / frameCount;
            this.metrics.lastFrameTime = now;
            
            requestAnimationFrame(measureFrame);
        };
        
        requestAnimationFrame(measureFrame);
    }
    
    getMetrics() {
        return { ...this.metrics };
    }
    
    logPerformance() {
        if (isFirefox() && process.env.NODE_ENV === 'development') {
            console.log('Firefox Performance Metrics:', this.getMetrics());
        }
    }
}

const performanceMonitor = new PerformanceMonitor();

module.exports = performanceMonitor;