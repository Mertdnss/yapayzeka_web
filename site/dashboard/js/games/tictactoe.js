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
        style.textContent = `.tictactoe-container{max-width:100%;margin:0 auto;padding:20px;background:rgba(255,255,255,0.95);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.1);backdrop-filter:blur(20px);display:flex;gap:20px;flex-wrap:wrap;position:relative;z-index:1}.game-side{flex:1;min-width:300px}.chat-side{flex:1;min-width:300px;display:flex;flex-direction:column}.tictactoe-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid rgba(108,99,255,0.1)}.tictactoe-header h3{font-size:24px;font-weight:700;color:#1a1a1a;margin:0}.tictactoe-board{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;background:rgba(108,99,255,0.1);padding:10px;border-radius:12px;position:relative}.tictactoe-cell{aspect-ratio:1;background:white;border:none;border-radius:8px;font-size:40px;font-weight:bold;color:#6C63FF;cursor:pointer;transition:all 0.3s ease;display:flex;align-items:center;justify-content:center;position:relative}.tictactoe-cell:hover{background:rgba(108,99,255,0.1)}.tictactoe-cell.X{color:#6C63FF}.tictactoe-cell.O{color:#FF6B6B}.tictactoe-cell.winner{background:linear-gradient(45deg,#FFD700,#FFA500);color:white;animation:winnerPulse 1s ease-in-out infinite alternate}.tictactoe-cell.winner::after{content:'';position:absolute;top:50%;left:50%;width:80%;height:4px;background:linear-gradient(90deg,transparent,#fff,transparent);transform:translate(-50%,-50%);animation:winnerLine 2s ease-in-out infinite}@keyframes winnerPulse{0%{box-shadow:0 0 0 0 rgba(255,215,0,0.7)}100%{box-shadow:0 0 20px 10px rgba(255,215,0,0)}}@keyframes winnerLine{0%,100%{opacity:0;transform:translate(-50%,-50%) scaleX(0)}50%{opacity:1;transform:translate(-50%,-50%) scaleX(1)}}.winning-line{position:absolute;background:linear-gradient(90deg,#FFD700,#FFA500);border-radius:2px;z-index:10;animation:drawLine 1s ease-in-out forwards}.winning-line.horizontal{height:4px;width:0;top:50%;left:0;transform:translateY(-50%)}.winning-line.vertical{width:4px;height:0;left:50%;top:0;transform:translateX(-50%)}.winning-line.diagonal{width:4px;height:0;transform-origin:center}.winning-line.diagonal-1{top:0;left:50%;transform:translateX(-50%) rotate(45deg)}.winning-line.diagonal-2{top:0;left:50%;transform:translateX(-50%) rotate(-45deg)}@keyframes drawLine{to{width:100%;height:100%}}.tictactoe-controls{display:flex;gap:10px;margin-bottom:20px}.tictactoe-btn{padding:10px 20px;border:none;border-radius:8px;font-weight:600;cursor:pointer;transition:all 0.2s ease;font-size:14px;background:linear-gradient(135deg,#6C63FF,#3F8EFC);color:white}.tictactoe-btn:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(108,99,255,0.4)}.game-status{font-size:18px;font-weight:600;color:#1a1a1a;margin-bottom:20px;text-align:center}.chat-messages{flex:1;background:white;border-radius:12px;padding:15px;margin-bottom:15px;overflow-y:auto;max-height:300px}.chat-message{margin-bottom:10px;padding:8px 12px;border-radius:8px;background:rgba(108,99,255,0.1)}.chat-message .sender{font-weight:600;color:#6C63FF;margin-bottom:4px}.chat-message .text{color:#1a1a1a}.chat-input{display:flex;gap:10px}.chat-input input{flex:1;padding:10px;border:1px solid rgba(108,99,255,0.2);border-radius:8px;font-size:14px}.chat-input button{padding:10px 20px;border:none;border-radius:8px;background:#6C63FF;color:white;cursor:pointer;transition:all 0.2s ease}.chat-input button:hover{background:#5a52cc}@media (max-width:768px){.tictactoe-container{padding:15px}.tictactoe-cell{font-size:32px}.game-side,.chat-side{min-width:100%}}
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
                    <div class="tictactoe-header">
                        <h3>Sohbet</h3>
                    </div>
                    <div class="chat-messages" id="chatMessages">
                        ${this.chatMessages.map(msg => `
                            <div class="chat-message">
                                <div class="sender">${msg.sender}</div>
                                <div class="text">${msg.text}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="chat-input">
                        <input type="text" id="chatInput" placeholder="Mesajınızı yazın...">
                        <button id="sendMessage">Gönder</button>
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
        const message = input.value.trim();

        if (message) {
            this.chatMessages.push({
                sender: this.playerName,
                text: message
            });
            input.value = '';
            this.render();

            const chatMessages = this.container.querySelector('#chatMessages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
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