const mongoose = require("mongoose");

const contactRequestModel = new mongoose.Schema({
    contactRequestId :{
        type : String,
        required : true
    },
    contactRequestSenderName : {
        type : String,
        required : true
    },
    contactRequestEmail : {
        type : String,
        required : true
    },
    contactRequestSubject : {
        type : String,
        required : true,
    },
    contactRequestDesc : {
        type: String,
        required: true,
    },
    contactRequestDate : {
        type : String,
        required : true
    },
    contactRequestStatus : {
        type : String,
        enum : ["NEW", "REPLIED", "ARCHIVED"],
        default : "NEW"
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("contactRequests" , contactRequestModel);