import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../common/Toast';
import { Mail, Github, Linkedin, MapPin, Send, CheckCircle2, AlertCircle, Loader2, ArrowUpRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { profile, submitMessage, isSectionEnabled } = useData();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isSectionEnabled('contact')) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email, and message before sending.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const ok = await submitMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'Software Engineering Inquiry',
        message: formData.message.trim()
      });

      if (ok) {
        setIsSuccess(true);
        toast('Message sent successfully! Nistha will reply promptly.', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSuccess(false), 6000);
      } else {
        throw new Error('Message dispatch failed');
      }
    } catch (err) {
      setErrorMessage('Unable to deliver message at this time. Please email directly.');
      toast('Failed to send message. Please retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'medium':
        return (
          <span className="font-serif font-black text-sm leading-none w-5 h-5 flex items-center justify-center">
            M
          </span>
        );
      case 'email':
        return <Mail className="w-5 h-5" />;
      default:
        return <ArrowUpRight className="w-5 h-5" />;
    }
  };

  const activeSocials = (profile.socialLinks || []).filter(s => s.enabled);

  return (
    <section id="contact" className="py-24 border-t border-[var(--border-subtle)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: Statement & Direct Touchpoints */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
                Initiate Contact
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
                Let's build something meaningful.
              </h2>
            </div>

            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
              Whether you are looking for a disciplined Software Engineering intern, exploring collaboration on open-source systems, or wishing to discuss architecture, my inbox is always open.
            </p>

            <div className="pt-6 border-t border-[var(--border-subtle)] space-y-3">
              {activeSocials.map(soc => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target={soc.platform === 'email' ? undefined : '_blank'}
                  rel={soc.platform === 'email' ? undefined : 'noopener noreferrer'}
                  className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] group shadow-sm"
                >
                  <div className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] group-hover:text-emerald-500 group-hover:scale-105 transition-transform">
                    {getSocialIcon(soc.platform)}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-[var(--text-muted)] block">{soc.label}</span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {soc.platform === 'email' ? profile.email : soc.url.replace(/^https?:\/\//, '')}
                    </span>
                  </div>
                </a>
              ))}

              {profile.showLocation && profile.location && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface)]/60 border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs font-mono">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Validated Form */}
          <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg relative overflow-hidden">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2">
              Send an Engineering Inquiry
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6">
              Messages are stored in the application database and acknowledged promptly.
            </p>

            {/* Error Message banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message Banner */}
            {isSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Thank you! Your message has been safely logged. Nistha will respond soon.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono text-[var(--text-secondary)] uppercase mb-1.5">
                    Your Name <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono text-[var(--text-secondary)] uppercase mb-1.5">
                    Your Email <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-mono text-[var(--text-secondary)] uppercase mb-1.5">
                  Subject / Area of Interest
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  disabled={isSubmitting}
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Summer 2027 Internship / Project Collaboration"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono text-[var(--text-secondary)] uppercase mb-1.5">
                  Message <span className="text-emerald-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  disabled={isSubmitting}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide context on your team, project needs, or inquiry..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
