const Contact = require("../models/ContactForm");
const nodemailer = require("nodemailer");

const handleContactForm = async (req, res) => {
  const { name, email, phone, location } = req.body;

  try {
    // Save to MongoDB
    const newContact = new Contact({ name, email, phone, location });
    await newContact.save();

    // Configure email transport
    const transporter = nodemailer.createTransport({
      host: "mail.thecubicle.pk",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Contact Form: ${name}`,
      html: `
    <div style="background-color:transparent; padding:20px; font-family:sans-serif;">
      <h2>New Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Location:</strong> ${location}</p>
    </div>
  `,
    });

    // console.log("Message sent: %s", info.messageId);
    res
      .status(201)
      .json({ message: "Contact saved and email sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all contact form submissions
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch contacts", error: error.message });
  }
};

// Delete a contact form submission
const deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res
      .status(500)
      .json({ message: "Failed to delete contact", error: error.message });
  }
};

module.exports = {
  handleContactForm,
  getAllContacts,
  deleteContact,
};
