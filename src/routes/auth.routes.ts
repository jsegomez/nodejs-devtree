import { Router } from 'express';
import { UserService } from '../services/user-service';

import { BadRequestException } from '../utils/exceptions/exceptions';


const authRoutes = Router();
const userService = new UserService();

authRoutes.post('/login', (req, res) => {
    res.json(req.body);
});

authRoutes.get('/all', async(req, res) => {
   const users = await userService.findAllUsers();
   res.json(users);
});

authRoutes.get('/get-user', async(req, res) => {
    const { id } = req.query;
    if (!id) throw new BadRequestException('Id is required');
    const user = await userService.findUserById(id as string);
    res.json(user);
});

authRoutes.post('/register', async(req, res) => {
    const newUser = await userService.createUser(req.body);
    res.json(newUser);
});

export default authRoutes;