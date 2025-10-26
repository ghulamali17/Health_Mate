const itemModel = require("../models/Vital");
const multer = require("multer");
const cloudinary = require("../utils/cloudinaryConfig");
const upload = require("../middlewares/multerMiddleware");
const connectDB = require("../connection");

// create item
const createItem = async (req, res) => {
  try {
    await connectDB();

    const item = await itemModel.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(item);
  } catch (err) {
    console.error("Item creation error:", err.message);
    res.status(500).json({ error: "Failed to create item" });
  }
};

// get items
const getItems = async (req, res) => {
  try {
    await connectDB();
    
    const items = await itemModel.find();
    res.json(items);
  } catch (err) {
    console.error("Get items error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// update
const updateItem = async (req, res) => {
  const { id } = req.params;
  const { title, price, description } = req.body;

  try {
    await connectDB();
    
    const updatedItem = await itemModel.findByIdAndUpdate(
      id,
      { title, price, description },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ error: "Failed to update item" });
  }
};

//get by id
const getItemsByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    await connectDB(); 
    
    const items = await itemModel.findById({ _id: id });
    
    if (!items) {
      return res.status(404).json({ error: "Item not found" });
    }
    
    res.json(items);
  } catch (err) {
    console.error("Get item by ID error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// current user
const getItemsByCurrentUser = async (req, res) => {
  try {
    await connectDB();

    //Find items by current user
    const items = await itemModel.find({ user: req.user._id });
    res.json(items);
  } catch (err) {
    console.error("Get current user items error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// delete
const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    await connectDB();

    const deletedItem = await itemModel.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    
    res.status(200).json({ message: "Item deleted successfully", deletedItem });
  } catch (err) {
    console.error("Delete item error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Search items by title or description
const searchItems = async (req, res) => {
  const { query } = req.query;
  try {
    await connectDB(); 
    
    const items = await itemModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(items);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to search items" });
  }
};

// upload cloudinary
const uploadFileWithCloudinary = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    cloudinary.uploader.upload(req.file.path, (err, result) => {
      if (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({
          success: false,
          message: "Upload failed",
          error: err.message,
        });
      }
      res.status(200).json({
        success: true,
        message: "Uploaded successfully",
        data: result,
      });
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: err.message,
    });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemsByUserId,
  updateItem,
  deleteItem,
  getItemsByCurrentUser,
  searchItems,
  uploadFileWithCloudinary,
};