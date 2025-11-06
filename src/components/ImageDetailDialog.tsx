import { useState, useEffect } from 'react';
import { X, Calendar, Link as LinkIcon, Save, FolderOpen, Tag, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GalleryImage } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImageDetailDialogProps {
  image: GalleryImage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (image: GalleryImage) => void;
}

// サジェスト用の既存タグ（実際のアプリでは既存のタグから生成）
const suggestedTags = ['Web', 'UI', 'Logo', 'Typography', '配色', 'レイアウト', 'モダン', 'ミニマル'];
const collections = ['LPデザイン集', 'ロゴアイデア', 'UI参考', '配色サンプル'];

export function ImageDetailDialog({ image, open, onOpenChange, onSave }: ImageDetailDialogProps) {
  const [editedMemo, setEditedMemo] = useState(image.memo || '');
  const [editedSourceUrl, setEditedSourceUrl] = useState(image.sourceUrl || '');
  const [editedTags, setEditedTags] = useState<string[]>(image.tags);
  const [editedCollection, setEditedCollection] = useState(image.collection || '');
  const [newTag, setNewTag] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedMemo(image.memo || '');
    setEditedSourceUrl(image.sourceUrl || '');
    setEditedTags(image.tags);
    setEditedCollection(image.collection || '');
    setHasChanges(false);
  }, [image, open]);

  useEffect(() => {
    const memoChanged = editedMemo !== (image.memo || '');
    const urlChanged = editedSourceUrl !== (image.sourceUrl || '');
    const tagsChanged = JSON.stringify(editedTags) !== JSON.stringify(image.tags);
    const collectionChanged = editedCollection !== (image.collection || '');
    setHasChanges(memoChanged || urlChanged || tagsChanged || collectionChanged);
  }, [editedMemo, editedSourceUrl, editedTags, editedCollection, image]);

  const handleSave = () => {
    onSave({
      ...image,
      memo: editedMemo,
      sourceUrl: editedSourceUrl,
      tags: editedTags,
      collection: editedCollection
    });
    setHasChanges(false);
  };

  const addTag = (tag: string) => {
    if (tag && !editedTags.includes(tag)) {
      setEditedTags([...editedTags, tag]);
    }
    setNewTag('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

  const filteredSuggestions = suggestedTags.filter(
    tag => !editedTags.includes(tag) && tag.toLowerCase().includes(newTag.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between z-10">
          <DialogTitle className="text-gray-900">{image.title}</DialogTitle>
          <DialogDescription className="sr-only">
            画像の詳細情報とメモを表示・編集するダイアログ
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* 左側: 画像 */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden bg-gray-50">
              <ImageWithFallback
                src={image.url}
                alt={image.title}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* 右側: メタデータとメモ */}
          <div className="space-y-6">
            {/* メタデータセクション */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">参考にした日</span>
                </div>
                <p className="text-gray-900">
                  {new Date(image.date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  }).replace(/\//g, '.')}
                </p>
              </div>

              <div>
                <Label htmlFor="sourceUrl" className="flex items-center gap-2 text-gray-500 mb-2">
                  <LinkIcon className="w-4 h-4" />
                  <span className="text-sm">ソースURL</span>
                </Label>
                <Input
                  id="sourceUrl"
                  type="url"
                  placeholder="https://example.com"
                  value={editedSourceUrl}
                  onChange={(e) => setEditedSourceUrl(e.target.value)}
                  className="bg-gray-50 border-gray-200"
                />
                {editedSourceUrl && (
                  <a
                    href={editedSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                  >
                    リンクを開く →
                  </a>
                )}
              </div>

              {/* タグ入力欄（サジェスト機能付き） */}
              <div>
                <Label className="flex items-center gap-2 text-gray-500 mb-2">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm">タグ</span>
                </Label>
                <div className="space-y-2">
                  <div className="flex gap-2 flex-wrap">
                    {editedTags.map(tag => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-gray-50 text-gray-700 border-gray-200 cursor-pointer hover:bg-gray-100"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <Input
                      placeholder="タグを入力..."
                      value={newTag}
                      onChange={(e) => {
                        setNewTag(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTag.trim()) {
                          e.preventDefault();
                          addTag(newTag.trim());
                        }
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="bg-gray-50 border-gray-200"
                    />
                    
                    {/* サジェスト */}
                    {showSuggestions && filteredSuggestions.length > 0 && newTag && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredSuggestions.map(tag => (
                          <button
                            key={tag}
                            onClick={() => addTag(tag)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-gray-700"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-400">
                    タグをクリックして削除、Enterで追加
                  </p>
                </div>
              </div>

              {/* コレクション（フォルダ）機能 */}
              <div>
                <Label htmlFor="collection" className="flex items-center gap-2 text-gray-500 mb-2">
                  <FolderOpen className="w-4 h-4" />
                  <span className="text-sm">コレクションに追加</span>
                </Label>
                <Select value={editedCollection || 'none'} onValueChange={(value) => setEditedCollection(value === 'none' ? '' : value)}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="コレクションを選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">なし</SelectItem>
                    {collections.map(collection => (
                      <SelectItem key={collection} value={collection}>
                        {collection}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* メモ・アイデア入力欄 */}
            <div className="border-t border-gray-100 pt-6">
              <Label htmlFor="memo" className="mb-3 block">
                アイデアメモ
              </Label>
              <Textarea
                id="memo"
                placeholder="このグラデーションの使い方を参考にしたい&#10;ボタンの配置が秀逸&#10;配色が美しい..."
                value={editedMemo}
                onChange={(e) => setEditedMemo(e.target.value)}
                rows={8}
                className="bg-gray-50 border-gray-200 resize-none"
              />
              <p className="text-xs text-gray-400 mt-2">
                このデザインについて気づいたことや、後で参考にしたいポイントを記録できます
              </p>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex-1 bg-gray-900 hover:bg-gray-800 gap-2"
              >
                <Save className="w-4 h-4" />
                保存する
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                閉じる
              </Button>
            </div>
            
            {hasChanges && (
              <p className="text-xs text-amber-600 text-center">
                変更が保存されていません
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}