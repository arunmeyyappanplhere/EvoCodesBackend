const projects = require("../models/projects");

const addProject= (req,res)=>{
  try{
      const{  projectName ,    projectID ,     projectCoverImg ,
        projectDesc ,     projectSectors,        projectSiteLink ,
       } = req.body

      if( !projectName || !projectID || !projectCoverImg || !projectDesc || !projectSectors || !projectSiteLink ){
          return res.status(404).json({error: "both id and name are required"})
      }

      const newProject = new projects( {
        projectName ,    projectID ,     projectCoverImg ,
        projectDesc ,     projectSectors,        projectSiteLink ,
      })

      newProject.save()

      return res.status(201).json({
          message: "newProject added",
          data: newProject
      })
  }catch(error) {
        res.status(500).json({ error : "Internal Server Error"});
    }
}
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
const editProject= async (req,res)=>{
try{
  const projectId= req.params.projectID
  const { projectName, projectCoverImg, projectDesc, projectSectors, projectSiteLink } = req.body

  const projectMatch = await projects.findOne({ projectID : projectId })
  if( !projectMatch ){
        return res.status(404).json({error : "match not found"})
  }
  if( projectName !== undefined ){
        projectMatch.projectName = projectName
  }
  if( projectCoverImg !== undefined ){
        projectMatch.projectCoverImg = projectCoverImg
  }
  if( projectDesc !== undefined ){
        projectMatch.projectDesc = projectDesc
  }
  if( projectSectors !== undefined ){
        projectMatch.projectSectors = projectSectors
  }
  if( projectSiteLink !== undefined ){
        projectMatch.projectSiteLink = projectSiteLink
  }

  await projectMatch.save()

  return res.status(200).json({
    message: "updated successfully",
    data: projectMatch
  })
}catch(error) {
        res.status(500).json({ error : "Internal Server Error"});
    }

}

const deleteProject = async (req,res)=>{
      try{
      const projectId = req.params.projectID
      const deletedProject = await projects.findOneAndDelete({ projectID: projectId })

      if (!deletedProject) {
        return res.status(404).json({error : "project not found"})
      }

      res.json({
        message: "the project deleted successfully",
        data: deletedProject
      })
      }catch(error) {
        res.status(500).json({ error : "Internal Server Error"});
    }
  }


module.exports = {addProject,editProject,deleteProject ,getProjects};