const express = require("express");
const {createservice} = require("../controllers/serviceController");
const router = express.Router();

const {authMiddleware, isSalonAdmin} = require("../middleware/authMiddleware");

router.post("/create-service", authMiddleware,isSalonAdmin, createservice);

module.exports = router;