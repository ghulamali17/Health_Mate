const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const upload = require("../middlewares/upload");

// AI routes
router.post("/healthmate", aiController.healthMate);
router.post("/summarize", upload.single("file"), aiController.summarizeFile);

module.exports = router;