const express = require("express");
const contactController = require("../controllers/contactController");
const landingController = require("../controllers/landingController");
const {
  getServices,
  addService,
  updateService,
  deleteService,
} = require("../controllers/servicesController");
const {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialStats,
} = require("../controllers/testimonialsController");
const blogController = require("../controllers/blogController");
const {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeesController");
const {
  getClients,
  addClient,
  updateClient,
  deleteClient,
} = require("../controllers/clientsController");
const { registerAdmin, loginAdmin } = require("../controllers/authController");
const {
  getAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminStats,
} = require("../controllers/adminController");

const getContact = require ("../controllers/contactController")
const {addProject,editProject,deleteProject,getProjects}= require('../controllers/projectsController')
const {addContactRequest,updateContactRequest,deleteContactRequest}= require('../controllers/contactRequestsController')
const route = express.Router(); 

route.post("/contact", contactController);
route.get("/", landingController);

// Auth
route.post("/register", registerAdmin);
route.post("/login", loginAdmin);

// Services
route.get("/services", getServices);
route.post("/services", addService);
route.put("/services/:serviceID", updateService);
route.delete("/services/:serviceID", deleteService);

route.get("/projects", getProjects);
route.get("/testimonials", getTestimonials);
route.get("/blogs", blogController);
                      
// Employees
route.get("/employees", getEmployees);
route.post("/employees", addEmployee);
route.put("/employees/:employeeId", updateEmployee);
route.delete("/employees/:employeeId", deleteEmployee);

// Clients
route.get("/clients", getClients);
route.post("/clients", addClient);
route.put("/clients/:clientID", updateClient);
route.delete("/clients/:clientID", deleteClient);
                                             
// Testimonials
route.get("/testimonials", getTestimonials);
route.post("/testimonials", addTestimonial);
route.put("/testimonials/:testimonialId", updateTestimonial);
route.delete("/testimonials/:testimonialId", deleteTestimonial);
route.get("/testimonials/stats", getTestimonialStats);

// Admins
route.get("/admins", getAdmins);
route.post("/admins", addAdmin);
route.put("/admins/:adminId", updateAdmin);
route.delete("/admins/:adminId", deleteAdmin);
route.get("/admins/stats", getAdminStats);

// projects
route.post("/projects",addProject)
route.put("/projects/:id",editProject)
route.delete("/projects/:id",deleteProject)

//contactsForEvoCodes
route.get("/contact",getContact)

//contact for evo codes admin

route.post('/contact',addContactRequest)
route.put('/contact',updateContactRequest)
route.delete('/contact',deleteContactRequest)
module.exports = route;