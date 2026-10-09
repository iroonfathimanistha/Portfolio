import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../common/Toast';
import { FileText, Upload, Trash2, Eye, CheckCircle, ExternalLink, Save, AlertCircle } from 'lucide-react';

export const AdminResume: React.FC = () => {
  const { profile, updateProfile, addMediaItem, lastSyncError } = useData();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const resume = profile.resume || {
    professionalTitle: profile.role,
    summary: '',
    resumePdfUrl: '',
    published: true,
    lastUpdated: 'October 2026'
  };

  const [formData, setFormData] = useState({
    professionalTitle: resume.professionalTitle || profile.role,
    summary: resume.summary || '',
    resumePdfUrl: resume.resumePdfUrl || '',
    published: resume.published !== false,
    lastUpdated: resume.lastUpdated || 'October 2026'
  });

  // Sync form state whenever fresh profile is loaded from PostgreSQL database
  React.useEffect(() => {
    const curResume = profile.resume || {
      professionalTitle: profile.role,
      summary: '',
      resumePdfUrl: '',
      published: true,
      lastUpdated: 'October 2026'
    };
    setFormData({
      professionalTitle: curResume.professionalTitle || profile.role,
      summary: curResume.summary || '',
      resumePdfUrl: curResume.resumePdfUrl || '',
      published: curResume.published !== false,
      lastUpdated: curResume.lastUpdated || 'October 2026'
    });
  }, [profile]);

  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedResume = {
        ...formData,
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
      const ok = await updateProfile({ resume: updatedResume });
      if (ok) {
        toast('Resume settings saved to PostgreSQL database!', 'success');
      } else {
        toast(lastSyncError || 'Failed to save resume to PostgreSQL.', 'error');
      }
    } catch (err: any) {
      toast(err?.message || 'Failed to save resume. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast('Please upload a PDF document (.pdf)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast('PDF file size must be under 10MB', 'error');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = event => {
      const dataUrl = event.target?.result as string;
      setFormData(prev => ({
        ...prev,
        resumePdfUrl: dataUrl,
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      }));

      // Also register into central media library
      addMediaItem({
        id: 'media-' + Date.now(),
        filename: file.name,
        url: dataUrl,
        type: 'resume',
        mimeType: 'application/pdf',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        usedBy: 'Public Resume'
      });

      setIsUploading(false);
      toast(`Resume "${file.name}" uploaded successfully!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteResume = () => {
    if (window.confirm('Are you sure you want to remove the uploaded resume PDF?')) {
      setFormData(prev => ({ ...prev, resumePdfUrl: '' }));
      toast('Resume file removed.', 'info');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">
            Resume Management
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage your official resume PDF document, publication state, and summary overview.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white dark:text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving to Database...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* 1. Resume Document Upload & Status */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <FileText className="w-4 h-4 text-emerald-500" />
          <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
            1. Current Resume Document (PDF)
          </h2>
        </div>

        {formData.resumePdfUrl ? (
          <div className="p-5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  Active Resume PDF Document
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Last updated: {formData.lastUpdated}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-3 h-3" />
                    <span>Active on /resume</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <a
                href={formData.resumePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-500" />
                <span>Preview Document</span>
              </a>

              <label className="px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-emerald-500" />
                <span>Replace PDF</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleDeleteResume}
                className="p-2 text-[var(--text-muted)] hover:text-rose-500 rounded-lg hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
                title="Remove resume"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-2xl border-2 border-dashed border-[var(--border-subtle)] hover:border-emerald-500/50 bg-[var(--bg-surface-elevated)]/50 text-center space-y-3 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-sm text-[var(--text-primary)]">
                Upload your official Resume (PDF)
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Maximum file size: 10MB. Standard .pdf format.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-xs cursor-pointer shadow-sm">
              <Upload className="w-4 h-4" />
              <span>Select PDF File</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
      </section>

      {/* 2. Publication Status & Details */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <FileText className="w-4 h-4 text-emerald-500" />
          <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
            2. Publication & Professional Overview
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
              Professional Resume Title
            </label>
            <input
              type="text"
              value={formData.professionalTitle}
              onChange={e => setFormData({ ...formData, professionalTitle: e.target.value })}
              placeholder="e.g. Software Engineer | Full-Stack & Systems Undergraduate"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
              Executive Summary
            </label>
            <textarea
              rows={4}
              value={formData.summary}
              onChange={e => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Detail-oriented Software Engineering Undergraduate with foundational strengths in typed full-stack architectures..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm text-[var(--text-primary)]">Public Visibility</h4>
              <p className="text-[11px] text-[var(--text-muted)]">
                {formData.published
                  ? 'The resume section and /resume page are publicly active.'
                  : 'Resume is currently hidden from public visitors.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, published: !formData.published })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                formData.published
                  ? 'bg-emerald-500 text-white dark:text-slate-950'
                  : 'bg-slate-500 text-white dark:text-slate-950'
              }`}
            >
              {formData.published ? 'Published' : 'Hidden'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
