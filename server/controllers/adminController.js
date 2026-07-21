const Admin = require("../models/admin");

// Get All Admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });
    if (admins.length === 0) {
      return res.status(404).json({ message: "No Admins Found" });
    }
    res.status(200).json(admins);

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add Admin
const addAdmin = async (req, res) => {
  try {
    const {
      userID,
      email,
      username,
      phoneNumber,
      dateOfBirth,
      role,
      image,
      companyCode,
    } = req.body;

    const newAdmin = new Admin({
      userID,
      email,
      username,
      phoneNumber,
      dateOfBirth,
      role,
      image,
      companyCode,
    });
    await newAdmin.save();
    res.status(201).json(newAdmin);

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Admin
const updateAdmin = async (req, res) => {
  try {
    const {
      email,
      username,
      phoneNumber,
      dateOfBirth,
      role,
      image,
      companyCode,
    } = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.adminId,
      {
        email,
        username,
        phoneNumber,
        dateOfBirth,
        role,
        image,
        companyCode,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin Not Found" });
    }
    res.status(200).json(updatedAdmin);

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.adminId);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin Not Found" });
    }
    res.status(200).json({
      message: "Admin Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Dashboard Stats
const getAdminStats = async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments();
    const adminsByRole = await Admin.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      totalAdmins,
      adminsByRole,
    });
    
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminStats,
};