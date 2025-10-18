const itemModel = require("../models/Item");
const multer = require("multer");
const cloudinary = require("../utils/cloudinaryConfig");
const upload = require("../middlewares/multerMiddleware");

// create item
const createItem = async (req, res) => {
  try {
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
    const items = await itemModel.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update
const updateItem = async (req, res) => {
  const { id } = req.params;
  const { title, price, description } = req.body;

  try {
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
    const items = await itemModel.findById({ _id: id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// current user
const getItemsByCurrentUser = async (req, res) => {
  try {
    //Find items where item.user matches logged-in user
    const items = await itemModel.find({ user: req.user._id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete
const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await itemModel.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully", deletedItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search items by title or description
const searchItems = async (req, res) => {
  const { query } = req.query;
  try {
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

// upload api multer

// const storage=multer.diskStorage({
//   destination: function(req,file,cb){
//     return cb(null, "./public/images")
//   },
//   filename: function(req,file,cb){
//     return cb(null,`${Date.now()}_${file.originalname}`)
//   }
// })

// const upload=multer({storage})

// const uploadFile = async (req, res) => {
//   try {
//     res.status(200).json({
//       message: "File uploaded successfully",
//       filename: req.file.filename,
//       path: `/images/${req.file.filename}`,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Upload failed" });
//   }
// };

// upload cloudinary_js_config
const uploadFileWithCloudinary = async (req, res) => {
  cloudinary.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error",
      });
    }
    res.status(200).json({
      success: true,
      message: "Uploaded",
      data: result,
    });
  });
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
