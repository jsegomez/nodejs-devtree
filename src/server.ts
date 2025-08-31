import express from 'express';
import cors from 'cors';

import 'dotenv/config';
import { errorHandler } from './middlewares/error-handler';
import authRoutes from './routes/auth.routes';
import database from './config/database';
import { corsConfig } from './config/cors';

const app = express();

app.use(express.json());

// Database
database();

// cors 
app.use(cors(corsConfig))

// Routes
app.use('/auth', authRoutes);

// Middlewares
app.use(errorHandler);

export default app;