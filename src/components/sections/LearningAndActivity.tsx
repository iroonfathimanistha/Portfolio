import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { LearningItem } from '../../types';
import { BookOpen, ChevronRight } from 'lucide-react';

export const LearningAndActivity: React.FC = () => {
  const { learningItems, activityFeed, isSectionEnabled } = useData();
  const [selectedLearning, setSelectedLearning] = useState<LearningItem | null>(null);

  const showLearning = isSectionEnabled('currentlyLearning');
  const showActivity = isSectionEnabled('recentActivity');

  if (!showLearning && !showActivity) return null;

  return (
    <section id="currentlyLearning" className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/20">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Currently Learning Interactive Track */}
        {showLearning && (
          <div className={showActivity ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <div className="mb-8">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
                Continuous Engineering Growth
              </span>
              <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-2">
                Currently Learning Track
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Active engineering investigations and deep dives. No synthetic progress bars.
              </p>
            </div>

            <div className="space-y-3">
              {learningItems.filter(l => l.enabled).map(item => {
                const isSelected = selectedLearning?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedLearning(isSelected ? null : item)}
                    className={`cursor-pointer p-4 sm:p-5 rounded-xl border transition-all duration-200 group shadow-sm ${
                      isSelected
                        ? 'bg-[var(--bg-surface-elevated)] border-emerald-500/50'
                        : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-emerald-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs font-mono text-[var(--text-muted)]">
                            Started: {item.startedDate} {item.relatedProject ? `· ${item.relatedProject}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                          {item.status}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${
                            isSelected ? 'rotate-90 text-emerald-500' : 'group-hover:translate-x-0.5'
                          }`}
                        />
                      </div>
                    </div>

                    {isSelected && item.description && (
                      <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed animate-in fade-in slide-in-from-top-1 duration-150">
                        <p>{item.description}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Activity Feed */}
        {showActivity && (
          <div className={`${showLearning ? 'lg:col-span-5' : 'lg:col-span-12'} bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 shadow-sm`}>
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold block mb-1">
                  Changelog
                </span>
                <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                  Recent Activity Feed
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-6">
              {activityFeed.slice(0, 5).map(act => (
                <div key={act.id} className="relative pl-6 pb-2 group">
                  <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                  <span className="absolute left-[3px] top-4 bottom-0 w-[2px] bg-[var(--border-subtle)] group-last:hidden" />

                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h4 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {act.action}
                    </h4>
                    <span className="text-[11px] font-mono text-[var(--text-muted)] shrink-0">
                      {act.date}
                    </span>
                  </div>

                  {act.details && (
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {act.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
