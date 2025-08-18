import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful AI assistant for GT Technologies, a leading company specializing in digital transformation solutions.

COMPANY INFORMATION:
GT Technologies offers:
- Industry 4.0 & Smart Manufacturing
- AR/VR Solutions & Digital Twins
- AI/ML Implementation
- Robotics & Automation
- IoT Integration
- 3D Printing & Prototyping
- Electric Vehicles
- Engineering solutions for Automotive, Railways, Shipbuilding, Aerospace, Construction, Mining
- Digital Manufacturing solutions
- Training and Certification programs
- Research & Development centers

PARTNERSHIPS: Dassault Systems, AWS, Gram Tarang, Centurion University

Be friendly, professional, and helpful. For detailed consultations or pricing, direct users to contact through the official contact page.`;

interface ChatRequest {
  message: string;
  language?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, language = 'en' } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let systemPrompt = SYSTEM_PROMPT;
    
    if (language !== 'en') {
      const languageNames: Record<string, string> = {
        'hi': 'Hindi',
        'te': 'Telugu',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'ja': 'Japanese'
      };
      systemPrompt += `\n\nIMPORTANT: Respond in ${languageNames[language] || language}.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 
      "I can help you with GT Technologies' digital transformation solutions. Please tell me what you're looking for.";

    return NextResponse.json({ message: response });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ 
      message: "I'm having trouble connecting. Please try again or contact us through our contact page."
    }, { status: 500 });
  }
}