const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const contactRoutes = require("./routes/contactform");
const postRoutes = require("./routes/blogs");
const jobRoutes = require('./routes/jobs');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// const path = require("path");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

connectDB();

// Routes
app.use("/api", contactRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
