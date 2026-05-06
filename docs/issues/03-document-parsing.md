# Issue: 03-document-parsing

## Deskripsi Singkat
Mesin pembaca isi PDF untuk dirubah ke raw teks murni. Ini karena AI Model Gemini pada dasarnya tidak bisa secara ajaib membaca buffer fisik melingkar tanpa diekstrak ke strings natural, terutama jika teks PDF sangat padat.

## Tujuan Teknis
- Backend:
  - Menyiapkan sebuah *Parser Service Layer*.
  - Instalasi package khusus NodeJS extraction PDF misal `pdf-parse`.
  - Membuat logic flow: Setiap setelah file sukses masuk di `02-upload-pdf-system`, sistem membaca path fisik PDF => Mengeksekusi service buffer parser => Dikonversi jadi String => Dipotong space strip string clean up.
  - Mengupdate tabel database Mongoose `Document` sebelumnya, menyisipkan hasil besar ekstraksi ini ke struktur field `{ extractedText: String }`.
  - Menyediakan Endpoint `GET /api/documents/:id` yang melempar array documents sekaligus status textnya apakah sudah ready diproses AI atau corrupt.

## Dependency
- 02-upload-pdf-system (Karena engine membutuhkan File Path fisik & Doc ID metadata).
