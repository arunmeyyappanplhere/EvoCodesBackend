const employees = require("../models/employees");

const employeesController = async(req,res) =>{
    try{
       const employeeAvailable = await employees.find();
       if (employeeAvailable.length == 0){
        res.status(400).json({ message : "No employee Found !!"});
       }
       else{
        res.status(200).json(employeeAvailable);
       }
    } catch {
        res.status(500).json({ error : "Internal Server Error"});
    }
};

module.exports = employeesController;