const Category = require("../models/category");
const Branch = require("../models/branch");
const mongoose = require("mongoose"); // ✅ Add this if missing

exports.createCategory = async (req, res) => {
  try {
    const { branchId, name, parentCategoryId } = req.body;

    console.log("🚀 Received Data:", req.body); // ✅ Debugging

    // ✅ Validate Required Fields
    if (!branchId || !name) {
      return res.status(400).json({ message: "Branch ID and Category Name are required" });
    }

    // 🔍 Check if the branch exists & belongs to the salon admin
    const branch = await Branch.findOne({ _id: branchId, salonAdminId: req.user._id });
    if (!branch) {
      return res.status(404).json({ message: "Branch not found or unauthorized" });
    }

    console.log("✅ Branch Found:", branch);

    // 🚀 Create New Category
    const newCategory = new Category({
      name,
      slug: name.toLowerCase().replace(/ /g, "-"),
      parentCategory: parentCategoryId || null,
      branchId, // ✅ Ensure this field matches schema
      createdBy: req.user._id,
    });

    await newCategory.save();
    res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    console.error("❌ Category Creation Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCategories = async (req, res) => {
    try {
        const { branchId } = req.query;
        
        if (!branchId) {
            return res.status(400).json({ message: "Branch ID is required" });
        }

        // ✅ Debugging: Compare with Services API
        console.log("Fetching categories for branch:", branchId);

        let query = {};
        if (mongoose.Types.ObjectId.isValid(branchId)) {
            query.branchId = new mongoose.Types.ObjectId(branchId); // ✅ Ensure ObjectId format
        } else {
            return res.status(400).json({ message: "Invalid Branch ID" });
        }

        const categories = await Category.find(query).select("_id name parentCategoryId");

        if (!categories.length) {
            return res.status(200).json({ message: "No categories found for this branch", categories: [] });
        }

        res.status(200).json({ categories });
    } catch (error) {
        console.error("❌ Error fetching categories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
