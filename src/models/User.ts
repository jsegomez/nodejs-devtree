import mongoose, { Document, Schema } from "mongoose";

export interface IUserData {    
    name: string;
    lastname: string;
    username: string;
    email: string;
    password: string;    
    description: string;
    image: string;
    links: string;
    position: number | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
export interface IUser extends IUserData, Document {}

const userSchema = new Schema<IUserData>({
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
        select: false
    },
    description: {
        type: String,
        required: false,        
        maxlength: 1000,
        trim: true, 
        default: ''       
    },
    image: {
        type: String,
        required: false,
        default: ''
    },
    links: {
        type: String,
        required: false,
        default: '[]'        
    },
    position:{
        type: Number,
        required: false,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false,
});

const User = mongoose.model<IUserData>("User", userSchema);

export default User;
