import 'dotenv/config';
import authRoutes from './routes/auth.routes';
import database from './config/database';
import express from 'express';

const app = express();

app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Database
database();

export default app;