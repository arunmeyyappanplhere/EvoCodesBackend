const projects = require("../models/projects");

const addProject= (req,res)=>{
  try{
      const{ id,name,coverImg,desc,sectors,siteLinks } = req.body

      if( !name || !id || !desc || !sectors || !coverImg || !siteLinks ){
          return res.status(404).json({error: "both id and name are required"})
      }

      const newProject = new projects( {
        projectName : name,
        projectID : id  , 
        projectCoverImg : coverImg ,
        projectDesc : desc ,
        projectSectors : sectors ,
        projectSiteLink : siteLinks,
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
const editProject= (req,res)=>{
try{
  const projectId= req.params.id
  const { name, coverImg, desc, sectors, siteLinks } = req.body

  const projectMatch = projects.find(p => p.id === projectId )

  if( !projectMatch ){
        return res.status(404).json({error : "match not found"})
  }
  if( name !== undefined ){
        projectMatch.name = name
  }
  if( coverImg !== undefined ){
        projectMatch.coverImg = coverImg
  }
  if( desc !== undefined ){
        projectMatch.desc = desc
  }
  if( sectors !== undefined ){
        projectMatch.sectors = sectors
  }
  if( siteLinks !== undefined ){
        projectMatch.siteLinks = siteLinks
  }

  return res.status(201).json({
    message: "updated successfully",
    data: projectMatch
  })
}catch(error) {
        res.status(500).json({ error : "Internal Server Error"});
    }

}

const deleteProject = (req,res)=>{
      try{
      const projectId = req.params.id
      const projectMatchIndex = projects.findIndex( p => p.id === projectId )

      if (projectMatchIndex === -1 ){
        return res.json({error : "project not found"})
      }
      
      const [ deletedProjects ] = projects.splice(projectMatchIndex, 1)


      res.json({
        message: "the project deleted successfully",
        data: deletedProjects
      })
      }catch(error) {
        res.status(500).json({ error : "Internal Server Error"});
    }
  }


module.exports = {addProject,editProject,deleteProject ,getProjects};