import mongoose, { Schema } from "mongoose";
import { User } from "../interfaces/user.interface";

const userSchema = new Schema<User>({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 100,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 100,        
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
