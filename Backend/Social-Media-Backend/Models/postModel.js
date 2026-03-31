import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    content: {
      type: String,
      required: true
    },

    image: {
      type: String
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    shares: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        content: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        },
        replies: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true
            },
            content: {
              type: String,
              required: true
            },
            createdAt: {
              type: Date,
              default: Date.now
            }
          }
        ]
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Post", postSchema);