// Ses Klonlama JavaScript Fonksiyonları
class VoiceCloning {
    constructor() {
        this.currentAudio = null;
        this.currentModel = null;
        this.isModelReady = false;
        this.uploadedFile = null;
        this.generatedAudioUrl = null;
        this.presetModels = {
            'female-young': 'Genç Kadın Sesi',
            'male-adult': 'Yetişkin Erkek Sesi', 
            'female-narrator': 'Anlatıcı Sesi',
            'male-deep': 'Derin Erkek Sesi'
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateModelStatus('pending');
        this.updateStepProgress('upload');
    }

    setupEventListeners() {
        // File Upload
        const uploadArea = document.getElementById('uploadArea');
        const audioFile = document.getElementById('audioFile');
        const uploadBtn = document.querySelector('.upload-btn');
        const removeFileBtn = document.getElementById('removeFile');

        if (uploadArea) uploadArea.addEventListener('click', () => audioFile?.click());
        if (uploadArea) uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        if (uploadArea) uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        if (uploadArea) uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        
        if (audioFile) audioFile.addEventListener('change', this.handleFileSelect.bind(this));
        if (uploadBtn) uploadBtn.addEventListener('click', () => audioFile?.click());
        if (removeFileBtn) removeFileBtn.addEventListener('click', this.removeFile.bind(this));

        // Model Selection
        const voiceModelSelect = document.getElementById('voiceModelSelect');
        if (voiceModelSelect) voiceModelSelect.addEventListener('change', this.handleModelSelection.bind(this));

        // Sample Audio Players
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', this.toggleSampleAudio.bind(this));
        });

        // Model Preview Buttons
        document.querySelectorAll('.model-preview-btn').forEach(btn => {
            btn.addEventListener('click', this.previewModel.bind(this));
        });

        // Text Input
        const textInput = document.getElementById('textInput');
        if (textInput) textInput.addEventListener('input', this.updateCharCount.bind(this));

        // Voice Settings
        const speedSlider = document.getElementById('speechSpeed');
        const pitchSlider = document.getElementById('voicePitch');
        
        if (speedSlider) speedSlider.addEventListener('input', this.updateSpeedValue.bind(this));
        if (pitchSlider) pitchSlider.addEventListener('input', this.updatePitchValue.bind(this));

