import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { SkillItem } from '../../types';
import { ExternalLink, Terminal, Layers } from 'lucide-react';

interface TechnologyExplorerProps {
  onSelectProjectByTitle?: (title: string) => void;
}

const SKILL_CATEGORIES = [
  'Languages',
  'Frontend',
  'Backend',
  'Databases',
  'Cloud',
  'DevOps',
  'Testing',
  'Tools'
] as const;

type CategoryName = (typeof SKILL_CATEGORIES)[number];

// Helper to normalize skill items into the 8 required categories
function normalizeCategory(cat: string, skillName: string): CategoryName {
  const name = skillName.toLowerCase();
  const rawCat = cat.toLowerCase();

  if (name.includes('typescript') || name.includes('javascript') || name.includes('python') || name.includes('c#') || name.includes('sql') || name.includes('java')) {
    return 'Languages';
  }
  if (rawCat.includes('front') || name.includes('react') || name.includes('tailwind') || name.includes('next') || name.includes('vue')) {
    return 'Frontend';
  }
  if (rawCat.includes('back') || name.includes('asp.net') || name.includes('node') || name.includes('express') || name.includes('fastapi') || name.includes('rest')) {
    return 'Backend';
  }
  if (rawCat.includes('database') || rawCat.includes('data') || name.includes('postgres') || name.includes('mysql') || name.includes('redis') || name.includes('mongodb')) {
    return 'Databases';
  }
  if (name.includes('aws') || name.includes('gcp') || name.includes('azure') || name.includes('cloud') || name.includes('vercel')) {
    return 'Cloud';
  }
  if (name.includes('docker') || name.includes('ci/cd') || name.includes('git') || name.includes('kubernetes') || name.includes('github actions')) {
    return 'DevOps';
  }
  if (name.includes('test') || name.includes('jest') || name.includes('xunit') || name.includes('playwright') || name.includes('cypress')) {
    return 'Testing';
  }
  return 'Tools';
}

export const TechnologyExplorer: React.FC<TechnologyExplorerProps> = ({ onSelectProjectByTitle }) => {
  const { skills, isSectionEnabled, projects } = useData();
  const [activeCategory, setActiveCategory] = useState<CategoryName>('Languages');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  if (!isSectionEnabled('skills')) return null;

  const publishedSkills = skills.filter(s => s.enabled !== false);
  if (publishedSkills.length === 0) return null;

  // Filter skills for active category
  const categorySkills = publishedSkills.filter(
    s => normalizeCategory(s.category, s.name) === activeCategory
  );

  // If no skill is selected or selected skill doesn't belong to current category, default to first in category
  const currentSelected =
    selectedSkill && normalizeCategory(selectedSkill.category, selectedSkill.name) === activeCategory
      ? selectedSkill
      : categorySkills[0] || null;

  // Get related project titles for the selected skill
  const relatedProjects = currentSelected
    ? (currentSelected.relatedProjects || []).filter(Boolean)
    : [];

  return (
    <section id="skills" className="py-24 border-t border-[var(--border-subtle)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
              Technical Competencies
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Technical Skills
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md">
            Technologies and tools I use to build, test and deploy software.
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap gap-2 pb-6 border-b border-[var(--border-subtle)] mb-8">
          {SKILL_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            const count = publishedSkills.filter(s => normalizeCategory(s.category, s.name) === cat).length;
            if (count === 0 && cat !== 'Languages' && cat !== 'Frontend' && cat !== 'Backend') {
              return null;
            }

            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  const firstOfCat = publishedSkills.find(
                    s => normalizeCategory(s.category, s.name) === cat
                  );
                  setSelectedSkill(firstOfCat || null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-semibold shadow-sm'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Clean Aligned Grid of Compact Interactive Items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
          {categorySkills.map(skill => {
            const isSelected = currentSelected?.id === skill.id;

            return (
              <button
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className={`py-3 px-4 rounded-xl border text-left transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--bg-surface-elevated)] border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm ring-1 ring-emerald-500/30'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-emerald-500/40 hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`font-mono text-xs transition-colors ${
                      isSelected ? 'text-emerald-500' : 'text-[var(--text-muted)] group-hover:text-emerald-500'
                    }`}
                  >
                    ◇
                  </span>
                  <span className="text-xs sm:text-sm truncate">{skill.name}</span>
                </div>
              </button>
            );
          })}

          {categorySkills.length === 0 && (
            <div className="col-span-full py-8 text-center text-xs text-[var(--text-muted)] font-mono">
              No technologies currently configured under {activeCategory}.
            </div>
          )}
        </div>

        {/* Compact Selected State Underneath the Grid (Section 21) */}
        {currentSelected && (
          <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-500 font-mono text-sm">◇</span>
                  <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
                    {currentSelected.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {activeCategory}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {currentSelected.description ||
                    `${currentSelected.name} applied across full-stack architectures, structured data contracts, and production systems.`}
                </p>

                {/* Used In List */}
                {relatedProjects.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider block mb-1.5 font-semibold">
                      Used in:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {relatedProjects.map(projTitle => (
                        <button
                          key={projTitle}
                          onClick={() => onSelectProjectByTitle?.(projTitle)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{projTitle}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Documentation Link */}
              {currentSelected.officialUrl && (
                <a
                  href={currentSelected.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 self-start sm:self-auto"
                >
                  <span>Documentation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
