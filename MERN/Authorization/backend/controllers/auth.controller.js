import bcrypt from 'bcryptjs';
import crypto from "crypto";
import dotenv from "dotenv"; 

import {User} from '../models/user.model.js';
import { generateVerificationCode } from '../utils/generateVerificationCode.js';
import {generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js';
import {sendverificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessfulEmail} from "../mailtrap/emails.js";

dotenv.config();

export const signup = async (req, res) => {
    const {email, password, name} = req.body;
    try{
        if( !email || !password || !name){
        throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({
                success:false,
                message:'User already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10); // creates a hash of the password
        const verificationToken = generateVerificationCode();

        const user = new User({
            name,
            password:hashedPassword,
            email,
            verificationToken,
            verificationTokenExpiresAt:Date.now() + 24 * 60 * 60 * 1000 // 24 hrs from now
        });
        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id);

        //verification email using mailtrap
        await sendverificationEmail(user.email, verificationToken);

        res.status(201).json({
            success:true,
            message:"user created successfully",
            user:{
                ...user._doc,
                password:undefined
            }
        });
    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }

    
    // res.send("signup Route");
}


export const verifyEmail = async(req, res) => {
    const {code} = req.body;

    try{

        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}
        })

        if(!user){
            res.status(400).json({
                success: false,
                message:" the token ins incorrect or has expired."
            })
        }

        user.isVerified=true;
        user.verificationToken=undefined;
        user.verificationTokenExpiresAt=undefined;

        await user.save();
        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success:true,
            message:"Email verified successfully",
            user:{
                ...user._doc,
                password:undefined
            }
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:"Server error"
        })
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            });
        }

        const isValidPasword = await bcrypt.compare(password, user.password);
        if(!isValidPasword){
            return res.status(400).json({
                success:false,
                mesage:"Invalid credentials"
            });
        }

        generateTokenAndSetCookie(res, user._id);
        user.lastlogin = Date.now();

        await user.save();

        res.status(200).json({
            success:true,
            message: "Logged in successfully",
            user:{
                ...user._doc,
                password:undefined
            }
        })

    }catch(err){
        res.status(400).json({
            success:false,
            message:"Error in login"
        })
    }
}


export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    });
}


export const forgotPassword = async(req, res) => {
    const {email} = req.body;

    try{
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1*60*60*1000;// 1hr

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        //Send reset email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({
            success:true,
            message:"Reset password sent"
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:"User not found",
            error:err.message,
        })
    }
}

export const resetPassword = async(req, res) => {
    try{
        const {token} = req.params; // As in the url its named as token in authroute as a dynamic value
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()} //gt means greater than date.now()
        });

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid or expired reset token"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt=undefined;

        await user.save();

        await sendResetSuccessfulEmail(user.email);

        res.status(200).json({
            success:true,
            message:"Password reset email sent successful."
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:"sending Password reset email failed.",
            error:err.message
        })
    }
}

export const checkAuth = async(req, res) => {
    try{
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })
        }

        res.status(200).json({success:true, user})
    }catch(err){
        console.log(`Error in checkAuth: ${err}`);
        res.status(400).json({success:false, message:err.message})
    }
}