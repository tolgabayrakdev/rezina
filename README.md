# Rezina

İkinci el araç galerisi yönetim sistemi. Araç envanteri, müşteri takibi ve satış sürecini tek platformda yönetmek için tasarlanmış full-stack web uygulaması.

## Özellikler

- **Araç Envanteri** — Araç ekleme, düzenleme, fotoğraf yönetimi, ilan linkleri (sahibinden, arabam vb.)
- **Müşteri Yönetimi** — Müşteri kayıtları ve takibi
- **Satış Süreci (Pipeline)** — Araç-müşteri ilgi kaydı; `interested → test_drive → negotiating → sold / lost` aşamaları
- **Workspace** — Her kullanıcı birden fazla galeri/çalışma alanı oluşturabilir
- **Kimlik Doğrulama** — E-posta doğrulamalı kayıt, JWT tabanlı oturum (access + refresh token rotation)
- **Karanlık / Aydınlık Tema**

## Teknoloji Yığını

### Backend (`/server`)

| Katman | Teknoloji |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js 5 |
| Veritabanı | PostgreSQL (raw SQL, ORM yok) |
| Kimlik Doğrulama | JWT — httpOnly cookie (access + refresh) |
| Doğrulama | Zod |
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
| Tema | next-themes |

## Başlarken

### Gereksinimler

- Node.js >= 18
- PostgreSQL

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
```

Veritabanı şemasını oluştur:

```bash
psql -U root -d postgres -f src/db/db.sql
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

## Proje Yapısı

```
rezina/
├── server/
│   └── src/
│       ├── config/        # db, env, logger, mail
│       ├── controller/    # HTTP katmanı
│       ├── service/       # İş mantığı
│       ├── repository/    # Veritabanı sorguları (raw SQL)
│       ├── model/         # Veri şekli / DTO
│       ├── routes/        # Express router tanımları
│       ├── schemas/       # Zod doğrulama şemaları
│       ├── middleware/    # authenticate, validate, errorHandler, rateLimiter
│       ├── exceptions/    # AppError alt sınıfları
│       ├── events/        # E-posta event listener'ları
│       ├── utils/         # Token, event yardımcıları
│       └── db/db.sql      # Tam veritabanı şeması
└── web/
    └── src/
        ├── components/    # UI bileşenleri
        ├── pages/         # Sayfa bileşenleri
        ├── providers/     # Auth, tema provider'ları
        ├── store/         # Zustand store'ları
        ├── lib/           # API istemcisi, yardımcılar
        └── types/         # TypeScript tipleri
```

## API Özeti

| Modül | Prefix | Açıklama |
|---|---|---|
| Auth | `/api/auth` | Kayıt, giriş, token yenileme, şifre sıfırlama |
| Hesap | `/api/account` | Profil, şifre değiştirme, onboarding |
| Workspace | `/api/workspaces` | Çalışma alanı CRUD |
| Araçlar | `/api/workspaces/:id/cars` | Araç envanteri + fotoğraf + ilan linkleri |
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
```
