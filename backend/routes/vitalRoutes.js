const express = require("express");
const router = express.Router();
const {
  createItem,
  getItems,
  getItemsByUserId,
  updateItem,
  deleteItem,
  getItemsByCurrentUser,
  searchItems,
  getVitalsByFamilyMember
} = require("../controllers/vitalController");
const auth = require("../middlewares/authMiddleware");

router.post("/createitem", auth, createItem);
router.get("/items", getItems);
router.get("/useritems", auth, getItemsByCurrentUser);
router.get("/family-member/:familyMemberId/vitals", auth, getVitalsByFamilyMember);
router.get("/:id", getItemsByUserId);
router.put("/updateitem/:id", updateItem);
router.delete("/deleteitem/:id", auth, deleteItem);
router.get("/search/items", searchItems);

module.exports = router;