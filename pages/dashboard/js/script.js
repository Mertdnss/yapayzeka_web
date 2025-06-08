// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const body = document.body;
    
    function openSidebar() {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        body.classList.add('sidebar-open');
    }
    
    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        body.classList.remove('sidebar-open');
    }
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            if (sidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target) && 
                !sidebarOverlay.contains(e.target)) {
                closeSidebar();
            }
        }
    });

    // Close sidebar on window resize if desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });

    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.closest('.nav-item').classList.add('active');
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                // Implement search functionality here
                console.log('Searching for:', this.value);
            }
        });

        searchInput.addEventListener('input', function() {
            // Real-time search suggestions
            if (this.value.length > 2) {
                // Implement search suggestions here
                console.log('Search suggestions for:', this.value);
            }
        });
    }

    // Notification button
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            // Toggle notifications panel
            console.log('Show notifications');
            // You can implement a dropdown here
        });
    }

    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);

            // Handle specific actions
            const buttonText = this.textContent.trim();
            switch(buttonText) {
                case 'Yeni CV Oluştur':
                    console.log('Navigate to CV creator');
                    // window.location.href = 'cv-creator.html';
                    break;
                case 'Ses Kaydet':
                    console.log('Navigate to voice recording');
                    // window.location.href = 'voice-clone.html';
                    break;
                case 'Görev Ekle':
                    console.log('Open task creation modal');
                    // openTaskModal();
                    break;
                case 'Template Görüntüle':
                    console.log('Navigate to templates');
                    // window.location.href = 'templates.html';
                    break;
            }
        });
    });

    // Chart period selector
    const chartPeriod = document.querySelector('.chart-period');
    
    if (chartPeriod) {
        chartPeriod.addEventListener('change', function() {
            console.log('Chart period changed to:', this.value);
            // Update chart data based on selected period
            updateChart(this.value);
        });
    }

    // AI suggestion buttons
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    
    suggestionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const suggestionItem = this.closest('.suggestion-item');
            const title = suggestionItem.querySelector('.suggestion-title').textContent;
            
            console.log('AI suggestion clicked:', title);
            
            // Add loading state
            this.textContent = 'İşleniyor...';
            this.disabled = true;
            
            // Simulate processing
            setTimeout(() => {
                this.textContent = 'Tamamlandı';
                this.style.background = '#22c55e';
                
                // Remove suggestion after a moment
                setTimeout(() => {
                    suggestionItem.style.opacity = '0';
                    suggestionItem.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        suggestionItem.remove();
                    }, 300);
                }, 1000);
            }, 2000);
        });
    });

    // Chart bars interaction
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            // Show tooltip
            const value = this.querySelector('.bar-value').textContent;
            console.log('Chart bar value:', value);
        });
    });

    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
                console.log('Logging out...');
                // window.location.href = '../auth/login.html';
            }
        });
    }

    // Real-time updates simulation
    function simulateRealTimeUpdates() {
        // Update notification count
        const notificationBadge = document.querySelector('.notification-badge');
        if (notificationBadge) {
            let count = parseInt(notificationBadge.textContent);
            setInterval(() => {
                if (Math.random() > 0.95) { // 5% chance every second
                    count++;
                    notificationBadge.textContent = count;
                    notificationBadge.style.animation = 'pulse 0.5s ease-in-out';
                    setTimeout(() => {
                        notificationBadge.style.animation = '';
                    }, 500);
                }
            }, 1000);
        }

        // Update stats occasionally
        const statNumbers = document.querySelectorAll('.stat-number');
        setInterval(() => {
            if (Math.random() > 0.98) { // 2% chance
                const randomStat = statNumbers[Math.floor(Math.random() * statNumbers.length)];
                const currentValue = parseInt(randomStat.textContent);
                if (!isNaN(currentValue)) {
                    randomStat.textContent = currentValue + 1;
                    randomStat.style.color = '#22c55e';
                    setTimeout(() => {
                        randomStat.style.color = '';
                    }, 1000);
                }
            }
        }, 5000);
    }

    // Chart update function
    function updateChart(period) {
        const chartBars = document.querySelectorAll('.chart-bar');
        const chartLabels = document.querySelectorAll('.chart-labels span');
        
        // Sample data for different periods
        const data = {
            'Bu Ay': {
                values: [12, 17, 8, 14, 18],
                labels: ['Hft 1', 'Hft 2', 'Hft 3', 'Hft 4', 'Hft 5']
            },
            'Son 3 Ay': {
                values: [45, 52, 38, 61, 48, 55, 42, 58, 63, 40, 47, 52],
                labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
            },
            'Bu Yıl': {
                values: [120, 145, 98, 167, 134],
                labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']
            }
        };

        const currentData = data[period] || data['Bu Ay'];
        
        chartBars.forEach((bar, index) => {
            if (index < currentData.values.length) {
                const value = currentData.values[index];
                const maxValue = Math.max(...currentData.values);
                const height = (value / maxValue) * 100;
                
                bar.style.height = height + '%';
                bar.querySelector('.bar-value').textContent = value;
                bar.style.display = 'block';
            } else {
                bar.style.display = 'none';
            }
        });

        chartLabels.forEach((label, index) => {
            if (index < currentData.labels.length) {
                label.textContent = currentData.labels[index];
                label.style.display = 'block';
            } else {
                label.style.display = 'none';
            }
        });
    }

    // Smooth animations on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Observe cards for animation
    document.querySelectorAll('.card, .stat-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Initialize real-time updates
    simulateRealTimeUpdates();

    // Welcome message
    setTimeout(() => {
        console.log('Dashboard loaded successfully! Welcome to AssistAI Dashboard 🚀');
    }, 1000);
});

// Additional CSS for ripple effect
const rippleStyles = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }

    .action-btn {
        position: relative;
        overflow: hidden;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet); 