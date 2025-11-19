// backend/src/app.js
import express from 'express';
import cors from 'cors';
import empleadosRoutes from './routes/empleados.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/empleados', empleadosRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend proyecto_arquitectura funcionando ✅');
});

export default app;
