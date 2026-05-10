# Rezina

İkinci el araç galerisi yönetim sistemi. Araç envanteri, müşteri takibi ve satış sürecini tek platformda yönetmek için tasarlanmış full-stack web uygulaması.

## Özellikler

- **Araç Envanteri** — Araç ekleme, düzenleme, durum takibi (`stokta / rezerve / satıldı`), ilan linkleri (sahibinden, arabam vb.)
- **Araç Detay Sayfası** — Genişletilmiş araç bilgileri: yakıt tipi, vites, kasa tipi, motor gücü/hacmi, çekiş sistemi, renk, araç tipi
- **Fotoğraf Yönetimi** — Cloudinary tabanlı bulut depolama, kapak fotoğrafı seçimi, resim görüntüleyici
- **Ekspertiz Raporu** — Görsel araç gövde diyagramıyla panel bazlı hasar/durum kaydı
- **Sigorta & Muayene Takibi** — Sigorta ve muayene tarihlerini kaydetme, son kullanma tarihini hesaplama
- **Bakım Takibi** — Km bazlı periyodik bakım kalemleri, son yapılan km kaydı
- **Servis Geçmişi** — Tarih ve km bilgisiyle servis kayıtları
- **PDF Rapor Dışa Aktarma** — Araç detaylarını tek tıkla PDF olarak indirme
- **Müşteri Yönetimi** — Müşteri kayıtları ve takibi
- **Satış Süreci (Pipeline)** — Araç-müşteri ilgi kaydı; `interested → test_drive → negotiating → sold / lost` aşamaları
- **Workspace** — Her kullanıcı birden fazla galeri/çalışma alanı oluşturabilir
- **Kimlik Doğrulama** — E-posta doğrulamalı kayıt, JWT tabanlı oturum (access + refresh token rotation)
- **Onboarding Turu** — Yeni kullanıcılar için adım adım interaktif rehber (driver.js)
- **Sayfalama** — Araç, müşteri ve ilgi listelerinde sayfalama
- **Karanlık / Aydınlık Tema**

## Teknoloji Yığını

### Backend (`/server`)

| Katman | Teknoloji |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js 5 |
| Veritabanı | PostgreSQL (raw SQL, ORM yok) |
| Kimlik Doğrulama | JWT — httpOnly cookie (access + refresh) |
| Doğrulama | Joi |
| Dosya Yükleme | Multer |
| Görsel Depolama | Cloudinary |
| E-posta | Nodemailer + EventEmitter |
| Güvenlik | Helmet, CORS, Rate Limiting |
| Loglama | Winston + Morgan |

### Frontend (`/web`)

| Katman | Teknoloji |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Routing | React Router 7 |
| UI | shadcn/ui + Radix UI + Tailwind CSS 4 |
| State | Zustand |
| Bildirimler | Sonner |
| Onboarding | driver.js |
| Tema | next-themes |

### Landing (`/landing`)

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 + React 19 |

## Başlarken

### Gereksinimler

- Node.js >= 18
- PostgreSQL
- Cloudinary hesabı (görsel yükleme için)

### 1. Repoyu klonla

```bash
git clone <repo-url>
cd rezina
```

### 2. Backend kurulumu

```bash
cd server
npm install
cp .env.example .env
```

`.env` dosyasını düzenle:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=root
DB_PASSWORD=root

JWT_ACCESS_SECRET=gizli_access_secret
JWT_REFRESH_SECRET=gizli_refresh_secret
JWT_ACCESS_EXPIRES_IN=11m
JWT_REFRESH_EXPIRES_IN=7d

COOKIE_DOMAIN=
COOKIE_SECURE=false

SMTP_USER=gmail_adresin@gmail.com
SMTP_PASS=gmail_uygulama_sifresi
EMAIL_FROM=gmail_adresin@gmail.com

CLOUD_NAME=cloudinary_cloud_name
CLOUD_API_KEY=cloudinary_api_key
CLOUD_API_SECRET=cloudinary_api_secret
```

Veritabanı şemasını oluştur:

```bash
psql -U root -d postgres -f src/db/db.sql
```

Migrationları uygula (mevcut bir veritabanına):

```bash
psql -U root -d postgres -f migrations/add_car_attributes.sql
psql -U root -d postgres -f migrations/add_car_expertise.sql
psql -U root -d postgres -f migrations/add_car_image_public_id.sql
psql -U root -d postgres -f migrations/add_insurance_inspection.sql
psql -U root -d postgres -f migrations/add_maintenance_service.sql
psql -U root -d postgres -f migrations/add_onboarding_completed.sql
```

Sunucuyu başlat:

```bash
npm run dev
```

### 3. Frontend kurulumu

```bash
cd web
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışır.

### 4. Landing kurulumu (opsiyonel)

```bash
cd landing
npm install
npm run dev
```

## Proje Yapısı

```
rezina/
├── server/
│   ├── migrations/        # Artımlı SQL migration dosyaları
│   └── src/
│       ├── config/        # db, env, logger, mail, cloudinary
│       ├── controller/    # HTTP katmanı
│       ├── service/       # İş mantığı
│       ├── repository/    # Veritabanı sorguları (raw SQL)
│       ├── model/         # Veri şekli / DTO
│       ├── routes/        # Express router tanımları
│       ├── schemas/       # Joi doğrulama şemaları
│       ├── middleware/    # authenticate, validate, errorHandler, rateLimiter
│       ├── exceptions/    # AppError alt sınıfları
│       ├── events/        # E-posta event listener'ları
│       ├── utils/         # Token, event yardımcıları
│       └── db/db.sql      # Tam veritabanı şeması
├── web/
│   └── src/
│       ├── components/    # UI bileşenleri
│       ├── pages/         # Sayfa bileşenleri
│       ├── providers/     # Auth, tema provider'ları
│       ├── store/         # Zustand store'ları
│       ├── hooks/         # Custom hook'lar (onboarding turu vb.)
│       ├── lib/           # API istemcisi, yardımcılar
│       └── types/         # TypeScript tipleri
└── landing/               # Next.js pazarlama sayfası
```

## API Özeti

| Modül | Prefix | Açıklama |
|---|---|---|
| Auth | `/api/auth` | Kayıt, giriş, token yenileme, şifre sıfırlama |
| Hesap | `/api/account` | Profil, şifre değiştirme, onboarding |
| Workspace | `/api/workspaces` | Çalışma alanı CRUD |
| Araçlar | `/api/workspaces/:id/cars` | Araç envanteri + fotoğraf (Cloudinary) + ilan linkleri |
| Araç Detay | `/api/workspaces/:id/cars/:carId` | Ekspertiz, sigorta/muayene, bakım, servis geçmişi |
| Müşteriler | `/api/workspaces/:id/customers` | Müşteri CRUD |
| İlgiler | `/api/workspaces/:id/interests` | Araç-müşteri satış süreci |

Detaylı API dokümantasyonu için `server/BACKEND.md` dosyasına bakın.

## Geliştirme Komutları

```bash
# Backend (server/)
npm run dev        # --watch modunda başlat
npm run start      # production başlat
npm run format     # Prettier ile formatla

# Frontend (web/)
npm run dev        # Vite dev sunucusu
npm run build      # Production build
npm run lint       # ESLint
npm run format     # Prettier ile formatla

# Landing (landing/)
npm run dev        # Next.js dev sunucusu
npm run build      # Production build
```
