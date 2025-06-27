// Chat Page JavaScript

class ChatManager {
    constructor() {
        this.currentModel = 'gpt-4';
        this.conversations = this.loadConversations();
        this.currentConversationId = null;
        this.isTyping = false;
        this.eventsbound = false;
        
        this.init();
    }

    init() {
        this.chatMessagesElement = document.getElementById('chatMessages');
        
        if (!this.chatMessagesElement) {
            console.error('chatMessages element not found');
            return;
        }
        
        this.bindEvents();
        this.bindChatHistoryEvents();
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
        // Check if events are already bound
        if (this.eventsbound) return;
        
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

        // New chat button
        const newChatBtn = document.querySelector('.new-chat-btn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => {
                this.createNewConversation();
            });
        }

        // Chat history items
        this.bindChatHistoryEvents();
        
        // Quick actions event delegation
        if (this.chatMessagesElement) {
            this.chatMessagesElement.addEventListener('click', (e) => {
                if (e.target.closest('.quick-action')) {
                    const quickAction = e.target.closest('.quick-action');
                    const prompt = quickAction.dataset.prompt;
                    if (prompt) {
                        const chatInput = document.getElementById('chatInput');
                        if (chatInput) {
                            chatInput.value = prompt;
                            this.updateCharCount();
                            this.sendMessage();
                        }
                    }
                }
            });
        }
        
        // Mark events as bound
        this.eventsbound = true;
    }

    bindChatHistoryEvents() {
        const chatHistory = document.querySelector('.chat-history');
        if (!chatHistory) return;
        
        // Check if event listener is already bound
        if (chatHistory.hasAttribute('data-events-bound')) return;
        
        // Use event delegation to avoid multiple listeners
        chatHistory.addEventListener('click', (e) => {
            const historyItem = e.target.closest('.chat-history-item');
            if (!historyItem) return;
            
            if (e.target.closest('.chat-delete')) {
                // Delete conversation
                e.stopPropagation();
                const conversationId = historyItem.dataset.conversationId;
                if (conversationId) {
                    this.deleteConversation(conversationId);
                }
            } else {
                // Load conversation
                const conversationId = historyItem.dataset.conversationId;
                if (conversationId) {
                    this.loadConversation(conversationId);
                }
            }
        });
        
        // Mark as bound to prevent duplicate listeners
        chatHistory.setAttribute('data-events-bound', 'true');
    }

    setupMobileResponsive() {
        // Use existing elements from HTML
        const toggleBtn = document.getElementById('chatSidebarToggle');
        const overlay = document.getElementById('chatMobileOverlay');
        const sidebar = document.querySelector('.chat-sidebar');
        const closeSidebarBtn = document.getElementById('closeSidebarBtn');
        
        if (!toggleBtn || !overlay || !sidebar) {
            console.warn('Mobile responsive elements not found');
            return;
        }
        
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
        
        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
        
        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    changeModel(newModel) {
        console.log('Model değiştiriliyor:', this.currentModel, '->', newModel);
        this.currentModel = newModel;
        this.updateModelInfo();
        
        // Add system message about model change
        if (this.currentConversationId) {
            this.addSystemMessage(`Model ${this.getModelDisplayName(newModel)} olarak değiştirildi.`);
        }
        console.log('Yeni model ayarlandı:', this.currentModel);
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
                name: 'Gemini 2.0 Flash',
                description: 'Google\'ın en gelişmiş çok modlu AI modeli, görsel analiz destekli'
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
        console.log('callAI çağrıldı, mevcut model:', this.currentModel);
        
        // If Gemini is selected, use real API
        if (this.currentModel === 'gemini') {
            console.log('Gemini API çağrısına yönlendiriliyor...');
            return await this.callGeminiAPI(message);
        }
        
        console.log('Mock yanıt kullanılıyor, model:', this.currentModel);
        
        // Simulate API call delay for other models
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Mock responses based on model
        const responses = {
            'gpt-4': `GPT-4 olarak size yardımcı olmaya çalışacağım. "${message}" sorunuz hakkında detaylı bir açıklama yapabilirim. Bu konuda daha spesifik ne öğrenmek istiyorsunuz?`,
            'gpt-3.5': `Merhaba! GPT-3.5 olarak "${message}" konusunda size yardımcı olabilirim. Hızlı ve etkili çözümler sunmaya odaklanıyorum.`,
            'claude': `Claude olarak analitik bir yaklaşımla "${message}" konusunu ele alalım. Bu konuyu derinlemesine inceleyebilir ve yapılandırılmış bir yanıt verebilirim.`
        };
        
        return responses[this.currentModel] || responses['gpt-4'];
    }

    async callGeminiAPI(message) {
        const GEMINI_API_KEY = 'AIzaSyBscfSecswV2hdqaRtA4IXHSR7xWsr6OJw';
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;
        
        console.log('Gemini API çağrısı başlatılıyor...', { message, API_URL });
        
        try {
            const requestBody = {
                contents: [{
                    parts: [{
                        text: message
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            };
            
            console.log('Request body:', JSON.stringify(requestBody, null, 2));
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const result = data.candidates[0].content.parts[0].text;
                console.log('Gemini yanıtı alındı:', result);
                return result;
            } else {
                console.error('Geçersiz API yanıtı:', data);
                throw new Error('Geçersiz API yanıtı');
            }
            
        } catch (error) {
            console.error('Gemini API Error:', error);
            // CORS hatası durumunda alternatif mesaj
            if (error.message.includes('CORS') || error.message.includes('fetch')) {
                throw new Error('Tarayıcı güvenlik kısıtlaması nedeniyle Gemini API\'ye doğrudan erişim sağlanamıyor. Bu özellik sunucu tarafında çalışmalıdır.');
            }
            throw new Error(`Gemini API hatası: ${error.message}`);
        }
    }

    addMessage(role, content, model = null) {
        if (!this.chatMessagesElement) return;
        
        const welcomeMessage = this.chatMessagesElement.querySelector('.welcome-message');
        
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
        
        this.chatMessagesElement.appendChild(messageDiv);
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
        if (!this.chatMessagesElement) return;
        
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
        
        this.chatMessagesElement.appendChild(systemDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        if (document.querySelector('.typing-indicator') || !this.chatMessagesElement) return;
        
        this.isTyping = true;
        
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
        
        this.chatMessagesElement.appendChild(typingDiv);
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
        if (!this.chatMessagesElement) return;
        this.chatMessagesElement.scrollTop = this.chatMessagesElement.scrollHeight;
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
        if (!this.chatMessagesElement) return;
        this.chatMessagesElement.innerHTML = '';
        
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
        if (!this.chatMessagesElement) return;
        this.chatMessagesElement.innerHTML = `
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
                <h3>CraftingAI'ya Hoş Geldiniz!</h3>
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

// ChatManager temporarily disabled to prevent crashes

// Simple Mobile Chat Sidebar Toggle
// Global variables for chat functionality
    let currentModel = 'gpt-4';
    
    // Global callAI function
    async function callAI(message) {
        console.log('callAI çağrıldı, mevcut model:', currentModel);
        
        // If Gemini is selected, use real API
        if (currentModel === 'gemini') {
            console.log('Gemini API çağrısına yönlendiriliyor...');
            return await callGeminiAPI(message);
        }
        
        console.log('Mock yanıt kullanılıyor, model:', currentModel);
        
        // Simulate API call delay for other models
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Mock responses based on model
        const responses = {
            'gpt-4': `GPT-4 olarak size yardımcı olmaya çalışacağım. "${message}" sorunuz hakkında detaylı bir açıklama yapabilirim. Bu konuda daha spesifik ne öğrenmek istiyorsunuz?`,
            'gpt-3.5': `Merhaba! GPT-3.5 olarak "${message}" konusunda size yardımcı olabilirim. Hızlı ve etkili çözümler sunmaya odaklanıyorum.`,
            'claude': `Claude olarak analitik bir yaklaşımla "${message}" konusunu ele alalım. Bu konuyu derinlemesine inceleyebilir ve yapılandırılmış bir yanıt verebilirim.`
        };
        
        return responses[currentModel] || responses['gpt-4'];
    }
    
    // Global callGeminiAPI function
    async function callGeminiAPI(message) {
        const GEMINI_API_KEY = 'AIzaSyBscfSecswV2hdqaRtA4IXHSR7xWsr6OJw';
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;
        
        console.log('Gemini API çağrısı başlatılıyor...', { message, API_URL });
        
        try {
            const requestBody = {
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            };
            
            console.log('Request body:', requestBody);
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            if (!response.ok) {
                if (response.status === 0 || !response.status) {
                    throw new Error('CORS hatası: API çağrısı engellenmiş olabilir');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API yanıtı:', data);
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Geçersiz API yanıtı formatı');
            }
            
        } catch (error) {
            console.error('Gemini API Hatası:', error);
            throw error;
        }
    }
    
    // Simple chat functionality without ChatManager
    document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const charCount = document.querySelector('.char-count');
    
    // Update character count
    function updateCharCount() {
        if (chatInput && charCount) {
            const count = chatInput.value.length;
            charCount.textContent = `${count} / 4000`;
        }
    }
    
    // Auto resize textarea
    function autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
    
    // Add message to chat
    function addMessage(role, content, model = null) {
        if (!chatMessages) return;
        
        // Remove welcome message if exists
        const welcomeMessage = chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        // Get current time
        const now = new Date();
        const timeString = now.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        if (role === 'assistant') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="model-name">${model || 'GPT-4'}</span>
                        <span class="message-time">${timeString}</span>
                    </div>
                    <div class="message-bubble">
                        ${content}
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-time">${timeString}</span>
                    </div>
                    <div class="message-bubble">
                        ${content}
                    </div>
                </div>
                <div class="message-avatar">
                    <i class="fas fa-user"></i>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Send message
    function sendMessage() {
        if (!chatInput) return;
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Disable send button to prevent spam
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.style.opacity = '0.5';
            sendBtn.style.cursor = 'not-allowed';
        }
        
        // Add user message
        addMessage('user', message);
        
        // Clear input
        chatInput.value = '';
        updateCharCount();
        autoResize(chatInput);
        
        // Call AI API
        callAI(message).then((response) => {
            // Add AI response to chat
            const modelSelect = document.getElementById('modelSelect');
            const selectedModel = modelSelect ? modelSelect.value : currentModel;
            addMessage('assistant', response, selectedModel);
            
            // Re-enable send button after AI response
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.style.opacity = '1';
                sendBtn.style.cursor = 'pointer';
            }
        }).catch((error) => {
            console.error('AI API Error:', error);
            // Add error message to chat
            addMessage('assistant', 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.', currentModel);
            
            // Re-enable send button even if there's an error
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.style.opacity = '1';
                sendBtn.style.cursor = 'pointer';
            }
        });
    }
    
    // Event listeners
    if (chatInput) {
        chatInput.addEventListener('input', () => {
            updateCharCount();
            autoResize(chatInput);
        });
        
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                // Check if send button is disabled to prevent spam
                const sendBtn = document.getElementById('sendBtn');
                if (sendBtn && sendBtn.disabled) {
                    return; // Don't send if button is disabled
                }
                sendMessage();
            }
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    // Model selector functionality
    const modelSelect = document.getElementById('modelSelect');
    if (modelSelect) {
        modelSelect.addEventListener('change', (e) => {
            const oldModel = currentModel;
            currentModel = e.target.value;
            console.log('Model değiştiriliyor:', oldModel, '->', currentModel);
            console.log('Yeni model ayarlandı:', currentModel);
        });
    }
    
    // Sidebar functionality
    const toggleBtn = document.getElementById('chatSidebarToggle');
    const closeBtn = document.getElementById('closeSidebarBtn');
    const overlay = document.getElementById('chatMobileOverlay');
    const sidebar = document.querySelector('.chat-sidebar');
    
    function openSidebar() {
        if (sidebar && overlay && toggleBtn) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            toggleBtn.style.display = 'none';
        }
    }
    
    function closeSidebar() {
        if (sidebar && overlay && toggleBtn) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            toggleBtn.style.display = 'flex';
        }
    }
    
    if (toggleBtn && overlay && sidebar) {
        toggleBtn.addEventListener('click', openSidebar);
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeSidebar);
        }
        
        overlay.addEventListener('click', closeSidebar);
    }
});