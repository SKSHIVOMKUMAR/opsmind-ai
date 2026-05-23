const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ========================================
// ENSURE UPLOADS FOLDER EXISTS
// ========================================

const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ========================================
// MULTER STORAGE
// ========================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// ========================================
// MULTER CONFIG
// ========================================

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: function (
    req,
    file,
    cb
  ) {
    if (
      file.mimetype ===
      "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF files allowed"
        ),
        false
      );
    }
  },
});

module.exports = upload;

// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + path.extname(file.originalname);
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({
//   storage,

//   // ✅ ADD HERE
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB

//   fileFilter: function (req, file, cb) {
//     if (file.mimetype === "application/pdf") {
//       cb(null, true);
//     } else {
//       cb(new Error("Only PDF files allowed"), false);
//     }
//   }
// });

// module.exports = upload;