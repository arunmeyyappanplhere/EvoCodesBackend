const blogs = require("../models/blogs");
const cloudinary = require("./../config/cloudinary");

const slugify = (name = "") =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "blog";

// GET all blogs
const getBlogs = async (req, res) => {
  try {
    const blogsAvailable = await blogs.find();
    if (blogsAvailable.length == 0) {
      res.status(400).json({ message: "No Blogs Found !!" });
    } else {
      res.status(200).json(blogsAvailable);
    }
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST - add a new blog
const addBlog = async (req, res) => {
  try {
    const {
      blogTitle,
      blogAuthor,
      blogCategory,
      blogDate,
      blogDescription,
      blogContent,
      blogStatus,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "A featured image (blogImage) is required." });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "evocodes_uploads/blogs",
    });
    const blogImg = result.secure_url;

    const blogID =
      req.body.blogID && req.body.blogID.trim()
        ? req.body.blogID.trim()
        : `${slugify(blogTitle)}-${Date.now().toString(36)}`;

    const newBlog = new blogs({
      blogID,
      blogTitle,
      blogImg,
      blogAuthor,
      blogCategory,
      blogDate,
      blogDescription,
      blogContent,
      blogStatus,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT - update an existing blog by blogID
const updateBlog = async (req, res) => {
  try {
    const { blogID } = req.params;
    const updateData = { ...req.body };

    // Only touch blogImg (and re-upload to Cloudinary) if a new file was sent —
    // otherwise leave the existing Cloudinary URL untouched.
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "evocodes_uploads/blogs",
      });
      updateData.blogImg = result.secure_url;
    } else {
      delete updateData.blogImg;
    }

    const updatedBlog = await blogs.findOneAndUpdate(
      { blogID },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      res.status(404).json({ message: "Blog Not Found !!" });
    } else {
      res.status(200).json(updatedBlog);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE - remove a blog by blogID
const deleteBlog = async (req, res) => {
  try {
    const { blogID } = req.params;
    const deletedBlog = await blogs.findOneAndDelete({ blogID });

    if (!deletedBlog) {
      res.status(404).json({ message: "Blog Not Found !!" });
    } else {
      res.status(200).json({ message: "Blog Deleted Successfully", deletedBlog });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getBlogs, addBlog, updateBlog, deleteBlog };