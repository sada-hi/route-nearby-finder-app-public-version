import express from 'express';
import axios from 'axios';
import { decodePolyline, getPointsAlongRoute, calculateDistance } from '../utils/geometry';
import { calculateReroute } from '../utils/googleMaps';

const router = express.Router();

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  location: {
    lat: number;
    lng: number;
  };
  distanceFromRoute: number;
  additionalTime: number;
  additionalDistance: number;
}

router.get('/', async (req, res) => {
  try {
    const { polyline, keyword, range = '500', start, end, originalDistance, originalDuration } = req.query;

    if (!polyline || !keyword) {
      return res.status(400).json({ error: 'Polyline and keyword parameters are required' });
    }

    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Google Maps API key not configured' });
    }

    const decodedPoints = decodePolyline(polyline as string);
    const searchPoints = getPointsAlongRoute(decodedPoints, 300);

    const allPlaces = new Map<string, PlaceResult>();
    const searchRadius = parseInt(range as string);
    const origDist = parseInt(originalDistance as string) || 0;
    const origDur = parseInt(originalDuration as string) || 0;

    for (const point of searchPoints) {
      try {
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
        const response = await axios.get(placesUrl, {
          params: {
            location: `${point.lat},${point.lng}`,
            radius: searchRadius,
            keyword: keyword,
            key: apiKey,
          },
        });

        if (response.data.status === 'OK') {
          for (const place of response.data.results) {
            if (!allPlaces.has(place.place_id)) {
              const placeLocation = {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
              };

              const distanceFromRoute = calculateDistance(point, placeLocation);
              let additionalTime = 0;
              let additionalDistance = 0;

              if (start && end) {
                // Rate limit: 300ms delay to prevent QPS errors
                await new Promise(resolve => setTimeout(resolve, 300));

                try {
                  const { route, totalDistance, totalDuration } = await calculateReroute(
                    start as string,
                    end as string,
                    `${placeLocation.lat},${placeLocation.lng}`,
                    apiKey
                  );

                  // Calculate accurate difference
                  additionalDistance = totalDistance - origDist;
                  additionalTime = totalDuration - origDur;

                } catch (e) {
                  console.error('Error calculating reroute for place:', place.name, e);
                  // Fallback to estimation (return seconds)
                  additionalTime = Math.round(((distanceFromRoute * 2) / 83.3) * 60);
                  additionalDistance = Math.round(distanceFromRoute * 2);
                }
              } else {
                // Fallback estimation (return seconds) if start/end missing
                additionalTime = Math.round(((distanceFromRoute * 2) / 83.3) * 60);
                additionalDistance = Math.round(distanceFromRoute * 2);
              }

              allPlaces.set(place.place_id, {
                place_id: place.place_id,
                name: place.name,
                formatted_address: place.vicinity || place.formatted_address,
                rating: place.rating,
                user_ratings_total: place.user_ratings_total,
                location: placeLocation,
                distanceFromRoute: Math.round(distanceFromRoute),
                additionalTime: Math.round(additionalTime), // Return seconds
                additionalDistance,
              });
            }
          }
        }

        // Delay between search points
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Error searching near point:', error);
      }
    }

    const places = Array.from(allPlaces.values())
      .filter(place => place.additionalDistance <= searchRadius);

    res.json({
      places,
      count: places.length,
    });
  } catch (error) {
    console.error('Places API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
