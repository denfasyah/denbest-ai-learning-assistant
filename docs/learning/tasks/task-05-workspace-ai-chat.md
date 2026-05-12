# Task 05 — Workspace AI Chat

**Phase:** Core AI  
**Priority:** HIGH  
**Depends On:** Task-01, Task-02, Task-03  
**Agent:** alop  

---

## Objective
Mengimplementasikan fitur **AI Chat berbasis konteks dokumen** yang berfungsi nyata — menghubungkan frontend ChatTab ke backend yang menggunakan Google Gemini API dengan konteks dari `extractedText` dokumen user.

---

## Scope

### Backend
- `chatController.js` — handle chat message request
- `chatService.js` / `aiService.js` — integrasi Gemini API, prompt building
- `conversationController.js` — CRUD conversation
- Route chat terimplementasi penuh

### Frontend
- Refactor `ChatTab.jsx` — connect ke API nyata
- Buat `features/workspace/hooks/useChat.js`
- Buat `features/workspace/services/chatApi.js`
- Render markdown pada AI response
- Implement streaming atau polling response

---

## Dependencies
- ✅ Task-01 (models: AiConversation, Message), Task-02, Task-03
- ✅ `useWorkspace()` tersedia (workspaceId, document.extractedText siap)
- ❌ Google Gemini API key belum dikonfigurasi → tambah `GEMINI_API_KEY` ke `.env`
- ❌ `@google/generative-ai` belum diinstall di backend
- ❌ `react-markdown` belum diinstall di frontend (untuk render AI response)

---

## Files / Folder ALLOWED to Edit

**Backend:**
```
backend/src/controllers/chatController.js    ← BUAT BARU
backend/src/services/chatService.js          ← BUAT BARU
backend/src/services/aiService.js            ← BUAT BARU (Gemini wrapper)
backend/src/routes/chatRoutes.js             ← ISI implementasi
backend/src/utils/promptBuilder.js           ← BUAT BARU
backend/.env                                 ← Tambah GEMINI_API_KEY
backend/package.json                         ← Tambah @google/generative-ai
```

**Frontend:**
```
frontend/src/features/workspace/components/ChatTab.jsx     ← REFACTOR
frontend/src/features/workspace/hooks/useChat.js           ← BUAT BARU
frontend/src/features/workspace/services/chatApi.js        ← BUAT BARU
frontend/package.json                                      ← Tambah react-markdown
```

## Files / Folder FORBIDDEN to Edit
```
frontend/src/features/workspace/context/WorkspaceContext.jsx
frontend/src/features/workspace/components/WorkspaceLayout.jsx
frontend/src/features/workspace/components/WorkspaceTabs.jsx
frontend/src/features/learning/
backend/src/models/
```

---

## Backend Requirements

### `aiService.js` (Gemini Wrapper)
```javascript
// Singleton instance dari GoogleGenerativeAI
// Function: generateResponse(prompt, history)
//   - history: array of {role, parts: [{text}]} untuk multi-turn
//   - Return: string (AI response text)
// 
// Error handling:
//   - Rate limit → throw specific error code
//   - Timeout 30s → throw timeout error
//   - Empty response → throw empty response error
```

### `promptBuilder.js`
```javascript
// buildChatPrompt(extractedText, userMessage, chatHistory)
// 
// System prompt template:
// """
// Kamu adalah AI Learning Assistant yang membantu user memahami materi pembelajaran.
// Jawab pertanyaan user HANYA berdasarkan konteks dokumen berikut.
// Jika jawaban tidak ada dalam dokumen, katakan dengan jujur bahwa kamu tidak tahu.
// Gunakan bahasa yang sama dengan pertanyaan user (Indonesia/Inggris).
// Format jawaban menggunakan Markdown jika perlu (bold, list, code).
//
// === KONTEN DOKUMEN ===
// {extractedText}
// === AKHIR DOKUMEN ===
// """
//
// PENTING: Jika extractedText terlalu panjang (> 30.000 karakter),
// truncate ke 30.000 karakter dengan catatan "[Dokumen terlalu panjang, ditampilkan sebagian]"
```

### `chatService.js`
```javascript
// sendMessage(workspaceId, userId, userMessage):
//   1. Ambil Document dari DB berdasarkan workspaceId (get extractedText)
//   2. Cari atau buat AiConversation untuk workspace ini
//   3. Ambil 10 messages terakhir dari conversation (untuk context window)
//   4. Build prompt dengan promptBuilder
//   5. Call aiService.generateResponse(prompt, history)
//   6. Simpan pesan user ke Messages collection
//   7. Simpan response AI ke Messages collection
//   8. Return { message: aiResponseText, conversationId }

// getChatHistory(workspaceId, userId):
//   1. Find AiConversation by workspaceId + userId
//   2. Populate messages (limit 50 terbaru, sorted by createdAt)
//   3. Return messages array
```

### `chatController.js`
```javascript
// sendMessage: validate req.body.message, call chatService, return response
// getChatHistory: call chatService, return messages
```

### Route Implementation
```javascript
// chatRoutes.js:
POST /:workspaceId/chat              → chatController.sendMessage
GET  /:workspaceId/chat/history      → chatController.getChatHistory
```

---

## Frontend Requirements

### `chatApi.js`
```javascript
sendMessage(workspaceId, message)    // POST /workspaces/:id/chat
getChatHistory(workspaceId)          // GET /workspaces/:id/chat/history
```

