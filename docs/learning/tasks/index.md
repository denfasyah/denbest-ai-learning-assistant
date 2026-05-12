# 📋 Learning Workspace — Task Master Index

**Project:** Denbest AI Learning Platform  
**Feature:** Context-Aware Learning Workspace + AI Learning System  
**Planner:** Senior Software Architect (Antigravity)  
**Target Agent:** alop (Implementer)  
**Created:** 2026-05-12  
**Status:** Ready for Implementation  

---

## 🚨 Architecture Decisions (Baca Sebelum Mulai)

Beberapa **keputusan arsitektur kritis** yang ditetapkan sebelum implementasi dimulai. Ini adalah koreksi terhadap planning sebelumnya:

| # | Issue | Keputusan |
|---|---|---|
| 1 | **DB Inkonsistens** — planning.md pakai MongoDB, learning-workspace.md pakai PostgreSQL | ✅ **Gunakan MongoDB** (sesuai existing stack) |
| 2 | **DocumentId ≠ WorkspaceId** — DocumentCard navigate pakai `document.id` sebagai workspaceId | ✅ **Backend auto-create workspace** saat upload, return `workspaceId` |
| 3 | **Flat vs Nested Routes** — WorkspacePage pakai flat route + useState untuk tab | ✅ **Refactor ke nested routes** + `<Outlet />` di Task-03 |
| 4 | **In-Memory State** — `useLearningDocuments` pakai `useState([])` — hilang saat refresh | ✅ **Zustand + API** di Task-02 |
| 5 | **WorkspaceTabs tidak URL-aware** — tab change tidak update URL | ✅ **Gunakan `useNavigate`** + URL-based active state di Task-03 |

---

## 📁 Task Files

| File | Task | Phase |
|---|---|---|
| [task-01-learning-foundation.md](./tasks/task-01-learning-foundation.md) | Backend Models & API Skeleton | Foundation |
| [task-02-document-upload-flow.md](./tasks/task-02-document-upload-flow.md) | Upload Pipeline (Real API) | Foundation |
| [task-03-workspace-routing-layout.md](./tasks/task-03-workspace-routing-layout.md) | Nested Routes & WorkspaceLayout | Foundation |
| [task-04-document-viewer.md](./tasks/task-04-document-viewer.md) | ContentTab & PDF Viewer | Foundation |
| [task-05-workspace-ai-chat.md](./tasks/task-05-workspace-ai-chat.md) | AI Chat (Gemini Integration) | Core AI |
| [task-06-summary-generation.md](./tasks/task-06-summary-generation.md) | Summary Generation | Core AI |
| [task-07-flashcard-system.md](./tasks/task-07-flashcard-system.md) | Flashcard + SRS | Learning Tools |
| [task-08-quiz-system.md](./tasks/task-08-quiz-system.md) | Quiz + Result + History | Advanced Testing |
| [task-09-history-integration.md](./tasks/task-09-history-integration.md) | History Page (Real API) | History |
| [task-10-polish-error-handling.md](./tasks/task-10-polish-error-handling.md) | Polish & Production Hardening | Optimization |

---

## 🗺️ Task Dependency Graph

```
Task-01 (Foundation: Models & Routes)
    │
    ├──→ Task-02 (Upload Flow)
    │        │
    │        ├──→ Task-03 (Workspace Routing & Layout)
    │        │        │
    │        │        ├──→ Task-04 (Document Viewer)
    │        │        │
    │        │        └──→ Task-05 (AI Chat) ←── requires aiService
    │        │                 │
    │        │                 ├──→ Task-06 (Summary)
    │        │                 │
    │        │                 ├──→ Task-07 (Flashcard)
    │        │                 │        │
    │        │                 │        └──→ Task-08 (Quiz)
    │        │                 │
    │        └──→ Task-09 (History) ←── requires T05+T06+T07+T08
    │
    └──→ Task-10 (Polish) ←── requires ALL tasks done
```

---

## ⚡ Implementation Sequence (Urutan Wajib)

