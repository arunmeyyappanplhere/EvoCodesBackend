const projects = require("../models/projects");

const addProject= (req,res)=>{
  
      const{ id,name,coverImg,desc,sectors,siteLinks } = req.body

      if( !name || !id || !desc || !sectors || !coverImg || !siteLinks ){
          return res.status(404).json({error: "both id and name are required"})
      }

      const newProject = {
        name,
        id,
        coverImg,
        desc,
        sectors,
        siteLinks,
      }

      projects.push(newProject)

      return res.status(201).json({
          message: "newProject added",
          data: newProject
      })
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
    } catch {
        res.status(500).json({ error : "Internal Server Error"});
    }
};
const editProject= (req,res)=>{

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

}

const deleteProject = (req,res)=>{
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

  }


module.exports = {addProject,editProject,deleteProject ,getProjects};