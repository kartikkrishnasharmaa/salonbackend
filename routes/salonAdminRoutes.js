const express = require("express");
const {
  createSalonAdmin,
  salonAdminLogin,
  viewAllSalonAdmins,
  getTotalSalonAdminsCount,
  viewSalonAdmin,
  updateSalonAdmin,
  deleteSalonAdmin,
  loginasSalonAdmin,
  getSalonAdminProfile, 
  createBranch, 
  getAllSalonAdminsWithBranches
} = require("../controllers/salonAdminAuthController");

const {authMiddleware,loginasadmin,isSuperAdmin, isSalonAdmin} = require("../middleware/authMiddleware");


const router = express.Router();

// Route to create a salon admin (Only super admin can do this)
router.post("/create-salon-admin", authMiddleware,isSuperAdmin, createSalonAdmin);

router.post("/direct-login-salon-admin/:salonAdminId",authMiddleware,isSuperAdmin, loginasSalonAdmin);

router.get("/salon-admin-profile", authMiddleware, getSalonAdminProfile);

router.post("/create-branch", authMiddleware,isSuperAdmin, createBranch); 
router.get("/get-all-branches", authMiddleware,isSuperAdmin, getAllSalonAdminsWithBranches);

//count all admin API
router.get(
  "/admin-counting",
  authMiddleware,
  isSuperAdmin,
  getTotalSalonAdminsCount
);

//get all salon admin data
router.get("/view-all-salon-admins", authMiddleware,isSuperAdmin, viewAllSalonAdmins);

//get salon admin by ID
router.get("/view-salon-admin/:adminId", authMiddleware,isSuperAdmin, viewSalonAdmin);

// // Update Salon Admin
router.put('/update-salon-admin/:id',authMiddleware,isSuperAdmin, updateSalonAdmin);

// Delete Salon Admin
router.delete('/delete-salon-admin/:id',authMiddleware,isSuperAdmin, deleteSalonAdmin);

// // Salon admin login
router.post("/salon-admin-login", salonAdminLogin);

module.exports = router;
