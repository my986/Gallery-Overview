import Masonry from 'react-responsive-masonry';
import { ImageCard } from './ImageCard';
import { GalleryImage } from '../App';

interface ImageGalleryProps {
  images: GalleryImage[];
  onUpdateImage: (image: GalleryImage) => void;
  onToggleFavorite: (imageId: string) => void;
  layoutMode: 'masonry' | 'grid';
  viewSize: 'small' | 'medium' | 'large';
  isDarkMode: boolean;
}

export function ImageGallery({ images, onUpdateImage, onToggleFavorite, layoutMode, viewSize, isDarkMode }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <p className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
          該当する画像が見つかりませんでした
        </p>
      </div>
    );
  }

  const getGridCols = () => {
    if (viewSize === 'small') return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4';
    if (viewSize === 'medium') return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2';
  };

  const getColumnCount = () => {
    if (viewSize === 'small') return 4;
    if (viewSize === 'medium') return 3;
    return 2;
  };

  if (layoutMode === 'grid') {
    return (
      <div className={`grid ${getGridCols()} gap-6`}>
        {images.map(image => (
          <ImageCard 
            key={image.id} 
            image={image} 
            onUpdateImage={onUpdateImage} 
            onToggleFavorite={onToggleFavorite}
            viewSize={viewSize}
            isDarkMode={isDarkMode} 
          />
        ))}
      </div>
    );
  }

  return (
    <Masonry columnsCount={getColumnCount()} gutter="24px">
      {images.map(image => (
        <ImageCard 
          key={image.id} 
          image={image} 
          onUpdateImage={onUpdateImage}
          onToggleFavorite={onToggleFavorite}
          viewSize={viewSize}
          isDarkMode={isDarkMode} 
        />
      ))}
    </Masonry>
  );
}