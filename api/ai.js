// Vercel Serverless Function: /api/ai
// Proxy for OpenAI-compatible AI assistant with rule-based fallback

const RULE_BASED_ANSWERS = {
  'gap score': 'The gap score formula: Σ[skill_weight × max(0, required − current)] normalized to 0–100%.',
  'resume': 'Resume parsing happens client-side — your data never leaves the browser.',
  'streak': 'Earn XP by solving daily problems (+10 XP). Streaks reset if you skip a day.',
  'calendar': 'Export your roadmap as .ics from the Improvement Map page.',
  'deploy': 'Run: vercel in the skillbridge-app folder. Set VITE_AI_KEY for AI features.',
  'waypoint': 'Waypoints are the 6 major milestones: Baseline → Foundations → Core → Labs → Masterclass → Capstone.',
};

function ruleBasedFallback(message) {
  const lower = message.toLowerCase();
  for (const [key, answer] of Object.entries(RULE_BASED_ANSWERS)) {
    if (lower.includes(key)) return answer;
  }
  return "I'm SkillBridge's assistant. Ask me about skill gaps, roadmaps, Code Labs, daily problems, job matching, or deployment.";
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message required' });

  const apiKey = process.env.VITE_AI_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: ruleBasedFallback(message), source: 'rule-based' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 256,
        messages: [
          {
            role: 'system',
            content: `You are SkillBridge's AI career coach. Help users with: skill gap analysis, Python/ML/SQL learning, career roadmaps, coding problems, job market strategy. Be concise, actionable, and encouraging. Never hallucinate certifications or guarantee job outcomes.`,
          },
          { role: 'user', content: message },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || ruleBasedFallback(message);
    return res.status(200).json({ reply, source: 'ai' });
  } catch (e) {
    return res.status(200).json({ reply: ruleBasedFallback(message), source: 'rule-based-fallback' });
  }
}
