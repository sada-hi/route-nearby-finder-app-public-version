import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routeRoutes from './routes/route';
import placesRoutes from './routes/places';
import rerouteRoutes from './routes/reroute';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/route', routeRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/reroute', rerouteRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
