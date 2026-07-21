const mongoose = require("mongoose");

const clientModel = new mongoose.Schema({
  clientID: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyDomain: {
    type: String,
    required: true,
  },
  primaryContactName: {
    type: String,
    required: true,
  },
  primaryContactEmail: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  activeProjects: {
    type: Number,
    required: true,
    default: 0,
  },
  clientStatus: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("clients", clientModel);
