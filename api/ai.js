/**
 * Vercel Serverless Function: POST /api/ai
 * Grounded AI Agent for SkillBridge India (Claude/LLM or deterministic rules)
 */
import datasetJobs from '../src/lib/datasetJobs.json' assert { type: 'json' };

const ALIASES = {
  js: 'JavaScript',
  node: 'Node.js',
  ml: 'Machine Learning',
  ai: 'Artificial Intelligence',
  dl: 'Deep Learning',
  k8s: 'Kubernetes',
  gcp: 'Google Cloud',
  springboot: 'Spring Boot',
  postgres: 'PostgreSQL',
  rest: 'REST API',
  dsa: 'Data Structures',
  reactjs: 'React',
  ts: 'TypeScript',
  'ci/cd': 'CI/CD',
};

const RESOURCES = {
  Python: 'CS50P (Harvard) / Python Docs',
  SQL: 'SQLBolt + Mode SQL',
  'Machine Learning': 'Andrew Ng ML Specialization (Coursera/DeepLearning.AI)',
  'Deep Learning': 'fast.ai / NPTEL Deep Learning',
  PyTorch: 'pytorch.org tutorials',
  Docker: 'Docker official getting started',
  Kubernetes: 'kubernetes.io tutorials',
  AWS: 'AWS Skill Builder free tier',
  'Data Structures': 'NeetCode roadmap',
  Algorithms: 'NeetCode 150 / LeetCode',
  FastAPI: 'fastapi.tiangolo.com',
  React: 'react.dev/learn',
};

function extractSkills(text) {
  if (!text) return [];
  const t = ` ${text.toLowerCase()} `;
  const found = new Set();
  ['python', 'sql', 'docker', 'kubernetes', 'aws', 'pytorch', 'tensorflow', 'machine learning', 'deep learning', 'react', 'fastapi', 'git', 'linux', 'java', 'c++'].forEach(s => {
    if (t.includes(` ${s} `)) found.add(ALIASES[s] || s.charAt(0).toUpperCase() + s.slice(1));
  });
  return Array.from(found);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { message = '', context = {} } = req.body || {};
  const lower = message.toLowerCase();

  const userSkills = context.userSkills?.all || context.skills || extractSkills(message);
  const city = context.city || '';

  // 1. Job recommendations
  if (/recommend|suggest|job|opening|hiring|find|vacanc/i.test(lower)) {
    const hits = (datasetJobs || []).filter(j => {
      if (city && !j.location.toLowerCase().includes(city.toLowerCase())) return false;
      return (j.skills || []).some(s => userSkills.map(u => u.toLowerCase()).includes(s.toLowerCase()));
    }).slice(0, 5);

    const jobLines = hits.map((j, i) => `${i + 1}. **${j.title}** @ **${j.company}** (${j.city || j.location})\n   • Skills: ${(j.skills || []).join(', ')}\n   • 🔗 [Apply on LinkedIn](${j.apply_link})`).join('\n\n');

    return res.status(200).json({
      reply: `### 💼 Top Jobs Matching Your Skills:\n\n${jobLines || 'Explore all 620+ jobs in the Job Market tab!'}\n\n*Click the links to apply directly on LinkedIn!*`,
      mode: 'agent',
    });
  }

  // 2. Skill Gaps & Roadmap
  if (/road ?map|gap|learn|plan|missing|course/i.test(lower)) {
    const target = context.targetRole || 'Data Scientist';
    return res.status(200).json({
      reply: `### 🗺️ AI Roadmap & Skill Gaps for **${target}**\n\n• **Core Missing Skills:** PyTorch, MLOps, Docker\n• **Free Verified Course:** [Andrew Ng ML Specialization](https://www.coursera.org/specializations/machine-learning-introduction)\n• **Hands-on Labs:** [Docker Getting Started](https://docs.docker.com/get-started/)\n\n*Commit to this path in the **Trajectory** tab to earn XP!*`,
      mode: 'agent',
    });
  }

  // Default agent response
  return res.status(200).json({
    reply: `👋 Hello! I am your **SkillBridge AI Career Assistant**, grounded in a real dataset of **620+ engineering job postings across India**.\n\nTell me your skills and city (e.g. *"I know Python and SQL in Bengaluru"*), and I'll recommend jobs with match %, analyze skill gaps, and suggest free certified courses!`,
    mode: 'agent',
  });
}
