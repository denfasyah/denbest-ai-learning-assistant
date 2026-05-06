# Issue: 01-auth-system

## Deskripsi Singkat
Membangun fondasi keamanan pengguna (Authentication & Authorization) memakai pola JSON Web Tokens (JWT). Sistem ini mengatur pintu masuk semua fitur dengan mengamankan API endpoint backend serta melempar user yang belum login ke halaman login di view frontend.

## Tujuan Teknis
- Backend:
  - Membuat Data Schema `User` (Name, Email, Hash_Password).
  - Integrasi paket `bcrypt` untuk enkripsi password di level Model.
  - Endpoint `POST /api/auth/register` (pembuatan akun dan token).
  - Endpoint `POST /api/auth/login` (validasi credential dan pemberian JWT Token).
  - Custom express middleware `verifyToken` untuk menjaga routes rahasia dan memasukkan object `req.user`.
- Frontend:
  - Context Provider `AuthContext` mengatur state global Login Status.
  - Axios interceptor injection (Otomatis mengirim Request Header `Authorization: Bearer <token>`).
  - Route Guards di `App.jsx` (Redirect non-login ke route `/login`).

## Dependency
- Tidak ada (Initial Feature).
