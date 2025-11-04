const FamilyMember = require('../models/FamilyMember');
const connectDB = require('../connection');

// Create family member
const createFamilyMember = async (req, res) => {
  try {
    await connectDB();

    const {
      name,
      relationship,
      phone,
      email,
      dateOfBirth,
      gender,
      bloodGroup,
      allergies,
      medicalConditions
    } = req.body;

    const familyMember = await FamilyMember.create({
      userId: req.user._id,
      name,
      relationship,
      phone,
      email,
      dateOfBirth,
      gender,
      bloodGroup,
      allergies,
      medicalConditions
    });

    res.status(201).json({
      success: true,
      message: 'Family member created successfully',
      data: familyMember
    });
  } catch (error) {
    console.error('Create family member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create family member',
      error: error.message
    });
  }
};

// Get all family members for current user
const getFamilyMembers = async (req, res) => {
  try {
    await connectDB();

    const familyMembers = await FamilyMember.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: familyMembers
    });
  } catch (error) {
    console.error('Get family members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch family members',
      error: error.message
    });
  }
};

// Get single family member
const getFamilyMemberById = async (req, res) => {
  try {
    await connectDB();

    const familyMember = await FamilyMember.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!familyMember) {
      return res.status(404).json({
        success: false,
        message: 'Family member not found'
      });
    }

    res.json({
      success: true,
      data: familyMember
    });
  } catch (error) {
    console.error('Get family member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch family member',
      error: error.message
    });
  }
};

// Update family member
const updateFamilyMember = async (req, res) => {
  try {
    await connectDB();

    const {
      name,
      relationship,
      phone,
      email,
      dateOfBirth,
      gender,
      bloodGroup,
      allergies,
      medicalConditions
    } = req.body;

    const familyMember = await FamilyMember.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        name,
        relationship,
        phone,
        email,
        dateOfBirth,
        gender,
        bloodGroup,
        allergies,
        medicalConditions
      },
      { new: true, runValidators: true }
    );

    if (!familyMember) {
      return res.status(404).json({
        success: false,
        message: 'Family member not found'
      });
    }

    res.json({
      success: true,
      message: 'Family member updated successfully',
      data: familyMember
    });
  } catch (error) {
    console.error('Update family member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update family member',
      error: error.message
    });
  }
};

// Delete family member
const deleteFamilyMember = async (req, res) => {
  try {
    await connectDB();

    const familyMember = await FamilyMember.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!familyMember) {
      return res.status(404).json({
        success: false,
        message: 'Family member not found'
      });
    }

    res.json({
      success: true,
      message: 'Family member deleted successfully',
      data: familyMember
    });
  } catch (error) {
    console.error('Delete family member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete family member',
      error: error.message
    });
  }
};

module.exports = {
  createFamilyMember,
  getFamilyMembers,
  getFamilyMemberById,
  updateFamilyMember,
  deleteFamilyMember
};