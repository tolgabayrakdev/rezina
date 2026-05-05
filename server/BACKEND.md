# Backend Documentation

## Stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express.js
- **Database:** PostgreSQL (`pg`)
- **Auth:** JWT (httpOnly cookie — access + refresh token)
- **Validation:** Zod
- **Mail:** Nodemailer + event-driven (`EventEmitter`)
- **Logging:** Winston + Morgan

---

## Klasör Yapısı

```
server/src/
├── config/           # db, env, logger, mail
├── controller/       # HTTP katmanı — req/res, hata next()'e iletilir
├── service/          # İş mantığı
├── repository/       # Veritabanı sorguları (raw SQL)
├── model/            # Veri şekli / DTO
├── routes/           # Express router tanımları
├── schemas/          # Zod validation şemaları
├── middleware/       # authenticate, validate, errorHandler, rateLimiter
├── exceptions/       # AppError alt sınıfları
├── events/           # E-posta event listener'ları
├── utils/            # token, events yardımcıları
└── db/db.sql         # Tam veritabanı şeması
```

---

## Mimari

```
Request → Router → Middleware (validate, authenticate) → Controller → Service → Repository → DB
                                                                              ↘ EventEmitter (mail)
```

- Controller sadece HTTP işi yapar; iş mantığına girmez.
- Service hata fırlatır (`AppError` alt sınıfları), controller yakalamaz — `next(err)` ile `errorHandler`'a gönderir.
- Repository raw SQL kullanır, ORM yoktur.

---

## Middleware

| Middleware | Açıklama |
|---|---|
| `authenticate` | Cookie'den `accessToken` okur, `req.user` set eder |
| `authorize(...roles)` | `req.user.role` kontrolü yapar |
| `validate(schema)` | Zod şeması ile `req.body` doğrular |
| `errorHandler` | `AppError` → uygun HTTP status; bilinmeyen → 500 |
| `generalLimiter` | Tüm route'lara global rate limit |
| `authLimiter` | Auth route'larına daha sıkı limit |
| `accountLimiter` | Account route'larına limit |

---

## Exception Sınıfları

```
AppError (base)
├── UnauthorizedError   401
├── ForbiddenError      403
├── NotFoundError       404
├── ConflictError       409
├── ValidationError     400
├── BadRequestError     400
└── InternalServerError 500
```

---

## Response Formatı

```json
{ "success": true,  "data": { ... } }
{ "success": false, "message": "Hata mesajı" }
```

---

## Modüller

---

### AUTH — `/api/auth`

> Rate limiter: `authLimiter`

