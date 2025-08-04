// Performance Optimizations

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Debounce Function for Performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle Function for Performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Optimized Scroll Handler
const optimizedScrollHandler = throttle(function() {
    // Scroll-based animations and effects
    animateOnScroll();
    updateScrollProgress();
}, 16); // ~60fps

// Preload Critical Resources
function preloadCriticalResources() {
    const criticalImages = [
        'assets/images/Logo.png',
        'assets/images/slider.png',
        'assets/images/imagehome.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Service Worker Registration (if available)
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Cache Management
function initializeCache() {
    // Cache frequently used elements
    window.cachedElements = {
        scrollBtn: document.getElementById('scrollBtn'),
        modal: document.getElementById('exampleModal'),
        forms: document.querySelectorAll('form'),
        carousel: document.querySelector('.owl-carousel')
    };
}

// Memory Management
function cleanupEventListeners() {
    // Remove event listeners when elements are removed
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    // Clean up any event listeners
                    const clone = node.cloneNode(true);
                    node.parentNode.replaceChild(clone, node);
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Image Optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading="lazy" for images below the fold
        if (!isInViewport(img)) {
            img.loading = 'lazy';
        }
        
        // Add error handling
        img.onerror = function() {
            this.src = 'assets/images/placeholder.jpg';
            this.alt = 'صورة غير متوفرة';
        };
    });
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Font Loading Optimization
function optimizeFontLoading() {
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
    
    // Add font-display: swap for better performance
    const style = document.createElement('style');
    style.textContent = `
        @font-face {
            font-family: 'Cairo';
            font-display: swap;
        }
    `;
    document.head.appendChild(style);
}

// DOM Ready Optimization
function optimizeDOMReady() {
    // Use requestIdleCallback for non-critical tasks
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initializeLazyLoading();
            optimizeImages();
            cleanupEventListeners();
        });
    } else {
        // Fallback for older browsers
        setTimeout(() => {
            initializeLazyLoading();
            optimizeImages();
            cleanupEventListeners();
        }, 1000);
    }
}

// Analytics and Performance Monitoring
function initializePerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log(`${entry.name}: ${entry.value}`);
            }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
    
    // Monitor resource loading
    window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        console.log('Page Load Time:', navigation.loadEventEnd - navigation.loadEventStart);
    });
}

// Initialize all optimizations
document.addEventListener('DOMContentLoaded', () => {
    initializeCache();
    preloadCriticalResources();
    optimizeFontLoading();
    registerServiceWorker();
    initializePerformanceMonitoring();
    
    // Use optimized scroll handler
    window.addEventListener('scroll', optimizedScrollHandler);
    
    // Initialize optimizations after page load
    window.addEventListener('load', optimizeDOMReady);
});

// Export optimization functions
window.optimizations = {
    debounce,
    throttle,
    isInViewport,
    optimizeImages
}; 