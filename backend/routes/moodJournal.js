import express from 'express';
import { supabase } from '../services/supabaseClient.js';

const router = express.Router();

// POST /api/mood-journal
router.post('/', async (req, res) => {
  const { user_id, mood, note } = req.body;

  const { data, error } = await supabase
    .from('mood_journal')
    .insert([{ user_id, mood, note }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: 'Mood entry added', data });
});

// GET /api/mood-journal/:user_id
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from('mood_journal')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ data });
});


// DELETE /api/mood-journal/:user_id
router.delete('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const { error } = await supabase
    .from('mood_journal')
    .delete()
    .eq('user_id', user_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'All mood journal entries deleted.' });
});

export default router;