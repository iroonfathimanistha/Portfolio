import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Achievement } from '../../types';
import { Trophy, ExternalLink, X, Building, Sparkles } from 'lucide-react';

export const AchievementsGrid: React.FC = () => {
  const { achievements, isSectionEnabled } = useData();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    if (!selectedAchievement) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedAchievement(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedAchievement]);

  if (!isSectionEnabled('achievements')) return null;

  const published = achievements.filter(a => a.published);
  if (published.length === 0) return null;

  return (
    <section id="achievements" className="py-24 border-t border-[var(--border-subtle)]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
              Honors & Recognition
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Academic & Competitive Achievements
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md">
            Verified competitive programming hackathon finishes and sustained academic honor standings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {published.map(item => {
            const isFeatured = item.featured;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedAchievement(item)}
                className={`cursor-pointer p-6 sm:p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between group shadow-sm ${
                  isFeatured
                    ? 'md:col-span-6 bg-[var(--bg-surface-elevated)] border-emerald-500/40 hover:border-emerald-500/60'
                    : 'md:col-span-6 lg:col-span-6 bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-emerald-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {item.date}
                      </span>
                    </div>

                    {isFeatured && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-amber-600 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-xl font-bold text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs font-mono text-[var(--text-secondary)] mb-4 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    {item.organization}
                  </p>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)]">View Evidence & Details</span>
                  <span className="text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold">
                    Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedAchievement && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="achieve-modal-title"
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 shadow-2xl text-[var(--text-primary)] animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                    Recognition Detail
                  </span>
                  <h3 id="achieve-modal-title" className="text-xl font-bold font-display text-[var(--text-primary)]">
                    {selectedAchievement.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedAchievement(null)}
                aria-label="Close dialog"
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-surface-elevated)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-mono">
                <span className="text-[var(--text-muted)]">Organization:</span>
                <span className="text-[var(--text-primary)] font-semibold">{selectedAchievement.organization}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-mono">
                <span className="text-[var(--text-muted)]">Date / Period:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedAchievement.date}</span>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)]/60 border border-[var(--border-subtle)]">
                <h4 className="text-xs font-mono text-[var(--text-muted)] uppercase mb-2">Description</h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {selectedAchievement.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => setSelectedAchievement(null)}
                className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Close (ESC)
              </button>

              {selectedAchievement.evidenceUrl && (
                <a
                  href={selectedAchievement.evidenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-white dark:text-slate-950 hover:bg-emerald-400 flex items-center gap-2 transition-colors shadow-sm"
                >
                  <span>View Public Evidence</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
