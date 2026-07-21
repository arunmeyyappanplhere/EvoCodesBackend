const clients = require("../models/clients");

// GET all clients
const getClients = async (req, res) => {
  try {
    const clientsAvailable = await clients.find();
    if (clientsAvailable.length == 0) {
      res.status(400).json({ message: "No Clients Found !!" });
    } else {
      res.status(200).json(clientsAvailable);
    }
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST - add a new client
const addClient = async (req, res) => {
  try {
    const {
      clientID,
      companyName,
      companyDomain,
      primaryContactName,
      primaryContactEmail,
      industry,
      activeProjects,
      clientStatus,
    } = req.body;

    const newClient = new clients({
      clientID,
      companyName,
      companyDomain,
      primaryContactName,
      primaryContactEmail,
      industry,
      activeProjects,
      clientStatus,
    });

    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT - update an existing client by clientID
const updateClient = async (req, res) => {
  try {
    const { clientID } = req.params;
    const updatedClient = await clients.findOneAndUpdate(
      { clientID },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      res.status(404).json({ message: "Client Not Found !!" });
    } else {
      res.status(200).json(updatedClient);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE - remove a client by clientID
const deleteClient = async (req, res) => {
  try {
    const { clientID } = req.params;
    const deletedClient = await clients.findOneAndDelete({ clientID });

    if (!deletedClient) {
      res.status(404).json({ message: "Client Not Found !!" });
    } else {
      res.status(200).json({ message: "Client Deleted Successfully", deletedClient });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getClients, addClient, updateClient, deleteClient };
