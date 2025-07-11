import mongoose from 'mongoose';
import bcrypt from "bcryptjs"
import {user} from '../models/myUser.model.js';

export const signUp = async (req, res) => {
    const {email, password, name} = req.body;

    try{
       if(!name||!email||!password){
        throw new Error("All fields are required");
       }

       const userAlreadyExists = await user.findOne(email);
       if(userAlreadyExists){
        res.status(400).json({
            success:false,
            message:"user already exists"
        });
       }

       const hashedPassword = bcrypt.hash(password, 10);
       



    }
    catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}