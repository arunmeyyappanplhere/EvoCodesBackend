const projects = require("../models/projects");
const cloudinary = require("./../config/cloudinary");

const addProject = async (req, res) => {
  try {
    const { id, name, desc, sectors, siteLinks } = req.body;

    if (!name || !id || !desc || !sectors || !siteLinks) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let projectCoverImg = "";

    // Upload cover image to Cloudinary if file is provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "evocodes_uploads/projects",
      });
      projectCoverImg = result.secure_url;
    }

    const newProject = new projects({
      projectName: name,
      projectID: id,
      projectCoverImg: projectCoverImg,
      projectDesc: desc,
      projectSectors: sectors,
      projectSiteLink: siteLinks,
    });

    await newProject.save();

    return res.status(201).json({
      message: "Project added successfully",
      data: newProject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getProjects = async(req,res) =>{
    try{
       const projectsAvailable = await projects.find();
       if (projectsAvailable.length == 0){
        res.status(400).json({ message : "No Projects Found !!"});
       }
       else{
        res.status(200).json(projectsAvailable);
       }
    } catch(error) {
        res.status(500).json({ error : "Internal Server Error"});
    }
};
const editProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, desc, sectors, siteLinks } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.projectName = name;
    if (desc !== undefined) updateData.projectDesc = desc;
    if (sectors !== undefined) updateData.projectSectors = sectors;
    if (siteLinks !== undefined) updateData.projectSiteLink = siteLinks;

    // Upload new cover image to Cloudinary if file is provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "evocodes_uploads/projects",
      });
      updateData.projectCoverImg = result.secure_url;
    }

    const updatedProject = await projects.findByIdAndUpdate(
      projectId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const deletedProject = await projects.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({
      message: "Project deleted successfully",
      data: deletedProject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {addProject,editProject,deleteProject ,getProjects};