import User, { IUser } from "../models/User";
import { ConflictException, NotFoundException } from "../utils/exceptions/exceptions";

export class UserService {
  async findAllUsers(): Promise<IUser[]> {
    const users = await User.find();
    return users;
  }

  async findUserById(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(data: IUser): Promise<IUser> {
    const existingUser = await this.findUserByEmail(data.email);
    if (existingUser) throw new ConflictException('User already exists');

    const user = await User.create(data);
    return user;
  }

  async findUserByEmail(email: string): Promise<IUser> {
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}