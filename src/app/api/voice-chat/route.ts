import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const VOICE_SYSTEM_PROMPT = `You are a helpful voice assistant for GT Technologies, a leading company in digital transformation solutions. 

IMPORTANT INSTRUCTIONS:
1. Keep responses concise and conversational (30-60 seconds of speech)
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

// Type definitions
interface VoiceChatResponse {
  success: boolean;
  transcription?: string;
  response?: string;
  audio?: string;
  language?: string;
  error?: string;
  details?: string;
}

// Available TTS voices
type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

// Error handler utility
function createErrorResponse(message: string, status: number, details?: string): NextResponse<VoiceChatResponse> {
  console.error(`API Error [${status}]:`, message, details ? `Details: ${details}` : '');
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
  const maxSize = 25 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: 'Audio file too large. Maximum size is 25MB.' };
  }

  // Check file type - Whisper supports these formats and codecs
  const allowedTypes = [
    'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 
    'audio/ogg', 'audio/flac', 'audio/m4a', 'audio/mp3',
    'audio/webm;codecs=opus', 'audio/ogg;codecs=opus'
  ];
  
  // Also check base type without codecs
  const baseType = file.type.split(';')[0];
  const isValidType = allowedTypes.includes(file.type) || 
                     ['audio/webm', 'audio/ogg', 'audio/wav', 'audio/mp4', 'audio/mpeg', 'audio/flac', 'audio/m4a'].includes(baseType);
  
  if (!isValidType) {
    return { isValid: false, error: `Unsupported audio format: ${file.type}. Supported formats: MP3, MP4, WAV, WebM, OGG, FLAC, M4A.` };
  }

  // Check minimum file size (should have some content)
  if (file.size < 1000) { // Less than 1KB is probably empty
    return { isValid: false, error: 'Audio file appears to be empty or too short.' };
  }

  return { isValid: true };
}

// Main POST handler
export async function POST(request: NextRequest): Promise<NextResponse<VoiceChatResponse>> {
  console.log('=== Voice Chat API Request Started ===');
  
  try {
    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return createErrorResponse('Server configuration error', 500, 'OpenAI API key not configured');
    }

    console.log('OpenAI API key configured');

    // Parse form data
    let formData: FormData;
    try {
      formData = await request.formData();
      console.log('FormData parsed successfully');
    } catch (error) {
      console.error('Failed to parse form data:', error);
      return createErrorResponse('Invalid request format. Expected multipart/form-data.', 400, error instanceof Error ? error.message : 'FormData parsing failed');
    }

    const audioFile = formData.get('audio') as File | null;
    const language = (formData.get('language') as string) || 'en';
    const voice = (formData.get('voice') as TTSVoice) || 'alloy';

    console.log('Request parameters:', {
      hasAudioFile: !!audioFile,
      audioFileSize: audioFile?.size || 0,
      audioFileType: audioFile?.type || 'unknown',
      language,
      voice
    });

    // Validate required fields
    if (!audioFile) {
      return createErrorResponse('Audio file is required in form data', 400);
    }

    // Validate audio file
    const validation = validateAudioFile(audioFile);
    if (!validation.isValid) {
      return createErrorResponse(validation.error!, 400);
    }

    console.log(`Processing voice chat - Language: ${language}, File: ${audioFile.size} bytes (${audioFile.type})`);

    let transcription: string;
    try {
      console.log('Starting transcription...');
      
      const transcriptionResponse = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: language === 'en' ? undefined : language,
        response_format: 'text',
        temperature: 0.2,
      });

      transcription = typeof transcriptionResponse === 'string' 
        ? transcriptionResponse 
        : String(transcriptionResponse);
      
      console.log('Transcription successful:', transcription?.substring(0, 100) + '...');
    } catch (error) {
      console.error('Transcription error:', error);
      
      // Handle specific OpenAI errors
      if (error instanceof Error) {
        if (error.message?.includes('invalid_audio')) {
          return createErrorResponse('Audio file format is invalid or corrupted. Please try recording again.', 400, error.message);
        }
        if (error.message?.includes('audio_too_short')) {
          return createErrorResponse('Audio recording is too short. Please speak for at least 1 second.', 400, error.message);
        }
        if (error.message?.includes('insufficient_quota')) {
          return createErrorResponse('OpenAI service quota exceeded. Please try again later.', 503, error.message);
        }
      }
      
      return createErrorResponse(
        'Failed to transcribe audio. Please ensure the audio is clear and try again.', 
        400,
        error instanceof Error ? error.message : 'Unknown transcription error'
      );
    }

    // Check if transcription is empty
    if (!transcription || transcription.trim().length === 0) {
      return createErrorResponse(
        'Could not understand the audio. Please speak more clearly and try again.', 
        400
      );
    }

    // Step 2: Generate AI response using GPT
    let responseText: string;
    try {
      console.log('Generating AI response...');
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Using reliable model
        messages: [
          {
            role: "system",
            content: VOICE_SYSTEM_PROMPT
          },
          {
            role: "user",
            content: transcription
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      responseText = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      console.log('AI Response generated:', responseText?.substring(0, 100) + '...');
    } catch (error) {
      console.error('Chat completion error:', error);
      
      // Handle specific OpenAI errors
      if (error instanceof Error) {
        if (error.message?.includes('insufficient_quota')) {
          return createErrorResponse('OpenAI service quota exceeded. Please try again later.', 503, error.message);
        }
        if (error.message?.includes('rate_limit_exceeded')) {
          return createErrorResponse('Too many requests. Please wait a moment and try again.', 429, error.message);
        }
      }
      
      return createErrorResponse(
        'Failed to generate response. Please try again.', 
        500,
        error instanceof Error ? error.message : 'Unknown completion error'
      );
    }

    // Step 3: Convert response to speech using TTS
    let audioBase64: string;
    try {
      console.log('Generating speech audio...');
      
      const speechResponse = await openai.audio.speech.create({
        model: "tts-1", // Using standard model for reliability
        voice: voice,
        input: responseText,
        response_format: "mp3",
        speed: 1.0,
      });

      const audioBuffer = Buffer.from(await speechResponse.arrayBuffer());
      audioBase64 = audioBuffer.toString('base64');
      console.log(`Speech audio generated: ${audioBase64.length} characters (base64), ~${Math.round(audioBuffer.length / 1024)}KB`);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      
      // Handle specific OpenAI errors
      if (error instanceof Error) {
        if (error.message?.includes('insufficient_quota')) {
          return createErrorResponse('OpenAI service quota exceeded. Please try again later.', 503, error.message);
        }
      }
      
      return createErrorResponse(
        'Failed to generate audio response. Please try again.', 
        500,
        error instanceof Error ? error.message : 'Unknown TTS error'
      );
    }

    console.log('=== Voice Chat API Request Completed Successfully ===');

    // Return successful response
    return NextResponse.json({
      success: true,
      transcription: transcription,
      response: responseText,
      audio: audioBase64,
      language: language
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Voice chat API error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message?.includes('insufficient_quota')) {
        return createErrorResponse(
          'OpenAI service quota exceeded. Please try again later.', 
          503,
          error.message
        );
      }
      
      if (error.message?.includes('rate_limit_exceeded')) {
        return createErrorResponse(
          'Too many requests. Please wait a moment and try again.', 
          429,
          error.message
        );
      }

      // Handle network/timeout errors
      if (error.message?.includes('timeout') || error.message?.includes('network')) {
        return createErrorResponse(
          'Network timeout. Please check your connection and try again.', 
          408,
          error.message
        );
      }
    }

    return createErrorResponse(
      'Voice processing failed. Please try again.', 
      500,
      error instanceof Error ? error.message : 'Unknown server error'
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      success: false,
      error: 'Method not allowed. Use POST to upload audio.',
      supportedMethods: ['POST']
    }, 
    { 
      status: 405,
      headers: { 'Allow': 'POST' }
    }
  );
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;