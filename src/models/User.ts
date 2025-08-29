import mongoose, { Schema } from "mongoose";

export interface IUser {    
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;  
  createAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
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
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 3,
        maxlength: 60,
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
        minlength: 8,
        maxlength: 100,        
    }
}, { timestamps: true });

const User = mongoose.model<IUser>("User", userSchema);

export default User;
