const mongoose = require("mongoose");

const blogModel = new mongoose.Schema({
    blogID : {
        type : String,
        require : true
    },
    blogTitle : {
        type : String,
        require : true
    },
    blogImg : {
        type : String,
        require : true,
    },
    blogAuthor : {
        type : String,
        require : true
    },
    blogCategory : {
        type : String,
        require : true
    },
    blogDate : {
        type : String,
        require : true
    },
    blogDescription : {
        type : String,
        require : true
    },
    blogContent : {
        type : String,
        require : true
    },
    blogStatus : {
        type : String,
        require : true
    },
});

module.exports = mongoose.model("blogs" , blogModel);