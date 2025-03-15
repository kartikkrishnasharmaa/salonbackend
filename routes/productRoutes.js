const express = require("express");
const {createProduct,getProducts} = require("../controllers/productController");
const upload = require("../middleware/upload");
const router = express.Router();
const {authMiddleware, isSalonAdmin,filterByBranch} = require("../middleware/authMiddleware");

router.post("/create-product", authMiddleware,isSalonAdmin,upload.array("images", 5), createProduct);

router.get("/get-products", authMiddleware,isSalonAdmin,filterByBranch, getProducts);


module.exports = router;