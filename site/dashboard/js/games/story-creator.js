class StoryCreatorGame {
    constructor(container) {
        this.container = container;
        this.currentStory = '';
        this.storyHistory = [];
        this.currentChapter = 1;
        this.maxChapters = 10;
        this.genre = 'fantasy';
        this.tone = 'adventure';
        this.characters = [];
        this.gameActive = false;
        this.isGenerating = false;
        
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <style>
                .story-game{max-width:900px;margin:0 auto;padding:20px;font-family:'Inter',sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:20px;color:white;min-height:600px}.story-header{text-align:center;margin-bottom:30px}.story-title{font-size:2.5rem;font-weight:700;margin-bottom:10px;background:linear-gradient(45deg,#FFD700,#FFA500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.story-subtitle{font-size:1.1rem;opacity:0.9;margin-bottom:20px}.game-setup{background:rgba(255,255,255,0.1);border-radius:15px;padding:30px;margin-bottom:20px;backdrop-filter:blur(10px)}.setup-section{margin-bottom:25px}.setup-label{font-size:1.1rem;font-weight:600;margin-bottom:10px;display:block}.genre-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:20px}.genre-btn{background:rgba(255,255,255,0.2);border:2px solid transparent;border-radius:10px;padding:15px;color:white;cursor:pointer;transition:all 0.3s ease;text-align:center;font-weight:500;font-size:0.9rem}.genre-btn:hover{background:rgba(255,255,255,0.3);transform:translateY(-2px)}.genre-btn.active{background:rgba(255,215,0,0.3);border-color:#FFD700;box-shadow:0 0 20px rgba(255,215,0,0.3)}.tone-buttons{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.tone-btn{background:rgba(255,255,255,0.2);border:2px solid transparent;border-radius:25px;padding:10px 20px;color:white;cursor:pointer;transition:all 0.3s ease;font-weight:500}.tone-btn.active{background:rgba(255,215,0,0.3);border-color:#FFD700}.start-story-btn{background:linear-gradient(45deg,#FFD700,#FFA500);border:none;border-radius:25px;padding:15px 40px;font-size:1.2rem;font-weight:600;color:#333;cursor:pointer;transition:all 0.3s ease;display:block;margin:20px auto 0}.start-story-btn:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(255,215,0,0.3)}.story-interface{display:none}.story-interface.active{display:block}.story-progress{display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.1);border-radius:15px;padding:20px;margin-bottom:20px}.progress-info{text-align:center}.progress-label{font-size:0.9rem;opacity:0.8;margin-bottom:5px}.progress-value{font-size:1.2rem;font-weight:700}.story-display{background:rgba(255,255,255,0.1);border-radius:15px;padding:30px;margin-bottom:20px;backdrop-filter:blur(10px);min-height:300px}.story-content{font-size:1.1rem;line-height:1.8;margin-bottom:20px;white-space:pre-wrap}.story-content.generating{opacity:0.7}.chapter-title{font-size:1.4rem;font-weight:700;margin-bottom:15px;color:#FFD700}.loading-indicator{display:none;text-align:center;padding:20px}.loading-indicator.active{display:block}.loading-dots{display:inline-block;position:relative;width:80px;height:20px}.loading-dots div{position:absolute;top:8px;width:6px;height:6px;border-radius:50%;background:#FFD700;animation:loading 1.2s linear infinite}.loading-dots div:nth-child(1){left:8px;animation-delay:0s}.loading-dots div:nth-child(2){left:32px;animation-delay:-0.4s}.loading-dots div:nth-child(3){left:56px;animation-delay:-0.8s}@keyframes loading{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}.story-controls{display:flex;gap:15px;justify-content:center;margin-bottom:20px}.control-btn{background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.3);border-radius:10px;padding:12px 20px;color:white;cursor:pointer;transition:all 0.3s ease;font-weight:500}.control-btn:hover{background:rgba(255,255,255,0.3);transform:translateY(-2px)}.control-btn.primary{background:linear-gradient(45deg,#FFD700,#FFA500);border-color:#FFD700;color:#333}.control-btn.primary:hover{box-shadow:0 5px 15px rgba(255,215,0,0.3)}.control-btn:disabled{opacity:0.5;cursor:not-allowed}.choice-section{background:rgba(255,255,255,0.1);border-radius:15px;padding:25px;margin-bottom:20px}.choice-title{font-size:1.2rem;font-weight:600;margin-bottom:15px;text-align:center}.choices-grid{display:grid;gap:10px}.choice-btn{background:rgba(255,255,255,0.2);border:2px solid transparent;border-radius:10px;padding:15px;color:white;cursor:pointer;transition:all 0.3s ease;text-align:left;font-weight:500}.choice-btn:hover{background:rgba(255,255,255,0.3);border-color:rgba(255,255,255,0.5);transform:translateY(-2px)}.choice-btn.selected{background:rgba(255,215,0,0.3);border-color:#FFD700}.story-input{background:rgba(255,255,255,0.1);border-radius:15px;padding:25px;margin-bottom:20px}.input-label{font-size:1.1rem;font-weight:600;margin-bottom:10px}.story-textarea{width:100%;min-height:100px;padding:15px;border:none;border-radius:10px;background:rgba(255,255,255,0.9);color:#333;font-size:1rem;resize:vertical;font-family:inherit}.story-textarea::placeholder{color:#666}.story-textarea:focus{outline:none;box-shadow:0 0 0 2px #FFD700}.character-panel{background:rgba(255,255,255,0.1);border-radius:15px;padding:20px;margin-bottom:20px}.character-title{font-size:1.1rem;font-weight:600;margin-bottom:15px}.character-list{display:flex;flex-wrap:wrap;gap:10px}.character-tag{background:rgba(255,215,0,0.3);border:1px solid #FFD700;border-radius:20px;padding:5px 12px;font-size:0.9rem;font-weight:500}.story-actions{display:flex;gap:15px;justify-content:center;flex-wrap:wrap}.action-btn{background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.3);border-radius:25px;padding:12px 25px;color:white;cursor:pointer;transition:all 0.3s ease;font-weight:500}.action-btn:hover{background:rgba(255,255,255,0.3);transform:translateY(-2px)}.action-btn.danger{border-color:#E74C3C;color:#E74C3C}.action-btn.danger:hover{background:rgba(231,76,60,0.2)}@media (max-width:768px){.story-game{padding:15px;margin:10px}.story-title{font-size:2rem}.genre-grid{grid-template-columns:repeat(2,1fr)}.tone-buttons{flex-direction:column;align-items:center}.story-controls{flex-direction:column}.story-actions{flex-direction:column}}
            </style>

            <div class="story-game">
                <div class="story-header">
                    <h1 class="story-title">📚 AI Hikaye Yaratıcısı</h1>
                    <p class="story-subtitle">AI ile birlikte benzersiz hikayeler oluşturun</p>
                </div>

                <!-- Game Setup -->
                <div class="game-setup" id="gameSetup">
                    <div class="setup-section">
                        <label class="setup-label">Hikaye Türü Seçin:</label>
                        <div class="genre-grid">
                            <button class="genre-btn active" data-genre="fantasy">🧙‍♂️ Fantastik</button>
                            <button class="genre-btn" data-genre="scifi">🚀 Bilim Kurgu</button>
                            <button class="genre-btn" data-genre="mystery">🔍 Gizem</button>
                            <button class="genre-btn" data-genre="romance">💕 Romantik</button>
                            <button class="genre-btn" data-genre="adventure">⚔️ Macera</button>
                            <button class="genre-btn" data-genre="horror">👻 Korku</button>
                            <button class="genre-btn" data-genre="comedy">😄 Komedi</button>
                            <button class="genre-btn" data-genre="drama">🎭 Drama</button>
                        </div>
                    </div>

                    <div class="setup-section">
                        <label class="setup-label">Hikaye Tonu:</label>
                        <div class="tone-buttons">
                            <button class="tone-btn active" data-tone="adventure">Macera Dolu</button>
                            <button class="tone-btn" data-tone="mysterious">Gizemli</button>
                            <button class="tone-btn" data-tone="humorous">Eğlenceli</button>
                            <button class="tone-btn" data-tone="dramatic">Dramatik</button>
                            <button class="tone-btn" data-tone="romantic">Romantik</button>
                        </div>
                    </div>

                    <button class="start-story-btn" id="startStoryBtn">🎬 Hikayeyi Başlat</button>
                </div>

                <!-- Story Interface -->
                <div class="story-interface" id="storyInterface">
                    <div class="story-progress">
                        <div class="progress-info">
                            <div class="progress-label">Bölüm</div>
                            <div class="progress-value" id="currentChapter">1</div>
                        </div>
                        <div class="progress-info">
                            <div class="progress-label">Tür</div>
                            <div class="progress-value" id="currentGenre">Fantastik</div>
                        </div>
                        <div class="progress-info">
                            <div class="progress-label">Kelime Sayısı</div>
                            <div class="progress-value" id="wordCount">0</div>
                        </div>
                    </div>

                    <div class="character-panel" id="characterPanel">
                        <div class="character-title">Karakterler:</div>
                        <div class="character-list" id="characterList">
                            <span class="character-tag">Henüz karakter yok</span>
                        </div>
                    </div>

                    <div class="story-display">
                        <div class="chapter-title" id="chapterTitle">Bölüm 1: Başlangıç</div>
                        <div class="story-content" id="storyContent">Hikayeniz burada görünecek...</div>
                        
                        <div class="loading-indicator" id="loadingIndicator">
                            <p>AI hikayenizi yazıyor...</p>
                            <div class="loading-dots">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>

                    <div class="story-controls">
                        <button class="control-btn primary" id="continueStoryBtn">📝 Hikayeyi Devam Ettir</button>
                        <button class="control-btn" id="addTwistBtn">🌪️ Plot Twist Ekle</button>
                        <button class="control-btn" id="addCharacterBtn">👤 Karakter Ekle</button>
                        <button class="control-btn" id="changeDirectionBtn">🔄 Yön Değiştir</button>
                    </div>

                    <div class="choice-section" id="choiceSection" style="display: none;">
                        <div class="choice-title">Hikayeniz nasıl devam etsin?</div>
                        <div class="choices-grid" id="choicesGrid">
                            <!-- Choices will be populated here -->
                        </div>
                    </div>

                    <div class="story-input" id="storyInput" style="display: none;">
                        <label class="input-label">Hikayeye kendi dokunuşunuzu ekleyin:</label>
                        <textarea class="story-textarea" id="userInput" placeholder="Hikayenizde ne olmasını istiyorsunuz? Karakterler, olaylar, diyaloglar ekleyebilirsiniz..."></textarea>
                        <div class="story-controls" style="margin-top: 15px;">
                            <button class="control-btn primary" id="submitInputBtn">✨ Hikayeye Ekle</button>
                            <button class="control-btn" id="cancelInputBtn">❌ İptal</button>
                        </div>
                    </div>

                    <div class="story-actions">
                        <button class="action-btn" id="saveStoryBtn">💾 Hikayeyi Kaydet</button>
                        <button class="action-btn" id="shareStoryBtn">📤 Paylaş</button>
                        <button class="action-btn" id="exportStoryBtn">📄 Dışa Aktar</button>
                        <button class="action-btn danger" id="restartStoryBtn">🔄 Yeniden Başla</button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Genre selection
        this.container.querySelectorAll('.genre-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.genre = btn.dataset.genre;
            });
        });

        // Tone selection
        this.container.querySelectorAll('.tone-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.tone-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.tone = btn.dataset.tone;
            });
        });

        // Start story
        this.container.querySelector('#startStoryBtn').addEventListener('click', () => {
            this.startStory();
        });

        // Story controls
        this.container.querySelector('#continueStoryBtn').addEventListener('click', () => {
            this.continueStory();
        });

        this.container.querySelector('#addTwistBtn').addEventListener('click', () => {
            this.addPlotTwist();
        });

        this.container.querySelector('#addCharacterBtn').addEventListener('click', () => {
            this.addCharacter();
        });

        this.container.querySelector('#changeDirectionBtn').addEventListener('click', () => {
            this.changeDirection();
        });

        // Input controls
        this.container.querySelector('#submitInputBtn').addEventListener('click', () => {
            this.submitUserInput();
        });

        this.container.querySelector('#cancelInputBtn').addEventListener('click', () => {
            this.hideUserInput();
        });

        // Action buttons
        this.container.querySelector('#saveStoryBtn').addEventListener('click', () => {
            this.saveStory();
        });

        this.container.querySelector('#shareStoryBtn').addEventListener('click', () => {
            this.shareStory();
        });

        this.container.querySelector('#exportStoryBtn').addEventListener('click', () => {
            this.exportStory();
        });

        this.container.querySelector('#restartStoryBtn').addEventListener('click', () => {
            this.restartStory();
        });
    }

    async startStory() {
        this.gameActive = true;
        this.currentChapter = 1;
        this.currentStory = '';
        this.storyHistory = [];
        this.characters = [];
        
        // Hide setup and show interface
        this.container.querySelector('#gameSetup').style.display = 'none';
        this.container.querySelector('#storyInterface').classList.add('active');
        
        // Update UI
        this.updateProgressDisplay();
        
        // Generate initial story
        await this.generateInitialStory();
    }

    async generateInitialStory() {
        this.showLoading();
        
        const genreNames = {
            fantasy: 'fantastik',
            scifi: 'bilim kurgu',
            mystery: 'gizem',
            romance: 'romantik',
            adventure: 'macera',
            horror: 'korku',
            comedy: 'komedi',
            drama: 'drama'
        };

        const toneNames = {
            adventure: 'macera dolu',
            mysterious: 'gizemli',
            humorous: 'eğlenceli',
            dramatic: 'dramatik',
            romantic: 'romantik'
        };

        const prompt = `${genreNames[this.genre]} türünde ${toneNames[this.tone]} bir hikayenin başlangıcını yaz. Hikaye yaklaşık 200-300 kelime olsun ve okuyucuyu hikayeye çeksin. Ana karakteri tanıt ve ilginç bir durumla başla. Hikayeyi Türkçe yaz.`;

        try {
            const story = await this.callGeminiAPI(prompt);
            this.currentStory = story;
            this.storyHistory.push({
                chapter: this.currentChapter,
                content: story,
                type: 'initial'
            });
            
            this.displayStory(story);
            this.extractCharacters(story);
            this.hideLoading();
        } catch (error) {
            console.error('Hikaye oluşturma hatası:', error);
            this.hideLoading();
            this.displayStory('Hikaye oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }

    async continueStory() {
        if (this.isGenerating) return;
        
        this.showLoading();
        
        const prompt = `Şu hikayeyi devam ettir:\n\n${this.currentStory}\n\nHikayeyi doğal bir şekilde devam ettir, yaklaşık 150-200 kelime ekle. Mevcut karakterleri ve hikaye akışını koru.`;
        
        try {
            const continuation = await this.callGeminiAPI(prompt);
            this.currentStory += '\n\n' + continuation;
            this.storyHistory.push({
                chapter: this.currentChapter,
                content: continuation,
                type: 'continuation'
            });
            
            this.displayStory(this.currentStory);
            this.extractCharacters(continuation);
            this.hideLoading();
        } catch (error) {
            console.error('Hikaye devam ettirme hatası:', error);
            this.hideLoading();
        }
    }

    async addPlotTwist() {
        if (this.isGenerating) return;
        
        this.showLoading();
        
        const prompt = `Şu hikayeye beklenmedik bir plot twist ekle:\n\n${this.currentStory}\n\nHikayeyi tamamen değiştirecek sürpriz bir gelişme ekle. Yaklaşık 100-150 kelime.`;
        
        try {
            const twist = await this.callGeminiAPI(prompt);
            this.currentStory += '\n\n' + twist;
            this.storyHistory.push({
                chapter: this.currentChapter,
                content: twist,
                type: 'twist'
            });
            
            this.displayStory(this.currentStory);
            this.extractCharacters(twist);
            this.hideLoading();
        } catch (error) {
            console.error('Plot twist ekleme hatası:', error);
            this.hideLoading();
        }
    }

    async addCharacter() {
        if (this.isGenerating) return;
        
        this.showLoading();
        
        const prompt = `Şu hikayeye yeni bir karakter ekle:\n\n${this.currentStory}\n\nHikayeye uygun yeni bir karakter tanıt ve hikayeye dahil et. Yaklaşık 100-150 kelime.`;
        
        try {
            const newCharacter = await this.callGeminiAPI(prompt);
            this.currentStory += '\n\n' + newCharacter;
            this.storyHistory.push({
                chapter: this.currentChapter,
                content: newCharacter,
                type: 'character'
            });
            
            this.displayStory(this.currentStory);
            this.extractCharacters(newCharacter);
            this.hideLoading();
        } catch (error) {
            console.error('Karakter ekleme hatası:', error);
            this.hideLoading();
        }
    }

    async changeDirection() {
        this.showUserInput();
    }

    async submitUserInput() {
        const userInput = this.container.querySelector('#userInput').value.trim();
        if (!userInput) return;
        
        this.hideUserInput();
        this.showLoading();
        
        const prompt = `Şu hikayeyi kullanıcının isteğine göre devam ettir:\n\nHikaye:\n${this.currentStory}\n\nKullanıcı isteği: ${userInput}\n\nKullanıcının isteğini hikayeye uygun şekilde dahil et ve hikayeyi devam ettir. Yaklaşık 150-200 kelime.`;
        
        try {
            const userDirectedStory = await this.callGeminiAPI(prompt);
            this.currentStory += '\n\n' + userDirectedStory;
            this.storyHistory.push({
                chapter: this.currentChapter,
                content: userDirectedStory,
                type: 'user_directed',
                userInput: userInput
            });
            
            this.displayStory(this.currentStory);
            this.extractCharacters(userDirectedStory);
            this.hideLoading();
            
            // Clear input
            this.container.querySelector('#userInput').value = '';
        } catch (error) {
            console.error('Kullanıcı yönlendirmeli hikaye hatası:', error);
            this.hideLoading();
        }
    }

    extractCharacters(text) {
        // Simple character extraction - look for capitalized names
        const words = text.split(/\s+/);
        const potentialCharacters = words.filter(word => {
            return /^[A-ZÇĞIÖŞÜ][a-zçğıöşü]+$/.test(word) && 
                   word.length > 2 && 
                   !['Bir', 'Bu', 'Şu', 'O', 'Ve', 'Ama', 'Fakat', 'Ancak', 'Sonra', 'Önce'].includes(word);
        });
        
        potentialCharacters.forEach(char => {
            if (!this.characters.includes(char)) {
                this.characters.push(char);
            }
        });
        
        this.updateCharacterDisplay();
    }

    updateCharacterDisplay() {
        const characterList = this.container.querySelector('#characterList');
        if (this.characters.length === 0) {
            characterList.innerHTML = '<span class="character-tag">Henüz karakter yok</span>';
        } else {
            characterList.innerHTML = this.characters.map(char => 
                `<span class="character-tag">${char}</span>`
            ).join('');
        }
    }

    displayStory(story) {
        const storyContent = this.container.querySelector('#storyContent');
        storyContent.textContent = story;
        this.updateWordCount();
    }

    updateWordCount() {
        const wordCount = this.currentStory.split(/\s+/).filter(word => word.length > 0).length;
        this.container.querySelector('#wordCount').textContent = wordCount;
    }

    updateProgressDisplay() {
        this.container.querySelector('#currentChapter').textContent = this.currentChapter;
        
        const genreNames = {
            fantasy: 'Fantastik',
            scifi: 'Bilim Kurgu',
            mystery: 'Gizem',
            romance: 'Romantik',
            adventure: 'Macera',
            horror: 'Korku',
            comedy: 'Komedi',
            drama: 'Drama'
        };
        
        this.container.querySelector('#currentGenre').textContent = genreNames[this.genre];
    }

    showLoading() {
        this.isGenerating = true;
        this.container.querySelector('#loadingIndicator').classList.add('active');
        this.container.querySelector('#storyContent').classList.add('generating');
        
        // Disable controls
        this.container.querySelectorAll('.control-btn').forEach(btn => {
            btn.disabled = true;
        });
    }

    hideLoading() {
        this.isGenerating = false;
        this.container.querySelector('#loadingIndicator').classList.remove('active');
        this.container.querySelector('#storyContent').classList.remove('generating');
        
        // Enable controls
        this.container.querySelectorAll('.control-btn').forEach(btn => {
            btn.disabled = false;
        });
    }

    showUserInput() {
        this.container.querySelector('#storyInput').style.display = 'block';
        this.container.querySelector('#userInput').focus();
    }

    hideUserInput() {
        this.container.querySelector('#storyInput').style.display = 'none';
    }

    saveStory() {
        const storyData = {
            title: `${this.genre.charAt(0).toUpperCase() + this.genre.slice(1)} Hikayesi`,
            genre: this.genre,
            tone: this.tone,
            content: this.currentStory,
            characters: this.characters,
            history: this.storyHistory,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem(`story_${Date.now()}`, JSON.stringify(storyData));
        this.showMessage('Hikaye başarıyla kaydedildi!');
    }

    shareStory() {
        if (navigator.share) {
            navigator.share({
                title: 'AI ile Oluşturduğum Hikaye',
                text: this.currentStory.substring(0, 200) + '...',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(this.currentStory).then(() => {
                this.showMessage('Hikaye panoya kopyalandı!');
            });
        }
    }

    exportStory() {
        const storyText = `${this.genre.charAt(0).toUpperCase() + this.genre.slice(1)} Hikayesi\n\n${this.currentStory}\n\nKarakterler: ${this.characters.join(', ')}\n\nAI Hikaye Yaratıcısı ile oluşturuldu.`;
        
        const blob = new Blob([storyText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hikaye_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showMessage('Hikaye dosya olarak indirildi!');
    }

    restartStory() {
        if (confirm('Hikayeyi yeniden başlatmak istediğinizden emin misiniz? Mevcut hikaye kaybolacak.')) {
            this.container.querySelector('#storyInterface').classList.remove('active');
            this.container.querySelector('#gameSetup').style.display = 'block';
            
            // Reset game state
            this.currentStory = '';
            this.storyHistory = [];
            this.currentChapter = 1;
            this.characters = [];
            this.gameActive = false;
        }
    }

    showMessage(message) {
        // Create a simple toast message
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #FFD700, #FFA500);
            color: #333;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    async callGeminiAPI(message) {
        const GEMINI_API_KEY = 'AIzaSyBscfSecswV2hdqaRtA4IXHSR7xWsr6OJw';
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;
        
        try {
            const requestBody = {
                contents: [{
                    parts: [{
                        text: message
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            };
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Geçersiz API yanıtı');
            }
            
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }
}

// Export for use in games.js
if (typeof window !== 'undefined') {
    window.StoryCreatorGame = StoryCreatorGame;
}