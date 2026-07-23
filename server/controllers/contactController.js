const contactrequests = require("../models/contactrequests");

const addContact = async (req, res) => {
    try {

        const {
            contactRequestId,
            contactRequestSenderName,
            contactRequestEmail,
            contactRequestSubject,
            contactRequestDesc,
            contactRequestDate,
            contactRequestStatus
        } = req.body;

        if (
            !contactRequestSenderName ||
            !contactRequestEmail ||
            !contactRequestSubject ||
            !contactRequestDesc
        ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        const newContact = await contactrequests.create({
            contactRequestId,
            contactRequestSenderName,
            contactRequestEmail,
            contactRequestSubject,
            contactRequestDesc,
            contactRequestDate,
            contactRequestStatus
        });

        return res.status(201).json({
            message: "Contact created successfully",
            data: newContact
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

module.exports = addContact;