```
Phase 1 — Foundation (WAJIB berurutan):
  1. Task-01: Backend models & routes skeleton
  2. Task-02: Upload flow (backend + frontend API)
  3. Task-03: Workspace routing & layout refactor

Phase 2 — Content & AI Core (Task-04 & 05 bisa paralel setelah Task-03):
  4. Task-04: Document viewer (ContentTab)
  5. Task-05: AI Chat (Gemini)

Phase 3 — Learning Tools (setelah Task-05):
  6. Task-06: Summary generation
  7. Task-07: Flashcard system
  8. Task-08: Quiz system

Phase 4 — Integration & Polish (setelah semua AI tasks):
  9. Task-09: History integration
  10. Task-10: Polish & production hardening
```

> ⚠️ **JANGAN skip urutan.** Task-03 (nested routes) adalah prerequisite untuk semua task AI. Task-05 (aiService.js) adalah prerequisite untuk Task-06, 07, 08.

---

## 📦 Dependencies yang Perlu Diinstall

### Backend
```bash
npm install pdf-parse           # Task-02: PDF parsing
npm install @google/generative-ai # Task-05: Gemini API
npm install helmet              # Task-10: Security headers
npm install express-rate-limit  # Task-10: Rate limiting
npm install express-validator   # Task-10: Request validation (optional)
```

### Frontend
```bash
npm install zustand             # Task-02: State management
npm install react-markdown      # Task-05: Render AI markdown response
npm install axios               # Task-02: HTTP client (jika belum ada)
```

---

## 🗂️ New Files & Folders Summary

### Backend (Semua Baru)
```
backend/src/
  models/
    Workspace.js
    Document.js
    AiConversation.js
    Message.js
    Summary.js
    Flashcard.js
    Quiz.js
    History.js
  controllers/
    workspaceController.js
    documentController.js
    chatController.js
    summaryController.js
    flashcardController.js
    quizController.js
    historyController.js
  services/
    documentService.js
    historyService.js
    aiService.js              ← Gemini wrapper
    chatService.js
    summaryService.js
    flashcardService.js
    quizService.js
  routes/
    workspaceRoutes.js
    documentRoutes.js
    chatRoutes.js
    summaryRoutes.js
    flashcardRoutes.js
    quizRoutes.js
    historyRoutes.js
  middlewares/
    uploadMiddleware.js
    validateMiddleware.js
    errorMiddleware.js
  utils/
    asyncWrapper.js
    promptBuilder.js
    fileCleanup.js
```

### Frontend (Semua Baru / Refactor)
```
frontend/src/
  services/
    axiosInstance.js           ← Shared axios (BARU)
  features/
    learning/
      services/
        learningApi.js         ← BARU
      store/
        learningStore.js       ← BARU (Zustand)
      hooks/
        useLearningDocuments.js ← REFACTOR
    workspace/
      context/
        WorkspaceContext.jsx   ← BARU
      hooks/
        useWorkspace.js        ← BARU
        useChat.js             ← BARU
        useSummary.js          ← BARU
        useFlashcard.js        ← BARU
        useQuiz.js             ← BARU
      services/
        workspaceApi.js        ← BARU
        chatApi.js             ← BARU
        summaryApi.js          ← BARU
        flashcardApi.js        ← BARU
        quizApi.js             ← BARU
      pages/
        WorkspaceLayout.jsx    ← BARU (replaces WorkspacePage shell)
      components/
        DocumentViewer.jsx     ← BARU
        QuizResultTab.jsx      ← BARU
        [semua Tab: REFACTOR]
    history/
      services/
        historyApi.js          ← BARU
      store/
        historyStore.js        ← BARU
  components/
    ui/
      Skeleton.jsx             ← BARU
      EmptyState.jsx           ← BARU
      ConfirmDialog.jsx        ← BARU
      Toast.jsx                ← BARU/ENHANCE
  hooks/
    useToast.js                ← BARU
```

---

## 🔒 Files TIDAK BOLEH Diubah (Global)

File-file berikut adalah **stable boundaries** — jangan diubah kecuali task secara eksplisit menyebutkan:

```
backend/src/models/User.js
backend/src/routes/authRoutes.js
backend/src/controllers/authController.js
frontend/src/context/AuthContext.jsx
frontend/src/components/ProtectedRoute.jsx
frontend/src/components/PublicRoute.jsx
frontend/src/layouts/DashboardLayout.jsx
frontend/src/layouts/components/SidebarDashboard.jsx
frontend/src/layouts/components/NavbarDashboard.jsx
```

