# Creative Agency CRM

Kreatif ajanslar için kapsamlı proje yönetim sistemi. Bu uygulama, projeleri, görevleri, finansalları, müşteri ilişkilerini ve teklif/sözleşme süreçlerini tek bir platform üzerinden yönetmenizi sağlar.

## Özellikler

### 🔐 Kullanıcı Yönetimi ve Yetkilendirme
- **ADMIN**: Tüm modüllere tam erişim
- **TEAM_MEMBER**: Sadece atanmış projeler ve görevler

### 📊 Dashboard
- Bugünkü görevler
- Yaklaşan teslim tarihleri
- Son aktiviteler
- Onay bekleyenler (Admin için)

### 📁 Proje Yönetimi
- Proje oluşturma ve düzenleme
- Kanban board ile görev yönetimi
- Dosya yükleme ve not alma
- Zaman takibi

### ✅ Görev Yönetimi
- Sürükle-bırak Kanban panosu
- Alt görevler
- Yorumlar ve zaman takibi
- Öncelik seviyeleri

### 💰 Finans Modülü (Admin)
- Bakiye takibi
- Gelir-gider yönetimi
- Çoklu para birimi desteği
- Cüzdan yönetimi

### 👥 Müşteri Yönetimi (Admin)
- Müşteri bilgileri
- Proje geçmişi
- İletişim bilgileri

### 📄 Teklif ve Sözleşme (Admin)
- Teklif oluşturma
- PDF çıktısı
- Durum takibi

## Teknoloji Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **UI Components**: Headless UI, Heroicons

## Kurulum

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd creative-agency-crm
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın**
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/creative_agency_crm"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. **Veritabanını kurun**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

6. **Tarayıcıda açın**
```
http://localhost:3000
```

## Veritabanı Şeması

Sistem aşağıdaki ana modelleri içerir:

- **User**: Kullanıcılar ve rolleri
- **Project**: Projeler ve durumları
- **Task**: Görevler ve Kanban sütunları
- **Client**: Müşteri bilgileri
- **Quote/Invoice**: Teklif ve fatura yönetimi
- **Transaction**: Finansal işlemler
- **TimeEntry**: Zaman takibi

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Giriş
- `POST /api/auth/signout` - Çıkış

### Projects
- `GET /api/projects` - Projeleri listele
- `POST /api/projects` - Yeni proje oluştur
- `GET /api/projects/[id]` - Proje detayı
- `PUT /api/projects/[id]` - Proje güncelle

### Tasks
- `GET /api/tasks` - Görevleri listele
- `POST /api/tasks` - Yeni görev oluştur
- `PUT /api/tasks/[id]` - Görev güncelle
- `DELETE /api/tasks/[id]` - Görev sil

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.
