interface LatLng {
  lat: number;
  lng: number;
}

export function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({
      lat: lat / 1e5,
      lng: lng / 1e5,
    });
  }

  return points;
}

export function getPointsAlongRoute(points: LatLng[], intervalMeters: number): LatLng[] {
  const result: LatLng[] = [];
  result.push(points[0]);

  for (let i = 1; i < points.length; i++) {
    const distance = calculateDistance(points[i - 1], points[i]);

    if (distance > intervalMeters) {
      const numPoints = Math.floor(distance / intervalMeters);
      for (let j = 1; j <= numPoints; j++) {
        const ratio = (j * intervalMeters) / distance;
        result.push({
          lat: points[i - 1].lat + (points[i].lat - points[i - 1].lat) * ratio,
          lng: points[i - 1].lng + (points[i].lng - points[i - 1].lng) * ratio,
        });
      }
    }
  }

  result.push(points[points.length - 1]);

  return result;
}

export function calculateDistance(point1: LatLng, point2: LatLng): number {
  const R = 6371e3;
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
