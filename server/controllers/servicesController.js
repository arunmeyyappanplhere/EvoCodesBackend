const services = require("../models/services");
const cloudinary = require("./../config/cloudinary");

// Turn serviceTechStacks into a clean array no matter how it arrived
// (a real array, a JSON string, or a comma-separated string).
const normalizeTechStacks = (value) => {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean);
    } catch {
      // not JSON, fall through to comma-split
    }
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
};

const slugify = (name = "") =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "service";

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
      serviceName,
      serviceHead,
      serviceDescription,
      serviceColor,
      serviceTechStacks,
    } = req.body;

    // Icon is just a lucide-react icon name string by default (e.g. "Cloud").
    let serviceIcon = req.body.serviceIcon || "";

    // Optional legacy path: if an actual image file is uploaded, use that
    // Cloudinary URL as the icon instead of the text name.
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "evocodes_uploads/services",
      });
      serviceIcon = result.secure_url;
    }

    // Fall back to a generated ID if the client didn't send one.
    const serviceID =
      req.body.serviceID && req.body.serviceID.trim()
        ? req.body.serviceID.trim()
        : `${slugify(serviceName)}-${Date.now().toString(36)}`;

    const newService = new services({
      serviceID,
      serviceName,
      serviceHead,
      serviceDescription,
      serviceIcon,
      serviceColor,
      serviceTechStacks: normalizeTechStacks(serviceTechStacks),
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT - update an existing service by serviceID
const updateService = async (req, res) => {
  try {
    const { serviceID } = req.params;
    const updateData = { ...req.body };

    if (updateData.serviceTechStacks !== undefined) {
      updateData.serviceTechStacks = normalizeTechStacks(updateData.serviceTechStacks);
    }

    // Optional legacy path: replace the icon with an uploaded image if provided.
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "evocodes_uploads/services",
      });
      updateData.serviceIcon = result.secure_url;
    }

    const updatedService = await services.findOneAndUpdate(
      { serviceID },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      res.status(404).json({ message: "Service Not Found !!" });
    } else {
      res.status(200).json(updatedService);
    }
  } catch (error) {
    console.log(error);
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
      res
        .status(200)
        .json({ message: "Service Deleted Successfully", deletedService });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getServices, addService, updateService, deleteService };