const express = require("express");
const summarizeFile = require("../controllers/summarizeController");
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware"); 

const router = express.Router();

router.post("/", authMiddleware, upload.single("file"), summarizeFile);

module.exports = router;