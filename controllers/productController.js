const Product = require("../models/products");
const Branch = require("../models/branch");

// 🎯 CREATE PRODUCT - Salon Admin Only
exports.createProduct = async (req, res) => {
  try {
    const { branchId, name, category, description, price, stockQuantity, brand } = req.body;

    // ✅ Validate Required Fields
    if (!branchId || !name || !category || !price || !stockQuantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔍 Check if the branch exists & belongs to the salon admin
    const branch = await Branch.findOne({ _id: branchId, salonAdminId: req.user._id });
    if (!branch) {
      return res.status(404).json({ message: "Branch not found or unauthorized" });
    }

    // 🖼️ Extract Image Paths from Multer
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`); // Public URL format

    // 🚀 Create New Product
    const newProduct = new Product({
      name,
      category,
      description,
      price,
      stockQuantity,
      brand,
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
      console.log("Request received for products. User:", req.user);
      console.log("Branch ID:", req.query.branchId);

      if (!req.query.branchId) {
          return res.status(400).json({ success: false, message: "Branch ID is required" });
      }

      const products = await Product.find({ salonBranch: req.query.branchId });

      console.log("Fetched Products:", products); // ✅ Check what is returned

      res.status(200).json({ success: true, products });
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
};

