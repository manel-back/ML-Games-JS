import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import userRoutes from './Routes/userroutes.js';
import gameroutes from './Routes/gameroutes.js'; 
import authRoutes from './Routes/authroutes.js'; 

const app = express();

app.use(express.json());

// Rotas
app.use('/users', userRoutes);
app.use('/games', gameroutes);
app.use('/auth', authRoutes);

// Rota padrão para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

// Middleware de erro
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

export default app;