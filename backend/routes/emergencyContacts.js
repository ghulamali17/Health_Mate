const express = require('express');
const router = express.Router();
const EmergencyContact = require('../models/EmergencyContact');
const auth = require('../middlewares/authMiddleware');

// Get all emergency contacts for user
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ userId: req.user.id }).sort({ priority: 1, name: 1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single emergency contact
router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await EmergencyContact.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new emergency contact
router.post('/', auth, async (req, res) => {
  try {
    const { name, phone, relationship, email, address, isPrimary, notes, priority } = req.body;

    // If setting as primary, remove primary from other contacts
    if (isPrimary) {
      await EmergencyContact.updateMany(
        { userId: req.user.id, isPrimary: true },
        { $set: { isPrimary: false } }
      );
    }

    const contact = new EmergencyContact({
      userId: req.user.id,
      name,
      phone,
      relationship,
      email,
      address,
      isPrimary,
      notes,
      priority
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Only one primary contact allowed' });
    }
    res.status(400).json({ message: 'Error creating contact', error: error.message });
  }
});

// Update emergency contact
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, phone, relationship, email, address, isPrimary, notes, priority } = req.body;

    // If setting as primary, remove primary from other contacts
    if (isPrimary) {
      await EmergencyContact.updateMany(
        { userId: req.user.id, isPrimary: true, _id: { $ne: req.params.id } },
        { $set: { isPrimary: false } }
      );
    }

    const contact = await EmergencyContact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, phone, relationship, email, address, isPrimary, notes, priority },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Only one primary contact allowed' });
    }
    res.status(400).json({ message: 'Error updating contact', error: error.message });
  }
});

// Delete emergency contact
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await EmergencyContact.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Set contact as primary
router.patch('/:id/primary', auth, async (req, res) => {
  try {
    // Remove primary from all other contacts
    await EmergencyContact.updateMany(
      { userId: req.user.id, isPrimary: true },
      { $set: { isPrimary: false } }
    );

    // Set this contact as primary
    const contact = await EmergencyContact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { isPrimary: true } },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;