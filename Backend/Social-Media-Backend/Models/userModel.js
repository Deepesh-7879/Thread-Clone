import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  name:{
    type:String,
    // required:true
  },

  username:{
    type:String,
    required:true,
    unique:true
  },

  email:{
    type:String,
    required:true,
    unique:true
  },

  password:{
    type:String,
    required:true
  },

  bio:{
    type:String,
    default:""
  },

  profileImage:{
    type:String,
    default:""
  },
  isActive:{
    type:Boolean,
    default:true
  },

  followers:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ],

  following:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ]
},
{
  timestamps:true
}
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
