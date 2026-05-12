# Task 10 — Polish, Error Handling & Production Hardening

**Phase:** Optimization  
**Priority:** MEDIUM  
**Depends On:** Task-01 sampai Task-09 SEMUA selesai  
**Agent:** alop  

---

## Objective
Finalisasi platform menjadi production-ready dengan:
1. Global error handling yang konsisten di seluruh aplikasi
2. Loading skeleton yang proper di semua halaman
3. Empty states yang informatif dan actionable
4. Rate limiting & security hardening di backend
5. Performance optimization (lazy loading, code splitting)
6. UX polish (toast system, confirm dialogs, accessibility)
7. Environment & deployment configuration

---

## Scope

### Backend
- Global error middleware review & standardization
- Rate limiting untuk AI endpoints
- Security headers (helmet.js)
- Request validation middleware
- File cleanup (orphan uploads)

### Frontend
- Error Boundary yang lebih informatif di semua level
- Toast notification system yang konsisten (ganti SweetAlert2 piecemeal dengan toast)
- Loading skeleton components
- Lazy loading semua halaman
- Empty state components yang reusable
- Form validation feedback
- Accessibility improvements (ARIA, focus management)

---

## Dependencies
- ✅ Task-01 sampai Task-09 selesai
- ✅ Semua fitur berfungsi dengan benar
- ❌ `helmet` belum diinstall di backend
- ❌ `express-rate-limit` belum diinstall
- ❌ Lazy loading belum dikonfigurasi di `App.jsx`

---

## Files / Folder ALLOWED to Edit

**Backend:**
```
backend/src/app.js                              ← Rate limit, helmet, security
backend/src/middlewares/errorMiddleware.js      ← BUAT/REFACTOR
backend/src/middlewares/validateMiddleware.js   ← BUAT BARU (request validation)
backend/src/utils/asyncWrapper.js              ← BUAT BARU (DRY try-catch)
backend/package.json                           ← Tambah helmet, express-rate-limit
```

**Frontend:**
```
frontend/src/App.jsx                                     ← Lazy loading
frontend/src/components/ErrorBoundary.jsx               ← Enhance dengan better UI
frontend/src/components/ui/Toast.jsx                    ← BUAT/ENHANCE (unified toast)
frontend/src/components/ui/Skeleton.jsx                 ← BUAT BARU
frontend/src/components/ui/EmptyState.jsx               ← BUAT BARU (global reusable)
frontend/src/components/ui/ConfirmDialog.jsx            ← BUAT BARU
frontend/src/hooks/useToast.js                          ← BUAT BARU
frontend/src/features/learning/components/EmptyState.jsx ← Gunakan global EmptyState
frontend/src/pages/NotFoundPage.jsx                     ← Enhance UI
frontend/frontend/.env                                  ← Audit semua VITE_ variables
```

## Files / Folder FORBIDDEN to Edit
```
backend/src/models/           ← Schema sudah final, jangan ubah
backend/src/services/         ← Business logic sudah final
backend/src/controllers/      ← Controller sudah final
frontend/src/features/        ← Feature logic tidak diubah di task ini
```

---

## Backend Requirements

### 1. Security Hardening (`app.js`)

```javascript
// Install & setup:
npm install helmet express-rate-limit

// app.js additions:
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security headers
app.use(helmet());

// General rate limit (semua endpoint)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 menit
  max: 100,                    // 100 requests per window
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

// Strict rate limit khusus AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 menit
  max: 10,               // 10 AI requests per menit
  message: { success: false, message: 'AI request limit reached. Please wait a moment.' }
});

app.use('/api/', generalLimiter);
app.use('/api/v1/workspaces/:id/chat', aiLimiter);
app.use('/api/v1/workspaces/:id/summary', aiLimiter);
app.use('/api/v1/workspaces/:id/flashcards/generate', aiLimiter);
app.use('/api/v1/workspaces/:id/quizzes/generate', aiLimiter);
```

### 2. `asyncWrapper.js` (DRY Pattern)
```javascript
// Utility untuk wrap semua async controller functions
// Menghilangkan try-catch boilerplate di setiap controller
const asyncWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage di controller:
const createWorkspace = asyncWrapper(async (req, res) => {
  // No try-catch needed
  const workspace = await workspaceService.create(req.body);
  res.json({ success: true, data: workspace });
});
```

### 3. `validateMiddleware.js`
```javascript
// Middleware untuk validasi request body menggunakan express-validator atau manual check
// Contoh validators:
validateCreateWorkspace    // title required, max 200 chars
validateSendMessage        // message required, max 2000 chars
validateGenerateFlashcard  // count: 5-20
validateGenerateQuiz       // count: 5-15
validateReviewFlashcard    // rating: 'easy'|'medium'|'hard'

// Response jika invalid:
// 400: { success: false, message: "Validation failed", errors: [...] }
```

