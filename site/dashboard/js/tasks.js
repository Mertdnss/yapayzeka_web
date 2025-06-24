// Tasks Page JavaScript

// DOM Elements
const filterButtons = document.querySelectorAll('.filter-btn');
const taskCards = document.querySelectorAll('.task-card');
const taskStartButtons = document.querySelectorAll('.task-start-btn');
const continueButtons = document.querySelectorAll('.continue-btn');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const mobileOverlay = document.querySelector('.mobile-overlay');
const mainContent = document.querySelector('.main-content');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Notification functionality
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const markAllReadBtn = document.querySelector('.mark-all-read');
    const viewAllNotificationsBtn = document.querySelector('.view-all-notifications');
    
    if (notificationBtn && notificationDropdown) {
        // Toggle notification dropdown
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.classList.toggle('active');
            console.log('Notification button clicked, dropdown toggled');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
                notificationDropdown.classList.remove('active');
            }
        });

        // Mark all as read functionality
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', function() {
                const unreadItems = document.querySelectorAll('.notification-item.unread');
                unreadItems.forEach(item => {
                    item.classList.remove('unread');
                });
                
                // Update badge count
                const badge = document.querySelector('.notification-badge');
                if (badge) {
                    badge.style.opacity = '0';
                    setTimeout(() => {
                        badge.textContent = '0';
                        badge.style.opacity = '1';
                    }, 150);
                }
            });
        }

        // View all notifications
        if (viewAllNotificationsBtn) {
            viewAllNotificationsBtn.addEventListener('click', function() {
                console.log('Navigate to all notifications page');
                notificationDropdown.classList.remove('active');
            });
        }

        // Individual notification actions
        document.querySelectorAll('.notification-action').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const notificationItem = this.closest('.notification-item');
                const title = notificationItem.querySelector('.notification-title').textContent;
                
                // Mark as read
                notificationItem.classList.remove('unread');
                
                // Update badge
                updateNotificationBadge();
                
                console.log('Action clicked for notification:', title);
            });
        });

        // Click on notification item to mark as read
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.addEventListener('click', function() {
                this.classList.remove('unread');
                updateNotificationBadge();
            });
        });
    }
    
    // Update notification badge count
    function updateNotificationBadge() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            if (unreadCount === 0) {
                badge.style.opacity = '0';
                setTimeout(() => {
                    badge.textContent = '0';
                    badge.style.opacity = '1';
                }, 150);
            } else {
                badge.textContent = unreadCount;
                badge.style.opacity = '1';
            }
        }
    }
    
    initializeFilters();
    initializeTaskActions();
    initializeSidebar();
    updateTaskProgress();
});

// Filter functionality
function initializeFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter tasks
            filterTasks(filterValue);
        });
    });
}

// Filter tasks based on category
function filterTasks(category) {
    taskCards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            const cardCategory = card.getAttribute('data-category');
            if (cardCategory === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Task action handlers
function initializeTaskActions() {
    // Task start buttons
    taskStartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskCard = this.closest('.task-card');
            const taskTitle = taskCard.querySelector('.task-title').textContent;
            
            // Show confirmation modal
            showTaskConfirmation(taskTitle, () => {
                startTask(taskCard);
            });
        });
    });
    
    // Continue buttons
    continueButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskCard = this.closest('.my-task-card');
            const taskTitle = taskCard.querySelector('h4').textContent;
            
            // Simulate continuing task
            continueTask(taskCard, taskTitle);
        });
    });
}

// Start a new task
function startTask(taskCard) {
    const taskTitle = taskCard.querySelector('.task-title').textContent;
    const rewardPoints = taskCard.querySelector('.reward-points').textContent;
    
    // Add loading state
    const startButton = taskCard.querySelector('.task-start-btn');
    startButton.innerHTML = '<span class="loading-spinner"></span> Başlatılıyor...';
    startButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification(`"${taskTitle}" görevi başarıyla başlatıldı!`, 'success');
        
        // Update button
        startButton.innerHTML = 'Başlatıldı';
        startButton.classList.remove('btn-primary');
        startButton.classList.add('btn-success');
        
        // Update user points display
        updatePointsDisplay();
        
        // Add to my tasks (simulate)
        addToMyTasks(taskTitle, rewardPoints);
    }, 1500);
}

// Continue an existing task
function continueTask(taskCard, taskTitle) {
    // Simulate opening task interface
    showNotification(`"${taskTitle}" görevine devam ediliyor...`, 'info');
    
    // In a real app, this would redirect to task interface
    setTimeout(() => {
        // Simulate progress update
        const progressBar = taskCard.querySelector('.progress-fill');
        const progressText = taskCard.querySelector('.progress-text');
        const currentProgress = parseInt(progressText.textContent);
        const newProgress = Math.min(currentProgress + 10, 100);
        
        progressBar.style.width = newProgress + '%';
        progressText.textContent = newProgress + '%';
        
        if (newProgress === 100) {
            completeTask(taskCard);
        }
    }, 2000);
}

