import mongoose from "mongoose";
import shortId from "./types/shortId";
const {Schema}=mongoose;

const reviewSchema=new Schema({
    userId:{
        type:String,
        ...shortId,
        required: true
    },
    sitterId:{
        type:String,
        ...shortId,
        required: true
    },
    comment:{
        type:String,
        required:true,
    },
    image:{
        type: String,
        required: true,
    }
})

export default reviewSchema;