### 4. Enhanced Error Middleware (`errorMiddleware.js`)
```javascript
// Tangkap error types yang berbeda:
// - ValidationError (Mongoose) → 400
// - CastError (invalid ObjectId) → 400: "Invalid ID format"
// - JWT errors → 401
// - Custom AppError dengan status code
// - Rate limit error → 429
// - Multer errors (file size, type) → 400
// - Default → 500

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Throw ini di service/controller:
throw new AppError('Workspace not found', 404);
throw new AppError('Access denied', 403);
```

### 5. File Cleanup Utility
```javascript
// Buat utils/fileCleanup.js:
// deleteOrphanFiles() — scan /uploads/ dan hapus file yang tidak ada di DB
// Panggil saat deleteWorkspace() dan deleteDocument()
```

---

## Frontend Requirements

### 1. Lazy Loading (`App.jsx`)
```javascript
// Ganti semua import biasa dengan React.lazy():
const LandingPage = lazy(() => import('./pages/landing/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
// ... semua halaman

// Wrap Routes dengan Suspense:
<Suspense fallback={<PageLoadingSkeleton />}>
  <Routes>...</Routes>
</Suspense>
```

### 2. `Skeleton.jsx` (Reusable)
```javascript
// Props: width, height, className, count (berapa baris)
// Variants:
// - <Skeleton /> → single line
// - <Skeleton count={3} /> → 3 lines
// - <Skeleton circle /> → circular (avatar)

// Usage:
// <Skeleton className="h-8 w-64 mb-4" />     → Title skeleton
// <Skeleton count={5} className="h-4 mb-2" /> → Text block skeleton
// <Skeleton className="h-48 w-full" />         → Card skeleton
```

**Skeleton Screens yang Harus Dibuat:**
- `WorkspaceSkeleton` — di WorkspaceLayout saat fetch workspace
- `DocumentCardSkeleton` — di LearningPage saat fetch workspaces
- `ChatSkeleton` — di ChatTab saat load history
- `HistoryCardSkeleton` — di HistoryPage saat fetch history

### 3. `EmptyState.jsx` (Global Reusable)
```javascript
// Props:
// - icon: LucideIcon component
// - title: string
// - description: string
// - action: { label, onClick, to } (optional)
// - variant: 'default' | 'small'

// Usage:
<EmptyState
  icon={FileText}
  title="Belum ada dokumen"
  description="Upload dokumen pertamamu untuk mulai belajar"
  action={{ label: 'Upload Dokumen', onClick: handleUpload }}
/>
```

**Ganti semua EmptyState ad-hoc** di seluruh fitur dengan component ini.

### 4. `ConfirmDialog.jsx` (Global Reusable)
```javascript
// Ganti SweetAlert2 dengan component in-house yang sesuai design system
// Props:
// - isOpen: boolean
// - title: string
// - description: string
// - confirmLabel: string (default: "Konfirmasi")
// - cancelLabel: string (default: "Batal")
// - variant: 'danger' | 'warning' | 'default'
// - onConfirm: () => void
// - onCancel: () => void

// Usage:
<ConfirmDialog
  isOpen={showDeleteConfirm}
  title="Hapus Workspace?"
  description="Semua data termasuk flashcard dan quiz akan dihapus."
  variant="danger"
  confirmLabel="Hapus"
  onConfirm={handleDelete}
  onCancel={() => setShowDeleteConfirm(false)}
/>
```

### 5. `useToast.js` (Unified Toast System)
```javascript
// Singleton toast manager
// Ganti semua SweetAlert2 toast calls dan manual toast dengan hook ini
// 
// Interface:
const { toast } = useToast();
toast.success("Upload berhasil!");
toast.error("Terjadi kesalahan. Coba lagi.");
toast.warning("Koneksi tidak stabil.");
toast.info("Summary sedang digenerate...");

// Toast component auto-dismiss setelah 4 detik
// Stack multiple toasts
// Support action button: toast.error("Error", { action: { label: "Retry", onClick: fn } })
```

### 6. Enhanced `ErrorBoundary.jsx`
```javascript
// Saat ini ErrorBoundary mungkin hanya menampilkan blank screen atau generic message
// Enhance dengan:
// - UI yang informatif (bukan blank white screen)
// - Stack trace di development mode
// - "Reload Page" button
// - "Go to Dashboard" link

// Render saat error:
<div className="flex items-center justify-center min-h-screen">
  <div className="text-center">
    <AlertTriangle className="h-16 w-16 text-rose-400 mx-auto mb-4" />
    <h2>Terjadi Kesalahan</h2>
    <p>Komponen mengalami error yang tidak terduga.</p>
    <Button onClick={() => window.location.reload()}>Muat Ulang</Button>
    <Link to="/dashboard">Kembali ke Dashboard</Link>
    {isDev && <pre>{error.stack}</pre>}
  </div>
</div>
```

