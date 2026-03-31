import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userTypeModel from '../Models/userModel.js';
import { config } from "dotenv";

//register function
export const register = async(userObj)=>{
    //create document
    const userDoc = new userTypeModel(userObj);
    //validate for empty password
    await userDoc.validate();
    //hash and replace password
    userDoc.password = await bcrypt.hash(userDoc.password,10);
    //save
    const created =await userDoc.save();
    //convert document to object to remove password
    const newUserObj =created.toObject();
    //remove password 
    delete newUserObj.password;
    //return user obj without password
    return newUserObj;
};

//authentication function
export const authentication = async({email,password}) => {
    //check user with email and role
    const user = await userTypeModel.findOne({email});
    if(!user){
        const err =new Error("Invalid email");
        err.status =401;
        throw err;
    }
    //compare passwords
    const isMatch =await bcrypt.compare(password,user.password);
    if(!isMatch){
        const err =new Error("Invalid password");
        err.status =401;
        throw err;
    }
    

    //generate token
    const token = jwt.sign({userId: user._id,role:user.role,email: user.email},
        process.env.JWT_SECRET,{
            expiresIn:"1h"
    });
    const userObj= user.toObject();
    delete userObj.password;
    return {token,user : userObj};
}