const express = require('express');
const router = express.Router();
const {
  createFamilyMember,
  getFamilyMembers,
  getFamilyMemberById,
  updateFamilyMember,
  deleteFamilyMember
} = require('../controllers/familyMemberController');
const auth = require("../middlewares/authMiddleware");

router.post('/', auth, createFamilyMember);
router.get('/', auth, getFamilyMembers);
router.get('/:id', auth, getFamilyMemberById);
router.put('/:id', auth, updateFamilyMember);
router.delete('/:id', auth, deleteFamilyMember);

module.exports = router;