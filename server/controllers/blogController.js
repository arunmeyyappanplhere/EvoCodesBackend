const blogs = require("../models/blogs");

const blogsController = async(req,res) =>{
    try{
       const blogsAvailable = await blogs.find();
       if (blogsAvailable.length == 0){
        res.status(400).json({ message : "No Blogs Found !!"});
       }
       else{
        res.status(200).json(blogsAvailable);
       }
    } catch {
        res.status(500).json({ error : "Internal Server Error"});
    }
};

module.exports = blogsController;