const express = require("express");
const healthmateChat = require("../controllers/healthmateController");

const router = express.Router();

router.post("/", healthmateChat);

module.exports = router;