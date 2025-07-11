import mongoose from "mongoose"

const userSchema = new mongoose.schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    lastlogin:{
        type:Date,
        default:Date.now()
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordTokenExpiresAt:Date,
    VerfificationToken:String,
    VerfificationTokenExpiresAt:Date

}, {timestamp:true})

export default userSchema;