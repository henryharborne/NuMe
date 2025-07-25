import express from 'express';
import cors from 'cors';
import { supabase } from './services/supabaseClient.js';
import SettingsRoutes from './routes/settings.js';
import UserRoutes from './routes/user.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/settings', SettingsRoutes);
app.use('/api', UserRoutes);

// Simple test route at /
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Sleep logging endpoint
app.post('/api/sleep', async (req, res) => {
  const { user_id, date, hours, quality } = req.body;
  const { error } = await supabase
    .from('sleep_logs')
    .insert({ user_id, date, hours, quality });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: 'Logged sleep successfully!' });
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, password')
    .eq('email', email)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful', userId: user.id, email: user.email });
});

// Signup route
app.post('/api/signup', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password, and username required' });
  }

  // Check if user exists
  const { data: existingUser, error: existingUserError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  if (existingUserError && existingUserError.code !== 'PGRST116') {
    return res.status(500).json({ error: existingUserError.message });
  }

  // Insert user
  const { error } = await supabase.from('users').insert([{ email, password, username }]);
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: 'User created successfully' });
});

app.listen(4000, () => console.log('Backend running on http://localhost:4000'));
