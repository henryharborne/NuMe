import express from 'express';
import { supabase } from '../services/supabaseClient.js';

const router = express.Router();

// GET all meal logs for a user
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', user_id)
    .order('date', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST new meal log
router.post('/', async (req, res) => {
  const { user_id, date, meal_type, food, calories } = req.body;

  const { data, error } = await supabase
    .from('meal_logs')
    .insert([{ user_id, date, meal_type, food, calories }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// GET daily calorie stats for the last 7 days
router.get('/stats/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from('meal_logs')
    .select('calories, date')
    .eq('user_id', user_id)
    .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));

  if (error) return res.status(500).json({ error: error.message });

  // Aggregate daily calories
  const dailyTotals = {};
  data.forEach(entry => {
    const day = entry.date;
    if (!dailyTotals[day]) dailyTotals[day] = 0;
    dailyTotals[day] += Number(entry.calories || 0);
  });

  res.json({ dailyCalories: dailyTotals, entries: data });
});

// DELETE all meal logs for a user
router.delete('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const { error } = await supabase
    .from('meal_logs')
    .delete()
    .eq('user_id', user_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'All meal logs deleted successfully.' });
});

export default router;
