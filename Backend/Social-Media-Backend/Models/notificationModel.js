import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
{
  receiverId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  type:{
    type:String,
    enum:["like", "follow", "comment", "message"],
    required:true
  },
  read:{
    type:Boolean,
    default:false
  },
  postId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
  },
  text:{
    type:String 
  }
},
{
  timestamps:true
}
);

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export default Notification;
