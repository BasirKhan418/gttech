import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const VOICE_SYSTEM_PROMPT = `You are a helpful voice assistant for GT Technologies, a leading company in digital transformation solutions. 

IMPORTANT: Keep responses concise and conversational (15-25 seconds of speech).

GT TECHNOLOGIES SERVICES:
- Industry 4.0 & Smart Manufacturing
- AR/VR Solutions & Digital Twins  
- AI/ML Implementation
- Robotics & Automation
- IoT Integration
- 3D Printing & Prototyping
- Electric Vehicles
- Engineering solutions
- Training and Certification programs

Be enthusiastic and friendly. For questions outside GT Tech scope, politely redirect to contact page.`;

interface VoiceChatResponse {
  success: boolean;
  transcription?: string;
  response?: string;
  audio?: string;
  language?: string;
  error?: string;
  processingTime?: number;
}

type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export async function POST(request: NextRequest): Promise<NextResponse<VoiceChatResponse>> {
  const startTime = Date.now();
  
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' }, 
        { status: 500 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const language = (formData.get('language') as string) || 'en';
    const voice = (formData.get('voice') as TTSVoice) || 'alloy';

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'Audio file required' }, 
        { status: 400 }
      );
    }

    // Validate audio file
    if (audioFile.size < 500) {
      return NextResponse.json(
        { success: false, error: 'Audio file too short' }, 
        { status: 400 }
      );
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Audio file too large (max 25MB)' }, 
        { status: 400 }
      );
    }

    // Transcription
    let transcription: string;
    try {
      const transcriptionResponse = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: language === 'en' ? undefined : language,
        response_format: 'text',
      });

      transcription = typeof transcriptionResponse === 'string' 
        ? transcriptionResponse.trim() 
        : String(transcriptionResponse).trim();
      
      if (!transcription) {
        return NextResponse.json(
          { success: false, error: 'Could not understand audio' }, 
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Transcription failed:', error);
      return NextResponse.json(
        { success: false, error: 'Audio processing failed' }, 
        { status: 500 }
      );
    }

    // Generate Response
    let responseText: string;
    try {
      let systemPrompt = VOICE_SYSTEM_PROMPT;
      if (language !== 'en') {
        const languageNames: Record<string, string> = {
          'hi': 'Hindi',
          'te': 'Telugu',
          'es': 'Spanish',
          'fr': 'French',
          'de': 'German',
          'ja': 'Japanese'
        };
        systemPrompt += `\n\nRespond in ${languageNames[language] || language}.`;
      }
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: transcription }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      responseText = completion.choices[0]?.message?.content?.trim() || '';
      
      if (!responseText) {
        responseText = "I can help you with GT Technologies' digital transformation solutions. Please tell me what you're looking for.";
      }
    } catch (error) {
      console.error('Response generation failed:', error);
      responseText = "I can help you with GT Technologies' digital transformation solutions. Please tell me what you're looking for.";
    }

    // Text-to-Speech
    let audioBase64: string;
    try {
      const speechResponse = await openai.audio.speech.create({
        model: "tts-1", 
        voice: voice,
        input: responseText,
        response_format: "mp3",
        speed: 1.0,
      });

      const audioBuffer = Buffer.from(await speechResponse.arrayBuffer());
      audioBase64 = audioBuffer.toString('base64');
    } catch (error) {
      console.error('TTS failed:', error);
      return NextResponse.json(
        { success: false, error: 'Audio generation failed' }, 
        { status: 500 }
      );
    }

    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      transcription,
      response: responseText,
      audio: audioBase64,
      language,
      processingTime
    });

  } catch (error) {
    console.error('Request failed:', error);
    return NextResponse.json(
      { success: false, error: 'Processing failed' }, 
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    message: 'Voice Chat API is running',
    hasOpenAIKey: !!process.env.OPENAI_API_KEY
  });
}
