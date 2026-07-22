const mongoose = require("mongoose");

const testimonialModel = new mongoose.Schema({
    testimonialName : {
        type : String,
        require : true
    },
    testimonialRole : {
        type : String,
        require : true
    },

    testimonialCompany:{
        type:String,
        default:""
    },

    testimonialProject:{
        type:String,
        default:""
    },

    testimonialQuote : {
        type : String,
        require : true,
    },
    testimonialRating : {
        type : String,
        require : true
    },
    testimonialStatus:{
        type:String,
        enum:["Published","Pending Review","Archived"],
        default:"Pending Review"
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("testimonials" , testimonialModel);