import { useState } from 'react';
import { Plus, Moon, Sun, Link } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface HeaderProps {
  onUploadClick: () => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  onImportFromUrl: (url: string) => void;
}

export function Header({ 
  onUploadClick,
  isDarkMode,
  onDarkModeToggle,
  onImportFromUrl
}: HeaderProps) {
  const [importUrl, setImportUrl] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleImport = () => {
    if (importUrl.trim()) {
      onImportFromUrl(importUrl);
      setImportUrl('');
      setIsPopoverOpen(false);
    }
  };

  return (
    <header className={`border-b sticky top-0 z-50 ${
      isDarkMode 
        ? 'border-gray-800 bg-gray-900' 
        : 'border-gray-100 bg-white'
    }`}>
      <div className="max-w-[1400px] mx-auto px-8 py-6 flex items-center justify-between gap-8">
        <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>
          My Design Clips
        </h1>
        
        <div className="flex items-center gap-3">
          {/* URLからインポート */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`gap-2 ${
                  isDarkMode
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Link className="w-4 h-4" />
                URLからインポート
              </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
              <div className="space-y-3">
                <div>
                  <h4 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    画像URLをペースト
                  </h4>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleImport()}
                    className={isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : ''}
                  />
                </div>
                <Button 
                  onClick={handleImport}
                  disabled={!importUrl.trim()}
                  className="w-full"
                >
                  インポート
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* ダークモード切り替え */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onDarkModeToggle}
            className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <Button 
            onClick={onUploadClick}
            className={`gap-2 ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            アップロード
          </Button>
        </div>
      </div>
    </header>
  );
}
