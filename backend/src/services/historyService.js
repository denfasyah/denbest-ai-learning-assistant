const History = require('../models/History');
const Notification = require('../models/Notification');

const generateNotificationContent = (actionType, workspaceTitle, metadata) => {
  const name = workspaceTitle || metadata?.noteTitle || 'Aktivitas baru';
  switch (actionType) {
    case 'document_uploaded':
      return {
        title: 'Dokumen Berhasil Diupload',
        description: `${name} berhasil diupload dan siap digunakan.`,
        type: 'document',
      };
    case 'summary_generated':
      return {
        title: 'AI Summary Siap',
        description: `Ringkasan untuk ${name} berhasil dibuat oleh AI.`,
        type: 'summary',
      };
    case 'flashcard_generated':
      return {
        title: 'Flashcard Berhasil Dibuat',
        description: `Flashcard untuk ${name} berhasil digenerate.`,
        type: 'flashcard',
      };
    case 'quiz_completed':
      return {
        title: 'Quiz Selesai',
        description: `Kamu menyelesaikan quiz dari ${name}.`,
        type: 'quiz',
      };
    case 'chat_sent':
      return {
        title: 'AI Menjawab Pertanyaanmu',
        description: `AI memberikan respons baru di ${name}.`,
        type: 'assistant',
      };
    case 'note_created':
      return {
        title: 'Note Tersimpan',
        description: `Note baru "${name}" berhasil ditambahkan.`,
        type: 'note',
      };
    default:
      return null; // actionType yang tidak perlu dinotifikasi (workspace_created, dll)
  }
};

exports.logActivity = async (userId, workspaceId, workspaceTitle, actionType, metadata) => {
  const history = new History({
    userId,
    workspaceId: workspaceId || null, // Nullable jika di luar workspace
    workspaceTitle,
    actionType,
    metadata,
    createdAt: new Date(),
  });

  await history.save();

  // Auto-create notification (non-blocking)
  try {
    const notifContent = generateNotificationContent(actionType, workspaceTitle, metadata);
    if (notifContent) {
      await Notification.create({
        userId,
        historyId: history._id,
        type: notifContent.type,
        title: notifContent.title,
        description: notifContent.description,
      });
    }
  } catch (notifError) {
    console.error('[Notification] Failed to create notification:', notifError.message);
  }
};