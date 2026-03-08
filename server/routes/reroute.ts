import express from 'express';
import { calculateReroute } from '../utils/googleMaps';

const router = express.Router();

interface RerouteResponse {
  newRoute: any;
  newDistance: number;
  newDuration: number;
  additionalDistance: number;
  additionalTime: number;
  newArrivalTime: string;
  polyline: string;
}

router.get('/', async (req, res) => {
  try {
    const { start, end, waypoint, originalDistance, originalDuration } = req.query;

    if (!start || !end || !waypoint) {
      return res.status(400).json({ error: 'Start, end, and waypoint parameters are required' });
    }

    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Google Maps API key not configured' });
    }

    const { route, totalDistance, totalDuration } = await calculateReroute(
      start as string,
      end as string,
      waypoint as string,
      apiKey
    );

    const originalDist = parseInt(originalDistance as string) || 0;
    const originalDur = parseInt(originalDuration as string) || 0;

    const additionalDistance = totalDistance - originalDist;
    const additionalTime = totalDuration - originalDur;

    const now = new Date();
    const arrivalTime = new Date(now.getTime() + totalDuration * 1000);

    const result: RerouteResponse = {
      newRoute: route,
      newDistance: totalDistance,
      newDuration: totalDuration,
      additionalDistance,
      additionalTime,
      newArrivalTime: arrivalTime.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      //polyline: route.overview_polyline.encoded_polyline,
      polyline: route.overview_polyline.points,
    };

    res.json(result);
  } catch (error) {
    console.error('Reroute API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
