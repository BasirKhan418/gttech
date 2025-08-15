import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const VOICE_SYSTEM_PROMPT = `You are a helpful voice assistant for GT Technologies, a leading company in digital transformation solutions. 

IMPORTANT INSTRUCTIONS:
1. Keep responses concise and conversational (20-40 seconds of speech)
2. Be enthusiastic and friendly
3. Focus ONLY on GT Technologies services and solutions
4. For questions outside GT Tech scope, politely redirect to contact page
5. Speak naturally as if having a phone conversation
6. Use the user's language preference

GT TECHNOLOGIES SERVICES:
- Industry 4.0 & Smart Manufacturing
- AR/VR Solutions & Digital Twins  
- AI/ML Implementation
- Robotics & Automation
- IoT Integration
- 3D Printing & Prototyping
- Electric Vehicles (e-rickshaws, commercial vehicles)
- Engineering solutions for Automotive, Railways, Aerospace, Shipbuilding
- Digital Manufacturing solutions
- Training and Certification programs

VOICE RESPONSE GUIDELINES:
- Start with friendly greeting if first interaction
- Keep technical explanations simple
- End with helpful next step or offer to connect with expert
- Be enthusiastic about GT Tech's innovative solutions
- If user asks about pricing or detailed specs, suggest contacting through website

MULTILINGUAL SUPPORT: Respond in the user's preferred language with natural pronunciation.`;

interface VoiceChatResponse {
  success: boolean;
  transcription?: string;
  response?: string;
  audio?: string;
  language?: string;
  error?: string;
  details?: string;
  processingTime?: number;
}

type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

function createErrorResponse(message: string, status: number, details?: string): NextResponse<VoiceChatResponse> {
  console.error(`[${new Date().toISOString()}] API Error [${status}]:`, message, details || '');
  return NextResponse.json(
    { 
      success: false,
      error: message,
      details: process.env.NODE_ENV === 'development' ? details : undefined
    }, 
    { status }
  );
}

function validateAudioFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 25 * 1024 * 1024; // 25MB
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'Audio file too large. Maximum size is 25MB.' };
  }

  if (file.size < 1000) { // Less than 1KB
    return { isValid: false, error: 'Audio file too short or empty.' };
  }

  // Supported formats
  const allowedTypes = [
    'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 
    'audio/ogg', 'audio/flac', 'audio/m4a', 'audio/mp3'
  ];
  
  const baseType = file.type.split(';')[0];
  const isValidType = allowedTypes.includes(file.type) || allowedTypes.includes(baseType);
  
  if (!isValidType) {
    return { 
      isValid: false, 
      error: `Unsupported format: ${file.type}. Use MP3, WAV, WebM, OGG, FLAC, or M4A.` 
    };
  }

  return { isValid: true };
}

