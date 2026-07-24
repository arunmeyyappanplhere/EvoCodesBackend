const Testimonials = require("../models/testimonials");

// Get All Testimonials
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonials.find().sort({ createdAt: -1 });
    if (testimonials.length === 0) {
      return res.status(404).json({ message: "No Testimonials Found" });
    }
    res.status(200).json(testimonials);

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add Testimonial
const addTestimonial = async (req, res) => {
  try {
    const {
      testimonialName,
      testimonialRole,
      testimonialCompany,
      testimonialProject,
      testimonialQuote,
      testimonialRating,
      testimonialStatus,
    } = req.body;

    const newTestimonial = new Testimonials({
      testimonialName,
      testimonialRole,
      testimonialCompany,
      testimonialProject,
      testimonialQuote,
      testimonialRating,
      testimonialStatus,
    });
    await newTestimonial.save();
    res.status(201).json(newTestimonial);

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Testimonial
const updateTestimonial = async (req, res) => {
  try {
    const {
      testimonialName,
      testimonialRole,
      testimonialCompany,
      testimonialProject,
      testimonialQuote,
      testimonialRating,
      testimonialStatus,
    } = req.body;

    const updatedTestimonial = await Testimonials.findByIdAndUpdate(
      req.params.testimonialId,
      {
        testimonialName,
        testimonialRole,
        testimonialCompany,
        testimonialProject,
        testimonialQuote,
        testimonialRating,
        testimonialStatus,
      },
      { new: true, runValidators: true }
    );
    if (!updatedTestimonial) {
      return res.status(404).json({ message: "Testimonial Not Found" });
    }
    res.status(200).json(updatedTestimonial);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete Testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const deletedTestimonial = await Testimonials.findByIdAndDelete(
      req.params.testimonialId
    );
    if (!deletedTestimonial) {
      return res.status(404).json({ message: "Testimonial Not Found" });
    }
    res.status(200).json({ message: "Testimonial Deleted Successfully" });

  }catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Dashboard Stats
const getTestimonialStats = async (req, res) => {
  try {
    const total = await Testimonials.countDocuments();
    const published = await Testimonials.countDocuments({
      testimonialStatus: "Published",
    });
    const pending = await Testimonials.countDocuments({
      testimonialStatus: "Pending Review",
    });
    const ratings = await Testimonials.find({}, { testimonialRating: 1 });
    let averageRating = 0;
    if (ratings.length > 0) {
      const totalRating = ratings.reduce(
        (sum, item) => sum + Number(item.testimonialRating || 0),
        0
      );
      averageRating = Number((totalRating / ratings.length).toFixed(1));
    }
    res.status(200).json({
      total,
      published,
      pending,
      averageRating,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialStats,
};