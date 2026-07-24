const contactRequests = require("../models/contactrequests");

const slugify = (name = "") =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "request";

// POST - add a new contact request (typically submitted by the public contact form)
const addContactRequest = async (req, res) => {
  try {
    const {
      contactRequestSenderName,
      contactRequestEmail,
      contactRequestSubject,
      contactRequestDesc,
    } = req.body;

    const contactRequestId =
      req.body.contactRequestId && req.body.contactRequestId.trim()
        ? req.body.contactRequestId.trim()
        : `${slugify(contactRequestSenderName)}-${Date.now().toString(36)}`;

    const newRequest = new contactRequests({
      contactRequestId,
      contactRequestSenderName,
      contactRequestEmail,
      contactRequestSubject,
      contactRequestDesc,
      contactRequestDate: req.body.contactRequestDate || new Date().toISOString(),
      contactRequestStatus: req.body.contactRequestStatus || "NEW",
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT - update a contact request (used for marking as Read/Replied/Archived, or full edits)
const updateContactRequest = async (req, res) => {
  try {
    const { contactRequestId } = req.params;

    const updatedRequest = await contactRequests.findOneAndUpdate(
      { contactRequestId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      res.status(404).json({ message: "Contact Request Not Found !!" });
    } else {
      res.status(200).json(updatedRequest);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE - remove a contact request
const deleteContactRequest = async (req, res) => {
  try {
    const { contactRequestId } = req.params;
    const deletedRequest = await contactRequests.findOneAndDelete({ contactRequestId });

    if (!deletedRequest) {
      res.status(404).json({ message: "Contact Request Not Found !!" });
    } else {
      res.status(200).json({ message: "Contact Request Deleted Successfully", deletedRequest });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addContactRequest, updateContactRequest, deleteContactRequest };