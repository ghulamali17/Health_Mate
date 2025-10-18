const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  image: String,
  //  image: String, MULTER
  //TO associate items with a user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const itemModel = mongoose.model("items", itemSchema);

module.exports = itemModel;
