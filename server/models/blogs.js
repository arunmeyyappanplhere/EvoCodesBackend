const mongoose = require("mongoose");

const blogModel = new mongoose.Schema({
    blogID : {
        type : String,
        required : true
    },
    blogTitle : {
        type : String,
        required : true
    },
    blogImg : {
        type : String,
        required : true,
    },
    blogAuthor : {
        type : String,
        required : true
    },
    blogCategory : {
        type : String,
        required : true
    },
    blogDate : {
        type : String,
        required : true
    },
    blogDescription : {
        type : String,
        required : true
    },
    blogContent : {
        type : String,
        required : true
    },
    blogStatus : {
        type : String,
        required : true
    },
});

module.exports = mongoose.model("blogs" , blogModel);