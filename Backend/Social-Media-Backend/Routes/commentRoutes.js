import express from "express";
import Comment from "../Models/commentModel.js"
import authMiddleware from "../middleware/authMiddleware.js";

const commentRoutes = express.Router();


// Create Comment
commentRoutes.post("/add-comment", async (req, res) => {
  try {
    const { post, user, text } = req.body;

    const newComment = new Comment({
      post,
      user,
      text
    });

    await newComment.save();

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get all comments for a post
commentRoutes.get("/post/:postId", async (req, res) => {
  try {

    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//like a comment 
commentRoutes.post("/likes/:commentId", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId); 

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const alreadyLiked = comment.likes.includes(req.userId);

    if (alreadyLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.userId.toString());
    } else {
      comment.likes.push(req.userId);
    }

    await comment.save();
    await comment.populate('user', 'username displayName profilePicture');

    res.json(comment);

  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



// Delete Comment
commentRoutes.delete("/:commentId", async (req, res) => {
  try {

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({
      message: "Comment deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default commentRoutes;