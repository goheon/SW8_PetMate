import mongoose from 'mongoose';
import shortId from './types/shortId';
const {Schema}=mongoose;

const userSchema=new Schema({
    userId:{
        type:String,
        ...shortId,
        required: true
    },

    username:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    address:{
        type:Number,
        required:true,
    },
    isRole:{
        type:String,
        required:false,
    },
    deletedAt:{
        type:Date,
        required: false,
    }
})

export default userSchema;