const mongoose = require("mongoose");

const contactRequestModel = new mongoose.Schema({
    contactRequestId :{
        type : String,
        require : true
    },
    contactRequestSenderName : {
        type : String,
        require : true
    },
    contactRequestEmail : {
        type : String,
        require : true
    },
    contactRequestSubject : {
        type : String,
        require : true,
    },
    contactRequestDesc : {
        type: String,
        require: true,
    },
    contactRequestDate : {
        type : String,
        require : true
    },
    contactRequestStatus : {
        type : Array,
        require : true
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("contactRequests" , contactRequestModel);