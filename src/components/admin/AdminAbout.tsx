import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../common/Toast';
import { Info, Plus, Trash2, ArrowUp, ArrowDown, Save, Sparkles, Target } from 'lucide-react';

export const AdminAbout: React.FC = () => {
  const { profile, updateProfile, lastSyncError } = useData();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [aboutText, setAboutText] = useState(profile.aboutText || '');
  const [careerDirection, setCareerDirection] = useState(profile.careerDirection || '');
  const [interests, setInterests] = useState<string[]>(profile.engineeringInterests || []);
  const [principles, setPrinciples] = useState<string[]>(
    profile.engineeringPrinciples || [
      'Build with architectural clarity',
      'Test with deterministic verification',
      'Learn from first principles',
      'Improve continuously through feedback'
    ]
  );

  const [newInterest, setNewInterest] = useState('');
  const [newPrinciple, setNewPrinciple] = useState('');

  // Sync form state whenever fresh profile is loaded from PostgreSQL database
  React.useEffect(() => {
    setAboutText(profile.aboutText || '');
    setCareerDirection(profile.careerDirection || '');
    setInterests(profile.engineeringInterests || []);
    if (profile.engineeringPrinciples && profile.engineeringPrinciples.length > 0) {
      setPrinciples(profile.engineeringPrinciples);
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = {
        aboutText: aboutText.trim(),
        careerDirection: careerDirection.trim(),
        engineeringInterests: interests,
        engineeringPrinciples: principles
      };
      const ok = await updateProfile(updated);
      if (ok) {
        toast('About section saved to PostgreSQL database!', 'success');
      } else {
        toast(lastSyncError || 'Failed to save to PostgreSQL. Verify DATABASE_URL in Vercel.', 'error');
      }
    } catch (err: any) {
      toast(err?.message || 'Failed to save changes. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    if (interests.includes(newInterest.trim())) {
      toast('Interest already in list', 'info');
      return;
    }
    setInterests([...interests, newInterest.trim()]);
    setNewInterest('');
  };

  const handleRemoveInterest = (item: string) => {
    setInterests(interests.filter(i => i !== item));
  };

  const handleAddPrinciple = () => {
    if (!newPrinciple.trim()) return;
    setPrinciples([...principles, newPrinciple.trim()]);
    setNewPrinciple('');
  };

  const handleRemovePrinciple = (index: number) => {
    setPrinciples(principles.filter((_, idx) => idx !== index));
  };

  const handleMovePrinciple = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === principles.length - 1)
    ) {
      return;
    }
    const next = [...principles];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    setPrinciples(next);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">
            About Section Management
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Manage your philosophy, introduction narrative, engineering interests, and core principles.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white dark:text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving to Database...' : 'Save About Content'}</span>
        </button>
      </div>

      {/* 1. Introduction Narrative */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <Info className="w-4 h-4 text-emerald-500" />
          <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
            1. Professional Introduction
          </h2>
        </div>

        <div>
          <label className="block text-[var(--text-secondary)] uppercase font-mono text-xs mb-1 font-semibold">
            About Text (Displayed in public About section)
          </label>
          <textarea
            rows={5}
            value={aboutText}
            onChange={e => setAboutText(e.target.value)}
            placeholder="Write a clear, thoughtful explanation of your engineering approach and foundation..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-emerald-500 leading-relaxed"
          />
        </div>
      </section>

      {/* 2. Career Direction */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <Target className="w-4 h-4 text-emerald-500" />
          <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
            2. Career Direction
          </h2>
        </div>

        <div>
          <label className="block text-[var(--text-secondary)] uppercase font-mono text-xs mb-1 font-semibold">
            Short Career Focus Statement
          </label>
          <textarea
            rows={2}
            value={careerDirection}
            onChange={e => setCareerDirection(e.target.value)}
            placeholder="e.g. Seeking Software Engineering Internship & Graduate Engineering opportunities where I can apply strong fundamentals..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-emerald-500 leading-relaxed"
          />
        </div>
      </section>

      {/* 3. Engineering Interests */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
            3. Engineering Interests
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {interests.map(item => (
            <span
              key={item}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)]"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveInterest(item)}
                className="text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer"
                title="Remove interest"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 max-w-md pt-2">
          <input
            type="text"
            value={newInterest}
            onChange={e => setNewInterest(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddInterest();
              }
            }}
            placeholder="Add interest (e.g. Distributed Systems)..."
            className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={handleAddInterest}
            className="px-3.5 py-2 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Add</span>
          </button>
        </div>
      </section>

      {/* 4. Engineering Principles (Add, Remove, Reorder) */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <Info className="w-4 h-4 text-emerald-500" />
          <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
            4. Engineering Principles
          </h2>
        </div>

        <div className="space-y-2">
          {principles.map((principle, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)]"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold w-5">
                  #{idx + 1}
                </span>
                <span>{principle}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMovePrinciple(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30 cursor-pointer"
                  title="Move up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMovePrinciple(idx, 'down')}
                  disabled={idx === principles.length - 1}
                  className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30 cursor-pointer"
                  title="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemovePrinciple(idx)}
                  className="p-1 rounded text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer ml-1"
                  title="Delete principle"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 max-w-md pt-2">
          <input
            type="text"
            value={newPrinciple}
            onChange={e => setNewPrinciple(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddPrinciple();
              }
            }}
            placeholder="Add principle (e.g. Build, Test, Learn)..."
            className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={handleAddPrinciple}
            className="px-3.5 py-2 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Add</span>
          </button>
        </div>
      </section>
    </div>
  );
};
