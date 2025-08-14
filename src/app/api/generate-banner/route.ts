import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Create a detailed prompt for banner generation
    const structuredPrompt = `
You are a professional marketing copywriter and banner designer. Based on the following user request, generate banner content in JSON format with these exact fields:

- title: A compelling, attention-grabbing headline (max 60 characters)
- description: Persuasive description that drives action (2-3 sentences, max 200 characters)
- buttonText: Call-to-action text that encourages clicks (max 20 characters)
- buttonLink: Suggested URL path for the button (e.g., "/products", "/signup")
- tags: Array of 3-5 relevant marketing tags
- image: Suggested image description for the banner
- targetAudience: Brief description of who this banner targets
- marketingTips: Brief tips on how to optimize this banner

User request: "${prompt}"

Focus on creating:
- Urgency and value proposition
- Clear call-to-action
- Audience-specific messaging
- SEO-friendly tags
- Conversion-optimized copy

Respond with valid JSON only, no additional text or formatting.

Example format:
{
  "title": "🚀 Transform Your Business with AI - 50% Off Launch Week",
  "description": "Join 10,000+ businesses using our AI platform to boost productivity by 300%. Limited time offer - get started today!",
  "buttonText": "Start Free Trial",
  "buttonLink": "/signup",
  "tags": ["ai", "productivity", "business", "limited-time", "launch"],
  "image": "Modern tech workspace with AI dashboard and happy professionals",
  "targetAudience": "Business owners and entrepreneurs looking to scale with AI",
  "marketingTips": "A/B test different urgency phrases and track conversion rates"
}
`

    // GT Tech system prompt with company information
    const systemPrompt = `You are a professional marketing copywriter and banner designer with expertise in GT Tech's business domain.

COMPANY CONTEXT - GT Tech:
GT Tech is a leader in aesthetic architecture, advanced engineering solutions, and cutting-edge product innovation. The company specializes in timber-based construction, precision concrete foundations, modern structural designs, and industry-leading 3D printing technology—capable of producing custom designs in various sizes, materials, and colors with a user-friendly interface and demonstration options.

Built on three core pillars—innovative product design, Centers of Excellence for skill development, and industry-specific engineering solutions—GT Tech leverages strong academic ties with Centurion University and strategic partnerships with Dassault Systèmes, AWS, and Gram Tarang.

Mission: Make next-gen technologies (AR, robotics, automation, advanced manufacturing) accessible, keeping industries globally competitive. GT Tech bridges academia and industry, partnering with automotive giants and other sectors to train talent, enable prototyping, and drive entrepreneurship.

Key Offerings:
• 3D Printing: In-house printers for design, prototyping, and production, engineered for efficiency and precision.
• Electric Vehicles: E-rickshaws and small commercial vehicles with integrated project management, modular design, and scalable manufacturing.
• Sector Solutions:
  - Automotive: Crash safety structures, interior engineering, system integration, simulation, homologation.
  - Railways: Locomotive component design, dynamic simulations.
  - Shipbuilding: Composite structure design, electrical & piping systems.
  - Aerospace: Full-cycle development, avionics, virtual builds.
  - Construction & Smart Cities: Sustainable infrastructure modeling.
  - Mining: Digital mine planning, scheduling, operations management.
  - Digital Manufacturing: Process optimization, automation, robotics, ergonomics.
• Training & Certification: Tailored programs for students, faculty, unemployed youth, and professionals. Certifications are recognized nationally and globally across leading engineering platforms.
• Services & Implementations: Custom deployment of mining solutions (Geovia), research tools (Biovia), Dassault's digital manufacturing platforms, and project management systems. Support for R&D centers, advanced skill hubs, and start-up incubation.

Culture & Careers: Driven by integrity, unity, and excellence, GT Tech values diversity and innovation. Employees are offered growth opportunities, cross-functional collaboration, and the chance to make industry-wide impact. Actively hiring in engineering, administration, mining, and content development.

INSTRUCTIONS:
1. Always respond with valid JSON format containing banner content.
2. Incorporate GT Tech's expertise and offerings when relevant to the prompt.
3. Focus on creating conversion-optimized marketing copy.
4. Ensure all banner content aligns with GT Tech's values and capabilities.`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: structuredPrompt
        }
      ],
      max_tokens: 800,
      temperature: 0.8,
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let generatedContent
    try {
      generatedContent = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      // Fallback structure if JSON parsing fails
      generatedContent = {
        title: "AI Generated Banner",
        description: "Compelling banner content generated based on your requirements.",
        buttonText: "Learn More",
        buttonLink: "/learn-more",
        tags: ["ai-generated", "promotional"],
        image: "Professional banner design",
        targetAudience: "General audience",
        marketingTips: "Test different variations for better performance"
      }
    }

    // Ensure all required fields are present and properly formatted
    const finalContent = {
      title: generatedContent.title || `Banner: ${prompt.slice(0, 30)}...`,
      description: generatedContent.description || "Generated description based on your prompt.",
      buttonText: generatedContent.buttonText || "Learn More",
      buttonLink: generatedContent.buttonLink || "/learn-more",
      tags: Array.isArray(generatedContent.tags) 
        ? generatedContent.tags 
        : ["generated", "promotional"],
      image: "/placeholder.svg?height=400&width=600",
      targetAudience: generatedContent.targetAudience || "Target audience",
      marketingTips: generatedContent.marketingTips || "Optimize for your specific audience"
    }

    return NextResponse.json(finalContent)

  } catch (error) {
    console.error('Error in generate-banner API:', error)
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key configuration' },
          { status: 401 }
        )
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        )
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please wait a moment and try again.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate banner content. Please try again.' },
      { status: 500 }
    )
  }
}