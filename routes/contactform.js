const express = require("express");
const router = express.Router();
const { handleContactForm, getAllContacts, deleteContact } = require("../controllers/contactcontroller");

// Submit a contact form
router.post("/", handleContactForm);

// Get all contact form submissions
router.get("/", getAllContacts);

// Delete a contact form submission
router.delete("/:id", deleteContact);

module.exports = router;