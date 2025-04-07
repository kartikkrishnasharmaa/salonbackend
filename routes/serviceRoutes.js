const express = require("express");
const {createservice,getServicesByBranch,assignServiceToEmployee} = require("../controllers/serviceController");
const router = express.Router();

const {authMiddleware, isSalonAdmin} = require("../middleware/authMiddleware");

router.post("/create-service", authMiddleware,isSalonAdmin, createservice);
router.get("/get-services", authMiddleware, isSalonAdmin, getServicesByBranch);
router.post("/assign-service", authMiddleware, isSalonAdmin, assignServiceToEmployee);


module.exports = router;