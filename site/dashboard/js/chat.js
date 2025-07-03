// Chat Page JavaScript

class ChatManager {
    constructor() {
        this.currentModel = 'gpt-4';
        this.isTyping = false;
        this.eventsbound = false;
        this.conversations = this.loadConversations();
        this.currentConversationId = null;
        
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
        this.setupChatHistoryDrawer();
        this.updateModelInfo();
        
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





    changeModel(newModel) {
        console.log('Model değiştiriliyor:', this.currentModel, '->', newModel);
        this.currentModel = newModel;
        this.updateModelInfo();
        console.log('Yeni model ayarlandı:', this.currentModel);
        
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
        const content_div = this.createMessageContent(content, role, model, role === 'assistant');
        
        if (role === 'user') {
            messageDiv.appendChild(content_div);
            messageDiv.appendChild(avatar);
        } else {
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content_div);
        }
        
        this.chatMessagesElement.appendChild(messageDiv);
        this.scrollToBottom();
        
        // For assistant messages, start typewriter effect
        if (role === 'assistant') {
            this.startTypewriterEffect(content_div.querySelector('.message-bubble'), content);
        }
        
        // Save to conversation
        if (this.currentConversationId) {
            this.saveMessageToConversation(role, content, model);
        }
    }

    addMessageWithoutTypewriter(role, content, model = null) {
        if (!this.chatMessagesElement) return;
        
        const welcomeMessage = this.chatMessagesElement.querySelector('.welcome-message');
        
        // Remove welcome message if it exists
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const avatar = this.createAvatar(role);
        const content_div = this.createMessageContent(content, role, model, false); // No typewriter effect
        
        if (role === 'user') {
            messageDiv.appendChild(content_div);
            messageDiv.appendChild(avatar);
        } else {
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content_div);
        }
        
        this.chatMessagesElement.appendChild(messageDiv);
        this.scrollToBottom();
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

    createMessageContent(content, role, model, isTypewriter = false) {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        // For typewriter effect, start with empty content
        if (isTypewriter) {
            bubble.textContent = '';
        } else {
            bubble.textContent = content;
        }
        
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

    startTypewriterEffect(element, text) {
        if (!element || !text) return;
        
        const words = text.split(' ');
        let currentWordIndex = 0;
        
        const typeNextWord = () => {
            if (currentWordIndex < words.length) {
                const currentText = element.textContent;
                const nextWord = words[currentWordIndex];
                
                // Add space before word if not the first word
                const wordToAdd = currentWordIndex === 0 ? nextWord : ' ' + nextWord;
                element.textContent = currentText + wordToAdd;
                
                currentWordIndex++;
                this.scrollToBottom();
                
                // Continue with next word after a short delay
                setTimeout(typeNextWord, 50 + Math.random() * 30); // 50-80ms delay between words
            }
        };
        
        // Start typing effect
        typeNextWord();
    }

    scrollToBottom() {
        if (!this.chatMessagesElement) return;
        this.chatMessagesElement.scrollTop = this.chatMessagesElement.scrollHeight;
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


}

// ChatManager temporarily disabled to prevent crashes

// Simple Mobile Chat Sidebar Toggle
// Global variables for chat functionality
    let currentModel = 'gpt-4';
    let chatHistory = []; // Store conversation history for context
    
    // Function to clear chat history
    function clearChatHistory() {
        chatHistory = [];
        console.log('Sohbet geçmişi temizlendi');
        
        // Clear chat messages from UI
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            // Keep welcome message, remove all others
            const welcomeMessage = chatMessages.querySelector('.welcome-message');
            chatMessages.innerHTML = '';
            if (welcomeMessage) {
                chatMessages.appendChild(welcomeMessage);
            }
        }
    }
    
    // Modern popup functions
    function showClearHistoryPopup() {
        const popup = document.getElementById('clearHistoryPopup');
        if (popup) {
            popup.classList.add('active');
        }
    }
    
