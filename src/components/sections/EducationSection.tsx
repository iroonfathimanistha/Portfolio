import React from 'react';
import { useData } from '../../context/DataContext';
import { GraduationCap, Calendar, BookOpen, Award } from 'lucide-react';

export const EducationSection: React.FC = () => {
  const { education, isSectionEnabled } = useData();

  if (!isSectionEnabled('education')) return null;

  const publishedEdu = education.filter(e => e.published);
  if (publishedEdu.length === 0) return null;

  return (
    <section id="education" className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/30">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
              Academic Background
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Education
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md">
            Undergraduate software engineering degree focusing on theoretical rigor, typed systems, and algorithm complexity.
          </p>
        </div>

        {/* Academic Presentation (Section 23) */}
        <div className="space-y-8">
          {publishedEdu.map(item => (
            <div
              key={item.id}
              className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-6"
            >
              {/* Header: Degree, University, Faculty, Dates */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                      {item.degree}
                    </h3>
                    <p className="text-sm sm:text-base font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {item.university}
                    </p>
                    <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
                      {item.faculty}
                      {item.department ? ` · ${item.department}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-surface-elevated)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] shrink-0 self-start">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{item.startDate} — {item.endDate}</span>
                </div>
              </div>

              {/* Academic Description */}
              {item.description && (
                <div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}

              {/* Coursework (Only if exists) */}
              {item.coursework && item.coursework.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2.5 font-semibold">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Relevant Coursework</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.coursework.map(c => (
                      <span
                        key={c}
                        className="px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-md"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Achievements (Only if exists) */}
              {item.achievements && item.achievements.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2 font-semibold">
                    <Award className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Academic Honors & Achievements</span>
                  </div>
                  <ul className="space-y-1 text-xs sm:text-sm text-[var(--text-secondary)] list-disc list-inside">
                    {item.achievements.map((ach, idx) => (
                      <li key={idx}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
