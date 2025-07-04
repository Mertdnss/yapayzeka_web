// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard Script Yüklendi');
    
    // Sidebar toggle functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const mainContent = document.querySelector('.main-content');
    
    console.log('📋 Elementler:', { 
        sidebarToggle: !!sidebarToggle, 
        sidebar: !!sidebar, 
        mobileOverlay: !!mobileOverlay, 
        mainContent: !!mainContent 
    });
    
    // Global event delegation for ALL clicks
    document.body.addEventListener('click', function(e) {
        console.log('🖱️ Click algılandı:', e.target);
        
        // Sidebar toggle check
        if (e.target.matches('.sidebar-toggle') || 
            e.target.closest('.sidebar-toggle') ||
            e.target.parentElement?.classList.contains('sidebar-toggle')) {
            
            e.preventDefault();
            e.stopPropagation();
            console.log('📱 Sidebar toggle tıklandı!');
            
            if (sidebar) {
                if (sidebar.classList.contains('active')) {
                    console.log('🔄 Sidebar kapatılıyor');
                    closeSidebar();
                } else {
                    console.log('🔄 Sidebar açılıyor');
                    openSidebar();
                }
            }
            return;
        }
        
        // Notification button check
        if (e.target.matches('.notification-btn') || 
            e.target.closest('.notification-btn') ||
            e.target.parentElement?.classList.contains('notification-btn')) {
            
            e.preventDefault();
            e.stopPropagation();
            console.log('🔔 Notification button tıklandı!');
            
            const popup = document.querySelector('.notification-popup');
            if (popup) {
                popup.classList.toggle('active');
                console.log('🔔 Popup durumu:', popup.classList.contains('active'));
            }
            return;
        }
    });
    
    function openSidebar() {
        sidebar.classList.add('active');
        mobileOverlay.classList.add('active');
        mainContent.classList.add('sidebar-open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    function closeSidebar() {
        sidebar.classList.remove('active');
        mobileOverlay.classList.remove('active');
        mainContent.classList.remove('sidebar-open');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Sidebar functionality handled by global event delegation above

    // Close sidebar when clicking overlay or outside on mobile
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeSidebar);
    }
    
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !e.target.closest('.sidebar-toggle')) {
                closeSidebar();
            }
        }
    });
    
    // Handle escape key to close sidebar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
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


    // Toast notification function
    function showToast(message, type = 'info') {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    ${type === 'success' ? 
                        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : 
                        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2"/><path d="M8 11V7M8 5h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                    }
                </div>
                <span class="toast-message">${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
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
        console.log('Dashboard loaded successfully! Welcome to CraftingAI Dashboard 🚀');
        
        // Test element accessibility
        const testSidebar = document.querySelector('.sidebar-toggle');
        const testNotification = document.querySelector('.notification-btn');
        console.log('🧪 Test Erişim:', {
            sidebar: testSidebar ? 'BULUNDU' : 'BULUNAMADI',
            notification: testNotification ? 'BULUNDU' : 'BULUNAMADI'
        });
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
const rippleStyleSheet = document.createElement('style');
rippleStyleSheet.textContent = rippleStyles;
document.head.appendChild(rippleStyleSheet);

// Modern Notification System
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.toasts = [];
        this.toastContainer = null;
        this.currentPage = 1;
        this.totalPages = 1;
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.init();
    }

    init() {
        this.createToastContainer();
        this.bindEvents();
    }

    createToastContainer() {
        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.className = 'toast-container';
            document.body.appendChild(this.toastContainer);
        }
    }

    bindEvents() {
        // Notification system events handled by global delegation
        // Only handle internal notification events here
        document.addEventListener('click', (e) => {

            // Mark all read button
            const markAllReadBtn = e.target.closest('.mark-all-read');
            if (markAllReadBtn) {
                e.stopPropagation();
                this.markAllAsRead();
            }

            // View all notifications button
            const viewAllBtn = e.target.closest('.view-all-notifications');
            if (viewAllBtn) {
                e.stopPropagation();
                this.viewAllNotifications();
            }

            // Notification close button
            const closeBtn = e.target.closest('.notification-close');
            if (closeBtn) {
                e.stopPropagation();
                const notificationItem = closeBtn.closest('.notification-item');
                if (notificationItem) {
                    this.removeNotification(notificationItem.dataset.id);
                }
            }

            // Click on notification item
            const notificationItem = e.target.closest('.notification-item');
            if (notificationItem && !e.target.closest('.notification-close')) {
                this.markAsRead(notificationItem.dataset.id);
            }

            // Close popup when clicking outside
            const popup = document.querySelector('.notification-popup');
            if (popup && popup.classList.contains('active') && 
                !e.target.closest('.notification-btn') && !e.target.closest('.notification-popup')) {
                this.closeNotificationPopup();
            }
        });

        // Escape key to close popup
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeNotificationPopup();
            }
        });
    }

    toggleNotificationPopup() {
        const popup = document.querySelector('.notification-popup');
        if (popup) {
            if (popup.classList.contains('active')) {
                this.closeNotificationPopup();
            } else {
                this.openNotificationPopup();
            }
        } else {
            console.warn('Notification popup not found');
        }
    }

    openNotificationPopup() {
        const popup = document.querySelector('.notification-popup');
        if (popup) {
            popup.classList.add('active');
            this.animateNotificationItems();
        }
    }

    closeNotificationPopup() {
        const popup = document.querySelector('.notification-popup');
        if (popup) {
            popup.classList.remove('active');
        }
    }

    animateNotificationItems() {
        const items = document.querySelectorAll('.notification-item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 50}ms`;
            item.style.animation = 'slideInRight 0.3s ease forwards';
        });
    }

    markAsRead(notificationId) {
        const notificationItem = document.querySelector(`[data-id="${notificationId}"]`);
        if (notificationItem && notificationItem.classList.contains('unread')) {
            notificationItem.classList.remove('unread');
            this.updateBadgeCount();
            
            // Show toast
            this.showToast('Bildirim okundu olarak işaretlendi', 'success');
        }
    }

    markAllAsRead() {
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        unreadItems.forEach(item => {
            item.classList.remove('unread');
        });
        
        this.updateBadgeCount();
        this.showToast('Tüm bildirimler okundu olarak işaretlendi', 'success');
    }

    removeNotification(notificationId) {
        const notificationItem = document.querySelector(`[data-id="${notificationId}"]`);
        if (notificationItem) {
            // Animate out
            notificationItem.style.animation = 'slideOutRight 0.3s ease forwards';
            
            setTimeout(() => {
                notificationItem.remove();
                this.updateBadgeCount();
                this.checkEmptyState();
            }, 300);
            
            this.showToast('Bildirim silindi', 'info');
        }
    }

    updateBadgeCount() {
        const badge = document.querySelector('.notification-badge');
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    checkEmptyState() {
        const notificationList = document.querySelector('.notification-list');
        const items = notificationList.querySelectorAll('.notification-item');
        
        if (items.length === 0) {
            notificationList.innerHTML = `
                <div class="empty-notification-state">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M16 20h16M16 24h12M16 28h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <h4>Bildirim yok</h4>
                    <p>Yeni bildirimler burada görünecek</p>
                </div>
            `;
        }
    }

    viewAllNotifications() {
        this.openNotificationModal();
    }

    openNotificationModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('notificationModal');
        if (!modal) {
            this.createNotificationModal();
            modal = document.getElementById('notificationModal');
        }
        
        // Load notifications with pagination
        this.loadNotificationsPage(1);
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeNotificationModal() {
        const modal = document.getElementById('notificationModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    createNotificationModal() {
        const modalHTML = `
            <div class="notification-modal" id="notificationModal">
                <div class="modal-overlay"></div>
                <div class="modal-container">
                    <div class="modal-header">
                        <div class="modal-title">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="m13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <h2>Tüm Bildirimler</h2>
                        </div>
                        <div class="modal-actions">
                            <button class="modal-mark-all-read">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Tümünü Okundu İşaretle
                            </button>
                            <button class="modal-close" id="closeNotificationModal">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="modal-filters">
                        <div class="filter-tabs">
                            <button class="filter-tab active" data-filter="all">Tümü</button>
                            <button class="filter-tab" data-filter="unread">Okunmamış</button>
                            <button class="filter-tab" data-filter="success">Başarılı</button>
                            <button class="filter-tab" data-filter="warning">Uyarı</button>
                            <button class="filter-tab" data-filter="info">Bilgi</button>
                        </div>
                        <div class="notification-search">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                                <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input type="text" placeholder="Bildirimlerde ara..." id="notificationSearch">
                        </div>
                    </div>
                    
                    <div class="modal-content">
                        <div class="modal-notifications-list" id="modalNotificationsList">
                            <!-- Notifications will be loaded here -->
                        </div>
                        
                        <div class="modal-pagination" id="modalPagination">
                            <button class="pagination-btn prev" id="prevPage" disabled>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Önceki
                            </button>
                            
                            <div class="pagination-info">
                                <span id="paginationInfo">1 / 5 sayfa</span>
                            </div>
                            
                            <button class="pagination-btn next" id="nextPage">
                                Sonraki
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.bindModalEvents();
    }

    bindModalEvents() {
        const modal = document.getElementById('notificationModal');
        const closeBtn = document.getElementById('closeNotificationModal');
        const overlay = modal.querySelector('.modal-overlay');
        const markAllReadBtn = modal.querySelector('.modal-mark-all-read');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const searchInput = document.getElementById('notificationSearch');
        const filterTabs = modal.querySelectorAll('.filter-tab');

        // Close modal events
        closeBtn.addEventListener('click', () => this.closeNotificationModal());
        overlay.addEventListener('click', () => this.closeNotificationModal());
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeNotificationModal();
            }
        });

        // Mark all read
        markAllReadBtn.addEventListener('click', () => {
            this.markAllAsRead();
            this.loadNotificationsPage(this.currentPage);
        });

        // Pagination
        prevBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.loadNotificationsPage(this.currentPage - 1);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (this.currentPage < this.totalPages) {
                this.loadNotificationsPage(this.currentPage + 1);
            }
        });

        // Filter tabs
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentFilter = tab.dataset.filter;
                this.loadNotificationsPage(1);
            });
        });

        // Search
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.currentSearch = searchInput.value;
                this.loadNotificationsPage(1);
            }, 300);
        });
    }

    loadNotificationsPage(page) {
        this.currentPage = page;
        const perPage = 10;
        
        // Sample notifications data (in real app, this would come from API)
        const allNotifications = this.generateSampleNotifications();
        
        // Apply filters
        let filteredNotifications = this.filterNotifications(allNotifications);
        
        // Calculate pagination
        this.totalPages = Math.ceil(filteredNotifications.length / perPage);
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const pageNotifications = filteredNotifications.slice(startIndex, endIndex);
        
        // Render notifications
        this.renderModalNotifications(pageNotifications);
        this.updatePagination();
    }

    generateSampleNotifications() {
        const notifications = [];
        const types = ['success', 'warning', 'info'];
        const titles = [
            'CV Oluşturma Tamamlandı', 'Görev Tamamlandı', 'Yeni Özellik Eklendi',
            'Ses Klonlama Hazır', 'Profil Güncellendi', 'Yeni Görev Atandı',
            'Başarılı İndirme', 'Sistem Güncellemesi', 'Yeni Bildirim'
        ];
        const descriptions = [
            'CV başarıyla oluşturuldu ve indirmeye hazır.',
            'Göreviniz başarıyla tamamlandı. Puan kazandınız!',
            'Yeni özellikler sistemimize eklendi.',
            'Ses klonlama işleminiz tamamlandı.',
            'Profil bilgileriniz güncellendi.',
            'Size yeni bir görev atandı.'
        ];

        for (let i = 1; i <= 47; i++) {
            notifications.push({
                id: i,
                title: titles[Math.floor(Math.random() * titles.length)],
                text: descriptions[Math.floor(Math.random() * descriptions.length)],
                type: types[Math.floor(Math.random() * types.length)],
                time: this.getRandomTime(),
                read: Math.random() > 0.6
            });
        }

        return notifications;
    }

    filterNotifications(notifications) {
        let filtered = [...notifications];
        
        // Apply filter
        if (this.currentFilter === 'unread') {
            filtered = filtered.filter(n => !n.read);
        } else if (this.currentFilter !== 'all') {
            filtered = filtered.filter(n => n.type === this.currentFilter);
        }
        
        // Apply search
        if (this.currentSearch) {
            const search = this.currentSearch.toLowerCase();
            filtered = filtered.filter(n => 
                n.title.toLowerCase().includes(search) || 
                n.text.toLowerCase().includes(search)
            );
        }
        
        return filtered;
    }

    renderModalNotifications(notifications) {
        const container = document.getElementById('modalNotificationsList');
        
        if (notifications.length === 0) {
            container.innerHTML = `
                <div class="modal-empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h3>Bildirim Bulunamadı</h3>
                    <p>Aradığınız kriterlere uygun bildirim bulunamadı.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = notifications.map(notification => `
            <div class="modal-notification-item ${!notification.read ? 'unread' : ''}" data-id="${notification.id}">
                <div class="modal-notification-icon ${notification.type}">
                    ${this.getNotificationIcon(notification.type)}
                </div>
                <div class="modal-notification-content">
                    <div class="modal-notification-title">${notification.title}</div>
                    <div class="modal-notification-text">${notification.text}</div>
                    <div class="modal-notification-time">${notification.time}</div>
                </div>
                <div class="modal-notification-actions">
                    ${!notification.read ? '<button class="mark-read-btn" title="Okundu İşaretle"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' : ''}
                    <button class="delete-notification-btn" title="Sil">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Bind item events
        this.bindModalNotificationEvents();
    }

    bindModalNotificationEvents() {
        const container = document.getElementById('modalNotificationsList');
        
        container.addEventListener('click', (e) => {
            const notificationItem = e.target.closest('.modal-notification-item');
            if (!notificationItem) return;
            
            const notificationId = notificationItem.dataset.id;
            
            if (e.target.closest('.mark-read-btn')) {
                notificationItem.classList.remove('unread');
                this.showToast('Bildirim okundu olarak işaretlendi', 'success');
                e.target.closest('.mark-read-btn').remove();
            } else if (e.target.closest('.delete-notification-btn')) {
                notificationItem.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => {
                    notificationItem.remove();
                    this.showToast('Bildirim silindi', 'info');
                }, 300);
            } else {
                // Mark as read when clicked
                if (notificationItem.classList.contains('unread')) {
                    notificationItem.classList.remove('unread');
                    const markReadBtn = notificationItem.querySelector('.mark-read-btn');
                    if (markReadBtn) markReadBtn.remove();
                }
            }
        });
    }

    updatePagination() {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const paginationInfo = document.getElementById('paginationInfo');
        
        prevBtn.disabled = this.currentPage <= 1;
        nextBtn.disabled = this.currentPage >= this.totalPages;
        
        paginationInfo.textContent = `${this.currentPage} / ${this.totalPages} sayfa`;
    }

    getRandomTime() {
        const times = [
            '5 dakika önce', '1 saat önce', '2 saat önce', '1 gün önce', 
            '2 gün önce', '1 hafta önce', '2 hafta önce', '1 ay önce'
        ];
        return times[Math.floor(Math.random() * times.length)];
    }

    // Toast notification methods
    showToast(message, type = 'info', title = '') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconSvg = this.getToastIcon(type);
        
        toast.innerHTML = `
            <div class="toast-icon">${iconSvg}</div>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        `;

        this.toastContainer.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove after 5 seconds
        setTimeout(() => this.removeToast(toast), 5000);

        // Close button handler
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.removeToast(toast);
        });
    }

    removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    getToastIcon(type) {
        const icons = {
            success: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>`,
            error: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>`,
            info: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>`
        };
        return icons[type] || icons.info;
    }

    // Public methods for external use
    addNotification(notification) {
        // Add new notification to the list
        const notificationList = document.querySelector('.notification-list');
        if (notificationList) {
            const emptyState = notificationList.querySelector('.empty-notification-state');
            if (emptyState) {
                emptyState.remove();
            }

            const notificationHTML = this.createNotificationHTML(notification);
            notificationList.insertAdjacentHTML('afterbegin', notificationHTML);
            this.updateBadgeCount();
        }
    }

    createNotificationHTML(notification) {
        const iconClass = notification.type || '';
        const iconSvg = this.getNotificationIcon(notification.type);
        
        return `
            <div class="notification-item unread" data-id="${notification.id}">
                <div class="notification-icon ${iconClass}">
                    ${iconSvg}
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-text">${notification.text}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
                <button class="notification-close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        `;
    }

    getNotificationIcon(type) {
        const icons = {
            success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
            warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
            info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
        };
        return icons[type] || icons.info;
    }
}

// Initialize notification system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.notificationSystem = new NotificationSystem();
    
    // Update badge count on page load
    if (window.notificationSystem) {
        window.notificationSystem.updateBadgeCount();
    }
    
    // Demo: Add a notification after 3 seconds (remove this in production)
    setTimeout(() => {
        if (window.notificationSystem) {
            // Example of how to add a new notification programmatically
            // window.notificationSystem.addNotification({
            //     id: Date.now(),
            //     title: 'Yeni Bildirim',
            //     text: 'Bu bir test bildirimidir.',
            //     time: 'Şimdi',
            //     type: 'info'
            // });
        }
    }, 3000);
});

// CSS animations for notification items
const notificationAnimations = `
@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOutRight {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(20px);
    }
}

.empty-notification-state {
    text-align: center;
    padding: 40px 20px;
    color: #9ca3af;
}

.empty-notification-state svg {
    margin-bottom: 16px;
    opacity: 0.5;
}

.empty-notification-state h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: #6b7280;
}

.empty-notification-state p {
    margin: 0;
    font-size: 14px;
    color: #9ca3af;
}
`;

// Add animations to head
const notificationStyleSheet = document.createElement('style');
notificationStyleSheet.textContent = notificationAnimations;
document.head.appendChild(notificationStyleSheet);