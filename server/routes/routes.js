const express = require("express");
const contactController = require("../controllers/contactController");
const landingController = require("../controllers/landingController");
const {
  getServices,
  addService,
  updateService,
  deleteService,
} = require("../controllers/servicesController");
const projectsController = require("../controllers/projectsController");
const testimonialsController = require("../controllers/testimonialsController");
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

const route = express.Router();

route.post("/contact", contactController);
route.get("/", landingController);

// Services
route.get("/services", getServices);
route.post("/services", addService);
route.put("/services/:serviceID", updateService);
route.delete("/services/:serviceID", deleteService);

route.get("/projects", projectsController);
route.get("/testimonoals", testimonialsController);
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

module.exports = route;