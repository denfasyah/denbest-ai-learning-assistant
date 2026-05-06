# Issue: 08-progress-tracking

## Deskripsi Singkat
Modul statistika dan gamifikasi tingkat dasar untuk mengukur aktivitas belajar User (Jumlah dokumen diakses, skor rata-rata quiz, dan histori belajar mingguan).

## Tujuan Teknis
- Backend:
  - Modifikasi schema User atau membuat agregat tabel tambahan `Progress` Stats.
  - Menulis pipeline aggregate Mongoose Query untuk mengkalkulasi score Quiz terakhir.
  - Route endpoint pengolah data Dashboard Overview `GET /api/user/statistics`.
- Frontend:
  - Render komponen Charts (opsional memakai `chart.js` / plugin `daisyui` stats element) di halaman Dashboard User Interface.

## Dependency
- 01-auth-system (Harus berdasar agregasi per ID user Login).
- 07-quiz-generator (Penyelesaian / Score Event Tracker).
