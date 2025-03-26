const mongoose = require("mongoose");
const Product = require("../models/products");
const Branch = require("../models/branch");

// 🎯 CREATE PRODUCT - Salon Admin Only
exports.createProduct = async (req, res) => {
  try {

    const {
      branchId,
      name,
      category,
      description,
      price,
      inclusiveTax,
      mrp,
      stockQuantity,
      brand,
      hsnCode,
      tax,
      measurement,
      isRetail,
      isConsumable,
    } = req.body;

    // ✅ Validate Required Fields
    if (!branchId || !name || !category || !price || !stockQuantity) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // 🔍 Check if branch exists & belongs to salon admin
    const branch = await Branch.findOne({ _id: branchId, salonAdminId: req.user._id });
    if (!branch) {
      return res.status(404).json({ message: "Branch not found or unauthorized" });
    }

    // 🖼️ Extract Image Paths from Multer
    const imagePaths = req.files?.map(file => `/uploads/${file.filename}`) || [];

    // 🚀 Create New Product
    const newProduct = new Product({
      name,
      category,
      description,
      price,
      inclusiveTax,
      mrp,
      stockQuantity,
      brand,
      hsnCode,
      tax,
      measurement,
      isRetail,
      isConsumable,
      images: imagePaths,
      salonBranch: branchId,
      createdBy: req.user._id,
      status: stockQuantity > 0 ? "Available" : "Out of Stock",
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Product Creation Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { branchId } = req.query;

    // 1. Basic but better validation
    if (!branchId) {
      return res.status(400).json({ 
        success: false, 
        message: "Branch ID is required in query params" 
      });
    }

    // 2. Fetch products (no ownership check)
    const products = await Product.find(
      { salonBranch: branchId },
      { __v: 0 } // Excludes version key from response
    );

    // 3. Simplified success response
    res.status(200).json({ 
      success: true,
      count: products.length, // Helpful for frontend
      products 
    });

  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch products. Please try again." 
    });
  }
};