    function hideClearHistoryPopup() {
        const popup = document.getElementById('clearHistoryPopup');
        if (popup) {
            popup.classList.remove('active');
        }
    }
    
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
        
        // Add user message to chat history
        chatHistory.push({
            role: 'user',
            parts: [{ text: message }]
        });
        
        try {
            const requestBody = {
                contents: chatHistory
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
                const aiResponse = data.candidates[0].content.parts[0].text;
                
                // Add AI response to chat history
                chatHistory.push({
                    role: 'model',
                    parts: [{ text: aiResponse }]
                });
                
                return aiResponse;
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
    
    // Clear history button functionality
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            showClearHistoryPopup();
        });
    }
    
    // Modern popup event listeners
    const cancelClearHistory = document.getElementById('cancelClearHistory');
    const confirmClearHistory = document.getElementById('confirmClearHistory');
    const clearHistoryPopup = document.getElementById('clearHistoryPopup');
    
    if (cancelClearHistory) {
        cancelClearHistory.addEventListener('click', () => {
            hideClearHistoryPopup();
        });
    }
    
    if (confirmClearHistory) {
        confirmClearHistory.addEventListener('click', () => {
            clearChatHistory();
            hideClearHistoryPopup();
        });
    }
    
    // Close popup when clicking outside
    if (clearHistoryPopup) {
        clearHistoryPopup.addEventListener('click', (e) => {
            if (e.target === clearHistoryPopup) {
                hideClearHistoryPopup();
            }
        });
    }
    

});

