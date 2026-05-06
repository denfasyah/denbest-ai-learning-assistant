# Issue: 02-upload-pdf-system

## Deskripsi Singkat
Sistem file management yang memungkinkan mahasiswa mengunggah file pembelajaran berformat `.pdf` agar sistem memilikinya dalam storage untuk referensi AI.

## Tujuan Teknis
- Backend:
  - Setup environment penyimpanan lokal di direktori server `/uploads`.
  - Integrasi middleware `multer` di instance express dengan pembatasan *file filter* strict `.pdf` dan file size (contoh max limit 10MB).
  - Route `POST /api/documents/upload` yang memanggil `multer`, menangkap physical path, lalu menyimpan log metadata fisik tersebut pada Schema MongoDB `Document` bersertakan reference object ID pengunggah (`userId`).
- Frontend:
  - Komponen file drag-drop/UI picker pada Dashboard utama.
  - Request axios handler untuk `multipart/form-data`.
  - Progress bar simple *(opsional / MVP nice-to-have)*.

## Dependency
- 01-auth-system (Sistem membutukan `req.user.id` untuk tagging kepemilikan file PDF).
