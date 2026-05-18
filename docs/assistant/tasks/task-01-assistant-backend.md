# Task 01 - Assistant Backend Flow

**Tujuan:**
Membuat endpoint API baru untuk mengambil daftar semua percakapan AI milik user beserta pesan terakhir (last message) agar bisa ditampilkan di sidebar Assistant.

## 1. Analisis
Saat ini, tabel `AiConversation` menyimpan `workspaceId`, `userId`, dan `title`. Pesan-pesannya ada di tabel `Message`. Kita perlu endpoint yang melakukan query ke `AiConversation` milik user, lalu mencari satu pesan terakhir dari tabel `Message` untuk setiap percakapan tersebut.

## 2. Implementasi Backend

### A. Buat `backend/src/controllers/assistantController.js`
Buat file ini untuk menangani logika fetch conversations:

```javascript
const AiConversation = require('../models/AiConversation');
const Message = require('../models/Message');

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Ambil semua conversation milik user, sort dari update terbaru
    const conversations = await AiConversation.find({ userId })
      .sort({ updatedAt: -1 })
      .lean();

    // Loop untuk ambil lastMessage dari setiap conversation
    // Menggunakan Promise.all agar efisien
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const lastMsg = await Message.findOne({ conversationId: conv._id })
          .sort({ createdAt: -1 })
          .lean();

        return {
          id: conv._id,
          workspaceId: conv.workspaceId,
          title: conv.title,
          lastMessage: lastMsg ? lastMsg.content : 'Belum ada pesan',
          time: lastMsg ? lastMsg.createdAt : conv.updatedAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: conversationsWithLastMessage,
    });
  } catch (error) {
    console.error('[AssistantController] getConversations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversations',
    });
  }
};

module.exports = {
  getConversations,
};
```

### B. Buat `backend/src/routes/assistantRoutes.js`
Buat file routing untuk controller di atas.

```javascript
const express = require('express');
const router = express.Router();
const { getConversations } = require('../controllers/assistantController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/conversations', authMiddleware, getConversations);

module.exports = router;
```

### C. Daftarkan Routes di `backend/src/app.js`
Buka file `app.js`, import dan daftarkan `assistantRoutes`.

```javascript
// Di bagian atas bersama import lainnya:
const assistantRoutes = require('./routes/assistantRoutes');

// Di bagian pendaftaran route:
app.use('/api/v1/assistant', assistantRoutes);
```

## 3. Acceptance Criteria
- [ ] Tersedia `assistantController.js` dengan fungsi `getConversations`.
- [ ] Tersedia `assistantRoutes.js` yang mem-bind endpoint `GET /conversations`.
- [ ] Endpoint terdaftar di `app.js` dengan prefix `/api/v1/assistant`.
- [ ] Ketika di test dengan postman/REST client (menyertakan token), mengembalikan JSON data array berisi { id, workspaceId, title, lastMessage, time }.
