
import express from 'express';
import { supabase } from '../services/supabaseClient.js';

const router = express.Router();

// GET all sleep logs for a user
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await supabase
    .from('sleep_logs')
    .select('*')
    .eq('user_id', user_id)
    .order('date', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST new sleep log
router.post('/', async (req, res) => {
  const { user_id, date, sleep_start, sleep_end, hours_slept, note } = req.body;

  const { data, error } = await supabase
    .from('sleep_logs')
    .insert([{ user_id, date, sleep_start, sleep_end, hours_slept, note }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// GET weekly sleep stats
router.get('/stats/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await supabase
    .from('sleep_logs')
    .select('hours_slept, date')
    .eq('user_id', user_id)
    .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));

  if (error) return res.status(500).json({ error: error.message });

  const total = data.reduce((sum, entry) => sum + Number(entry.hours_slept || 0), 0);
  res.json({ weeklyHours: total.toFixed(1), entries: data });
});

// DELETE all sleep logs for a user
router.delete('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const { error } = await supabase
    .from('sleep_logs')
    .delete()
    .eq('user_id', user_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'All sleep logs deleted successfully.' });
});

export default router;
