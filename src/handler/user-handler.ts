import { Response, Request } from "express";

import User from "../models/User";
import { hashPassword } from "../utils/auth";
import { ConflictException } from "../utils/exceptions/exceptions";

export const createUser = async(req: Request, res: Response):Promise<void> => {
  const { email, username, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });    
  if (existingUser) throw new ConflictException('Email or username already exists');

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({...req.body, password: hashedPassword});
  res.status(201).json(newUser);
}