import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ 
        message: 'Servidor DevTree funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

export default app;