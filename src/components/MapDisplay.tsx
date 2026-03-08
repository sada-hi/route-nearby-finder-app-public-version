import { useEffect, useRef } from 'react';
import { Place, RouteData } from '../types';

interface MapDisplayProps {
  routeData: RouteData | null;
  places: Place[];
  selectedPlace: Place | null;
  reroutePolyline: string | null;
  onPlaceSelect: (place: Place) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function MapDisplay({
  routeData,
  places,
  selectedPlace,
  reroutePolyline,
  onPlaceSelect,
}: MapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const originalPolylineRef = useRef<any>(null);
  const reroutePolylineRef = useRef<any>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
      return;
    }

    if (!window.google) {
      const script = document.createElement('script');
      //script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        initializeMap();
      };
    } else {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && routeData) { //ルートを表示する部分
      updateMap();
    }
  }, [routeData, places, selectedPlace, reroutePolyline]);

  const initializeMap = () => {
    if (mapRef.current && window.google) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 35.6762, lng: 139.6503 },
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: false,
      });
    }
  };

  const updateMap = () => {
    /*if (!routeData?.polyline) {
      console.warn("Polyline が存在しません:", routeData);
      return;
    }*/

    if (!mapInstanceRef.current || !window.google) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (originalPolylineRef.current) {
      originalPolylineRef.current.setMap(null);
    }
    if (reroutePolylineRef.current) {
      reroutePolylineRef.current.setMap(null);
    }

    if (routeData) {
      const path = window.google.maps.geometry.encoding.decodePath(routeData.polyline);

      originalPolylineRef.current = new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: reroutePolyline ? '#9CA3AF' : '#3B82F6',
        strokeOpacity: reroutePolyline ? 0.5 : 1.0,
        strokeWeight: reroutePolyline ? 3 : 5,
      });
      originalPolylineRef.current.setMap(mapInstanceRef.current);

      if (reroutePolyline) {
        const reroutePath = window.google.maps.geometry.encoding.decodePath(reroutePolyline);
        reroutePolylineRef.current = new window.google.maps.Polyline({
          path: reroutePath,
          geodesic: true,
          strokeColor: '#10B981',
          strokeOpacity: 1.0,
          strokeWeight: 5,
        });
        reroutePolylineRef.current.setMap(mapInstanceRef.current);
      }

      const bounds = new window.google.maps.LatLngBounds();
      path.forEach((point: any) => bounds.extend(point));

      places.forEach(place => {
        bounds.extend(new window.google.maps.LatLng(place.location.lat, place.location.lng));
      });

      mapInstanceRef.current.fitBounds(bounds);
    }

    places.forEach(place => {
      const isSelected = selectedPlace?.place_id === place.place_id;

      const marker = new window.google.maps.Marker({
        position: place.location,
        map: mapInstanceRef.current,
        title: place.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 10 : 7,
          fillColor: isSelected ? '#10B981' : '#EF4444',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${place.name}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${place.formatted_address}</p>
            ${place.rating ? `<p style="font-size: 12px;">評価: ⭐ ${place.rating} (${place.user_ratings_total || 0}件)</p>` : ''}
            <p style="font-size: 12px; margin-top: 4px;">
              <!--
              <strong>ルートからの距離:</strong> ${place.distanceFromRoute}m<br>
              -->
              <strong>追加距離:</strong> +${(place.additionalDistance / 1000).toFixed(1)}km<br>
              <strong>追加時間:</strong> +${Math.round(place.additionalTime / 60)}分
            </p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        onPlaceSelect(place);
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-8">
          <p className="text-gray-600 mb-2">Google Maps APIキーが設定されていません</p>
          <p className="text-sm text-gray-500">.envファイルにVITE_GOOGLE_MAPS_API_KEYを設定してください</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg shadow-md" />
  );
}
