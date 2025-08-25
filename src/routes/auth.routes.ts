import { Router } from 'express';
import User, { IUser } from '../models/User';
import { UserService } from '../services/user-service';

const authRoutes = Router();
const userService = new UserService();

authRoutes.post('/register', async(req, res) => {
    const newUser = await userService.createUser(req.body);
    res.json(newUser);
});

authRoutes.post('/all', async(req, res) => {
    const newUser = await User.create(req.body);
    res.json(newUser);
});


authRoutes.post('/login', (req, res) => {
    res.json(req.body);
});

export default authRoutes;