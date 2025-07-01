class TriviaGame {
    constructor(container) {
        this.container = container;
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 15;
        this.timer = null;
        this.gameActive = false;
        this.questions = [];
        this.selectedCategory = 'mixed';
        this.difficulty = 'medium';
        this.gameMode = 'single'; // single, multiplayer
        this.playerName = 'Oyuncu';
        this.jokers = {
            fiftyFifty: 1,
            timeStop: 1,
            categoryChange: 1
        };
        this.combo = 0;
        this.maxCombo = 0;
        this.totalQuestions = 10;
        
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
        this.loadQuestions();
    }

    async loadQuestions() {
        try {
            // Gemini API'sini kullanarak sorular oluştur
            this.questions = await this.generateQuestionsWithAI();
        } catch (error) {
            console.error('AI ile soru oluşturma hatası:', error);
            // Yedek sorular kullan
            this.questions = this.getFallbackQuestions();
        }
    }

    async generateQuestionsWithAI() {
        const categoryNames = {
            'general': 'Genel Kültür',
            'science': 'Bilim ve Teknoloji',
            'sports': 'Spor',
            'entertainment': 'Eğlence ve Sanat',
            'history': 'Tarih',
            'mixed': 'Karışık Konular'
        };

        const difficultyNames = {
            'easy': 'kolay',
            'medium': 'orta',
            'hard': 'zor'
        };

        const prompt = `${this.totalQuestions} adet ${difficultyNames[this.difficulty]} seviyesinde ${categoryNames[this.selectedCategory]} kategorisinde çoktan seçmeli soru oluştur. Her soru için 4 seçenek olsun ve doğru cevabı belirt. Sonucu JSON formatında ver:

{
  "questions": [
    {
      "question": "Soru metni",
      "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği"],
      "correct": 0,
      "explanation": "Doğru cevabın açıklaması"
    }
  ]
}

Sadece JSON formatında cevap ver, başka açıklama ekleme.`;

        try {
            // ChatManager'dan Gemini API'sini kullan
            if (window.chatManager && typeof window.chatManager.callGeminiAPI === 'function') {
                const response = await window.chatManager.callGeminiAPI(prompt);
                const data = JSON.parse(response);
                return data.questions;
            } else {
                throw new Error('ChatManager bulunamadı');
            }
        } catch (error) {
            console.error('Gemini API hatası:', error);
            throw error;
        }
    }

    getFallbackQuestions() {
        const fallbackQuestions = {
            general: [
                {
                    question: "Türkiye'nin başkenti neresidir?",
                    options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
                    correct: 1,
                    explanation: "Türkiye'nin başkenti 1923'ten beri Ankara'dır."
                },
                {
                    question: "Dünya'nın en büyük okyanusu hangisidir?",
                    options: ["Atlantik", "Hint", "Pasifik", "Arktik"],
                    correct: 2,
                    explanation: "Pasifik Okyanusu, dünya yüzeyinin yaklaşık üçte birini kaplar."
                }
            ],
            science: [
                {
                    question: "Işık hızı saniyede kaç kilometredir?",
                    options: ["300.000 km", "150.000 km", "450.000 km", "600.000 km"],
                    correct: 0,
                    explanation: "Işık hızı vakumda saniyede yaklaşık 300.000 kilometredir."
                }
            ],
            sports: [
                {
                    question: "Futbolda bir maç kaç dakika sürer?",
                    options: ["80 dakika", "90 dakika", "100 dakika", "120 dakika"],
                    correct: 1,
                    explanation: "Futbol maçı 90 dakika sürer (2x45 dakika)."
                }
            ]
        };

        const categoryQuestions = fallbackQuestions[this.selectedCategory] || fallbackQuestions.general;
        const questions = [];
        
        for (let i = 0; i < this.totalQuestions; i++) {
            questions.push(categoryQuestions[i % categoryQuestions.length]);
        }
        
        return questions;
    }

    render() {
        this.container.innerHTML = `
            <style>
                ::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:rgba(255,255,255,0.1);border-radius:10px}::-webkit-scrollbar-thumb{background:linear-gradient(135deg,#FFD700,#FFA500);border-radius:10px;box-shadow:0 2px 10px rgba(255,215,0,0.3)}::-webkit-scrollbar-thumb:hover{background:linear-gradient(135deg,#FFA500,#FF8C00);box-shadow:0 4px 15px rgba(255,140,0,0.4)}*{scrollbar-width:thin;scrollbar-color:#FFD700 rgba(255,255,255,0.1)}.rooms-container::-webkit-scrollbar,.modal-content::-webkit-scrollbar{width:6px}.rooms-container::-webkit-scrollbar-track,.modal-content::-webkit-scrollbar-track{background:rgba(255,255,255,0.05);border-radius:8px}.rooms-container::-webkit-scrollbar-thumb,.modal-content::-webkit-scrollbar-thumb{background:linear-gradient(135deg,rgba(255,215,0,0.6),rgba(255,165,0,0.6));border-radius:8px;box-shadow:0 2px 8px rgba(255,215,0,0.2)}.rooms-container::-webkit-scrollbar-thumb:hover,.modal-content::-webkit-scrollbar-thumb:hover{background:linear-gradient(135deg,rgba(255,215,0,0.8),rgba(255,165,0,0.8));box-shadow:0 3px 12px rgba(255,215,0,0.3)}.results-stats::-webkit-scrollbar{width:4px}.results-stats::-webkit-scrollbar-track{background:transparent}.results-stats::-webkit-scrollbar-thumb{background:rgba(255,215,0,0.4);border-radius:6px}
                
.results-stats::-webkit-scrollbar-thumb:hover{background:rgba(255,215,0,0.6)}
                
                .quiz-game{max-width:800px;margin:0 auto;padding:20px;font-family:'Inter',sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:20px;color:white;min-height:600px}.quiz-header{text-align:center;margin-bottom:30px}.quiz-title{font-size:2.5rem;font-weight:700;margin-bottom:10px;background:linear-gradient(45deg,#FFD700,#FFA500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.quiz-subtitle{font-size:1.1rem;opacity:0.9;margin-bottom:20px}.game-setup{background:rgba(255,255,255,0.1);border-radius:15px;padding:30px;margin-bottom:20px;backdrop-filter:blur(10px)}.setup-section{margin-bottom:25px}.setup-label{font-size:1.1rem;font-weight:600;margin-bottom:10px;display:block}.category-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:20px}.category-btn{background:rgba(255,255,255,0.2);border:2px solid transparent;border-radius:10px;padding:15px;color:white;cursor:pointer;transition:all 0.3s ease;text-align:center;font-weight:500}.category-btn:hover{background:rgba(255,255,255,0.3);transform:translateY(-2px)}.category-btn.active{background:rgba(255,215,0,0.3);border-color:#FFD700;box-shadow:0 0 20px rgba(255,215,0,0.3)}.difficulty-buttons{display:flex;gap:10px;justify-content:center}.difficulty-btn{background:rgba(255,255,255,0.2);border:2px solid transparent;border-radius:25px;padding:10px 20px;color:white;cursor:pointer;transition:all 0.3s ease;font-weight:500}.difficulty-btn.active{background:rgba(255,215,0,0.3);border-color:#FFD700}.game-mode-buttons{display:flex;gap:10px;justify-content:center}.mode-btn{background:rgba(255,255,255,0.2);border:2px solid transparent;border-radius:25px;padding:10px 20px;color:white;cursor:pointer;transition:all 0.3s ease;font-weight:500}.mode-btn.active{background:rgba(255,215,0,0.3);border-color:#FFD700}.start-game-btn{background:linear-gradient(45deg,#FFD700,#FFA500);border:none;border-radius:25px;padding:15px 40px;font-size:1.2rem;font-weight:600;color:#333;cursor:pointer;transition:all 0.3s ease;display:block;margin:20px auto 0}.start-game-btn:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(255,215,0,0.3)}.multiplayer-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(5px)}.modal-content{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:20px;padding:0;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;color:white;box-shadow:0 20px 60px rgba(0,0,0,0.3)}.modal-header{display:flex;justify-content:space-between;align-items:center;padding:20px 30px;border-bottom:1px solid rgba(255,255,255,0.2)}.modal-header h3{margin:0;font-size:1.5rem;font-weight:700}.close-btn{background:none;border:none;color:white;font-size:1.5rem;cursor:pointer;padding:5px;border-radius:50%;transition:background 0.3s ease}.close-btn:hover{background:rgba(255,255,255,0.2)}.modal-body{padding:30px}.room-options{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px}.option-card{background:rgba(255,255,255,0.1);border-radius:15px;padding:20px;backdrop-filter:blur(10px)}.option-card h4{margin:0 0 15px 0;font-size:1.1rem;font-weight:600}.room-form,.join-form{display:flex;flex-direction:column;gap:10px}.room-form input,.room-form select,.join-form input{padding:12px;border:none;border-radius:8px;background:rgba(255,255,255,0.9);color:#333;font-size:14px}.room-form input::placeholder,.join-form input::placeholder{color:#666}.create-room-btn,.join-room-btn{background:linear-gradient(45deg,#FFD700,#FFA500);border:none;border-radius:8px;padding:12px;font-weight:600;color:#333;cursor:pointer;transition:all 0.3s ease}.create-room-btn:hover,.join-room-btn:hover{transform:translateY(-2px);box-shadow:0 5px 15px rgba(255,215,0,0.3)}.room-list{border-top:1px solid rgba(255,255,255,0.2);padding-top:20px}.room-list h4{margin:0 0 15px 0;font-size:1.1rem;font-weight:600}.rooms-container{max-height:200px;overflow-y:auto}.no-rooms{text-align:center;opacity:0.7;padding:20px;font-style:italic}.room-item{background:rgba(255,255,255,0.1);border-radius:10px;padding:15px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}.room-info{flex:1}.room-name{font-weight:600;margin-bottom:5px}.room-details{font-size:0.9rem;opacity:0.8}.join-btn{background:rgba(255,215,0,0.3);border:1px solid #FFD700;border-radius:6px;padding:8px 15px;color:white;cursor:pointer;transition:all 0.3s ease}.join-btn:hover{background:rgba(255,215,0,0.5)}@media (max-width:768px){.room-options{grid-template-columns:1fr}.modal-content{width:95%;margin:10px}.modal-body{padding:20px}}.game-interface{display:none}.game-interface.active{display:block}.game-stats{display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.1);border-radius:15px;padding:20px;margin-bottom:20px}.stat-item{text-align:center}.stat-label{font-size:0.9rem;opacity:0.8;margin-bottom:5px}.stat-value{font-size:1.5rem;font-weight:700}.timer{background:linear-gradient(45deg,#FF6B6B,#FF8E53);border-radius:50%;width:80px;height:80px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;animation:pulse 1s infinite}@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}.timer.warning{background:linear-gradient(45deg,#FF4757,#FF3838);animation:shake 0.5s infinite}@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}.question-card{background:rgba(255,255,255,0.1);border-radius:15px;padding:30px;margin-bottom:20px;backdrop-filter:blur(10px)}.question-number{font-size:1rem;opacity:0.8;margin-bottom:10px}.question-text{font-size:1.4rem;font-weight:600;margin-bottom:25px;line-height:1.4}.answers-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}.answer-btn{background:rgba(255,255,255,0.2);border:2px solid transparent;border-radius:10px;padding:20px;color:white;cursor:pointer;transition:all 0.3s ease;text-align:left;font-size:1rem;font-weight:500}.answer-btn:hover{background:rgba(255,255,255,0.3);transform:translateY(-2px)}.answer-btn.correct{background:rgba(46,204,113,0.3);border-color:#2ECC71;animation:correctAnswer 0.6s ease}.answer-btn.incorrect{background:rgba(231,76,60,0.3);border-color:#E74C3C;animation:incorrectAnswer 0.6s ease}.answer-btn.disabled{opacity:0.5;cursor:not-allowed}@keyframes correctAnswer{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}@keyframes incorrectAnswer{0%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}100%{transform:translateX(0)}}.jokers{display:flex;gap:10px;justify-content:center;margin-bottom:20px}.joker-btn{background:rgba(255,255,255,0.2);border:2px solid #FFD700;border-radius:10px;padding:10px 15px;color:white;cursor:pointer;transition:all 0.3s ease;font-size:0.9rem;font-weight:500}.joker-btn:hover{background:rgba(255,215,0,0.3)}.joker-btn.disabled{opacity:0.5;cursor:not-allowed;border-color:#666}.game-results{display:none;text-align:center;background:rgba(255,255,255,0.1);border-radius:15px;padding:40px;backdrop-filter:blur(10px)}.game-results.active{display:block}.results-title{font-size:2rem;font-weight:700;margin-bottom:20px;background:linear-gradient(45deg,#FFD700,#FFA500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.final-score{font-size:3rem;font-weight:700;margin-bottom:20px;color:#FFD700}
.results-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:20px;margin-bottom:30px}.result-stat{background:rgba(255,255,255,0.1);border-radius:10px;padding:15px}.result-stat-value{font-size:1.5rem;font-weight:700;margin-bottom:5px}.result-stat-label{font-size:0.9rem;opacity:0.8}.play-again-btn{background:linear-gradient(45deg,#FFD700,#FFA500);border:none;border-radius:25px;padding:15px 40px;font-size:1.2rem;font-weight:600;color:#333;cursor:pointer;transition:all 0.3s ease;margin-right:15px}.play-again-btn:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(255,215,0,0.3)}.back-to-menu-btn{background:rgba(255,255,255,0.2);border:2px solid white;border-radius:25px;padding:15px 40px;font-size:1.2rem;font-weight:600;color:white;cursor:pointer;transition:all 0.3s ease}.back-to-menu-btn:hover{background:rgba(255,255,255,0.3);transform:translateY(-2px)}.combo-indicator{position:absolute;top:20px;right:20px;background:linear-gradient(45deg,#FF6B6B,#FF8E53);border-radius:20px;padding:10px 20px;font-weight:700;animation:bounce 0.6s ease}@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@media (max-width:768px){.quiz-game{padding:15px;margin:10px}.quiz-title{font-size:2rem}.answers-grid{grid-template-columns:1fr}.game-stats{flex-direction:column;gap:15px}.category-grid{grid-template-columns:1fr}.difficulty-buttons{flex-direction:column;align-items:center}}
.room-created-modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10001;justify-content:center;align-items:center;animation:fadeIn 0.3s ease}.room-created-content{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:20px;padding:40px;max-width:450px;width:90%;text-align:center;color:white;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:slideUp 0.4s ease;position:relative}.success-icon{font-size:4rem;margin-bottom:20px;animation:bounce 0.6s ease}.room-created-content h3{font-size:1.8rem;margin-bottom:30px;font-weight:600}.room-code-display{background:rgba(255,255,255,0.15);border-radius:15px;padding:25px;margin:25px 0;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2)}.room-code-display label{display:block;font-size:1rem;margin-bottom:10px;opacity:0.9}.room-code{font-size:2.5rem;font-weight:bold;letter-spacing:8px;margin:15px 0;padding:15px;background:rgba(255,255,255,0.2);border-radius:10px;font-family:'Courier New',monospace;border:2px dashed rgba(255,255,255,0.3)}.copy-code-btn{background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.3);color:white;padding:12px 20px;border-radius:25px;cursor:pointer;font-size:1rem;transition:all 0.3s ease;display:inline-flex;align-items:center;gap:8px;margin-top:10px}.copy-code-btn:hover{background:rgba(255,255,255,0.3);transform:translateY(-2px);box-shadow:0 5px 15px rgba(0,0,0,0.2)}.copy-icon{font-size:1.2rem}.share-message{font-size:1.1rem;margin:25px 0;opacity:0.9;line-height:1.5}.continue-btn{background:linear-gradient(45deg,#ff6b6b,#ee5a24);border:none;color:white;padding:15px 40px;border-radius:30px;font-size:1.1rem;font-weight:600;cursor:pointer;transition:all 0.3s ease;box-shadow:0 5px 20px rgba(238,90,36,0.3)}.continue-btn:hover{transform:translateY(-3px);box-shadow:0 8px 25px rgba(238,90,36,0.4)}.join-room-modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10002;justify-content:center;align-items:center;animation:fadeIn 0.3s ease;backdrop-filter:blur(5px)}.join-room-content{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:25px;padding:0;max-width:500px;width:92%;color:white;box-shadow:0 25px 80px rgba(0,0,0,0.3);animation:slideUp 0.4s ease;position:relative;overflow:hidden}.alert-modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10003;justify-content:center;align-items:center;animation:fadeIn 0.3s ease;backdrop-filter:blur(5px)}.alert-content{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:20px;padding:30px;max-width:400px;width:90%;text-align:center;color:white;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:slideUp 0.4s ease;position:relative}.alert-icon{font-size:3rem;margin-bottom:15px}.alert-title{font-size:1.4rem;font-weight:700;margin-bottom:15px}.alert-message{font-size:1rem;margin-bottom:25px;opacity:0.9;line-height:1.5}.alert-btn{background:linear-gradient(45deg,#ff6b6b,#ee5a24);border:none;color:white;padding:12px 30px;border-radius:25px;font-size:1rem;font-weight:600;cursor:pointer;transition:all 0.3s ease;box-shadow:0 5px 20px rgba(238,90,36,0.3)}.alert-btn:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(238,90,36,0.4)}.join-room-content .modal-header{display:flex;justify-content:space-between;align-items:center;padding:25px 30px;border-bottom:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.1)}.join-room-content .modal-header h3{margin:0;font-size:1.6rem;font-weight:700}.room-info-card{padding:30px;background:rgba(255,255,255,0.05);display:flex;align-items:center;gap:20px;border-bottom:1px solid rgba(255,255,255,0.1)}.room-icon{font-size:3rem;background:rgba(255,255,255,0.15);border-radius:50%;width:70px;height:70px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 25px rgba(0,0,0,0.2)}.room-details{flex:1}.room-details h4{margin:0 0 15px 0;font-size:1.4rem;font-weight:700}.room-meta{display:flex;gap:20px;margin-bottom:12px;flex-wrap:wrap}.room-meta span{background:rgba(255,255,255,0.15);padding:6px 12px;border-radius:20px;font-size:0.9rem;font-weight:500}.room-settings{display:flex;gap:15px;flex-wrap:wrap}.room-settings span{background:rgba(255,255,255,0.1);padding:5px 10px;border-radius:15px;font-size:0.85rem}.join-form-container{padding:30px}.player-input-group{margin-bottom:25px}.player-input-group label{display:block;font-size:1.1rem;font-weight:600;margin-bottom:10px;color:rgba(255,255,255,0.95)}.player-input-group input{width:100%;padding:15px 20px;border:none;border-radius:15px;background:rgba(255,255,255,0.9);color:#333;font-size:1rem;font-weight:500;box-shadow:0 5px 15px rgba(0,0,0,0.1);transition:all 0.3s ease}.player-input-group input:focus{outline:none;transform:translateY(-2px);box-shadow:0 8px 25px rgba(0,0,0,0.15)}.player-input-group input::placeholder{color:#666;font-weight:400}.join-actions{display:flex;gap:15px;justify-content:center}.cancel-join-btn{background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.3);color:white;padding:12px 25px;border-radius:25px;font-size:1rem;font-weight:600;cursor:pointer;transition:all 0.3s ease;flex:1}.cancel-join-btn:hover{background:rgba(255,255,255,0.25);transform:translateY(-2px)}.confirm-join-btn{background:linear-gradient(45deg,#ff6b6b,#ee5a24);border:none;color:white;padding:12px 25px;border-radius:25px;font-size:1rem;font-weight:600;cursor:pointer;transition:all 0.3s ease;box-shadow:0 5px 20px rgba(238,90,36,0.3);flex:1}.confirm-join-btn:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(238,90,36,0.4)}@media (max-width:768px){.join-room-content{width:95%;margin:10px}.room-info-card{flex-direction:column;text-align:center;gap:15px}.room-meta,.room-settings{justify-content:center}.join-actions{flex-direction:column}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(50px) scale(0.9)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes bounce{0%,20%,50%,80%,100%{transform:translateY(0)}40%{transform:translateY(-10px)}60%{transform:translateY(-5px)}}
            </style>

            <div class="quiz-game">
                <div class="quiz-header">
                    <h1 class="quiz-title">🧠 AI Bilgi Yarışması</h1>
                    <p class="quiz-subtitle">Yapay zeka ile bilgi yarışmasına hazır mısın?</p>
                </div>

                <div class="game-setup" id="gameSetup">
                    <div class="setup-section">
                        <label class="setup-label">📚 Kategori Seçin:</label>
                        <div class="category-grid">
                            <button class="category-btn active" data-category="mixed">🎯 Karışık</button>
                            <button class="category-btn" data-category="general">🌍 Genel Kültür</button>
                            <button class="category-btn" data-category="science">🔬 Bilim & Teknoloji</button>
                            <button class="category-btn" data-category="sports">⚽ Spor</button>
                            <button class="category-btn" data-category="entertainment">🎬 Eğlence</button>
                            <button class="category-btn" data-category="turkey">🇹🇷 Türkiye</button>
                        </div>
                    </div>

                    <div class="setup-section">
                        <label class="setup-label">⚡ Zorluk Seviyesi:</label>
                        <div class="difficulty-buttons">
                            <button class="difficulty-btn" data-difficulty="easy">😊 Kolay (10 puan)</button>
                            <button class="difficulty-btn active" data-difficulty="medium">😐 Orta (20 puan)</button>
                            <button class="difficulty-btn" data-difficulty="hard">😤 Zor (30 puan)</button>
                        </div>
                    </div>

                    <div class="setup-section">
                        <label class="setup-label">Oyun Modu:</label>
                        <div class="game-mode-buttons">
                            <button class="mode-btn active" data-mode="single">👤 Tek Oyuncu</button>
                            <button class="mode-btn" data-mode="multiplayer">👥 Çok Oyunculu</button>
                        </div>
                    </div>

                    <button class="start-game-btn" id="startGameBtn">🚀 Oyunu Başlat</button>
                </div>
            </div>

            <!-- Çok Oyunculu Oda Pop-up -->
            <div class="multiplayer-modal" id="multiplayerModal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>🏆 Çok Oyunculu Oda</h3>
                        <button class="close-btn" id="closeModal">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="room-options">
                            <div class="option-card">
                                <h4>🆕 Yeni Oda Oluştur</h4>
                                <div class="room-form">
                                    <input type="text" id="roomName" placeholder="Oda Adı" maxlength="20">
                                    <input type="text" id="playerName" placeholder="Oyuncu Adınız" maxlength="15">
                                    <select id="maxPlayers">
                                        <option value="2">2 Oyuncu</option>
                                        <option value="3">3 Oyuncu</option>
                                        <option value="4" selected>4 Oyuncu</option>
                                        <option value="6">6 Oyuncu</option>
                                    </select>
                                    <button class="create-room-btn" id="createRoomBtn">🚀 Oda Oluştur</button>
                                </div>
                            </div>
                            <div class="option-card">
                                <h4>🔍 Odaya Katıl</h4>
                                <div class="join-form">
                                    <input type="text" id="joinRoomCode" placeholder="Oda Kodu" maxlength="6">
                                    <input type="text" id="joinPlayerName" placeholder="Oyuncu Adınız" maxlength="15">
                                    <button class="join-room-btn" id="joinRoomBtn">🎯 Odaya Katıl</button>
                                </div>
                            </div>
                        </div>
                        <div class="room-list">
                            <h4>📋 Aktif Odalar</h4>
                            <div class="rooms-container" id="roomsList">
                                <div class="no-rooms">Henüz aktif oda bulunmuyor...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>     <div class="game-interface" id="gameInterface">
                    <div class="game-stats">
                        <div class="stat-item">
                            <div class="stat-label">Skor</div>
                            <div class="stat-value" id="currentScore">0</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Soru</div>
                            <div class="stat-value" id="questionProgress">1/10</div>
                        </div>
                        <div class="timer" id="timer">15</div>
                        <div class="stat-item">
                            <div class="stat-label">Combo</div>
                            <div class="stat-value" id="comboCounter">0</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Kategori</div>
                            <div class="stat-value" id="currentCategory">Karışık</div>
                        </div>
                    </div>

                    <div class="jokers">
                        <button class="joker-btn" id="fiftyFiftyJoker" title="İki yanlış seçeneği eleme">🎯 50:50 (1)</button>
                        <button class="joker-btn" id="timeStopJoker" title="5 saniye ekstra süre">⏰ Zaman Dur (1)</button>
                        <button class="joker-btn" id="categoryChangeJoker" title="Kategori değiştir">🔄 Kategori (1)</button>
                    </div>

                    <div class="question-card">
                        <div class="question-number" id="questionNumber">Soru 1/10</div>
                        <div class="question-text" id="questionText">Soru yükleniyor...</div>
                        <div class="answers-grid" id="answersGrid">
                            <!-- Answers will be populated here -->
                        </div>
                    </div>
                </div>

                <div class="game-results" id="gameResults">
                    <div class="results-title">🎉 Oyun Bitti!</div>
                    <div class="final-score" id="finalScore">0</div>
                    <div class="results-stats">
                        <div class="result-stat">
                            <div class="result-stat-value" id="correctAnswers">0</div>
                            <div class="result-stat-label">Doğru Cevap</div>
                        </div>
                        <div class="result-stat">
                            <div class="result-stat-value" id="wrongAnswers">0</div>
                            <div class="result-stat-label">Yanlış Cevap</div>
                        </div>
                        <div class="result-stat">
                            <div class="result-stat-value" id="maxComboResult">0</div>
                            <div class="result-stat-label">En Yüksek Combo</div>
                        </div>
                        <div class="result-stat">
                            <div class="result-stat-value" id="accuracyRate">0%</div>
                            <div class="result-stat-label">Doğruluk Oranı</div>
                        </div>
                    </div>
                    <div>
                        <button class="play-again-btn" id="playAgainBtn">🔄 Tekrar Oyna</button>
                        <button class="back-to-menu-btn" id="backToMenuBtn">🏠 Ana Menü</button>
                    </div>
                </div>
            </div>
            
            <!-- Room Created Success Modal -->
            <div id="roomCreatedModal" class="room-created-modal">
                <div class="room-created-content">
                    <div class="success-icon">✅</div>
                    <h3>Oda Başarıyla Oluşturuldu!</h3>
                    <div class="room-code-display">
                        <label>Oda Kodunuz:</label>
                        <div class="room-code" id="displayRoomCode"></div>
                        <button class="copy-code-btn" id="copyCodeBtn">
                            <span class="copy-icon">📋</span>
                            Kopyala
                        </button>
                    </div>
                    <p class="share-message">Bu kodu diğer oyuncularla paylaşarak onları odanıza davet edebilirsiniz!</p>
                    <div class="modal-actions">
                        <button class="continue-btn" id="continueToGameBtn">Oyuna Devam Et</button>
                    </div>
                </div>
            </div>
            
            <!-- Modern Alert Modal -->
            <div id="alertModal" class="alert-modal">
                <div class="alert-content">
                    <div class="alert-icon" id="alertIcon">⚠️</div>
                    <div class="alert-title" id="alertTitle">Uyarı</div>
                    <div class="alert-message" id="alertMessage">Bir hata oluştu.</div>
                    <button class="alert-btn" id="alertBtn">Tamam</button>
                </div>
            </div>
            `;
    }

    setupEventListeners() {
        // Category selection
        this.container.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedCategory = btn.dataset.category;
            });
        });

        // Difficulty selection
        this.container.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.difficulty;
            });
        });

        // Game mode selection
        this.container.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.gameMode = btn.dataset.mode;
            });
        });

        // Start game
        this.container.querySelector('#startGameBtn').addEventListener('click', () => {
            if (this.gameMode === 'multiplayer') {
                this.showMultiplayerModal();
            } else {
                this.startGame();
            }
        });

        // Multiplayer modal events
        this.container.querySelector('#closeModal').addEventListener('click', () => {
            this.hideMultiplayerModal();
        });

        this.container.querySelector('#createRoomBtn').addEventListener('click', () => {
            this.createRoom();
        });

        this.container.querySelector('#joinRoomBtn').addEventListener('click', () => {
            this.joinRoom();
        });

        // Room list join buttons - sağlam event delegation
        this.container.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('join-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const roomData = {
                    name: e.target.dataset.roomName,
                    code: e.target.dataset.roomCode,
                    players: e.target.dataset.players,
                    maxPlayers: e.target.dataset.maxPlayers,
                    category: e.target.dataset.category,
                    difficulty: e.target.dataset.difficulty
                };
                
                // Güvenlik kontrolü - tüm veri var mı?
                if (roomData.name && roomData.code) {
                    this.showJoinRoomModal(roomData);
                } else {
                    // 100ms bekleyip tekrar dene
                    setTimeout(() => {
                        const refreshedData = {
                            name: e.target.dataset.roomName,
                            code: e.target.dataset.roomCode,
                            players: e.target.dataset.players,
                            maxPlayers: e.target.dataset.maxPlayers,
                            category: e.target.dataset.category,
                            difficulty: e.target.dataset.difficulty
                        };
                        if (refreshedData.name && refreshedData.code) {
                            this.showJoinRoomModal(refreshedData);
                        }
                    }, 100);
                }
            }
        });

        // Join room modal events
        this.container.addEventListener('click', (e) => {
            if (e.target.id === 'joinRoomModal') {
                this.hideJoinRoomModal();
            }
            if (e.target.classList.contains('close-btn') && e.target.closest('.join-room-modal')) {
                this.hideJoinRoomModal();
            }
            if (e.target.classList.contains('cancel-join-btn')) {
                this.hideJoinRoomModal();
            }
            if (e.target.classList.contains('confirm-join-btn')) {
                this.confirmJoinRoom();
            }
        });

        // Close modal when clicking outside
        this.container.querySelector('#multiplayerModal').addEventListener('click', (e) => {
            if (e.target.id === 'multiplayerModal') {
                this.hideMultiplayerModal();
            }
        });

        // Jokers
        this.container.querySelector('#fiftyFiftyJoker').addEventListener('click', () => {
            this.useFiftyFifty();
        });

        this.container.querySelector('#timeStopJoker').addEventListener('click', () => {
            this.useTimeStop();
        });

        this.container.querySelector('#categoryChangeJoker').addEventListener('click', () => {
            this.useCategoryChange();
        });

        // Play again
        this.container.querySelector('#playAgainBtn').addEventListener('click', () => {
            this.resetGame();
        });

        // Back to menu
        this.container.querySelector('#backToMenuBtn').addEventListener('click', () => {
            this.backToMenu();
        });
    }

    async loadQuestions() {
        // Generate questions using AI or use predefined questions
        this.questions = await this.generateQuestions();
    }

    async generateQuestions() {
        const categories = {
            mixed: 'Karışık konulardan',
            general: 'Genel kültür, tarih ve coğrafya',
            science: 'Bilim, teknoloji, matematik ve fizik',
            sports: 'Spor, futbol, basketbol ve olimpiyatlar',
            entertainment: 'Film, müzik, ünlüler ve eğlence',
            turkey: 'Türkiye tarihi, coğrafyası ve kültürü'
        };

        const difficulties = {
            easy: 'kolay seviye',
            medium: 'orta seviye',
            hard: 'zor seviye'
        };

        const categoryText = categories[this.selectedCategory];
        const difficultyText = difficulties[this.difficulty];

        const prompt = `${categoryText} konusunda ${difficultyText} ${this.totalQuestions} adet çoktan seçmeli soru oluştur. Her soru için 4 seçenek ver ve doğru cevabı belirt. JSON formatında şu yapıda ver:

{
  "questions": [
    {
      "question": "Soru metni",
      "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği"],
      "correct": 0,
      "explanation": "Doğru cevabın açıklaması"
    }
  ]
}

Sadece JSON formatında cevap ver, başka açıklama ekleme.`;

        try {
            const response = await this.callGeminiAPI(prompt);
            const data = JSON.parse(response);
            return data.questions || [];
        } catch (error) {
            console.error('Soru oluşturma hatası:', error);
            return this.getFallbackQuestions();
        }
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
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
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

    getFallbackQuestions() {
        return [
            {
                question: "Türkiye'nin başkenti neresidir?",
                options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
                correct: 1,
                explanation: "Türkiye'nin başkenti 1923'ten beri Ankara'dır."
            },
            {
                question: "Dünya'nın en büyük okyanusu hangisidir?",
                options: ["Atlantik", "Hint", "Pasifik", "Arktik"],
                correct: 2,
                explanation: "Pasifik Okyanusu, dünya yüzeyinin yaklaşık üçte birini kaplar."
            },
            {
                question: "Hangi element periyodik tabloda 'Au' sembolü ile gösterilir?",
                options: ["Gümüş", "Altın", "Alüminyum", "Argon"],
                correct: 1,
                explanation: "Au, Latince 'aurum' kelimesinden gelir ve altını temsil eder."
            },
            {
                question: "2018 FIFA Dünya Kupası hangi ülkede düzenlendi?",
                options: ["Brezilya", "Almanya", "Rusya", "Katar"],
                correct: 2,
                explanation: "2018 FIFA Dünya Kupası Rusya'da düzenlendi ve Fransa şampiyon oldu."
            },
            {
                question: "'Inception' filminin yönetmeni kimdir?",
                options: ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "Quentin Tarantino"],
                correct: 1,
                explanation: "Inception, 2010 yılında Christopher Nolan tarafından yönetilmiştir."
            }
        ];
    }

    startGame() {
        this.gameActive = true;
        this.currentQuestion = 0;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        
        this.container.querySelector('#gameSetup').style.display = 'none';
        this.container.querySelector('#gameInterface').classList.add('active');
        
        this.updateCategoryDisplay();
        this.loadQuestion();
    }

    updateCategoryDisplay() {
        const categoryNames = {
            mixed: 'Karışık',
            general: 'Genel Kültür',
            science: 'Bilim & Teknoloji',
            sports: 'Spor',
            entertainment: 'Eğlence',
            turkey: 'Türkiye'
        };
        
        this.container.querySelector('#currentCategory').textContent = categoryNames[this.selectedCategory];
    }

    loadQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.endGame();
            return;
        }

        const question = this.questions[this.currentQuestion];
        
        this.container.querySelector('#questionNumber').textContent = `Soru ${this.currentQuestion + 1}/${this.questions.length}`;
        this.container.querySelector('#questionProgress').textContent = `${this.currentQuestion + 1}/${this.questions.length}`;
        this.container.querySelector('#questionText').textContent = question.question;
        
        const answersGrid = this.container.querySelector('#answersGrid');
        answersGrid.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
            button.addEventListener('click', () => this.selectAnswer(index));
            answersGrid.appendChild(button);
        });
        
        this.startTimer();
    }

    startTimer() {
        this.timeLeft = 15;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const timerElement = this.container.querySelector('#timer');
        timerElement.textContent = this.timeLeft;
        
        if (this.timeLeft <= 5) {
            timerElement.classList.add('warning');
        } else {
            timerElement.classList.remove('warning');
        }
    }

    selectAnswer(selectedIndex) {
        if (!this.gameActive) return;
        
        clearInterval(this.timer);
        
        const question = this.questions[this.currentQuestion];
        const answerButtons = this.container.querySelectorAll('.answer-btn');
        
        answerButtons.forEach((btn, index) => {
            btn.classList.add('disabled');
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex) {
                btn.classList.add('incorrect');
            }
        });
        
        if (selectedIndex === question.correct) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
        
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    handleCorrectAnswer() {
        const basePoints = this.difficulty === 'easy' ? 10 : this.difficulty === 'medium' ? 20 : 30;
        const timeBonus = Math.max(0, this.timeLeft * 2);
        const comboBonus = this.combo * 5;
        const totalPoints = basePoints + timeBonus + comboBonus;
        
        this.score += totalPoints;
        this.combo++;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        
        this.updateScore();
        this.showComboIndicator();
    }

    handleIncorrectAnswer() {
        this.combo = 0;
        this.updateScore();
    }

    timeUp() {
        clearInterval(this.timer);
        this.combo = 0;
        
        const question = this.questions[this.currentQuestion];
        const answerButtons = this.container.querySelectorAll('.answer-btn');
        
        answerButtons.forEach((btn, index) => {
            btn.classList.add('disabled');
            if (index === question.correct) {
                btn.classList.add('correct');
            }
        });
        
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    updateScore() {
        this.container.querySelector('#currentScore').textContent = this.score;
        this.container.querySelector('#comboCounter').textContent = this.combo;
    }

    showComboIndicator() {
        if (this.combo > 1) {
            const indicator = document.createElement('div');
            indicator.className = 'combo-indicator';
            indicator.textContent = `🔥 ${this.combo}x Combo!`;
            this.container.querySelector('.quiz-game').appendChild(indicator);
            
            setTimeout(() => {
                indicator.remove();
            }, 2000);
        }
    }

    nextQuestion() {
        this.currentQuestion++;
        this.loadQuestion();
    }

    useFiftyFifty() {
        if (this.jokers.fiftyFifty <= 0) return;
        
        this.jokers.fiftyFifty--;
        this.container.querySelector('#fiftyFiftyJoker').classList.add('disabled');
        this.container.querySelector('#fiftyFiftyJoker').textContent = '🎯 50:50 (0)';
        
        const question = this.questions[this.currentQuestion];
        const answerButtons = this.container.querySelectorAll('.answer-btn');
        const incorrectIndices = [];
        
        answerButtons.forEach((btn, index) => {
            if (index !== question.correct) {
                incorrectIndices.push(index);
            }
        });
        
        // Remove 2 incorrect answers
        const toRemove = incorrectIndices.slice(0, 2);
        toRemove.forEach(index => {
            answerButtons[index].style.opacity = '0.3';
            answerButtons[index].style.pointerEvents = 'none';
        });
    }

    useTimeStop() {
        if (this.jokers.timeStop <= 0) return;
        
        this.jokers.timeStop--;
        this.container.querySelector('#timeStopJoker').classList.add('disabled');
        this.container.querySelector('#timeStopJoker').textContent = '⏰ Zaman Dur (0)';
        
        this.timeLeft += 5;
        this.updateTimerDisplay();
    }

    useCategoryChange() {
        if (this.jokers.categoryChange <= 0) return;
        
        this.jokers.categoryChange--;
        this.container.querySelector('#categoryChangeJoker').classList.add('disabled');
        this.container.querySelector('#categoryChangeJoker').textContent = '🔄 Kategori (0)';
        
        // Generate a new question from a different category
        this.generateNewQuestion();
    }

    async generateNewQuestion() {
        try {
            const newQuestions = await this.generateQuestions();
            if (newQuestions.length > 0) {
                this.questions[this.currentQuestion] = newQuestions[0];
                clearInterval(this.timer);
                this.loadQuestion();
            }
        } catch (error) {
            console.error('Yeni soru oluşturma hatası:', error);
        }
    }

    endGame() {
        this.gameActive = false;
        clearInterval(this.timer);
        
        this.container.querySelector('#gameInterface').classList.remove('active');
        this.container.querySelector('#gameResults').classList.add('active');
        
        this.showResults();
    }

    showResults() {
        const correctAnswers = this.questions.filter((q, index) => {
            // This is a simplified check - in a real implementation, you'd track actual answers
            return index < this.currentQuestion;
        }).length;
        
        const wrongAnswers = this.currentQuestion - correctAnswers;
        const accuracy = this.currentQuestion > 0 ? Math.round((correctAnswers / this.currentQuestion) * 100) : 0;
        
        this.container.querySelector('#finalScore').textContent = this.score;
        this.container.querySelector('#correctAnswers').textContent = correctAnswers;
        this.container.querySelector('#wrongAnswers').textContent = wrongAnswers;
        this.container.querySelector('#maxComboResult').textContent = this.maxCombo;
        this.container.querySelector('#accuracyRate').textContent = `${accuracy}%`;
    }

    resetGame() {
        this.currentQuestion = 0;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.timeLeft = 15;
        this.gameActive = false;
        
        this.jokers = {
            fiftyFifty: 1,
            timeStop: 1,
            categoryChange: 1
        };
        
        // Reset joker buttons
        this.container.querySelector('#fiftyFiftyJoker').classList.remove('disabled');
        this.container.querySelector('#fiftyFiftyJoker').textContent = '🎯 50:50 (1)';
        this.container.querySelector('#timeStopJoker').classList.remove('disabled');
        this.container.querySelector('#timeStopJoker').textContent = '⏰ Zaman Dur (1)';
        this.container.querySelector('#categoryChangeJoker').classList.remove('disabled');
        this.container.querySelector('#categoryChangeJoker').textContent = '🔄 Kategori (1)';
        
        this.container.querySelector('#gameResults').classList.remove('active');
        this.container.querySelector('#gameInterface').classList.add('active');
        
        this.loadQuestions().then(() => {
            this.startGame();
        });
    }

    backToMenu() {
        this.container.querySelector('#gameResults').classList.remove('active');
        this.container.querySelector('#gameInterface').classList.remove('active');
        this.container.querySelector('#gameSetup').style.display = 'block';
        
        this.currentQuestion = 0;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.timeLeft = 15;
        this.gameActive = false;
        
        this.jokers = {
            fiftyFifty: 1,
            timeStop: 1,
            categoryChange: 1
        };
        
        // Reset joker buttons
        this.container.querySelector('#fiftyFiftyJoker').classList.remove('disabled');
        this.container.querySelector('#fiftyFiftyJoker').textContent = '🎯 50:50 (1)';
        this.container.querySelector('#timeStopJoker').classList.remove('disabled');
        this.container.querySelector('#timeStopJoker').textContent = '⏰ Zaman Dur (1)';
        this.container.querySelector('#categoryChangeJoker').classList.remove('disabled');
        this.container.querySelector('#categoryChangeJoker').textContent = '🔄 Kategori (1)';
    }

    showMultiplayerModal() {
        // Önce test odaları oluştur (geliştirme amaçlı)
        this.createTestRooms();
        
        const modal = this.container.querySelector('#multiplayerModal');
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        
        // Odaları hemen yükle
        this.loadActiveRooms();
        
        // Güvenlik için DOM'un hazır olduğundan emin ol
        setTimeout(() => {
            this.loadActiveRooms();
        }, 100);
    }

    hideMultiplayerModal() {
        this.container.querySelector('#multiplayerModal').style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    generateRoomCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    createTestRooms() {
        // Test amaçlı örnek odalar oluştur
        const testRooms = [
            {
                code: 'TEST01',
                name: 'Hızlı Bilgi Yarışması',
                host: 'Oyuncu1',
                players: ['Oyuncu1'],
                maxPlayers: 4,
                status: 'waiting',
                category: 'mixed',
                difficulty: 'medium',
                createdAt: Date.now()
            },
            {
                code: 'TEST02',
                name: 'Bilim Odası',
                host: 'ScienceFan',
                players: ['ScienceFan', 'Einstein'],
                maxPlayers: 3,
                status: 'waiting',
                category: 'science',
                difficulty: 'hard',
                createdAt: Date.now()
            },
            {
                code: 'TEST03',
                name: 'Spor Severler',
                host: 'FootballKing',
                players: ['FootballKing'],
                maxPlayers: 6,
                status: 'waiting',
                category: 'sports',
                difficulty: 'easy',
                createdAt: Date.now()
            }
        ];

        // Mevcut odalarla birleştir
        let existingRooms = JSON.parse(localStorage.getItem('triviaRooms') || '[]');
        
        // Test odalarını sadece yoksa ekle
        testRooms.forEach(testRoom => {
            if (!existingRooms.find(room => room.code === testRoom.code)) {
                existingRooms.push(testRoom);
            }
        });
        
        localStorage.setItem('triviaRooms', JSON.stringify(existingRooms));
    }

    createRoom() {
        const roomName = this.container.querySelector('#roomName').value.trim();
        const playerName = this.container.querySelector('#playerName').value.trim();
        const maxPlayers = parseInt(this.container.querySelector('#maxPlayers').value);

        if (!roomName || !playerName) {
            alert('Lütfen oda adı ve oyuncu adınızı girin!');
            return;
        }

        const roomCode = this.generateRoomCode();
        const room = {
            code: roomCode,
            name: roomName,
            host: playerName,
            players: [playerName],
            maxPlayers: maxPlayers,
            status: 'waiting',
            category: this.selectedCategory,
            difficulty: this.difficulty,
            createdAt: Date.now()
        };

        // Simulated room creation (in real app, this would be sent to server)
        this.saveRoom(room);
        this.playerName = playerName;
        this.currentRoom = room;
        
        this.showRoomCreatedModal(roomCode);
        this.hideMultiplayerModal();
        this.showWaitingRoom(room);
    }

    joinRoom() {
        const roomCode = this.container.querySelector('#joinRoomCode').value.trim().toUpperCase();
        const playerName = this.container.querySelector('#joinPlayerName').value.trim();

        if (!roomCode || !playerName) {
            alert('Lütfen oda kodu ve oyuncu adınızı girin!');
            return;
        }

        const room = this.getRoomByCode(roomCode);
        if (!room) {
            alert('Oda bulunamadı! Lütfen oda kodunu kontrol edin.');
            return;
        }

        if (room.players.length >= room.maxPlayers) {
            alert('Bu oda dolu!');
            return;
        }

        if (room.players.includes(playerName)) {
            alert('Bu isimde bir oyuncu zaten odada!');
            return;
        }

        // Join room
        room.players.push(playerName);
        this.saveRoom(room);
        this.playerName = playerName;
        this.currentRoom = room;
        
        alert(`${room.name} odasına katıldınız!`);
        this.hideMultiplayerModal();
        this.showWaitingRoom(room);
    }

    loadActiveRooms() {
        const rooms = this.getActiveRooms();
        const roomsList = this.container.querySelector('#roomsList');
        
        if (rooms.length === 0) {
            roomsList.innerHTML = '<div class="no-rooms">Henüz aktif oda bulunmuyor...</div>';
            return;
        }

        const roomsHTML = rooms.map(room => `
            <div class="room-item">
                <div class="room-info">
                    <div class="room-name">${room.name}</div>
                    <div class="room-details">${room.players.length}/${room.maxPlayers} oyuncu • ${room.host} tarafından oluşturuldu</div>
                </div>
                <button class="join-btn" 
                    data-room-name="${room.name}"
                    data-room-code="${room.code}"
                    data-players="${room.players.length}"
                    data-max-players="${room.maxPlayers}"
                    data-category="${room.category}"
                    data-difficulty="${room.difficulty}">Katıl</button>
            </div>
        `).join('');
        
        roomsList.innerHTML = roomsHTML;
    }

    quickJoinRoom(roomCode) {
        this.showAlert('👤', 'Oyuncu Adı', 'Hızlı katılım için oyuncu adınızı girin:', () => {
            const playerNameInput = document.createElement('input');
            playerNameInput.type = 'text';
            playerNameInput.placeholder = 'Oyuncu adınız...';
            playerNameInput.style.cssText = 'width:100%;padding:10px;margin:10px 0;border:none;border-radius:8px;background:rgba(255,255,255,0.9);color:#333;font-size:1rem';
            
            const alertMessage = this.container.querySelector('#alertMessage');
            alertMessage.appendChild(playerNameInput);
            
            const alertBtn = this.container.querySelector('#alertBtn');
            alertBtn.textContent = 'Katıl';
            
            alertBtn.onclick = () => {
                const playerName = playerNameInput.value.trim();
                if (!playerName) {
                    this.showAlert('⚠️', 'Hata', 'Lütfen oyuncu adınızı girin!');
                    return;
                }
                
                this.container.querySelector('#joinRoomCode').value = roomCode;
                this.container.querySelector('#joinPlayerName').value = playerName;
                this.joinRoom();
                this.hideAlert();
            };
        });
    }

    showWaitingRoom(room) {
        // This would show a waiting room interface
        // For now, we'll just start the game after a short delay
        setTimeout(() => {
            this.selectedCategory = room.category;
            this.difficulty = room.difficulty;
            this.startGame();
        }, 2000);
    }

    saveRoom(room) {
        let rooms = JSON.parse(localStorage.getItem('triviaRooms') || '[]');
        const existingIndex = rooms.findIndex(r => r.code === room.code);
        
        if (existingIndex >= 0) {
            rooms[existingIndex] = room;
        } else {
            rooms.push(room);
        }
        
        localStorage.setItem('triviaRooms', JSON.stringify(rooms));
    }

    getRoomByCode(code) {
        const rooms = JSON.parse(localStorage.getItem('triviaRooms') || '[]');
        return rooms.find(room => room.code === code);
    }

    getActiveRooms() {
        const rooms = JSON.parse(localStorage.getItem('triviaRooms') || '[]');
        const now = Date.now();
        
        // Remove rooms older than 1 hour
        const activeRooms = rooms.filter(room => {
            return (now - room.createdAt) < 3600000 && room.status === 'waiting';
        });
        
        localStorage.setItem('triviaRooms', JSON.stringify(activeRooms));
        return activeRooms;
    }

    showRoomCreatedModal(roomCode) {
        const modal = this.container.querySelector('#roomCreatedModal');
        const codeDisplay = this.container.querySelector('#displayRoomCode');
        
        codeDisplay.textContent = roomCode;
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        
        // Copy code functionality
        const copyBtn = this.container.querySelector('#copyCodeBtn');
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(roomCode).then(() => {
                copyBtn.innerHTML = '<span class="copy-icon">✅</span> Kopyalandı!';
                setTimeout(() => {
                    copyBtn.innerHTML = '<span class="copy-icon">📋</span> Kopyala';
                }, 2000);
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = roomCode;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                copyBtn.innerHTML = '<span class="copy-icon">✅</span> Kopyalandı!';
                setTimeout(() => {
                    copyBtn.innerHTML = '<span class="copy-icon">📋</span> Kopyala';
                }, 2000);
            });
        };
        
        // Continue to game functionality
        const continueBtn = this.container.querySelector('#continueToGameBtn');
        continueBtn.onclick = () => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        };
    }

    showJoinRoomModal(roomData) {
        let modal = this.container.querySelector('#joinRoomModal');
        
        if (!modal) {
            this.createJoinRoomModal();
            
            // Modal oluşturulduktan sonra tekrar bul
            setTimeout(() => {
                modal = this.container.querySelector('#joinRoomModal');
                
                if (modal) {
                    this.fillAndShowModal(modal, roomData);
                }
            }, 100);
        } else {
            this.fillAndShowModal(modal, roomData);
        }
    }
    
    fillAndShowModal(modal, roomData) {
        const categoryNames = {mixed:'Karışık',general:'Genel Kültür',science:'Bilim & Teknoloji',sports:'Spor',entertainment:'Eğlence',turkey:'Türkiye'};
        const difficultyNames = {easy:'Kolay',medium:'Orta',hard:'Zor'};
        
        // Elementlerin varlığını kontrol et
        const nameEl = this.container.querySelector('#joinRoomName');
        const playersEl = this.container.querySelector('#joinRoomPlayers');
        const categoryEl = this.container.querySelector('#joinRoomCategory');
        const difficultyEl = this.container.querySelector('#joinRoomDifficulty');
        const codeEl = this.container.querySelector('#joinRoomCode');
        
        if (nameEl) nameEl.textContent = roomData.name;
        if (playersEl) playersEl.textContent = `${roomData.players}/${roomData.maxPlayers}`;
        if (categoryEl) categoryEl.textContent = categoryNames[roomData.category] || roomData.category;
        if (difficultyEl) difficultyEl.textContent = difficultyNames[roomData.difficulty] || roomData.difficulty;
        if (codeEl) codeEl.textContent = roomData.code;
        
        this.selectedRoomData = roomData;
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
    }

    hideJoinRoomModal() {
        const modal = this.container.querySelector('#joinRoomModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }

    confirmJoinRoom() {
        const playerName = this.container.querySelector('#joinPlayerNameInput').value.trim();
        if (!playerName) {
            this.showAlert('⚠️', 'Eksik Bilgi', 'Lütfen oyuncu adınızı girin!');
            return;
        }
        
        const room = this.getRoomByCode(this.selectedRoomData.code);
        if (!room) {
            this.showAlert('❌', 'Oda Bulunamadı', 'Oda artık mevcut değil!');
            this.hideJoinRoomModal();
            return;
        }
        
        if (room.players.length >= room.maxPlayers) {
            this.showAlert('🚫', 'Oda Dolu', 'Bu oda dolu! Başka bir oda deneyin.');
            this.hideJoinRoomModal();
            return;
        }
        
        if (room.players.includes(playerName)) {
            this.showAlert('⚠️', 'İsim Çakışması', 'Bu isimde bir oyuncu zaten odada!');
            return;
        }
        
        room.players.push(playerName);
        this.saveRoom(room);
        this.playerName = playerName;
        this.currentRoom = room;
        
        this.showAlert('✅', 'Başarılı', `${room.name} odasına katıldınız!`, () => {
            this.hideJoinRoomModal();
            this.hideMultiplayerModal();
            this.showWaitingRoom(room);
        });
    }

    createJoinRoomModal() {
        const modalHTML = `
            <div id="joinRoomModal" class="join-room-modal">
                <div class="join-room-content">
                    <div class="modal-header">
                        <h3>🎮 Odaya Katıl</h3>
                        <button class="close-btn">✕</button>
                    </div>
                    <div class="room-info-card">
                        <div class="room-icon">🏠</div>
                        <div class="room-details">
                            <h4 id="joinRoomName">Oda Adı</h4>
                            <div class="room-meta">
                                <span>👥 <span id="joinRoomPlayers">0/0</span> Oyuncu</span>
                                <span>📂 <span id="joinRoomCategory">Kategori</span></span>
                            </div>
                            <div class="room-settings">
                                <span>⚡ <span id="joinRoomDifficulty">Zorluk</span></span>
                                <span>🔑 <span id="joinRoomCode">Kod</span></span>
                            </div>
                        </div>
                    </div>
                    <div class="join-form-container">
                        <div class="player-input-group">
                            <label for="joinPlayerNameInput">👤 Oyuncu Adınız</label>
                            <input type="text" id="joinPlayerNameInput" placeholder="Adınızı girin..." maxlength="20">
                        </div>
                        <div class="join-actions">
                            <button class="cancel-join-btn">❌ İptal</button>
                            <button class="confirm-join-btn">✅ Katıl</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.container.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners for the new modal
        const modal = this.container.querySelector('#joinRoomModal');
        const closeBtn = modal.querySelector('.close-btn');
        const cancelBtn = modal.querySelector('.cancel-join-btn');
        const confirmBtn = modal.querySelector('.confirm-join-btn');
        
        // Close button
        closeBtn.addEventListener('click', () => {
            this.hideJoinRoomModal();
        });
        
        // Cancel button
        cancelBtn.addEventListener('click', () => {
            this.hideJoinRoomModal();
        });
        
        // Confirm button
        confirmBtn.addEventListener('click', () => {
            this.confirmJoinRoom();
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideJoinRoomModal();
            }
        });
    }

    showAlert(icon, title, message, callback = null) {
        const modal = this.container.querySelector('#alertModal');
        const alertIcon = this.container.querySelector('#alertIcon');
        const alertTitle = this.container.querySelector('#alertTitle');
        const alertMessage = this.container.querySelector('#alertMessage');
        const alertBtn = this.container.querySelector('#alertBtn');
        
        alertIcon.textContent = icon;
        alertTitle.textContent = title;
        alertMessage.textContent = message;
        
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        
        // Remove previous event listeners
        const newAlertBtn = alertBtn.cloneNode(true);
        alertBtn.parentNode.replaceChild(newAlertBtn, alertBtn);
        
        // Add new event listener
        newAlertBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            if (callback) callback();
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
                if (callback) callback();
            }
        });
    }

    hideAlert() {
        const modal = this.container.querySelector('#alertModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }
}

// Global olarak erişilebilir yap
window.TriviaGame = TriviaGame;

// Store current game instance for global access
window.currentTriviaGame = null;

// Export the class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TriviaGame;
}