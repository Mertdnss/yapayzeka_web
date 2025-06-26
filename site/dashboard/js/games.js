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
        if (e.key === 'Escape' && gameModal.classList.contains('active')) {
            closeGameModal();
        }
    });

    function closeGameModal() {
        gameModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        gameArea.innerHTML = '<p>Oyun yükleniyor...</p>';
    }

    function setGameContent(gameTitle) {
        switch(gameTitle) {
            case 'AI Satranç':
                gameArea.innerHTML = `
                    <div class="chess-game">
                        <h3>🏆 AI Satranç Oyunu</h3>
                        <div class="chess-board">
                            <div class="board-placeholder">
                                <p>♔ ♕ ♖ ♗ ♘ ♙</p>
                                <p>Satranç tahtası burada görünecek</p>
                                <div class="game-controls">
                                    <button class="game-btn">Yeni Oyun</button>
                                    <button class="game-btn">Zorluk: Orta</button>
                                </div>
                            </div>
                        </div>
                        <div class="game-info">
                            <p>🤖 AI ile satranç oynayın. Hamlenizi yapın ve AI'nın cevabını bekleyin.</p>
                        </div>
                    </div>
                `;
                break;
            
            case 'Kelime Bulmaca':
                gameArea.innerHTML = `
                    <div class="word-puzzle-game">
                        <h3>🧩 Kelime Bulmaca</h3>
                        <div class="puzzle-area">
                            <div class="word-grid">
                                <p>K E L İ M E</p>
                                <p>A R A M A</p>
                                <p>B U L M A C A</p>
                            </div>
                            <div class="word-list">
                                <h4>Bulunacak Kelimeler:</h4>
                                <ul>
                                    <li>KELİME ✓</li>
                                    <li>ARAMA</li>
                                    <li>BULMACA</li>
                                </ul>
                            </div>
                        </div>
                        <div class="game-controls">
                            <button class="game-btn">Yeni Bulmaca</button>
                            <button class="game-btn">İpucu Al</button>
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
        .chess-board, .puzzle-area, .question-area, .story-area, .puzzle-grid, .debate-area {
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