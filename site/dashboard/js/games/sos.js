class SOSGame {
    constructor(container) {
        this.container = container;
        this.boardSize = 5; // 5x5 grid
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(''));
        this.boardPlayers = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0)); // Track which player placed each letter
        this.currentPlayer = 1; // 1 or 2
        this.gameMode = 'ai'; // 'ai' or 'multiplayer'
        this.gameActive = true;
        this.scores = { player1: 0, player2: 0 };
        this.playerNames = { player1: 'Oyuncu 1', player2: 'AI' };
        this.chatMessages = [
            {
                sender: 'Sistem',
                text: 'SOS oyununa hoş geldiniz! 🎯',
                timestamp: Date.now()
            }
        ];
        this.roomCode = null;
        this.selectedLetter = 'S'; // Current letter to place
        this.sosSequences = []; // Found SOS sequences
        
        this.init();
    }

    init() {
        this.addStyles();
        this.render();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `.sos-container{display:flex;gap:30px;max-width:1200px;margin:0 auto;padding:20px;background:white;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);position:relative;z-index:1}.game-side{flex:2;min-width:400px}.chat-side{flex:1;min-width:300px;display:flex;flex-direction:column;background:#f8f9fa;border-radius:12px;padding:20px}.sos-header{text-align:center;margin-bottom:20px}.sos-header h3{color:#333;margin:0;font-size:24px}.sos-controls{display:flex;gap:10px;justify-content:center;margin-bottom:20px;flex-wrap:wrap}.sos-btn{padding:10px 20px;border:none;border-radius:8px;background:#6c5ce7;color:white;font-weight:600;cursor:pointer;transition:all 0.2s ease}.sos-btn:hover{background:#5a52cc;transform:translateY(-1px)}.letter-selector{display:flex;gap:10px;justify-content:center;margin-bottom:20px}.letter-btn{width:50px;height:50px;border:2px solid #6c5ce7;border-radius:8px;background:white;color:#6c5ce7;font-size:20px;font-weight:bold;cursor:pointer;transition:all 0.2s ease}.letter-btn.active{background:#6c5ce7;color:white}.letter-btn:hover{transform:scale(1.05)}.game-status{text-align:center;margin-bottom:20px;padding:15px;background:#f8f9fa;border-radius:8px;font-weight:600;color:#333}.score-board{display:flex;justify-content:space-between;margin-bottom:20px;padding:15px;background:#e9ecef;border-radius:8px}.score-item{text-align:center}.score-label{font-size:14px;color:#666;margin-bottom:5px}.score-value{font-size:24px;font-weight:bold;color:#6c5ce7}.sos-board{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;background:#333;border-radius:8px;padding:10px;margin:0 auto;max-width:350px;position:relative}.sos-cell{aspect-ratio:1;background:white;border:none;border-radius:4px;font-size:24px;font-weight:bold;cursor:pointer;transition:all 0.2s ease;display:flex;align-items:center;justify-content:center;min-height:60px}.sos-cell:hover{background:#f0f0f0;transform:scale(1.05)}.sos-cell.player1{color:#6c5ce7}.sos-cell.player2{color:#e74c3c}.sos-cell.highlighted{background:#fff3cd;animation:highlight 0.5s ease}.sos-line{position:absolute;height:4px;background:#ff6b6b;border-radius:2px;z-index:10;pointer-events:none;transition:width 0.3s ease;box-shadow:0 0 8px rgba(255,107,107,0.5)}@keyframes highlight{0%{background:#fff3cd}
50%{background:#ffc107}100%{background:#fff3cd}}.chat-messages{flex:1;overflow-y:auto;margin-bottom:15px;max-height:300px;border:1px solid #e9ecef;border-radius:8px;padding:15px;background:white}.chat-message{margin-bottom:12px;padding:8px 12px;border-radius:8px;background:#f8f9fa}.chat-message .sender{font-weight:600;color:#6c5ce7;font-size:12px;margin-bottom:4px}.chat-message .text{color:#333;line-height:1.4}.chat-input{display:flex;gap:8px;align-items:center}.chat-input input{flex:1;padding:10px 14px;border:2px solid #e9ecef;border-radius:20px;font-size:14px;min-width:0}.chat-input input:focus{outline:none;border-color:#6c5ce7}.chat-input button{padding:8px 14px;border:none;border-radius:18px;background:#6c5ce7;color:white;font-weight:600;cursor:pointer;transition:all 0.2s ease;font-size:13px;white-space:nowrap;flex-shrink:0}.chat-input button:hover{background:#5a52cc}@media (max-width:768px){.sos-container{flex-direction:column;padding:15px}.game-side,.chat-side{min-width:100%}.sos-board{max-width:300px}.sos-cell{font-size:20px;min-height:50px}}.modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);backdrop-filter:blur(3px);display:flex;justify-content:center;align-items:center;z-index:9999}.modal{background:white;border-radius:12px;padding:30px;max-width:400px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.4);animation:modalSlideIn 0.3s ease;position:relative;z-index:10000;pointer-events:auto}@keyframes modalSlideIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}.modal h3{margin:0 0 20px 0;color:#333;text-align:center;font-size:24px}.modal-buttons{display:flex;flex-direction:column;gap:15px}.modal-btn{padding:15px 20px;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.2s ease}.modal-btn.primary{background:#6c5ce7;color:white}.modal-btn.primary:hover{background:#5a52cc}.modal-btn.secondary{background:#f8f9fa;color:#333;border:2px solid #e9ecef}.modal-btn.secondary:hover{background:#e9ecef}.modal-input{width:100%;padding:12px;border:2px solid #e9ecef;border-radius:8px;font-size:16px;margin:10px 0;box-sizing:border-box}.modal-input:focus{outline:none;border-color:#6c5ce7}.room-code{background:#f8f9fa;padding:15px;border-radius:8px;text-align:center;font-size:24px;font-weight:bold;color:#6c5ce7;letter-spacing:2px;margin:15px 0;border:2px dashed #6c5ce7}.close-btn{position:absolute;top:15px;right:15px;background:none;border:none;font-size:24px;cursor:pointer;color:#999}.close-btn:hover{color:#333}
        `;
        document.head.appendChild(style);
    }

    render() {
        // İlk render ise tüm HTML'i oluştur
        if (!this.container.querySelector('.sos-container')) {
            this.container.innerHTML = `
                <div class="sos-container">
                    <div class="game-side">
                        <div class="sos-header">
                            <h3>SOS Oyunu</h3>
                        </div>
                        <div class="sos-controls">
                            <button class="sos-btn" id="newGame">Yeni Oyun</button>
                            <button class="sos-btn" id="toggleMode">
                                ${this.gameMode === 'ai' ? 'Çok Oyunculu' : 'AI ile Oyna'}
                            </button>
                        </div>
                        <div class="letter-selector">
                            <button class="letter-btn ${this.selectedLetter === 'S' ? 'active' : ''}" data-letter="S">S</button>
                            <button class="letter-btn ${this.selectedLetter === 'O' ? 'active' : ''}" data-letter="O">O</button>
                        </div>
                        <div class="score-board">
                            <div class="score-item">
                                <div class="score-label">${this.playerNames.player1}</div>
                                <div class="score-value">${this.scores.player1}</div>
                            </div>
                            <div class="score-item">
                                <div class="score-label">${this.playerNames.player2}</div>
                                <div class="score-value">${this.scores.player2}</div>
                            </div>
                        </div>
                        <div class="game-status" id="gameStatus">
                            ${this.gameMode === 'ai' ? 'AI ile oynayın' : 'Arkadaşınızla oynayın'}
                        </div>
                        <div class="sos-board" id="board">
                            ${this.board.map((row, rowIndex) => 
                                row.map((cell, colIndex) => `
                                    <button class="sos-cell ${cell ? 'player' + this.getCellPlayer(rowIndex, colIndex) : ''}" 
                                            data-row="${rowIndex}" data-col="${colIndex}">
                                        ${cell}
                                    </button>
                                `).join('')
                            ).join('')}
                        </div>
                    </div>
                    <div class="chat-side">
                        <div class="sos-header">
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
            this.setupEventListeners();
        } else {
            // Sadece değişen kısımları güncelle
            this.updateBoard();
            this.updateScores();
            this.updateLetterSelector();
            this.updateToggleButton();
            this.updateChatDisplay();
        }

        this.updateGameStatus();
    }

    updateBoard() {
        const board = this.container.querySelector('#board');
        if (board) {
            // Sadece hücreleri güncelle, çizgileri korumak için innerHTML kullanma
            const cells = board.querySelectorAll('.sos-cell');
            this.board.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    const cellIndex = rowIndex * this.boardSize + colIndex;
                    const cellElement = cells[cellIndex];
                    if (cellElement) {
                        cellElement.textContent = cell;
                        cellElement.className = `sos-cell ${cell ? 'player' + this.getCellPlayer(rowIndex, colIndex) : ''}`;
                        cellElement.dataset.row = rowIndex;
                        cellElement.dataset.col = colIndex;
                    }
                });
            });
        }
    }

    updateScores() {
        const scoreItems = this.container.querySelectorAll('.score-item');
        if (scoreItems.length >= 2) {
            scoreItems[0].innerHTML = `
                <div class="score-label">${this.playerNames.player1}</div>
                <div class="score-value">${this.scores.player1}</div>
            `;
            scoreItems[1].innerHTML = `
                <div class="score-label">${this.playerNames.player2}</div>
                <div class="score-value">${this.scores.player2}</div>
            `;
        }
    }

    updateLetterSelector() {
        const letterBtns = this.container.querySelectorAll('.letter-btn');
        letterBtns.forEach(btn => {
            if (btn.dataset.letter === this.selectedLetter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    updateToggleButton() {
        const toggleBtn = this.container.querySelector('#toggleMode');
        if (toggleBtn) {
            toggleBtn.textContent = this.gameMode === 'ai' ? 'Çok Oyunculu' : 'AI ile Oyna';
        }
    }

    setupEventListeners() {
        const board = this.container.querySelector('#board');
        const newGameBtn = this.container.querySelector('#newGame');
        const toggleModeBtn = this.container.querySelector('#toggleMode');
        const letterBtns = this.container.querySelectorAll('.letter-btn');
        const chatInput = this.container.querySelector('#chatInput');
        const sendMessageBtn = this.container.querySelector('#sendMessage');

        board.addEventListener('click', (e) => {
            const cell = e.target.closest('.sos-cell');
            if (cell && this.gameActive) {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.makeMove(row, col);
            }
        });

        letterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedLetter = btn.dataset.letter;
                this.render();
            });
        });

        newGameBtn.addEventListener('click', () => this.resetGame());
        toggleModeBtn.addEventListener('click', () => this.toggleGameMode());

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        sendMessageBtn.addEventListener('click', () => this.sendMessage());
    }

    getCellPlayer(row, col) {
        return this.boardPlayers[row][col];
    }

    makeMove(row, col) {
        // AI modunda sadece player 1 hamle yapabilir, çok oyunculu modda her iki oyuncu da yapabilir
        if (this.gameMode === 'ai' && this.currentPlayer === 2) {
            return;
        }

        if (this.board[row][col] === '' && this.gameActive) {
            this.board[row][col] = this.selectedLetter;
            this.boardPlayers[row][col] = this.currentPlayer; // Track which player placed this letter
            
            // Check for new SOS sequences
            const newSequences = this.checkForSOS(row, col);
            if (newSequences.length > 0) {
                this.scores['player' + this.currentPlayer] += newSequences.length;
                this.sosSequences.push(...newSequences);
                // Draw lines for new SOS sequences
                setTimeout(() => this.drawSOSLines(newSequences), 100);
                // Player gets another turn when forming SOS
            } else {
                // Switch player only if no SOS was formed
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            }

            this.render();

            // Check if board is full
            if (this.isBoardFull()) {
                this.gameActive = false;
                this.announceWinner();
                return;
            }

            this.updateGameStatus();

            // AI modunda AI'nın sırası geldiğinde otomatik hamle yap
            if (this.gameMode === 'ai' && this.currentPlayer === 2 && this.gameActive) {
                setTimeout(() => this.makeAIMove(), 500);
            }
        }
    }

    makeAIMove() {
        if (!this.gameActive || this.currentPlayer !== 2) return;

        // Simple AI: Try to complete SOS or block opponent
        const bestMove = this.findBestMove();
        
        if (bestMove) {
            const { row, col, letter } = bestMove;
            this.board[row][col] = letter;
            this.boardPlayers[row][col] = this.currentPlayer; // Track which player placed this letter
            
            const newSequences = this.checkForSOS(row, col);
            if (newSequences.length > 0) {
                this.scores.player2 += newSequences.length;
                this.sosSequences.push(...newSequences);
                // Draw lines for new SOS sequences
                setTimeout(() => this.drawSOSLines(newSequences), 100);
                // AI gets another turn when forming SOS - don't change currentPlayer
            } else {
                this.currentPlayer = 1;
            }

            this.render();

            if (this.isBoardFull()) {
                this.gameActive = false;
                this.announceWinner();
                return;
            }

            this.updateGameStatus();

            // If AI formed SOS and game is still active, make another move
            if (newSequences.length > 0 && this.gameActive && this.currentPlayer === 2) {
                setTimeout(() => this.makeAIMove(), 500);
            }
        }
    }

    findBestMove() {
        const emptyCells = [];
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === '') {
                    emptyCells.push({ row, col });
                }
            }
        }

        if (emptyCells.length === 0) return null;

        // Try to complete SOS
        for (const cell of emptyCells) {
            for (const letter of ['S', 'O']) {
                this.board[cell.row][cell.col] = letter;
                const sequences = this.checkForSOS(cell.row, cell.col);
                this.board[cell.row][cell.col] = ''; // Reset
                
                if (sequences.length > 0) {
                    return { ...cell, letter };
                }
            }
        }

        // Random move
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const randomLetter = Math.random() < 0.5 ? 'S' : 'O';
        return { ...randomCell, letter: randomLetter };
    }

    checkForSOS(row, col) {
        const sequences = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dx, dy] of directions) {
            // Check if current cell is middle of SOS
            if (this.board[row][col] === 'O') {
                const prevRow = row - dx;
                const prevCol = col - dy;
                const nextRow = row + dx;
                const nextCol = col + dy;

                if (this.isValidCell(prevRow, prevCol) && this.isValidCell(nextRow, nextCol)) {
                    if (this.board[prevRow][prevCol] === 'S' && this.board[nextRow][nextCol] === 'S') {
                        sequences.push([[prevRow, prevCol], [row, col], [nextRow, nextCol]]);
                    }
                }
            }

            // Check if current cell is start of SOS
            if (this.board[row][col] === 'S') {
                const midRow = row + dx;
                const midCol = col + dy;
                const endRow = row + 2 * dx;
                const endCol = col + 2 * dy;

                if (this.isValidCell(midRow, midCol) && this.isValidCell(endRow, endCol)) {
                    if (this.board[midRow][midCol] === 'O' && this.board[endRow][endCol] === 'S') {
                        sequences.push([[row, col], [midRow, midCol], [endRow, endCol]]);
                    }
                }
            }
        }

        return sequences;
    }

    isValidCell(row, col) {
        return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
    }

    isBoardFull() {
        return this.board.every(row => row.every(cell => cell !== ''));
    }

    announceWinner() {
        let winner;
        if (this.scores.player1 > this.scores.player2) {
            winner = this.playerNames.player1;
        } else if (this.scores.player2 > this.scores.player1) {
            winner = this.playerNames.player2;
        } else {
            winner = 'Berabere';
        }

        this.updateGameStatus(winner === 'Berabere' ? 'Oyun berabere bitti!' : `${winner} kazandı!`);
    }

    updateGameStatus(message) {
        const statusElement = this.container.querySelector('#gameStatus');
        if (message) {
            statusElement.textContent = message;
        } else {
            const currentPlayerName = this.currentPlayer === 1 ? this.playerNames.player1 : this.playerNames.player2;
            statusElement.textContent = `Sıradaki: ${currentPlayerName} (${this.selectedLetter})`;
        }
    }

    resetGame() {
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(''));
        this.boardPlayers = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.currentPlayer = 1;
        this.gameActive = true;
        this.scores = { player1: 0, player2: 0 };
        this.sosSequences = [];
        this.selectedLetter = 'S';
        this.chatMessages = [
            {
                sender: 'Sistem',
                text: 'Yeni oyun başladı! İyi şanslar! 🎮',
                timestamp: Date.now()
            }
        ];
        this.clearSOSLines();
        this.render();
    }

    drawSOSLines(sequences) {
        const board = this.container.querySelector('#board');
        
        sequences.forEach((sequence, index) => {
            const [start, middle, end] = sequence;
            const startCell = board.children[start[0] * this.boardSize + start[1]];
            const endCell = board.children[end[0] * this.boardSize + end[1]];
            
            const line = document.createElement('div');
            line.className = 'sos-line';
            line.dataset.sequenceId = this.sosSequences.length - sequences.length + index;
            
            // Calculate line position and rotation
            const startRect = startCell.getBoundingClientRect();
            const endRect = endCell.getBoundingClientRect();
            const boardRect = board.getBoundingClientRect();
            
            const startX = startRect.left + startRect.width / 2 - boardRect.left;
            const startY = startRect.top + startRect.height / 2 - boardRect.top;
            const endX = endRect.left + endRect.width / 2 - boardRect.left;
            const endY = endRect.top + endRect.height / 2 - boardRect.top;
            
            const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
            const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
            
            line.style.left = startX + 'px';
             line.style.top = startY + 'px';
             line.style.width = '0px';
             line.style.transform = `rotate(${angle}deg)`;
             line.style.transformOrigin = '0 50%';
             
             board.appendChild(line);
             
             // Animate line drawing
             setTimeout(() => {
                 line.style.width = length + 'px';
             }, 50);
        });
    }
    
    clearSOSLines() {
        const lines = this.container.querySelectorAll('.sos-line');
        lines.forEach(line => line.remove());
    }

    toggleGameMode() {
        if (this.gameMode === 'ai') {
            this.showMultiplayerModal();
        } else {
            this.gameMode = 'ai';
            this.playerNames.player2 = 'AI';
            this.resetGame();
        }
    }

    showMultiplayerModal() {
        const modalHTML = `
            <div class="modal-overlay" id="multiplayerModal" onclick="if(event.target === this) this.remove()">
                <div class="modal">
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    <h3>Çok Oyunculu Mod</h3>
                    <div class="modal-buttons">
                        <button class="modal-btn primary" onclick="window.currentSOSGame.showJoinRoom()">Odaya Katıl</button>
                        <button class="modal-btn secondary" onclick="window.currentSOSGame.showCreateRoom()">Oda Aç</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        window.currentSOSGame = this;
        
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
                <button class="modal-btn primary" onclick="window.currentSOSGame.joinRoom()">Katıl</button>
                <button class="modal-btn secondary" onclick="window.currentSOSGame.goBackToMainModal()">Geri</button>
            </div>
        `;
        
        // Input'a otomatik focus ve Enter tuşu desteği
        setTimeout(() => {
            const input = document.querySelector('#roomCodeInput');
            if (input) {
                input.focus();
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        window.currentSOSGame.joinRoom();
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
                <button class="modal-btn primary" onclick="window.currentSOSGame.startMultiplayerGame('${roomCode}')">Oyunu Başlat</button>
                <button class="modal-btn secondary" onclick="window.currentSOSGame.goBackToMainModal()">Geri</button>
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
        this.playerNames.player2 = 'Oyuncu 2';
        document.querySelector('#multiplayerModal').remove();
        this.resetGame();
        
        // Burada gerçek multiplayer bağlantısı kurulabilir
        this.chatMessages.push({
            sender: 'Sistem',
            text: `Oda ${roomCode} - Çok oyunculu mod aktif!`,
            timestamp: Date.now()
        });
        this.updateChatDisplay();
    }

    goBackToMainModal() {
        const modal = document.querySelector('#multiplayerModal .modal');
        modal.innerHTML = `
            <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            <h3>Çok Oyunculu Mod</h3>
            <div class="modal-buttons">
                <button class="modal-btn primary" onclick="window.currentSOSGame.showJoinRoom()">Odaya Katıl</button>
                <button class="modal-btn secondary" onclick="window.currentSOSGame.showCreateRoom()">Oda Aç</button>
            </div>
        `;
    }

    sendMessage() {
        const input = this.container.querySelector('#chatInput');
        const message = input.value.trim();

        if (message) {
            // Player name'i doğru şekilde al
            const currentPlayerName = document.querySelector('.user-name')?.textContent || 'Oyuncu';
            
            this.chatMessages.push({
                sender: currentPlayerName,
                text: message,
                timestamp: Date.now()
            });
            input.value = '';
            this.updateChatDisplay();
        }
    }

    updateChatDisplay() {
        const chatContainer = this.container.querySelector('#chatMessages');
        if (chatContainer && this.chatMessages.length > 0) {
            chatContainer.innerHTML = this.chatMessages.map(msg => `
                <div class="chat-message">
                    <div class="sender">${msg.sender}</div>
                    <div class="text">${msg.text}</div>
                </div>
            `).join('');
            
            // En alta scroll
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }
}

// Export the game module
window.SOSGame = SOSGame;