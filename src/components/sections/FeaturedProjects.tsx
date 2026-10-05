import React from 'react';
import { useData } from '../../context/DataContext';
import { Project } from '../../types';
import { ExternalLink, ArrowUpRight, ArrowRight } from 'lucide-react';

interface FeaturedProjectsProps {
  onSelectProject: (project: Project) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ onSelectProject }) => {
  const { getPublishedProjects, isSectionEnabled } = useData();

  if (!isSectionEnabled('projects')) return null;

  const projects = getPublishedProjects();
  if (projects.length === 0) return null;

  // Featured projects appear first (without artificial 01/02 ranking numbers)
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <section id="projects" className="py-24 border-t border-[var(--border-subtle)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Section Heading & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
              Featured Work
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
              Software Projects
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md">
            Production-grade full-stack applications, distributed architectures, and verified systems.
          </p>
        </div>

        {/* Clean, Professional Responsive Project Grid: Desktop 3 cols, Tablet 2 cols, Mobile 1 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedProjects.map(project => {
            const hasLive = Boolean(project.liveUrl && project.liveUrl.trim() !== '');
            const hasGithub = Boolean(project.githubUrl && project.githubUrl.trim() !== '');
            const coverImage = project.image || '/src/assets/images/project_labourlink_ui_1791050578809.jpg';

            return (
              <article
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-200 shadow-sm cursor-pointer"
              >
                {/* 1. Project Image (First thing users see) */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)]">
                  <img
                    src={coverImage}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                  {project.category && (
                    <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white/90 border border-white/10">
                      {project.category}
                    </span>
                  )}
                </div>

                {/* 2. Card Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between gap-4">
                  <div className="space-y-3">
                    {/* Project Name */}
                    <div>
                      <h3 className="font-display text-xl font-bold text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {project.title}
                      </h3>
                      {project.subtitle && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 line-clamp-1">
                          {project.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Short Description (1-3 sentences) */}
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technology Stack (Small clean labels) */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.technologies.map(tech => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded text-[11px] font-mono bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. Footer Links: View Project + Intelligent Live Demo / GitHub Links */}
                  <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2 mt-auto">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onSelectProject(project);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <span>View Project</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-3">
                      {/* Live Demo Link (Only if liveUrl exists and is valid) */}
                      {hasLive && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
                          title="Open Live Website"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {/* GitHub Repository Link (Only if githubUrl exists and is valid) */}
                      {hasGithub && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                          title="View GitHub Repository"
                        >
                          <span>GitHub</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
