import axios from 'axios';

interface RerouteResult {
    route: any;
    totalDistance: number;
    totalDuration: number;
}

export async function calculateReroute(
    start: string,
    end: string,
    waypoint: string,
    apiKey: string
): Promise<RerouteResult> {
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json`;
    const response = await axios.get(directionsUrl, {
        params: {
            origin: start,
            destination: end,
            waypoints: waypoint, // format: "lat,lng"
            key: apiKey,
            mode: 'walking', // Consistent mode for all reroutes
        },
    });

    if (response.data.status !== 'OK') {
        throw new Error(`Google Maps API Error: ${response.data.status} - ${response.data.error_message || ''}`);
    }

    const route = response.data.routes[0];
    let totalDistance = 0;
    let totalDuration = 0;

    for (const leg of route.legs) {
        totalDistance += leg.distance.value;
        totalDuration += leg.duration.value;
    }

    return {
        route,
        totalDistance,
        totalDuration
    };
}
