const multer = require("multer");
const path = require("path");

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/')); // Upload ke backend/uploads
  },
  filename: function (req, file, cb) {
    // Simpan file dengan nama unik (UUID)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter untuk tipe file
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.txt', '.md'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

// Batasi ukuran file (max 10MB)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = upload;