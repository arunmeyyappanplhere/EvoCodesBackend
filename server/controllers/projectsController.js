const projects = require("../models/projects");
const cloudinary = require("./../config/cloudinary");

const slugify = (name = "") =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "project";

const normalizeSectors = (value) => {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean);
    } catch {
      // not JSON, fall through
    }
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
};

// GET all projects
const getProjects = async (req, res) => {
  try {
    const projectsAvailable = await projects.find();
    if (projectsAvailable.length == 0) {
      res.status(400).json({ message: "No Projects Found !!" });
    } else {
      res.status(200).json(projectsAvailable);
    }
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST - add a new project
const addProject = async (req, res) => {
  try {
    const { projectName, projectDesc, projectSectors, projectSiteLink } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "A cover image (coverImg) is required." });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "evocodes_uploads/projects",
    });
    const projectCoverImg = result.secure_url;

    const projectID =
      req.body.projectID && req.body.projectID.trim()
        ? req.body.projectID.trim()
        : `${slugify(projectName)}-${Date.now().toString(36)}`;

    const newProject = new projects({
      projectID,
      projectName,
      projectCoverImg,
      projectDesc,
      projectSectors: normalizeSectors(projectSectors),
      projectSiteLink,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT - update an existing project by projectID
const editProject = async (req, res) => {
  try {
    const { projectID } = req.params;
    const updateData = { ...req.body };

    if (updateData.projectSectors !== undefined) {
      updateData.projectSectors = normalizeSectors(updateData.projectSectors);
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "evocodes_uploads/projects",
      });
      updateData.projectCoverImg = result.secure_url;
    } else {
      delete updateData.projectCoverImg;
    }

    const updatedProject = await projects.findOneAndUpdate(
      { projectID },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      res.status(404).json({ message: "Project Not Found !!" });
    } else {
      res.status(200).json(updatedProject);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE - remove a project by projectID
const deleteProject = async (req, res) => {
  try {
    const { projectID } = req.params;
    const deletedProject = await projects.findOneAndDelete({ projectID });

    if (!deletedProject) {
      res.status(404).json({ message: "Project Not Found !!" });
    } else {
      res.status(200).json({ message: "Project Deleted Successfully", deletedProject });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getProjects, addProject, editProject, deleteProject };