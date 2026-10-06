import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  SkillItem,
  FocusArea,
  Certification,
  Achievement,
  ActivityItem,
  EducationItem,
  ExperienceItem,
  LearningItem,
  ActivityFeedItem,
  BlogPost,
  ContactMessage,
  SiteProfile,
  SectionConfig,
  SocialLink,
  MediaItem,
  JourneyMilestone
} from '../types';
import {
  initialProfile,
  initialSectionsConfig,
  initialFocusAreas,
  initialProjects,
  initialSkills,
  initialEducation,
  initialExperience,
  initialCertifications,
  initialActivities,
  initialAchievements,
  initialLearningItems,
  initialActivityFeed,
  initialBlogPosts,
  initialMediaItems,
  initialMessages,
  initialJourney
} from '../data/seedData';

interface DataContextType {
  profile: SiteProfile;
  updateProfile: (profile: Partial<SiteProfile>) => void;
  sectionsConfig: SectionConfig[];
  updateSectionConfig: (key: string, updates: Partial<SectionConfig>) => void;
  reorderSections: (newOrder: SectionConfig[]) => void;
  isSectionEnabled: (key: string) => boolean;
  projects: Project[];
  getPublishedProjects: () => Project[];
  getProjectBySlug: (slug: string) => Project | undefined;
  saveProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  skills: SkillItem[];
  saveSkill: (skill: SkillItem) => void;
  deleteSkill: (id: string) => void;
  focusAreas: FocusArea[];
  education: EducationItem[];
  saveEducation: (edu: EducationItem) => void;
  deleteEducation: (id: string) => void;
  experience: ExperienceItem[];
  saveExperience: (exp: ExperienceItem) => void;
  deleteExperience: (id: string) => void;
  journey: JourneyMilestone[];
  saveJourneyItem: (item: JourneyMilestone) => void;
  deleteJourneyItem: (id: string) => void;
  certifications: Certification[];
  saveCertification: (cert: Certification) => void;
  deleteCertification: (id: string) => void;
  activities: ActivityItem[];
  saveActivity: (act: ActivityItem) => void;
  deleteActivity: (id: string) => void;
  achievements: Achievement[];
  saveAchievement: (achieve: Achievement) => void;
  deleteAchievement: (id: string) => void;
  learningItems: LearningItem[];
  saveLearningItem: (item: LearningItem) => void;
  deleteLearningItem: (id: string) => void;
  activityFeed: ActivityFeedItem[];
  blogPosts: BlogPost[];
  getPublishedBlogPosts: () => BlogPost[];
  getBlogPostBySlug: (slug: string) => BlogPost | undefined;
  saveBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  mediaItems: MediaItem[];
  addMediaItem: (item: MediaItem) => void;
  deleteMediaItem: (id: string) => void;
  messages: ContactMessage[];
  submitMessage: (message: Omit<ContactMessage, 'id' | 'receivedAt' | 'read'>) => Promise<boolean>;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  deleteAllDemoData: () => void;
  resetAllData: () => void;
  syncToServer: (customPayload?: any) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const STORAGE_PREFIX = 'nistha_portfolio_v2_';

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return fallback;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<SiteProfile>(() => getStored('profile', initialProfile));
  const [sectionsConfig, setSectionsConfig] = useState<SectionConfig[]>(() =>
    getStored('sectionsConfig', initialSectionsConfig)
  );
  const [projects, setProjects] = useState<Project[]>(() => getStored('projects', initialProjects));
  const [skills, setSkills] = useState<SkillItem[]>(() => getStored('skills', initialSkills));
  const [focusAreas] = useState<FocusArea[]>(() => getStored('focusAreas', initialFocusAreas));
  const [education, setEducation] = useState<EducationItem[]>(() => getStored('education', initialEducation));
  const [experience, setExperience] = useState<ExperienceItem[]>(() => getStored('experience', initialExperience));
  const [journey, setJourney] = useState<JourneyMilestone[]>(() => getStored('journey', initialJourney));
  const [certifications, setCertifications] = useState<Certification[]>(() =>
    getStored('certifications', initialCertifications)
  );
  const [activities, setActivities] = useState<ActivityItem[]>(() => getStored('activities', initialActivities));
  const [achievements, setAchievements] = useState<Achievement[]>(() =>
    getStored('achievements', initialAchievements)
  );
  const [learningItems, setLearningItems] = useState<LearningItem[]>(() =>
    getStored('learningItems', initialLearningItems)
  );
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>(() =>
    getStored('activityFeed', initialActivityFeed)
  );
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => getStored('blogPosts', initialBlogPosts));
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => getStored('mediaItems', initialMediaItems));
  const [messages, setMessages] = useState<ContactMessage[]>(() => getStored('messages', initialMessages));

  const refreshData = async (): Promise<void> => {
    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data && !data.empty) {
        if (data.profile) {
          setProfile(data.profile);
          setStored('profile', data.profile);
        }
        if (data.projects) {
          setProjects(data.projects);
          setStored('projects', data.projects);
        }
        if (data.skills) {
          setSkills(data.skills);
          setStored('skills', data.skills);
        }
        if (data.education) {
          setEducation(data.education);
          setStored('education', data.education);
        }
        if (data.experience) {
          setExperience(data.experience);
          setStored('experience', data.experience);
        }
        if (data.journey) {
          setJourney(data.journey);
          setStored('journey', data.journey);
        }
        if (data.certifications) {
          setCertifications(data.certifications);
          setStored('certifications', data.certifications);
        }
        if (data.mediaItems) {
          setMediaItems(data.mediaItems);
          setStored('mediaItems', data.mediaItems);
        }
        if (data.messages) {
          setMessages(data.messages);
          setStored('messages', data.messages);
        }
        if (data.blogPosts) {
          setBlogPosts(data.blogPosts);
          setStored('blogPosts', data.blogPosts);
        }
        if (data.sectionsConfig) {
          setSectionsConfig(data.sectionsConfig);
          setStored('sectionsConfig', data.sectionsConfig);
        }
      }
    } catch (err) {
      console.warn('[DataContext] Server sync load notice:', err);
    }
  };

  // Fetch server database state on initial mount & visibility change
  useEffect(() => {
    refreshData();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const syncToServer = async (customPayload?: any): Promise<boolean> => {
    try {
      const storedToken = sessionStorage.getItem('cms_bearer_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
      }

      const payload = {
        profile,
        sectionsConfig,
        projects,
        skills,
        focusAreas,
        education,
        experience,
        journey,
        certifications,
        activities,
        achievements,
        learningItems,
        activityFeed,
        mediaItems,
        messages,
        blogPosts,
        ...(customPayload || {})
      };

      const res = await fetch('/api/data', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('[DataContext] Server sync status:', res.status, text);
        return false;
      }

      const resJson = await res.json();
      return resJson.success === true;
    } catch (err) {
      console.error('[DataContext] Server sync network error:', err);
      return false;
    }
  };

  const updateProfile = (data: Partial<SiteProfile>) => {
    const updated = { ...profile, ...data };
    setProfile(updated);
    setStored('profile', updated);
    syncToServer({ profile: updated });
  };

  const updateSectionConfig = (key: string, updates: Partial<SectionConfig>) => {
    setSectionsConfig(prev =>
      prev.map(sec => (sec.key === key ? { ...sec, ...updates } : sec))
    );
  };

  const reorderSections = (newOrder: SectionConfig[]) => {
    setSectionsConfig(newOrder);
  };

  const isSectionEnabled = (key: string): boolean => {
    const sec = sectionsConfig.find(s => s.key === key);
    return sec ? sec.enabled : false;
  };

  const getPublishedProjects = () => projects.filter(p => p.published);
  const getProjectBySlug = (slug: string) => projects.find(p => p.slug === slug || p.id === slug);

  const saveProject = (project: Project) => {
    let next: Project[] = [];
    const idx = projects.findIndex(p => p.id === project.id);
    if (idx >= 0) {
      next = [...projects];
      next[idx] = project;
    } else {
      next = [project, ...projects];
    }
    setProjects(next);
    setStored('projects', next);
    syncToServer({ projects: next });
  };

  const deleteProject = (id: string) => {
    const next = projects.filter(p => p.id !== id);
    setProjects(next);
    setStored('projects', next);
    syncToServer({ projects: next });
  };

  const saveSkill = (skill: SkillItem) => {
    let next: SkillItem[] = [];
    const idx = skills.findIndex(s => s.id === skill.id);
    if (idx >= 0) {
      next = [...skills];
      next[idx] = skill;
    } else {
      next = [...skills, skill];
    }
    setSkills(next);
    setStored('skills', next);
    syncToServer({ skills: next });
  };

  const deleteSkill = (id: string) => {
    const next = skills.filter(s => s.id !== id);
    setSkills(next);
    setStored('skills', next);
    syncToServer({ skills: next });
  };

  const saveEducation = (edu: EducationItem) => {
    let next: EducationItem[] = [];
    const idx = education.findIndex(e => e.id === edu.id);
    if (idx >= 0) {
      next = [...education];
      next[idx] = edu;
    } else {
      next = [edu, ...education];
    }
    setEducation(next);
    setStored('education', next);
    syncToServer({ education: next });
  };

  const deleteEducation = (id: string) => {
    const next = education.filter(e => e.id !== id);
    setEducation(next);
    setStored('education', next);
    syncToServer({ education: next });
  };

  const saveExperience = (exp: ExperienceItem) => {
    let next: ExperienceItem[] = [];
    const idx = experience.findIndex(e => e.id === exp.id);
    if (idx >= 0) {
      next = [...experience];
      next[idx] = exp;
    } else {
      next = [exp, ...experience];
    }
    setExperience(next);
    setStored('experience', next);
    syncToServer({ experience: next });
  };

  const deleteExperience = (id: string) => {
    const next = experience.filter(e => e.id !== id);
    setExperience(next);
    setStored('experience', next);
    syncToServer({ experience: next });
  };

  const saveJourneyItem = (item: JourneyMilestone) => {
    let next: JourneyMilestone[] = [];
    const idx = journey.findIndex(j => j.id === item.id);
    if (idx >= 0) {
      next = [...journey];
      next[idx] = item;
    } else {
      next = [item, ...journey];
    }
    setJourney(next);
    setStored('journey', next);
    syncToServer({ journey: next });
  };

  const deleteJourneyItem = (id: string) => {
    const next = journey.filter(j => j.id !== id);
    setJourney(next);
    setStored('journey', next);
    syncToServer({ journey: next });
  };

  const saveCertification = (cert: Certification) => {
    let next: Certification[] = [];
    const idx = certifications.findIndex(c => c.id === cert.id);
    if (idx >= 0) {
      next = [...certifications];
      next[idx] = cert;
    } else {
      next = [cert, ...certifications];
    }
    setCertifications(next);
    setStored('certifications', next);
    syncToServer({ certifications: next });
  };

  const deleteCertification = (id: string) => {
    const next = certifications.filter(c => c.id !== id);
    setCertifications(next);
    setStored('certifications', next);
    syncToServer({ certifications: next });
  };

  const saveActivity = (act: ActivityItem) => {
    setActivities(prev => {
      const idx = prev.findIndex(a => a.id === act.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = act;
        return next;
      }
      return [act, ...prev];
    });
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const saveAchievement = (achieve: Achievement) => {
    setAchievements(prev => {
      const idx = prev.findIndex(a => a.id === achieve.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = achieve;
        return next;
      }
      return [achieve, ...prev];
    });
  };

  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  const saveLearningItem = (item: LearningItem) => {
    setLearningItems(prev => {
      const idx = prev.findIndex(l => l.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      return [...prev, item];
    });
  };

  const deleteLearningItem = (id: string) => {
    setLearningItems(prev => prev.filter(l => l.id !== id));
  };

  const getPublishedBlogPosts = () => blogPosts.filter(b => b.published);
  const getBlogPostBySlug = (slug: string) => blogPosts.find(b => b.slug === slug || b.id === slug);

  const saveBlogPost = (post: BlogPost) => {
    setBlogPosts(prev => {
      const idx = prev.findIndex(b => b.id === post.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = post;
        return next;
      }
      return [post, ...prev];
    });
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(b => b.id !== id));
  };

  const addMediaItem = (item: MediaItem) => {
    setMediaItems(prev => [item, ...prev]);
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems(prev => prev.filter(m => m.id !== id));
  };

  const submitMessage = async (msgData: Omit<ContactMessage, 'id' | 'receivedAt' | 'read'>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newMsg: ContactMessage = {
      ...msgData,
      id: 'msg-' + Date.now(),
      receivedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setMessages(prev => [newMsg, ...prev]);
    return true;
  };

  const markMessageRead = (id: string) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, read: true } : m)));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const deleteAllDemoData = () => {
    // Clear demo records as per Page 23 of specs
    setProjects([]);
    setEducation([]);
    setExperience([]);
    setJourney([]);
    setCertifications([]);
    setActivities([]);
    setAchievements([]);
    setLearningItems([]);
    setBlogPosts([]);
    setMessages([]);
  };

  const resetAllData = () => {
    setProfile(initialProfile);
    setSectionsConfig(initialSectionsConfig);
    setProjects(initialProjects);
    setSkills(initialSkills);
    setEducation(initialEducation);
    setExperience(initialExperience);
    setJourney(initialJourney);
    setCertifications(initialCertifications);
    setActivities(initialActivities);
    setAchievements(initialAchievements);
    setLearningItems(initialLearningItems);
    setActivityFeed(initialActivityFeed);
    setBlogPosts(initialBlogPosts);
    setMediaItems(initialMediaItems);
    setMessages(initialMessages);
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        updateProfile,
        sectionsConfig,
        updateSectionConfig,
        reorderSections,
        isSectionEnabled,
        projects,
        getPublishedProjects,
        getProjectBySlug,
        saveProject,
        deleteProject,
        skills,
        saveSkill,
        deleteSkill,
        focusAreas,
        education,
        saveEducation,
        deleteEducation,
        experience,
        saveExperience,
        deleteExperience,
        journey,
        saveJourneyItem,
        deleteJourneyItem,
        certifications,
        saveCertification,
        deleteCertification,
        activities,
        saveActivity,
        deleteActivity,
        achievements,
        saveAchievement,
        deleteAchievement,
        learningItems,
        saveLearningItem,
        deleteLearningItem,
        activityFeed,
        blogPosts,
        getPublishedBlogPosts,
        getBlogPostBySlug,
        saveBlogPost,
        deleteBlogPost,
        mediaItems,
        addMediaItem,
        deleteMediaItem,
        messages,
        submitMessage,
        markMessageRead,
        deleteMessage,
        deleteAllDemoData,
        resetAllData,
        syncToServer,
        refreshData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
