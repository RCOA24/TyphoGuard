// About Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer options
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Main scroll animation observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Initialize hero animation
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }, 300);
    
    // Setup scroll animations for other elements
    const animatedElements = document.querySelectorAll([
        '.mission-content',
        '.stats-container',
        '.features-title',
        '.feature-card',
        '.dam-visual',
        '.local-visual',
        '.vision-content',
        '.emergency-guides',
        '.cta-content'
    ].join(', '));
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
    
    // Counter animation setup
    const counterElements = document.querySelectorAll('.stat-counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counterElements.forEach(el => {
        counterObserver.observe(el);
    });
    
    /**
     * Animate counter from 0 to target value
     */
    function animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const start = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const easedProgress = easeOutCubic(progress);
            const current = Math.floor(easedProgress * target);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    // Enhanced card hover effects (renamed to cardtyphoon)
    const cards = document.querySelectorAll('.cardtyphoon');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add parallax effect to floating elements
    const floatingElements = document.querySelectorAll('.floating-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    });
    
    // Cleanup function for performance
    function cleanup() {
        observer.disconnect();
        counterObserver.disconnect();
    }
    
    window.addEventListener('beforeunload', cleanup);
});
