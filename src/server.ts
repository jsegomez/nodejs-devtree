import express from 'express';
import cors from 'cors';

import 'dotenv/config';
import { errorHandler } from './middlewares/error-handler';
import authRoutes from './routes/auth.routes';
import database from './config/database';
import { corsConfig } from './config/cors';
import publicRoutes from './routes/public.routes';

const app = express();

app.use(express.json());

// Database
database();

// cors 
app.use(cors(corsConfig))

// Routes
app.use('/auth', authRoutes);
app.use('/public', publicRoutes);

// Middlewares
app.use(errorHandler);

export default app;