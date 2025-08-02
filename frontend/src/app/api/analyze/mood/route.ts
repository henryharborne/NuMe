import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
    }
    const { data: journalEntries, error: dbError } = await supabase
      .from('mood_journal')
      .select('mood, note, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (dbError) {
      throw new Error(`Supabase error: ${dbError.message}`);
    }

    if (!journalEntries || journalEntries.length === 0) {
      return NextResponse.json({ 
        summary: "There are no journal entries to analyze yet.",
        affirmation: "Start by adding an entry to see your AI insights!"
      });
    }

    const formattedEntries = journalEntries.map(entry => 
      `On ${new Date(entry.created_at).toLocaleDateString()}, I felt ${entry.mood} and wrote: "${entry.note}"`
    ).join('\n\n');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
      Analyze the journal entries without giving medical advice. Please identify the
      overall sentiment, key themes, and provide an encouraging and gentle affirmation.
      
      The journal entries are "${formattedEntries}"
      Please provide the response strictly in the following JSON format:
      {
        "sentiment": "Positive | Negative | Neutral | Mixed",
        "themes": ["Theme 1", "Theme 2", "Theme 3"],
        "affirmation": "A short, positive affirmation based on the text.",
        "summary": "A brief summary of the entries."
      }
      `;


    // 5. Call the Gemini API and return the JSON response
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const analysis = JSON.parse(responseText);

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json({ error: 'Failed to analyze journal entries.' }, { status: 500 });
  }
}
