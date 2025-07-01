// Games Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Game filtering functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    const gameCards = document.querySelectorAll('.game-card');
    const gameModal = document.getElementById('gameModal');
    const modalTitle = document.getElementById('modalTitle');
    const gameArea = document.getElementById('gameArea');
    const closeModal = document.getElementById('closeModal');
    const playButtons = document.querySelectorAll('.play-btn');

    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter games
            gameCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    // Add animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Game modal functionality
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const gameCard = this.closest('.game-card');
            const gameTitle = gameCard.querySelector('h3').textContent;
            
            // Set modal title
            modalTitle.textContent = gameTitle;
            
            // Set game content based on game type
            setGameContent(gameTitle);
            
            // Show modal
            gameModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal functionality
    closeModal.addEventListener('click', closeGameModal);
    
    gameModal.addEventListener('click', function(e) {
        if (e.target === gameModal) {
            closeGameModal();
        }
    });

    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const exitConfirmModal = document.getElementById('exitConfirmModal');
            if (exitConfirmModal && exitConfirmModal.classList.contains('active')) {
                hideExitConfirmModal();
            } else if (gameModal.classList.contains('active')) {
                closeGameModal();
            }
        }
    });

    function closeGameModal() {
        showExitConfirmModal();
    }
    
    function forceCloseGameModal() {
        gameModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        gameArea.innerHTML = '<p>Oyun yükleniyor...</p>';
        
        // Clean up game instance
        if (currentGameInstance && typeof currentGameInstance.destroy === 'function') {
            currentGameInstance.destroy();
        }
        currentGameInstance = null;
    }
    
    function showExitConfirmModal() {
        // Create modal if it doesn't exist
        let confirmModal = document.getElementById('exitConfirmModal');
        if (!confirmModal) {
            confirmModal = createExitConfirmModal();
            document.body.appendChild(confirmModal);
        }
        
        confirmModal.style.display = 'flex';
        setTimeout(() => {
            confirmModal.classList.add('active');
        }, 10);
    }
    
    function hideExitConfirmModal() {
        const confirmModal = document.getElementById('exitConfirmModal');
        if (confirmModal) {
            confirmModal.classList.remove('active');
            setTimeout(() => {
                confirmModal.style.display = 'none';
            }, 300);
        }
    }
    
    function createExitConfirmModal() {
        const modal = document.createElement('div');
        modal.id = 'exitConfirmModal';
        modal.className = 'exit-confirm-modal';
        modal.innerHTML = `
            <div class="exit-confirm-content">
                <div class="exit-confirm-icon">⚠️</div>
                <h3>Oyundan Çıkış</h3>
                <p>Oyundan çıkmak istediğinizden emin misiniz?<br>Kaydedilmemiş ilerlemeniz kaybolabilir.</p>
                <div class="exit-confirm-buttons">
                    <button id="confirmExit" class="exit-btn confirm">Evet, Çık</button>
                    <button id="cancelExit" class="exit-btn cancel">İptal</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        modal.querySelector('#confirmExit').addEventListener('click', () => {
            hideExitConfirmModal();
            forceCloseGameModal();
        });
        
        modal.querySelector('#cancelExit').addEventListener('click', hideExitConfirmModal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideExitConfirmModal();
            }
        });
        
        return modal;
    }
    
    // Add CSS styles for exit confirmation modal
    const exitModalStyles = document.createElement('style');
    exitModalStyles.textContent = `
        .exit-confirm-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .exit-confirm-modal.active {
            opacity: 1;
        }
        
        .exit-confirm-content {
            background: white;
            border-radius: 16px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        }
        
        .exit-confirm-modal.active .exit-confirm-content {
            transform: scale(1);
        }
        
        .exit-confirm-icon {
            font-size: 48px;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .exit-confirm-content h3 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 24px;
            font-weight: 600;
        }
        
        .exit-confirm-content p {
            margin: 0 0 25px 0;
            color: #666;
            line-height: 1.5;
            font-size: 16px;
        }
        
        .exit-confirm-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        
        .exit-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 120px;
        }
        
        .exit-btn.confirm {
            background: #ff4757;
            color: white;
        }
        
        .exit-btn.confirm:hover {
            background: #ff3742;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 71, 87, 0.4);
        }
        
        .exit-btn.cancel {
            background: #f1f2f6;
            color: #333;
        }
        
        .exit-btn.cancel:hover {
            background: #ddd;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 480px) {
            .exit-confirm-content {
                padding: 25px 20px;
                margin: 20px;
            }
            
            .exit-confirm-buttons {
                flex-direction: column;
            }
            
            .exit-btn {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(exitModalStyles);

    // Game module loader
    const gameModules = {
        'XOX (TicTacToe)': {
            jsFile: 'js/games/tictactoe.js',
            className: 'TicTacToeGame'
        },

        'SOS Oyunu': {
            jsFile: 'js/games/sos.js',
            className: 'SOSGame'
        },
        'AI Bilgi Yarışması': {
            jsFile: 'js/games/trivia.js',
            className: 'TriviaGame'
        },
        'Hikaye Yaratıcısı': {
            jsFile: 'js/games/story.js',
            cssFile: 'css/story.css',
            className: 'StoryGame'
        },
        'Sayı Bulmacası': {
            jsFile: 'js/games/numberpuzzle.js',
            cssFile: 'css/numberpuzzle.css',
            className: 'NumberPuzzleGame'
        },
        'AI Tartışma': {
            jsFile: 'js/games/debate.js',
            cssFile: 'css/debate.css',
            className: 'DebateGame'
        }
    };

    let currentGameInstance = null;
    let loadedModules = new Set();

    window.loadGameModule = async function(gameTitle) {
        const module = gameModules[gameTitle];
        if (!module) {
            gameArea.innerHTML = '<p>Bu oyun henüz mevcut değil.</p>';
            return;
        }

        // Show loading
        gameArea.innerHTML = `
            <div class="game-loading">
                <div class="loading-spinner"></div>
                <p>Oyun yükleniyor...</p>
            </div>
        `;

        try {
            // Load CSS if not already loaded and cssFile exists
            if (module.cssFile && !loadedModules.has(module.cssFile)) {
                await loadCSS(module.cssFile);
                loadedModules.add(module.cssFile);
            }

            // Load JS if not already loaded
            if (!loadedModules.has(module.jsFile)) {
                await loadJS(module.jsFile);
                loadedModules.add(module.jsFile);
            }

            // Initialize game
            if (window[module.className]) {
                currentGameInstance = new window[module.className](gameArea);
                
                // Set global reference for TriviaGame
                if (module.className === 'TriviaGame') {
                    window.currentTriviaGame = currentGameInstance;
                }
            } else {
                throw new Error(`Game class ${module.className} not found`);
            }
        } catch (error) {
            console.error('Error loading game module:', error);
            gameArea.innerHTML = `
                <div class="game-error">
                    <p>Oyun yüklenirken bir hata oluştu.</p>
                    <button class="retry-btn" onclick="loadGameModule('${gameTitle}')">Tekrar Dene</button>
                </div>
            `;
        }
    };

    function loadCSS(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    function loadJS(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function setGameContent(gameTitle) {
        // Clean up previous game instance
        if (currentGameInstance && typeof currentGameInstance.destroy === 'function') {
            currentGameInstance.destroy();
        }
        currentGameInstance = null;

        // Load the appropriate game module
        loadGameModule(gameTitle);
    }

    // Legacy fallback for games without modules
    function setLegacyGameContent(gameTitle) {
        switch(gameTitle) {
            
            case 'SOS Oyunu':
                gameArea.innerHTML = `
                    <div class="sos-game">
                        <h3>🎯 SOS Oyunu</h3>
                        <div class="sos-info">
                            <p>S-O-S dizileri oluşturarak puan kazanın!</p>
                        </div>
                        <div class="sos-grid">
                            <div class="grid-5x5">
                                ${Array(25).fill().map((_, i) => `<button class="sos-cell" data-index="${i}"></button>`).join('')}
                            </div>
                        </div>
                        <div class="game-controls">
                            <button class="game-btn">Yeni Oyun</button>
                            <button class="game-btn">S Harfi</button>
                            <button class="game-btn">O Harfi</button>
                        </div>
                        <div class="score-display">
                            <p>Oyuncu 1: 0 | AI: 0</p>
                        </div>
                    </div>
                `;
                break;
            
            case 'AI Bilgi Yarışması':
                gameArea.innerHTML = `
                    <div class="trivia-game">
                        <h3>🧠 AI Bilgi Yarışması</h3>
                        <div class="question-area">
                            <div class="question">
                                <h4>Soru 1/10</h4>
                                <p>Türkiye'nin başkenti neresidir?</p>
                            </div>
                            <div class="answers">
                                <button class="answer-btn">A) İstanbul</button>
                                <button class="answer-btn">B) Ankara</button>
                                <button class="answer-btn">C) İzmir</button>
                                <button class="answer-btn">D) Antalya</button>
                            </div>
                        </div>
                        <div class="score-area">
                            <p>Skor: 0/0 | Süre: 30s</p>
                        </div>
                    </div>
                `;
                break;
            
            case 'Hikaye Yaratıcısı':
                gameArea.innerHTML = `
                    <div class="story-creator-game">
                        <h3>📖 Hikaye Yaratıcısı</h3>
                        <div class="story-area">
                            <div class="story-text">
                                <p><strong>AI:</strong> Bir zamanlar uzak bir krallıkta...</p>
                                <p><strong>Sen:</strong> Hikayeyi devam ettir...</p>
                            </div>
                            <div class="story-input">
                                <textarea placeholder="Hikayeyi nasıl devam ettirmek istiyorsun?"></textarea>
                                <button class="game-btn">Devam Et</button>
                            </div>
                        </div>
                        <div class="story-options">
                            <button class="game-btn">Yeni Hikaye</button>
                            <button class="game-btn">Hikayeyi Kaydet</button>
                        </div>
                    </div>
                `;
                break;
            
            case 'Sayı Bulmacası':
                gameArea.innerHTML = `
                    <div class="number-puzzle-game">
                        <h3>🔢 Sayı Bulmacası</h3>
                        <div class="puzzle-grid">
                            <div class="number-grid">
                                <div class="grid-row">
                                    <span>2</span><span>4</span><span></span><span>8</span>
                                </div>
                                <div class="grid-row">
                                    <span></span><span>8</span><span>16</span><span></span>
                                </div>
                                <div class="grid-row">
                                    <span>4</span><span></span><span>32</span><span>64</span>
                                </div>
                                <div class="grid-row">
                                    <span>8</span><span>16</span><span></span><span>128</span>
                                </div>
                            </div>
                        </div>
                        <div class="game-controls">
                            <button class="game-btn">Yeni Oyun</button>
                            <button class="game-btn">Geri Al</button>
                        </div>
                        <div class="game-info">
                            <p>Skor: 1024 | En Yüksek: 2048</p>
                        </div>
                    </div>
                `;
                break;
            
            case 'AI Tartışma':
                gameArea.innerHTML = `
                    <div class="debate-game">
                        <h3>🗣️ AI Tartışma</h3>
                        <div class="debate-topic">
                            <h4>Konu: "Yapay zeka insanlığın geleceği için faydalı mıdır?"</h4>
                        </div>
                        <div class="debate-area">
                            <div class="ai-argument">
                                <strong>AI Görüşü:</strong>
                                <p>Yapay zeka, tıp, eğitim ve bilim alanlarında devrim yaratarak insanlığa büyük faydalar sağlayabilir...</p>
                            </div>
                            <div class="user-response">
                                <textarea placeholder="Karşı argümanınızı yazın..."></textarea>
                                <button class="game-btn">Argümanı Gönder</button>
                            </div>
                        </div>
                        <div class="debate-score">
                            <p>Argüman Gücü: ⭐⭐⭐⭐☆</p>
                        </div>
                    </div>
                `;
                break;
            
            default:
                gameArea.innerHTML = `
                    <div class="default-game">
                        <h3>🎮 ${gameTitle}</h3>
                        <p>Bu oyun yakında eklenecek!</p>
                        <div class="coming-soon">
                            <p>🚧 Geliştirme aşamasında...</p>
                        </div>
                    </div>
                `;
        }
        
        // Add game-specific event listeners
        addGameEventListeners(gameTitle);
    }

    function addGameEventListeners(gameTitle) {
        const gameButtons = gameArea.querySelectorAll('.game-btn');
        const answerButtons = gameArea.querySelectorAll('.answer-btn');
        
        gameButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Add button click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Handle different button actions
                const buttonText = this.textContent;
                if (buttonText.includes('Yeni')) {
                    showMessage('Yeni oyun başlatılıyor...');
                } else if (buttonText.includes('İpucu')) {
                    showMessage('İpucu: İlk kelime sol üst köşede!');
                } else if (buttonText.includes('Devam Et')) {
                    showMessage('Hikaye devam ediyor...');
                }
            });
        });
        
        answerButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove previous selections
                answerButtons.forEach(btn => btn.classList.remove('selected'));
                // Add selection to clicked button
                this.classList.add('selected');
                
                // Check answer (example)
                if (this.textContent.includes('Ankara')) {
                    showMessage('Doğru cevap! 🎉');
                } else {
                    showMessage('Yanlış cevap. Tekrar deneyin.');
                }
            });
        });
    }

    function showMessage(message) {
        // Create temporary message element
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--primary-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 3000;
            font-weight: 500;
            box-shadow: 0 8px 25px rgba(108, 99, 255, 0.3);
        `;
        
        document.body.appendChild(messageEl);
        
        // Remove message after 2 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 2000);
    }

    // Add CSS for game elements
    const gameStyles = document.createElement('style');
    gameStyles.textContent = `
        .puzzle-area, .question-area, .story-area, .puzzle-grid, .debate-area {
            background: rgba(108, 99, 255, 0.05);
            border-radius: 12px;
            padding: 20px;
            margin: 16px 0;
        }
        
        .game-btn {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            margin: 4px;
            transition: all 0.3s ease;
        }
        
        .game-btn:hover {
            background: var(--primary-hover);
            transform: translateY(-2px);
        }
        
        .answer-btn {
            display: block;
            width: 100%;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid rgba(108, 99, 255, 0.2);
            padding: 12px;
            margin: 8px 0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .answer-btn:hover {
            border-color: var(--primary-color);
            background: rgba(108, 99, 255, 0.1);
        }
        
        .answer-btn.selected {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        
        .word-grid, .number-grid {
            font-family: monospace;
            font-size: 18px;
            text-align: center;
            margin: 16px 0;
        }
        
        .grid-row {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin: 4px 0;
        }
        
        .grid-row span {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid rgba(108, 99, 255, 0.2);
            border-radius: 8px;
            font-weight: bold;
        }
        
        .story-input textarea {
            width: 100%;
            min-height: 80px;
            padding: 12px;
            border: 2px solid rgba(108, 99, 255, 0.2);
            border-radius: 8px;
            resize: vertical;
            font-family: inherit;
        }
        
        .word-list ul {
            list-style: none;
            padding: 0;
        }
        
        .word-list li {
            padding: 4px 0;
            font-weight: 500;
        }
    `;
    
    document.head.appendChild(gameStyles);
});