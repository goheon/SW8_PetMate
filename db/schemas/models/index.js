import mongoose from "mongoose";
import userSchema from "../userSchema";
import orderSchema from "../orderSchema";
import petsitterSchema from "../petsitterSchema";
import reviewSchema from "../reviewSchema";

export const User = mongoose.model('User', userSchema);
export const Order = mongoose.model('Order', orderSchema);
export const Petsitter = mongoose.model("Petsitter", petsitterSchema);
export const Review = mongoose.model("Review", reviewSchema);
