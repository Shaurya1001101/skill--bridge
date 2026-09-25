// ===== STORAGE UTILITY — swap for a real backend later =====
const PREFIX = 'sb_';

const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch {}
  },
  remove(key) { localStorage.removeItem(PREFIX + key); },
  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },
};

export default storage;

// ===== HELPERS =====
export function computeReadiness(skills, role) {
  let totalGap = 0, maxGap = 0;
  role.skills.forEach(sk => {
    const curr = (skills && skills[sk.name]) || 0;
    totalGap += sk.weight * Math.max(0, sk.required - curr);
    maxGap += sk.weight * sk.required;
  });
  if (maxGap === 0) return 0;
  return Math.round(Math.max(0, (1 - totalGap / maxGap) * 100));
}

export function extractSkillsFromText(text) {
  const lower = text.toLowerCase();
  const techSkills = ['python','sql','pandas','numpy','matplotlib','scikit-learn','tensorflow','pytorch','keras','spark','hadoop','kafka','dbt','airflow','tableau','power bi','r'];
  const mlSkills = ['machine learning','deep learning','nlp','computer vision','natural language processing','reinforcement learning','feature engineering','model deployment','mlops','llm','rag','generative ai','transformers','bert','gpt','langchain'];
  const toolSkills = ['docker','kubernetes','git','linux','fastapi','flask','django','ci/cd','jenkins','github actions','mlflow','kubeflow'];
  const cloudSkills = ['aws','gcp','azure','s3','ec2','sagemaker','vertex ai','bigquery','lambda','cloudwatch'];
  const softSkills = ['agile','scrum','problem solving','communication','teamwork'];

  const findMatches = list => list.filter(s => lower.includes(s.toLowerCase()));
  const found = {
    tech: findMatches(techSkills),
    ml: findMatches(mlSkills),
    tool: findMatches(toolSkills),
    cloud: findMatches(cloudSkills),
    soft: findMatches(softSkills),
  };
  found.all = [...found.tech, ...found.ml, ...found.tool, ...found.cloud, ...found.soft];
  return found;
}

export function getDailyProblem(problems) {
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  return problems[dayOfYear % problems.length];
}

