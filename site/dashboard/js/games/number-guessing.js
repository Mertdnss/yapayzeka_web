// Number Guessing Game Module
class NumberGuessingGame {
    constructor(container) {
        this.container = container;
        this.guessCount = 0;
        this.maxGuesses = 10;
        this.gameActive = true;
        this.gameMode = 'single'; // 'single' or 'multiplayer'
        this.difficulty = 'normal'; // easy: 1-50, normal: 1-100, hard: 1-500
        this.minNumber = 1;
        this.maxNumber = 100;
        this.roomCode = null;
        this.players = [];
        this.currentPlayerIndex = 0;
        this.secretNumber = this.generateRandomNumber(); // Şimdi minNumber ve maxNumber tanımlı
        this.chatMessages = [];
        this.guessHistory = [];
        this.playerName = document.querySelector('.user-name').textContent || 'Oyuncu';
        this.startTime = Date.now();
        this.bestScore = this.loadBestScore();
        this.hintsUsed = 0;
        this.maxHints = 3;
        this.usedHintTypes = new Set();
        this.initializeStyles();
        this.render();
    }

    initializeStyles() {
        if (document.getElementById('number-guessing-game-styles')) return;

        const style = document.createElement('style');
        style.id = 'number-guessing-game-styles';
        style.textContent = `.number-guessing-container{max-width:100%;margin:0 auto;padding:20px;background:rgba(255,255,255,0.95);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.1);backdrop-filter:blur(20px);display:flex;gap:20px;flex-wrap:wrap;position:relative;z-index:1}.game-side{flex:1;min-width:350px}.chat-side{flex:1;min-width:300px;display:flex;flex-direction:column}.number-guessing-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid rgba(52,152,219,0.1)}.number-guessing-header h3{font-size:24px;font-weight:700;color:#1a1a1a;margin:0}.game-board{background:rgba(52,152,219,0.1);padding:25px;border-radius:12px;margin-bottom:20px;text-align:center}.number-range{font-size:18px;color:#3498db;font-weight:600;margin-bottom:20px;padding:15px;background:white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)}.guess-input-container{margin-bottom:20px}.guess-input{width:200px;padding:15px;font-size:24px;text-align:center;border:3px solid #3498db;border-radius:8px;margin-right:10px;transition:all 0.3s ease}.guess-input:focus{outline:none;border-color:#2980b9;box-shadow:0 0 15px rgba(52,152,219,0.3)}.guess-btn{padding:15px 25px;background:linear-gradient(135deg,#3498db,#2980b9);color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.2s ease}.guess-btn:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(52,152,219,0.4)}.guess-btn:disabled{background:#bdc3c7;cursor:not-allowed;transform:none;box-shadow:none}.game-feedback{min-height:80px;background:white;border-radius:8px;padding:20px;margin-bottom:20px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,0.1)}.feedback-higher{color:#e74c3c;animation:feedbackPulse 0.5s ease}.feedback-lower{color:#f39c12;animation:feedbackPulse 0.5s ease}.feedback-correct{color:#27ae60;background:linear-gradient(135deg,#2ecc71,#27ae60);color:white;animation:winPulse 1s ease-in-out infinite alternate}.feedback-game-over{color:#e74c3c;background:linear-gradient(135deg,#e74c3c,#c0392b);color:white}.feedback-hint{color:#8e44ad;background:linear-gradient(135deg,#9b59b6,#8e44ad);color:white;animation:hintPulse 0.8s ease-in-out}@keyframes feedbackPulse{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}@keyframes winPulse{0%{box-shadow:0 0 0 0 rgba(46,204,113,0.7)}100%{box-shadow:0 0 20px 10px rgba(46,204,113,0)}}@keyframes hintPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}.game-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:15px;margin-bottom:20px}.stat-card{background:white;padding:15px;border-radius:8px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.1)}.stat-value{font-size:24px;font-weight:700;color:#3498db;display:block}.stat-label{font-size:12px;color:#7f8c8d;text-transform:uppercase;letter-spacing:0.5px}.number-guessing-controls{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap}.control-btn{padding:10px 15px;border:none;border-radius:8px;font-weight:600;cursor:pointer;transition:all 0.2s ease;font-size:14px;background:linear-gradient(135deg,#9b59b6,#8e44ad);color:white}.control-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 4px 12px rgba(155,89,182,0.4)}.control-btn:disabled{background:#bdc3c7;cursor:not-allowed;opacity:0.6;transform:none}.difficulty-selector{display:flex;gap:5px;margin-bottom:15px}.difficulty-btn{padding:8px 15px;border:2px solid #3498db;background:white;color:#3498db;border-radius:6px;cursor:pointer;transition:all 0.2s ease;font-size:12px;font-weight:600}.difficulty-btn.active{background:#3498db;color:white}.difficulty-btn:hover{background:#3498db;color:white}.guess-history{background:white;border-radius:8px;padding:15px;margin-bottom:20px;max-height:200px;overflow-y:auto}.guess-history h4{margin:0 0 10px 0;color:#2c3e50;font-size:16px}.guess-item{display:flex;justify-content:space-between;align-items:center;padding:8px;margin-bottom:5px;background:#f8f9fa;border-radius:4px}.guess-number{font-weight:600;font-size:18px}.guess-hint{font-size:14px;color:#7f8c8d}.chat-messages{flex:1;background:white;border-radius:12px;padding:15px;margin-bottom:15px;overflow-y:auto;max-height:300px}.chat-message{margin-bottom:10px;padding:8px 12px;border-radius:8px;background:rgba(52,152,219,0.1)}.chat-message .sender{font-weight:600;color:#3498db;margin-bottom:4px}.chat-message .text{color:#1a1a1a}.chat-input{display:flex;gap:10px}.chat-input input{flex:1;padding:10px;border:1px solid rgba(52,152,219,0.2);border-radius:8px;font-size:14px}.chat-input button{padding:10px 20px;border:none;border-radius:8px;background:#3498db;color:white;cursor:pointer;transition:all 0.2s ease}.chat-input button:hover{background:#2980b9}.victory-animation{animation:victoryBounce 0.6s ease-in-out}@keyframes victoryBounce{0%,20%,60%,100%{transform:translateY(0)}40%{transform:translateY(-20px)}80%{transform:translateY(-10px)}}@media (max-width:768px){.number-guessing-container{padding:15px}.game-side,.chat-side{min-width:100%}.guess-input{width:150px;margin-right:5px}.number-guessing-controls{justify-content:center}}.modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);backdrop-filter:blur(3px);display:flex;justify-content:center;align-items:center;z-index:9999}.modal{background:white;border-radius:12px;padding:30px;max-width:400px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.4);animation:modalSlideIn 0.3s ease;position:relative;z-index:10000;pointer-events:auto}@keyframes modalSlideIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}.modal h3{margin:0 0 20px 0;color:#333;text-align:center;font-size:24px}.modal-buttons{display:flex;flex-direction:column;gap:15px}.modal-btn{padding:15px 20px;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.2s ease}.modal-btn.primary{background:#3498db;color:white}.modal-btn.primary:hover{background:#2980b9}.modal-btn.secondary{background:#f8f9fa;color:#333;border:2px solid #e9ecef}.modal-btn.secondary:hover{background:#e9ecef}.modal-input{width:100%;padding:12px;border:2px solid #e9ecef;border-radius:8px;font-size:16px;margin:10px 0;box-sizing:border-box}.modal-input:focus{outline:none;border-color:#3498db}.room-code{background:#f8f9fa;padding:15px;border-radius:8px;text-align:center;font-size:24px;font-weight:bold;color:#3498db;letter-spacing:2px;margin:15px 0;border:2px dashed #3498db}.close-btn{position:absolute;top:15px;right:15px;background:none;border:none;font-size:24px;cursor:pointer;color:#999}.close-btn:hover{color:#333}.player-list{background:#f8f9fa;border-radius:8px;padding:15px;margin:15px 0}.player-item{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #e9ecef}.player-item:last-child{border-bottom:none}.player-name{font-weight:600;color:#333}.player-score{color:#3498db;font-weight:600}.current-turn{background:#3498db;color:white;padding:10px;border-radius:8px;text-align:center;margin:10px 0;font-weight:600}.current-player{background:#e8f4fd;border-left:4px solid #3498db}.modern-chat{flex:1;display:flex;flex-direction:column;background:linear-gradient(145deg,#f8f9ff,#ffffff);border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(52,152,219,0.1)}.chat-header{background:linear-gradient(135deg,#3498db,#2980b9);color:white;padding:16px 20px;display:flex;align-items:center;gap:12px}.chat-header .status-indicator{width:8px;height:8px;background:#4ade80;border-radius:50%;animation:pulse 2s infinite}.chat-header h4{margin:0;font-size:16px;font-weight:600}.chat-messages{flex:1;padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;scrollbar-width:thin;scrollbar-color:rgba(52,152,219,0.3) transparent}.chat-messages::-webkit-scrollbar{width:4px}.chat-messages::-webkit-scrollbar-track{background:transparent}.chat-messages::-webkit-scrollbar-thumb{background:rgba(52,152,219,0.3);border-radius:2px}.message-bubble{max-width:85%;word-wrap:break-word;position:relative;animation:messageSlideIn 0.3s ease-out}.message-bubble.own{align-self:flex-end}.message-bubble.other{align-self:flex-start}.message-content{padding:10px 14px;border-radius:18px;font-size:14px;line-height:1.4}.message-bubble.own .message-content{background:linear-gradient(135deg,#3498db,#2980b9);color:white;border-bottom-right-radius:4px}.message-bubble.other .message-content{background:white;color:#333;border:1px solid rgba(52,152,219,0.1);border-bottom-left-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,0.1)}.message-bubble.system .message-content{background:linear-gradient(135deg,#f1f3f4,#e8eaed);color:#5f6368;text-align:center;border-radius:12px;font-size:13px;font-style:italic;align-self:center;max-width:100%}.message-meta{display:flex;align-items:center;gap:6px;margin-top:4px;font-size:11px;opacity:0.7}.message-bubble.own .message-meta{justify-content:flex-end;color:#3498db}.message-bubble.other .message-meta{color:#666}.message-sender{font-weight:600;font-size:12px;margin-bottom:2px}.message-time{font-size:11px}.typing-indicator{display:none;align-self:flex-start;max-width:60px}.typing-content{background:white;border:1px solid rgba(52,152,219,0.1);padding:12px 16px;border-radius:18px;border-bottom-left-radius:4px}.typing-dots{display:flex;gap:4px}.typing-dots span{width:6px;height:6px;background:#3498db;border-radius:50%;animation:typingDots 1.4s infinite ease-in-out}.typing-dots span:nth-child(2){animation-delay:0.2s}.typing-dots span:nth-child(3){animation-delay:0.4s}@keyframes typingDots{0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}@keyframes messageSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}.chat-input{display:flex;padding:12px 16px;background:white;border-top:1px solid rgba(52,152,219,0.1);gap:8px;align-items:center}.chat-input-field{flex:1;padding:10px 14px;border:2px solid rgba(52,152,219,0.1);border-radius:20px;font-size:14px;transition:all 0.2s ease;background:rgba(52,152,219,0.02);min-width:0}.chat-input-field:focus{outline:none;border-color:#3498db;box-shadow:0 0 0 3px rgba(52,152,219,0.1)}.chat-input-field::placeholder{color:#999}.send-btn{padding:8px 14px;background:linear-gradient(135deg,#3498db,#2980b9);color:white;border:none;border-radius:18px;font-weight:600;cursor:pointer;transition:all 0.2s ease;display:flex;align-items:center;gap:4px;font-size:13px;white-space:nowrap;flex-shrink:0}.send-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 12px rgba(52,152,219,0.3)}.send-btn:disabled{opacity:0.5;cursor:not-allowed}.send-btn.sending{background:#999}.send-btn svg{width:14px;height:14px}.emoji-btn{padding:8px;background:transparent;border:none;font-size:16px;cursor:pointer;border-radius:50%;transition:all 0.2s ease;flex-shrink:0}.emoji-btn:hover{background:rgba(52,152,219,0.1)}`;
        document.head.appendChild(style);
    }

