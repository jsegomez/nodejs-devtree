import { Router } from 'express';

const authRoutes = Router();

authRoutes.post('/register', (req, res) => {
    res.json(req.body);
});


authRoutes.post('/login', (req, res) => {
    res.json(req.body);
});

export default authRoutes;