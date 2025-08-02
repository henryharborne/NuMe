import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const aiPrompt = `
    You are a friendly and supportive lifestyle assistant.
    Your goal is to respond to the user's message in a conversational, empathetic, and concise way.
    Focus on everyday guidance and encouragement, without providing medical, legal, or financial advice.
    Offer practical tips or thoughtful reflections when appropriate.
    Avoid long paragraphs unless the user is asking for a detailed response.

    Format your answer in 2-3 short paragraphs or a clear list if advice is given.

    User message: "${prompt}"
    `;

    const result = await model.generateContent(aiPrompt);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response.' }, { status: 500 });
  }
}