    generateRandomNumber() {
        // Güvenlik kontrolü
        if (isNaN(this.minNumber) || isNaN(this.maxNumber) || this.minNumber >= this.maxNumber) {
            console.warn('Geçersiz sayı aralığı! Varsayılan değerler kullanılıyor.');
            this.minNumber = 1;
            this.maxNumber = 100;
        }
        return Math.floor(Math.random() * (this.maxNumber - this.minNumber + 1)) + this.minNumber;
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        switch(difficulty) {
            case 'easy':
                this.minNumber = 1;
                this.maxNumber = 50;
                this.maxGuesses = 8;
                break;
            case 'normal':
                this.minNumber = 1;
                this.maxNumber = 100;
                this.maxGuesses = 10;
                break;
            case 'hard':
                this.minNumber = 1;
                this.maxNumber = 500;
                this.maxGuesses = 15;
                break;
        }
        this.resetGame();
    }

    render() {
        this.container.innerHTML = `
            <div class="number-guessing-container">
                <div class="game-side">
                    <div class="number-guessing-header">
                        <h3>🎯 Sayı Bulmacası</h3>
                    </div>
                    
                    <div class="difficulty-selector">
                        <button class="difficulty-btn ${this.difficulty === 'easy' ? 'active' : ''}" data-difficulty="easy">
                            Kolay (1-50)
                        </button>
                        <button class="difficulty-btn ${this.difficulty === 'normal' ? 'active' : ''}" data-difficulty="normal">
                            Normal (1-100)
                        </button>
                        <button class="difficulty-btn ${this.difficulty === 'hard' ? 'active' : ''}" data-difficulty="hard">
                            Zor (1-500)
                        </button>
                    </div>

                    <div class="game-board">
                        <div class="number-range">
                            🎲 ${this.minNumber} ile ${this.maxNumber} arasında bir sayı tuttum!
                        </div>
                        
                        <div class="guess-input-container">
                            <input type="number" 
                                   class="guess-input" 
                                   id="guessInput" 
                                   min="${this.minNumber}" 
                                   max="${this.maxNumber}"
                                   placeholder="?"
                                   ${!this.gameActive ? 'disabled' : ''}>
                            <button class="guess-btn" 
                                    id="submitGuess" 
                                    ${!this.gameActive ? 'disabled' : ''}>
                                Tahmin Et!
                            </button>
                        </div>

                        <div class="game-feedback" id="gameFeedback">
                            Haydi bakalım, ilk tahmininizi yapın! 🤔
                        </div>
                    </div>

                    <div class="game-stats">
                        <div class="stat-card">
                            <span class="stat-value">${this.guessCount}</span>
                            <span class="stat-label">Tahmin</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">${this.maxGuesses - this.guessCount}</span>
                            <span class="stat-label">Kalan Hak</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">${this.maxHints - this.hintsUsed}</span>
                            <span class="stat-label">Kalan İpucu</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">${this.bestScore || '-'}</span>
                            <span class="stat-label">En İyi</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">${this.getElapsedTime()}</span>
                            <span class="stat-label">Süre</span>
                        </div>
                    </div>

                    <div class="number-guessing-controls">
                        <button class="control-btn" id="newGame">🎮 Yeni Oyun</button>
                        <button class="control-btn" id="giveHint" ${this.hintsUsed >= this.maxHints ? 'disabled' : ''}>
                            💡 İpucu Ver (${this.hintsUsed}/${this.maxHints})
                        </button>
                        <button class="control-btn" id="multiplayerBtn">${this.gameMode === 'single' ? '👥 Çok Oyunculu' : '👤 Tek Oyunculu'}</button>
                    </div>

                    <div class="guess-history">
                        <h4>📋 Tahmin Geçmişi</h4>
                        <div id="guessHistoryList">
                            ${this.guessHistory.length === 0 ? 
                                '<div style="text-align: center; color: #bdc3c7; font-style: italic;">Henüz tahmin yapmadınız</div>' : 
                                this.guessHistory.map((guess, index) => `
                                    <div class="guess-item">
                                        <span class="guess-number">${guess.number}</span>
                                        <span class="guess-hint">${guess.hint}</span>
                                    </div>
                                `).join('')
                            }
                        </div>
                    </div>
                </div>

                <div class="chat-side">
                    ${this.gameMode === 'multiplayer' ? `
                        <div class="player-list">
                            <div style="text-align: center; margin-bottom: 10px; font-weight: 600; color: #3498db;">
                                🏠 Oda: ${this.roomCode}
                            </div>
                            ${this.players.map((player, index) => `
                                <div class="player-item ${index === this.currentPlayerIndex ? 'current-player' : ''}">
                                    <div class="player-name">
                                        ${player.isHost ? '👑 ' : ''}${player.name}
                                        ${index === this.currentPlayerIndex ? ' (Sırada)' : ''}
                                    </div>
                                    <div class="player-score">${player.guesses} tahmin</div>
                                </div>
                            `).join('')}
                            ${this.gameActive && this.players.length > 0 ? `
                                <div class="current-turn">
                                    🎯 Sıra: ${this.players[this.currentPlayerIndex].name}
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                    
                    <div class="modern-chat">
                        <div class="chat-header">
                            <div class="status-indicator"></div>
                            <h4>${this.gameMode === 'multiplayer' ? '🎮 Oyun Sohbeti' : '💬 Sohbet'}</h4>
                        </div>
                        <div class="chat-messages" id="chatMessages" style="max-height: ${this.gameMode === 'multiplayer' ? '200px' : '300px'};">
                            ${this.chatMessages.map(msg => {
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

        this.setupEventListeners();
        this.focusGuessInput();
    }

    setupEventListeners() {
        const guessInput = this.container.querySelector('#guessInput');
        const submitBtn = this.container.querySelector('#submitGuess');
        const newGameBtn = this.container.querySelector('#newGame');
        const hintBtn = this.container.querySelector('#giveHint');
        const multiplayerBtn = this.container.querySelector('#multiplayerBtn');
        const chatInput = this.container.querySelector('#chatInput');
        const sendMessageBtn = this.container.querySelector('#sendMessage');
        const emojiBtn = this.container.querySelector('.emoji-btn');
        const difficultyBtns = this.container.querySelectorAll('.difficulty-btn');

        // Tahmin gönderme
        submitBtn.addEventListener('click', () => this.submitGuess());
        guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitGuess();
        });

        // Oyun kontrolleri
        newGameBtn.addEventListener('click', () => this.resetGame());
        hintBtn.addEventListener('click', () => this.giveHint());
        multiplayerBtn.addEventListener('click', () => this.toggleGameMode());

        // Zorluk seçimi
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.target.dataset.difficulty;
                this.setDifficulty(difficulty);
            });
        });

        // Sohbet
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        sendMessageBtn.addEventListener('click', () => this.sendMessage());
        emojiBtn.addEventListener('click', () => this.showEmojiPicker());

        // Süre güncellemesi
        this.timeInterval = setInterval(() => {
            if (this.gameActive) {
                this.updateTimeDisplay();
            }
        }, 1000);
    }

    submitGuess() {
        if (!this.gameActive) return;

        // Çok oyunculu modda sıra kontrolü
        if (this.gameMode === 'multiplayer' && this.players.length > 0) {
            const currentPlayer = this.players[this.currentPlayerIndex];
            if (!currentPlayer) return;
        }

        const guessInput = this.container.querySelector('#guessInput');
        const guess = parseInt(guessInput.value);

        if (isNaN(guess) || guess < this.minNumber || guess > this.maxNumber) {
            this.showFeedback(`Lütfen ${this.minNumber} ile ${this.maxNumber} arasında geçerli bir sayı girin!`, 'error');
            return;
        }

        // Çok oyunculu modda oyuncu başına tahmin sayısını artır
        if (this.gameMode === 'multiplayer' && this.players.length > 0) {
            this.players[this.currentPlayerIndex].guesses++;
        }

        this.guessCount++;
        let hint = '';
        let feedbackClass = '';
        const playerName = this.gameMode === 'multiplayer' && this.players.length > 0 ? 
            this.players[this.currentPlayerIndex].name : 'Oyuncu';

        if (guess === this.secretNumber) {
            this.gameActive = false;
            hint = '🎉 Doğru!';
            feedbackClass = 'feedback-correct';
            
            if (this.gameMode === 'multiplayer') {
                this.showFeedback(`🎉 ${playerName} kazandı! ${this.players[this.currentPlayerIndex].guesses} tahminde doğru sayıyı buldu!`, feedbackClass);
                this.addChatMessage('Sistem', `🏆 ${playerName} oyunu kazandı! Sayı: ${this.secretNumber} (${this.players[this.currentPlayerIndex].guesses} tahmin)`);
            } else {
                this.showFeedback(`🎉 Tebrikler! ${this.guessCount} tahminde doğru sayıyı buldunuz!`, feedbackClass);
                this.updateBestScore();
                this.addChatMessage('Sistem', `🏆 Oyuncu ${this.guessCount} tahminde kazandı! Sayı: ${this.secretNumber}`);
            }
            
            // Zafer animasyonu
            this.container.querySelector('.game-board').classList.add('victory-animation');
            setTimeout(() => {
                this.container.querySelector('.game-board').classList.remove('victory-animation');
            }, 600);
            
        } else if (guess < this.secretNumber) {
            hint = '📈 Daha büyük';
            feedbackClass = 'feedback-higher';
            this.showFeedback(`${guess} çok küçük! Daha büyük bir sayı deneyin. 📈`, feedbackClass);
            
            if (this.gameMode === 'multiplayer') {
                this.addChatMessage('Sistem', `${playerName}: ${guess} (Daha büyük)`);
                this.nextPlayer();
            }
        } else {
            hint = '📉 Daha küçük';
            feedbackClass = 'feedback-lower';
            this.showFeedback(`${guess} çok büyük! Daha küçük bir sayı deneyin. 📉`, feedbackClass);
            
            if (this.gameMode === 'multiplayer') {
                this.addChatMessage('Sistem', `${playerName}: ${guess} (Daha küçük)`);
                this.nextPlayer();
            }
        }

        // Tahmin geçmişine ekle
        this.guessHistory.push({ number: guess, hint: hint });

        // Oyun bitti mi kontrol et
        if (this.guessCount >= this.maxGuesses && this.gameActive) {
            this.gameActive = false;
            this.showFeedback(`💔 Oyun bitti! Doğru sayı ${this.secretNumber} idi.`, 'feedback-game-over');
            
            if (this.gameMode === 'multiplayer') {
                const playerStats = this.players.map(player => `${player.name}: ${player.guesses} tahmin`).join(', ');
                this.addChatMessage('Sistem', `💔 Oyun bitti! Doğru sayı ${this.secretNumber} idi. Kimse ${this.maxGuesses} tahminde bulamadı.`);
                this.addChatMessage('Sistem', `📊 Oyuncu İstatistikleri: ${playerStats}`);
            } else {
                this.addChatMessage('Sistem', `💔 Oyun bitti! Doğru sayı ${this.secretNumber} idi. ${this.maxGuesses} tahminde bulamadınız.`);
            }
        }

        // Input'u temizle ve odakla
        guessInput.value = '';
        this.updateGameUI();
        this.focusGuessInput();
    }

    showFeedback(message, className = '') {
        const feedback = this.container.querySelector('#gameFeedback');
        feedback.textContent = message;
        feedback.className = `game-feedback ${className}`;
    }

    giveHint() {
        if (!this.gameActive || this.hintsUsed >= this.maxHints) {
            if (this.hintsUsed >= this.maxHints) {
                this.addChatMessage('Sistem', '❌ İpucu hakkınız bitti!');
            }
            return;
        }

        if (this.guessCount === 0) {
            this.addChatMessage('Sistem', '💭 Önce bir tahmin yapın, sonra ipucu isteyebilirsiniz!');
            return;
        }

        // Kullanılabilir ipucu türleri
        const availableHints = [
            {
                type: 'evenOdd',
                condition: () => true,
                message: () => this.secretNumber % 2 === 0 ? 
                    '💡 İpucu: Tuttuğum sayı çift!' : 
                    '💡 İpucu: Tuttuğum sayı tek!'
            },
            {
                type: 'prime',
                condition: () => this.secretNumber > 1,
                message: () => this.isPrime(this.secretNumber) ? 
                    '💡 İpucu: Tuttuğum sayı asal bir sayı!' : 
                    '💡 İpucu: Tuttuğum sayı asal değil!'
            },
            {
                type: 'range',
                condition: () => this.maxNumber >= 100,
                message: () => {
                    const tens = Math.floor(this.secretNumber / 10) * 10;
                    return `💡 İpucu: Tuttuğum sayı ${tens} ile ${tens + 9} arasında!`;
                }
            },
            {
                type: 'digitSum',
                condition: () => this.secretNumber >= 10,
                message: () => {
                    const sum = this.getDigitSum(this.secretNumber);
                    return `💡 İpucu: Tuttuğum sayının rakamları toplamı ${sum}!`;
                }
            },
            {
                type: 'perfectSquare',
                condition: () => this.secretNumber <= 400,
                message: () => {
                    const sqrt = Math.sqrt(this.secretNumber);
                    return sqrt === Math.floor(sqrt) ? 
                        '💡 İpucu: Tuttuğum sayı mükemmel kare!' : 
                        '💡 İpucu: Tuttuğum sayı mükemmel kare değil!';
                }
            },
            {
                type: 'multiple5',
                condition: () => true,
                message: () => this.secretNumber % 5 === 0 ? 
                    '💡 İpucu: Tuttuğum sayı 5\'in katı!' : 
                    '💡 İpucu: Tuttuğum sayı 5\'in katı değil!'
            },
            {
                type: 'firstDigit',
                condition: () => this.secretNumber >= 10,
                message: () => {
                    const firstDigit = Math.floor(this.secretNumber / Math.pow(10, Math.floor(Math.log10(this.secretNumber))));
                    return `💡 İpucu: Tuttuğum sayının ilk rakamı ${firstDigit}!`;
                }
            },
            {
                type: 'lastDigit',
                condition: () => this.secretNumber >= 10,
                message: () => {
                    const lastDigit = this.secretNumber % 10;
                    return `💡 İpucu: Tuttuğum sayının son rakamı ${lastDigit}!`;
                }
            },
            {
                type: 'multiple3',
                condition: () => true,
                message: () => this.secretNumber % 3 === 0 ? 
                    '💡 İpucu: Tuttuğum sayı 3\'ün katı!' : 
                    '💡 İpucu: Tuttuğum sayı 3\'ün katı değil!'
            },
            {
                type: 'comparison',
                condition: () => this.guessHistory.length > 0,
                message: () => {
                    const lastGuess = this.guessHistory[this.guessHistory.length - 1].number;
                    const diff = Math.abs(this.secretNumber - lastGuess);
                    if (diff <= 5) return '💡 İpucu: Son tahmininize çok yakınsınız! (5 veya daha az fark)';
                    if (diff <= 10) return '💡 İpucu: Son tahmininize yakınsınız! (10 veya daha az fark)';
                    if (diff <= 20) return '💡 İpucu: Son tahmininize biraz uzaksınız! (20 veya daha az fark)';
                    return '💡 İpucu: Son tahmininizden oldukça uzakta!';
                }
            }
        ];

        // Kullanılmamış ve kullanılabilir ipuçlarını filtrele
        const validHints = availableHints.filter(hint => 
            !this.usedHintTypes.has(hint.type) && hint.condition()
        );

        if (validHints.length === 0) {
            this.addChatMessage('Sistem', '❌ Verebileceğim başka ipucu kalmadı!');
            return;
        }

        // Rastgele bir ipucu seç
        const randomHint = validHints[Math.floor(Math.random() * validHints.length)];
        
        // İpucunu işaretle ve sayacı artır
        this.usedHintTypes.add(randomHint.type);
        this.hintsUsed++;
        
        // İpucunu ana ekranda göster
        const hintMessage = randomHint.message();
        this.showFeedback(hintMessage, 'feedback-hint');
        this.addChatMessage('Sistem', hintMessage);
        
        // Buton durumunu güncelle
        this.updateHintButton();
    }

    isPrime(n) {
        if (n < 2) return false;
        if (n === 2) return true;
        if (n % 2 === 0) return false;
        for (let i = 3; i <= Math.sqrt(n); i += 2) {
            if (n % i === 0) return false;
        }
        return true;
    }

    getDigitSum(n) {
        return n.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }

    updateHintButton() {
        const hintBtn = this.container.querySelector('#giveHint');
        if (hintBtn) {
            hintBtn.textContent = `💡 İpucu Ver (${this.hintsUsed}/${this.maxHints})`;
            if (this.hintsUsed >= this.maxHints) {
                hintBtn.disabled = true;
                hintBtn.style.opacity = '0.5';
                hintBtn.style.cursor = 'not-allowed';
            }
        }
    }

    updateGameUI() {
        // Sadece değişen kısımları güncelle, feedback alanına dokunma
        
        // İstatistikleri güncelle
        const statCards = this.container.querySelectorAll('.stat-value');
        if (statCards.length >= 5) {
            statCards[0].textContent = this.guessCount; // Tahmin
            statCards[1].textContent = this.maxGuesses - this.guessCount; // Kalan Hak
            statCards[2].textContent = this.maxHints - this.hintsUsed; // Kalan İpucu
            statCards[3].textContent = this.bestScore || '-'; // En İyi
            statCards[4].textContent = this.getElapsedTime(); // Süre
        }

        // Tahmin geçmişini güncelle
        const guessHistoryList = this.container.querySelector('#guessHistoryList');
        if (guessHistoryList) {
            guessHistoryList.innerHTML = this.guessHistory.length === 0 ? 
                '<div style="text-align: center; color: #bdc3c7; font-style: italic;">Henüz tahmin yapmadınız</div>' : 
                this.guessHistory.map((guess, index) => `
                    <div class="guess-item">
                        <span class="guess-number">${guess.number}</span>
                        <span class="guess-hint">${guess.hint}</span>
                    </div>
                `).join('');
        }

        // Butonları güncelle
        this.updateHintButton();
        
        // Oyun bittiğinde input'u devre dışı bırak
        const guessInput = this.container.querySelector('#guessInput');
        const submitBtn = this.container.querySelector('#submitGuess');
        if (guessInput && submitBtn) {
            guessInput.disabled = !this.gameActive;
            submitBtn.disabled = !this.gameActive;
        }

        // Sohbet güncelle
        this.updateChatDisplay();
    }

    resetGame() {
        this.secretNumber = this.generateRandomNumber();
        this.guessCount = 0;
        this.gameActive = true;
        this.guessHistory = [];
        this.startTime = Date.now();
        this.hintsUsed = 0;
        this.usedHintTypes.clear();
        
        // Çok oyunculu modda oyuncu sayaçlarını sıfırla
        if (this.gameMode === 'multiplayer' && this.players.length > 0) {
            this.players.forEach(player => player.guesses = 0);
            this.currentPlayerIndex = 0;
        }
        
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
        
        if (this.gameMode === 'multiplayer') {
            this.addChatMessage('Sistem', `🎮 Yeni oyun başladı! ${this.minNumber}-${this.maxNumber} arası yeni bir sayı tuttum. ${this.maxHints} ipucu hakkınız var! 🏠 Oda: ${this.roomCode}`);
        } else {
            this.addChatMessage('Sistem', `🎮 Yeni oyun başladı! ${this.minNumber}-${this.maxNumber} arası yeni bir sayı tuttum. ${this.maxHints} ipucu hakkınız var!`);
        }
        this.render();
    }

    updateBestScore() {
        if (!this.bestScore || this.guessCount < this.bestScore) {
            this.bestScore = this.guessCount;
            localStorage.setItem('numberGuessingBestScore', this.bestScore.toString());
        }
    }

    loadBestScore() {
        const saved = localStorage.getItem('numberGuessingBestScore');
        return saved ? parseInt(saved) : null;
    }

    getElapsedTime() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateTimeDisplay() {
        const timeElement = this.container.querySelector('.stat-card:last-child .stat-value');
        if (timeElement) {
            timeElement.textContent = this.getElapsedTime();
        }
    }

    focusGuessInput() {
        setTimeout(() => {
            const guessInput = this.container.querySelector('#guessInput');
            if (guessInput && this.gameActive) {
                guessInput.focus();
            }
        }, 100);
    }

    sendMessage() {
        const chatInput = this.container.querySelector('#chatInput');
        const sendBtn = this.container.querySelector('#sendMessage');
        const message = chatInput.value.trim();
        
        if (message) {
            // Gönderme animasyonu
            sendBtn.classList.add('sending');
            sendBtn.disabled = true;
            
            setTimeout(() => {
                this.addChatMessage(this.playerName, message);
                chatInput.value = '';
                
                sendBtn.classList.remove('sending');
                sendBtn.disabled = false;
                chatInput.focus();
            }, 300);
        }
    }

    addChatMessage(sender, text) {
        this.chatMessages.push({ 
            sender, 
            text, 
            timestamp: Date.now() 
        });
        
        // Maksimum 50 mesaj tut
        if (this.chatMessages.length > 50) {
            this.chatMessages = this.chatMessages.slice(-50);
        }
        
        this.updateChatDisplay();
    }

    updateChatDisplay() {
        const chatContainer = this.container.querySelector('#chatMessages');
        if (!chatContainer) return;
        
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
        const typingIndicatorHTML = typingIndicator ? typingIndicator.outerHTML : `
            <div class="typing-indicator" id="typingIndicator">
                <div class="typing-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        chatContainer.innerHTML = messagesHTML + typingIndicatorHTML;
        
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
            border: 1px solid rgba(52,152,219,0.2);
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
                emojiBtn.style.background = 'rgba(52,152,219,0.1)';
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

    toggleGameMode() {
        if (this.gameMode === 'single') {
            this.showMultiplayerModal();
        } else {
            this.gameMode = 'single';
            this.roomCode = null;
            this.players = [];
            this.currentPlayerIndex = 0;
            this.resetGame();
            this.addChatMessage('Sistem', '👤 Tek oyunculu moda geçildi');
        }
    }

    showMultiplayerModal() {
        const modalHTML = `
            <div class="modal-overlay" id="multiplayerModal" onclick="if(event.target === this) this.remove()">
                <div class="modal">
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    <h3>👥 Çok Oyunculu Mod</h3>
                    <p>Arkadaşlarınızla sayı bulmacası oynayın!</p>
                    <div class="modal-buttons">
                        <button class="modal-btn primary" onclick="window.currentGame.showJoinRoom()">🚪 Odaya Katıl</button>
                        <button class="modal-btn secondary" onclick="window.currentGame.showCreateRoom()">🏠 Oda Oluştur</button>
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
            <h3>🚪 Odaya Katıl</h3>
            <p>6 haneli oda kodunu girin:</p>
            <input type="text" class="modal-input" id="roomCodeInput" placeholder="ABC123" maxlength="6" style="text-transform: uppercase;">
            <div class="modal-buttons">
                <button class="modal-btn primary" onclick="window.currentGame.joinRoom()">✅ Katıl</button>
                <button class="modal-btn secondary" onclick="window.currentGame.goBackToMainModal()">↩️ Geri</button>
            </div>
        `;
        
        // Input'a otomatik focus ve Enter tuşu desteği
        setTimeout(() => {
            const input = document.querySelector('#roomCodeInput');
            if (input) {
                input.focus();
                input.addEventListener('input', (e) => {
                    e.target.value = e.target.value.toUpperCase();
                });
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
            <h3>🏠 Oda Oluşturuldu</h3>
            <p>Oda kodunuzu arkadaşlarınızla paylaşın:</p>
            <div class="room-code" onclick="navigator.clipboard.writeText('${roomCode}'); this.style.background='#2ecc71'; this.innerHTML='📋 Kopyalandı!'; setTimeout(() => {this.style.background='#f8f9fa'; this.innerHTML='${roomCode}';}, 1000)">${roomCode}</div>
            <small style="color: #7f8c8d; text-align: center; display: block; margin: 10px 0;">💡 Kod'a tıklayarak kopyalayabilirsiniz</small>
            <div class="modal-buttons">
                <button class="modal-btn primary" onclick="window.currentGame.startMultiplayerGame('${roomCode}', true)">🎮 Oyunu Başlat</button>
                <button class="modal-btn secondary" onclick="window.currentGame.goBackToMainModal()">↩️ Geri</button>
            </div>
        `;
    }

    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    joinRoom() {
        const roomCode = document.querySelector('#roomCodeInput').value.trim().toUpperCase();
        if (roomCode.length === 6) {
            this.startMultiplayerGame(roomCode, false);
        } else {
            alert('⚠️ Lütfen 6 haneli geçerli bir oda kodu girin!');
        }
    }

    startMultiplayerGame(roomCode, isHost = false) {
        this.gameMode = 'multiplayer';
        this.roomCode = roomCode;
        
        // Oyuncu listesini başlat
        this.players = [
            { name: 'Oyuncu 1', guesses: 0, isHost: isHost },
            { name: 'Oyuncu 2', guesses: 0, isHost: false }
        ];
        this.currentPlayerIndex = 0;
        
        document.querySelector('#multiplayerModal').remove();
        this.resetGame();
        
        this.addChatMessage('Sistem', `🏠 Oda ${roomCode} - Çok oyunculu mod aktif!`);
        if (isHost) {
            this.addChatMessage('Sistem', '👑 Siz oda sahibisiniz');
        } else {
            this.addChatMessage('Sistem', '👥 Odaya katıldınız');
        }
        this.addChatMessage('Sistem', '🎯 Her oyuncu sırayla tahmin yapacak');
    }

    goBackToMainModal() {
        const modal = document.querySelector('#multiplayerModal .modal');
        modal.innerHTML = `
            <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            <h3>👥 Çok Oyunculu Mod</h3>
            <p>Arkadaşlarınızla sayı bulmacası oynayın!</p>
            <div class="modal-buttons">
                <button class="modal-btn primary" onclick="window.currentGame.showJoinRoom()">🚪 Odaya Katıl</button>
                <button class="modal-btn secondary" onclick="window.currentGame.showCreateRoom()">🏠 Oda Oluştur</button>
            </div>
        `;
    }

    nextPlayer() {
        if (this.gameMode === 'multiplayer' && this.players.length > 0) {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            this.updateGameUI();
            
            // Sıra değiştiğini bildir
            const currentPlayer = this.players[this.currentPlayerIndex];
            this.addChatMessage('Sistem', `🔄 Sıra ${currentPlayer.name}'de`);
        }
    }

    destroy() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
    }
}

// Global export for use in other files
window.NumberGuessingGame = NumberGuessingGame; 