// Complete a task
function completeTask(taskCard) {
    taskCard.classList.add('completed');
    
    const statusText = taskCard.querySelector('.status-text');
    const continueBtn = taskCard.querySelector('.continue-btn');
    const progressFill = taskCard.querySelector('.progress-fill');
    
    statusText.textContent = 'Tamamlandı';
    continueBtn.textContent = 'Tamamlandı';
    continueBtn.classList.remove('btn-outline');
    continueBtn.classList.add('btn-success');
    continueBtn.disabled = true;
    
    progressFill.classList.add('completed');
    
    // Add reward earned message
    const taskInfo = taskCard.querySelector('.task-info');
    const rewardDiv = document.createElement('div');
    rewardDiv.className = 'task-reward-earned';
    rewardDiv.innerHTML = `
        <svg fill="currentColor" viewBox="0 0 20 20" width="14" height="14">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <span>+120 puan kazandınız</span>
    `;
    
    const taskTime = taskCard.querySelector('.task-time');
    taskInfo.insertBefore(rewardDiv, taskTime);
    
    showNotification('Görev tamamlandı! Puan kazandınız.', 'success');
    updatePointsDisplay();
}

// Add task to my tasks section
function addToMyTasks(taskTitle, rewardPoints) {
    const myTasksList = document.querySelector('.my-tasks-list');
    const taskCount = document.querySelector('.task-count');
    
    // Create new task card
    const newTaskCard = document.createElement('div');
    newTaskCard.className = 'my-task-card in-progress';
    newTaskCard.innerHTML = `
        <div class="task-status">
            <div class="status-indicator"></div>
            <span class="status-text">Devam Ediyor</span>
        </div>
        
        <div class="task-info">
            <h4>${taskTitle}</h4>
            <p>0/100 tamamlandı</p>
            
            <div class="task-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <span class="progress-text">%0</span>
            </div>
            
            <div class="task-time">
                <svg fill="currentColor" viewBox="0 0 20 20" width="14" height="14">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                <span>7 gün kaldı</span>
            </div>
        </div>
        
        <div class="task-actions">
            <button class="btn btn-outline continue-btn">Devam Et</button>
        </div>
    `;
    
    // Add to list
    myTasksList.insertBefore(newTaskCard, myTasksList.firstChild);
    
    // Update task count
    const currentCount = parseInt(taskCount.textContent.split(' ')[0]);
    taskCount.textContent = `${currentCount + 1} aktif görev`;
    
    // Add event listener to new continue button
    const newContinueBtn = newTaskCard.querySelector('.continue-btn');
    newContinueBtn.addEventListener('click', function() {
        const taskTitle = newTaskCard.querySelector('h4').textContent;
        continueTask(newTaskCard, taskTitle);
    });
}

// Update task progress animation
function updateTaskProgress() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Update points display
function updatePointsDisplay() {
    const pointsValue = document.querySelector('.points-value');
    if (pointsValue) {
        const currentPoints = parseInt(pointsValue.textContent.replace(',', ''));
        const newPoints = currentPoints + Math.floor(Math.random() * 50) + 10;
        
        // Animate points increase
        animateNumber(pointsValue, currentPoints, newPoints, 1000);
    }
}

// Animate number change
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Show task confirmation modal
function showTaskConfirmation(taskTitle, callback) {
    const confirmed = confirm(`"${taskTitle}" görevini başlatmak istediğinizden emin misiniz?`);
    if (confirmed) {
        callback();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 3000);
    
    // Close button handler
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
}

// Hide notification
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Sidebar functionality
function initializeSidebar() {
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            mainContent.classList.toggle('sidebar-open');
        });
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            mobileOverlay.classList.remove('active');
            mainContent.classList.remove('sidebar-open');
        });
    }
}

// Add CSS for notifications
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #6C63FF;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    min-width: 300px;
    max-width: 400px;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    border-left-color: #10B981;
}

.notification-error {
    border-left-color: #EF4444;
}

.notification-warning {
    border-left-color: #F59E0B;
}

.notification-content {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.notification-message {
    font-size: 14px;
    color: #1a1a1a;
    font-weight: 500;
}

.notification-close {
    background: none;
    border: none;
    font-size: 18px;
    color: #6b7280;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.notification-close:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #1a1a1a;
}

.loading-spinner {
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: inline-block;
    margin-right: 8px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);