| Method | Path | Auth | Body | Açıklama |
|---|---|---|---|---|
| POST | `/register` | — | `email, password` | Kayıt — doğrulama kodu gönderilir |
| POST | `/verify` | — | `email, code` | E-posta doğrulama |
| POST | `/resend-verification` | — | `userId?` veya `email?` | Kodu yeniden gönder |
| POST | `/login` | — | `email, password` | Giriş — cookie set edilir |
| POST | `/refresh` | — | — | Access token yenile (cookie'den) |
| POST | `/forgot-password` | — | `email` | Şifre sıfırlama maili gönder |
| POST | `/reset-password` | — | `token, newPassword` | Şifreyi sıfırla |
| POST | `/logout` | `authenticate` | — | Çıkış — cookie temizlenir |

**Token Akışı**
- Login → `accessToken` (kısa ömür) + `refreshToken` (uzun ömür) httpOnly cookie olarak set edilir.
- `/refresh` → her ikisi de yenilenir (refresh token rotation).
- Logout → DB'den refresh token silinir, cookie temizlenir.

---

### ACCOUNT — `/api/account`

> Rate limiter: `accountLimiter` | Tüm route'lar `authenticate` gerektirir

| Method | Path | Body | Açıklama |
|---|---|---|---|
| GET | `/me` | — | Profili getir |
| PATCH | `/me` | `name?, ...` | Profili güncelle |
| PATCH | `/me/password` | `currentPassword, newPassword` | Şifre güncelle |
| POST | `/complete-onboarding` | — | Onboarding tamamla |
| DELETE | `/me` | — | Hesabı sil |

---

### WORKSPACE — `/api/workspaces`

> Kişisel çalışma alanı — her kullanıcı kendi workspace'lerini oluşturur (Elite Cars, Bütçe Araçlar vb.). Üyelik sistemi yoktur; workspace sahibi her zaman o kullanıcının kendisidir.

| Method | Path | Auth | Açıklama |
|---|---|---|---|
| POST | `/` | `authenticate` | Yeni workspace oluştur |
| GET | `/` | `authenticate` | Kullanıcının workspace'lerini listele |
| GET | `/:id` | `authenticate` | Workspace detayı |
| PATCH | `/:id` | `authenticate` | Workspace güncelle |
| DELETE | `/:id` | `authenticate` | Workspace sil |

---

### CARS — `/api/workspaces/:workspaceId/cars` _(eklenecek)_

> Workspace'e bağlı araç envanteri.

**Status değerleri:** `in_stock` | `reserved` | `sold`

| Method | Path | Auth | Açıklama |
|---|---|---|---|
| POST | `/` | `authenticate` | Araç ekle |
| GET | `/` | `authenticate` | Araçları listele (filtre: `status`, `brand`, `model`) |
| GET | `/:carId` | `authenticate` | Araç detayı |
| PATCH | `/:carId` | `authenticate` | Araç güncelle |
| DELETE | `/:carId` | `authenticate` | Araç sil |

**Araç Fotoğrafları**

| Method | Path | Açıklama |
|---|---|---|
| POST | `/:carId/images` | Fotoğraf ekle |
| DELETE | `/:carId/images/:imageId` | Fotoğraf sil |
| PATCH | `/:carId/images/:imageId/cover` | Kapak fotoğraf olarak ayarla |

**Araç İlan Linkleri**

| Method | Path | Body | Açıklama |
|---|---|---|---|
| POST | `/:carId/links` | `platform, url` | Platform linki ekle |
| GET | `/:carId/links` | — | Linkleri listele |
| DELETE | `/:carId/links/:linkId` | — | Linki sil |

> `platform` örnekleri: `sahibinden`, `arabam`, `ikinciyeni`, `custom`

---

### CUSTOMERS — `/api/workspaces/:workspaceId/customers` _(eklenecek)_

> Workspace'e bağlı müşteri kayıtları.

| Method | Path | Auth | Açıklama |
|---|---|---|---|
| POST | `/` | `authenticate` | Müşteri ekle |
| GET | `/` | `authenticate` | Müşterileri listele |
| GET | `/:customerId` | `authenticate` | Müşteri detayı |
| PATCH | `/:customerId` | `authenticate` | Müşteri güncelle |
| DELETE | `/:customerId` | `authenticate` | Müşteri sil |

---

### CAR INTERESTS — `/api/workspaces/:workspaceId/interests` _(eklenecek)_

> Araç - müşteri ilgi takibi (pipeline / satış süreci).

**Status değerleri:** `interested` | `test_drive` | `negotiating` | `lost` | `sold`

| Method | Path | Body | Açıklama |
|---|---|---|---|
| POST | `/` | `carId, customerId, note?` | İlgi kaydı oluştur |
| GET | `/` | — | Tüm ilgileri listele (filtre: `status`, `carId`, `customerId`) |
| GET | `/:interestId` | — | İlgi detayı |
| PATCH | `/:interestId` | `status?, note?` | Durum / not güncelle |
| DELETE | `/:interestId` | — | İlgiyi sil |

---

## Veritabanı Tabloları

| Tablo | Açıklama |
|---|---|
| `roles` | `user`, `admin` rolleri |
| `users` | Kullanıcılar |
| `verification_codes` | E-posta doğrulama kodları |
| `refresh_tokens` | JWT refresh token'ları |
| `password_reset_tokens` | Şifre sıfırlama token'ları |
| `workspaces` | Kullanıcının kişisel çalışma alanları |
| `cars` | Araç envanteri |
| `car_images` | Araç fotoğrafları |
| `car_links` | Araç ilan linkleri (sahibinden vb.) |
| `customers` | Müşteriler |
| `car_interests` | Araç-müşteri ilgi / satış süreci |

> Tam şema: `src/db/db.sql`

---

## Dosya Oluşturma Kuralları

Yeni bir modül eklenirken şu dosyalar oluşturulur:

```
controller/[module].controller.js
service/[module].service.js
repository/[module].repository.js
routes/[module].routes.js
schemas/[module].schema.js     # gerekirse
```

`app.js`'e route mount edilir:
```js
app.use('/api/workspaces', workspaceRoutes);
```
