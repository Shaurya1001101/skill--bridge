import { create } from 'zustand';
import storage, { getDefaultCommittedPath, generatePathSchedule } from '../lib/storage.js';
import { apiUrl } from '../lib/api.js';

const useStore = create((set, get) => ({
  // ─── Safety Scale (100% default scale, optional 90% view toggle) ────────
  safetyScale: storage.get('safetyScale', false),
  toggleSafetyScale: () => {
    const next = !get().safetyScale;
    storage.set('safetyScale', next);
    set({ safetyScale: next });
  },

  // ─── Sidebar Navigation & Drawer State ──────────────────────────────────
  sidebarCollapsed: storage.get('sidebarCollapsed', false),
  toggleSidebar: () => {
    const next = !get().sidebarCollapsed;
    storage.set('sidebarCollapsed', next);
    set({ sidebarCollapsed: next });
  },
  mobileSidebarOpen: false,
  toggleMobileSidebar: () => set(s => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),

  // ─── Auth & User Session ────────────────────────────────────────────────
  user: storage.get('user', null),
  setUser: (user) => {
    storage.set('user', user);
    set({ user });
  },
  initUserSession: (authPayload) => {
    const { user, profile, committedPath } = authPayload || {};
    if (!user) return;

    storage.set('user', user);

    const xp = profile?.xp ?? 0;
    const streak = profile?.streak ?? 1;
    const targetRole = profile?.targetRole || 'ml-engineer';
    const userSkills = profile?.skills || { all: [] };

    let resolvedPath = null;
    if (committedPath?.role) {
      resolvedPath = {
        ...generatePathSchedule(committedPath.role, committedPath.pacing || 'balanced'),
        completedTaskIds: committedPath.completedTaskIds || [],
      };
    } else if (user.email === 'user@skillbridge.io') {
      resolvedPath = getDefaultCommittedPath();
    }

    storage.set('xp', xp);
    storage.set('streak', streak);
    storage.set('targetRole', targetRole);
    storage.set('userSkills', userSkills);
    storage.set('committedPath', resolvedPath);

    // If a brand new user with no skills, reset any stale demo analysis artifacts
    const hasSkills = userSkills?.all?.length > 0;
    if (!hasSkills) {
      storage.remove('gapResults');
      storage.remove('completedWaypoints');
      storage.remove('completedWeeks');
      storage.remove('solvedProblems');
      set({
        user,
        xp,
        streak,
        targetRole,
        userSkills,
        committedPath: resolvedPath,
        gapResults: null,
        completedWaypoints: [],
        completedWeeks: [],
        solvedProblems: [],
      });
    } else {
      set({
        user,
        xp,
        streak,
        targetRole,
        userSkills,
        committedPath: resolvedPath,
      });
    }
  },
  logout: () => {
    storage.remove('user');
    storage.remove('remember');
    storage.remove('xp');
    storage.remove('streak');
    storage.remove('gapResults');
    storage.remove('userSkills');
    storage.remove('committedPath');
    storage.remove('completedWaypoints');
    storage.remove('completedWeeks');
    storage.remove('solvedProblems');
    set({
      user: null,
      xp: 0,
      streak: 0,
      gapResults: null,
      userSkills: { all: [] },
      committedPath: null,
      completedWaypoints: [],
      completedWeeks: [],
      solvedProblems: [],
    });
  },

  // ─── Real-time PostgreSQL Backend Synchronization ───────────────────────
  syncToBackend: async () => {
    const user = get().user;
    if (!user?.id) return;
    try {
      await fetch(apiUrl('/api/profile'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(user.id),
        },
        body: JSON.stringify({
          xp: get().xp,
          streak: get().streak,
          targetRole: get().targetRole,
          skills: get().userSkills,
          completedTaskIds: get().committedPath?.completedTaskIds || [],
        }),
      });
    } catch (e) {
      console.warn('Background sync with Supabase failed:', e);
    }
  },

  // ─── Theme (Dark mode is default on site visit) ────────────────────────
  theme: storage.get('theme', 'dark'),
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    storage.set('theme', next);
    set({ theme: next });
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(next);
  },
  setTheme: (next) => {
    storage.set('theme', next);
    set({ theme: next });
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(next);
  },

  // ─── Committed Path & Gamified Schedule ─────────────────────────────────
  committedPath: storage.get('committedPath', null),
  commitPath: async (role = 'ml-engineer', pacing = 'balanced') => {
    const currentCompleted = get().committedPath?.completedTaskIds || [];
    const newPath = generatePathSchedule(role, pacing);
    newPath.completedTaskIds = currentCompleted.filter((id) =>
      newPath.tasks.some((t) => t.id === id)
    );
    storage.set('committedPath', newPath);
    set({ committedPath: newPath });
    get().addXP(50);
    get().addToast(`🚀 Committed to ${pacing.toUpperCase()} path for ${role}! +50 XP awarded`, 'success');

    // Sync path commitment with backend
    const user = get().user;
    if (user?.id) {
      try {
        await fetch(apiUrl('/api/path'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': String(user.id),
          },
          body: JSON.stringify({ roleKey: role, pacingKey: pacing }),
        });
      } catch (e) {
        console.warn('Failed to sync path to backend:', e);
      }
    }
  },
  toggleTaskComplete: async (taskId) => {
    const path = get().committedPath || getDefaultCommittedPath();
    const curr = path.completedTaskIds || [];
    const isCompleted = curr.includes(taskId);
    const next = isCompleted ? curr.filter((id) => id !== taskId) : [...curr, taskId];
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

    // Sync task state with backend
    const user = get().user;
    if (user?.id) {
      try {
        await fetch(apiUrl('/api/path'), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': String(user.id),
          },
          body: JSON.stringify({
            taskId,
            isCompleted: !isCompleted,
            xpAwarded: !isCompleted ? 25 : 0,
          }),
        });
      } catch (e) {
        console.warn('Failed to sync task toggle to backend:', e);
      }
    }
  },
  setPacing: (pacingKey) => {
    const path = get().committedPath || getDefaultCommittedPath();
    const currentCompleted = path.completedTaskIds || [];
    const newPath = generatePathSchedule(path.role || 'ml-engineer', pacingKey);
    newPath.completedTaskIds = currentCompleted.filter((id) =>
      newPath.tasks.some((t) => t.id === id)
    );
    storage.set('committedPath', newPath);
    set({ committedPath: newPath });
    get().addToast(`Pacing updated to ${pacingKey.toUpperCase()}`, 'info');
    get().syncToBackend();
  },

  // ─── Gap Analysis ───────────────────────────────────────────────────────
  gapResults: storage.get('gapResults', null),
  setGapResults: (r) => {
    storage.set('gapResults', r);
    set({ gapResults: r });
  },

  // User's current skill levels
  userSkills: storage.get('userSkills', { all: [] }),
  setUserSkills: (skills) => {
    storage.set('userSkills', skills);
    set({ userSkills: skills });
    get().syncToBackend();
  },

  targetRole: storage.get('targetRole', 'ml-engineer'),
  setTargetRole: (r) => {
    storage.set('targetRole', r);
    set({ targetRole: r });
    get().syncToBackend();
  },

  // ─── Analyzer Results ───────────────────────────────────────────────────
  analyzerExtracted: null,
  analyzerRole: 'ml-engineer',
  analyzerResults: null,
  setAnalyzerResults: (extracted, role, results) =>
    set({ analyzerExtracted: extracted, analyzerRole: role, analyzerResults: results }),

  // ─── Waypoints ──────────────────────────────────────────────────────────
  completedWaypoints: storage.get('completedWaypoints', []),
  toggleWaypoint: (id) => {
    const curr = get().completedWaypoints;
    const next = curr.includes(id) ? curr.filter((w) => w !== id) : [...curr, id];
    storage.set('completedWaypoints', next);
    set({ completedWaypoints: next });
  },

  // ─── Roadmap Check-offs ─────────────────────────────────────────────────
  completedWeeks: storage.get('completedWeeks', []),
  toggleWeek: (key) => {
    const curr = get().completedWeeks;
    const next = curr.includes(key) ? curr.filter((w) => w !== key) : [...curr, key];
    storage.set('completedWeeks', next);
    set({ completedWeeks: next });
  },

  // ─── Daily Problem / XP / Streak ────────────────────────────────────────
  xp: storage.get('xp', 0),
  streak: storage.get('streak', 0),
  lastSolvedDate: storage.get('lastSolvedDate', null),
  solvedProblems: storage.get('solvedProblems', []),
  setXP: (xp) => {
    storage.set('xp', xp);
    set({ xp });
  },
  setStreak: (streak) => {
    storage.set('streak', streak);
    set({ streak });
  },
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
    get().syncToBackend();
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
  setPlanDuration: (d) => {
    storage.set('planDuration', d);
    set({ planDuration: d });
  },
  completedMilestones: storage.get('completedMilestones', []),
  toggleMilestone: (key) => {
    const curr = get().completedMilestones;
    const next = curr.includes(key) ? curr.filter((m) => m !== key) : [...curr, key];
    storage.set('completedMilestones', next);
    set({ completedMilestones: next });
  },

  // ─── Settings ───────────────────────────────────────────────────────────
  notifications: storage.get('notifications', {
    weeklyDigest: true,
    streakReminder: true,
    newsAlerts: false,
  }),
  setNotifications: (n) => {
    storage.set('notifications', n);
    set({ notifications: n });
  },

  // ─── Toasts ─────────────────────────────────────────────────────────────
  toasts: [],
  addToast: (msg, type = 'info') => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts, { id, msg, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3800);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // ─── AI Assistant Career Chat ──────────────────────────────────────────
  chatOpen: false,
  toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
  setChatOpen: (open) => set({ chatOpen: Boolean(open) }),
  chatMessages: storage.get('chatMessages', []),
  addChatMessage: (msg) => {
    const next = [...get().chatMessages, msg];
    storage.set('chatMessages', next.slice(-40));
    set({ chatMessages: next });
  },
  clearChat: () => {
    storage.remove('chatMessages');
    set({ chatMessages: [] });
  },
}));

export default useStore;
