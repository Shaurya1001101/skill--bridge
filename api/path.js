/**
 * Vercel Serverless Function: /api/path
 * Syncs committed path & milestone tasks with Supabase.
 */
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xabzaaychzdpgtbgcrcx.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const userId = req.headers['x-user-id'] || req.body?.userId;

  if (req.method === 'PATCH') {
    const { taskId, isCompleted, xpAwarded = 25 } = req.body || {};
    if (supabaseKey && userId && userId !== 'guest') {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data } = await supabase.from('committed_paths').select('completed_task_ids').eq('user_id', Number(userId)).single();
        let completed = data?.completed_task_ids || [];
        if (isCompleted) {
          if (!completed.includes(taskId)) completed.push(taskId);
        } else {
          completed = completed.filter(id => id !== taskId);
        }
        await supabase.from('committed_paths').update({ completed_task_ids: completed, updated_at: new Date().toISOString() }).eq('user_id', Number(userId));
      } catch (e) {
        console.warn('Supabase toggle task warning:', e);
      }
    }
    return res.status(200).json({ success: true, taskId, isCompleted });
  }

  // POST: Commit Path
  const { roleKey, pacingKey } = req.body || {};
  if (supabaseKey && userId && userId !== 'guest') {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('committed_paths').upsert({
        user_id: Number(userId),
        role_key: roleKey,
        pacing_key: pacingKey,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase commit path warning:', e);
    }
  }

  return res.status(200).json({
    success: true,
    message: `Committed to ${pacingKey?.toUpperCase() || 'BALANCED'} path for ${roleKey}. +50 XP awarded!`,
  });
}
