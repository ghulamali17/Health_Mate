const express = require("express");
const healthlensChat = require("../controllers/healthlensController");

const router = express.Router();

router.post("/", healthlensChat);

module.exports = router;
