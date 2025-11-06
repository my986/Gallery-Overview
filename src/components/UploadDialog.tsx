import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Upload, X } from 'lucide-react';
import { GalleryImage } from '../App';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (image: Omit<GalleryImage, 'id'>) => void;
  availableTags: string[];
}

export function UploadDialog({ open, onOpenChange, onUpload, availableTags }: UploadDialogProps) {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    memo: '',
    sourceUrl: '',
    selectedTags: [] as string[]
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.url || !formData.title || formData.selectedTags.length === 0) {
      return;
    }

    onUpload({
      url: formData.url,
      title: formData.title,
      memo: formData.memo,
      sourceUrl: formData.sourceUrl,
      tags: formData.selectedTags,
      date: new Date().toISOString().split('T')[0]
    });

    // フォームをリセット
    setFormData({
      url: '',
      title: '',
      memo: '',
      sourceUrl: '',
      selectedTags: []
    });
    
    onOpenChange(false);
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      // 実際のアプリケーションではここでファイルをアップロードします
      // 今回はデモとしてファイル名をタイトルに設定
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({
            ...prev,
            url: event.target!.result as string,
            title: imageFile.name.replace(/\.[^/.]+$/, '')
          }));
        }
      };
      reader.readAsDataURL(imageFile);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>画像をアップロード</DialogTitle>
          <DialogDescription className="sr-only">
            新しい画像をギャラリーに追加するフォーム
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ドラッグ&ドロップゾーン */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${
              isDragging ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <p className="text-gray-600 mb-2">
              画像をドラッグ&ドロップ
            </p>
            <p className="text-sm text-gray-400">
              または下のフォームにURLを入力してください
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">画像URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">タイトル *</Label>
            <Input
              id="title"
              type="text"
              placeholder="例: Modern Web Design"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceUrl">ソースURL（任意）</Label>
            <Input
              id="sourceUrl"
              type="url"
              placeholder="https://example.com"
              value={formData.sourceUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">メモ（任意）</Label>
            <Textarea
              id="memo"
              placeholder="この画像についてのメモを記入..."
              value={formData.memo}
              onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>タグを選択 *</Label>
            <div className="flex gap-2 flex-wrap">
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={formData.selectedTags.includes(tag) ? 'default' : 'outline'}
                  className={`cursor-pointer px-3 py-1 transition-all ${
                    formData.selectedTags.includes(tag)
                      ? 'bg-gray-900 hover:bg-gray-800 text-white'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800"
              disabled={!formData.url || !formData.title || formData.selectedTags.length === 0}
            >
              アップロード
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
