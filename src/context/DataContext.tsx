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

  // Fetch server database state on initial mount
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data && !data.empty) {
          if (data.profile) setProfile(data.profile);
          if (data.projects) setProjects(data.projects);
          if (data.skills) setSkills(data.skills);
          if (data.education) setEducation(data.education);
          if (data.experience) setExperience(data.experience);
          if (data.journey) setJourney(data.journey);
          if (data.certifications) setCertifications(data.certifications);
          if (data.mediaItems) setMediaItems(data.mediaItems);
          if (data.messages) setMessages(data.messages);
          if (data.blogPosts) setBlogPosts(data.blogPosts);
        }
      })
      .catch(err => {
        console.warn('[DataContext] Server sync load notice:', err);
      });
  }, []);

  // Sync states to local storage and server
  useEffect(() => {
    setStored('profile', profile);
    const timeout = setTimeout(() => {
      const storedToken = sessionStorage.getItem('cms_bearer_token');
      if (storedToken) {
        fetch('/api/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          credentials: 'include',
          body: JSON.stringify({
            profile,
            projects,
            skills,
            education,
            experience,
            journey,
            certifications,
            mediaItems,
            messages,
            blogPosts
          })
        }).catch(() => {});
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [profile, projects, skills, education, experience, journey, certifications, mediaItems, messages, blogPosts]);

  const updateProfile = (data: Partial<SiteProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
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
    setProjects(prev => {
      const idx = prev.findIndex(p => p.id === project.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = project;
        return next;
      }
      return [project, ...prev];
    });

    // Update verified skill links automatically
    if (project.technologies && project.technologies.length > 0) {
      setSkills(prevSkills =>
        prevSkills.map(sk => {
          if (project.technologies.includes(sk.name)) {
            const currentRelated = sk.relatedProjects || [];
            if (!currentRelated.includes(project.title)) {
              return { ...sk, relatedProjects: [...currentRelated, project.title] };
            }
          }
          return sk;
        })
      );
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const saveSkill = (skill: SkillItem) => {
    setSkills(prev => {
      const idx = prev.findIndex(s => s.id === skill.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = skill;
        return next;
      }
      return [...prev, skill];
    });
  };

  const deleteSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  const saveEducation = (edu: EducationItem) => {
    setEducation(prev => {
      const idx = prev.findIndex(e => e.id === edu.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = edu;
        return next;
      }
      return [edu, ...prev];
    });
  };

  const deleteEducation = (id: string) => {
    setEducation(prev => prev.filter(e => e.id !== id));
  };

  const saveExperience = (exp: ExperienceItem) => {
    setExperience(prev => {
      const idx = prev.findIndex(e => e.id === exp.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = exp;
        return next;
      }
      return [exp, ...prev];
    });
  };

  const deleteExperience = (id: string) => {
    setExperience(prev => prev.filter(e => e.id !== id));
  };

  const saveJourneyItem = (item: JourneyMilestone) => {
    setJourney(prev => {
      const idx = prev.findIndex(j => j.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      return [item, ...prev];
    });
  };

  const deleteJourneyItem = (id: string) => {
    setJourney(prev => prev.filter(j => j.id !== id));
  };

  const saveCertification = (cert: Certification) => {
    setCertifications(prev => {
      const idx = prev.findIndex(c => c.id === cert.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = cert;
        return next;
      }
      return [cert, ...prev];
    });
  };

  const deleteCertification = (id: string) => {
    setCertifications(prev => prev.filter(c => c.id !== id));
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
        resetAllData
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
