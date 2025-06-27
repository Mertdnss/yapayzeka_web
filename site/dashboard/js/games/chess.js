// Chess Game Module
class ChessGame {
    constructor(container) {
        this.container = container;
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.moveHistory = [];
        this.capturedPieces = {white: [], black: []};
        this.gameMode = 'ai'; // 'ai', 'multiplayer', or 'room'
        this.difficulty = 'medium';
        this.roomCode = null;
        this.isRoomHost = false;
        this.waitingForPlayer = false;
        this.playerColor = 'white'; // Oda modunda oyuncunun rengi
        this.init();
    }

    init() {
        this.injectStyles();
        this.render();
        this.attachEventListeners();
    }

    injectStyles() {
        // Check if styles are already injected
        if (document.getElementById('chess-game-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'chess-game-styles';
        style.textContent = `
.chess-game-container{max-width:100%;margin:0 auto;padding:20px;background:rgba(255,255,255,0.95);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.1);backdrop-filter:blur(20px)}
.chess-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid rgba(108,99,255,0.1)}
.chess-header h3{font-size:24px;font-weight:700;color:#1a1a1a;margin:0}
.game-status{display:flex;flex-direction:column;align-items:flex-end;gap:5px}
.current-player{font-weight:600;color:#6C63FF;font-size:16px}
.game-mode{font-size:14px;color:#666;background:rgba(108,99,255,0.1);padding:4px 8px;border-radius:6px}
.chess-board-container{display:flex;justify-content:center;margin-bottom:20px}
.chess-board{display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);width:400px;height:400px;border:3px solid #6C63FF;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(108,99,255,0.3)}
.chess-square{display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s ease;position:relative;user-select:none}
.chess-square.light{background-color:#f0d9b5}
.chess-square.dark{background-color:#b58863}
.chess-square:hover{background-color:rgba(108,99,255,0.2)!important;transform:scale(1.05)}
.chess-square.selected{background-color:rgba(255,215,0,0.6)!important;box-shadow:inset 0 0 0 3px #FFD700}
.chess-square.possible-move{background-color:rgba(0,255,0,0.3)!important}
.chess-square.possible-move::after{content:'';position:absolute;width:12px;height:12px;background-color:rgba(0,255,0,0.8);border-radius:50%}
.chess-square.capture-move{background-color:rgba(255,0,0,0.3)!important}
.chess-square.capture-move::after{content:'';position:absolute;width:100%;height:100%;border:3px solid rgba(255,0,0,0.8);border-radius:4px;box-sizing:border-box}
.chess-piece{font-size:32px;line-height:1;text-shadow:2px 2px 4px rgba(0,0,0,0.5);z-index:1;pointer-events:none;filter:contrast(1.2)}.chess-piece.white{color:#fff;text-shadow:2px 2px 4px rgba(0,0,0,0.8),0 0 8px rgba(0,0,0,0.6)}
        .chess-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:none;justify-content:center;align-items:center;z-index:1000}
        .chess-modal.show{display:flex}
        .chess-modal-content{background:#fff;padding:30px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.3);max-width:400px;width:90%;text-align:center;transform:scale(0.9);transition:transform 0.3s ease}
        .chess-modal.show .chess-modal-content{transform:scale(1)}
        .chess-modal h3{margin:0 0 15px 0;color:#333;font-size:20px}
        .chess-modal p{margin:0 0 25px 0;color:#666;line-height:1.5}
        .chess-modal-buttons{display:flex;gap:15px;justify-content:center}
        .chess-modal-btn{padding:12px 24px;border:none;border-radius:8px;font-size:16px;cursor:pointer;transition:all 0.3s ease;min-width:100px}
        .chess-modal-btn.confirm{background:#4CAF50;color:white}
        .chess-modal-btn.confirm:hover{background:#45a049}
        .chess-modal-btn.cancel{background:#f44336;color:white}
        .chess-modal-btn.cancel:hover{background:#da190b}
        .room-code-input{width:100%;padding:12px;margin:15px 0;border:2px solid #ddd;border-radius:8px;font-size:16px;text-align:center;text-transform:uppercase;letter-spacing:2px;font-weight:bold;transition:border-color 0.3s ease}
        .room-code-input:focus{outline:none;border-color:#4a90e2;box-shadow:0 0 0 3px rgba(74,144,226,0.1)}
        .room-code-input::placeholder{text-transform:none;letter-spacing:normal;font-weight:normal;opacity:0.6}
        @media (max-width:480px){.chess-modal-content{padding:20px;max-width:320px}.chess-modal h3{font-size:18px}.chess-modal-btn{padding:10px 20px;font-size:14px;min-width:80px}}
        .room-info{display:flex;flex-direction:column;gap:8px;padding:12px;background:rgba(74,144,226,0.1);border-radius:8px;border-left:4px solid #4a90e2}
        .room-code{font-size:14px;color:#333}
        .room-code strong{color:#4a90e2;font-family:monospace;font-size:16px;letter-spacing:1px}
        .room-status{font-size:13px;color:#666}
        .chess-btn.secondary{background:#6c757d;color:white}
        .chess-btn.secondary:hover{background:#5a6268}
        .waiting-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.9);display:flex;flex-direction:column;justify-content:center;align-items:center;border-radius:8px;z-index:10}
        .waiting-overlay h4{margin:0 0 10px 0;color:#4a90e2}
        .waiting-overlay p{margin:0;color:#666;text-align:center}
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}
        @media (max-width:768px){.room-info{padding:10px}.room-code strong{font-size:14px}}
.chess-piece.black{color:#2c2c2c;text-shadow:1px 1px 2px rgba(255,255,255,0.3)}
.chess-controls{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;gap:20px;flex-wrap:wrap}
.control-group{display:flex;align-items:center;gap:10px}
.chess-btn{padding:10px 20px;border:none;border-radius:8px;font-weight:600;cursor:pointer;transition:all 0.2s ease;font-size:14px}
.chess-btn.primary{background:linear-gradient(135deg,#6C63FF,#3F8EFC);color:white}
.chess-btn.primary:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(108,99,255,0.4)}
.chess-btn:not(.primary){background:rgba(108,99,255,0.1);color:#6C63FF;border:1px solid rgba(108,99,255,0.2)}
.chess-btn:not(.primary):hover{background:rgba(108,99,255,0.2);transform:translateY(-1px)}
.chess-select{padding:8px 12px;border:1px solid rgba(108,99,255,0.2);border-radius:6px;background:white;color:#1a1a1a;font-size:14px;cursor:pointer}
.chess-select:focus{outline:none;border-color:#6C63FF;box-shadow:0 0 0 2px rgba(108,99,255,0.2)}
.chess-info{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.move-history,.captured-pieces{background:rgba(108,99,255,0.05);border-radius:8px;padding:15px}
.move-history h4,.captured-pieces h4{margin:0 0 10px 0;color:#1a1a1a;font-size:16px;font-weight:600}
.moves-list{max-height:150px;overflow-y:auto;border:1px solid rgba(108,99,255,0.1);border-radius:6px;background:white;padding:8px}
.move-item{padding:4px 8px;margin-bottom:2px;border-radius:4px;font-size:14px;font-family:'Courier New',monospace}
.move-item:nth-child(odd){background:rgba(108,99,255,0.05)}
.captured-white,.captured-black{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;min-height:40px;padding:8px;border:1px solid rgba(108,99,255,0.1);border-radius:6px;background:white}
.captured-piece{font-size:20px;opacity:0.7}
@media (max-width:768px){.chess-game-container{padding:15px}.chess-header{flex-direction:column;align-items:flex-start;gap:10px}.game-status{align-items:flex-start}.chess-board{width:320px;height:320px}.chess-piece{font-size:24px}.chess-controls{flex-direction:column;align-items:stretch}.control-group{justify-content:center}.chess-info{grid-template-columns:1fr}}
@media (max-width:480px){.chess-board{width:280px;height:280px}.chess-piece{font-size:20px}.chess-header h3{font-size:20px}.chess-btn{padding:8px 16px;font-size:13px}}
@keyframes pieceMove{0%{transform:scale(1)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
.chess-piece.moving{animation:pieceMove 0.3s ease}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
.chess-board.loading{animation:pulse 1s infinite}
.game-over-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;border-radius:8px;z-index:10}
.game-over-content{background:white;padding:30px;border-radius:12px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.3)}
.game-over-content h3{margin:0 0 15px 0;color:#1a1a1a;font-size:24px}
.game-over-content p{margin:0 0 20px 0;color:#666;font-size:16px}
        `;
        document.head.appendChild(style);
    }

    initializeBoard() {
        // Standard chess starting position
        return [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
    }

    render() {
        this.container.innerHTML = `
            <div class="chess-game-container">
                <div class="chess-header">
                    <h3>♔ AI Satranç Oyunu</h3>
                    <div class="game-status">
                        <span class="current-player">Sıra: ${this.currentPlayer === 'white' ? 'Beyaz' : 'Siyah'}</span>
                        <span class="game-mode">${this.gameMode === 'ai' ? 'AI ile Oyna' : 'Çok Oyunculu'}</span>
                    </div>
                </div>
                
                <div class="chess-board-container">
                    <div class="chess-board" id="chessBoard" style="position: relative;">
                        ${this.renderBoard()}
                        ${this.waitingForPlayer ? `
                        <div class="waiting-overlay">
                            <h4>🔄 Oyuncu Bekleniyor</h4>
                            <p>Oda Kodu: <strong>${this.roomCode}</strong></p>
                            <p>Bu kodu arkadaşınızla paylaşın</p>
                        </div>` : ''}
                    </div>
                </div>
                
                <div class="chess-controls">
                    <div class="control-group">
                        <button class="chess-btn primary" id="newGame">Yeni Oyun</button>
                        <button class="chess-btn" id="toggleMode">${this.gameMode === 'ai' ? 'Çok Oyunculu Oda Kur' : 'AI ile Oyna'}</button>
                        ${this.gameMode === 'room' ? `<button class="chess-btn secondary" id="leaveRoom">Odadan Çık</button>` : `<button class="chess-btn secondary" id="joinRoomBtn">Odaya Katıl</button>`}
                    </div>
                    <div class="control-group">
                        ${this.gameMode === 'ai' ? `
                        <label for="difficulty">Zorluk:</label>
                        <select id="difficulty" class="chess-select">
                            <option value="easy" ${this.difficulty === 'easy' ? 'selected' : ''}>Kolay</option>
                            <option value="medium" ${this.difficulty === 'medium' ? 'selected' : ''}>Orta</option>
                            <option value="hard" ${this.difficulty === 'hard' ? 'selected' : ''}>Zor</option>
                        </select>` : ''}
                        ${this.gameMode === 'room' ? `
                        <div class="room-info">
                            <span class="room-code">Oda Kodu: <strong>${this.roomCode || 'Oluşturuluyor...'}</strong></span>
                            <span class="room-status">${this.waitingForPlayer ? '🔄 Oyuncu bekleniyor...' : '✅ Oyun hazır!'}</span>
                        </div>` : ''}
                    </div>
                </div>
                
                <div class="chess-info">
                    <div class="move-history">
                        <h4>Hamle Geçmişi</h4>
                        <div class="moves-list" id="movesList"></div>
                    </div>
                    <div class="captured-pieces">
                        <h4>Alınan Taşlar</h4>
                        <div class="captured-white" id="capturedWhite"></div>
                        <div class="captured-black" id="capturedBlack"></div>
                    </div>
                </div>
        </div>
        <div class="chess-modal" id="difficultyModal">
            <div class="chess-modal-content">
                <h3>🎯 Zorluk Seviyesi Değişikliği</h3>
                <p id="modalMessage"></p>
                <div class="chess-modal-buttons">
                    <button class="chess-modal-btn cancel" id="modalCancel">İptal</button>
                    <button class="chess-modal-btn confirm" id="modalConfirm">Onayla</button>
                </div>
            </div>
        </div>
        
        <!-- Odaya Katılma Modal -->
        <div id="joinRoomModal" class="chess-modal">
            <div class="chess-modal-content">
                <h3>🎮 Odaya Katıl</h3>
                <p>Katılmak istediğiniz odanın kodunu girin:</p>
                <input type="text" id="roomCodeInput" class="room-code-input" placeholder="Oda kodunu girin (örn: ABC123)" maxlength="6">
                <div class="chess-modal-buttons">
                    <button id="confirmJoinRoom" class="chess-modal-btn confirm">Katıl</button>
                    <button id="cancelJoinRoom" class="chess-modal-btn cancel">İptal</button>
                </div>
            </div>
        </div>
        `;
    }

    renderBoard() {
        let boardHTML = '';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const isLight = (row + col) % 2 === 0;
                const piece = this.board[row][col];
                const pieceSymbol = this.getPieceSymbol(piece);
                const pieceColor = piece && piece === piece.toUpperCase() ? 'white' : 'black';
                
                boardHTML += `
                    <div class="chess-square ${isLight ? 'light' : 'dark'}" 
                         data-row="${row}" data-col="${col}">
                        ${pieceSymbol ? `<span class="chess-piece ${pieceColor}">${pieceSymbol}</span>` : ''}
                    </div>
                `;
            }
        }
        return boardHTML;
    }

    getPieceSymbol(piece) {
        const pieces = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
        };
        return pieces[piece] || '';
    }

