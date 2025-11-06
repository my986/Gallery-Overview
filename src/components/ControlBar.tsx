import { Search, Grid3x3, LayoutGrid } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ControlBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  sortBy: 'newest' | 'favorite' | 'updated';
  onSortChange: (sort: 'newest' | 'favorite' | 'updated') => void;
  viewSize: 'small' | 'medium' | 'large';
  onViewSizeChange: (size: 'small' | 'medium' | 'large') => void;
  layoutMode: 'masonry' | 'grid';
  onLayoutModeChange: (mode: 'masonry' | 'grid') => void;
  isDarkMode: boolean;
}

const colors = [
  { name: 'すべて', value: 'all', color: '' },
  { name: '赤', value: 'red', color: '#EF4444' },
  { name: '青', value: 'blue', color: '#3B82F6' },
  { name: '緑', value: 'green', color: '#10B981' },
  { name: '黄', value: 'yellow', color: '#F59E0B' },
  { name: '紫', value: 'purple', color: '#A855F7' },
  { name: '黒', value: 'black', color: '#1F2937' },
];

export function ControlBar({
  searchQuery,
  onSearchChange,
  selectedColor,
  onColorChange,
  sortBy,
  onSortChange,
  viewSize,
  onViewSizeChange,
  layoutMode,
  onLayoutModeChange,
  isDarkMode
}: ControlBarProps) {
  return (
    <div className={`border-b sticky top-[73px] z-40 ${
      isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'
    }`}>
      <div className="max-w-[1400px] mx-auto px-8 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* 検索バー */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <Input
              type="text"
              placeholder="キーワードで検索..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`pl-10 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            />
          </div>

          {/* 色フィルター */}
          <div className="flex items-center gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => onColorChange(color.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color.value
                    ? 'border-gray-900 dark:border-white scale-110'
                    : isDarkMode
                      ? 'border-gray-700 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{
                  backgroundColor: color.color || (isDarkMode ? '#374151' : '#F3F4F6')
                }}
                title={color.name}
              />
            ))}
          </div>

          {/* 並び替え */}
          <Select value={sortBy} onValueChange={(value: any) => onSortChange(value)}>
            <SelectTrigger className={`w-[160px] ${
              isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'
            }`}>
              <SelectValue placeholder="並び替え" />
            </SelectTrigger>
            <SelectContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <SelectItem value="newest">新しい順</SelectItem>
              <SelectItem value="favorite">お気に入り順</SelectItem>
              <SelectItem value="updated">更新順</SelectItem>
            </SelectContent>
          </Select>

          {/* レイアウト切り替え */}
          <div className={`flex items-center gap-1 p-1 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onLayoutModeChange('masonry')}
              className={`w-8 h-8 ${
                layoutMode === 'masonry'
                  ? isDarkMode 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-white text-gray-900 shadow-sm'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onLayoutModeChange('grid')}
              className={`w-8 h-8 ${
                layoutMode === 'grid'
                  ? isDarkMode 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-white text-gray-900 shadow-sm'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>

          {/* 表示サイズ切り替え */}
          <div className={`flex items-center gap-1 p-1 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            {(['small', 'medium', 'large'] as const).map((size) => (
              <Button
                key={size}
                variant="ghost"
                size="sm"
                onClick={() => onViewSizeChange(size)}
                className={`text-xs px-3 ${
                  viewSize === size
                    ? isDarkMode 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-white text-gray-900 shadow-sm'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
