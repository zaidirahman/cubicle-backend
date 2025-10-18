const Contact = require("../models/ContactForm");
const nodemailer = require("nodemailer");

// Async email sending function (doesn't block response)
const sendEmailAsync = async (contactData) => {
  try {
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
      subject: `Contact Form: ${contactData.name}`,
      html: `
        <div style="background-color:transparent; padding:20px; font-family:sans-serif;">
          <h2>New Form Submission</h2>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Phone:</strong> ${contactData.phone}</p>
          <p><strong>Location:</strong> ${contactData.location}</p>
          <p><strong>Requirements:</strong> ${contactData.requirements}</p>
        </div>
      `,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
};

const handleContactForm = async (req, res) => {
  const { name, email, phone, location, requirements } = req.body;

  try {
    // Save to MongoDB first (fast operation)
    const newContact = new Contact({ name, email, phone, location, requirements });
    await newContact.save();

    // Send immediate success response
    res.status(201).json({ 
      message: "Form submitted successfully!",
      contactId: newContact._id 
    });

    // Send email in background (non-blocking)
    sendEmailAsync({ name, email, phone, location, requirements })
      .then(result => {
        if (result.success) {
          console.log(`Email sent for contact ${newContact._id}`);
        } else {
          console.error(`Failed to send email for contact ${newContact._id}:`, result.error);
        }
      })
      .catch(err => {
        console.error(`Unexpected error sending email for contact ${newContact._id}:`, err);
      });

  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ 
      message: "Failed to submit form", 
      error: error.message 
    });
  }
};

// Get all contact form submissions
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ 
      message: "Failed to fetch contacts", 
      error: error.message 
    });
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
    res.status(500).json({ 
      message: "Failed to delete contact", 
      error: error.message 
    });
  }
};

module.exports = {
  handleContactForm,
  getAllContacts,
  deleteContact,
};