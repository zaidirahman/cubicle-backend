const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  date: { type: Date, default: Date.now },
});

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;
