import React from 'react';
import { useData } from '../../context/DataContext';

export const EngineeringJourney: React.FC = () => {
  const { journey, isSectionEnabled } = useData();

  if (!isSectionEnabled('journey')) return null;

  const publishedMilestones = journey
    .filter(m => m.published !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  // If there are no meaningful journey records, hide the section
  if (publishedMilestones.length === 0) return null;

  return (
    <section id="journey" className="py-24 border-t border-[var(--border-subtle)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
              Evolution & Milestones
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Engineer Journey
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md">
            How I am developing as a software engineer — academic foundations, technical milestones, and deployed production systems.
          </p>
        </div>

        {/* Clean Vertical Progression (Section 25) */}
        <div className="max-w-2xl mx-auto py-2">
          {publishedMilestones.map((milestone, idx) => {
            const isLast = idx === publishedMilestones.length - 1;

            return (
              <div key={milestone.id} className="relative flex items-start gap-6 group">
                {/* Year Label */}
                <div className="w-16 pt-0.5 text-right shrink-0">
                  <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {milestone.date}
                  </span>
                </div>

                {/* Node & Connecting Line */}
                <div className="relative flex flex-col items-center self-stretch shrink-0">
                  {/* Bullet Node */}
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 z-10 mt-1 transition-transform group-hover:scale-125" />

                  {/* Vertical connecting line */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="w-[2px] grow bg-[var(--border-subtle)] group-hover:bg-emerald-500/30 transition-colors my-1"
                    />
                  )}
                </div>

                {/* Milestone Details */}
                <div className={`grow ${isLast ? 'pb-2' : 'pb-10'}`}>
                  <h3 className="font-display text-base sm:text-lg font-bold text-[var(--text-primary)] leading-tight">
                    {milestone.title}
                  </h3>
                  <p className="text-xs font-mono text-[var(--text-secondary)] mt-0.5 mb-2 font-medium">
                    {milestone.organization}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {milestone.description}
                  </p>

                  {/* Related project link if present */}
                  {milestone.relatedProject && (
                    <div className="mt-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-emerald-600 dark:text-emerald-400">
                        Project: {milestone.relatedProject}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
