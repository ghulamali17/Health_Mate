const express = require("express");
const {
  createItem,
  getItems,
  getItemsByUserId,
  updateItem,
  deleteItem,
  getItemsByCurrentUser,
  searchItems,
  uploadFileWithCloudinary,
} = require("../controllers/itemController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload=require("../middlewares/multerMiddleware")
const itemRouter = express.Router();

// create item
itemRouter.post("/createitem", authMiddleware, createItem);
itemRouter.get("/useritems", authMiddleware, getItemsByCurrentUser);

// get all items
itemRouter.get("/getitems", getItems);

// get items by user ID
itemRouter.get("/getitems/:id", getItemsByUserId);

// update item by ID
itemRouter.put("/updateitem/:id", updateItem);

// delete
itemRouter.delete("/deleteItem/:id", deleteItem);

// search by title and description
itemRouter.get("/search", searchItems);

// upload file
itemRouter.post("/upload", upload.single("image"), uploadFileWithCloudinary);

module.exports = itemRouter;
