import { useState } from 'react';
import SearchForm from './components/SearchForm';
import MapDisplay from './components/MapDisplay';
import PlacesList from './components/PlacesList';
import RouteInfo from './components/RouteInfo';
import { routeApi } from './services/api';
import { Place, RouteData, RerouteData } from './types';
import { Map } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [rerouteData, setRerouteData] = useState<RerouteData | null>(null);
  const [searchParams, setSearchParams] = useState<{ start: string; end: string } | null>(null);

  const handleSearch = async (start: string, end: string, keyword: string, range: number) => {
    //console.log(start,end,keyword);
    setLoading(true);
    setSelectedPlace(null);
    setRerouteData(null);
    setPlaces([]);

    try {
      console.log('Fetching route...');
      const route = await routeApi.getRoute(start, end);
      console.log('Route fetched:', route);
      //const route = await routeApi.getRoute(start, end);
      //console.log(route);
      setRouteData(route);
      setSearchParams({ start, end });
      //console.log(route);
      const placesResult = await routeApi.searchPlaces(
        route.polyline,
        keyword,
        range,
        start,
        end,
        route.distance,
        route.duration
      );
      setPlaces(placesResult.places);
    } catch (error) {
      console.error('Search error:', error);
      alert('検索中にエラーが発生しました。入力内容を確認してください。');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSelect = async (place: Place) => {
    setSelectedPlace(place);

    if (searchParams && routeData) {
      try {
        const waypoint = `${place.location.lat},${place.location.lng}`;
        const reroute = await routeApi.getReroute( //この部分でrerouteの計算が始まっている
          searchParams.start,
          searchParams.end,
          waypoint,
          routeData.distance,
          routeData.duration
        );
        setRerouteData(reroute);
      } catch (error) {
        console.error('Reroute error:', error);
        alert('経由ルートの計算中にエラーが発生しました。');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">RouteNearbyFinder</h1>
              <p className="text-sm text-gray-600">ルート周辺検索マップ</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <SearchForm onSearch={handleSearch} loading={loading} />
            {routeData && <RouteInfo originalRoute={routeData} rerouteData={rerouteData} />}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '500px' }}>
              <MapDisplay
                routeData={routeData}
                places={places}
                selectedPlace={selectedPlace}
                reroutePolyline={rerouteData?.polyline || null}
                onPlaceSelect={handlePlaceSelect}
              />
            </div>

            <PlacesList
              places={places}
              selectedPlace={selectedPlace}
              onPlaceSelect={handlePlaceSelect}
              loading={loading}
            //rerouteData={rerouteData}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>RouteNearbyFinder - ルート周辺の施設を簡単検索</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
