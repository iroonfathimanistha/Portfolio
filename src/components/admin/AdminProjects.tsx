import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Project } from '../../types';
import { useToast } from '../common/Toast';
import { ConfirmModal } from '../common/ConfirmModal';
import { ProjectCaseStudyModal } from '../sections/ProjectCaseStudyModal';
import { ImageUploader } from './ImageUploader';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  FileQuestion,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  Layers,
  Code
} from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const { projects, skills, saveProject, deleteProject } = useData();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [showAdvancedEngineering, setShowAdvancedEngineering] = useState(false);

  const filteredProjects = projects.filter(p => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const handleCreateNew = () => {
    const newProj: Project = {
      id: 'proj-' + Date.now(),
      slug: 'project-' + Math.floor(Math.random() * 1000),
      number: String(projects.length + 1).padStart(2, '0'),
      title: 'New Software Project',
      subtitle: '',
      category: 'Full-Stack',
      year: new Date().getFullYear().toString(),
      description: 'A web-based system designed to solve specific domain challenges.',
      image: '/src/assets/images/project_labourlink_ui_1791050578809.jpg',
      liveUrl: '',
      githubUrl: '',
      documentationUrl: '',
      technologies: ['React', 'TypeScript'],
      status: 'In Production',
      featured: true,
      published: true,
      isDetailed: false,
      caseStudy: {
        problem: '',
        solution: '',
        engineeringApproach: '',
        architectureDetails: '',
        keyFeatures: []
      }
    };
    setEditingProject(newProj);
    setShowAdvancedEngineering(false);
  };

  const handleToggleSkill = (skillName: string) => {
    if (!editingProject) return;
    const current = editingProject.technologies || [];
    const exists = current.includes(skillName);
    const updated = exists ? current.filter(s => s !== skillName) : [...current, skillName];
    setEditingProject({ ...editingProject, technologies: updated });
  };

  const handleSave = (publishState?: boolean) => {
    if (!editingProject) return;

    if (!editingProject.title.trim() || !editingProject.description.trim()) {
      toast('Project Name and Short Description are required.', 'error');
      return;
    }

    const toSave: Project = {
      ...editingProject,
      published: publishState !== undefined ? publishState : editingProject.published
    };

    saveProject(toSave);
    setEditingProject(null);

    if (toSave.published) {
      toast(`Project "${toSave.title}" published to portfolio!`, 'success');
    } else {
      toast(`Project saved as draft (unpublished).`, 'info');
    }
  };

  const handleDeleteConfirm = () => {
    if (!projectToDelete) return;
    deleteProject(projectToDelete.id);
    toast(`Project "${projectToDelete.title}" deleted.`, 'info');
    setProjectToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">
            Projects & Case Studies Management
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Create simple projects or comprehensive engineering case studies with linked skills.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search projects by name, description, or stack..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
        >
          <option value="All">All Categories</option>
          <option value="Full-Stack">Full-Stack</option>
          <option value="Web">Web</option>
          <option value="AI">AI</option>
          <option value="Cloud">Cloud</option>
          <option value="Systems">Systems</option>
        </select>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-mono">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Technologies</th>
                <th className="py-3 px-4">Links</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredProjects.map(proj => (
                <tr key={proj.id} className="hover:bg-[var(--bg-surface-elevated)]/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {proj.number}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={proj.image || '/src/assets/images/project_labourlink_ui_1791050578809.jpg'}
                        alt=""
                        className="w-12 h-8 rounded object-cover border border-[var(--border-subtle)]"
                      />
                      <div>
                        <div className="font-semibold text-[var(--text-primary)]">{proj.title}</div>
                        <div className="text-[11px] text-[var(--text-muted)] truncate max-w-xs">
                          {proj.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] font-mono text-[11px]">
                      {proj.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {proj.technologies.slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] font-mono text-[var(--text-secondary)]">
                          {t}
                        </span>
                      ))}
                      {proj.technologies.length > 3 && (
                        <span className="text-[10px] text-[var(--text-muted)]">
                          +{proj.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                      {proj.githubUrl && <span title="GitHub linked">GH</span>}
                      {proj.liveUrl && <span className="text-emerald-600 dark:text-emerald-400" title="Live demo linked">Live</span>}
                      {!proj.githubUrl && !proj.liveUrl && <span>—</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {proj.published ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <FileQuestion className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewProject(proj)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-emerald-500 hover:bg-[var(--bg-surface-elevated)] transition-colors"
                        title="Preview Public Case Study"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingProject({ ...proj });
                          setShowAdvancedEngineering(Boolean(proj.isDetailed || proj.caseStudy?.problem));
                        }}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setProjectToDelete(proj)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-surface-elevated)] transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Editor Dialog (Simple & Detailed, Pages 11-13) */}
      {editingProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
        >
          <div className="w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl text-[var(--text-primary)] my-auto max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-elevated)]">
              <div>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 text-xs font-bold block">
                  PROJECT {editingProject.number}
                </span>
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {editingProject.title || 'New Project'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewProject(editingProject)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:border-emerald-500/40 text-[var(--text-primary)] text-xs font-medium flex items-center gap-1.5 transition-colors border border-[var(--border-subtle)]"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* 1. Basic Information (Page 11) */}
              <div className="space-y-4">
                <h4 className="font-mono uppercase font-bold text-[var(--text-secondary)] border-b border-[var(--border-subtle)] pb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  Basic Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.title}
                      onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="e.g. LabourLink"
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.slug}
                      onChange={e => setEditingProject({ ...editingProject, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                      placeholder="e.g. labourlink"
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                      Subtitle / Headline
                    </label>
                    <input
                      type="text"
                      value={editingProject.subtitle}
                      onChange={e => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                      placeholder="e.g. Migrant Workers Management System"
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                      Category
                    </label>
                    <select
                      value={editingProject.category}
                      onChange={e => setEditingProject({ ...editingProject, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Full-Stack">Full-Stack</option>
                      <option value="Web">Web</option>
                      <option value="AI">AI</option>
                      <option value="Cloud">Cloud</option>
                      <option value="Systems">Systems</option>
                      <option value="Mobile">Mobile</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                      Deployment Status
                    </label>
                    <input
                      type="text"
                      value={editingProject.status}
                      onChange={e => setEditingProject({ ...editingProject, status: e.target.value as any })}
                      placeholder="e.g. In Production, Active Prototype"
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                      Year
                    </label>
                    <input
                      type="text"
                      value={editingProject.year || ''}
                      onChange={e => setEditingProject({ ...editingProject, year: e.target.value })}
                      placeholder="e.g. 2026"
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                      Display Order / Number
                    </label>
                    <input
                      type="text"
                      value={editingProject.number || ''}
                      onChange={e => setEditingProject({ ...editingProject, number: e.target.value })}
                      placeholder="e.g. 01"
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                      My Role
                    </label>
                    <input
                      type="text"
                      value={editingProject.caseStudy?.role || ''}
                      onChange={e =>
                        setEditingProject({
                          ...editingProject,
                          caseStudy: { ...(editingProject.caseStudy || {}), role: e.target.value }
                        })
                      }
                      placeholder="e.g. Full-Stack Lead Developer"
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                    Short Description (Required, 1-3 sentences) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingProject.description}
                    onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                    placeholder="Describe what the project is, what problem it addresses, and what it does..."
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                    Detailed Description (Optional for /projects/[slug])
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.longDescription || ''}
                    onChange={e => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                    placeholder="Comprehensive description displayed on the project details page..."
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <input
                    type="checkbox"
                    id="featured-toggle"
                    checked={editingProject.featured}
                    onChange={e => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="w-4 h-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-400"
                  />
                  <label htmlFor="featured-toggle" className="text-xs font-semibold text-[var(--text-primary)] cursor-pointer">
                    Featured Project (appears first in project list)
                  </label>
                </div>
              </div>

              {/* 2. Cover Image Management (Page 12: Upload, Replace, Remove) */}
              <div className="space-y-3">
                <ImageUploader
                  label="Project Cover Image"
                  description="Primary visual representation shown on the public project list."
                  currentImage={editingProject.image}
                  onImageChange={url => setEditingProject({ ...editingProject, image: url })}
                  onImageRemove={() => setEditingProject({ ...editingProject, image: '' })}
                  aspectRatio="video"
                />

                <div>
                  <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1 font-semibold">
                    Additional Screenshots (Optional, comma-separated image URLs)
                  </label>
                  <input
                    type="text"
                    value={(editingProject.screenshots || []).join(', ')}
                    onChange={e =>
                      setEditingProject({
                        ...editingProject,
                        screenshots: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })
                    }
                    placeholder="https://..., https://..."
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 font-mono text-xs"
                  />
                </div>
              </div>

              {/* 3. Technology Stack Selection from Database (Page 11 & 15) */}
              <div className="space-y-2">
                <label className="block text-[var(--text-secondary)] uppercase font-mono font-semibold">
                  Technology Stack (Select from Skills Database)
                </label>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Selecting technologies here automatically makes this project show up when visitors explore skills.
                </p>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] max-h-36 overflow-y-auto">
                  {skills.map(sk => {
                    const isSelected = editingProject.technologies.includes(sk.name);
                    return (
                      <button
                        type="button"
                        key={sk.id}
                        onClick={() => handleToggleSkill(sk.name)}
                        className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold'
                            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <span>{sk.name}</span>
                        {isSelected && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Links (Page 12: All optional. If empty, DO NOT show publicly!) */}
              <div className="space-y-3">
                <h4 className="font-mono uppercase font-bold text-[var(--text-secondary)] border-b border-[var(--border-subtle)] pb-2 flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-500" />
                  Repository & Live Links (All Optional)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">
                      GitHub URL (Leave empty to hide)
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={editingProject.githubUrl || ''}
                      onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">
                      Live Demo URL (Leave empty to hide)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editingProject.liveUrl || ''}
                      onChange={e => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Collapsible Optional Engineering Details (Page 13) */}
              <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAdvancedEngineering(!showAdvancedEngineering)}
                  className="w-full p-4 bg-[var(--bg-surface-elevated)] flex items-center justify-between text-left font-semibold text-[var(--text-primary)]"
                >
                  <div>
                    <span>Optional Engineering Case Study Details</span>
                    <span className="block text-[11px] font-mono text-[var(--text-muted)] font-normal mt-0.5">
                      Problem, Solution, Architecture Diagram, Implementation, and Lessons Learned
                    </span>
                  </div>
                  {showAdvancedEngineering ? (
                    <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                  )}
                </button>

                {showAdvancedEngineering && (
                  <div className="p-4 space-y-4 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] animate-in fade-in">
                    <div>
                      <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">
                        Problem Statement
                      </label>
                      <textarea
                        rows={2}
                        value={editingProject.caseStudy?.problem || ''}
                        onChange={e =>
                          setEditingProject({
                            ...editingProject,
                            caseStudy: { ...(editingProject.caseStudy || {}), problem: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">
                        Engineering Solution
                      </label>
                      <textarea
                        rows={2}
                        value={editingProject.caseStudy?.solution || ''}
                        onChange={e =>
                          setEditingProject({
                            ...editingProject,
                            caseStudy: { ...(editingProject.caseStudy || {}), solution: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">
                        Architecture Approach & Decisions
                      </label>
                      <textarea
                        rows={2}
                        value={editingProject.caseStudy?.engineeringApproach || ''}
                        onChange={e =>
                          setEditingProject({
                            ...editingProject,
                            caseStudy: { ...(editingProject.caseStudy || {}), engineeringApproach: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">
                          Challenges
                        </label>
                        <textarea
                          rows={2}
                          value={editingProject.caseStudy?.challenges || ''}
                          onChange={e =>
                            setEditingProject({
                              ...editingProject,
                              caseStudy: { ...(editingProject.caseStudy || {}), challenges: e.target.value }
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                        />
                      </div>

                      <div>
                        <label className="block text-[var(--text-secondary)] uppercase font-mono mb-1">
                          Lessons Learned
                        </label>
                        <textarea
                          rows={2}
                          value={editingProject.caseStudy?.lessonsLearned || ''}
                          onChange={e =>
                            setEditingProject({
                              ...editingProject,
                              caseStudy: { ...(editingProject.caseStudy || {}), lessonsLearned: e.target.value }
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Publishing State */}
              <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-[var(--text-primary)]">Publication Status</h5>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {editingProject.published
                      ? 'Visible to public visitors.'
                      : 'Draft state (hidden from public portfolio).'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProject({ ...editingProject, published: !editingProject.published })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    editingProject.published
                      ? 'bg-emerald-500 text-white dark:text-slate-950'
                      : 'bg-amber-500 text-white dark:text-slate-950'
                  }`}
                >
                  {editingProject.published ? 'Published' : 'Draft'}
                </button>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs font-medium"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="px-4 py-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] text-xs font-semibold border border-[var(--border-subtle)]"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish Project</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Case Study Preview */}
      <ProjectCaseStudyModal
        project={previewProject}
        isOpen={Boolean(previewProject)}
        onClose={() => setPreviewProject(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(projectToDelete)}
        title="Delete Project Case Study?"
        message={`Are you sure you want to permanently delete "${projectToDelete?.title}"?`}
        confirmLabel="Delete Project"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  );
};
