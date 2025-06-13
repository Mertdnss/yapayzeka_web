// CV Builder JavaScript
let currentStep = 1;
let cvData = {
    personal: {},
    experience: [],
    skills: [],
    education: []
};

// DOM Elements
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const mobileOverlay = document.querySelector('.mobile-overlay');
const cvStartBtn = document.querySelector('.cv-start-btn');
const cvTemplateBtn = document.querySelector('.cv-template-btn');
const stepBtns = document.querySelectorAll('.step-btn');
const templateSelectBtns = document.querySelectorAll('.template-select-btn');
const cvActionBtns = document.querySelectorAll('.cv-action-btn');

// Sidebar Toggle Functionality
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
    });
}

// Mobile Overlay Click
if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    });
}

// CV Builder Start Button
if (cvStartBtn) {
    cvStartBtn.addEventListener('click', () => {
        // Scroll to CV steps section
        const cvSteps = document.querySelector('.cv-steps');
        if (cvSteps) {
            cvSteps.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Show AI assistant modal (placeholder)
        showNotification('AI Asistanı CV oluşturmanıza yardım etmeye hazır!', 'info');
    });
}

// Template Browse Button
if (cvTemplateBtn) {
    cvTemplateBtn.addEventListener('click', () => {
        // Scroll to templates section
        const templatesSection = document.querySelector('.cv-templates');
        if (templatesSection) {
            templatesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// CV Step Buttons
stepBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const step = e.target.closest('.cv-step');
        const stepNumber = step.querySelector('.step-number').textContent;
        
        // Simulate step activation
        activateStep(stepNumber);
        showNotification(`${stepNumber}. Adım başlatılıyor...`, 'info');
    });
});

// Template Selection
templateSelectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const templateCard = e.target.closest('.template-card');
        const templateName = templateCard.querySelector('.template-name').textContent;
        
        // Highlight selected template
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('selected');
        });
        templateCard.classList.add('selected');
        
        showNotification(`"${templateName}" şablonu seçildi!`, 'success');
        
        // Auto-scroll to CV steps
        setTimeout(() => {
            const cvSteps = document.querySelector('.cv-steps');
            if (cvSteps) {
                cvSteps.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 1000);
    });
});

// CV Action Buttons
cvActionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.classList.contains('edit') ? 'edit' : 
                      btn.classList.contains('download') ? 'download' : 'share';
        const cvItem = e.target.closest('.cv-item');
        const cvName = cvItem.querySelector('.cv-name').textContent;
        
        handleCVAction(action, cvName);
    });
});

// Functions
function activateStep(stepNumber) {
    const steps = document.querySelectorAll('.cv-step');
    
    steps.forEach((step, index) => {
        const currentStepNumber = index + 1;
        const stepElement = step;
        const statusElement = step.querySelector('.step-status');
        
        if (currentStepNumber < stepNumber) {
            // Mark as completed
            stepElement.classList.remove('active');
            statusElement.innerHTML = `
                <div class="step-status completed">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            `;
        } else if (currentStepNumber == stepNumber) {
            // Mark as active
            stepElement.classList.add('active');
            statusElement.innerHTML = '<button class="step-btn">Devam Et</button>';
        } else {
            // Mark as pending
            stepElement.classList.remove('active');
            statusElement.innerHTML = '<span class="step-pending">Beklemede</span>';
        }
    });
}

function handleCVAction(action, cvName) {
    switch (action) {
        case 'edit':
            showNotification(`"${cvName}" düzenleme için açılıyor...`, 'info');
            // Redirect to CV editor (placeholder)
            setTimeout(() => {
                window.location.href = '#cv-editor';
            }, 1500);
            break;
            
        case 'download':
            showNotification(`"${cvName}" indiriliyor...`, 'success');
            // Simulate download
            simulateDownload(cvName);
            break;
            
        case 'share':
            showNotification(`"${cvName}" için paylaşım linki oluşturuluyor...`, 'info');
            // Simulate share link generation
            setTimeout(() => {
                const shareLink = `https://assistai.com/cv/share/${generateId()}`;
                copyToClipboard(shareLink);
                showNotification('Paylaşım linki panoya kopyalandı!', 'success');
            }, 1000);
            break;
    }
}

function simulateDownload(cvName) {
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${cvName.replace(/\s+/g, '_')}.pdf`;
    
    // Simulate file download
    setTimeout(() => {
        showNotification('CV başarıyla indirildi!', 'success');
    }, 2000);
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                ${getNotificationIcon(type)}
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    `;
    
    // Add to notification container or create one
    let container = document.querySelector('.notification-container-fixed');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container-fixed';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
}

function getNotificationIcon(type) {
    const icons = {
        success: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                  </svg>`,
        info: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM11 6a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" fill="currentColor"/>
               </svg>`,
        warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                   <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" fill="currentColor"/>
                  </svg>`,
        error: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                 <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" fill="currentColor"/>
                </svg>`
    };
    return icons[type] || icons.info;
}

// Search functionality
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const templateCards = document.querySelectorAll('.template-card');
        
        templateCards.forEach(card => {
            const templateName = card.querySelector('.template-name').textContent.toLowerCase();
            const templateCategory = card.querySelector('.template-category').textContent.toLowerCase();
            
            if (templateName.includes(query) || templateCategory.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = query === '' ? 'block' : 'none';
            }
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to stats
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        stat.textContent = '0';
        
        // Animate numbers
        setTimeout(() => {
            animateNumber(stat, finalValue);
        }, 500);
    });
    
    // Add entrance animations
    const cards = document.querySelectorAll('.card, .stat-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

function animateNumber(element, finalValue) {
    const isPercentage = finalValue.includes('%');
    const isPlus = finalValue.includes('+');
    const numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
    
    let current = 0;
    const increment = numericValue / 30;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current).toString();
        if (isPlus) displayValue += '+';
        if (isPercentage) displayValue += '%';
        
        element.textContent = displayValue;
    }, 50);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close sidebar on mobile
    if (e.key === 'Escape') {
        sidebar.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }
});

// Add CSS for notifications
const notificationStyles = `
.notification-container-fixed {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
}

.notification {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #667eea;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
}

.notification.show {
    opacity: 1;
    transform: translateX(0);
}

.notification.success {
    border-left-color: #48bb78;
}

.notification.warning {
    border-left-color: #ed8936;
}

.notification.error {
    border-left-color: #f56565;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
}

.notification-icon {
    flex-shrink: 0;
    color: #667eea;
}

.notification.success .notification-icon {
    color: #48bb78;
}

.notification.warning .notification-icon {
    color: #ed8936;
}

.notification.error .notification-icon {
    color: #f56565;
}

.notification-message {
    flex: 1;
    font-weight: 500;
    color: #2d3748;
}

.notification-close {
    background: none;
    border: none;
    color: #a0aec0;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.notification-close:hover {
    background: #f7fafc;
    color: #4a5568;
}

.template-card.selected {
    border-color: #667eea !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: white;
    transform: translateY(-4px) scale(1.02);
}

.template-card.selected .template-name,
.template-card.selected .template-category {
    color: white;
}

.template-card.selected .template-select-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.template-card.selected .template-select-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);