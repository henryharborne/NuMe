// routes/user.js
import express from 'express';
import { supabase } from '../services/supabaseClient.js';

const router = express.Router();

router.post('/user-info', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const { data, error } = await supabase
    .from('users')
    .select('username')
    .eq('id', userId)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ username: data.username });
});

export default router;
