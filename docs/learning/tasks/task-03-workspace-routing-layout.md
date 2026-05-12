# Task 03 — Workspace Routing & Layout Refactor

**Phase:** Foundation  
**Priority:** HIGH  
**Depends On:** Task-01, Task-02  
**Agent:** alop  

---

## Objective
Refactor routing dan layout WorkspacePage dari **flat route + useState** ke **nested routes + React Router Outlet**. Ini adalah refactor arsitektur yang **wajib dilakukan sebelum** task AI Chat, Summary, Flashcard, dan Quiz agar setiap tab bisa:
1. Memiliki URL unik (deep linkable)
2. Tidak kehilangan state saat tab berpindah
3. Diimplementasikan secara independen tanpa conflict

---

## Architecture Flaw (Saat Ini)

### Problem 1: Routing Tidak Proper
```javascript
// App.jsx saat ini (FLAT — SALAH):
<Route path="/learning/workspace/:id" element={<WorkspacePage />} />
<Route path="/learning/workspace/:id/:tab" element={<WorkspacePage />} />

// WorkspacePage.jsx (ANTI-PATTERN):
const { tab } = useParams();
const [activeTab, setActiveTab] = useState("content");
useEffect(() => { if (tab) setActiveTab(tabMap[tab]...) }, [tab]);
// Tab change via onClick → setActiveTab() → TIDAK update URL
```

### Problem 2: WorkspaceTabs Tidak URL-Aware
```javascript
// WorkspaceTabs.jsx menggunakan onTabChange callback → local state
// Klik tab → state berubah tapi URL tidak berubah
// User tidak bisa: share URL tab, refresh dan kembali ke tab yang sama
```

### Solution: Nested Routes + useNavigate
```javascript
// App.jsx (BENAR):
<Route path="/learning/workspace/:workspaceId" element={<WorkspaceLayout />}>
  <Route index element={<Navigate to="content" replace />} />
  <Route path="content" element={<ContentTab />} />
  <Route path="chat" element={<ChatTab />} />
  <Route path="action" element={<ActionTab />} />
  <Route path="flashcards" element={<FlashcardTab />} />
  <Route path="quiz" element={<QuizTab />} />
  <Route path="quiz/:quizId" element={<QuizResultTab />} />
</Route>
```

---

## Scope
- Refactor `App.jsx` → nested routes untuk workspace
- Buat `WorkspaceLayout.jsx` (baru, menggantikan WorkspacePage sebagai shell)
- Refactor `WorkspaceTabs.jsx` → URL-based navigation
- Buat `WorkspaceProvider` context untuk shared workspace data
- Buat `useWorkspace.js` hook
- Buat `workspaceApi.js` service
- Buat `workspaceStore.js` Zustand store
- `WorkspacePage.jsx` → dijadikan `WorkspaceLayout.jsx`

---

## Dependencies
- ✅ Task-01, Task-02 selesai
- ✅ `GET /api/v1/workspaces/:workspaceId` endpoint ada
- ✅ Zustand terinstall (dari task-02)

---

## Files / Folder ALLOWED to Edit

```
frontend/src/App.jsx                                           ← Refactor routing
frontend/src/pages/workspace/WorkspacePage.jsx                 ← Rename/transform → WorkspaceLayout
frontend/src/features/workspace/components/WorkspaceTabs.jsx   ← Refactor ke URL-based
frontend/src/features/workspace/components/WorkspaceHeader.jsx ← Consume real data
frontend/src/features/workspace/                               ← Buat file baru di sini:
  context/WorkspaceContext.jsx                                 ← BUAT BARU
  hooks/useWorkspace.js                                        ← BUAT BARU
  services/workspaceApi.js                                     ← BUAT BARU
  store/workspaceStore.js                                      ← BUAT BARU
  pages/WorkspaceLayout.jsx                                    ← BUAT BARU (shell)
```

## Files / Folder FORBIDDEN to Edit
```
frontend/src/features/workspace/components/ContentTab.jsx
frontend/src/features/workspace/components/ChatTab.jsx
frontend/src/features/workspace/components/ActionTab.jsx
frontend/src/features/workspace/components/FlashcardTab.jsx
frontend/src/features/workspace/components/QuizTab.jsx
frontend/src/features/learning/                               ← Jangan sentuh
backend/                                                      ← Tidak ada perubahan backend
```

---

## UI Requirements

### WorkspaceLayout (Shell)
- Split-pane layout: `Left (60%) = Document Viewer area` | `Right (40%) = AI Panel`
- WorkspaceHeader di atas (full width)
- WorkspaceTabs di atas panel kanan
- `<Outlet />` untuk render tab yang aktif di area kanan
- Loading skeleton saat fetch workspace data
- Error state jika workspaceId invalid (404/403)

