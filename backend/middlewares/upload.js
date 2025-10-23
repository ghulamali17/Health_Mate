const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
    files: 1, 
    fields: 10 
  },
  fileFilter: (req, file, cb) => {
    console.log("🔍 File filter checking:", file.originalname, file.mimetype);
    
    // Allow only specific file types
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
      'application/msword' 
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      console.log("✅ File type allowed:", file.mimetype);
      cb(null, true);
    } else {
      console.log("❌ File type rejected:", file.mimetype);
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, and MD files are allowed.'), false);
    }
  }
});

// Handle multer errors globally
upload.errorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  next(error);
};

module.exports = upload;