export async function POST(request: NextRequest): Promise<NextResponse<VoiceChatResponse>> {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] === Voice Chat Request Started ===`);
  
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return createErrorResponse('Server configuration error', 500, 'OpenAI API key missing');
    }

    // Parse form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (error) {
      return createErrorResponse(
        'Invalid request format', 
        400, 
        error instanceof Error ? error.message : 'FormData parsing failed'
      );
    }

    const audioFile = formData.get('audio') as File | null;
    const language = (formData.get('language') as string) || 'en';
    const voice = (formData.get('voice') as TTSVoice) || 'alloy';
    const sessionId = formData.get('sessionId') as string || 'unknown';

    console.log(`[${sessionId}] Processing request:`, {
      audioSize: audioFile?.size || 0,
      audioType: audioFile?.type || 'none',
      language,
      voice
    });

    // Validate audio file
    if (!audioFile) {
      return createErrorResponse('Audio file required', 400);
    }

    const validation = validateAudioFile(audioFile);
    if (!validation.isValid) {
      return createErrorResponse(validation.error!, 400);
    }

    // Step 1: Transcription
    let transcription: string;
    try {
      console.log(`[${sessionId}] Starting transcription...`);
      
      const transcriptionResponse = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: language === 'en' ? undefined : language,
        response_format: 'text',
        temperature: 0.1, // Lower for more consistent results
        prompt: "GT Technologies, voice assistant, digital transformation" // Context for better accuracy
      });

      transcription = typeof transcriptionResponse === 'string' 
        ? transcriptionResponse.trim() 
        : String(transcriptionResponse).trim();
      
      if (!transcription || transcription.length === 0) {
        return createErrorResponse('Could not understand audio. Please speak clearly.', 400);
      }

      console.log(`[${sessionId}] Transcription: "${transcription.substring(0, 100)}..."`);
      
    } catch (error) {
      console.error(`[${sessionId}] Transcription failed:`, error);
      
      if (error instanceof Error) {
        if (error.message?.includes('invalid_audio')) {
          return createErrorResponse('Invalid audio format. Please try again.', 400);
        }
        if (error.message?.includes('audio_too_short')) {
          return createErrorResponse('Audio too short. Please speak for longer.', 400);
        }
        if (error.message?.includes('quota') || error.message?.includes('rate_limit')) {
          return createErrorResponse('Service temporarily unavailable. Try again in a moment.', 503);
        }
      }
      
      return createErrorResponse('Audio processing failed. Please try again.', 500);
    }

    // Step 2: Generate Response
    let responseText: string;
    try {
      console.log(`[${sessionId}] Generating response...`);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: VOICE_SYSTEM_PROMPT },
          { role: "user", content: transcription }
        ],
        max_tokens: 200, // Shorter responses for voice
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      responseText = completion.choices[0]?.message?.content?.trim() || 
                    'I apologize, but I could not generate a proper response. Please try again.';
      
      console.log(`[${sessionId}] Response: "${responseText.substring(0, 100)}..."`);
      
    } catch (error) {
      console.error(`[${sessionId}] Response generation failed:`, error);
      
      if (error instanceof Error && (error.message?.includes('quota') || error.message?.includes('rate_limit'))) {
        return createErrorResponse('Service temporarily unavailable. Try again in a moment.', 503);
      }
      
      return createErrorResponse('Response generation failed. Please try again.', 500);
    }

    // Step 3: Text-to-Speech
    let audioBase64: string;
    try {
      console.log(`[${sessionId}] Generating speech...`);
      
      const speechResponse = await openai.audio.speech.create({
        model: "tts-1-hd", // Higher quality for better voice experience
        voice: voice,
        input: responseText,
        response_format: "mp3",
        speed: 0.95, // Slightly slower for clarity
      });

      const audioBuffer = Buffer.from(await speechResponse.arrayBuffer());
      audioBase64 = audioBuffer.toString('base64');
      
      console.log(`[${sessionId}] Speech generated: ${Math.round(audioBuffer.length / 1024)}KB`);
      
    } catch (error) {
      console.error(`[${sessionId}] TTS failed:`, error);
      
      if (error instanceof Error && (error.message?.includes('quota') || error.message?.includes('rate_limit'))) {
        return createErrorResponse('Service temporarily unavailable. Try again in a moment.', 503);
      }
      
      return createErrorResponse('Audio generation failed. Please try again.', 500);
    }

    const processingTime = Date.now() - startTime;
    console.log(`[${sessionId}] === Request completed in ${processingTime}ms ===`);

    // Return successful response
    return NextResponse.json({
      success: true,
      transcription,
      response: responseText,
      audio: audioBase64,
      language,
      processingTime
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Voice chat API unexpected error:', error);
    
    const processingTime = Date.now() - startTime;
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message?.includes('quota') || error.message?.includes('rate_limit')) {
        return createErrorResponse('Service temporarily unavailable. Please try again later.', 503);
      }
      
      if (error.message?.includes('timeout') || error.message?.includes('network')) {
        return createErrorResponse('Network timeout. Please check connection and retry.', 408);
      }
    }

    return createErrorResponse('Processing failed. Please try again.', 500, 
      error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      success: false,
      error: 'Method not allowed. Use POST with audio data.',
      supportedMethods: ['POST'],
      timestamp: new Date().toISOString()
    }, 
    { 
      status: 405,
      headers: { 
        'Allow': 'POST',
        'Content-Type': 'application/json'
      }
    }
  );
}

// Optimize for voice processing
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 30; // Reduced for faster responses