        // Generate Button
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) generateBtn.addEventListener('click', this.generateVoice.bind(this));

        // Preset Models
        document.querySelectorAll('.model-select-btn').forEach(btn => {
            btn.addEventListener('click', this.selectPresetModel.bind(this));
        });

        // Model Test Button
        const modelTestBtn = document.getElementById('modelTestBtn');
        if (modelTestBtn) modelTestBtn.addEventListener('click', this.testSelectedModel.bind(this));

        // Audio Player Controls
        const audioPlayBtn = document.getElementById('audioPlayBtn');
        const downloadAudioBtn = document.getElementById('downloadAudioBtn');
        
        if (audioPlayBtn) audioPlayBtn.addEventListener('click', this.toggleGeneratedAudio.bind(this));
        if (downloadAudioBtn) downloadAudioBtn.addEventListener('click', this.downloadGeneratedAudio.bind(this));

        // Refresh Models
        const refreshBtn = document.getElementById('refreshModels');
        if (refreshBtn) refreshBtn.addEventListener('click', this.refreshModels.bind(this));
    }

    // File Upload Handlers
    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        if (!this.validateFile(file)) return;

        this.uploadedFile = file;
        this.displayFileInfo(file);
        this.showNotification('success', 'Dosya Yüklendi', 'Ses dosyası başarıyla yüklendi. Model eğitimi başlıyor...');
        this.startModelTraining();
    }

    validateFile(file) {
        const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg'];
        const maxSize = 50 * 1024 * 1024; // 50MB

        if (!allowedTypes.includes(file.type)) {
            this.showNotification('error', 'Geçersiz Dosya Formatı', 'Sadece WAV ve MP3 dosyaları desteklenmektedir.');
            return false;
        }

        if (file.size > maxSize) {
            this.showNotification('error', 'Dosya Çok Büyük', 'Dosya boyutu 50MB\'dan küçük olmalıdır.');
            return false;
        }

        return true;
    }

    displayFileInfo(file) {
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const fileDuration = document.getElementById('fileDuration');

        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = this.formatFileSize(file.size);
        
        const estimatedDuration = Math.floor(Math.random() * 60) + 20;
        if (fileDuration) fileDuration.textContent = this.formatDuration(estimatedDuration);
        if (fileInfo) fileInfo.style.display = 'block';
    }

    removeFile() {
        this.uploadedFile = null;
        const fileInfo = document.getElementById('fileInfo');
        const audioFile = document.getElementById('audioFile');
        
        if (fileInfo) fileInfo.style.display = 'none';
        if (audioFile) audioFile.value = '';
        
        this.updateModelStatus('pending');
        this.updateStepProgress('upload');
        this.isModelReady = false;
        this.toggleGenerationControls(false);
    }

    startModelTraining() {
        this.updateModelStatus('training');
        this.updateStepProgress('train');
        
        setTimeout(() => {
            this.completeModelTraining();
        }, 5000);
    }

    completeModelTraining() {
        this.isModelReady = true;
        this.updateModelStatus('ready');
        this.updateStepProgress('generate');
        this.toggleGenerationControls(true);
        this.showNotification('success', 'Model Hazır', 'Ses modeliniz başarıyla oluşturuldu!');
    }

    updateModelStatus(status) {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        
        if (!statusIndicator || !statusText) return;

        statusIndicator.className = `status-indicator ${status}`;
        
        const statusTexts = {
            pending: 'Model henüz oluşturulmadı',
            training: 'Model eğitiliyor...',
            ready: 'Model kullanıma hazır',
            error: 'Hata oluştu'
        };
        
        statusText.textContent = statusTexts[status] || statusTexts.pending;
    }

    updateStepProgress(currentStep) {
        const steps = document.querySelectorAll('.step');
        const stepOrder = ['upload', 'train', 'generate', 'download'];
        const currentIndex = stepOrder.indexOf(currentStep);
        
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (index < currentIndex) {
                step.classList.add('completed');
            } else if (index === currentIndex) {
                step.classList.add('active');
            }
        });
    }

    toggleGenerationControls(enabled) {
        const elements = [
            document.getElementById('textInput'),
            document.getElementById('speechSpeed'),
            document.getElementById('voicePitch'),
            document.getElementById('generateBtn')
        ];
        
        elements.forEach(element => {
            if (element) element.disabled = !enabled;
        });
    }

    toggleSampleAudio(e) {
        e.stopPropagation();
        const btn = e.currentTarget;
        const sampleItem = btn.closest('.sample-item');
        const isPlaying = btn.classList.contains('playing');
        
        // Stop all other audio first
        this.stopAllSampleAudio();
        
        if (!isPlaying) {
            // Add playing state
            btn.classList.add('playing');
            sampleItem?.classList.add('playing');
            
            // Add ripple effect
            const ripple = btn.querySelector('.play-ripple');
            if (ripple) {
                ripple.style.width = '60px';
                ripple.style.height = '60px';
                setTimeout(() => {
                    ripple.style.width = '0';
                    ripple.style.height = '0';
                }, 300);
            }
            
            // Change icon to pause
            const playIcon = btn.querySelector('.play-icon svg path');
            if (playIcon) {
                playIcon.setAttribute('d', 'M6 4h4v12H6V4zm6 0h4v12h-4V4z'); // Pause icon
            }
            
            // Simulate audio duration
            const duration = 3000 + Math.random() * 2000; // 3-5 seconds
            setTimeout(() => {
                this.stopSampleAudio(btn);
            }, duration);
            
        } else {
            this.stopSampleAudio(btn);
        }
    }

    stopAllSampleAudio() {
        document.querySelectorAll('.play-btn.playing').forEach(btn => {
            this.stopSampleAudio(btn);
        });
    }

    stopSampleAudio(btn) {
        const sampleItem = btn.closest('.sample-item');
        
        btn.classList.remove('playing');
        sampleItem?.classList.remove('playing');
        
        // Change icon back to play
        const playIcon = btn.querySelector('.play-icon svg path');
        if (playIcon) {
            playIcon.setAttribute('d', 'M6 4l8 6-8 6V4z'); // Play icon
        }
    }

    updateCharCount() {
        const textInput = document.getElementById('textInput');
        const charCount = document.getElementById('charCount');
        
        if (textInput && charCount) {
            charCount.textContent = textInput.value.length;
        }
    }

    updateSpeedValue(e) {
        const value = parseFloat(e.target.value);
        const display = e.target.parentElement.querySelector('.slider-value');
        if (display) display.textContent = `${value}x`;
    }

    updatePitchValue(e) {
        const value = parseFloat(e.target.value);
        const display = e.target.parentElement.querySelector('.slider-value');
        if (display) {
            if (value < 0.95) display.textContent = 'Düşük';
            else if (value > 1.05) display.textContent = 'Yüksek';
            else display.textContent = 'Normal';
        }
    }

    generateVoice() {
        const textInput = document.getElementById('textInput');
        const text = textInput?.value.trim();
        
        if (!text) {
            this.showNotification('warning', 'Metin Gerekli', 'Lütfen seslendirilecek metni girin.');
            return;
        }
        
        if (!this.currentModel) {
            this.showNotification('warning', 'Model Seçilmedi', 'Lütfen bir ses modeli seçin.');
            return;
        }
        
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.classList.add('generating');
            
            // Add generating state to button
            const btnContent = generateBtn.querySelector('.btn-content');
            if (btnContent) {
                btnContent.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                    <span>Üretiliyor...</span>
                `;
            }
            
            // Trigger glow animation
            const btnGlow = generateBtn.querySelector('.btn-glow');
            if (btnGlow) {
                btnGlow.style.animation = 'none';
                setTimeout(() => {
                    btnGlow.style.animation = 'btnGlow 2s infinite';
                }, 100);
            }
        }
        
        this.showGenerationProgress();
        this.simulateGeneration();
        
        const modelName = this.currentModel === 'custom' ? 'özel modeliniz' : this.presetModels[this.currentModel];
        this.showNotification('info', 'Ses Üretiliyor', `${modelName} kullanılarak ses üretimi başladı.`);
    }

    showGenerationProgress() {
        const progressContainer = document.getElementById('generationProgress');
        const generateBtn = document.getElementById('generateBtn');
        
        if (generateBtn) generateBtn.style.display = 'none';
        if (progressContainer) progressContainer.style.display = 'block';
        
        this.animateProgress();
    }

    animateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (!progressFill || !progressText) return;
        
        const steps = [
            { progress: 20, text: 'Metin analiz ediliyor...' },
            { progress: 50, text: 'Ses sentezleniyor...' },
            { progress: 80, text: 'Audio dosyası oluşturuluyor...' },
            { progress: 100, text: 'Tamamlandı!' }
        ];
        
        let stepIndex = 0;
        const interval = setInterval(() => {
            const step = steps[stepIndex];
            progressFill.style.width = `${step.progress}%`;
            progressText.textContent = step.text;
            
            stepIndex++;
            if (stepIndex >= steps.length) {
                clearInterval(interval);
                setTimeout(() => this.completeGeneration(), 500);
            }
        }, 1000);
    }

    simulateGeneration() {
        setTimeout(() => this.completeGeneration(), 4000);
    }

    completeGeneration() {
        this.generatedAudioUrl = 'data:audio/wav;base64,mock-audio-data';
        
        const generateBtn = document.getElementById('generateBtn');
        const generatedAudio = document.getElementById('generatedAudio');
        const totalTimeSpan = document.getElementById('totalTime');
        
        // Reset generate button
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.classList.remove('generating');
            
            const btnContent = generateBtn.querySelector('.btn-content');
            if (btnContent) {
                btnContent.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 1l1.5 3 3.5.5-2.5 2.5.5 3.5L10 9l-2.5 1.5.5-3.5L5.5 4.5 9 4 10 1z" fill="currentColor"/>
                    </svg>
                    <span>Ses Üret</span>
                `;
            }
            
            // Stop glow animation
            const btnGlow = generateBtn.querySelector('.btn-glow');
            if (btnGlow) {
                btnGlow.style.animation = 'none';
            }
        }
        
        // Show audio player
        if (generatedAudio) generatedAudio.style.display = 'block';
        if (totalTimeSpan) totalTimeSpan.textContent = '0:08';
        
        this.updateStepProgress('download');
        this.showNotification('success', 'Ses Hazır!', 'Sesiniz başarıyla üretildi ve indirmeye hazır.');
    }

    selectPresetModel(e) {
        e.stopPropagation();
        const modelId = e.currentTarget.dataset.model;
        const modelName = this.presetModels[modelId];
        const voiceModelSelect = document.getElementById('voiceModelSelect');
        
        // Update dropdown selection
        if (voiceModelSelect) {
            voiceModelSelect.value = modelId;
            // Trigger change event to update the interface
            voiceModelSelect.dispatchEvent(new Event('change'));
        }
        
        // Visual feedback for the button
        e.currentTarget.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.currentTarget.style.transform = '';
        }, 150);
        
        this.showNotification('success', 'Model Seçildi', `${modelName} modeli aktif edildi.`);
    }

    toggleGeneratedAudio() {
        const audioPlayBtn = document.getElementById('audioPlayBtn');
        const isPlaying = audioPlayBtn?.classList.contains('playing');
        
        if (!isPlaying) {
            this.playGeneratedAudio();
        } else {
            this.stopGeneratedAudio();
        }
    }

    playGeneratedAudio() {
        const audioPlayBtn = document.getElementById('audioPlayBtn');
        
        if (audioPlayBtn) {
            audioPlayBtn.classList.add('playing');
            
            // Update icon and add waves animation
            const playIcon = audioPlayBtn.querySelector('.play-icon svg path');
            if (playIcon) {
                playIcon.setAttribute('d', 'M6 4h4v16H6V4zm8 0h4v16h-4V4z'); // Pause icon
            }
            
            // Show waves
            const waves = audioPlayBtn.querySelector('.play-waves');
            if (waves) {
                waves.style.opacity = '1';
            }
        }
        
        // Simulate audio timeline progress
        this.animateAudioTimeline();
        
        // Auto stop after duration
        setTimeout(() => {
            this.stopGeneratedAudio();
        }, 8000); // 8 seconds
    }

    stopGeneratedAudio() {
        const audioPlayBtn = document.getElementById('audioPlayBtn');
        
        if (audioPlayBtn) {
            audioPlayBtn.classList.remove('playing');
            
            // Update icon
            const playIcon = audioPlayBtn.querySelector('.play-icon svg path');
            if (playIcon) {
                playIcon.setAttribute('d', 'M5 3l14 9-14 9V3z'); // Play icon
            }
            
            // Hide waves
            const waves = audioPlayBtn.querySelector('.play-waves');
            if (waves) {
                waves.style.opacity = '0';
            }
        }
        
        // Reset timeline
        const timelineProgress = document.getElementById('timelineProgress');
        if (timelineProgress) {
            timelineProgress.style.width = '0%';
        }
    }

    animateAudioTimeline() {
        const timelineProgress = document.getElementById('timelineProgress');
        const currentTimeSpan = document.getElementById('currentTime');
        let progress = 0;
        const duration = 8; // 8 seconds
        
        const interval = setInterval(() => {
            progress += 0.1;
            const percentage = (progress / duration) * 100;
            
            if (timelineProgress) {
                timelineProgress.style.width = `${Math.min(percentage, 100)}%`;
            }
            
            if (currentTimeSpan) {
                const currentSeconds = Math.floor(progress);
                currentTimeSpan.textContent = this.formatTime(currentSeconds);
            }
            
            if (progress >= duration) {
                clearInterval(interval);
            }
        }, 100);
    }

    downloadGeneratedAudio() {
        if (!this.generatedAudioUrl) {
            this.showNotification('error', 'Ses Bulunamadı', 'İndirilecek ses dosyası bulunamadı.');
            return;
        }
        
        const link = document.createElement('a');
        link.href = '#';
        link.download = `generated_voice_${Date.now()}.wav`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('success', 'İndiriliyor', 'Ses dosyası indiriliyor...');
    }

    refreshModels() {
        const refreshBtn = document.getElementById('refreshModels');
        if (!refreshBtn) return;
        
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="animation: spin 1s linear infinite;"><path d="M1 4v6h6M15 12V6H9M2.5 15a6.5 6.5 0 0012.4-3M13.5 1A6.5 6.5 0 001.1 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Yenileniyor...`;
        
        setTimeout(() => {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 4v6h6M15 12V6H9M2.5 15a6.5 6.5 0 0012.4-3M13.5 1A6.5 6.5 0 001.1 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Yenile`;
            this.showNotification('info', 'Modeller Yenilendi', 'Model listesi güncellendi.');
        }, 2000);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    showNotification(type, title, message) {
        // Use the global notification system if available
        if (window.notificationSystem) {
            window.notificationSystem.showToast(title, type);
        } else {
            // Fallback alert
            alert(`${title}: ${message}`);
        }
    }

    // Model Selection Handlers
    handleModelSelection(e) {
        const selectedValue = e.target.value;
        const modelPreview = document.getElementById('modelPreview');
        const selectedModelName = document.getElementById('selectedModelName');
        const textInput = document.getElementById('textInput');
        const generateBtn = document.getElementById('generateBtn');
        
        if (selectedValue && selectedValue !== '') {
            if (modelPreview) modelPreview.style.display = 'block';
            if (selectedModelName) {
                if (selectedValue === 'custom') {
                    selectedModelName.textContent = 'Özel Modeliniz';
                } else {
                    selectedModelName.textContent = this.presetModels[selectedValue];
                }
            }
            
            // Enable text input and generate button
            if (textInput) {
                textInput.disabled = false;
                textInput.placeholder = "Seslendirilmesini istediğiniz metni buraya yazın...";
            }
            if (generateBtn) generateBtn.disabled = false;
            
            this.currentModel = selectedValue;
            this.toggleGenerationControls(true);
            
            // Update model selection visual state
            this.updatePresetModelSelection(selectedValue);
            
            this.showNotification('success', 'Model Seçildi', `${this.presetModels[selectedValue] || 'Özel model'} aktif edildi.`);
        } else {
            if (modelPreview) modelPreview.style.display = 'none';
            if (textInput) textInput.disabled = true;
            if (generateBtn) generateBtn.disabled = true;
            this.currentModel = null;
            this.toggleGenerationControls(false);
        }
    }

    updatePresetModelSelection(selectedModel) {
        document.querySelectorAll('.modern-preset-model').forEach(model => {
            model.classList.remove('selected');
            const selectBtn = model.querySelector('.model-select-btn');
            if (selectBtn) {
                selectBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M15 4L6 13l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Seç</span>
                `;
            }
        });
        
        if (selectedModel && selectedModel !== 'custom') {
            const selectedModelCard = document.querySelector(`[data-model="${selectedModel}"]`);
            if (selectedModelCard) {
                selectedModelCard.classList.add('selected');
                const selectBtn = selectedModelCard.querySelector('.model-select-btn');
                if (selectBtn) {
                    selectBtn.innerHTML = `
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M15 4L6 13l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Seçili</span>
                    `;
                }
            }
        }
    }

    previewModel(e) {
        e.stopPropagation();
        const modelId = e.currentTarget.dataset.model;
        const modelName = this.presetModels[modelId];
        
        // Add visual feedback
        e.currentTarget.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.currentTarget.style.transform = '';
        }, 150);
        
        // Simulate playing model preview
        this.showNotification('info', 'Model Örneği', `${modelName} ses örneği çalınıyor...`);
        
        // Add playing state to button
        const playIcon = e.currentTarget.querySelector('svg path');
        if (playIcon) {
            playIcon.setAttribute('d', 'M6 4h2v10H6V4zm4 0h2v10h-2V4z'); // Pause icon
        }
        
        setTimeout(() => {
            if (playIcon) {
                playIcon.setAttribute('d', 'M6 4l8 6-8 6V4z'); // Play icon
            }
            this.showNotification('success', 'Örnek Tamamlandı', `${modelName} ses örneği tamamlandı.`);
        }, 3000);
    }

    testSelectedModel() {
        if (!this.currentModel) {
            this.showNotification('warning', 'Model Seçilmedi', 'Önce bir ses modeli seçin.');
            return;
        }
        
        const testBtn = document.getElementById('modelTestBtn');
        if (testBtn) {
            testBtn.disabled = true;
            testBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4h2v8H6V4zm2 0h2v8h-2V4z" fill="currentColor"/>
                </svg>
                Test Ediliyor...
            `;
        }
        
        const modelName = this.currentModel === 'custom' ? 'Özel modeliniz' : this.presetModels[this.currentModel];
        this.showNotification('info', 'Model Testi', `${modelName} test ediliyor...`);
        
        setTimeout(() => {
            if (testBtn) {
                testBtn.disabled = false;
                testBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 2l10 6-10 6V2z" fill="currentColor"/>
                    </svg>
                    Test Et
                `;
            }
            this.showNotification('success', 'Test Tamamlandı', `${modelName} başarıyla test edildi.`);
        }, 2000);
    }
}

// CSS spin animasyonu
if (!document.querySelector('#voice-spin-animation')) {
    const style = document.createElement('style');
    style.id = 'voice-spin-animation';
    style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
}

// Initialize Voice Cloning when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.voiceCloning = new VoiceCloning();
    console.log('🎤 Voice Cloning System initialized');
}); 