const Post = require('../models/Blog');
const mongoose = require('mongoose');

// Helper function to create URL-friendly slug
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
};

// Get all posts or filter by category
exports.getAllPosts = async (req, res) => {
  try {
    const { category, limit, featured } = req.query;
    let query = { status: 'published' };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    let postsQuery = Post.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      postsQuery = postsQuery.limit(parseInt(limit));
    }
    
    const posts = await postsQuery;
    
    const postsWithSlug = posts.map(post => ({
      ...post.toObject(),
      slug: createSlug(post.title)
    }));
    
    res.json(postsWithSlug);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get post by ID (with validation)
exports.getPostById = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid post ID format' });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    res.json({
      ...post.toObject(),
      slug: createSlug(post.title)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get post by slug (title-based URL)
exports.getPostBySlug = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' });
    
    // Find post by matching slug
    const post = posts.find(p => createSlug(p.title) === req.params.slug);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    res.json({
      ...post.toObject(),
      slug: createSlug(post.title)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      imageUrl: req.body.imageUrl || '',
      category: req.body.category,
      content: req.body.content,
      status: req.body.status
    });
    
    const post = await newPost.save();
    res.json({
      ...post.toObject(),
      slug: createSlug(post.title)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update an existing post
exports.updatePost = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid post ID format' });
    }

    let post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json({
      ...post.toObject(),
      slug: createSlug(post.title)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid post ID format' });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    await Post.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};