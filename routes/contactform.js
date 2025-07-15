const express = require("express");
const router = express.Router();
const { handleContactForm, getAllContacts, deleteContact } = require("../controllers/contactcontroller");

// Submit a contact form
router.post("/contact", handleContactForm);

// Get all contact form submissions
router.get("/contacts", getAllContacts);

// Delete a contact form submission
router.delete("/contacts/:id", deleteContact);

module.exports = router;