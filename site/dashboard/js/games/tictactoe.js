// TicTacToe Game Module
class TicTacToeGame {
    constructor(container) {
        this.container = container;
        this.currentPlayer = 'X';
        this.gameMode = 'ai'; // 'ai' or 'multiplayer'
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.gameActive = true;
        this.chatMessages = [];
        this.roomId = null;
        this.playerName = document.querySelector('.user-name').textContent || 'Oyuncu';
        this.initializeStyles();
        this.render();
    }

    initializeStyles() {
        if (document.getElementById('tictactoe-game-styles')) return;

        const style = document.createElement('style');
        style.id = 'tictactoe-game-styles';
        style.textContent = `.tictactoe-container{max-width:100%;margin:0 auto;padding:20px;background:rgba(255,255,255,0.95);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.1);backdrop-filter:blur(20px);display:flex;gap:20px;flex-wrap:wrap;position:relative;z-index:1}.game-side{flex:1;min-width:300px}.chat-side{flex:1;min-width:300px;display:flex;flex-direction:column}.tictactoe-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid rgba(108,99,255,0.1)}.tictactoe-header h3{font-size:24px;font-weight:700;color:#1a1a1a;margin:0}.tictactoe-board{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;background:rgba(108,99,255,0.1);padding:10px;border-radius:12px;position:relative}.tictactoe-cell{aspect-ratio:1;background:white;border:none;border-radius:8px;font-size:40px;font-weight:bold;color:#6C63FF;cursor:pointer;transition:all 0.3s ease;display:flex;align-items:center;justify-content:center;position:relative}.tictactoe-cell:hover{background:rgba(108,99,255,0.1)}.tictactoe-cell.X{color:#6C63FF}.tictactoe-cell.O{color:#FF6B6B}.tictactoe-cell.winner{background:linear-gradient(45deg,#FFD700,#FFA500);color:white;animation:winnerPulse 1s ease-in-out infinite alternate}.tictactoe-cell.winner::after{content:'';position:absolute;top:50%;left:50%;width:80%;height:4px;background:linear-gradient(90deg,transparent,#fff,transparent);transform:translate(-50%,-50%);animation:winnerLine 2s ease-in-out infinite}@keyframes winnerPulse{0%{box-shadow:0 0 0 0 rgba(255,215,0,0.7)}100%{box-shadow:0 0 20px 10px rgba(255,215,0,0)}}@keyframes winnerLine{0%,100%{opacity:0;transform:translate(-50%,-50%) scaleX(0)}50%{opacity:1;transform:translate(-50%,-50%) scaleX(1)}}.winning-line{position:absolute;background:linear-gradient(90deg,#FFD700,#FFA500);border-radius:2px;z-index:10;animation:drawLine 1s ease-in-out forwards}.winning-line.horizontal{height:4px;width:0;top:50%;left:0;transform:translateY(-50%)}.winning-line.vertical{width:4px;height:0;left:50%;top:0;transform:translateX(-50%)}.winning-line.diagonal{width:4px;height:0;transform-origin:center}.winning-line.diagonal-1{top:0;left:50%;transform:translateX(-50%) rotate(45deg)}.winning-line.diagonal-2{top:0;left:50%;transform:translateX(-50%) rotate(-45deg)}@keyframes drawLine{to{width:100%;height:100%}}.tictactoe-controls{display:flex;gap:10px;margin-bottom:20px}.tictactoe-btn{padding:10px 20px;border:none;border-radius:8px;font-weight:600;cursor:pointer;transition:all 0.2s ease;font-size:14px;background:linear-gradient(135deg,#6C63FF,#3F8EFC);color:white}.tictactoe-btn:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(108,99,255,0.4)}.game-status{font-size:18px;font-weight:600;color:#1a1a1a;margin-bottom:20px;text-align:center}.modern-chat{flex:1;display:flex;flex-direction:column;background:linear-gradient(145deg,#f8f9ff,#ffffff);border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(108,99,255,0.1)}.chat-header{background:linear-gradient(135deg,#6C63FF,#5a52cc);color:white;padding:16px 20px;display:flex;align-items:center;gap:12px}.chat-header .status-indicator{width:8px;height:8px;background:#4ade80;border-radius:50%;animation:pulse 2s infinite}.chat-header h4{margin:0;font-size:16px;font-weight:600}.chat-messages{flex:1;padding:16px;overflow-y:auto;max-height:300px;display:flex;flex-direction:column;gap:12px;scrollbar-width:thin;scrollbar-color:rgba(108,99,255,0.3) transparent}.chat-messages::-webkit-scrollbar{width:4px}.chat-messages::-webkit-scrollbar-track{background:transparent}.chat-messages::-webkit-scrollbar-thumb{background:rgba(108,99,255,0.3);border-radius:2px}.message-bubble{max-width:85%;word-wrap:break-word;position:relative;animation:messageSlideIn 0.3s ease-out}.message-bubble.own{align-self:flex-end}.message-bubble.other{align-self:flex-start}.message-content{padding:10px 14px;border-radius:18px;font-size:14px;line-height:1.4}.message-bubble.own .message-content{background:linear-gradient(135deg,#6C63FF,#5a52cc);color:white;border-bottom-right-radius:4px}.message-bubble.other .message-content{background:white;color:#333;border:1px solid rgba(108,99,255,0.1);border-bottom-left-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,0.1)}.message-bubble.system .message-content{background:linear-gradient(135deg,#f1f3f4,#e8eaed);color:#5f6368;text-align:center;border-radius:12px;font-size:13px;font-style:italic;align-self:center;max-width:100%}.message-meta{display:flex;align-items:center;gap:6px;margin-top:4px;font-size:11px;opacity:0.7}.message-bubble.own .message-meta{justify-content:flex-end;color:#6C63FF}.message-bubble.other .message-meta{color:#666}.message-sender{font-weight:600;font-size:12px;margin-bottom:2px}.message-time{font-size:11px}.typing-indicator{display:none;align-self:flex-start;max-width:60px}.typing-content{background:white;border:1px solid rgba(108,99,255,0.1);padding:12px 16px;border-radius:18px;border-bottom-left-radius:4px}.typing-dots{display:flex;gap:4px}.typing-dots span{width:6px;height:6px;background:#6C63FF;border-radius:50%;animation:typingDots 1.4s infinite ease-in-out}.typing-dots span:nth-child(2){animation-delay:0.2s}.typing-dots span:nth-child(3){animation-delay:0.4s}@keyframes typingDots{0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}@keyframes messageSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}.chat-input{display:flex;padding:12px 16px;background:white;border-top:1px solid rgba(108,99,255,0.1);gap:8px;align-items:center}.chat-input-field{flex:1;padding:10px 14px;border:2px solid rgba(108,99,255,0.1);border-radius:20px;font-size:14px;transition:all 0.2s ease;background:rgba(108,99,255,0.02);min-width:0}.chat-input-field:focus{outline:none;border-color:#6C63FF;box-shadow:0 0 0 3px rgba(108,99,255,0.1)}.chat-input-field::placeholder{color:#999}.send-btn{padding:8px 14px;background:linear-gradient(135deg,#6C63FF,#5a52cc);color:white;border:none;border-radius:18px;font-weight:600;cursor:pointer;transition:all 0.2s ease;display:flex;align-items:center;gap:4px;font-size:13px;white-space:nowrap;flex-shrink:0}.send-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 12px rgba(108,99,255,0.3)}.send-btn:disabled{opacity:0.5;cursor:not-allowed}.send-btn.sending{background:#999}.send-btn svg{width:14px;height:14px}.emoji-btn{padding:8px;background:transparent;border:none;font-size:16px;cursor:pointer;border-radius:50%;transition:all 0.2s ease;flex-shrink:0}.emoji-btn:hover{background:rgba(108,99,255,0.1)}@media (max-width:768px){.tictactoe-container{padding:15px;flex-direction:column}.tictactoe-cell{font-size:32px}.game-side,.chat-side{min-width:100%}.modern-chat{max-height:400px}.message-bubble{max-width:90%}.chat-input{padding:12px}.chat-input-field{padding:10px 14px}}
.modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);backdrop-filter:blur(3px);display:flex;justify-content:center;align-items:center;z-index:9999}.modal{background:white;border-radius:12px;padding:30px;max-width:400px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.4);animation:modalSlideIn 0.3s ease;position:relative;z-index:10000;pointer-events:auto}@keyframes modalSlideIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}.modal h3{margin:0 0 20px 0;color:#333;text-align:center;font-size:24px}.modal-buttons{display:flex;flex-direction:column;gap:15px}.modal-btn{padding:15px 20px;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.2s ease}.modal-btn.primary{background:#6c5ce7;color:white}.modal-btn.primary:hover{background:#5a52cc}.modal-btn.secondary{background:#f8f9fa;color:#333;border:2px solid #e9ecef}.modal-btn.secondary:hover{background:#e9ecef}.modal-input{width:100%;padding:12px;border:2px solid #e9ecef;border-radius:8px;font-size:16px;margin:10px 0;box-sizing:border-box}.modal-input:focus{outline:none;border-color:#6c5ce7}.room-code{background:#f8f9fa;padding:15px;border-radius:8px;text-align:center;font-size:24px;font-weight:bold;color:#6c5ce7;letter-spacing:2px;margin:15px 0;border:2px dashed #6c5ce7}.close-btn{position:absolute;top:15px;right:15px;background:none;border:none;font-size:24px;cursor:pointer;color:#999}.close-btn:hover{color:#333}
        `;
        document.head.appendChild(style);
    }

