import React from 'react';
import { useData } from '../../context/DataContext';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const { experience, isSectionEnabled } = useData();

  if (!isSectionEnabled('experience')) return null;

  const publishedExp = experience.filter(e => e.published);
  if (publishedExp.length === 0) return null;

  return (
    <section id="experience" className="py-24 border-t border-[var(--border-subtle)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
              Applied Practice
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Engineering Experience
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md">
            Hands-on software engineering apprenticeships, backend API development, and peer mentoring.
          </p>
        </div>

        <div className="space-y-8">
          {publishedExp.map(item => (
            <div
              key={item.id}
              className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-emerald-500/30 transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                      {item.role}
                    </h3>
                    <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {item.organization}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                  <span className="px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                    {item.type}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.startDate} — {item.endDate}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                {item.description}
              </p>

              {item.responsibilities && item.responsibilities.length > 0 && (
                <div className="mb-5 space-y-2">
                  <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                    Core Engineering Responsibilities
                  </span>
                  <ul className="space-y-1.5">
                    {item.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[var(--text-secondary)]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.technologies && item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border-subtle)]">
                  {item.technologies.map(tech => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
