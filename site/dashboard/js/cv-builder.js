// CV Builder JavaScript
class CVBuilder {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 6;
        this.isBuilderMode = false;
        this.cvData = {
            personal: {},
            experience: [],
            education: [],
            skills: [],
            summary: ''
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showDashboard();
    }

    showDashboard() {
        document.getElementById('dashboardView').style.display = 'block';
        document.getElementById('builderView').style.display = 'none';
        this.isBuilderMode = false;
    }

    showBuilder() {
        document.getElementById('dashboardView').style.display = 'none';
        document.getElementById('builderView').style.display = 'block';
        this.isBuilderMode = true;
        this.updateProgressBar();
        this.showStep(1);
    }

    setupEventListeners() {
        // Create New CV button
        document.getElementById('createNewCV').addEventListener('click', () => this.showBuilder());
        
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousStep());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
        
        // Progress bar steps
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.addEventListener('click', () => this.goToStep(index + 1));
        });

        // Add experience button
        const addExpBtn = document.getElementById('addExperience');
        if (addExpBtn) addExpBtn.addEventListener('click', () => this.addExperience());
        
        // Add education button
        const addEduBtn = document.getElementById('addEducation');
        if (addEduBtn) addEduBtn.addEventListener('click', () => this.addEducation());
        
        // Add skill functionality
        const addSkillBtn = document.getElementById('addSkill');
        const skillInput = document.getElementById('skillInput');
        
        if (addSkillBtn) addSkillBtn.addEventListener('click', () => this.addSkill());
        if (skillInput) {
            skillInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addSkill();
                }
            });
        }

        // Suggested skills
        document.querySelectorAll('.suggested-skill').forEach(skill => {
            skill.addEventListener('click', () => this.addSuggestedSkill(skill.textContent));
        });

        // Form inputs for real-time preview
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });

        // AI suggestions
        document.querySelectorAll('.ai-suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', () => this.generateAISuggestion(suggestion));
        });

        // Download CV
        const downloadBtn = document.getElementById('downloadCV');
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadCV());
        
        // Dashboard CV actions
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showBuilder());
        });
        
        document.querySelectorAll('.cv-actions .download-btn').forEach(btn => {
            btn.addEventListener('click', () => this.downloadExistingCV());
        });
        
        // AI toggle functionality
        document.querySelectorAll('.ai-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleAIToggle(e));
        });
        
        // Example message buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', () => this.insertExampleMessage(btn.textContent));
        });
        
        // AI generation buttons
        document.querySelectorAll('.ai-generate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.generateAIContent(e));
        });
    }

    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
        
        // Show current step
        const stepElement = document.getElementById(`step-${step}`);
        if (stepElement) {
            stepElement.classList.add('active');
        }
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.disabled = step === 1;
        if (nextBtn) nextBtn.textContent = step === this.totalSteps ? 'CV\'yi Tamamla' : 'Sonraki Adım';
        
        this.currentStep = step;
        this.updateProgressBar();
        
        // Update preview if on preview step
        if (step === 5) {
            this.updatePreview();
        }
    }

    updateProgressBar() {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            }
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.showStep(this.currentStep + 1);
            } else {
                this.completeCV();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    goToStep(step) {
        if (step <= this.currentStep + 1 && step >= 1) {
            this.showStep(step);
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (!currentStepElement) return true;
        
        const requiredFields = currentStepElement.querySelectorAll('input[required], textarea[required]');
        
        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });

        if (!isValid) {
            this.showNotification('Lütfen tüm gerekli alanları doldurun.', 'error');
        }

        return isValid;
    }

    addExperience() {
        const experienceContainer = document.getElementById('experienceContainer');
        const experienceCount = experienceContainer.children.length;
        
        const experienceHTML = `
            <div class="experience-item" data-index="${experienceCount}">
                <button type="button" class="remove-item-btn" onclick="cvBuilder.removeExperience(${experienceCount})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Şirket Adı *</label>
                        <input type="text" name="company_${experienceCount}" required>
                    </div>
                    <div class="form-group">
                        <label>Pozisyon *</label>
                        <input type="text" name="position_${experienceCount}" required>
                    </div>
                    <div class="form-group">
                        <label>Başlangıç Tarihi *</label>
                        <input type="month" name="start_date_${experienceCount}" required>
                    </div>
                    <div class="form-group">
                        <label>Bitiş Tarihi</label>
                        <input type="month" name="end_date_${experienceCount}">
                        <div class="checkbox-group">
                            <input type="checkbox" id="current_${experienceCount}" name="current_${experienceCount}">
                            <label for="current_${experienceCount}">Halen çalışıyorum</label>
                        </div>
                    </div>
                    <div class="form-group full-width">
                        <label>İş Açıklaması</label>
                        <textarea name="description_${experienceCount}" placeholder="Bu pozisyondaki sorumluluklarınızı ve başarılarınızı açıklayın..."></textarea>
                        <div class="ai-suggestion">
                            <i class="fas fa-magic"></i>
                            AI ile açıklama önerisi al
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        experienceContainer.insertAdjacentHTML('beforeend', experienceHTML);
        this.setupNewItemListeners();
    }

    removeExperience(index) {
        const experienceItem = document.querySelector(`[data-index="${index}"]`);
        if (experienceItem) {
            experienceItem.remove();
        }
    }

    addEducation() {
        const educationContainer = document.getElementById('educationContainer');
        const educationCount = educationContainer.children.length;
        
        const educationHTML = `
            <div class="education-item" data-index="${educationCount}">
                <button type="button" class="remove-item-btn" onclick="cvBuilder.removeEducation(${educationCount})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Okul/Üniversite Adı *</label>
                        <input type="text" name="school_${educationCount}" required>
                    </div>
                    <div class="form-group">
                        <label>Bölüm/Alan *</label>
                        <input type="text" name="degree_${educationCount}" required>
                    </div>
                    <div class="form-group">
                        <label>Başlangıç Yılı *</label>
                        <input type="number" name="start_year_${educationCount}" min="1950" max="2030" required>
                    </div>
                    <div class="form-group">
                        <label>Mezuniyet Yılı</label>
                        <input type="number" name="end_year_${educationCount}" min="1950" max="2030">
                        <div class="checkbox-group">
                            <input type="checkbox" id="studying_${educationCount}" name="studying_${educationCount}">
                            <label for="studying_${educationCount}">Halen okuyorum</label>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        educationContainer.insertAdjacentHTML('beforeend', educationHTML);
        this.setupNewItemListeners();
    }

    removeEducation(index) {
        const educationItem = document.querySelector(`[data-index="${index}"]`);
        if (educationItem) {
            educationItem.remove();
        }
    }

    addSkill() {
        const skillInput = document.getElementById('skillInput');
        const skillName = skillInput.value.trim();
        
        if (skillName && !this.isSkillExists(skillName)) {
            this.createSkillItem(skillName, 3);
            skillInput.value = '';
        }
    }

    addSuggestedSkill(skillName) {
        if (!this.isSkillExists(skillName)) {
            this.createSkillItem(skillName, 3);
        }
    }

    isSkillExists(skillName) {
        const existingSkills = document.querySelectorAll('.skill-name');
        return Array.from(existingSkills).some(skill => 
            skill.textContent.toLowerCase() === skillName.toLowerCase()
        );
    }

    createSkillItem(skillName, level = 3) {
        const skillsList = document.getElementById('skillsList');
        const skillId = Date.now();
        
        const skillHTML = `
            <div class="skill-item" data-skill-id="${skillId}">
                <span class="skill-name">${skillName}</span>
                <div class="skill-level">
                    <div class="skill-dots">
                        ${Array.from({length: 5}, (_, i) => 
                            `<div class="dot ${i < level ? 'active' : ''}" data-level="${i + 1}" onclick="cvBuilder.setSkillLevel(${skillId}, ${i + 1})"></div>`
                        ).join('')}
                    </div>
                    <button type="button" class="remove-skill-btn" onclick="cvBuilder.removeSkill(${skillId})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        skillsList.insertAdjacentHTML('beforeend', skillHTML);
    }

    setSkillLevel(skillId, level) {
        const skillItem = document.querySelector(`[data-skill-id="${skillId}"]`);
        const dots = skillItem.querySelectorAll('.dot');
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index < level);
        });
    }

    removeSkill(skillId) {
        const skillItem = document.querySelector(`[data-skill-id="${skillId}"]`);
        if (skillItem) {
            skillItem.remove();
        }
    }

    setupNewItemListeners() {
        // Re-setup event listeners for new form elements
        document.querySelectorAll('input, textarea').forEach(input => {
            input.removeEventListener('input', this.updatePreview);
            input.addEventListener('input', () => this.updatePreview());
        });
    }

    updatePreview() {
        this.collectFormData();
        this.renderCVPreview();
    }

    collectFormData() {
        // Personal information
        this.cvData.personal = {
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            address: document.getElementById('address')?.value || '',
            linkedin: document.getElementById('linkedin')?.value || '',
            website: document.getElementById('website')?.value || ''
        };

        // Summary
        this.cvData.summary = document.getElementById('summary')?.value || '';

        // Experience
        this.cvData.experience = [];
        document.querySelectorAll('.experience-item').forEach((item, index) => {
            const company = item.querySelector(`[name="company_${index}"]`)?.value || '';
            const position = item.querySelector(`[name="position_${index}"]`)?.value || '';
            const startDate = item.querySelector(`[name="start_date_${index}"]`)?.value || '';
            const endDate = item.querySelector(`[name="end_date_${index}"]`)?.value || '';
            const current = item.querySelector(`[name="current_${index}"]`)?.checked || false;
            const description = item.querySelector(`[name="description_${index}"]`)?.value || '';

            if (company && position) {
                this.cvData.experience.push({
                    company, position, startDate, endDate, current, description
                });
            }
        });

        // Education
        this.cvData.education = [];
        document.querySelectorAll('.education-item').forEach((item, index) => {
            const school = item.querySelector(`[name="school_${index}"]`)?.value || '';
            const degree = item.querySelector(`[name="degree_${index}"]`)?.value || '';
            const startYear = item.querySelector(`[name="start_year_${index}"]`)?.value || '';
            const endYear = item.querySelector(`[name="end_year_${index}"]`)?.value || '';
            const studying = item.querySelector(`[name="studying_${index}"]`)?.checked || false;

            if (school && degree) {
                this.cvData.education.push({
                    school, degree, startYear, endYear, studying
                });
            }
        });

        // Skills
        this.cvData.skills = [];
        document.querySelectorAll('.skill-item').forEach(item => {
            const name = item.querySelector('.skill-name')?.textContent || '';
            const level = item.querySelectorAll('.dot.active').length;
            
            if (name) {
                this.cvData.skills.push({ name, level });
            }
        });
    }

    renderCVPreview() {
        const previewContainer = document.getElementById('cvPreview');
        if (!previewContainer) return;

        const { personal, summary, experience, education, skills } = this.cvData;
        const fullName = `${personal.firstName} ${personal.lastName}`.trim();

        const contactInfo = [
            personal.email,
            personal.phone,
            personal.address,
            personal.linkedin,
            personal.website
        ].filter(info => info).join(' • ');

        const experienceHTML = experience.map(exp => `
            <div class="cv-job">
                <h4>${exp.position} - ${exp.company}</h4>
                <div class="cv-date">${exp.startDate} - ${exp.current ? 'Devam ediyor' : exp.endDate}</div>
                ${exp.description ? `<p>${exp.description}</p>` : ''}
            </div>
        `).join('');

        const educationHTML = education.map(edu => `
            <div class="cv-degree">
                <h4>${edu.degree} - ${edu.school}</h4>
                <div class="cv-date">${edu.startYear} - ${edu.studying ? 'Devam ediyor' : edu.endYear}</div>
            </div>
        `).join('');

        const skillsHTML = skills.map(skill => 
            `<span class="cv-skill">${skill.name}</span>`
        ).join('');

        previewContainer.innerHTML = `
            <div class="cv-template">
                <div class="cv-header">
                    <h1 class="cv-name">${fullName || 'Adınız Soyadınız'}</h1>
                    <div class="cv-contact">${contactInfo || 'İletişim bilgileriniz'}</div>
                </div>
                
                ${summary ? `
                    <div class="cv-section">
                        <h3>Özet</h3>
                        <div class="cv-summary">${summary}</div>
                    </div>
                ` : ''}
                
                ${experience.length > 0 ? `
                    <div class="cv-section">
                        <h3>İş Deneyimi</h3>
                        ${experienceHTML}
                    </div>
                ` : ''}
                
                ${education.length > 0 ? `
                    <div class="cv-section">
                        <h3>Eğitim</h3>
                        ${educationHTML}
                    </div>
                ` : ''}
                
                ${skills.length > 0 ? `
                    <div class="cv-section">
                        <h3>Yetenekler</h3>
                        <div class="cv-skills">${skillsHTML}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    generateAISuggestion(element) {
        // Simulate AI suggestion generation
        const suggestions = {
            summary: [
                "Deneyimli ve sonuç odaklı profesyonel olarak, takım liderliği ve proje yönetimi konularında güçlü becerilere sahibim.",
                "Yaratıcı problem çözme yetenekleri ve analitik düşünce yapısı ile projelerimde başarılı sonuçlar elde etmekteyim.",
                "Müşteri odaklı yaklaşım ve etkili iletişim becerileri ile iş süreçlerinde değer yaratmaya odaklanıyorum."
            ],
            description: [
                "Takım koordinasyonu ve proje yönetimi sorumluluklarını üstlenerek başarılı sonuçlar elde ettim.",
                "Müşteri memnuniyetini artırmak için yenilikçi çözümler geliştirdim ve uyguladım.",
                "Departmanlar arası işbirliğini güçlendirerek operasyonel verimliliği %20 artırdım."
            ]
        };

        const suggestionType = element.closest('.form-group').querySelector('textarea').name.includes('summary') ? 'summary' : 'description';
        const randomSuggestion = suggestions[suggestionType][Math.floor(Math.random() * suggestions[suggestionType].length)];
        
        const textarea = element.closest('.form-group').querySelector('textarea');
        textarea.value = randomSuggestion;
        
        this.showNotification('AI önerisi eklendi!', 'success');
        this.updatePreview();
    }

    downloadCV() {
        this.showNotification('CV indirme özelliği yakında aktif olacak!', 'info');
    }

    completeCV() {
        this.collectFormData();
        this.showNotification('CV\'niz başarıyla oluşturuldu!', 'success');
        
        // Simulate saving and return to dashboard after 2 seconds
        setTimeout(() => {
            this.showDashboard();
            this.resetForm();
        }, 2000);
    }

    resetForm() {
        // Reset form data
        this.currentStep = 1;
        this.cvData = {
            personal: {},
            experience: [],
            education: [],
            skills: [],
            summary: ''
        };
        
        // Clear form inputs
        document.querySelectorAll('input, textarea').forEach(input => {
            input.value = '';
        });
        
        // Clear dynamic content
        const experienceContainer = document.getElementById('experienceContainer');
        const educationContainer = document.getElementById('educationContainer');
        const skillsList = document.getElementById('skillsList');
        
        if (experienceContainer) experienceContainer.innerHTML = '';
        if (educationContainer) educationContainer.innerHTML = '';
        if (skillsList) skillsList.innerHTML = '';
    }

    downloadExistingCV() {
        this.showNotification('CV indiriliyor...', 'info');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 3 seconds
        this.removeNotification(notification);
    }
    
    // AI Toggle Handler
    handleAIToggle(e) {
        const checkbox = e.target;
        const isChecked = checkbox.checked;
        const section = checkbox.closest('.card');
        
        if (isChecked) {
            this.showNotification('AI desteği etkinleştirildi', 'success');
        } else {
            this.showNotification('AI desteği devre dışı bırakıldı', 'info');
        }
    }
    
    // Insert Example Message
    insertExampleMessage(text) {
        const aiMessageTextarea = document.getElementById('aiMessage');
        if (aiMessageTextarea) {
            const cleanText = text.replace(/"/g, '');
            if (aiMessageTextarea.value) {
                aiMessageTextarea.value += ', ' + cleanText;
            } else {
                aiMessageTextarea.value = cleanText;
            }
            aiMessageTextarea.focus();
        }
    }
    
    // Generate AI Content
    generateAIContent(e) {
        const button = e.target.closest('.ai-generate-btn');
        const targetField = button.dataset.target;
        
        // Show loading state
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Oluşturuluyor...';
        
        // Simulate AI generation
        setTimeout(() => {
            const field = document.getElementById(targetField);
            if (field) {
                switch(targetField) {
                    case 'summary':
                        field.value = 'Deneyimli ve motivasyonlu profesyonel olarak, teknoloji alanında güçlü bir geçmişe sahibim. Takım çalışması ve liderlik konularında yetenekli, sürekli öğrenmeye açık bir yaklaşım sergilerim.';
                        break;
                    case 'jobDescription':
                        field.value = 'Proje yönetimi ve takım koordinasyonu konularında sorumluluk aldım. Müşteri ilişkileri yönetimi ve iş süreçlerinin optimizasyonu alanlarında başarılı sonuçlar elde ettim.';
                        break;
                    case 'educationDescription':
                        field.value = 'Akademik eğitim sürecinde teorik bilgileri pratik uygulamalarla destekledim. Araştırma projeleri ve grup çalışmalarında aktif rol aldım.';
                        break;
                }
                this.updatePreview();
            }
            
            // Reset button
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-magic"></i> AI ile Oluştur';
            
            this.showNotification('İçerik başarıyla oluşturuldu!', 'success');
        }, 2000);
    }
    
    // Enhanced form validation
    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (!currentStepElement) return true;
        
        const requiredFields = currentStepElement.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        // Check required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                isValid = false;
                
                // Remove error styling on input
                field.addEventListener('input', function() {
                    this.style.borderColor = '';
                    this.style.boxShadow = '';
                }, { once: true });
            }
        });
        
        // Date validation for work experience
        if (this.currentStep === 2) {
            const startDate = document.getElementById('startDate');
            const endDate = document.getElementById('endDate');
            
            if (startDate && endDate && startDate.value && endDate.value) {
                const start = new Date(startDate.value + '-01');
                const end = new Date(endDate.value + '-01');
                
                if (start > end) {
                    startDate.style.borderColor = '#ef4444';
                    endDate.style.borderColor = '#ef4444';
                    startDate.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    endDate.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    isValid = false;
                    
                    this.showNotification('Başlangıç tarihi bitiş tarihinden sonra olamaz', 'error');
                    
                    // Remove error styling on change
                    [startDate, endDate].forEach(field => {
                        field.addEventListener('change', function() {
                            this.style.borderColor = '';
                            this.style.boxShadow = '';
                        }, { once: true });
                    });
                    
                    return false;
                }
            }
        }
        
        // Date validation for education
        if (this.currentStep === 3) {
            const eduStartDate = document.getElementById('eduStartDate');
            const eduEndDate = document.getElementById('eduEndDate');
            
            if (eduStartDate && eduEndDate && eduStartDate.value && eduEndDate.value) {
                const startYear = parseInt(eduStartDate.value);
                const endYear = parseInt(eduEndDate.value);
                
                if (startYear > endYear) {
                    eduStartDate.style.borderColor = '#ef4444';
                    eduEndDate.style.borderColor = '#ef4444';
                    eduStartDate.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    eduEndDate.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    isValid = false;
                    
                    this.showNotification('Başlangıç yılı bitiş yılından sonra olamaz', 'error');
                    
                    // Remove error styling on change
                    [eduStartDate, eduEndDate].forEach(field => {
                        field.addEventListener('change', function() {
                            this.style.borderColor = '';
                            this.style.boxShadow = '';
                        }, { once: true });
                    });
                    
                    return false;
                }
            }
        }
        
        if (!isValid) {
            this.showNotification('Lütfen zorunlu alanları doldurun', 'error');
        }
        
        return isValid;
     }
     
     // Remove notification after 3 seconds
     removeNotification(notification) {
         setTimeout(() => {
             notification.style.transform = 'translateX(100%)';
             setTimeout(() => {
                 if (document.body.contains(notification)) {
                     document.body.removeChild(notification);
                 }
             }, 300);
         }, 3000);
     }
}

// Initialize CV Builder when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cvBuilder = new CVBuilder();
});