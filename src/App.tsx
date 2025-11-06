import { useState } from 'react';
import { Header } from './components/Header';
import { ControlBar } from './components/ControlBar';
import { TagFilter } from './components/TagFilter';
import { ImageGallery } from './components/ImageGallery';
import { Footer } from './components/Footer';
import { UploadDialog } from './components/UploadDialog';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  tags: string[];
  date: string;
  memo?: string;
  sourceUrl?: string;
  isFavorite?: boolean;
  color?: string;
  collection?: string;
}

// サンプルデータ
const sampleImages: GalleryImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1677214467820-ab069619bbb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWIlMjBkZXNpZ258ZW58MXx8fHwxNzYyMzU3NjY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Modern Web Design',
    tags: ['Web', 'UI'],
    date: '2024-11-01',
    memo: 'Clean and minimal homepage design',
    isFavorite: false,
    color: 'blue',
    collection: 'LPデザイン集'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1719996540227-76fee77f0460?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0eXBvZ3JhcGh5JTIwcG9zdGVyfGVufDF8fHx8MTc2MjMzNTEwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Typography Example',
    tags: ['Typography'],
    date: '2024-11-02',
    memo: 'Beautiful font pairing',
    isFavorite: true,
    color: 'yellow'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1756510473714-567691ff8a2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbG9nb3xlbnwxfHx8fDE3NjIzODU1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Logo Inspiration',
    tags: ['Logo'],
    date: '2024-11-03',
    memo: 'Minimalist logo design',
    isFavorite: false,
    color: 'black',
    collection: 'ロゴアイデア'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1615387000571-bdcfe92eb67c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1aSUyMGRlc2lnbiUyMGNvbXBvbmVudHN8ZW58MXx8fHwxNzYyNDQwMTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'UI Components',
    tags: ['UI'],
    date: '2024-11-04',
    memo: 'Card components collection',
    isFavorite: true,
    color: 'purple'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwbGF5b3V0fGVufDF8fHx8MTc2MjMzMDg2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Web Layout',
    tags: ['Web', 'UI'],
    date: '2024-11-05',
    memo: 'Grid-based layout system',
    isFavorite: false,
    color: 'green'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1716471330463-f475b00f0506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGRlc2lnbnxlbnwxfHx8fDE3NjI0MTI5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Brand Design',
    tags: ['Logo', 'Typography'],
    date: '2024-11-06',
    memo: 'Corporate branding elements',
    isFavorite: false,
    color: 'red'
  }
];

function App() {
  const [images, setImages] = useState<GalleryImage[]>(sampleImages);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'masonry' | 'grid'>('masonry');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'favorite' | 'updated'>('newest');
  const [viewSize, setViewSize] = useState<'small' | 'medium' | 'large'>('medium');

  // 全てのタグを収集
  const allTags = ['All', ...Array.from(new Set(images.flatMap(img => img.tags)))];

  // フィルタリングロジック
  const filteredImages = images.filter(img => {
    const matchesTag = selectedTag === 'All' || img.tags.includes(selectedTag);
    const matchesSearch = searchQuery === '' || 
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.memo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesColor = selectedColor === 'all' || img.color === selectedColor;
    
    return matchesTag && matchesSearch && matchesColor;
  });

  // 並び替えロジック
  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'favorite') {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });

  const handleAddImage = (newImage: Omit<GalleryImage, 'id'>) => {
    const image: GalleryImage = {
      ...newImage,
      id: Date.now().toString()
    };
    setImages([image, ...images]);
    toast.success('画像をアップロードしました');
  };

  const handleUpdateImage = (updatedImage: GalleryImage) => {
    setImages(images.map(img => (img.id === updatedImage.id ? updatedImage : img)));
    toast.success('メモを保存しました');
  };

  const handleToggleFavorite = (imageId: string) => {
    setImages(images.map(img => {
      if (img.id === imageId) {
        const newFavorite = !img.isFavorite;
        toast.success(newFavorite ? 'お気に入りに追加しました' : 'お気に入りから削除しました');
        return { ...img, isFavorite: newFavorite };
      }
      return img;
    }));
  };

  const handleImportFromUrl = (url: string) => {
    const newImage: GalleryImage = {
      id: Date.now().toString(),
      url,
      title: 'Imported Image',
      tags: ['Web'],
      date: new Date().toISOString().split('T')[0],
      isFavorite: false
    };
    setImages([newImage, ...images]);
    toast.success('URLから画像をインポートしました');
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <Header 
        onUploadClick={() => setIsUploadDialogOpen(true)}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
        onImportFromUrl={handleImportFromUrl}
      />
      
      <ControlBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewSize={viewSize}
        onViewSizeChange={setViewSize}
        layoutMode={layoutMode}
        onLayoutModeChange={setLayoutMode}
        isDarkMode={isDarkMode}
      />
      
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-8">
        <TagFilter 
          tags={allTags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
          isDarkMode={isDarkMode}
        />
        
        <ImageGallery 
          images={sortedImages} 
          onUpdateImage={handleUpdateImage}
          onToggleFavorite={handleToggleFavorite}
          layoutMode={layoutMode}
          viewSize={viewSize}
          isDarkMode={isDarkMode}
        />
      </main>

      <Footer isDarkMode={isDarkMode} />

      <UploadDialog 
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onUpload={handleAddImage}
        availableTags={allTags.filter(tag => tag !== 'All')}
      />

      <Toaster richColors position="bottom-right" />
    </div>
  );
}

export default App;