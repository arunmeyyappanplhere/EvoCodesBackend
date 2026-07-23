const clients = require("../models/clients");
const employees = require("../models/employees");
const services = require("../models/services");

// GET growth trend data (clients and employees over time)
const getGrowthTrend = async (req, res) => {
  try {
    // Get the last 6 months of data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get clients created in the last 6 months, grouped by month
    const clientsByMonth = await clients.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Get employees created in the last 6 months, grouped by month
    const employeesByMonth = await employees.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Format the data
    const months = [];
    const clientsData = [];
    const employeesData = [];

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString("default", { month: "short" });
      months.push(monthName);
    }

    // Map the aggregated data to months
    const clientMap = new Map(
      clientsByMonth.map((item) => [`${item._id.year}-${item._id.month}`, item.count])
    );
    const employeeMap = new Map(
      employeesByMonth.map((item) => [`${item._id.year}-${item._id.month}`, item.count])
    );

    // Fill in the data for each month
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      clientsData.push(clientMap.get(key) || 0);
      employeesData.push(employeeMap.get(key) || 0);
    }

    res.status(200).json({
      months,
      clients: clientsData,
      employees: employeesData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET services by status
const getServicesByStatus = async (req, res) => {
  try {
    // Assuming serviceStatus field exists, if not we'll use a default
    // For now, let's count all services and categorize them
    const totalServices = await services.countDocuments();
    
    // If you have a status field, use this:
    // const statusData = await services.aggregate([
    //   {
    //     $group: {
    //       _id: "$serviceStatus",
    //       count: { $sum: 1 },
    //     },
    //   },
    // ]);

    // For demo purposes, we'll create a mock distribution
    // In production, replace this with actual status field aggregation
    const statusData = [
      { _id: "Active", count: Math.floor(totalServices * 0.5) },
      { _id: "Maintenance", count: Math.floor(totalServices * 0.3) },
      { _id: "Disabled", count: totalServices - Math.floor(totalServices * 0.5) - Math.floor(totalServices * 0.3) },
    ];

    const formattedData = statusData.map((item) => ({
      status: item._id,
      count: item.count,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET clients by industry
const getClientsByIndustry = async (req, res) => {
  try {
    const industryData = await clients.aggregate([
      {
        $group: {
          _id: "$industry",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const formattedData = industryData.map((item) => ({
      industry: item._id,
      count: item.count,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET top clients by active projects
const getTopClientsByProjects = async (req, res) => {
  try {
    const topClients = await clients
      .find()
      .sort({ activeProjects: -1 })
      .limit(10)
      .select("companyName industry activeProjects");

    const formattedData = topClients.map((client) => ({
      company: client.companyName,
      industry: client.industry,
      activeProjects: client.activeProjects,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getGrowthTrend,
  getServicesByStatus,
  getClientsByIndustry,
  getTopClientsByProjects,
};