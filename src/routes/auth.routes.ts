import { Router } from 'express';

import { body } from 'express-validator';
import { createUser, loginUser, getDataUser, updateUser } from '../handler/user-handler';
import { authMiddleware } from '../middlewares/auth';

const authRoutes = Router();

authRoutes.post('/register', 
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password')            
            .isStrongPassword({
                minLength: 8,
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

authRoutes.post('/login', 
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 8 }).withMessage('Invalid password'),
    ],
    loginUser
);

authRoutes.get('/get-user',
    [ authMiddleware ],
    getDataUser
)

authRoutes.patch('/update-user',
    authMiddleware,
    [         
        body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
        body('description').isLength({ min: 3 }).withMessage('Description must be at least 3 characters long'),
    ],
    updateUser
)

export default authRoutes;