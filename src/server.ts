import 'dotenv/config';
import authRoutes from './routes/auth.routes';
import database from './config/database';
import express from 'express';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Database
database();

// Middlewares
app.use(errorHandler);

export default app;