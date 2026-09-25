import { create } from 'zustand';
import storage, { getDefaultCommittedPath, generatePathSchedule } from '../lib/storage.js';

const useStore = create((set, get) => ({
  // ─── Safety Scale (100% default scale, optional 90% view toggle) ────────
  safetyScale: storage.get('safetyScale', false),
  toggleSafetyScale: () => {
    const next = !get().safetyScale;
    storage.set('safetyScale', next);
    set({ safetyScale: next });
  },

  // ─── Auth ───────────────────────────────────────────────────────────────
  user: storage.get('user', null),
  setUser: (user) => {
    storage.set('user', user);
    set({ user });
  },
  logout: () => { storage.remove('user'); storage.remove('remember'); set({ user: null }); },

  // ─── Theme ──────────────────────────────────────────────────────────────
  theme: storage.get('theme', 'dark'),
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    storage.set('theme', next);
    set({ theme: next });
    document.documentElement.classList.toggle('light', next === 'light');
  },

  // ─── Committed Path & Gamified Schedule ─────────────────────────────────
  committedPath: storage.get('committedPath', getDefaultCommittedPath()),
  commitPath: (role = 'ml-engineer', pacing = 'balanced') => {
    const currentCompleted = get().committedPath?.completedTaskIds || [];
    const newPath = generatePathSchedule(role, pacing);
    newPath.completedTaskIds = currentCompleted.filter(id => newPath.tasks.some(t => t.id === id));
    storage.set('committedPath', newPath);
    set({ committedPath: newPath });
    get().addXP(50);
    get().addToast(`🚀 Committed to ${pacing.toUpperCase()} path for ${role}! +50 XP awarded`, 'success');
  },
  toggleTaskComplete: (taskId) => {
    const path = get().committedPath || getDefaultCommittedPath();
    const curr = path.completedTaskIds || [];
    const isCompleted = curr.includes(taskId);
    const next = isCompleted ? curr.filter(id => id !== taskId) : [...curr, taskId];
    const updatedPath = { ...path, completedTaskIds: next };

    storage.set('committedPath', updatedPath);
    set({ committedPath: updatedPath });

    if (!isCompleted) {
      get().addXP(25);
      get().addToast('🎯 Task completed! +25 XP earned!', 'success');
    } else {
      const newXP = Math.max(0, get().xp - 25);
      storage.set('xp', newXP);
      set({ xp: newXP });
      get().addToast('Task marked incomplete', 'info');
    }
  },
  setPacing: (pacingKey) => {
    const path = get().committedPath || getDefaultCommittedPath();
    const currentCompleted = path.completedTaskIds || [];
    const newPath = generatePathSchedule(path.role || 'ml-engineer', pacingKey);
    newPath.completedTaskIds = currentCompleted.filter(id => newPath.tasks.some(t => t.id === id));
    storage.set('committedPath', newPath);
    set({ committedPath: newPath });
    get().addToast(`Pacing updated to ${pacingKey.toUpperCase()}`, 'info');
  },

  // ─── Gap Analysis ───────────────────────────────────────────────────────
  gapResults: storage.get('gapResults', null),
  setGapResults: (r) => { storage.set('gapResults', r); set({ gapResults: r }); },

  // User's current skill levels (set by gap analysis)
  userSkills: storage.get('userSkills', {}),
  setUserSkills: (skills) => { storage.set('userSkills', skills); set({ userSkills: skills }); },

  targetRole: storage.get('targetRole', 'ml-engineer'),
  setTargetRole: (r) => { storage.set('targetRole', r); set({ targetRole: r }); },

  // ─── Analyzer Results ───────────────────────────────────────────────────
  analyzerExtracted: null,
  analyzerRole: 'ml-engineer',
  analyzerResults: null,
  setAnalyzerResults: (extracted, role, results) => set({ analyzerExtracted: extracted, analyzerRole: role, analyzerResults: results }),

  // ─── Waypoints ──────────────────────────────────────────────────────────
  completedWaypoints: storage.get('completedWaypoints', []),
  toggleWaypoint: (id) => {
    const curr = get().completedWaypoints;
    const next = curr.includes(id) ? curr.filter(w => w !== id) : [...curr, id];
    storage.set('completedWaypoints', next);
    set({ completedWaypoints: next });
  },

  // ─── Roadmap Check-offs ─────────────────────────────────────────────────
  completedWeeks: storage.get('completedWeeks', []),
  toggleWeek: (key) => {
    const curr = get().completedWeeks;
    const next = curr.includes(key) ? curr.filter(w => w !== key) : [...curr, key];
    storage.set('completedWeeks', next);
    set({ completedWeeks: next });
  },

  // ─── Daily Problem / XP / Streak ────────────────────────────────────────
  xp: storage.get('xp', 0),
  streak: storage.get('streak', 0),
  lastSolvedDate: storage.get('lastSolvedDate', null),
  solvedProblems: storage.get('solvedProblems', []),
  addXP: (pts) => {
    const newXP = get().xp + pts;
    storage.set('xp', newXP);
    const today = new Date().toDateString();
    const last = get().lastSolvedDate;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = last === yesterday ? get().streak + 1 : last === today ? get().streak : 1;
    storage.set('streak', newStreak);
    storage.set('lastSolvedDate', today);
    set({ xp: newXP, streak: newStreak, lastSolvedDate: today });
  },
  markProblemSolved: (id) => {
    const curr = get().solvedProblems;
    if (!curr.includes(id)) {
      const next = [...curr, id];
      storage.set('solvedProblems', next);
      set({ solvedProblems: next });
      get().addXP(10);
    }
  },

  // ─── Improvement Map ────────────────────────────────────────────────────
  planDuration: storage.get('planDuration', 12),
  setPlanDuration: (d) => { storage.set('planDuration', d); set({ planDuration: d }); },
  completedMilestones: storage.get('completedMilestones', []),
  toggleMilestone: (key) => {
    const curr = get().completedMilestones;
    const next = curr.includes(key) ? curr.filter(m => m !== key) : [...curr, key];
    storage.set('completedMilestones', next);
    set({ completedMilestones: next });
  },

  // ─── Settings ───────────────────────────────────────────────────────────
  notifications: storage.get('notifications', { weeklyDigest: true, streakReminder: true, newsAlerts: false }),
  setNotifications: (n) => { storage.set('notifications', n); set({ notifications: n }); },

  // ─── Toasts ─────────────────────────────────────────────────────────────
  toasts: [],
  addToast: (msg, type = 'info') => {
    const id = Date.now() + Math.random();
    set(s => ({ toasts: [...s.toasts, { id, msg, type }] }));
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 3500);
  },
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

  // ─── AI Chat ────────────────────────────────────────────────────────────
  chatOpen: false,
  chatMessages: [],
  toggleChat: () => set(s => ({ chatOpen: !s.chatOpen })),
  addChatMessage: (msg) => set(s => ({ chatMessages: [...s.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [] }),

  // ─── Notifications Panel ────────────────────────────────────────────────
  notifOpen: false,
  toggleNotif: () => set(s => ({ notifOpen: !s.notifOpen })),

  // ─── Navigation ─────────────────────────────────────────────────────────
  sidebarCollapsed: storage.get('sidebarCollapsed', false),
  toggleSidebar: () => {
    const next = !get().sidebarCollapsed;
    storage.set('sidebarCollapsed', next);
    set({ sidebarCollapsed: next });
  },
  mobileSidebarOpen: false,
  toggleMobileSidebar: () => set(s => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
}));

export default useStore;