### WorkspaceTabs (URL-Aware)
- Gunakan `useNavigate` dan `useMatch`/`useLocation` untuk detect active tab
- Tab aktif = URL match, bukan local state
- Click tab → `navigate(tabPath)` bukan `setActiveTab()`
- Tabs: Content, Chat AI, AI Action, Flashcard, Quiz

---

## Backend Requirements
- Tidak ada perubahan backend di task ini
- Hanya consume `GET /api/v1/workspaces/:workspaceId` yang sudah ada

---

## API Requirements

### `workspaceApi.js`
```javascript
getWorkspaceById(workspaceId)  // GET /workspaces/:id
// Returns: { id, title, document: { id, fileName, fileUrl, processingStatus } }
```

---

## Routing Requirements

### `App.jsx` — New Nested Route Structure
```javascript
// Hapus:
<Route path="/learning/workspace/:id" element={<WorkspacePage />} />
<Route path="/learning/workspace/:id/:tab" element={<WorkspacePage />} />

// Ganti dengan:
<Route path="/learning/workspace/:workspaceId" element={<WorkspaceLayout />}>
  <Route index element={<Navigate to="content" replace />} />
  <Route path="content" element={<ContentTab />} />
  <Route path="chat" element={<ChatTab />} />
  <Route path="action" element={<ActionTab />} />
  <Route path="flashcards" element={<FlashcardTab />} />
  <Route path="quiz" element={<QuizTab />} />
</Route>
```

### URL Pattern
```
/learning/workspace/:workspaceId          → redirect ke /content
/learning/workspace/:workspaceId/content  → Content viewer (default)
/learning/workspace/:workspaceId/chat     → AI Chat
/learning/workspace/:workspaceId/action   → AI Action
/learning/workspace/:workspaceId/flashcards → Flashcard
/learning/workspace/:workspaceId/quiz     → Quiz
```

---

## State Management Requirements

### `WorkspaceContext.jsx`
```javascript
// Provide melalui WorkspaceLayout, consume di semua child tabs
const WorkspaceContext = createContext(null);

// Value yang di-provide:
{
  workspaceId: string,
  workspace: { title, createdAt },
  document: { id, fileName, fileUrl, processingStatus, extractedText },
  isLoading: boolean,
  error: string | null,
  refetch: () => void
}
```

### `useWorkspace.js`
```javascript
// Custom hook untuk consume WorkspaceContext
// Juga bisa fetch workspace data jika dipanggil langsung
const useWorkspace = () => useContext(WorkspaceContext);
```

### `workspaceStore.js` (Zustand)
```javascript
// State: activeWorkspaceId, isLayoutCollapsed
// Actions: setActiveWorkspace, toggleLayout
// Ini untuk UI state global, BUKAN data state (data ada di Context)
```

---

## Error Handling
- Workspace tidak ditemukan → redirect ke `/learning` dengan toast "Workspace tidak ditemukan"
- Workspace bukan milik user (403) → redirect ke `/learning` dengan toast "Akses ditolak"
- Network error saat fetch → retry button di tengah halaman
- Dokumen masih processing → tampilkan status "Sedang memproses dokumen..." dengan spinner

---

## Acceptance Criteria
- [ ] Navigasi ke `/learning/workspace/:id` auto-redirect ke `.../content`
- [ ] Klik tab "Chat AI" → URL berubah ke `.../chat` tanpa refresh halaman
- [ ] Refresh di tab `.../chat` → tetap di tab Chat (tidak balik ke Content)
- [ ] `workspaceId` dari URL digunakan untuk fetch real workspace data dari backend
- [ ] WorkspaceHeader menampilkan title dan info dokumen dari API (bukan hardcoded)
- [ ] WorkspaceTabs highlight tab yang sesuai URL
- [ ] Tidak ada prop drilling `workspaceId` ke child tabs (gunakan Context)
- [ ] Loading skeleton tampil saat fetch workspace
- [ ] Error state tampil jika workspace tidak valid

---

## Manual Testing Checklist
- [ ] Upload dokumen di Task-02 → navigate ke workspace URL `/learning/workspace/[real-id]/content`
- [ ] Klik "Chat AI" → URL berubah ke `.../chat`
- [ ] Klik "Flashcard" → URL berubah ke `.../flashcards`
- [ ] Browser back button → kembali ke tab sebelumnya
- [ ] Copy URL `.../chat` → paste di tab baru → langsung ke tab Chat
- [ ] WorkspaceHeader menampilkan nama file yang benar
- [ ] Akses URL workspace yang tidak ada → redirect ke `/learning`
- [ ] Console: tidak ada warning "Cannot read props of null" atau prop drilling warning

---

## Expected Final Result
Workspace menggunakan nested routes yang proper. Setiap tab memiliki URL unik. WorkspaceLayout sebagai shell yang load workspace data sekali dan share via Context ke semua tab children. Fondasi ini membuat implementasi setiap tab (Chat, Summary, Flashcard, Quiz) bisa dilakukan secara independen tanpa conflict.
