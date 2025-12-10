const express = require("express");
const router = express.Router();
const { createContact } = require("../controllers/contactController");

// Accept contact messages from anyone
router.post("/", createContact);

module.exports = router;
