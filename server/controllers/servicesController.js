const services = require("../models/services");

// GET all services
const getServices = async (req, res) => {
  try {
    const servicesAvailable = await services.find();
    if (servicesAvailable.length == 0) {
      res.status(400).json({ message: "No Services Found !!" });
    } else {
      res.status(200).json(servicesAvailable);
    }
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST - add a new service
const addService = async (req, res) => {
  try {
    const {
      serviceID,
      serviceName,
      serviceHead,
      serviceDescription,
      serviceIcon,
      serviceTechStacks,
    } = req.body;

    const newService = new services({
      serviceID,
      serviceName,
      serviceHead,
      serviceDescription,
      serviceIcon,
      serviceTechStacks,
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT - update an existing service by serviceID
const updateService = async (req, res) => {
  try {
    const { serviceID } = req.params;
    const updatedService = await services.findOneAndUpdate(
      { serviceID },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      res.status(404).json({ message: "Service Not Found !!" });
    } else {
      res.status(200).json(updatedService);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE - remove a service by serviceID
const deleteService = async (req, res) => {
  try {
    const { serviceID } = req.params;
    const deletedService = await services.findOneAndDelete({ serviceID });

    if (!deletedService) {
      res.status(404).json({ message: "Service Not Found !!" });
    } else {
      res.status(200).json({ message: "Service Deleted Successfully", deletedService });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getServices, addService, updateService, deleteService };
