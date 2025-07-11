import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup =  async (req, res) => {
    try{
        const {email,fullname, password } = req.body;

        if(!email || !password || !fullname){
            return res.status(400).json({
                status:false,
                message:"All fields are required"
            })
        }

        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({
                status:false,
                message:"User already exists"
            })
        }
        if(password.length < 6){
            return res.status(400).json({
                status:false,
                message:"Password must have at least 6 characters"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = await new User({
            email,
            fullname,
            password:hashedPassword,
        })

        if(newUser){
            generateToken({id:newUser._id}, res);
            await newUser.save();

            res.status(201).json({
                id:newUser._id,
                fullname: newUser.fullname,
                email:newUser.email,
                profilePic:newUser.profilepic
            });

        }else{
            res.status(400).json({message:"Invalis user data"})
        }


    }catch(err){
        console.log(`Error in signupcontroller : ${err}`);
        res.status(400).json({message:"Internal server error"});
    }
}

export const login =  async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email})

        if(!user) return res.status(400).json({message:"Invalid credentials"})

        const isCorrectPassword = await bcrypt.compare(password, user.password)

        if(!isCorrectPassword) {
            res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }

        generateToken({"id":user._id}, res);
        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            profilePic:user.profilepic
        });

        
    }catch(err){
        console.log(`error in login: ${err}`)
        res.status(400).json({
            success:false,
            message:`Error in login: ${err}`
        })

    }
}

export const logout =  (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    }catch(err){
        console.log("Error in controller:", err.message);
        res.status(400).json({message:"Internal server error"});
    }
}

export const updateProfile = async (req, res) => {
    try{
        const {profilePic} = req.body;
        // we access user from req here as this function is called as a 
        // next from protected route 
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message:"Profile pic is necessary"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(userId, {profilepic:uploadResponse.secure_url}, {new:true})

        res.status(200).json({message:"user updated."})
    }catch(err){
        console.log("Error in update picture");
        res.status(400).json({message:"Internal server error."})
    }
}

export const checkAuth = (req, res) => {
    try{
        res.status(200).json(req.user)
    }catch(err){
        console.log(`Error in check auth controller: ${err}`);
        res.status(400).json({message:"Internal server error"});
    }
}