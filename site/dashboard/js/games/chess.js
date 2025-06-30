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
        
        // Chess special moves tracking
        this.castlingRights = {
            white: { kingside: true, queenside: true },
            black: { kingside: true, queenside: true }
        };
        this.enPassantTarget = null; // {row, col} of the square where en passant capture is possible
        this.kingPositions = { white: {row: 7, col: 4}, black: {row: 0, col: 4} };
        
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
            // En passant capture for white pawns
            if (this.enPassantTarget && row === 3) {
                if ((col > 0 && this.enPassantTarget.row === row - 1 && this.enPassantTarget.col === col - 1) ||
                    (col < 7 && this.enPassantTarget.row === row - 1 && this.enPassantTarget.col === col + 1)) {
                    moves.push({row: this.enPassantTarget.row, col: this.enPassantTarget.col, isEnPassant: true});
                }
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
            // En passant capture for black pawns
            if (this.enPassantTarget && row === 4) {
                if ((col > 0 && this.enPassantTarget.row === row + 1 && this.enPassantTarget.col === col - 1) ||
                    (col < 7 && this.enPassantTarget.row === row + 1 && this.enPassantTarget.col === col + 1)) {
                    moves.push({row: this.enPassantTarget.row, col: this.enPassantTarget.col, isEnPassant: true});
                }
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
            
            // Sliding pieces (Rook, Bishop, Queen) can move multiple squares
            const slidingPieces = ['R', 'r', 'B', 'b', 'Q', 'q'];
            const isSlidingPiece = slidingPieces.includes(piece);
            
            pieceDirections.forEach(([dRow, dCol]) => {
                if (isSlidingPiece) {
                    // For sliding pieces, continue in direction until blocked
                    let distance = 1;
                    while (true) {
                        const newRow = row + (dRow * distance);
                        const newCol = col + (dCol * distance);
                        
                        // Check if position is within board
                        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) {
                            break;
                        }
                        
                        const targetPiece = this.board[newRow][newCol];
                        
                        if (!targetPiece) {
                            // Empty square, can move here
                            moves.push({row: newRow, col: newCol});
                            distance++;
                        } else if (!this.isPieceOwnedByCurrentPlayer(targetPiece)) {
                            // Enemy piece, can capture but can't continue
                            // Don't allow capturing the king directly
                            if (targetPiece.toLowerCase() === 'k') {
                                // Skip this move - can't capture king directly
                            } else {
                                moves.push({row: newRow, col: newCol});
                            }
                            break;
                        } else {
                            // Own piece, can't move here or continue
                            break;
                        }
                    }
                } else {
                    // For non-sliding pieces (King, Knight), move only one step
                    const newRow = row + dRow;
                    const newCol = col + dCol;
                    
                    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                        const targetPiece = this.board[newRow][newCol];
                        if (!targetPiece || !this.isPieceOwnedByCurrentPlayer(targetPiece)) {
                            // Don't allow capturing the king directly
                            if (targetPiece && targetPiece.toLowerCase() === 'k') {
                                // Skip this move - can't capture king directly
                            } else {
                                moves.push({row: newRow, col: newCol});
                            }
                        }
                    }
                    
                    // Add castling moves for king
                    if (piece.toLowerCase() === 'k') {
                        const isWhite = piece === 'K';
                        const kingRow = isWhite ? 7 : 0;
                        
                        if (row === kingRow && col === 4) { // King is in starting position
                            // Check kingside castling
                            if (this.castlingRights[isWhite ? 'whiteKingside' : 'blackKingside']) {
                                if (!this.board[kingRow][5] && !this.board[kingRow][6] && this.board[kingRow][7] === (isWhite ? 'R' : 'r')) {
                                    // Check if king is not in check and doesn't pass through check
                                    if (!this.isKingInCheck(isWhite ? 'white' : 'black')) {
                                        moves.push({row: kingRow, col: 6, isCastling: true, castlingSide: 'kingside'});
                                    }
                                }
                            }
                            
                            // Check queenside castling
                            if (this.castlingRights[isWhite ? 'whiteQueenside' : 'blackQueenside']) {
                                if (!this.board[kingRow][3] && !this.board[kingRow][2] && !this.board[kingRow][1] && this.board[kingRow][0] === (isWhite ? 'R' : 'r')) {
                                    // Check if king is not in check and doesn't pass through check
                                    if (!this.isKingInCheck(isWhite ? 'white' : 'black')) {
                                        moves.push({row: kingRow, col: 2, isCastling: true, castlingSide: 'queenside'});
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }

        return moves;
    }

    // Check if a king is in check
    isKingInCheck(player) {
        // Find the king
        let kingPos = null;
        const kingPiece = player === 'white' ? 'K' : 'k';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === kingPiece) {
                    kingPos = {row, col};
                    break;
                }
            }
            if (kingPos) break;
        }
        
        if (!kingPos) return false; // No king found
        
        // Check if any opponent piece can attack the king
        const opponent = player === 'white' ? 'black' : 'white';
        const opponentMoves = this.getAllPossibleMoves(opponent);
        
        return opponentMoves.some(move => 
            move.to.row === kingPos.row && move.to.col === kingPos.col
        );
    }

    // Check if a move would put own king in check
    wouldMoveResultInCheck(from, to, player) {
        // Make a temporary move
        const originalPiece = this.board[to.row][to.col];
        const movingPiece = this.board[from.row][from.col];
        
        this.board[to.row][to.col] = movingPiece;
        this.board[from.row][from.col] = null;
        
        // Check if king is in check after this move
        const inCheck = this.isKingInCheck(player);
        
        // Restore board
        this.board[from.row][from.col] = movingPiece;
        this.board[to.row][to.col] = originalPiece;
        
        return inCheck;
    }

    // Check if player is in checkmate
    isCheckmate(player) {
        if (!this.isKingInCheck(player)) {
            return false; // Not in check, so not checkmate
        }
        
        // Check if any legal move can get out of check
        const allMoves = this.getAllPossibleMoves(player);
        
        for (let move of allMoves) {
            if (!this.wouldMoveResultInCheck(move.from, move.to, player)) {
                return false; // Found a legal move
            }
        }
        
        return true; // No legal moves, it's checkmate
    }

    // Check if player is in stalemate
    isStalemate(player) {
        if (this.isKingInCheck(player)) {
            return false; // In check, so not stalemate
        }
        
        // Check if any legal move exists
        const allMoves = this.getAllPossibleMoves(player);
        
        for (let move of allMoves) {
            if (!this.wouldMoveResultInCheck(move.from, move.to, player)) {
                return false; // Found a legal move
            }
        }
        
        return true; // No legal moves and not in check = stalemate
    }

    // Show game end modal
    showGameEndModal(result, winner = null) {
        const modal = document.createElement('div');
        modal.className = 'chess-modal show';
        modal.innerHTML = `
            <div class="chess-modal-content">
                <h3>${result === 'checkmate' ? 'Şah Mat!' : result === 'stalemate' ? 'Pat!' : 'Oyun Bitti'}</h3>
                <p>${result === 'checkmate' ? 
                    `${winner === 'white' ? 'Beyaz' : 'Siyah'} kazandı!` : 
                    result === 'stalemate' ? 'Oyun berabere bitti.' : 
                    'Oyun sona erdi.'}</p>
                <div class="chess-modal-buttons">
                    <button class="chess-modal-btn confirm" onclick="this.closest('.chess-modal').remove(); window.location.reload();">Yeni Oyun</button>
                    <button class="chess-modal-btn cancel" onclick="this.closest('.chess-modal').remove();">Kapat</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 10000);
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
        const validMove = possibleMoves.find(move => move.row === to.row && move.col === to.col);
        
        if (!validMove) {
            return false;
        }
        
        // Check if trying to capture the king directly (not allowed)
        if (capturedPiece && (capturedPiece.toLowerCase() === 'k')) {
            this.showNotification('Şahı direkt yakalayamazsınız! Önce şah çekmelisiniz.', 'error');
            return false;
        }
        
        // Check if this move would put own king in check
        const currentPlayerColor = this.currentPlayer;
        if (this.wouldMoveResultInCheck(from, to, currentPlayerColor)) {
            this.showNotification('Bu hamle şahınızı tehlikeye atar!', 'error');
            return false;
        }
        
        // Reset en passant target
        this.enPassantTarget = null;
        
        // Handle special moves
        if (validMove.isCastling) {
            // Castling move
            const isWhite = piece === 'K';
            const kingRow = isWhite ? 7 : 0;
            const rookCol = validMove.castlingSide === 'kingside' ? 7 : 0;
            const newRookCol = validMove.castlingSide === 'kingside' ? 5 : 3;
            
            // Move king
            this.board[to.row][to.col] = piece;
            this.board[from.row][from.col] = null;
            
            // Move rook
            this.board[kingRow][newRookCol] = this.board[kingRow][rookCol];
            this.board[kingRow][rookCol] = null;
            
            // Update castling rights
            if (isWhite) {
                this.castlingRights.whiteKingside = false;
                this.castlingRights.whiteQueenside = false;
            } else {
                this.castlingRights.blackKingside = false;
                this.castlingRights.blackQueenside = false;
            }
        } else if (validMove.isEnPassant) {
            // En passant capture
            const isWhite = piece === 'P';
            const capturedPawnRow = isWhite ? to.row + 1 : to.row - 1;
            const capturedPawn = this.board[capturedPawnRow][to.col];
            
            // Move pawn
            this.board[to.row][to.col] = piece;
            this.board[from.row][from.col] = null;
            
            // Remove captured pawn
            this.board[capturedPawnRow][to.col] = null;
            
            // Add captured pawn to captured pieces
            if (capturedPawn) {
                this.addCapturedPiece(capturedPawn);
            }
        } else {
            // Regular move
            this.board[to.row][to.col] = piece;
            this.board[from.row][from.col] = null;
            
            // Check for pawn double move (set en passant target)
            if (piece.toLowerCase() === 'p' && Math.abs(to.row - from.row) === 2) {
                this.enPassantTarget = {
                    row: (from.row + to.row) / 2,
                    col: to.col
                };
            }
            
            // Check for pawn promotion
            if (piece.toLowerCase() === 'p') {
                const isWhite = piece === 'P';
                const promotionRow = isWhite ? 0 : 7;
                
                if (to.row === promotionRow) {
                    // Promote to queen by default (can be enhanced with user choice)
                    this.board[to.row][to.col] = isWhite ? 'Q' : 'q';
                }
            }
        }
        
        // Update castling rights if king or rook moves
        if (piece.toLowerCase() === 'k') {
            const isWhite = piece === 'K';
            if (isWhite) {
                this.castlingRights.whiteKingside = false;
                this.castlingRights.whiteQueenside = false;
            } else {
                this.castlingRights.blackKingside = false;
                this.castlingRights.blackQueenside = false;
            }
        } else if (piece.toLowerCase() === 'r') {
            const isWhite = piece === 'R';
            if (from.row === (isWhite ? 7 : 0)) {
                if (from.col === 0) {
                    // Queenside rook
                    if (isWhite) this.castlingRights.whiteQueenside = false;
                    else this.castlingRights.blackQueenside = false;
                } else if (from.col === 7) {
                    // Kingside rook
                    if (isWhite) this.castlingRights.whiteKingside = false;
                    else this.castlingRights.blackKingside = false;
                }
            }
        }
        
        // Add to move history
        this.addMoveToHistory(piece, from, to, capturedPiece);
        
        // Update captured pieces (for regular captures)
        if (capturedPiece && !validMove.isEnPassant) {
            this.addCapturedPiece(capturedPiece);
        }
        
        // Switch players
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        
        // Check for check, checkmate, or stalemate
        const opponent = this.currentPlayer;
        if (this.isKingInCheck(opponent)) {
            if (this.isCheckmate(opponent)) {
                this.showGameEndModal('checkmate', currentPlayerColor);
                return true;
            } else {
                this.showNotification(`${opponent === 'white' ? 'Beyaz' : 'Siyah'} şah!`, 'warning');
            }
        } else if (this.isStalemate(opponent)) {
            this.showGameEndModal('stalemate');
            return true;
        }
        
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
        // Kolay seviye: Tamamen rastgele, bazen kötü hamleler bile yapar
        // %30 ihtimalle kendi taşını tehlikeye atan hamle yapar
        if (Math.random() < 0.3) {
            const riskyMoves = moves.filter(move => {
                // Değerli taşları tehlikeli yerlere koyma
                const piece = move.piece.toLowerCase();
                if (piece === 'q' || piece === 'r') {
                    return this.isSquareUnderAttack(move.to, this.currentPlayer === 'white' ? 'black' : 'white');
                }
                return false;
            });
            if (riskyMoves.length > 0) {
                return riskyMoves[Math.floor(Math.random() * riskyMoves.length)];
            }
        }
        
        // Basit taş alma varsa %50 ihtimalle kaçırır
        const captureMoves = moves.filter(move => move.capturedPiece);
        if (captureMoves.length > 0 && Math.random() < 0.5) {
            return captureMoves[Math.floor(Math.random() * captureMoves.length)];
        }
        
        return moves[Math.floor(Math.random() * moves.length)];
    }
    
    getMediumMove(moves) {
        // Orta seviye: Temel strateji, taş alma önceliği, basit taktikler
        
        // Şah mat fırsatı varsa kesinlikle kullan
        const checkmateMove = this.findCheckmateMove(moves);
        if (checkmateMove) {
            return checkmateMove;
        }
        
        // Şah çekme hamlelerini öncelikle
        const checkMoves = moves.filter(move => {
            return this.wouldMoveGiveCheck(move);
        });
        if (checkMoves.length > 0 && Math.random() < 0.7) {
            return this.getRandomMove(checkMoves);
        }
        
        // Değerli taş alma (vezir, kale öncelikli)
        const valuableCaptures = moves.filter(move => {
            if (!move.capturedPiece) return false;
            const piece = move.capturedPiece.toLowerCase();
            return piece === 'q' || piece === 'r';
        });
        if (valuableCaptures.length > 0) {
            return this.getRandomMove(valuableCaptures);
        }
        
        // Herhangi bir taş alma
        const captureMoves = moves.filter(move => move.capturedPiece || move.to.isEnPassant);
        if (captureMoves.length > 0 && Math.random() < 0.8) {
            return this.getRandomMove(captureMoves);
        }
        
        // Castling fırsatı
        const castlingMoves = moves.filter(move => move.to.isCastling);
        if (castlingMoves.length > 0 && Math.random() < 0.6) {
            return this.getRandomMove(castlingMoves);
        }
        
        // Merkez kontrolü (d4, d5, e4, e5)
        const centerMoves = moves.filter(move => {
            const {row, col} = move.to;
            return (row >= 3 && row <= 4 && col >= 3 && col <= 4);
        });
        if (centerMoves.length > 0 && Math.random() < 0.6) {
            return this.getRandomMove(centerMoves);
        }
        
        // Taş geliştirme (at ve fil)
        const developmentMoves = moves.filter(move => {
            const piece = move.piece.toLowerCase();
            const fromRow = move.from.row;
            const startingRow = this.currentPlayer === 'white' ? 7 : 0;
            return (piece === 'n' || piece === 'b') && fromRow === startingRow;
        });
        if (developmentMoves.length > 0) {
            return this.getRandomMove(developmentMoves);
        }
        
        return this.getRandomMove(moves);
    }
    
    getHardMove(moves) {
        // Zor seviye: İleri düzey strateji, değer hesaplamaları, taktik fırsatlar
        const pieceValues = {'p': 1, 'n': 3, 'b': 3.25, 'r': 5, 'q': 9, 'k': 100};
        
        // Şah mat fırsatı varsa kesinlikle kullan
        const checkmateMove = this.findCheckmateMove(moves);
        if (checkmateMove) {
            return checkmateMove;
        }
        
        // Çatal hamlesi (bir hamle ile birden fazla taşı tehdit etme)
        const forkMoves = this.findForkMoves(moves);
        if (forkMoves.length > 0) {
            // En değerli çatalı seç
            forkMoves.sort((a, b) => b.value - a.value);
            return forkMoves[0];
        }
        
        // Şah çekme hamlesi
        const checkMoves = moves.filter(move => {
            return this.wouldMoveGiveCheck(move);
        });
        if (checkMoves.length > 0) {
            // Şah çekerken aynı zamanda taş alan hamleyi tercih et
            const capturingCheckMoves = checkMoves.filter(move => move.capturedPiece);
            if (capturingCheckMoves.length > 0) {
                // En değerli taşı alarak şah çek
                capturingCheckMoves.sort((a, b) => {
                    const valueA = pieceValues[a.capturedPiece.toLowerCase()] || 0;
                    const valueB = pieceValues[b.capturedPiece.toLowerCase()] || 0;
                    return valueB - valueA;
                });
                return capturingCheckMoves[0];
            }
            return checkMoves[0];
        }
        
        // Taş değiş tokuşu değerlendirme (değer kazanma)
        const exchangeMoves = moves.filter(move => move.capturedPiece).map(move => {
            const capturedValue = pieceValues[move.capturedPiece.toLowerCase()] || 0;
            const movingPieceValue = pieceValues[move.piece.toLowerCase()] || 0;
            
            // Taş değiş tokuşu sonrası kare güvenli mi?
            const isSafeSquare = !this.isSquareUnderAttack(move.to, this.currentPlayer === 'white' ? 'black' : 'white');
            
            // Güvenli değilse, taş kaybı olabilir
            const exchangeValue = isSafeSquare ? capturedValue : (capturedValue - movingPieceValue);
            
            return {...move, exchangeValue};
        });
        
        // Pozitif değer kazanan hamleler
        const positiveExchanges = exchangeMoves.filter(move => move.exchangeValue > 0);
        if (positiveExchanges.length > 0) {
            // En yüksek değer kazancı sağlayan hamleyi seç
            positiveExchanges.sort((a, b) => b.exchangeValue - a.exchangeValue);
            return positiveExchanges[0];
        }
        
        // Castling (rok) hamlesi - erken oyunda güvenlik için
        const castlingMoves = moves.filter(move => move.to.isCastling);
        if (castlingMoves.length > 0 && this.moveHistory.length < 15) {
            return castlingMoves[0];
        }
        
        // Taş geliştirme (erken oyun)
        if (this.moveHistory.length < 10) {
            // Merkez piyonları ilerletme
            const centerPawnMoves = moves.filter(move => {
                const piece = move.piece.toLowerCase();
                const {col} = move.from;
                return piece === 'p' && (col === 3 || col === 4);
            });
            if (centerPawnMoves.length > 0) {
                return centerPawnMoves[0];
            }
            
            // At ve fil geliştirme
            const developmentMoves = moves.filter(move => {
                const piece = move.piece.toLowerCase();
                const fromRow = move.from.row;
                const startingRow = this.currentPlayer === 'white' ? 7 : 0;
                return (piece === 'n' || piece === 'b') && fromRow === startingRow;
            });
            if (developmentMoves.length > 0) {
                return developmentMoves[0];
            }
        }
        
        // Merkez kontrolü (genişletilmiş merkez)
        const centerMoves = moves.filter(move => {
            const {row, col} = move.to;
            return (row >= 2 && row <= 5 && col >= 2 && col <= 5);
        });
        if (centerMoves.length > 0) {
            // Merkezdeki en güvenli kareyi seç
            const safeCenterMoves = centerMoves.filter(move => {
                return !this.isSquareUnderAttack(move.to, this.currentPlayer === 'white' ? 'black' : 'white');
            });
            if (safeCenterMoves.length > 0) {
                return safeCenterMoves[0];
            }
            return centerMoves[0];
        }
        
        // Piyon ilerletme (geç oyun)
        if (this.moveHistory.length > 20) {
            const pawnAdvanceMoves = moves.filter(move => {
                const piece = move.piece.toLowerCase();
                return piece === 'p';
            }).sort((a, b) => {
                // Beyaz için en üste, siyah için en alta yakın piyonları tercih et
                const rankValueA = this.currentPlayer === 'white' ? 7 - a.to.row : a.to.row;
                const rankValueB = this.currentPlayer === 'white' ? 7 - b.to.row : b.to.row;
                return rankValueB - rankValueA;
            });
            if (pawnAdvanceMoves.length > 0) {
                return pawnAdvanceMoves[0];
            }
        }
        
        // Eşit değer takas hamlesi
        const equalExchanges = exchangeMoves.filter(move => move.exchangeValue === 0);
        if (equalExchanges.length > 0) {
            return equalExchanges[0];
        }
        
        // Hiçbir strateji uygulanamadıysa, en güvenli hamleyi yap
        const safeMoves = moves.filter(move => {
            return !this.isSquareUnderAttack(move.to, this.currentPlayer === 'white' ? 'black' : 'white');
        });
        if (safeMoves.length > 0) {
            return safeMoves[0];
        }
        
        // Son çare olarak rastgele bir hamle yap
        return this.getRandomMove(moves);
    }
    
    // Şah mat hamlesi bulma
    findCheckmateMove(moves) {
        for (let move of moves) {
            // Geçici olarak hamleyi yap
            const originalPiece = this.board[move.to.row][move.to.col];
            this.board[move.to.row][move.to.col] = move.piece;
            this.board[move.from.row][move.from.col] = null;
            
            const opponent = this.currentPlayer === 'white' ? 'black' : 'white';
            const isCheckmate = this.isCheckmate(opponent);
            
            // Hamleyi geri al
            this.board[move.from.row][move.from.col] = move.piece;
            this.board[move.to.row][move.to.col] = originalPiece;
            
            if (isCheckmate) {
                return move;
            }
        }
        return null;
    }
    
    // Çatal hamlesi bulma (birden fazla taşı tehdit etme)
    findForkMoves(moves) {
        const forkMoves = [];
        const pieceValues = {'p': 1, 'n': 3, 'b': 3.25, 'r': 5, 'q': 9, 'k': 100};
        
        for (let move of moves) {
            // Geçici olarak hamleyi yap
            const originalPiece = this.board[move.to.row][move.to.col];
            this.board[move.to.row][move.to.col] = move.piece;
            this.board[move.from.row][move.from.col] = null;
            
            // Bu pozisyondan tehdit edilen rakip taşları say
            const threatenedPieces = [];
            const opponent = this.currentPlayer === 'white' ? 'black' : 'white';
            
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = this.board[row][col];
                    if (piece && ((opponent === 'white' && piece === piece.toUpperCase()) || 
                                 (opponent === 'black' && piece === piece.toLowerCase()))) {
                        // Bu kare tehdit altında mı?
                        if (this.isSquareUnderAttack({row, col}, this.currentPlayer)) {
                            threatenedPieces.push({piece, value: pieceValues[piece.toLowerCase()] || 0});
                        }
                    }
                }
            }
            
            // Hamleyi geri al
            this.board[move.from.row][move.from.col] = move.piece;
            this.board[move.to.row][move.to.col] = originalPiece;
            
            // Eğer 2 veya daha fazla taş tehdit ediliyorsa, bu bir çatal
            if (threatenedPieces.length >= 2) {
                const totalValue = threatenedPieces.reduce((sum, p) => sum + p.value, 0);
                forkMoves.push({...move, value: totalValue, threatenedCount: threatenedPieces.length});
            }
        }
        
        return forkMoves;
    }
    
    // Hamlenin şah çekip çekmediğini kontrol et
    wouldMoveGiveCheck(move) {
        // Geçici olarak hamleyi yap
        const originalPiece = this.board[move.to.row][move.to.col];
        this.board[move.to.row][move.to.col] = move.piece;
        this.board[move.from.row][move.from.col] = null;
        
        const opponent = this.currentPlayer === 'white' ? 'black' : 'white';
        const isInCheck = this.isKingInCheck(opponent);
        
        // Hamleyi geri al
        this.board[move.from.row][move.from.col] = move.piece;
        this.board[move.to.row][move.to.col] = originalPiece;
        
        return isInCheck;
    }
    
    // Karenin saldırı altında olup olmadığını kontrol et
    isSquareUnderAttack(square, byPlayer) {
        // Belirtilen oyuncu tarafından bu kare saldırı altında mı?
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && ((byPlayer === 'white' && piece === piece.toUpperCase()) || 
                             (byPlayer === 'black' && piece === piece.toLowerCase()))) {
                    const possibleMoves = this.getPossibleMoves(piece, row, col);
                    if (possibleMoves.some(move => move.row === square.row && move.col === square.col)) {
                        return true;
                    }
                }
            }
        }
        return false;
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