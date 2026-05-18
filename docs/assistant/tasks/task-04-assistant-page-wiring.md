# Task 04 - Page Wiring & Polish

**Tujuan:**
Menyusun semua blok dari Task 02 & Task 03 ke dalam `AssistantPage.jsx`, serta menangani _edge case_ seperti empty state, loading screen, dan mobile responsive drawer.

## 1. Refactor `AssistantPage.jsx`

Hapus deklarasi state array dummy (`conversationsData`, `messagesData`). Import Zustand store.

### Logic Utama:
```javascript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAssistantStore from '../../features/assistant/store/assistantStore';
// imports lainnya...

const AssistantPage = () => {
  const navigate = useNavigate();
  const { 
    conversations, 
    activeConversationId, 
    messages, 
    fetchConversations, 
    selectConversation, 
    sendMessage,
    isLoadingConversations,
    isLoadingMessages,
    isSendingMessage 
  } = useAssistantStore();

  const [openMenuId, setOpenMenuId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Initial Data Load
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Handler Actions
  const handleSelectConversation = (id) => {
    selectConversation(id);
    setMobileOpen(false); // Close sidebar on mobile after selection
  };

  const handleNewChat = () => {
    navigate('/learning'); // Redirect to create new workspace
  };

  const activeConv = conversations.find(c => c.id === activeConversationId);

  // ... (setup props untuk Sidebar dan ChatArea)
```

## 2. Empty States & Loading States

* **Saat `isLoadingConversations` true:**
  Tampilkan skeleton loader di area Sidebar (bisa berupa box-box redup animasi pulse).
* **Saat `conversations.length === 0` (Belum ada chat sama sekali):**
  Di ChatArea, berikan layar "Empty State" yang bersih dengan ikon Bot, pesan "You don't have any AI conversations yet. Upload a document to start learning!", dan tombol CTA "Upload Document".
* **Saat `isLoadingMessages` true:**
  Tampilkan spinner atau animasi skeleton skeleton khusus chat messages di tengah ChatArea sebelum pesan dimuat.
* **Format waktu di Sidebar:** Gunakan format yang user-friendly (contoh menggunakan `date-fns` `formatDistanceToNow`).

## 3. Polish Responsivitas

* Periksa bahwa `ChatSidebar` versi _drawer mobile_ menggunakan data asli dengan benar.
* Hamburger menu di `ChatArea` berfungsi mulus untuk membuka _drawer_.
* `backdrop` click di mobile berfungsi menutup sidebar.

## 4. Acceptance Criteria
- [ ] Halaman Assistant menggunakan data real backend (menghapus semua hardcode).
- [ ] `useEffect` memicu `fetchConversations()` satu kali saat komponen mount.
- [ ] Perpindahan active conversation di Sidebar memperbarui data di `ChatArea`.
- [ ] Terdapat visual feedback (loading skeleton) ketika memuat list atau pesan.
- [ ] Terdapat tampilan Empty State ketika belum ada data.
- [ ] Layout tidak berantakan dan drawer/sidebar di mobile berfungsi 100%.

**End of Assistant Feature Integration**
