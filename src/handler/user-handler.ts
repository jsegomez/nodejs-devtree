import { Response, Request, NextFunction } from "express";
import formidable from 'formidable';
import { v4 as uuidv4 } from 'uuid';

import User from "../models/User";
import { comparePassword, hashPassword } from "../utils/auth";
import { BadRequestException, ConflictException, ImageUploadException, UnauthorizedException } from "../utils/exceptions/exceptions";
import { generateToken } from "../utils/jtw";
import cloudinary from "../config/cloudinary";

export const createUser = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) throw new ConflictException('Email or username already exists');
  
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({...req.body, password: hashedPassword});
    res.status(201).json(newUser);
  } catch (error) {    
    next(error);    
  }
}

export const loginUser = async(req: Request, res: Response):Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new UnauthorizedException('User or password incorrect');

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedException('User or password incorrect');

  const token = generateToken(user._id.toString());  
  res.status(200).json({ message: 'Login successful', token });
}

export const getDataUser = async(req: Request, res: Response) => {  
  const user = req.user;  

  res.status(200).json(user);
}

export const updateUser = async(req: Request, res: Response, next: NextFunction) => {    
  try {        
    const { username, description } = req.body;    
    const user = req.user!;

    user.username = username;    
    user.description = description;

    const findUsername = await User.findOne({ username });
    if(findUsername && findUsername?.id !== user.id) throw new ConflictException('Username already exists');
    
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}

export const uploadImage = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const form = formidable({ multiples: false });    

    form.parse(req, async(err, fields, files) => {
      if (err) next(err);

      const file = files?.image?.[0]?.filepath;    
      if(!file) return next(new BadRequestException('Image is required'));  

      const imagen = await cloudinary.uploader.upload(file, { public_id: uuidv4() });
      user.image = imagen.secure_url;
      await user.save();

      res.status(200).json(user);
    });
  } catch (error) {
    next(error);
  }
}