import express from 'express';
const postRouter = express.Router();

import authMiddleware from '../middleware/authMiddleware.js';
import Post from '../Models/postModel.js'
import User from '../Models/userModel.js'
import comment from "../Models/commentModel.js"
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/posts');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }

    cb(new Error('Only image files are allowed'));
  }
});


// Create post
postRouter.post("/", authMiddleware, upload.array("images",4), async (req,res)=>{
  try{

    const { content } = req.body;

    const image = req.files && req.files.length > 0
      ? `/uploads/posts/${req.files[0].filename}`
      : null;

    const post = new Post({
      author: req.userId,
      content,
      image
    });

    await post.save();

    await post.populate("author","username email displayName profilePicture");

    res.status(201).json(post);

  }catch(error){
    console.error("Create post error:",error);
    res.status(500).json({error:"Server error"});
  }
});



// Get feed
postRouter.get('/feed', authMiddleware, async (req, res) => {
  try {

    const currentUser = await User.findById(req.userId);
    const followingIds = currentUser.following;

    const posts = await Post.find({
      $or: [
        { author: { $in: followingIds } },
        { author: req.userId }
      ]
    })
      .populate('author', 'username displayName profilePicture verified')
      .populate('comments.user', 'username displayName profilePicture')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);

  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get all posts
postRouter.get('/all', async (req, res) => {
  try {

    const posts = await Post.find()
      .populate('author', 'username displayName profilePicture')
      .populate('comments.user', 'username displayName profilePicture')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);

  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get posts by user
postRouter.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const posts = await Post.find({ author: userId })
      .populate('author', 'username displayName profilePicture verified')
      .populate('comments.user', 'username displayName profilePicture')
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post
postRouter.get('/:postId', async (req, res) => {
  try {

    const post = await Post.findById(req.params.postId)
      .populate('author', 'username displayName profilePicture verified')
      .populate('comments.user', 'username displayName profilePicture');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Like post
postRouter.post('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const alreadyLiked = post.likes.includes(req.userId);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== req.userId.toString());
    } else {
      // Like
      post.likes.push(req.userId);
      
      // Create notification
      if (post.author.toString() !== req.userId.toString()) {
        const Notification = (await import('../Models/notificationModel.js')).default;
        await Notification.create({
          receiverId: post.author,
          senderId: req.userId,
          type: 'like',
          postId: post._id
        });
      }
    }

    await post.save();

    // Populate the author and likes (optional)
    await post.populate('author', 'username displayName profilePicture');
    await post.populate('likes', 'username displayName profilePicture');

    res.json(post);

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// share post
postRouter.post('/:postId/share',authMiddleware, async (req, res) => {
  try {

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const alreadyLiked = post.shares.includes(req.userId);

    if (alreadyLiked) {
      post.shares = post.shares.filter(id => id.toString() !== req.userId.toString());
    } else {
      post.shares.push(req.userId);
    }

    await post.save();
    await post.populate('user', 'username displayName profilePicture');

    res.json(post);

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



// Add comment
postRouter.post('/:postId/comment', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

              // Add new comment
    post.comments.push({
      user: req.userId,
      content
    });

    await post.save();

    // Create notification
    if (post.author.toString() !== req.userId.toString()) {
      const Notification = (await import('../Models/notificationModel.js')).default;
      await Notification.create({
        receiverId: post.author,
        senderId: req.userId,
        type: 'comment',
        postId: post._id,
        text: content.substring(0, 50)
      });
    }

    await post.populate('author', 'username displayName profilePicture');
    await post.populate('comments.user', 'username displayName profilePicture');

    res.json(post);

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete post
postRouter.delete('/:postId', authMiddleware, async (req, res) => {
  try {

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await post.deleteOne();

    res.json({ message: 'Post deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


export default postRouter