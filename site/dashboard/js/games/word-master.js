class WordMasterGame {
    constructor(container) {
        this.container = container;
        this.currentWord = '';
        this.currentHints = [];
        this.currentCategory = 'animals';
        this.difficulty = 'medium';
        this.score = 0;
        this.round = 1;
        this.maxRounds = 5;
        this.hintsUsed = 0;
        this.gameActive = false;
        this.isGenerating = false;
        
        // Gemini API Configuration
        this.geminiApiKey = 'AIzaSyBscfSecswV2hdqaRtA4IXHSR7xWsr6OJw';
        this.geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.geminiApiKey}`;
        
        this.categoryPrompts = {
            animals: 'hayvanlar',
            professions: 'meslekler',
            technology: 'teknoloji',
            food: 'yiyecekler'
        };
        
        this.difficultyPrompts = {
            easy: 'kolay (3-5 harf)',
            medium: 'orta (5-7 harf)',
            hard: 'zor (7+ harf)'
        };
        
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <style>
                .word-master-game{max-width:800px;margin:0 auto;padding:20px;font-family:'Inter',sans-serif;background:linear-gradient(135deg,#16a085 0%,#2c3e50 100%);border-radius:20px;color:white;min-height:600px}.game-header{text-align:center;margin-bottom:30px}.game-title{font-size:2.5rem;font-weight:700;margin-bottom:10px;background:linear-gradient(45deg,#FFD700,#FFA500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.game-subtitle{font-size:1.1rem;opacity:0.9;margin-bottom:20px}.game-setup{background:rgba(255,255,255,0.1);border-radius:15px;padding:30px;margin-bottom:20px;backdrop-filter:blur(10px)}.setup-section{margin-bottom:25px}.setup-label{font-size:1.1rem;font-weight:600;margin-bottom:10px;display:block}.category-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:20px}.category-btn{background:rgba(255,255,255,0.2);border:2px solid transparent;border-radius:10px;padding:15px;color:white;cursor:pointer;transition:all 0.3s ease;text-align:center;font-weight:500;font-size:0.9rem}.category-btn:hover{background:rgba(255,255,255,0.3);transform:translateY(-2px)}.category-btn.active{background:rgba(255,215,0,0.3);border-color:#FFD700;box-shadow:0 0 20px rgba(255,215,0,0.3)}.difficulty-buttons{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.difficulty-btn{background:rgba(255,255,255,0.2);border:2px solid transparent;border-radius:25px;padding:10px 20px;color:white;cursor:pointer;transition:all 0.3s ease;font-weight:500}.difficulty-btn.active{background:rgba(255,215,0,0.3);border-color:#FFD700}.start-game-btn{background:linear-gradient(45deg,#FFD700,#FFA500);border:none;border-radius:25px;padding:15px 40px;font-size:1.2rem;font-weight:600;color:#333;cursor:pointer;transition:all 0.3s ease;display:block;margin:20px auto 0}.start-game-btn:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(255,215,0,0.3)}.game-interface{display:none}.game-interface.active{display:block}.game-progress{display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.1);border-radius:15px;padding:20px;margin-bottom:20px}.progress-info{text-align:center}.progress-label{font-size:0.9rem;opacity:0.8;margin-bottom:5px}.progress-value{font-size:1.2rem;font-weight:700}.word-display{background:rgba(255,255,255,0.1);border-radius:15px;padding:30px;margin-bottom:20px;text-align:center;backdrop-filter:blur(10px);min-height:200px}.word-length{font-size:1.5rem;font-weight:600;margin-bottom:20px}.word-blanks{display:flex;justify-content:center;gap:8px;margin-bottom:20px;flex-wrap:wrap}.word-blank{width:40px;height:40px;background:rgba(255,255,255,0.9);border:2px solid #FFD700;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:600;color:#333}.word-blank.filled{background:#FFD700;color:#333}.hints-section{background:rgba(255,255,255,0.1);border-radius:15px;padding:25px;margin-bottom:20px}.hints-title{font-size:1.2rem;font-weight:600;margin-bottom:15px;text-align:center}.hints-list{list-style:none;padding:0}.hint-item{background:rgba(255,255,255,0.2);border-radius:10px;padding:15px;margin-bottom:10px;font-size:1rem}.hint-item.locked{opacity:0.5;position:relative}.hint-item.locked::after{content:'🔒';position:absolute;right:15px;top:50%;transform:translateY(-50%)}.guess-section{background:rgba(255,255,255,0.1);border-radius:15px;padding:25px;margin-bottom:20px}.guess-input{width:100%;padding:15px;border:none;border-radius:10px;background:rgba(255,255,255,0.9);color:#333;font-size:1.2rem;text-align:center;font-weight:600;margin-bottom:15px}.guess-input::placeholder{color:#666}.guess-input:focus{outline:none;box-shadow:0 0 0 2px #FFD700}.game-controls{display:flex;gap:15px;justify-content:center;flex-wrap:wrap}.control-btn{background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.3);border-radius:10px;padding:12px 20px;color:white;cursor:pointer;transition:all 0.3s ease;font-weight:500}.control-btn:hover{background:rgba(255,255,255,0.3);transform:translateY(-2px)}.control-btn.primary{background:linear-gradient(45deg,#FFD700,#FFA500);border-color:#FFD700;color:#333}.control-btn.primary:hover{box-shadow:0 5px 15px rgba(255,215,0,0.3)}.control-btn:disabled{opacity:0.5;cursor:not-allowed}.loading-indicator{display:none;text-align:center;padding:20px}.loading-indicator.active{display:block}.loading-dots{display:inline-block;position:relative;width:80px;height:20px}.loading-dots div{position:absolute;top:8px;width:6px;height:6px;border-radius:50%;background:#FFD700;animation:loading 1.2s linear infinite}.loading-dots div:nth-child(1){left:8px;animation-delay:0s}.loading-dots div:nth-child(2){left:32px;animation-delay:-0.4s}.loading-dots div:nth-child(3){left:56px;animation-delay:-0.8s}@keyframes loading{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}.result-message{background:rgba(255,255,255,0.1);border-radius:15px;padding:20px;margin-bottom:20px;text-align:center;font-size:1.2rem;font-weight:600}.result-message.success{background:rgba(46,204,113,0.3);border:2px solid #2ecc71}.result-message.error{background:rgba(231,76,60,0.3);border:2px solid #e74c3c}.game-actions{display:flex;gap:15px;justify-content:center;flex-wrap:wrap}.action-btn{background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.3);border-radius:25px;padding:12px 25px;color:white;cursor:pointer;transition:all 0.3s ease;font-weight:500}.action-btn:hover{background:rgba(255,255,255,0.3);transform:translateY(-2px)}.action-btn.danger{border-color:#E74C3C;color:#E74C3C}.action-btn.danger:hover{background:rgba(231,76,60,0.2)}@media (max-width:768px){.word-master-game{padding:15px;margin:10px}.game-title{font-size:2rem}.category-grid{grid-template-columns:repeat(2,1fr)}.difficulty-buttons{flex-direction:column;align-items:center}.game-controls{flex-direction:column}.game-actions{flex-direction:column}.word-blanks{gap:5px}.word-blank{width:35px;height:35px;font-size:1rem}}
            </style>

            <div class="word-master-game">
                <div class="game-header">
                    <h1 class="game-title">🎯 AI Kelime Ustası</h1>
                    <p class="game-subtitle">AI'nin ipuçları ile gizli kelimeleri tahmin edin</p>
                </div>

                <div class="game-setup" id="gameSetup">
                    <div class="setup-section">
                        <label class="setup-label">Kategori Seçin:</label>
                        <div class="category-grid">
                            <button class="category-btn active" data-category="animals">🐾 Hayvanlar</button>
                            <button class="category-btn" data-category="professions">👔 Meslekler</button>
                            <button class="category-btn" data-category="technology">💻 Teknoloji</button>
                            <button class="category-btn" data-category="food">🍕 Yiyecek</button>
                        </div>
                    </div>

                    <div class="setup-section">
                        <label class="setup-label">Zorluk Seviyesi:</label>
                        <div class="difficulty-buttons">
                            <button class="difficulty-btn" data-difficulty="easy">🟢 Kolay</button>
                            <button class="difficulty-btn active" data-difficulty="medium">🟡 Orta</button>
                            <button class="difficulty-btn" data-difficulty="hard">🔴 Zor</button>
                        </div>
                    </div>

                    <button class="start-game-btn" id="startGameBtn">🎮 Oyunu Başlat</button>
                </div>

                <div class="game-interface" id="gameInterface">
                    <div class="game-progress">
                        <div class="progress-info">
                            <div class="progress-label">Tur</div>
                            <div class="progress-value" id="currentRound">1</div>
                        </div>
                        <div class="progress-info">
                            <div class="progress-label">Puan</div>
                            <div class="progress-value" id="currentScore">0</div>
                        </div>
                        <div class="progress-info">
                            <div class="progress-label">İpucu</div>
                            <div class="progress-value" id="hintsUsed">0/3</div>
                        </div>
                    </div>

                    <div class="word-display">
                        <div class="word-length" id="wordLength">5 harfli kelime</div>
                        <div class="word-blanks" id="wordBlanks"></div>
                        
                        <div class="loading-indicator" id="loadingIndicator">
                            <p id="loadingText">AI hazırlıyor...</p>
                            <div class="loading-dots">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>

                    <div class="hints-section">
                        <div class="hints-title">🔍 İpuçları</div>
                        <ul class="hints-list" id="hintsList">
                            <li class="hint-item locked">İpucu 1: "İpucu Al" butonuna tıklayın</li>
                            <li class="hint-item locked">İpucu 2: Daha açık ipucu</li>
                            <li class="hint-item locked">İpucu 3: Çok açık ipucu</li>
                        </ul>
                    </div>

                    <div class="guess-section">
                        <input type="text" class="guess-input" id="guessInput" placeholder="Tahmininizi yazın..." maxlength="20">
                        <div class="game-controls">
                            <button class="control-btn primary" id="submitGuessBtn">✅ Tahmin Et</button>
                            <button class="control-btn" id="getHintBtn">💡 İpucu Al</button>
                            <button class="control-btn" id="skipWordBtn">⏭️ Kelimeyi Geç</button>
                        </div>
                    </div>

                    <div class="result-message" id="resultMessage" style="display: none;"></div>

                    <div class="game-actions">
                        <button class="action-btn" id="nextRoundBtn" style="display: none;">🎯 Sonraki Tur</button>
                        <button class="action-btn danger" id="restartGameBtn">🔄 Yeniden Başla</button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        this.container.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category;
            });
        });

        this.container.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.difficulty;
            });
        });

        this.container.querySelector('#startGameBtn').addEventListener('click', async () => await this.startGame());
        this.container.querySelector('#submitGuessBtn').addEventListener('click', async () => await this.submitGuess());
        this.container.querySelector('#getHintBtn').addEventListener('click', async () => await this.getHint());
        this.container.querySelector('#skipWordBtn').addEventListener('click', async () => await this.skipWord());
        this.container.querySelector('#nextRoundBtn').addEventListener('click', async () => await this.nextRound());
        this.container.querySelector('#restartGameBtn').addEventListener('click', () => this.restartGame());

        this.container.querySelector('#guessInput').addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') await this.submitGuess();
        });
    }

    async startGame() {
        this.gameActive = true;
        this.score = 0;
        this.round = 1;
        
        this.container.querySelector('#gameSetup').style.display = 'none';
        this.container.querySelector('#gameInterface').classList.add('active');
        await this.startRound();
    }

    async startRound() {
        this.hintsUsed = 0;
        this.currentHints = [];
        this.showLoading('AI kelime seçiyor...');
        
        try {
            this.currentWord = await this.selectRandomWord();
            this.updateProgressDisplay();
            this.displayWordBlanks();
            this.resetHints();
            this.hideResult();
            
            this.container.querySelector('#guessInput').value = '';
            this.container.querySelector('#guessInput').focus();
        } catch (error) {
            console.error('Kelime seçimi hatası:', error);
            this.showResult('Kelime yüklenirken hata oluştu. Tekrar deneyin.', 'error');
        }
        
        this.hideLoading();
    }

    async selectRandomWord() {
        const categoryName = this.categoryPrompts[this.currentCategory];
        const difficultyName = this.difficultyPrompts[this.difficulty];
        
        const prompt = `${categoryName} kategorisinden ${difficultyName} seviyesinde Türkçe bir kelime seç. Sadece kelimeyi ver, başka açıklama yapma. Kelime tek kelime olsun ve yaygın kullanılan bir kelime olsun. Özel isim olmasın.`;
        
        try {
            const response = await this.callGeminiAPI(prompt);
            const word = response.trim().toLowerCase().replace(/[^a-zçğıöşüâîû]/g, '');
            
            if (word && word.length >= 3) {
                return word;
            } else {
                throw new Error('Geçersiz kelime');
            }
        } catch (error) {
            console.error('Gemini API hatası:', error);
            // Fallback olarak basit kelimeler
            const fallbackWords = {
                animals: ['kedi', 'köpek', 'kuş', 'balık'],
                professions: ['doktor', 'öğretmen', 'polis', 'aşçı'],
                technology: ['bilgisayar', 'telefon', 'tablet'],
                food: ['ekmek', 'elma', 'patates', 'domates']
            };
            const words = fallbackWords[this.currentCategory] || ['kelime'];
            return words[Math.floor(Math.random() * words.length)];
        }
    }

    displayWordBlanks() {
        const wordBlanks = this.container.querySelector('#wordBlanks');
        const wordLength = this.container.querySelector('#wordLength');
        
        wordLength.textContent = `${this.currentWord.length} harfli kelime`;
        
        wordBlanks.innerHTML = '';
        for (let i = 0; i < this.currentWord.length; i++) {
            const blank = document.createElement('div');
            blank.className = 'word-blank';
            blank.textContent = '_';
            wordBlanks.appendChild(blank);
        }
    }

    resetHints() {
        const hintsList = this.container.querySelector('#hintsList');
        hintsList.innerHTML = `
            <li class="hint-item locked">İpucu 1: "İpucu Al" butonuna tıklayın</li>
            <li class="hint-item locked">İpucu 2: Daha açık ipucu</li>
            <li class="hint-item locked">İpucu 3: Çok açık ipucu</li>
        `;
    }

    async getHint() {
        if (this.hintsUsed >= 3 || this.isGenerating) return;
        
        this.showLoading('AI ipucu hazırlıyor...');
        this.hintsUsed++;
        
        try {
            const hint = await this.generateDynamicHint();
            this.displayHint(hint, this.hintsUsed);
            this.updateProgressDisplay();
        } catch (error) {
            console.error('İpucu oluşturma hatası:', error);
            // Fallback ipucu
            const fallbackHint = this.generateSimpleHint();
            this.displayHint(fallbackHint, this.hintsUsed);
            this.updateProgressDisplay();
        }
        
        this.hideLoading();
    }

    async generateDynamicHint() {
        const categoryName = this.categoryPrompts[this.currentCategory];
        const hintLevel = this.hintsUsed;
        
        let prompt;
        
        if (hintLevel === 1) {
            prompt = `"${this.currentWord}" kelimesi için çok genel bir ipucu ver. Sadece ${categoryName} kategorisinde olduğunu ve genel bir özelliğini söyle. Kelimenin kendisini söyleme. Maksimum 15 kelime.`;
        } else if (hintLevel === 2) {
            prompt = `"${this.currentWord}" kelimesi için orta seviye ipucu ver. Daha spesifik özelliklerini söyle ama kelimenin kendisini söyleme. Maksimum 20 kelime.`;
        } else {
            prompt = `"${this.currentWord}" kelimesi için çok açık ipucu ver. Neredeyse tahmin edilebilir olacak kadar açık ol ama kelimenin kendisini söyleme. Maksimum 25 kelime.`;
        }
        
        return await this.callGeminiAPI(prompt);
    }

    generateSimpleHint() {
        const hints = {
            1: this.getGeneralHint(),
            2: this.getSpecificHint(),
            3: this.getObviousHint()
        };
        
        return hints[this.hintsUsed] || 'Bu kelimeyi tahmin edebilirsiniz!';
    }

    getGeneralHint() {
        const categoryHints = {
            animals: 'Bu bir hayvan türü',
            professions: 'Bu bir meslek',
            technology: 'Bu teknoloji ile ilgili',
            food: 'Bu yenebilir bir şey'
        };
        return categoryHints[this.currentCategory];
    }

    getSpecificHint() {
        const word = this.currentWord;
        if (word.length <= 5) {
            return `Bu kelime ${word.length} harfli ve "${word[0]}" harfi ile başlar`;
        } else {
            return `Bu kelime ${word.length} harfli ve "${word[0]}" ile başlar, "${word[word.length-1]}" ile biter`;
        }
    }

    getObviousHint() {
        const word = this.currentWord;
        let hint = '';
        for (let i = 0; i < word.length; i++) {
            if (i === 0 || i === word.length - 1 || i === Math.floor(word.length / 2)) {
                hint += word[i];
            } else {
                hint += '_';
            }
        }
        return `Kelime şu şekilde: ${hint}`;
    }

    displayHint(hint, hintNumber) {
        const hintsList = this.container.querySelector('#hintsList');
        const hintItems = hintsList.querySelectorAll('.hint-item');
        
        if (hintItems[hintNumber - 1]) {
            hintItems[hintNumber - 1].classList.remove('locked');
            hintItems[hintNumber - 1].textContent = `İpucu ${hintNumber}: ${hint}`;
        }
    }

    async submitGuess() {
        const guessInput = this.container.querySelector('#guessInput');
        const guess = guessInput.value.trim().toLowerCase();
        
        if (!guess) return;
        
        if (guess === this.currentWord.toLowerCase()) {
            await this.handleCorrectGuess();
        } else {
            this.handleIncorrectGuess();
        }
    }

    async handleCorrectGuess() {
        const baseScore = 100;
        const hintPenalty = this.hintsUsed * 20;
        const roundScore = Math.max(baseScore - hintPenalty, 20);
        
        this.score += roundScore;
        this.revealWord();
        this.showResult(`🎉 Tebrikler! Doğru tahmin! +${roundScore} puan`, 'success');
        
        if (this.round >= this.maxRounds) {
            this.endGame();
        } else {
            this.showNextRoundButton();
        }
    }

    handleIncorrectGuess() {
        this.showResult('❌ Yanlış tahmin! Tekrar deneyin.', 'error');
        this.container.querySelector('#guessInput').value = '';
        this.container.querySelector('#guessInput').focus();
    }

    revealWord() {
        const wordBlanks = this.container.querySelectorAll('.word-blank');
        wordBlanks.forEach((blank, index) => {
            blank.textContent = this.currentWord[index].toUpperCase();
            blank.classList.add('filled');
        });
    }

    async skipWord() {
        this.revealWord();
        this.showResult(`⏭️ Kelime geçildi: "${this.currentWord.toUpperCase()}"`, 'error');
        
        if (this.round >= this.maxRounds) {
            this.endGame();
        } else {
            this.showNextRoundButton();
        }
    }

    showNextRoundButton() {
        this.container.querySelector('#nextRoundBtn').style.display = 'block';
    }

    async nextRound() {
        this.round++;
        this.container.querySelector('#nextRoundBtn').style.display = 'none';
        await this.startRound();
    }

    endGame() {
        const finalScore = this.score;
        const accuracy = (finalScore / (this.maxRounds * 100)) * 100;
        
        let message = `🎯 Oyun Bitti!\n\nToplam Puan: ${finalScore}\nDoğruluk: ${accuracy.toFixed(1)}%`;
        
        if (accuracy >= 80) {
            message += '\n🏆 Mükemmel performans!';
        } else if (accuracy >= 60) {
            message += '\n⭐ İyi performans!';
        } else {
            message += '\n💪 Daha fazla pratik yapın!';
        }
        
        this.showResult(message, 'success');
        this.gameActive = false;
    }

    restartGame() {
        this.container.querySelector('#gameSetup').style.display = 'block';
        this.container.querySelector('#gameInterface').classList.remove('active');
        this.gameActive = false;
        this.score = 0;
        this.round = 1;
        this.hintsUsed = 0;
    }

    showResult(message, type) {
        const resultMessage = this.container.querySelector('#resultMessage');
        resultMessage.textContent = message;
        resultMessage.className = `result-message ${type}`;
        resultMessage.style.display = 'block';
    }

    hideResult() {
        this.container.querySelector('#resultMessage').style.display = 'none';
    }

    updateProgressDisplay() {
        this.container.querySelector('#currentRound').textContent = this.round;
        this.container.querySelector('#currentScore').textContent = this.score;
        this.container.querySelector('#hintsUsed').textContent = `${this.hintsUsed}/3`;
    }

    showLoading(message = 'AI hazırlıyor...') {
        this.isGenerating = true;
        this.container.querySelector('#loadingText').textContent = message;
        this.container.querySelector('#loadingIndicator').classList.add('active');
    }

    hideLoading() {
        this.isGenerating = false;
        this.container.querySelector('#loadingIndicator').classList.remove('active');
    }

    async callGeminiAPI(prompt) {
        try {
            const response = await fetch(this.geminiApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0) {
                const text = data.candidates[0].content.parts[0].text;
                return text.trim();
            } else {
                throw new Error('No response from Gemini API');
            }
        } catch (error) {
            console.error('Gemini API call failed:', error);
            throw error;
        }
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

window.WordMasterGame = WordMasterGame; 