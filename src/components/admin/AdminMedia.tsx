import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../common/Toast';
import { MediaItem } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { Image as ImageIcon, Upload, Trash2, Eye, RefreshCw, X, Download } from 'lucide-react';

export const AdminMedia: React.FC = () => {
  const { mediaItems, addMediaItem, deleteMediaItem } = useData();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        const newItem: MediaItem = {
          id: 'med-' + Date.now(),
          filename: file.name,
          url: dataUrl,
          type: file.name.includes('profile') ? 'profile' : 'project',
          mimeType: file.type,
          size: `${Math.round(file.size / 1024)} KB`,
          uploadDate: new Date().toISOString().split('T')[0],
          usedBy: 'Media Library Upload'
        };
        addMediaItem(newItem);
        toast(`File "${file.name}" uploaded to media library!`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredMedia = mediaItems.filter(m => {
    if (filterType === 'all') return true;
    return m.type === filterType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">
            Media Library & Asset Manager
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Audit and manage profile photographs, project covers, architecture blueprints, and credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Asset</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border-subtle)] pb-3">
        {['all', 'profile', 'project', 'certificate', 'resume'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors ${
              filterType === t
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Media Table / Grid (Page 19-20) */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-mono">
              <tr>
                <th className="py-3 px-4">Thumbnail</th>
                <th className="py-3 px-4">Filename</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Upload Date</th>
                <th className="py-3 px-4">Used By</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredMedia.map(item => (
                <tr key={item.id} className="hover:bg-[var(--bg-surface-elevated)]/40 transition-colors">
                  <td className="py-2 px-4">
                    <div className="w-12 h-10 rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-center">
                      <img
                        src={item.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[var(--text-primary)]">
                    {item.filename}
                  </td>
                  <td className="py-3 px-4 font-mono text-[var(--text-secondary)] uppercase text-[10px]">
                    {item.type}
                  </td>
                  <td className="py-3 px-4 font-mono text-[var(--text-muted)]">
                    {item.size}
                  </td>
                  <td className="py-3 px-4 font-mono text-[var(--text-muted)]">
                    {item.uploadDate}
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">
                    {item.usedBy}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewMedia(item)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-emerald-500"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setMediaToDelete(item)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-rose-500"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lightbox Preview */}
      {previewMedia && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[150] bg-black/85 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewMedia(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] bg-[var(--bg-surface)] p-4 rounded-2xl border border-[var(--border-subtle)] shadow-2xl flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
              <span className="font-mono text-xs text-[var(--text-primary)] font-bold">
                {previewMedia.filename} ({previewMedia.size})
              </span>
              <button
                onClick={() => setPreviewMedia(null)}
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={previewMedia.url}
              alt=""
              className="max-h-[70vh] w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(mediaToDelete)}
        title="Delete Media Asset?"
        message={`Delete "${mediaToDelete?.filename}" from media library?`}
        confirmLabel="Delete Asset"
        isDestructive={true}
        onConfirm={() => {
          if (mediaToDelete) {
            deleteMediaItem(mediaToDelete.id);
            setMediaToDelete(null);
            toast('Media item deleted', 'info');
          }
        }}
        onCancel={() => setMediaToDelete(null)}
      />
    </div>
  );
};
