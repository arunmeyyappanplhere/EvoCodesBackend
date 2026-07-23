const express = require("express");
const upload = require("../config/upload.js")
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
const { registerAdmin, loginAdmin, getMe, logoutAdmin } = require("../controllers/authController");
const authMiddleware = require("../controllers/authMiddleware");
const uploadController = require("../controllers/uploadController");
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
const { getDashboardStats, getDepartmentDistribution } = require('../controllers/dashboardController')
const { getGrowthTrend, getServicesByStatus, getClientsByIndustry, getTopClientsByProjects } = require('../controllers/analyticsController')
const route = express.Router(); 

route.get("/", landingController);

// Auth
route.post("/register", upload.single("image"), registerAdmin);
route.post("/login", loginAdmin);
route.post("/logout", logoutAdmin);
route.get("/me", authMiddleware, getMe); // frontend calls this on load to restore the session from the cookie

// Services (GET is public for the website, writes are admin-only)
route.get("/services", getServices);
route.post("/services", authMiddleware, addService);
route.put("/services/:serviceID", authMiddleware, updateService);
route.delete("/services/:serviceID", authMiddleware, deleteService);

route.get("/projects", getProjects);
route.get("/testimonials", getTestimonials);
route.get("/blogs", blogController);
                      
// Employees (GET is public, writes are admin-only)
route.get("/employees", getEmployees);
route.post("/employees", authMiddleware, upload.single("employeeImage"), addEmployee);
route.put("/employees/:employeeId", authMiddleware, upload.single("employeeImage"), updateEmployee);
route.delete("/employees/:employeeId", authMiddleware, deleteEmployee);

// Clients (GET is public, writes are admin-only)
route.get("/clients", getClients);
route.post("/clients", authMiddleware, addClient);
route.put("/clients/:clientID", authMiddleware, updateClient);
route.delete("/clients/:clientID", authMiddleware, deleteClient);
                                             
// Testimonials (GET is public, writes + stats are admin-only)
route.get("/testimonials", getTestimonials);
route.post("/testimonials", authMiddleware, addTestimonial);
route.put("/testimonials/:testimonialId", authMiddleware, updateTestimonial);
route.delete("/testimonials/:testimonialId", authMiddleware, deleteTestimonial);
route.get("/testimonials/stats", authMiddleware, getTestimonialStats);

// Admins (protected — requires a valid session cookie from /login)
route.get("/admins", authMiddleware, getAdmins);
route.post("/admins", authMiddleware, upload.single("image"), addAdmin);
route.put("/admins/:adminId", authMiddleware, upload.single("image"), updateAdmin);
route.delete("/admins/:adminId", authMiddleware, deleteAdmin);
route.get("/admins/stats", authMiddleware, getAdminStats);

// projects (GET is public, writes are admin-only)
route.post("/projects", authMiddleware, upload.single("coverImg"), addProject)
route.put("/projects/:projectID", authMiddleware, upload.single("coverImg"), editProject)
route.delete("/projects/:projectID", authMiddleware, deleteProject)

//contactsForEvoCodes
route.get("/contact",getContact)

//contact for evo codes admin

route.post('/contact', authMiddleware, addContactRequest)
route.put('/contact/:contactRequestId', authMiddleware, updateContactRequest)
route.delete('/contact/:contactRequestId', authMiddleware, deleteContactRequest)

route.post("/upload", authMiddleware, upload.single("image"), uploadController);


// Dashboard routes
route.get("/dashboard/stats", getDashboardStats);
route.get("/dashboard/departments", getDepartmentDistribution);

// Analytics routes
route.get("/analytics/growth-trend", getGrowthTrend);
route.get("/analytics/services-status", getServicesByStatus);
route.get("/analytics/clients-industry", getClientsByIndustry);
route.get("/analytics/top-clients", getTopClientsByProjects);

module.exports = route;
