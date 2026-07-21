const mongoose = require("mongoose");

const employeeModel = new mongoose.Schema({
    employeeId : {
        type : String,
        require : true
    },
    employeeImage : {
        type : String,
        require : true
    },
    employeeName : {
        type : String,
        require : true
    },
    employeePosition : {
        type : String,
        require : true,
    },
    employeeDepartment : {
        type : String,
        require : true
    },
    employeeEmail : {
        type : Array,
        require : true
    },
    employeeStatus : {
        type : String,
        require : true
    },
});

module.exports = mongoose.model("employees" , employeeModel);