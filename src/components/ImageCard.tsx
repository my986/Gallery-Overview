import { useState } from 'react';
import { Eye, Calendar, Heart, Pencil } from 'lucide-react';
import { GalleryImage } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ImageDetailDialog } from './ImageDetailDialog';
import { QuickEditDialog } from './QuickEditDialog';

interface ImageCardProps {
  image: GalleryImage;
  onUpdateImage: (image: GalleryImage) => void;
  onToggleFavorite: (imageId: string) => void;
  viewSize: 'small' | 'medium' | 'large';
  isDarkMode: boolean;
}

export function ImageCard({ image, onUpdateImage, onToggleFavorite, viewSize, isDarkMode }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);

  const getAspectRatio = () => {
    if (viewSize === 'small') return 'aspect-square';
    if (viewSize === 'medium') return 'aspect-[4/3]';
    return 'aspect-[16/9]';
  };

  return (
    <>
      <div
        className={`group relative rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative overflow-hidden ${getAspectRatio()}`}>
          <ImageWithFallback
            src={image.url}
            alt={image.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          
          {/* お気に入りボタン */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(image.id);
            }}
            className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
              image.isFavorite
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${image.isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          {/* ホバーオーバーレイ */}
          <div
            className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity duration-300 pointer-events-none ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailOpen(true);
              }}
              className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform pointer-events-auto"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-xs">詳細</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsQuickEditOpen(true);
              }}
              className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform pointer-events-auto"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Pencil className="w-5 h-5" />
              </div>
              <span className="text-xs">編集</span>
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className={`mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {image.title}
          </h3>
          
          {viewSize !== 'small' && image.memo && (
            <p className={`text-sm mb-3 line-clamp-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {image.memo}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {image.tags.slice(0, viewSize === 'small' ? 1 : 2).map(tag => (
                <span 
                  key={tag}
                  className={`text-xs px-2 py-1 rounded ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tag}
                </span>
              ))}
              {image.tags.length > (viewSize === 'small' ? 1 : 2) && (
                <span className={`text-xs px-2 py-1 rounded ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  +{image.tags.length - (viewSize === 'small' ? 1 : 2)}
                </span>
              )}
            </div>
            
            {viewSize !== 'small' && (
              <div className={`flex items-center gap-1 text-xs ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <Calendar className="w-3 h-3" />
                <span>{new Date(image.date).toLocaleDateString('ja-JP')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ImageDetailDialog
        image={image}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onSave={onUpdateImage}
      />

      <QuickEditDialog
        image={image}
        open={isQuickEditOpen}
        onOpenChange={setIsQuickEditOpen}
        onSave={onUpdateImage}
      />
    </>
  );
}