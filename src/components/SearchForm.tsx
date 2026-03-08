import { useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';

interface SearchFormProps {
  onSearch: (start: string, end: string, keyword: string, range: number) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [keyword, setKeyword] = useState('');
  const [range, setRange] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (start && end && keyword) {
      onSearch(start, end, keyword, range);
    }
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStart(`${position.coords.latitude},${position.coords.longitude}`);
        },
        (error) => {
          alert('現在地の取得に失敗しました');
          console.error(error);
        }
      );
    } else {
      alert('お使いのブラウザは位置情報に対応していません');
    }
  };

  //console.log(start,end);
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">ルート周辺検索</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            出発地
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="住所または緯度,経度"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={useCurrentLocation}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="現在地を使用"
            >
              <Navigation className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            目的地
          </label>
          <input
            type="text"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            placeholder="住所または緯度,経度"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Search className="inline w-4 h-4 mr-1" />
            検索ワード
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="例: ラーメン、コンビニ、温泉など"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            検索範囲: {range}m
          </label>
          <input
            type="range"
            min="100"
            max="3000"
            step="50"
            value={range}
            onChange={(e) => setRange(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>100m</span>
            <span>3000m</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? '検索中...' : '検索'}
        </button>
      </form>
    </div>
  );
}
