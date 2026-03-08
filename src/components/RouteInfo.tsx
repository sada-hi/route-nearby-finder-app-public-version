import { Clock, TrendingUp, Navigation } from 'lucide-react';
import { RouteData, RerouteData } from '../types';

interface RouteInfoProps {
  originalRoute: RouteData | null;
  rerouteData: RerouteData | null;
}

export default function RouteInfo({ originalRoute, rerouteData }: RouteInfoProps) {
  if (!originalRoute) return null;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    }
    return `${minutes}分`;
  };

  const formatDistance = (meters: number) => {
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">ルート情報</h3>

      <div className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600 mb-2 font-medium">元のルート</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span>{formatDistance(originalRoute.distance)}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="w-4 h-4 mr-2" />
              <span>{formatDuration(originalRoute.duration)}</span>
            </div>
          </div>
        </div>

        {rerouteData && (
          <>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-sm text-green-800 mb-2 font-medium">経由ルート</p>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-green-700">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>{formatDistance(rerouteData.newDistance)}</span>
                </div>
                <div className="flex items-center text-green-700">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{formatDuration(rerouteData.newDuration)}</span>
                </div>
              </div>
              <div className="flex items-center text-green-700">
                <Navigation className="w-4 h-4 mr-2" />
                <span>到着予定: {rerouteData.newArrivalTime}</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-blue-800 mb-2 font-medium">差分</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">追加距離:</span>
                  <span className={`font-medium ${rerouteData.additionalDistance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {rerouteData.additionalDistance > 0 ? '+' : ''}{formatDistance(rerouteData.additionalDistance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">追加時間:</span>
                  <span className={`font-medium ${rerouteData.additionalTime > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {rerouteData.additionalTime > 0 ? '+' : ''}{Math.round(rerouteData.additionalTime / 60)}分
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
