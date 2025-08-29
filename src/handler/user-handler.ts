import { Response, Request } from "express";

import User from "../models/User";
import { comparePassword, hashPassword } from "../utils/auth";
import { ConflictException, NotFoundException, UnauthorizedException } from "../utils/exceptions/exceptions";

export const createUser = async(req: Request, res: Response):Promise<void> => {
  const { email, username, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });    
  if (existingUser) throw new ConflictException('Email or username already exists');

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({...req.body, password: hashedPassword});
  res.status(201).json(newUser);
}

export const loginUser = async(req: Request, res: Response):Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new NotFoundException('User not found');

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedException('Invalid password');
  res.status(200).json({ message: 'Login successful' });
}