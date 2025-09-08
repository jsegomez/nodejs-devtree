import { Response, Request, NextFunction } from "express";

import User from "../models/User";
import { comparePassword, hashPassword } from "../utils/auth";
import { ConflictException, UnauthorizedException } from "../utils/exceptions/exceptions";
import { generateToken } from "../utils/jtw";

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

  const token = generateToken(user._id);  
  res.status(200).json({ message: 'Login successful', token });
}

export const getDataUser = async(req: Request, res: Response) => {  
  const user = req.user;  

  res.status(200).json({ user });
}