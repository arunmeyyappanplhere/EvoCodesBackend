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

const addContactRequest = async (req, res) => {
  try {
    const {
      contactRequestId,
      contactRequestSenderName,
      contactRequestEmail,
      contactRequestSubject,
      contactRequestDesc,
      contactRequestDate,
      contactRequestStatus,
    } = req.body;

    if (
      !contactRequestId ||
      !contactRequestSenderName ||
      !contactRequestEmail ||
      !contactRequestSubject ||
      !contactRequestDesc ||
      !contactRequestDate
    ) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const newContactRequest = await contactrequests.create({
      contactRequestId,
      contactRequestSenderName,
      contactRequestEmail,
      contactRequestSubject,
      contactRequestDesc,
      contactRequestDate,
      contactRequestStatus: contactRequestStatus || ["Pending"],
    });

    return res.status(201).json({
      message: "Contact request created successfully",
      data: newContactRequest,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const updateContactRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRequest = await contactrequests.findOneAndUpdate(
      { contactRequestId: id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Contact request not found" });
    }

    return res.status(200).json({
      message: "Contact request updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteContactRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRequest = await contactrequests.findOneAndDelete({
      contactRequestId: id,
    });

    if (!deletedRequest) {
      return res.status(404).json({ error: "Contact request not found" });
    }

    return res.status(200).json({
      message: "Contact request deleted successfully",
      data: deletedRequest,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {contactRequestController,addContactRequest,updateContactRequest,deleteContactRequest};