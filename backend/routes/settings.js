// routes/settings.js
import express from 'express';
import { supabase } from '../services/supabaseClient.js';

const router = express.Router();

// Change username
router.put('/username', async (req, res) => {
  const { userId, newUsername } = req.body;

  if (!userId || !newUsername) {
    return res.status(400).json({ error: 'Missing userId or newUsername' });
  }

  const { error } = await supabase
    .from('users')
    .update({ username: newUsername })
    .eq('id', userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: 'Username updated successfully' });
});

// Change password
router.put('/password', async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing userId, oldPassword, or newPassword' });
  }

  // Fetch current password
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('password')
    .eq('id', userId)
    .single();

  if (fetchError || !user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.password !== oldPassword) {
    return res.status(403).json({ error: 'Incorrect current password' });
  }

  const { error: updateError } = await supabase
    .from('users')
    .update({ password: newPassword })
    .eq('id', userId);

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  res.json({ message: 'Password updated successfully' });
});

export default router;
