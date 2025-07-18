import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    const { journalEntry } = await req.json();
    if(!journalEntry){
        return NextResponse.json({ error: "Journal Entry is Required." }, { status: 400 });
    }

    try{
        const gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
        const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" })

        const prompt = `
        Analyze the following journal entry without giving medical advice. Please identify the
        overall sentiment, key themes, and provide encouraging and gentle affirmation.
        
        The following journal entry is "${journalEntry}"
        
        Provide the response strictly in the following JSON format:
        {
        "sentiment": "Positive | Negative | Neutral | Mixed",
        "themes": ["Theme 1", "Theme 2", "Theme 3"],
        "affirmation": "A short, positive affirmation based on the text."
        }
        `;
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const geminiAnalysis = JSON.parse(response);
        return NextResponse.json(geminiAnalysis);
    }
    catch(error){
        console.error("Error analyzing journal entry:", error);
        return NextResponse.json({ error: "Failed to analyze journal entry." }, { status: 500 })
    }

}