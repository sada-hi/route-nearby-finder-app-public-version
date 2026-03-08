export interface LatLng {
  lat: number;
  lng: number;
}

export interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  location: LatLng;
  distanceFromRoute: number;
  additionalTime: number;
  additionalDistance: number;
}

export interface RouteData {
  route: any;
  distance: number;
  duration: number;
  polyline: string;
  bounds: any;
}

export interface RerouteData {
  //placeId: string;
  newRoute: any;
  newDistance: number;
  newDuration: number;
  additionalDistance: number;
  additionalTime: number;
  newArrivalTime: string;
  polyline: string;
}

export type SortOption = 'distance' | 'time' | 'rating';
