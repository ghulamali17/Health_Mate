const express = require("express");
const summarizeFile = require("../controllers/summarizeController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post("/", upload.single("file"), summarizeFile);

module.exports = router;