### `useChat.js`
```javascript
// Terima workspaceId dari useWorkspace()
// State:
//   messages: []          // Array of {role, content, createdAt, id}
//   inputValue: string
//   isLoading: boolean    // AI sedang generate response
//   error: string | null

// Actions:
//   sendMessage()         // Kirim pesan, optimistic update, call API
//   loadHistory()         // Fetch chat history saat pertama mount

// Optimistic Update Pattern:
//   1. Tambah pesan user ke messages[] langsung (sebelum API resolve)
//   2. Tambah placeholder "AI is thinking..." 
//   3. Ketika API resolve → replace placeholder dengan response nyata
//   4. Jika API error → hapus placeholder, tampilkan error toast
```

### `ChatTab.jsx` Refactor
- Import `useChat` hook
- Import `react-markdown` untuk render AI response
- Implement auto-scroll ke pesan terbaru
- Enter key untuk send (Shift+Enter untuk newline)
- Disable input saat `isLoading === true`
- Tampilkan "AI sedang mengetik..." indicator (animated dots)
- Suggested prompts di awal conversation (sebelum ada pesan):
  ```
  - "Jelaskan konsep utama dalam dokumen ini"
  - "Buat 3 poin ringkasan dari materi"
  - "Apa yang tidak saya mengerti dari dokumen ini?"
  ```

### ChatTab UI Structure
```
┌─────────────────────────────────────────────┐
│  Chat AI  [Conversation title]  [Clear]     │
│─────────────────────────────────────────────│
│                                             │
│  [Suggested prompts chips] ← jika kosong   │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ 🤖 AI: Halo! Saya sudah memahami... │  │
│  └──────────────────────────────────────┘  │
│     ┌────────────────────────────────────┐  │
│     │ 👤 Jelaskan supervised learning    │  │
│     └────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │ 🤖 AI: **Supervised learning** adalah│  │
│  │ metode...  [markdown rendered]       │  │
│  └──────────────────────────────────────┘  │
│                                             │
│─────────────────────────────────────────────│
│  [Type your question...        ] [Send →]  │
└─────────────────────────────────────────────┘
```

---

## API Requirements

### Request: Send Message
```json
POST /api/v1/workspaces/:workspaceId/chat
Body: { "message": "Jelaskan supervised learning" }
Auth: Bearer token

Response:
{
  "success": true,
  "data": {
    "message": "**Supervised learning** adalah...",
    "conversationId": "conv_id",
    "role": "assistant",
    "createdAt": "2026-05-12T..."
  }
}
```

### Request: Get History
```json
GET /api/v1/workspaces/:workspaceId/chat/history

Response:
{
  "success": true,
  "data": {
    "conversationId": "...",
    "messages": [
      { "id": "...", "role": "user", "content": "...", "createdAt": "..." },
      { "id": "...", "role": "assistant", "content": "...", "createdAt": "..." }
    ]
  }
}
```

---

## State Management Requirements
- `useChat` hook = local state (tidak perlu Zustand karena hanya di-consume ChatTab)
- Load history di `useEffect` mount
- `isLoading` state mencegah double-send (disable input + button)
- Messages di-render dari state lokal (bukan re-fetch setiap kali)

---

## Error Handling

### Backend
- `extractedText` kosong / null → 422: `"Document has no readable text. Please re-upload."`
- Gemini API key invalid → 500: `"AI service configuration error"`
- Gemini timeout (>30s) → 504: `"AI response timeout. Please try again."`
- Gemini rate limit → 429: `"Too many requests. Please wait a moment."`

### Frontend
- API error → hapus optimistic message, tampilkan toast error
- Timeout → toast: "AI terlalu lama merespon. Coba lagi."
- Network error → toast: "Tidak ada koneksi internet."
- Kosong saat send → validasi, jangan kirim pesan kosong

---

## Routing Requirements
- `ChatTab` di-render oleh Outlet di path `/learning/workspace/:id/chat`
- Tidak ada perubahan routing

---

## Acceptance Criteria
- [ ] Kirim pesan → AI merespon berdasarkan isi dokumen (bukan generic response)
- [ ] Response AI di-render sebagai Markdown (bold, list, code)
- [ ] Chat history tersimpan di MongoDB (test dengan refresh halaman)
- [ ] Refresh halaman di `/chat` tab → chat history masih ada
- [ ] Loading indicator tampil saat AI generating
- [ ] Enter key send pesan, Shift+Enter buat newline
- [ ] Input disabled saat loading
- [ ] Suggested prompts muncul saat conversation kosong
- [ ] AI menjawab hanya berdasarkan dokumen, bukan pengetahuan umum

---

## Manual Testing Checklist
- [ ] Upload dokumen Fisika → masuk workspace chat → tanya "Apa itu energi kinetik?"
- [ ] AI menjawab sesuai konten dokumen
- [ ] Tanya sesuatu yang tidak ada di dokumen → AI bilang "tidak ada dalam dokumen"
- [ ] Refresh halaman → history masih ada
- [ ] Klik suggested prompt → langsung terisi di input
- [ ] Kirim pesan kosong → tidak ada request ke API
- [ ] Simulate lambat internet → loading indicator tampil
- [ ] MongoDB: collection `ai_conversations` dan `messages` terisi

---

## Expected Final Result
AI Chat berfungsi dengan konteks dokumen yang nyata. User bisa tanya jawab tentang materi yang mereka upload. Response disimpan di database. Ini adalah core AI feature yang akan menjadi fondasi untuk Summary (task-06) dan fitur AI lainnya.
