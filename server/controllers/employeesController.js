const employees = require("../models/employees");
const cloudinary = require("./../config/cloudinary");

const slugify = (name = "") =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "employee";

// GET all employees
const getEmployees = async (req, res) => {
  try {
    const employeesAvailable = await employees.find();
    if (employeesAvailable.length == 0) {
      res.status(400).json({ message: "No Employees Found !!" });
    } else {
      res.status(200).json(employeesAvailable);
    }
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST - add a new employee
const addEmployee = async (req, res) => {
  try {
    const { employeeName, employeePosition, employeeDepartment, employeeEmail, employeeStatus } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "An employee photo (employeeImage) is required." });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "evocodes_uploads/employees",
    });
    const employeeImage = result.secure_url;

    const employeeId =
      req.body.employeeId && req.body.employeeId.trim()
        ? req.body.employeeId.trim()
        : `${slugify(employeeName)}-${Date.now().toString(36)}`;

    const newEmployee = new employees({
      employeeId,
      employeeImage,
      employeeName,
      employeePosition,
      employeeDepartment,
      employeeEmail,
      employeeStatus,
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT - update an existing employee by employeeId
const updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "evocodes_uploads/employees",
      });
      updateData.employeeImage = result.secure_url;
    } else {
      delete updateData.employeeImage;
    }

    const updatedEmployee = await employees.findOneAndUpdate(
      { employeeId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      res.status(404).json({ message: "Employee Not Found !!" });
    } else {
      res.status(200).json(updatedEmployee);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE - remove an employee by employeeId
const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const deletedEmployee = await employees.findOneAndDelete({ employeeId });

    if (!deletedEmployee) {
      res.status(404).json({ message: "Employee Not Found !!" });
    } else {
      res.status(200).json({ message: "Employee Deleted Successfully", deletedEmployee });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getEmployees, addEmployee, updateEmployee, deleteEmployee };