### 7. Audit & Cleanup Tasks

**Ganti SweetAlert2 dengan komponen internal:**
- `useLearningDocuments.js` — ganti semua `Swal.fire()` dengan `toast` + `ConfirmDialog`
- `DocumentCard.jsx` — ganti confirm delete dengan `ConfirmDialog`
- Semua tempat lain yang menggunakan Swal

**Form Validation Polish:**
- Semua input form harus punya visual feedback saat error (border merah + message)
- Loading state saat submit (disabled button + spinner)

**Accessibility:**
- Semua button punya `aria-label` yang bermakna
- Modal/dialog punya focus trap
- Tab navigation berfungsi dengan keyboard
- Color contrast memenuhi WCAG AA

---

## Performance Checklist

### Frontend
- [ ] Semua halaman di-lazy-load
- [ ] Images di-optimize (gunakan WebP jika ada)
- [ ] Bundle size: jalankan `npm run build` dan periksa chunk sizes
- [ ] Tidak ada console.log yang tersisa di production code
- [ ] Semua `useEffect` punya cleanup function jika ada timer/subscription

### Backend
- [ ] Semua database query menggunakan index yang proper (tambah `index: true` di Mongoose fields yang sering di-query)
- [ ] Tidak ada N+1 query (gunakan `populate` dengan projection)
- [ ] Response tidak berisi data sensitif (password, internal stack trace di production)
- [ ] `NODE_ENV=production` dikonfigurasi

---

## Environment Configuration Audit

### Backend `.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/denbest
JWT_SECRET=your_secure_random_secret_here_min_32_chars
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Denbest AI Learning
VITE_ENV=development
```

---

## Routing Requirements
- Tidak ada perubahan routing struktur
- Lazy loading tidak mengubah route paths
- Error Boundary di-wrap di level yang tepat (per feature, bukan hanya root)

---

## Error Handling Checklist (Global Audit)

| Scenario | Expected Behavior |
|---|---|
| JWT expired | Auto-redirect `/login` + toast "Sesi habis" |
| Network offline | Toast "Tidak ada koneksi" dengan retry |
| AI rate limit (429) | Toast "Terlalu banyak request AI" |
| File too large | Toast error dengan size limit info |
| Invalid workspace ID | Redirect `/learning` + toast |
| Server error (500) | Toast generic + error logged |
| Component crash | Error Boundary tampil (bukan blank) |
| Empty list | EmptyState component dengan CTA |
| Data loading | Skeleton (bukan spinner di tengah layar) |
| Form validation fail | Inline error message per field |

---

## Acceptance Criteria
- [ ] Semua halaman di-lazy-load (`network tab: chunk loading`)
- [ ] Tidak ada blank screen saat error — selalu ada Error Boundary
- [ ] Skeleton tampil saat loading di semua halaman
- [ ] Toast system konsisten (bukan campur SweetAlert2 + toast)
- [ ] ConfirmDialog design sesuai design system (bukan SweetAlert2 popup)
- [ ] Rate limiting berfungsi: hit AI endpoint > 10x/menit → 429
- [ ] Security headers ada di response (`X-Powered-By` dihilangkan, dll)
- [ ] `npm run build` sukses tanpa error
- [ ] Tidak ada console error di browser production build
- [ ] `.env` tidak ter-commit ke git

---

## Manual Testing Checklist
- [ ] Throttle network ke "Slow 3G" → skeleton tampil di semua halaman
- [ ] Matikan server backend → toast error + retry tersedia
- [ ] Akses URL workspace tidak valid → redirect + toast
- [ ] JWT expired (manipulasi token) → redirect login + toast
- [ ] Hit chat API > 10x cepat → 429 response + toast
- [ ] Upload file > 10MB → error toast (backend reject)
- [ ] Console: zero errors, zero warnings di production build
- [ ] Keyboard navigation: tab melalui semua interactive elements
- [ ] Error Boundary: force error di workspace → tampilkan error UI (bukan blank)
- [ ] `npm run build` → bundle berhasil

---

## Expected Final Result
Platform siap untuk production deployment atau demo. Semua edge cases di-handle dengan graceful degradation. UX konsisten di semua halaman. Backend terlindungi dari abuse dengan rate limiting dan security headers. Bundle ter-optimize dengan code splitting. Semua komponen ad-hoc diganti dengan design system components yang reusable.
