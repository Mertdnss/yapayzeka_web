// Voice Cloning JavaScript Functionality

class VoiceCloning {
    constructor() {
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordingTimer = null;
        this.recordingStartTime = 0;
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.canvas = null;
        this.canvasContext = null;
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAudioVisualizer();
        this.setupFileUpload();
        this.setupVoiceSettings();
        this.setupSampleVoices();
        this.setupProcessing();
    }

    setupEventListeners() {
        // Record button
        const recordBtn = document.getElementById('recordBtn');
        if (recordBtn) {
            recordBtn.addEventListener('click', () => this.toggleRecording());
        }

        // Start processing button
        const startProcessingBtn = document.getElementById('startProcessing');
        if (startProcessingBtn) {
            startProcessingBtn.addEventListener('click', () => this.startProcessing());
        }

        // Generate button
        const generateBtn = document.querySelector('.generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateVoice());
        }

        // Download button
        const downloadBtn = document.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadVoice());
        }
    }

    setupAudioVisualizer() {
        this.canvas = document.getElementById('audioCanvas');
        if (this.canvas) {
            this.canvasContext = this.canvas.getContext('2d');
            this.drawStaticWaveform();
        }
    }

    drawStaticWaveform() {
        if (!this.canvasContext) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.canvasContext.clearRect(0, 0, width, height);
        this.canvasContext.strokeStyle = '#6C63FF';
        this.canvasContext.lineWidth = 2;
        this.canvasContext.beginPath();
        
        // Draw a static waveform
        for (let i = 0; i < width; i += 4) {
            const amplitude = Math.sin(i * 0.02) * 20 + Math.random() * 10;
            const y = height / 2 + amplitude;
            
            if (i === 0) {
                this.canvasContext.moveTo(i, y);
            } else {
                this.canvasContext.lineTo(i, y);
            }
        }
        
        this.canvasContext.stroke();
    }

    drawLiveWaveform(dataArray) {
        if (!this.canvasContext) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.canvasContext.clearRect(0, 0, width, height);
        
        // Create gradient
        const gradient = this.canvasContext.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#6C63FF');
        gradient.addColorStop(0.5, '#4FACFE');
        gradient.addColorStop(1, '#6C63FF');
        
        this.canvasContext.strokeStyle = gradient;
        this.canvasContext.lineWidth = 3;
        this.canvasContext.beginPath();
        
        const sliceWidth = width / dataArray.length;
        let x = 0;
        
        for (let i = 0; i < dataArray.length; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * height / 2;
            
            if (i === 0) {
                this.canvasContext.moveTo(x, y);
            } else {
                this.canvasContext.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        this.canvasContext.stroke();
    }

    async toggleRecording() {
        const recordBtn = document.getElementById('recordBtn');
        
        if (!this.isRecording) {
            await this.startRecording();
        } else {
            this.stopRecording();
        }
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            // Setup audio context for visualization
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.microphone.connect(this.analyser);
            
            this.analyser.fftSize = 256;
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };
            
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.handleRecordedAudio(audioBlob);
                
                // Stop visualization
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                }
                this.drawStaticWaveform();
            };
            
            this.mediaRecorder.start();
            this.isRecording = true;
            
            // Update UI
            const recordBtn = document.getElementById('recordBtn');
            recordBtn.classList.add('recording');
            recordBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="6" width="12" height="12" fill="currentColor"/>
                </svg>
                Kaydı Durdur
            `;
            
            // Start timer
            this.recordingStartTime = Date.now();
            this.startRecordingTimer();
            
            // Start visualization
            this.visualize(dataArray);
            
        } catch (error) {
            console.error('Mikrofon erişimi hatası:', error);
            this.showNotification('Mikrofon erişimi reddedildi', 'error');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            
            // Stop all tracks
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            
            // Update UI
            const recordBtn = document.getElementById('recordBtn');
            recordBtn.classList.remove('recording');
            recordBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                </svg>
                Kayıt Başlat
            `;
            
            // Stop timer
            this.stopRecordingTimer();
        }
    }

    visualize(dataArray) {
        if (!this.isRecording) return;
        
        this.analyser.getByteTimeDomainData(dataArray);
        this.drawLiveWaveform(dataArray);
        
        this.animationId = requestAnimationFrame(() => this.visualize(dataArray));
    }

    startRecordingTimer() {
        const timerElement = document.querySelector('.recording-timer');
        
        this.recordingTimer = setInterval(() => {
            const elapsed = Date.now() - this.recordingStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopRecordingTimer() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
        
        const timerElement = document.querySelector('.recording-timer');
        timerElement.textContent = '00:00';
    }

    handleRecordedAudio(audioBlob) {
        // Create audio URL
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Update original audio player
        const originalPlayer = document.querySelector('.comparison-item:first-child .audio-player');
        if (originalPlayer) {
            this.updateAudioPlayer(originalPlayer, audioUrl);
        }
        
        this.showNotification('Ses kaydı tamamlandı', 'success');
    }

    setupFileUpload() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('audioFile');
        const uploadBtn = document.querySelector('.upload-btn');
        
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => fileInput.click());
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
        
        if (uploadZone) {
            // Drag and drop functionality
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });
            
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('dragover');
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.processUploadedFile(files[0]);
                }
            });
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.processUploadedFile(file);
        }
    }

    processUploadedFile(file) {
        // Validate file type
        const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg'];
        if (!allowedTypes.includes(file.type)) {
            this.showNotification('Desteklenmeyen dosya formatı', 'error');
            return;
        }
        
        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('Dosya boyutu 10MB\'dan büyük olamaz', 'error');
            return;
        }
        
        // Create audio URL
        const audioUrl = URL.createObjectURL(file);
        
        // Update original audio player
        const originalPlayer = document.querySelector('.comparison-item:first-child .audio-player');
        if (originalPlayer) {
            this.updateAudioPlayer(originalPlayer, audioUrl);
        }
        
        this.showNotification('Ses dosyası başarıyla yüklendi', 'success');
    }

    updateAudioPlayer(playerElement, audioUrl) {
        const playBtn = playerElement.querySelector('.play-btn');
        const duration = playerElement.querySelector('.duration');
        
        // Create audio element
        const audio = new Audio(audioUrl);
        
        audio.addEventListener('loadedmetadata', () => {
            const minutes = Math.floor(audio.duration / 60);
            const seconds = Math.floor(audio.duration % 60);
            duration.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        });
        
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="3" y="2" width="3" height="12" fill="currentColor"/>
                        <rect x="10" y="2" width="3" height="12" fill="currentColor"/>
                    </svg>
                `;
            } else {
                audio.pause();
                playBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 2l10 6-10 6V2z" fill="currentColor"/>
                    </svg>
                `;
            }
        });
        
        audio.addEventListener('ended', () => {
            playBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 2l10 6-10 6V2z" fill="currentColor"/>
                </svg>
            `;
        });
    }

    setupVoiceSettings() {
        const speechRate = document.getElementById('speechRate');
        const pitch = document.getElementById('pitch');
        const volume = document.getElementById('volume');
        
        if (speechRate) {
            speechRate.addEventListener('input', (e) => {
                const value = e.target.value;
                e.target.nextElementSibling.textContent = `${value}x`;
            });
        }
        
        if (pitch) {
            pitch.addEventListener('input', (e) => {
                const value = e.target.value;
                e.target.nextElementSibling.textContent = value;
            });
        }
        
        if (volume) {
            volume.addEventListener('input', (e) => {
                const value = e.target.value;
                e.target.nextElementSibling.textContent = `${value}%`;
            });
        }
    }

    setupSampleVoices() {
        const sampleCards = document.querySelectorAll('.sample-voice-card');
        
        sampleCards.forEach(card => {
            const playBtn = card.querySelector('.play-btn');
            const selectBtn = card.querySelector('.select-btn');
            
            if (playBtn) {
                playBtn.addEventListener('click', () => {
                    this.playSampleVoice(card);
                });
            }
            
            if (selectBtn) {
                selectBtn.addEventListener('click', () => {
                    this.selectSampleVoice(card);
                });
            }
        });
    }

    playSampleVoice(card) {
        const voiceType = card.querySelector('h4').textContent;
        this.showNotification(`${voiceType} örneği oynatılıyor`, 'info');
        
        // Simulate audio playback
        const playBtn = card.querySelector('.play-btn');
        playBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="2" width="3" height="12" fill="currentColor"/>
                <rect x="10" y="2" width="3" height="12" fill="currentColor"/>
            </svg>
        `;
        
        setTimeout(() => {
            playBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 2l10 6-10 6V2z" fill="currentColor"/>
                </svg>
            `;
        }, 3000);
    }

    selectSampleVoice(card) {
        // Remove previous selections
        document.querySelectorAll('.sample-voice-card').forEach(c => {
            c.classList.remove('selected');
            const btn = c.querySelector('.select-btn');
            btn.textContent = 'Seç';
            btn.style.background = 'transparent';
            btn.style.color = 'var(--primary-color)';
        });
        
        // Select current card
        card.classList.add('selected');
        const selectBtn = card.querySelector('.select-btn');
        selectBtn.textContent = 'Seçildi';
        selectBtn.style.background = 'var(--primary-color)';
        selectBtn.style.color = 'white';
        
        const voiceType = card.querySelector('h4').textContent;
        this.showNotification(`${voiceType} seçildi`, 'success');
    }

    setupProcessing() {
        // Setup step animations and progress tracking
        this.processingSteps = [
            { name: 'Ses Analizi', duration: 3000 },
            { name: 'Model Eğitimi', duration: 8000 },
            { name: 'Optimizasyon', duration: 4000 }
        ];
    }

    async startProcessing() {
        const startBtn = document.getElementById('startProcessing');
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const steps = document.querySelectorAll('.step');
        
        // Disable button
        startBtn.disabled = true;
        startBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="50.27" stroke-dashoffset="50.27">
                    <animate attributeName="stroke-dashoffset" values="50.27;0;50.27" dur="2s" repeatCount="indefinite"/>
                </circle>
            </svg>
            İşleniyor...
        `;
        
        // Update processing status
        const statusElement = document.querySelector('.processing-status');
        statusElement.textContent = 'İşleniyor';
        statusElement.className = 'processing-status processing';
        
        let totalProgress = 0;
        const totalDuration = this.processingSteps.reduce((sum, step) => sum + step.duration, 0);
        
        for (let i = 0; i < this.processingSteps.length; i++) {
            const step = this.processingSteps[i];
            const stepElement = steps[i + 1]; // Skip first completed step
            
            // Activate current step
            stepElement.classList.add('active');
            
            // Animate progress for this step
            const stepProgress = await this.animateStepProgress(step.duration, totalProgress, totalProgress + step.duration, totalDuration, progressFill, progressText);
            totalProgress += step.duration;
            
            // Complete current step
            stepElement.classList.remove('active');
            stepElement.classList.add('completed');
            
            const stepIcon = stepElement.querySelector('.step-icon');
            stepIcon.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
        
        // Processing complete
        statusElement.textContent = 'Tamamlandı';
        statusElement.className = 'processing-status';
        
        startBtn.disabled = false;
        startBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 4l8 6-8 6V4z" fill="currentColor"/>
            </svg>
            Tekrar İşle
        `;
        
        this.showNotification('Ses klonlama işlemi tamamlandı!', 'success');
        
        // Enable generate button
        const generateBtn = document.querySelector('.generate-btn');
        generateBtn.disabled = false;
    }

    animateStepProgress(duration, startProgress, endProgress, totalDuration, progressFill, progressText) {
        return new Promise(resolve => {
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const currentProgress = startProgress + (endProgress - startProgress) * progress;
                const percentage = (currentProgress / totalDuration) * 100;
                
                progressFill.style.width = `${percentage}%`;
                progressText.textContent = `İşleniyor... ${Math.round(percentage)}%`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }

    generateVoice() {
        const testText = document.getElementById('testText').value;
        
        if (!testText.trim()) {
            this.showNotification('Lütfen test metni girin', 'error');
            return;
        }
        
        const generateBtn = document.querySelector('.generate-btn');
        generateBtn.disabled = true;
        generateBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="37.7" stroke-dashoffset="37.7">
                    <animate attributeName="stroke-dashoffset" values="37.7;0;37.7" dur="2s" repeatCount="indefinite"/>
                </circle>
            </svg>
            Oluşturuluyor...
        `;
        
        // Simulate voice generation
        setTimeout(() => {
            generateBtn.disabled = false;
            generateBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1l2.5 5 5.5.5-4 4 1 5.5L8 13l-5 2.5 1-5.5-4-4 5.5-.5L8 1z" fill="currentColor"/>
                </svg>
                Ses Oluştur
            `;
            
            // Update cloned voice player
            const clonedPlayer = document.querySelector('.comparison-item:last-child .audio-player');
            if (clonedPlayer) {
                this.simulateGeneratedAudio(clonedPlayer);
            }
            
            this.showNotification('Klonlanan ses başarıyla oluşturuldu!', 'success');
            
            // Enable download button
            const downloadBtn = document.querySelector('.download-btn');
            downloadBtn.disabled = false;
        }, 3000);
    }

    simulateGeneratedAudio(playerElement) {
        const playBtn = playerElement.querySelector('.play-btn');
        const duration = playerElement.querySelector('.duration');
        
        duration.textContent = '0:15';
        
        playBtn.addEventListener('click', () => {
            this.showNotification('Klonlanan ses oynatılıyor', 'info');
            
            playBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="2" width="3" height="12" fill="currentColor"/>
                    <rect x="10" y="2" width="3" height="12" fill="currentColor"/>
                </svg>
            `;
            
            setTimeout(() => {
                playBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 2l10 6-10 6V2z" fill="currentColor"/>
                    </svg>
                `;
            }, 15000);
        });
    }

    downloadVoice() {
        this.showNotification('Ses dosyası indiriliyor...', 'info');
        
        // Simulate download
        const downloadBtn = document.querySelector('.download-btn');
        downloadBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="37.7" stroke-dashoffset="37.7">
                    <animate attributeName="stroke-dashoffset" values="37.7;0;37.7" dur="2s" repeatCount="indefinite"/>
                </circle>
            </svg>
            İndiriliyor...
        `;
        
        setTimeout(() => {
            downloadBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 12l-4-4h3V2h2v6h3l-4 4zM2 14h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                İndir
            `;
            
            this.showNotification('Ses dosyası başarıyla indirildi!', 'success');
        }, 2000);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VoiceCloning();
});

// Add notification styles
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 350px;
    border-left: 4px solid #6C63FF;
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-left-color: #22c55e;
}

.notification.error {
    border-left-color: #ef4444;
}

.notification.info {
    border-left-color: #3b82f6;
}

.notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    gap: 1rem;
}

.notification-content span {
    color: var(--text-primary);
    font-weight: 500;
}

.notification-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.notification-close:hover {
    background: rgba(0, 0, 0, 0.1);
    color: var(--text-primary);
}
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);