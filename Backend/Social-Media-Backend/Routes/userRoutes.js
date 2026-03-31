import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Post from '../Models/postModel.js'
import User from '../Models/userModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const userRouter = express.Router();

// recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/profiles');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1E9);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;

    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }

    cb(new Error('Only image files are allowed'));
  }
});


// Get current user
userRouter.get('/me', authMiddleware, async (req, res) => {
  try {

    const user = await User.findById(req.userId)
      .select('-password')
      .populate('followers', 'username displayName profilePicture')
      .populate('following', 'username displayName profilePicture');

    res.json(user);

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error' });
  }
});

// Search users
userRouter.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = { isActive: true };

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { name: regex },
        { username: regex },
        { bio: regex },
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .limit(50);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Suggested users (random sample)
userRouter.get('/suggested', async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('-password')
      .limit(10);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by username
userRouter.get('/:username', async (req, res) => {
  try {

    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers', 'username displayName profilePicture')
      .populate('following', 'username displayName profilePicture');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.find({ user: user._id })
      .populate('user', 'username displayName profilePicture')
      .sort({ createdAt: -1 });

    res.json({ user, posts });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Update profile
userRouter.put('/profile', authMiddleware, async (req, res) => {
  try {

    const { displayName, bio } = req.body;

    const updates = {};

    if (displayName) updates.displayName = displayName;
    if (bio !== undefined) updates.bio = bio;

    const user = await user.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true }
    ).select('-password');

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Upload profile picture
userRouter.post('/profile-picture', authMiddleware, upload.single('image'), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/profiles/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profilePicture: imageUrl },
      { new: true }
    ).select('-password');

    res.json({ profilePicture: imageUrl, user });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Follow user
userRouter.post('/:userId/follow', authMiddleware, async (req, res) => {
  try {

    const userIdToFollow = req.params.userId;

    if (userIdToFollow === req.userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(req.userId);

    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (currentUser.following.includes(userIdToFollow)) {
      return res.status(400).json({ error: 'Already following' });
    }

    currentUser.following.push(userIdToFollow);
    userToFollow.followers.push(req.userId);

    await currentUser.save();
    await userToFollow.save();

    // Create notification
    const Notification = (await import('../Models/notificationModel.js')).default;
    await Notification.create({
      receiverId: userIdToFollow,
      senderId: req.userId,
      type: 'follow'
    });

    const updatedUser = await User.findById(req.userId).select('-password');
    res.json({ message: "Followed successfully", user: updatedUser });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Unfollow
userRouter.post('/:userId/unfollow', authMiddleware, async (req, res) => {
  try {

    const userIdToUnfollow = req.params.userId;

    const currentUser = await User.findById(req.userId);
    const userToUnfollow = await User.findById(userIdToUnfollow);

    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userIdToUnfollow
    );

    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.userId
    );

    await currentUser.save();
    await userToUnfollow.save();

    const updatedUser = await User.findById(req.userId).select('-password');
    res.json({ message: "Unfollowed successfully", user: updatedUser });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});


// Get followers
userRouter.get('/:userId/followers', async (req, res) => {
  try {

    const user = await User.findById(req.params.userId)
      .populate('followers', 'username displayName profilePicture bio');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.followers);

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Get following
userRouter.get('/:userId/following', async (req, res) => {
  try {

    const user = await User.findById(req.params.userId)
      .populate('following', 'username displayName profilePicture bio');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.following);

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

//Soft delete
userRouter.patch('/soft-delete/:userId',async(req,res)=>{
  const userObj=await User.findById(req.params.userId)
  userObj.isActive=false
  await userObj.save()
  res.status(200).json({message:"User Deactivated",payload:userObj})
})


//


export default userRouter;