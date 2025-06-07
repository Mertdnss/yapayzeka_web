// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // FAQ Toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
    
    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('mobile-active')) {
                    navLinks.classList.remove('mobile-active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Add scroll effect to navbar
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        // Add background blur when scrolled
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .testimonial-content, .cta-content, .pricing-card, .value-item, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Button click effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-register, .btn-login, .plan-button, .contact-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Typing indicator animation controller
    const startTyping = () => {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.opacity = '1';
        }
    };
    
    const stopTyping = () => {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            setTimeout(() => {
                typingIndicator.style.opacity = '0.5';
            }, 3000);
        }
    };
    
    // Start typing animation
    startTyping();
    stopTyping();
    
    // Form validation (if forms are added later)
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    
    // Add loading states to buttons
    const addLoadingState = (button) => {
        const originalText = button.textContent;
        button.textContent = 'Loading...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    };
});

// Additional CSS for animations and effects
const additionalStyles = `
    .navbar {
        transition: transform 0.3s ease, background-color 0.3s ease;
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .mobile-active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        padding: 20px;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
        gap: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border-radius: 0 0 16px 16px;
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
        background: #6C63FF;
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
        transform: scale(0);
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
        background: #6C63FF;
    }
    
    .mobile-menu-toggle.active {
        background: rgba(108, 99, 255, 0.1);
        transform: scale(1.1);
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        pointer-events: none;
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideInDown {
        0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        }
        50% {
            opacity: 0.8;
            transform: translateY(-5px) scale(0.98);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @keyframes fadeInStagger {
        0% {
            opacity: 0;
            transform: translateY(10px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .btn-primary,
    .btn-secondary,
    .btn-register,
    .btn-login,
    .plan-button,
    .contact-btn {
        position: relative;
        overflow: hidden;
    }
    
    @media (max-width: 768px) {
        .nav-links.mobile-active {
            display: flex !important;
        }
        
        .nav-links.mobile-active .nav-link,
        .nav-links.mobile-active .btn-login,
        .nav-links.mobile-active .btn-register {
            animation: fadeInStagger 0.3s ease-out forwards;
            opacity: 0;
        }
        
        .nav-links.mobile-active .nav-link:nth-child(1) { animation-delay: 0.1s; }
        .nav-links.mobile-active .nav-link:nth-child(2) { animation-delay: 0.15s; }
        .nav-links.mobile-active .btn-login { animation-delay: 0.2s; }
        .nav-links.mobile-active .btn-register { animation-delay: 0.25s; }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet); 