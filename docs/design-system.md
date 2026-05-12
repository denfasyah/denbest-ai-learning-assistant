# Design System & UI/UX Guidelines

Dokumen ini adalah acuan konsistensi visual dan pengalaman interaktif (UI/UX) untuk Denbest AI Learning Platform. Tema utama project ini adalah **Modern, Clean, Futuristic, dan AI-Product Oriented**.

## 1. Color Palette System
Sistem warna menggunakan HSL / RGB yang bersih, menghindari warna dasar (pure red, pure blue).
*   **Primary (Brand):** Indigo / Violet modern (menggambarkan AI dan teknologi masa depan).
    *   *Default:* `bg-indigo-600` / `#4f46e5`
    *   *Hover:* `bg-indigo-700`
*   **Secondary/Accent:** Cyan / Teal (untuk elemen highlight).
*   **Neutral (Dark Mode Oriented):**
    *   *Background Utama:* `bg-slate-900` atau `bg-slate-950`
    *   *Background Card/Panel:* `bg-slate-800`
    *   *Teks Utama:* `text-slate-100` atau `text-white`
    *   *Teks Subtitle:* `text-slate-400`
*   **Semantic Colors:**
    *   *Success:* Emerald (`text-emerald-500`, `bg-emerald-500/10`)
    *   *Warning:* Amber
    *   *Danger/Error:* Rose

## 2. Typography
*   **Font Family Utama:** `Inter`, `Roboto`, atau `Outfit` (Pilih salah satu dan *stick to it* via Google Fonts). Ini memberikan kesan teknikal dan modern.
*   **Hierarchy:**
    *   `h1`: `text-3xl md:text-4xl font-bold tracking-tight`
    *   `h2`: `text-2xl font-semibold tracking-tight`
    *   `h3`: `text-xl font-medium`
    *   `body`: `text-base text-slate-300`
    *   `caption`: `text-sm text-slate-400`

## 3. Shape & Radius System
Pendekatan "Smooth Edges". Hindari sudut lancip ekstrim, hindari pula bentuk yang terlalu membulat seperti pil kecuali pada *badge/tags*.
*   **Cards/Panels:** `rounded-xl` atau `rounded-2xl`
*   **Buttons/Inputs:** `rounded-lg` atau `rounded-xl`
*   **Badges/Tags:** `rounded-full`

## 4. Spacing System
Selalu gunakan *scale* Tailwind secara konsisten.
*   *Inner Card Padding:* `p-6` (standar) atau `p-4` (compact).
*   *Section Gap:* `gap-8` atau `gap-12`.
*   *Component Gap (dalam card):* `gap-4`.

## 5. UI Elements

### Button Variants
Gunakan komponen seragam dengan *state* interaktif yang memadai.
*   **Primary:** Background solid indigo, teks putih. Tambahkan shadow subtle.
*   **Outline/Ghost:** Border tipis, background transparan. Hover effect mengubah background menjadi *slate-800* atau *indigo-500/10*.
*   **Danger:** Background *rose-500* (untuk tombol *delete*).
*   *Semua tombol HARUS memiliki transisi:* `transition-all duration-200 ease-in-out` dan efek memudar/bergerak tipis ketika di-hover/ditekan (`active:scale-95`).

### Glassmorphism & Hover Interactions
Ciri khas AI-product modern adalah *glassmorphism* tipis.
*   **Header/Navbar/Floating Elements:** Gunakan efek blur tembus pandang.
    *   *Tailwind:* `bg-slate-900/80 backdrop-blur-md border-b border-white/10`
*   **Card Hover Effect:** Card interaktif (seperti Document Card) harus terangkat sedikit saat di-hover.
    *   *Tailwind:* `hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20 transition-all`

### Card Design
Konsistensi Card sangat penting. Setiap *card* harus memiliki:
*   Background solid atau glass (misal: `bg-slate-800`).
*   Border tipis untuk memisahkan dari background utama (misal: `border border-slate-700/50`).
*   Padding yang proporsional (`p-5` atau `p-6`).

### Inputs & Forms
*   Background input: `bg-slate-900/50`.
*   Border: `border border-slate-700` (normal), `focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500` (fokus).
*   Label form harus diletakkan di atas input secara eksplisit dengan teks `text-sm text-slate-300 mb-1`.

## 6. Layout Consistency
*   **Sidebar:** Lebar konsisten (`w-64` atau `w-72` di desktop), disembunyikan menggunakan Hamburger Menu di mobile.
*   **Dashboard Sections:** Gunakan Grid Layout (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`) untuk komponen metrik *counts*.
*   **Workspace Layout:** Harus memisahkan area "Konten Dokumen" (kiri) dan area "Interaksi AI/Tools" (kanan) agar pengguna dapat melihat referensi secara bersisian dengan chat AI.

## 7. Loading & Empty State Styling
*   **Loading:** Gunakan *Skeleton Loading* (blok abu-abu dengan efek *pulse* animasi) ketimbang spinner konvensional untuk data-heavy content. `animate-pulse bg-slate-800 rounded`.
*   **Empty State:** Tampilkan ikon pudar (`text-slate-600`), judul yang tidak mengintimidasi (`text-slate-300`), teks panduan pendek, dan tombol aksi (Call-to-Action) di tengah area layar/konten.