    attachEventListeners() {
        // Board click events
        const squares = this.container.querySelectorAll('.chess-square');
        squares.forEach(square => {
            square.addEventListener('click', (e) => this.handleSquareClick(e));
        });

        // Control buttons
        const newGameBtn = this.container.querySelector('#newGame');
        const toggleModeBtn = this.container.querySelector('#toggleMode');
        const difficultySelect = this.container.querySelector('#difficulty');
        const leaveRoomBtn = this.container.querySelector('#leaveRoom');

        newGameBtn.addEventListener('click', () => this.newGame());
        toggleModeBtn.addEventListener('click', () => this.toggleGameMode());
        
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                const newDifficulty = e.target.value;
                this.showDifficultyModal(newDifficulty, e.target);
            });
        }
        
        if (leaveRoomBtn) {
            leaveRoomBtn.addEventListener('click', () => this.leaveRoom());
        }
        
        const joinRoomBtn = this.container.querySelector('#joinRoomBtn');
        if (joinRoomBtn) {
            joinRoomBtn.addEventListener('click', () => this.showJoinRoomModal());
        }
        
        const confirmJoinRoom = this.container.querySelector('#confirmJoinRoom');
        if (confirmJoinRoom) {
            confirmJoinRoom.addEventListener('click', () => this.joinRoom());
        }
        
        const cancelJoinRoom = this.container.querySelector('#cancelJoinRoom');
        if (cancelJoinRoom) {
            cancelJoinRoom.addEventListener('click', () => this.hideJoinRoomModal());
        }
        
        const roomCodeInput = this.container.querySelector('#roomCodeInput');
        if (roomCodeInput) {
            roomCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.joinRoom();
                }
            });
            
            // Auto-uppercase and limit to alphanumeric
             roomCodeInput.addEventListener('input', (e) => {
                 e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
             });
         }
         
         // Close modals when clicking outside
         const joinRoomModal = this.container.querySelector('#joinRoomModal');
         if (joinRoomModal) {
             joinRoomModal.addEventListener('click', (e) => {
                 if (e.target === joinRoomModal) {
                     this.hideJoinRoomModal();
                 }
             });
         }
    }

    handleSquareClick(e) {
        // Oda modunda oyuncu bekleniyorsa hamle yapılamaz
        if (this.gameMode === 'room' && this.waitingForPlayer) {
            return;
        }
        
        const square = e.currentTarget;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (this.selectedSquare) {
            // Try to move piece
            const fromPiece = this.board[this.selectedSquare.row][this.selectedSquare.col];
            if (fromPiece && this.isPieceOwnedByCurrentPlayer(fromPiece)) {
                this.makeMove(this.selectedSquare, {row, col});
            }
            this.clearSelection();
        } else {
            // Select piece
            const piece = this.board[row][col];
            if (piece && this.isPieceOwnedByCurrentPlayer(piece)) {
                this.selectSquare(square, row, col);
            }
        }
    }

    selectSquare(square, row, col) {
        this.clearSelection();
        this.selectedSquare = {row, col};
        square.classList.add('selected');
        this.highlightPossibleMoves(row, col);
    }

    clearSelection() {
        const squares = this.container.querySelectorAll('.chess-square');
        squares.forEach(square => {
            square.classList.remove('selected', 'possible-move', 'capture-move');
        });
        this.selectedSquare = null;
    }

    highlightPossibleMoves(row, col) {
        // Simplified move highlighting - in a real game, this would be more complex
        const piece = this.board[row][col];
        const moves = this.getPossibleMoves(piece, row, col);
        
        moves.forEach(move => {
            const square = this.container.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
            if (square) {
                if (this.board[move.row][move.col]) {
                    square.classList.add('capture-move');
                } else {
                    square.classList.add('possible-move');
                }
            }
        });
    }

    getPossibleMoves(piece, row, col) {
        // Simplified move generation - in a real chess game, this would be much more complex
        const moves = [];
        
        // Special handling for pawns
        if (piece === 'P') { // White pawn
            // Move forward (up the board, row decreases)
            if (row > 0 && !this.board[row - 1][col]) {
                moves.push({row: row - 1, col: col});
                // Double move from starting position
                if (row === 6 && !this.board[row - 2][col]) {
                    moves.push({row: row - 2, col: col});
                }
            }
            // Capture diagonally
            if (row > 0 && col > 0 && this.board[row - 1][col - 1] && this.board[row - 1][col - 1] === this.board[row - 1][col - 1].toLowerCase()) {
                moves.push({row: row - 1, col: col - 1});
            }
            if (row > 0 && col < 7 && this.board[row - 1][col + 1] && this.board[row - 1][col + 1] === this.board[row - 1][col + 1].toLowerCase()) {
                moves.push({row: row - 1, col: col + 1});
            }
        } else if (piece === 'p') { // Black pawn
            // Move forward (down the board, row increases)
            if (row < 7 && !this.board[row + 1][col]) {
                moves.push({row: row + 1, col: col});
                // Double move from starting position
                if (row === 1 && !this.board[row + 2][col]) {
                    moves.push({row: row + 2, col: col});
                }
            }
            // Capture diagonally
            if (row < 7 && col > 0 && this.board[row + 1][col - 1] && this.board[row + 1][col - 1] === this.board[row + 1][col - 1].toUpperCase()) {
                moves.push({row: row + 1, col: col - 1});
            }
            if (row < 7 && col < 7 && this.board[row + 1][col + 1] && this.board[row + 1][col + 1] === this.board[row + 1][col + 1].toUpperCase()) {
                moves.push({row: row + 1, col: col + 1});
            }
        } else {
            // Other pieces
            const directions = {
                'R': [[0, 1], [0, -1], [1, 0], [-1, 0]], // Rook
                'r': [[0, 1], [0, -1], [1, 0], [-1, 0]],
                'N': [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]], // Knight
                'n': [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]],
                'B': [[1, 1], [1, -1], [-1, 1], [-1, -1]], // Bishop
                'b': [[1, 1], [1, -1], [-1, 1], [-1, -1]],
                'Q': [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]], // Queen
                'q': [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
                'K': [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]], // King
                'k': [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]
            };

            const pieceDirections = directions[piece] || [];
            
            pieceDirections.forEach(([dRow, dCol]) => {
                const newRow = row + dRow;
                const newCol = col + dCol;
                
                if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                    const targetPiece = this.board[newRow][newCol];
                    if (!targetPiece || !this.isPieceOwnedByCurrentPlayer(targetPiece)) {
                        moves.push({row: newRow, col: newCol});
                    }
                }
            });
        }

        return moves;
    }

    makeMove(from, to) {
        const piece = this.board[from.row][from.col];
        const capturedPiece = this.board[to.row][to.col];
        
        // Check if move is valid
        if (!piece || !this.isPieceOwnedByCurrentPlayer(piece)) {
            return false;
        }
        
        // Check if the move is in possible moves
        const possibleMoves = this.getPossibleMoves(piece, from.row, from.col);
        const isValidMove = possibleMoves.some(move => move.row === to.row && move.col === to.col);
        
        if (!isValidMove) {
            return false;
        }
        
        // Move piece
        this.board[to.row][to.col] = piece;
        this.board[from.row][from.col] = null;
        
        // Add to move history
        this.addMoveToHistory(piece, from, to, capturedPiece);
        
        // Update captured pieces
        if (capturedPiece) {
            this.addCapturedPiece(capturedPiece);
        }
        
        // Switch players
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        
        // Re-render board
        this.updateBoard();
        
        // AI move if in AI mode (not in room mode)
        if (this.gameMode === 'ai' && this.currentPlayer === 'black') {
            setTimeout(() => this.makeAIMove(), 1000);
        }
        
        return true;
    }

    makeAIMove() {
        const allMoves = this.getAllPossibleMoves('black');
        
        if (allMoves.length === 0) return;
        
        let selectedMove;
        
        switch (this.difficulty) {
            case 'easy':
                selectedMove = this.getRandomMove(allMoves);
                break;
            case 'medium':
                selectedMove = this.getMediumMove(allMoves);
                break;
            case 'hard':
                selectedMove = this.getHardMove(allMoves);
                break;
            default:
                selectedMove = this.getRandomMove(allMoves);
        }
        
        if (selectedMove) {
            this.makeMove(selectedMove.from, selectedMove.to);
        }
    }
    
    getAllPossibleMoves(player) {
        const moves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && ((player === 'black' && piece === piece.toLowerCase()) || 
                             (player === 'white' && piece === piece.toUpperCase()))) {
                    const possibleMoves = this.getPossibleMoves(piece, row, col);
                    possibleMoves.forEach(move => {
                        moves.push({
                            from: {row, col}, 
                            to: move,
                            piece: piece,
                            capturedPiece: this.board[move.row][move.col]
                        });
                    });
                }
            }
        }
        return moves;
    }
    
    getRandomMove(moves) {
        return moves[Math.floor(Math.random() * moves.length)];
    }
    
    getMediumMove(moves) {
        // Önce taş alma hamlelerini kontrol et
        const captureMoves = moves.filter(move => move.capturedPiece);
        if (captureMoves.length > 0) {
            return this.getRandomMove(captureMoves);
        }
        
        // Merkezi kontrol eden hamleleri tercih et
        const centerMoves = moves.filter(move => {
            const {row, col} = move.to;
            return (row >= 3 && row <= 4 && col >= 3 && col <= 4);
        });
        
        if (centerMoves.length > 0) {
            return this.getRandomMove(centerMoves);
        }
        
        return this.getRandomMove(moves);
    }
    
    getHardMove(moves) {
        // Taş alma hamlelerini değerlendir
        const captureMoves = moves.filter(move => move.capturedPiece);
        if (captureMoves.length > 0) {
            // En değerli taşı al
            const pieceValues = {'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 100};
            captureMoves.sort((a, b) => {
                const valueA = pieceValues[a.capturedPiece.toLowerCase()] || 0;
                const valueB = pieceValues[b.capturedPiece.toLowerCase()] || 0;
                return valueB - valueA;
            });
            return captureMoves[0];
        }
        
        // Şahı tehdit eden hamleleri kontrol et
        const threateningMoves = moves.filter(move => {
            return this.isThreateningKing(move);
        });
        
        if (threateningMoves.length > 0) {
            return this.getRandomMove(threateningMoves);
        }
        
        // Merkezi kontrol et
        const centerMoves = moves.filter(move => {
            const {row, col} = move.to;
            return (row >= 2 && row <= 5 && col >= 2 && col <= 5);
        });
        
        if (centerMoves.length > 0) {
            return this.getRandomMove(centerMoves);
        }
        
        return this.getRandomMove(moves);
    }
    
    isThreateningKing(move) {
        // Geçici olarak hamleyi yap
        const originalPiece = this.board[move.to.row][move.to.col];
        this.board[move.to.row][move.to.col] = move.piece;
        this.board[move.from.row][move.from.col] = null;
        
        // Beyaz şahın pozisyonunu bul
        let whiteKingPos = null;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === 'K') {
                    whiteKingPos = {row, col};
                    break;
                }
            }
            if (whiteKingPos) break;
        }
        
        let isThreatening = false;
        if (whiteKingPos) {
            const possibleMoves = this.getPossibleMoves(move.piece, move.to.row, move.to.col);
            isThreatening = possibleMoves.some(m => m.row === whiteKingPos.row && m.col === whiteKingPos.col);
        }
        
        // Hamleyi geri al
        this.board[move.from.row][move.from.col] = move.piece;
        this.board[move.to.row][move.to.col] = originalPiece;
        
        return isThreatening;
    }

    isPieceOwnedByCurrentPlayer(piece) {
        if (this.currentPlayer === 'white') {
            return piece === piece.toUpperCase();
        } else {
            return piece === piece.toLowerCase();
        }
    }

    updateBoard() {
        const boardElement = this.container.querySelector('#chessBoard');
        boardElement.innerHTML = this.renderBoard();
        
        // Re-attach event listeners for new squares
        const squares = this.container.querySelectorAll('.chess-square');
        squares.forEach(square => {
            square.addEventListener('click', (e) => this.handleSquareClick(e));
        });
        
        // Update status
        const statusElement = this.container.querySelector('.current-player');
        statusElement.textContent = `Sıra: ${this.currentPlayer === 'white' ? 'Beyaz' : 'Siyah'}`;
    }

    addMoveToHistory(piece, from, to, captured) {
        const movesList = this.container.querySelector('#movesList');
        const moveText = `${this.getPieceSymbol(piece)} ${String.fromCharCode(97 + from.col)}${8 - from.row} → ${String.fromCharCode(97 + to.col)}${8 - to.row}${captured ? ' ×' : ''}`;
        
        const moveElement = document.createElement('div');
        moveElement.className = 'move-item';
        moveElement.textContent = moveText;
        movesList.appendChild(moveElement);
        
        // Scroll to bottom
        movesList.scrollTop = movesList.scrollHeight;
    }

    addCapturedPiece(piece) {
        const isWhite = piece === piece.toUpperCase();
        const container = this.container.querySelector(isWhite ? '#capturedWhite' : '#capturedBlack');
        
        const pieceElement = document.createElement('span');
        pieceElement.className = 'captured-piece';
        pieceElement.textContent = this.getPieceSymbol(piece);
        container.appendChild(pieceElement);
    }

    newGame() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        
        // Clear history and captured pieces
        this.container.querySelector('#movesList').innerHTML = '';
        this.container.querySelector('#capturedWhite').innerHTML = '';
        this.container.querySelector('#capturedBlack').innerHTML = '';
        
        this.updateBoard();
    }

    toggleGameMode() {
        if (this.gameMode === 'ai') {
            this.createRoom();
        } else {
            this.gameMode = 'ai';
            this.roomCode = null;
            this.waitingForPlayer = false;
            this.isRoomHost = false;
            this.playerColor = 'white';
            this.render();
            this.attachEventListeners();
            this.newGame();
        }
    }
    
    createRoom() {
        this.gameMode = 'room';
        this.roomCode = this.generateRoomCode();
        this.isRoomHost = true;
        this.waitingForPlayer = true;
        this.playerColor = 'white';
        
        this.render();
        this.attachEventListeners();
        this.newGame();
        
        // Simulate waiting for player (in real app, this would be WebSocket connection)
        setTimeout(() => {
            if (this.waitingForPlayer) {
                this.simulatePlayerJoin();
            }
        }, 5000);
    }
    
    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    simulatePlayerJoin() {
        this.waitingForPlayer = false;
        this.render();
        this.attachEventListeners();
        
        // Show notification
        this.showNotification('🎉 Oyuncu katıldı! Oyun başlıyor...', 'success');
    }
    
    leaveRoom() {
        this.gameMode = 'ai';
        this.roomCode = null;
        this.waitingForPlayer = false;
        this.isRoomHost = false;
        this.playerColor = 'white';
        
        this.render();
        this.attachEventListeners();
        this.newGame();
        
        this.showNotification('Odadan çıkıldı.', 'info');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `chess-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        
        if (type === 'success') notification.style.background = '#4CAF50';
        else if (type === 'error') notification.style.background = '#f44336';
        else notification.style.background = '#2196F3';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    showJoinRoomModal() {
        const modal = this.container.querySelector('#joinRoomModal');
        const input = this.container.querySelector('#roomCodeInput');
        if (modal && input) {
            input.value = '';
            modal.style.display = 'flex';
            setTimeout(() => input.focus(), 100);
        }
    }
    
    hideJoinRoomModal() {
        const modal = this.container.querySelector('#joinRoomModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    joinRoom() {
        const input = this.container.querySelector('#roomCodeInput');
        if (!input) return;
        
        const roomCode = input.value.trim().toUpperCase();
        
        if (!roomCode) {
            this.showNotification('Lütfen oda kodunu girin!', 'error');
            return;
        }
        
        if (roomCode.length !== 6) {
            this.showNotification('Oda kodu 6 karakter olmalıdır!', 'error');
            return;
        }
        
        // Simulate room validation (in real app, this would be server-side)
         // For demo: any room code created by createRoom() will be valid
         // Also accept some predefined test codes
         const validRooms = ['ABC123', 'XYZ789', 'TEST01', 'DEMO12', 'PLAY99'];
        
        if (!validRooms.includes(roomCode)) {
            this.showNotification('Oda bulunamadı! Geçerli bir kod girin.', 'error');
            return;
        }
        
        // Join the room
        this.gameMode = 'room';
        this.roomCode = roomCode;
        this.isRoomHost = false;
        this.waitingForPlayer = false;
        this.playerColor = 'black'; // Joining player gets black
        
        this.hideJoinRoomModal();
        this.render();
        this.attachEventListeners();
        this.newGame();
        
        this.showNotification(`🎉 ${roomCode} odasına katıldınız!`, 'success');
    }

    getDifficultyText(difficulty) {
        const difficultyTexts = {
            'easy': 'Kolay',
            'medium': 'Orta',
            'hard': 'Zor'
        };
        return difficultyTexts[difficulty] || difficulty;
    }

    showDifficultyModal(newDifficulty, selectElement) {
        const modal = this.container.querySelector('#difficultyModal');
        const message = this.container.querySelector('#modalMessage');
        const confirmBtn = this.container.querySelector('#modalConfirm');
        const cancelBtn = this.container.querySelector('#modalCancel');
        
        message.textContent = `Zorluk seviyesini "${this.getDifficultyText(newDifficulty)}" olarak değiştirmek istediğinizden emin misiniz? Mevcut oyun sıfırlanacak.`;
        
        modal.classList.add('show');
        
        const handleConfirm = () => {
            this.difficulty = newDifficulty;
            this.newGame();
            modal.classList.remove('show');
            cleanup();
        };
        
        const handleCancel = () => {
            selectElement.value = this.difficulty;
            modal.classList.remove('show');
            cleanup();
        };
        
        const cleanup = () => {
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
            modal.removeEventListener('click', handleModalClick);
        };
        
        const handleModalClick = (e) => {
            if (e.target === modal) {
                handleCancel();
            }
        };
        
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        modal.addEventListener('click', handleModalClick);
    }
}

// Export for use in main games.js
window.ChessGame = ChessGame;