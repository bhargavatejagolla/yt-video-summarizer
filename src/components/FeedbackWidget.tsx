'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Edit2, X } from 'lucide-react';
import { useUser } from '@/lib/useUser';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Props {
  contentType: 'notes' | 'mcq' | 'flashcard' | 'revision' | 'chat_answer';
  contentId?: string;
  originalContent?: string;
  metadata?: Record<string, any>;
  onEdit?: (edited: string) => void;
}

export function FeedbackWidget({ contentType, contentId, originalContent, metadata, onEdit }: Props) {
  const userId = useUser();
  const [rated, setRated] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState('');

  const submitFeedback = async (rating: number) => {
    setRated(rating);
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        contentType,
        contentId,
        rating,
        originalContent,
        metadata,
      }),
    });
  };

  const handleSaveEdit = async () => {
    if (editedText.trim()) {
      // Store the edited version as the perfect output
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          contentType,
          contentId,
          rating: 5, // edited version is always considered perfect
          originalContent,
          editedContent: editedText,
          metadata,
        }),
      });
      if (onEdit) onEdit(editedText);
      setEditMode(false);
      setRated(5);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => submitFeedback(5)}
          disabled={rated !== null}
          className={cn('p-1.5 rounded-full hover:bg-slate-700 transition-colors', rated === 5 ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-400')}
          title="Good generation"
        >
          <ThumbsUp size={16} />
        </button>
        <button
          onClick={() => submitFeedback(1)}
          disabled={rated !== null}
          className={cn('p-1.5 rounded-full hover:bg-slate-700 transition-colors', rated === 1 ? 'text-red-400 bg-red-400/10' : 'text-slate-400')}
          title="Poor generation"
        >
          <ThumbsDown size={16} />
        </button>
        <button
          onClick={() => { setEditMode(!editMode); setEditedText(originalContent || ''); }}
          className={cn('p-1.5 rounded-full hover:bg-slate-700 transition-colors ml-2 flex items-center gap-1 text-xs', editMode ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400')}
          title="Edit this content"
        >
          {editMode ? <X size={14} /> : <Edit2 size={14} />}
          <span>{editMode ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>

      {editMode && (
        <div className="flex flex-col gap-2 mt-2 w-full max-w-2xl bg-slate-800/50 p-3 rounded-lg border border-slate-700">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="bg-slate-900 text-white text-sm p-3 rounded border border-slate-600 w-full min-h-[100px] focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Edit the content to teach the AI what the perfect answer looks like..."
          />
          <div className="flex justify-end gap-2 mt-1">
            <Button variant="ghost" size="sm" onClick={() => setEditMode(false)} className="text-slate-400 hover:text-white">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEdit} className="bg-emerald-500 hover:bg-emerald-600">
              Save Edit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
