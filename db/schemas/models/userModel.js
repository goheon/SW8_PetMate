import mongoose from "mongoose";
import userSchema from "../userSchema";

const User = mongoose.model('User', userSchema);

export {User};