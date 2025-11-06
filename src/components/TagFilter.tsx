import { Badge } from './ui/badge';

interface TagFilterProps {
  tags: string[];
  selectedTag: string;
  onTagSelect: (tag: string) => void;
  isDarkMode: boolean;
}

export function TagFilter({ tags, selectedTag, onTagSelect, isDarkMode }: TagFilterProps) {
  return (
    <div className="mb-12 flex items-center gap-3 flex-wrap">
      {tags.map(tag => (
        <Badge
          key={tag}
          variant={selectedTag === tag ? 'default' : 'outline'}
          className={`cursor-pointer px-4 py-2 transition-all ${
            selectedTag === tag 
              ? isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                : 'bg-gray-900 hover:bg-gray-800 text-white' 
              : isDarkMode
                ? 'bg-gray-800 hover:bg-gray-750 text-gray-300 border-gray-700'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
          }`}
          onClick={() => onTagSelect(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
