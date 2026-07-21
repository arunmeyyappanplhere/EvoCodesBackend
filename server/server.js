const express = require("express");
const dotenv = require("dotenv");
const route = require("./routes/routes");
const connectDB = require("./config/db");
const projects = require("./models/projects");

const app = express();
app.use(express.json());

dotenv.config();

const connectToDB = async () => {
  try {
    await connectDB().then(
      app.listen(process.env.PORT, () => {
        console.log(`Server is running at http:/localhost:${process.env.PORT}`);
      }),
    );
  } catch (err) {
    console.log("Error in starting sever : " + err);
  }
};

connectToDB();

app.use("/api", route);

app.post("/api/projects",(req,res)=>{
  
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
})

app.put("/api/projects/:id",(req,res)=>{

  const projectId= req.params.id
  const { name, coverImg, desc, sectors, siteLinks } = req.body

  const projectMatch = projects.find(p => p.id === projectId )

  if( !projectMatch ){
        return res.status(404).json({error : "match not found"})
  }

  if( name !== undefined ){
        projects.name = name
  }
  if( coverImg !== undefined ){
        projects.coverImg = coverImg
  }
  if( desc !== undefined ){
        projects.desc = desc
  }
  if( sectors !== undefined ){
        projects.sectors = sectors
  }
  if( siteLinks !== undefined ){
        projects.siteLinks = siteLinks
  }
 
  return res.status(201).json({
    message: "updated successfully",
    data: projects
  })

  app.delete("/api/projects/:id",(req,res)=>{
      const projectId = req.params.id
      const projectMatchIndex = projects.findIndex( p => p.id === projectsId )

      if (projectMatchIndex === -1 ){
        return res.json({error : "project not found"})
      }
      
      const [ remainingProjects ] = projects.splice(index, 1)


      res.json({
        message: "the project deleted successfully",
        data: remainingProjects
      })

  })



})