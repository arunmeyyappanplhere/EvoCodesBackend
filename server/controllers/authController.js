const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admins = require("../models/admins");
const cloudinary = require("./../config/cloudinary");

// Generates the next sequential ECA user ID, e.g. ECA01, ECA02, ...
const generateUserID = async () => {
  const count = await admins.countDocuments();
  const nextNumber = count + 1;
  return `ECA${String(nextNumber).padStart(2, "0")}`;
};

const signToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      userID: admin.userID,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Strips the password field before sending an admin doc back to the client
const sanitize = (admin) => {
  const { password, ...rest } = admin.toObject();
  return rest;
};

// POST - register a new admin account
const registerAdmin = async (req, res) => {
  try {
    const {
      email,
      username,
      phoneNumber,
      password,
      reEnterPassword,
      dateOfBirth,
      role,
      companyCode,
    } = req.body;

    if (
      !email ||
      !username ||
      !phoneNumber ||
      !password ||
      !dateOfBirth ||
      !role ||
      !companyCode
    ) {
      return res.status(400).json({ message: "All fields are required !!" });
    }

    if (password !== reEnterPassword) {
      return res.status(400).json({ message: "Passwords do not match !!" });
    }

    if (companyCode !== process.env.COMPANY_CODE) {
      return res.status(403).json({ message: "Invalid Company Code !!" });
    }

    const existingAdmin = await admins.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email already registered !!" });
    }

    const userID = await generateUserID();
    const hashedPassword = await bcrypt.hash(password, 10);

    let image = "";
    
    // Upload image to Cloudinary if file is provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "evocodes_uploads/admins",
      });
      image = result.secure_url;
    }

    const newAdmin = new admins({
      userID,
      email,
      username,
      phoneNumber,
      password: hashedPassword,
      dateOfBirth,
      role,
      image,
      companyCode,
    });

    await newAdmin.save();

    const token = signToken(newAdmin);

    res.status(201).json({
      message: "Admin account created successfully",
      token,
      admin: sanitize(newAdmin),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST - login with Mail ID or User ID (e.g. ECA01) + password
const loginAdmin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required !!" });
    }

    const admin = await admins.findOne({
      $or: [{ email: identifier.toLowerCase() }, { userID: identifier }],
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin Not Found !!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials !!" });
    }

    const token = signToken(admin);

    res.status(200).json({
      message: "Login successful",
      token,
      admin: sanitize(admin),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerAdmin, loginAdmin };