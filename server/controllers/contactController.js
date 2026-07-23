const contactrequests = require("../models/contactrequests");

const getContact = async (req,res) =>{
    try{
        const {name,email,sub,desc} = req.body

        if(!name|| !email|| !sub|| !desc){
                return res.status(404).json({error: "details not found"})
        }

        const newContact = await contactRequests.create({
        contactRequestSenderName  :  email,
         contactRequestEmail :  name,
         contactRequestSubject :  sub,
         contactRequestDesc :  desc
        })

        return res.status(201).json({
      message: "Contact form submitted successfully",
      data: newContact,
    });
    
    }catch(e){
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
}

module.exports = getContact ;
