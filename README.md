# JagoCV — Platform Kreasi Karir Berbasis AI

Platform all-in-one untuk membuat CV ATS, resume visual, dan portofolio web profesional dengan bantuan AI.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19, Vite 6, Tailwind CSS v4, TypeScript |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | MySQL (Laragon / XAMPP / phpMyAdmin) |
| AI | Google Gemini API |

---

## Prasyarat

Pastikan sudah terinstall sebelum mulai:

- **Node.js** v18 atau lebih baru → [nodejs.org](https://nodejs.org)
- **MySQL** — pilih salah satu:
  - [Laragon](https://laragon.org) *(direkomendasikan untuk Windows, sudah include MySQL + phpMyAdmin)*
  - [XAMPP](https://www.apachefriends.org) *(Windows/Mac/Linux)*
  - MySQL standalone
- **Git** → [git-scm.com](https://git-scm.com)

---

## Quickstart (Setup Pertama Kali)

### 1. Clone repository

```bash
git clone https://github.com/username/JagoCV.git
cd JagoCV
```

### 2. Install dependencies frontend

```bash
npm install
```

### 3. Buat file `.env` frontend

```bash
# Windows CMD
copy .env.example .env

# Windows PowerShell / Mac / Linux
cp .env.example .env
```

Isi `.env` di root (tidak perlu diubah untuk development lokal):

```env
VITE_API_URL="/api"
```

### 4. Setup backend

```bash
cd app/backend
npm install
```

### 5. Buat file `.env` backend

```bash
# Windows CMD
copy .env.example .env

# Windows PowerShell / Mac / Linux
cp .env.example .env
```

Buka `app/backend/.env` dan sesuaikan dengan environment lokal kamu:

```env
# ── DATABASE ──────────────────────────────────────────────
# Laragon (default, tanpa password):
DATABASE_URL="mysql://root@localhost:3306/jagoai"

# XAMPP / phpMyAdmin (tanpa password):
# DATABASE_URL="mysql://root@127.0.0.1:3306/jagoai"

# XAMPP / phpMyAdmin (dengan password):
# DATABASE_URL="mysql://root:passwordkamu@127.0.0.1:3306/jagoai"

# ── AUTH ──────────────────────────────────────────────────
# Ganti dengan string acak yang panjang
JWT_SECRET="ganti-dengan-secret-yang-kuat"

# ── AI ────────────────────────────────────────────────────
# Dapatkan di https://aistudio.google.com (opsional untuk dev)
GEMINI_API_KEY=""

# ── SERVER ────────────────────────────────────────────────
PORT=5000
CORS_ORIGINS="http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173"
```

> **Generate JWT_SECRET yang aman:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 6. Pastikan MySQL sudah berjalan

- **Laragon** → klik **Start All**
- **XAMPP** → klik **Start** di baris MySQL
- Verifikasi: buka `http://localhost/phpmyadmin` — harus bisa diakses

### 7. Setup database (otomatis)

```bash
# Masih di folder app/backend
npm run db:setup
```

Perintah ini akan:
- Membuat database `jagoai` secara otomatis jika belum ada
- Membuat semua tabel sesuai schema Prisma
- Generate Prisma Client

### 8. Jalankan aplikasi

Buka **dua terminal terpisah**:

**Terminal 1 — Backend:**
```bash
cd app/backend
npm run dev
```
Backend berjalan di → `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
# Di root folder JagoCV
npm run dev
```
Frontend berjalan di → `http://localhost:3000`

Buka browser ke `http://localhost:3000` — aplikasi siap digunakan.

---

## Struktur Proyek

```
JagoCV/
├── app/
│   └── backend/                  # Express API server
│       ├── prisma/
│       │   ├── schema.prisma     # Definisi model database
│       │   ├── migrations/       # History migration Prisma
│       │   └── jagocv_phpmyadmin.sql  # SQL manual untuk phpMyAdmin
│       ├── src/
│       │   ├── index.ts          # Entry point server
│       │   ├── config.ts         # Environment variables
│       │   ├── lib/              # Prisma client, AI client
│       │   ├── middleware/       # Auth JWT, logger
│       │   ├── routes/           # API route handlers
│       │   └── utils/            # Helper functions
│       ├── .env                  # ← TIDAK di-commit ke Git
│       ├── .env.example          # Template env
│       └── package.json
├── src/                          # React frontend
│   ├── components/               # Komponen UI reusable
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API service layer
│   ├── templates/                # Template CV, resume, portofolio
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions
│   └── views/                    # Halaman aplikasi
├── public/                       # Static assets
├── .env                          # ← TIDAK di-commit ke Git
├── .env.example                  # Template env frontend
├── vite.config.ts                # Konfigurasi Vite + proxy API
└── package.json
```

---

## Scripts

### Frontend (root folder)

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan frontend development (port 3000) |
| `npm run build` | Build frontend untuk production |
| `npm run build:all` | Build frontend + backend sekaligus |
| `npm run lint` | TypeScript type check |

### Backend (`app/backend/`)

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan backend development (auto-restart) |
| `npm run build` | Compile TypeScript ke JavaScript |
| `npm start` | Jalankan server production (butuh `build` dulu) |
| `npm run db:setup` | Buat database + sync schema + generate Prisma Client |
| `npm run db:reset` | **Reset** database (hapus semua data) + setup ulang |
| `npm run prisma:generate` | Generate ulang Prisma Client saja |
| `npm run prisma:migrate` | Buat migration baru (untuk perubahan schema) |

---

## Alur Kerja Saat Schema Database Berubah

Jika ada perubahan di `app/backend/prisma/schema.prisma`:

```bash
cd app/backend

# Sync perubahan ke database + generate ulang Prisma Client
npm run db:setup
```

> ⚠️ **Jangan jalankan `prisma db pull`** — perintah itu akan menimpa `schema.prisma`
> dengan nama tabel lowercase dari MySQL dan merusak seluruh kode backend.

---

## Troubleshooting

### ❌ `Can't connect to MySQL server on 'localhost'`

MySQL belum berjalan.
- **Laragon**: klik **Start All**
- **XAMPP**: klik **Start** di baris MySQL
- Coba ganti `localhost` dengan `127.0.0.1` di `DATABASE_URL`

### ❌ `Access denied for user 'root'`

Salah password atau format connection string.
- Laragon default: tanpa password → `mysql://root@localhost:3306/jagoai`
- XAMPP default: tanpa password → `mysql://root@127.0.0.1:3306/jagoai`
- Jika ada password: `mysql://root:PASSWORD@127.0.0.1:3306/jagoai`

### ❌ `Unknown field 'socialLinks'` atau error Prisma Client

Prisma Client tidak sinkron dengan schema.
```bash
cd app/backend
npm run prisma:generate
```

### ❌ `EPERM: operation not permitted` saat `prisma generate`

Ada proses backend yang masih berjalan dan mengunci file DLL Prisma.
Stop server terlebih dahulu, lalu jalankan `prisma generate` ulang.

### ❌ Login selalu `500 Internal Server Error`

1. Pastikan MySQL sudah running
2. Cek `DATABASE_URL` di `app/backend/.env`
3. Jalankan `npm run db:setup` di folder `app/backend`
4. Restart server backend

### ❌ Frontend tidak bisa akses API (`401`, `403`, `CORS error`)

1. Pastikan backend berjalan di port `5000`
2. Cek `CORS_ORIGINS` di `app/backend/.env` sudah include `http://localhost:3000`
3. Pastikan `VITE_API_URL="/api"` ada di `.env` root (Vite akan proxy ke backend)

---

## Environment Variables Lengkap

### Frontend (`.env` di root)

| Variable | Default | Keterangan |
|---|---|---|
| `VITE_API_URL` | `/api` | Base URL API, tidak perlu diubah untuk dev lokal |

### Backend (`app/backend/.env`)

| Variable | Contoh | Keterangan |
|---|---|---|
| `DATABASE_URL` | `mysql://root@localhost:3306/jagoai` | Koneksi MySQL |
| `JWT_SECRET` | *(string acak panjang)* | Secret untuk signing JWT token |
| `GEMINI_API_KEY` | `AIza...` | Google Gemini API key (opsional) |
| `PORT` | `5000` | Port backend server |
| `CORS_ORIGINS` | `http://localhost:3000,...` | Origins yang diizinkan (pisah koma) |

---

## Catatan Penting

- File `.env` **tidak boleh di-commit** ke Git (sudah ada di `.gitignore`)
- Selalu gunakan `.env.example` sebagai referensi, bukan `.env` langsung
- Untuk production, ganti `JWT_SECRET` dengan string yang benar-benar acak dan panjang
- `GEMINI_API_KEY` bisa dikosongkan untuk development jika tidak butuh fitur AI