---

## 📊 API Endpoint Registry (Semua Endpoint)

| Method | Endpoint | Task | Description |
|---|---|---|---|
| POST | `/api/v1/workspaces` | 02 | Create workspace |
| GET | `/api/v1/workspaces` | 02 | List user workspaces |
| GET | `/api/v1/workspaces/:id` | 03 | Get workspace detail |
| PATCH | `/api/v1/workspaces/:id` | 02 | Rename workspace |
| DELETE | `/api/v1/workspaces/:id` | 02 | Delete workspace |
| POST | `/api/v1/workspaces/:id/documents` | 02 | Upload document |
| GET | `/api/v1/workspaces/:id/documents` | 02 | List documents |
| POST | `/api/v1/workspaces/:id/chat` | 05 | Send AI message |
| GET | `/api/v1/workspaces/:id/chat/history` | 05 | Get chat history |
| POST | `/api/v1/workspaces/:id/summary/generate` | 06 | Generate summary |
| POST | `/api/v1/workspaces/:id/summary/regenerate` | 06 | Regenerate summary |
| GET | `/api/v1/workspaces/:id/summary` | 06 | Get existing summary |
| POST | `/api/v1/workspaces/:id/flashcards/generate` | 07 | Generate flashcards |
| GET | `/api/v1/workspaces/:id/flashcards` | 07 | List flashcards |
| PATCH | `/api/v1/workspaces/:id/flashcards/:fid/review` | 07 | Review flashcard (SRS) |
| POST | `/api/v1/workspaces/:id/quizzes/generate` | 08 | Generate quiz |
| GET | `/api/v1/workspaces/:id/quizzes` | 08 | List quizzes |
| GET | `/api/v1/workspaces/:id/quizzes/:qid` | 08 | Get quiz result |
| POST | `/api/v1/workspaces/:id/quizzes/:qid/submit` | 08 | Submit quiz answers |
| GET | `/api/v1/history` | 09 | Get activity history |

---

## 🌐 Frontend Route Registry

| URL | Component | Task |
|---|---|---|
| `/learning` | `LearningPage` | 02 |
| `/learning/workspace/:workspaceId` | `WorkspaceLayout` → redirect `/content` | 03 |
| `/learning/workspace/:workspaceId/content` | `ContentTab` | 04 |
| `/learning/workspace/:workspaceId/chat` | `ChatTab` | 05 |
| `/learning/workspace/:workspaceId/action` | `ActionTab` | 06 |
| `/learning/workspace/:workspaceId/flashcards` | `FlashcardTab` | 07 |
| `/learning/workspace/:workspaceId/quiz` | `QuizTab` | 08 |
| `/learning/workspace/:workspaceId/quiz/:quizId` | `QuizResultTab` | 08 |
| `/history` | `HistoryPage` | 09 |

---

## 📐 Standard Patterns (Global Rules)

### Backend Response Format
```json
{ "success": true, "data": {}, "message": "..." }
{ "success": false, "message": "Error", "error": "detail (dev only)" }
{ "success": true, "data": [], "pagination": { "page":1,"limit":10,"total":100 } }
```

### Frontend API Call Pattern
```javascript
// Semua API call harus:
// 1. Gunakan axiosInstance (dengan auth interceptor)
// 2. Handle error di store/hook level
// 3. Tampilkan loading state saat fetch
// 4. Tampilkan toast untuk success/error
// 5. Tidak ada API call langsung di komponen UI
```

### State Architecture
```
UI Component → consume hook/store only (no direct API calls)
Hook (use*.js) → orchestrate API + local state
Store (Zustand) → global shared state
Service (*Api.js) → pure API call functions (no state)
axiosInstance → auth headers + base URL
```

---

## ✅ Definition of Done (Per Task)

Setiap task dianggap selesai jika:
- [ ] Semua **Acceptance Criteria** terpenuhi
- [ ] Semua item **Manual Testing Checklist** dicentang
- [ ] Tidak ada **console error** di browser
- [ ] Tidak ada **server error** saat normal usage
- [ ] Code mengikuti **standard patterns** di atas
- [ ] Tidak ada **hardcoded data** yang tersisa
- [ ] **Files Forbidden** tidak diubah

---

*End of Master Index — Happy coding, alop! 🚀*
