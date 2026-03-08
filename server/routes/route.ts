import express from 'express';
import axios from 'axios';

const router = express.Router();

interface RouteResponse {
  route: any;
  distance: number;
  duration: number;
  polyline: string;
  bounds: any;
}

router.get('/', async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end parameters are required' });
    }

    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Google Maps API key not configured' });
    }

    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json`;
    const response = await axios.get(directionsUrl, {
      params: {
        origin: start,
        destination: end,
        key: apiKey,
        //mode: 'driving', //車を想定している
        mode: 'walking', //歩きを想定している
      },
    });

    if (response.data.status !== 'OK') {
      return res.status(400).json({
        error: `Failed to get route: ${response.data.status}`,
        details: response.data.error_message
      });
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];

    const result: RouteResponse = {
      route: route,
      distance: leg.distance.value,
      duration: leg.duration.value,
      //polyline: route.overview_polyline.encoded_polyline,
      polyline: route.overview_polyline.points,
      bounds: route.bounds,
    };

    res.json(result);
  } catch (error) {
    console.error('Route API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
