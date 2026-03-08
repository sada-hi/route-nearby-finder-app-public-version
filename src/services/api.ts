import axios from 'axios';
import { RouteData, Place, RerouteData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const routeApi = {
  /*async getRoute(start: string, end: string): Promise<RouteData> {
    const response = await axios.get(`${API_BASE_URL}/route`, {
      params: { start, end },
    }).catch((e) => {
      console.log(e)
    });
    return response.data;
    
  },*/
  async getRoute(start: string, end: string): Promise<RouteData> {
    //console.log(start,end);
    try {
      const response = await axios.get<RouteData>(`${API_BASE_URL}/route`, {
        params: { start, end },
      });
      return response.data;
    } catch (e) {
      console.error(e);
      throw e; // または return デフォルト値
    }
  },


  async searchPlaces(
    polyline: string,
    keyword: string,
    range: number,
    start?: string,
    end?: string,
    originalDistance?: number,
    originalDuration?: number
  ): Promise<{ places: Place[]; count: number }> {
    //console.log(polyline,keyword);
    const response = await axios.get(`${API_BASE_URL}/places`, {
      params: {
        polyline,
        keyword,
        range,
        start,
        end,
        originalDistance,
        originalDuration
      },
    });
    return response.data;
  },

  async getReroute(
    start: string,
    end: string,
    waypoint: string,
    originalDistance: number,
    originalDuration: number
  ): Promise<RerouteData> {
    const response = await axios.get(`${API_BASE_URL}/reroute`, {
      params: {
        start,
        end,
        waypoint,
        originalDistance,
        originalDuration,
      },
    });
    return response.data;
  },
};

/*import axios from 'axios';
import { RouteData, Place, RerouteData } from '../types';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DIRECTIONS_URL = 'https://maps.googleapis.com/maps/api/directions/json';
const PLACES_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

export const routeApi = {
  // --- 経路検索 ---
  async getRoute(start: string, end: string): Promise<RouteData> {
    const response = await axios.get(DIRECTIONS_URL, {
      params: {
        origin: start,
        destination: end,
        key: GOOGLE_API_KEY,
      },
    });

    const route = response.data.routes?.[0];
    if (!route) throw new Error('ルートが見つかりません');

    return {
      distance: route.legs[0].distance.value,
      duration: route.legs[0].duration.value,
      polyline: route.overview_polyline.points,
    };
  },

  // --- 指定ポリライン付近のスポット検索 ---
  async searchPlaces(polyline: string, keyword: string, range: number): Promise<{ places: Place[]; count: number }> {
    // ポリラインの最初の座標を取得
    const decodePolyline = (encoded: string): { lat: number; lng: number }[] => {
      let index = 0, lat = 0, lng = 0;
      const coordinates = [];
      while (index < encoded.length) {
        let b, shift = 0, result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;
        shift = 0;
        result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;
        coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
      }
      return coordinates;
    };

    const coords = decodePolyline(polyline);
    const center = coords[Math.floor(coords.length / 2)];

    const response = await axios.get(PLACES_URL, {
      params: {
        location: `${center.lat},${center.lng}`,
        radius: range,
        keyword,
        key: GOOGLE_API_KEY,
      },
    });

    const places = response.data.results.map((p: any) => ({
      name: p.name,
      location: { lat: p.geometry.location.lat, lng: p.geometry.location.lng },
      address: p.vicinity,
    }));

    return { places, count: places.length };
  },

  // --- 経由地を含めたリルート ---
  async getReroute(
    start: string,
    end: string,
    waypoint: string,
    originalDistance: number,
    originalDuration: number
  ): Promise<RerouteData> {
    const response = await axios.get(DIRECTIONS_URL, {
      params: {
        origin: start,
        destination: end,
        waypoints: waypoint,
        key: GOOGLE_API_KEY,
      },
    });

    const route = response.data.routes?.[0];
    if (!route) throw new Error('リルートが見つかりません');

    const distance = route.legs.reduce((sum: number, leg: any) => sum + leg.distance.value, 0);
    const duration = route.legs.reduce((sum: number, leg: any) => sum + leg.duration.value, 0);

    return {
      distance,
      duration,
      addedDistance: distance - originalDistance,
      addedDuration: duration - originalDuration,
      polyline: route.overview_polyline.points,
    };
  },
};*/
