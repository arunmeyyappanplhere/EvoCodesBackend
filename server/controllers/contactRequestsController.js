const contactrequests = require("../models/contactrequests");

const contactRequestController = async(req,res) =>{
    try{
       const contactRequestAvailable = await contactrequests.find();
       if (contactRequestAvailable.length == 0){
        res.status(400).json({ message : "No contactRequest Found !!"});
       }
       else{
        res.status(200).json(contactRequestAvailable);
       }
    } catch {
        res.status(500).json({ error : "Internal Server Error"});
    }
};

module.exports = contactRequestController;