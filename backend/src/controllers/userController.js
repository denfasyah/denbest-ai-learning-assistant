const User = require('../models/User');
const UserPreference = require('../models/UserPreference');
const History = require('../models/History');
const Notification = require('../models/Notification');

const logActivityAndNotify = async (userId, type, action, description, title, message) => {
  try {
    const history = await History.create({
      userId,
      workspaceId: null,
      workspaceTitle: '',
      actionType: type,
      metadata: { action, description },
      createdAt: new Date(),
    });

    const pref = await UserPreference.findOne({ userId });
    if (!pref || pref.notifications_enabled !== false) {
      await Notification.create({
        userId,
        historyId: history._id,
        type,
        title,
        description: message,
      });
    }
  } catch (error) {
    console.error('[UserAction] Failed to log history or notify:', error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
    
    // Ensure UserPreference exists
    await UserPreference.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio || 'AI enthusiast yang sedang mendalami teknologi dan machine learning untuk masa depan yang lebih cerdas.',
        location: user.location || 'Indonesia',
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, location, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

    if (name) user.name = name;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    await logActivityAndNotify(
      userId,
      'profile',
      'Profile Diperbarui',
      'Kamu memperbarui informasi profil.',
      'Profil Diperbarui',
      'Informasi profil kamu berhasil diperbarui.'
    );

    return res.status(200).json({ success: true, message: 'Profil berhasil diperbarui' });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Password saat ini tidak sesuai' });

    user.password = newPassword; // Pre-save hook will hash it
    await user.save();

    await logActivityAndNotify(
      userId,
      'setting',
      'Password Diubah',
      'Kamu memperbarui kata sandi akun.',
      'Password Diubah',
      'Kata sandi akun kamu berhasil diperbarui.'
    );

    return res.status(200).json({ success: true, message: 'Password berhasil diperbarui' });
  } catch (error) {
    next(error);
  }
};

exports.changeEmail = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { newEmail } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists && emailExists._id.toString() !== userId) {
      return res.status(400).json({ success: false, message: 'Email sudah digunakan oleh akun lain' });
    }

    user.email = newEmail;
    await user.save();

    await logActivityAndNotify(
      userId,
      'setting',
      'Email Diubah',
      'Kamu memperbarui alamat email akun.',
      'Email Diubah',
      'Alamat email akun kamu berhasil diperbarui.'
    );

    return res.status(200).json({ success: true, message: 'Email berhasil diperbarui' });
  } catch (error) {
    next(error);
  }
};

exports.getPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let pref = await UserPreference.findOne({ userId });
    
    if (!pref) {
      pref = await UserPreference.create({ userId });
    }
    
    return res.status(200).json({ success: true, data: pref });
  } catch (error) {
    next(error);
  }
};

exports.updatePreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notifications_enabled } = req.body;

    const pref = await UserPreference.findOneAndUpdate(
      { userId },
      { notifications_enabled },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, data: pref });
  } catch (error) {
    next(error);
  }
};
