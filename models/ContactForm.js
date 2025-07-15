const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  location: String,
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;