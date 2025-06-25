# CraftingAI - AI Verimlilik Asistanı

🚀 **Verimliliğinizi artıran yapay zeka destekli web uygulaması**

## 📋 Proje Hakkında

CraftingAI, kullanıcıların günlük iş akışlarını optimize etmelerine yardımcı olan kapsamlı bir AI verimlilik platformudur. Modern web teknolojileri kullanılarak geliştirilmiş bu uygulama, çeşitli AI destekli araçlar sunarak kullanıcı deneyimini en üst düzeye çıkarır.

## ✨ Özellikler

### 🎯 Ana Özellikler
- **AI Sohbet Asistanı**: Akıllı sohbet botu ile etkileşimli iletişim
- **CV Oluşturucu**: AI destekli profesyonel CV hazırlama aracı
- **Görev Yönetimi**: Akıllı görev planlama ve takip sistemi
- **Ses Klonlama**: Gelişmiş ses klonlama teknolojisi
- **Kullanıcı Kimlik Doğrulama**: Güvenli giriş ve kayıt sistemi

### 🎨 Tasarım Özellikleri
- Modern ve responsive tasarım
- Kullanıcı dostu arayüz
- Mobil uyumlu görünüm
- Gradient ve animasyon efektleri
- Dark/Light tema desteği

## 🏗️ Proje Yapısı

```
craftingai_web/
├── .rules                    # Proje kuralları
├── vercel.json              # Vercel deployment konfigürasyonu
├── site/                    # Ana uygulama dosyaları
│   ├── auth/               # Kimlik doğrulama sayfaları
│   │   ├── css/           # Auth sayfaları stilleri
│   │   ├── js/            # Auth sayfaları JavaScript dosyaları
│   │   ├── index.html     # Ana landing sayfası
│   │   ├── login.html     # Giriş sayfası
│   │   └── register.html  # Kayıt sayfası
│   └── dashboard/         # Dashboard sayfaları
│       ├── css/          # Dashboard stilleri
│       ├── js/           # Dashboard JavaScript dosyaları
│       ├── index.html    # Ana dashboard
│       ├── chat.html     # AI Sohbet sayfası
│       ├── cv-builder.html # CV Oluşturucu
│       ├── tasks.html    # Görev yönetimi
│       └── voice-cloning.html # Ses klonlama
└── README.md             # Bu dosya
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- HTTP sunucusu (geliştirme için)

### Yerel Geliştirme

1. **Projeyi klonlayın:**
   ```bash
   git clone <repository-url>
   cd craftingai_web
   ```

2. **Yerel sunucu başlatın:**
   ```bash
   # Python ile
   python -m http.server 8000
   
   # Node.js ile
   npx serve .
   
   # PHP ile
   php -S localhost:8000
   ```

3. **Tarayıcıda açın:**
   ```
   http://localhost:8000
   ```

### Vercel ile Deployment

Proje Vercel için optimize edilmiştir:

1. **Vercel CLI kurulumu:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy etme:**
   ```bash
   vercel
   ```

## 🛠️ Teknolojiler

### Frontend
- **HTML5**: Semantik markup
- **CSS3**: Modern styling, Flexbox, Grid
- **JavaScript (ES6+)**: İnteraktif özellikler
- **Google Fonts**: Typography (Inter, Space Grotesk, Orbitron, Poppins)

### Tasarım
- **Responsive Design**: Mobil-first yaklaşım
- **CSS Grid & Flexbox**: Modern layout sistemleri
- **CSS Variables**: Dinamik tema desteği
- **SVG Icons**: Vektör tabanlı ikonlar

### Deployment
- **Vercel**: Serverless deployment platform
- **Static Site**: JAMstack mimarisi

## 📱 Sayfa Yapısı

### Kimlik Doğrulama Bölümü (`/site/auth/`)
- **Landing Page** (`index.html`): Ana tanıtım sayfası
- **Login** (`login.html`): Kullanıcı giriş sayfası
- **Register** (`register.html`): Kullanıcı kayıt sayfası

### Dashboard Bölümü (`/site/dashboard/`)
- **Dashboard** (`index.html`): Ana kontrol paneli
- **AI Chat** (`chat.html`): Yapay zeka sohbet arayüzü
- **CV Builder** (`cv-builder.html`): CV oluşturma aracı
- **Tasks** (`tasks.html`): Görev yönetim sistemi
- **Voice Cloning** (`voice-cloning.html`): Ses klonlama aracı

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Primary**: `#6C63FF` - `#3F8EFC` (Gradient)
- **Accent**: `#FFD700` (Gold)
- **Background**: Modern dark/light tema
- **Text**: Yüksek kontrast oranları

### Typography
- **Headings**: Space Grotesk, Orbitron
- **Body**: Inter, Poppins
- **Weights**: 300-900 arası çeşitli ağırlıklar

## 🔧 Geliştirme

### Kod Standartları
- Semantic HTML kullanımı
- BEM CSS metodolojisi
- ES6+ JavaScript özellikleri
- Mobile-first responsive design

### Dosya Organizasyonu
- Modüler CSS yapısı
- Ayrı responsive dosyaları
- Component-based JavaScript

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje ile ilgili sorularınız için:
- GitHub Issues kullanın
- Pull Request gönderin

---

**CraftingAI** - Yapay zeka ile verimliliğinizi artırın! 🚀