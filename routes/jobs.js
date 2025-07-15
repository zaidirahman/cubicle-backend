const express = require('express');
const jobController = require('../controllers/jobcontroller');
const router = express.Router();

// Define routes
router.get('/', jobController.getJobs);                // Get all jobs
router.post('/create', jobController.createJob);        // Create a new job
router.get('/:id', jobController.getJobById);           // Get job by ID
router.put('/:id', jobController.updateJob);            // Update job by ID
router.delete('/:id', jobController.deleteJob);         // Delete job by ID

module.exports = router;
