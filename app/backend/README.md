# JagoCV Backend

Express API server untuk JagoCV — Node.js + TypeScript + MySQL (Prisma ORM).

> **Setup lengkap ada di [README utama](../../README.md)** di root folder proyek.

---

## Quickstart (jika sudah setup sebelumnya)

```bash
# Install dependencies
npm install

# Setup database (buat DB + sync schema + generate Prisma Client)
npm run db:setup

# Jalankan server development
npm run dev
```

Server berjalan di `http://localhost:5000`

---

## Scripts

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan server development (auto-restart) |
| `npm run build` | Compile TypeScript ke JavaScript |
| `npm start` | Jalankan server production (butuh `build` dulu) |
| `npm run db:setup` | Buat database + sync schema + generate Prisma Client |
| `npm run db:reset` | **Reset** database (hapus semua data) + setup ulang |
| `npm run prisma:generate` | Generate ulang Prisma Client saja |
| `npm run prisma:migrate` | Buat migration baru (untuk perubahan schema) |

---

## Struktur Folder

```
app/backend/
├── prisma/
│   ├── schema.prisma          # Definisi model database
│   ├── migrations/            # History migration
│   └── jagocv_phpmyadmin.sql  # SQL manual untuk phpMyAdmin
├── src/
│   ├── index.ts               # Entry point server
│   ├── config.ts              # Environment variables
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client instance
│   │   └── ai.ts              # Gemini AI client
│   ├── middleware/
│   │   ├── auth.ts            # JWT authentication
│   │   └── logger.ts          # HTTP request logger
│   ├── routes/                # API route handlers
│   └── utils/                 # Helper functions
├── .env                       # ← TIDAK di-commit ke Git
├── .env.example               # Template env (di-commit)
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/api/auth/register` | — | Daftar akun baru |
| POST | `/api/auth/login` | — | Login, dapat JWT token |
| GET | `/api/auth/me` | ✅ | Data user yang sedang login |
| PUT | `/api/auth/profile` | ✅ | Update profil user |
| POST | `/api/auth/forgot-password` | — | Kirim email reset password |
| POST | `/api/auth/reset-password` | — | Reset password dengan token |
| GET | `/api/documents` | ✅ | List semua dokumen user |
| POST | `/api/documents` | ✅ | Buat dokumen baru |
| GET | `/api/documents/:id` | — | Detail dokumen (public) |
| PUT | `/api/documents/:id` | ✅ | Update dokumen |
| DELETE | `/api/documents/:id` | ✅ | Hapus dokumen |
| GET/POST | `/api/chat` | ✅ | Chat dengan AI |
| GET/POST | `/api/experience` | ✅ | CRUD pengalaman kerja |
| GET/POST | `/api/education` | ✅ | CRUD pendidikan |
| GET | `/api/ai-usage` | ✅ | Log penggunaan AI |

> ✅ = Butuh header `Authorization: Bearer <token>`

---

## Catatan Penting

> ⚠️ **Jangan jalankan `prisma db pull`** — perintah itu akan menimpa `schema.prisma`
> dengan nama tabel lowercase dari MySQL dan merusak seluruh kode backend.
> Gunakan `npm run db:setup` untuk sync schema ke database.
