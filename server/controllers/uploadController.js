const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const {
  chunkText,
} = require("../utils/chunker");

const Document = require(
  "../models/documentModel"
);

const {
  generateEmbedding,
} = require(
  "../services/embeddingService"
);

const uploadPDF = async (
  req,
  res
) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        error:
          "No file uploaded",
      });
    }

    // ========================================
    // FILE INFO
    // ========================================

    const fileName =
      req.file.originalname;

    const storedFileName =
      req.file.filename;

    // ========================================
    // PREVENT DUPLICATES
    // ========================================

    const exists =
      await Document.findOne({
        fileName,
      });

    if (exists) {
      return res.status(400).json({
        error:
          "File already exists",
      });
    }

    // ========================================
    // ABSOLUTE FILE PATH
    // ========================================

    const filePath =
      path.resolve(
        __dirname,
        "../uploads",
        storedFileName
      );

    // ========================================
    // CHECK FILE EXISTS
    // ========================================

    if (
      !fs.existsSync(filePath)
    ) {
      return res.status(500).json({
        error:
          "Uploaded file not found on server",
      });
    }

    // ========================================
    // READ PDF
    // ========================================

    const dataBuffer =
      await fs.promises.readFile(
        filePath
      );

    const pdfData =
      await pdfParse(
        dataBuffer
      );

    const text =
      pdfData.text;

    // ========================================
    // EMPTY PDF CHECK
    // ========================================

    if (
      !text ||
      text.trim().length === 0
    ) {
      return res.status(400).json({
        error:
          "Empty PDF content",
      });
    }

    // ========================================
    // CHUNK TEXT
    // ========================================

    const chunks =
      chunkText(text);

    const docs = [];

    for (
      let i = 0;
      i < chunks.length;
      i++
    ) {

      const chunk =
        chunks[i];

      if (
        !chunk ||
        chunk.length < 50
      ) {
        continue;
      }

      const embedding =
        await generateEmbedding(
          chunk
        );

      docs.push({
        fileName,
        storedFileName,
        chunkText: chunk,
        embedding,
        chunkIndex: i,
        pageNumber:
          Math.floor(i / 3) + 1,
      });

      // ========================================
      // BATCH INSERT
      // ========================================

      if (
        docs.length === 50
      ) {
        await Document.insertMany(
          docs
        );

        docs.length = 0;
      }
    }

    // ========================================
    // INSERT REMAINING
    // ========================================

    if (docs.length > 0) {
      await Document.insertMany(
        docs
      );
    }

    // ========================================
    // SUCCESS
    // ========================================

    res.status(200).json({
      message:
        "PDF processed & stored successfully",

      totalChunks:
        chunks.length,
    });

  } catch (error) {

    console.error(
      "UPLOAD ERROR:",
      error
    );

    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  uploadPDF,
};


// const fs = require("fs");

// const pdfParse =
//   require("pdf-parse");

// const {
//   chunkText,
// } = require("../utils/chunker");

// const Document =
//   require("../models/documentModel");

// const {
//   generateEmbedding,
// } = require(
//   "../services/embeddingService"
// );

// const uploadPDF = async (
//   req,
//   res
// ) => {
//   try {

//     if (!req.file) {
//       return res.status(400).json({
//         error:
//           "No file uploaded",
//       });
//     }

//     // Original file name
//     const fileName =
//       req.file.originalname;

//     // Actual stored file
//     const storedFileName =
//       req.file.filename;

//     // Prevent duplicate uploads
//     const exists =
//       await Document.findOne({
//         fileName,
//       });

//     if (exists) {
//       return res.status(400).json({
//         error:
//           "File already exists",
//       });
//     }

//     const filePath =
//       req.file.path;

//     const dataBuffer =
//       await fs.promises.readFile(
//         filePath
//       );

//     const pdfData =
//       await pdfParse(
//         dataBuffer
//       );

//     const text =
//       pdfData.text;

//     if (
//       !text ||
//       text.trim().length === 0
//     ) {
//       return res.status(400).json({
//         error:
//           "Empty PDF content",
//       });
//     }

//     const chunks =
//       chunkText(text);

//     const docs = [];

//     for (
//       let i = 0;
//       i < chunks.length;
//       i++
//     ) {

//       const chunk =
//         chunks[i];

//       if (
//         !chunk ||
//         chunk.length < 50
//       ) {
//         continue;
//       }

//       const embedding =
//         await generateEmbedding(
//           chunk
//         );

//       docs.push({
//         fileName,
//         storedFileName,
//         chunkText: chunk,
//         embedding,
//         chunkIndex: i,
//         pageNumber:
//           Math.floor(i / 3) + 1,
//       });

//       // Batch insert
//       if (
//         docs.length === 50
//       ) {

//         await Document.insertMany(
//           docs
//         );

//         docs.length = 0;
//       }
//     }

//     // Remaining docs
//     if (docs.length > 0) {
//       await Document.insertMany(
//         docs
//       );
//     }

//     res.status(200).json({
//       message:
//         "PDF processed & stored successfully",

//       totalChunks:
//         chunks.length,
//     });

//   } catch (error) {

//     console.error(
//       "UPLOAD ERROR:",
//       error
//     );

//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   uploadPDF,
// };