import { Router } from 'express';

import { body } from 'express-validator';
import { createUser } from '../handler/user-handler';


const authRoutes = Router();

authRoutes.post('/register', 
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password')            
            .isStrongPassword({
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            }).withMessage('Password must be strong'),
        body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
        body('lastname').isLength({ min: 3 }).withMessage('Lastname must be at least 3 characters long'),
        body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    ],
    createUser
);

export default authRoutes;