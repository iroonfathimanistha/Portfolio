import React, { useState, useRef } from 'react';
import { Upload, X, Eye, RefreshCw, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../common/Toast';
import { useData } from '../../context/DataContext';

interface ImageUploaderProps {
  label: string;
  currentImage?: string;
  onImageChange: (dataUrl: string) => void;
  onImageRemove?: () => void;
  aspectRatio?: 'square' | 'video' | 'any';
  description?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  currentImage,
  onImageChange,
  onImageRemove,
  aspectRatio = 'square',
  description
}) => {
  const { toast } = useToast();
  const { addMediaItem } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateAndProcessFile = (file: File) => {
    setUploadError(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      const err = 'Invalid file type. Supported formats: JPG, JPEG, PNG, WEBP.';
      setUploadError(err);
      toast(err, 'error');
      return;
    }

    // Validate size (< 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const err = 'File exceeds 5MB size limit. Please upload a smaller image.';
      setUploadError(err);
      toast(err, 'error');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async e => {
      const result = e.target?.result as string;
      if (result) {
        let finalUrl = result;
        const storedToken = sessionStorage.getItem('cms_bearer_token');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify({
              filename: file.name,
              dataUrl: result,
              mimeType: file.type,
              category: label.toLowerCase().includes('profile') ? 'profile' : 'project'
            })
          });
          const data = await res.json();
          if (data.success && data.url) {
            finalUrl = data.url;
          }
        } catch (uploadErr) {
          console.warn('[ImageUploader] Server upload fallback to dataUrl:', uploadErr);
        }

        onImageChange(finalUrl);
        setIsProcessing(false);
        toast('Image successfully uploaded and stored!', 'success');

        // Register in media library
        addMediaItem({
          id: 'med-' + Date.now(),
          filename: file.name,
          url: finalUrl,
          type: label.toLowerCase().includes('profile') ? 'profile' : 'project',
          mimeType: file.type,
          size: `${Math.round(file.size / 1024)} KB`,
          uploadDate: new Date().toISOString().split('T')[0],
          usedBy: label
        });
      }
    };
    reader.onerror = () => {
      setIsProcessing(false);
      setUploadError('Failed to read image file. Please try again.');
      toast('Failed to process image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] font-semibold">
          {label}
        </label>
        {currentImage && (
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Image Active
          </span>
        )}
      </div>

      {description && (
        <p className="text-[11px] text-[var(--text-muted)]">
          {description}
        </p>
      )}

      {uploadError && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {currentImage ? (
        <div className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center gap-4">
          <div
            className={`relative rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 ${
              aspectRatio === 'square' ? 'w-16 h-16' : 'w-24 h-16'
            }`}
          >
            <img
              src={currentImage}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
              {label}
            </p>
            <p className="text-[11px] font-mono text-[var(--text-muted)]">
              Live in application
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] transition-colors"
              title="Preview Image"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-primary)] bg-[var(--bg-surface)] hover:border-emerald-500/40 border border-[var(--border-subtle)] flex items-center gap-1 transition-colors"
              title="Replace Image"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            {onImageRemove && (
              <button
                type="button"
                onClick={onImageRemove}
                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-colors"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 border-2 border-dashed rounded-xl cursor-pointer text-center transition-all ${
            dragActive
              ? 'border-emerald-500 bg-emerald-500/5'
              : 'border-[var(--border-subtle)] hover:border-emerald-500/40 bg-[var(--bg-surface-elevated)]'
          }`}
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">
            Click to upload or drag & drop photo
          </p>
          <p className="text-[11px] font-mono text-[var(--text-muted)]">
            JPG, PNG, or WEBP (Max 5MB)
          </p>
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Lightbox Preview */}
      {previewOpen && currentImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[150] bg-black/85 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewOpen(false)}
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-[var(--bg-surface)] p-2 rounded-2xl border border-[var(--border-subtle)] shadow-2xl">
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute -top-3 -right-3 p-1.5 rounded-full bg-slate-900 text-white border border-slate-700 hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={currentImage}
              alt={label}
              className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};
