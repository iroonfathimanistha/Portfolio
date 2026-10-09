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
  updateProfile: (profile: Partial<SiteProfile>) => Promise<boolean>;
  sectionsConfig: SectionConfig[];
  updateSectionConfig: (key: string, updates: Partial<SectionConfig>) => void;
  reorderSections: (newOrder: SectionConfig[]) => void;
  isSectionEnabled: (key: string) => boolean;
  projects: Project[];
  getPublishedProjects: () => Project[];
  getProjectBySlug: (slug: string) => Project | undefined;
  saveProject: (project: Project) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  skills: SkillItem[];
  saveSkill: (skill: SkillItem) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;
  focusAreas: FocusArea[];
  education: EducationItem[];
  saveEducation: (edu: EducationItem) => Promise<boolean>;
  deleteEducation: (id: string) => Promise<boolean>;
  experience: ExperienceItem[];
  saveExperience: (exp: ExperienceItem) => Promise<boolean>;
  deleteExperience: (id: string) => Promise<boolean>;
  journey: JourneyMilestone[];
  saveJourneyItem: (item: JourneyMilestone) => Promise<boolean>;
  deleteJourneyItem: (id: string) => Promise<boolean>;
  certifications: Certification[];
  saveCertification: (cert: Certification) => Promise<boolean>;
  deleteCertification: (id: string) => Promise<boolean>;
  activities: ActivityItem[];
  saveActivity: (act: ActivityItem) => Promise<boolean>;
  deleteActivity: (id: string) => Promise<boolean>;
  achievements: Achievement[];
  saveAchievement: (achieve: Achievement) => Promise<boolean>;
  deleteAchievement: (id: string) => Promise<boolean>;
  learningItems: LearningItem[];
  saveLearningItem: (item: LearningItem) => Promise<boolean>;
  deleteLearningItem: (id: string) => Promise<boolean>;
  activityFeed: ActivityFeedItem[];
  blogPosts: BlogPost[];
  getPublishedBlogPosts: () => BlogPost[];
  getBlogPostBySlug: (slug: string) => BlogPost | undefined;
  saveBlogPost: (post: BlogPost) => Promise<boolean>;
  deleteBlogPost: (id: string) => Promise<boolean>;
  mediaItems: MediaItem[];
  addMediaItem: (item: MediaItem) => Promise<boolean>;
  deleteMediaItem: (id: string) => Promise<boolean>;
  messages: ContactMessage[];
  submitMessage: (message: Omit<ContactMessage, 'id' | 'receivedAt' | 'read'>) => Promise<boolean>;
  markMessageRead: (id: string) => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
  deleteAllDemoData: () => Promise<boolean>;
  resetAllData: () => Promise<boolean>;
  syncToServer: (customPayload?: any) => Promise<boolean>;
  refreshData: () => Promise<void>;
  lastSyncError: string | null;
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
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>(() => getStored('focusAreas', initialFocusAreas));
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

  const applyDataToState = (data: any) => {
    if (!data || data.empty) return;
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
    if (data.focusAreas) {
      setFocusAreas(data.focusAreas);
      setStored('focusAreas', data.focusAreas);
    }
    if (data.activities) {
      setActivities(data.activities);
      setStored('activities', data.activities);
    }
    if (data.achievements) {
      setAchievements(data.achievements);
      setStored('achievements', data.achievements);
    }
    if (data.learningItems) {
      setLearningItems(data.learningItems);
      setStored('learningItems', data.learningItems);
    }
    if (data.activityFeed) {
      setActivityFeed(data.activityFeed);
      setStored('activityFeed', data.activityFeed);
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
  };

  const refreshData = async (): Promise<void> => {
    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data && !data.empty) {
        applyDataToState(data);
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

  const [lastSyncError, setLastSyncError] = useState<string | null>(null);

  const syncToServer = async (customPayload?: any): Promise<boolean> => {
    try {
      const storedToken = sessionStorage.getItem('cms_bearer_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
      }

      // If specific customPayload is provided (e.g. { profile: updated }), send ONLY that payload
      // so PostgreSQL merges it atomically without overwriting other collections with stale React state.
      const payload = customPayload || {
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
        blogPosts
      };

      const res = await fetch('/api/data', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let errorMsg = `Server error ${res.status}`;
        try {
          const errJson = await res.json();
          errorMsg = errJson.message || errJson.error || errorMsg;
        } catch {
          const text = await res.text();
          if (text) errorMsg = text.slice(0, 150);
        }
        console.error('[DataContext] Server sync error:', errorMsg);
        setLastSyncError(errorMsg);
        return false;
      }

      const resJson = await res.json();
      if (!resJson.success) {
        const errorMsg = resJson.message || resJson.error || 'Database save failed';
        console.error('[DataContext] Database sync unsuccessful:', errorMsg);
        setLastSyncError(errorMsg);
        return false;
      }

      // Authoritatively update state from PostgreSQL response
      if (resJson.data) {
        applyDataToState(resJson.data);
      }

      setLastSyncError(null);
      return true;
    } catch (err: any) {
      const errorMsg = err?.message || 'Network error occurred during database sync';
      console.error('[DataContext] Server sync network error:', errorMsg);
      setLastSyncError(errorMsg);
      return false;
    }
  };

  const updateProfile = (data: Partial<SiteProfile>): Promise<boolean> => {
    const updated = { ...profile, ...data };
    setProfile(updated);
    setStored('profile', updated);
    return syncToServer({ profile: updated });
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

  const saveProject = (project: Project): Promise<boolean> => {
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
    return syncToServer({ projects: next });
  };

  const deleteProject = (id: string): Promise<boolean> => {
    const next = projects.filter(p => p.id !== id);
    setProjects(next);
    setStored('projects', next);
    return syncToServer({ projects: next });
  };

  const saveSkill = (skill: SkillItem): Promise<boolean> => {
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
    return syncToServer({ skills: next });
  };

  const deleteSkill = (id: string): Promise<boolean> => {
    const next = skills.filter(s => s.id !== id);
    setSkills(next);
    setStored('skills', next);
    return syncToServer({ skills: next });
  };

  const saveEducation = (edu: EducationItem): Promise<boolean> => {
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
    return syncToServer({ education: next });
  };

  const deleteEducation = (id: string): Promise<boolean> => {
    const next = education.filter(e => e.id !== id);
    setEducation(next);
    setStored('education', next);
    return syncToServer({ education: next });
  };

  const saveExperience = (exp: ExperienceItem): Promise<boolean> => {
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
    return syncToServer({ experience: next });
  };

  const deleteExperience = (id: string): Promise<boolean> => {
    const next = experience.filter(e => e.id !== id);
    setExperience(next);
    setStored('experience', next);
    return syncToServer({ experience: next });
  };

  const saveJourneyItem = (item: JourneyMilestone): Promise<boolean> => {
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
    return syncToServer({ journey: next });
  };

  const deleteJourneyItem = (id: string): Promise<boolean> => {
    const next = journey.filter(j => j.id !== id);
    setJourney(next);
    setStored('journey', next);
    return syncToServer({ journey: next });
  };

  const saveCertification = (cert: Certification): Promise<boolean> => {
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
    return syncToServer({ certifications: next });
  };

  const deleteCertification = (id: string): Promise<boolean> => {
    const next = certifications.filter(c => c.id !== id);
    setCertifications(next);
    setStored('certifications', next);
    return syncToServer({ certifications: next });
  };

  const saveActivity = (act: ActivityItem): Promise<boolean> => {
    let next: ActivityItem[] = [];
    const idx = activities.findIndex(a => a.id === act.id);
    if (idx >= 0) {
      next = [...activities];
      next[idx] = act;
    } else {
      next = [act, ...activities];
    }
    setActivities(next);
    setStored('activities', next);
    return syncToServer({ activities: next });
  };

  const deleteActivity = (id: string): Promise<boolean> => {
    const next = activities.filter(a => a.id !== id);
    setActivities(next);
    setStored('activities', next);
    return syncToServer({ activities: next });
  };

  const saveAchievement = (achieve: Achievement): Promise<boolean> => {
    let next: Achievement[] = [];
    const idx = achievements.findIndex(a => a.id === achieve.id);
    if (idx >= 0) {
      next = [...achievements];
      next[idx] = achieve;
    } else {
      next = [achieve, ...achievements];
    }
    setAchievements(next);
    setStored('achievements', next);
    return syncToServer({ achievements: next });
  };

  const deleteAchievement = (id: string): Promise<boolean> => {
    const next = achievements.filter(a => a.id !== id);
    setAchievements(next);
    setStored('achievements', next);
    return syncToServer({ achievements: next });
  };

  const saveLearningItem = (item: LearningItem): Promise<boolean> => {
    let next: LearningItem[] = [];
    const idx = learningItems.findIndex(l => l.id === item.id);
    if (idx >= 0) {
      next = [...learningItems];
      next[idx] = item;
    } else {
      next = [...learningItems, item];
    }
    setLearningItems(next);
    setStored('learningItems', next);
    return syncToServer({ learningItems: next });
  };

  const deleteLearningItem = (id: string): Promise<boolean> => {
    const next = learningItems.filter(l => l.id !== id);
    setLearningItems(next);
    setStored('learningItems', next);
    return syncToServer({ learningItems: next });
  };

  const getPublishedBlogPosts = () => blogPosts.filter(b => b.published);
  const getBlogPostBySlug = (slug: string) => blogPosts.find(b => b.slug === slug || b.id === slug);

  const saveBlogPost = (post: BlogPost): Promise<boolean> => {
    let next: BlogPost[] = [];
    const idx = blogPosts.findIndex(b => b.id === post.id);
    if (idx >= 0) {
      next = [...blogPosts];
      next[idx] = post;
    } else {
      next = [post, ...blogPosts];
    }
    setBlogPosts(next);
    setStored('blogPosts', next);
    return syncToServer({ blogPosts: next });
  };

  const deleteBlogPost = (id: string): Promise<boolean> => {
    const next = blogPosts.filter(b => b.id !== id);
    setBlogPosts(next);
    setStored('blogPosts', next);
    return syncToServer({ blogPosts: next });
  };

  const addMediaItem = (item: MediaItem): Promise<boolean> => {
    const next = [item, ...mediaItems];
    setMediaItems(next);
    setStored('mediaItems', next);
    return syncToServer({ mediaItems: next });
  };

  const deleteMediaItem = (id: string): Promise<boolean> => {
    const next = mediaItems.filter(m => m.id !== id);
    setMediaItems(next);
    setStored('mediaItems', next);
    return syncToServer({ mediaItems: next });
  };

  const submitMessage = async (msgData: Omit<ContactMessage, 'id' | 'receivedAt' | 'read'>): Promise<boolean> => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: 'msg-' + Date.now(),
      receivedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    const next = [newMsg, ...messages];
    setMessages(next);
    setStored('messages', next);
    await syncToServer({ messages: next });
    return true;
  };

  const markMessageRead = (id: string): Promise<boolean> => {
    const next = messages.map(m => (m.id === id ? { ...m, read: true } : m));
    setMessages(next);
    setStored('messages', next);
    return syncToServer({ messages: next });
  };

  const deleteMessage = (id: string): Promise<boolean> => {
    const next = messages.filter(m => m.id !== id);
    setMessages(next);
    setStored('messages', next);
    return syncToServer({ messages: next });
  };

  const deleteAllDemoData = async (): Promise<boolean> => {
    const cleared = {
      projects: [],
      education: [],
      experience: [],
      journey: [],
      certifications: [],
      activities: [],
      achievements: [],
      learningItems: [],
      blogPosts: [],
      messages: []
    };
    applyDataToState(cleared);
    return syncToServer(cleared);
  };

  const resetAllData = async (): Promise<boolean> => {
    const initialData = {
      profile: initialProfile,
      sectionsConfig: initialSectionsConfig,
      projects: initialProjects,
      skills: initialSkills,
      focusAreas: initialFocusAreas,
      education: initialEducation,
      experience: initialExperience,
      journey: initialJourney,
      certifications: initialCertifications,
      activities: initialActivities,
      achievements: initialAchievements,
      learningItems: initialLearningItems,
      activityFeed: initialActivityFeed,
      blogPosts: initialBlogPosts,
      mediaItems: initialMediaItems,
      messages: initialMessages
    };
    applyDataToState(initialData);
    return syncToServer(initialData);
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
        refreshData,
        lastSyncError
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
