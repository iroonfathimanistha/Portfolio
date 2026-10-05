import React, { useState, useEffect } from 'react';
import { BlogPost } from '../../types';
import { X, Calendar, Clock, Share2, Check, ArrowLeft } from 'lucide-react';

interface BlogModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ post, isOpen, onClose }) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const total = target.scrollHeight - target.clientHeight;
    if (total > 0) {
      setReadingProgress((target.scrollTop / total) * 100);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !post) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-modal-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl text-[var(--text-primary)] overflow-hidden max-h-[94vh] flex flex-col relative animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-transparent z-20">
          <div
            className="h-full bg-emerald-500 transition-all duration-75"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between z-10 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-emerald-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-emerald-500 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs flex items-center gap-1.5 transition-colors"
              title="Copy article link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close article"
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div onScroll={handleScroll} className="p-6 sm:p-10 md:p-12 overflow-y-auto space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {post.publishedAt}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[var(--text-muted)]">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime}
              </span>
            </div>

            <h1
              id="blog-modal-title"
              className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-4"
            >
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl mb-6">
              {post.summary}
            </p>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border-subtle)]">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="text-[var(--text-primary)] leading-relaxed space-y-6 text-sm sm:text-base border-t border-[var(--border-subtle)] pt-8">
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-bold text-[var(--text-primary)] font-display pt-4">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('```')) {
                const lines = paragraph.split('\n');
                const lang = lines[0].replace('```', '') || 'typescript';
                const code = lines.slice(1, -1).join('\n');
                return (
                  <div key={index} className="rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] my-4">
                    <div className="px-4 py-2 border-b border-[var(--border-subtle)] text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                      <span>{lang}</span>
                      <span className="text-[var(--text-muted)]">code snippet</span>
                    </div>
                    <pre className="p-4 text-xs sm:text-sm font-mono text-[var(--text-primary)] overflow-x-auto leading-relaxed">
                      <code>{code}</code>
                    </pre>
                  </div>
                );
              }
              return (
                <p key={index} className="leading-relaxed text-[var(--text-secondary)]">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
