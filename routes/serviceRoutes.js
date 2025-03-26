const express = require("express");
const {createservice,getServicesByBranch} = require("../controllers/serviceController");
const router = express.Router();

const {authMiddleware, isSalonAdmin} = require("../middleware/authMiddleware");

router.post("/create-service", authMiddleware,isSalonAdmin, createservice);
router.get("/get-services", authMiddleware, isSalonAdmin, getServicesByBranch);


module.exports = router;