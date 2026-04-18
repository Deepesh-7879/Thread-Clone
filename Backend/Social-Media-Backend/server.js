import express from "express"
import {connect} from "mongoose"
import {config} from "dotenv"
import cors from "cors"
import commentRoutes from "./Routes/commentRoutes.js"
import  userRouter  from './Routes/userRoutes.js'
import authRouter from "./Routes/authRoutes.js"
import postRouter from "./Routes/postRoutes.js"
import messageRouter from "./Routes/messageRoute.js"
import notificationRouter from "./Routes/notificationRoute.js"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config()


const app = express()

//use cors for backend and frontend interaction
app.use(cors({ 
    origin: function(origin, callback) { callback(null, true); }, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())

//Connect API's
app.use('/api/comment-api', commentRoutes)
app.use('/api/user-api', userRouter)
app.use('/api/users', userRouter) // legacy/shortcut
app.use('/api/post-api', postRouter)
app.use('/api/posts', postRouter) // legacy/shortcut
app.use('/api/messages', messageRouter)
app.use('/api/notifications', notificationRouter)
app.use('/api/auth-api', authRouter)

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// mongodb connection
const connectDB = async () => {
  try {
    await connect(process.env.DB_URL)
    console.log("DB connection success");
    if (process.env.NODE_ENV !== "production") {
      app.listen(process.env.PORT || 5000, () => console.log("server started"));
    }
  } catch (err) {
    console.log("error occured", err)
  }
}
connectDB()

//handling the error
app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} ${value} already exists`,
    });
  }

  //  HANDLE CUSTOM ERRORS
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: err.message,
  });
});

export default app;
