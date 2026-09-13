const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createAudit } = require("../controllers/auditController");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createAudit
);

module.exports = router;