// Chat History Drawer System (Mobile-First Design)
document.addEventListener('DOMContentLoaded', function() {
    // Chat History Variables
    let conversations = loadConversations();
    let currentConversationId = null;
    
    // Setup Chat History Drawer
    function setupChatHistoryDrawer() {
        const toggleBtn = document.getElementById('chatHistoryToggle');
        const overlay = document.getElementById('chatHistoryOverlay');
        const closeBtn = document.getElementById('closeDrawerBtn');
        const newChatBtn = document.getElementById('newChatBtn');
        
        if (!toggleBtn || !overlay) return;
        
        // Toggle drawer
        toggleBtn.addEventListener('click', () => {
            overlay.classList.add('active');
            updateChatHistory();
        });
        
        // Close drawer
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                overlay.classList.remove('active');
            });
        }
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
        
        // New chat button
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => {
                createNewConversation();
                overlay.classList.remove('active');
            });
        }
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                overlay.classList.remove('active');
            }
        });
        
        // Bind chat history item events
        bindChatHistoryEvents();
    }
    
    function bindChatHistoryEvents() {
        const chatHistoryList = document.getElementById('chatHistoryList');
        if (!chatHistoryList) return;
        
        // Use event delegation
        chatHistoryList.addEventListener('click', (e) => {
            const historyItem = e.target.closest('.chat-history-item');
            if (!historyItem) return;
            
            if (e.target.closest('.chat-item-btn.delete')) {
                // Delete conversation
                e.stopPropagation();
                const conversationId = historyItem.dataset.conversationId;
                const conversation = conversations.find(c => c.id === conversationId);
                const title = conversation ? conversation.title : 'Bu sohbet';
                
                if (conversationId && confirm(`"${title}" sohbetini silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`)) {
                    deleteConversation(conversationId);
                }
            } else {
                // Load conversation
                const conversationId = historyItem.dataset.conversationId;
                if (conversationId) {
                    showLoadingIndicator();
                    
                    // Small delay to show loading indicator
                    setTimeout(() => {
                        loadConversation(conversationId);
                        document.getElementById('chatHistoryOverlay').classList.remove('active');
                        hideLoadingIndicator();
                    }, 100);
                }
            }
        });
    }
    
    function showLoadingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        chatMessages.innerHTML = `
            <div class="loading-indicator" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 200px;
                text-align: center;
                color: #6C63FF;
                font-size: 14px;
            ">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(108, 99, 255, 0.2);
                    border-top: 3px solid #6C63FF;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 16px;
                "></div>
                <p style="margin: 0; font-weight: 500;">Sohbet yükleniyor...</p>
                <span style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Lütfen bekleyiniz</span>
            </div>
            
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    }
    
    function hideLoadingIndicator() {
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }
    
    // Conversation Management Functions
    function createNewConversation() {
        const conversation = {
            id: 'conv_' + Date.now(),
            title: 'Yeni Sohbet',
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        conversations.unshift(conversation);
        saveConversations();
        loadConversation(conversation.id);
        updateChatHistory();
    }
    
    function loadConversation(conversationId) {
        try {
            currentConversationId = conversationId;
            const conversation = conversations.find(c => c.id === conversationId);
            
            if (!conversation) {
                console.warn('Conversation not found:', conversationId);
                showWelcomeMessage();
                return;
            }
            
            // Clear current messages
            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) {
                console.error('Chat messages element not found');
                return;
            }
            
            chatMessages.innerHTML = '';
            
            // Check if conversation has messages
            if (!conversation.messages || conversation.messages.length === 0) {
                showWelcomeMessage();
                updateChatHistory();
                return;
            }
            
            const messageCount = conversation.messages.length;
            console.log(`Loading conversation with ${messageCount} messages`);
            
            // Performance protection: Limit messages for large conversations
            const MAX_MESSAGES = 100; // Limit to last 100 messages for performance
            let messagesToLoad = conversation.messages;
            
            if (messageCount > MAX_MESSAGES) {
                messagesToLoad = conversation.messages.slice(-MAX_MESSAGES);
                console.warn(`Large conversation detected (${messageCount} messages). Loading only the last ${MAX_MESSAGES} messages.`);
                
                // Add info message about truncated conversation
                const infoDiv = document.createElement('div');
                infoDiv.className = 'system-message';
                infoDiv.style.cssText = `
                    text-align: center;
                    padding: 12px 16px;
                    margin: 16px;
                    background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1));
                    border: 1px solid rgba(255, 193, 7, 0.3);
                    border-radius: 12px;
                    font-size: 13px;
                    color: #f57c00;
                    font-weight: 500;
                `;
                infoDiv.innerHTML = `
                    📚 Bu sohbette ${messageCount} mesaj var. Performans için son ${MAX_MESSAGES} mesaj gösteriliyor.
                `;
                chatMessages.appendChild(infoDiv);
            }
            
            // Load messages in batches to prevent UI blocking
            let messageIndex = 0;
            const BATCH_SIZE = 10;
            
            function loadMessageBatch() {
                const batchEnd = Math.min(messageIndex + BATCH_SIZE, messagesToLoad.length);
                
                for (let i = messageIndex; i < batchEnd; i++) {
                    const msg = messagesToLoad[i];
                    
                    // Validate message
                    if (!msg || typeof msg.role !== 'string' || typeof msg.content !== 'string') {
                        console.warn('Invalid message found:', msg);
                        continue;
                    }
                    
                    // Use global addMessage function
                    if (window.addMessage && typeof window.addMessage === 'function') {
                        window.addMessage(msg.role, msg.content, msg.model || currentModel);
                    } else {
                        // Fallback to direct DOM manipulation
                        addMessageDirectly(msg.role, msg.content, msg.model || currentModel);
                    }
                }
                
                messageIndex = batchEnd;
                
                // Continue loading next batch or finish
                if (messageIndex < messagesToLoad.length) {
                    // Use requestAnimationFrame for smooth loading
                    requestAnimationFrame(loadMessageBatch);
                } else {
                    // All messages loaded
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    updateChatHistory();
                    console.log('Conversation loaded successfully');
                }
            }
            
            // Start batch loading
            loadMessageBatch();
            
        } catch (error) {
            console.error('Error loading conversation:', error);
            // Clean fallback
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.innerHTML = '';
                showWelcomeMessage();
            }
            updateChatHistory();
        }
    }
    
    function saveMessageToConversation(role, content, model) {
        try {
            if (!currentConversationId) {
                // Create new conversation if none exists
                createNewConversation();
                return; // createNewConversation will handle saving
            }
            
            const conversation = conversations.find(c => c.id === currentConversationId);
            if (!conversation) {
                console.warn('Conversation not found:', currentConversationId);
                return;
            }
            
            // Ensure content is valid
            if (!content || typeof content !== 'string') {
                console.warn('Invalid message content:', content);
                return;
            }
            
            const message = {
                role,
                content: content.trim(),
                model: model || currentModel,
                timestamp: new Date().toISOString()
            };
            
            conversation.messages.push(message);
            conversation.updatedAt = new Date().toISOString();
            
            // Update title based on first user message
            if (role === 'user' && conversation.messages.filter(m => m.role === 'user').length === 1) {
                conversation.title = content.length > 40 ? content.substring(0, 40) + '...' : content;
            }
            
            saveConversations();
            updateChatHistory();
        } catch (error) {
            console.error('Error saving message to conversation:', error);
        }
    }
    
    function deleteConversation(conversationId) {
        conversations = conversations.filter(c => c.id !== conversationId);
        saveConversations();
        
        // If we deleted the current conversation, create a new one
        if (currentConversationId === conversationId) {
            if (conversations.length > 0) {
                loadConversation(conversations[0].id);
            } else {
                createNewConversation();
            }
        }
        
        updateChatHistory();
    }
    
    function updateChatHistory() {
        try {
            const chatHistoryList = document.getElementById('chatHistoryList');
            if (!chatHistoryList) return;
            
            if (!conversations || conversations.length === 0) {
                chatHistoryList.innerHTML = `
                    <div class="empty-state">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" fill="none"/>
                            <path d="M16 20h16M16 24h12M16 28h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        <p>Henüz sohbet geçmişi yok</p>
                        <span>İlk mesajınızı gönderin</span>
                    </div>
                `;
                return;
            }
            
            const historyHTML = conversations.map(conv => {
                try {
                    const isActive = conv.id === currentConversationId;
                    const lastMessage = conv.messages && conv.messages.length > 0 
                        ? conv.messages[conv.messages.length - 1] 
                        : null;
                    
                    let preview = 'Henüz mesaj yok';
                    if (lastMessage && lastMessage.content) {
                        preview = lastMessage.content.length > 60 
                            ? lastMessage.content.substring(0, 60) + '...' 
                            : lastMessage.content;
                    }
                    
                    const createdDate = new Date(conv.createdAt);
                    const timeString = formatChatTime(createdDate);
                    const title = conv.title || 'Başlıksız Sohbet';
                    
                    return `
                        <div class="chat-history-item ${isActive ? 'active' : ''}" data-conversation-id="${conv.id}">
                            <div class="chat-item-header">
                                <h4 class="chat-item-title">${title}</h4>
                                <div class="chat-item-actions">
                                    <button class="chat-item-btn delete" title="Sohbeti Sil">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="chat-item-preview">${preview}</div>
                            <div class="chat-item-meta">
                                <span class="chat-item-time">${timeString}</span>
                                <span class="chat-item-count">${conv.messages ? conv.messages.length : 0} mesaj</span>
                            </div>
                        </div>
                    `;
                } catch (itemError) {
                    console.error('Error rendering conversation item:', itemError, conv);
                    return ''; // Skip broken items
                }
            }).filter(html => html !== '').join('');
            
            chatHistoryList.innerHTML = historyHTML;
        } catch (error) {
            console.error('Error updating chat history:', error);
        }
    }
    
    function formatChatTime(date) {
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days > 0) {
            if (days === 1) return 'Dün';
            if (days < 7) return `${days} gün önce`;
            return date.toLocaleDateString('tr-TR');
        } else if (hours > 0) {
            return `${hours} saat önce`;
        } else {
            const minutes = Math.floor(diff / (1000 * 60));
            return minutes < 1 ? 'Şimdi' : `${minutes} dakika önce`;
        }
    }
    
    // Helper function for direct message addition (fallback)
    function addMessageDirectly(role, content, model) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        // Remove welcome message if exists
        const welcomeMessage = chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
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
                        ${content || ''}
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
                        ${content || ''}
                    </div>
                </div>
                <div class="message-avatar">
                    <i class="fas fa-user"></i>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
    }
    
    // Helper function for showing welcome message
    function showWelcomeMessage() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
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
    function loadConversations() {
        try {
            const saved = localStorage.getItem('chat_conversations');
            if (!saved) return [];
            
            const conversations = JSON.parse(saved);
            
            // Clean up conversations with too many messages to prevent performance issues
            const MAX_MESSAGES_PER_CONVERSATION = 500;
            let cleanupPerformed = false;
            
            const cleanedConversations = conversations.map(conv => {
                if (conv.messages && conv.messages.length > MAX_MESSAGES_PER_CONVERSATION) {
                    console.warn(`Cleaning up conversation "${conv.title}" - reducing ${conv.messages.length} messages to ${MAX_MESSAGES_PER_CONVERSATION}`);
                    cleanupPerformed = true;
                    
                    return {
                        ...conv,
                        messages: conv.messages.slice(-MAX_MESSAGES_PER_CONVERSATION),
                        updatedAt: new Date().toISOString(),
                        cleanedUp: true
                    };
                }
                return conv;
            });
            
            // Save cleaned conversations back if cleanup was performed
            if (cleanupPerformed) {
                console.log('Saving cleaned conversations...');
                localStorage.setItem('chat_conversations', JSON.stringify(cleanedConversations));
            }
            
            return cleanedConversations;
        } catch (error) {
            console.error('Error loading conversations:', error);
            // If localStorage is corrupted, clear it and start fresh
            try {
                localStorage.removeItem('chat_conversations');
                console.log('Cleared corrupted conversations from localStorage');
            } catch (clearError) {
                console.error('Could not clear localStorage:', clearError);
            }
            return [];
        }
    }
    
    function saveConversations() {
        try {
            localStorage.setItem('chat_conversations', JSON.stringify(conversations));
        } catch (error) {
            console.error('Error saving conversations:', error);
        }
    }
    

    
    // Temporary flag to prevent double saving during conversation loading
    let isLoadingConversation = false;
    
    // Override existing addMessage function to save to conversation
    const originalAddMessage = window.addMessage;
    if (typeof originalAddMessage === 'function') {
        window.addMessage = function(role, content, model = null) {
            try {
                // Call original addMessage
                originalAddMessage(role, content, model);
                
                // Save to conversation only if not loading from history
                if (!isLoadingConversation && (role === 'user' || role === 'assistant')) {
                    saveMessageToConversation(role, content, model);
                }
            } catch (error) {
                console.error('Error in addMessage override:', error);
                // Fallback to original function
                if (originalAddMessage) {
                    originalAddMessage(role, content, model);
                }
            }
        };
    }
    
    // Update loadConversation to use the flag
    const originalLoadConversation = loadConversation;
    loadConversation = function(conversationId) {
        isLoadingConversation = true;
        try {
            originalLoadConversation(conversationId);
        } finally {
            // Reset flag after loading is complete
            setTimeout(() => {
                isLoadingConversation = false;
            }, 100);
        }
    };
    
    // Initialize chat history drawer
    setupChatHistoryDrawer();
    
    // Create initial conversation if none exists
    if (conversations.length === 0) {
        createNewConversation();
    } else {
        currentConversationId = conversations[0].id;
        updateChatHistory();
    }
});