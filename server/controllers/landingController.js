const services = require("../models/services");
const projects = require("../models/projects");
const testimonials = require("../models/testimonials");
const employees = require("../models/employees");

const landingController = async (req, res) => {
  try {
    const latestServices = await services.find().sort({ createdAt: -1 }).limit(3);
    const allProject = await projects.find();
    const allTestimonials = await testimonials.find().sort({createdAt: -1}).limit(3);
    const allEmployees = await employees.find();
    
    res.status(200).json({
      services: latestServices,
      projects: allProject,
      testimonials: allTestimonials,
      employees: allEmployees
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports = landingController;
