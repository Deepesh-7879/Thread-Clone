import jwt from "jsonwebtoken"

const authMiddleware = (req,res,next)=>{

  // Check for token in cookies or Authorization header
  let token = req.cookies.token

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
  }

  if(!token){
    return res.status(401).json({message:"No token"})
  }

  try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.userId = decoded.userId
    req.userEmail = decoded.email
    next()
  }catch(err){
    res.status(401).json({message:"Invalid token"})
  }

}

export default authMiddleware