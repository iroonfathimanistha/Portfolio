import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Terminal, Layers, Cpu, Cloud, ArrowRight, ExternalLink } from 'lucide-react';
import { Project } from '../../types';

interface EngineeringFocusProps {
  onSelectProject: (project: Project) => void;
}

export const EngineeringFocus: React.FC<EngineeringFocusProps> = ({ onSelectProject }) => {
  const { focusAreas, projects } = useData();
  const [selectedId, setSelectedId] = useState<string>(focusAreas[0]?.id || 'software-engineering');

  const selectedArea = focusAreas.find(a => a.id === selectedId) || focusAreas[0];

  const relatedProjectsList = projects.filter(p =>
    selectedArea?.relatedProjectSlugs.includes(p.slug) && p.published
  );

  const getIcon = (id: string) => {
    switch (id) {
      case 'software-engineering':
        return Terminal;
      case 'full-stack-dev':
        return Layers;
      case 'ai-ml':
        return Cpu;
      case 'cloud-devops':
        return Cloud;
      default:
        return Terminal;
    }
  };

  return (
    <section id="engineeringFocus" className="py-24 border-t border-[var(--border-subtle)]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
              Core Competencies
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Engineering Focus & Architecture
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md">
            Interactive exploration of system boundaries, technology stacks, and applied case studies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation selector track */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            {focusAreas.map(area => {
              const Icon = getIcon(area.id);
              const isActive = area.id === selectedId;

              return (
                <button
                  key={area.id}
                  onClick={() => setSelectedId(area.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                    isActive
                      ? 'bg-[var(--bg-surface-elevated)] border-emerald-500/50 shadow-md text-[var(--text-primary)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-emerald-500/30 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-snug">
                        {area.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] font-mono">
                        {area.tagline}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-all duration-200 ${
                      isActive
                        ? 'text-emerald-500 translate-x-0 opacity-100'
                        : 'text-[var(--text-muted)] -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Dynamic Details Pane */}
          <div className="lg:col-span-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 min-h-[360px] flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] mb-6">
                <div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">
                    Domain Overview
                  </span>
                  <h3 className="text-2xl font-bold font-display text-[var(--text-primary)]">
                    {selectedArea.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-[var(--text-secondary)] px-2.5 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  {selectedArea.relatedProjectSlugs.length} Verified Case Studies
                </span>
              </div>

              {/* Description */}
              <p className="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
                {selectedArea.description}
              </p>

              {/* Related Technologies */}
              <div className="mb-8">
                <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block mb-2.5">
                  Core Technologies & Standards
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedArea.relatedTechnologies.map(tech => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Projects */}
            <div className="pt-6 border-t border-[var(--border-subtle)]">
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block mb-3">
                Applied in Projects
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedProjectsList.map(proj => (
                  <button
                    key={proj.id}
                    onClick={() => onSelectProject(proj)}
                    className="text-left p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-emerald-500/40 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          {proj.number}
                        </span>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors">
                          {proj.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {proj.subtitle}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-emerald-500 transition-colors shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
