const Notification = require('../models/Notification');

// GET /notifications?page=1&limit=10&filter=all|unread|read
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const filter = req.query.filter || 'all';

    const query = { userId, deletedAt: null };
    if (filter === 'unread') query.read = false;
    if (filter === 'read') query.read = true;

    const total = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: notifications.map(n => ({
        id: n._id,
        type: n.type,
        title: n.title,
        description: n.description,
        read: n.read,
        createdAt: n.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /notifications/unread-count
exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await Notification.countDocuments({
      userId,
      read: false,
      deletedAt: null,
    });
    return res.status(200).json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
};

// PATCH /notifications/:id/read
exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notif = await Notification.findOne({ _id: req.params.id, userId });
    if (!notif) return res.status(404).json({ success: false, message: 'Notification tidak ditemukan.' });
    notif.read = true;
    await notif.save();
    return res.status(200).json({ success: true, data: notif });
  } catch (error) {
    next(error);
  }
};

// PATCH /notifications/read-all
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Notification.updateMany({ userId, read: false, deletedAt: null }, { read: true });
    return res.status(200).json({ success: true, message: 'Semua notifikasi ditandai sudah dibaca.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /notifications/:id
exports.deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notif = await Notification.findOne({ _id: req.params.id, userId });
    if (!notif) return res.status(404).json({ success: false, message: 'Notification tidak ditemukan.' });
    notif.deletedAt = new Date();
    await notif.save();
    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};
