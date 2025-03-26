const express = require("express");
const {createCategory,getCategories} = require("../controllers/categoryController");
const router = express.Router();
const {authMiddleware, isSalonAdmin} = require("../middleware/authMiddleware");

router.post("/create-category", authMiddleware,isSalonAdmin,createCategory);
router.get("/get-categories", authMiddleware,getCategories);


module.exports = router;