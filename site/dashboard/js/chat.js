// Chat Page JavaScript

class ChatManager {
    constructor() {
        this.currentModel = 'gpt-4';
        this.conversations = this.loadConversations();
        this.currentConversationId = null;
        this.isTyping = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateModelInfo();
        this.setupMobileResponsive();
        
        // Create initial conversation if none exists
        if (this.conversations.length === 0) {
            this.createNewConversation();
        } else {
            this.loadConversation(this.conversations[0].id);
        }
    }

    bindEvents() {
        // Model selector
        const modelSelect = document.getElementById('modelSelect');
        if (modelSelect) {
            modelSelect.addEventListener('change', (e) => {
                this.changeModel(e.target.value);
            });
        }

        // Chat input
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        
        if (chatInput) {
            chatInput.addEventListener('input', () => {
                this.updateCharCount();
                this.autoResize(chatInput);
            });
            
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // Quick actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prompt = e.currentTarget.dataset.prompt;
                if (prompt) {
                    chatInput.value = prompt;
                    this.updateCharCount();
                    this.sendMessage();
                }
            });
        });

        // New chat button
        const newChatBtn = document.querySelector('.new-chat-btn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => {
                this.createNewConversation();
            });
        }

        // Chat history items
        this.bindChatHistoryEvents();
    }

    bindChatHistoryEvents() {
        document.querySelectorAll('.chat-history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.chat-delete')) {
                    const conversationId = item.dataset.conversationId;
                    if (conversationId) {
                        this.loadConversation(conversationId);
                    }
                }
            });
        });

        document.querySelectorAll('.chat-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const conversationId = e.target.closest('.chat-history-item').dataset.conversationId;
                if (conversationId) {
                    this.deleteConversation(conversationId);
                }
            });
        });
    }

    setupMobileResponsive() {
        // Create mobile toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'chat-sidebar-toggle';
        toggleBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        document.body.appendChild(toggleBtn);

        // Create mobile overlay
        const overlay = document.createElement('div');
        overlay.className = 'chat-mobile-overlay';
        document.body.appendChild(overlay);

        const sidebar = document.querySelector('.chat-sidebar');
        
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    changeModel(newModel) {
        this.currentModel = newModel;
        this.updateModelInfo();
        
        // Add system message about model change
        if (this.currentConversationId) {
            this.addSystemMessage(`Model ${this.getModelDisplayName(newModel)} olarak değiştirildi.`);
        }
    }

    updateModelInfo() {
        const modelIndicator = document.querySelector('.model-indicator');
        const modelDescription = document.querySelector('.model-description');
        
        const modelInfo = this.getModelInfo(this.currentModel);
        
        if (modelIndicator) {
            modelIndicator.textContent = `${modelInfo.name} ile sohbet ediyorsunuz`;
        }
        
        if (modelDescription) {
            modelDescription.textContent = modelInfo.description;
        }
    }

    getModelInfo(model) {
        const models = {
            'gpt-4': {
                name: 'GPT-4',
                description: 'En gelişmiş dil modeli, karmaşık görevler için ideal'
            },
            'gpt-3.5': {
                name: 'GPT-3.5',
                description: 'Hızlı ve etkili, günlük görevler için mükemmel'
            },
            'claude': {
                name: 'Claude',
                description: 'Analitik düşünme ve uzun metinler için optimize edilmiş'
            },
            'gemini': {
                name: 'Gemini',
                description: 'Google\'ın çok modlu AI modeli, görsel analiz destekli'
            }
        };
        
        return models[model] || models['gpt-4'];
    }

    getModelDisplayName(model) {
        return this.getModelInfo(model).name;
    }

    updateCharCount() {
        const chatInput = document.getElementById('chatInput');
        const charCount = document.querySelector('.char-count');
        
        if (chatInput && charCount) {
            const count = chatInput.value.length;
            charCount.textContent = `${count} / 4000`;
            
            if (count > 3800) {
                charCount.style.color = '#dc2626';
            } else if (count > 3500) {
                charCount.style.color = '#f59e0b';
            } else {
                charCount.style.color = '#94a3b8';
            }
        }
    }

    autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Clear input
        chatInput.value = '';
        this.updateCharCount();
        this.autoResize(chatInput);
        
        // Add user message
        this.addMessage('user', message);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Simulate API call
            const response = await this.callAI(message);
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add AI response
            this.addMessage('assistant', response, this.currentModel);
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('assistant', 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.', this.currentModel);
            console.error('AI API Error:', error);
        }
    }

    async callAI(message) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Mock responses based on model
        const responses = {
            'gpt-4': `GPT-4 olarak size yardımcı olmaya çalışacağım. "${message}" sorunuz hakkında detaylı bir açıklama yapabilirim. Bu konuda daha spesifik ne öğrenmek istiyorsunuz?`,
            'gpt-3.5': `Merhaba! GPT-3.5 olarak "${message}" konusunda size yardımcı olabilirim. Hızlı ve etkili çözümler sunmaya odaklanıyorum.`,
            'claude': `Claude olarak analitik bir yaklaşımla "${message}" konusunu ele alalım. Bu konuyu derinlemesine inceleyebilir ve yapılandırılmış bir yanıt verebilirim.`,
            'gemini': `Gemini olarak "${message}" hakkında çok boyutlu bir perspektif sunabilirim. Görsel ve metinsel analiz yeteneklerimi kullanarak kapsamlı bir yanıt hazırlayabilirim.`
        };
        
        return responses[this.currentModel] || responses['gpt-4'];
    }

    addMessage(role, content, model = null) {
        const chatMessages = document.getElementById('chatMessages');
        const welcomeMessage = chatMessages.querySelector('.welcome-message');
        
        // Remove welcome message if it exists
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const avatar = this.createAvatar(role);
        const content_div = this.createMessageContent(content, role, model);
        
        if (role === 'user') {
            messageDiv.appendChild(content_div);
            messageDiv.appendChild(avatar);
        } else {
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content_div);
        }
        
        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Save to conversation
        if (this.currentConversationId) {
            this.saveMessageToConversation(role, content, model);
        }
    }

    createAvatar(role) {
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        if (role === 'user') {
            avatar.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 18a7 7 0 1 1 14 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            `;
        } else {
            avatar.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect width="20" height="20" rx="4" fill="currentColor" opacity="0.2"/>
                    <path d="M6 8h8M6 12h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            `;
        }
        
        return avatar;
    }

    createMessageContent(content, role, model) {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = content;
        
        const info = document.createElement('div');
        info.className = 'message-info';
        
        const time = new Date().toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        if (role === 'assistant' && model) {
            info.innerHTML = `
                <span class="model-badge">${this.getModelDisplayName(model)}</span>
                <span>${time}</span>
            `;
        } else {
            info.innerHTML = `<span>${time}</span>`;
        }
        
        contentDiv.appendChild(bubble);
        contentDiv.appendChild(info);
        
        return contentDiv;
    }

    addSystemMessage(content) {
        const chatMessages = document.getElementById('chatMessages');
        
        const systemDiv = document.createElement('div');
        systemDiv.className = 'system-message';
        systemDiv.style.cssText = `
            text-align: center;
            padding: 8px 16px;
            margin: 8px 0;
            background: rgba(108, 99, 255, 0.1);
            border-radius: 12px;
            font-size: 12px;
            color: #6C63FF;
            font-style: italic;
        `;
        systemDiv.textContent = content;
        
        chatMessages.appendChild(systemDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        if (document.querySelector('.typing-indicator')) return;
        
        this.isTyping = true;
        const chatMessages = document.getElementById('chatMessages');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        
        const avatar = this.createAvatar('assistant');
        const typingBubble = document.createElement('div');
        typingBubble.className = 'typing-bubble';
        typingBubble.innerHTML = `
            <span>Yazıyor</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(typingBubble);
        
        chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Conversation Management
    createNewConversation() {
        const conversation = {
            id: 'conv_' + Date.now(),
            title: 'Yeni Sohbet',
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.conversations.unshift(conversation);
        this.saveConversations();
        this.loadConversation(conversation.id);
        this.updateChatHistory();
    }

    loadConversation(conversationId) {
        this.currentConversationId = conversationId;
        const conversation = this.conversations.find(c => c.id === conversationId);
        
        if (!conversation) return;
        
        // Clear current messages
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        
        // Load messages or show welcome
        if (conversation.messages.length === 0) {
            this.showWelcomeMessage();
        } else {
            conversation.messages.forEach(msg => {
                this.addMessage(msg.role, msg.content, msg.model);
            });
        }
        
        // Update active state in history
        document.querySelectorAll('.chat-history-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.conversationId === conversationId) {
                item.classList.add('active');
            }
        });
    }

    saveMessageToConversation(role, content, model) {
        const conversation = this.conversations.find(c => c.id === this.currentConversationId);
        if (!conversation) return;
        
        const message = {
            role,
            content,
            model,
            timestamp: new Date().toISOString()
        };
        
        conversation.messages.push(message);
        conversation.updatedAt = new Date().toISOString();
        
        // Update title based on first user message
        if (role === 'user' && conversation.messages.filter(m => m.role === 'user').length === 1) {
            conversation.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
        }
        
        this.saveConversations();
        this.updateChatHistory();
    }

    deleteConversation(conversationId) {
        if (confirm('Bu sohbeti silmek istediğinizden emin misiniz?')) {
            this.conversations = this.conversations.filter(c => c.id !== conversationId);
            this.saveConversations();
            
            if (this.currentConversationId === conversationId) {
                if (this.conversations.length > 0) {
                    this.loadConversation(this.conversations[0].id);
                } else {
                    this.createNewConversation();
                }
            }
            
            this.updateChatHistory();
        }
    }

    updateChatHistory() {
        const chatHistory = document.querySelector('.chat-history');
        if (!chatHistory) return;
        
        chatHistory.innerHTML = '';
        
        this.conversations.forEach(conversation => {
            const item = document.createElement('div');
            item.className = 'chat-history-item';
            item.dataset.conversationId = conversation.id;
            
            if (conversation.id === this.currentConversationId) {
                item.classList.add('active');
            }
            
            const lastMessage = conversation.messages.length > 0 
                ? conversation.messages[conversation.messages.length - 1].content
                : 'Henüz mesaj yok';
            
            const timeAgo = this.getTimeAgo(conversation.updatedAt);
            
            item.innerHTML = `
                <div class="chat-preview">
                    <div class="chat-title">${conversation.title}</div>
                    <div class="chat-last-message">${lastMessage.substring(0, 50)}${lastMessage.length > 50 ? '...' : ''}</div>
                    <div class="chat-time">${timeAgo}</div>
                </div>
                <button class="chat-delete">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </button>
            `;
            
            chatHistory.appendChild(item);
        });
        
        this.bindChatHistoryEvents();
    }

    getTimeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Şimdi';
        if (diffMins < 60) return `${diffMins} dakika önce`;
        if (diffHours < 24) return `${diffHours} saat önce`;
        if (diffDays < 7) return `${diffDays} gün önce`;
        
        return date.toLocaleDateString('tr-TR');
    }

    showWelcomeMessage() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <rect width="48" height="48" rx="12" fill="url(#welcomeGradient)"/>
                        <path d="M16 20h16v2H16v-2zm0 4h12v2H16v-2zm0 4h16v2H16v-2z" fill="white"/>
                        <circle cx="32" cy="16" r="4" fill="#FFD700"/>
                        <defs>
                            <linearGradient id="welcomeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#6C63FF"/>
                                <stop offset="100%" style="stop-color:#3F8EFC"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h3>AssistAI'ya Hoş Geldiniz!</h3>
                <p>Size nasıl yardımcı olabilirim? Herhangi bir sorunuz varsa çekinmeden sorun.</p>
                <div class="quick-actions">
                    <button class="quick-action" data-prompt="Merhaba! Bana kendini tanıt.">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM8 11V7M8 5h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        Kendini Tanıt
                    </button>
                    <button class="quick-action" data-prompt="Bana kod yazma konusunda nasıl yardımcı olabilirsin?">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M5 3L1 7l4 4M11 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Kod Yardımı
                    </button>
                    <button class="quick-action" data-prompt="Yaratıcı yazma konusunda bana yardım edebilir misin?">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M12 3l1 1-8 8-4 1 1-4 8-8 1 1M9 6l1 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Yaratıcı Yazma
                    </button>
                </div>
            </div>
        `;
        
        // Re-bind quick action events
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prompt = e.currentTarget.dataset.prompt;
                if (prompt) {
                    const chatInput = document.getElementById('chatInput');
                    chatInput.value = prompt;
                    this.updateCharCount();
                    this.sendMessage();
                }
            });
        });
    }

    // Local Storage Management
    loadConversations() {
        try {
            const saved = localStorage.getItem('chat_conversations');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading conversations:', error);
            return [];
        }
    }

    saveConversations() {
        try {
            localStorage.setItem('chat_conversations', JSON.stringify(this.conversations));
        } catch (error) {
            console.error('Error saving conversations:', error);
        }
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatManager();
});