export function generateICSContent(milestones, title = 'SkillBridge Study Plan') {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SkillBridge//EN',
    `X-WR-CALNAME:${title}`,
  ];
  milestones.forEach((m, i) => {
    const start = new Date();
    start.setDate(start.getDate() + i * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    lines.push(
      'BEGIN:VEVENT',
      `UID:sb-${i}-${Date.now()}@skillbridge`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${m.skill || m.title}`,
      `DESCRIPTION:${m.desc || ''}`,
      'END:VEVENT',
    );
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function rankVideosForGaps(videos, gapSkills) {
  if (!gapSkills || gapSkills.length === 0) return videos;
  const gapLower = gapSkills.map(s => s.toLowerCase());
  return [...videos].sort((a, b) => {
    const scoreA = a.tags.filter(t => gapLower.some(g => t.toLowerCase().includes(g) || g.includes(t.toLowerCase()))).length;
    const scoreB = b.tags.filter(t => gapLower.some(g => t.toLowerCase().includes(g) || g.includes(t.toLowerCase()))).length;
    return scoreB - scoreA;
  });
}

export function computeJobMatch(job, userSkills) {
  if (!userSkills || userSkills.length === 0) return { pct: 0, matched: [], missing: job.skills };
  const userLow = userSkills.map(s => s.toLowerCase());
  const matched = job.skills.filter(s => userLow.some(u => u.includes(s.toLowerCase()) || s.toLowerCase().includes(u)));
  const missing = job.skills.filter(s => !matched.includes(s));
  const pct = Math.round((matched.length / job.skills.length) * 100);
  return { pct, matched, missing };
}

export function generatePathSchedule(roleKey = 'ml-engineer', pacingKey = 'balanced') {
  const PACING_INFO = {
    aggressive: { totalWeeks: 4, hoursPerDay: 4, tasksPerWeek: 4, daysInterval: 2 },
    balanced: { totalWeeks: 8, hoursPerDay: 2.5, tasksPerWeek: 3, daysInterval: 2 },
    conservative: { totalWeeks: 16, hoursPerDay: 1.5, tasksPerWeek: 2, daysInterval: 3 },
  };

  const pacing = PACING_INFO[pacingKey] || PACING_INFO.balanced;
  const ROLE_SKILL_SEQUENCES = {
    'ml-engineer': [
      { skill: 'Python', focus: 'Vectorized computing, NumPy, OOP, typing and algorithmic optimization' },
      { skill: 'PyTorch', focus: 'Tensors, autograd, custom layers, CUDA acceleration, and DataLoader' },
      { skill: 'Machine Learning', focus: 'Feature engineering, ensemble models (XGBoost), and cross-validation' },
      { skill: 'Deep Learning', focus: 'CNNs, Transformers, fine-tuning pretrained checkpoints' },
      { skill: 'MLOps', focus: 'Model registries, experiment tracking with MLflow, and CI/CD testing' },
      { skill: 'Docker', focus: 'Containerizing FastAPI model servers, multi-stage builds, and Compose' },
    ],
    'data-scientist': [
      { skill: 'Python', focus: 'Pandas, data munging, NumPy array manipulation' },
      { skill: 'Statistics', focus: 'Hypothesis testing, confidence intervals, A/B experiment design' },
      { skill: 'SQL', focus: 'Window functions, CTEs, cohort analysis, and query optimization' },
      { skill: 'Machine Learning', focus: 'Scikit-learn pipelines, clustering, regression, and ROC metrics' },
      { skill: 'Deep Learning', focus: 'Time-series forecasting and NLP embeddings' },
      { skill: 'Cloud / AWS', focus: 'Athena, S3 datasets, and SageMaker model endpoints' },
    ],
    'mlops-engineer': [
      { skill: 'Python', focus: 'FastAPI, asynchronous microservices, and testing harnesses' },
      { skill: 'Docker', focus: 'Container images, non-root users, vulnerability scans, and Compose' },
      { skill: 'Kubernetes', focus: 'Deployments, services, HPA autoscaling, and Helm packages' },
      { skill: 'MLOps', focus: 'MLflow, Kubeflow pipelines, data drift alerts, and Prometheus' },
      { skill: 'CI/CD', focus: 'GitHub Actions, automated model evaluation benchmarks, canary rollouts' },
      { skill: 'Cloud / AWS', focus: 'EKS, IAM roles, ECR container registries, and CloudWatch' },
    ],
  };

  const sequence = ROLE_SKILL_SEQUENCES[roleKey] || ROLE_SKILL_SEQUENCES['ml-engineer'];
  const today = new Date();
  today.setHours(9, 0, 0, 0);

  const tasks = [];
  let dayOffset = 0;

  sequence.forEach((item, seqIdx) => {
    const weekStart = Math.floor(seqIdx * (pacing.totalWeeks / sequence.length)) + 1;
    const weekEnd = Math.max(weekStart, Math.floor((seqIdx + 1) * (pacing.totalWeeks / sequence.length)));
    const weekLabel = weekStart === weekEnd ? `Week ${weekStart}` : `Weeks ${weekStart}–${weekEnd}`;

    // 1. Practice Task
    const d1 = new Date(today);
    d1.setDate(today.getDate() + dayOffset);
    tasks.push({
      id: `task-${seqIdx}-practice`,
      milestoneIdx: seqIdx,
      skill: item.skill,
      weekLabel,
      type: 'practice',
      title: `${item.skill}: Interview Practice & Algorithmic Drills`,
      desc: `Solve 3 curated problems on LeetCode/HackerRank covering ${item.skill}. Focus on runtime complexity and test cases.`,
      targetPlatform: 'LeetCode / HackerRank',
      date: d1.toISOString().split('T')[0],
      displayDate: d1.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      hours: pacing.hoursPerDay,
      xp: 25,
    });
    dayOffset += pacing.daysInterval;

    // 2. Learning & Masterclass Task
    const d2 = new Date(today);
    d2.setDate(today.getDate() + dayOffset);
    tasks.push({
      id: `task-${seqIdx}-learning`,
      milestoneIdx: seqIdx,
      skill: item.skill,
      weekLabel,
      type: 'learning',
      title: `${item.skill}: Architecture & Theory Masterclass`,
      desc: `Watch deep-dive tutorial and complete interactive exercises on ${item.focus}.`,
      targetPlatform: 'YouTube / Coursera',
      date: d2.toISOString().split('T')[0],
      displayDate: d2.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      hours: pacing.hoursPerDay,
      xp: 25,
    });
    dayOffset += pacing.daysInterval;

    // 3. Hands-on Lab Task
    const d3 = new Date(today);
    d3.setDate(today.getDate() + dayOffset);
    tasks.push({
      id: `task-${seqIdx}-lab`,
      milestoneIdx: seqIdx,
      skill: item.skill,
      weekLabel,
      type: 'project',
      title: `${item.skill}: Sandbox Implementation Lab`,
      desc: `Build and test a runnable module applying ${item.skill} directly in Code Labs or a local Git repository.`,
      targetPlatform: 'SkillBridge Code Lab',
      date: d3.toISOString().split('T')[0],
      displayDate: d3.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      hours: pacing.hoursPerDay,
      xp: 35,
    });
    dayOffset += pacing.daysInterval;
  });

  return {
    role: roleKey,
    pacing: pacingKey,
    startDate: today.toISOString().split('T')[0],
    totalWeeks: pacing.totalWeeks,
    hoursPerWeek: pacing.hoursPerDay * (pacingKey === 'aggressive' ? 7 : pacingKey === 'balanced' ? 6 : 5),
    milestones: sequence.map((s, i) => ({
      index: i + 1,
      skill: s.skill,
      focus: s.focus,
      weekAlloc: pacingKey === 'aggressive'
        ? `Week ${Math.min(4, Math.floor(i * 4 / sequence.length) + 1)}`
        : pacingKey === 'balanced'
        ? `Weeks ${i + 1}–${i + 2}`
        : `Weeks ${i * 2 + 1}–${i * 2 + 3}`,
    })),
    tasks,
  };
}

export function getDefaultCommittedPath() {
  const defaultPath = generatePathSchedule('ml-engineer', 'balanced');
  // Mark the first 2 tasks completed by default for an engaging starting state
  return {
    ...defaultPath,
    completedTaskIds: [defaultPath.tasks[0]?.id, defaultPath.tasks[1]?.id].filter(Boolean),
  };
}

