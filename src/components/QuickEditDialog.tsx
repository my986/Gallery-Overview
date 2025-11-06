import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { GalleryImage } from '../App';

interface QuickEditDialogProps {
  image: GalleryImage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (image: GalleryImage) => void;
}

export function QuickEditDialog({ image, open, onOpenChange, onSave }: QuickEditDialogProps) {
  const [editedTitle, setEditedTitle] = useState(image.title);
  const [editedMemo, setEditedMemo] = useState(image.memo || '');

  useEffect(() => {
    setEditedTitle(image.title);
    setEditedMemo(image.memo || '');
  }, [image, open]);

  const handleSave = () => {
    onSave({
      ...image,
      title: editedTitle,
      memo: editedMemo
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle>クイック編集</DialogTitle>
        <DialogDescription className="sr-only">
          画像のタイトルとメモを素早く編集
        </DialogDescription>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quick-title">タイトル</Label>
            <Input
              id="quick-title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-memo">メモ</Label>
            <Textarea
              id="quick-memo"
              value={editedMemo}
              onChange={(e) => setEditedMemo(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSave} className="bg-gray-900 hover:bg-gray-800">
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