    render() {
        this.container.innerHTML = `
            <div class="tictactoe-container">
                <div class="game-side">
                    <div class="tictactoe-header">
                        <h3>XOX Oyunu</h3>
                    </div>
                    <div class="tictactoe-controls">
                        <button class="tictactoe-btn" id="newGame">Yeni Oyun</button>
                        <button class="tictactoe-btn" id="toggleMode">
                            ${this.gameMode === 'ai' ? 'Çok Oyunculu' : 'AI ile Oyna'}
                        </button>
                    </div>
                    <div class="game-status" id="gameStatus">
                        ${this.gameMode === 'ai' ? 'AI ile oynayın' : 'Arkadaşınızla oynayın'}
                    </div>
                    <div class="tictactoe-board" id="board">
                        ${this.board.map((cell, index) => `
                            <button class="tictactoe-cell${cell ? ' ' + cell : ''}" data-index="${index}">
                                ${cell}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div class="chat-side">
                    <div class="modern-chat">
                        <div class="chat-header">
                            <div class="status-indicator"></div>
                            <h4>💬 Sohbet</h4>
                    </div>
                    <div class="chat-messages" id="chatMessages">
                            ${this.chatMessages.map(msg => {
                                const isOwn = msg.sender === this.playerName;
                                const isSystem = msg.sender === 'Sistem';
                                const time = new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'});
                                
                                if (isSystem) {
                                    return `
                                        <div class="message-bubble system">
                                            <div class="message-content">${msg.text}</div>
                                        </div>
                                    `;
                                }
                                
                                return `
                                    <div class="message-bubble ${isOwn ? 'own' : 'other'}">
                                        ${!isOwn ? `<div class="message-sender">${msg.sender}</div>` : ''}
                                        <div class="message-content">${msg.text}</div>
                                        <div class="message-meta">
                                            <span class="message-time">${time}</span>
                                            ${isOwn ? '<span>✓</span>' : ''}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                            <div class="typing-indicator" id="typingIndicator">
                                <div class="typing-content">
                                    <div class="typing-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div class="chat-input">
                            <button class="emoji-btn" type="button">😊</button>
                            <input type="text" class="chat-input-field" id="chatInput" placeholder="Mesajınızı yazın...">
                            <button class="send-btn" id="sendMessage">
                                <span>Gönder</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.updateGameStatus();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const board = this.container.querySelector('#board');
        const newGameBtn = this.container.querySelector('#newGame');
        const toggleModeBtn = this.container.querySelector('#toggleMode');
        const chatInput = this.container.querySelector('#chatInput');
        const sendMessageBtn = this.container.querySelector('#sendMessage');
        const emojiBtn = this.container.querySelector('.emoji-btn');

        board.addEventListener('click', (e) => {
            const cell = e.target.closest('.tictactoe-cell');
            if (cell && this.gameActive) {
                const index = cell.dataset.index;
                this.makeMove(index);
            }
        });

        newGameBtn.addEventListener('click', () => this.resetGame());
        toggleModeBtn.addEventListener('click', () => this.toggleGameMode());

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        sendMessageBtn.addEventListener('click', () => this.sendMessage());
        emojiBtn.addEventListener('click', () => this.showEmojiPicker());
    }

    makeMove(index) {
        // AI modunda kullanıcı sadece X ile oynayabilir
        if (this.gameMode === 'ai' && this.currentPlayer === 'O') {
            return;
        }

        if (this.board[index] === '' && this.gameActive) {
            this.board[index] = this.currentPlayer;
            this.render();

            if (this.checkWinner()) {
                this.gameActive = false;
                this.updateGameStatus(`${this.currentPlayer} kazandı!`);
                return;
            }

            if (this.board.every(cell => cell !== '')) {
                this.gameActive = false;
                this.updateGameStatus('Berabere!');
                return;
            }

            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateGameStatus();

            if (this.gameMode === 'ai' && this.currentPlayer === 'O') {
                setTimeout(() => this.makeAIMove(), 500);
            }
        }
    }

    makeAIMove() {
        if (!this.gameActive || this.currentPlayer !== 'O') return;

        // Simple AI: Find first empty cell
        const emptyIndexes = this.board.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);

        if (emptyIndexes.length > 0) {
            const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
            
            // AI hamlesini direkt yap
            this.board[randomIndex] = 'O';
            this.render();

            if (this.checkWinner()) {
                this.gameActive = false;
                this.updateGameStatus('O kazandı!');
                return;
            }

            if (this.board.every(cell => cell !== '')) {
                this.gameActive = false;
                this.updateGameStatus('Berabere!');
                return;
            }

            this.currentPlayer = 'X';
            this.updateGameStatus();
        }
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (let i = 0; i < winPatterns.length; i++) {
            const pattern = winPatterns[i];
            const [a, b, c] = pattern;
            if (this.board[a] !== '' &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]) {
                this.highlightWinningCells(pattern);
                return true;
            }
        }
        return false;
    }

    highlightWinningCells(winningPattern) {
        // Kazanan hücreleri vurgula
        winningPattern.forEach(index => {
            const cell = this.container.querySelector(`[data-index="${index}"]`);
            if (cell) {
                cell.classList.add('winner');
            }
        });

        // Çizgi animasyonu ekle
        setTimeout(() => {
            this.drawWinningLine(winningPattern);
        }, 500);
    }

    drawWinningLine(winningPattern) {
        const board = this.container.querySelector('.tictactoe-board');
        const line = document.createElement('div');
        line.className = 'winning-line';
        
        // Çizgi tipini belirle
        const [a, b, c] = winningPattern;
        
        if (a === 0 && b === 1 && c === 2) { // İlk satır
            line.classList.add('horizontal');
            line.style.top = '16.67%';
        } else if (a === 3 && b === 4 && c === 5) { // İkinci satır
            line.classList.add('horizontal');
            line.style.top = '50%';
        } else if (a === 6 && b === 7 && c === 8) { // Üçüncü satır
            line.classList.add('horizontal');
            line.style.top = '83.33%';
        } else if (a === 0 && b === 3 && c === 6) { // İlk sütun
            line.classList.add('vertical');
            line.style.left = '16.67%';
        } else if (a === 1 && b === 4 && c === 7) { // İkinci sütun
            line.classList.add('vertical');
            line.style.left = '50%';
        } else if (a === 2 && b === 5 && c === 8) { // Üçüncü sütun
            line.classList.add('vertical');
            line.style.left = '83.33%';
        } else if (a === 0 && b === 4 && c === 8) { // Sol üst - sağ alt çapraz
            line.classList.add('diagonal', 'diagonal-1');
            line.style.height = '141.42%'; // √2 * 100%
        } else if (a === 2 && b === 4 && c === 6) { // Sağ üst - sol alt çapraz
            line.classList.add('diagonal', 'diagonal-2');
            line.style.height = '141.42%'; // √2 * 100%
        }
        
        board.appendChild(line);
    }

    updateGameStatus(message) {
        const statusElement = this.container.querySelector('#gameStatus');
        if (message) {
            statusElement.textContent = message;
        } else {
            statusElement.textContent = `Sıradaki: ${this.currentPlayer}`;
        }
    }

    resetGame() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Animasyonları temizle
        this.clearWinningAnimations();
        
        this.render();
    }

    clearWinningAnimations() {
        // Kazanan hücre sınıflarını kaldır
        const cells = this.container.querySelectorAll('.tictactoe-cell');
        cells.forEach(cell => {
            cell.classList.remove('winner');
        });
        
        // Çizgi animasyonunu kaldır
        const winningLines = this.container.querySelectorAll('.winning-line');
        winningLines.forEach(line => {
            line.remove();
        });
    }

    toggleGameMode() {
        if (this.gameMode === 'ai') {
            this.showMultiplayerModal();
        } else {
            this.gameMode = 'ai';
            this.resetGame();
        }
    }

    sendMessage() {
        const input = this.container.querySelector('#chatInput');
        const sendBtn = this.container.querySelector('#sendMessage');
        const message = input.value.trim();

        if (message) {
            // Gönderme animasyonu
            sendBtn.classList.add('sending');
            sendBtn.disabled = true;
            
            setTimeout(() => {
            this.chatMessages.push({
                sender: this.playerName,
                    text: message,
                    timestamp: Date.now()
            });
            input.value = '';
                this.updateChatDisplay();
                
                sendBtn.classList.remove('sending');
                sendBtn.disabled = false;
                input.focus();
            }, 300);
        }
    }

    updateChatDisplay() {
        const chatContainer = this.container.querySelector('#chatMessages');
        const typingIndicator = chatContainer.querySelector('#typingIndicator');
        
        // Mesajları yeniden oluştur
        const messagesHTML = this.chatMessages.map(msg => {
            const isOwn = msg.sender === this.playerName;
            const isSystem = msg.sender === 'Sistem';
            const time = msg.timestamp ? 
                new Date(msg.timestamp).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'}) :
                new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'});
            
            if (isSystem) {
                return `
                    <div class="message-bubble system">
                        <div class="message-content">${msg.text}</div>
                    </div>
                `;
            }
            
            return `
                <div class="message-bubble ${isOwn ? 'own' : 'other'}">
                    ${!isOwn ? `<div class="message-sender">${msg.sender}</div>` : ''}
                    <div class="message-content">${msg.text}</div>
                    <div class="message-meta">
                        <span class="message-time">${time}</span>
                        ${isOwn ? '<span>✓</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // Typing indicator'ı koru ve mesajları güncelle
        chatContainer.innerHTML = messagesHTML + typingIndicator.outerHTML;
        
        // En alta kaydır
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 100);
    }

    showTypingIndicator() {
        const typingIndicator = this.container.querySelector('#typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'block';
            const chatContainer = this.container.querySelector('#chatMessages');
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            setTimeout(() => {
                typingIndicator.style.display = 'none';
            }, 2000);
        }
    }

    showEmojiPicker() {
        const emojis = ['😊', '😂', '🤔', '👍', '👎', '❤️', '🎉', '🔥', '💯', '😎', '🤯', '👏', '🎯', '🏆', '💪', '🤝'];
        const chatInput = this.container.querySelector('#chatInput');
        
        // Emoji seçici popup'ını oluştur
        const picker = document.createElement('div');
        picker.style.cssText = `
            position: absolute;
            bottom: 70px;
            left: 16px;
            background: white;
            border: 1px solid rgba(108,99,255,0.2);
            border-radius: 12px;
            padding: 10px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000;
        `;
        
        emojis.forEach(emoji => {
            const emojiBtn = document.createElement('button');
            emojiBtn.textContent = emoji;
            emojiBtn.style.cssText = `
                border: none;
                background: transparent;
                padding: 8px;
                font-size: 20px;
                cursor: pointer;
                border-radius: 6px;
                transition: all 0.2s ease;
            `;
            
            emojiBtn.addEventListener('mouseover', () => {
                emojiBtn.style.background = 'rgba(108,99,255,0.1)';
            });
            
            emojiBtn.addEventListener('mouseout', () => {
                emojiBtn.style.background = 'transparent';
            });
            
            emojiBtn.addEventListener('click', () => {
                chatInput.value += emoji;
                chatInput.focus();
                picker.remove();
            });
            
            picker.appendChild(emojiBtn);
        });
        
        // Dışarı tıklanınca kapat
        const closeHandler = (e) => {
            if (!picker.contains(e.target)) {
                picker.remove();
                document.removeEventListener('click', closeHandler);
        }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeHandler);
        }, 100);
        
        this.container.querySelector('.modern-chat').appendChild(picker);
    }

    showMultiplayerModal() {
        const modalHTML = `
            <div class="modal-overlay" id="multiplayerModal" onclick="if(event.target === this) this.remove()">
                <div class="modal">
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    <h3>Çok Oyunculu Mod</h3>
                    <div class="modal-buttons">
                        <button class="modal-btn primary" onclick="window.currentGame.showJoinRoom()">Odaya Katıl</button>
                        <button class="modal-btn secondary" onclick="window.currentGame.showCreateRoom()">Oda Aç</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        window.currentGame = this;
        
        // ESC tuşu ile kapatma
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modal = document.querySelector('#multiplayerModal');
                if (modal) modal.remove();
            }
        });
    }

    showJoinRoom() {
        const modal = document.querySelector('#multiplayerModal .modal');
        modal.innerHTML = `
            <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            <h3>Odaya Katıl</h3>
            <input type="text" class="modal-input" id="roomCodeInput" placeholder="Oda kodunu girin..." maxlength="6" style="text-transform: uppercase;">
            <div class="modal-buttons">
                <button class="modal-btn primary" onclick="window.currentGame.joinRoom()">Katıl</button>
                <button class="modal-btn secondary" onclick="window.currentGame.goBackToMainModal()">Geri</button>
            </div>
        `;
        
        // Input'a otomatik focus ve Enter tuşu desteği
        setTimeout(() => {
            const input = document.querySelector('#roomCodeInput');
            if (input) {
                input.focus();
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        window.currentGame.joinRoom();
                    }
                });
            }
        }, 100);
    }

    showCreateRoom() {
        const roomCode = this.generateRoomCode();
        const modal = document.querySelector('#multiplayerModal .modal');
        modal.innerHTML = `
            <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            <h3>Oda Oluşturuldu</h3>
            <p>Oda kodunuzu arkadaşlarınızla paylaşın:</p>
            <div class="room-code">${roomCode}</div>
            <div class="modal-buttons">
                <button class="modal-btn primary" onclick="window.currentGame.startMultiplayerGame('${roomCode}')">Oyunu Başlat</button>
                <button class="modal-btn secondary" onclick="window.currentGame.goBackToMainModal()">Geri</button>
            </div>
        `;
    }

    generateRoomCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    joinRoom() {
        const roomCode = document.querySelector('#roomCodeInput').value.trim().toUpperCase();
        if (roomCode.length === 6) {
            this.startMultiplayerGame(roomCode);
        } else {
            alert('Lütfen geçerli bir oda kodu girin!');
        }
    }

    startMultiplayerGame(roomCode) {
        this.gameMode = 'multiplayer';
        this.roomCode = roomCode;
        document.querySelector('#multiplayerModal').remove();
        this.resetGame();
        
        // Burada gerçek multiplayer bağlantısı kurulabilir
        this.chatMessages.push({
            sender: 'Sistem',
            text: `Oda ${roomCode} - Çok oyunculu mod aktif!`
        });
        this.render();
    }

    goBackToMainModal() {
        const modal = document.querySelector('#multiplayerModal .modal');
        modal.innerHTML = `
            <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            <h3>Çok Oyunculu Mod</h3>
            <div class="modal-buttons">
                <button class="modal-btn primary" onclick="window.currentGame.showJoinRoom()">Odaya Katıl</button>
                <button class="modal-btn secondary" onclick="window.currentGame.showCreateRoom()">Oda Aç</button>
            </div>
        `;
    }
}

// Export the game module
window.TicTacToeGame = TicTacToeGame;