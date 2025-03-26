const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, // Agar ye subcategory hai to yahan parent ka ID store hoga
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true, // ✅ Fixed Field Name
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalonAdmin",
      required: true,
    },
  },
  { timestamps: true }
);

// Slug auto-generate karne ke liye
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/ /g, "-");
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
