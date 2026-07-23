const employees = require("../models/employees");
const clients = require("../models/clients");
const services = require("../models/services");
const projects = require("../models/projects");
const blogs = require("../models/blogs");
const testimonials = require("../models/testimonials");
const contactRequests = require("../models/contactrequests");

// GET dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalEmployees,
      totalClients,
      totalServices,
      totalProjects,
      totalBlogs,
      totalTestimonials,
      totalContactRequests,
    ] = await Promise.all([
      employees.countDocuments(),
      clients.countDocuments(),
      services.countDocuments(),
      projects.countDocuments(),
      blogs.countDocuments(),
      testimonials.countDocuments(),
      contactRequests.countDocuments(),
    ]);

    res.status(200).json({
      employees: totalEmployees,
      clients: totalClients,
      services: totalServices,
      activeProjects: totalProjects,
      blogPosts: totalBlogs,
      testimonials: totalTestimonials,
      contactRequests: totalContactRequests,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET department distribution
const getDepartmentDistribution = async (req, res) => {
  try {
    const departmentData = await employees.aggregate([
      {
        $group: {
          _id: "$employeeDepartment",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the data for the frontend
    const formattedData = departmentData.map((item) => ({
      department: item._id,
      count: item.count,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getDashboardStats, getDepartmentDistribution };