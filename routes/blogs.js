const express = require('express');
const router = express.Router();

const {
  getAllPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/blogcontroller');

// Get all posts
router.get('/', getAllPosts);

// Get post by slug (must come before /:id route)
router.get('/post/:slug', getPostBySlug);

// Get post by ID
router.get('/:id', getPostById);

// Create new post
router.post('/', createPost);

// Update post
router.put('/:id', updatePost);

// Delete post
router.delete('/:id', deletePost);

module.exports = router;