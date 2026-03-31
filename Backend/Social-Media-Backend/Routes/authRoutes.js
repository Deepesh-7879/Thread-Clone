import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../Models/userModel.js"
import { authentication } from "../Services/authService.js"
import authMiddleware from "../middleware/authMiddleware.js"

const authRouter = express.Router()

//create new user registration
authRouter.post("/register",async(req,res)=>{

  const {name, username, email, password} = req.body

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword
    })

    await user.save()

    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error" })
  }
})


//create new user authentication
authRouter.post("/login",async(req,res)=>{
  // get user credentials obj
        let userCred = req.body;
        // call authenticate service
        let {token , user} = await authentication(userCred);
        // save token as httpOnly
        res.cookie("token",token,{
            httpOnly:true,
            sameSite:"lax",
            secure:false
        })
        // send res
        res.status(200).json({message:"user login success",user, token})
})

// Get current user info
authRouter.get("/me", authMiddleware, async(req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

//logout
authRouter.get("/logout",async(req,res)=>{
    res.clearCookie("token",{
      httpOnly:true,//must match original settings
      secure:false,//must match original settings
      sameSite:"lax"//must match original settings
   })
   res.status(200).json({message:"Logged out successfully"})
})
export default authRouter;
