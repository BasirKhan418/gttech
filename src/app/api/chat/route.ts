import OpenAI from 'openai';
import { NextRequest } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GT Technologies Knowledge Base System Prompt
const SYSTEM_PROMPT = `You are a helpful AI assistant for GT Technologies, a leading company specializing in digital transformation solutions. You must STRICTLY follow these guidelines:

COMPANY INFORMATION:
GT Technologies offers:
- Industry 4.0 & Smart Manufacturing
- AR/VR Solutions & Digital Twins
- AI/ML Implementation
- Robotics & Automation
- IoT Integration
- 3D Printing & Prototyping
- Electric Vehicles (e-rickshaws and small commercial vehicles)
- Engineering solutions for Automotive, Railways, Shipbuilding, Aerospace, Construction, Mining
- Digital Manufacturing solutions
- Training and Certification programs
- Research & Development centers

COMPANY VALUES: Integrity, responsibility, unity, pioneering spirit, and excellence.

PARTNERSHIPS: Dassault Systems, AWS, Gram Tarang, Centurion University

STRICT RESPONSE GUIDELINES:
1. ONLY provide information about GT Technologies and services mentioned in the knowledge base
2. If asked about anything NOT in the knowledge base, respond: "I don't have specific information about that. Please contact us through our contact page for detailed assistance."
3. Be friendly, professional, and multilingual
4. Always encourage users to contact through the contact page for detailed consultations
5. Promote GT Technologies' digital transformation solutions
6. Be enthusiastic about technology and innovation

CONTACT REDIRECTION:
For pricing, detailed consultations, technical specifications, or anything not covered in the knowledge base, always direct users to contact through the official contact page.

MULTILINGUAL SUPPORT:
Respond in the user's preferred language. Support English, Hindi, Telugu, Spanish, French, German, and Japanese.

TONE: Professional yet friendly, enthusiastic about technology, solution-oriented.`;

interface RequestBody {
  message: string;
  language?: string;
  userInfo?: {
    name: string;
    email: string;
  };
}

interface LanguageNames {
  [key: string]: string;
}

interface FallbackResponses {
  [key: string]: string;
}

const languageNames: LanguageNames = {
  'hi': 'Hindi (हिंदी)',
  'te': 'Telugu (తెలుగు)',
  'es': 'Spanish (Español)',
  'fr': 'French (Français)',
  'de': 'German (Deutsch)',
  'ja': 'Japanese (日本語)'
};

const fallbackResponses: FallbackResponses = {
  'en': "I don't have specific information about that. Please contact us through our contact page for detailed assistance with your requirements. Our expert team at GT Technologies will be happy to help you with custom solutions!",
  'hi': "मेरे पास इसके बारे में विशिष्ट जानकारी नहीं है। आपकी आवश्यकताओं के साथ विस्तृत सहायता के लिए कृपया हमारे संपर्क पेज के माध्यम से हमसे संपर्क करें। GT Technologies की हमारी विशेषज्ञ टीम आपको कस्टम समाधान प्रदान करने में खुशी से मदद करेगी!",
  'te': "దీని గురించి నా దగ్గర నిర్దిష్ట సమాచారం లేదు. మీ అవసరాలతో వివరణాత్మక సహాయం కోసం దయచేసి మా సంప్రదింపు పేజీ ద్వారా మాను సంప్రదించండి। GT Technologies వద్ద మా నిపుణుల బృందం మీకు కస్టమ్ పరిష్కారాలతో సహాయం చేయడంలో సంతోషిస్తుంది!",
  'es': "No tengo información específica sobre eso. Por favor contáctanos a través de nuestra página de contacto para obtener asistencia detallada con tus requerimientos. ¡Nuestro equipo experto en GT Technologies estará encantado de ayudarte con soluciones personalizadas!",
  'fr': "Je n'ai pas d'informations spécifiques à ce sujet. Veuillez nous contacter via notre page de contact pour une assistance détaillée avec vos exigences. Notre équipe d'experts chez GT Technologies sera ravie de vous aider avec des solutions personnalisées!",
  'de': "Ich habe keine spezifischen Informationen darüber. Bitte kontaktieren Sie uns über unsere Kontaktseite für detaillierte Unterstützung bei Ihren Anforderungen. Unser Expertenteam bei GT Technologies hilft Ihnen gerne mit maßgeschneiderten Lösungen!",
  'ja': "それについて具体的な情報はありません。要件に関する詳細なサポートについては、お問い合わせページからお問い合わせください。GT Technologiesのエキスパートチームがカスタムソリューションでお手伝いいたします！"
};

const errorResponses: FallbackResponses = {
  'en': "I apologize, but I'm having trouble connecting right now. Please try again or contact us through our contact page for immediate assistance.",
  'hi': "क्षमा करें, मुझे अभी कनेक्शन में समस्या हो रही है। कृपया फिर से कोशिश करें या तुरंत सहायता के लिए हमारे संपर्क पेज से संपर्क करें।",
  'te': "క్షమించండి, నాకు ఇప్పుడు కనెక్షన్‌లో సమస్య ఉంది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా తక్షణ సహాయం కోసం మా సంప్రదింపు పేజీ ద్వారా సంప్రదించండి।",
  'es': "Lo siento, pero estoy teniendo problemas de conexión ahora. Por favor inténtalo de nuevo o contáctanos a través de nuestra página de contacto para asistencia inmediata.",
  'fr': "Je m'excuse, mais j'ai des problèmes de connexion en ce moment. Veuillez réessayer ou nous contacter via notre page de contact pour une assistance immédiate.",
  'de': "Entschuldigung, aber ich habe gerade Verbindungsprobleme. Bitte versuchen Sie es erneut oder kontaktieren Sie uns über unsere Kontaktseite für sofortige Hilfe.",
  'ja': "申し訳ありませんが、現在接続に問題があります。再度お試しいただくか、お問い合わせページから即座にサポートをお求めください。"
};

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { message, language = 'en', userInfo } = body;

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Prepare the conversation context
    let systemPrompt = SYSTEM_PROMPT;
    
    // Add language instruction if not English
    if (language !== 'en') {
      systemPrompt += `\n\nIMPORTANT: Respond in ${languageNames[language] || language}. Maintain the same professional and friendly tone in the target language.`;
    }

    // Add user context if available
    if (userInfo) {
      systemPrompt += `\n\nUser Information: Name: ${userInfo.name}, Email: ${userInfo.email}. Personalize responses when appropriate.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      frequency_penalty: 0.3,
      presence_penalty: 0.3
    });

    let response = completion.choices[0]?.message?.content || '';

    // Fallback response if OpenAI doesn't provide specific information
    if (response.toLowerCase().includes("i don't have") || response.toLowerCase().includes("i don't know")) {
      response = fallbackResponses[language] || fallbackResponses['en'];
    }

    return Response.json({ message: response });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    const language = await request.json().then(body => body.language).catch(() => 'en');
    
    return Response.json({ 
      message: errorResponses[language] || errorResponses['en']
    }, { status: 500 });
  }
}