import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
export async function POST(req: Request) {
  const { userId, mood, note } = await req.json();

  if (!userId || !mood || !note) {
    return NextResponse.json({ error: 'User ID, mood, and a note are required.' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('mood_journal')
      .insert([
        { 
            user_id: userId, mood: mood, note: note 
        }
    ])
      .select();

    if (error) {
        console.error('Error saving mood journal entry:', error);
        throw error;
    }

    return NextResponse.json(data[0]);
  } 
  catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
  }
}
