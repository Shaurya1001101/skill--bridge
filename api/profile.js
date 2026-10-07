/**
 * Vercel Serverless Function: /api/profile
 * Syncs user profile with Supabase.
 */
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xabzaaychzdpgtbgcrcx.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const userId = req.headers['x-user-id'] || req.query.userId || req.body?.userId;

  if (req.method === 'POST') {
    const { xp, streak, targetRole, skills, completedTaskIds } = req.body || {};
    if (supabaseKey && userId && userId !== 'guest') {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('user_profiles').upsert({
          user_id: Number(userId),
          xp,
          streak,
          target_role: targetRole,
          skills_json: skills,
          updated_at: new Date().toISOString(),
        });
        if (completedTaskIds) {
          await supabase.from('committed_paths').upsert({
            user_id: Number(userId),
            completed_task_ids: completedTaskIds,
            updated_at: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.warn('Supabase profile sync warning:', e);
      }
    }
    return res.status(200).json({ success: true, message: 'Profile synced with Supabase' });
  }

  if (supabaseKey && userId && userId !== 'guest' && userId !== '1' && userId !== 1) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: p } = await supabase.from('user_profiles').select('*').eq('user_id', Number(userId)).single();
      if (p) {
        return res.status(200).json({
          profile: {
            id: userId,
            role: 'User',
            xp: p.xp ?? 0,
            streak: p.streak || 1,
            targetRole: p.target_role || 'ml-engineer',
            skills: p.skills_json || { all: [] },
          },
        });
      }
    } catch {
      // Fall through
    }
  }

  // Demo user Alex Mercer
  if (userId === '1' || userId === 1 || userId === 'demo') {
    return res.status(200).json({
      profile: {
        id: 1,
        email: 'user@skillbridge.io',
        name: 'Alex Mercer',
        role: 'User',
        xp: 75,
        streak: 5,
        targetRole: 'data-scientist',
        skills: { all: ['Python', 'SQL', 'Git'] },
      },
    });
  }

  // New user or guest default
  return res.status(200).json({
    profile: {
      id: userId || 'guest',
      email: `${userId || 'guest'}@skillbridge.io`,
      name: userId === 'guest' ? 'Guest Engineer' : 'New Engineer',
      role: userId === 'guest' ? 'Guest' : 'User',
      xp: 0,
      streak: 1,
      targetRole: 'ml-engineer',
      skills: { all: [] },
    },
  });
}
