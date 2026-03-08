import { useState } from 'react';
import { MapPin, Clock, Star, TrendingUp } from 'lucide-react';
import { Place, SortOption } from '../types';

interface PlacesListProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  loading: boolean;
  //rerouteData: RerouteData;
}

export default function PlacesList({ places, selectedPlace, onPlaceSelect, loading/*, rerouteData*/ }: PlacesListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('distance');

  const sortedPlaces = [...places].sort((a, b) => {

    //const ra = reroutes.find(r => r.placeId === a.place_id);
    //const rb = reroutes.find(r => r.placeId === b.place_id);

    switch (sortBy) {
      case 'distance':
        //return a.distanceFromRoute - b.distanceFromRoute;
        return a.additionalDistance - b.additionalDistance;

      /*const da = ra?.additionalDistance ?? Infinity;
      const db = rb?.additionalDistance ?? Infinity;
      return da - db;*/

      case 'time':
        return a.additionalTime - b.additionalTime;

      /*const ta = ra?.additionalTime ?? Infinity;
      const tb = rb?.additionalTime ?? Infinity;
      return ta - tb;*/

      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">検索結果がありません</p>
        <p className="text-sm text-gray-400 text-center mt-2">検索範囲を広げるか、別のキーワードをお試しください</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            検索結果 ({places.length}件)
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('distance')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'distance'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <MapPin className="inline w-4 h-4 mr-1" />
            距離順
          </button>
          <button
            onClick={() => setSortBy('time')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'time'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <Clock className="inline w-4 h-4 mr-1" />
            時間順
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'rating'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <Star className="inline w-4 h-4 mr-1" />
            評価順
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[500px]">
        {sortedPlaces.map((place) => {
          const isSelected = selectedPlace?.place_id === place.place_id;
          return (
            <div
              key={place.place_id}
              onClick={() => onPlaceSelect(place)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'
                }`}
            >
              <h4 className="font-semibold text-gray-800 mb-1">{place.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{place.formatted_address}</p>

              <div className="flex flex-wrap gap-3 text-sm">
                {place.rating && (
                  <div className="flex items-center text-amber-600">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span>{place.rating}</span>
                    {place.user_ratings_total && (
                      <span className="text-gray-500 ml-1">({place.user_ratings_total})</span>
                    )}
                  </div>
                )}

                {/*<div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{place.distanceFromRoute}m</span>
                </div>*/}

                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>+{Math.round(place.additionalTime / 60)}分</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+{(place.additionalDistance / 1000).toFixed(1)}km</span>
                </div>
              </div>

              {isSelected && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <p className="text-xs text-blue-700 font-medium">
                    この店舗を経由するルートを表示中
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
