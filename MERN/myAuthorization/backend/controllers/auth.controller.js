// import mongoose from "mongoose";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../model/user.model.js";

export const signupControl = async (req, res) => {
    // res.send("signup page")
    const {email, password, name} = req.body;

    try{
        if( !email || !password || ! name){
            throw new Error("All the fields are required.");
        }

        const userAlreadyExists = await User.findOne({email});

        if(userAlreadyExists){
            return res.status(400).json({
                success:false,
                message:"user already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email, 
            password:hashedPassword,
            name,
            verificationToken:verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        })

        await user.save();

        res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});


    }catch(err){
        res.status(400).json({
            success:false,
            message:`error in signup ${err}`
        });
    }

} 

export const loginControl = async (req, res) => {
    try{
        const {email, password}  = req.body;
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                        success:false,
                        message:"Incorrect email or password"
                    });

        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                        success:false,
                        message:"Incorrect email or password"
                    });
        }

        user.lastLogin = new Date();
        await user.save();
        res.status(200).json({
                        success:true,
                        message:"login successful!!!",
                        user:{
                            ...user._doc,
                            password:undefined
                        }
                    });
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        });
    }

} 


export const logoutControl = async (req, res) => {
    // res.send("logoutpage")
    res.status(200).json({
        success:false,
        message:"Sucessfully logged out!!!"
    })
} 