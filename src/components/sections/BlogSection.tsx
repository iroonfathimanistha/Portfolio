import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BlogPost } from '../../types';
import { BlogModal } from './BlogModal';
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const { getPublishedBlogPosts, isSectionEnabled } = useData();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Requirement: Blog is optional, only show if enabled and published posts exist
  if (!isSectionEnabled('blog')) return null;

  const posts = getPublishedBlogPosts();
  if (posts.length === 0) return null;

  const featuredPost = posts.find(p => p.featured) || posts[0];
  const supportingPosts = posts.filter(p => p.id !== featuredPost?.id);

  return (
    <section id="blog" className="py-24 border-t border-[var(--border-subtle)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
              Technical Writing & System Notes
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Engineering Publications
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md">
            Articles on deterministic type systems, relational execution planners, and high-concurrency event loops.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Featured Large Article */}
          {featuredPost && (
            <article
              onClick={() => setSelectedPost(featuredPost)}
              className="lg:col-span-7 cursor-pointer p-8 sm:p-10 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group shadow-lg relative overflow-hidden"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/25">
                    <Sparkles className="w-3 h-3" />
                    Featured Paper
                  </span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readingTime}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-200 mb-4 leading-tight">
                  {featuredPost.title}
                </h3>

                <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-6">
                  {featuredPost.summary}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {featuredPost.tags.map(t => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Published: {featuredPost.publishedAt}
                </span>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          )}

          {/* Supporting Articles */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {supportingPosts.map(post => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="cursor-pointer p-6 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-emerald-500/40 transition-all duration-300 flex-1 flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-2.5">
                    <span>{post.publishedAt}</span>
                    <span>·</span>
                    <span>{post.readingTime}</span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-200 mb-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                    {post.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.map(t => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)] font-mono">Article Note</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <BlogModal
        post={selectedPost}
        isOpen={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
      />
    </section>
  );
};
