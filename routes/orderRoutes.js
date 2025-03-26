const express = require("express");
const {createAppointment,getSalonAllOrders,generateDynamicReceipt } = require("../controllers/orderController");
const router = express.Router();

const {authMiddleware, isSalonAdmin,filterByBranch} = require("../middleware/authMiddleware");

router.post("/create-order", authMiddleware,isSalonAdmin, createAppointment);

router.get("/fetch-orders", authMiddleware,isSalonAdmin,filterByBranch, getSalonAllOrders);

router.get("/generate-receipt", authMiddleware,isSalonAdmin,generateDynamicReceipt);


module.exports = router;